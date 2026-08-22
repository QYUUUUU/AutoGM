// Values are copied VERBATIM from the existing dropdown in index_html.twig
// (data-value="..." attributes) -- these are what gets sent to PUT /throw
// as `caracteristic` / `competence`, so they must match exactly or skill
// checks silently break. Labels are cosmetically corrected (missing
// accents) since they're display-only and never sent to the backend.

export interface Characteristic {
  value: string;
  label: string;
}

export interface Skill {
  value: string;
  label: string;
}

export const CHARACTERISTICS: Characteristic[] = [
  { value: "puissance", label: "Puissance" },
  { value: "resistance", label: "Résistance" },
  { value: "precision", label: "Précision" },
  { value: "reflexes", label: "Réflexes" },
  { value: "connaissance", label: "Connaissance" },
  { value: "perception", label: "Perception" },
  { value: "volonte", label: "Volonté" },
  { value: "empathie", label: "Empathie" },
];

// No real grouping exists between skills and characteristics -- any
// characteristic can be paired with any skill. This is the full flat list,
// same 29 skills as the old dropdown, same order.
export const SKILLS: Skill[] = [
  { value: "arts", label: "Arts" },
  { value: "cite", label: "Cité" },
  { value: "civilisations", label: "Civilisations" },
  { value: "relationnel", label: "Relationnel" },
  { value: "soins", label: "Soins" },
  { value: "animalisme", label: "Animalisme" },
  { value: "faune", label: "Faune" },
  { value: "montures", label: "Montures" },
  { value: "pistage", label: "Pistage" },
  { value: "territoire", label: "Territoire" },
  { value: "adresse", label: "Adresse" },
  { value: "armurerie", label: "Armurerie" },
  { value: "artisanat", label: "Artisanat" },
  { value: "mecanisme", label: "Mécanisme" },
  { value: "runes", label: "Runes" },
  { value: "athletisme", label: "Athlétisme" },
  { value: "discretion", label: "Discrétion" },
  { value: "flore", label: "Flore" },
  { value: "vigilance", label: "Vigilance" },
  { value: "voyage", label: "Voyage" },
  { value: "bouclier", label: "Bouclier" },
  { value: "cac", label: "Corps à Corps" },
  { value: "lancer", label: "Lancer" },
  { value: "melee", label: "Mêlée" },
  { value: "tir", label: "Tir" },
  { value: "eclats", label: "Éclats" },
  { value: "lunes", label: "Lunes" },
  { value: "mythes", label: "Mythes" },
  { value: "pantheons", label: "Panthéons" },
  { value: "rituels", label: "Rituels" },
];