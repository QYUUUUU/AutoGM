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
  ChevronRight
} from "lucide-react";
import { RITUAL_CATEGORIES, RitualCategory, Ritual } from "./data/ritualsData";

// Define the Icon mapping to resolve strings to Lucide components
const IconMap: Record<string, React.FC<any>> = {
  // Existing icons
  Wind,
  PawPrint,
  Droplets,
  Flame,
  Skull,
  Combine,

  // New ritual category icons
  BookOpen,    // Rituels de l'Humain
  Moon,        // Rituels des Lunes
  Sun,         // Rituels du Soleil
  Mountain,    // Rituels de la Terre
  HeartPulse,  // Rituels de la Vie
};

export default function RitualsApp({ characters }: { characters: any[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("rules");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<string>("");

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

  return (
    <div className="gods:h-full gods:flex gods:bg-background gods:text-foreground gods:overflow-hidden">
      
      {/* Background Texture */}
      <div aria-hidden className="gods:pointer-events-none gods:fixed gods:inset-0 gods:z-[500] gods:mix-blend-multiply gods:opacity-[0.055]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='pn'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23pn)'/%3E%3C/svg%3E")` }} />

      {/* Sidebar - Navigation */}
      <aside className="gods:shrink-0 gods:border-r gods:border-border gods:flex gods:flex-col gods:bg-card/40 gods:z-10 gods:overflow-y-auto">
        <div className="gods:p-5 gods:border-b gods:border-border">
          <h1 className="gods:text-xl gods:tracking-wider gods:uppercase gods:text-foreground">
            Grimoire
          </h1>
          <p className="gods:text-base gods:text-muted-foreground gods:mt-1">Magie et sacrifices</p>
        </div>

        <nav className="gods:p-3 gods:space-y-1">
          {/* Rules Tab */}
          <button
            onClick={() => setActiveCategory("rules")}
            className={`gods-ritual-tab gods:w-full gods:flex gods:items-center gods:gap-3 gods:px-3 gods:py-2.5 gods:rounded-md gods:transition-colors !gods:outline-none ${
              activeCategory === "rules" 
                ? "gods:bg-primary/10 gods:text-primary gods:border gods:border-primary/30" 
                : "gods:text-muted-foreground hover:gods:bg-muted hover:gods:text-foreground gods:border gods:border-transparent"
            }`}
          >
            <BookOpen size={18} />
            <span className="gods:font-display gods:tracking-wider gods:text-base">Règles et Usages</span>
          </button>

          <div className="gods:my-4 gods:px-3 gods:text-xs gods:font-display gods:tracking-widest gods:uppercase gods:text-muted-foreground">
            Catégories de Rituels
          </div>

          {/* Categories Tabs */}
          {RITUAL_CATEGORIES.map((category) => {
            const IconCmp = IconMap[category.icon] || Info;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`gods-ritual-tab gods:w-full gods:flex gods:items-center gods:justify-between gods:px-3 gods:py-2.5 gods:rounded-md gods:transition-colors !gods:outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${
                  activeCategory === category.id 
                    ? "gods:bg-muted gods:text-foreground gods:border gods:border-border" 
                    : "gods:text-muted-foreground hover:gods:bg-muted/50 hover:gods:text-foreground gods:border gods:border-transparent"
                }`}
              >
                <div className="gods:flex gods:items-center gods:gap-3">
                  <IconCmp size={18} className={activeCategory === category.id ? "gods:text-primary" : ""} />
                  <span className="gods:font-display gods:tracking-wider gods:text-base">{category.title}</span>
                </div>
                {activeCategory === category.id && <ChevronRight size={14} className="gods:text-muted-foreground" />}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="gods:flex-1 gods:overflow-y-auto gods:p-8 gods:relative">
        <div className="gods:max-w-4xl gods:mx-auto">
          
          {/* View: Rules */}
          {activeCategory === "rules" && (
            <div className="gods:animate-in gods:fade-in gods:slide-in-from-bottom-4 gods:duration-500">
              <h2 className="gods:text-3xl gods:tracking-wider gods:uppercase gods:text-foreground gods:mb-6">
                Comment débloquer et utiliser un Rituel
              </h2>
              
              <div className="gods:space-y-6 gods:text-base gods:text-muted-foreground gods:leading-relaxed">
                <div className="gods:bg-card gods:border gods:border-border gods:rounded-lg gods:p-6">
                  <h3 className="gods:text-primary gods:text-xl gods:tracking-wider gods:mb-3">Utilisation et Alimentation</h3>
                  <p>La magie rituelle nécessite de l'<strong>Essence</strong> pour s'activer. Cette Essence s'obtient au moyen de <strong>sacrifices</strong> (mise à mort d'un être vivant ou destruction/détérioration d'un réceptacle).</p>
                </div>

                <div className="gods:bg-card gods:border gods:border-border gods:rounded-lg gods:p-6">
                  <h3 className="gods:text-primary gods:text-xl gods:tracking-wider gods:mb-3">Réceptacles & Niveaux</h3>
                  <ul className="gods:list-disc gods:pl-5 gods:space-y-2">
                    <li>S'ils ne sont pas détruits, les réceptacles sont vidés de leur Essence et ternis (ils perdent leur valeur).</li>
                    <li><strong>Minimes</strong> (Rareté 4 à 7) pour les rituels mineurs.</li>
                    <li><strong>Significatifs</strong> (Rareté 8 à 10) pour les rituels majeurs.</li>
                    <li><strong>Suprêmes</strong> pour les rituels légendaires (choses inestimables ou terrifiantes).</li>
                  </ul>
                </div>

                <div className="gods:bg-card gods:border gods:border-border gods:rounded-lg gods:p-6">
                  <h3 className="gods:text-primary gods:text-xl gods:tracking-wider gods:mb-3">Élus et Résolution</h3>
                  <p className="gods:mb-3"><strong>Alternative pour les Élus :</strong> Ils peuvent parfois utiliser l'Essence de leur Dieu, mais de façon mesurée au risque de tarir la source, ou utiliser leur <strong>Éclat</strong> sans sacrifice matériel.</p>
                  <p><strong>Résolution :</strong> L'activation dépend d'un <strong>jet de Rituels</strong>. La durée/puissance des effets est souvent calculée en "+X par réussite".</p>
                </div>
              </div>
            </div>
          )}

          {/* View: Ritual Category */}
          {activeData && (
            <div className="gods:animate-in gods:fade-in gods:slide-in-from-bottom-4 gods:duration-500">
              <div className="gods:flex gods:items-center gods:gap-4 gods:mb-8 gods:border-b gods:border-border gods:pb-4">
                <div className="gods:p-3 gods:bg-primary/10 gods:rounded-lg gods:border gods:border-primary/20">
                  {React.createElement(IconMap[activeData.icon] || Info, { size: 28, className: "gods:text-primary" })}
                </div>
                <h2 className="gods:text-3xl gods:tracking-wider gods:uppercase gods:text-foreground">
                  {activeData.title}
                </h2>
              </div>

              <div className="gods:grid gods:grid-cols-1 gods:gap-6">
                {activeData.rituals.map((ritual, idx) => (
                  <div key={idx} className="gods:bg-card gods:border gods:border-border gods:rounded-lg gods:overflow-hidden gods:transition-all hover:gods:border-primary/40 hover:gods:shadow-lg hover:gods:shadow-background">
                    
                    {/* Card Header */}
                    <div className="gods:flex gods:items-center gods:justify-between gods:bg-muted/30 gods:px-5 gods:py-4 gods:border-b gods:border-border">
                      <div className="gods:flex gods:items-center gods:gap-3">
                        <h3 className="gods:text-xl gods:text-foreground gods:tracking-wider">
                          {ritual.name}
                        </h3>
                        <span className={`gods:text-xs gods:px-2 gods:py-0.5 gods:rounded gods:font-display gods:uppercase gods:tracking-widest gods:border ${
                          ritual.level.toLowerCase() === 'mineur' 
                            ? 'gods:bg-blue-500/10 gods:text-blue-400 gods:border-blue-500/20' 
                            : 'gods:bg-orange-500/10 gods:text-orange-400 gods:border-orange-500/20'
                        }`}>
                          {ritual.level}
                        </span>
                      </div>
                      
                      <button 
                        onClick={() => openModal(ritual)}
                        className="gods:flex gods:items-center gods:gap-2 gods:px-3 gods:py-1.5 gods:bg-background gods:border gods:border-border hover:gods:border-primary/50 gods:rounded-md gods:text-base gods:font-display gods:tracking-wider gods:transition-all !gods:outline-none"
                      >
                        <Plus size={14} className="gods:text-primary" />
                        Apprendre
                      </button>
                    </div>

                    {/* Card Body */}
                    <div className="gods:p-5 gods:space-y-4">
                      <p className="gods:text-base gods:text-muted-foreground gods:leading-relaxed">
                        {ritual.description}
                      </p>

                      {ritual.receptacle && (
                        <div className="gods:bg-background/50 gods:border gods:border-border/50 gods:rounded-md gods:p-4 gods:flex gods:gap-3">
                          <Droplets size={16} className="gods:text-muted-foreground gods:shrink-0 gods:mt-0.5" />
                          <div>
                            <span className="gods:block gods:text-xs gods:font-display gods:tracking-widest gods:uppercase gods:text-muted-foreground gods:mb-1">
                              Réceptacle Courant
                            </span>
                            <p className="gods:text-base gods:text-muted-foreground gods:leading-relaxed">
                              {ritual.receptacle}
                            </p>
                          </div>
                        </div>
                      )}

                      {ritual.note && (
                        <p className="gods:text-base gods:italic gods:text-muted-foreground">
                          <strong className="gods:font-semibold gods:not-italic">Note :</strong> {ritual.note}
                        </p>
                      )}
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
          <Dialog.Content className="gods:fixed gods:top-1/2 gods:left-1/2 gods:-translate-x-1/2 gods:-translate-y-1/2 gods:z-[401] gods:w-[400px] gods:bg-popover gods:border gods:border-border gods:rounded-lg gods:shadow-2xl gods:p-6 !gods:outline-none gods:animate-in gods:fade-in gods:zoom-in-95">
            
            <div className="gods:flex gods:items-center gods:justify-between gods:mb-5">
              <Dialog.Title className="gods:text-xl gods:tracking-wider gods:text-foreground">
                Apprendre un Rituel
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="gods:text-muted-foreground hover:gods:text-foreground gods:transition-colors !gods:outline-none">
                  <X size={18} />
                </button>
              </Dialog.Close>
            </div>

            <div className="gods:mb-6">
              <p className="gods:text-base gods:text-muted-foreground gods:mb-4">
                Sélectionnez le personnage qui doit apprendre ou oublier le rituel : <br/>
                <strong className="gods:text-primary gods:text-xl gods:font-display gods:tracking-wider gods:mt-2 gods:block">
                  {selectedRitual?.name}
                </strong>
              </p>

              <select 
                value={selectedCharacter}
                onChange={(e) => setSelectedCharacter(e.target.value)}
                className="gods:w-full gods:px-3 gods:py-2.5 gods:bg-input-background gods:border gods:border-border gods:rounded-md gods:text-base gods:text-foreground focus:gods:outline-none focus:gods:border-primary/40 gods:transition-all"
              >
                {characters.map((c) => (
                  <option key={c.id_Character || c.id} value={c.id_Character || c.id}>
                    {c.nom}
                  </option>
                ))}
              </select>
            </div>

            <div className="gods:flex gods:justify-end gods:gap-3">
              <button 
                onClick={() => handleAction("remove")}
                className="gods:px-4 gods:py-2 gods:flex gods:items-center gods:gap-2 gods:text-base gods:text-destructive hover:gods:bg-destructive/10 gods:rounded-md gods:transition-colors !gods:outline-none"
              >
                <Trash2 size={16} />
                Oublier
              </button>
              
              <button 
                onClick={() => handleAction("add")}
                className="gods:px-5 gods:py-2 gods:bg-primary gods:text-primary-foreground gods:text-base gods:font-medium gods:rounded-md hover:gods:bg-primary/85 gods:transition-all gods:font-display gods:tracking-wider !gods:outline-none"
              >
                Ajouter au grimoire
              </button>
            </div>

          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  );
}