import React from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Eclat {
  id?: string;
  nom?: string;
  // Add other properties as they become relevant
}

interface Character {
  id_Character: string;
  nom: string;
  stadeEclat: string;
}

interface EclatsAppProps {
  eclats: Eclat[];
  characters: Character[];
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function EclatsApp({ eclats, characters }: EclatsAppProps) {
  return (
    // Replaced the inline margins with Tailwind classes where possible, leaving standard layout rules
    <div 
      className="gods:w-full gods:overflow-hidden gods:bg-background gods:text-foreground gods:border-t gods:border-border" 
      style={{ marginTop: "64px", height: "calc(100vh - 64px)" }}
    >
      <div className="gods:flex gods:items-center gods:justify-center gods:h-full gods:p-8">
        <div className="gods:text-center gods:max-w-md">
          
          <div className="gods:text-3xl gods:mb-5 gods:opacity-15 gods:select-none">
            ◈
          </div>

          <h2 className="gods:text-3xl gods:tracking-wider gods:uppercase gods:text-foreground gods:mb-3">
            Les Éclats
          </h2>

          <p className="gods:text-muted-foreground gods:text-base gods:leading-relaxed gods:mb-6">
            Les artéfacts divins et fragments de pouvoir sont actuellement en cours de refonte. De nouvelles reliques attendent encore d'être découvertes.
          </p>

          <span className="gods:inline-block gods:px-4 gods:py-1.5 gods:border gods:border-border gods:rounded-md gods:text-xs gods:uppercase gods:text-muted-foreground gods:font-display gods:tracking-widest">
            Disponible prochainement
          </span>

        </div>
      </div>
    </div>
  );
}