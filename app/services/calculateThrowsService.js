/**
 * @fileoverview calculateThrowsService.js
 * @description Provides business logic for resolving mechanics and dice rolls within the RPG system (like maluses, extra dice for weapons, wound penalties).
 */
import fs from 'fs';
import path from 'path';

/**
 * @function getThrowsByStats
 * @description Master method calculating the entire dice pool and rule modifications for a character's attempt at an action.
 * Features:
 * - Reads a character's current health limits to apply wound penalties (`blessureModifier`: ranging from -1 for light wounds to -3 for mortal wounds).
 * - Identifies the requested skill (`competence`) and attribute (`caracteristic`) values.
 * - Enforces rarity penalites (`rareteMalus`) (-1 or -2 modifier drop) if a character attempts to use specialized skills they have no points in.
 * - Extracts contextual structural maluses dynamically using the localized `getMalus` function.
 * - Calculates basic roll and reroll configurations via `calculerLancersEtRelances`.
 * - For combat actions (e.g., "cac", "tir"), it checks if an `armeEquipee` string exists on the character, searches for it in `equipment.json`, and parses out bonus damage dice string formats (e.g. `2D6`) mapping them cleanly into an `extraDice` dict.
 * - Returns a configured package ready to be fully resolved.
 * 
 * @param {Object} character - The Prisma Character Entity object containing full stats and states.
 * @param {Number|String} modifier - Floating situational modifier submitted from the Frontend.
 * @param {String} competence - The strict name mapping of the skill used in the action.
 * @param {String} caracteristic - The strict name mapping of the core attribute being leveraged.
 * @param {Boolean} isCollective - Indicates if the action is a collective group action.
 * @returns {Object} `{ totalDice, relances, extraDice }` representing final instructions for random number generation.
 */
export function getThrowsByStats(character, modifier, competence, caracteristic, isCollective = false, maxGroupCompetence = 0) {
    const blessurelegere = character.blessurelegere;
    const blessuregrave = character.blessuregrave;
    const blessuremortelle = character.blessuremortelle;

    const blessureModifier =
        blessuremortelle && blessuremortelle > 0 ? -3 :
            blessuregrave && blessuregrave > 0 ? -2 :
                blessurelegere && blessurelegere > 0 ? -1 : 0;

    const valueCompetence = character[competence] || 0;
    const valueCaracteristic = character[caracteristic] || 0;

    let rareteMalus = 0;
    if (valueCompetence === 0) {
        const rare1 = ['bouclier', 'animalisme', 'lunes', 'armurerie', 'artisanat', 'mythes', 'pantheons', 'runes'];
        const rare2 = ['mecanisme', 'eclats', 'rituels'];
        if (rare1.includes(competence)) {
            rareteMalus = -1;
        } else if (rare2.includes(competence)) {
            rareteMalus = -2;
        }
    }

    const malus = getMalus(character, competence, caracteristic);

    let exhaustionMalus = 0;
    if (character.effort === 0 && character.sangfroid === 0) {
        exhaustionMalus = -2;
    } else {
        const physiqueManuel = ['puissance', 'resistance', 'precision', 'reflexes'];
        const mentalSocial = ['connaissance', 'perception', 'volonte', 'empathie'];
        
        if (character.effort === 0 && physiqueManuel.includes(caracteristic)) {
            exhaustionMalus = -1;
        } else if (character.sangfroid === 0 && mentalSocial.includes(caracteristic)) {
            exhaustionMalus = -1;
        }
    }

    let groupMoralModifier = 0;
    if (isCollective && character.Groupe) {
        const moral = character.Groupe.reserveDes || 0;
        if (moral === 0) {
            return { error: "Capacités interdites : Le moral du groupe est à 0." };
        }
        if (moral >= 7) {
            groupMoralModifier = 1;
        } else if (moral <= 2) {
            groupMoralModifier = -1;
        }
        const capacites = character.Groupe.capacitesGroupe || "";
        if (capacites.includes("Unité")) {
            groupMoralModifier += 1; // +1D total to collective actions when whole group is present
        }
    }

    var { lancers, relances } = calculerLancersEtRelances(valueCompetence);
    if (isCollective && character.Groupe) {
        const capacites = character.Groupe.capacitesGroupe || "";
        if (capacites.includes("Expertise partagée")) {
            if (maxGroupCompetence > valueCompetence) {
                relances += 1; // share expert skill (+1 réussite ou relance if a member has higher competence)
            }
        }
    }
    const totalDice = Number(modifier) + Number(valueCaracteristic) + Number(lancers) + Number(blessureModifier) + Number(malus) + Number(rareteMalus) + exhaustionMalus + groupMoralModifier;
    let extraDice = {};
    const weaponComps = ["cac", "melee", "lancer", "tir"];
    
    // Add logic to throw weapon extra damages if a weapon is equipped and the throw is combat-related
    if (weaponComps.includes(competence) && character.armeEquipee) {
        try {
            const equipmentPath = path.join(process.cwd(), "data", "equipment.json");
            const eqData = JSON.parse(fs.readFileSync(equipmentPath, "utf8"));
            const equippedWeapon = eqData.find(e => e.name === character.armeEquipee);
            
            // Certain weapons logic and modifiers are checked here:
            if (equippedWeapon && equippedWeapon.stats) {
                // Extracts eg. "1D6", "2D6", "1D4" from "Dégâts: 1D6 Tranchant (T)"
                const match = equippedWeapon.stats.match(/(\d+)D(\d+)/i);
                if (match) {
                    const numDice = parseInt(match[1]);
                    const diceType = `d${match[2]}`;
                    extraDice[diceType] = numDice;
                }
            }
        } catch (e) {
            console.error("Error reading equipment in calculateThrowsService", e);
        }
    }

    // Check if the armor is too heavy, maybe it gives negative modifier on "reflexes" or "discretion" (though here we just pass them naturally or leave that up to DM, typically armor malus applies to physical stats). Let's implement standard if needed. But mainly we just provide the damage dice.
    
    return { totalDice, relances, extraDice };
}


/**
 * @function calculerLancersEtRelances
 * @description Extracts total discrete mechanics allowed (number of dice logic `lancers` & maximum rerolls logic `relances`) tied functionally to skill ranks.
 * Features:
 * - Reads a mapped `entier` value representing a character's rank in a competence.
 * - Progressively returns ascending power ranges (e.g. rank 1 gives 1 die/0 rerolls, rank 6 gives 3 dice/3 rerolls).
 * - Implemented fundamentally via switch case logic against predefined boundaries.
 * 
 * @param {Number} entier - An integer reflecting current raw rank of `valueCompetence` calculated in `getThrowsByStats()`.
 * @returns {Object} Container mapped to `{ lancers, relances }`.
 */
function calculerLancersEtRelances(entier) {
    let lancers = 0;
    let relances = 0;

    switch (entier) {
        case 1:
            lancers = 1;
            relances = 0;
            break;
        case 2:
            lancers = 1;
            relances = 1;
            break;
        case 3:
            lancers = 2;
            relances = 1;
            break;
        case 4:
            lancers = 2;
            relances = 2;
            break;
        case 5:
            lancers = 3;
            relances = 2;
            break;
        case 6:
            lancers = 3;
            relances = 3;
            break;
        default:
            break;
    }

    return { lancers, relances }
}

/**
 * @function getMalus
 * @description Extracts and accumulates circumstantial system-enforced penalites depending purely upon which attribute and skill combination is tested.
 * Features:
 * - Scopes `caracteristique` grouping into domains (`malusphysique` vs `malusmental`).
 * - Extracts `competence` domain mapping penalites (`malusoutils`, `malusanimal`, `malusterres`).
 * - Grabs the assigned malus levels dynamically from the Prisma character record using those strings as keys (e.g. `character['malusphysique']`).
 * - Adds both values up and forwards the combined numerical malus integer.
 * 
 * @param {Object} character - Target RPG Entity containing relational maluses.
 * @param {String} competence - System skill name attempting the roll.
 * @param {String} caracteristique - Associated core attribute checking the roll.
 * @returns {Number|String} Compiled malus value.
 * 
 * Wait for obsolete code confirmation: `// Malus not found for caracteristic` happens silently passing `malusCaracteristique` as an empty string, making `malus = character[""]` which becomes `undefined`. Then, `.character[malusCompetence]` is added to it resulting in `NaN`, cascading into `totalDice = NaN` throughout the server logic, causing massive math bugs down the line to a user.
 */
function getMalus(character, competence, caracteristique) {
    // Initialisation de la variable qui va contenir le malus
    let malus = 0;

    let malusCaracteristique = "";

    // Associer les compétences aux malus correspondants
    switch (caracteristique) {
        case 'puissance':
        case 'resistance':
            malusCaracteristique = 'malusphysique';
            break;
        case 'precision':
        case 'reflexes':
            malusCaracteristique = 'malusmanuel';
            break;
        case 'connaissance':
        case 'perception':
            malusCaracteristique = 'malusmental';
            break;
        case 'volonte':
        case 'empathie':
            malusCaracteristique = 'malussocial';
            break;
        default:
            // Malus not found for caracteristic
            break;
    }

    malus = character[malusCaracteristique];
    let malusCompetence = 0;

    switch (competence) {
        case 'arts':
        case 'cite':
        case 'civilisations':
        case 'relationnel':
        case 'soins':
            malusCompetence = 'malushumain';
            break;
        case 'animalisme':
        case 'faune':
        case 'montures':
        case 'pistage':
        case 'territoire':
            malusCompetence = 'malusanimal';
            break;
        case 'adresse':
        case 'armurerie':
        case 'artisanat':
        case 'mecanisme':
        case 'runes':
            malusCompetence = 'malusoutils';
            break;
        case 'bouclier':
        case 'cac':
        case 'lancer':
        case 'melee':
        case 'tir':
            malusCompetence = 'malusarme';
            break;
        case 'athletisme':
        case 'discretion':
        case 'flore':
        case 'vigilance':
        case 'voyage':
            malusCompetence = 'malusterres';
            break;
        case 'eclats':
        case 'lunes':
        case 'mythes':
        case 'pantheons':
        case 'rituels':
            malusCompetence = 'malusinconnu';
            break;
        default:
            // Malus not found for competence
            return "ERROR";
    }

    malus = malus + character[malusCompetence];

    return malus;
}