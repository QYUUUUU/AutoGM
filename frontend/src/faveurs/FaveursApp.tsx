import React from "react";
import { Sparkles } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Faveur {
  nom: string;
  domaine: string;
  type: string;
  stade: string;
  description: string;
}

interface Character {
  id_Character: string;
  nom: string;
  stadeEclat: string;
}

interface FaveursAppProps {
  faveurs: Faveur[];
  characters: Character[];
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function FaveursApp({ faveurs, characters }: FaveursAppProps) {
  
  return (
    <div 
      className="gods:w-full gods:overflow-hidden gods:bg-background gods:text-foreground gods:border-t gods:border-border gods:relative" 
      style={{ marginTop: "64px", height: "calc(100vh - 64px)" }}
    >
      
      {/* Paper grain overlay (scoped to absolute so it fits perfectly in the container) */}
      <div 
        aria-hidden 
        className="gods:pointer-events-none gods:absolute gods:inset-0 gods:z-[500] gods:mix-blend-multiply gods:opacity-[0.055]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='pn'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23pn)'/%3E%3C/svg%3E\")" }} 
      />

      <div className="gods:flex gods:items-center gods:justify-center gods:h-full gods:p-8 gods:relative gods:z-10">
        <div className="gods:text-center gods:max-w-md">
          
          <div className="gods:flex gods:justify-center gods:mb-6 gods:opacity-20 gods:select-none">
            <Sparkles size={64} strokeWidth={1} />
          </div>
          
          <h2 className="gods:text-3xl gods:tracking-wider gods:uppercase gods:text-foreground gods:mb-3">
            Les Faveurs Divines
          </h2>
          
          <p className="gods:text-muted-foreground gods:text-base gods:leading-relaxed gods:mb-6">
            L'interface d'attribution des dons et miracles divins est actuellement en cours de développement.
          </p>
          
          <span className="gods:inline-block gods:px-4 gods:py-1.5 gods:border gods:border-border gods:rounded-md gods:text-xs gods:uppercase gods:text-muted-foreground gods:font-display gods:tracking-widest">
            En construction
          </span>
          
        </div>
      </div>
      
    </div>
  );
}