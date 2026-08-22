import { useEffect, useState, useRef } from "react";
import { updateInventoryReq, updateCharacterField } from "../api";
import type {
  ActiveCharacter,
  InventoryItem,
  EquipmentItem,
} from "../types";
import { Plus, Trash, X } from "lucide-react";

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

            const uniqueNew = newRolls.filter(
              (r: any) => !existingIds.has(r.id)
            );

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

    // Add an item from the equipment manual
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
    }
    // Add a manually-created item
    else if (manualName.trim()) {
      newItem = {
        name: manualName.trim(),
        type: manualType.trim() || "Objet",
        stats: manualStats.trim(),
        desc: manualDesc.trim(),
        quantity: 1,
      };
    }

    if (!newItem) {
      return;
    }

    const newInv = [...(character.inventory || [])];

    const existing = newInv.find(
      (item: InventoryItem) => item.name === newItem!.name
    );

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

    // Reset modal
    setSelectedPremade("");
    setManualName("");
    setManualType("");
    setManualStats("");
    setManualDesc("");
    setShowAddModal(false);
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================
  const closeAddModal = () => {
    setShowAddModal(false);
    setSelectedPremade("");
    setManualName("");
    setManualType("");
    setManualStats("");
    setManualDesc("");
  };

  // =========================================================
  // NOTES AUTO-SAVE
  // =========================================================
  const handleNotesChange = (val: string) => {
    onCharacterUpdate((prev: ActiveCharacter) => ({
      ...prev,
      notes: val,
    }));

    // TODO: debounce this in production
    updateCharacterField(
      character.id,
      "notes",
      JSON.stringify([{ insert: val + "\n" }])
    );
  };

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <div className="gods:grid gods:grid-cols-1 gods:lg:grid-cols-2 gods:gap-4 gods:h-full">
      {/* =====================================================
          LEFT COLUMN: ROLLS + INVENTORY
          ===================================================== */}
      <div className="gods:flex gods:flex-col gods:gap-4 gods:h-full gods:overflow-hidden">
        {/* ===================================================
            ROLLS BOX
            =================================================== */}
        <div className="gods:flex-1 gods:bg-card gods:border gods:border-border gods:rounded-lg gods:flex gods:flex-col gods:overflow-hidden">
          <div className="gods:bg-muted gods:px-3 gods:py-2 gods:border-b gods:border-border gods:font-display gods:uppercase gods:text-xl gods:tracking-wider">
            Résultats des dés
          </div>

          <div className="gods:flex-1 gods:overflow-y-auto gods:p-3 gods:space-y-3">
            {rolls.length === 0 ? (
              <div className="gods:text-base gods:text-muted-foreground gods:text-center gods:py-4">
                Aucun résultat de dé.
              </div>
            ) : (
              rolls.map((roll) => (
                <div
                  key={roll.id}
                  className="gods:text-base gods:text-foreground"
                >
                  <div className="gods:flex gods:items-center gods:gap-1">
                    <strong className="gods:text-primary">
                      {roll.Character?.nom || "Inconnu"}
                    </strong>

                    {roll.thrownByAI && (
                      <span className="gods:ml-2 gods:border gods:border-primary gods:text-primary gods:px-1 gods:text-xs gods:tracking-widest gods:rounded">
                        AI
                      </span>
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
        <div className="gods:flex-1 gods:bg-card gods:border gods:border-border gods:rounded-lg gods:flex gods:flex-col gods:overflow-hidden gods:relative">
          {/* Inventory Header */}
          <div className="gods:bg-muted gods:px-3 gods:py-2 gods:border-b gods:border-border gods:flex gods:justify-between gods:items-center">
            <span className="gods:font-display gods:uppercase gods:text-xl gods:tracking-wider">
              Inventaire
            </span>

            <button
              onClick={() => setShowAddModal(true)}
              className="gods:text-primary gods:hover:text-primary gods:transition-colors"
              title="Ajouter un objet"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Inventory List */}
          <div className="gods:flex-1 gods:overflow-y-auto gods:p-3 gods:space-y-2">
            {character.inventory?.length ? (
              character.inventory.map(
                (item: InventoryItem, idx: number) => (
                  <div
                    key={`${item.name}-${idx}`}
                    className="gods:bg-background gods:border gods:border-border gods:rounded gods:p-2"
                  >
                    {/* Item name + delete */}
                    <div className="gods:flex gods:justify-between gods:items-center">
                      <h6 className="gods:text-primary gods:text-base gods:font-bold">
                        {item.name} x{item.quantity}
                      </h6>

                      <button
                        onClick={() => removeInventoryItem(idx)}
                        className="gods:text-destructive gods:hover:text-destructive gods:transition-colors"
                        title="Supprimer"
                      >
                        <Trash size={14} />
                      </button>
                    </div>

                    {/* Item type + stats */}
                    <div className="gods:flex gods:justify-between gods:gap-2 gods:text-xs gods:tracking-widest gods:text-muted-foreground">
                      <span>{item.type}</span>

                      {item.stats && (
                        <span className="gods:text-primary">
                          {item.stats}
                        </span>
                      )}
                    </div>

                    {/* Item description */}
                    {item.desc && (
                      <div className="gods:mt-1 gods:text-xs gods:tracking-widest gods:text-muted-foreground">
                        {item.desc}
                      </div>
                    )}
                  </div>
                )
              )
            ) : (
              <div className="gods:text-base gods:text-muted-foreground gods:text-center gods:py-4">
                Inventaire vide.
              </div>
            )}
          </div>

          {/* =================================================
              ADD ITEM MODAL OVERLAY
              ================================================= */}
          {showAddModal && (
            <div className="gods:absolute gods:inset-0 gods:bg-card/95 gods:backdrop-blur-sm gods:z-10 gods:p-4 gods:flex gods:flex-col gods:overflow-y-auto">
              {/* Modal Header */}
              <div className="gods:flex gods:justify-between gods:items-center gods:mb-4">
                <h4 className="gods:text-xl gods:tracking-wider">
                  Ajouter un objet
                </h4>

                <button
                  onClick={closeAddModal}
                  className="gods:text-muted-foreground gods:hover:text-foreground"
                  title="Fermer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Premade Equipment */}
              <select
                value={selectedPremade}
                onChange={(e) => {
                  setSelectedPremade(e.target.value);

                  // Selecting a premade item clears manual fields
                  if (e.target.value) {
                    setManualName("");
                    setManualType("");
                    setManualStats("");
                    setManualDesc("");
                  }
                }}
                className="gods:mb-4 gods:w-full gods:bg-background gods:border gods:border-border gods:p-2 gods:rounded gods:text-base"
              >
                <option value="">
                  -- Choisir dans le manuel --
                </option>

                {equipmentList?.map((e: EquipmentItem) => (
                  <option key={e.name} value={e.name}>
                    {e.name}
                  </option>
                ))}
              </select>

              {/* Divider */}
              <div className="gods:text-center gods:text-xs gods:tracking-widest gods:mb-4 gods:text-muted-foreground">
                -- OU --
              </div>

              {/* Manual Item */}
              <input
                type="text"
                placeholder="Nom"
                value={manualName}
                onChange={(e) => {
                  setManualName(e.target.value);

                  // Typing a manual item clears premade selection
                  if (e.target.value) {
                    setSelectedPremade("");
                  }
                }}
                className="gods:mb-2 gods:w-full gods:bg-background gods:border gods:border-border gods:p-2 gods:rounded gods:text-base"
              />

              <input
                type="text"
                placeholder="Type"
                value={manualType}
                onChange={(e) => setManualType(e.target.value)}
                className="gods:mb-2 gods:w-full gods:bg-background gods:border gods:border-border gods:p-2 gods:rounded gods:text-base"
              />

              <input
                type="text"
                placeholder="Stats"
                value={manualStats}
                onChange={(e) => setManualStats(e.target.value)}
                className="gods:mb-2 gods:w-full gods:bg-background gods:border gods:border-border gods:p-2 gods:rounded gods:text-base"
              />

              <textarea
                placeholder="Description"
                value={manualDesc}
                onChange={(e) => setManualDesc(e.target.value)}
                className="gods:mb-2 gods:w-full gods:min-h-[80px] gods:bg-background gods:border gods:border-border gods:p-2 gods:rounded gods:resize-none gods:text-base"
              />

              {/* Modal Buttons */}
              <div className="gods:mt-auto gods:pt-4 gods:flex gods:gap-2">
                <button
                  onClick={closeAddModal}
                  className="gods:flex-1 gods:bg-muted gods:text-foreground gods:p-2 gods:rounded gods:text-base gods:hover:bg-muted"
                >
                  Annuler
                </button>

                <button
                  onClick={handleAddItem}
                  disabled={!selectedPremade && !manualName.trim()}
                  className="gods:flex-1 gods:bg-primary gods:text-primary-foreground gods:p-2 gods:rounded gods:text-base gods:disabled:opacity-50 gods:disabled:cursor-not-allowed"
                >
                  Ajouter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          RIGHT COLUMN: NOTES
          ===================================================== */}
      <div className="gods:h-full gods:bg-card gods:border gods:border-border gods:rounded-lg gods:flex gods:flex-col gods:overflow-hidden">
        {/* Notes Header */}
        <div className="gods:bg-muted gods:px-3 gods:py-2 gods:border-b gods:border-border gods:font-display gods:uppercase gods:text-xl gods:tracking-wider">
          Notes
        </div>

        {/* Notes Editor */}
        <div className="gods:flex-1 gods:p-0">
          <textarea
            className="gods:w-full gods:h-full gods:bg-transparent gods:text-foreground gods:p-3 gods:resize-none gods:focus:outline-none gods:text-base"
            value={character.notes || ""}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Prenez vos notes ici..."
          />
        </div>
      </div>
    </div>
  );
}