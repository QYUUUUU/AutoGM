import { useEffect, useState, useRef } from "react";
import { updateInventoryReq, updateCharacterField } from "../api";
import type { ActiveCharacter, InventoryItem, EquipmentItem } from "../types";
import { Plus, Trash, X } from "lucide-react";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="gods:text-xs gods:tracking-widest gods:uppercase gods:text-primary gods:font-display">
      {children}
    </span>
  );
}

export default function ResultsTab({
  character,
  onCharacterUpdate,
  equipmentList,
}: any) {
  const [rolls, setRolls] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const rollsEndRef = useRef<HTMLDivElement>(null);

  // =========================================================
  // MODAL FORM STATE
  // =========================================================
  const [manualName, setManualName] = useState("");
  const [manualType, setManualType] = useState("");
  const [manualStats, setManualStats] = useState("");
  const [manualDesc, setManualDesc] = useState("");
  const [selectedPremade, setSelectedPremade] = useState("");

  // =========================================================
  // SSE - REAL-TIME ROLLS TRACKER
  // =========================================================
  useEffect(() => {
    let evtSource: EventSource | null = null;
    let cancelled = false;

    const fetchHistory = async () => {
      try {
        const url = character.groupe
          ? `/fetch/rolls?groupe_id=${character.groupe.id}`
          : "/fetch/rolls";

        const res = await fetch(url, { method: "PUT" });
        if (!res.ok) {
          throw new Error(`Failed to fetch rolls: ${res.status}`);
        }

        const data = await res.json();
        if (!cancelled) {
          setRolls(data);
        }
      } catch (err) {
        console.error("Failed to fetch roll history:", err);
      }
    };

    const connectSSE = () => {
      const sseUrl = character.groupe
        ? `/stream/rolls?groupe_id=${character.groupe.id}`
        : "/stream/rolls";

      evtSource = new EventSource(sseUrl);

      evtSource.onmessage = (e) => {
        try {
          const newRolls = JSON.parse(e.data);
          if (!Array.isArray(newRolls)) {
            return;
          }
          setRolls((prev) => {
            const existingIds = new Set(prev.map((r) => r.id));
            const uniqueNew = newRolls.filter((r: any) => !existingIds.has(r.id));
            return [...prev, ...uniqueNew];
          });
        } catch (err) {
          console.error("Failed to parse SSE roll data:", err);
        }
      };

      evtSource.onerror = (err) => {
        console.error("Roll SSE connection error:", err);
      };
    };

    fetchHistory();
    connectSSE();

    return () => {
      cancelled = true;
      if (evtSource) {
        evtSource.close();
      }
    };
  }, [character.groupe?.id]);

  // =========================================================
  // AUTO-SCROLL ROLLS
  // =========================================================
  useEffect(() => {
    rollsEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [rolls]);

  // =========================================================
  // INVENTORY - REMOVE ITEM
  // =========================================================
  const removeInventoryItem = (index: number) => {
    const newInv = [...(character.inventory || [])];
    newInv.splice(index, 1);

    onCharacterUpdate((prev: ActiveCharacter) => ({
      ...prev,
      inventory: newInv,
    }));
    updateInventoryReq(character.id, newInv);
  };

  // =========================================================
  // INVENTORY - ADD ITEM
  // =========================================================
  const handleAddItem = () => {
    let newItem: InventoryItem | null = null;

    if (selectedPremade) {
      const premade = equipmentList?.find(
        (e: EquipmentItem) => e.name === selectedPremade
      );
      if (premade) {
        newItem = {
          name: premade.name,
          type: premade.type || "Objet",
          stats: premade.stats || "",
          desc: premade.desc || "",
          quantity: 1,
        };
      }
    } else if (manualName.trim()) {
      newItem = {
        name: manualName.trim(),
        type: manualType.trim() || "Objet",
        stats: manualStats.trim(),
        desc: manualDesc.trim(),
        quantity: 1,
      };
    }

    if (!newItem) return;

    const newInv = [...(character.inventory || [])];
    const existing = newInv.find((item: InventoryItem) => item.name === newItem!.name);

    if (existing) {
      existing.quantity += 1;
    } else {
      newInv.push(newItem);
    }

    onCharacterUpdate((prev: ActiveCharacter) => ({
      ...prev,
      inventory: newInv,
    }));
    updateInventoryReq(character.id, newInv);

    setSelectedPremade("");
    setManualName("");
    setManualType("");
    setManualStats("");
    setManualDesc("");
    setShowAddModal(false);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setSelectedPremade("");
    setManualName("");
    setManualType("");
    setManualStats("");
    setManualDesc("");
  };

  const handleNotesChange = (val: string) => {
    onCharacterUpdate((prev: ActiveCharacter) => ({
      ...prev,
      notes: val,
    }));
    updateCharacterField(character.id, "notes", JSON.stringify([{ insert: val + "\n" }]));
  };

  return (
    <div className="gods:h-full gods:p-6 gods:lg:p-12 gods:bg-background gods:relative gods:z-10">
      <div className="gods:max-w-7xl gods:mx-auto gods:h-full gods:flex gods:flex-col">
        
        <div className="gods:mb-8">
          <SectionLabel>Journal</SectionLabel>
          <h2 className="gods:text-3xl gods:tracking-wider gods:uppercase gods:text-foreground gods:mt-2">Jets & Équipement</h2>
        </div>

        <div className="gods:flex-1 gods:grid gods:grid-cols-1 gods:lg:grid-cols-3 gods:gap-6 gods:min-h-0">
          
          {/* ===================================================
              ROLLS BOX
              =================================================== */}
          <div className="gods:flex-1 gods:bg-card gods:border gods:border-border gods:rounded-lg gods:flex gods:flex-col gods:overflow-hidden gods:hover:border-primary/20 gods:transition-colors">
            <div className="gods:bg-background/50 gods:px-5 gods:py-4 gods:border-b gods:border-border/60">
              <h3 className="gods:text-xl gods:tracking-wider gods:text-foreground">Résultats des dés</h3>
            </div>

            <div className="gods:flex-1 gods:overflow-y-auto gods:p-5 gods:space-y-4">
              {rolls.length === 0 ? (
                <div className="gods:text-base gods:text-muted-foreground gods:italic">Aucun résultat de dé.</div>
              ) : (
                rolls.map((roll) => (
                  <div key={roll.id} className="gods:text-base gods:text-foreground gods:bg-background/40 gods:p-3 gods:rounded-md gods:border gods:border-border/50">
                    <div className="gods:flex gods:items-center gods:gap-2 gods:mb-1">
                      <strong className="gods:text-primary">{roll.Character?.nom || "Inconnu"}</strong>
                      {roll.thrownByAI && (
                        <span className="gods:border gods:border-primary/40 gods:text-primary gods:px-1.5 gods:text-xs gods:tracking-widest gods:font-display gods:uppercase gods:rounded">AI</span>
                      )}
                    </div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: String(roll.content || "").replace(
                          /\b(\d+)\b/g,
                          '<strong class="gods:text-primary">$1</strong>'
                        ),
                      }}
                    />
                  </div>
                ))
              )}
              <div ref={rollsEndRef} />
            </div>
          </div>

          {/* ===================================================
              INVENTORY BOX
              =================================================== */}
          <div className="gods:flex-1 gods:bg-card gods:border gods:border-border gods:rounded-lg gods:flex gods:flex-col gods:overflow-hidden gods:relative gods:hover:border-primary/20 gods:transition-colors">
            <div className="gods:bg-background/50 gods:px-5 gods:py-4 gods:border-b gods:border-border/60 gods:flex gods:justify-between gods:items-center">
              <h3 className="gods:text-xl gods:tracking-wider gods:text-foreground">Inventaire</h3>
              <button onClick={() => setShowAddModal(true)} className="gods:text-muted-foreground hover:gods:text-primary gods:transition-colors !gods:outline-none" title="Ajouter un objet">
                <Plus size={18} />
              </button>
            </div>

            <div className="gods:flex-1 gods:overflow-y-auto gods:p-5 gods:space-y-3">
              {character.inventory?.length ? (
                character.inventory.map((item: InventoryItem, idx: number) => (
                  <div key={`${item.name}-${idx}`} className="gods:bg-background gods:border gods:border-border/50 gods:rounded-md gods:p-4">
                    <div className="gods:flex gods:justify-between gods:items-start gods:mb-2">
                      <h6 className="gods:text-foreground gods:text-lg gods:tracking-wider">
                        {item.name} <span className="gods:text-primary">x{item.quantity}</span>
                      </h6>
                      <button onClick={() => removeInventoryItem(idx)} className="gods:text-muted-foreground hover:gods:text-destructive gods:transition-colors !gods:outline-none" title="Supprimer">
                        <Trash size={16} />
                      </button>
                    </div>
                    <div className="gods:flex gods:gap-3 gods:text-xs gods:tracking-widest gods:font-display gods:uppercase gods:mb-2">
                      <span className="gods:text-muted-foreground">{item.type}</span>
                      {item.stats && <span className="gods:text-primary">{item.stats}</span>}
                    </div>
                    {item.desc && (
                      <div className="gods:text-sm gods:text-muted-foreground gods:leading-relaxed">{item.desc}</div>
                    )}
                  </div>
                ))
              ) : (
                <div className="gods:text-base gods:text-muted-foreground gods:italic">Inventaire vide.</div>
              )}
            </div>

            {/* ADD ITEM MODAL OVERLAY */}
            {showAddModal && (
              <div className="gods:absolute gods:inset-0 gods:bg-background/90 gods:backdrop-blur-sm gods:z-50 gods:p-5 gods:flex gods:flex-col gods:overflow-y-auto gods:border-t gods:border-border">
                <div className="gods:flex gods:justify-between gods:items-center gods:mb-6">
                  <h4 className="gods:text-xl gods:tracking-wider gods:text-foreground">Ajouter un objet</h4>
                  <button onClick={closeAddModal} className="gods:text-muted-foreground hover:gods:text-destructive gods:transition-colors" title="Fermer">
                    <X size={18} />
                  </button>
                </div>

                <div className="gods:space-y-4">
                  <select
                    value={selectedPremade}
                    onChange={(e) => {
                      setSelectedPremade(e.target.value);
                      if (e.target.value) {
                        setManualName(""); setManualType(""); setManualStats(""); setManualDesc("");
                      }
                    }}
                    className="gods:w-full gods:bg-input-background gods:border gods:border-border gods:px-3 gods:py-2.5 gods:rounded-md gods:text-base focus:gods:outline-none focus:gods:border-primary/50"
                  >
                    <option value="">-- Choisir dans le manuel --</option>
                    {equipmentList?.map((e: EquipmentItem) => (
                      <option key={e.name} value={e.name}>{e.name}</option>
                    ))}
                  </select>

                  <div className="gods:text-center gods:text-xs gods:tracking-widest gods:text-muted-foreground gods:font-display gods:uppercase">-- OU --</div>

                  <input
                    type="text" placeholder="Nom de l'objet" value={manualName}
                    onChange={(e) => { setManualName(e.target.value); if (e.target.value) setSelectedPremade(""); }}
                    className="gods:w-full gods:bg-input-background gods:border gods:border-border gods:px-3 gods:py-2.5 gods:rounded-md gods:text-base focus:gods:outline-none focus:gods:border-primary/50"
                  />
                  <input
                    type="text" placeholder="Type (ex: Arme, Armure)" value={manualType}
                    onChange={(e) => setManualType(e.target.value)}
                    className="gods:w-full gods:bg-input-background gods:border gods:border-border gods:px-3 gods:py-2.5 gods:rounded-md gods:text-base focus:gods:outline-none focus:gods:border-primary/50"
                  />
                  <input
                    type="text" placeholder="Statistiques (ex: Dgt 3)" value={manualStats}
                    onChange={(e) => setManualStats(e.target.value)}
                    className="gods:w-full gods:bg-input-background gods:border gods:border-border gods:px-3 gods:py-2.5 gods:rounded-md gods:text-base focus:gods:outline-none focus:gods:border-primary/50"
                  />
                  <textarea
                    placeholder="Description..." value={manualDesc}
                    onChange={(e) => setManualDesc(e.target.value)}
                    className="gods:w-full gods:min-h-[100px] gods:bg-input-background gods:border gods:border-border gods:px-3 gods:py-2.5 gods:rounded-md gods:resize-none gods:text-base focus:gods:outline-none focus:gods:border-primary/50"
                  />
                </div>

                <div className="gods:mt-auto gods:pt-6 gods:flex gods:gap-3">
                  <button onClick={closeAddModal} className="gods:flex-1 gods:bg-muted/50 gods:border gods:border-border gods:text-foreground gods:py-2.5 gods:rounded-md gods:text-base gods:tracking-wider gods:font-display gods:uppercase hover:gods:bg-muted gods:transition-colors">
                    Annuler
                  </button>
                  <button onClick={handleAddItem} disabled={!selectedPremade && !manualName.trim()} className="gods:flex-1 gods:bg-primary gods:text-primary-foreground gods:py-2.5 gods:rounded-md gods:text-base gods:tracking-wider gods:font-display gods:uppercase disabled:gods:opacity-50 disabled:gods:cursor-not-allowed hover:gods:bg-primary/85 gods:transition-colors">
                    Ajouter
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ===================================================
              NOTES BOX
              =================================================== */}
          <div className="gods:flex-1 gods:bg-card gods:border gods:border-border gods:rounded-lg gods:flex gods:flex-col gods:overflow-hidden gods:hover:border-primary/20 gods:transition-colors">
            <div className="gods:bg-background/50 gods:px-5 gods:py-4 gods:border-b gods:border-border/60">
              <h3 className="gods:text-xl gods:tracking-wider gods:text-foreground">Notes</h3>
            </div>
            <textarea
              className="gods:flex-1 gods:w-full gods:bg-transparent gods:text-foreground gods:p-5 gods:resize-none focus:gods:outline-none focus:gods:ring-inset focus:gods:ring-1 focus:gods:ring-primary/20 gods:text-base gods:leading-relaxed"
              value={character.notes || ""}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Prenez vos notes ici..."
            />
          </div>

        </div>
      </div>
    </div>
  );
}