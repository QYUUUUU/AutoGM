import HtmlStatsParser from "../utils/HtmlStatsParser";
import { Package } from "lucide-react";

const SKILLS = ['arts', 'cite', 'civilisations', 'relationnel', 'soins', 'animalisme', 'faune', 'montures', 'pistage', 'territoire', 'adresse', 'armurerie', 'artisanat', 'mecanisme', 'runes', 'athletisme', 'discretion', 'flore', 'vigilance', 'voyage', 'bouclier', 'cac', 'lancer', 'melee', 'tir', 'eclats', 'lunes', 'mythes', 'pantheons', 'rituels'];

export default function FinalStep({ formData, updateField, equipmentList, instinctData }: any) {
  const runesVal = parseInt(formData.runes) || 0;
  const numLangues = runesVal === 6 ? 8 : runesVal === 5 ? 6 : runesVal; 
  
  // Debug dans la console du navigateur
  console.log("[DEBUG FinalStep] Valeur de Runes:", runesVal, "=> Nombre de langues autorisées:", numLangues);
  console.log("[DEBUG FinalStep] État actuel des langues dans formData:", formData.langues);
  
  const eligibleSkills = SKILLS.filter(s => parseInt(formData[s]) >= 2);
  console.log("[DEBUG FinalStep] Compétences >= 2 (éligibles spécialités):", eligibleSkills);
  console.log("[DEBUG FinalStep] État actuel des spécialités dans formData:", formData.specialites);

  const availableEquip = equipmentList.filter((i: any) => i.rarity <= 6);
  
  const handleLangue = (i: number, val: string) => {
    const l = [...formData.langues]; 
    l[i+1] = val; 
    console.log("[DEBUG handleLangue] Nouveau tableau des langues:", l);
    updateField("langues", l);
  };

  const handleSpec = (skill: string, val: string) => {
    const s = [...formData.specialites].filter((x: any) => x.competence !== skill);
    if (val.trim()) s.push({ competence: skill, specialite: val });
    console.log("[DEBUG handleSpec] Nouveau tableau des spécialités:", s);
    updateField("specialites", s);
  };

  const toggleEquip = (name: string) => {
    const curr = formData.equipments;
    if (curr.includes(name)) updateField("equipments", curr.filter((x: string) => x !== name));
    else {
      if (curr.length >= 5) return alert("5 objets maximum.");
      updateField("equipments", [...curr, name]);
    }
  };

  return (
    <div className="gods:space-y-8 gods:animate-in gods:fade-in gods:duration-500">
      <div className="gods:grid gods:grid-cols-2 gods:gap-6">
        
        {/* Colonne Gauche: Langues & Spécialisations */}
        <div className="gods:space-y-6">
          <div className="gods:bg-card/20 gods:border gods:border-border gods:rounded-lg gods:p-5">
            <h3 className="gods:font-[family-name:var(--font-display)] gods:text-lg gods:tracking-widest gods:uppercase gods:text-primary gods:mb-1">Langues</h3>
            <p className="gods:text-xs gods:text-foreground/50 gods:mb-4">Vous avez droit à {numLangues} langues supplémentaires (selon votre score en Runes).</p>
            <div className="gods:space-y-2">
              <input type="text" value="Babelite" disabled className="gods:w-full gods:bg-muted/30 gods:border gods:border-border gods:rounded-md gods:px-3 gods:py-2 gods:text-foreground/40 gods:cursor-not-allowed" />
              {Array.from({ length: numLangues }).map((_, i) => (
                <input key={i} type="text" placeholder={`Langue ${i + 1}`} value={formData.langues[i + 1] || ""} onChange={e => handleLangue(i, e.target.value)}
                  className="gods:w-full gods:bg-input-background gods:border gods:border-border gods:rounded-md gods:px-3 gods:py-2 gods:text-foreground focus:gods:border-primary/50 gods:outline-none" />
              ))}
            </div>
          </div>

          <div className="gods:bg-card/20 gods:border gods:border-border gods:rounded-lg gods:p-5">
            <h3 className="gods:font-[family-name:var(--font-display)] gods:text-lg gods:tracking-widest gods:uppercase gods:text-primary gods:mb-1">Spécialisations</h3>
            <p className="gods:text-xs gods:text-foreground/50 gods:mb-4">Une spécialisation par compétence Confirmée (2D) ou plus.</p>
            {eligibleSkills.length === 0 ? <p className="gods:text-sm gods:italic gods:text-foreground/40">Aucune compétence n'a atteint le niveau Confirmé (2D ou plus à l'étape précédente).</p> : (
              <div className="gods:space-y-3">
                {eligibleSkills.map(skill => {
                  const val = formData.specialites.find((s: any) => s.competence === skill)?.specialite || "";
                  return (
                    <div key={skill} className="gods:flex gods:items-center gods:gap-3">
                      <label className="gods:w-1/3 gods:text-xs gods:uppercase gods:tracking-widest gods:text-foreground/70">{skill}</label>
                      <input type="text" placeholder="Spécialité" value={val} onChange={(e) => handleSpec(skill, e.target.value)}
                        className="gods:flex-1 gods:bg-input-background gods:border gods:border-border gods:rounded-md gods:px-3 gods:py-1.5 gods:text-sm gods:text-foreground focus:gods:border-primary/50 gods:outline-none" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Colonne Droite: Équipement & Instinct */}
        <div className="gods:space-y-6">
          <div className="gods:bg-card/20 gods:border gods:border-border gods:rounded-lg gods:p-5 gods:flex gods:flex-col">
            <div className="gods:flex gods:justify-between gods:items-center gods:mb-1">
              <h3 className="gods:font-[family-name:var(--font-display)] gods:text-lg gods:tracking-widest gods:uppercase gods:text-primary">Inventaire</h3>
              <span className={`gods:text-xs gods:font-bold gods:px-2 gods:py-1 gods:rounded ${formData.equipments.length === 5 ? "gods:bg-[#2A6B52]/20 gods:text-[#2A6B52]" : "gods:bg-muted gods:text-foreground/50"}`}>{formData.equipments.length} / 5</span>
            </div>
            <p className="gods:text-xs gods:text-foreground/50 gods:mb-4">Sélectionnez 5 objets. Vous obtenez aussi 15 Sabiirihs d'Argent.</p>
            
            <div className="gods:h-48 gods:overflow-y-auto gods:pr-2 gods:space-y-1 gods:border gods:border-border/50 gods:rounded-md gods:bg-card/10 gods:p-1">
              {availableEquip.map((item: any) => (
                <label key={item.name} className="gods:flex gods:items-center gods:gap-3 gods:p-2 hover:gods:bg-muted/40 gods:rounded gods:cursor-pointer gods:transition-colors gods:group">
                  <div className={`gods:w-4 gods:h-4 gods:rounded gods:border gods:flex gods:items-center gods:justify-center ${formData.equipments.includes(item.name) ? "gods:bg-primary gods:border-primary" : "gods:border-foreground/30 group-hover:gods:border-primary/50"}`}>
                    {formData.equipments.includes(item.name) && <Package size={10} className="gods:text-primary-foreground" />}
                  </div>
                  <input type="checkbox" checked={formData.equipments.includes(item.name)} onChange={() => toggleEquip(item.name)} className="gods:hidden" />
                  <span className="gods:text-sm gods:text-foreground/90">{item.name} <span className="gods:text-[10px] gods:uppercase gods:tracking-widest gods:text-foreground/40 gods:ml-1">({item.type})</span></span>
                </label>
              ))}
            </div>
          </div>

          <div className="gods:bg-card/20 gods:border gods:border-border gods:rounded-lg gods:p-5">
            <h3 className="gods:font-[family-name:var(--font-display)] gods:text-lg gods:tracking-widest gods:uppercase gods:text-primary gods:mb-4">Instinct</h3>
            <select value={formData.instinct} onChange={e => updateField("instinct", e.target.value)}
              className="gods:w-full gods:bg-input-background gods:border gods:border-border gods:rounded-md gods:px-3 gods:py-2 gods:text-foreground focus:gods:border-primary/50 gods:outline-none gods:mb-4">
              {Object.keys(instinctData || {}).map(k => <option key={k} value={k}>{instinctData[k].title}</option>)}
            </select>
            {instinctData[formData.instinct] && (
              <div className="gods:text-sm gods:text-foreground/70 gods:leading-relaxed">
                <HtmlStatsParser rawStats={instinctData[formData.instinct].stats} formData={formData} updateField={updateField} />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}