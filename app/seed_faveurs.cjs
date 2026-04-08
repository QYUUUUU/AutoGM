const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const faveursData = [
  // Faveurs de la Mort (Mineures)
  { nom: "Emprise de la mort (Rencontre)", stade: "Rencontre", domaine: "Mort", type: "Mineure", description: "Un nombre de fois par jour égal à sa Volonté, l’Élu peut tenter de soumettre une créature morte-vivante qu’il voit (jet Volonté + Relationnel Difficile 7). S'il réussit, le cadavre animé passe sous son contrôle permanent." },
  { nom: "Flétrissement (Entente)", stade: "Entente", domaine: "Mort", type: "Mineure", description: "Une fois par jour, l’Élu peut flétrir tous les végétaux dans un rayon de [Volonté x 10] mètres autour de lui. S’il a atteint l’Accord et que sa Jauge de Divinité est pleine, la terre elle-même sera stérile durant 1d10 ans." },
  { nom: "In carcerem (Accord)", stade: "Accord", domaine: "Mort", type: "Mineure", description: "L’Élu peut emprisonner l’âme d’une personne qu’il vient de tuer personnellement dans l’un de ses yeux ou dans le propre corps de la victime. L'âme souffre atrocement et sera détruite au bout de 1d10 jours. L'élu bénéficie d'une compétence de la victime au niveau Confirmé. Utilisable [Volonté] fois/jour." },
  { nom: "Infertilité (Rencontre)", stade: "Rencontre", domaine: "Mort", type: "Mineure", description: "Une fois par jour, l’Élu peut toucher une personne qui deviendra définitivement infertile. Sur un Élu, requiert l'Accord, Jauge Divinité pleine, et un jet opposé (Difficile 7, coûte 1D Humanité)." },
  { nom: "Nécrognosie (Entente)", stade: "Entente", domaine: "Mort", type: "Mineure", description: "En mangeant un morceau de chair de cadavre, l’Élu a accès à toutes les spécialisations du défunt durant [Volonté] heures (+1D bonus), voire une compétence au niveau Confirmé s'il a 5D en Divinité. 1 fois/jour." },
  { nom: "Putréfaction (Entente)", stade: "Entente", domaine: "Mort", type: "Mineure", description: "Une fois par jour, au toucher (jet d'attaque), l'Élu inflige une terrible maladie de Virulence 8. La cible subit chaque jour deux Blessures Légères tant que non guérie." },
  { nom: "Sceau de la non-mort (Accord)", stade: "Accord", domaine: "Mort", type: "Mineure", description: "L’Élu dépense 1D d’Humanité et marque un être vivant du sceau de la non-mort. S'il meurt, son âme est emprisonnée dans son corps et il continue à se mouvoir durant 10 jours (ou indéfiniment si Divinité pleine)." },
  { nom: "Thanatomnésie (Rencontre)", stade: "Rencontre", domaine: "Mort", type: "Mineure", description: "Un nombre de fois par jour égal à sa Connaissance, l’Élu peut choisir n’importe quelle compétence qu'il possède alors au niveau Expert le temps d’un seul et unique jet." },

  // Faveurs du Soleil (Mineures)
  { nom: "Déjà-vu (Rencontre)", stade: "Rencontre", domaine: "Soleil", type: "Mineure", description: "Une fois par jour, l’Élu peut annuler un jet et le refaire (sauf si capacité d'Éclat, rituel ou Divinité utilisés)." },
  { nom: "L’œil exercé (Rencontre)", stade: "Rencontre", domaine: "Soleil", type: "Mineure", description: "L’Élu gagne un bonus de +1D sur ses jets de Perception." },
  { nom: "Nature véritable (Rencontre)", stade: "Rencontre", domaine: "Soleil", type: "Mineure", description: "L’Élu reconnaît automatiquement les contrefaçons (objets ou documents)." },
  { nom: "Nul n’échappe à ses rayons (Entente)", stade: "Entente", domaine: "Soleil", type: "Mineure", description: "Une fois par jour, l’Élu sait quand une personne connue a été touchée par le soleil pour la dernière fois, sa direction et sa distance (difficulté variable selon la météo)." },
  { nom: "Salutation au soleil (Entente)", stade: "Entente", domaine: "Soleil", type: "Mineure", description: "Une fois par jour, en méditant 10 min devant le lever du soleil, l’Élu regagne 1D de Divinité." },

  // Faveurs du Soleil (Majeures)
  { nom: "Aura éclatante (Accord)", stade: "Accord", domaine: "Soleil", type: "Majeure", description: "Une fois par jour, l’Élu brille (1 heure, [Volonté x 5] m). Malus de -2D aux créatures de la nuit attaquant l'Élu (ou subissent Blessures Légères si Divinité>=5D). Annule toute dissimulation." },
  { nom: "Aura impérieuse (Rencontre)", stade: "Rencontre", domaine: "Soleil", type: "Majeure", description: "Une fois par jour, durant [Volonté] tours. Inflige un malus de -1D aux assaillants. +1D sur les jets de Volonté de l'Élu." },
  { nom: "Il guide ma main (Accord)", stade: "Accord", domaine: "Soleil", type: "Majeure", description: "De jour, l’Élu remporte toutes les égalités d'esquive/parade contre lui. Si l'ennemi ne peut parer/esquiver, +1 dommage." },
  { nom: "Sincérité (Entente)", stade: "Entente", domaine: "Soleil", type: "Majeure", description: "Il est impossible de mentir ouvertement à l’Élu (mensonge par omission reste possible). L'Élu l'active et désactive à volonté." },
  { nom: "Sous sa protection (Accord)", stade: "Accord", domaine: "Soleil", type: "Majeure", description: "De jour, dépensez 1D d'Humanité pour ignorer une Blessure Grave reçue (+2D/supplémentaire). Utilisable 1 fois par tour." },
  { nom: "Sous son jugement (Accord)", stade: "Accord", domaine: "Soleil", type: "Majeure", description: "Comme Sincérité, mais un mensonge par omission inflige une Blessure Légère. Les menteurs surnaturels doivent réussir un jet Très Difficile (9) avec Handicap (I) ou subir la blessure." },
  { nom: "Souveraineté (Entente)", stade: "Entente", domaine: "Soleil", type: "Majeure", description: "(Prérequis : Aura impérieuse) +2D aux jets pour résister aux effets négatifs (manipulation/mensonge). Immunité peur/contrôle mental, vision totale dans le noir. Dure 10 min, 1/jour." },

  // Faveurs de la Terre (Mineures)
  { nom: "Aplomb (Entente)", stade: "Entente", domaine: "Terre", type: "Mineure", description: "La Réserve de Sang-Froid augmente de +2D de façon permanente." },
  { nom: "Endurance de la Terre (Rencontre)", stade: "Rencontre", domaine: "Terre", type: "Mineure", description: "L’Élu gagne un cercle de Blessure Légère supplémentaire." },
  { nom: "Impassibilité (Rencontre)", stade: "Rencontre", domaine: "Terre", type: "Mineure", description: "Une fois par jour, l’Élu peut régénérer 2D dans sa Réserve de Sang-Froid." },
  { nom: "Résilience de la pierre (Entente)", stade: "Entente", domaine: "Terre", type: "Mineure", description: "Le seuil de Blessures Légères de l’Élu augmente de 1." },
  { nom: "Sens de la terre (Rencontre)", stade: "Rencontre", domaine: "Terre", type: "Mineure", description: "En dépensant 1D Sang-Froid, ressentez minéraux/métaux identiques dans une zone en réussissant un jet (Perception + Artisanat). Quantité et direction estimables." },

  // Faveurs de la Terre (Majeures)
  { nom: "Chair de granite (Accord)", stade: "Accord", domaine: "Terre", type: "Majeure", description: "La peau possède un indice de protection 2 (ne se cumule pas aux armures). L'Élu peut dépenser 1D Humanité (IP 3) ou 1D Humanité+Divinité (IP 4)." },
  { nom: "Emprunter à la terre (Rencontre)", stade: "Rencontre", domaine: "Terre", type: "Majeure", description: "Une fois par jour, en contact avec le sol, passez 1 tour immobile pour rétrograder une Blessure (Légère, Grave à l'Accord, Mortelle si Divinité pleine)." },
  { nom: "Éperon rocheux (Accord)", stade: "Accord", domaine: "Terre", type: "Majeure", description: "([Volonté / 2] fois/j) Fait jaillir un pic sous un adversaire dans [Puissance x 2] m. Très difficile à esquiver (9). 9 dgts perforants. 1D Humanité pour 2ème cible." },
  { nom: "Façonner la pierre (Entente)", stade: "Entente", domaine: "Terre", type: "Majeure", description: "L’Élu peut façonner la pierre brute comme de la glaise (+1D Artisanat sculpture). Possibilité de créer des armes de pierre." },
  { nom: "Immobilité de la pierre (Accord)", stade: "Accord", domaine: "Terre", type: "Majeure", description: "1 fois/j. Transformé en pierre pdnt 1h max. Insensible au feu/poison/noyade/mort lente, incapable de bouger. Résistance pure = Volonté." },

  // Faveurs de la Vie (Mineures)
  { nom: "Adepte de la Vie (Rencontre)", stade: "Rencontre", domaine: "Vie", type: "Mineure", description: "L’Élu gagne un bonus de +1D sur ses jets de Faune et de Flore." },
  { nom: "Diagnostique (Rencontre)", stade: "Rencontre", domaine: "Vie", type: "Mineure", description: "Connaissance médicale exacte au toucher (blessures, seuils, poisons... ou grossesse)." },
  { nom: "Égratignure (Rencontre)", stade: "Rencontre", domaine: "Vie", type: "Mineure", description: "1 fois/jour, dépensez des dés d'Effort plutôt que subir la blessure (2D Effort = Légère. 4D Effort = Grave (Entente), 6D Effort = Mortelle (Accord))." },
  { nom: "Régénération volontaire (Entente)", stade: "Entente", domaine: "Vie", type: "Mineure", description: "Guerison de plusieurs blessures après un repos long possible (via Effort/Sang-Froid). Autorise la repousse d'organes/membres amputés au fil des heures." },
  { nom: "Soin du corps et de l’esprit (Entente)", stade: "Entente", domaine: "Vie", type: "Mineure", description: "Gagnez +1D Effort supp (ou +2D si Accord) en réussissant un jet de soin restaurant de l'Effort." },
  { nom: "Stabilisation (Rencontre)", stade: "Rencontre", domaine: "Vie", type: "Mineure", description: "Soin d'urgence automatique en dépensant 1D d'Humanité." },
  { nom: "Toucher guérisseur (Rencontre)", stade: "Rencontre", domaine: "Vie", type: "Mineure", description: "+1D bonus aux soins (+ relance si Entente, -1 difficulté si Accord)." },

  // Faveurs de la Vie (Majeures)
  { nom: "Anesthésie (Accord)", stade: "Accord", domaine: "Vie", type: "Majeure", description: "1 fois/j. Ignorer malus de blessures (Nb tours = Volonté). Empêche sombrer inconscient pour Blessure Mortelle si 1 case libre." },
  { nom: "Bannir la blessure (Accord)", stade: "Accord", domaine: "Vie", type: "Majeure", description: "1 fois/j, guérissez au toucher (pas soi-même) : Légère (gratuit), Grave (1D Humanité), Mortelle (si Divinité>=5D + 1D Humanité)." },
  { nom: "Cercle de grâce (Accord)", stade: "Accord", domaine: "Vie", type: "Majeure", description: "1 fois/j, 1D Humanité. Cercle sol 5m pdnt 4h : ceux à l'intérieur ne subissent aucun dommage des combats y ayant lieu." },
  { nom: "Fertilité (Entente)", stade: "Entente", domaine: "Vie", type: "Majeure", description: "Au toucher (+ 1D Humanité), restaure la fertilité ou refait fleurir un champ dans [Volonté x 10] m." },
  { nom: "Immunité (Entente)", stade: "Entente", domaine: "Vie", type: "Majeure", description: "Immunité totale aux poisons, venins, maladies et infections (non magiques)." },
  { nom: "Pérennité (Accord)", stade: "Accord", domaine: "Vie", type: "Majeure", description: "Cesse de vieillir (ou retrouve apparence jeune)." },
  { nom: "Régénération d’autrui (Entente)", stade: "Entente", domaine: "Vie", type: "Majeure", description: "Toucher pour repousser un membre/organe (1D Humanité + réusite Difficile 7). Prend qq jours." },
  { nom: "Rejet de la mort (Rencontre)", stade: "Rencontre", domaine: "Vie", type: "Majeure", description: "1D Humanité pour se stabiliser automatiquement (même inconscient)." },
  { nom: "Sacrifice (Accord)", stade: "Accord", domaine: "Vie", type: "Majeure", description: "Explosion de vie ! Ressuscite tous les êtres récents dans [Volonté x 25] m. La vie et l'Éclat de l'Élu sont détruits à jamais." },
  { nom: "Toucher neutralisant (Entente)", stade: "Entente", domaine: "Vie", type: "Majeure", description: "Élimine 2 pts Virgulence pour chaque réussite en jet de soin (+3 si Accord + Divinité>=5D)." },
  { nom: "Végétalisation (Accord)", stade: "Accord", domaine: "Vie", type: "Majeure", description: "1 fois/jour (1 dgt Léger + 1D Humanité) fait pousser des plantes en 1 mn dans [Volonté x 5] m." }
];

async function main() {
  await prisma.faveur.deleteMany({});
  for (const f of faveursData) {
    await prisma.faveur.create({ data: f });
  }
  console.log("Faveurs seeded successfully!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
