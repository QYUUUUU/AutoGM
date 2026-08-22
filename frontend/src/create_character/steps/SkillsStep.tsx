import { useState } from "react";

const SKILL_GROUPS = [
  { id: "homme", title: "L'Homme", skills: ["arts", "cite", "civilisations", "relationnel", "soins"] },
  { id: "outil", title: "L'Outil", skills: ["adresse", "armurerie", "artisanat", "mecanisme", "runes"] },
  { id: "arme", title: "L'Arme", skills: ["bouclier", "cac", "lancer", "melee", "tir"] },
  { id: "animal", title: "L'Animal", skills: ["animalisme", "faune", "montures", "pistage", "territoire"] },
  { id: "sauvage", title: "Terres Sauvages", skills: ["athletisme", "discretion", "flore", "vigilance", "voyage"] },
  { id: "inconnu", title: "L'Inconnu", skills: ["eclats", "lunes", "mythes", "pantheons", "rituels"] }
];

export default function SkillsStep({ formData, updateField, bonuses }: any) {
  const [activeTab, setActiveTab] = useState("homme");

  return (
    <div className="gods:animate-in gods:fade-in gods:duration-500">
      <div className="gods:mb-6">
        <h2 className="gods:text-2xl gods:font-[family-name:var(--font-display)] gods:text-primary gods:tracking-widest gods:uppercase">
          Compétences
        </h2>
        <p className="gods:text-foreground/50 gods:mt-1">Répartissez 13 points (un 3D, deux 2D, trois 1D au minimum).</p>
      </div>
      
      {/* Navigation Interne : Style exact calqué sur le Dashboard */}
      <div className="gods:flex gods:border-b gods:border-border gods:mb-6 gods:overflow-x-auto">
        {SKILL_GROUPS.map(group => (
          <button 
            key={group.id} 
            onClick={() => setActiveTab(group.id)}
            style={{ outline: 'none', boxShadow: 'none', WebkitTapHighlightColor: 'transparent' }}
            className={`!gods:outline-none !gods:ring-0 focus:!gods:outline-none focus:!gods:ring-0 active:!gods:outline-none gods:px-5 gods:py-3 gods:text-sm gods:whitespace-nowrap gods:font-[family-name:var(--font-display)] gods:tracking-wider gods:transition-all gods:border-0 gods:border-b-2 ${
              activeTab === group.id
                ? "gods:border-b-primary gods:text-primary gods:bg-transparent"
                : "gods:border-b-transparent gods:text-foreground/55 hover:gods:text-foreground hover:gods:border-b-foreground/20 gods:bg-transparent"
            }`}
          >
            {group.title}
          </button>
        ))}
      </div>

      {/* Grille de Compétences */}
      <div className="gods:grid gods:grid-cols-2 gods:gap-4">
        {SKILL_GROUPS.find(g => g.id === activeTab)?.skills.map(name => {
          const bonus = bonuses[name] || 0;
          const val = formData[name];
          
          return (
            <div key={name} className="gods:flex gods:items-center gods:justify-between gods:bg-card/20 gods:p-4 gods:rounded-lg gods:border gods:border-border hover:gods:border-primary/30 gods:transition-colors">
              <div>
                <label className="gods:block gods:font-[family-name:var(--font-display)] gods:tracking-widest gods:uppercase gods:text-foreground/90">{name}</label>
                {bonus > 0 && <p className="gods:text-[10px] gods:text-warning gods:uppercase gods:tracking-widest gods:mt-1">Bonus Actif (+{bonus})</p>}
              </div>
              <select 
                value={val} onChange={(e) => updateField(name, parseInt(e.target.value))}
                className="gods:w-36 gods:shrink-0 gods:bg-input-background gods:border gods:border-border gods:rounded-md gods:px-3 gods:py-2 gods:text-sm gods:text-foreground focus:gods:border-primary/50 gods:outline-none !gods:outline-none focus:!gods:outline-none focus:!gods:ring-0"
              >
                {[0, 1, 2, 3].map(v => (
                  v >= bonus && <option key={v} value={v}>{v === 0 ? "Ignorant" : v === 1 ? "Débutant (1D)" : v === 2 ? "Confirmé (2D)" : "Expert (3D)"}</option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
}