import { Dice5, Plus } from "lucide-react";
import type { AnyRecord } from "../types/admin";
import {
  EXPERIENCE,
  ROLE,
  THREAT,
} from "../utils/constants";
import {
  Button,
  Panel,
  Select,
  inputClass,
} from "./ui";

interface Props {
  adversaries: AnyRecord[];

  bestId: string;
  onBestIdChange: (value: string) => void;
  onAddBestiary: () => void;

  npcName: string;
  onNpcNameChange: (value: string) => void;

  threat: string;
  onThreatChange: (value: string) => void;

  experience: string;
  onExperienceChange: (value: string) => void;

  role: string;
  onRoleChange: (value: string) => void;

  specialty: string;
  onSpecialtyChange: (value: string) => void;

  onQuickNpc: () => void;
}

export function BestiaryPanel(props: Props) {
  return (
    <Panel
      title="Ajouter des PNJ"
      icon={<Dice5 size={15} />}
      className="gods:h-fit"
    >
      {/* Bestiaire */}
      <div className="gods:grid gods:grid-cols-[minmax(0,1fr)_auto] gods:gap-2">
        <Select
          value={props.bestId}
          onChange={(event) =>
            props.onBestIdChange(event.target.value)
          }
          className="gods:h-8 gods:py-1.5 gods:text-xs"
        >
          <option value="">
            Choisir dans le bestiaire
          </option>

          {props.adversaries.map((adversary) => (
            <option
              key={adversary.name}
              value={adversary.name}
            >
              {adversary.name} · Menace{" "}
              {adversary.menace}
            </option>
          ))}
        </Select>

        <Button
          variant="gold"
          className="gods:h-8 gods:px-2.5 gods:text-xs"
          onClick={props.onAddBestiary}
        >
          <Plus size={13} />
          Ajouter
        </Button>
      </div>

      <div className="gods:my-3 gods:border-t gods:border-border" />

      {/* Génération rapide */}
      <div className="gods:grid gods:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] gods:gap-2">
        <input
          value={props.npcName}
          onChange={(event) =>
            props.onNpcNameChange(
              event.target.value,
            )
          }
          placeholder="Nom du PNJ"
          className={inputClass}
        />

        <Select
          value={props.threat}
          onChange={(event) =>
            props.onThreatChange(
              event.target.value,
            )
          }
          className="gods:py-2 gods:text-xs"
        >
          {Object.keys(THREAT).map((value) => (
            <option key={value}>{value}</option>
          ))}
        </Select>

        <Select
          value={props.experience}
          onChange={(event) =>
            props.onExperienceChange(
              event.target.value,
            )
          }
          className="gods:py-2 gods:text-xs"
        >
          {Object.keys(EXPERIENCE).map((value) => (
            <option key={value}>{value}</option>
          ))}
        </Select>

        <Select
          value={props.role}
          onChange={(event) =>
            props.onRoleChange(
              event.target.value,
            )
          }
          className="gods:py-2 gods:text-xs"
        >
          {Object.keys(ROLE).map((value) => (
            <option key={value}>{value}</option>
          ))}
        </Select>
      </div>

      <div className="gods:flex gods:items-center gods:gap-2 gods:mt-2">
        <input
          value={props.specialty}
          onChange={(event) =>
            props.onSpecialtyChange(
              event.target.value,
            )
          }
          placeholder="Spécialité (facultatif)"
          className={`${inputClass} gods:py-2 gods:text-xs`}
        />

        <Button
          className="gods:h-8 gods:shrink-0 gods:text-xs"
          onClick={props.onQuickNpc}
        >
          <Plus size={13} />
          Générer
        </Button>
      </div>
    </Panel>
  );
}