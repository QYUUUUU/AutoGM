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

const origineDescriptions = {
    Aon: {
        banner: "/images/banners/banneraon.png",
        title: "Aon",
        text: `Aux yeux du reste du monde, les insulaires d’Aon sont des gens taiseux, vêtus de couleurs ternes, qui vivent dans un archipel pluvieux. Ils forment un peuple sévère, quittant rarement ses îles natales, si ce n’est pour se livrer à la piraterie. Les charpentiers qui construisent les bateaux d’Aon sont renommés, mais plus encore les maîtres-forgerons, ainsi que les Hommes d’Acier, seuls à connaître le secret pour obtenir l’Acier Véritable, métal incomparable dans lequel sont forgées des épées rarissimes.<br>S’ils ne s’opposent pas à ce que les étrangers accostent dans leurs ports, les gens d’Aon ne se montrent guère hospitaliers. Qui plus est, la rigueur du climat, le caractère farouche des autochtones et le peu d’importance qu’ils attachent à la cuisine ne contribuent pas à rendre leurs auberges attrayantes. Néanmoins, ceux qui parviennent à se lier aux natifs d’Aon découvrent rapidement des gens attentifs, dotés d’une ironie tranquille et d’une parole on ne peut plus fiable.`,
        stats: "<b>Champ de compétences de prédilection :</b> les Terres Sauvages<br><b>Compétence de Débutant bonus :</b> Voyage ou Lunes<br><br><b>Avantage – Art de la forge :</b> le personnage bénéficie d’une relance gratuite sur ses jets d’Armurerie et cette compétence n’est pas considérée comme Rare pour les gens d’Aon.<br><br><b>Avantage – Marin :</b> bonus de +1D sur tous les jets liés à la navigation (y compris pour s’orienter).<br><br><b>Désavantage – Bourru :</b> d’un naturel rugueux, le personnage subit un malus de -1D sur tous ses jets de Relationnel avec les autres peuples.<br><br><b>Désavantage – Marin d’eau douce :</b> le personnage est malade dès qu’il est sur une embarcation. Il doit réussir un jet de Résistance Difficile (7) ou vomir tripes et boyaux, subissant une Blessure Légère et perdant 2D de Réserve au lieu de 1D à cause de cette Blessure (la Blessure ne peut être soignée et le personnage ne regagne aucun dé de Réserve tant qu’il n’a pas posé le pied à terre). En mer agitée, un Handicap (I ou II) peut s'appliquer."
    },

    Avhorae: {
        banner: "/images/banners/banneravhorae.png",
        title: "Avhorae",
        text: "Avhorae (prononcé « Avhoré ») a toujours été une nation paradoxale : riche et fruste, civilisée et violente, moderne et superstitieuse. Ses villes de belle taille sont prospères et abritent nombre de centres d’érudition et de marchés importants, alors que ses paysans illettrés vivent pauvrement, en bordure de forêts impénétrables, sous la menace de bêtes sauvages. Les Avhoraeens ont toujours considéré les autres peuples avec une certaine condescendance.",
        stats: "<b>Champ de compétences de prédilection :</b> l’Arme<br><b>Compétence de Débutant bonus :</b> Corps à corps ou Mêlée<br><br><b>Avantage – Combattant :</b> possède la spécialité Poings (Corps à corps) ou Épée (Mêlée). Il doit posséder la compétence liée au niveau Débutant et cette spécialité ne compte pas comme un Handicap sur le jet d’Expérience.<br><br><b>Avantage – D’un sang ancien :</b> le sang des anciennes druidesses coule dans les veines du personnage. Les compétences Lunes et Rituels ne sont pas considérées comme Rares pour lui.<br><br><b>Désavantage – Haine du Culte :</b> malus de -1D sur tous les jets de Relationnel avec les membres du Culte et doit dépenser 1D de Sang-Froid pour ne pas attaquer immédiatement s’il est provoqué par un serviteur du Soleil Noir.<br><br><b>Désavantage – Marqué par le Sacrilège :</b> la lignée a été « infectée » par l’un des Sept Sacrilèges (Arrogance, Cruauté, Destruction, Hubris, Perversion, Rapacité ou Voracité). Pour ne pas s'y abandonner totalement, il doit réussir un jet de Volonté Difficile (7) ou perdre 2D de Sang-Froid. Le Sacrilège doit être en opposition avec la nature du personnage."
    },

    Babel: {
        banner: "/images/banners/bannerbabel.png",
        title: "Babel",
        text: "Babel, surnommé le Centre du Monde, est un royaume d’une richesse et d’une influence inégalées, dont la capitale, Sabaah-aux-jardins-célestes, éblouit par sa splendeur. Au cœur de l'Arkadie, région historique et prospère, la culture raffinée de Babel rayonne, mêlant traditions anciennes et innovations audacieuses.",
        stats: "<b>Champ de compétences de prédilection :</b> l’Homme<br><b>Compétence de Débutant bonus :</b> Civilisations ou Soins (Runes n’est pas Rare pour Babel).<br><br><b>Avantage – Grâce du Siirh :</b> grâce et beauté exceptionnelles. Sur un jet lié à Arts (chant, danse) ou Relationnel (charme), bénéficie d’un bonus de +1D.<br><br><b>Avantage – Issu du peuple :</b> bonus de +1D sur les jets de Relationnel.<br><br><b>Avantage – Lien essentiel :</b> lié à l’Essence de l’Eau ou du Soleil (choix). La difficulté des jets d’Expérience pour acquérir les Faveurs de l'Essence choisie est abaissée de 1.<br><br><b>Désavantage – Haine du Culte :</b> malus de -1D sur les jets de Relationnel avec le Culte et doit dépenser 1D de Sang-Froid pour ne pas attaquer immédiatement si provoqué.<br><br><b>Désavantage – Lié au fleuve sacré :</b> porte un objet issu du Siirh. S’il le perd et qu’il est loin du Siirh, subit un malus de -1D sur tous ses jets sociaux et mentaux jusqu’à ce qu’il puisse le remplacer."
    },

    Fakhar: {
        banner: "/images/banners/bannerkhalistan.png",
        title: "Fakhar",
        text: "Autrefois rival de Sabaah, le Fakhar fait aujourd'hui partie du Khalistan. C'est un pays de contrastes, soumis aux vents maritimes et désertiques, qui se distingue par ses cités richement décorées. Les terres fertiles du Fakhar produisent des teintures et des épices, tandis que ses habitants sont réputés pour leur hospitalité et leur sens du commerce.",
        stats: "<b>Champ de compétences de prédilection :</b> l’Homme<br><b>Compétence de Débutant bonus :</b> Civilisations ou Relationnel<br><br><b>Avantage – Négociant né :</b> bonus de +1D sur tous les jets liés au commerce ou à la négociation.<br><br><b>Avantage – Optimisme :</b> une fois par jour, le personnage peut regagner 1D de Réserve au choix.<br><br><b>Désavantage – Apparences :</b> goût prononcé pour les beaux habits. S'il n'est pas présentable (sale, crotté), subit un malus de -1D sur ses jets sociaux.<br><br><b>Désavantage – Mépris de la violence :</b> la difficulté du jet de Réaction en état « offensif » passe à 6 au lieu de 5. Si l'adversaire n'est pas menaçant, il ne peut jamais être en état offensif (au mieux « actif »)."
    },

    Khashan: {
        banner: "/images/banners/bannerkhalistan.png",
        title: "Khashan",
        text: "Le Khashan forme l'autre moitié du Khalistan. Contrairement au Fakhar coloré, le Khashan se distingue par son austérité silencieuse. Ses terres excellent dans la production de fer et d'acier, et ses habitants sont imprégnés par les mystères du désert et les secrets de Barzakh.",
        stats: "<b>Champ de compétences de prédilection :</b> l’Inconnu<br><b>Compétence de Débutant bonus :</b> Lunes ou Mythes (non Rares pour Khashan).<br><br><b>Avantage – Maître de son destin :</b> une fois par jour, peut utiliser une relance gratuite sur le jet de son choix.<br><br><b>Avantage – Maître des arts :</b> bonus de +1D sur tous les jets liés à la poésie et aux arts.<br><br><b>Avantage – Science céleste :</b> spécialité gratuite parmi : Astrologie (Lunes), Légendes (Mythes) ou Anciens Dieux (Panthéons).<br><br><b>Désavantage – Marqué par le destin :</b> une fois par jour, l’Oracle peut faire relancer un dé de son choix au joueur. Si la relance est une réussite et que le personnage est un Élu, il gagne 1D d’Humanité.<br><br><b>Désavantage – Réservé :</b> malus de -1D sur tous les jets de Relationnel avec les non-Khashani.<br><br><b>Désavantage – Voilé :</b> masque son visage en toutes circonstances. Se dévoiler coûte 2D de Sang-Froid. Parler fort demande un jet de Volonté Difficile (7)."
    },

    "Empire du Soleil Noir": {
        banner: "/images/banners/bannercultedusoleil.png",
        title: "Empire du Soleil Noir",
        text: "Dominé par la puissante cité de Lux, l'Empire est une théocratie militaire née d'un coup d'État sanglant. Le Culte du Soleil Noir y impose sa loi absolue. Lux, autrefois égale de Babel en raffinement, est devenue le cœur d'une expansion impitoyable portée par le Vox Aedes et les légions impériales.",
        stats: "<b>Champ de compétences de prédilection :</b> l’Homme<br><b>Compétence de Débutant bonus :</b> Cité ou Relationnel<br><br><b>Avantage – Entraînement militaire :</b> spécialité gratuite dans une compétence de l’Arme (niveau Débutant requis).<br><br><b>Avantage – Peuple du Culte :</b> bonus de +1D sur tous les jets liés à la connaissance du Culte ou de ses serviteurs.<br><br><b>Avantage – Esclave des mines :</b> relance gratuite sur tous les jets de Résistance.<br><br><b>Désavantage – Crainte du Culte :</b> malus de -1D sur les jets sociaux face à un membre du Culte de statut supérieur.<br><br><b>Désavantage – Marque du Soleil Noir :</b> tache de naissance noire qui inflige des douleurs (-1D global) durant 1d5 tours chaque fois que le joueur obtient deux « 10 » sur un jet. Se déclenche aussi pour les Élus utilisant l'Humain, le Soleil ou la Vie. Apaisable avec l'infusion de Siides."
    },

    Horde: {
        banner: "/images/banners/bannerhorde.png",
        title: "Horde",
        text: "Le peuple katai vivait autrefois dans la cité de Khokhan. Aujourd'hui nomades exilés dans le Grand Au-Delà, ils forment la Horde. C'est un peuple de cavaliers fiers et redoutés, dont l'aura est marquée par la rigueur de leur déesse Amarakh et l'impitoyable vie sauvage.",
        stats: "<b>Champ de compétences de prédilection :</b> les Terres Sauvages<br><b>Compétence de Débutant bonus :</b> Monture ou Voyage<br><br><b>Avantage – Né sur un cheval :</b> spécialité Équitation (Monture) ou Campement (Voyage) gratuite.<br><br><b>Avantage – Terrifiante réputation :</b> bonus de +1D sur les jets d'intimidation contre les non-membres de la Horde.<br><br><b>Désavantage – Aura de la mort :</b> aura quasi surnaturelle. Malus de -1D en Relationnel (séduire, négocier, mentir) avec les gens extérieurs à la Horde.<br><br><b>Désavantage – Marginal :</b> malus de -1D sur les compétences Cité ou Civilisations.<br><br><b>Désavantage – Tribal :</b> s'il est sans allié à proximité, subit un malus de -1D sur tous ses jets mentaux et sociaux."
    },

    "Royaumes divisés": {
        banner: "/images/banners/bannerroyaumedivises.png",
        title: "Royaumes Divisés",
        text: "Les Cetomagus partagent un héritage commun avec Avhorae mais vivent dans une instabilité constante. Divisés en clans et fédérations menés par les Teutater, ils sont marqués par une culture de survie, d'artisanat et une paranoïa nécessaire face au chaos ambiant.",
        stats: "<b>Champ de compétences de prédilection :</b> l’Outil<br><b>Compétence de Débutant bonus :</b> Armurerie ou Artisanat (non Rares).<br><br><b>Avantage – D’un sang glorieux :</b> relance gratuite sur les jets de Volonté pour résister à la manipulation ou donner des ordres.<br><br><b>Avantage – Manuel :</b> relance gratuite sur tout jet impliquant un travail manuel artisanal.<br><br><b>Avantage – Paranoïa positive :</b> bonus de +1D en Vigilance et considéré comme « actif » (au lieu de passif) lors d’un jet de Réaction.<br><br><b>Désavantage – Anxiété :</b> malus de -1D sur les jets mentaux et sociaux dès qu’une situation lui échappe ou que le chaos s’installe.<br><br><b>Désavantage – Corruption physique :</b> malus permanent (-1D ou perte de PV) dû à une malédiction physique (membre atrophié, sens déficient)."
    },

    Ool: {
        banner: "/images/banners/bannerool.png",
        title: "Ool",
        text: "Terre des Maléfices, Ool abrite neuf cités dirigées par des Maîtres Sorciers masqués. On y pratique la Matsenga, une magie sombre. C'est un royaume où la mort est omniprésente, jusque dans les talismans faits d'os et les rituels hématophages de ses habitants.",
        stats: "<b>Champ de compétences de prédilection :</b> l’Inconnu<br><b>Compétence de Débutant bonus :</b> Mythes ou Rituels (Rituels est Rare I, Mythes n'est pas Rare).<br><br><b>Avantage – Inébranlable :</b> bonus de +1D pour résister à l’intimidation ou à la peur.<br><br><b>Avantage – Lien funeste :</b> difficulté d'Expérience réduite de 1 pour les Faveurs liées à la Mort.<br><br><b>Avantage – Terrifiante réputation :</b> bonus de +1D pour intimider ou effrayer ceux qui ne sont pas de Ool.<br><br><b>Désavantage – Hématophage :</b> doit consommer du sang ou de la viande crue chaque jour. Sinon, jet de Résistance ou Volonté (le plus bas) Difficile (7) pour ne pas régurgiter tout autre aliment.<br><br><b>Désavantage – Marqué par la mort :</b> apparence cadavérique (peau grise/froide). Malus possible de -1D en Relationnel. Ne peut pas utiliser l'Essence de la Vie ni posséder la sphère de Miséricorde."
    },

    Saeth: {
        banner: "/images/banners/bannersaeth.png",
        title: "Saeth",
        text: "Surnommé le Pays des Cendres, Saeth est dominé par un grand volcan et la métropole verticale de Dhaar. Les Saethites vivent dans une hiérarchie de castes impitoyable, entre la production d'élixirs prisés et des rituels ésotériques sombres.",
        stats: "<b>Champ de compétences de prédilection :</b> l’Outil<br><b>Compétence de Débutant bonus :</b> Artisanat ou Runes (non Rares).<br><br><b>Avantage – Caste inférieure (Adaman) :</b> spécialité gratuite en Adresse, Artisanat ou Discrétion.<br><br><b>Avantage – Détaché :</b> bonus de +1D et relance gratuite pour résister à la peur.<br><br><b>Désavantage – Accro :</b> dépendant d'une drogue locale. Malus de -1D sur tous les jets en cas de manque hebdomadaire.<br><br><b>Désavantage – Caste élevée (Uttaman) :</b> doit réussir un jet de Volonté Difficile (7) ou dépenser 1D de Sang-Froid pour ne pas perdre son calme face aux personnes jugées inférieures.<br><br><b>Désavantage – Insensible :</b> malus de -1D sur tous ses jets d’Empathie."
    },

    Tégée: {
        banner: "/images/banners/bannertegee.png",
        title: "Tégée",
        text: "Tégée, la cité-état de la philosophie et de la démocratie naissante, s'élève sur les plaines balayées par les vents. Fiers de leur indépendance et de leur culture intellectuelle, ses citoyens sont des érudits, des marchands habiles, mais aussi de redoutables stratèges qui préfèrent souvent la raison à la violence aveugle, bien que leurs phalanges soient renommées.",
        stats: "<b>Champ de compétences de prédilection :</b> le Mental<br><b>Compétence de Débutant bonus :</b> Érudition ou Relationnel<br><br><b>Avantage – Éducation Supérieure :</b> spécialité gratuite dans n'importe quelle compétence de l'Homme ou du Mental.<br><br><b>Avantage – Débatteur né :</b> relance gratuite sur tous les jets de Persuasion.<br><br><b>Désavantage – Aristocrate :</b> malus de -1D sur les jets d'adaptation dans les Terres Sauvages.<br><br><b>Désavantage – Cynique :</b> jet de Volonté Difficile (7) pour ne pas blesser par arrogance un interlocuteur lors d'un désaccord."
    },

    Tuuhle: {
        banner: "/images/banners/bannertuuhle.png",
        title: "Tuuhle",
        text: "Surnommée l’Océan d’Arbres, Tuuhle est une jungle immense et inexplorée. Les tribus Tuuhls y vivent en équilibre fragile avec une nature toute-puissante, entre mangroves mortelles, chamanisme et légendes de cités dorées cachées.",
        stats: "<b>Champ de compétences de prédilection :</b> l’Animal<br><b>Compétence de Débutant bonus :</b> Pistage ou Territoire (Animalisme n'est pas Rare).<br><br><b>Avantage – Né de la Mère :</b> spécialité gratuite parmi : Animaux (Pistage), Forêt (Territoire), Plantes médicinales ou toxiques (Flore).<br><br><b>Avantage – Résistance aux intoxications :</b> diminue de 1 la Virulence des poisons et gagne +1D pour y résister.<br><br><b>Désavantage – Aversion pour le métal :</b> malus de -1D aux actions physiques/manuelles si utilisation d'équipement en métal (arme, bouclier, armure ; cumulable).<br><br><b>Désavantage – Esprit sauvage :</b> malus de -1D sur les jets sociaux et mentaux en ville.<br><br><b>Désavantage – Marginal :</b> malus de -1D sur les compétences Cité ou Civilisations.<br><br><b>Désavantage – Proie facile :</b> en zone trop exposée (plaines, déserts), subit un malus de -1D en Perception et Vigilance."
    },

    Vaelor: {
        banner: "/images/banners/bannervaelor.png",
        title: "Vaelor",
        text: "Les Vaelkyrs adorent Varna, la Mère des Glaces. Forgés dans un glacier millénaire, ils forment un peuple froid et dur. Marqué par la stérilité et le Néant qui a ravagé leurs terres, c'est un peuple de guerriers indomptables et brutaux.",
        stats: "<b>Champ de compétences de prédilection :</b> l’Arme<br><b>Compétence de Débutant bonus :</b> Bouclier ou Mêlée (Bouclier n'est pas Rare).<br><br><b>Avantage – Armure des ancêtres :</b> bonus de +1D en Volonté contre la peur tant qu'il porte son armure ornée d'os.<br><br><b>Avantage – Emprunt du néant :</b> peut tenter un jet de Volonté Très Difficile (9) pour annuler un effet d'Essence (attaque/rituel). Un seul essai par repos complet.<br><br><b>Avantage – Résistance à l’alcool :</b> bonus de +1D en Résistance contre l'alcool et les drogues ingérées.<br><br><b>Désavantage – Impulsivité :</b> jet de Volonté Très Difficile (9) ou dépense d'1D de Sang-Froid pour ne pas attaquer immédiatement en cas de provocation.<br><br><b>Désavantage – Indiscipliné :</b> doit dépenser 1D d’Effort ou de Sang-Froid supplémentaire pour utiliser une capacité de Groupe."
    },

    Valdheim: {
        banner: "/images/banners/bannervaldheim.png",
        title: "Valdheim",
        text: "Descendants des exilés de Vaelor, les Valdhs sont un peuple pragmatique, aventureux et fier. Navigateurs audacieux et pillards occasionnels, ils sont connus pour leur sens de l'honneur ombrageux et leur rancune tenace.",
        stats: "<b>Champ de compétences de prédilection :</b> les Terres Sauvages<br><b>Compétence de Débutant bonus :</b> Athlétisme ou Vigilance<br><br><b>Avantage – Athlétique :</b> caractéristiques de Puissance et Résistance augmentées de 1 pour le mouvement et la charge.<br><br><b>Avantage – Résistance à l’alcool :</b> bonus de +1D en Résistance contre l'alcool et les drogues ingérées.<br><br><b>Désavantage – Affranchi :</b> s'il vit en marge du peuple, malus de -1D en Volonté et Empathie face aux autres Valdhs.<br><br><b>Désavantage – Puissance du riche :</b> malus de -1D en Volonté face aux personnes portant de nombreux bijoux.<br><br><b>Désavantage – Sens de l’honneur :</b> en cas d'affront, doit défier en duel à mort. Sinon, humilié (-1D social/mental) jusqu'à réparation. Peut dépenser 3D de Sang-Froid pour ignorer l'injure (malus temporaire)."
    }
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


