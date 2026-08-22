export default function EclatTab({ character }: { character: any }) {
  const parseJsonList = (str: string) => {
    try { return JSON.parse(str || "[]"); } catch { return []; }
  };

  const capacites = parseJsonList(character.capacitesEclat);
  const faveurs = parseJsonList(character.faveurs);

  if (!character.stadeEclat) {
    return (
      <div className="gods:flex gods:items-center gods:justify-center gods:h-full">
        <p className="gods:text-muted-foreground gods:italic gods:text-base">
          Cette âme ne possède aucun Éclat (Pacte de Rencontre non scellé).
        </p>
      </div>
    );
  }

  return (
    <div className="gods:h-full gods:overflow-y-auto gods:p-6 gods:space-y-6 gods:bg-background">
      <div className="gods:flex gods:items-baseline gods:justify-between gods:border-b gods:border-border gods:pb-4">
        {/* h2 receives font-display automatically from your base layer */}
        <h2 className="gods:text-3xl gods:tracking-wider gods:uppercase gods:text-primary">
          Relique d'Éclat
        </h2>
        {/* span needs explicit font-display since it's not a heading tag */}
        <span className="gods:font-display gods:text-xl gods:tracking-wider gods:text-primary">
          Stade {character.stadeEclat}
        </span>
      </div>

      <div className="gods:grid gods:grid-cols-2 gods:gap-6">
        <div className="gods:space-y-4">
          <div className="gods:bg-card/40 gods:border gods:border-border gods:rounded-lg gods:p-4">
            <h4 className="gods:text-xl gods:tracking-wider gods:uppercase gods:text-primary gods:mb-2">
              Forme & Sphère
            </h4>
            <p className="gods:text-muted-foreground gods:text-base">
              <strong className="gods:text-foreground">Forme:</strong> {character.formeEclat || "Non définie"}
            </p>
            <p className="gods:text-muted-foreground gods:text-base">
              <strong className="gods:text-foreground">Sphère:</strong> {character.sphereEclat || "Non définie"}
            </p>
          </div>
          
          <div className="gods:bg-card/40 gods:border gods:border-border gods:rounded-lg gods:p-4">
            <h4 className="gods:text-xl gods:tracking-wider gods:uppercase gods:text-primary gods:mb-2">
              Apparence
            </h4>
            <p className="gods:text-muted-foreground gods:italic gods:text-base gods:whitespace-pre-wrap">
              {character.apparenceEclat || "Aucune description"}
            </p>
          </div>

          <div className="gods:bg-card/40 gods:border gods:border-border gods:rounded-lg gods:p-4">
            <h4 className="gods:text-xl gods:tracking-wider gods:uppercase gods:text-primary gods:mb-2">
              Embrasement
            </h4>
            <p className="gods:text-muted-foreground gods:italic gods:text-base gods:whitespace-pre-wrap">
              {character.embrasementEclat || "Aucune condition définie"}
            </p>
          </div>
        </div>

        <div className="gods:space-y-6">
          <div>
            <h4 className="gods:text-xl gods:tracking-wider gods:uppercase gods:border-b gods:border-primary/30 gods:pb-2 gods:mb-3 gods:text-primary">
              Capacités d'Éclat
            </h4>
            <ul className="gods:space-y-2">
              {capacites.length > 0 ? capacites.map((c: string, i: number) => (
                <li key={i} className="gods:bg-primary/10 gods:border gods:border-primary/20 gods:rounded gods:px-3 gods:py-2">
                  <span className="gods:text-primary gods:font-medium gods:text-base">✦ {c}</span>
                </li>
              )) : (
                <li className="gods:text-muted-foreground gods:italic gods:text-base">
                  Aucune capacité ralliée
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="gods:text-xl gods:tracking-wider gods:uppercase gods:border-b gods:border-primary/30 gods:pb-2 gods:mb-3 gods:text-primary">
              Faveurs Accordées
            </h4>
            <div className="gods:space-y-2">
              {faveurs.length > 0 ? faveurs.map((f: string, i: number) => (
                <div key={i} className="gods:bg-card gods:border gods:border-primary/30 gods:rounded gods:p-3">
                  {/* Swapped from h5 to h4 to leverage base layer fonts, styled as a standard card title */}
                  <h4 className="gods:text-xl gods:tracking-wider gods:text-primary gods:mb-1">
                    {f}
                  </h4>
                  <p className="gods:text-muted-foreground gods:text-base">
                    Description dans le manuel.
                  </p>
                </div>
              )) : (
                <p className="gods:text-muted-foreground gods:italic gods:text-base">
                  Aucune faveur accordée à cette âme.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}