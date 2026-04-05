const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bestiary = [
  {
    name: "Loup",
    type: "Bête",
    menace: "Mineure",
    experience: "Vétéran",
    role: "Sbire",
    attaque: "4D",
    contact: "5/7",
    action: "3D",
    specialite: "4D",
    specialite_details: "Pistage, course",
    relances: "1D",
    reserve: "0D",
    reaction: "3D",
    arme: "crocs, dommages 3 (P)",
    armure: "aucune",
    blessuresLegeres: 2,
    blessuresGraves: 5,
    blessuresMortelles: 8,
    capacites: ""
  },
  {
    name: "Loup Géant",
    type: "Bête extraordinaire",
    menace: "Sérieuse",
    experience: "Élite",
    role: "Rival",
    attaque: "6D",
    contact: "5/7",
    action: "4D",
    specialite: "6D",
    specialite_details: "Pistage, course",
    relances: "2D",
    reserve: "1D",
    reaction: "3D+1",
    arme: "crocs, dommages 5 (P)",
    armure: "fourrure épaisse, intégrale 1",
    blessuresLegeres: 3,
    blessuresGraves: 6,
    blessuresMortelles: 9,
    capacites: "Solitaire (pas de meute)"
  },
  {
    name: "Araignée Géante",
    type: "Bête extraordinaire",
    menace: "Sérieuse",
    experience: "Vétéran",
    role: "Rival",
    attaque: "5D",
    contact: "5/7",
    action: "3D",
    specialite: "5D",
    specialite_details: "Discrétion, Vigilance, escalade",
    relances: "1D",
    reserve: "1D",
    reaction: "3D+1",
    arme: "chélicère, dommages 3 (P)",
    armure: "carapace, partielle 2",
    blessuresLegeres: 2,
    blessuresGraves: 5,
    blessuresMortelles: 9,
    capacites: "Venin (Virulence 5), Toile (4 réussites Puissance pour libérer)"
  },
  {
    name: "Ours des cavernes",
    type: "Bête extraordinaire",
    menace: "Majeure",
    experience: "Élite",
    role: "Majeur",
    attaque: "6D",
    contact: "5/7",
    action: "3D",
    specialite: "4D",
    specialite_details: "Pistage, course",
    relances: "1D",
    reserve: "2D",
    reaction: "3D",
    arme: "crocs, dom 5(P) ; griffes, dom 4(T)",
    armure: "peau épaisse, intégrale 2",
    blessuresLegeres: 4,
    blessuresGraves: 7,
    blessuresMortelles: 10,
    capacites: ""
  },
  {
    name: "Grand tigre à dents de sabre",
    type: "Bête extraordinaire",
    menace: "Majeure",
    experience: "Élite",
    role: "Rival",
    attaque: "6D",
    contact: "5/7",
    action: "4D",
    specialite: "6D",
    specialite_details: "Discrétion, Pistage des proies, course",
    relances: "2D",
    reserve: "2D",
    reaction: "3D+1",
    arme: "griffes, dom 4(T) ; crocs, dom 4(P)",
    armure: "peau épaisse, intégrale 1",
    blessuresLegeres: 3,
    blessuresGraves: 6,
    blessuresMortelles: 10,
    capacites: "Bond du prédateur (+1D attaque) ; Puissance du prédateur (impossible de parer sans bouclier)"
  },
  {
    name: "Rat Géant",
    type: "Bête",
    menace: "Mineure",
    experience: "Débutant",
    role: "Sbire",
    attaque: "4D",
    contact: "5/7",
    action: "3D",
    specialite: "5D",
    specialite_details: "Discrétion, grimper",
    relances: "1D",
    reserve: "0D",
    reaction: "3D+1",
    arme: "dents, dommages 3 (P)",
    armure: "aucune",
    blessuresLegeres: 2,
    blessuresGraves: 5,
    blessuresMortelles: 8,
    capacites: "Nichée (fuit si l'un est abattu)"
  },
  {
    name: "Grand constricteur (Boa, Python)",
    type: "Bête",
    menace: "Sérieuse",
    experience: "Vétéran",
    role: "Rival",
    attaque: "4D",
    contact: "5/7",
    action: "3D",
    specialite: "5D",
    specialite_details: "Discrétion et Pistage des proies",
    relances: "1D",
    reserve: "1D",
    reaction: "3D",
    arme: "constriction, dommages 2 (C)",
    armure: "aucune",
    blessuresLegeres: 2,
    blessuresGraves: 5,
    blessuresMortelles: 8,
    capacites: "Nyctalope ; Constriction (dégâts ingnorant protection dès le tour suivant)"
  },
  {
    name: "Scorpion",
    type: "Bête",
    menace: "Mineure",
    experience: "Débutant",
    role: "Mineur",
    attaque: "3D",
    contact: "7",
    action: "3D",
    specialite: "4D",
    specialite_details: "Discrétion, Vigilance",
    relances: "0D",
    reserve: "0D",
    reaction: "3D",
    arme: "aiguillon, dommages 1 (P)",
    armure: "aucune",
    blessuresLegeres: 0,
    blessuresGraves: 2,
    blessuresMortelles: 5,
    capacites: "Venin Létal (Virulence 6 à 8)"
  },
  {
    name: "Crocodile du Siirh",
    type: "Bête",
    menace: "Sérieuse",
    experience: "Vétéran",
    role: "Rival",
    attaque: "5D",
    contact: "5/7",
    action: "3D",
    specialite: "5D",
    specialite_details: "Discrétion, Vigilance, nage",
    relances: "1D",
    reserve: "1D",
    reaction: "3D",
    arme: "crocs, dom 4 (P)",
    armure: "peau épaisse, intégrale 1",
    blessuresLegeres: 3,
    blessuresGraves: 6,
    blessuresMortelles: 9,
    capacites: "Embuscade aquatique"
  },
  {
    name: "Vautour",
    type: "Bête",
    menace: "Mineure",
    experience: "Débutant",
    role: "Sbire",
    attaque: "4D",
    contact: "7",
    action: "2D",
    specialite: "3D",
    specialite_details: "Vigilance, vol",
    relances: "0D",
    reserve: "0D",
    reaction: "3D",
    arme: "serres 2(T) ; bec 2(P)",
    armure: "aucune",
    blessuresLegeres: 2,
    blessuresGraves: 4,
    blessuresMortelles: 6,
    capacites: "Charognard insatiable"
  }
];

async function main() {
  console.log("Début de l'insertion des fixtures pour le Bestiaire...");
  
  for (const b of bestiary) {
    const exists = await prisma.adversary.findFirst({
      where: { name: b.name }
    });

    if (!exists) {
      await prisma.adversary.create({
        data: b
      });
      console.log(`[+] Ajouté: ${b.name}`);
    } else {
      console.log(`[=] Existe déjà: ${b.name}`);
    }
  }
  
  console.log("Sauvegarde des fixtures terminée !");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
