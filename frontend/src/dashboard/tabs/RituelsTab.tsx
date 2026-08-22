import { Trash2, Droplets } from "lucide-react";
// Assurez-vous d'ajuster le chemin d'import selon l'emplacement exact de votre dossier tabs
import { RITUAL_CATEGORIES } from "../../rituals/data/ritualsData"; 

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
          categoryTitle: category.title // On récupère "Rituels de l'Air", etc.
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
    <div className="gods:h-full gods:overflow-y-auto gods:p-6 gods:bg-background">
      <h2 className="gods:font-[family-name:var(--font-display)] gods:text-2xl gods:tracking-widest gods:uppercase gods:text-primary gods:mb-6 gods:border-b gods:border-border gods:pb-2">
        Rituels Maîtrisés
      </h2>

      {rituels.length === 0 ? (
        <p className="gods:text-foreground/40 gods:italic gods:text-center gods:mt-10">
          Aucun rituel maîtrisé pour ce personnage.
        </p>
      ) : (
        <div className="gods:grid gods:grid-cols-2 gods:gap-6">
          {rituels.map((ritualName: string, i: number) => {
            const details = getRitualDetails(ritualName);

            return (
              <div key={i} className="gods:bg-card gods:border gods:border-border gods:rounded-lg gods:flex gods:flex-col gods:overflow-hidden gods:shadow-sm">
                
                {/* En-tête de la carte */}
                <div className="gods:bg-muted/30 gods:border-b gods:border-border gods:px-4 gods:py-3 gods:flex gods:items-start gods:justify-between">
                  <div className="gods:flex gods:flex-col gods:gap-1">
                    <div className="gods:flex gods:items-center gods:gap-3">
                      <h3 className="gods:font-[family-name:var(--font-display)] gods:text-warning gods:text-lg gods:truncate">
                        {ritualName}
                      </h3>
                      {details && (
                        <span className={`gods:text-[10px] gods:px-1.5 gods:py-0.5 gods:rounded gods:font-[family-name:var(--font-display)] gods:uppercase gods:tracking-widest gods:border ${
                          details.level.toLowerCase() === 'mineur' 
                            ? 'gods:bg-blue-500/10 gods:text-blue-400 gods:border-blue-500/20' 
                            : 'gods:bg-orange-500/10 gods:text-orange-400 gods:border-orange-500/20'
                        }`}>
                          {details.level}
                        </span>
                      )}
                    </div>
                    {/* Affichage de l'Élément (Catégorie) */}
                    {details && (
                      <span className="gods:text-xs gods:text-foreground/50 gods:uppercase gods:tracking-widest">
                        {details.categoryTitle}
                      </span>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => removeRitual(ritualName)}
                    className="gods:text-foreground/40 hover:gods:text-destructive gods:transition-colors gods:-mr-1 gods:p-1 !gods:outline-none"
                    title="Oublier ce rituel"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                {/* Corps de la carte */}
                <div className="gods:p-4 gods:flex-1 gods:flex gods:flex-col gods:gap-4">
                  {details ? (
                    <>
                      <p className="gods:text-sm gods:text-foreground/80 gods:leading-relaxed">
                        {details.description}
                      </p>

                      {details.receptacle && (
                        <div className="gods:bg-background/50 gods:border gods:border-border/50 gods:rounded-md gods:p-3 gods:flex gods:gap-2 gods:mt-auto">
                          <Droplets size={14} className="gods:text-foreground/40 gods:shrink-0 gods:mt-0.5" />
                          <div>
                            <span className="gods:block gods:text-[10px] gods:font-[family-name:var(--font-display)] gods:tracking-widest gods:uppercase gods:text-foreground/50 gods:mb-0.5">
                              Réceptacle Courant
                            </span>
                            <p className="gods:text-xs gods:text-foreground/70 gods:leading-relaxed">
                              {details.receptacle}
                            </p>
                          </div>
                        </div>
                      )}

                      {details.note && (
                        <p className="gods:text-xs gods:italic gods:text-foreground/50">
                          <strong className="gods:font-semibold gods:not-italic">Note :</strong> {details.note}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="gods:text-sm gods:text-foreground/40 gods:italic">
                      Détails introuvables. Le nom du rituel a peut-être été modifié dans les données.
                    </p>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}