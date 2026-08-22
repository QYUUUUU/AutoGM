import { Dice5, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import type { AnyRecord, Combatant, SceneMap } from "../types/admin";
import { CARACS, SKILLS } from "../utils/constants";
import { Button, Panel, Select } from "./ui";
import { SceneMode, SceneTabs } from "./SceneTabs";
import { InitiativePanel } from "./InitiativePanel";
import { CombatantCard } from "./CombatantCard";
import { BestiaryPanel } from "./BestiaryPanel";
import { AttackResolver } from "./AttackResolver";
import { CombatLog, PlayerRollHistory } from "./CombatLog";

const fieldClass =
  "gods:h-9 gods:bg-input-background gods:border gods:border-border gods:rounded-md gods:px-2.5 gods:text-base gods:text-foreground gods:outline-none focus:gods:border-primary/40";

const labelClass =
  "gods:block gods:mb-1 gods:text-sm gods:font-medium gods:text-foreground/70";

interface Props {
  // AJOUT ICI : On déclare qu'on attend l'ID du groupe
  activeGroupId: number | null | undefined;

  sceneId: string;
  scenes: SceneMap;
  combatants: Combatant[];
  missingPCs: AnyRecord[];
  log: string[];

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

  adversaries: AnyRecord[];

  onRestorePc: (id: string | number) => void;

  onClearEnemies: () => void;
  onSortInitiative: () => void;
  onDifficultyChange: (value: string) => void;
  onRollInitiative: () => void;

  onBestIdChange: (value: string) => void;
  onAddBestiary: () => void;

  onNpcNameChange: (value: string) => void;
  onThreatChange: (value: string) => void;
  onExperienceChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onSpecialtyChange: (value: string) => void;
  onQuickNpc: () => void;

  onCustomNpcIdChange: (value: string) => void;
  onCustomCaracChange: (value: string) => void;
  onCustomSkillChange: (value: string) => void;
  onCustomModifierChange: (value: string) => void;
  onCustomRoll: () => void;

  onRemove: (id: string | number) => void;
  onWound: (
    id: string | number,
    type: "l" | "g" | "m",
    value: number,
  ) => void;
  onInit: (id: string | number, value: number) => void;
  onArmor: (id: string | number, value: string) => void;

  onQuickRoll: (
    name: string,
    label: string,
    formula: string,
    rerolls?: number,
  ) => void;
  onUpdateNpcData: (id: string | number, field: string, value: any) => void; // <-- NOUVEAU
  onAttackerChange: (value: string) => void;
  onTargetChange: (value: string) => void;
  onAttackRollChange: (value: string) => void;
  onDefenseRollChange: (value: string) => void;
  onWeaponChange: (value: string) => void;
  onCustomWeaponChange: (value: string) => void;
  onResolveAttack: () => void;
}

function PreparationRoster({
  combatants,
  missingPCs,
  onRestorePc,
  onRemove,
}: Pick<
  Props,
  "combatants" | "missingPCs" | "onRestorePc" | "onRemove"
>) {
  return (
    <Panel title="Personnages de la scène">
      <div className="gods:space-y-1">
        {combatants.length === 0 ? (
          <div className="gods:px-2 gods:py-4 gods:text-center gods:text-[11px] gods:text-foreground/30">
            La scène est vide.
          </div>
        ) : (
          combatants.map((combatant) => (
            <div
              key={String(combatant.id)}
              className="gods:flex gods:items-center gods:gap-2 gods:h-8 gods:px-2 gods:rounded gods:border gods:border-border gods:bg-foreground/[.015]"
            >
              <span
                className={
                  combatant.isPC
                    ? "gods:text-[9px] gods:font-bold gods:text-primary"
                    : "gods:text-[9px] gods:font-bold gods:text-destructive"
                }
              >
                {combatant.isPC ? "PJ" : "PNJ"}
              </span>

              <span className="gods:flex-1 gods:min-w-0 gods:truncate gods:text-xs gods:text-foreground/70">
                {combatant.name}
              </span>

              <span className="gods:text-[9px] gods:text-foreground/25">
                I {combatant.init}
              </span>

              <button
                type="button"
                onClick={() => onRemove(combatant.id)}
                className="gods:w-6 gods:h-6 gods:flex gods:items-center gods:justify-center gods:rounded gods:text-foreground/20 hover:gods:text-destructive"
                title="Retirer"
              >
                <Trash2 size={11} />
              </button>
            </div>
          ))
        )}
      </div>

      {missingPCs.length > 0 && (
        <div className="gods:mt-3 gods:border-t gods:border-border gods:pt-3">
          <div className="gods:flex gods:items-center gods:gap-2 gods:mb-2">
            <RotateCcw size={12} className="gods:text-primary/60" />

            <span className="gods:text-[9px] gods:uppercase gods:tracking-wider gods:text-foreground/35">
              PJ disponibles
            </span>
          </div>

          <div className="gods:flex gods:flex-wrap gods:gap-1.5">
            {missingPCs.map((pc) => {
              const id = pc.id ?? pc.id_Character;

              return (
                <button
                  key={String(id)}
                  type="button"
                  onClick={() => onRestorePc(id)}
                  className="gods:inline-flex gods:items-center gods:gap-1 gods:h-7 gods:px-2 gods:rounded gods:border gods:border-border gods:text-[10px] gods:text-foreground/55 hover:gods:border-primary/30 hover:gods:text-primary"
                >
                  <Plus size={10} />
                  {pc.nom || pc.name || "PJ"}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </Panel>
  );
}

function CustomRollPanel(
  props: Pick<
    Props,
    | "combatants"
    | "customNpcId"
    | "onCustomNpcIdChange"
    | "customCarac"
    | "onCustomCaracChange"
    | "customSkill"
    | "onCustomSkillChange"
    | "customModifier"
    | "onCustomModifierChange"
    | "onCustomRoll"
  >,
) {
  const selectClass =
    "!gods:h-9 !gods:min-h-9 !gods:py-0 !gods:px-2.5 !gods:text-base !gods:leading-none";

  return (
    <Panel
      title="Jet ponctuel"
      icon={<Dice5 size={17} />}
      className="gods:h-fit"
    >
      <div className="gods:space-y-3">

        <div>
          <label className={labelClass}>
            Combattant
          </label>

          <Select
            value={props.customNpcId}
            onChange={(event) =>
              props.onCustomNpcIdChange(event.target.value)
            }
            className={`${selectClass} gods:w-full`}
          >
            <option value="">
              Sélectionner…
            </option>

            {props.combatants.map((combatant) => (
              <option
                key={String(combatant.id)}
                value={String(combatant.id)}
              >
                {combatant.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="gods:grid gods:grid-cols-2 gods:gap-3">
          <div className="gods:min-w-0">
            <label className={labelClass}>
              Caractéristique
            </label>

            <Select
              value={props.customCarac}
              onChange={(event) =>
                props.onCustomCaracChange(event.target.value)
              }
              className={`${selectClass} gods:w-full`}
            >
              {CARACS.map(([key, text]) => (
                <option
                  key={key}
                  value={key}
                >
                  {text}
                </option>
              ))}
            </Select>
          </div>

          <div className="gods:min-w-0">
            <label className={labelClass}>
              Compétence
            </label>

            <Select
              value={props.customSkill}
              onChange={(event) =>
                props.onCustomSkillChange(event.target.value)
              }
              className={`${selectClass} gods:w-full`}
            >
              {SKILLS.map(([key, text]) => (
                <option
                  key={key}
                  value={key}
                >
                  {text}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="gods:flex gods:items-end gods:gap-2">
          <div className="gods:w-[90px] gods:shrink-0">
            <label className={labelClass}>
              Modif.
            </label>

            <input
              type="number"
              value={props.customModifier}
              onChange={(event) =>
                props.onCustomModifierChange(event.target.value)
              }
              className={`${fieldClass} gods:w-[90px]`}
            />
          </div>

          <Button
            onClick={props.onCustomRoll}
            className="gods:h-9 gods:px-4 gods:text-base"
          >
            <Dice5 size={16} />
            Lancer
          </Button>
        </div>
      </div>
    </Panel>
  );
}

export function CombatDashboard(props: Props) {
  const [modes, setModes] = useState<Record<string, SceneMode>>({});
  const mode = modes[props.sceneId] || "prepare";
  const scene = props.scenes[props.sceneId];

  const setMode = (next: SceneMode) => {
    setModes((current) => ({
      ...current,
      [props.sceneId]: next,
    }));
  };

  return (
    <div className="gods:h-full gods:flex gods:flex-col gods:min-h-0 gods:max-w-[1600px] gods:mx-auto">
      <SceneTabs
        sceneName={scene?.name || "Scène principale"}
        mode={mode}
        onModeChange={setMode}
        combatantCount={props.combatants.length}
      />

      {/* ======================================================
          PRÉPARATION
      ======================================================= */}
      {mode === "prepare" ? (
        <div className="gods:flex-1 gods:min-h-0 gods:overflow-y-auto gods:pt-3">
          <div className="gods:grid gods:grid-cols-1 xl:gods:grid-cols-[minmax(0,1fr)_minmax(320px,.7fr)] gods:gap-3 gods:items-start">
            <div className="gods:space-y-3">
              <div className="gods:flex gods:items-center gods:justify-between">
                <div>
                  <div className="gods:text-[9px] gods:uppercase gods:tracking-[.18em] gods:text-primary/60">
                    Préparation
                  </div>
                </div>

                <div className="gods:flex gods:gap-1.5">
                  <Button
                    variant="danger"
                    className="gods:h-7 gods:px-2 gods:text-[10px]"
                    onClick={props.onClearEnemies}
                  >
                    <Trash2 size={11} />
                    Vider PNJ
                  </Button>

                  <Button
                    variant="gold"
                    className="gods:h-7 gods:px-2 gods:text-[10px]"
                    onClick={props.onSortInitiative}
                  >
                    Trier initiative
                  </Button>
                </div>
              </div>

              <PreparationRoster
                combatants={props.combatants}
                missingPCs={props.missingPCs}
                onRestorePc={props.onRestorePc}
                onRemove={props.onRemove}
              />

              <BestiaryPanel
                adversaries={props.adversaries}
                bestId={props.bestId}
                onBestIdChange={props.onBestIdChange}
                onAddBestiary={props.onAddBestiary}
                npcName={props.npcName}
                onNpcNameChange={props.onNpcNameChange}
                threat={props.threat}
                onThreatChange={props.onThreatChange}
                experience={props.experience}
                onExperienceChange={props.onExperienceChange}
                role={props.role}
                onRoleChange={props.onRoleChange}
                specialty={props.specialty}
                onSpecialtyChange={props.onSpecialtyChange}
                onQuickNpc={props.onQuickNpc}
              />
            </div>

            <div className="gods:space-y-3">
              <InitiativePanel
                difficulty={props.pnjDiff}
                onDifficultyChange={props.onDifficultyChange}
                onRoll={props.onRollInitiative}
              />
            </div>
          </div>
        </div>
      ) : (
        /* ======================================================
            UTILISATION
        ======================================================= */
         <div
          className="
            gods:flex
            gods:flex-1
            gods:min-h-0
            gods:pt-3
            gods:gap-3
            gods:overflow-hidden
          "
        >

          {/* ==================================================
              COLONNE PRINCIPALE : COMBAT
              ================================================== */}

      <main
        className="
          gods:flex
          gods:min-w-0
          gods:min-h-0
          gods:flex-1
          gods:flex-col
        "
      >
        <div
          className="
            gods:flex
            gods:items-center
            gods:justify-between
            gods:shrink-0
            gods:mb-2
          "
        >
          <div>
            <h2
              className="
                gods:m-0
                gods:text-lg
                gods:font-[family-name:var(--font-display)]
                gods:tracking-wide
                gods:text-foreground
              "
            >
              Combat
            </h2>

            <p
              className="
                gods:m-0
                gods:text-sm
                gods:text-foreground/45
              "
            >
              {props.combatants.length} combattant
              {props.combatants.length > 1 ? "s" : ""}
            </p>
          </div>

          <Button
            variant="danger"
            className="
              gods:h-8
              gods:px-3
              gods:text-sm
            "
            onClick={props.onClearEnemies}
          >
            <Trash2 size={14} />
            Vider PNJ
          </Button>
        </div>

        <div
          className="
            gods:min-h-0
            gods:flex-1
            gods:overflow-y-auto
            gods:pr-1
            gods:space-y-2
          "
        >
          {props.combatants.length === 0 ? (
            <div
              className="
                gods:border
                gods:border-dashed
                gods:border-border
                gods:rounded-md
                gods:p-8
                gods:text-center
                gods:text-base
                gods:text-foreground/40
              "
            >
              Aucun combattant.
              <br />
              Retourne dans{" "}
              <strong>Préparation</strong> pour
              peupler la scène.
            </div>
          ) : (
            props.combatants.map((combatant) => (
              <CombatantCard
                key={String(combatant.id)}
                combatant={combatant}
                onRemove={props.onRemove}
                onWound={props.onWound}
                onInit={props.onInit}
                onArmor={props.onArmor}
                onRoll={props.onQuickRoll}
                onUpdateNpcData={props.onUpdateNpcData} // <-- NOUVEAU
              />
            ))
          )}
        </div>

        {/* ==================================================
            OUTILS — EN BAS, CÔTE À CÔTE
            ================================================== */}

        <div
          className="
            gods:shrink-0
            gods:mt-3
            gods:grid
            gods:grid-cols-2
            gods:gap-3
          "
        >
          <AttackResolver
            combatants={props.combatants}
            attacker={props.attacker}
            target={props.target}
            attackRoll={props.attackRoll}
            defenseRoll={props.defenseRoll}
            weapon={props.weapon}
            customWeapon={props.customWeapon}
            onAttackerChange={props.onAttackerChange}
            onTargetChange={props.onTargetChange}
            onAttackRollChange={props.onAttackRollChange}
            onDefenseRollChange={props.onDefenseRollChange}
            onWeaponChange={props.onWeaponChange}
            onCustomWeaponChange={
              props.onCustomWeaponChange
            }
            onResolve={props.onResolveAttack}
          />

          <CustomRollPanel
            combatants={props.combatants}
            customNpcId={props.customNpcId}
            onCustomNpcIdChange={
              props.onCustomNpcIdChange
            }
            customCarac={props.customCarac}
            onCustomCaracChange={
              props.onCustomCaracChange
            }
            customSkill={props.customSkill}
            onCustomSkillChange={
              props.onCustomSkillChange
            }
            customModifier={props.customModifier}
            onCustomModifierChange={
              props.onCustomModifierChange
            }
            onCustomRoll={props.onCustomRoll}
          />
        </div>
      </main>

      {/* ==================================================
          COLONNE JOURNAL
          ================================================== */}

      <aside
        className="
          gods:w-[380px]
          gods:shrink-0
          gods:min-h-0
          gods:h-full
          gods:flex
          gods:flex-col
        "
      >
        {/* JETS JOUEURS — 50% */}
        <div
          className="
            gods:min-h-0
            gods:flex-1
            gods:basis-0
          "
        >
          {/* AJOUT ICI : On passe la prop au composant */}
          <PlayerRollHistory groupeId={props.activeGroupId} />
        </div>

        {/* LOG DES ACTIONS — 50% */}
        <div
          className="
            gods:min-h-0
            gods:flex-1
            gods:basis-0
          "
        >
          <CombatLog entries={props.log} />
        </div>
      </aside>
    </div>
      )}
    </div>
  );
}