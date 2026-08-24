import { originData, instinctData } from "../../create_character/data/characterData"; 

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

export default function PersonnageTab({ character }: { character: any }) {
  // ─── Extraction sécurisée des listes ──────────────────────────────────────
  const getSafeList = (data: any) => {
    if (!data) return [];
    if (Array.isArray(data)) return data; 
    if (typeof data === 'string') {
      try { return JSON.parse(data); } catch { return []; }
    }
    return [];
  };

  const langues = getSafeList(character.langues);
  const specialites = getSafeList(character.specialites);

  // ─── Extraction des descriptions du Lore via Regex ────────────────────────
  const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const getLoreDescription = (dataSource: Record<string, any>, sourceKey: string, typePrefix: string, itemName: string) => {
    if (!itemName || itemName === "none" || itemName.startsWith("Aucun")) return null;
    
    // Trouve la bonne clé dans les données (insensible à la casse)
    const entryKey = Object.keys(dataSource).find(k => k.toLowerCase() === sourceKey?.toLowerCase());
    if (!entryKey) return null;

    const data = dataSource[entryKey];
    if (!data || !data.stats) return null;

    // Échappe le nom mais remplace les apostrophes par un joker .? pour éviter les bugs typographiques
    const safeName = escapeRegExp(itemName).replace(/['’]/g, ".?");
    const regex = new RegExp(`<b>${typePrefix}(?:\\s+|&nbsp;|&#160;|\\u2013|-)*${safeName}\\s*:\\s*<\\/b>(.*?)(?:<br|$)`, 'is');
    
    const match = data.stats.match(regex);
    return match ? match[1].trim() : null;
  };

  const instinctDesc = getLoreDescription(instinctData, character.instinct, "Capacité d'Instinct", character.capaciteInstinct1);
  const avantageDesc = getLoreDescription(originData, character.origine, "Avantage", character.avantage);
  const desavantageDesc = getLoreDescription(originData, character.origine, "Désavantage", character.desavantage);

  return (
    <div className="gods:h-full gods:overflow-y-auto gods:p-6 gods:lg:p-12 gods:bg-background gods:relative gods:z-10">
      <div className="gods:max-w-6xl gods:mx-auto">
        
        <div className="gods:mb-12">
          <SectionLabel>Dossier</SectionLabel>
          <SectionTitle>Profil du Personnage</SectionTitle>
        </div>

        <div className="gods:grid gods:grid-cols-1 gods:lg:grid-cols-2 gods:gap-8">
          
          {/* Instinct */}
          <section className="gods:p-6 gods:xl:p-8 gods:rounded-lg gods:border gods:border-border gods:bg-card">
            <h3 className="gods:text-xl gods:tracking-wider gods:uppercase gods:text-foreground gods:mb-6">
              Instinct
            </h3>
            <div className="gods:mb-6 gods:flex gods:items-center gods:justify-between gods:border-b gods:border-border/50 gods:pb-4">
              <span className="gods:text-primary gods:uppercase gods:tracking-widest gods:text-xs gods:font-display">Type d'Instinct</span>
              <span className="gods:font-bold gods:text-xl gods:tracking-wider">{character.instinct || "Aucun"}</span>
            </div>
            {character.capaciteInstinct1 && character.capaciteInstinct1 !== "none" ? (
              <div>
                <span className="gods:text-primary gods:text-lg gods:font-medium gods:block gods:mb-3">{character.capaciteInstinct1}</span>
                {instinctDesc ? (
                  <div className="gods:text-base gods:text-muted-foreground gods:leading-relaxed" dangerouslySetInnerHTML={{ __html: instinctDesc }} />
                ) : (
                  <p className="gods:text-muted-foreground gods:text-base gods:italic">Description introuvable dans les archives.</p>
                )}
              </div>
            ) : (
              <p className="gods:text-muted-foreground gods:text-base gods:italic">Aucune capacité d'instinct sélectionnée.</p>
            )}
          </section>

          {/* Origine */}
          <section className="gods:p-6 gods:xl:p-8 gods:rounded-lg gods:border gods:border-border gods:bg-card">
            <h3 className="gods:text-xl gods:tracking-wider gods:uppercase gods:text-foreground gods:mb-2">
              Origine
            </h3>
            <p className="gods:text-3xl gods:tracking-wider gods:font-display gods:text-primary gods:mb-6">{character.origine || "Aucune"}</p>
            
            <div className="gods:space-y-6">
              <div className="gods:p-4 gods:rounded-md gods:border gods:border-primary/20 gods:bg-primary/5">
                <h4 className="gods:text-primary gods:mb-2 gods:uppercase gods:tracking-widest gods:text-xs gods:font-display">Avantage</h4>
                <p className="gods:text-foreground gods:text-base gods:font-medium gods:mb-2">
                  {character.avantage && character.avantage !== "none" ? character.avantage : "Aucun avantage"}
                </p>
                {avantageDesc && (
                  <div className="gods:text-sm gods:text-muted-foreground gods:leading-relaxed gods:pt-2 gods:border-t gods:border-primary/10" dangerouslySetInnerHTML={{ __html: avantageDesc }} />
                )}
              </div>
              <div className="gods:p-4 gods:rounded-md gods:border gods:border-destructive/20 gods:bg-destructive/5">
                <h4 className="gods:text-destructive gods:mb-2 gods:uppercase gods:tracking-widest gods:text-xs gods:font-display">Désavantage</h4>
                <p className="gods:text-foreground gods:text-base gods:font-medium gods:mb-2">
                  {character.desavantage && character.desavantage !== "none" ? character.desavantage : "Aucun désavantage"}
                </p>
                {desavantageDesc && (
                  <div className="gods:text-sm gods:text-muted-foreground gods:leading-relaxed gods:pt-2 gods:border-t gods:border-destructive/10" dangerouslySetInnerHTML={{ __html: desavantageDesc }} />
                )}
              </div>
            </div>
          </section>

          {/* Langues */}
          <section className="gods:p-6 gods:xl:p-8 gods:rounded-lg gods:border gods:border-border gods:bg-card">
             <h3 className="gods:text-xl gods:tracking-wider gods:uppercase gods:text-foreground gods:mb-6">Langues</h3>
             <ul className="gods:space-y-3">
              {langues.length > 0 ? langues.map((l: string, i: number) => (
                <li key={i} className="gods:text-foreground gods:text-base gods:flex gods:items-center gods:gap-3 gods:bg-background/50 gods:border gods:border-border/50 gods:px-4 gods:py-2.5 gods:rounded-md">
                  <span className="gods:w-1.5 gods:h-1.5 gods:rounded-full gods:bg-primary" /> {l}
                </li>
              )) : <li className="gods:text-muted-foreground gods:text-base gods:italic">Aucune langue spécifiée</li>}
            </ul>
          </section>

          {/* Spécialisations */}
          <section className="gods:p-6 gods:xl:p-8 gods:rounded-lg gods:border gods:border-border gods:bg-card">
             <h3 className="gods:text-xl gods:tracking-wider gods:uppercase gods:text-foreground gods:mb-6">Spécialisations</h3>
             <ul className="gods:space-y-3">
              {specialites.length > 0 ? specialites.map((s: any, i: number) => {
                const comp = s.competence || "Spécialité";
                const spec = s.specialite || s;
                return (
                  <li key={i} className="gods:text-foreground gods:text-base gods:flex gods:items-center gods:gap-3 gods:bg-background/50 gods:border gods:border-border/50 gods:px-4 gods:py-2.5 gods:rounded-md">
                    <span className="gods:w-1.5 gods:h-1.5 gods:rounded-full gods:bg-primary gods:shrink-0" />
                    <div className="gods:flex gods:items-baseline gods:gap-2">
                      <span className="gods:uppercase gods:tracking-widest gods:text-xs gods:font-display gods:text-primary">{comp}</span>
                      <span className="gods:font-medium gods:text-base">{spec}</span>
                    </div>
                  </li>
                );
              }) : <li className="gods:text-muted-foreground gods:text-base gods:italic">Aucune spécialisation</li>}
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}