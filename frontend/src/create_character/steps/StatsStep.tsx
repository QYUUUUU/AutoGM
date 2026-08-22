const STATS = [
  { key: "puissance", label: "Puissance", desc: "Force, mêlée et potentiel physique." },
  { key: "resistance", label: "Résistance", desc: "Chocs, maladies et survie." },
  { key: "precision", label: "Précision", desc: "Habileté manuelle, armes de tir/jet." },
  { key: "reflexes", label: "Réflexes", desc: "Vitesse de réaction en combat." },
  { key: "connaissance", label: "Connaissance", desc: "Potentiel intellectuel et mémoire." },
  { key: "perception", label: "Perception", desc: "Acuité des sens et observation." },
  { key: "volonte", label: "Volonté", desc: "Contrôle des émotions, sang-froid." },
  { key: "empathie", label: "Empathie", desc: "Détection du mensonge, interactions." },
];

export default function StatsStep({ formData, updateField, bonuses }: any) {
  return (
    <div className="gods:animate-in gods:fade-in gods:duration-500">
      <div className="gods:mb-8">
        <h2 className="gods:text-2xl gods:font-[family-name:var(--font-display)] gods:text-primary gods:tracking-widest gods:uppercase">
          Caractéristiques
        </h2>
        <p className="gods:text-foreground/50 gods:mt-1">Répartissez 8 points supplémentaires. Maximum absolu de 3 par attribut.</p>
      </div>
      
      <div className="gods:grid gods:grid-cols-2 gods:gap-4">
        {STATS.map(stat => {
          const bonus = bonuses[stat.key] || 0;
          const min = Math.max(1, bonus + 1);
          
          return (
            <div key={stat.key} className="gods:flex gods:items-center gods:justify-between gods:bg-card/20 gods:p-4 gods:rounded-lg gods:border gods:border-border hover:gods:border-primary/30 gods:transition-colors">
              <div className="gods:pr-4">
                <label className="gods:block gods:font-[family-name:var(--font-display)] gods:tracking-widest gods:uppercase gods:text-foreground/90 gods:mb-1">{stat.label}</label>
                <p className="gods:text-xs gods:text-foreground/40">{stat.desc}</p>
                {bonus > 0 && <p className="gods:text-[10px] gods:text-warning gods:uppercase gods:tracking-widest gods:mt-1">Bonus Origine Actif (+{bonus})</p>}
              </div>
              
              <select 
                value={formData[stat.key]}
                onChange={(e) => updateField(stat.key, parseInt(e.target.value))}
                className="gods:w-20 gods:shrink-0 gods:bg-input-background gods:border gods:border-border gods:rounded-md gods:px-3 gods:py-2 gods:text-lg gods:text-center gods:text-foreground focus:gods:border-primary/50 gods:outline-none"
              >
                {[1, 2, 3].map(val => (
                  val >= min && <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
}