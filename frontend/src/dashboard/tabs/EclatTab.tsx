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

export default function EclatTab({ character }: { character: any }) {
  const parseJsonList = (str: string) => {
    try { return JSON.parse(str || "[]"); } catch { return []; }
  };

  const capacites = parseJsonList(character.capacitesEclat);
  const faveurs = parseJsonList(character.faveurs);

  if (!character.stadeEclat) {
    return (
      <div className="gods:flex gods:items-center gods:justify-center gods:h-full gods:bg-background">
        <p className="gods:text-muted-foreground gods:italic gods:text-base">
          Cette âme ne possède aucun Éclat (Pacte de Rencontre non scellé).
        </p>
      </div>
    );
  }

  return (
    <div className="gods:h-full gods:overflow-y-auto gods:p-6 gods:lg:p-12 gods:bg-background gods:relative gods:z-10">
      <div className="gods:max-w-6xl gods:mx-auto">
        
        <div className="gods:mb-12 gods:flex gods:items-baseline gods:justify-between">
          <div>
            <SectionLabel>Héritage Divin</SectionLabel>
            <SectionTitle>Relique d'Éclat</SectionTitle>
          </div>
          <span className="gods:px-4 gods:py-1.5 gods:rounded-full gods:border gods:border-primary/30 gods:bg-primary/5 gods:text-primary gods:font-display gods:text-sm gods:tracking-widest gods:uppercase">
            Stade {character.stadeEclat}
          </span>
        </div>

        <div className="gods:grid gods:grid-cols-1 gods:lg:grid-cols-2 gods:gap-8">
          
          <div className="gods:space-y-6">
            <div className="gods:p-6 gods:xl:p-8 gods:rounded-lg gods:border gods:border-border gods:bg-card">
              <h4 className="gods:text-xl gods:tracking-wider gods:uppercase gods:text-foreground gods:mb-4">Forme & Sphère</h4>
              <p className="gods:text-base gods:text-muted-foreground gods:mb-2">
                <strong className="gods:text-primary gods:font-medium">Forme:</strong> {character.formeEclat || "Non définie"}
              </p>
              <p className="gods:text-base gods:text-muted-foreground">
                <strong className="gods:text-primary gods:font-medium">Sphère:</strong> {character.sphereEclat || "Non définie"}
              </p>
            </div>
            
            <div className="gods:p-6 gods:xl:p-8 gods:rounded-lg gods:border gods:border-border gods:bg-card">
              <h4 className="gods:text-xl gods:tracking-wider gods:uppercase gods:text-foreground gods:mb-4">Apparence</h4>
              <p className="gods:text-base gods:text-muted-foreground gods:leading-relaxed gods:italic gods:whitespace-pre-wrap">
                {character.apparenceEclat || "Aucune description"}
              </p>
            </div>

            <div className="gods:p-6 gods:xl:p-8 gods:rounded-lg gods:border gods:border-border gods:bg-card">
              <h4 className="gods:text-xl gods:tracking-wider gods:uppercase gods:text-foreground gods:mb-4">Embrasement</h4>
              <p className="gods:text-base gods:text-muted-foreground gods:leading-relaxed gods:italic gods:whitespace-pre-wrap">
                {character.embrasementEclat || "Aucune condition définie"}
              </p>
            </div>
          </div>

          <div className="gods:space-y-6">
            <div className="gods:p-6 gods:xl:p-8 gods:rounded-lg gods:border gods:border-primary/30 gods:bg-primary/5">
              <h4 className="gods:text-xl gods:tracking-wider gods:uppercase gods:text-primary gods:mb-6">Capacités d'Éclat</h4>
              <ul className="gods:space-y-3">
                {capacites.length > 0 ? capacites.map((c: string, i: number) => (
                  <li key={i} className="gods:bg-background/80 gods:border gods:border-primary/20 gods:rounded-md gods:px-4 gods:py-3">
                    <span className="gods:text-foreground gods:font-medium gods:text-base">{c}</span>
                  </li>
                )) : (
                  <li className="gods:text-muted-foreground gods:italic">Aucune capacité ralliée</li>
                )}
              </ul>
            </div>

            <div className="gods:p-6 gods:xl:p-8 gods:rounded-lg gods:border gods:border-border gods:bg-card">
              <h4 className="gods:text-xl gods:tracking-wider gods:uppercase gods:text-foreground gods:mb-6">Faveurs Accordées</h4>
              <div className="gods:space-y-3">
                {faveurs.length > 0 ? faveurs.map((f: string, i: number) => (
                  <div key={i} className="gods:bg-background/50 gods:border gods:border-border/50 gods:rounded-md gods:p-4">
                    <h5 className="gods:text-lg gods:tracking-wider gods:text-foreground gods:mb-1">{f}</h5>
                    <p className="gods:text-muted-foreground gods:text-sm">Description dans le manuel.</p>
                  </div>
                )) : (
                  <p className="gods:text-muted-foreground gods:italic">Aucune faveur accordée à cette âme.</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}