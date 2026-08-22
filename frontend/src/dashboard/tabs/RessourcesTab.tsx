import { Plus, Minus } from "lucide-react";

interface Props {
  character: any;
  onUpdate: (field: string, val: any) => void;
}

export default function RessourcesTab({ character, onUpdate }: Props) {
  const updateResource = (field: string, delta: number, max: number) => {
    const current = character[field] || 0;
    const next = Math.max(0, Math.min(max, current + delta));
    onUpdate(field, next);
  };

  // Logique des techniques de combat traduite depuis Twig
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
    <div className="gods:h-full gods:overflow-y-auto gods:p-6 gods:space-y-8 gods:bg-background">
      <div className="gods:grid gods:grid-cols-2 gods:gap-6">
        
        {/* Effort */}
        <div className="gods:bg-card/40 gods:border gods:border-warning/30 gods:rounded-lg gods:p-5 gods:text-center">
          <h4 className="gods:text-xl gods:tracking-wider gods:uppercase gods:text-warning gods:mb-4">Effort</h4>
          <div className="gods:flex gods:items-center gods:justify-center gods:gap-4">
            <button onClick={() => updateResource("effort", -1, character.maxeffort || 15)} className="gods:w-10 gods:h-10 gods:rounded-full gods:border gods:border-border gods:flex gods:items-center gods:justify-center hover:gods:bg-muted gods:transition-colors">
              <Minus size={18} />
            </button>
            <span className="gods:text-3xl gods:tracking-wider gods:font-bold gods:font-display gods:min-w-[4rem]">
              {character.effort ?? 15} <span className="gods:text-muted-foreground gods:text-xl">/ {character.maxeffort || 15}</span>
            </span>
            <button onClick={() => updateResource("effort", 1, character.maxeffort || 15)} className="gods:w-10 gods:h-10 gods:rounded-full gods:border gods:border-border gods:flex gods:items-center gods:justify-center hover:gods:bg-muted gods:transition-colors">
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Sang Froid */}
        <div className="gods:bg-card/40 gods:border gods:border-info/30 gods:rounded-lg gods:p-5 gods:text-center">
          <h4 className="gods:text-xl gods:tracking-wider gods:uppercase gods:text-info gods:mb-4">Sang Froid</h4>
          <div className="gods:flex gods:items-center gods:justify-center gods:gap-4">
            <button onClick={() => updateResource("sangfroid", -1, character.maxsangfroid || 8)} className="gods:w-10 gods:h-10 gods:rounded-full gods:border gods:border-border gods:flex gods:items-center gods:justify-center hover:gods:bg-muted gods:transition-colors">
              <Minus size={18} />
            </button>
            <span className="gods:text-3xl gods:tracking-wider gods:font-bold gods:font-display gods:min-w-[4rem]">
              {character.sangfroid ?? 8} <span className="gods:text-muted-foreground gods:text-xl">/ {character.maxsangfroid || 8}</span>
            </span>
            <button onClick={() => updateResource("sangfroid", 1, character.maxsangfroid || 8)} className="gods:w-10 gods:h-10 gods:rounded-full gods:border gods:border-border gods:flex gods:items-center gods:justify-center hover:gods:bg-muted gods:transition-colors">
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Techniques de combat */}
      <section>
        <h3 className="gods:text-xl gods:tracking-wider gods:uppercase gods:text-foreground gods:border-b gods:border-border gods:pb-2 gods:mb-4">
          Techniques de Combat Débloquées
        </h3>
        {techniques.length > 0 ? (
          <div className="gods:grid gods:grid-cols-2 gods:gap-4">
            {techniques.map((t, i) => (
              <div key={i} className="gods:bg-card/20 gods:border gods:border-border gods:rounded-md gods:p-3">
                <span className="gods:text-base gods:text-primary gods:font-semibold gods:block">{t.n}</span>
                <span className="gods:text-base gods:text-muted-foreground">{t.d}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="gods:text-base gods:text-muted-foreground gods:italic">Aucune technique de combat débloquée. Augmentez vos compétences (Niv. 3+).</p>
        )}
      </section>
    </div>
  );
}