document.addEventListener('DOMContentLoaded', function () {
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');

    nextButtons.forEach(button => {
        button.addEventListener('click', function () {
            const currentStep = this.closest('.step');
            const nextStep = document.getElementById(this.getAttribute('data-next'));
            currentStep.style.display = 'none';
            nextStep.style.display = 'block';
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', function () {
            const currentStep = this.closest('.step');
            const prevStep = document.getElementById(this.getAttribute('data-prev'));
            currentStep.style.display = 'none';
            prevStep.style.display = 'block';
        });
    });

    const submitButton = document.getElementById("submit");

    submitButton.addEventListener("click", createCharacter);

    function createCharacter() {
        // Gather form data
        const formData = {
            nom: document.getElementsByName('nom')[0].value,
            age: document.getElementsByName('age')[0].value,
            genre: document.getElementsByName('genre')[0].value,
            instinct: document.getElementsByName('instinct')[0].value,
            signeastro: document.getElementsByName('signeastro')[0].value,
            origine: document.getElementsByName('origine')[0].value,
            avantage: document.querySelector('input[name="origin_advantage"]:checked') ? document.querySelector('input[name="origin_advantage"]:checked').value : 'none',
            desavantage: document.querySelector('input[name="origin_disadvantage"]:checked') ? document.querySelector('input[name="origin_disadvantage"]:checked').value : 'none',
            capaciteInstinct1: document.querySelector('input[name="instinct_capacite"]:checked') ? document.querySelector('input[name="instinct_capacite"]:checked').value : 'none',
            puissance: document.getElementsByName('puissance')[0].value,
            resistance: document.getElementsByName('resistance')[0].value,
            precicion: document.getElementsByName('precicion')[0].value,
            reflexes: document.getElementsByName('reflexes')[0].value,
            connaissance: document.getElementsByName('connaissance')[0].value,
            perception: document.getElementsByName('perception')[0].value,
            volonte: document.getElementsByName('volonte')[0].value,
            empathie: document.getElementsByName('empathie')[0].value,
            arts: document.getElementsByName('arts')[0].value,
            cite: document.getElementsByName('cite')[0].value,
            civilisations: document.getElementsByName('civilisations')[0].value,
            relationnel: document.getElementsByName('relationnel')[0].value,
            soins: document.getElementsByName('soins')[0].value,
            animalisme: document.getElementsByName('animalisme')[0].value,
            faune: document.getElementsByName('faune')[0].value,
            montures: document.getElementsByName('montures')[0].value,
            pistage: document.getElementsByName('pistage')[0].value,
            territoire: document.getElementsByName('territoire')[0].value,
            adresse: document.getElementsByName('adresse')[0].value,
            armurerie: document.getElementsByName('armurerie')[0].value,
            artisanat: document.getElementsByName('artisanat')[0].value,
            mecanisme: document.getElementsByName('mecanisme')[0].value,
            runes: document.getElementsByName('runes')[0].value,
            athletisme: document.getElementsByName('athletisme')[0].value,
            discretion: document.getElementsByName('discretion')[0].value,
            flore: document.getElementsByName('flore')[0].value,
            vigilance: document.getElementsByName('vigilance')[0].value,
            voyage: document.getElementsByName('voyage')[0].value,
            bouclier: document.getElementsByName('bouclier')[0].value,
            cac: document.getElementsByName('cac')[0].value,
            lancer: document.getElementsByName('lancer')[0].value,
            melee: document.getElementsByName('melee')[0].value,
            tir: document.getElementsByName('tir')[0].value,
            eclats: document.getElementsByName('eclats')[0].value,
            lunes: document.getElementsByName('lunes')[0].value,
            mythes: document.getElementsByName('mythes')[0].value,
            pantheons: document.getElementsByName('pantheons')[0].value,
            rituels: document.getElementsByName('rituels')[0].value,
            equipments: Array.from(document.querySelectorAll('.equip-checkbox:checked')).map(cb => cb.value)
            // Add other fields as needed
        };

        // Send the data to your Express server
        fetch('/create-character', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        }).then(response => {
            if (response.ok) {
                // Redirect or handle success as needed
                window.location.href = '/characters'; // Redirect to characters list, for example
            } else {
                // Handle error responses
                console.error('Failed to create character:', response.statusText);
            }
        }).catch(error => {
            console.error('Error creating character:', error);
        });
    }
});



//Origin maj

const descriptions = {
    Aon: {
        banner: "/images/banners/banneraon.png",
        title: "Aon",
        text: `Aux yeux du reste du monde, les insulaires d’Aon sont des gens taiseux, vêtus de couleurs ternes, qui vivent dans un archipel pluvieux. Ils forment un peuple sévère, quittant rarement ses îles natales, si ce n’est pour se livrer à la piraterie. Les charpentiers qui construisent les bateaux d’Aon sont renommés, mais plus encore les maîtres-forgerons, ainsi que les Hommes d’Acier, seuls à connaître le secret pour obtenir l’Acier Véritable, métal incomparable dans lequel sont forgées des épées rarissimes.<br>
        S’ils ne s’opposent pas à ce que les étrangers accostent dans leurs ports, les gens d’Aon ne se montrent guère hospitaliers. Qui plus est, la rigueur du climat, le caractère farouche des autochtones et le peu d’importance qu’ils attachent à la cuisine ne contribuent pas à rendre leurs auberges attrayantes. Néanmoins, ceux qui parviennent à se lier aux natifs d’Aon découvrent rapidement des gens attentifs, dotés d’une ironie tranquille et d’une parole on ne peut plus fiable. Derrière leur froideur et leurs manières frustes, les habitants d’Aon sont des gens sincères qui savent apprécier les joies simples.`,
        stats: "<b>Champ de compétences de prédilection:</b> l’Arme  Compétence de Débutant bonus   :  Corps à corps ou Mêlée  Avantage – Combattant   :  un Avhoraeen possède la spécia  -  lité Poings (Corps à corps) ou Épée (Mêlée). Il doit posséder   la compétence liée au niveau Débutant (au lieu de Confirmé)   et cette spécialité ne compte pas comme un Handicap sur   le jet d’Expérience lorsqu’il s’agit d’en apprendre d’autres.  Avantage – D’un sang ancien   :  le sang des anciennes drui  -<br><b>Compétence de Débutant bonus:</b> <br><br><b>Avantage – Combattant  :</b> un Avhoraeen possède la spécia - lité Poings (Corps à corps) ou Épée (Mêlée). Il doit posséder la compétence liée au niveau Débutant (au lieu de Confirmé) et cette spécialité ne compte pas comme un Handicap sur le jet d’Expérience lorsqu’il s’agit d’en apprendre d’autres.<br><br><b>Avantage – D’un sang ancien  :</b> le sang des anciennes drui - et cette spécialité ne compte pas comme un Handicap sur le jet d’Expérience lorsqu’il s’agit d’en apprendre d’autres.<br><br><b>Avantage – D’un sang ancien  :</b> le sang des anciennes drui - desses coule dans les veines du personnage. Les compé - tences Lunes et Rituels ne sont pas considérées comme Rares pour lui.<br><br><b>Désavantage – Haine du Culte  :</b> les Avhoraeens vouent une grande haine au Culte du Soleil Noir (et à son Empire en général) et ont du mal à le cacher. Le personnage subit un malus de -1D sur tous ses jets de Relationnel avec les membres du Culte et il doit dépenser 1D de Sang-Froid pour ne pas attaquer immédiatement s’il est provoqué par un serviteur du Soleil Noir.<br><br><b>Désavantage – Marqué par le Sacrilège  :</b> la lignée du per - sonnage a été « infectée » par l’un des Sept Sacrilèges (cf. page XXX ). Le joueur du personnage choisit entre l’Arro - gance, la Cruauté, la Destruction, l’Hubris, la Perversion, la Rapacité ou la Voracité. Lorsque le personnage peut céder page XXX ). Le joueur du personnage choisit entre l’Arro - gance, la Cruauté, la Destruction, l’Hubris, la Perversion, la Rapacité ou la Voracité. Lorsque le personnage peut céder au Sacrilège choisi, il doit réussir un jet de Volonté Difficile (7) pour éviter de s’y abandonner totalement. Échouer à résister à l’influence d’un Sacrilège provoque la perte de 2D de Sang-Froid. Le personnage est conscient que cette pul - sion n’est pas naturelle et qu’il subit une influence néfaste contre laquelle il tente de lutter (le Sacrilège sélectionné doit donc être en opposition avec la nature du personnage)."
    },

    Babel: {
        banner: "/images/banners/bannerbabel.png",
        title: "Babel",
        text: "Babel, surnommé le Centre du Monde, est un royaume d’une richesse et d’une influence inégalées, dont la capitale, Sabaah-aux-jardins-célestes, éblouit par sa splendeur. Au cœur de l'Arkadie, région historique et prospère, la culture raffinée de Babel rayonne, mêlant traditions anciennes et innovations audacieuses. Ses habitants, fiers de leurs origines, forment une société structurée où chaque caste, des simples Enuru aux nobles Enkihurus, joue un rôle crucial. La récente conversion de la reine Taerhonis au culte de l'Unique promet de bouleverser encore davantage ce royaume en pleine mutation, attisant les ambitions et les intrigues politiques. Le territoire de Babel, traversé par le majestueux fleuve Siirh et bordé de déserts impitoyables, est jalonné de villes vibrantes et de villages-oasis précieux. Les rumeurs de conquête et les signes d'une expansion militaire sous la direction de la jeune reine laissent présager des conflits à venir, tandis que les traditions mystiques et religieuses continuent de façonner le destin de ses habitants. Plongée dans un jeu complexe de pouvoir et de mystère, Babel est une terre de légendes où chaque coin de rue et chaque souffle de vent pourrait bien cacher une aventure épique pour ceux qui osent s'y aventurer.",
        stats: "<b>Champ de compétences de prédilection:</b> l’Homme  Compétence  de  Débutant  bonus    :  Civilisations ou Soins   ;   la compétence Runes n’est pas Rare pour un personnage   originaire de Babel.  Avantage  –  Grâce  du  Siirh    :  le personnage possède une   grâce, une beauté et une élégance exceptionnelles. Lorsqu’il   fait un jet lié à la compétence Arts (chant, danse) ou Relationnel<br><b>Compétence de Débutant bonus:</b> <br><br><b>Avantage – Grâce du Siirh  :</b> le personnage possède une grâce, une beauté et une élégance exceptionnelles. Lorsqu’il fait un jet lié à la compétence Arts (chant, danse) ou Relationnel<br><br><b>Avantage – Grâce du Siirh  :</b> le personnage possède une grâce, une beauté et une élégance exceptionnelles. Lorsqu’il fait un jet lié à la compétence Arts (chant, danse) ou Relationnel (charme), il bénéficie d’un bonus de +1D sur ce jet.<br><br><b>Avantage – Issu du peuple  :</b> le personnage a un bonus de +1D sur ses jets de Relationnel.<br><br><b>Avantage – Lien essentiel  :</b> le personnage est lié à l’Essence de l’Eau ou du Soleil (au choix). La difficulté des jets d’Expé - rience pour acquérir les Faveurs liées à l’Essence choisie est abaissée de 1.<br><br><b>Désavantage – Haine du Culte  :</b> le personnage appartient au Babelites haïssant le Culte du Soleil Noir qui gangrène son pays. Le personnage subit un malus de -1D sur tous ses jets de Relationnel avec les membres du Culte et il doit dépenser 1D de Sang-Froid pour ne pas attaquer immédia - tement si son personnage est provoqué par un serviteur du Soleil Noir.<br><br><b>Désavantage – Lié au fleuve sacré  :</b> pour les Babelites, l’eau dépenser 1D de Sang-Froid pour ne pas attaquer immédia - tement si son personnage est provoqué par un serviteur du Soleil Noir.<br><br><b>Désavantage – Lié au fleuve sacré  :</b> pour les Babelites, l’eau du Siirh est sacrée. Le personnage porte un objet issu du Siirh (un petit galet, une petite outre remplie de son eau, un médaillon fait à partir de l’argile de ses rives, etc.). S’il perd cet objet et qu’il est loin du Siirh, il subit un malus de -1D sur tous ses jets sociaux et mentaux jusqu’à ce qu’il puisse le remplacer. GODS / CRÉATION DU GROUPE ET DES PERSONNAGES / PAGE 302 Daniel Mascaron (Order #30639486)"
    },
    Fakhar: {
        banner: "/images/banners/bannerkhalistan.png",
        title: "Fakhar",
        text: "Autrefois, le Sultanat rivalisait avec la puissante Sabaah, mais son orgueil le mena à affronter les guerriers de Babel. Lors de la célèbre bataille de la lune des sables, le sultan Khalishaa périt, vaincu par Vunuun, une mystérieuse Fille du Siirh. À sa mort, le Sultanat fut divisé par ses deux fils en Fakhar et Khashan, deux royaumes souvent en guerre l'un contre l'autre. Cependant, lorsque Babel tenta de nouveau de s’étendre, les sages de Barzakh œuvrèrent pour unir Fakhar et Khashan en une seule nation : le Khalistan. Dirigé par un Conseil mixte et un roi élu, le Khalistan repoussa Babel et devint une puissance économique influente. Le Khalistan est un pays de contrastes, où la culture colorée et vivante du Fakhar côtoie l’austérité silencieuse du Khashan. Le pays, soumis aux vents maritimes et désertiques, se distingue par ses paysages variés et ses cités richement décorées. Les terres fertiles du Fakhar produisent des teintures et des épices, tandis que le Khashan excelle dans la production de fer et d’acier. Malgré leurs différences, Fakhari et Khashani cohabitent, unis par des traditions et une histoire commune. Cette nation de contrastes, marquée par des mariages mixtes et une riche culture, demeure vigilante face aux ambitions de Babel, tout en consolidant sa place dans les Terres Sauvages.",
        stats: "<b>Champ de compétences de prédilection:</b> l’Homme  Compétence    de    Débutant    bonus      :  Civilisations  ou   Relationnel  Avantage  –  Négociant  né    :  le personnage a un bonus de<br><b>Compétence de Débutant bonus:</b> <br><br><b>Avantage – Négociant né  :</b> le personnage a un bonus de Fakhar Champ de compétences de prédilection : l’Homme Compétence de Débutant bonus : Civilisations ou Relationnel<br><br><b>Avantage – Négociant né  :</b> le personnage a un bonus de +1D sur tous ses jets liés au commerce ou à la négociation.<br><br><b>Avantage – Optimisme  :</b> le personnage reste optimiste, même dans les pires moments. Une fois par jour, il peut regagner 1D de Réserve au choix.<br><br><b>Désavantage – Apparences  :</b> les Fakhari ont un goût fort prononcé pour les beaux habits et accordent beaucoup d’importance à leur apparence. Dès qu’ils sont crottés, mal lavés ou qu’ils ne sont tout simplement pas présentables, ils subissent un malus de -1D sur leurs jets sociaux.<br><br><b>Désavantage – Mépris de la violence  :</b> les Fakhari appré - cient peu la violence, même s’ils sont conscients qu’il est parfois nécessaire d’y recourir pour résister à un agresseur. La difficulté du jet de Réaction dans l’état « offensif » passe - cient peu la violence, même s’ils sont conscients qu’il est parfois nécessaire d’y recourir pour résister à un agresseur. La difficulté du jet de Réaction dans l’état « offensif » passe à 6 au lieu de 5 pour le personnage, car il est toujours pris d’un léger moment d’hésitation. Si l’adversaire n’est pas directement menaçant, le personnage ne peut jamais être dans l’état offensif, il sera au mieux « actif ». Horde Champ de compétences de prédilection : les Terres Sauvages Compétence de Débutant bonus : Monture ou Voyage<br><br><b>Avantage – Né sur un cheval  :</b> le personnage gagne la spécialité Équitation (Monture) ou Campement (Voyage). Il doit posséder la compétence liée au niveau Débutant (au lieu de Confirmé) et cette spécialité ne compte pas comme un Handicap sur le jet d’Expérience lorsqu’il s’agit d’en apprendre d’autres. GODS / CRÉATION DU GROUPE ET DES PERSONNAGES / PAGE 303 Daniel Mascaron (Order #30639486)<br><br><b>Avantage – Terrifiante réputation  :</b> le personnage gagne un bonus de +1D sur tous les jets visant à intimider ou effrayer quelqu’un qui n’appartient pas à la Horde.<br><br><b>Désavantage – Aura de la mort  :</b> une aura quasi surnatu - relle entoure le personnage et met les gens terriblement mal à l’ais"
    },
    Khashan: {
        banner: "/images/banners/bannerkhalistan.png",
        title: "Khashan",
        text: "Autrefois, le Sultanat rivalisait avec la puissante Sabaah, mais son orgueil le mena à affronter les guerriers de Babel. Lors de la célèbre bataille de la lune des sables, le sultan Khalishaa périt, vaincu par Vunuun, une mystérieuse Fille du Siirh. À sa mort, le Sultanat fut divisé par ses deux fils en Fakhar et Khashan, deux royaumes souvent en guerre l'un contre l'autre. Cependant, lorsque Babel tenta de nouveau de s’étendre, les sages de Barzakh œuvrèrent pour unir Fakhar et Khashan en une seule nation : le Khalistan. Dirigé par un Conseil mixte et un roi élu, le Khalistan repoussa Babel et devint une puissance économique influente. Le Khalistan est un pays de contrastes, où la culture colorée et vivante du Fakhar côtoie l’austérité silencieuse du Khashan. Le pays, soumis aux vents maritimes et désertiques, se distingue par ses paysages variés et ses cités richement décorées. Les terres fertiles du Fakhar produisent des teintures et des épices, tandis que le Khashan excelle dans la production de fer et d’acier. Malgré leurs différences, Fakhari et Khashani cohabitent, unis par des traditions et une histoire commune. Cette nation de contrastes, marquée par des mariages mixtes et une riche culture, demeure vigilante face aux ambitions de Babel, tout en consolidant sa place dans les Terres Sauvages.",
        stats: "<b>Champ de compétences de prédilection:</b> l’Inconnu<br><b>Compétence de Débutant bonus:</b> <br><br><b>Avantage – Maître de son destin  :</b> une fois par jour, le per - sonnage peut utiliser une relance gratuite sur le jet de son choix.<br><br><b>Avantage – Maître des arts  :</b> les Khashani bénéficient d’un bonus de +1D sur tous les jets liés à la poésie et aux arts.<br><br><b>Avantage – Science céleste  :</b> le personnage connaît les étoiles ou les mythes liés aux dieux. Il peut choisir l’une des spécialités suivantes : Astrologie (Lunes), Légendes (Mythes) ou Anciens Dieux (Panthéons). Il doit posséder la compé - tence liée au niveau Débutant (au lieu de Confirmé) et cette spécialité ne compte pas comme un Handicap sur le jet d’Expérience lorsqu’il s’agit d’en apprendre d’autres. - tence liée au niveau Débutant (au lieu de Confirmé) et cette spécialité ne compte pas comme un Handicap sur le jet d’Expérience lorsqu’il s’agit d’en apprendre d’autres.<br><br><b>Désavantage – Marqué par le destin  :</b> dans la limite d’une fois par jour, le personnage peut voir le destin influencer son existence. L’Oracle peut faire relancer au joueur du per - sonnage un dé de son choix sur n’importe quel jet, aucune relance ne sera possible après. Si le personnage est un Élu et que le dé obtient une réussite sur cette relance, il gagne 1D d’Humanité.<br><br><b>Désavantage – Réservé  :</b> les Khashani sont d’un naturel réservé. Le personnage subit un malus de -1D sur tous ses jets de Relationnel avec les non Khashani.<br><br><b>Désavantage – Voilé  :</b> le personnage fait partie des Khashani élevés dans le secret de Barzakh, la Cité interdite. Il masque son visage en toutes circonstances. Avoir à se dévoiler devant des inconnus est une grave insulte pour lui. Khashani élevés dans le secret de Barzakh, la Cité interdite. Il masque son visage en toutes circonstances. Avoir à se dévoiler devant des inconnus est une grave insulte pour lui. S’il doit le faire, il perd 2D de Sang-Froid. En outre, il parle de préférence à voix basse et parler fort (tout comme se mettre en avant) ne lui est pas naturel, cela l’incommode même grandement. Pour le faire, il doit réussir un jet de"
    },
    Vaelor: {
        banner: "/images/banners/bannervaelor.png",
        title: "Vaelor",
        text: "De tous les peuples, les Vaelkyrs comptent parmi les plus touchés par la disparition de leurs dieux et, en premier lieu, de leur déesse : Varna, la Mère des Glaces. Varna est la terre gelée, les flocons de neige sont ses larmes, le blizzard son souffle. Incapable de procréer, ses seuls enfants sont ceux de son peuple, lesquels l’adorent telle leur seule véritable mère. Elle a créé les premiers d’entre eux en sculptant leurs corps dans un glacier millénaire, insufflant sa vie en eux de son baiser hivernal, les serrant un instant sur sa poitrine atrophiée avant de les semer sur la terre gelée, engendrant un peuple aussi froid et dur que la matière dont ils sont nés.",
        stats: "<b>Champ de compétences de prédilection:</b> l’Arme  Compétence  de  Débutant  bonus    :  Bouclier ou Mêlée   ; la   compétence Bouclier n’est pas Rare pour une personne ori  -  ginaire de Vaelor.  Spécial :<br><b>Compétence de Débutant bonus:</b> <br><br><b>Spécial :</b> Champ de compétences de prédilection : l’Arme Compétence de Débutant bonus : Bouclier ou Mêlée ; la compétence Bouclier n’est pas Rare pour une personne ori - ginaire de Vaelor.<br><br><b>Spécial :</b> la majorité des habitants de Vaelor sont frappés de stérilité. Rares sont ceux et celles capables de concevoir ne serait-ce qu’un seul enfant qui n’expirera pas à la naissance.<br><br><b>Avantage – Armure des ancêtres  :</b> le Vaelkyr possède une armure ornée des os de quelques-uns de ses plus fiers et puissants ancêtres. Tant qu’il porte cette armure, il bénéficie d’un bonus de +1D sur ses jets de Volonté pour résister à la peur ou tout effet équivalent.<br><br><b>Avantage – Emprunt du néant  :</b> le personnage est telle - ment affecté par le grand néant qui a ravagé ses terres et les Essences locales qu’il en a tiré un avantage : lorsqu’il est ciblé par un effet ou une attaque nourris par les Essences (Faveur, rituel, attaque d’une créature transformée par l’action d’une Essences locales qu’il en a tiré un avantage : lorsqu’il est ciblé par un effet ou une attaque nourris par les Essences (Faveur, rituel, attaque d’une créature transformée par l’action d’une Essence), le personnage peut faire un jet de Volonté Très difficile (9). En cas de réussite, il ne subit aucun dommage ou effet, mais ne peut plus retenter de jet de Volonté pour éviter à nouveau des dommages ou effets d’Essence avant d’avoir bénéficié d’un repos complet.<br><br><b>Avantage – Résistance à l’alcool  :</b> le personnage dispose d’un bonus de +1D sur ses jets de Résistance visant à contrer les effets de l’alcool (et, à la discrétion de l’Oracle, pour résister aux effets de drogues et poisons ingurgités).<br><br><b>Désavantage – Impulsivité  :</b> le personnage, comme tous ceux de son peuple, est violent. Il doit réussir un jet de Volonté Très difficile (9) pour ne pas attaquer immédiate - ment quelqu’un qui le provoque ou l’insulte. En cas d’échec, ceux de son peuple, est violent. Il doit réussir un jet de Volonté Très difficile (9) pour ne pas attaquer immédiate - ment quelqu’un qui le provoque ou l’insulte. En cas d’échec, il peut dépenser 1D de Sang-Froid pour éviter de se jeter sur celui qui l’a provoqué, mais si ce dernier c"
    },
    Valdheim: {
        banner: "/images/banners/bannervaldheim.png",
        title: "Valdheim",
        text: "Les Valdhs aux cheveux clairs affirment que leurs ancêtres sont venus de Vaelor en des temps reculés, après avoir rejeté les sinistres dieux du Nord. Ces ancêtres, les Dix Mille, auraient découvert une terre fertile et de nouveaux dieux. Leur culture s’est distinguée de celle des Vaelkyrs au point de développer sa propre langue et d’embrasser des valeurs radicalement opposées. Valdhs et Vaelkyrs se haïssent mutuellement ; malheur à celui qui tomberait vivant entre les mains de l’ennemi ancestral. Les Valdhs forment un peuple tolérant et pragmatique, mais ils savent également se montrer aventureux, avides de richesses et fiers au point d’en être orgueilleux. Un Valdh n’oublie jamais ses amis, mais il n’oublie jamais non plus ses ennemis. S’il a l’amitié aussi solide qu’il a la rancune tenace, il est aisé de le froisser et plus ardu d’obtenir son pardon. Nombreux sont les Valdhs qui aiment la mer. Ils comptent dans leurs rangs de nombreux marins intrépides et des navigateurs audacieux qui se sont aventurés jusqu’aux ports du Khalistan et de Saeth. Négociants têtus, ce sont aussi à l’occasion des pillards agressifs, et certains de leurs voisins en ont une bien piètre opinion.",
        stats: "<b>Champ de compétences de prédilection:</b> les Terres Sauvages<br><b>Compétence de Débutant bonus:</b> Athlétisme ou Vigilance<br><br><b>Avantage  – Athlétique :</b> les habitants de Valdheim sont très endurants et athlétiques. Ils considèrent que leurs caractéristiques de Puissance et de Résistance sont augmentées de 1 pour calculer leurs déplacements (nage incluse), leurs sauts et le poids qu’ils peuvent soulever.<br><br><b>Avantage  – Résistance à l’alcool :</b> le personnage dispose d’un bonus de +1D sur ses jets de Résistance visant à contrer les effets de l’alcool (et, à la discrétion de l’Oracle, pour résister aux effets de drogues et poisons ingurgités).<br><br><b>Désavantage  – Affranchi :</b> le personnage a choisi de vivre en marge de son peuple en devenant un Affranchi. Face à un autre Valdh (ou quelqu’un connaissant bien leur culture), il subit un malus de -1D en Volonté et en Empathie.<br><br><b>Désavantage – Puissance du riche :</b> le Valdh, du fait de son éducation, considère les gens portant de nombreux bijoux comme puissants et respectables. Face à de telles personnes, le personnage subit un malus de -1D en Volonté.<br><br><b>Désavantage – Sens de l’honneur :</b> bafouer l’honneur d’une personne originaire de Valdheim, ou l’insulter, n’est jamais une bonne idée. En cas d’affront, le personnage doit défier dans un duel à mort (ou à l’inconscience) son adversaire. Si celui-ci refuse, le personnage de Valdheim est humilié et subit un malus de -1D sur tous ses jets jusqu’à ce qu’il puisse laver l’affront."
    },
    Saeth: {
        banner: "/images/banners/bannersaeth.png",
        title: "Saeth",
        text: "Saeth, surnommé le Pays des Cendres, se dresse comme un royaume aussi inhospitalier que fascinant.Dominé par un grand volcan divinisé, le paysage de Saeth est façonné par des cendres volcaniques et des marécages empoisonnés, imprégnant l'air d'une atmosphère lourde et sinistre.La métropole de Dhaar, s'élevant au bord de l'océan dans une verticalité oppressante, est le cœur sombre de cette civilisation.Les Saethites, au teint pâle et aux traditions cruelles, vivent sous le règne tyrannique des Uttamani, une caste dirigeante impitoyable.Pour les étrangers courageux qui y commercent, Saeth offre des richesses uniques en élixirs et herbes exotiques, convoités pour leurs propriétés diverses. Au - delà de la métropole, le delta marécageux de Zaron Teth étend sa fertilité malsaine, nourrissant une agriculture complexe et la production d'élixirs prisés à travers les Terres Sauvages. Malgré son environnement mortifère, Saeth intrigue par ses mystères ésotériques et ses rituels sacrés, contrastant avec la misère quotidienne et les hiérarchies sociales oppressantes qui maintiennent le peuple sous un joug impitoyable. Les murmures d'une résistance émergente agitent les ombres de Dhaar, révélant des aspirations de grandeur qui pourraient changer le destin même de ce royaume maudit.",
        stats: "<b>Champ de compétences de prédilection:</b> l’Outil  Compétence  de  Débutant  bonus    :  Artisanat  ou  Runes   ;   aucune de ces deux compétences n’est Rare pour une per  -  sonne originaire de Saeth.  Avantage – Caste inférieure (Adaman)   :  le personnage est   issu du bas peuple de Saeth et a dû développer des trésors   d’ingéniosité pour survivre. Il peut choisir une spécialité au   choix en Adresse, Artisanat ou Discrétion. Il doit posséder la   compétence liée au niveau Débutant (au lieu de Confirmé)   et cette spécialité ne compte pas comme un Handicap sur   le jet d’Expérience lorsqu’il s’agit d’en apprendre d’autres.  Avantage – Détaché   :  la mort fait partie intégrante de Saeth   et elle n’a plus rien d’effrayant. Le personnage bénéficie<br><b>Compétence de Débutant bonus:</b> <br><br><b>Avantage – Caste inférieure (Adaman)  :</b> le personnage est issu du bas peuple de Saeth et a dû développer des trésors d’ingéniosité pour survivre. Il peut choisir une spécialité au choix en Adresse, Artisanat ou Discrétion. Il doit posséder la compétence liée au niveau Débutant (au lieu de Confirmé) et cette spécialité ne compte pas comme un Handicap sur le jet d’Expérience lorsqu’il s’agit d’en apprendre d’autres.<br><br><b>Avantage – Détaché  :</b> la mort fait partie intégrante de Saeth et elle n’a plus rien d’effrayant. Le personnage bénéficie le jet d’Expérience lorsqu’il s’agit d’en apprendre d’autres.<br><br><b>Avantage – Détaché  :</b> la mort fait partie intégrante de Saeth et elle n’a plus rien d’effrayant. Le personnage bénéficie d’un bonus de +1D et d’une relance gratuite pour résister à la peur.<br><br><b>Désavantage – Accro  :</b> le personnage est accro à l’une des nombreuses drogues de Saeth. Il doit en consommer de façon hebdomadaire ou subir un malus de -1D sur tous ses jets jusqu’à ce qu’il puisse à nouveau en prendre. Cette dépendance ne peut être soignée ou surmontée.<br><br><b>Désavantage – Caste élevée (Uttaman)  :</b> le personnage appartient à une caste élevée dans la hiérarchie de Saeth. En tant que tel, il supporte mal d’être jugé par des « moins que rien » et les remarques ou insultes à son encontre faites par quelqu’un qu’il juge inférieur (soit à peu près tout le monde) peuvent rapidement l’irriter. Il doit alors réussir un jet de Volonté Difficile (7) pour ne pas perdre son calme ou par quelqu’un qu’il juge inférieur (soit à peu près tout le monde) peuvent rapidement l’irriter. Il doit alors réussir un jet de Volonté Difficile (7) pour ne pas perdre son calme ou dépenser 1D de Sang-Froid pour réussir à se contenir.<br><br><b>Désavantage – Insensible  :</b> le personnage peut sembler totalement insensible à quelqu’un qui n’est pas de Saeth (ou de"
    },
    Tuuhle: {
        banner: "/images/banners/bannertuuhle.png",
        title: "Tuuhle",
        text: "Tuuhle, surnommée l’Océan d’Arbres, est un royaume sauvage et mystérieux enveloppé par une jungle dense et imposante, si vaste que ses limites demeurent inconnues. Habitée par les Tuuhls, des hommes à la peau sombre ornés d'or, cette jungle regorge de tribus anciennes et distinctes. Les peuples méridionaux ont établi quelques comptoirs le long de sa périphérie nord, échangeant avec les tribus autochtones. Toutefois, la jungle reste largement inexplorée et mystérieuse pour la plupart, ses habitants préférant se concentrer sur les mystères et les périls de leur environnement immédiat plutôt que sur les contrées lointaines. Chaque région de Tuuhle présente ses propres défis et merveilles : à l’ouest, la région maudite du Chagrin, où la jungle est dénaturée et inhospitalière ; au nord, le Domaine, plus peuplé mais toujours dangereux ; à l’est, les mangroves bordant l’océan, territoire des pêcheurs courageux et des crocodiles marins. Au cœur de Tuuhle se trouve le Ventre de la Mère, un lieu mystique et dangereux où des tribus anciennes vivent isolées, protégeant des secrets et peut-être même une cité dorée légendaire, Ankhahara. Au milieu de ces mystères, des tensions politiques croissantes entre tribus et l'intrusion des étrangers apportent des préoccupations nouvelles, même aux esprits des chamanes qui pressentent une menace imminente venant de l'extérieur. Tuuhle est donc un monde foisonnant où la nature règne en maître et où les tribus, dirigées par un chef et un chamane, coexistent dans un équilibre fragile, souvent perturbé par des luttes de pouvoir et des alliances changeantes. C’est un royaume où les mystères abondent, où chaque recoin recèle une histoire et où chaque pas dans la jungle peut mener à la découverte ou à la perte.",
        stats: "<b>Champ de compétences de prédilection:</b> l’Animal  Compétence de Débutant bonus   :  Pistage ou Territoire   ; la   compétence Animalisme n’est pas Rare pour une personne   originaire de Tuuhle.  Avantage – Né de la Mère   :  le personnage est un véritable   enfant de la Forêt Mère. Il peut prendre la spécialité Animaux   (Pistage), Forêt (Territoire), Plantes médicinales (Flore) ou   Plantes toxiques (Flore). Il doit posséder la compétence liée   au niveau Débutant (au lieu de Confirmé) et cette spécialité   ne compte pas comme un Handicap sur le jet d’Expérience   lorsqu’il s’agit d’en apprendre d’autres.  Avantage  –  Résistance  aux  intoxications    :  habitué  aux   environnements et aux faunes hostiles, le personnage dimi  -<br><b>Compétence de Débutant bonus:</b> <br><br><b>Avantage – Né de la Mère  :</b> le personnage est un véritable enfant de la Forêt Mère. Il peut prendre la spécialité Animaux (Pistage), Forêt (Territoire), Plantes médicinales (Flore) ou Plantes toxiques (Flore). Il doit posséder la compétence liée au niveau Débutant (au lieu de Confirmé) et cette spécialité ne compte pas comme un Handicap sur le jet d’Expérience lorsqu’il s’agit d’en apprendre d’autres.<br><br><b>Avantage – Résistance aux intoxications  :</b> habitué aux environnements et aux faunes hostiles, le personnage dimi - lorsqu’il s’agit d’en apprendre d’autres.<br><br><b>Avantage – Résistance aux intoxications  :</b> habitué aux environnements et aux faunes hostiles, le personnage dimi - nue de 1 la Virulence de tous les venins et poisons l’affec - tant. En outre, il bénéficie d’un bonus de +1D pour y résister.<br><br><b>Désavantage – Aversion pour le métal  :</b> le bois, le cuir, la pierre, l’os... voilà les seuls matériaux nobles pour le per - sonnage. En conséquence, il souffre d’un malus de -1D à ses actions physiques et manuelles dès qu’il utilise une arme ou un bouclier en métal. Il souffre également d’un malus de -1D à toutes ses actions physiques et manuelles s’il porte une armure en métal. Ces deux malus sont cumulatifs.<br><br><b>Désavantage – Esprit sauvage  :</b> le personnage n’est pas habitué aux grandes cités. Lorsqu’il évolue dans un tel envi - ronnement, il subit un malus de -1D sur tous ses jets sociaux et mentaux.<br><br><b>Désavantage – Marginal  :</b> le personnage n’est pas à l’aise - ronnement, il subit un malus de -1D sur tous ses jets sociaux et mentaux.<br><br><b>Désavantage – Marginal  :</b> le personnage n’est pas à l’aise avec la civilisation et comprend mal les relations qui unissent les gens en dehors d’un modèle tribal. Lorsqu’il doit effec - tuer un jet ayant trait aux compétences Cité ou Civilisations, il subit un malus de -1D sur son jet.<br><br><b>Désavantage – Proie facile  :</b> le personnage n’est pas à l’aise dans une zone trop exposée (steppes, plaines, déserts, etc.) dans laquelle il ne peut pas utiliser l’environnement pour se défendre et se dissimuler. Lorsqu’il est dans un tel endroit, une forme de paranoïa l’affecte et il subit un malus de -1D sur ses jets de Perception et de Vigilance (y compr"
    },
    Avhorae: {
        banner: "/images/banners/banneravhorae.png",
        title: "Avhorae",
        text: "Avhorae (prononcé « Avhoré ») a toujours été une nation paradoxale : riche et fruste, civilisée et violente, moderne et superstitieuse. Ses villes de belle taille sont prospères et abritent nombre de centres d’érudition et de marchés importants, alors que ses paysans illettrés vivent pauvrement, en bordure de forêts impénétrables, sous la menace de bêtes sauvages, de bandits et de choses plus inquiétantes encore. Au fil des siècles, les voisins d’Avhorae furent tour à tour ses partenaires, ses ennemis, ses proies et à nouveau ses partenaires. Qu’ils soient de simples serfs ou des nobles en vue à la cour, les Avhoraeens (prononcé « Avhoréens ») ont toujours considéré les autres peuples avec une certaine condescendance.",
        stats: "<b>Champ de compétences de prédilection:</b> l’Arme  Compétence de Débutant bonus   :  Corps à corps ou Mêlée  Avantage – Combattant   :  un Avhoraeen possède la spécia  -  lité Poings (Corps à corps) ou Épée (Mêlée). Il doit posséder   la compétence liée au niveau Débutant (au lieu de Confirmé)   et cette spécialité ne compte pas comme un Handicap sur   le jet d’Expérience lorsqu’il s’agit d’en apprendre d’autres.  Avantage – D’un sang ancien   :  le sang des anciennes drui  -<br><b>Compétence de Débutant bonus:</b> <br><br><b>Avantage – Combattant  :</b> un Avhoraeen possède la spécia - lité Poings (Corps à corps) ou Épée (Mêlée). Il doit posséder la compétence liée au niveau Débutant (au lieu de Confirmé) et cette spécialité ne compte pas comme un Handicap sur le jet d’Expérience lorsqu’il s’agit d’en apprendre d’autres.<br><br><b>Avantage – D’un sang ancien  :</b> le sang des anciennes drui - et cette spécialité ne compte pas comme un Handicap sur le jet d’Expérience lorsqu’il s’agit d’en apprendre d’autres.<br><br><b>Avantage – D’un sang ancien  :</b> le sang des anciennes drui - desses coule dans les veines du personnage. Les compé - tences Lunes et Rituels ne sont pas considérées comme Rares pour lui.<br><br><b>Désavantage – Haine du Culte  :</b> les Avhoraeens vouent une grande haine au Culte du Soleil Noir (et à son Empire en général) et ont du mal à le cacher. Le personnage subit un malus de -1D sur tous ses jets de Relationnel avec les membres du Culte et il doit dépenser 1D de Sang-Froid pour ne pas attaquer immédiatement s’il est provoqué par un serviteur du Soleil Noir.<br><br><b>Désavantage – Marqué par le Sacrilège  :</b> la lignée du per - sonnage a été « infectée » par l’un des Sept Sacrilèges (cf. page XXX ). Le joueur du personnage choisit entre l’Arro - gance, la Cruauté, la Destruction, l’Hubris, la Perversion, la Rapacité ou la Voracité. Lorsque le personnage peut céder page XXX ). Le joueur du personnage choisit entre l’Arro - gance, la Cruauté, la Destruction, l’Hubris, la Perversion, la Rapacité ou la Voracité. Lorsque le personnage peut céder au Sacrilège choisi, il doit réussir un jet de Volonté Difficile (7) pour éviter de s’y abandonner totalement. Échouer à résister à l’influence d’un Sacrilège provoque la perte de 2D de Sang-Froid. Le personnage est conscient que cette pul - sion n’est pas naturelle et qu’il subit une influence néfaste contre laquelle il tente de lutter (le Sacrilège sélectionné doit donc être en opposition avec la nature du personnage)."
    },
    "Empire du Soleil Noir": {
        banner: "/images/banners/bannercultedusoleil.png",
        title: "Empire du soleil noir",
        text: "Autrefois, avant la disparition des dieux et la Nuit du Soleil Noir, deux grandes alliances de cités-États, la Viridia et la Tégée, contrôlaient une bonne partie des Terres Sauvages orientales. Les disputes entre cités étaient fréquentes, mais grâce aux pactes qui les liaient, leurs rivalités ne donnèrent jamais lieu à une guerre à grande échelle. La plus fière de ces cités se nommait Lux, « la lumière ». Lux s’enorgueillissait de ses arts, de ses lettres et de son architecture. Ses voisines respectaient et jalousaient à la fois les lignées patriciennes de la métropole, dont l’influence se faisait sentir à travers tout Viridia et jusque dans la Tégée. Aux yeux des Viridis et des Tégéens, Lux égalait la légendaire Babel, et l’on pensait qu’elle la dépasserait un jour.  Puis, le Soleil Noir rayonna à travers le monde et le désespoir se répandit, jusqu’à ce que l’Oracle prophétise à Lux qu’après un millénaire d’absence, les dieux reviendraient et que tout rentrerait dans l’ordre. Pendant plus d’un siècle, la République de Lux fut porteuse de cette idée puissante, de cet espoir de renouveau. Mais cet espoir fut trahi à l’endroit même où il était né, par ceux-là mêmes qui devaient entretenir sa flamme. La puissante famille des Caelius éleva le premier édifice dédié à l’Unique, le Templum Primaris, au sommet du mont du Berceau. Surplombant ce temple apparut un colossal et sinistre cube noir, le Vox Aedes, dans lequel ils emmurèrent vivant un enfant innocent aux cheveux blancs, ultime descendant de l’Oracle. Au cours d’un bref et sanglant coup d’État, les Caelius proclamèrent la fin de la République et firent de leur chef Augustus Caelius Severus le premier empereur de Lux. Augustus régna moins d’un an avant d’être assassiné par son fils Marcus Brutus, lequel prit le trône et reçut en audience le prophète de l’Unique, Adrah, encore ébloui par les révélations de son dieu. Après six jours et six nuits d’entretien, le Culte du Soleil Noir fut proclamé unique religion de l’Empire.",
        stats: "<b>Champ de compétences de prédilection:</b> l’Homme  Compétence de Débutant bonus   :  Cité ou Relationnel  Avantage – Entraînement militaire   :  le personnage a subi   un entraînement militaire pour servir dans les légions (ou   servir  un  temps  en  tant  que  gladiateur).  Il  possède  une   spécialité de son choix dans une compétence de l’Arme. Il   doit posséder la compétence liée au niveau Débutant (au   lieu de Confirmé) et cette spécialité ne compte pas comme   un  Handicap  sur  le  jet  d’Expérience  lorsqu’il  s’agit  d’en   apprendre d’autres.  Avantage – Peuple du Culte   :  le personnage a un bonus de   +1D sur tous ses jets liés à la connaissance du Culte ou de   ses serviteurs.  Avantage  –  Esclave  des  mines    :  avant de s’enfuir ou de   gagner  sa  liberté,  le  personnage  a  été  esclave  dans  les   mines de l’Empire, extrayant le minerai nécessaire à la forge   d’armes  et  d’armures  des  légions.  Il  en  a  conservé  une<br><b>Compétence de Débutant bonus:</b> <br><br><b>Avantage – Entraînement militaire  :</b> le personnage a subi un entraînement militaire pour servir dans les légions (ou servir un temps en tant que gladiateur). Il possède une spécialité de son choix dans une compétence de l’Arme. Il doit posséder la compétence liée au niveau Débutant (au lieu de Confirmé) et cette spécialité ne compte pas comme un Handicap sur le jet d’Expérience lorsqu’il s’agit d’en apprendre d’autres.<br><br><b>Avantage – Peuple du Culte  :</b> le personnage a un bonus de +1D sur tous ses jets liés à la connaissance du Culte ou de ses serviteurs.<br><br><b>Avantage – Esclave des mines  :</b> avant de s’enfuir ou de gagner sa liberté, le personnage a été esclave dans les mines de l’Empire, extrayant le minerai nécessaire à la forge d’armes et d’armures des légions. Il en a conservé une gagner sa liberté, le personnage a été esclave dans les mines de l’Empire, extrayant le minerai nécessaire à la forge d’armes et d’armures des légions. Il en a conservé une grande endurance et bénéficie d’une relance gratuite sur tous ses jets de Résistance.<br><br><b>Désavantage – Crainte du Culte  :</b> un habitant de l’Empire du Soleil Noir subit un malus de -1D sur ses jets sociaux lors - qu’il est confronté à un membre du Culte de statut supérieur (ou n’importe quel membre du Culte si le personnage ne fait pas partie de ses rangs).<br><br><b>Désavantage – Marque du Soleil Noir  :</b> le personnage possède une tache de naissance d’un noir profond quelque part sur le corps... et elle grandit, lui infligeant parfois une douleur cuisante assortie d’un malus de -1D sur tous ses jets (chaque fois qu’il obtient au moins deux « 10 » sur le résul - tat final d’un jet, la douleur se manifeste dès le tour suivant douleur cuisante assortie d’un malus de -1D sur tous ses jets (chaque fois qu’il obtient au moins deux « 10 » sur le résul - tat final d’un jet, la douleur se manifeste dès le tour suivant durant 1d5 tours et aucun effet ne peut annuler ou réduire ce malus). Si le personnage est un Élu, la douleur se déclenche également s’il utilise une Faveur liée aux Essences de l’Hu - manité, du Soleil ou de la Vie (en cas d’activations multiples de la marque au cours de tours successifs, les tours où s’ap - plique le malus ne se cumulent pas,"
    },
    Horde: {
        banner: "/images/banners/bannerhorde.png",
        title: "Horde",
        text: "Si l’on en croit les vieux contes, le peuple katai vivait autrefois dans la glorieuse cité de Khokhan, berceau foisonnant de connaissances et de richesses. Ce paradis urbain lui avait été offert par les dieux, afin qu’il survive plus aisément à un monde hostile et sans égard pour la vie humaine. Or, la population prospère n’ayant de cesse de croître, Khokhan ne put bientôt plus accueillir tous les Katai. Le monde extérieur, le Grand Au-Delà, devint alors synonyme d’épreuves et d’exil. Personne ne souhaitait être forcé de quitter Khokhan pour risquer sa vie dans ce Grand Au-delà, car la déesse Amarakh y attendait patiemment les âmes pour les juger avec rigueur .",
        stats: "<b>Champ de compétences de prédilection:</b> l’Inconnu<br><b>Compétence de Débutant bonus:</b> <br><br><b>Désavantage – Aura de la mort  :</b> une aura quasi surnatu - relle entoure le personnage et met les gens terriblement mal à l’aise. Il subit un malus de -1D sur ses jets de Relationnel avec toute personne extérieure à la Horde lorsqu’il s’agit de séduire, négocier et même mentir (il inspire la méfiance).<br><br><b>Désavantage – Marginal  :</b> le personnage n’est pas à l’aise avec le concept de civilisation. Lorsqu’il doit effectuer un jet ayant trait aux compétences Cité ou Civilisations, il subit un malus de -1D sur son jet.<br><br><b>Désavantage – Tribal  :</b> les membres de la Horde sont habi - tués à vivre en groupe depuis leur plus jeune âge. Dès que le personnage se retrouve sans allié à proximité, il subit un malus de -1D sur tous ses jets mentaux et sociaux."
    },
    "Royaumes divisés": {
        banner: "/images/banners/bannerroyaumedivises.png",
        title: "Royaumedivises",
        text: "Par bien des aspects, les Cetomagus (les « enfants du bois ») et leurs cousins d’Avhorae (les « enfants des feuilles ») partagent un héritage commun, même si les destins de leurs pays respectifs divergent en de nombreux points. Les clans cetons entretenaient de bien meilleurs rapports entre eux que leurs voisins nordiques et vivaient en bonne intelligence. Cette relative stabilité tenait à la structure sociale antique, car les clans étaient rassemblés en fédérations, menées par des chefs élus, les Teutater. Leur rôle était justement de tempérer les rivalités et si les affrontements entre clans ne manquaient pas, ils étaient de courte durée et l’embrasement parvenait toujours à être évité.",
        stats: "<b>Champ de compétences de prédilection:</b> l’Outil  Compétence de Débutant bonus   :  Armurerie ou Artisanat   ;   aucune de ces deux compétences n’est Rare pour une per  -  sonne originaire des Royaumes divisés.  Avantage  –  D’un  sang  glorieux    :  dans les veines du per  -  sonnage coule le sang des anciens rois. Il bénéficie d’une   relance gratuite sur les jets de Volonté visant à résister à la   manipulation et à la coercition ou à donner des ordres.  Avantage – Manuel   :  le peuple des Royaumes divisés est très   habile de ses mains. Le personnage dispose d’une relance   gratuite sur tout jet impliquant un travail manuel artisanal.  Avantage – Paranoïa positive   :  le personnage est toujours   prêt à réagir et ne dort que d’un   œil  . Il bénéficie d’un bonus<br><b>Compétence de Débutant bonus:</b> <br><br><b>Avantage – D’un sang glorieux  :</b> dans les veines du per - sonnage coule le sang des anciens rois. Il bénéficie d’une relance gratuite sur les jets de Volonté visant à résister à la manipulation et à la coercition ou à donner des ordres.<br><br><b>Avantage – Manuel  :</b> le peuple des Royaumes divisés est très habile de ses mains. Le personnage dispose d’une relance gratuite sur tout jet impliquant un travail manuel artisanal.<br><br><b>Avantage – Paranoïa positive  :</b> le personnage est toujours prêt à réagir et ne dort que d’un œil . Il bénéficie d’un bonus gratuite sur tout jet impliquant un travail manuel artisanal.<br><br><b>Avantage – Paranoïa positive  :</b> le personnage est toujours prêt à réagir et ne dort que d’un œil . Il bénéficie d’un bonus de +1D sur ses jets de Vigilance et il est considéré comme « actif » plutôt que « passif » lors d’un jet de Réaction.<br><br><b>Désavantage – Anxiété  :</b> l’instabilité à laquelle sont habi - tués les peuples des Royaumes divisés a laissé des traces sur eux. Le personnage est un éternel anxieux qui subit un malus de -1D sur ses jets mentaux et sociaux dès lors qu’une situation lui échappe ou que le chaos s’installe.<br><br><b>Désavantage – Corruption physique  :</b> la malédiction qui touche les Royaumes divisés s’est instillée dans le person - nage sous une forme physique. Soit celui-ci a un cercle de Blessure Légère de moins, soit il souffre d’une affliction (sourd, muet, aveugle), soit l’un de ses membres est affecté (atrophié, par exemple) et lui inflige un malus de -1D sur Blessure Légère de moins, soit il souffre d’une affliction (sourd, muet, aveugle), soit l’un de ses membres est affecté (atrophié, par exemple) et lui inflige un malus de -1D sur tous les jets qui y sont liés."
    },
    Tégée: {
        banner: "/images/banners/bannertegee.png",
        title: "Tégée",
        text: "Lorsque les Caelius renversèrent la République de Lux et proclamèrent ouvertement la domination de leur dieu sur le monde, cela ne se fit pas sans troubles civils. Mais les usurpateurs avaient bien préparé leur coup et ils pouvaient compter sur le soutien d’un certain nombre de familles parmi les plus influentes de Lux. Dans les mois qui suivirent, des purges sanglantes eurent lieu à travers les cités de Viridia et au fur et à mesure que l’Empire naissant étendait son pouvoir, il repoussait de plus en plus loin ceux qui s’opposaient à son existence.",
        stats: "<b>Champ de compétences de prédilection:</b> l’Homme  Compétence de Débutant bonus   :  Arts ou Relationnel  Avantage – Entraînement militaire   :  comme de nombreux   Tégéens, le personnage a subi un entraînement militaire.   Il possède une spécialité de son choix dans une compé  -  tence de l’Arme. Il doit posséder la compétence liée au   niveau Débutant (au lieu de Confirmé) et cette spécialité   ne compte pas comme un Handicap sur le jet d’Expérience   lorsqu’il s’agit d’en apprendre d’autres.  Avantage – Ingénieux   : le personnage a un don pour analy  -<br><b>Compétence de Débutant bonus:</b> <br><br><b>Avantage – Entraînement militaire  :</b> comme de nombreux Tégéens, le personnage a subi un entraînement militaire. Il possède une spécialité de son choix dans une compé - tence de l’Arme. Il doit posséder la compétence liée au niveau Débutant (au lieu de Confirmé) et cette spécialité ne compte pas comme un Handicap sur le jet d’Expérience lorsqu’il s’agit d’en apprendre d’autres.<br><br><b>Avantage – Ingénieux  :</b> le personnage a un don pour analy - ne compte pas comme un Handicap sur le jet d’Expérience lorsqu’il s’agit d’en apprendre d’autres.<br><br><b>Avantage – Ingénieux  :</b> le personnage a un don pour analy - ser les choses et prendre du recul. Il bénéficie d’un bonus de +1D pour résoudre des énigmes ou mettre en place des stratégies.<br><br><b>Avantage – Marin  :</b> le personnage a un bonus de +1D sur tous les jets liés à la navigation (y compris pour s’orienter).<br><br><b>Avantage – Obstiné  :</b> les Tégéens sont pris entre le mar - teau de l’Empire et l’enclume de la Horde, pourtant, ils ne s’avouent jamais vaincus et résistent aux oppresseurs, ne baissant jamais la tête. Une fois par jour, le personnage peut regagner 1D d’Effort à tout moment. GODS / CRÉATION DU GROUPE ET DES PERSONNAGES / PAGE 305 Daniel Mascaron (Order #30639486)<br><br><b>Désavantage – Ennemi de l’Empire  :</b> la réputation du per - sonnage est considérée comme étant de 3 points inférieure pour les gens de la Tégée, de l’Empire et du Culte du Soleil Noir. Il a réalisé un acte qui l’a rendu héroïque pour les Tégéens, mais il est particulièrement haï de l’Empire et du Culte qui ont mis sa tête à prix et le traquent sans relâche.<br><br><b>Désavantage – Parangon d’humanité  :</b> le personnage incarne les plus hautes valeurs de l’humanité et de l’huma - nisme. Il s’élève contre toute forme d’abus et prendra tou - jours parti pour les opprimés. Pour ne pas mettre son grain de sel (voire s’opposer physiquement), il doit réussir un jet de Volonté Difficile (7) et, en cas d’échec, il peut dépenser 2D de Sang-Froid pour conserver son calme. Dans les Terres Sauvages, ce désavantage est pour le moins dur à vivre.<br><br><b>Désavantage – Rivalité  :</b> la rivalité opposant la Tégée à Lux est connue de tous. Le personnage subit un malus de -1D Sauvages, ce désavantage est pour le moins dur à vivre.<br><br><b>Désavantage – Rivalité  :</b> la rivalité opposant la Tégée à Lu"
    },
    Ool: {
        banner: "/images/banners/bannerool.png",
        title: "Ool",
        text: "Ool, la mystérieuse Terre des Maléfices, attire comme un sortilège puissant dans l'ombre de ses collines isolées au cœur d'une vaste savane. Ses neuf cités émergent telles des énigmes ancestrales voilées de récits de sorcellerie et de dirigeants masqués. La légende raconte que les origines d'Ool remontent aux disciples du sorcier Ool, maîtres d'arts sombres nés des profondeurs de la jungle de Tuuhle. Ces neuf sorciers masqués règnent sur les cités, chacun enveloppé de mystère et de pouvoir qui transcende les années mortelles, réputés pour maîtriser une magie appelée Matsenga, bien au-delà de la portée des Juju communs pratiqués par les charlatans et les chercheurs de pouvoir de la cité. Pour les aventuriers attirés par Ool, l'attrait est multiple. Au milieu des marchés animés de Soolor et de Bambelli, les guérisseurs et les enchanteurs vendent leurs marchandises mystiques, tandis que les astrologues de Libiss prédisent les destinées dans les nuits étoilées. Les étrangers fortunés d'Alambara, de Loon et de Thula se délectent dans les vices opulents à l'abri des jugements, témoignage de l'accueil d'Ool pour ceux qui cherchent refuge loin des regards scrutateurs. Mais sous le vernis de l'indulgence et du commerce, Ool palpite d'un courant plus sombre — là où le véritable pouvoir réside entre les mains des insaisissables Maîtres Sorciers. Leurs masques, vénérés comme des conduits d'omniscience et des symboles d'autorité, jettent une ombre sur chaque recoin d'Ool, où même les os des défunts trouvent leur utilité dans des talismans complexes gravés de runes protectrices.",
        stats: "<b>Champ de compétences de prédilection:</b> l’Inconnu  Compétence  de  Débutant  bonus    :  Mythes ou Rituels   ; la   compétence Rituels est considérée comme Rare (I) pour une   personne originaire du peuple de Ool et la compétence   Mythes n’est pas Rare.  Avantage – Inébranlable   :  un habitant des neuf cités n’est   pas facilement intimidé ou effrayé. Il bénéficie d’un bonus   de +1D pour résister à l’intimidation ou à la peur.  Avantage – Lien funeste   :  le personnage est, pour une rai  -<br><b>Compétence de Débutant bonus:</b> <br><br><b>Avantage – Inébranlable  :</b> un habitant des neuf cités n’est pas facilement intimidé ou effrayé. Il bénéficie d’un bonus de +1D pour résister à l’intimidation ou à la peur.<br><br><b>Avantage – Lien funeste  :</b> le personnage est, pour une rai - pas facilement intimidé ou effrayé. Il bénéficie d’un bonus de +1D pour résister à l’intimidation ou à la peur.<br><br><b>Avantage – Lien funeste  :</b> le personnage est, pour une rai - son ou pour une autre, lié à l’Essence de la Mort. La difficulté des jets d’Expérience pour acquérir les Faveurs liées à l’Es - sence de la Mort est réduite de 1.<br><br><b>Avantage – Terrifiante réputation  :</b> le personnage gagne un bonus de +1D sur tous les jets visant à intimider ou effrayer quelqu’un qui n’est pas de Ool.<br><br><b>Désavantage – Hématophage  :</b> le personnage doit consommer quotidiennement du sang ou de la viande crue et fraîche. En fait, pour absorber quoi que ce soit d’autre, hormis de l’eau, il doit réussir un jet de Résistance ou de Volonté – le plus faible des deux – Difficile (7) ou tout régur - giter immédiatement. Il semble que cette affliction soit assez courante dans les neuf cités de Ool...<br><br><b>Désavantage – Marqué par la mort  :</b> le personnage semble - giter immédiatement. Il semble que cette affliction soit assez courante dans les neuf cités de Ool...<br><br><b>Désavantage – Marqué par la mort  :</b> le personnage semble mort depuis quelque temps. Sa peau est extrêmement pâle ou grisâtre, ses yeux légèrement voilés (ce qui ne le han - dicape en rien) et même sa peau paraît froide au toucher. Cette apparence dérange et peut lui infliger un malus de -1D sur ses jets de Relationnel selon les situations (bien qu’il puisse toujours dissimuler son apparence ou user de cos - métiques). Si le personnage est un Élu, son Éclat ne peut pas posséder la sphère d’influence de la miséricorde. En outre, il ne peut pas utiliser de Faveurs ou rituels liés à l’Essence de la Vie (il peut cependant bénéficier normalement de leurs effets). GODS / CRÉATION DU GROUPE ET DES PERSONNAGES / PAGE 304 Daniel Mascaron (Order #30639486)<br><br><b>Désavantage – Nature cruelle  :</b> les habitants des neuf cités de Ool sont connus pour leur cruauté et leur d"
    },
};


function formatStatsWithSelection(rawStats) {
    const parts = rawStats.split('<br><br>');
    let newParts = [];
    
    let hasAdvantage = false;
    let hasDisadvantage = false;
    
    for (let part of parts) {
        if (part.includes('<b>Avantage')) {
            const match = part.match(/<b>Avantage(?:\s+|&nbsp;|&#160;|\u2013|-)*([^\:]+)\s*:\s*<\/b>(.*)/s);
            if (match) {
                if (!hasAdvantage) {
                    newParts.push('<div style="margin-top: 10px;"><strong>Choisissez au maximum un Avantage :</strong></div>');
                    newParts.push(`<div><label><input type="radio" name="origin_advantage" value="none" checked> <i>Aucun Avantage</i></label></div>`);
                    hasAdvantage = true;
                }
                const name = match[1].trim().replace(/^[-–—]\s*/, '');
                const desc = match[2];
                newParts.push(`<div style="margin-left: 15px; margin-bottom: 5px;"><label><input type="radio" name="origin_advantage" value="${name}"> <b>${name} :</b> ${desc}</label></div>`);
                continue;
            }
        }
        
        if (part.includes('<b>Désavantage')) {
            const match = part.match(/<b>Désavantage(?:\s+|&nbsp;|&#160;|\u2013|-)*([^\:]+)\s*:\s*<\/b>(.*)/s);
            if (match) {
                if (!hasDisadvantage) {
                    newParts.push('<div style="margin-top: 10px;"><strong>Choisissez au maximum un Désavantage :</strong></div>');
                    newParts.push(`<div><label><input type="radio" name="origin_disadvantage" value="none" checked> <i>Aucun Désavantage</i></label></div>`);
                    hasDisadvantage = true;
                }
                const name = match[1].trim().replace(/^[-–—]\s*/, '');
                const desc = match[2];
                newParts.push(`<div style="margin-left: 15px; margin-bottom: 5px;"><label><input type="radio" name="origin_disadvantage" value="${name}"> <b>${name} :</b> ${desc}</label></div>`);
                continue;
            }
        }
        
        if (part.includes('<b>Capacité d\'Instinct')) {
            const match = part.match(/<b>Capacité d\'Instinct(?:\s+|&nbsp;|&#160;|\u2013|-)*([^\:]+)\s*:\s*<\/b>(.*)/s);
            if (match) {
                const name = match[1].trim().replace(/^[-–—]\s*/, '');
                const desc = match[2];
                // Try to find if we already added the radio group description
                if (!newParts.some(p => p.includes('Choisissez votre Capacité d\'Instinct'))) {
                    newParts.push('<div style="margin-top: 10px;"><strong>Choisissez votre Capacité d\'Instinct :</strong></div>');
                }
                // default checked on the first one
                const isChecked = newParts.some(p => p.includes('name="instinct_capacite"')) ? '' : 'checked';
                newParts.push(`<div style="margin-left: 15px; margin-bottom: 5px;"><label><input type="radio" name="instinct_capacite" value="${name}" ${isChecked}> <b>${name} :</b> ${desc}</label></div>`);
                continue;
            }
        }
        
        newParts.push(part);
    }
    return newParts.join('<br><br>');
}

document.getElementById('origineSelect').addEventListener('change', function () {
    const selectedValue = this.value;
    const description = descriptions[selectedValue];

    if (description) {
        document.getElementById('bannerImage').src = description.banner;
        document.getElementById('originTitle').innerText = description.title;
        let statsHtml = "";
        if (description.stats) {
            statsHtml = "<div style='margin-top: 15px; color: #a33; border-top: 1px solid #ddd; padding-top: 10px;'>" + formatStatsWithSelection(description.stats) + "</div>";
        }
        document.getElementById('originText').innerHTML = description.text + statsHtml;
    }
});

// Trigger change event to load the initial origin's stats
document.getElementById('origineSelect').dispatchEvent(new Event('change'));



const instinctDescriptions = {
    architecte: {
        title: "L’Architecte",
        text: "L'Architecte planifie et construit. Que serait la civilisation sans lui ? Il bâtit des cités aux tours effleurant les cieux, dernier rempart face au chaos qui menace d'engloutir le monde.",
        stats: "<b>Capacité d'Instinct – Don de l’Architecte :</b> une fois par jour, le personnage peut réaliser un jet de Volonté + Vigilance Facile (5) (il n’est pas possible de dépenser des dés de Réserve ou de Jauge sur ce jet) et note le nombre de réussites. Ces réussites sont autant de dés de bonus qui peuvent être utilisés sur n’importe quel jet lié aux compétences de l’Homme et de l’Outil. Ces dés sont perdus lorsque la journée s’achève.<br><br><b>Capacité d'Instinct – Mains du créateur :</b> le personnage gagne un bonus de +1D sur tous ses jets d’Artisanat et d’Armurerie."
    },
    epee: {
        title: "L’Épée",
        text: "L'Épée est mue par un désir de gloire et de conquête. Elle possède un code, quelque chose qui l'empêche de sombrer dans la démence sanguinaire : une conception très personnelle de l'honneur.",
        stats: "<b>Capacité d'Instinct – Pour la gloire :</b> lorsque le personnage affronte seul et au contact un adversaire représentant au moins une Menace Mortelle, ou au moins deux adversaires représentant une Menace Sérieuse en même temps, il gagne un bonus de +1D sur ses actions d’attaque au contact contre ces adversaires.<br><br><b>Capacité d'Instinct – Ultime contre-attaque :</b> une fois par jour, lorsque le personnage subit une Blessure Mortelle au contact, il peut immédiatement réaliser une contre-attaque contre une difficulté fixe de 5 avant de s’écrouler."
    },
    fleau: {
        title: "Le Fléau",
        text: "Le Fléau incarne la destruction sous son aspect le plus brutal. Ses hordes se déversent sur le monde ; ils ne respectent qu'une seule loi : celle du plus fort.",
        stats: "<b>Capacité d'Instinct – Avantage du fort :</b> lorsque le personnage affronte un adversaire qui a subi au moins une Blessure Grave, il bénéficie d’une relance gratuite sur ses actions d’attaque au contact contre cet adversaire (les contre-attaques ne sont pas concernées).<br><br><b>Capacité d'Instinct – Extase du carnage :</b> dès que le personnage inflige une Blessure Mortelle à un adversaire, il regagne 1D dans sa Réserve d’Effort ou de Sang-Froid (au choix)."
    },
    gardien: {
        title: "Le Gardien",
        text: "Toute communauté a besoin d'un Gardien. Ceux qui se placent sous son bras protecteur abandonnent un peu de leur liberté, conscients que leurs chances de survie n'en seront que meilleures.",
        stats: "<b>Capacité d'Instinct – Don du Gardien :</b> le personnage peut se sacrifier pour absorber les dégâts d'une attaque visant un allié adjacent.<br><br><b>Capacité d'Instinct – Esprit de Groupe :</b> une fois par jour, le personnage peut réaliser un jet d’Empathie + Relationnel Difficile (7) pour rassembler les membres du groupe. Chaque réussite fait regagner 1D dans la Réserve de Groupe."
    },
    homme: {
        title: "L’Homme",
        text: "L'Homme est l'Instinct qui préside à la grandeur de l'humanité, à son évolution, à son illumination. La survie de l'humanité n'est pas assurée par des actes individuels, mais collectifs.",
        stats: "<b>Capacité d'Instinct – Exaltation :</b> le personnage a un don pour inspirer ses semblables. Il octroie +1D à la résolution d'une action commune.<br><br><b>Capacité d'Instinct – Médiocrité de l’Homme :</b> un nombre de fois par jour égal à sa Volonté, le personnage peut infliger un malus de -1D sur n’importe quel jet de compétence d’un autre personnage qu’il peut voir. Si ce jet est un échec, le personnage utilisant Médiocrité de l’Homme regagne 1D dans chacune de ses Réserves."
    },
    main: {
        title: "La Main",
        text: "La Main ne vit que pour le frisson de la transgression et l'accumulation de richesses. L'acte prime avant tout : trahir, manipuler, voler, et agir dans l'ombre.",
        stats: "<b>Capacité d'Instinct – Savoir, c’est pouvoir :</b> un nombre de fois par jour égal à son niveau en Connaissance, le personnage peut remplacer n’importe quelle caractéristique par sa caractéristique de Connaissance.<br><br><b>Capacité d'Instinct – La récompense du savoir :</b> une fois par jour, lorsque le personnage réussit un jet de Connaissance en obtenant au moins trois réussites, il regagne 3D de Réserve (répartis comme il le souhaite)."
    },
    masque: {
        title: "Le Masque",
        text: "Le Masque inspire un goût prononcé pour le mystère, le partage des connaissances et une grande soif de savoirs, peu importe le prix à payer pour les obtenir.",
        stats: "<b>Capacité d'Instinct – Saisir l’opportunité :</b> lorsque le personnage dépense des dés de Sang-Froid sur un jet d’Adresse ou de Discrétion, il bénéficie d’un dé bonus supplémentaire qui ne compte pas dans la limite de dés de Réserve fixée par la caractéristique utilisée.<br><br><b>Capacité d'Instinct – Maître de la Main :</b> tous les jours, le personnage bénéficie de deux réussites automatiques qu’il peut appliquer à ses jets d’Adresse ou de Discrétion."
    },
    neant: {
        title: "Le Néant",
        text: "Le Néant refuse qu'on ait construit. Il porte l'entropie et efface les traces de ce qui fut : un magma d'où tout sort et où tout revient.",
        stats: "<b>Capacité d'Instinct – Oubli :</b> le personnage est imperméable aux charmes et illusions, annulant un sort une fois par jour.<br><br><b>Capacité d'Instinct – Chaos croissant :</b> chaque fois que l'environnement s'effondre ou dans le noir absolu, il gagne 1D."
    },
    os: {
        title: "L’Os",
        text: "L'Os n'existe que pour assouvir sa soif morbide, au mépris de tout équilibre. Connecté à la mort qui nourrit son pouvoir, la mort n'est pour lui qu'un début.",
        stats: "<b>Capacité d'Instinct – Saveur de la Mort :</b> la première fois que le personnage tue une créature lors d’une journée, la sensation est si intense qu’il regagne un nombre de dés de Sang-Froid et d’Effort (répartis comme il le souhaite) en fonction du niveau d’Expérience de sa victime.<br><br><b>Capacité d'Instinct – Aux portes de la mort :</b> une fois par jour, lorsque le personnage subit une première Blessure Mortelle, il est automatiquement stabilisé sans avoir besoin de soins d’urgence."
    },
    voyageur: {
        title: "Le Voyageur",
        text: "Le Voyageur est un pèlerin dont la destination sacrée se trouve sous chaque pierre. Sa quête n'a pas de fin, il explore de nouveaux horizons, poussé par sa curiosité.",
        stats: "<b>Capacité d'Instinct – Endurance naturelle :</b> exposé aux rigueurs du milieu naturel, le corps du personnage a développé une grande capacité d’adaptation. Ses pertes de dés sur ses Réserves ne sont pas augmentées de 1D sous températures extrêmes.<br><br><b>Capacité d'Instinct – Récupération accélérée :</b> le personnage doit dépenser 1D de Réserve de moins pour soigner ses blessures."
    }
};

let instinctSelect = document.getElementById('instinctSelect');
if (!instinctSelect) {
    instinctSelect = document.querySelector('select[name="instinct"]');
    if (instinctSelect) {
        instinctSelect.id = 'instinctSelect';
    }
}

if (instinctSelect) {
    // If the HTML hasn't updated due to twig caching, create the description block manually!
    if (!document.getElementById('instinctDescriptionBlock')) {
        const p1 = instinctSelect.nextElementSibling;
        const p2 = p1 ? p1.nextElementSibling : null;
        if (p1 && p1.tagName === 'P') p1.style.display = 'none';
        if (p2 && p2.tagName === 'P') p2.style.display = 'none';

        const blockHTML = `
            <div id="instinctDescriptionBlock" class="originDescription" style="margin-top: 20px;">
                <div class="row">
                    <div class="textorigin col-12">
                        <h3 id="instinctTitle">L’Architecte</h3>
                        <p id="instinctText">L'Architecte planifie et construit. Que serait la civilisation sans lui ? Il bâtit des cités aux tours effleurant les cieux, dernier rempart face au chaos qui menace d'engloutir le monde.</p>
                    </div>
                </div>
            </div>
        `;
        instinctSelect.insertAdjacentHTML('afterend', blockHTML);
    }

    instinctSelect.addEventListener('change', function () {
        const selectedValue = this.value;
        const description = instinctDescriptions[selectedValue];

        if (description) {
            document.getElementById('instinctTitle').innerText = description.title;
            let finalHtml = description.text;
            if (description.stats) {
                finalHtml += "<div style='margin-top: 15px; color: #33a; border-top: 1px solid #ddd; padding-top: 10px;'>" + formatStatsWithSelection(description.stats) + "</div>";
            }
            document.getElementById('instinctText').innerHTML = finalHtml;
        }
    });

    // Manually dispatch change event to set initial text
    instinctSelect.dispatchEvent(new Event('change'));
}

const signeastroDescriptions = {
    "Loup": {
        title: "Le Loup",
        stat: "Faune",
        text: "Les gens nés sous le signe du Loup sont persévérants, prudents et solidaires, ce sont des idéalistes fidèles à leurs amis. Ils ressentent également un lien profond avec la nature, ce qui a tendance à orienter le choix de leur profession."
    },
    "Enfant": {
        title: "L’Enfant",
        stat: "Civilisations",
        text: "Ceux qui naissent sous le signe de l’Enfant sont souvent sensibles, doués d’une formidable imagination et d’une grande créativité. Ils sont à l’aise en société, bien qu’ils accordent difficilement leur confiance et puissent aisément douter d’eux-mêmes."
    },
    "Arbre": {
        title: "L’Arbre",
        stat: "Flore",
        text: "Le signe de l’Arbre est souvent synonyme de courage, mais également d’impulsivité et d’autorité. Ceux qui naissent sous ce signe possèdent généralement une grande indépendance et sont mus par un profond désir de liberté."
    },
    "Sceptre": {
        title: "Le Sceptre",
        stat: "Relationnel",
        text: "Ceux qui sont nés sous le signe du Sceptre sont appliqués, réfléchis et privilégient les contacts humains, ils ont cependant tendance à profiter un peu trop des plaisirs de la vie et à se laisser facilement aller à l’oisiveté."
    },
    "Tourbillon": {
        title: "Le Tourbillon",
        stat: "Athlétisme",
        text: "Les gens nés sous le signe du Tourbillon sont tenaces, éloquents et savent s’adapter à toute circonstance, mais ils sont souvent dévorés par l’ambition et possèdent un orgueil que d’aucuns qualifieraient de démesuré."
    },
    "Vautour": {
        title: "Le Vautour",
        stat: "Vigilance",
        text: "Le signe du Vautour inspire des caractères passionnés, attentifs et coriaces. Mais ceux qui naissent sous ses auspices sont aussi esclaves de pulsions qui peuvent s’avérer destructrices. Ils ressentent le besoin d’être admirés et peuvent être influencés par quiconque saura leur susurrer les bons mots à l’oreille."
    },
    "Voyage": {
        title: "Le Navire (Voyage)",
        stat: "Voyage",
        text: "Ceux qui sont nés sous ce signe sont taillés pour le voyage. Indépendants et incapables de rester en place, l’impatience compte parmi leurs plus grands défauts. Il en résulte une certaine tendance à opter pour des solutions extrêmes, bien que rapides et efficaces."
    },
    "Glaive": {
        title: "Le Glaive",
        stat: "Armurerie",
        text: "Les enfants du Glaive sont patients, prudents, lucides et persévérants. Ils peuvent cependant s’avérer austères, insensibles et complètement hermétiques aux idées d’autrui tant ils se bornent à leur propre logique."
    },
    "Chat": {
        title: "Le Chat",
        stat: "Discrétion",
        text: "Ceux du Chat sont détachés, perspicaces et souvent indifférents aux choses matérielles. Parfois rebelles, instables ou excentriques, ils sont ceux dont l’esprit est le plus orienté vers la « spiritualité »."
    }
};

let signeastroSelect = document.getElementById('signeastroSelect');
if (!signeastroSelect) {
    signeastroSelect = document.querySelector('select[name="signeastro"]');
    if (signeastroSelect) {
        signeastroSelect.id = 'signeastroSelect';
        // Cleanup old options if they have the text fallback
        Array.from(signeastroSelect.options).forEach(opt => {
            if (opt.text.includes(':')) {
                opt.text = signeastroDescriptions[opt.value]?.title || opt.text;
            }
        });
    }
}

if (signeastroSelect) {
    if (!document.getElementById('signeastroDescriptionBlock')) {
        const blockHTML = `
            <div id="signeastroDescriptionBlock" class="originDescription" style="margin-top: 20px;">
                <div class="row">
                    <div class="textorigin col-12">
                        <h3 id="signeastroTitle">Le Loup</h3>
                        <p id="signeastroStat" style="font-weight: bold; color: #a33;">Compétence bonus : Faune</p>
                        <p id="signeastroText">Les gens nés sous le signe du Loup sont persévérants, prudents et solidaires, ce sont des idéalistes fidèles à leurs amis. Ils ressentent également un lien profond avec la nature, ce qui a tendance à orienter le choix de leur profession.</p>
                    </div>
                </div>
            </div>
        `;
        signeastroSelect.insertAdjacentHTML('afterend', blockHTML);
    }

    signeastroSelect.addEventListener('change', function () {
        const selectedValue = this.value;
        const description = signeastroDescriptions[selectedValue];

        if (description) {
            document.getElementById('signeastroTitle').innerText = description.title;
            document.getElementById('signeastroStat').innerText = "Compétence bonus : " + description.stat;
            document.getElementById('signeastroText').innerHTML = description.text;
        }
    });

    signeastroSelect.dispatchEvent(new Event('change'));
}


// --- VALIDATION TRACKER LOGIC ---
document.addEventListener('DOMContentLoaded', function() {
    const characteristicsNames = ['puissance', 'resistance', 'precicion', 'reflexes', 'connaissance', 'perception', 'volonte', 'empathie'];
    const skillsNames = ['arts', 'cite', 'civilisations', 'relationnel', 'soins', 'animalisme', 'faune', 'montures', 'pistage', 'territoire', 'adresse', 'armurerie', 'artisanat', 'mecanisme', 'runes', 'athletisme', 'discretion', 'flore', 'vigilance', 'voyage', 'bouclier', 'cac', 'lancer', 'melee', 'tir', 'eclats', 'lunes', 'mythes', 'pantheons', 'rituels'];
    
    const container = document.getElementById('character-creation-form-container');
    if (!container) return;
    
    const trackerHTML = `
        <div id="stats-tracker" style="position: sticky; top: 0; background: #222; border: 1px solid #555; padding: 10px; margin-bottom: 20px; z-index: 1000; border-radius: 5px; color: #eee; box-shadow: 0 4px 6px rgba(0,0,0,0.5);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4 style="margin: 0 0 5px 0; font-size: 14px; color: #aaa;">Caractéristiques (Base 1D)</h4>
                    <span id="char-status" style="font-weight: bold;">0 / 8 points répartis</span>
                    <div id="char-error" style="color: #ff4444; font-size: 12px; display: none;">Max 3D par carac !</div>
                </div>
                <div>
                    <h4 style="margin: 0 0 5px 0; font-size: 14px; color: #aaa;">Compétences</h4>
                    <span id="skill-status" style="font-weight: bold;">0 / 13 points (1x3D, 2x2D, 3x1D + 3 Libres)</span>
                    <div id="skill-error" style="color: #ff4444; font-size: 12px; display: none;">Répartition invalide !</div>
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('afterbegin', trackerHTML);

    const charStatus = document.getElementById('char-status');
    const charError = document.getElementById('char-error');
    const skillStatus = document.getElementById('skill-status');
    const skillError = document.getElementById('skill-error');
    const submitBtn = document.getElementById('submit');

    function checkValidation() {
        let charSum = 0;
        let charMaxExceeded = false;
        
        characteristicsNames.forEach(name => {
            const el = document.querySelector(`select[name="${name}"]`);
            if (el) {
                const val = parseInt(el.value) || 1;
                charSum += val;
                if (val > 3) charMaxExceeded = true;
            }
        });
        
        // Base is 1 * 8 = 8. Points distributed = charSum - 8. Max distributed = 8.
        const charDistributed = charSum - 8;
        
        if (charDistributed === 8 && !charMaxExceeded) {
            charStatus.style.color = '#44ff44';
            charStatus.innerText = `8 / 8 points répartis`;
            charError.style.display = 'none';
        } else {
            charStatus.style.color = '#ffcc00';
            charStatus.innerText = `${charDistributed} / 8 points répartis`;
            if (charMaxExceeded) {
                charError.innerText = "Max 3D par caractéristique !";
                charError.style.display = 'block';
            } else if (charDistributed > 8) {
                charError.innerText = "Trop de points répartis !";
                charError.style.display = 'block';
            } else {
                charError.style.display = 'none';
            }
        }
        
        let skillLevels = [];
        let skillSum = 0;
        let skillMaxExceeded = false;
        
        skillsNames.forEach(name => {
            const el = document.querySelector(`select[name="${name}"]`);
            if (el) {
                const val = parseInt(el.value) || 0;
                if (val > 0) {
                    skillLevels.push(val);
                    skillSum += val;
                    if (val > 3) skillMaxExceeded = true;
                }
            }
        });
        
        skillLevels.sort((a, b) => b - a); // descending
        
        // conditions: sum == 13, max <= 3, pointwise domination of [3, 2, 2, 1, 1, 1]
        const baseSkillRequirement = [3, 2, 2, 1, 1, 1];
        let dominationValid = true;
        
        for (let i = 0; i < baseSkillRequirement.length; i++) {
            const currentSkill = skillLevels[i] || 0;
            if (currentSkill < baseSkillRequirement[i]) {
                dominationValid = false;
                break;
            }
        }
        
        const isSkillValid = (skillSum === 13 && dominationValid && !skillMaxExceeded);
        
        if (isSkillValid) {
            skillStatus.style.color = '#44ff44';
            skillStatus.innerText = `${skillSum} / 13 points (Répartition correcte)`;
            skillError.style.display = 'none';
        } else {
            skillStatus.style.color = '#ffcc00';
            skillStatus.innerText = `${skillSum} / 13 points lus`;
            if (skillMaxExceeded) {
                skillError.innerText = "Max 3D par compétence !";
                skillError.style.display = 'block';
            } else if (!dominationValid && skillSum <= 13) {
                skillError.innerText = "Il manque les bases (1x3D, 2x2D, 3x1D)";
                skillError.style.display = 'block';
            } else if (skillSum > 13) {
                skillError.innerText = "Trop de points répartis !";
                skillError.style.display = 'block';
            } else {
                 skillError.innerText = "Répartition incomplète/invalide.";
                 skillError.style.display = 'block';
            }
        }
        
        // Automatically hide Options > 3 in selects
        characteristicsNames.forEach(name => {
            const el = document.querySelector(`select[name="${name}"]`);
            if (el) {
                Array.from(el.options).forEach(opt => {
                    if (parseInt(opt.value) > 3) opt.style.display = 'none';
                });
            }
        });
        skillsNames.forEach(name => {
            const el = document.querySelector(`select[name="${name}"]`);
            if (el) {
                Array.from(el.options).forEach(opt => {
                    if (parseInt(opt.value) > 3) opt.style.display = 'none';
                });
            }
        });

        if (submitBtn) {
            submitBtn.disabled = !(charDistributed === 8 && !charMaxExceeded && isSkillValid);
            if (submitBtn.disabled) {
                submitBtn.style.opacity = '0.5';
                submitBtn.style.cursor = 'not-allowed';
                submitBtn.title = "Veuillez répartir vos points correctement.";
            } else {
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
                 submitBtn.title = "";
            }
        }
    }

    // Attach listeners
    characteristicsNames.forEach(name => {
        const el = document.querySelector(`select[name="${name}"]`);
        if (el) el.addEventListener('change', checkValidation);
    });
    skillsNames.forEach(name => {
        const el = document.querySelector(`select[name="${name}"]`);
        if (el) el.addEventListener('change', checkValidation);
    });
    
    // Equipment logic: Max 5 items
    const equipCheckboxes = document.querySelectorAll('.equip-checkbox');
    equipCheckboxes.forEach(cb => {
        cb.addEventListener('change', function() {
            const checkedCount = document.querySelectorAll('.equip-checkbox:checked').length;
            if (checkedCount > 5) {
                alert("Vous ne pouvez sélectionner que 5 pièces d'équipement au maximum.");
                this.checked = false;
            }
        });
    });

    // Initial check
    setTimeout(checkValidation, 100);
});
