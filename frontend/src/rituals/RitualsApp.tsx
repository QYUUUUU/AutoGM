import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { 
  BookOpen,
  Wind,
  PawPrint,
  Droplets,
  Flame,
  Skull,
  Combine,
  Moon,
  Sun,
  Mountain,
  HeartPulse,
  X,
  Plus,
  Trash2,
  Info,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { RITUAL_CATEGORIES, RitualCategory, Ritual } from "./data/ritualsData";

// Define the Icon mapping to resolve strings to Lucide components
const IconMap: Record<string, React.FC<any>> = {
  Wind,
  PawPrint,
  Droplets,
  Flame,
  Skull,
  Combine,
  BookOpen,
  Moon,
  Sun,
  Mountain,
  HeartPulse,
};

// Reusable typography components based on the new landing page design
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="gods:text-xs gods:tracking-widest gods:uppercase gods:text-secondary gods:font-display">
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

export default function RitualsApp({ characters }: { characters: any[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("rules");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeData = RITUAL_CATEGORIES.find(c => c.id === activeCategory);

  const openModal = (ritual: Ritual) => {
    setSelectedRitual(ritual);
    setIsModalOpen(true);
    setSelectedCharacter(characters[0]?.id_Character || characters[0]?.id || "");
  };

  const handleAction = async (actionType: "add" | "remove") => {
    if (!selectedCharacter || !selectedRitual) {
      alert("Veuillez sélectionner un personnage.");
      return;
    }

    if (actionType === "remove" && !confirm(`Êtes-vous sûr de vouloir faire oublier le rituel "${selectedRitual.name}" à ce personnage ?`)) {
      return;
    }

    try {
      const response = await fetch(`/rituels/${actionType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterId: selectedCharacter,
          ritualName: selectedRitual.name
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(`Rituel ${actionType === "add" ? "ajouté" : "oublié"} avec succès !`);
        setIsModalOpen(false);
      } else {
        alert("Erreur: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Une erreur technique est survenue.");
    }
  };

  const selectCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    setIsSidebarOpen(false); // Fermer le menu sur mobile après un clic
  };

  return (
    <div className="gods:h-full gods:flex gods:relative gods:bg-background gods:text-foreground gods:overflow-hidden">
      
      {/* Background Texture */}
      <div aria-hidden className="gods:pointer-events-none gods:absolute gods:inset-0 gods:z-[5] gods:mix-blend-multiply gods:opacity-[0.055]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='pn'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23pn)'/%3E%3C/svg%3E")` }} />

      {/* Overlay pour la modale du menu mobile (restreint au conteneur React) */}
      {isSidebarOpen && (
        <div 
          className="gods:absolute gods:inset-0 gods:bg-background/80 gods:backdrop-blur-sm gods:z-[40] gods:lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Navigation */}
      <aside className={`gods:absolute gods:inset-y-0 gods:left-0 gods:z-[50] gods:w-full gods:sm:w-80 gods:lg:w-72 gods:bg-background gods:lg:bg-card/40 gods:border-r gods:border-border gods:flex gods:flex-col gods:transition-transform gods:duration-300 gods:ease-in-out gods:lg:static gods:lg:translate-x-0 ${isSidebarOpen ? "gods:translate-x-0" : "gods:-translate-x-full"}`}>
        <div className="gods:p-6 gods:border-b gods:border-border gods:flex gods:items-center gods:justify-between">
          <div>
            <h1 className="gods:text-2xl gods:tracking-wider gods:uppercase gods:text-foreground gods:font-display">
              Grimoire
            </h1>
            <p className="gods:text-base gods:text-muted-foreground gods:mt-1">Magie et sacrifices</p>
          </div>
          
          <button 
            className="gods:lg:hidden gods:flex gods:items-center gods:gap-2 gods:px-3 gods:py-2 gods:border gods:border-border gods:text-muted-foreground hover:gods:text-primary hover:gods:border-primary/35 gods:rounded-md gods:transition-all gods:text-xs gods:tracking-widest gods:uppercase gods:font-display !gods:outline-none"
            onClick={() => setIsSidebarOpen(false)}
          >
            Fermer
            <X size={14} />
          </button>
        </div>

        <nav className="gods:flex-1 gods:overflow-y-auto gods:p-4 gods:space-y-1">
          {/* Rules Tab */}
          <button
            onClick={() => selectCategory("rules")}
            className={`gods-ritual-tab gods:w-full gods:flex gods:items-center gods:gap-3 gods:px-4 gods:py-3 gods:rounded-md gods:transition-all gods:duration-300 !gods:outline-none ${
              activeCategory === "rules" 
                ? "gods:bg-secondary/5 gods:text-secondary gods:border gods:border-secondary/20" 
                : "gods:text-muted-foreground hover:gods:bg-muted/50 hover:gods:text-foreground gods:border gods:border-transparent"
            }`}
          >
            <BookOpen size={18} />
            <span className="gods:font-display gods:tracking-wider gods:text-sm gods:uppercase">Règles et Usages</span>
          </button>

          <div className="gods:pt-6 gods:pb-2 gods:px-4">
            <span className="gods:text-xs gods:tracking-widest gods:uppercase gods:text-secondary gods:font-display">
              Catégories de Rituels
            </span>
          </div>

          {/* Categories Tabs */}
          {RITUAL_CATEGORIES.map((category) => {
            const IconCmp = IconMap[category.icon] || Info;
            return (
              <button
                key={category.id}
                onClick={() => selectCategory(category.id)}
                className={`gods-ritual-tab gods:group gods:w-full gods:flex gods:items-center gods:justify-between gods:px-4 gods:py-3 gods:rounded-md gods:transition-all gods:duration-300 !gods:outline-none ${
                  activeCategory === category.id 
                    ? "gods:bg-secondary/5 gods:text-secondary gods:border gods:border-secondary/20" 
                    : "gods:text-muted-foreground hover:gods:bg-muted/50 hover:gods:text-foreground gods:border gods:border-transparent"
                }`}
              >
                <div className="gods:flex gods:items-center gods:gap-3">
                  <IconCmp size={18} className={activeCategory === category.id ? "gods:text-primary" : "gods:group-hover:text-primary/70"} />
                  <span className="gods:font-display gods:tracking-wider gods:text-sm gods:uppercase">{category.title}</span>
                </div>
                {activeCategory === category.id && <ChevronRight size={14} className="gods:text-primary" />}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="gods:flex-1 gods:overflow-y-auto gods:p-6 gods:lg:p-12 gods:relative gods:z-10">
        <div className="gods:max-w-6xl gods:mx-auto">
          
          {/* Bouton Grimoire Mobile positionné en haut à gauche */}
          <div className="gods:lg:hidden gods:mb-8">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="gods:inline-flex gods:items-center gods:gap-2 gods:px-4 gods:py-2 gods:bg-card gods:border gods:border-border gods:text-foreground hover:gods:text-primary hover:gods:border-primary/40 gods:rounded-md gods:transition-all gods:font-display gods:text-sm gods:tracking-wider gods:uppercase !gods:outline-none"
            >
              <BookOpen size={18} />
              Ouvrir le Grimoire
            </button>
          </div>

          {/* View: Rules */}
          {activeCategory === "rules" && (
            <div className="gods:animate-in gods:fade-in gods:slide-in-from-bottom-4 gods:duration-500">
              <div className="gods:mb-8">
                <SectionLabel>Guide du MJ</SectionLabel>
                <SectionTitle>Comment débloquer et utiliser un Rituel</SectionTitle>
                <p className="gods:text-muted-foreground gods:max-w-3xl gods:text-base gods:leading-relaxed">
                  Apprenez à maîtriser les arts anciens. La magie rituelle est puissante mais exige un tribut pour être déployée dans les Terres Sauvages.
                </p>
              </div>
              
              <div className="gods:grid gods:grid-cols-1 gods:md:grid-cols-2 gods:gap-6 gods:text-base gods:text-muted-foreground gods:leading-relaxed">
                
                <div className="gods:p-6 gods:xl:p-8 gods:rounded-lg gods:border gods:border-border gods:bg-card">
                  <div className="gods:inline-flex gods:p-3 gods:rounded-md gods:border gods:border-secondary/20 gods:bg-secondary/5 gods:text-secondary gods:mb-6">
                    <Flame size={24} />
                  </div>
                  <h3 className="gods:text-xl gods:tracking-wider gods:mb-3 gods:text-foreground">
                    Utilisation et Alimentation
                  </h3>
                  <p>La magie rituelle nécessite de l'<strong>Essence</strong> pour s'activer. Cette Essence s'obtient au moyen de <strong>sacrifices</strong> (mise à mort d'un être vivant ou destruction/détérioration d'un réceptacle).</p>
                </div>

                <div className="gods:p-6 gods:xl:p-8 gods:rounded-lg gods:border gods:border-border gods:bg-card">
                  <div className="gods:inline-flex gods:p-3 gods:rounded-md gods:border gods:border-secondary/20 gods:bg-secondary/5 gods:text-secondary gods:mb-6">
                    <Droplets size={24} />
                  </div>
                  <h3 className="gods:text-xl gods:tracking-wider gods:mb-3 gods:text-foreground">
                    Réceptacles & Niveaux
                  </h3>
                  <ul className="gods:list-disc gods:pl-5 gods:space-y-2 gods:mb-0">
                    <li>S'ils ne sont pas détruits, les réceptacles sont vidés de leur Essence et ternis.</li>
                    <li><strong>Minimes</strong> (Rareté 4 à 7) pour les rituels mineurs.</li>
                    <li><strong>Significatifs</strong> (Rareté 8 à 10) pour les rituels majeurs.</li>
                    <li><strong>Suprêmes</strong> pour les rituels légendaires.</li>
                  </ul>
                </div>

                <div className="gods:p-6 gods:xl:p-8 gods:rounded-lg gods:border gods:border-border gods:bg-card gods:md:col-span-2">
                  <div className="gods:inline-flex gods:p-3 gods:rounded-md gods:border gods:border-secondary/20 gods:bg-secondary/5 gods:text-secondary gods:mb-6">
                    <Skull size={24} />
                  </div>
                  <h3 className="gods:text-xl gods:tracking-wider gods:mb-3 gods:text-foreground">
                    Élus et Résolution
                  </h3>
                  <div className="gods:grid gods:grid-cols-1 gods:md:grid-cols-2 gods:gap-6">
                    <p><strong>Alternative pour les Élus :</strong> Ils peuvent parfois utiliser l'Essence de leur Dieu, mais de façon mesurée au risque de tarir la source, ou utiliser leur <strong>Éclat</strong> sans sacrifice matériel.</p>
                    <p><strong>Résolution :</strong> L'activation dépend d'un <strong>jet de Rituels</strong>. La durée/puissance des effets est souvent calculée en "+X par réussite".</p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* View: Ritual Category */}
          {activeData && (
            <div className="gods:animate-in gods:fade-in gods:slide-in-from-bottom-4 gods:duration-500">
              <div className="gods:mb-12">
                <div className="gods:inline-flex gods:p-3 gods:rounded-md gods:border gods:border-secondary/20 gods:bg-secondary/5 gods:text-secondary gods:mb-4">
                  {React.createElement(IconMap[activeData.icon] || Info, { size: 28 })}
                </div>
                <SectionTitle>{activeData.title}</SectionTitle>
              </div>

              <div className="gods:grid gods:grid-cols-1 gods:lg:grid-cols-2 gods:gap-6">
                {activeData.rituals.map((ritual, idx) => (
                  <div key={idx} className="gods:p-6 gods:xl:p-8 gods:flex gods:flex-col gods:rounded-lg gods:border gods:border-border gods:bg-card">
                    
                    {/* Header */}
                    <div className="gods:flex gods:items-start gods:justify-between gods:mb-4">
                      <h3 className="gods:text-xl gods:text-foreground gods:tracking-wider gods:pr-4">
                        {ritual.name}
                      </h3>
                      <span className={`gods:shrink-0 gods:text-xs gods:px-2 gods:py-0.5 gods:rounded gods:font-display gods:uppercase gods:tracking-widest gods:border ${
                        ritual.level.toLowerCase() === 'mineur' 
                          ? 'gods:bg-blue-500/5 gods:text-blue-500 gods:border-blue-500/20' 
                          : 'gods:bg-orange-500/5 gods:text-orange-500 gods:border-orange-500/20'
                      }`}>
                        {ritual.level}
                      </span>
                    </div>

                    {/* Body */}
                    <p className="gods:text-base gods:text-muted-foreground gods:leading-relaxed gods:mb-8 gods:flex-1">
                      {ritual.description}
                    </p>

                    {(ritual.receptacle || ritual.note) && (
                      <div className="gods:space-y-4 gods:mb-8">
                        {ritual.receptacle && (
                          <div className="gods:p-4 gods:bg-background/50 gods:border gods:border-border/50 gods:rounded-md">
                            <span className="gods:block gods:text-xs gods:font-display gods:tracking-widest gods:uppercase gods:text-primary gods:mb-1">
                              Réceptacle Courant
                            </span>
                            <p className="gods:text-sm gods:text-muted-foreground">
                              {ritual.receptacle}
                            </p>
                          </div>
                        )}
                        {ritual.note && (
                          <p className="gods:text-sm gods:italic gods:text-muted-foreground">
                            <strong className="gods:font-semibold gods:not-italic">Note :</strong> {ritual.note}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Action */}
                    <div className="gods:mt-2">
                      <button 
                        onClick={() => openModal(ritual)}
                        className="gods:group gods:flex gods:items-center gods:justify-center gods:gap-2.5 gods:w-fit gods:px-8 gods:py-3 gods:bg-primary gods:!text-primary-foreground gods:rounded-md hover:gods:bg-primary/85 gods:transition-all gods:text-base gods:tracking-wider gods:font-display !gods:outline-none"
                      >
                        Apprendre le rituel
                        <ArrowRight size={15} className="gods:group-hover:translate-x-0.5 gods:transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Learn Ritual Dialog */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="gods:fixed gods:inset-0 gods:bg-background/80 gods:backdrop-blur-sm gods:z-[400] gods:animate-in gods:fade-in" />
          <Dialog.Content className="gods:fixed gods:top-1/2 gods:left-1/2 gods:-translate-x-1/2 gods:-translate-y-1/2 gods:z-[401] gods:w-[90vw] gods:max-w-md gods:bg-card gods:border gods:border-border gods:rounded-lg gods:shadow-2xl gods:p-8 !gods:outline-none gods:animate-in gods:fade-in gods:zoom-in-95">
            
            <div className="gods:flex gods:items-center gods:justify-between gods:mb-6">
              <Dialog.Title className="gods:text-xl gods:tracking-wider gods:uppercase gods:font-display gods:text-foreground">
                Grimoire du Personnage
              </Dialog.Title>
              <Dialog.Close asChild>
                <button 
                  className="gods:flex gods:items-center gods:gap-2 gods:px-3 gods:py-2 gods:border gods:border-border gods:text-muted-foreground hover:gods:text-primary hover:gods:border-primary/35 gods:rounded-md gods:transition-all gods:text-xs gods:tracking-widest gods:uppercase gods:font-display !gods:outline-none"
                  aria-label="Fermer"
                >
                  Fermer
                  <X size={14} />
                </button>
              </Dialog.Close>
            </div>

            <div className="gods:mb-8">
              <p className="gods:text-base gods:text-muted-foreground gods:mb-6">
                Sélectionnez le personnage qui doit apprendre ou oublier le rituel :
                <span className="gods:block gods:text-2xl gods:font-display gods:tracking-wider gods:text-primary gods:mt-3">
                  {selectedRitual?.name}
                </span>
              </p>

              <select 
                value={selectedCharacter}
                onChange={(e) => setSelectedCharacter(e.target.value)}
                className="gods:w-full gods:px-4 gods:py-3 gods:bg-background gods:border gods:border-border gods:rounded-md gods:text-base gods:text-foreground focus:gods:outline-none focus:gods:border-primary/50 gods:transition-all gods:appearance-none"
              >
                {characters.map((c) => (
                  <option key={c.id_Character || c.id} value={c.id_Character || c.id}>
                    {c.nom}
                  </option>
                ))}
              </select>
            </div>

            <div className="gods:flex gods:flex-col-reverse gods:sm:flex-row gods:items-center gods:justify-end gods:gap-4">
              <button 
                onClick={() => handleAction("remove")}
                className="gods:flex gods:items-center gods:justify-center gods:gap-2 gods:px-8 gods:py-3 gods:border gods:border-border gods:text-muted-foreground hover:gods:text-foreground hover:gods:border-primary/35 gods:rounded-md gods:transition-all gods:text-base gods:tracking-wider gods:font-display gods:w-full gods:sm:w-auto !gods:outline-none"
              >
                <Trash2 size={15} />
                Oublier
              </button>
              
              <button 
                onClick={() => handleAction("add")}
                className="gods:group gods:flex gods:items-center gods:justify-center gods:gap-2.5 gods:px-8 gods:py-3 gods:bg-primary gods:!text-primary-foreground gods:rounded-md hover:gods:bg-primary/85 gods:transition-all gods:text-base gods:tracking-wider gods:font-display gods:w-full gods:sm:w-auto !gods:outline-none"
              >
                Ajouter
                <ArrowRight size={15} className="gods:group-hover:translate-x-0.5 gods:transition-transform" />
              </button>
            </div>

          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  );
}