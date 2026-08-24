import { useState } from "react";
import { X } from "lucide-react";
import { SectionLabel, PageTitle } from "../shared/Typography";

const MAPS = [
  { file: "aon", alt: "Aon" },
  { file: "avhorae", alt: "avhorae" },
  { file: "royaumesdivises", alt: "royaumesdivises" },
  { file: "fakhar", alt: "fakhar" },
  { file: "horde", alt: "horde" },
  { file: "khashan", alt: "khashan" },
  { file: "ool", alt: "ool" },
  { file: "saeth", alt: "saeth" },
  { file: "soleilnoir", alt: "soleilnoir" },
  { file: "babel", alt: "babel" },
  { file: "tuuhle", alt: "tuuhle" },
  { file: "vaelor", alt: "vaelor" },
  { file: "tegee", alt: "tegee" },
  { file: "valdheim", alt: "valdheim" },
];

export default function App() {
  const [lightboxMap, setLightboxMap] = useState<string | null>(null);

  const selectedMap = MAPS.find((map) => map.file === lightboxMap);

  return (
    // Added gods:pt-16 to offset the fixed header and changed to min-h-screen
    <div className="gods:pt-16 gods:min-h-screen gods:bg-background gods:relative gods:z-10 gods:flex gods:flex-col">
      
      {/* Standardized max-w-7xl wrapper with responsive padding */}
      <main className="gods:flex-1 gods:w-full gods:max-w-7xl gods:mx-auto gods:px-6 gods:py-12 lg:gods:px-12 lg:gods:py-24">
        
        <header className="gods:mb-12">
          <SectionLabel>Cartographie</SectionLabel>
          <PageTitle>Les Terres Sauvages</PageTitle>
        </header>

        <div className="gods:grid gods:grid-cols-2 gods:sm:grid-cols-3 gods:lg:grid-cols-4 gods:gap-6">
          {MAPS.map((map) => (
            <button
              key={map.file}
              type="button"
              onClick={() => setLightboxMap(map.file)}
              className="gods:p-0 gods:group gods:relative gods:block gods:aspect-square gods:w-full gods:overflow-hidden gods:rounded-lg gods:border gods:border-border gods:bg-card gods:text-left gods:cursor-pointer !gods:outline-none"
              aria-label={`Afficher la carte ${map.alt}`}
            >
              <img
                src={`/images/maps/thumbnails/${map.file}_thumb.png`}
                alt={map.alt}
                className="gods:block gods:w-full gods:h-full gods:object-cover gods:transition-transform gods:duration-500 gods:group-hover:scale-105"
              />

              <div className="gods:absolute gods:inset-0 gods:bg-gradient-to-t gods:from-black/70 gods:via-transparent gods:to-transparent gods:opacity-0 gods:group-hover:opacity-100 gods:transition-opacity gods:duration-300" />

              <span className="gods:absolute gods:bottom-4 gods:left-4 gods:right-4 gods:text-white gods:text-lg gods:tracking-wider gods:capitalize gods:font-display gods:opacity-0 gods:group-hover:opacity-100 gods:transition-opacity gods:duration-300">
                {map.alt}
              </span>
            </button>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedMap && (
          <div
            // z-[200] ensures the modal passes ABOVE the header (which is at z-[100])
            className="gods:fixed gods:inset-0 gods:z-[200] gods:flex gods:items-center gods:justify-center gods:bg-black/95 gods:backdrop-blur-sm gods:p-6 gods:animate-in gods:fade-in gods:duration-300"
            role="dialog"
            aria-modal="true"
            aria-label={`Carte ${selectedMap.alt}`}
            onClick={() => setLightboxMap(null)}
          >
            <button
              type="button"
              onClick={() => setLightboxMap(null)}
              className="gods:absolute gods:top-6 gods:right-6 gods:z-10 gods:flex gods:items-center gods:gap-2 gods:px-5 gods:py-2.5 gods:rounded-md gods:border gods:border-white/20 gods:bg-black/50 gods:text-white gods:text-xs gods:tracking-widest gods:uppercase gods:font-display hover:gods:bg-white/10 gods:transition-colors gods:cursor-pointer !gods:outline-none"
              aria-label="Fermer"
            >
              Fermer
              <X size={14} />
            </button>

            <img
              src={`/images/maps/${selectedMap.file}.png`}
              alt={selectedMap.alt}
              className="gods:max-h-[90vh] gods:max-w-[95vw] gods:w-auto gods:h-auto gods:object-contain gods:rounded-md gods:shadow-2xl gods:animate-in gods:zoom-in-95 gods:duration-300"
              onClick={(event) => event.stopPropagation()}
            />
          </div>
        )}
      </main>
    </div>
  );
}