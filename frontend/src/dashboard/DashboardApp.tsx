import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronLeft, Check, Plus, Trash2, Package, RotateCcw, X, Menu } from "lucide-react";
import * as Switch from "@radix-ui/react-switch";
import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import { throwStatCheck, updateCharacterField } from "./api";

// Imports des onglets
import InteractionsTab from "./tabs/InteractionsTab";
import PersonnageTab from "./tabs/PersonnageTab";
import RessourcesTab from "./tabs/RessourcesTab";
import EclatTab from "./tabs/EclatTab";
import RituelsTab from "./tabs/RituelsTab";
import GroupeTab from "./tabs/GroupeTab";

// ─── Types ──────────────────────────────────────────────────────────────────

interface DiceRoll { die: string; value: number; }

interface RollResult {
  id: number;
  character: string;
  initial: string;
  color: string;
  characteristic: string | null;
  rolls?: DiceRoll[];
  total?: number;
  modifier?: number;
  isGroupAction?: boolean;
  timestamp: string;
  message: string;
  rawHtml?: string;
  avatarUrl: string;
}

interface InventoryItem {
  id: number;
  name: string;
  type: string;
  stats: string;
  description?: string;
  quantity?: number;
}

interface Skill { l: string; v: string; }

// ─── Constants ──────────────────────────────────────────────────────────────

const TABS = ["Résultats", "Interactions", "Groupe", "Personnage", "Ressources", "Éclat", "Rituels"] as const;
type Tab = typeof TABS[number];

const DICE_TYPES = [
  { die: "d4",  sides: 4  },
  { die: "d6",  sides: 6  },
  { die: "d10", sides: 10 },
  { die: "d20", sides: 20 },
];

const REAL_CHARACTERISTICS = [
  { name: "Puissance",     value: "puissance",     key: "PUI" },
  { name: "Précision",     value: "precision",     key: "PRE" },
  { name: "Réflexes",      value: "reflexes",      key: "REF" },
  { name: "Résistance",    value: "resistance",    key: "RES" },
  { name: "Connaissance",  value: "connaissance",  key: "CON" },
  { name: "Perception",    value: "perception",    key: "PER" },
  { name: "Volonté",       value: "volonte",       key: "VOL" },
  { name: "Empathie",      value: "empathie",      key: "EMP" },
];

const ALL_SKILLS: Skill[] = [
  { l: "Adresse", v: "adresse" },
  { l: "Animalisme", v: "animalisme" },
  { l: "Armurerie", v: "armurerie" },
  { l: "Artisanat", v: "artisanat" },
  { l: "Arts", v: "arts" },
  { l: "Athlétisme", v: "athletisme" },
  { l: "Bouclier", v: "bouclier" },
  { l: "Cité", v: "cite" },
  { l: "Civilisations", v: "civilisations" },
  { l: "Corps à Corps", v: "cac" },
  { l: "Discrétion", v: "discretion" },
  { l: "Éclats", v: "eclats" },
  { l: "Faune", v: "faune" },
  { l: "Flore", v: "flore" },
  { l: "Lancer", v: "lancer" },
  { l: "Lunes", v: "lunes" },
  { l: "Mécanisme", v: "mecanisme" },
  { l: "Mêlée", v: "melee" },
  { l: "Montures", v: "montures" },
  { l: "Mythes", v: "mythes" },
  { l: "Panthéons", v: "pantheons" },
  { l: "Pistage", v: "pistage" },
  { l: "Relationnel", v: "relationnel" },
  { l: "Rituels", v: "rituels" },
  { l: "Runes", v: "runes" },
  { l: "Soins", v: "soins" },
  { l: "Territoire", v: "territoire" },
  { l: "Tir", v: "tir" },
  { l: "Vigilance", v: "vigilance" },
  { l: "Voyage", v: "voyage" },
].sort((a, b) => a.l.localeCompare(b.l, "fr"));

const INJURY_CONFIG = [
  { key: "blessurelegere",   offset: 0, label: "Légères",   defaultMax: 5, bg: "gods:bg-amber-500",  border: "gods:border-amber-500"  },
  { key: "blessuregrave",    offset: 3, label: "Sérieuses", defaultMax: 3, bg: "gods:bg-orange-600", border: "gods:border-orange-600" },
  { key: "blessuremortelle", offset: 7, label: "Mortelles", defaultMax: 2, bg: "gods:bg-destructive", border: "gods:border-destructive" },
] as const;

// ─── Helpers & Components ───────────────────────────────────────────────────

function DSLabel({ children }: { children: string }) {
  return (
    <span className="gods:block gods:text-xs gods:tracking-widest gods:uppercase gods:text-primary gods:font-display gods:mb-3">
      {children}
    </span>
  );
}

function SelectArrow() {
  return (
    <ChevronDown
      size={14}
      className="gods:absolute gods:right-3 gods:top-1/2 gods:-translate-y-1/2 gods:text-muted-foreground gods:pointer-events-none"
    />
  );
}

function AvatarImage({ src, fallback, color, className, style }: { src: string; fallback: string; color: string; className: string; style?: React.CSSProperties }) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`gods:flex gods:items-center gods:justify-center gods:text-xs gods:font-bold gods:shrink-0 gods:font-display ${className}`}
        style={{ backgroundColor: color, color: "#F6F2EC", ...style }}>
        {fallback}
      </div>
    );
  }

  return <img src={src} alt="Avatar" onError={() => setError(true)} className={`gods:object-cover gods:object-top gods:shrink-0 ${className}`} style={style} />;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function DashboardApp({ initialCharacter, characters, weapons, armors, equipmentList, allGroupes, conversationId }: any) {  
  const [character, setCharacter] = useState<any>(initialCharacter);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Accordion state pour le layout mobile
  const [expandedPanel, setExpandedPanel] = useState<"chat" | "inventory" | "notes">("chat");

  const getAvatar = (char: any) => {
    if (char && char.avatar && char.avatar.trim() !== "") return char.avatar;
    const genrePath = char?.genre || "homme";
    return `/images/characters/${genrePath}/${genrePath}-1.jpg`;
  };

  const charInitial = character?.nom ? character.nom.charAt(0).toUpperCase() : "?";

  const [diceCounts, setDiceCounts] = useState<Record<string, number>>(
    Object.fromEntries(DICE_TYPES.map(({ die }) => [die, 0]))
  );
  const [diceColor, setDiceColor] = useState("#9A7818");
  const colorRef = useRef<HTMLInputElement>(null);

  const [openCharIdx, setOpenCharIdx] = useState<number | null>(null);
  const [popoverStep, setPopoverStep] = useState<"skills" | "details">("skills");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [rollModifier, setRollModifier] = useState("0");
  const [isGroupAction, setIsGroupAction] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>("Résultats");
  const [results, setResults] = useState<RollResult[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);

  const [inventory, setInventory] = useState<InventoryItem[]>(
    Array.isArray(character.inventory) ? character.inventory.map((i: any, idx: number) => ({ id: idx, ...i })) : []
  );
  const [showAddItem, setShowAddItem] = useState(false);
  const [addMode, setAddMode] = useState<"manual" | "custom">("manual");
  const [selectedManualItem, setSelectedManualItem] = useState("");
  const [customItem, setCustomItem] = useState({ name: "", type: "", stats: "", description: "" });

  const [notes, setNotes] = useState(character.notes || "");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");

  const [notesWidth, setNotesWidth] = useState(320);
  const [inventoryHeight, setInventoryHeight] = useState(240);

  const resizeStateRef = useRef<{
    type: "notes" | "inventory";
    startX: number;
    startY: number;
    startSize: number;
  } | null>(null);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const resize = resizeStateRef.current;
      if (!resize) return;

      if (resize.type === "notes") {
        const nextWidth = resize.startSize - (e.clientX - resize.startX);
        setNotesWidth(Math.min(560, Math.max(220, nextWidth)));
      } else {
        const nextHeight = resize.startSize - (e.clientY - resize.startY);
        setInventoryHeight(Math.min(520, Math.max(140, nextHeight)));
      }
    };

    const stopResize = () => {
      resizeStateRef.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResize);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResize);
    };
  }, []);

  const startResize = (
    type: "notes" | "inventory",
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    resizeStateRef.current = {
      type,
      startX: e.clientX,
      startY: e.clientY,
      startSize: type === "notes" ? notesWidth : inventoryHeight,
    };
    document.body.style.cursor = type === "notes" ? "col-resize" : "row-resize";
    document.body.style.userSelect = "none";
  };

  const switchCharacter = async (charId: string) => {
    try {
      await fetch(`/Character/Favorite/set/${charId}`);
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (notes === character.notes) return;
    setSaveStatus("saving");
    const t = setTimeout(() => {
      updateCharacterField(character.id_Character || character.id, "notes", notes);
      setSaveStatus("saved");
    }, 700);
    return () => clearTimeout(t);
  }, [notes]);

  useEffect(() => {
    const charId = character.id_Character || character.id;
    if (!charId) return;

    const sseUrl = character.groupeId ? `/stream/characters?groupe_id=${character.groupeId}` : '/stream/characters';
    const evtSource = new EventSource(sseUrl);

    evtSource.onmessage = (e) => {
      try {
        const { characterId, updates } = JSON.parse(e.data);
        if (String(characterId) === String(charId)) {
          setCharacter((prev: any) => ({ ...prev, ...updates }));
        }
      } catch (err) {
        console.error("Erreur de parsing SSE Personnage", err);
      }
    };

    return () => evtSource.close();
  }, [character.id_Character, character.id, character.groupeId]);

  useEffect(() => {
    let evtSource: EventSource | null = null;
    const fetchHistory = async () => {
      const url = character.groupeId ? `/fetch/rolls?groupe_id=${character.groupeId}` : '/fetch/rolls';
      try {
        const res = await fetch(url, { method: 'PUT' });
        const data = await res.json();
        setResults(data.map(formatBackendRoll));      
      } catch (e) {}
    };

    fetchHistory();
    const connectSSE = () => {
      const sseUrl = character.groupeId ? `/stream/rolls?groupe_id=${character.groupeId}` : '/stream/rolls';
      evtSource = new EventSource(sseUrl);
      evtSource.onmessage = (e) => {
        try {
          const newRolls = JSON.parse(e.data);
          setResults(prev => {
            const existingIds = new Set(prev.map(r => r.id));
            const unique = newRolls.filter((r: any) => !existingIds.has(r.id));
            return [...prev, ...unique.map(formatBackendRoll)];          
          });
        } catch (err) {}
      };
    };

    connectSSE();
    return () => evtSource?.close();
  }, [character.groupeId]);

  const formatBackendRoll = (r: any): RollResult => {
    let rawContent = r.content || "";
    let color = "#9A7818";
    const metaMatch = rawContent.match(/<!--meta:(.*?)-->/);
    if (metaMatch) {
      try { color = JSON.parse(metaMatch[1]).color || color; } catch(e){}
      rawContent = rawContent.replace(metaMatch[0], '');
    }
    return {
      id: r.id,
      character: r.Character?.nom || "Inconnu",
      initial: (r.Character?.nom || "?").charAt(0).toUpperCase(),
      avatarUrl: getAvatar(r.Character),
      color,
      characteristic: (r.caracteristic && r.competence) ? `${r.caracteristic} / ${r.competence}` : null,
      timestamp: r.createdAt
  ? new Date(r.createdAt).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  : "—",
      message: "",
      rawHtml: rawContent
    };
  };

  useEffect(() => {
  if (activeTab === "Résultats" && chatRef.current) {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }
}, [results, activeTab]);

  const adjustDice = (die: string, delta: number) =>
    setDiceCounts((prev) => ({ ...prev, [die]: Math.max(0, (prev[die] || 0) + delta) }));

  const resetDice = () =>
    setDiceCounts(Object.fromEntries(DICE_TYPES.map(({ die }) => [die, 0])));

  const diceFormula = DICE_TYPES
    .filter(({ die }) => (diceCounts[die] || 0) > 0)
    .map(({ die }) => `${diceCounts[die]}${die}`)
    .join("+") || "—";

  const closeCharPopover = () => {
    setOpenCharIdx(null);
    setPopoverStep("skills");
    setSelectedSkill(null);
    setRollModifier("0");
    setIsGroupAction(false);
  };

  const openCharPopover = (idx: number) => {
    setOpenCharIdx(idx);
    setPopoverStep("skills");
    setSelectedSkill(null);
    setRollModifier("0");
    setIsGroupAction(false);
    resetDice();
  };

  const pickSkill = (skill: Skill) => {
    setSelectedSkill(skill);
    setPopoverStep("details");
  };

  const backToSkillList = () => {
    setPopoverStep("skills");
    setSelectedSkill(null);
  };

  const handleRoll = async () => {
    if (selectedSkill !== null && openCharIdx !== null) {
      const parsedModifier = parseInt(rollModifier, 10);
      const payload = {
        caracteristic: REAL_CHARACTERISTICS[openCharIdx].value,
        competence: selectedSkill.v,
        modifier: Number.isNaN(parsedModifier) ? 0 : parsedModifier,
        isCollective: isGroupAction
      };
      try {
        const res = await throwStatCheck(payload);
        const totalCounts: Record<string, number> = { d10: res.totalDice };
        if (res.extraDice) {
          Object.entries(res.extraDice).forEach(([k, v]) => totalCounts[k.toLowerCase()] = ((totalCounts[k.toLowerCase()] || 0) + (v as number)));
        }
        window.randomDiceThrow?.(totalCounts, res.relances, payload.caracteristic, payload.competence);
      } catch(e) {}
      closeCharPopover();
    } else {
      const nonZero = Object.fromEntries(Object.entries(diceCounts).filter(([_, v]) => v > 0));
      if (Object.keys(nonZero).length > 0) window.randomDiceThrow?.(nonZero, 0, null, null);
    }
    resetDice();
  };

  const toggleInjury = (type: string, index: number) => {
    const current = character[type] || 0;
    const newVal = current === index + 1 ? index : index + 1;
    setCharacter((prev: any) => ({ ...prev, [type]: newVal }));
    updateCharacterField(character.id_Character || character.id, type, newVal);
  };

  const saveInventoryToDB = (newInv: InventoryItem[]) => {
    updateCharacterField(character.id_Character || character.id, "inventory", JSON.stringify(newInv.map(({id, ...rest}) => rest)));
  };

  const removeItem = (id: number) => {
    const newInv = inventory.filter((i) => i.id !== id);
    setInventory(newInv);
    saveInventoryToDB(newInv);
  };

  const addManualItem = () => {
    const found = equipmentList.find((i: any) => i.name === selectedManualItem);
    if (!found) return;
    const newInv = [...inventory, { id: Date.now(), name: found.name, type: found.type || "Objet", stats: found.stats || "—", description: found.desc }];
    setInventory(newInv);
    saveInventoryToDB(newInv);
    setSelectedManualItem("");
    setShowAddItem(false);
  };

  const addCustomItem = () => {
    if (!customItem.name) return;
    const newInv = [...inventory, { id: Date.now(), name: customItem.name, type: customItem.type || "Objet", stats: customItem.stats || "—", description: customItem.description }];
    setInventory(newInv);
    saveInventoryToDB(newInv);
    setCustomItem({ name: "", type: "", stats: "", description: "" });
    setShowAddItem(false);
  };

  const handleEquip = (field: string, val: string) => {
    setCharacter((prev: any) => ({ ...prev, [field]: val }));
    updateCharacterField(character.id_Character || character.id, field, val);
  };

  return (
    <div className="gods:h-full gods:flex gods:relative gods:bg-background gods:text-foreground gods:overflow-hidden">

      {/* Paper grain background */}
      <div aria-hidden className="gods:pointer-events-none gods:absolute gods:inset-0 gods:z-[5] gods:mix-blend-multiply gods:opacity-[0.055]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='pn'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23pn)'/%3E%3C/svg%3E")` }} />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="gods:absolute gods:inset-0 gods:bg-background/80 gods:backdrop-blur-sm gods:z-[40] gods:lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── LEFT COLUMN (Sidebar) ────────────────────────────────────────── */}
      <aside className={`gods:absolute gods:inset-y-0 gods:left-0 gods:z-[50] gods:w-full gods:sm:w-80 gods:lg:w-80 gods:bg-background gods:lg:bg-card/40 gods:border-r gods:border-border gods:flex gods:flex-col gods:transition-transform gods:duration-300 gods:ease-in-out gods:lg:static gods:lg:translate-x-0 ${isSidebarOpen ? "gods:translate-x-0" : "gods:-translate-x-full"}`}>
        
        {/* Header - Avatar & Select */}
        <div className="gods:p-5 gods:border-b gods:border-border gods:flex gods:items-center gods:justify-between gods:gap-3">
          <div className="gods:flex gods:items-center gods:gap-3 gods:flex-1 gods:min-w-0">
            <AvatarImage
              src={getAvatar(character)}
              fallback={charInitial}
              color={diceColor}
              className="gods:w-10 gods:h-10 gods:rounded-full gods:border gods:border-primary/30"
            />
            <select
              value={character.id_Character || character.id}
              onChange={(e) => switchCharacter(e.target.value)}
              className="gods:bg-transparent gods:border-none gods:outline-none gods:text-lg gods:font-display gods:tracking-wider gods:cursor-pointer gods:flex-1 gods:text-foreground gods:min-w-0 gods:truncate !gods:outline-none"
            >
              {characters.map((c: any) => <option key={c.id_Character || c.id} value={c.id_Character || c.id}>{c.nom}</option>)}
            </select>
          </div>
          
          {/* Close button (Mobile only) */}
          <button 
            className="gods:lg:hidden gods:flex gods:items-center gods:justify-center gods:w-8 gods:h-8 gods:rounded-md gods:border gods:border-border gods:text-muted-foreground hover:gods:text-primary hover:gods:border-primary/35 gods:transition-all !gods:outline-none"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={16} />
          </button>
        </div>

        <div className="gods:flex-1 gods:overflow-y-auto gods:p-5 gods:space-y-8">
          
          {/* Dice Section */}
          <section>
            <div className="gods:flex gods:items-center gods:justify-between gods:mb-2">
              <DSLabel>Lancer de dés</DSLabel>
              <input ref={colorRef} id="dice-color-picker" type="color" value={diceColor} onChange={(e) => setDiceColor(e.target.value)} className="gods:sr-only" />
              <button
                className="gods:w-5 gods:h-5 gods:rounded gods:border gods:border-border gods:shadow-sm gods:transition-transform hover:gods:scale-110 gods:-mt-2"
                style={{ backgroundColor: diceColor }}
                onClick={() => colorRef.current?.click()}
                title="Couleur des dés"
              />
            </div>

            <div className="gods:mb-4 gods:px-4 gods:py-2 gods:bg-input-background gods:border gods:border-border gods:rounded-md gods:min-h-[2.5rem] gods:flex gods:items-center">
              <span className={`gods:font-display gods:text-base gods:tracking-wider ${diceFormula === "—" ? "gods:text-muted-foreground" : "gods:text-foreground"}`}>
                {diceFormula}
              </span>
            </div>

            <div className="gods:space-y-2 gods:mb-5">
              {DICE_TYPES.map(({ die }) => (
                <div key={die} className="gods:flex gods:items-center gods:justify-between gods:px-2">
                  <span className="gods:font-display gods:text-xs gods:tracking-widest gods:text-muted-foreground gods:uppercase">{die}</span>
                  <div className="gods:flex gods:items-center gods:gap-3">
                    <button onClick={() => adjustDice(die, -1)}
                      className="gods:w-7 gods:h-7 gods:rounded gods:border gods:border-border gods:text-muted-foreground hover:gods:border-primary/40 hover:gods:text-foreground gods:flex gods:items-center gods:justify-center gods:leading-none gods:transition-all gods:text-base !gods:outline-none">
                      −
                    </button>
                    <span className="gods:w-5 gods:text-center gods:text-base gods:font-display gods:text-foreground gods:tabular-nums">
                      {diceCounts[die]}
                    </span>
                    <button onClick={() => adjustDice(die, 1)}
                      className="gods:w-7 gods:h-7 gods:rounded gods:border gods:border-border gods:text-muted-foreground hover:gods:border-primary/40 hover:gods:text-foreground gods:flex gods:items-center gods:justify-center gods:leading-none gods:transition-all gods:text-base !gods:outline-none">
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="gods:flex gods:gap-3">
              <button onClick={handleRoll} disabled={diceFormula === "—"}
                className="gods:flex-1 gods:py-2.5 gods:bg-primary gods:!text-primary-foreground gods:text-sm gods:font-medium gods:rounded-md hover:gods:bg-primary/85 disabled:gods:opacity-35 disabled:gods:cursor-not-allowed gods:transition-all gods:font-display gods:tracking-wider uppercase !gods:outline-none">
                Lancer
              </button>
              <button onClick={resetDice}
                className="gods:px-4 gods:py-2.5 gods:border gods:border-border gods:text-muted-foreground hover:gods:text-foreground gods:rounded-md gods:transition-colors !gods:outline-none">
                <RotateCcw size={16} />
              </button>
            </div>
          </section>

          <hr className="gods:border-border" />

          {/* Injuries */}
          <section>
            <DSLabel>Blessures</DSLabel>
            <div className="gods:space-y-3">
              {INJURY_CONFIG.map((inj) => {
                const max = character[`max${inj.key}`] || inj.defaultMax;
                const baseResistance = Number(character.resistance) || 0;
                const threshold = baseResistance + inj.offset;
                
                return (
                  <div key={inj.key} className="gods:flex gods:items-center gods:justify-between">
                    <span className="gods:text-base gods:text-muted-foreground">
                      {inj.label} ({threshold})
                    </span>
                    <div className="gods:flex gods:gap-1.5">
                      {Array.from({ length: max }).map((_, i) => (
                        <button key={i} onClick={() => toggleInjury(inj.key, i)}
                          className={`gods:w-4 gods:h-4 gods:rounded-full gods:border-2 gods:transition-all hover:gods:scale-110 !gods:outline-none ${
                            i < (character[inj.key] || 0)
                              ? `${inj.bg} ${inj.border}`
                              : "gods:border-border hover:gods:border-foreground/35"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <hr className="gods:border-border" />

          {/* Characteristics */}
          <section>
            <DSLabel>Caractéristiques</DSLabel>
            <div className="gods:grid gods:grid-cols-2 gods:gap-2">
              {REAL_CHARACTERISTICS.map((char, i) => {
                const isOpen = openCharIdx === i;
                const hasSkill = isOpen && popoverStep === "details" && selectedSkill !== null;
                return (
                  <Popover.Root
                    key={char.key}
                    open={isOpen}
                    onOpenChange={(open) => {
                      if (open) openCharPopover(i);
                      else if (openCharIdx === i) closeCharPopover();
                    }}
                  >
                    <Popover.Trigger asChild>
                      <button
                        className={`!gods:outline-none gods:px-3 gods:py-2.5 gods:rounded-md gods:border gods:text-left gods:transition-all ${
                        hasSkill
                          ? "gods:border-primary/40 gods:bg-primary/5 gods:text-primary"
                          : isOpen
                          ? "gods:border-primary/40 gods:bg-primary/10 gods:text-primary"
                          : "gods:border-border gods:text-muted-foreground hover:gods:border-primary/30 hover:gods:text-foreground gods:bg-card/50"
                      }`}>
                        <div className="gods:font-display gods:tracking-wider gods:text-sm gods:uppercase gods:truncate">
                          {hasSkill ? selectedSkill!.l : char.name}
                        </div>
                      </button>
                    </Popover.Trigger>

                    <Popover.Portal>
                      <Popover.Content
                        style={{ outline: "none", maxHeight: "var(--radix-popover-content-available-height)" }}
                        className="gods:z-[300] gods:w-80 gods:flex gods:flex-col gods:bg-card gods:border gods:border-border gods:rounded-lg gods:shadow-2xl gods:overflow-hidden !gods:outline-none"
                        sideOffset={10} side="right" align="center" collisionPadding={16} avoidCollisions
                        onEscapeKeyDown={closeCharPopover}
                      >
                        {popoverStep === "skills" && (
                          <>
                            <div className="gods:flex gods:items-center gods:gap-2 gods:px-4 gods:py-4 gods:border-b gods:border-border gods:shrink-0 gods:bg-muted/30">
                              <button onClick={closeCharPopover}
                                className="gods:flex gods:items-center gods:justify-center gods:w-8 gods:h-8 gods:-ml-2 gods:rounded-md gods:text-muted-foreground hover:gods:text-foreground hover:gods:bg-muted gods:transition-colors !gods:outline-none"
                                title="Annuler">
                                <ChevronLeft size={18} />
                              </button>
                              <p className="gods:text-sm gods:tracking-wider gods:uppercase gods:text-foreground gods:font-display">
                                {char.name} <span className="gods:text-muted-foreground gods:normal-case gods:text-xs gods:tracking-normal">— choisir une compétence</span>
                              </p>
                            </div>
                            <div className="gods:overflow-y-auto gods:max-h-[50vh] gods:p-2">
                              {ALL_SKILLS.map((skill) => (
                                <button key={skill.v}
                                  onClick={() => pickSkill(skill)}
                                  className="gods:w-full gods:px-4 gods:py-2.5 gods:text-base gods:rounded-md gods:text-left gods:transition-colors gods:text-muted-foreground hover:gods:bg-primary/5 hover:gods:text-foreground !gods:outline-none">
                                  {skill.l}
                                </button>
                              ))}
                            </div>
                          </>
                        )}

                        {popoverStep === "details" && selectedSkill && (
                          <div className="gods:flex gods:flex-col">
                            <div className="gods:flex gods:items-center gods:gap-2 gods:px-4 gods:py-4 gods:border-b gods:border-border gods:shrink-0 gods:bg-muted/30">
                              <button onClick={backToSkillList}
                                className="gods:flex gods:items-center gods:justify-center gods:w-8 gods:h-8 gods:-ml-2 gods:rounded-md gods:text-muted-foreground hover:gods:text-foreground hover:gods:bg-muted gods:transition-colors !gods:outline-none"
                                title="Retour">
                                <ChevronLeft size={18} />
                              </button>
                              <p className="gods:text-sm gods:tracking-wider gods:uppercase gods:text-primary gods:font-display gods:truncate">
                                {char.name} / {selectedSkill.l}
                              </p>
                            </div>

                            <div className="gods:p-5 gods:space-y-5">
                              <div>
                                <label className="gods:block gods:text-xs gods:tracking-widest gods:uppercase gods:font-display gods:text-muted-foreground gods:mb-2">Modificateur</label>
                                <input type="number" placeholder="±0" value={rollModifier}
                                  onChange={(e) => setRollModifier(e.target.value)}
                                  className="gods:w-full gods:px-4 gods:py-2.5 gods:bg-input-background gods:border gods:border-border gods:rounded-md gods:text-base gods:text-foreground gods:placeholder:text-muted-foreground focus:gods:border-primary/40 focus:gods:ring-1 focus:gods:ring-primary/20 !gods:outline-none" />
                              </div>

                              <div className="gods:flex gods:items-center gods:justify-between gods:py-2">
                                <span className="gods:text-base gods:text-muted-foreground">Action de groupe</span>
                                <Switch.Root checked={isGroupAction} onCheckedChange={setIsGroupAction}
                                  className={`gods:relative gods:inline-flex gods:h-7 gods:w-12 gods:items-center gods:rounded-full gods:border gods:transition-colors gods:cursor-pointer focus-visible:gods:outline-none focus-visible:gods:ring-2 focus-visible:gods:ring-primary/30 ${
                                    isGroupAction
                                      ? "gods:bg-primary gods:border-primary"
                                      : "gods:bg-muted gods:border-border"
                                  }`}>
                                  <Switch.Thumb className={`gods:flex gods:items-center gods:justify-center gods:h-5 gods:w-5 gods:rounded-full gods:bg-background gods:shadow-md gods:transition-transform ${
                                    isGroupAction ? "gods:translate-x-6" : "gods:translate-x-1"
                                  }`}>
                                    {isGroupAction && <Check size={13} className="gods:text-primary gods:stroke-[3]" />}
                                  </Switch.Thumb>
                                </Switch.Root>
                              </div>

                              <button onClick={handleRoll}
                                className="gods:w-full gods:py-3 gods:bg-primary gods:!text-primary-foreground gods:text-sm gods:font-medium gods:rounded-md hover:gods:bg-primary/85 gods:transition-all gods:font-display gods:tracking-wider gods:uppercase !gods:outline-none">
                                Lancer
                              </button>
                            </div>
                          </div>
                        )}
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                );
              })}
            </div>
          </section>

          <hr className="gods:border-border" />

          {/* Active Equipment */}
          <section>
            <DSLabel>Équipement actif</DSLabel>
            <div className="gods:space-y-4">
              <div>
                <label className="gods:text-xs gods:tracking-widest gods:uppercase gods:font-display gods:text-muted-foreground gods:mb-2 gods:block">Armure</label>
                <div className="gods:relative">
                  <select value={character.armureEquipee || ""} onChange={(e) => handleEquip("armureEquipee", e.target.value)}
                    className="gods:w-full gods:appearance-none gods:px-4 gods:py-2.5 gods:pr-8 gods:bg-input-background gods:border gods:border-border gods:rounded-md gods:text-base gods:text-foreground focus:gods:outline-none focus:gods:border-primary/40 gods:transition-all">
                    <option value="">Aucune</option>
                    {armors.map((a: any) => <option key={a.name} value={a.name}>{a.name}</option>)}
                  </select>
                  <SelectArrow />
                </div>
              </div>
              <div>
                <label className="gods:text-xs gods:tracking-widest gods:uppercase gods:font-display gods:text-muted-foreground gods:mb-2 gods:block">Arme</label>
                <div className="gods:relative">
                  <select value={character.armeEquipee || ""} onChange={(e) => handleEquip("armeEquipee", e.target.value)}
                    className="gods:w-full gods:appearance-none gods:px-4 gods:py-2.5 gods:pr-8 gods:bg-input-background gods:border gods:border-border gods:rounded-md gods:text-base gods:text-foreground focus:gods:outline-none focus:gods:border-primary/40 gods:transition-all">
                    <option value="">Aucune</option>
                    {weapons.map((w: any) => <option key={w.name} value={w.name}>{w.name}</option>)}
                  </select>
                  <SelectArrow />
                </div>
              </div>
            </div>
          </section>
          
        </div>
      </aside>

      {/* ── RIGHT AREA: tabs + content ───────────────────────────── */}
      <main className="gods:flex-1 gods:flex gods:flex-col gods:min-w-0 gods:h-full gods:relative gods:z-10">
        
        {/* Mobile Top Bar */}
        <div className="gods:lg:hidden gods:flex gods:items-center gods:justify-between gods:p-4 gods:border-b gods:border-border gods:bg-card/50">
          <h2 className="gods:font-display gods:uppercase gods:tracking-wider gods:text-foreground">Session</h2>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="gods:inline-flex gods:items-center gods:gap-2 gods:px-3 gods:py-1.5 gods:border gods:border-border gods:text-muted-foreground hover:gods:text-primary hover:gods:border-primary/40 gods:rounded-md gods:transition-all gods:font-display gods:text-xs gods:tracking-widest gods:uppercase !gods:outline-none"
          >
            <Menu size={16} />
            Assistant
          </button>
        </div>

        {/* Tabs */}
        <div className="gods:flex gods:shrink-0 gods:border-b gods:border-border gods:bg-card/30 gods:overflow-x-auto">
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`!gods:outline-none gods:px-5 gods:py-4 gods:text-sm gods:whitespace-nowrap gods:font-display gods:tracking-wider gods:uppercase gods:transition-all gods:border-0 gods:border-b-2 ${
                activeTab === tab
                  ? "gods:border-b-primary gods:text-primary gods:bg-primary/5"
                  : "gods:border-b-transparent gods:text-muted-foreground hover:gods:text-foreground hover:gods:border-b-border gods:bg-transparent"
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="gods:flex-1 gods:overflow-hidden">
          {activeTab === "Résultats" && (
            
            <div 
              className="gods:flex gods:flex-col gods:lg:grid gods:h-full gods:overflow-hidden"
              style={{ 
                '--notes-width': `${notesWidth}px`, 
                '--inventory-height': `${inventoryHeight}px`,
                gridTemplateColumns: 'minmax(0, 1fr) var(--notes-width)',
                gridTemplateRows: 'minmax(0, 1fr) var(--inventory-height)'
              } as React.CSSProperties}
            >
              
              {/* ── Chat Panel ── */}
              <div className={`gods:flex gods:flex-col gods:min-w-0 gods:border-b gods:border-border gods:lg:border-b-0 gods:lg:border-r gods:lg:row-start-1 gods:lg:col-start-1 gods:lg:h-full gods:lg:min-h-0 ${expandedPanel === "chat" ? "gods:flex-1 gods:min-h-0" : "gods:shrink-0"}`}>
                
                <div 
                  onClick={() => setExpandedPanel("chat")} 
                  className="gods:lg:hidden gods:flex gods:items-center gods:px-5 gods:py-3.5 gods:bg-muted/30 gods:cursor-pointer gods:shrink-0"
                >
                  <span className="gods:text-xs gods:tracking-widest gods:uppercase gods:text-primary gods:font-display">
                    Historique des jets
                  </span>
                </div>

                <div ref={chatRef} className={`gods:flex-1 gods:overflow-y-auto gods:p-5 gods:space-y-5 ${expandedPanel === "chat" ? "gods:block" : "gods:hidden gods:lg:block"}`}>
                  {results.length === 0 && (
                    <div className="gods:flex gods:items-center gods:justify-center gods:h-full gods:text-base gods:text-muted-foreground gods:italic">
                      Aucun jet pour l'instant.
                    </div>
                  )}
                  {results.map((result) => (
                    <div key={result.id} className="gods:flex gods:gap-4 gods:group">
                      <AvatarImage
                        src={result.avatarUrl}
                        fallback={result.initial}
                        color={result.color}
                        className="gods:w-10 gods:h-10 gods:rounded-full gods:border-2"
                        style={{ borderColor: result.color }}
                      />

                      <div className="gods:flex-1 gods:min-w-0">
                        <div className="gods:flex gods:items-baseline gods:gap-2 gods:mb-1.5 gods:flex-wrap">
                          <span className="gods:font-display gods:text-base gods:tracking-wider gods:text-foreground">
                            {result.character}
                          </span>
                          <span className="gods:text-xs gods:tracking-widest gods:text-muted-foreground">{result.timestamp}</span>
                        </div>

                        <div className="gods:bg-card gods:border gods:border-border gods:rounded-lg gods:px-4 gods:py-3 gods:inline-block gods:max-w-md gods:text-base gods:leading-relaxed gods:shadow-sm"
                          dangerouslySetInnerHTML={{
                            __html: (() => {
                              const html = result.rawHtml || "";
                              const markedD10 = html.replace(
                                /(d10\s*:\s*)([^|<]*?)(?=\||<|$)/gi,
                                (_match, prefix, values) => {
                                  const highlighted = values.replace(
                                    /\b10\b/g,
                                    "__GOLD_D10_10__"
                                  );
                                  return prefix + highlighted;
                                }
                              );
                              const darkNumbers = markedD10.replace(
                                /\b\d+\b/g,
                                (number) => `<strong style="color:var(--foreground)">${number}</strong>`
                              );
                              return darkNumbers.replace(
                                /__GOLD_D10_10__/g,
                                '<strong style="color:var(--primary)">10</strong>'
                              );
                            })()
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Inventory Panel ── */}
              <div className={`gods:flex gods:flex-col gods:relative gods:border-b gods:border-border gods:lg:border-b-0 gods:lg:border-r gods:lg:border-t gods:lg:row-start-2 gods:lg:col-start-1 gods:lg:h-full gods:lg:min-h-0 ${expandedPanel === "inventory" ? "gods:flex-1 gods:min-h-0" : "gods:shrink-0"}`}>
                
                <div
                  role="separator"
                  aria-orientation="horizontal"
                  onPointerDown={(e) => startResize("inventory", e)}
                  className="gods:hidden gods:lg:block gods:absolute gods:-top-1 gods:left-0 gods:right-0 gods:h-2 gods:z-20 gods:cursor-row-resize gods:group"
                >
                  <div className="gods:absolute gods:top-1/2 gods:left-1/2 gods:-translate-x-1/2 gods:-translate-y-1/2 gods:w-12 gods:h-0.5 gods:rounded-full gods:bg-border group-hover:gods:bg-primary/60 gods:transition-colors" />
                </div>

                <div 
                  onClick={() => setExpandedPanel("inventory")}
                  className="gods:flex gods:items-center gods:justify-between gods:px-5 gods:py-3 gods:bg-muted/30 gods:cursor-pointer gods:lg:cursor-default gods:shrink-0"
                >
                  <span className="gods:text-xs gods:tracking-widest gods:uppercase gods:text-primary gods:font-display">
                    Inventaire
                  </span>
                  <button onClick={(e) => { e.stopPropagation(); setShowAddItem(true); }}
                    className="gods:flex gods:items-center gods:gap-1.5 gods:px-3 gods:py-1.5 gods:text-xs gods:uppercase gods:bg-card gods:border gods:border-border gods:text-foreground gods:rounded hover:gods:text-primary hover:gods:border-primary/40 gods:transition-all gods:font-display gods:tracking-widest !gods:outline-none">
                    <Plus size={14} /> Ajouter
                  </button>
                </div>
                
                <div className={`gods:flex-1 gods:overflow-y-auto gods:bg-background/50 ${expandedPanel === "inventory" ? "gods:block" : "gods:hidden gods:lg:block"}`}>
                  {inventory.length === 0 && (
                    <div className="gods:flex gods:items-center gods:justify-center gods:h-full gods:text-base gods:text-muted-foreground gods:italic">
                      Inventaire vide
                    </div>
                  )}
                  {inventory.map((item) => (
                    <div key={item.id}
                      className="gods:flex gods:items-center gods:gap-4 gods:px-5 gods:py-3 gods:border-b gods:border-border gods:last:border-b-0 hover:gods:bg-card gods:transition-colors gods:group">
                      <Package size={16} className="gods:text-primary/70 gods:shrink-0" />
                      <div className="gods:flex-1 gods:min-w-0">
                        <div className="gods:flex gods:items-center gods:gap-3 gods:flex-wrap">
                          <span className="gods:text-base gods:text-foreground">{item.name}</span>
                          <span className="gods:text-[10px] gods:text-primary/80 gods:border gods:border-primary/20 gods:bg-primary/5 gods:rounded gods:px-1.5 gods:py-0.5 gods:font-display gods:tracking-widest gods:uppercase gods:shrink-0">
                            {item.type}
                          </span>
                        </div>
                        <div className="gods:text-sm gods:text-muted-foreground gods:mt-1">{item.stats}</div>
                      </div>
                      <button onClick={() => removeItem(item.id)}
                        className="gods:text-muted-foreground hover:gods:text-destructive gods:transition-colors gods:ml-2 !gods:outline-none focus:!gods:outline-none"
                        title="Retirer l'objet">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Notes Panel ── */}
              <div className={`gods:flex gods:flex-col gods:relative gods:border-t gods:lg:border-t-0 gods:border-border gods:lg:row-start-1 gods:lg:row-span-2 gods:lg:col-start-2 gods:lg:h-full gods:lg:min-h-0 ${expandedPanel === "notes" ? "gods:flex-1 gods:min-h-0" : "gods:shrink-0"}`}>
                
                <div
                  role="separator"
                  aria-orientation="vertical"
                  onPointerDown={(e) => startResize("notes", e)}
                  className="gods:hidden gods:lg:block gods:absolute gods:-left-1 gods:top-0 gods:bottom-0 gods:w-2 gods:z-20 gods:cursor-col-resize gods:group"
                >
                  <div className="gods:absolute gods:top-1/2 gods:left-1/2 gods:-translate-x-1/2 gods:-translate-y-1/2 gods:w-0.5 gods:h-12 gods:rounded-full gods:bg-border group-hover:gods:bg-primary/60 gods:transition-colors" />
                </div>

                <div 
                  onClick={() => setExpandedPanel("notes")}
                  className="gods:flex gods:items-center gods:justify-between gods:px-5 gods:py-3.5 gods:bg-muted/30 gods:cursor-pointer gods:lg:cursor-default gods:shrink-0"
                >
                  <span className="gods:text-xs gods:tracking-widest gods:uppercase gods:text-primary gods:font-display">
                    Notes de session
                  </span>
                  <span className={`gods:text-[10px] gods:font-display gods:tracking-widest gods:uppercase gods:transition-colors ${
                    saveStatus === "saved" ? "gods:text-[#2A6B52]" : "gods:text-muted-foreground"
                  }`}>
                    {saveStatus === "saved" ? "Sauvegardé" : "Sauvegarde…"}
                  </span>
                </div>

                <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                  className={`gods:flex-1 gods:p-5 gods:bg-background/30 gods:resize-none gods:text-base gods:text-foreground gods:placeholder:text-muted-foreground focus:gods:outline-none gods:leading-relaxed ${expandedPanel === "notes" ? "gods:block" : "gods:hidden gods:lg:block"}`}
                  placeholder={"Prenez vos notes ici…\n\nCe champ est sauvegardé automatiquement."} />
              </div>
            </div>
          )}

          {activeTab === "Interactions" && <InteractionsTab character={{...character, conversationId}} />}
          {activeTab === "Personnage" && <PersonnageTab character={character} />}
          {activeTab === "Ressources" && (
            <RessourcesTab 
              character={character} 
              onUpdate={(field, val) => {
                setCharacter((prev: any) => ({ ...prev, [field]: val }));
                updateCharacterField(character.id_Character || character.id, field, val);
              }} 
            />
          )}
          {activeTab === "Éclat" && <EclatTab character={character} />}
          {activeTab === "Rituels" && <RituelsTab character={character} />}
          {activeTab === "Groupe" && <GroupeTab character={character} allGroupes={allGroupes} />}
        </div>
      </main>

      {/* ── ADD ITEM DIALOG ──────────────────────────────────────── */}
      <Dialog.Root open={showAddItem} onOpenChange={setShowAddItem}>
        <Dialog.Portal>
          <Dialog.Overlay className="gods:fixed gods:inset-0 gods:bg-background/80 gods:backdrop-blur-sm gods:z-[400] gods:animate-in gods:fade-in" />
          <Dialog.Content className="gods:fixed gods:top-1/2 gods:left-1/2 gods:-translate-x-1/2 gods:-translate-y-1/2 gods:z-[401] gods:w-[90vw] gods:max-w-md gods:bg-card gods:border gods:border-border gods:rounded-lg gods:shadow-2xl gods:p-8 !gods:outline-none gods:animate-in gods:fade-in gods:zoom-in-95">
            
            <div className="gods:flex gods:items-center gods:justify-between gods:mb-6">
              <Dialog.Title className="gods:text-xl gods:tracking-wider gods:uppercase gods:font-display gods:text-foreground">
                Ajouter un objet
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="gods:flex gods:items-center gods:gap-2 gods:px-3 gods:py-2 gods:border gods:border-border gods:text-muted-foreground hover:gods:text-primary hover:gods:border-primary/35 gods:rounded-md gods:transition-all gods:text-xs gods:tracking-widest gods:uppercase gods:font-display !gods:outline-none">
                  Fermer <X size={14} />
                </button>
              </Dialog.Close>
            </div>

            <div className="gods:flex gods:gap-2 gods:mb-6 gods:p-1.5 gods:bg-background/50 gods:border gods:border-border gods:rounded-md">
              {(["manual", "custom"] as const).map((mode) => (
                <button key={mode} onClick={() => setAddMode(mode)}
                  className={`gods:flex-1 gods:py-2 gods:text-xs gods:uppercase gods:rounded gods:font-display gods:tracking-wider gods:transition-all !gods:outline-none ${
                    addMode === mode
                      ? "gods:bg-card gods:border gods:border-border gods:text-primary gods:shadow-sm"
                      : "gods:text-muted-foreground hover:gods:text-foreground gods:border gods:border-transparent"
                  }`}>
                  {mode === "manual" ? "Manuel" : "Personnalisé"}
                </button>
              ))}
            </div>

            {addMode === "manual" ? (
              <div className="gods:space-y-6">
                <div>
                  <label className="gods:block gods:text-xs gods:text-muted-foreground gods:mb-2 gods:font-display gods:tracking-widest gods:uppercase">
                    Sélectionner un objet
                  </label>
                  <div className="gods:relative">
                    <select value={selectedManualItem} onChange={(e) => setSelectedManualItem(e.target.value)}
                      className="gods:w-full gods:appearance-none gods:px-4 gods:py-3 gods:pr-8 gods:bg-background gods:border gods:border-border gods:rounded-md gods:text-base gods:text-foreground focus:gods:outline-none focus:gods:border-primary/50 gods:transition-all">
                      <option value="">Sélectionnez…</option>
                      {equipmentList.map((item: any) => (
                        <option key={item.name} value={item.name}>
                          {item.name} — {item.stats || item.type}
                        </option>
                      ))}
                    </select>
                    <SelectArrow />
                  </div>
                </div>
                <button onClick={addManualItem} disabled={!selectedManualItem}
                  className="gods:w-full gods:py-3 gods:bg-primary gods:!text-primary-foreground gods:text-sm gods:rounded-md hover:gods:bg-primary/85 disabled:gods:opacity-35 disabled:gods:cursor-not-allowed gods:transition-all gods:font-display gods:tracking-wider gods:uppercase !gods:outline-none">
                  Ajouter à l'inventaire
                </button>
              </div>
            ) : (
              <div className="gods:space-y-4">
                {[
                  { key: "name",  label: "Nom",         placeholder: "Épée de foudre" },
                  { key: "type",  label: "Type",        placeholder: "Arme / Armure / Consommable…" },
                  { key: "stats", label: "Stats",       placeholder: "DMG 2d8+5" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="gods:block gods:text-xs gods:text-muted-foreground gods:mb-1.5 gods:font-display gods:tracking-widest gods:uppercase">
                      {field.label}
                    </label>
                    <input type="text" placeholder={field.placeholder}
                      value={(customItem as any)[field.key]}
                      onChange={(e) => setCustomItem((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      className="gods:w-full gods:px-4 gods:py-2.5 gods:bg-background gods:border gods:border-border gods:rounded-md gods:text-base gods:text-foreground gods:placeholder:text-muted-foreground focus:gods:outline-none focus:gods:border-primary/50 gods:transition-all" />
                  </div>
                ))}
                <div>
                  <label className="gods:block gods:text-xs gods:text-muted-foreground gods:mb-1.5 gods:font-display gods:tracking-widest gods:uppercase">
                    Description
                  </label>
                  <textarea rows={2} placeholder="Forgée par Héphaïstos lui-même…"
                    value={customItem.description}
                    onChange={(e) => setCustomItem((prev) => ({ ...prev, description: e.target.value }))}
                    className="gods:w-full gods:px-4 gods:py-2.5 gods:bg-background gods:border gods:border-border gods:rounded-md gods:text-base gods:text-foreground gods:placeholder:text-muted-foreground focus:gods:outline-none focus:gods:border-primary/50 gods:resize-none gods:transition-all" />
                </div>
                <button onClick={addCustomItem} disabled={!customItem.name}
                  className="gods:mt-2 gods:w-full gods:py-3 gods:bg-primary gods:!text-primary-foreground gods:text-sm gods:rounded-md hover:gods:bg-primary/85 disabled:gods:opacity-35 disabled:gods:cursor-not-allowed gods:transition-all gods:font-display gods:tracking-wider gods:uppercase !gods:outline-none">
                  Ajouter à l'inventaire
                </button>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}