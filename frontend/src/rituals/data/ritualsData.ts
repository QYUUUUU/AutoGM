export interface Ritual {
  name: string;
  level: string;
  description: string;
  receptacle?: string;
  note?: string;
}

export interface RitualCategory {
  id: string;
  title: string;
  icon: string;
  rituals: Ritual[];
}

export const RITUAL_CATEGORIES: RitualCategory[] = [
  {
    id: "air",
    title: "Rituels de l'Air",
    icon: "Wind",
    rituals: [
      {
        name: "Brise du navigateur",
        level: "Mineur",
        description:
          "Un léger vent se lève et gonfle la voile durant 2 heures par réussite.",
        receptacle:
          "Un oiseau marin tout juste abattu en plein vol et tombé sur le pont du navire/de l’embarcation. Ses ailes sont arrachées pour sceller le rituel."
      },
      {
        name: "Rapide comme le vent",
        level: "Majeur",
        description:
          "La cible du rituel bénéficie d’une seconde action par tour qui ne subit pas l’augmentation de difficulté de 2 (mais toujours d’une seule attaque par tour). Cet effet dure 1 tour (ou une minute) par réussite, mais ses effets peuvent être retardés durant [Volonté du ritualiste] heures. Si le bénéficiaire dispose déjà d’un effet équivalent, le rituel échoue automatiquement ou cesse de fonctionner dès qu’un effet semblable est utilisé.",
        receptacle:
          "Une flèche tirée par un archer de valeur (Réputation 6-) et ayant terrassé sa cible à longue portée. La flèche doit être brisée pour sceller le rituel."
      },
      {
        name: "Don de l’Air",
        level: "Majeur",
        description:
          "Les distances de saut du bénéficiaire sont triplées (si elles étaient déjà triplées, elles sont simplement quadruplées). En outre, il ne subit aucun dommage de chute. Ce rituel dure une heure par réussite.",
        receptacle:
          "Une sauterelle albinos (un insecte très rare) vivante qui doit être mangée par le bénéficiaire de ce rituel."
      }
    ]
  },

  {
    id: "bete",
    title: "Rituels de la Bête",
    icon: "PawPrint",
    rituals: [
      {
        name: "Odeur du prédateur",
        level: "Mineur",
        description:
          "La cible de ce rituel ne peut être attaquée par aucun animal sauvage commun (les versions géantes de ces bêtes peuvent ne pas être affectées). Si le bénéficiaire attaque l’animal, ce dernier préfère alors fuir plutôt que se défendre. Si l’animal est sous l’influence d’un pouvoir quelconque qui l’oblige à attaquer, il a droit à un jet d’Action Difficile (7) pour fuir ou attaquer une autre cible. Cet effet dure deux heures par réussite.",
        receptacle:
          "L’urine d’un grand félin qui doit être bue par celui qui bénéficie des effets du rituel."
      },
      {
        name: "Griffes de la bête",
        level: "Majeur",
        description:
          "Les ongles de la cible du rituel se changent en puissantes griffes qui infligent [Puissance +1] dommages (T) et font passer à 2D la perte de dés de Réserve due aux Blessures Légères infligées. En contrepartie, les jets nécessitant un certain doigté souffrent d’un malus de -1D. Cet effet dure deux heures par réussite.",
        receptacle:
          "Les griffes d’un grand prédateur tué à mains nues (toutes les griffes des pattes avant). Les griffes sont vidées de leur Essence dès que le rituel est lancé et elles tombent alors en poussière."
      },
      {
        name: "Odorat de la bête",
        level: "Majeur",
        description:
          "L’odorat du bénéficiaire devient si développé qu’il peut traquer une proie à l’odeur sur des kilomètres et repérer ses ennemis, même dans l’obscurité (aucun jet n’est nécessaire). À la discrétion de l’Oracle, il peut même sentir venir un danger. Cet effet dure deux heures par réussite.",
        receptacle:
          "L’organe voméronasal d’un grand prédateur attaqué par surprise et qui doit être mangé."
      }
    ]
  },

  {
    id: "eau",
    title: "Rituels de l'Eau",
    icon: "Droplets",
    rituals: [
      {
        name: "Sagesse de l’eau",
        level: "Mineur",
        description:
          "En regardant dans un récipient rempli d’eau pure, le ritualiste a une intuition et peut répondre à une question (posée par autrui, mais pas par lui) par « oui » ou par « non ». Il est impossible d’entrevoir l’avenir, donc la question ne peut pas concerner un événement à venir ou encore le résultat d’une action qui ne s’est pas encore produite ou d’une décision dont les conséquences ne sont pas connues. Sauf intervention divine, cette réponse sera correcte. Si la question concerne un élément, un personnage ou un événement touché par le divin ou la magie, le rituel échoue automatiquement. Ce rituel est instantané, mais ne peut être utilisé qu’une fois par semaine (tous les treize jours) par le ritualiste.",
        receptacle:
          "Les larmes d’un enfant et une goutte de sang du quémandeur qui doivent être mélangées à l’eau pure et cristalline contenue dans le récipient."
      },
      {
        name: "Altération d’apparence",
        level: "Majeur",
        description:
          "Ce rituel altère les traits du ritualiste. Il conserve sa corpulence générale, sa taille, sa couleur de peau, d’yeux, de cheveux et de pilosité (dont il peut néanmoins faire varier la longueur et l’abondance), mais les traits de son visage changent. Il est impossible de prendre une apparence précise. Avec quatre réussites sur le jet de Rituels, un homme peut prendre une apparence féminine et son anatomie s’adaptera, l’inverse n’est cependant pas possible (à l’exception des personnages intersexuels qui peuvent choisir toute apparence genrée qu’iels désirent). Cet effet dure deux heures par réussite.",
        receptacle:
          "Environ un litre d’eau passée successivement par les états liquide, solide, gazeux, puis à nouveau liquide. Cela nécessite généralement un matériel spécial pour éviter l’évaporation et permettre la condensation. Ce liquide doit être versé sur le ritualiste.",
        note:
          "Ce rituel ne peut être pratiqué que sur soi."
      },
      {
        name: "Puissance de l’eau",
        level: "Majeur",
        description:
          "La cible du rituel voit sa Puissance augmenter de +1D (avec un maximum de 4D). Cet effet dure une heure par réussite. Lorsque le rituel prend fin, la Puissance du ritualiste est diminuée de -1D durant une heure par réussite également.",
        receptacle:
          "Un galet en forme de goutte issu d’un fleuve puissant et couvert du sang frais du ritualiste (ce qui lui inflige une Blessure Légère qui ne peut être soignée avant que le rituel prenne fin)."
      }
    ]
  },

  {
    id: "feu",
    title: "Rituels du Feu",
    icon: "Flame",
    rituals: [
      {
        name: "Résistance",
        level: "Mineur",
        description:
          "Le bénéficiaire ne ressent aucune gêne tant que la température extérieure est comprise entre -30 °C et +60 °C. Cet effet dure quatre heures par réussite.",
        receptacle:
          "Une roche volcanique issue d’une récente éruption (moins d’un an) qui doit être réduite en poudre puis frottée sur la cible du rituel."
      },
      {
        name: "Caresse de Saba",
        level: "Majeur",
        description:
          "Les mains du ritualiste deviennent brûlantes à volonté (l’effet peut être réduit de sorte que ses mains soient juste chaudes). Cet effet dure une heure par réussite. Durant cette période, les attaques à mains nues du ritualiste infligent [Puissance +1] dommages (C). En outre, s’il pratique des soins d’urgence sur une blessure due à une arme ou un objet tranchant ou perforant, le Handicap au jet de Soins est réduit de (I) - ce qui annule le Handicap (I) -, mais la cicatrice sera bien plus impressionnante. À la discrétion de l’Oracle, les mains du ritualiste peuvent également enflammer les objets sensibles au feu.",
        receptacle:
          "Une lame de qualité (couteau, épée, etc. de Rareté 7+) chauffée au rouge puis saisie par le ritualiste avec les mains (ce qui occasionne une Blessure Légère qui disparaîtra lorsque le rituel ne fera plus effet, mais ne pourra pas être soignée d’ici là). L’arme ne pourra jamais être réutilisée en tant que réceptacle et sa qualité baisse, réduisant sa Rareté de 3.",
        note:
          "Ce rituel ne peut être pratiqué que sur soi."
      },
      {
        name: "Souffle de l’Exalté",
        level: "Majeur",
        description:
          "La cible du rituel annule le malus de -1D dû aux Blessures Légères durant une heure par réussite. En outre, il diminue de 1D les pertes de dés dans ses Réserves de Sang-Froid et d’Effort lorsqu’il subit une Blessure Grave (les Blessures Graves ne font perdre que 1D dans chaque Réserve). Ce rituel ne se cumule avec aucun autre effet du même genre.",
        receptacle:
          "L’arme de mêlée d’un guerrier mort avec courage et honneur au combat et plongé dans les flammes. Lorsque la lame est chauffée à blanc, elle doit être appliquée sur la chair du ritualiste ce qui lui laisse une cicatrice permanente et lui inflige une Blessure Légère."
      }
    ]
  },

  {
    id: "humain",
    title: "Rituels de l'Humain",
    icon: "BookOpen",
    rituals: [
      {
        name: "Toucher de l’artisan",
        level: "Mineur",
        description:
          "La cible du rituel gagne un bonus de +1D sur ses jets de compétences du domaine de l’Outil durant une heure par réussite.",
        receptacle:
          "Un objet artisanal de bonne qualité (Rareté 6+) dont l’Essence s’évapore une fois le rituel lancé, réduisant sa Rareté de 3."
      },
      {
        name: "Intuition de l’Humain",
        level: "Mineur",
        description:
          "Le bénéficiaire a droit à deux relances de dé gratuites durant une heure par réussite.",
        receptacle:
          "Un objet artisanal en rapport avec la chance (Rareté 6+) dont l’Essence s’évapore une fois le rituel lancé, réduisant sa Rareté de 3.",
        note:
          "Utiliser ce rituel trop souvent peut invoquer la malchance plutôt que la chance. Dans ce cas, la cible du rituel n’aura pas droit à ses deux relances, mais l’Oracle pourra les utiliser pour lui faire relancer deux dés de son choix. Un ritualiste connu pour infliger la malchance aura du souci à se faire, la chose étant de très mauvais augure dans la plupart des communautés."
      },
      {
        name: "Inflexible volonté",
        level: "Majeur",
        description:
          "La cible du rituel bénéficie d’un bonus de +2D sur les jets visant à résister à la peur, à l’intimidation, à la coercition et un bonus de +1D pour résister à tout effet magique le ciblant (rituel, Faveur, etc.) durant deux heures par réussite (ces deux bonus ne se cumulent pas entre eux ou avec des effets équivalents).",
        receptacle:
          "Les liens/entraves ayant servi à maintenir un être humain durant une séance de torture. La victime doit être morte durant la torture sans avoir parlé. Ces liens/entraves ne doivent pas avoir servi par la suite sur un autre sujet torturé avec succès. Ces liens sont brisés lors du rituel."
      },
      {
        name: "Transfert runique",
        level: "Majeur",
        description:
          "Le ritualiste réalise un tatouage (qui fait partie du rituel, ce qui peut le rendre plus long à effectuer) sur la cible du rituel. Dès que le tatouage est achevé, il peut y transférer jusqu’à 4D de chacune de ses Réserves d’Effort et de Sang-Froid (les dés de Réserve du ritualiste seront récupérés normalement). La cible du rituel peut puiser dedans comme s’il s’agissait de ses propres Réserves, mais ces dés ne se régénèrent pas et ne comptent pas dans le nombre de dés de Réserve maximum. Lorsque tous les dés ont été utilisés, le tatouage s’estompe légèrement. Tant que le tatouage ne s’est pas estompé, on ne peut bénéficier d’un nouveau Transfert runique. Une cible peut recevoir un maximum de [Volonté] tatouages de ce type dans sa vie et c’est un immense honneur.",
        receptacle:
          "Poudre issue de la pulvérisation totale d’une œuvre ayant une grande valeur symbolique pour une communauté et mélangée au sang du ritualiste (deux Blessures Légères) afin de préparer l’encre nécessaire au tatouage.",
        note:
          "Bien que le rituel fasse référence à des runes, il est tout à fait possible de tatouer n’importe quel symbole, figure ou dessin."
      }
    ]
  },

  {
    id: "lunes",
    title: "Rituels des Lunes",
    icon: "Moon",
    rituals: [
      {
        name: "Étreinte de l’ombre",
        level: "Mineur",
        description:
          "Le bénéficiaire gagne un bonus de +1D sur ses jets de compétences liés à la discrétion durant une heure par réussite.",
        receptacle:
          "Une pierre d’onyx exposée aux rayons des lunes (et jamais au soleil) durant un mois. La pierre doit être brisée lors du rituel."
      },
      {
        name: "Marque du destin",
        level: "Mineur",
        description:
          "Le ritualiste obtient une vague prophétie sur le bénéficiaire de ce rituel, laquelle se réalisera à plus ou moins long terme. Cette prophétie doit tenir en une phrase, souvent énigmatique. Il n’est possible d’obtenir qu’une seule prophétie pour une même personne.",
        receptacle:
          "Le sang d’une créature marquée par l’Essence des Lunes avec lequel le ritualiste écrit sans en avoir conscience la prophétie alors qu’il est dans un état second. Le rituel doit se tenir durant la nuit."
      },
      {
        name: "Étreinte de la nuit",
        level: "Majeur",
        description:
          "Durant 1 tour (ou 1 minute) par réussite, le ritualiste plonge une zone de [Volonté du ritualiste x 5] mètres autour de lui dans une obscurité totale qui se déplace avec lui. Le ritualiste voit dans cette obscurité comme par une nuit de pleines lunes. Les effets de ce rituel peuvent être retardés de [Volonté du ritualiste] heures. Si les effets sont utilisés sous un grand soleil, la zone de ténèbres autour du ritualiste n’est que de [Volonté x 2] mètres. Combattre une cible dans cette obscurité impose un Handicap (III) sur tous les jets d’attaques et de défense.",
        receptacle:
          "Un bandeau ayant servi à masquer les yeux aveugles (ou les cavités oculaires vides) d’une femme « née sous les deux lunes ». Le bandeau est déchiré pendant le rituel.",
        note:
          "Ce rituel ne peut être pratiqué que sur soi."
      },
      {
        name: "Inflexion du destin",
        level: "Majeur",
        description:
          "La cible du rituel obtient un nombre de relances gratuites (y compris sur des jets de caractéristique seule) égal au nombre de réussites obtenues par le ritualiste sur son jet de Rituels. Il n’est possible de bénéficier de ce rituel qu’une fois par an et ces relances ne se cumulent pas (une seule utilisable à la fois). Ces relances utilisées ne sont pas récupérées.",
        receptacle:
          "Le sang de la cible du rituel (ce qui lui inflige une Blessure Légère), de l’eau puisée dans un reflet de chaque lune et une boulette de régurgitation issue d’une chouette argentée. Tous les éléments sont mélangés en une pâte utilisée pour oindre le front de la cible du rituel durant la nuit."
      },
      {
        name: "Reflet des lunes",
        level: "Majeur",
        description:
          "Le ritualiste crée un double de lui qui n’est qu’une illusion et ne pourra faire que des actions simples et prédéterminées, en boucle, durant 1 tour (ou 1 minute) par réussite. Les effets de ce rituel peuvent être retardés de [Volonté du ritualiste] heures. Le ritualiste peut décider que son illusion reste à ses côtés lorsqu’il combat et reproduit tous ses gestes ; dans ce cas, les tentatives visant à attaquer le ritualiste ou à parer ses attaques souffrent d’un malus de -1D.",
        receptacle:
          "Les yeux vairons d’un assassin.",
        note:
          "Ce rituel ne peut être pratiqué que sur soi."
      }
    ]
  },

  {
    id: "mort",
    title: "Rituels de la Mort",
    icon: "Skull",
    rituals: [
      {
        name: "Fermer les yeux",
        level: "Mineur",
        description:
          "Ce rituel simple permet d’éviter que le corps d’un défunt ne soit relevé ou que le repos de son âme ne soit dérangé. Tout effet visant à transformer le cadavre en mort-vivant ou à contacter l’âme du défunt échoue automatiquement.",
        receptacle:
          "Deux pièces d’argent trouvées dans une nécropole, un cimetière ou une sépulture et posées sur les yeux du défunt. Même si les pièces sont retirées après le rituel, celui-ci continuera à faire effet."
      },
      {
        name: "Cruentation",
        level: "Majeur",
        description:
          "Le ritualiste enchante un cadavre possiblement victime d’assassinat (mais disposer de son crâne suffit). Si l’assassin se trouve à deux mètres ou moins du cadavre ou de son crâne, les yeux ou les orbites vides de ce dernier se mettent à saigner. L’enchantement dure tant que la mort du défunt remonte à moins d’un an.",
        receptacle:
          "La main droite d’une victime décédée il y a plus d’un siècle et dont l’assassin n’a jamais été identifié. L’index et le majeur de la main, taillés en pointe et plaqués d’argent, sont utilisés pour tracer des sillons sous les yeux du cadavre à enchanter. Une fois le rituel achevé, la main tombe en poussière.",
        note:
          "La manifestation de ce rituel sera rarement acceptée en tant que preuve irréfutable de culpabilité, à moins qu’il ne soit mené par un illustre membre de la communauté."
      },
      {
        name: "Graine de Zababa",
        level: "Majeur",
        description:
          "Après avoir réalisé son rituel et fait éclore l’Essence de la Mort du réceptacle, le ritualiste obtient une graine qu’il doit planter dans le sol le jour même. Au bout de trois jours, une plante grisâtre pousse en un instant et ses bubons noirs à l’odeur putride éclatent, propageant leurs spores dans l’air dans un rayon de cent mètres. Quiconque inhale les spores et rate un jet de Résistance de difficulté 8 contracte la peste hémorragique (Virulence 8). La maladie est fortement contagieuse et chaque cadavre d’une personne décédée des suites de la peste peut devenir une nouvelle graine.",
        receptacle:
          "Le cœur d’un pestiféré ayant infecté toute sa communauté, provoquant leur décimation. Le pestiféré ne doit pas avoir été victime des effets de la Graine de Zababa.",
        note:
          "Ce rituel est extrêmement infâme et vaudra à celui qui l’a pratiqué d’être traqué sans relâche. Boire l’eau du Siirh permet de réduire immédiatement la Virulence de la maladie de 1 chaque jour où l’eau est bue. Si la Virulence est réduite à 3, la maladie est vaincue. Aucune graine de Zababa ne peut pousser à Lux ou dans ses environs. L’Oracle peut limiter ou interdire l’accès à ce rituel."
      },
      {
        name: "La récompense du sacrifice",
        level: "Majeur",
        description:
          "Dès que le rituel est achevé, celui qui en bénéficie gagne une relance gratuite sur toutes ses actions physiques durant un nombre d’heures égal au nombre de réussites obtenues sur le jet.",
        receptacle:
          "La lame d’un bourreau qui a fini par servir à sa propre exécution ou à son meurtre. La lame doit être brisée lors du rituel."
      }
    ]
  },

  {
    id: "soleil",
    title: "Rituels du Soleil",
    icon: "Sun",
    rituals: [
      {
        name: "Scintillements du Destin",
        level: "Mineur",
        description:
          "Ce rituel est semblable à Sagesse de l’eau, excepté que le ritualiste peut poser la question lui-même et que cette question doit concerner un événement présent ou futur, d’ici un an au maximum. Si la question concerne un élément, un personnage ou un événement touché par le divin ou la magie, le rituel échoue automatiquement.",
        receptacle:
          "Un cristal de roche exposé à la lumière du soleil et dissimulé aux rayons lunaires durant un mois. Le ritualiste doit observer les reflets qui se forment dans le cristal lorsqu’il est frappé par un soleil non voilé et au plus haut de sa course. Le cristal se brise juste après."
      },
      {
        name: "Révélation d’Enki",
        level: "Majeur",
        description:
          "Ce rituel, une fois activé, révèle tout ce qui est caché ou altéré par la magie, même les Faveurs et capacités des Éclats. Tout ce qui dissimule ou déforme les apparences cesse immédiatement de faire effet. Les contrefaçons exposées à la Révélation d’Enki brûlent, se fissurent ou noircissent. Si un humain tente de se faire passer pour ce qu’il n’est pas, il subit immédiatement une Blessure Légère alors que son front est marqué d’un cercle comme marqué au fer rouge.",
        receptacle:
          "Le ritualiste martèle une petite plaque de cuivre pour y marquer son véritable nom sous le soleil de midi. Il doit ensuite porter cette plaque en permanence autour du cou, à la vue de tous, et ne plus proférer le moindre mensonge durant trente jours. Plier la plaque active le rituel tandis que le nom du ritualiste disparaît. La plaque se change ensuite en plomb.",
        note:
          "Ce rituel est extrêmement méconnu. Il ne peut être pratiqué que sur soi."
      },
      {
        name: "L’Œil ardent",
        level: "Majeur",
        description:
          "Le ritualiste fait apparaître un globe flottant de la taille d’un poing. L’orbe, parfaitement semblable à un soleil miniature, éclaire comme en plein jour jusqu’à [Volonté x 5] mètres du ritualiste. Ce soleil peut rester fixe ou se déplacer avec le ritualiste durant deux heures par réussite avant de disparaître. Toutes les créatures sensibles à la lumière solaire se trouvant dans la zone de l’Œil ardent subissent des dommages comme si elles étaient exposées au feu. La chaleur qu’il dégage est celle d’une flamme, mais il ne peut rien enflammer pas plus qu’il ne peut causer de Blessure.",
        receptacle:
          "Une sphère parfaite de pyrite issue d’un gisement exposé depuis longtemps au soleil. La sphère doit faire la taille d’un poing et être brisée durant l’exécution du rituel. Le rituel doit être effectué à l’extérieur sous les rayons ardents du soleil. Il peut ensuite être déclenché à n’importe quel moment avant la prochaine aube.",
        note:
          "L’Œil ardent est l’un des rares rituels qui crée quelque chose spontanément. Aucun ritualiste n’est capable d’en déterminer la raison."
      },
      {
        name: "Héritage de l’Oracle",
        level: "Majeur",
        description:
          "Durant deux heures par réussite, la cible du rituel bénéficie d’un bonus de +2D pour résister à tout ce qui provient du Soleil Noir : rituels, Faveurs, sombre acier luxéen, etc. Si des dommages doivent être infligés par une telle source à la cible du rituel, les dommages sont réduits de 2 après application de la protection.",
        receptacle:
          "Le sang d’un descendant de la lignée luxéenne des Castus (assez pour infliger une Blessure Grave) qui doit être versé sur le visage de la cible du rituel. Le sang d’un même descendant des Castus ne peut servir qu’une fois chaque mois pour alimenter ce rituel."
      }
    ]
  },

  {
    id: "terre",
    title: "Rituels de la Terre",
    icon: "Mountain",
    rituals: [
      {
        name: "Perception sismique",
        level: "Mineur",
        description:
          "Durant une heure par réussite, la cible du rituel est consciente de tout ce qui bouge autour d’elle pourvu que cette chose touche le sol ou soit en contact avec quelque chose qui touche le sol. Le rayon d’effet est égal à [Perception x 3] mètres du bénéficiaire et s’étend même sous terre. Cela ne permet pas de voir un adversaire mais simplement de savoir où il se trouve.",
        receptacle:
          "Un lombric vivant. Celui-ci doit être mâché puis ingéré par le bénéficiaire alors qu’il est plongé dans l’obscurité, les deux pieds enfoncés dans la terre jusqu’aux genoux, tout en frappant le sol d’un lourd bâton de bois pétrifié issu d’un arbre ancien et puissant."
      },
      {
        name: "Peau de granite",
        level: "Majeur",
        description:
          "La peau de la cible du rituel prend une apparence proche de la roche et mouchetée. Durant une heure par réussite, la peau a un indice de protection de 2 qui ne se cumule avec aucune armure mais peut s’appliquer après une parade manquée. L’indice de protection ne s’applique pas sur les dégâts de feu et équivalents. Lorsque le rituel prend fin, le bénéficiaire subit un malus de -2D sur tous ses jets physiques et manuels et de -1D sur tous ses jets sociaux et mentaux jusqu’à la prochaine phase de repos complet achevée.",
        receptacle:
          "Un morceau de granite réduit en poudre durant le rituel et mélangé à l’eau d’une source de montagne pour en faire une pâte dont une partie doit recouvrir le corps et l’autre être ingérée par la cible du rituel."
      },
      {
        name: "Poussière tu es",
        level: "Majeur",
        description:
          "Ce rituel permet de réduire instantanément en poussière n’importe quel objet ou zone inerte touchés, dont le volume ne doit pas excéder 1 m³. L’effet ne peut être déclenché qu’une seule fois durant la durée du rituel (une heure par réussite).",
        receptacle:
          "Une brique de terre cuite (argile et sable) façonnée par le ritualiste, puis réduite en une poussière passée au travers d’un tamis de fils d’or. Cette poussière doit être récupérée dans un récipient en céramique pourvu d’un couvercle conçu par le ritualiste. Le ritualiste doit ensuite briser de ses deux poings le récipient jusqu’à ce que son sang coule et se mêle à la poussière, ce qui lui occasionne une Blessure Légère. Cette Blessure doit être soignée dans l’heure sans user de magie pour achever le rituel.",
        note:
          "Un objet inerte peut être constitué de n’importe quelle matière solide, y compris la pierre, le métal, le bois ou même un cadavre. Un objet exceptionnel comme un Éclat n’est pas affecté. Ce rituel ne peut être pratiqué que sur soi."
      }
    ]
  },

  {
    id: "vie",
    title: "Rituels de la Vie",
    icon: "HeartPulse",
    rituals: [
      {
        name: "Fertilité",
        level: "Mineur",
        description:
          "Ce rituel très simple permet d’assurer un accouplement avec succès.",
        receptacle:
          "Un peu du sang des deux partis librement concédé, la femme devant sincèrement désirer un enfant, mêlé à du lichen et des graines de pavot réduits en poudre. La pâte doit être ingérée par les deux partis une heure avant l’accouplement.",
        note:
          "Ce rituel ne peut être tenté qu’une fois par an sur chaque participant. Le pratiquer en Vaelor est Difficile (7) et assorti du Handicap (II), comme un rituel majeur. Le Handicap est de (III) si l’un des partis est né en Vaelor et la difficulté est de 9 si les deux y sont nés."
      },
      {
        name: "Toucher d’Asa",
        level: "Majeur",
        description:
          "L’effet de ce rituel est instantané. Une fois accompli, le ritualiste touche le blessé, qui doit être consentant pour que le rituel fasse effet à moins qu’il ne soit inconscient. Toutes ses Blessures sont alors rétrogradées au niveau de Blessure inférieur : toutes les Blessures Légères disparaissent, les Graves deviennent Légères et les Mortelles Graves. La cible du rituel sera cependant comme engourdie durant les prochaines 24 heures, subissant un malus de -2D sur tous ses jets de compétence.",
        receptacle:
          "Le placenta d’un nouveau-né en pleine santé, tout comme sa mère, et expulsé il y a moins de douze heures. Il doit être mangé par le ritualiste."
      },
      {
        name: "Échapper à l’étreinte de la mort",
        level: "Majeur",
        description:
          "Durant deux heures par réussite, le bénéficiaire est automatiquement stabilisé s’il subit une Blessure Mortelle.",
        receptacle:
          "Ce rituel ne demande pas de réceptacle matériel mais un acte dont la résolution prend beaucoup de temps : le ritualiste doit planter un arbre à fruits. Lorsque les fruits sont mûrs, le ritualiste peut en prélever un qui devra être mangé avant de se gâter. L’arbre ne peut produire que 1d5 fruits emplis de cette Essence de Vie par an.",
        note:
          "L’Essence ne peut être prélevée que par le ritualiste ayant planté l’arbre et cet acte de création ne peut pas être reproduit avant que l’arbre ne meure."
      }
    ]
  },

  {
    id: "mixtes",
    title: "Rituels Mixtes",
    icon: "Combine",
    rituals: [
      {
        name: "Infortune",
        level: "Mineur",
        description:
          "Ce rituel est une sorte de malédiction. Durant un nombre de jours égal à la Volonté du ritualiste, la cible est sous le coup d’un terrible échec. Dans le cadre des règles, celle-ci verra un jet réussi se transformer subitement en échec inévitable, au moment le plus catastrophique. Si aucun jet n’est susceptible d’avoir de fâcheuses conséquences pendant la durée du rituel, la cible subira une Blessure Grave accidentelle dès qu’il s’achèvera.",
        receptacle:
          "Le vrai nom de la cible noté sur un parchemin avec la griffe d’un prédateur marqué par l’Essence des Lunes.",
        note:
          "Il est possible d’utiliser Infortune une seule fois par an sur une même cible."
      },
      {
        name: "Nom véritable",
        level: "Mineur",
        description:
          "Le ritualiste obtient le véritable nom d’une personne. Il ne s’agit pas véritablement du nom de naissance de la personne, mais plutôt d’une sorte de nom mystique qui, une fois écrit sur un parchemin, peut remplacer définitivement les réceptacles d’origine corporelle de la cible ou servir à quelques rituels spécifiques.",
        receptacle:
          "Un peu de sang, des rognures d’ongles, des cheveux ou poils de la cible ainsi qu’un objet lui appartenant depuis longtemps ou ayant été conçu par elle. Le tout est brûlé, broyé ou fondu et mis dans un bol de terre confectionné par le ritualiste. Un large éclat de cristal de roche exposé aux rayons directs du soleil de midi est ensuite déposé dans le bol. Le ritualiste peut alors s’en servir pour tracer machinalement sur un parchemin ou une tablette d’argile le véritable nom de sa cible."
      },
      {
        name: "Amulette lascive",
        level: "Majeur",
        description:
          "Une fois mise au cou de la cible, l’amulette transforme la victime en un être épris au-delà de toute raison du ritualiste. Ces effets durent un an et un jour ou jusqu’à ce que l’amulette soit retirée, ce que son porteur ne fera jamais de son propre chef.",
        receptacle:
          "Quelques gouttes de sang, des cheveux, des poils ou des rognures d’ongles de la cible et quelques gouttes du sang du ritualiste, le tout mélangé dans un bol d’argent sous la lueur d’Akhat. Une simple pierre d’opale est ensuite immédiatement trempée dans le mélange et prend une couleur rosée et iridescente. Elle doit être mise au cou de la cible durant la nuit suivante.",
        note:
          "Ce rituel pourrait être un don de Nittungha, déesse de la Nuit, de la Lune Noire, des Secrets et du Sexe."
      },
      {
        name: "Châtiment d’Enki",
        level: "Majeur",
        description:
          "Durant un an et un jour, la cible du rituel est blessée par la lumière du soleil, subissant une Blessure Légère chaque heure, même partiellement entamée, durant laquelle elle y est exposée. Seul un abri total, comme une grotte, pourra la protéger.",
        receptacle:
          "La langue et les yeux d’un voyageur solitaire décédé sous l’action du soleil du désert, ainsi qu’une lame d’or coulée pour l’occasion dont le métal s’est mêlé aux cendres des yeux et de la langue. La pointe de la lame est plantée dans la poitrine de la cible et brisée à l’intérieur.",
        note:
          "Ce châtiment était destiné aux criminels de haut statut ayant enfreint les règles d’Enki, dieu solaire de la Justice, de la Lumière et de la Vérité."
      },
      {
        name: "Déflagration d’Akil",
        level: "Majeur",
        description:
          "Lorsque le ritualiste frappe dans ses mains, une déflagration s’étend autour de lui, engouffrant dans ses flammes tourbillonnantes tous ceux qui l’entourent dans un rayon de 10 mètres. Les dommages infligés sont égaux aux réussites obtenues sur le jet de Rituels et cette déflagration bénéficie du trait Rapide (2). Il est possible de se jeter hors de la zone d’effet en réussissant un jet de Réflexes + Corps à corps Difficile (7) avec un Handicap (II). Tous les objets inflammables dans la zone s’embrasent. Le ritualiste subit une Blessure Légère.",
        receptacle:
          "Les cœurs de deux créatures, l’une marquée par l’Essence de l’Air, l’autre par celle du Feu. Chaque cœur doit être réduit en cendre séparément dans un creuset et le ritualiste plonge chacune de ses mains dans un creuset différent. Lorsqu’il frappera dans ses mains dans un délai de [Volonté du ritualiste] heures, il produira la déflagration.",
        note:
          "Ce rituel ne peut être pratiqué que sur soi."
      },
      {
        name: "Forger l’indestructible",
        level: "Majeur",
        description:
          "Le ritualiste confère une résistance exceptionnelle à une arme ou une armure qui devient pratiquement indestructible. Si vous utilisez les règles de Détérioration des armes et des armures, considérez qu’une telle arme ou armure ne se détériore que lorsqu’elle est confrontée à un Éclat ou équivalent.",
        receptacle:
          "Le sang du ritualiste, ce qui lui inflige une Blessure Légère, une arme ou armure de facture exceptionnelle et un marteau dont la tête est faite d’une pierre mêlée de veines d’argent. Le sang est versé sur l’arme ou l’armure qui est ensuite frappée du marteau qui se brise.",
        note:
          "Ce rituel est un don de Saba, déesse des Pierres, du Métal, de l’Artisanat et de la Ville."
      },
      {
        name: "Grâce du vent",
        level: "Majeur",
        description:
          "Le bénéficiaire du rituel double sa vitesse de déplacement et peut courir à sa vitesse maximale durant deux heures par réussite obtenue sur le jet de Rituels. Il est ensuite épuisé, sa Réserve d’Effort se vidant entièrement, et incapable de courir jusqu’à ce qu’il ait dormi. Les effets de Grâce du vent peuvent être retardés pour être déclenchés dans un délai de [Volonté du ritualiste] jours.",
        receptacle:
          "Le sang d’un faucon pérégrin mêlé aux cendres d’une importante missive qui changea le cours d’une bataille ou d’un destin. Le mélange produit une encre servant à tatouer sur le bénéficiaire les symboles rituels du vent et de l’humanité. Lorsque le rituel cesse de faire effet, le tatouage disparaît.",
        note:
          "On attribue ce rituel à Inir, le dieu aviaire des Voyages, du Chant et de la Communication."
      },
      {
        name: "L’eau de la vie",
        level: "Majeur",
        description:
          "Toutes les Blessures de la cible du rituel sont instantanément rétrogradées et tout poison, venin, infection ou maladie l’affectant voit sa Virulence réduite à 0.",
        receptacle:
          "Un poisson argenté du Siirh et quelques gouttes de sang librement donné d’une personne ayant miraculeusement survécu à une maladie mortelle. Les réceptacles sont infusés dans une eau pure qui doit ensuite être bue par le bénéficiaire du rituel avant qu’elle ne refroidisse.",
        note:
          "On dit que ce rituel était un don d’Asa, déesse de l’Eau, de la Vie et de la Fertilité."
      },
      {
        name: "Le messager funeste",
        level: "Majeur",
        description:
          "Le ritualiste fait d’un céraste noir un messager mortel. Celui-ci traquera sa cible durant dix jours et dix nuits, magiquement conduit vers elle, pour lui délivrer sa morsure fatale au moment le plus opportun, généralement dans son sommeil. Le céraste ainsi renforcé possède une attaque de 5D, une Action de 4D, une spécialité de 5D en Discrétion et Pistage, une morsure infligeant 2 dommages (P), ainsi qu’un venin de Virulence 9. En cas d’échec au jet de Résistance après une morsure ayant infligé une Blessure, la victime subit une Blessure Mortelle au début du tour suivant, sinon une Blessure Grave. Le céraste continuera d’attaquer jusqu’à ce que sa cible meure.",
        receptacle:
          "Un céraste noir saisi à mains nues par le ritualiste et emprisonné dans un coffret façonné à partir de roche blanche du désert et gravé des symboles rituels de l’asservissement et du véritable nom de la cible. Le rituel se conclut lorsque le ritualiste brûle devant le coffret un encens fait de résine et de bois mêlé à des cheveux, des rognures d’ongles ou un peu de sang de la cible.",
        note:
          "Le céraste noir est l’un des symboles du dieu serpent Setuh, Seigneur du Désert, et le Messager mortel était le sort que ses prêtres réservaient aux traîtres."
      },
      {
        name: "Le sang appelle le sang",
        level: "Majeur",
        description:
          "Le ritualiste transfère une Blessure Mortelle à celui qui l’a infligée, où qu’il se trouve. Ce rituel échoue automatiquement si celui qui a infligé la Blessure est déjà mort. Une fois le rituel achevé, le responsable du coup mortel doit réussir un jet de Résistance Très difficile (9) ou subir une Blessure Mortelle.",
        receptacle:
          "Une balance obtenue en coulant le métal de l’arme ou de l’armure du défunt, lequel doit être décédé depuis cinq jours au plus. D’un côté est posé le cœur du défunt et de l’autre son crâne débarrassé de ses chairs après l’avoir exposé à une colonie de fourmis de sang. Le cœur de la victime doit ensuite être rempli de plomb fondu jusqu’à ce que les deux plateaux de la balance s’équilibrent.",
        note:
          "Ce rituel était initialement pratiqué par les prêtres de Saden, déesse de la Colère, de la Vengeance et du Châtiment."
      },
      {
        name: "Malédiction d’Akhut",
        level: "Majeur",
        description:
          "La cible du rituel se transforme en créature nocturne bestiale durant la prochaine nuit. Elle détruira tous ceux auxquels elle tient et, après avoir repris sa forme humaine, oubliera tout à son réveil.",
        receptacle:
          "Une poudre d’argent confectionnée sous la lueur d’Akhat et mêlée au sang du ritualiste, ainsi que le cœur réduit en cendres d’un prédateur ayant dévoré ses propres petits. Le tout est mélangé en une pâte qui devra être ingurgitée par la cible du rituel dans un délai de [Volonté du ritualiste x 2] heures. Cette pâte, inodore et sans saveur, peut être mélangée à de la nourriture."
      },
      {
        name: "Don de longévité",
        level: "Majeur",
        description:
          "Le ritualiste ne vieillit pas durant une année. L’effet est annulé si la figurine utilisée comme réceptacle est déterrée dans l’année. Ce rituel est généralement renouvelé tous les ans, mais ne pas le faire ne fait pas subitement vieillir le ritualiste : chaque année est simplement ignorée et non repoussée.",
        receptacle:
          "Une figurine à l’effigie du ritualiste, conçue de ses mains avec la glaise du Siirh, mêlée à quelques gouttes de son sang, munie d’un rubis en guise de cœur, et d’un cordon ombilical d’un enfant né en pleine santé d’une mère bien portante. La figurine doit être enroulée dans le cordon ombilical puis enterrée dans une terre fertile. Le ritualiste fait alors couler son sang sur la terre, ce qui lui inflige une Blessure Légère, et achève le rituel."
      }
    ]
  }
];