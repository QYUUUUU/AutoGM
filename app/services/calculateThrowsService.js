import fs from 'fs';
import path from 'path';

export function getThrowsByStats(character, modifier, competence, caracteristic) {
    const blessurelegere = character.blessurelegere;
    const blessuregrave = character.blessuregrave;
    const blessuremortelle = character.blessuremortelle;

    const blessureModifier =
        blessuremortelle && blessuremortelle > 0 ? -3 :
            blessuregrave && blessuregrave > 0 ? -2 :
                blessurelegere && blessurelegere > 0 ? -1 : 0;

    const valueCompetence = character[competence] || 0;
    const valueCaracteristic = character[caracteristic] || 0;

    const malus = getMalus(character, competence, caracteristic);

    var { lancers, relances } = calculerLancersEtRelances(valueCompetence);
    const totalDice = Number(modifier) + Number(valueCaracteristic) + Number(lancers) + Number(blessureModifier) + Number(malus);

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
    
    console.log(totalDice, relances, extraDice);
    return { totalDice, relances, extraDice };
}


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
            console.log("Malus not found for caracteristic: " + caracteristique)
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
        case 'lance':
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
        case 'eclat':
        case 'lunes':
        case 'mythes':
        case 'pantheons':
        case 'rituels':
            malusCompetence = 'malusinconnu';
            break;
        default:
            console.log("Malus not found for competence: " + competence)
            return "ERROR";
    }

    malus = malus + character[malusCompetence];

    return malus;
}