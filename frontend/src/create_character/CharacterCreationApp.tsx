import { useState } from "react";
import { User, Activity, BookOpen, CheckCircle, ChevronRight, AlertCircle, Check } from "lucide-react";
import { validateCharacter } from "./utils/characterValidation";
import IdentityStep from "./steps/IdentityStep";
import StatsStep from "./steps/StatsStep";
import SkillsStep from "./steps/SkillsStep";
import FinalStep from "./steps/FinalStep";

const STEPS = [
  { id: 1, label: "Identité & Origine", icon: User },
  { id: 2, label: "Caractéristiques", icon: Activity },
  { id: 3, label: "Compétences", icon: BookOpen },
  { id: 4, label: "Finitions", icon: CheckCircle },
];

export default function CharacterCreationApp({ equipmentList, originData, signData, instinctData }: any) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    nom: "", age: "", genre: "homme", avatar_preset: "/images/characters/homme/homme-1.jpg", imageData: "",
    signeastro: "Loup", origine: "Aon", origin_advantage: "none", origin_disadvantage: "none", origin_bonus_skill: "none", instinct_capacite: "none",
    puissance: 1, resistance: 1, precision: 1, reflexes: 1, connaissance: 1, perception: 1, volonte: 1, empathie: 1,
    arts: 0, cite: 0, civilisations: 0, relationnel: 0, soins: 0,
    adresse: 0, armurerie: 0, artisanat: 0, mecanisme: 0, runes: 0,
    bouclier: 0, cac: 0, lancer: 0, melee: 0, tir: 0,
    animalisme: 0, faune: 0, montures: 0, pistage: 0, territoire: 0,
    athletisme: 0, discretion: 0, flore: 0, vigilance: 0, voyage: 0,
    eclats: 0, lunes: 0, mythes: 0, pantheons: 0, rituels: 0,
    langues: ["Babelite"], specialites: [], equipments: [],
    instinct: "architecte"
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const validation = validateCharacter(formData);
  const canSubmit = validation.isCharValid && validation.isSkillValid && formData.nom.trim() !== "";

const handleSubmit = async () => {
    if (!canSubmit) return;
    
    const cleanLangues = formData.langues.filter((l: string) => l && l.trim() !== "");

    const payload = {
      ...formData,
      avatar: formData.avatar_preset,
      avantage: formData.origin_advantage,
      desavantage: formData.origin_disadvantage,
      capaciteInstinct1: formData.instinct_capacite,
      langues: JSON.stringify(cleanLangues),
      specialites: JSON.stringify(formData.specialites)
    };

    console.log("[DEBUG handleSubmit] Payload final envoyé à /create-character :", payload);

    try {
      const res = await fetch('/create-character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        console.log("[DEBUG handleSubmit] Succès de la création !");
        window.location.href = '/characters';
      } else {
        console.error("[DEBUG handleSubmit] Erreur HTTP:", res.status, res.statusText);
        alert("Erreur lors de la création du personnage.");
      }
    } catch (error) {
      console.error("[DEBUG handleSubmit] Erreur réseau:", error);
    }
  };

  return (
    <div className="gods:min-h-screen gods:bg-background gods:text-foreground gods:font-[family-name:var(--font-body)] gods:pt-24 gods:pb-8 gods:px-4 md:gods:px-8">
      
      {/* Texture de grain de papier par-dessus le fond */}
      <div aria-hidden className="gods:pointer-events-none gods:fixed gods:inset-0 gods:z-[500] gods:mix-blend-multiply gods:opacity-[0.055]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='pn'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23pn)'/%3E%3C/svg%3E")` }} />

      {/* Conteneur principal de l'application */}
      <div className="gods:max-w-7xl gods:mx-auto gods:h-[calc(100vh-8rem)] gods:flex gods:gap-6 gods:relative gods:z-10">
        
        {/* ── SIDEBAR ─────────────────────────────────────────────── */}
        <aside className="gods:w-72 gods:shrink-0 gods:flex gods:flex-col gods:bg-card/60 gods:border gods:border-border gods:rounded-xl gods:overflow-hidden gods:shadow-xl">
          <div className="gods:p-6 gods:border-b gods:border-border gods:bg-card/40">
            <h1 className="gods:font-[family-name:var(--font-display)] gods:text-2xl gods:tracking-widest gods:uppercase gods:text-foreground">
              Création
            </h1>
            <p className="gods:text-sm gods:text-foreground/50 gods:mt-1">Forger une nouvelle âme</p>
          </div>

          {/* Menu des étapes */}
          <nav className="gods:flex-1 gods:p-4 gods:space-y-2 gods:overflow-y-auto">
            {STEPS.map((s) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isCompleted = step > s.id;
              return (
                <button key={s.id} onClick={() => setStep(s.id)}
                  className={`gods:w-full gods:flex gods:items-center gods:justify-between gods:px-3 gods:py-3 gods:rounded-md gods:transition-all !gods:outline-none ${
                    isActive 
                      ? "gods:bg-primary/10 gods:text-primary gods:border gods:border-primary/30" 
                      : "gods:text-foreground/60 hover:gods:bg-muted hover:gods:text-foreground gods:border gods:border-transparent"
                  }`}>
                  <div className="gods:flex gods:items-center gods:gap-3">
                    <Icon size={18} className={isActive ? "gods:text-primary" : isCompleted ? "gods:text-[#2A6B52]" : ""} />
                    <span className="gods:font-[family-name:var(--font-display)] gods:tracking-wide gods:text-base">{s.label}</span>
                  </div>
                  {isActive && <ChevronRight size={16} className="gods:text-primary" />}
                </button>
              );
            })}
          </nav>

          {/* Tracker de Validation */}
          <div className="gods:p-5 gods:border-t gods:border-border gods:bg-card/40">
            <p className="gods:text-xs gods:tracking-[0.2em] gods:uppercase gods:text-foreground/50 gods:font-[family-name:var(--font-display)] gods:mb-4">
              Progression
            </p>
            
            <div className="gods:space-y-4">
              <div>
                <div className="gods:flex gods:items-center gods:justify-between gods:text-sm gods:mb-1">
                  <span className="gods:text-foreground/80">Caractéristiques</span>
                  <span className={`gods:font-bold ${validation.isCharValid ? "gods:text-[#2A6B52]" : "gods:text-warning"}`}>
                    {validation.charDistributed} / 8
                  </span>
                </div>
                {validation.charMaxExceeded && <div className="gods:text-xs gods:text-destructive gods:flex gods:items-center gods:gap-1 gods:mt-1"><AlertCircle size={12}/> Max 3D / carac</div>}
                {validation.charDistributed > 8 && <div className="gods:text-xs gods:text-destructive gods:flex gods:items-center gods:gap-1 gods:mt-1"><AlertCircle size={12}/> Trop de points</div>}
              </div>

              <div>
                <div className="gods:flex gods:items-center gods:justify-between gods:text-sm gods:mb-1">
                  <span className="gods:text-foreground/80">Compétences</span>
                  <span className={`gods:font-bold ${validation.isSkillValid ? "gods:text-[#2A6B52]" : "gods:text-warning"}`}>
                    {validation.skillSum} / 13
                  </span>
                </div>
                {!validation.dominationValid && <div className="gods:text-xs gods:text-warning gods:flex gods:items-center gods:gap-1 gods:mt-1"><AlertCircle size={12}/> Bases requises (1x3D, 2x2D, 3x1D)</div>}
                {validation.skillMaxExceeded && <div className="gods:text-xs gods:text-destructive gods:flex gods:items-center gods:gap-1 gods:mt-1"><AlertCircle size={12}/> Max 3D / comp</div>}
              </div>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ────────────────────────────────────────── */}
        <main className="gods:flex-1 gods:flex gods:flex-col gods:bg-card/20 gods:border gods:border-border gods:rounded-xl gods:overflow-hidden gods:shadow-xl">
          <div className="gods:flex-1 gods:overflow-y-auto gods:p-8">
            <div className="gods:max-w-4xl gods:mx-auto">
              
              {step === 1 && <IdentityStep formData={formData} updateField={updateField} originData={originData} signData={signData} />}
              {step === 2 && <StatsStep formData={formData} updateField={updateField} bonuses={validation.bonusStats} />}
              {step === 3 && <SkillsStep formData={formData} updateField={updateField} bonuses={validation.bonusSkills} />}
              {step === 4 && <FinalStep formData={formData} updateField={updateField} equipmentList={equipmentList} instinctData={instinctData} />}
              
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="gods:shrink-0 gods:border-t gods:border-border gods:bg-card/40 gods:p-4 gods:flex gods:justify-between gods:items-center">
            <button 
              disabled={step === 1} 
              onClick={() => setStep(step - 1)}
              className="gods:flex gods:items-center gods:gap-2 gods:px-5 gods:py-2.5 gods:text-foreground/60 hover:gods:text-foreground gods:transition-colors disabled:gods:opacity-30 !gods:outline-none"
            >
              Précédent
            </button>
            
            {step < 4 ? (
              <button 
                onClick={() => setStep(step + 1)}
                className="gods:px-8 gods:py-2.5 gods:bg-primary gods:text-primary-foreground gods:rounded-md gods:tracking-wider gods:font-[family-name:var(--font-display)] hover:gods:bg-primary/85 gods:transition-all !gods:outline-none shadow-md"
              >
                Suivant
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="gods:flex gods:items-center gods:gap-2 gods:px-8 gods:py-2.5 gods:bg-[#2A6B52] gods:text-white gods:rounded-md gods:tracking-wider gods:font-[family-name:var(--font-display)] disabled:gods:opacity-35 disabled:gods:cursor-not-allowed hover:gods:bg-[#2A6B52]/85 gods:transition-all !gods:outline-none shadow-md"
              >
                <Check size={18} /> Forger l'âme
              </button>
            )}
          </div>
        </main>

      </div>
    </div>
  );
}