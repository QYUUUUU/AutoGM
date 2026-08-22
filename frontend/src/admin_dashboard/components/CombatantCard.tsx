import {
  ChevronDown,
  ExternalLink,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { useState } from "react";
import type { Combatant, WoundType } from "../types/admin";
import { cls } from "../utils/classNames";

interface Props {
  combatant: Combatant;
  onRemove: (id: string | number) => void;
  onWound: (id: string | number, type: WoundType, value: number) => void;
  onInit: (id: string | number, value: number) => void;
  onArmor: (id: string | number, value: string) => void;
  onUpdateNpcData: (id: string | number, field: string, value: any) => void;
  onRoll: (name: string, label: string, formula: string, rerolls?: number) => void;
}

function Wounds({
  c,
  onWound,
}: {
  c: Combatant;
  onWound: Props["onWound"];
}) {
  const character = c.fullChar || {};
  const npc = c.npcData || {};

  // Pour les PJ : calculé dynamiquement avec la Résistance
  // Pour les PNJ : récupéré depuis la BDD (ou 0 par défaut si non renseigné)
  const thresholdL = c.isPC 
    ? (Number(character.resistance) || 0) 
    : (Number(npc.seuilBlessuresLegeres) || 0);

  const thresholdG = c.isPC 
    ? (Number(character.resistance) || 0) + 3 
    : (Number(npc.seuilBlessuresGraves) || 0);

  const thresholdM = c.isPC 
    ? (Number(character.resistance) || 0) + 7 
    : (Number(npc.seuilBlessuresMortelles) || 0);

  const tracks: Array<[WoundType, string, number, string, number]> = [
    ["l", "L", c.lMax, "gods:text-amber-500", thresholdL],
    ["g", "G", c.gMax, "gods:text-orange-500", thresholdG],
    ["m", "M", c.mMax, "gods:text-destructive", thresholdM],
  ];

  return (
    <div className="gods:flex gods:items-center gods:gap-4 lg:gods:gap-6">

      <div className="gods:flex gods:items-center gods:gap-4">
        {tracks.map(([type, label, max, tone, threshold]) => {
          const value = c[type];

          return (
            <div
              key={type}
              className="gods:flex gods:items-center gods:gap-1.5"
            >
              <span
                className={cls(
                  "gods:min-w-[44px] gods:text-sm gods:font-bold gods:text-center gods:whitespace-nowrap",
                  tone,
                )}
              >
                {label} ({threshold})
              </span>

              <button
                type="button"
                onClick={() => onWound(c.id, type, value - 1)}
                className="gods:w-8 gods:h-8 gods:flex gods:items-center gods:justify-center gods:rounded-md gods:bg-foreground/5 gods:text-foreground/50 hover:gods:bg-foreground/15 hover:gods:text-foreground/90 gods:transition-colors"
              >
                <Minus size={16} />
              </button>

              <span className="gods:min-w-[40px] gods:text-center gods:text-sm gods:font-mono gods:font-medium gods:text-foreground/80">
                {value}/{max}
              </span>

              <button
                type="button"
                onClick={() => onWound(c.id, type, value + 1)}
                className="gods:w-8 gods:h-8 gods:flex gods:items-center gods:justify-center gods:rounded-md gods:bg-foreground/5 gods:text-foreground/50 hover:gods:bg-foreground/15 hover:gods:text-foreground/90 gods:transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CombatantCard({
  combatant: c,
  onRemove,
  onWound,
  onInit,
  onArmor,
  onRoll,
  onUpdateNpcData,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const character = c.fullChar || {};
  const npc = c.npcData || {};

  // -- Calcul des compteurs PNJ --
  const maxRes = parseInt(String(npc.res || "0").match(/\d+/)?.[0] || "0", 10);
  const maxRel = parseInt(String(npc.rel || "0").match(/\d+/)?.[0] || "0", 10);
  const usedRes = Number(npc.usedRes || 0);

  // Constitution dynamique des boutons d'action
  const quicks: Array<[string, string]> = c.isPC
    ? [
        ["CàC", `${Number(character.puissance) || 1}D`],
        ["Mêlée", `${(Number(character.precision) || 1) + (Number(character.melee) || 0)}D`],
        ["Tir", `${(Number(character.precision) || 1) + (Number(character.tir) || 0)}D`],
        ["Puis", `${Number(character.puissance) || 1}D`],
      ]
    : [
        ["Attaque", npc.atk || "3D"],
        ["Action", npc.act || "3D"],
        // Si le PNJ a une Spécialité, on l'intègre élégamment aux autres boutons d'action
        ...(npc.spec ? [[`Spécialité${npc.specdet ? ` (${npc.specdet})` : ""}`, npc.spec] as [string, string]] : []),
      ];

  return (
    <article
      className={cls(
        "gods:border gods:rounded-lg gods:bg-card/40 gods:overflow-hidden gods:shadow-sm",
        c.isPC
          ? "gods:border-border"
          : "gods:border-destructive/30",
      )}
    >
      {/* ... L'ENTÊTE RESTE IDENTIQUE (Badge, Nom, Init, Armure, Blessures) ... */}
      <div className="gods:min-h-[72px] gods:flex gods:items-center gods:gap-4 gods:px-4 gods:py-2.5">
        <span
          className={cls(
            "gods:w-10 gods:h-10 gods:shrink-0 gods:flex gods:items-center gods:justify-center gods:rounded-md gods:text-sm gods:font-bold gods:border",
            c.isPC
              ? "gods:bg-primary/10 gods:text-primary gods:border-primary/20"
              : "gods:bg-destructive/10 gods:text-destructive gods:border-destructive/20",
          )}
        >
          {c.isPC ? "PJ" : "PNJ"}
        </span>

        <div className="gods:min-w-0 gods:w-[180px] lg:gods:w-[240px]">
          <div className="gods:truncate gods:text-base gods:font-semibold gods:font-[family-name:var(--font-display)] gods:text-foreground/90">
            {c.name}
          </div>
          {!c.isPC && (
            <div className="gods:text-sm gods:text-foreground/50 gods:mt-0.5">
              Réaction: {c.reaction}
            </div>
          )}
        </div>

        <label className="gods:flex gods:items-center gods:gap-2 gods:shrink-0">
          <span className="gods:text-sm gods:uppercase gods:font-medium gods:text-foreground/40 hidden md:gods:inline-block">
            Init
          </span>
          <input
            type="number"
            value={c.init}
            onChange={(event) => onInit(c.id, Number(event.target.value))}
            className="gods:w-14 gods:h-9 gods:bg-input-background gods:border gods:border-border gods:rounded-md gods:px-2 gods:text-center gods:text-sm gods:font-mono gods:font-medium gods:outline-none focus:gods:border-primary/50 focus:gods:ring-2 focus:gods:ring-primary/10 gods:transition-all"
          />
        </label>

        <label className="gods:flex gods:items-center gods:gap-2 gods:shrink-0">
          <span className="gods:text-sm gods:uppercase gods:font-medium gods:text-foreground/40 hidden md:gods:inline-block">
            Arm
          </span>
          <input
            value={c.armor}
            onChange={(event) => onArmor(c.id, event.target.value)}
            className="gods:w-20 gods:h-9 gods:bg-input-background gods:border gods:border-border gods:rounded-md gods:px-2 gods:text-center gods:text-sm gods:font-mono gods:font-medium gods:outline-none focus:gods:border-primary/50 focus:gods:ring-2 focus:gods:ring-primary/10 gods:transition-all"
          />
        </label>

        <div className="gods:flex-1 gods:min-w-0 gods:flex gods:justify-center">
          <Wounds c={c} onWound={onWound} />
        </div>

        <div className="gods:flex gods:items-center gods:gap-1 gods:ml-2 gods:shrink-0">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className={cls(
              "gods:w-9 gods:h-9 gods:shrink-0 gods:flex gods:items-center gods:justify-center gods:rounded-md gods:text-foreground/40 hover:gods:bg-foreground/10 hover:gods:text-foreground/80 gods:transition-colors",
              expanded && "gods:bg-foreground/10 gods:text-foreground/80",
            )}
            title="Afficher les détails"
          >
            <ChevronDown
              size={20}
              className={cls(
                "gods:transition-transform gods:duration-200",
                expanded && "gods:rotate-180",
              )}
            />
          </button>
          <button
            type="button"
            onClick={() => onRemove(c.id)}
            className="gods:w-9 gods:h-9 gods:shrink-0 gods:flex gods:items-center gods:justify-center gods:rounded-md gods:text-foreground/30 hover:gods:text-destructive hover:gods:bg-destructive/10 gods:transition-colors"
            title="Retirer du combat"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* DÉTAILS DÉPLIABLES */}
      {expanded && (
        <div className="gods:border-t gods:border-border gods:bg-foreground/[.02] gods:px-5 gods:py-4 gods:flex gods:flex-col gods:gap-4">
          
          {/* LIGNE DES ACTIONS RAPIDES */}
          <div className="gods:flex gods:flex-wrap gods:items-center gods:gap-2">
            {quicks.map(([label, formula]) => (
              <button
                key={label}
                type="button"
                onClick={() =>
                  onRoll(
                    c.name,
                    label,
                    formula,
                    c.isPC ? 0 : maxRel // <-- Les relances sont injectées ici automatiquement !
                  )
                }
                className="gods:group gods:h-9 gods:px-3 gods:rounded-md gods:border gods:border-border/60 gods:bg-foreground/5 gods:text-sm gods:text-foreground/70 hover:gods:border-primary/40 hover:gods:bg-primary/5 hover:gods:text-primary gods:transition-colors"
                title={`${label} · ${formula}${!c.isPC && maxRel > 0 ? ` (avec ${maxRel} relance${maxRel > 1 ? 's' : ''})` : ''}`}
              >
                {label}{" "}
                <b className="gods:ml-1 gods:font-semibold gods:text-foreground/90 group-hover:gods:text-primary gods:transition-colors">
                  {formula}
                </b>
              </button>
            ))}
          </div>

          {/* STATISTIQUES ET INFOS TEXTUELLES */}
          <div className="gods:flex gods:flex-wrap gods:items-center gods:gap-x-6 gods:gap-y-3 gods:text-sm gods:text-foreground/60">
            {c.isPC ? (
              <>
                <span><b className="gods:text-foreground/90 gods:font-medium">Puis</b> {character.puissance ?? 1}</span>
                <span><b className="gods:text-foreground/90 gods:font-medium">Préc</b> {character.precision ?? 1}</span>
                <span><b className="gods:text-foreground/90 gods:font-medium">Rés</b> {character.resistance ?? 1}</span>
                <span><b className="gods:text-foreground/90 gods:font-medium">Réf</b> {character.reflexes ?? 1}</span>
                <span><b className="gods:text-foreground/90 gods:font-medium">Conn</b> {character.connaissance ?? 1}</span>
                <span><b className="gods:text-foreground/90 gods:font-medium">Perc</b> {character.perception ?? 1}</span>
                <span><b className="gods:text-foreground/90 gods:font-medium">Vol</b> {character.volonte ?? 1}</span>
                <span><b className="gods:text-foreground/90 gods:font-medium">Emp</b> {character.empathie ?? 1}</span>
              </>
            ) : (
              <>
                {/* RESERVE (Avec compteurs et bouton d'action) */}
                {maxRes > 0 && (
                  <span className="gods:flex gods:items-center gods:gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const rest = maxRes - usedRes;
                        if (rest > 0) onRoll(c.name, "Réserve", `${rest}D`);
                      }}
                      className="gods:text-primary/90 gods:font-medium hover:gods:text-primary hover:gods:underline gods:underline-offset-2 gods:transition-all"
                      title={`Lancer les ${maxRes - usedRes} dés de Réserve restants`}
                    >
                      Réserve
                    </button>
                    <span className="gods:flex gods:gap-1">
                      {Array.from({ length: maxRes }).map((_, i) => (
                        <button
                          key={`res-${i}`}
                          type="button"
                          onClick={() => onUpdateNpcData?.(c.id, "usedRes", usedRes === i + 1 ? i : i + 1)}
                          className={cls(
                            "gods:w-3.5 gods:h-3.5 gods:rounded-full gods:border-2 gods:transition-all hover:gods:scale-110",
                            i < usedRes
                              ? "gods:bg-primary gods:border-primary" 
                              : "gods:border-primary/30 hover:gods:border-primary/60" 
                          )}
                          title="Cocher/Décocher 1 point de Réserve"
                        />
                      ))}
                    </span>
                  </span>
                )}

                {/* RELANCES (Info textuelle car automatiques) */}
                {maxRel > 0 && (
                  <span>
                    <b className="gods:text-primary/90 gods:font-medium">Relance{maxRel > 1 ? 's' : ''}</b>{" "}
                    {maxRel}
                  </span>
                )}

                {/* CONTACT (Info textuelle) */}
                {npc.contact && (
                  <span>
                    <b className="gods:text-primary/90 gods:font-medium">Contact</b>{" "}
                    {npc.contact}
                  </span>
                )}

                {/* ARME */}
                {npc.arme && (
                  <span>
                    <b className="gods:text-primary/90 gods:font-medium">Arme</b>{" "}
                    {npc.arme}
                  </span>
                )}

                {/* CAPACITES */}
                {npc.cap && (
                  <span className="gods:leading-relaxed">
                    <b className="gods:text-foreground/90 gods:font-medium">Cap.</b>{" "}
                    {String(npc.cap).replace(/\\n/g, " · ")}
                  </span>
                )}

                {character.id_Character && (
                  <a
                    href={`/Character/show/${character.id_Character}`}
                    target="_blank"
                    rel="noreferrer"
                    className="gods:inline-flex gods:items-center gods:gap-1.5 gods:text-primary/80 hover:gods:text-primary gods:font-medium gods:ml-auto"
                  >
                    Fiche complète
                    <ExternalLink size={14} />
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </article>
  );
}