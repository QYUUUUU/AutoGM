import type { AnyRecord, Combatant } from "../types/admin";

export function getArmor(armor: string, type: string) {
  const parts = String(armor || "0").split(",");
  if (parts.length < 3) return parseInt(parts[0], 10) || 0;
  const index = type === "C" ? 0 : type === "P" ? 1 : 2;
  return parseInt(parts[index], 10) || 0;
}

export function getCharacterId(character: AnyRecord) {
  return character.id_Character ?? character.id;
}

export function toCombatant(character: AnyRecord, equipment: AnyRecord[] = []): Combatant {
  let armor = "0,0,0";
  if (character.armureEquipee) {
    const equipped = equipment.find(item => item.name === character.armureEquipee);
    const match = String(equipped?.stats || "").match(
      /Protection:\s*(\d+)\((.*?)\)\/(\d+)\((.*?)\)\/(\d+)\((.*?)\)/,
    );
    if (match) armor = `${match[1]},${match[3]},${match[5]}`;
  }

  const reaction = (character.reflexes || 0) + (character.vigilance || 0);
  return {
    id: getCharacterId(character),
    isPC: true,
    name: character.nom || "Inconnu",
    reaction,
    init: 0,
    armor,
    lMax: character.maxblessurelegere || 4,
    gMax: character.maxblessuregrave || 2,
    mMax: character.maxblessuremortelle || 1,
    l: character.blessurelegere || 0,
    g: character.blessuregrave || 0,
    m: character.blessuremortelle || 0,
    fullChar: character,
  };
}
export function createBestiaryNpc(adversary: AnyRecord, existing: Combatant[]): Combatant {
  const baseName = String(adversary.name || "PNJ");
  const count = existing.filter(c => c.name.startsWith(baseName)).length;
  const name = count ? `${baseName} ${count + 1}` : baseName;
  const armor = String(adversary.armure || "").match(/\d+/);
  const reaction = String(adversary.reaction || "").match(/\d+/);

  return {
    id: `npc_best_${Date.now()}`,
    isPC: false,
    name,
    reaction: reaction ? Number(reaction[0]) : 2,
    init: 0,
    armor: armor ? `${armor[0]},${armor[0]},${armor[0]}` : "0,0,0",
    lMax: Number(adversary.blessuresLegeres) || 3,
    gMax: Number(adversary.blessuresGraves) || 2,
    mMax: Number(adversary.blessuresMortelles) || 1,
    l: 0,
    g: 0,
    m: 0,
    npcData: {
      atk: adversary.attaque || "",
      act: adversary.action || "",
      contact: adversary.contact || "",
      spec: adversary.specialite || "",
      specdet: adversary.specialite_details || "",
      rel: adversary.relances || "",
      res: adversary.reserve || "",
      arme: adversary.arme || "",
      cap: adversary.capacites || "",
      desc: adversary.description || "",
      reactRaw: adversary.reaction || "",
      // AJOUT DES SEUILS ICI :
      seuilBlessuresLegeres: adversary.seuilBlessuresLegeres || 0,
      seuilBlessuresGraves: adversary.seuilBlessuresGraves || 0,
      seuilBlessuresMortelles: adversary.seuilBlessuresMortelles || 0,
    },
  };
}

export function createQuickNpc(
  name: string,
  threat: { name: string; atk: string; l: number; g: number; m: number },
  experience: { name: string; act: string; spec: string; rel: string; contact: string },
  role: { name: string; reactRaw: string; reserve: string; arm: number },
  specialty: string,
): Combatant {
  const reactMatch = role.reactRaw.match(/\d+/);
  return {
    id: `npc_${Date.now()}`,
    isPC: false,
    name: name.trim() || "PNJ",
    reaction: reactMatch ? Number(reactMatch[0]) : 3,
    init: 0,
    armor: `${role.arm},${role.arm},${role.arm}`,
    lMax: threat.l,
    gMax: threat.g,
    mMax: threat.m,
    l: 0,
    g: 0,
    m: 0,
    npcData: {
      atk: threat.atk,
      act: experience.act,
      contact: experience.contact,
      spec: experience.spec,
      specdet: specialty,
      rel: experience.rel,
      res: role.reserve,
      arme: "",
      cap: `Profil Rapide (${threat.name}, ${experience.name}, ${role.name})`,
      reactRaw: role.reactRaw,
    },
  };
}

export function sortByInitiative(combatants: Combatant[]) {
  return [...combatants].sort((a, b) => b.init - a.init || Number(b.isPC) - Number(a.isPC));
}

export function updateWound(combatant: Combatant, type: "l" | "g" | "m", value: number): Combatant {
  const max = type === "l" ? combatant.lMax : type === "g" ? combatant.gMax : combatant.mMax;
  return { ...combatant, [type]: Math.max(0, Math.min(max, value)) };
}
