async function creerGroupe(charId) {
    const nom = document.getElementById('new-group-name').value;
    const instinctGrpSelect = document.getElementById('new-group-instinct');
    const instinctGroupe = instinctGrpSelect.options[instinctGrpSelect.selectedIndex].text;
    const capacitesInstinctGroupe = document.getElementById('groupInstinctStats').innerText;
    
    if(!nom) return alert("Le nom est requis.");
    
    try {
        const response = await fetch('/Groupe', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                nom,
                niveau: 1,
                reserveDes: 0,
                reputation: "1",
                instinctGroupe,
                capacitesGroupe: "",
                capacitesInstinctGroupe: capacitesInstinctGroupe
            })
        });
        const grp = await response.json();
        
        // Auto-join the group just created
        await fetch(`/Character/${charId}/joinGroupe/${grp.id}`, {
            method: 'POST'
        });
        location.reload();
    } catch(e) {
        alert("Erreur: " + e.message);
    }
}

async function rejoindreGroupe(charId) {
    const sel = document.getElementById('group-select');
    const grpId = sel.options[sel.selectedIndex].value;
    if(!grpId) return alert("Aucun groupe sélectionné.");
    
    try {
        await fetch(`/Character/${charId}/joinGroupe/${grpId}`, {
            method: 'POST'
        });
        location.reload();
    } catch(e) {
        alert("Erreur: " + e.message);
    }
}

async function quitterGroupe(charId) {
    if(!confirm("Êtes-vous sûr de vouloir quitter le groupe ?")) return;
    try {
        await fetch(`/Character/${charId}/leaveGroupe`, {
            method: 'POST'
        });
        location.reload();
    } catch(e) {
        alert("Erreur: " + e.message);
    }
}

// Global variable to keep track of current reserve
let currentReserve = -1;

async function fetchStatsGroupe(grpId) {
    // There is no route to purely fetch one group's stats yet, wait I can just update the reserve using a PUT /Groupe/:id
    // since I have the initial reserve in Twig. 
}

async function ajouterDesGroupe(grpId, niveau) {
    const maxDice = niveau === 1 ? 12 : (niveau === 2 ? 14 : 16);
    let elem = document.getElementById('groupe-dice-display');
    let text = elem.innerText;
    let parts = text.match(/Dés: (\d+) \//);
    if(parts && parts[1]) {
        let current = parseInt(parts[1]);
        if(current >= maxDice) return alert("La réserve est au maximum !");
        
        current++;
        try {
            await fetch(`/Groupe/${grpId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ reserveDes: current })
            });
            elem.innerText = `Dés: ${current} / ${maxDice}`;
        } catch(e) {
             alert("Erreur de MAJ: " + e.message);
        }
    }
}

async function depenserDesGroupe(grpId) {
    let elem = document.getElementById('groupe-dice-display');
    let text = elem.innerText;
    let parts = text.match(/Dés: (\d+) \//);
    let maxMatch = text.match(/\/ (\d+)/);
    
    if(parts && parts[1]) {
        let current = parseInt(parts[1]);
        let max = maxMatch ? maxMatch[1] : 12;
        if(current <= 0) return alert("La réserve est vide !");
        
        
        current--;
        try {
            await fetch(`/Groupe/${grpId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ reserveDes: current })
            });
            elem.innerText = `Dés: ${current} / ${max}`;
        } catch(e) {
             alert("Erreur de MAJ: " + e.message);
        }
    }
}

window.creerGroupe = creerGroupe;
window.rejoindreGroupe = rejoindreGroupe;
window.quitterGroupe = quitterGroupe;
window.ajouterDesGroupe = ajouterDesGroupe;
window.depenserDesGroupe = depenserDesGroupe;

// Dictionaire des Instincts de Groupe (Différents des personnages)
const groupInstinctDescriptions = {
    architecte: {
        title: "L’Architecte",
        text: "De tels Groupes viennent en aide aux communautés et luttent contre le chaos. Si les civilisations ne s’effondrent pas, c’est en partie grâce à eux. En contrepartie, ils imposent leurs vues et rejettent en bloc ceux qui ne pensent pas comme eux, recourant parfois à des méthodes que l’on pourrait qualifier de despotiques.",
        stats: "Don de l’Architecte : une fois par jour, chaque membre du Groupe peut dépenser 1D de chacune de ses Réserves pour octroyer une réussite automatique à un autre membre du Groupe sur un jet de compétence relatif aux domaines de l’Homme ou de l’Outil (cette réussite peut être octroyée après le jet de dés). Cette capacité ne peut être utilisée qu’une seule fois sur un même membre et une même action, et les deux personnages impliqués doivent être en mesure de se parler, de se voir ou de se toucher. Les éventuels malus et effets techniques liés aux valeurs de Réserves s’appliquent immédiatement.",
        exemples: "bâtisseurs, ambassadeurs, politiciens, artisans.",
        principes: "aider à construire ou préserver une communauté*, établir un plan d’action qui se révèle efficace par la suite, nouer des liens avec une nouvelle communauté, diriger avec succès un large groupe de personnes dans un objectif commun, construire ou reconstruire quelque chose d’important pour une communauté.",
        interdits: "participer à la destruction d’une communauté*, générer le chaos au sein d’une communauté ou du Groupe, agir sans plan d’action pour le Groupe (si les conséquences en sont catastrophiques, la perte est de 4D dans la Réserve de Groupe)."
    },
    epee: {
        title: "L’Épée",
        text: "Un Groupe de l’Épée est motivé par le combat et louera souvent ses talents, pas forcément au plus offrant, mais surtout à celui ou celle qui pourra lui promettre les plus grands défis et lui apporter le plus de gloire.",
        stats: "Exhortation : une fois par jour, chaque membre du Groupe peut dépenser 1D de chacune de ses Réserves pour annuler, durant une action, le malus de dés dû aux Blessures d’un autre membre du Groupe. Cette capacité ne peut être utilisée qu’une seule fois sur un même membre et une même action, et les deux personnages impliqués doivent être en mesure de se parler, de se voir ou de se toucher. Les éventuels malus et effets techniques liés aux valeurs de Réserves s’appliquent immédiatement.",
        exemples: "mercenaires, conseillers tactiques, instructeurs martiaux.",
        principes: "relever de grands défis avec succès*, obtenir une large victoire de Groupe, respecter un code d’honneur commun (à définir) même lorsque cela a un coût élevé*, affronter un ennemi supérieur en nombre ou en puissance.",
        interdits: "fuir un combat*, trahir le code d’honneur du Groupe*, refuser un défi lancé au groupe, échouer, abandonner."
    },
    fleau: {
        title: "Le Fléau",
        text: "Un tel Groupe n’existe que pour semer le chaos et prendre tout ce qu’il désire. Ses membres ne se livreront pas systématiquement au pillage et à la destruction, mais ces activités les motivent particulièrement et ils sont souvent bien en mal de s’en passer.",
        stats: "Avantage du nombre : une fois par jour, lorsqu’un membre du Groupe réussit une attaque au contact contre un adversaire, il peut dépenser 1D de chacune de ses Réserves pour accorder une attaque supplémentaire (et seulement une attaque) avec une difficulté fixe de 7 à un autre membre du Groupe également engagé au contact contre le même adversaire. Si cette attaque touche, elle inflige 1 dommage supplémentaire. Cette capacité ne peut être utilisée qu’une seule fois dans un même tour contre un même adversaire, et les deux personnages impliqués doivent être en mesure de se parler, de se voir ou de se toucher. Les éventuels malus et effets techniques liés aux valeurs de Réserves s’appliquent immédiatement. Cette capacité bénéficie du bonus s’appliquant sur les actions collectives puisque les deux membres du Groupe attaquent la même cible durant ce tour.",
        exemples: "brigands, soudards, saboteurs, experts en poliorcétique, exécuteurs des basses œuvres.",
        principes: "se livrer au pillage, détruire une communauté ennemie ou hostile*, triompher en Groupe face à des adversaires plus nombreux.",
        interdits: "épargner ses ennemis, accumuler des biens et provisions, planifier les choses à long terme, se livrer à des négociations*, ne pas se livrer au pillage et assouvir sa soif de violence régulièrement*."
    },
    gardien: {
        title: "Le Gardien",
        text: "Les Groupes associés au Gardien protègent les communautés et les plus faibles, mettent à bas les tyrans et font bien comprendre leur déplaisir aux esclavagistes et autres exploiteurs. Malheureusement, par leur méthode et la conviction qu’ils y investissent, ils peuvent parfois se montrer très autoritaires si l’on ne suit pas leurs directives à la lettre.",
        stats: "Conseil tactique : une fois par jour, chaque membre du Groupe peut dépenser 1D de chacune de ses Réserves pour accorder une relance sur une action de défense à un autre membre du Groupe. Si l’action de défense est réussie et qu’il s’agit d’une parade (et non d’une esquive), le défenseur n’a besoin que d’une réussite excédentaire sur son adversaire (plutôt que de deux) pour bénéficier d’une contre-attaque (cf. page XXX). Cette capacité ne peut être utilisée qu’une seule fois sur une même action de défense, et les deux personnages impliqués doivent être en mesure de se parler, de se voir ou de se toucher. Les éventuels malus et effets techniques liés aux valeurs de Réserves s’appliquent immédiatement.",
        exemples: "gardes du corps, experts en défense, conseillers militaires, dirigeants.",
        principes: "risquer la survie du Groupe pour protéger une communauté*, guider une communauté sur la « bonne » voie, faire passer l’intérêt collectif avant tout*.",
        interdits: "mettre une communauté (alliée ou neutre) en danger*, refuser d’accorder la protection du Groupe, massacrer gratuitement*, trahir une parole donnée par le Groupe (même si tout le monde n’est pas d’accord)."
    },
    homme: {
        title: "L’Homme",
        text: "Un tel Groupe apporte connaissance et illumination aux hommes, leur permettant de s’élever. Ils brisent les chaînes du passé pour préparer l’avenir, et si ce dernier doit se faire avec les dieux, alors ce ne sera pas au détriment des mortels. Pour ces Groupes, le plus grand crime est de priver un homme de sa liberté et de son libre arbitre.",
        stats: "Il n’est de situation désespérée : une fois par jour, chaque membre du Groupe peut dépenser 1D de chacune de ses Réserves pour accorder un bonus de +2D sur le jet d’un autre membre du Groupe se trouvant en grave difficulté (à la discrétion de l’Oracle). Si le jet est réussi, la Réserve de Groupe augmente de 1D. Cette capacité ne peut être utilisée qu’une seule fois sur un même membre et une même action, et les deux personnages impliqués doivent être en mesure de se parler, de se voir ou de se toucher. Les éventuels malus et effets techniques liés aux valeurs de Réserves s’appliquent immédiatement.",
        exemples: "médiateurs, soigneurs, savants, musiciens, artistes, libérateurs, enseignants.",
        principes: "œuvrer pour la survie du Groupe, œuvrer pour la survie d’une communauté*, soutenir l’Homme et la science au détriment des dieux*, faire collectivement preuve d’une grande générosité ou démontrer une sincère compassion.",
        interdits: "faire preuve de cruauté, tuer sans nécessité absolue, favoriser l’obscurantisme*, ne pas empêcher la destruction d’une communauté ou sa mise en esclavage*."
    },
    main: {
        title: "La Main",
        text: "Un Groupe de la Main ne vit que pour le frisson de la transgression et l’accumulation de richesses. Il aime vivre dans l’opulence et préparer son prochain « coup », ne dédaignant pas quelques contrats d’assassinat si la cible est particulièrement difficile à atteindre. Leur existence est entièrement dédiée à leur art.",
        stats: "Diversion : une fois par jour, chaque membre du Groupe peut dépenser 1D de chacune de ses Réserves pour accorder le trait Rapide (2) à l’arme d’un autre membre du Groupe sur une action d’attaque « surprise ». La cible, distraite par l’utilisateur de la Diversion et incapable de se défendre, ne doit pas avoir conscience de la présence de l’attaquant (ce qui peut éventuellement impliquer un jet de Volonté + Discrétion opposé à la Perception + Vigilance de la cible pour une attaque au contact) et l’attaquant ne doit pas être engagé en combat. Si la cible subit au moins une Blessure Grave des suites de cette attaque, cette Blessure Grave devient une Blessure Mortelle (une seule Blessure Grave est transformée, même si l’attaque en inflige deux). Cette capacité ne peut être utilisée qu’une seule fois sur une même action d’attaque et une même cible (lors de la même confrontation), et les deux personnages impliqués doivent être en mesure de se parler ou de se voir. Les éventuels malus et effets techniques liés aux valeurs de Réserves s’appliquent immédiatement.",
        exemples: "voleurs, assassins, éminences grises.",
        principes: "trahir et manipuler pour obtenir de grands avantages*, voler des biens de grande valeur*, éliminer rapidement un groupe d’adversaires digne d’eux, mettre au point des pièges élaborés et rencontrer le succès grâce à eux.",
        interdits: "partager les biens et ressources du Groupe avec d’autres, collaborer sans obtenir un gain très substantiel ou sans trahir*, respecter une promesse faite par le Groupe lorsque cela s’accompagne de désagréments, se servir par la force*."
    },
    masque: {
        title: "Le Masque",
        text: "Les Groupes du Masque sont persuadés que le monde recèle de grands mystères. Pour eux, celui qui maîtrisera ces mystères maîtrisera le monde. Qu’il s’agisse de rituels, de vérités oubliées, d’anciens artefacts, de ruines perdues ou des vilains secrets d’un influent personnage, tout cela mérite que l’on s’y intéresse, car tout cela mène à la satisfaction et au pouvoir.",
        stats: "Partage des acquis : une fois par jour, chaque membre du Groupe peut dépenser 1D de chacune de ses Réserves pour accorder une compétence (qu’il possède au moins au niveau Expert) à un autre membre du Groupe (qui bénéficie alors du niveau Confirmé dans cette compétence, même si elle est Rare) jusqu’à la fin du tour. Cette capacité ne peut être utilisée qu’une seule fois sur un même membre et un même tour, et les deux personnages impliqués doivent être en mesure de se parler, de se voir ou de se toucher. Les éventuels malus et effets techniques liés aux valeurs de Réserves s’appliquent immédiatement.",
        exemples: "explorateurs, érudits, espions, maîtres chanteurs, chroniqueurs.",
        principes: "acquérir des connaissances rares, résoudre un grand mystère*, révéler un important secret*, partager des connaissances importantes avec ceux qui en sont dignes.",
        interdits: "détruire des connaissances rares*, refuser de lever le voile sur un mystère ou une énigme, refuser de partager des connaissances avec ceux qui s’en sont montrés dignes*."
    },
    neant: {
        title: "Le Néant",
        text: "Ces Groupes sont rares, très rares. Il est possible qu’ils soient sous l’influence de sombres divinités désirant que tout retourne au néant. Ils ne vivent que pour répandre le chaos et l’ignorance, en retirant au passage une satisfaction certaine. Pour eux, la civilisation est un leurre, l’homme ne mérite pas de s’élever. L’être humain est un ver, et un ver doit ramper. C’est cela sa véritable nature.",
        stats: "L’opposition du Néant : une fois par jour, chaque membre du Groupe peut dépenser 1D de chacune de ses Réserves pour accorder une réussite automatique à un autre membre du Groupe qui fait un jet en opposition (cela fonctionne sur les actions d’attaque et de défense). Cette réussite automatique peut être accordée après les jets des deux opposants. Cette capacité ne peut être utilisée qu’une seule fois sur un même membre et un même tour, et les deux personnages impliqués doivent être en mesure de se parler, de se voir ou de se toucher. Les éventuels malus et effets techniques liés aux valeurs de Réserves s’appliquent immédiatement.",
        exemples: "obscurs manipulateurs, architectes du chaos, faux prophètes.",
        principes: "manipuler une communauté entière de façon à provoquer sa destruction ou son asservissement*, avoir fait triompher des croyances obscurantistes (superstition) sur la raison et la logique, enterrer définitivement un secret qui participerait à l’élévation de l’humanité*, implanter un mensonge de manière durable au sein d’une communauté (croire ce mensonge doit leur porter préjudice sur un très long terme).",
        interdits: "exposer le Groupe inutilement*, agir collectivement de façon impulsive et non raisonnée, participer à la marche du progrès*, faire preuve de générosité ou d’altruisme désintéressé*, nouer des liens avec une communauté ou un Groupe, ne pas tenter de détruire une communauté lorsque l’occasion se présente*."
    },
    os: {
        title: "L’Os",
        text: "Tout comme les Groupes liés au Néant, ceux liés à l’Os sont également rares. La plupart appartiennent à de sombres cultes cherchant à s’attirer les faveurs d’anciennes divinités de la Mort. D’autres, peut-être plus modérés, considèrent que leur rôle est de rappeler à l’humanité qu’elle est mortelle et que seule la mort est certaine, même si elle ne signifie pas la fin de tout. Certains Groupes liés à l’Os concentrent leurs efforts contre une communauté ou un peuple en particulier, souhaitant les réduire à néant, devenant l’instrument d’une sorte de « vengeance divine ».",
        stats: "Appuyer la mort : une fois par jour, chaque membre du Groupe peut dépenser 1D de chacune de ses Réserves pour augmenter de 2 les dommages infligés par l’arme d’un autre membre du Groupe sur une action d’attaque réussie (même si elle est partiellement parée). Si la cible subit une Blessure Mortelle, la Réserve de Groupe regagne 2D. Cette capacité ne peut être utilisée qu’une seule fois sur un même membre et un même tour, et les deux personnages impliqués doivent être en mesure de se parler, de se voir ou de se toucher. Les éventuels malus et effets techniques liés aux valeurs de Réserves s’appliquent immédiatement.",
        exemples: "cultistes de la Mort, prophètes de la Fatalité, eschatologistes, semeurs de mort.",
        principes: "répandre la mort et la destruction au sein d’une communauté*, inciter une communauté à recourir à des sacrifices humains si ce n’est pas (ou plus) dans leurs traditions, inciter un personnage puissant à recourir à la violence extrême contre une communauté/société alors qu’il s’y refusait*, réduire à néant les espoirs d’une communauté (en les vendant en tant qu’esclaves sacrificiels à Lux, par exemple).",
        interdits: "se refuser à répandre la mort lorsque c’est possible, sauver une communauté d’une annihilation certaine*, ne pas venger un préjudice fait au Groupe de la façon la plus brutale qu’il soit*, ne pas détruire un Groupe agissant directement contre les principes de l’Instinct de l’Os."
    },
    voyageur: {
        title: "Le Voyageur",
        text: "Les Groupes du Voyageur sont motivés par une vie nomade et par le fait que quelque chose les attend au bout du chemin. La plupart ont tout perdu, ou n’ont jamais rien eu. Leurs membres sont sans doute ceux qui ont le plus besoin de leur Groupe, incapables de survivre sans celui-ci, mais pouvant aller au bout du monde et bien au-delà ensemble. Peu importe la destination.",
        stats: "Soins conjoints : une fois par jour, chaque membre du Groupe peut dépenser 1D de chacune de ses Réserves pour accorder une relance gratuite et diminuer d’un cran le Handicap sur une action de soin d’un autre membre du Groupe. Cette capacité ne peut être utilisée qu’une seule fois sur une même action de soin, et les deux personnages impliqués doivent traiter la Blessure en même temps (ou pratiquer les soins d’urgence en même temps). Les éventuels malus et effets techniques liés aux valeurs de Réserves s’appliquent immédiatement. Le soigneur bénéficie du bonus s’appliquant sur les actions collectives puisque les deux membres du Groupe soignent la même cible.",
        exemples: "marchands, explorateurs, prospecteurs, éclaireurs.",
        principes: "parvenir à survivre face à une grande adversité*, réussir à s’adapter dans les circonstances les plus difficiles, explorer des lieux oubliés et découvrir des civilisations perdues*.",
        interdits: "perdre un membre du Groupe*, risquer la vie du Groupe inutilement*, s’enraciner à un endroit, devenir dépendant d’une communauté (ces deux derniers interdits peuvent devenir significatifs s’ils se prolongent trop dans le temps)."
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const curInstNameElem = document.getElementById('current-instinct-name');
    if (curInstNameElem) {
        const curName = curInstNameElem.innerText.trim();
        let matchedKey = null;
        for (const [key, desc] of Object.entries(groupInstinctDescriptions)) {
            if (desc.title === curName || desc.title.replace('’', "'") === curName.replace('’', "'")) {
                matchedKey = key;
                break;
            }
        }
        if (matchedKey) {
            const desc = groupInstinctDescriptions[matchedKey];
            const detailsBox = document.getElementById('current-instinct-details');
            detailsBox.innerHTML = `
                <p class="mb-2"><em>${desc.text}</em></p>
                <div class=" mt-2" style="border-top: 1px solid #444; padding-top: 10px;">
                    <p class="mb-1"><span class="text-light fw-bold">Exemples de Groupe :</span> ${desc.exemples}</p>
                    <p class="mb-1"><span class="text-gold fw-bold">Principes :</span> ${desc.principes}</p>
                    <p class="mb-1"><span class="text-light fw-bold">Interdits :</span> ${desc.interdits}</p>
                </div>
                <div class=" text-gold mt-2 pt-2" style="border-top: 1px solid #d4af37;">
                    <i class="fas fa-bolt"></i> ${desc.stats}
                </div>
            `;
        }
    }

    const grpSelect = document.getElementById('new-group-instinct');
    if (grpSelect) {
        grpSelect.addEventListener('change', function () {
            const selected = this.value;
            const desc = groupInstinctDescriptions[selected];
            const block = document.getElementById('groupInstinctDescriptionBlock');
            if (desc) {
                document.getElementById('groupInstinctTitle').innerText = desc.title;
                document.getElementById('groupInstinctText').innerHTML = `
                    <p class="mb-2">${desc.text}</p>
                    <div class=" mt-2" style="border-top: 1px solid #444; padding-top: 10px;">
                        <p class="mb-1"><span class="text-light fw-bold">Exemples de Groupe :</span> ${desc.exemples}</p>
                        <p class="mb-1"><span class="text-gold fw-bold">Principes :</span> ${desc.principes}</p>
                        <p class="mb-1"><span class="text-light fw-bold">Interdits :</span> ${desc.interdits}</p>
                    </div>`;
                document.getElementById('groupInstinctStats').innerText = desc.stats;
                block.style.display = 'block';
            } else {
                block.style.display = 'none';
            }
        });
        
        // Trigger manually on load to show the first selected instinct Architecte
        grpSelect.dispatchEvent(new Event('change'));
    }

    // Polling des réserves partagées du groupe
    const diceDisplay = document.getElementById('groupe-dice-display');
    if (diceDisplay) {
        const grpId = diceDisplay.getAttribute('data-grp-id');
        const niveauGrp = parseInt(diceDisplay.getAttribute('data-grp-niveau'), 10);
        const maxDice = niveauGrp === 1 ? 12 : (niveauGrp === 2 ? 14 : 16);

        if (grpId) {
            setInterval(async () => {
                try {
                    const res = await fetch(`/Groupe/${grpId}`);
                    if (res.ok) {
                        const data = await res.json();
                        if (data && typeof data.reserveDes === 'number') {
                            diceDisplay.innerText = `Dés: ${data.reserveDes} / ${maxDice}`;
                        }
                    }
                } catch(e) {
                    // Ignore background errors
                }
            }, 3000);
        }
    }
});