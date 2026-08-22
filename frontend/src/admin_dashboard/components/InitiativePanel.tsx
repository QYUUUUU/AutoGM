import { Dice5 } from "lucide-react";
import { Button, Select } from "./ui";

interface Props {
  difficulty: string;
  onDifficultyChange: (value: string) => void;
  onRoll: () => void;
}

export function InitiativePanel({
  difficulty,
  onDifficultyChange,
  onRoll,
}: Props) {
  return (
    <div className="gods:flex gods:items-center gods:gap-2 gods:h-9 gods:px-2 gods:border gods:border-border gods:bg-card/30 gods:rounded-md">
      <span className="gods:text-[9px] gods:uppercase gods:tracking-wider gods:text-foreground/30 gods:shrink-0">
        Réaction PNJ
      </span>

      <Select
        value={difficulty}
        onChange={(event) =>
          onDifficultyChange(
            event.target.value,
          )
        }
        className="gods:w-36 gods:py-1 gods:text-[10px]"
      >
        <option value="5">
          Offensif · 5
        </option>
        <option value="7">
          Actif · 7
        </option>
        <option value="9">
          Passif · 9
        </option>
      </Select>

      <Button
        variant="gold"
        className="gods:h-7 gods:ml-auto gods:px-2 gods:text-[10px]"
        onClick={onRoll}
      >
        <Dice5 size={12} />
        Lancer
      </Button>
    </div>
  );
}