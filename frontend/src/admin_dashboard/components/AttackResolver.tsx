import { Crosshair, Swords } from "lucide-react";
import type { Combatant } from "../types/admin";
import { WEAPONS } from "../utils/constants";
import { Button, Panel, Select } from "./ui";

interface Props {
  combatants: Combatant[];
  attacker: string;
  target: string;
  attackRoll: string;
  defenseRoll: string;
  weapon: string;
  customWeapon: string;
  onAttackerChange: (value: string) => void;
  onTargetChange: (value: string) => void;
  onAttackRollChange: (value: string) => void;
  onDefenseRollChange: (value: string) => void;
  onWeaponChange: (value: string) => void;
  onCustomWeaponChange: (value: string) => void;
  onResolve: () => void;
}

const labelClass = "gods:block gods:mb-1.5 gods:text-sm gods:font-medium gods:text-foreground/75";
const inputClass = "gods:h-9 gods:bg-input-background gods:border gods:border-border gods:rounded-md gods:px-2.5 gods:text-base gods:leading-none gods:text-foreground gods:outline-none focus:gods:border-primary/50";
const selectClass = "!gods:h-9 !gods:min-h-9 !gods:py-0 !gods:px-2.5 !gods:text-base !gods:leading-none";

export function AttackResolver(props: Props) {
  // --- IDENTIFICATION DE L'ATTAQUANT ACTUEL ---
  const currentAttacker = props.combatants.find((c) => String(c.id) === props.attacker);
  const isNPC = currentAttacker && !currentAttacker.isPC;
  const npcWeaponStr = currentAttacker?.npcData?.arme || "Attaque naturelle";
  const pcEquippedStr = currentAttacker?.fullChar?.armeEquipee || "";

  // --- PARSING DU CHAMP CUSTOM (Dégâts + Type stockés dans une seule string "2,P") ---
  const customParts = (props.customWeapon || "").split(",");
  const customDmg = customParts[0] || "";
  const customType = customParts[1] || "P";

  return (
    <Panel title="Résoudre une action" icon={<Crosshair size={17} />} className="gods:h-fit">
      <div className="gods:space-y-3">
        {/* ATTAQUANT / CIBLE */}
        <div className="gods:grid gods:grid-cols-2 gods:gap-3">
          <div className="gods:min-w-0">
            <label className={labelClass}>Attaquant</label>
            <Select value={props.attacker} onChange={(e) => props.onAttackerChange(e.target.value)} className={`${selectClass} gods:w-full`}>
              <option value="">Choisir…</option>
              {props.combatants.map((c) => (
                <option key={String(c.id)} value={String(c.id)}>{c.name}</option>
              ))}
            </Select>
          </div>
          <div className="gods:min-w-0">
            <label className={labelClass}>Cible</label>
            <Select value={props.target} onChange={(e) => props.onTargetChange(e.target.value)} className={`${selectClass} gods:w-full`}>
              <option value="">Choisir…</option>
              {props.combatants.map((c) => (
                <option key={String(c.id)} value={String(c.id)}>{c.name}</option>
              ))}
            </Select>
          </div>
        </div>

        {/* RÉUSSITES / ARME */}
        <div className="gods:grid gods:grid-cols-2 gods:gap-3">
          <div className="gods:min-w-0">
            <label className={labelClass}>Réussites</label>
            <div className="gods:flex gods:gap-2">
              <input type="number" value={props.attackRoll} onChange={(e) => props.onAttackRollChange(e.target.value)} placeholder="Attaque" className={`${inputClass} gods:w-full`} />
              <input type="number" value={props.defenseRoll} onChange={(e) => props.onDefenseRollChange(e.target.value)} placeholder="Défense" className={`${inputClass} gods:w-full`} />
            </div>
          </div>

          <div className="gods:min-w-0">
            <label className={labelClass}>Arme utilisée</label>
            <div className="gods:flex gods:items-center gods:gap-2 gods:flex-wrap">
              <Select value={props.weapon} onChange={(e) => props.onWeaponChange(e.target.value)} className={`${selectClass} gods:flex-1 gods:min-w-[140px]`}>
                {/* L'option 'auto' s'adapte magiquement au personnage sélectionné */}
                <option value="auto">
                  {isNPC 
                    ? `Par défaut : ${npcWeaponStr}` 
                    : pcEquippedStr 
                      ? `Équipée : ${pcEquippedStr}` 
                      : "Arme équipée"}
                </option>
                <option disabled>──────</option>
                {WEAPONS.map(([value, text]) => (
                  <option key={value} value={value}>{text}</option>
                ))}
              </Select>

              {props.weapon === "custom" && (
                <div className="gods:flex gods:gap-1 gods:items-center gods:w-full gods:mt-1">
                  <input
                    value={customDmg}
                    onChange={(e) => props.onCustomWeaponChange(`${e.target.value},${customType}`)}
                    placeholder="Dégâts (ex: 2 ou +1)"
                    className={`${inputClass} gods:flex-1 gods:min-w-0`}
                  />
                  <Select
                    value={customType}
                    onChange={(e) => props.onCustomWeaponChange(`${customDmg},${e.target.value}`)}
                    className={`${selectClass} gods:w-[50px] gods:shrink-0`}
                  >
                    <option value="P">P</option>
                    <option value="T">T</option>
                    <option value="E">E</option>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ACTION */}
        <Button variant="primary" onClick={props.onResolve} className="gods:h-9 gods:px-4 gods:text-base gods:w-full">
          <Swords size={16} />
          Résoudre
        </Button>
      </div>
    </Panel>
  );
}