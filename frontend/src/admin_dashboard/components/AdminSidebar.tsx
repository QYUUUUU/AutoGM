import { Plus, Sun, Swords, Users, X } from "lucide-react";
import type { ActiveSection, Scene, SceneMap } from "../types/admin";
import { Button, Label } from "./ui";
import { cls } from "../utils/classNames";

interface Props {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;

  scenes: SceneMap;
  sceneId: string;
  onSceneChange: (id: string) => void;
  onNewScene: () => void;
  onDeleteScene: (id: string) => void;

  combatantCount: {
    pcs: number;
    npcs: number;
  };
}

export function AdminSidebar({
  activeSection,
  onSectionChange,
  scenes,
  sceneId,
  onSceneChange,
  onNewScene,
  onDeleteScene,
  combatantCount,
}: Props) {
  return (
    <aside className="gods:w-[220px] gods:shrink-0 gods:border-r gods:border-border gods:bg-card/20 gods:flex gods:flex-col gods:min-h-0">
      {/* Navigation */}
      <div className="gods:p-3 gods:border-b gods:border-border">
        <Label>Navigation MJ</Label>

        <div className="gods:space-y-0.5">
          <button
            type="button"
            onClick={() => onSectionChange("world")}
            className={cls(
              "gods:w-full gods:flex gods:items-center gods:gap-2 gods:px-2.5 gods:py-2 gods:rounded-md gods:text-left gods:text-xs gods:transition-colors",
              activeSection === "world"
                ? "gods:bg-primary/10 gods:text-primary"
                : "gods:text-foreground/50 hover:gods:text-foreground hover:gods:bg-foreground/[.03]",
            )}
          >
            <Sun size={14} />
            Monde & groupe
          </button>

          <button
            type="button"
            onClick={() => onSectionChange("combat")}
            className={cls(
              "gods:w-full gods:flex gods:items-center gods:gap-2 gods:px-2.5 gods:py-2 gods:rounded-md gods:text-left gods:text-xs gods:transition-colors",
              activeSection === "combat"
                ? "gods:bg-primary/10 gods:text-primary"
                : "gods:text-foreground/50 hover:gods:text-foreground hover:gods:bg-foreground/[.03]",
            )}
          >
            <Swords size={14} />
            Scènes & combat
          </button>
        </div>
      </div>

      {/* Scènes */}
      <div className="gods:p-3 gods:flex-1 gods:min-h-0 gods:overflow-y-auto">
        <div className="gods:flex gods:items-center gods:justify-between gods:mb-2">
          <Label>Scènes</Label>

          <span className="gods:text-[10px] gods:text-foreground/30">
            {Object.keys(scenes).length}
          </span>
        </div>

        <div className="gods:space-y-1">
          {Object.entries(scenes).map(
            ([id, scene]: [string, Scene]) => {
              const pcs = scene.combatants.filter(
                (combatant) => combatant.isPC,
              ).length;

              const npcs = scene.combatants.length - pcs;
              const active = id === sceneId;

              return (
                <div
                  key={id}
                  className={cls(
                    "gods:flex gods:items-center gods:gap-1 gods:rounded-md gods:border gods:transition-colors",
                    active
                      ? "gods:border-primary/30 gods:bg-primary/[.07]"
                      : "gods:border-transparent hover:gods:bg-foreground/[.025]",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onSceneChange(id)}
                    className="gods:flex-1 gods:min-w-0 gods:px-2.5 gods:py-2 gods:text-left"
                  >
                    <span
                      className={cls(
                        "gods:block gods:truncate gods:text-xs gods:font-[family-name:var(--font-display)]",
                        active
                          ? "gods:text-primary"
                          : "gods:text-foreground/70",
                      )}
                    >
                      {scene.name}
                    </span>

                    <span className="gods:block gods:mt-0.5 gods:text-[10px] gods:text-foreground/30">
                      {pcs} PJ · {npcs} PNJ
                    </span>
                  </button>

                  {Object.keys(scenes).length > 1 && (
                    <button
                      type="button"
                      onClick={() => onDeleteScene(id)}
                      className="gods:w-7 gods:h-7 gods:mr-1 gods:flex gods:items-center gods:justify-center gods:rounded gods:text-foreground/20 hover:gods:text-destructive hover:gods:bg-destructive/10"
                      title="Supprimer la scène"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              );
            },
          )}
        </div>

        <Button
          className="gods:w-full gods:mt-2 gods:text-xs gods:py-1.5"
          onClick={onNewScene}
        >
          <Plus size={13} />
          Nouvelle scène
        </Button>
      </div>

      {/* Compteur */}
      <div className="gods:p-3 gods:border-t gods:border-border">
        <div className="gods:flex gods:items-center gods:justify-between gods:rounded-md gods:border gods:border-border gods:bg-foreground/[.02] gods:px-2.5 gods:py-2">
          <div className="gods:flex gods:items-center gods:gap-2">
            <Users size={13} className="gods:text-primary/60" />

            <span className="gods:text-[11px] gods:text-foreground/45">
              Participants
            </span>
          </div>

          <span className="gods:text-[10px] gods:font-mono gods:text-foreground/45">
            {combatantCount.pcs} / {combatantCount.npcs}
          </span>
        </div>
      </div>
    </aside>
  );
}