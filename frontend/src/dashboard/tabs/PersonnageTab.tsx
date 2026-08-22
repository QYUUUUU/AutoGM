import { originData, instinctData } from "../../create_character/data/characterData"; 
// 👆 IMPORTANT: Ajustez ce chemin selon l'emplacement exact de votre fichier characterData.ts !

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

  // ─── Extraction des descriptions du Lore via Regex (comme l'ancien code) ──
  const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const getLoreDescription = (dataSource: Record<string, any>, sourceKey: string, typePrefix: string, itemName: string) => {
    if (!itemName || itemName === "none" || itemName.startsWith("Aucun")) return null;
    
    // Trouve la bonne clé dans les données (insensible à la casse)
    const entryKey = Object.keys(dataSource).find(k => k.toLowerCase() === sourceKey?.toLowerCase());
    if (!entryKey) return null;

    const data = dataSource[entryKey];
    if (!data || !data.stats) return null;

    // Échappe le nom mais remplace les apostrophes par un joker .? pour éviter les bugs typographiques (' vs ’)
    const safeName = escapeRegExp(itemName).replace(/['’]/g, ".?");
    const regex = new RegExp(`<b>${typePrefix}(?:\\s+|&nbsp;|&#160;|\\u2013|-)*${safeName}\\s*:\\s*<\\/b>(.*?)(?:<br|$)`, 'is');
    
    const match = data.stats.match(regex);
    return match ? match[1].trim() : null;
  };

  const instinctDesc = getLoreDescription(instinctData, character.instinct, "Capacité d'Instinct", character.capaciteInstinct1);
  const avantageDesc = getLoreDescription(originData, character.origine, "Avantage", character.avantage);
  const desavantageDesc = getLoreDescription(originData, character.origine, "Désavantage", character.desavantage);

  return (
    <div className="gods:h-full gods:overflow-y-auto gods:p-6 gods:space-y-8 gods:bg-background gods:animate-in gods:fade-in gods:duration-500">
      
      {/* ─── Instinct Section ────────────────────────────────────────────── */}
      <section>
        <h3 className="gods:font-[family-name:var(--font-display)] gods:text-xl gods:tracking-widest gods:uppercase gods:text-primary gods:mb-4 gods:flex gods:items-center gods:gap-2">
          <span className="gods:text-2xl">◈</span> Capacité d'Instinct
        </h3>
        <div className="gods:bg-card/40 gods:border gods:border-border gods:rounded-lg gods:p-5">
          <div className="gods:flex gods:items-center gods:justify-between gods:border-b gods:border-border/50 gods:pb-3 gods:mb-3">
            <span className="gods:text-foreground/60 gods:uppercase gods:tracking-widest gods:text-sm">Instinct</span>
            <span className="gods:font-bold gods:text-lg">{character.instinct || "Aucun"}</span>
          </div>
          {character.capaciteInstinct1 && character.capaciteInstinct1 !== "none" ? (
            <div>
              <span className="gods:text-primary gods:font-medium gods:block gods:mb-2">{character.capaciteInstinct1}</span>
              {instinctDesc ? (
                <div className="gods:text-sm gods:text-foreground/80 gods:leading-relaxed" dangerouslySetInnerHTML={{ __html: instinctDesc }} />
              ) : (
                <p className="gods:text-foreground/50 gods:text-sm gods:italic">Description introuvable dans les archives.</p>
              )}
            </div>
          ) : (
            <p className="gods:text-foreground/40 gods:italic">Aucune capacité d'instinct sélectionnée.</p>
          )}
        </div>
      </section>

      {/* ─── Origine Section ─────────────────────────────────────────────── */}
      <section>
        <h3 className="gods:font-[family-name:var(--font-display)] gods:text-xl gods:tracking-widest gods:uppercase gods:text-primary gods:mb-4 gods:flex gods:items-center gods:gap-2">
          <span className="gods:text-2xl">⌖</span> Origine
        </h3>
        <p className="gods:text-2xl gods:font-[family-name:var(--font-display)] gods:mb-4">{character.origine || "Aucune"}</p>
        
        <div className="gods:grid gods:grid-cols-2 gods:gap-4">
          
          {/* Avantage */}
          <div className="gods:bg-card/40 gods:border gods:border-[rgba(42,107,82,0.3)] gods:rounded-lg gods:p-4">
            <h4 className="gods:text-[#2A6B52] gods:font-semibold gods:mb-2 gods:uppercase gods:tracking-wider gods:text-xs">Avantage d'origine</h4>
            <p className="gods:text-foreground gods:font-medium gods:mb-2">
              {character.avantage && character.avantage !== "none" ? character.avantage : "Aucun avantage"}
            </p>
            {avantageDesc && (
              <div className="gods:text-sm gods:text-foreground/70 gods:leading-relaxed gods:pt-2 gods:border-t gods:border-[rgba(42,107,82,0.2)]" dangerouslySetInnerHTML={{ __html: avantageDesc }} />
            )}
          </div>

          {/* Désavantage */}
          <div className="gods:bg-card/40 gods:border gods:border-destructive/30 gods:rounded-lg gods:p-4">
            <h4 className="gods:text-destructive gods:font-semibold gods:mb-2 gods:uppercase gods:tracking-wider gods:text-xs">Désavantage d'origine</h4>
            <p className="gods:text-foreground gods:font-medium gods:mb-2">
              {character.desavantage && character.desavantage !== "none" ? character.desavantage : "Aucun désavantage"}
            </p>
            {desavantageDesc && (
              <div className="gods:text-sm gods:text-foreground/70 gods:leading-relaxed gods:pt-2 gods:border-t gods:border-destructive/20" dangerouslySetInnerHTML={{ __html: desavantageDesc }} />
            )}
          </div>

        </div>
      </section>

      {/* ─── Langues & Spécialisations ───────────────────────────────────── */}
      <section className="gods:grid gods:grid-cols-2 gods:gap-6">
        
        {/* Langues */}
        <div className="gods:bg-card/20 gods:border gods:border-border gods:rounded-lg gods:p-5">
          <h4 className="gods:font-[family-name:var(--font-display)] gods:text-lg gods:tracking-widest gods:uppercase gods:border-b gods:border-border gods:pb-2 gods:mb-4 gods:text-primary">Langues</h4>
          <ul className="gods:space-y-2">
            {langues.length > 0 ? langues.map((l: string, i: number) => (
              <li key={i} className="gods:text-foreground/80 gods:flex gods:items-center gods:gap-3 gods:bg-muted/30 gods:px-3 gods:py-2 gods:rounded-md">
                <span className="gods:w-1.5 gods:h-1.5 gods:rounded-full gods:bg-primary/50" /> {l}
              </li>
            )) : <li className="gods:text-foreground/40 gods:italic">Aucune langue spécifiée</li>}
          </ul>
        </div>

        {/* Spécialisations */}
        <div className="gods:bg-card/20 gods:border gods:border-border gods:rounded-lg gods:p-5">
          <h4 className="gods:font-[family-name:var(--font-display)] gods:text-lg gods:tracking-widest gods:uppercase gods:border-b gods:border-border gods:pb-2 gods:mb-4 gods:text-primary">Spécialisations</h4>
          <ul className="gods:space-y-2">
            {specialites.length > 0 ? specialites.map((s: any, i: number) => {
              const comp = s.competence || "Spécialité";
              const spec = s.specialite || s;

              return (
                <li key={i} className="gods:text-foreground/80 gods:flex gods:items-center gods:gap-3 gods:bg-muted/30 gods:px-3 gods:py-2 gods:rounded-md">
                  <span className="gods:w-1.5 gods:h-1.5 gods:rounded-full gods:bg-primary/50 gods:shrink-0" />
                  <div className="gods:flex gods:items-baseline gods:gap-2">
                    <span className="gods:uppercase gods:tracking-widest gods:text-[10px] gods:text-foreground/50">{comp}</span>
                    <span className="gods:font-medium">{spec}</span>
                  </div>
                </li>
              );
            }) : <li className="gods:text-foreground/40 gods:italic">Aucune spécialisation</li>}
          </ul>
        </div>
      </section>

    </div>
  );
}