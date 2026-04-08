const fs = require('fs');

let template = fs.readFileSync('app/views/eclats.html.twig', 'utf8');

const faveursObj = {
  "Faveurs de la Mort": {
    "Décret de mort (Accord)": "L’Élu peut pointer du doigt une personne qu’il voit dans un rayon de [Volonté de l’Élu x 5] mètres et la condamner à mort. S’il possède la compétence Occultisme au niveau Apprenti (ou dépense 1D d’Humanité), il lance 1d10 + Volonté + Occultisme en opposition avec la cible sur le tableau des Séquelles. Le nombre de réussites indique le nombre de blessures infligées (1 = Légère, 3 = Grave).",
    "Emprise de la mort (Rencontre)": "Un nombre de fois par jour égal à sa Volonté, l’Élu peut tenter de soumettre une créature morte-vivante qu’il voit (jet Volonté + Relationnel Difficile 7). S'il réussit, le cadavre animé passe sous son contrôle permanent.",
    "Flétrissement (Entente)": "Une fois par jour, l’Élu peut flétrir tous les végétaux dans un rayon de [Volonté x 10] mètres autour de lui. S’il a atteint l’Accord et que sa Jauge de Divinité est pleine, la terre elle-même sera stérile durant 1d10 ans.",
    "In carcerem (Accord)": "L’Élu peut emprisonner l’âme d’une personne qu’il vient de tuer personnellement dans l’un de ses yeux ou dans le propre corps de la victime. L'âme souffre atrocement et sera détruite au bout de 1d10 jours. L'élu bénéficie d'une compétence de la victime au niveau Confirmé. Utilisable [Volonté] fois/jour.",
    "Infertilité (Rencontre)": "Une fois par jour, l’Élu peut toucher une personne qui deviendra définitivement infertile. Sur un Élu, requiert l'Accord, Jauge Divinité pleine, et un jet opposé (Difficile 7, coûte 1D Humanité).",
    "Nécrognosie (Entente)": "En mangeant un morceau de chair de cadavre, l’Élu a accès à toutes les spécialisations du défunt durant [Volonté] heures (+1D bonus), voire une compétence au niveau Confirmé s'il a 5D en Divinité. 1 fois/jour.",
    "Putréfaction (Entente)": "Une fois par jour, au toucher (jet d'attaque), l'Élu inflige une terrible maladie de Virulence 8. La cible subit chaque jour deux Blessures Légères tant que non guérie.",
    "Sceau de la non-mort (Accord)": "L’Élu dépense 1D d’Humanité et marque un être vivant du sceau de la non-mort. S'il meurt, son âme est emprisonnée dans son corps et il continue à se mouvoir durant 10 jours (ou indéfiniment si Divinité pleine).",
    "Thanatomnésie (Rencontre)": "Un nombre de fois par jour égal à sa Connaissance, l’Élu peut choisir n’importe quelle compétence qu'il possède alors au niveau Expert le temps d’un seul et unique jet."
  },
  "Faveurs du Soleil (Mineures)": {
    "Déjà-vu (Rencontre)": "Une fois par jour, l’Élu peut annuler un jet et le refaire (sauf si capacité d'Éclat, rituel ou Divinité utilisés).",
    "L’œil exercé (Rencontre)": "L’Élu gagne un bonus de +1D sur ses jets de Perception.",
    "Nature véritable (Rencontre)": "L’Élu reconnaît automatiquement les contrefaçons (objets ou documents).",
    "Nul n’échappe à ses rayons (Entente)": "Une fois par jour, l’Élu sait quand une personne connue a été touchée par le soleil pour la dernière fois, sa direction et sa distance (difficulté variable selon la météo).",
    "Salutation au soleil (Entente)": "Une fois par jour, en méditant 10 min devant le lever du soleil, l’Élu regagne 1D de Divinité."
  },
  "Faveurs du Soleil (Majeures)": {
    "Aura éclatante (Accord)": "Une fois par jour, l’Élu brille (1 heure, [Volonté x 5] m). Malus de -2D aux créatures de la nuit attaquant l'Élu (ou subissent Blessures Légères si Divinité>=5D). Annule toute dissimulation.",
    "Aura impérieuse (Rencontre)": "Une fois par jour, durant [Volonté] tours. Inflige un malus de -1D aux assaillants. +1D sur les jets de Volonté de l'Élu.",
    "Il guide ma main (Accord)": "De jour, l’Élu remporte toutes les égalités d'esquive/parade contre lui. Si l'ennemi ne peut parer/esquiver, +1 dommage.",
    "Sincérité (Entente)": "Il est impossible de mentir ouvertement à l’Élu (mensonge par omission reste possible). L'Élu l'active et désactive à volonté.",
    "Sous sa protection (Accord)": "De jour, dépensez 1D d'Humanité pour ignorer une Blessure Grave reçue (+2D/supplémentaire). Utilisable 1 fois par tour.",
    "Sous son jugement (Accord)": "Comme Sincérité, mais un mensonge par omission inflige une Blessure Légère. Les menteurs surnaturels doivent réussir un jet Très Difficile (9) avec Handicap (I) ou subir la blessure.",
    "Souveraineté (Entente)": "(Prérequis : Aura impérieuse) +2D aux jets pour résister aux effets négatifs (manipulation/mensonge). Immunité peur/contrôle mental, vision totale dans le noir. Dure 10 min, 1/jour."
  },
  "Faveurs de la Terre (Mineures)": {
    "Aplomb (Entente)": "La Réserve de Sang-Froid augmente de +2D de façon permanente.",
    "Endurance de la Terre (Rencontre)": "L’Élu gagne un cercle de Blessure Légère supplémentaire.",
    "Impassibilité (Rencontre)": "Une fois par jour, l’Élu peut régénérer 2D dans sa Réserve de Sang-Froid.",
    "Résilience de la pierre (Entente)": "Le seuil de Blessures Légères de l’Élu augmente de 1.",
    "Sens de la terre (Rencontre)": "En dépensant 1D Sang-Froid, ressentez minéraux/métaux identiques dans une zone en réussissant un jet (Perception + Artisanat). Quantité et direction estimables."
  },
  "Faveurs de la Terre (Majeures)": {
    "Chair de granite (Accord)": "La peau possède un indice de protection 2 (ne se cumule pas aux armures). L'Élu peut dépenser 1D Humanité (IP 3) ou 1D Humanité+Divinité (IP 4).",
    "Emprunter à la terre (Rencontre)": "Une fois par jour, en contact avec le sol, passez 1 tour immobile pour rétrograder une Blessure (Légère, Grave à l'Accord, Mortelle si Divinité pleine).",
    "Éperon rocheux (Accord)": "([Volonté / 2] fois/j) Fait jaillir un pic sous un adversaire dans [Puissance x 2] m. Très difficile à esquiver (9). 9 dgts perforants. 1D Humanité pour 2ème cible.",
    "Façonner la pierre (Entente)": "L’Élu peut façonner la pierre brute comme de la glaise (+1D Artisanat sculpture). Possibilité de créer des armes de pierre.",
    "Immobilité de la pierre (Accord)": "1 fois/j. Transformé en pierre pdnt 1h max. Insensible au feu/poison/noyade/mort lente, incapable de bouger. Résistance pure = Volonté."
  },
  "Faveurs de la Vie (Mineures)": {
    "Adepte de la Vie (Rencontre)": "L’Élu gagne un bonus de +1D sur ses jets de Faune et de Flore.",
    "Diagnostique (Rencontre)": "Connaissance médicale exacte au toucher (blessures, seuils, poisons... ou grossesse).",
    "Égratignure (Rencontre)": "1 fois/jour, dépensez des dés d'Effort plutôt que subir la blessure (2D Effort = Légère. 4D Effort = Grave (Entente), 6D Effort = Mortelle (Accord)).",
    "Régénération volontaire (Entente)": "Guerison de plusieurs blessures après un repos long possible (via Effort/Sang-Froid). Autorise la repousse d'organes/membres amputés au fil des heures.",
    "Soin du corps et de l’esprit (Entente)": "Gagnez +1D Effort supp (ou +2D si Accord) en réussissant un jet de soin restaurant de l'Effort.",
    "Stabilisation (Rencontre)": "Soin d'urgence automatique en dépensant 1D d'Humanité.",
    "Toucher guérisseur (Rencontre)": "+1D bonus aux soins (+ relance si Entente, -1 difficulté si Accord)."
  },
  "Faveurs de la Vie (Majeures)": {
    "Anesthésie (Accord)": "1 fois/j. Ignorer malus de blessures (Nb tours = Volonté). Empêche sombrer inconscient pour Blessure Mortelle si 1 case libre.",
    "Bannir la blessure (Accord)": "1 fois/j, guérissez au toucher (pas soi-même) : Légère (gratuit), Grave (1D Humanité), Mortelle (si Divinité>=5D + 1D Humanité).",
    "Cercle de grâce (Accord)": "1 fois/j, 1D Humanité. Cercle sol 5m pdnt 4h : ceux à l'intérieur ne subissent aucun dommage des combats y ayant lieu.",
    "Fertilité (Entente)": "Au toucher (+ 1D Humanité), restaure la fertilité ou refait fleurir un champ dans [Volonté x 10] m.",
    "Immunité (Entente)": "Immunité totale aux poisons, venins, maladies et infections (non magiques).",
    "Pérennité (Accord)": "Cesse de vieillir (ou retrouve apparence jeune).",
    "Régénération d’autrui (Entente)": "Toucher pour repousser un membre/organe (1D Humanité + réusite Difficile 7). Prend qq jours.",
    "Rejet de la mort (Rencontre)": "1D Humanité pour se stabiliser automatiquement (même inconscient).",
    "Sacrifice (Accord)": "Explosion de vie ! Ressuscite tous les êtres récents dans [Volonté x 25] m. La vie et l'Éclat de l'Élu sont détruits à jamais.",
    "Toucher neutralisant (Entente)": "Élimine 2 pts Virgulence pour chaque réussite en jet de soin (+3 si Accord + Divinité>=5D).",
    "Végétalisation (Accord)": "1 fois/jour (1 dgt Léger + 1D Humanité) fait pousser des plantes en 1 mn dans [Volonté x 5] m."
  }
};

const jsCode = `

    const FAVEURS_LIVRE = ${JSON.stringify(faveursObj, null, 4)};

    function populateFaveursDropdown() {
        const select = document.getElementById('faveursSelectInput');
        if(!select) return;
        select.innerHTML = '<option value="">-- Révéler une Faveur du Domaine --</option>';
        for (const [domaine, faveurs] of Object.entries(FAVEURS_LIVRE)) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = domaine;
            for (const name in faveurs) {
                const opt = document.createElement('option');
                opt.value = name;
                opt.textContent = name;
                optgroup.appendChild(opt);
            }
            select.appendChild(optgroup);
        }
    }
    
    function showFaveurDesc() {
        const select = document.getElementById('faveursSelectInput');
        const descDiv = document.getElementById('faveurDescDisplay');
        const val = select.value;
        
        if(!val) {
            descDiv.style.display = 'none';
            document.getElementById('addSelectedFaveurBtn').style.display = 'none';
            return;
        }
        
        for (const domaine in FAVEURS_LIVRE) {
            if(FAVEURS_LIVRE[domaine][val]) {
                descDiv.style.display = 'block';
                descDiv.innerHTML = '<strong>' + val + '</strong><br>' + FAVEURS_LIVRE[domaine][val];
                document.getElementById('addSelectedFaveurBtn').style.display = 'inline-block';
                return;
            }
        }
    }
`;

if (!template.includes('FAVEURS_LIVRE = {')) {
    template = template.replace('const ECLAT_CAPACITES = {', jsCode + '\n    const ECLAT_CAPACITES = {');
}

if (!template.includes('populateFaveursDropdown();')) {
    template = template.replace(
        /document\.addEventListener\('DOMContentLoaded',\s*function\(\)\s*\{/g,
        "document.addEventListener('DOMContentLoaded', function() {\n        populateFaveursDropdown();"
    );
}

fs.writeFileSync('app/views/eclats.html.twig', template);
console.log('eclats.html.twig updated with FAVEURS_LIVRE JS functions');
