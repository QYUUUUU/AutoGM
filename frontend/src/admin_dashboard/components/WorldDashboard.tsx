import { BookOpen, Moon, Save, Sun } from "lucide-react";
import type { SaveState, WorldState, AnyRecord } from "../types/admin";
import { AKHAT_STATES, DAY_TIMES, SINLA_PHASES, WEEK_TYPES } from "../utils/constants";
import { Button, Field, Label, Panel, Select, inputClass } from "./ui";

interface Props {
  world: WorldState;
  groupes: AnyRecord[];
  activeGroupId: string;
  saveState: SaveState;
  onChange: (field: string, value: any) => void;
  onSave: () => void;
}

export function WorldDashboard({ world, saveState, onChange, onSave }: Props) {
  const statusText = saveState === "saving" ? "Sauvegarde…" : saveState === "saved" ? "✓ Sauvegardé" : saveState === "error" ? "Erreur" : "État du monde";

  return (
    <div className="gods:max-w-[1500px] gods:mx-auto gods:space-y-5">
      <div className="gods:flex gods:items-end gods:justify-between">
        <div>
          <Label>État de la partie</Label>
          <h2 className="gods:text-2xl gods:font-[family-name:var(--font-display)] gods:tracking-wide">Monde & groupe</h2>
          <p className="gods:text-sm gods:text-foreground/45 gods:mt-1">Les contrôles de la partie sont regroupés dans une même vue opérationnelle.</p>
        </div>
        <Button variant="primary" onClick={onSave} disabled={saveState === "saving"}><Save size={15} /> {statusText}</Button>
      </div>

      <div className="gods:grid gods:grid-cols-1 xl:gods:grid-cols-2 gods:gap-5">
        <Panel title="Astrologie & calendrier" icon={<Sun size={16} />}>
          <div className="gods:grid gods:grid-cols-1 md:gods:grid-cols-[1fr_1.25fr_.65fr] gods:gap-3">
            <Field label="Temps"><Select value={world.timeOfDay || "Aube"} onChange={e => onChange("timeOfDay", e.target.value)}>{DAY_TIMES.map(value => <option key={value}>{value}</option>)}</Select></Field>
            <Field label="Mois / semaine"><Select value={world.weekType || "Eau"} onChange={e => onChange("weekType", e.target.value)}>{WEEK_TYPES.map(value => <option key={value}>{value === "Eau" ? "Semaine d'Eau" : value === "Feu" ? "Semaine de Feu" : "Semaine de Sang"}</option>)}</Select></Field>
            <Field label="Jour"><input type="number" min={1} max={7} value={world.dayNumber ?? 1} onChange={e => onChange("dayNumber", e.target.value)} className={inputClass} /></Field>
          </div>

          <div className="gods:my-5 gods:border-t gods:border-border" />

          <div className="gods:grid gods:grid-cols-1 md:gods:grid-cols-2 gods:gap-3">
            <Field label="Sinla · Lune d'argent"><Select value={world.sinlaPhase || "Nouvelle"} onChange={e => onChange("sinlaPhase", e.target.value)}>{SINLA_PHASES.map(value => <option key={value}>{value}</option>)}</Select></Field>
            <Field label="Akhat · Lune sombre"><Select value={world.akhatState || "Eteinte"} onChange={e => onChange("akhatState", e.target.value)}>{AKHAT_STATES.map(value => <option key={value}>{value}</option>)}</Select></Field>
          </div>

          <div className="gods:mt-5 gods:flex gods:items-center gods:gap-3 gods:text-sm gods:text-foreground/45"><Moon size={15} /> Pleine lune Sinla : bonus d'incantation · Akhat funeste : prédateurs enragés</div>
        </Panel>

        <Panel title="Groupe & règles" icon={<BookOpen size={16} />}>
          <div className="gods:space-y-4">
            <Field label="Lois et coutumes · région actuelle">
              <textarea rows={4} value={world.loisCoutumes || ""} onChange={e => onChange("loisCoutumes", e.target.value)} placeholder="Interdiction du port de symboles impériaux…" className={`${inputClass} gods:resize-y`} />
            </Field>
            <div className="gods:grid gods:grid-cols-1 md:gods:grid-cols-2 gods:gap-3">
              <Field label="Rations · jours"><input type="number" min={0} value={world.rations ?? 0} onChange={e => onChange("rations", e.target.value)} className={inputClass} /></Field>
              <Field label="État des montures"><input value={world.etatMontures || ""} onChange={e => onChange("etatMontures", e.target.value)} placeholder="Reposées, épuisées…" className={inputClass} /></Field>
            </div>
            <Field label="Encombrement du matériel"><textarea rows={3} value={world.encombrement || ""} onChange={e => onChange("encombrement", e.target.value)} className={`${inputClass} gods:resize-y`} /></Field>
          </div>
        </Panel>
      </div>

      <Panel title="Résumé opérationnel" icon={<BookOpen size={16} />}>
        <div className="gods:grid gods:grid-cols-2 md:gods:grid-cols-4 gods:gap-3">
          {[
            ["Temps", world.timeOfDay || "—"],
            ["Semaine", world.weekType || "—"],
            ["Jour", world.dayNumber || "—"],
            ["Rations", `${world.rations ?? 0} j`],
          ].map(([label, value]) => (
            <div key={label} className="gods:border gods:border-border gods:rounded-md gods:p-3"><Label>{label}</Label><div className="gods:text-lg gods:font-[family-name:var(--font-display)]">{value}</div></div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
