import { useState, useEffect } from "react";
import { PlusCircle, MinusCircle, LogOut } from "lucide-react";

// ─── Dictionnaire des Instincts de Groupe ───────────────────────────────────
const GROUP_INSTINCTS: Record<string, any> = {
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
    stats: "Conseil tactique : une fois par jour, chaque membre du Groupe peut dépenser 1D de chacune de ses Réserves pour accorder une relance sur une action de défense à un autre membre du Groupe. Si l’action de défense est réussie et qu’il s’agit d’une parade (et non d’une esquive), le défenseur n’a besoin que d’une réussite excédentaire sur son adversaire (plutôt que de deux) pour bénéficier d’une contre-attaque. Cette capacité ne peut être utilisée qu’une seule fois sur une même action de défense, et les deux personnages impliqués doivent être en mesure de se parler, de se voir ou de se toucher. Les éventuels malus et effets techniques liés aux valeurs de Réserves s’appliquent immédiatement.",
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
    stats: "Diversion : une fois par jour, chaque membre du Groupe peut dépenser 1D de chacune de ses Réserves pour accorder le trait Rapide (2) à l’arme d’un autre membre du Groupe sur une action d’attaque « surprise ». La cible, distraite par l’utilisateur de la Diversion et incapable de se défendre, ne doit pas avoir conscience de la présence de l’attaquant et l’attaquant ne doit pas être engagé en combat. Si la cible subit au moins une Blessure Grave des suites de cette attaque, cette Blessure Grave devient une Blessure Mortelle. Cette capacité ne peut être utilisée qu’une seule fois sur une même action d’attaque et une même cible, et les deux personnages impliqués doivent être en mesure de se parler ou de se voir. Les éventuels malus et effets techniques liés aux valeurs de Réserves s’appliquent immédiatement.",
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
    stats: "L’opposition du Néant : une fois par jour, chaque membre du Groupe peut dépenser 1D de chacune de ses Réserves pour accorder une réussite automatique à un autre membre du Groupe qui fait un jet en opposition. Cette capacité ne peut être utilisée qu’une seule fois sur un même membre et un même tour, et les deux personnages impliqués doivent être en mesure de se parler, de se voir ou de se toucher. Les éventuels malus et effets techniques liés aux valeurs de Réserves s’appliquent immédiatement.",
    exemples: "obscurs manipulateurs, architectes du chaos, faux prophètes.",
    principes: "manipuler une communauté entière de façon à provoquer sa destruction ou son asservissement*, avoir fait triompher des croyances obscurantistes (superstition) sur la raison et la logique, enterrer définitivement un secret qui participerait à l’élévation de l’humanité*, implanter un mensonge de manière durable au sein d’une communauté.",
    interdits: "exposer le Groupe inutilement*, agir collectivement de façon impulsive et non raisonnée, participer à la marche du progrès*, faire preuve de générosité ou d’altruisme désintéressé*, nouer des liens avec une communauté ou un Groupe, ne pas tenter de détruire une communauté lorsque l’occasion se présente*."
  },
  os: {
    title: "L’Os",
    text: "Tout comme les Groupes liés au Néant, ceux liés à l’Os sont également rares. La plupart appartiennent à de sombres cultes cherchant à s’attirer les faveurs d’anciennes divinités de la Mort. D’autres, peut-être plus modérés, considèrent que leur rôle est de rappeler à l’humanité qu’elle est mortelle et que seule la mort est certaine, même si elle ne signifie pas la fin de tout. Certains Groupes liés à l’Os concentrent leurs efforts contre une communauté ou un peuple en particulier, souhaitant les réduire à néant, devenant l’instrument d’une sorte de « vengeance divine ».",
    stats: "Appuyer la mort : une fois par jour, chaque membre du Groupe peut dépenser 1D de chacune de ses Réserves pour augmenter de 2 les dommages infligés par l’arme d’un autre membre du Groupe sur une action d’attaque réussie (même si elle est partiellement parée). Si la cible subit une Blessure Mortelle, la Réserve de Groupe regagne 2D. Cette capacité ne peut être utilisée qu’une seule fois sur un même membre et un même tour, et les deux personnages impliqués doivent être en mesure de se parler, de se voir ou de se toucher. Les éventuels malus et effets techniques liés aux valeurs de Réserves s’appliquent immédiatement.",
    exemples: "cultistes de la Mort, prophètes de la Fatalité, eschatologistes, semeurs de mort.",
    principes: "répandre la mort et la destruction au sein d’une communauté*, inciter une communauté à recourir à des sacrifices humains si ce n’est pas (ou plus) dans leurs traditions, inciter un personnage puissant à recourir à la violence extrême contre une communauté/société alors qu’il s’y refusait*, réduire à néant les espoirs d’une communauté.",
    interdits: "se refuser à répandre la mort lorsque c’est possible, sauver une communauté d’une annihilation certaine*, ne pas venger un préjudice fait au Groupe de la façon la plus brutale qu’il soit*, ne pas détruire un Groupe agissant directement contre les principes de l’Instinct de l’Os."
  },
  voyageur: {
    title: "Le Voyageur",
    text: "Les Groupes du Voyageur sont motivés par une vie nomade et par le fait que quelque chose les attend au bout du chemin. La plupart ont tout perdu, ou n’ont jamais rien eu. Leurs membres sont sans doute ceux qui ont le plus besoin de leur Groupe, incapables de survivre sans celui-ci, mais pouvant aller au bout du monde et bien au-delà ensemble. Peu importe la destination.",
    stats: "Soins conjoints : une fois par jour, chaque membre du Groupe peut dépenser 1D de chacune de ses Réserves pour accorder une relance gratuite et diminuer d’un cran le Handicap sur une action de soin d’un autre membre du Groupe. Cette capacité ne peut être utilisée qu’une seule fois sur une même action de soin, et les deux personnages impliqués doivent traiter la Blessure en même temps. Les éventuels malus et effets techniques liés aux valeurs de Réserves s’appliquent immédiatement.",
    exemples: "marchands, explorateurs, prospecteurs, éclaireurs.",
    principes: "parvenir à survivre face à une grande adversité*, réussir à s’adapter dans les circonstances les plus difficiles, explorer des lieux oubliés et découvrir des civilisations perdues*.",
    interdits: "perdre un membre du Groupe*, risquer la vie du Groupe inutilement*, s’enraciner à un endroit, devenir dépendant d’une communauté (ces deux derniers interdits peuvent devenir significatifs s’ils se prolongent trop dans le temps)."
  }
};

interface GroupeTabProps {
  character: any;
  allGroupes?: any[];
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="gods:text-xs gods:tracking-widest gods:uppercase gods:text-primary gods:font-display">
      {children}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="gods:text-3xl gods:tracking-wider gods:uppercase gods:text-foreground gods:mt-2 gods:mb-8">
      {children}
    </h2>
  );
}

export default function GroupeTab({ character, allGroupes = [] }: GroupeTabProps) {
  const groupe = character?.Groupe;
  const charId = character?.id_Character || character?.id;
  
  // ─── États pour la création/rejoindre ─────────────────────────────────────
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedInstinct, setSelectedInstinct] = useState("architecte");
  const [selectedJoinGrp, setSelectedJoinGrp] = useState("");
  
  // ─── États pour la gestion du groupe actuel ───────────────────────────────
  const maxDes = groupe ? (groupe.niveau === 1 ? 12 : groupe.niveau === 2 ? 14 : 16) : 0;
  const [reserveDes, setReserveDes] = useState(groupe?.reserveDes || 0);

  // ─── Polling en tâche de fond pour mettre à jour les dés ────────────────
  useEffect(() => {
    if (!groupe?.id) return;
    
    setReserveDes(groupe.reserveDes);

    const intervalId = setInterval(async () => {
      try {
        const res = await fetch(`/Groupe/${groupe.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.reserveDes === 'number') {
            setReserveDes(data.reserveDes);
          }
        }
      } catch (e) {
        // Silencieux pour ne pas spammer la console
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [groupe?.id, groupe?.reserveDes]);

  // ─── Fonctions d'API encapsulées ──────────────────────────────────────────
  
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return alert("Le nom du groupe est requis.");

    const desc = GROUP_INSTINCTS[selectedInstinct];
    try {
      const response = await fetch('/Groupe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: newGroupName,
          niveau: 1,
          reserveDes: 0,
          reputation: "1",
          instinctGroupe: desc.title,
          capacitesGroupe: "",
          capacitesInstinctGroupe: desc.stats
        })
      });
      const newGrp = await response.json();
      
      // Auto-rejoindre le groupe créé
      await fetch(`/Character/${charId}/joinGroupe/${newGrp.id}`, { method: 'POST' });
      window.location.reload();
    } catch (e: any) {
      alert("Erreur lors de la création: " + e.message);
    }
  };

  const handleJoinGroup = async () => {
    if (!selectedJoinGrp) return alert("Aucun groupe sélectionné.");
    try {
      await fetch(`/Character/${charId}/joinGroupe/${selectedJoinGrp}`, { method: 'POST' });
      window.location.reload();
    } catch (e: any) {
      alert("Erreur lors de la jonction: " + e.message);
    }
  };

  const handleLeaveGroup = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir quitter le groupe ?")) return;
    try {
      await fetch(`/Character/${charId}/leaveGroupe`, { method: 'POST' });
      window.location.reload();
    } catch (e: any) {
      alert("Erreur: " + e.message);
    }
  };

  const modifierDes = async (action: 'add' | 'remove') => {
    let nextReserve = reserveDes;
    
    if (action === 'add') {
      if (reserveDes >= maxDes) return alert("La réserve est au maximum !");
      nextReserve++;
    } else {
      if (reserveDes <= 0) return alert("La réserve est vide !");
      nextReserve--;
    }

    // Mise à jour optimiste
    setReserveDes(nextReserve);

    try {
      const res = await fetch(`/Groupe/${groupe.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reserveDes: nextReserve })
      });
      if (!res.ok) throw new Error("Erreur serveur lors de la mise à jour");
    } catch (e: any) {
      alert("Erreur de MAJ: " + e.message);
      setReserveDes(reserveDes); // Rollback
    }
  };

  // ─── Vue: Le personnage N'EST PAS dans un groupe ──────────────────────────
  if (!groupe) {
    const activeDesc = GROUP_INSTINCTS[selectedInstinct];

    return (
      <div className="gods:h-full gods:overflow-y-auto gods:p-6 gods:lg:p-12 gods:bg-background gods:relative gods:z-10">
        <div className="gods:max-w-4xl gods:mx-auto gods:space-y-12">
          
          <div className="gods:text-center gods:mb-12">
            <SectionLabel>Affiliation</SectionLabel>
            <SectionTitle>Gestion de Groupe</SectionTitle>
            <p className="gods:text-muted-foreground gods:text-base gods:max-w-lg gods:mx-auto">
              Rejoignez un groupe existant ou créez-en un nouveau pour partager vos ressources.
            </p>
          </div>

          <section className="gods:p-8 gods:rounded-lg gods:border gods:border-border gods:bg-card">
            <h3 className="gods:text-xl gods:tracking-wider gods:uppercase gods:text-foreground gods:mb-6">Rejoindre un groupe</h3>
            <div className="gods:flex gods:gap-4">
              <select 
                value={selectedJoinGrp}
                onChange={(e) => setSelectedJoinGrp(e.target.value)}
                className="gods:flex-1 gods:bg-background gods:border gods:border-border gods:rounded-md gods:px-4 gods:py-3 gods:text-base focus:gods:outline-none focus:gods:border-primary/50 gods:transition-all"
              >
                <option value="">Sélectionnez un groupe disponible...</option>
                {allGroupes.map((g: any) => (
                  <option key={g.id} value={g.id}>{g.nom} (Niveau {g.niveau})</option>
                ))}
              </select>
              <button 
                onClick={handleJoinGroup}
                className="gods:px-8 gods:py-3 gods:bg-primary gods:!text-primary-foreground gods:rounded-md hover:gods:bg-primary/85 gods:transition-all gods:font-display gods:tracking-wider !gods:outline-none"
              >
                Rejoindre
              </button>
            </div>
          </section>

          <section className="gods:p-8 gods:rounded-lg gods:border gods:border-border gods:bg-card">
            <h3 className="gods:text-xl gods:tracking-wider gods:uppercase gods:text-foreground gods:mb-6">Créer un nouveau groupe</h3>
            <form onSubmit={handleCreateGroup} className="gods:space-y-6">
              <div>
                <label className="gods:block gods:text-xs gods:text-muted-foreground gods:mb-2 gods:uppercase gods:tracking-widest gods:font-display">Nom du groupe</label>
                <input 
                  type="text" 
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Les voyageurs de l'aube..."
                  className="gods:w-full gods:bg-background gods:border gods:border-border gods:rounded-md gods:px-4 gods:py-3 gods:text-foreground focus:gods:border-primary/50 gods:outline-none gods:text-base gods:transition-all"
                  required
                />
              </div>
              <div>
                <label className="gods:block gods:text-xs gods:text-muted-foreground gods:mb-2 gods:uppercase gods:tracking-widest gods:font-display">Instinct fondateur</label>
                <select 
                  value={selectedInstinct}
                  onChange={(e) => setSelectedInstinct(e.target.value)}
                  className="gods:w-full gods:bg-background gods:border gods:border-border gods:rounded-md gods:px-4 gods:py-3 gods:text-foreground focus:gods:border-primary/50 gods:outline-none gods:text-base gods:transition-all"
                >
                  {Object.entries(GROUP_INSTINCTS).map(([key, desc]) => (
                    <option key={key} value={key}>{desc.title}</option>
                  ))}
                </select>
              </div>

              <div className="gods:bg-background/50 gods:border gods:border-border/50 gods:rounded-md gods:p-6 gods:mt-4">
                <h4 className="gods:text-xl gods:tracking-wider gods:text-primary gods:mb-3">{activeDesc.title}</h4>
                <p className="gods:text-muted-foreground gods:text-base gods:italic gods:mb-4">{activeDesc.text}</p>
                <div className="gods:space-y-2 gods:text-base gods:border-t gods:border-border/50 gods:pt-4">
                  <p><strong className="gods:text-muted-foreground">Exemples :</strong> {activeDesc.exemples}</p>
                  <p><strong className="gods:text-primary">Principes :</strong> {activeDesc.principes}</p>
                  <p><strong className="gods:text-destructive">Interdits :</strong> {activeDesc.interdits}</p>
                </div>
                <div className="gods:mt-4 gods:pt-4 gods:border-t gods:border-border/50 gods:text-base gods:text-primary">
                  <strong>Capacité spéciale :</strong> {activeDesc.stats}
                </div>
              </div>

              <button 
                type="submit"
                className="gods:w-full gods:py-3 gods:bg-primary gods:text-primary-foreground gods:rounded-md gods:font-display gods:text-lg gods:tracking-wider hover:gods:bg-primary/85 gods:transition-colors gods:mt-4 !gods:outline-none"
              >
                Fonder le groupe
              </button>
            </form>
          </section>

        </div>
      </div>
    );
  }

  // ─── Vue: Le personnage EST dans un groupe ────────────────────────────────
  
  const currentInstinctDetails = Object.values(GROUP_INSTINCTS).find(
    (desc: any) => desc.title === groupe.instinctGroupe || desc.title.replace('’', "'") === groupe.instinctGroupe?.replace('’', "'")
  );

  return (
    <div className="gods:h-full gods:overflow-y-auto gods:p-6 gods:lg:p-12 gods:bg-background gods:relative gods:z-10">
      <div className="gods:max-w-6xl gods:mx-auto">
        
        <div className="gods:mb-12 gods:flex gods:items-end gods:justify-between">
          <div>
            <SectionLabel>Affiliation de Groupe</SectionLabel>
            <h2 className="gods:text-4xl gods:tracking-wider gods:uppercase gods:text-foreground gods:mt-2">{groupe.nom}</h2>
          </div>
          <button onClick={handleLeaveGroup} className="gods:flex gods:items-center gods:gap-2 gods:px-6 gods:py-3 gods:border gods:border-border gods:text-muted-foreground hover:gods:text-destructive hover:gods:border-destructive/35 gods:rounded-md gods:transition-all gods:font-display gods:text-sm gods:tracking-wider gods:uppercase !gods:outline-none">
            <LogOut size={16} /> Quitter
          </button>
        </div>

        <div className="gods:grid gods:grid-cols-1 gods:md:grid-cols-3 gods:gap-6 gods:mb-12">
          <div className="gods:p-8 gods:rounded-lg gods:border gods:border-border gods:bg-card gods:text-center">
            <span className="gods:text-muted-foreground gods:uppercase gods:text-xs gods:tracking-widest gods:font-display">Niveau</span>
            <p className="gods:text-5xl gods:font-display gods:mt-4 gods:text-foreground">{groupe.niveau}</p>
          </div>
          <div className="gods:p-8 gods:rounded-lg gods:border gods:border-border gods:bg-card gods:text-center">
            <span className="gods:text-muted-foreground gods:uppercase gods:text-xs gods:tracking-widest gods:font-display">Réputation</span>
            <p className="gods:text-5xl gods:font-display gods:mt-4 gods:text-foreground">{groupe.reputation}</p>
          </div>
          <div className="gods:p-8 gods:rounded-lg gods:border gods:border-primary/50 gods:bg-primary/5 gods:text-center">
            <span className="gods:text-primary gods:uppercase gods:text-xs gods:tracking-widest gods:font-display">Réserve de Dés</span>
            <p className="gods:text-5xl gods:font-display gods:mt-4 gods:text-primary">{reserveDes} <span className="gods:text-muted-foreground gods:text-3xl">/ {maxDes}</span></p>
          </div>
        </div>

        <div className="gods:flex gods:justify-center gods:gap-6 gods:mb-12">
          <button onClick={() => modifierDes('add')} className="gods:flex gods:items-center gods:gap-2 gods:px-8 gods:py-3 gods:bg-primary gods:!text-primary-foreground gods:rounded-md hover:gods:bg-primary/85 gods:transition-all gods:text-base gods:tracking-wider gods:font-display !gods:outline-none">
            <PlusCircle size={18} /> Ajouter 1 Dé
          </button>
          <button onClick={() => modifierDes('remove')} className="gods:flex gods:items-center gods:gap-2 gods:px-8 gods:py-3 gods:border gods:border-destructive/50 gods:text-destructive hover:gods:bg-destructive/10 gods:rounded-md gods:transition-all gods:text-base gods:tracking-wider gods:font-display !gods:outline-none">
            <MinusCircle size={18} /> Dépenser 1 Dé
          </button>
        </div>

        <div className="gods:p-8 gods:rounded-lg gods:border gods:border-border gods:bg-card">
          <h4 className="gods:text-2xl gods:tracking-wider gods:uppercase gods:text-foreground gods:mb-6">Instinct: <span className="gods:text-primary">{groupe.instinctGroupe}</span></h4>
          
          {currentInstinctDetails ? (
            <div className="gods:space-y-6">
              <p className="gods:text-muted-foreground gods:text-base gods:leading-relaxed gods:italic">{currentInstinctDetails.text}</p>
              
              <div className="gods:grid gods:grid-cols-1 gods:md:grid-cols-2 gods:gap-8 gods:pt-6 gods:border-t gods:border-border/50">
                <div className="gods:p-5 gods:rounded-md gods:bg-primary/5 gods:border gods:border-primary/20">
                  <strong className="gods:text-primary gods:font-display gods:uppercase gods:tracking-widest gods:text-xs gods:block gods:mb-3">Principes (Gains)</strong> 
                  <p className="gods:text-foreground gods:leading-relaxed">{currentInstinctDetails.principes}</p>
                </div>
                <div className="gods:p-5 gods:rounded-md gods:bg-destructive/5 gods:border gods:border-destructive/20">
                  <strong className="gods:text-destructive gods:font-display gods:uppercase gods:tracking-widest gods:text-xs gods:block gods:mb-3">Interdits (Pertes)</strong> 
                  <p className="gods:text-foreground gods:leading-relaxed">{currentInstinctDetails.interdits}</p>
                </div>
              </div>

              <div className="gods:mt-6 gods:pt-6 gods:border-t gods:border-border/50">
                <strong className="gods:text-primary gods:font-display gods:uppercase gods:tracking-widest gods:text-xs gods:block gods:mb-3">Capacité Spéciale</strong>
                <p className="gods:text-base gods:text-muted-foreground gods:leading-relaxed">{currentInstinctDetails.stats}</p>
              </div>
            </div>
          ) : (
            <p className="gods:text-muted-foreground gods:text-base gods:italic">{groupe.capacitesInstinctGroupe}</p>
          )}
        </div>

      </div>
    </div>
  );
}