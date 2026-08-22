export default function EclatTab({ character }: { character: any }) {
  const parseJsonList = (str: string) => {
    try { return JSON.parse(str || "[]"); } catch { return []; }
  };

  const capacites = parseJsonList(character.capacitesEclat);
  const faveurs = parseJsonList(character.faveurs);

  if (!character.stadeEclat) {
    return (
      <div className="gods:flex gods:items-center gods:justify-center gods:h-full">
        <p className="gods:text-foreground/40 gods:italic gods:text-lg">Cette âme ne possède aucun Éclat (Pacte de Rencontre non scellé).</p>
      </div>
    );
  }

  return (
    <div className="gods:h-full gods:overflow-y-auto gods:p-6 gods:space-y-6 gods:bg-background">
      <div className="gods:flex gods:items-baseline gods:justify-between gods:border-b gods:border-border gods:pb-4">
        <h2 className="gods:font-[family-name:var(--font-display)] gods:text-2xl gods:tracking-widest gods:text-primary">
          Relique d'Éclat
        </h2>
        <span className="gods:font-[family-name:var(--font-display)] gods:text-warning gods:text-xl">Stade {character.stadeEclat}</span>
      </div>

      <div className="gods:grid gods:grid-cols-2 gods:gap-6">
        <div className="gods:space-y-4">
          <div className="gods:bg-card/40 gods:border gods:border-border gods:rounded-lg gods:p-4">
            <h4 className="gods:font-[family-name:var(--font-display)] gods:text-warning gods:tracking-widest gods:uppercase gods:mb-2">Forme & Sphère</h4>
            <p className="gods:text-foreground/80"><strong className="gods:text-foreground">Forme:</strong> {character.formeEclat || "Non définie"}</p>
            <p className="gods:text-foreground/80"><strong className="gods:text-foreground">Sphère:</strong> {character.sphereEclat || "Non définie"}</p>
          </div>
          
          <div className="gods:bg-card/40 gods:border gods:border-border gods:rounded-lg gods:p-4">
            <h4 className="gods:font-[family-name:var(--font-display)] gods:text-warning gods:tracking-widest gods:uppercase gods:mb-2">Apparence</h4>
            <p className="gods:text-foreground/70 gods:italic gods:whitespace-pre-wrap">{character.apparenceEclat || "Aucune description"}</p>
          </div>

          <div className="gods:bg-card/40 gods:border gods:border-border gods:rounded-lg gods:p-4">
            <h4 className="gods:font-[family-name:var(--font-display)] gods:text-warning gods:tracking-widest gods:uppercase gods:mb-2">Embrasement</h4>
            <p className="gods:text-foreground/70 gods:italic gods:whitespace-pre-wrap">{character.embrasementEclat || "Aucune condition définie"}</p>
          </div>
        </div>

        <div className="gods:space-y-6">
          <div>
            <h4 className="gods:font-[family-name:var(--font-display)] gods:text-lg gods:tracking-widest gods:uppercase gods:border-b gods:border-warning/30 gods:pb-2 gods:mb-3">Capacités d'Éclat</h4>
            <ul className="gods:space-y-2">
              {capacites.length > 0 ? capacites.map((c: string, i: number) => (
                <li key={i} className="gods:bg-warning/10 gods:border gods:border-warning/20 gods:rounded gods:px-3 gods:py-2">
                  <span className="gods:text-warning gods:font-bold">✦ {c}</span>
                </li>
              )) : <li className="gods:text-foreground/40 gods:italic">Aucune capacité ralliée</li>}
            </ul>
          </div>

          <div>
            <h4 className="gods:font-[family-name:var(--font-display)] gods:text-lg gods:tracking-widest gods:uppercase gods:border-b gods:border-warning/30 gods:pb-2 gods:mb-3">Faveurs Accordées</h4>
            <div className="gods:space-y-2">
              {faveurs.length > 0 ? faveurs.map((f: string, i: number) => (
                <div key={i} className="gods:bg-card gods:border gods:border-warning/30 gods:rounded gods:p-3">
                  <h5 className="gods:font-[family-name:var(--font-display)] gods:text-warning gods:mb-1">{f}</h5>
                  <p className="gods:text-xs gods:text-foreground/50">Description dans le manuel.</p>
                </div>
              )) : <p className="gods:text-foreground/40 gods:italic">Aucune faveur accordée à cette âme.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}