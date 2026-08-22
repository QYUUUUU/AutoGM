import { useCallback, useEffect, useMemo, useState } from "react";
import type { ActiveSection, AdminDashboardData, AnyRecord, Combatant, SaveState, SceneMap, WoundType, WorldState } from "../types/admin";
import { DEFAULT_SCENE_ID, DEFAULT_SCENE_NAME, EXPERIENCE, ROLE, SCENES_STORAGE_KEY, COMBATANTS_STORAGE_KEY, THREAT } from "../utils/constants";
import { createBestiaryNpc, createQuickNpc, getArmor, getCharacterId, sortByInitiative, toCombatant, updateWound } from "../utils/combat";
import { parseDiceFormula, rollD10, rollDamageFormula } from "../utils/dice";



async function updateCharacterField(id: string | number, field: string, value: any): Promise<Response> {
  const response = await fetch("/Character", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, field, value }),
  });
  if (!response.ok) console.error(`Error updating ${field} for Character ${id}`);
  return response;
}
interface State {
  activeGroupId: string;
  world: WorldState;
  saveState: SaveState;
  scenes: SceneMap;
  sceneId: string;
  combatants: Combatant[];
  log: string[];
  activeSection: ActiveSection;
  pnjDiff: string;
  bestId: string;
  npcName: string;
  threat: string;
  experience: string;
  role: string;
  specialty: string;
  customNpcId: string;
  customCarac: string;
  customSkill: string;
  customModifier: string;
  attacker: string;
  target: string;
  attackRoll: string;
  defenseRoll: string;
  weapon: string;
  customWeapon: string;
}

// 🔥 Fonction utilitaire pour garantir que les stats de la BDD écrasent toujours le reste
function hydratePC(combatant: Combatant, rawChar: AnyRecord): Combatant {
  return {
    ...combatant,
    l: rawChar.blessurelegere ?? combatant.l ?? 0,
    g: rawChar.blessuregrave ?? combatant.g ?? 0,
    m: rawChar.blessuremortelle ?? combatant.m ?? 0,
    lMax: rawChar.maxblessurelegere ?? combatant.lMax ?? 5,
    gMax: rawChar.maxblessuregrave ?? combatant.gMax ?? 3,
    mMax: rawChar.maxblessuremortelle ?? combatant.mMax ?? 2,
    fullChar: { ...(combatant.fullChar || {}), ...rawChar } // On garde l'objet complet synchro
  };
}

export function useAdminDashboard(data: AdminDashboardData) {
  const [activeGroupId, setActiveGroupId] = useState(String(data.activeGroupeId ?? ""));
  const [world, setWorld] = useState<WorldState>(data.worldState || {});
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [scenes, setScenes] = useState<SceneMap>({});
  const [sceneId, setSceneId] = useState(DEFAULT_SCENE_ID);
  const [combatants, setCombatants] = useState<Combatant[]>([]);
  
  // 🔥 Le nouveau Cerveau de Vérité : on stocke les données brutes des PJs, 
  // et on les gardera à jour avec le SSE pour que les restaurations soient toujours correctes.
  const [dbCharacters, setDbCharacters] = useState<AnyRecord[]>(data.characters || []);

  const [log, setLog] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<ActiveSection>("world");
  const [pnjDiff, setPnjDiff] = useState("7");
  const [bestId, setBestId] = useState("");
  const [npcName, setNpcName] = useState("");
  const [threat, setThreat] = useState("Sérieuse");
  const [experience, setExperience] = useState("Confirmé");
  const [role, setRole] = useState("Secondaire");
  const [specialty, setSpecialty] = useState("");
  const [customNpcId, setCustomNpcId] = useState("");
  const [customCarac, setCustomCarac] = useState("puissance");
  const [customSkill, setCustomSkill] = useState("aucune");
  const [customModifier, setCustomModifier] = useState("0");
  const [attacker, setAttacker] = useState("");
  const [target, setTarget] = useState("");
  const [attackRoll, setAttackRoll] = useState("");
  const [defenseRoll, setDefenseRoll] = useState("");
  const [weapon, setWeapon] = useState("auto");
  const [customWeapon, setCustomWeapon] = useState("");

  // 1. INITIALISATION ROBUSTE : La Base de données gagne TOUJOURS contre le cache
  useEffect(() => {
    const freshPCs = dbCharacters.map(character => {
      const base = toCombatant(character, data.equipment || []);
      return hydratePC(base, character);
    });

    const injectFreshDBData = (localCombatants: Combatant[]) => {
      return localCombatants.map(combatant => {
        if (combatant.isPC) {
          const fresh = freshPCs.find(f => String(f.id) === String(combatant.id));
          if (fresh) {
            return {
              ...combatant, // Garde l'initiative et armure du cache
              l: fresh.l, g: fresh.g, m: fresh.m,
              lMax: fresh.lMax, gMax: fresh.gMax, mMax: fresh.mMax,
              fullChar: fresh.fullChar
            };
          }
        }
        return combatant;
      });
    };

    let finalScenes: SceneMap = {};
    let finalSceneId = DEFAULT_SCENE_ID;
    let finalCombatants: Combatant[] = [];

    try {
      const saved = JSON.parse(localStorage.getItem(SCENES_STORAGE_KEY) || "{}");
      if (saved && Object.keys(saved).length) {
        const ids = Object.keys(saved) as string[];
        finalSceneId = saved[sceneId] ? sceneId : ids[0];
        
        Object.keys(saved).forEach(key => {
          finalScenes[key] = {
            ...saved[key],
            combatants: injectFreshDBData(saved[key].combatants || [])
          };
        });
        finalCombatants = finalScenes[finalSceneId].combatants;
      }
    } catch {}

    if (Object.keys(finalScenes).length === 0) {
      let hydratedCombatants = [...freshPCs];
      try {
        const savedCombatants = JSON.parse(localStorage.getItem(COMBATANTS_STORAGE_KEY) || "[]");
        if (Array.isArray(savedCombatants) && savedCombatants.length) {
          hydratedCombatants = injectFreshDBData(savedCombatants);
          hydratedCombatants = sortByInitiative(hydratedCombatants);
        }
      } catch {}

      finalScenes = { [DEFAULT_SCENE_ID]: { name: DEFAULT_SCENE_NAME, combatants: hydratedCombatants } };
      finalCombatants = hydratedCombatants;
    }

    setScenes(finalScenes);
    setSceneId(finalSceneId);
    setCombatants(finalCombatants);
  }, []);

  useEffect(() => {
    if (!Object.keys(scenes).length) return;
    const next = { ...scenes, [sceneId]: { ...(scenes[sceneId] || { name: DEFAULT_SCENE_NAME }), combatants } };
    setScenes(previous => previous[sceneId]?.combatants === combatants ? previous : next);
    localStorage.setItem(SCENES_STORAGE_KEY, JSON.stringify(next));
    localStorage.setItem(COMBATANTS_STORAGE_KEY, JSON.stringify(combatants));
  }, [combatants]);

  useEffect(() => {
    if (!combatants.length) return;
    const first = combatants[0];
    const second = combatants[1] || first;
    setAttacker(current => combatants.some(c => String(c.id) === current) ? current : String(first.id));
    setTarget(current => combatants.some(c => String(c.id) === current) ? current : String(second.id));
    setCustomNpcId(current => combatants.some(c => String(c.id) === current) ? current : String(first.id));
  }, [combatants]);

  // 2. ÉCOUTE SSE : Màj en temps réel (des blessures et des maximums !)
  useEffect(() => {
    const sseUrl = activeGroupId ? `/stream/characters?groupe_id=${activeGroupId}` : '/stream/characters';
    const evtSource = new EventSource(sseUrl);

    evtSource.onmessage = (e) => {
      try {
        const { characterId, updates } = JSON.parse(e.data);

        // A. On met à jour le cerveau de vérité (pour les futures restaurations)
        setDbCharacters(prev => prev.map(char => 
          String(getCharacterId(char)) === String(characterId) 
            ? { ...char, ...updates } 
            : char
        ));

        // B. On met à jour les combattants visibles à l'écran
        setCombatants((prevCombatants) =>
          prevCombatants.map((c) => {
            const cId = c.fullChar?.id_Character || c.id;
            if (!c.isPC || String(cId) !== String(characterId)) {
              return c;
            }
            
            const updatedCombatant = { ...c };
            updatedCombatant.fullChar = { ...updatedCombatant.fullChar, ...updates };

            if (updates.blessurelegere !== undefined) updatedCombatant.l = updates.blessurelegere;
            if (updates.blessuregrave !== undefined) updatedCombatant.g = updates.blessuregrave;
            if (updates.blessuremortelle !== undefined) updatedCombatant.m = updates.blessuremortelle;
            
            // 🔥 Correction : On écoute aussi les changements de MAXIMUMS de blessures !
            if (updates.maxblessurelegere !== undefined) updatedCombatant.lMax = updates.maxblessurelegere;
            if (updates.maxblessuregrave !== undefined) updatedCombatant.gMax = updates.maxblessuregrave;
            if (updates.maxblessuremortelle !== undefined) updatedCombatant.mMax = updates.maxblessuremortelle;

            return updatedCombatant;
          })
        );
      } catch (err) {
        console.error("Erreur de synchro SSE Personnage:", err);
      }
    };

    return () => evtSource.close();
  }, [activeGroupId]);

  const addLog = useCallback((message: string) => {
    setLog(previous => [...previous, message].slice(-80));
  }, []);

  const updateWorld = useCallback((field: string, value: any) => {
    setWorld(previous => ({ ...previous, [field]: value }));
  }, []);

  const saveWorld = useCallback(async () => {
    setSaveState("saving");
    const payload = {
      saison: world.saison ?? null,
      climat: world.climat ?? null,
      timeOfDay: world.timeOfDay ?? null,
      weekType: world.weekType ?? null,
      dayNumber: world.dayNumber ?? null,
      sinlaPhase: world.sinlaPhase ?? null,
      akhatState: world.akhatState ?? null,
      loisCoutumes: world.loisCoutumes ?? null,
      rations: world.rations ?? null,
      etatMontures: world.etatMontures ?? null,
      encombrement: world.encombrement ?? null,
      groupeId: activeGroupId || null,
    };

    try {
      const response = await fetch("/admin/world-state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setSaveState(response.ok ? "saved" : "error");
    } catch {
      setSaveState("error");
    }
    window.setTimeout(() => setSaveState("idle"), 2200);
  }, [activeGroupId, world]);

  const handleGroupChange = useCallback((id: string) => {
    setActiveGroupId(id);
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("groupe_id", id);
    else url.searchParams.delete("groupe_id");
    window.location.href = url.toString();
  }, []);

  const addQuickNpc = useCallback(() => {
    const threatConfig = THREAT[threat];
    const experienceConfig = EXPERIENCE[experience];
    const roleConfig = ROLE[role];
    if (!threatConfig || !experienceConfig || !roleConfig) return;

    const npc = createQuickNpc(
      npcName,
      { ...threatConfig, name: threat },
      { ...experienceConfig, name: experience },
      { ...roleConfig, name: role },
      specialty,
    );
    setCombatants(previous => [...previous, npc]);
    setNpcName("");
    addLog(`→ ${npc.name} ajouté au traqueur.`);
  }, [addLog, experience, npcName, role, specialty, threat]);

  const addBestiaryNpc = useCallback(() => {
    const adversary = (data.adversaries || []).find(item => String(item.name) === bestId);
    if (!adversary) return;
    const npc = createBestiaryNpc(adversary, combatants);
    setCombatants(previous => [...previous, npc]);
    addLog(`→ Bestiaire : ${npc.name} ajouté.`);
  }, [addLog, bestId, combatants, data.adversaries]);

  const rollNpcInitiative = useCallback(() => {
    setCombatants(previous => previous.map(combatant => {
      if (combatant.isPC) return combatant;
      const raw = String(combatant.npcData?.reactRaw || combatant.reaction).replace(/\s/g, "").toUpperCase();
      const pool = parseInt(raw, 10) || 2;
      const bonus = raw.includes("+") ? parseInt(raw.split("+")[1], 10) || 0 : 0;
      const result = rollD10(pool, Number(pnjDiff));
      addLog(`→ Jet PNJ [${combatant.name}] : ${pool}D10 vs ${pnjDiff} → [${result.rolls.join(", ")}] = ${result.successes + bonus}`);
      return { ...combatant, init: result.successes + bonus };
    }));
  }, [addLog, pnjDiff]);

  const sortInitiativeOrder = useCallback(() => {
    setCombatants(previous => sortByInitiative(previous));
    addLog("→ Ordre d'action appliqué (égalité : PJ prioritaire).");
  }, [addLog]);

  const removeCombatant = useCallback((id: string | number) => {
    setCombatants(previous => previous.filter(combatant => String(combatant.id) !== String(id)));
  }, []);

  const clearEnemies = useCallback(() => {
    setCombatants(previous => previous.filter(combatant => combatant.isPC));
    addLog("→ PNJ balayés du traqueur.");
  }, [addLog]);

  // 🔥 CORRECTION : On restaure en puisant dans la BDD en temps réel, pas dans le cache périmé !
  const restorePc = useCallback((id: string | number) => {
    const character = dbCharacters.find(item => String(getCharacterId(item)) === String(id));
    if (!character) return;
    
    const base = toCombatant(character, data.equipment || []);
    const hydrated = hydratePC(base, character);
    
    setCombatants(previous => [...previous, hydrated]);
    addLog(`→ ${character.nom || "PJ"} réintégré.`);
  }, [addLog, dbCharacters, data.equipment]);

  const changeWound = useCallback((id: string | number, type: WoundType, value: number) => {
    setCombatants(previous => {
      const targetCombatant = previous.find(c => String(c.id) === String(id));
      
      if (targetCombatant?.isPC) {
        const charId = targetCombatant.fullChar?.id_Character || targetCombatant.id;
        const fieldMap = { l: "blessurelegere", g: "blessuregrave", m: "blessuremortelle" };
        const dbField = fieldMap[type];
        
        if (dbField) {
          updateCharacterField(charId, dbField, Math.max(0, value))
            .catch(e => console.error("Erreur API blessure:", e));
        }
      }

      return previous.map(combatant => String(combatant.id) === String(id) ? updateWound(combatant, type, value) : combatant);
    });
  }, []);

  const updateInit = useCallback((id: string | number, value: number) => {
    setCombatants(previous => previous.map(combatant => String(combatant.id) === String(id) ? { ...combatant, init: value } : combatant));
  }, []);

  const updateArmor = useCallback((id: string | number, value: string) => {
    setCombatants(previous => previous.map(combatant => String(combatant.id) === String(id) ? { ...combatant, armor: value } : combatant));
  }, []);

  // Ajoute cette fonction vers la fin, à côté de tes autres actions (ex: updateInit)
  const updateNpcData = useCallback((id: string | number, field: string, value: any) => {
    setCombatants(previous => previous.map(combatant => {
      if (String(combatant.id) === String(id)) {
        return { ...combatant, npcData: { ...combatant.npcData, [field]: value } };
      }
      return combatant;
    }));
  }, []);

  const quickRoll = useCallback((name: string, stat: string, formula: string, relances = 0) => {
    const { dice, bonus } = parseDiceFormula(formula);
    if (!dice && !bonus) return;
    const first = rollD10(dice);
    let successes = first.successes + bonus;
    let rerolls = 0;
    if (relances > 0) {
      rerolls = Math.min(relances, dice - first.successes);
      successes += rollD10(rerolls).successes;
    }
    addLog(`→ ${name} — ${stat} : [${first.rolls.join(" ")}]${rerolls ? ` + ${rerolls} relance(s)` : ""} → ${successes} succès`);
  }, [addLog]);

  const rollCustom = useCallback(() => {
    const combatant = combatants.find(item => String(item.id) === customNpcId);
    if (!combatant) return;
    const character = combatant.fullChar || {};
    const carac = Number(character[customCarac] ?? 1) || 1;
    const skill = customSkill === "aucune" ? 0 : Number(character[customSkill] ?? 0) || 0;
    const modifier = Number(customModifier) || 0;
    const total = Math.max(1, carac + skill + modifier);
    quickRoll(combatant.name, `${customCarac} + ${customSkill}${modifier ? ` ${modifier > 0 ? "+" : ""}${modifier}` : ""}`, `${total}D`);
  }, [combatants, customCarac, customModifier, customNpcId, customSkill, quickRoll]);

  const resolveAttack = useCallback(() => {
    const attackerCombatant = combatants.find(item => String(item.id) === attacker);
    const targetCombatant = combatants.find(item => String(item.id) === target);
    if (!attackerCombatant || !targetCombatant) return;

    let attack = Number(attackRoll);
    let defense = Number(defenseRoll);

    if (!Number.isFinite(attack)) attack = 0;
    if (!Number.isFinite(defense)) defense = 0;

    // Jets automatiques PNJ si vides
    if (!attackRoll.trim() && !attackerCombatant.isPC) {
      const pool = parseInt(String(attackerCombatant.npcData?.atk || attackerCombatant.npcData?.contact || 3), 10) || 3;
      attack = rollD10(pool).successes;
      addLog(`→ Attaque auto PNJ ${attackerCombatant.name} : ${pool}D10 → ${attack} succès`);
    }
    if (!defenseRoll.trim() && !targetCombatant.isPC) {
      const pool = parseInt(String(targetCombatant.npcData?.contact || targetCombatant.npcData?.act || 3), 10) || 3;
      defense = rollD10(pool).successes;
      addLog(`→ Défense auto PNJ ${targetCombatant.name} : ${pool}D10 → ${defense} succès`);
    }

    addLog(`→ ${attackerCombatant.name} attaque ${targetCombatant.name} : ${attack} R. VS ${defense} R.`);
    
    if (defense >= attack) {
      addLog(`→ Défense réussie : aucun dommage.${defense - attack >= 3 ? " Contre-attaque disponible." : ""}`);
      return;
    }

    // --- LOGIQUE DE DÉGÂTS ET DE TYPE D'ARMURE ---
    let baseDamage = 0;
    let weaponName = "";
    let damageType = "P"; // Par défaut Perforant

    let effectiveWeapon = weapon;
    if (effectiveWeapon === "auto") {
      effectiveWeapon = attackerCombatant.isPC
        ? (attackerCombatant.fullChar?.armeEquipee || "Coup de poing")
        : "npc_weapon";
    }

    if (!attackerCombatant.isPC && effectiveWeapon === "npc_weapon") {
      const armeStr = attackerCombatant.npcData?.arme || "";
      weaponName = armeStr.split(',')[0] || "Attaque naturelle"; // ex: "morsure"
      
      const matchDmg = armeStr.match(/dommages\s*([+-]?\d+)/i);
      baseDamage = matchDmg ? parseInt(matchDmg[1], 10) : 0;
      
      const matchType = armeStr.match(/\(([PTE])\)/i);
      if (matchType) damageType = matchType[1].toUpperCase();

    } else {
      const puissance = Number(attackerCombatant.fullChar?.puissance) || 1;
      const w = (effectiveWeapon === "custom" ? customWeapon : effectiveWeapon).toLowerCase();
      weaponName = effectiveWeapon === "custom" ? "Arme custom" : effectiveWeapon;

      if (effectiveWeapon === "custom") {
        const parts = customWeapon.split(",");
        const dmgInput = parts[0] || "";
        damageType = (parts[1] || "P").trim().toUpperCase();
        
        if (dmgInput.includes("+") || dmgInput.includes("-")) {
          baseDamage = Math.max(0, puissance + (parseInt(dmgInput, 10) || 0));
        } else {
          baseDamage = parseInt(dmgInput, 10) || puissance;
        }
      } else {
        // Déduction automatique du Type et Dégâts pour PJ
        if (w.includes("fronde")) { baseDamage = 2; damageType = "P"; }
        else if (w.includes("arc")) { baseDamage = w.includes("lourd") ? 4 : 3; damageType = "P"; }
        else if (w.includes("deux mains")) { baseDamage = puissance + 2; damageType = "T"; }
        else if (w.includes("épée") || w.includes("hache")) { baseDamage = puissance + 1; damageType = "T"; }
        else if (w.includes("lance") || w.includes("javelot")) { baseDamage = puissance + 1; damageType = "P"; }
        else if (w.includes("poing") || w.includes("tête") || w.includes("pierre")) { baseDamage = Math.max(0, puissance - 1); damageType = "E"; }
        else if (w.includes("couteau") || w.includes("pied")) { baseDamage = puissance; damageType = "P"; }
        else { baseDamage = puissance; damageType = "P"; }
      }
    }

    const rawDamage = baseDamage + attack; 
    const armor = getArmor(targetCombatant.armor, damageType);
    const net = Math.max(0, rawDamage - armor);
    
    addLog(`→ Dégâts [${weaponName}] : Base ${baseDamage} + ${attack} réussites = ${rawDamage} bruts (${damageType}).`);
    addLog(`→ ${rawDamage} dégâts bruts - ${armor} armure = ${net} dégâts nets.`);
    
  }, [addLog, attackRoll, attacker, combatants, customWeapon, defenseRoll, target, weapon]);

  const newScene = useCallback(() => {
    const name = window.prompt("Nom de la nouvelle scène :", "Nouvelle scène");
    if (!name) return;
    const id = `tab_${Date.now()}`;
    setScenes(previous => ({ ...previous, [id]: { name, combatants: [] } }));
    setSceneId(id);
    setCombatants([]);
  }, []);

  const switchScene = useCallback((id: string) => {
    const scene = scenes[id];
    if (!scene) return;
    setSceneId(id);
    setCombatants(scene.combatants || []);
  }, [scenes]);

  const deleteScene = useCallback((id: string) => {
    if (Object.keys(scenes).length <= 1 || !window.confirm("Supprimer cette scène et ses ennemis ?")) return;
    const next = { ...scenes };
    delete next[id];
    const nextId = Object.keys(next)[0];
    setScenes(next);
    setSceneId(nextId);
    setCombatants(next[nextId]?.combatants || []);
  }, [scenes]);

  const missingPCs = useMemo(() => dbCharacters.filter(character => !combatants.some(combatant => String(combatant.id) === String(getCharacterId(character)))), [combatants, dbCharacters]);
  const combatantCount = useMemo(() => ({ pcs: combatants.filter(c => c.isPC).length, npcs: combatants.filter(c => !c.isPC).length }), [combatants]);

  return {
    state: {
      activeGroupId, world, saveState, scenes, sceneId, combatants, log, activeSection,
      pnjDiff, bestId, npcName, threat, experience, role, specialty, customNpcId,
      customCarac, customSkill, customModifier, attacker, target, attackRoll, defenseRoll,
      weapon, customWeapon,
    } satisfies State,
    derived: { missingPCs, combatantCount },
    actions: {
      setActiveSection, setPnjDiff, setBestId, setNpcName, setThreat, setExperience,
      setRole, setSpecialty, setCustomNpcId, setCustomCarac, setCustomSkill, setCustomModifier,
      setAttacker, setTarget, setAttackRoll, setDefenseRoll, setWeapon, setCustomWeapon,
      handleGroupChange, updateWorld, saveWorld, newScene, switchScene, deleteScene,
      addQuickNpc, addBestiaryNpc, rollNpcInitiative, sortInitiativeOrder, removeCombatant,
      clearEnemies, restorePc, changeWound, updateInit, updateArmor, updateNpcData, quickRoll, rollCustom, resolveAttack,
    },
  };
}