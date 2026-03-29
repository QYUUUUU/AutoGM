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
            rituels: document.getElementsByName('rituels')[0].value
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
        S’ils ne s’opposent pas à ce que les étrangers accostent dans leurs ports, les gens d’Aon ne se montrent guère hospitaliers. Qui plus est, la rigueur du climat, le caractère farouche des autochtones et le peu d’importance qu’ils attachent à la cuisine ne contribuent pas à rendre leurs auberges attrayantes. Néanmoins, ceux qui parviennent à se lier aux natifs d’Aon découvrent rapidement des gens attentifs, dotés d’une ironie tranquille et d’une parole on ne peut plus fiable. Derrière leur froideur et leurs manières frustes, les habitants d’Aon sont des gens sincères qui savent apprécier les joies simples.`
    },
    Avhorae: {
        banner: "/images/banners/banneravhorae.png",
        title: "Avhorae",
        text: "Description pour Avhorae ici."
    },
    Babel: {
        banner: "/images/banners/bannerbabel.png",
        title: "Babel",
        text: "Babel, surnommé le Centre du Monde, est un royaume d’une richesse et d’une influence inégalées, dont la capitale, Sabaah-aux-jardins-célestes, éblouit par sa splendeur. Au cœur de l'Arkadie, région historique et prospère, la culture raffinée de Babel rayonne, mêlant traditions anciennes et innovations audacieuses. Ses habitants, fiers de leurs origines, forment une société structurée où chaque caste, des simples Enuru aux nobles Enkihurus, joue un rôle crucial. La récente conversion de la reine Taerhonis au culte de l'Unique promet de bouleverser encore davantage ce royaume en pleine mutation, attisant les ambitions et les intrigues politiques. Le territoire de Babel, traversé par le majestueux fleuve Siirh et bordé de déserts impitoyables, est jalonné de villes vibrantes et de villages-oasis précieux. Les rumeurs de conquête et les signes d'une expansion militaire sous la direction de la jeune reine laissent présager des conflits à venir, tandis que les traditions mystiques et religieuses continuent de façonner le destin de ses habitants. Plongée dans un jeu complexe de pouvoir et de mystère, Babel est une terre de légendes où chaque coin de rue et chaque souffle de vent pourrait bien cacher une aventure épique pour ceux qui osent s'y aventurer."
    },
    Fakhar: {
        banner: "/images/banners/bannerkhalistan.png",
        title: "Fakhar",
        text: "Autrefois, le Sultanat rivalisait avec la puissante Sabaah, mais son orgueil le mena à affronter les guerriers de Babel. Lors de la célèbre bataille de la lune des sables, le sultan Khalishaa périt, vaincu par Vunuun, une mystérieuse Fille du Siirh. À sa mort, le Sultanat fut divisé par ses deux fils en Fakhar et Khashan, deux royaumes souvent en guerre l'un contre l'autre. Cependant, lorsque Babel tenta de nouveau de s’étendre, les sages de Barzakh œuvrèrent pour unir Fakhar et Khashan en une seule nation : le Khalistan. Dirigé par un Conseil mixte et un roi élu, le Khalistan repoussa Babel et devint une puissance économique influente. Le Khalistan est un pays de contrastes, où la culture colorée et vivante du Fakhar côtoie l’austérité silencieuse du Khashan. Le pays, soumis aux vents maritimes et désertiques, se distingue par ses paysages variés et ses cités richement décorées. Les terres fertiles du Fakhar produisent des teintures et des épices, tandis que le Khashan excelle dans la production de fer et d’acier. Malgré leurs différences, Fakhari et Khashani cohabitent, unis par des traditions et une histoire commune. Cette nation de contrastes, marquée par des mariages mixtes et une riche culture, demeure vigilante face aux ambitions de Babel, tout en consolidant sa place dans les Terres Sauvages."
    },
    Khashan: {
        banner: "/images/banners/bannerkhalistan.png",
        title: "Khashan",
        text: "Autrefois, le Sultanat rivalisait avec la puissante Sabaah, mais son orgueil le mena à affronter les guerriers de Babel. Lors de la célèbre bataille de la lune des sables, le sultan Khalishaa périt, vaincu par Vunuun, une mystérieuse Fille du Siirh. À sa mort, le Sultanat fut divisé par ses deux fils en Fakhar et Khashan, deux royaumes souvent en guerre l'un contre l'autre. Cependant, lorsque Babel tenta de nouveau de s’étendre, les sages de Barzakh œuvrèrent pour unir Fakhar et Khashan en une seule nation : le Khalistan. Dirigé par un Conseil mixte et un roi élu, le Khalistan repoussa Babel et devint une puissance économique influente. Le Khalistan est un pays de contrastes, où la culture colorée et vivante du Fakhar côtoie l’austérité silencieuse du Khashan. Le pays, soumis aux vents maritimes et désertiques, se distingue par ses paysages variés et ses cités richement décorées. Les terres fertiles du Fakhar produisent des teintures et des épices, tandis que le Khashan excelle dans la production de fer et d’acier. Malgré leurs différences, Fakhari et Khashani cohabitent, unis par des traditions et une histoire commune. Cette nation de contrastes, marquée par des mariages mixtes et une riche culture, demeure vigilante face aux ambitions de Babel, tout en consolidant sa place dans les Terres Sauvages."
    },
    Vaelor: {
        banner: "/images/banners/bannervaelor.png",
        title: "Vaelor",
        text: "De tous les peuples, les Vaelkyrs comptent parmi les plus touchés par la disparition de leurs dieux et, en premier lieu, de leur déesse : Varna, la Mère des Glaces. Varna est la terre gelée, les flocons de neige sont ses larmes, le blizzard son souffle. Incapable de procréer, ses seuls enfants sont ceux de son peuple, lesquels l’adorent telle leur seule véritable mère. Elle a créé les premiers d’entre eux en sculptant leurs corps dans un glacier millénaire, insufflant sa vie en eux de son baiser hivernal, les serrant un instant sur sa poitrine atrophiée avant de les semer sur la terre gelée, engendrant un peuple aussi froid et dur que la matière dont ils sont nés."
    },
    Valdheim: {
        banner: "/images/banners/bannervaldheim.png",
        title: "Valdheim",
        text: "Les Valdhs aux cheveux clairs affirment que leurs ancêtres sont venus de Vaelor en des temps reculés, après avoir rejeté les sinistres dieux du Nord. Ces ancêtres, les Dix Mille, auraient découvert une terre fertile et de nouveaux dieux. Leur culture s’est distinguée de celle des Vaelkyrs au point de développer sa propre langue et d’embrasser des valeurs radicalement opposées. Valdhs et Vaelkyrs se haïssent mutuellement ; malheur à celui qui tomberait vivant entre les mains de l’ennemi ancestral. Les Valdhs forment un peuple tolérant et pragmatique, mais ils savent également se montrer aventureux, avides de richesses et fiers au point d’en être orgueilleux. Un Valdh n’oublie jamais ses amis, mais il n’oublie jamais non plus ses ennemis. S’il a l’amitié aussi solide qu’il a la rancune tenace, il est aisé de le froisser et plus ardu d’obtenir son pardon. Nombreux sont les Valdhs qui aiment la mer. Ils comptent dans leurs rangs de nombreux marins intrépides et des navigateurs audacieux qui se sont aventurés jusqu’aux ports du Khalistan et de Saeth. Négociants têtus, ce sont aussi à l’occasion des pillards agressifs, et certains de leurs voisins en ont une bien piètre opinion."
    },
    Saeth: {
        banner: "/images/banners/bannersaeth.png",
        title: "Saeth",
        text: "Saeth, surnommé le Pays des Cendres, se dresse comme un royaume aussi inhospitalier que fascinant.Dominé par un grand volcan divinisé, le paysage de Saeth est façonné par des cendres volcaniques et des marécages empoisonnés, imprégnant l'air d'une atmosphère lourde et sinistre.La métropole de Dhaar, s'élevant au bord de l'océan dans une verticalité oppressante, est le cœur sombre de cette civilisation.Les Saethites, au teint pâle et aux traditions cruelles, vivent sous le règne tyrannique des Uttamani, une caste dirigeante impitoyable.Pour les étrangers courageux qui y commercent, Saeth offre des richesses uniques en élixirs et herbes exotiques, convoités pour leurs propriétés diverses. Au - delà de la métropole, le delta marécageux de Zaron Teth étend sa fertilité malsaine, nourrissant une agriculture complexe et la production d'élixirs prisés à travers les Terres Sauvages. Malgré son environnement mortifère, Saeth intrigue par ses mystères ésotériques et ses rituels sacrés, contrastant avec la misère quotidienne et les hiérarchies sociales oppressantes qui maintiennent le peuple sous un joug impitoyable. Les murmures d'une résistance émergente agitent les ombres de Dhaar, révélant des aspirations de grandeur qui pourraient changer le destin même de ce royaume maudit."
    },
    Tuuhle: {
        banner: "/images/banners/bannertuuhle.png",
        title: "Tuuhle",
        text: "Tuuhle, surnommée l’Océan d’Arbres, est un royaume sauvage et mystérieux enveloppé par une jungle dense et imposante, si vaste que ses limites demeurent inconnues. Habitée par les Tuuhls, des hommes à la peau sombre ornés d'or, cette jungle regorge de tribus anciennes et distinctes. Les peuples méridionaux ont établi quelques comptoirs le long de sa périphérie nord, échangeant avec les tribus autochtones. Toutefois, la jungle reste largement inexplorée et mystérieuse pour la plupart, ses habitants préférant se concentrer sur les mystères et les périls de leur environnement immédiat plutôt que sur les contrées lointaines. Chaque région de Tuuhle présente ses propres défis et merveilles : à l’ouest, la région maudite du Chagrin, où la jungle est dénaturée et inhospitalière ; au nord, le Domaine, plus peuplé mais toujours dangereux ; à l’est, les mangroves bordant l’océan, territoire des pêcheurs courageux et des crocodiles marins. Au cœur de Tuuhle se trouve le Ventre de la Mère, un lieu mystique et dangereux où des tribus anciennes vivent isolées, protégeant des secrets et peut-être même une cité dorée légendaire, Ankhahara. Au milieu de ces mystères, des tensions politiques croissantes entre tribus et l'intrusion des étrangers apportent des préoccupations nouvelles, même aux esprits des chamanes qui pressentent une menace imminente venant de l'extérieur. Tuuhle est donc un monde foisonnant où la nature règne en maître et où les tribus, dirigées par un chef et un chamane, coexistent dans un équilibre fragile, souvent perturbé par des luttes de pouvoir et des alliances changeantes. C’est un royaume où les mystères abondent, où chaque recoin recèle une histoire et où chaque pas dans la jungle peut mener à la découverte ou à la perte."
    },
    Avhorae: {
        banner: "/images/banners/banneravhorae.png",
        title: "Avhorae",
        text: "Avhorae (prononcé « Avhoré ») a toujours été une nation paradoxale : riche et fruste, civilisée et violente, moderne et superstitieuse. Ses villes de belle taille sont prospères et abritent nombre de centres d’érudition et de marchés importants, alors que ses paysans illettrés vivent pauvrement, en bordure de forêts impénétrables, sous la menace de bêtes sauvages, de bandits et de choses plus inquiétantes encore. Au fil des siècles, les voisins d’Avhorae furent tour à tour ses partenaires, ses ennemis, ses proies et à nouveau ses partenaires. Qu’ils soient de simples serfs ou des nobles en vue à la cour, les Avhoraeens (prononcé « Avhoréens ») ont toujours considéré les autres peuples avec une certaine condescendance."
    },
    "Empire du Soleil Noir": {
        banner: "/images/banners/bannercultedusoleil.png",
        title: "Empire du soleil noir",
        text: "Autrefois, avant la disparition des dieux et la Nuit du Soleil Noir, deux grandes alliances de cités-États, la Viridia et la Tégée, contrôlaient une bonne partie des Terres Sauvages orientales. Les disputes entre cités étaient fréquentes, mais grâce aux pactes qui les liaient, leurs rivalités ne donnèrent jamais lieu à une guerre à grande échelle. La plus fière de ces cités se nommait Lux, « la lumière ». Lux s’enorgueillissait de ses arts, de ses lettres et de son architecture. Ses voisines respectaient et jalousaient à la fois les lignées patriciennes de la métropole, dont l’influence se faisait sentir à travers tout Viridia et jusque dans la Tégée. Aux yeux des Viridis et des Tégéens, Lux égalait la légendaire Babel, et l’on pensait qu’elle la dépasserait un jour.  Puis, le Soleil Noir rayonna à travers le monde et le désespoir se répandit, jusqu’à ce que l’Oracle prophétise à Lux qu’après un millénaire d’absence, les dieux reviendraient et que tout rentrerait dans l’ordre. Pendant plus d’un siècle, la République de Lux fut porteuse de cette idée puissante, de cet espoir de renouveau. Mais cet espoir fut trahi à l’endroit même où il était né, par ceux-là mêmes qui devaient entretenir sa flamme. La puissante famille des Caelius éleva le premier édifice dédié à l’Unique, le Templum Primaris, au sommet du mont du Berceau. Surplombant ce temple apparut un colossal et sinistre cube noir, le Vox Aedes, dans lequel ils emmurèrent vivant un enfant innocent aux cheveux blancs, ultime descendant de l’Oracle. Au cours d’un bref et sanglant coup d’État, les Caelius proclamèrent la fin de la République et firent de leur chef Augustus Caelius Severus le premier empereur de Lux. Augustus régna moins d’un an avant d’être assassiné par son fils Marcus Brutus, lequel prit le trône et reçut en audience le prophète de l’Unique, Adrah, encore ébloui par les révélations de son dieu. Après six jours et six nuits d’entretien, le Culte du Soleil Noir fut proclamé unique religion de l’Empire."
    },
    Horde: {
        banner: "/images/banners/bannerhorde.png",
        title: "Horde",
        text: "Si l’on en croit les vieux contes, le peuple katai vivait autrefois dans la glorieuse cité de Khokhan, berceau foisonnant de connaissances et de richesses. Ce paradis urbain lui avait été offert par les dieux, afin qu’il survive plus aisément à un monde hostile et sans égard pour la vie humaine. Or, la population prospère n’ayant de cesse de croître, Khokhan ne put bientôt plus accueillir tous les Katai. Le monde extérieur, le Grand Au-Delà, devint alors synonyme d’épreuves et d’exil. Personne ne souhaitait être forcé de quitter Khokhan pour risquer sa vie dans ce Grand Au-delà, car la déesse Amarakh y attendait patiemment les âmes pour les juger avec rigueur ."
    },
    "Royaumes divisés": {
        banner: "/images/banners/bannerroyaumedivises.png",
        title: "Royaumedivises",
        text: "Par bien des aspects, les Cetomagus (les « enfants du bois ») et leurs cousins d’Avhorae (les « enfants des feuilles ») partagent un héritage commun, même si les destins de leurs pays respectifs divergent en de nombreux points. Les clans cetons entretenaient de bien meilleurs rapports entre eux que leurs voisins nordiques et vivaient en bonne intelligence. Cette relative stabilité tenait à la structure sociale antique, car les clans étaient rassemblés en fédérations, menées par des chefs élus, les Teutater. Leur rôle était justement de tempérer les rivalités et si les affrontements entre clans ne manquaient pas, ils étaient de courte durée et l’embrasement parvenait toujours à être évité."
    },
    Tégée: {
        banner: "/images/banners/bannertegee.png",
        title: "Tégée",
        text: "Lorsque les Caelius renversèrent la République de Lux et proclamèrent ouvertement la domination de leur dieu sur le monde, cela ne se fit pas sans troubles civils. Mais les usurpateurs avaient bien préparé leur coup et ils pouvaient compter sur le soutien d’un certain nombre de familles parmi les plus influentes de Lux. Dans les mois qui suivirent, des purges sanglantes eurent lieu à travers les cités de Viridia et au fur et à mesure que l’Empire naissant étendait son pouvoir, il repoussait de plus en plus loin ceux qui s’opposaient à son existence."
    },
    Ool: {
        banner: "/images/banners/bannerool.png",
        title: "Ool",
        text: "Ool, la mystérieuse Terre des Maléfices, attire comme un sortilège puissant dans l'ombre de ses collines isolées au cœur d'une vaste savane. Ses neuf cités émergent telles des énigmes ancestrales voilées de récits de sorcellerie et de dirigeants masqués. La légende raconte que les origines d'Ool remontent aux disciples du sorcier Ool, maîtres d'arts sombres nés des profondeurs de la jungle de Tuuhle. Ces neuf sorciers masqués règnent sur les cités, chacun enveloppé de mystère et de pouvoir qui transcende les années mortelles, réputés pour maîtriser une magie appelée Matsenga, bien au-delà de la portée des Juju communs pratiqués par les charlatans et les chercheurs de pouvoir de la cité. Pour les aventuriers attirés par Ool, l'attrait est multiple. Au milieu des marchés animés de Soolor et de Bambelli, les guérisseurs et les enchanteurs vendent leurs marchandises mystiques, tandis que les astrologues de Libiss prédisent les destinées dans les nuits étoilées. Les étrangers fortunés d'Alambara, de Loon et de Thula se délectent dans les vices opulents à l'abri des jugements, témoignage de l'accueil d'Ool pour ceux qui cherchent refuge loin des regards scrutateurs. Mais sous le vernis de l'indulgence et du commerce, Ool palpite d'un courant plus sombre — là où le véritable pouvoir réside entre les mains des insaisissables Maîtres Sorciers. Leurs masques, vénérés comme des conduits d'omniscience et des symboles d'autorité, jettent une ombre sur chaque recoin d'Ool, où même les os des défunts trouvent leur utilité dans des talismans complexes gravés de runes protectrices."
    },
};

document.getElementById('origineSelect').addEventListener('change', function () {
    const selectedValue = this.value;
    const description = descriptions[selectedValue];

    if (description) {
        document.getElementById('bannerImage').src = description.banner;
        document.getElementById('originTitle').innerText = description.title;
        document.getElementById('originText').innerHTML = description.text;
    }
});