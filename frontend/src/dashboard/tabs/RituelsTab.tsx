import React from "react";
import { Trash2 } from "lucide-react";
// Assurez-vous d'ajuster le chemin d'import selon l'emplacement exact de votre dossier tabs
import { RITUAL_CATEGORIES } from "../../rituals/data/ritualsData"; 

// ─── Composants de typographie repris de votre design system ───────────────
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

export default function RituelsTab({ character }: { character: any }) {
  // ─── Extraction sécurisée des noms des Rituels ────────────────────────────
  const rituels: string[] = Array.isArray(character?.rituelsMaitrises) 
    ? character.rituelsMaitrises 
    : (typeof character?.rituelsMaitrises === 'string' 
        ? (tryParse(character.rituelsMaitrises) || [])
        : []);

  function tryParse(str: string) {
    try { return JSON.parse(str); } catch { return null; }
  }

  // ─── Recherche des détails d'un rituel et de sa catégorie ─────────────────
  const getRitualDetails = (ritualName: string) => {
    for (const category of RITUAL_CATEGORIES) {
      const found = category.rituals.find(r => r.name === ritualName);
      if (found) {
        return {
          ...found,
          categoryTitle: category.title // Ex: "Rituels de l'Air"
        };
      }
    }
    return null;
  };

  // ─── Suppression d'un rituel ──────────────────────────────────────────────
  const removeRitual = async (ritualName: string) => {
    if (!window.confirm(`Voulez-vous vraiment faire oublier le rituel "${ritualName}" à ce personnage ?`)) return;
    
    try {
      const res = await fetch('/rituels/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          characterId: character.id_Character || character.id, 
          ritualName 
        })
      });
      const data = await res.json();
      
      if (data.success) {
        window.location.reload();
      } else {
        alert("Erreur: " + data.message);
      }
    } catch (err) {
      alert("Une erreur est survenue lors de la suppression.");
    }
  };

  return (
    <div className="gods:h-full gods:overflow-y-auto gods:p-6 gods:lg:p-12 gods:bg-background gods:relative gods:z-10">
      <div className="gods:max-w-6xl gods:mx-auto">
        
        <div className="gods:mb-12">
          <SectionLabel>Grimoire du Personnage</SectionLabel>
          <SectionTitle>Rituels Maîtrisés</SectionTitle>
        </div>

        {rituels.length === 0 ? (
          <p className="gods:text-muted-foreground gods:text-base gods:italic gods:leading-relaxed">
            Aucun rituel maîtrisé pour ce personnage.
          </p>
        ) : (
          <div className="gods:grid gods:grid-cols-1 gods:lg:grid-cols-2 gods:gap-6">
            {rituels.map((ritualName: string, i: number) => {
              const details = getRitualDetails(ritualName);

              return (
                <div key={i} className="gods:p-6 gods:xl:p-8 gods:flex gods:flex-col gods:rounded-lg gods:border gods:border-border gods:bg-card">
                  
                  {/* En-tête de la carte */}
                  <div className="gods:flex gods:items-start gods:justify-between gods:mb-4">
                    <div>
                      <h3 className="gods:text-xl gods:text-foreground gods:tracking-wider gods:pr-4">
                        {ritualName}
                      </h3>
                      {details && (
                        <span className="gods:block gods:text-xs gods:text-muted-foreground gods:uppercase gods:tracking-widest gods:font-display gods:mt-1">
                          {details.categoryTitle}
                        </span>
                      )}
                    </div>
                    {details && (
                      <span className={`gods:shrink-0 gods:text-xs gods:px-2 gods:py-0.5 gods:rounded gods:font-display gods:uppercase gods:tracking-widest gods:border ${
                        details.level.toLowerCase() === 'mineur' 
                          ? 'gods:bg-secondary/5 gods:text-secondary gods:border-secondary/20' 
                          : 'gods:bg-primary/5 gods:text-primary gods:border-primary/20'
                      }`}>
                        {details.level}
                      </span>
                    )}
                  </div>
                  
                  {/* Corps de la carte */}
                  {details ? (
                    <>
                      <p className="gods:text-base gods:text-muted-foreground gods:leading-relaxed gods:mb-8 gods:flex-1">
                        {details.description}
                      </p>

                      {(details.receptacle || details.note) && (
                        <div className="gods:space-y-4 gods:mb-8">
                          {details.receptacle && (
                            <div className="gods:p-4 gods:bg-background/50 gods:border gods:border-border/50 gods:rounded-md">
                              <span className="gods:block gods:text-xs gods:font-display gods:tracking-widest gods:uppercase gods:text-primary gods:mb-1">
                                Réceptacle Courant
                              </span>
                              <p className="gods:text-sm gods:text-muted-foreground">
                                {details.receptacle}
                              </p>
                            </div>
                          )}

                          {details.note && (
                            <p className="gods:text-sm gods:italic gods:text-muted-foreground">
                              <strong className="gods:font-semibold gods:not-italic">Note :</strong> {details.note}
                            </p>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="gods:text-base gods:text-muted-foreground gods:italic gods:mb-8 gods:flex-1">
                      Détails introuvables. Le nom du rituel a peut-être été modifié dans les données.
                    </p>
                  )}

                  {/* Action */}
                  <div className="gods:mt-2">
                    <button 
                      onClick={() => removeRitual(ritualName)}
                      className="gods:flex gods:items-center gods:justify-center gods:gap-2 gods:px-8 gods:py-3 gods:border gods:border-border gods:text-muted-foreground hover:gods:text-destructive hover:gods:border-destructive/35 gods:rounded-md gods:transition-all gods:text-base gods:tracking-wider gods:font-display gods:w-fit !gods:outline-none"
                      title="Oublier ce rituel"
                    >
                      <Trash2 size={15} />
                      Oublier le rituel
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}