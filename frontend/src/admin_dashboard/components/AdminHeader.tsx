import { Crown } from "lucide-react";
import { Select } from "./ui";
import type { AnyRecord } from "../types/admin";

interface Props {
  groupes: AnyRecord[];
  activeGroupId: string;
  onGroupChange: (id: string) => void;
}

export function AdminHeader({ groupes, activeGroupId, onGroupChange }: Props) {
  return (
    <header className="gods:h-16 gods:shrink-0 gods:border-b gods:border-border gods:bg-card/50 gods:backdrop-blur-md gods:flex gods:items-center gods:justify-between gods:px-5 gods:z-20">
      <div className="gods:flex gods:items-center gods:gap-3">
        <div className="gods:w-9 gods:h-9 gods:rounded-md gods:bg-primary/12 gods:border gods:border-primary/30 gods:flex gods:items-center gods:justify-center gods:text-primary">
          <Crown size={18} />
        </div>
        <div>
          <div className="gods:text-[11px] gods:tracking-[.25em] gods:uppercase gods:text-foreground/45 gods:font-[family-name:var(--font-display)]">GODS · Maître de Jeu</div>
          <h1 className="gods:text-lg gods:font-[family-name:var(--font-display)] gods:tracking-wide">Table de commandement</h1>
        </div>
      </div>

      <div className="gods:flex gods:items-center gods:gap-3">
        <div className="gods:w-64">
          <Select value={activeGroupId} onChange={(event) => onGroupChange(event.target.value)}>
            {groupes.length ? groupes.map(group => <option key={group.id} value={group.id}>{group.nom}</option>) : <option value="">Aucun groupe</option>}
          </Select>
        </div>
        <span className="gods:text-[10px] gods:tracking-[.18em] gods:uppercase gods:border gods:border-border gods:rounded-full gods:px-3 gods:py-1.5 gods:text-foreground/50 gods:font-[family-name:var(--font-display)]">Admin</span>
      </div>
    </header>
  );
}
