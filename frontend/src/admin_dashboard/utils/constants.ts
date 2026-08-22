export const DAY_TIMES = ["Aube", "Matin", "Midi", "Après-midi", "Crépuscule", "Nuit"] as const;
export const WEEK_TYPES = ["Eau", "Feu", "Sang"] as const;
export const SINLA_PHASES = ["Nouvelle", "Croissante", "Pleine", "Décroissante"] as const;
export const AKHAT_STATES = ["Eteinte", "Noire", "Funeste"] as const;

export const THREAT: Record<string, { atk: string; l: number; g: number; m: number }> = {
  Mineure: { atk: "3D", l: 1, g: 1, m: 1 },
  Sérieuse: { atk: "4D", l: 2, g: 1, m: 1 },
  Majeure: { atk: "5D", l: 2, g: 2, m: 1 },
  Mortelle: { atk: "6D", l: 3, g: 2, m: 2 },
  Funeste: { atk: "7D", l: 4, g: 3, m: 2 },
  Effroyable: { atk: "8D", l: 5, g: 4, m: 2 },
};

export const EXPERIENCE: Record<string, { act: string; spec: string; rel: string; contact: string }> = {
  Débutant: { act: "3D", spec: "4D", rel: "0D", contact: "7" },
  Confirmé: { act: "3D", spec: "5D", rel: "0D", contact: "5" },
  Expert: { act: "4D", spec: "6D", rel: "1D", contact: "7" },
  Maître: { act: "4D", spec: "6D", rel: "2D", contact: "5" },
  "Grand maître": { act: "5D", spec: "7D", rel: "3D", contact: "5" },
  Légende: { act: "6D", spec: "8D", rel: "4D", contact: "3" },
};

export const ROLE: Record<string, { reactRaw: string; reserve: string; arm: number }> = {
  Mineur: { reactRaw: "3D", reserve: "0D", arm: 1 },
  Secondaire: { reactRaw: "3D+1", reserve: "1D", arm: 2 },
  Important: { reactRaw: "3D+2", reserve: "2D", arm: 2 },
  Majeur: { reactRaw: "4D+2", reserve: "4D", arm: 3 },
  Principal: { reactRaw: "4D+3", reserve: "6D", arm: 4 },
  Primordial: { reactRaw: "5D+3", reserve: "8D", arm: 5 },
};

export const CARACS = [
  ["puissance", "Puis"], ["precision", "Préc"], ["resistance", "Rés"], ["reflexes", "Réf"],
  ["connaissance", "Conn"], ["perception", "Perc"], ["volonte", "Vol"], ["empathie", "Emp"],
] as const;

export const SKILLS = [
  ["aucune", "Aucune"], ["arts", "Arts"], ["cite", "Cité"], ["civilisations", "Civilisations"],
  ["relationnel", "Relationnel"], ["soins", "Soins"], ["animalisme", "Animalisme"],
  ["faune", "Faune"], ["montures", "Montures"], ["pistage", "Pistage"], ["territoire", "Territoire"],
  ["adresse", "Adresse"], ["armurerie", "Armurerie"], ["artisanat", "Artisanat"], ["mecanisme", "Mécanisme"],
  ["runes", "Runes"], ["athletisme", "Athlétisme"], ["discretion", "Discrétion"], ["flore", "Flore"],
  ["vigilance", "Vigilance"], ["voyage", "Voyage"], ["bouclier", "Bouclier"], ["cac", "Corps à Corps"],
  ["lancer", "Lancer"], ["melee", "Mêlée"], ["tir", "Tir"], ["eclats", "Éclats"],
  ["lunes", "Lunes"], ["mythes", "Mythes"], ["pantheons", "Panthéons"], ["rituels", "Rituels"],
] as const;

export const WEAPONS = [
  ["Couteau", "Couteau"],
  ["Épée / hache", "Épée / hache"],
  ["Lance", "Lance"],
  ["À deux mains", "À deux mains"],
  ["Coup de poing", "Coup de poing (Contact)"],
  ["Coup de pied", "Coup de pied (Contact)"],
  ["Fronde", "Fronde (Tir)"],
  ["Arc léger", "Arc léger (Tir)"],
  ["Arc lourd", "Arc lourd (Tir)"],
  ["Javelot", "Javelot (Lancer)"],
  ["custom", "Personnalisé..."]
] as const;

export const DEFAULT_SCENE_ID = "default";
export const DEFAULT_SCENE_NAME = "Scène Principale";
export const SCENES_STORAGE_KEY = "gmTabsState";
export const COMBATANTS_STORAGE_KEY = "combatantsState";
