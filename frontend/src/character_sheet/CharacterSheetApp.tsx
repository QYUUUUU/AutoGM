import React, { useState, useRef, useCallback, Fragment } from "react";
import { Camera, Loader2, Check, Plus, Minus } from "lucide-react";
import { updateCharacterField, fileToDataUrl } from "./api";

// ─── Types ──────────────────────────────────────────────────────────────────

interface SkillDef { key: string; label: string; }

// ─── Constants ──────────────────────────────────────────────────────────────

const CARACTERISTIQUES = [
  { group: "Physique", key: "puissance",    label: "Puissance" },
  { group: "Manuel",   key: "precision",    label: "Précision" },
  { group: "Social",   key: "connaissance", label: "Connaissance" },
  { group: "Mental",   key: "volonte",      label: "Volonté" },
  { group: "Physique", key: "resistance",   label: "Résistance" },
  { group: "Manuel",   key: "reflexes",     label: "Réflexes" },
  { group: "Social",   key: "perception",   label: "Perception" },
  { group: "Mental",   key: "empathie",     label: "Empathie" },
];

const CARAC_MALUS = [
  { key: "malusphysique", label: "Physique" },
  { key: "malusmanuel",   label: "Manuel" },
  { key: "malussocial",   label: "Social" },
  { key: "malusmental",   label: "Mental" },
];

const SKILL_GROUPS: {
  title: string;
  malusLeftKey: string; malusLeftLabel: string;
  malusRightKey: string; malusRightLabel: string;
  rows: [SkillDef, SkillDef][];
}[] = [
  {
    title: "L'Humain / L'Animal",
    malusLeftKey: "malushumain", malusLeftLabel: "Malus Humain",
    malusRightKey: "malusanimal", malusRightLabel: "Malus Animal",
    rows: [
      [{ key: "arts", label: "Arts" }, { key: "animalisme", label: "Animalisme" }],
      [{ key: "cite", label: "Cité" }, { key: "faune", label: "Faune" }],
      [{ key: "civilisations", label: "Civilisations" }, { key: "montures", label: "Montures" }],
      [{ key: "relationnel", label: "Relationnel" }, { key: "pistage", label: "Pistage" }],
      [{ key: "soins", label: "Soins" }, { key: "territoire", label: "Territoire" }],
    ],
  },
  {
    title: "L'Outil / Terres Sauvages",
    malusLeftKey: "malusoutils", malusLeftLabel: "Malus Outils",
    malusRightKey: "malusterres", malusRightLabel: "Malus Terres",
    rows: [
      [{ key: "adresse", label: "Adresse" }, { key: "athletisme", label: "Athlétisme" }],
      [{ key: "armurerie", label: "Armurerie" }, { key: "discretion", label: "Discrétion" }],
      [{ key: "artisanat", label: "Artisanat" }, { key: "flore", label: "Flore" }],
      [{ key: "mecanisme", label: "Mécanisme" }, { key: "vigilance", label: "Vigilance" }],
      [{ key: "runes", label: "Runes" }, { key: "voyage", label: "Voyage" }],
    ],
  },
  {
    title: "L'Arme / L'Inconnu",
    malusLeftKey: "malusarme", malusLeftLabel: "Malus Arme",
    malusRightKey: "malusinconnu", malusRightLabel: "Malus Inconnu",
    rows: [
      [{ key: "bouclier", label: "Bouclier" }, { key: "eclats", label: "Éclats" }],
      [{ key: "cac", label: "Corps à corps" }, { key: "lunes", label: "Lunes" }],
      [{ key: "lancer", label: "Lancer" }, { key: "mythes", label: "Mythes" }],
      [{ key: "melee", label: "Mêlée" }, { key: "pantheons", label: "Panthéons" }],
      [{ key: "tir", label: "Tir" }, { key: "rituels", label: "Rituels" }],
    ],
  },
];

const INJURY_CONFIG = [
  { key: "blessurelegere",   label: "Légères",   maxKey: "maxblessurelegere",   defaultMax: 5, activeColor: "gods:bg-amber-500 gods:border-amber-500" },
  { key: "blessuregrave",    label: "Sérieuses", maxKey: "maxblessuregrave",    defaultMax: 3, activeColor: "gods:bg-orange-600 gods:border-orange-600" },
  { key: "blessuremortelle", label: "Mortelles", maxKey: "maxblessuremortelle", defaultMax: 2, activeColor: "gods:bg-destructive gods:border-destructive" },
];

const RESERVE_CONFIG = [
  { key: "effort",    label: "Effort",     maxKey: "maxeffort",    defaultMax: 5 },
  { key: "sangfroid", label: "Sang-Froid", maxKey: "maxsangfroid", defaultMax: 5 },
];

// ─── UI Helpers ─────────────────────────────────────────────────────────────

function PipTrack({
  value, max, onChange, activeColor = "gods:bg-primary", showLevelName = false,
}: { value: number; max: number; onChange: (v: number) => void; activeColor?: string; showLevelName?: boolean }) {
  const SKILL_LEVELS = ["Ignorant", "Débutant", "Confirmé", "Expert", "Maître", "Légendaire"];
  const safeValue = Math.max(0, Math.min(value || 0, max));
  const levelName = SKILL_LEVELS[Math.min(safeValue, SKILL_LEVELS.length - 1)] || "Ignorant";
  return (
    <div className="gods:flex gods:items-center gods:gap-3 gods:shrink-0 gods:min-w-0" aria-label={`Valeur ${safeValue} sur ${max}`}>
      <div className="gods:flex gods:items-center gods:gap-2 gods:shrink-0">
        {Array.from({ length: max }).map((_, i) => (
          <button key={i} type="button" aria-label={`Fixer à ${i + 1}`} onClick={() => onChange(safeValue === i + 1 ? i : i + 1)}
            className={`gods:w-3.5 gods:h-3.5 gods:shrink-0 gods:rotate-45 gods:border gods:p-0 gods:transition-all hover:gods:scale-110 ${i < safeValue ? `${activeColor} gods:border-current` : "gods:bg-transparent gods:border-border hover:gods:border-foreground/50"}`} />
        ))}
      </div>
      {showLevelName ? <span className="gods:min-w-[5.8rem] gods:text-sm gods:font-[family-name:var(--font-display)] gods:tracking-wide gods:text-foreground/65 gods:whitespace-nowrap">{levelName}</span>
        : <span className="gods:min-w-5 gods:text-sm gods:font-semibold gods:tabular-nums gods:text-foreground/70 gods:text-center">{safeValue}</span>}
    </div>
  );
}

function CapacityStepper({ onIncrement, onDecrement }: { onIncrement: () => void; onDecrement: () => void }) {
  return (
    <div className="gods:flex gods:gap-1 gods:ml-2">
      <button type="button" onClick={onDecrement} className="gods:text-foreground/30 hover:gods:text-foreground gods:transition-colors !gods:outline-none">
        <Minus size={10} strokeWidth={3} />
      </button>
      <button type="button" onClick={onIncrement} className="gods:text-foreground/30 hover:gods:text-foreground gods:transition-colors !gods:outline-none">
        <Plus size={10} strokeWidth={3} />
      </button>
    </div>
  );
}

function AutoField({
  value, onCommit, placeholder, className = "", numeric = false, textCenter = false
}: { value: string | number; onCommit: (v: string) => void; placeholder?: string; className?: string; numeric?: boolean; textCenter?: boolean }) {
  const [local, setLocal] = useState(value === null || value === undefined ? "" : String(value));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const next = value === null || value === undefined ? "" : String(value);
    if (next !== local) setLocal(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const scheduleCommit = (v: string) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onCommit(v), 600);
  };

  return (
    <input
      type={numeric ? "number" : "text"}
      value={local}
      placeholder={placeholder}
      onChange={(e) => { setLocal(e.target.value); scheduleCommit(e.target.value); }}
      onBlur={() => { if (timer.current) clearTimeout(timer.current); onCommit(local); }}
      className={`gods:h-10 gods:bg-input-background gods:border gods:border-border/70 gods:rounded-md gods:px-3 gods:py-1 gods:text-base gods:text-foreground gods:shadow-sm placeholder:gods:text-foreground/30 hover:gods:border-foreground/25 focus:gods:outline-none focus:gods:border-primary/60 focus:gods:ring-2 focus:gods:ring-primary/10 gods:transition-all ${textCenter ? "gods:text-center" : ""} ${className}`}
    />
  );
}

function SignedIntField({
  value, onCommit, className = ""
}: { value: string | number | null | undefined; onCommit: (v: string) => void; className?: string }) {
  const initial = value === null || value === undefined || value === "" ? "0" : String(value);
  const [local, setLocal] = useState(initial);

  React.useEffect(() => {
    const next = value === null || value === undefined || value === "" ? "0" : String(value);
    if (/^-?\d+$/.test(next)) setLocal(next);
  }, [value]);

  const commit = (raw: string) => {
    if (raw === "" || raw === "-") return;
    if (!/^-?\d+$/.test(raw)) return;
    onCommit(raw);
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      aria-label="Malus"
      value={local}
      onChange={(e) => {
        const next = e.target.value;
        if (/^-?\d*$/.test(next)) setLocal(next);
      }}
      onBlur={() => commit(local)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
        }
      }}
      className={`gods:h-10 gods:w-16 gods:bg-input-background gods:border gods:border-border/70 gods:rounded-md gods:px-2 gods:text-base gods:font-semibold gods:text-foreground gods:text-center gods:shadow-sm hover:gods:border-foreground/25 focus:gods:outline-none focus:gods:border-primary/60 focus:gods:ring-2 focus:gods:ring-primary/10 gods:transition-all ${className}`}
    />
  );
}

function DSLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`gods:text-base gods:tracking-[0.14em] gods:uppercase gods:text-foreground/80 gods:font-[family-name:var(--font-display)] gods:font-semibold gods:border-b gods:border-border/50 gods:pb-1.5 gods:mb-3 ${className}`}>
      {children}
    </h2>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function CharacterSheetApp({ initialCharacter }: { initialCharacter: any }) {
  const [character, setCharacter] = useState<any>(initialCharacter);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const charId = character.id_Character || character.id;

  const commitField = useCallback((field: string, value: any) => {
    setSaveStatus("saving");
    setCharacter((prev: any) => ({ ...prev, [field]: value }));
    updateCharacterField(charId, field, value)
      .catch(() => {})
      .finally(() => setSaveStatus("saved"));
  }, [charId]);

  const getAvatar = () => {
    if (character?.avatar && character.avatar.trim() !== "") return character.avatar;
    const genre = character?.genre || "homme";
    return `/images/characters/${genre}/${genre}-1.jpg`;
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      setCharacter((prev: any) => ({ ...prev, avatar: dataUrl })); 
      const resData = await updateCharacterField(charId, "avatar", dataUrl);
      if (resData?.avatar) setCharacter((prev: any) => ({ ...prev, avatar: resData.avatar }));
    } catch (err) { console.error(err); } 
    finally {
      setAvatarUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const charInitial = character?.nom ? character.nom.charAt(0).toUpperCase() : "?";

  return (
    <div className="gods:box-border gods:h-full gods:min-h-0 gods:flex gods:flex-col gods:bg-background gods:text-foreground gods:font-[family-name:var(--font-body)] gods:overflow-hidden">
      <div aria-hidden className="gods:h-16 gods:shrink-0" />

      {/* ── MAIN AREA: Dense Mechanical Grid ───────────────────────────── */}
      <main className="gods:flex-1 gods:min-h-0 gods:overflow-y-auto gods:px-6 gods:py-8 lg:gods:px-10 lg:gods:py-10 gods:relative">
        <div className="gods:max-w-6xl gods:mx-auto gods:pb-10">
          <header className="gods:mb-9 gods:border-b gods:border-border gods:pb-5">
            <p className="gods:text-sm gods:font-[family-name:var(--font-display)] gods:tracking-[0.2em] gods:uppercase gods:text-primary gods:mb-2">Fiche de personnage</p>
            <div className="gods:flex gods:flex-wrap gods:items-end gods:justify-between gods:gap-4">
              <div>
                <h1 className="gods:font-[family-name:var(--font-display)] gods:text-3xl lg:gods:text-4xl gods:tracking-wide gods:text-foreground">{character.nom || "Personnage"}</h1>
                <p className="gods:text-base gods:text-foreground/55 gods:mt-2">Caractéristiques, compétences, santé et réserves</p>
              </div>
              <span className={`gods:flex gods:items-center gods:gap-2 gods:text-sm gods:font-[family-name:var(--font-display)] ${saveStatus === "saved" ? "gods:text-[#2A6B52]" : "gods:text-foreground/45"}`}>
                {saveStatus === "saved" ? <Check size={14} /> : <Loader2 size={14} className="gods:animate-spin" />}
                {saveStatus === "saved" ? "Sauvegardé" : "Sauvegarde…"}
              </span>
            </div>
          </header>

          <section className="gods:bg-card gods:border gods:border-border gods:rounded-lg gods:p-5 lg:gods:p-6 gods:mb-6">
            <div className="gods:flex gods:flex-col sm:gods:flex-row gods:items-center gods:gap-6">
              <button
                onClick={() => fileInputRef.current?.click()}
                type="button"
                className="gods:group gods:relative gods:w-40 gods:h-40 gods:shrink-0 gods:p-0 gods:m-0 gods:rounded-xl gods:overflow-hidden gods:border gods:border-border hover:gods:border-primary/50 gods:bg-background gods:shadow-sm gods:transition-colors"
              >
                {character?.avatar || character?.genre ? (
                  <img
                    src={getAvatar()}
                    alt="Avatar"
                    className="gods:block gods:w-full gods:h-full gods:max-w-none gods:object-cover gods:object-center"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <div className="gods:w-full gods:h-full gods:flex gods:items-center gods:justify-center gods:text-4xl gods:font-[family-name:var(--font-display)] gods:text-foreground/25">{charInitial}</div>
                )}
                <div className="gods:absolute gods:inset-0 gods:flex gods:items-center gods:justify-center gods:bg-background/65 gods:opacity-0 group-hover:gods:opacity-100 gods:transition-opacity">
                  {avatarUploading ? <Loader2 size={18} className="gods:text-primary gods:animate-spin" /> : <Camera size={18} className="gods:text-primary" />}
                </div>
              </button>
              <input ref={fileInputRef} type="file" accept="image/png, image/jpeg, image/webp" className="gods:hidden" onChange={handleAvatarChange} />

              <div
                className="gods:flex-1 gods:min-w-0 gods:grid gods:gap-x-6 gods:gap-y-4 gods:content-center gods:items-center"
                style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gridTemplateRows: "repeat(2, minmax(0, auto))" }}
              >
                {[
                  { key: "nom", label: "Nom", placeholder: "Nom du personnage", emphasis: true },
                  { key: "origine", label: "Origine" },
                  { key: "instinct", label: "Instinct" },
                  { key: "genre", label: "Genre" },
                  { key: "signeastro", label: "Signe astrologique" },
                  { key: "age", label: "Âge" },
                ].map((f) => (
                  <div key={f.key} className="gods:min-w-0 gods:flex gods:items-center gods:gap-3 gods:min-h-10">
                    <label className="gods:shrink-0 gods:text-sm gods:tracking-[0.1em] gods:uppercase gods:text-foreground/50 gods:font-[family-name:var(--font-display)]">{f.label}</label>
                    <AutoField
                      value={character[f.key] || ""}
                      onCommit={(v) => commitField(f.key, v)}
                      placeholder={f.placeholder}
                      className={`gods:min-w-0 gods:flex-1 ${f.emphasis ? "!gods:text-xl gods:font-[family-name:var(--font-display)] gods:text-primary" : "!gods:text-lg gods:font-medium"}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="gods:grid gods:grid-cols-1 lg:gods:grid-cols-12 gods:gap-7">
          

            {/* Column 1: Caractéristiques */}
            <div className="lg:gods:col-span-5 gods:space-y-5">
              <section>
                <DSLabel>Caractéristiques</DSLabel>

                <div className="gods:grid gods:grid-cols-1 xl:gods:grid-cols-2 gods:gap-4">
                  {[
                    { title: "Physique & Manuel", groups: ["Physique", "Manuel"] },
                    { title: "Social & Mental", groups: ["Social", "Mental"] },
                  ].map((island) => (
                    <div key={island.title} className="gods:bg-card/25 gods:border gods:border-border/50 gods:rounded-lg gods:p-5">
                      <h3 className="gods:text-sm gods:font-[family-name:var(--font-display)] gods:tracking-[0.16em] gods:uppercase gods:text-foreground/45 gods:mb-4">{island.title}</h3>
                      <div className="gods:grid gods:grid-cols-2 gods:gap-x-7 gods:gap-y-5">
                        {island.groups.map((group) => (
                          <div key={group} className="gods:min-w-0">
                            <div className="gods:text-xs gods:font-[family-name:var(--font-display)] gods:tracking-[0.18em] gods:uppercase gods:text-primary/80 gods:mb-3 gods:pb-1.5 gods:border-b gods:border-border/40">{group}</div>
                            <div className="gods:space-y-3">
                              {CARACTERISTIQUES.filter(c => c.group === group).map((c) => (
                                <div key={c.key} className="gods:flex gods:items-center gods:justify-between gods:gap-3 gods:min-w-0">
                                  <span className="gods:text-base gods:font-medium gods:text-foreground/85 gods:truncate">{c.label}</span>
                                  <PipTrack value={character[c.key] || 0} max={5} onChange={(v) => commitField(c.key, v)} />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="gods:mt-4 gods:pt-4 gods:border-t gods:border-border/50">
                  <p className="gods:text-sm gods:tracking-[0.12em] gods:uppercase gods:text-foreground/50 gods:mb-3">Malus de conditions</p>
                  <div className="gods:grid gods:grid-cols-2 gods:gap-x-6 gods:gap-y-3">
                    {CARAC_MALUS.map((m) => (
                      <div key={m.key} className="gods:flex gods:items-center gods:gap-3">
                        <span className="gods:text-base gods:text-foreground/65 gods:min-w-0">{m.label}</span>
                        <SignedIntField value={character[m.key]} onCommit={(v) => commitField(m.key, Number(v))} />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Column 2: Compétences */}
            <div className="lg:gods:col-span-4">
              <DSLabel>Compétences</DSLabel>
              <div className="gods:space-y-4">
                {SKILL_GROUPS.map((group) => (
                  <div key={group.title} className="gods:bg-card/20 gods:p-5 gods:pb-6 gods:rounded-lg gods:border gods:border-border/40 gods:shadow-sm">
                    <h3 className="gods:text-sm gods:tracking-[0.14em] gods:uppercase gods:text-foreground/55 gods:font-[family-name:var(--font-display)] gods:mb-4 gods:text-center">
                      {group.title}
                    </h3>
                    
                    <div className="gods:grid gods:grid-cols-1 gods:gap-y-3">
                      {group.rows.map(([left, right]) => (
                        <Fragment key={`${left.key}-${right.key}`}>
                          <div className="gods:flex gods:items-center gods:justify-between gods:gap-4 gods:border-b gods:border-border/30 gods:pb-2 gods:group">
                            <span className="gods:text-lg gods:text-foreground/75 group-hover:gods:text-foreground gods:transition-colors">{left.label}</span>
                            <PipTrack value={character[left.key] || 0} max={6} showLevelName onChange={(v) => commitField(left.key, v)} />
                          </div>
                          <div className="gods:flex gods:items-center gods:justify-between gods:gap-4 gods:border-b gods:border-border/30 gods:pb-2 gods:group">
                            <span className="gods:text-lg gods:text-foreground/75 group-hover:gods:text-foreground gods:transition-colors">{right.label}</span>
                            <PipTrack value={character[right.key] || 0} max={6} showLevelName onChange={(v) => commitField(right.key, v)} />
                          </div>
                        </Fragment>
                      ))}
                    </div>

                    <div className="gods:grid gods:grid-cols-2 gods:gap-4 gods:mt-3 gods:pt-3 gods:border-t gods:border-border/40">
                      <div className="gods:flex gods:items-center gods:justify-between">
                        <span className="gods:text-xs gods:uppercase gods:tracking-wider gods:text-foreground/40">{group.malusLeftLabel}</span>
                        <SignedIntField value={character[group.malusLeftKey]} onCommit={(v) => commitField(group.malusLeftKey, Number(v))} />
                      </div>
                      <div className="gods:flex gods:items-center gods:justify-between">
                        <span className="gods:text-xs gods:uppercase gods:tracking-wider gods:text-foreground/40">{group.malusRightLabel}</span>
                        <SignedIntField value={character[group.malusRightKey]} onCommit={(v) => commitField(group.malusRightKey, Number(v))} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Santé & Réserves (Span 4) */}
            <div className="lg:gods:col-span-3 gods:space-y-5">
              <section>
                <DSLabel>Santé & Réserves</DSLabel>
                <div className="gods:space-y-4">
                  
                  {/* Blessures */}
                  <div className="gods:bg-destructive/5 gods:border gods:border-destructive/10 gods:p-5 gods:rounded-lg">
                    <p className="gods:text-xs gods:tracking-widest gods:uppercase gods:text-destructive/70 gods:font-bold gods:mb-3">Blessures</p>
                    <div className="gods:space-y-4">
                      {INJURY_CONFIG.map((inj) => {
                        const max = character[inj.maxKey] ?? inj.defaultMax;
                        return (
                          <div key={inj.key} className="gods:flex gods:items-center gods:gap-4">
                            <span className="gods:text-lg gods:text-foreground/75 gods:font-medium">{inj.label}</span>
                            <div className="gods:flex gods:items-center">
                              <PipTrack value={character[inj.key] || 0} max={max} activeColor={inj.activeColor} onChange={(v) => commitField(inj.key, v)} />
                              <CapacityStepper onIncrement={() => commitField(inj.maxKey, max + 1)} onDecrement={() => commitField(inj.maxKey, Math.max(0, max - 1))} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Réserves */}
                  <div className="gods:bg-primary/5 gods:border gods:border-primary/10 gods:p-5 gods:rounded-lg">
                    <p className="gods:text-xs gods:tracking-widest gods:uppercase gods:text-primary/70 gods:font-bold gods:mb-3">Jauges</p>
                    <div className="gods:space-y-4">
                      {RESERVE_CONFIG.map((r) => {
                        const max = character[r.maxKey] ?? r.defaultMax;
                        return (
                          <div key={r.key} className="gods:flex gods:items-center gods:gap-4">
                            <span className="gods:text-lg gods:text-foreground/75 gods:font-medium">{r.label}</span>
                            <div className="gods:flex gods:items-center">
                              <PipTrack value={character[r.key] || 0} max={max} onChange={(v) => commitField(r.key, v)} />
                              <CapacityStepper onIncrement={() => commitField(r.maxKey, max + 1)} onDecrement={() => commitField(r.maxKey, Math.max(0, max - 1))} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </section>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
