import {
  useState,
} from "react";

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

function SectionLabel({ children }: { children: string }) {
  return (
    <span className="gods:text-xs gods:tracking-widest gods:uppercase gods:text-primary gods:font-display">
      {children}
    </span>
  );
}

export default function App() {
  const [lightboxMap, setLightboxMap] = useState<string | null>(null);

  const selectedMap = MAPS.find((map) => map.file === lightboxMap);

  return (
    <div className="gods:max-w-6xl gods:mx-auto gods:px-6 gods:py-16">
      <div className="gods:text-center gods:mb-14">
        <SectionLabel>Cartographie</SectionLabel>

        <h1 className="gods:text-3xl gods:tracking-wider gods:uppercase gods:text-foreground gods:mt-3">
          Les Terres Sauvages
        </h1>
      </div>

      <div className="gods:grid gods:grid-cols-2 gods:sm:grid-cols-3 gods:lg:grid-cols-4 gods:gap-4">
        {MAPS.map((map) => (
          <button
            key={map.file}
            type="button"
            onClick={() => setLightboxMap(map.file)}
            // Added gods:p-0 here to kill the native browser padding
            className="gods:p-0 gods:group gods:relative gods:block gods:aspect-square gods:w-full gods:overflow-hidden gods:rounded-lg gods:border gods:border-border gods:bg-card gods:text-left gods:cursor-pointer"
            aria-label={`Afficher la carte ${map.alt}`}
          >
            <img
              src={`/images/maps/thumbnails/${map.file}_thumb.png`}
              alt={map.alt}
              // Added gods:block here to kill the native image baseline gap
              className="gods:block gods:w-full gods:h-full gods:object-cover gods:transition-transform gods:duration-500 gods:group-hover:scale-105"
            />

            <div className="gods:absolute gods:inset-0 gods:bg-gradient-to-t gods:from-black/70 gods:via-transparent gods:to-transparent gods:opacity-0 gods:group-hover:opacity-100 gods:transition-opacity gods:duration-300" />

            <span className="gods:absolute gods:bottom-2 gods:left-3 gods:right-3 gods:text-white gods:text-base gods:tracking-wider gods:capitalize gods:font-display gods:opacity-0 gods:group-hover:opacity-100 gods:transition-opacity gods:duration-300">
              {map.alt}
            </span>
          </button>
        ))}
      </div>

      {selectedMap && (
        <div
          className="gods:fixed gods:inset-0 gods:z-50 gods:flex gods:items-center gods:justify-center gods:bg-black/90 gods:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Carte ${selectedMap.alt}`}
          onClick={() => setLightboxMap(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxMap(null)}
            className="gods:absolute gods:top-5 gods:right-5 gods:z-10 gods:px-4 gods:py-2 gods:rounded-md gods:border gods:border-white/20 gods:bg-black/50 gods:text-white gods:text-base gods:hover:bg-white/10 gods:transition-colors gods:cursor-pointer"
            aria-label="Fermer"
          >
            Fermer
          </button>

          <img
            src={`/images/maps/${selectedMap.file}.png`}
            alt={selectedMap.alt}
            className="gods:max-h-[90vh] gods:max-w-[95vw] gods:w-auto gods:h-auto gods:object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}