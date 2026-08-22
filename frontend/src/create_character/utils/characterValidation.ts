// utils/characterValidation.ts

const STAT_NAMES = ['puissance', 'resistance', 'precision', 'reflexes', 'connaissance', 'perception', 'volonte', 'empathie'] as const;
const SKILL_NAMES = ['arts', 'cite', 'civilisations', 'relationnel', 'soins', 'animalisme', 'faune', 'montures', 'pistage', 'territoire', 'adresse', 'armurerie', 'artisanat', 'mecanisme', 'runes', 'athletisme', 'discretion', 'flore', 'vigilance', 'voyage', 'bouclier', 'cac', 'lancer', 'melee', 'tir', 'eclats', 'lunes', 'mythes', 'pantheons', 'rituels'] as const;

const SIGN_TO_SKILL: Record<string, string> = {
  "Loup": "faune", "Enfant": "civilisations", "Arbre": "flore",
  "Sceptre": "relationnel", "Tourbillon": "athletisme", "Vautour": "vigilance",
  "Voyage": "voyage", "Glaive": "armurerie", "Chat": "discretion"
};

export function getBonuses(data: any) {
  const bonusStats: Record<string, number> = {};
  const bonusSkills: Record<string, number> = {};

  // Bonus du Signe Astrologique
  if (data.signeastro && SIGN_TO_SKILL[data.signeastro]) {
    bonusSkills[SIGN_TO_SKILL[data.signeastro]] = 1;
  }

  // Bonus de la compétence d'origine choisie
  if (data.origin_bonus_skill && data.origin_bonus_skill !== "none") {
    const skill = data.origin_bonus_skill.toLowerCase().replace(/[^a-z]/g, '');
    const normalized = skill === 'corpsacorps' ? 'cac' : skill;
    
    if (STAT_NAMES.includes(normalized as any)) bonusStats[normalized] = (bonusStats[normalized] || 0) + 1;
    if (SKILL_NAMES.includes(normalized as any)) bonusSkills[normalized] = (bonusSkills[normalized] || 0) + 1;
  }

  return { bonusStats, bonusSkills };
}

export function validateCharacter(data: any) {
  const { bonusStats, bonusSkills } = getBonuses(data);

  // --- VALIDATION CARACTÉRISTIQUES ---[cite: 2]
  let charSum = 0;
  let charMaxExceeded = false;
  
  STAT_NAMES.forEach(name => {
    const bonus = bonusStats[name] || 0;
    const val = parseInt(data[name]) || Math.max(1, bonus + 1);
    charSum += (val - bonus);
    if (val > 3) charMaxExceeded = true;
  });

  const charDistributed = charSum - 8;
  const isCharValid = charDistributed === 8 && !charMaxExceeded;

  // --- VALIDATION COMPÉTENCES ---[cite: 2]
  let skillLevels: number[] = [];
  let skillSum = 0;
  let skillMaxExceeded = false;

  SKILL_NAMES.forEach(name => {
    const bonus = bonusSkills[name] || 0;
    const val = parseInt(data[name]) || bonus;
    const spent = val - bonus;
    
    if (spent > 0) {
      skillLevels.push(spent);
      skillSum += spent;
      if (val > 3) skillMaxExceeded = true;
    }
  });

  skillLevels.sort((a, b) => b - a);
  const baseSkillRequirement = [3, 2, 2, 1, 1, 1];
  let dominationValid = true;
  
  for (let i = 0; i < baseSkillRequirement.length; i++) {
    if ((skillLevels[i] || 0) < baseSkillRequirement[i]) {
      dominationValid = false;
      break;
    }
  }

  const isSkillValid = skillSum === 13 && dominationValid && !skillMaxExceeded;

  return {
    charDistributed, charMaxExceeded, isCharValid,
    skillSum, dominationValid, skillMaxExceeded, isSkillValid,
    bonusStats, bonusSkills
  };
}