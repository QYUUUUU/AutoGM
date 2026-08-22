import { Settings2, Swords } from "lucide-react";
import { cls } from "../utils/classNames";

export type SceneMode = "prepare" | "use";

interface Props {
  sceneName: string;
  mode: SceneMode;
  onModeChange: (mode: SceneMode) => void;
  combatantCount: number;
}

export function SceneTabs({
  sceneName,
  mode,
  onModeChange,
  combatantCount,
}: Props) {
  return (
    <div className="gods:flex gods:items-center gods:justify-between gods:gap-3 gods:border-b gods:border-border gods:pb-2">
      <div className="gods:min-w-0">
        <div className="gods:text-[10px] gods:uppercase gods:tracking-[.16em] gods:text-foreground/30">
          Scène
        </div>

        <div className="gods:flex gods:items-baseline gods:gap-2 gods:min-w-0">
          <h2 className="gods:truncate gods:text-lg gods:font-[family-name:var(--font-display)] gods:text-foreground/90">
            {sceneName}
          </h2>

          <span className="gods:shrink-0 gods:text-[10px] gods:text-foreground/30">
            {combatantCount} participant
            {combatantCount > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="gods:flex gods:items-center gods:gap-0.5 gods:shrink-0 gods:rounded-md gods:border gods:border-border gods:bg-foreground/[.02] gods:p-0.5">
        <button
          type="button"
          onClick={() => onModeChange("prepare")}
          className={cls(
            "gods:inline-flex gods:items-center gods:gap-1.5 gods:h-7 gods:px-2.5 gods:rounded gods:text-[11px] gods:font-medium gods:transition-colors",
            mode === "prepare"
              ? "gods:bg-primary/10 gods:text-primary"
              : "gods:text-foreground/40 hover:gods:text-foreground/70",
          )}
        >
          <Settings2 size={12} />
          Préparation
        </button>

        <button
          type="button"
          onClick={() => onModeChange("use")}
          className={cls(
            "gods:inline-flex gods:items-center gods:gap-1.5 gods:h-7 gods:px-2.5 gods:rounded gods:text-[11px] gods:font-medium gods:transition-colors",
            mode === "use"
              ? "gods:bg-primary/10 gods:text-primary"
              : "gods:text-foreground/40 hover:gods:text-foreground/70",
          )}
        >
          <Swords size={12} />
          Utilisation
        </button>
      </div>
    </div>
  );
}