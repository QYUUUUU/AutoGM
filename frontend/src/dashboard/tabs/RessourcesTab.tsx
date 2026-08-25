import { Plus, Minus } from "lucide-react";

interface Props {
  character: any;
  onUpdate: (field: string, val: any) => void;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="gods:text-xs gods:tracking-widest gods:uppercase gods:text-primary gods:font-display">
      {children}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="gods:text-3xl gods:tracking-wider gods:uppercase gods:text-foreground gods:mt-2 gods:mb-8">
      {children}
    </h2>
  );
}

export default function RessourcesTab({ character, onUpdate }: Props) {
  const updateResource = (field: string, delta: number, max: number) => {
    const current = character[field] || 0;
    const next = Math.max(0, Math.min(max, current + delta));
    onUpdate(field, next);
  };

  const getTechniques = () => {
    const m = character.melee || 0, c = character.cac || 0, t = character.tir || 0;
    const l = character.lancer || 0, b = character.bouclier || 0, d = character.discretion || 0;
    const pui = character.puissance || 1, pre = character.precision || 1, ref = character.reflexes || 1;
    
    const techs = [];
    if (m >= 3 && pre >= 3) techs.push({ n: "Attaque précise", d: "+1D ou +1Dgt (surpris/pris à revers)." });
    if (c >= 3 && d >= 3) techs.push({ n: "Attaque surprise", d: "+1D ou +1Dgt sur la première attaque." });
    if ((m >= 4 || t >= 4) && ref >= 4) techs.push({ n: "Célérité", d: "2 attaques (dont 1 mineure), sans bonus." });
    if ((m >= 3 || c >= 3) && pui >= 3) techs.push({ n: "Charge", d: "+1Dgt, -1D défense." });
    if (m >= 3 && ref >= 3) techs.push({ n: "Combat à deux armes", d: "+1Dgt, relance 1 dé raté." });
    if (m >= 3 || c >= 3) techs.push({ n: "Coup bas", d: "Remplace type de dégâts si désavantageux." });
    if (m >= 3) techs.push({ n: "Finesse", d: "Remplace Pui par Pré pour Dgt de base." });
    if ((m >= 3 || c >= 3) && pui >= 3) techs.push({ n: "Frappe lourde", d: "-1D attaque, +2 Dgt." });
    if ((m >= 3 || b >= 3) && ref >= 3) techs.push({ n: "Parade experte", d: "+1D défense, -1D attaque." });
    if (m >= 3 || c >= 3 || t >= 3 || l >= 3 || b >= 3) techs.push({ n: "Polyvalence", d: "Change le type de dégâts." });
    if (b >= 3 && pui >= 3) techs.push({ n: "Protection protectrice", d: "Remplace Dgt Pui par Bouclier." });
    if (c >= 3 && pui >= 3) techs.push({ n: "Saisie", d: "1 réussite Dgt = entraver la cible." });
    if ((t >= 3 || l >= 3) && ref >= 3) techs.push({ n: "Tir instinctif", d: "Annule les malus de couvert." });
    if ((t >= 3 || l >= 3) && pre >= 3) techs.push({ n: "Tir précis", d: "+1D att, -1Dgt OU -1D att, +2Dgt." });
    if ((t >= 4 || l >= 4) && ref >= 4) techs.push({ n: "Volée", d: "-1D attaque, 2 attaques pour 2 actions." });
    
    return techs;
  };

  const techniques = getTechniques();

  return (
    <div className="gods:h-full gods:overflow-y-auto gods:p-6 gods:lg:p-12 gods:bg-background gods:relative gods:z-10">
      <div className="gods:max-w-6xl gods:mx-auto">
        
        <div className="gods:mb-12">
          <SectionLabel>État</SectionLabel>
          <SectionTitle>Ressources & Combat</SectionTitle>
        </div>

        <div className="gods:grid gods:grid-cols-1 gods:md:grid-cols-2 gods:gap-8 gods:mb-12">
          {/* Effort */}
          <div className="gods:p-8 gods:rounded-lg gods:border gods:border-primary/30 gods:bg-card gods:text-center gods:hover:shadow-md gods:transition-all gods:duration-300">
            <h4 className="gods:text-xl gods:tracking-wider gods:uppercase gods:text-primary gods:mb-6">Effort</h4>
            <div className="gods:flex gods:items-center gods:justify-center gods:gap-6">
              <button onClick={() => updateResource("effort", -1, character.maxeffort || 15)} className="gods:w-12 gods:h-12 gods:rounded-full gods:border gods:border-border gods:flex gods:items-center gods:justify-center hover:gods:bg-background hover:gods:border-primary/50 gods:text-foreground gods:transition-all !gods:outline-none">
                <Minus size={20} />
              </button>
              <span className="gods:text-5xl gods:tracking-wider gods:font-medium gods:font-display gods:text-foreground">
                {character.effort ?? 15} <span className="gods:text-muted-foreground gods:text-2xl">/ {character.maxeffort || 15}</span>
              </span>
              <button onClick={() => updateResource("effort", 1, character.maxeffort || 15)} className="gods:w-12 gods:h-12 gods:rounded-full gods:border gods:border-border gods:flex gods:items-center gods:justify-center hover:gods:bg-background hover:gods:border-primary/50 gods:text-foreground gods:transition-all !gods:outline-none">
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Sang Froid */}
          <div className="gods:p-8 gods:rounded-lg gods:border gods:border-secondary/30 gods:bg-card gods:text-center gods:hover:shadow-md gods:transition-all gods:duration-300">
            <h4 className="gods:text-xl gods:tracking-wider gods:uppercase gods:text-secondary gods:mb-6">Sang Froid</h4>
            <div className="gods:flex gods:items-center gods:justify-center gods:gap-6">
              <button onClick={() => updateResource("sangfroid", -1, character.maxsangfroid || 8)} className="gods:w-12 gods:h-12 gods:rounded-full gods:border gods:border-border gods:flex gods:items-center gods:justify-center hover:gods:bg-background hover:gods:border-secondary/50 gods:text-foreground gods:transition-all !gods:outline-none">
                <Minus size={20} />
              </button>
              <span className="gods:text-5xl gods:tracking-wider gods:font-medium gods:font-display gods:text-foreground">
                {character.sangfroid ?? 8} <span className="gods:text-muted-foreground gods:text-2xl">/ {character.maxsangfroid || 8}</span>
              </span>
              <button onClick={() => updateResource("sangfroid", 1, character.maxsangfroid || 8)} className="gods:w-12 gods:h-12 gods:rounded-full gods:border gods:border-border gods:flex gods:items-center gods:justify-center hover:gods:bg-background hover:gods:border-secondary/50 gods:text-foreground gods:transition-all !gods:outline-none">
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>

        <section>
          <div className="gods:mb-8">
            <SectionLabel>Capacités</SectionLabel>
            <h3 className="gods:text-2xl gods:tracking-wider gods:uppercase gods:text-foreground gods:mt-2">
              Techniques de Combat Débloquées
            </h3>
          </div>
          {techniques.length > 0 ? (
            <div className="gods:grid gods:grid-cols-1 gods:md:grid-cols-2 gods:lg:grid-cols-3 gods:gap-6">
              {techniques.map((t, i) => (
                <div key={i} className="gods:p-6 gods:rounded-lg gods:border gods:border-border gods:bg-card gods:hover:border-primary/40 gods:transition-colors">
                  <h4 className="gods:text-lg gods:text-foreground gods:tracking-wider gods:mb-2">{t.n}</h4>
                  <p className="gods:text-base gods:text-muted-foreground gods:leading-relaxed">{t.d}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="gods:text-base gods:text-muted-foreground gods:italic gods:leading-relaxed">
              Aucune technique de combat débloquée. Augmentez vos compétences (Niv. 3+).
            </p>
          )}
        </section>
      </div>
    </div>
  );
}