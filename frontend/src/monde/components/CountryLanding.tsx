import React from "react";
import { countries } from "../data/registry";
import { ArrowRight, Lock } from "lucide-react";
import { SectionLabel, PageTitle, PageDescription } from "../../shared/Typography"; 

export function CountryLanding({ onSelect }: { onSelect: (id: string) => void }) {
  const countryList = Object.values(countries);

  return (
    // Standardized max-w-7xl wrapper with responsive padding
    <main className="gods:flex-1 gods:w-full gods:max-w-7xl gods:mx-auto gods:px-6 gods:py-12 lg:gods:px-12 lg:gods:py-24">
      
      {/* ── En-tête de la page ── */}
      <header className="gods:mb-12 gods:flex gods:flex-col gods:md:flex-row gods:md:items-end gods:justify-between gods:gap-6">
        <div>
          <SectionLabel>Le Monde</SectionLabel>
          <PageTitle>Les Terres Sauvages</PageTitle>
          <PageDescription>
            Choisissez une terre pour entrer dans son histoire.
          </PageDescription>
        </div>
        
        {/* Compteur de territoires (Preserved specific layout) */}
        <div className="gods:shrink-0">
          <span className="gods:inline-flex gods:items-center gods:px-4 gods:py-1.5 gods:rounded-full gods:border gods:border-primary/30 gods:bg-primary/5 gods:text-primary gods:font-display gods:text-sm gods:tracking-widest gods:uppercase">
            {countryList.length} territoires
          </span>
        </div>
      </header>

      {/* ── Grille des territoires ── */}
      <section className="gods:grid gods:grid-cols-1 gods:md:grid-cols-2 gods:lg:grid-cols-3 gods:gap-4">
        {countryList.map((country, i) => {
          const isAuthored = country.authored;

          return (
            <button
              key={country.id}
              onClick={() => isAuthored && onSelect(country.id)}
              disabled={!isAuthored}
              className={`gods:group gods:flex gods:items-center gods:p-5 gods:rounded-lg gods:border gods:text-left gods:transition-all gods:duration-300 !gods:outline-none ${
                isAuthored 
                  ? "gods:bg-card gods:border-border hover:gods:border-primary/40 hover:gods:shadow-lg gods:cursor-pointer" 
                  : "gods:bg-card/40 gods:border-border/50 gods:opacity-75 gods:cursor-not-allowed"
              }`}
            >
              {/* Index stylisé */}
              <span className={`gods:text-xl gods:font-display gods:w-12 gods:shrink-0 ${
                isAuthored ? "gods:text-primary/50" : "gods:text-muted-foreground/40"
              }`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              
              {/* Textes (Nom + Région) */}
              <div className="gods:flex-1 gods:pr-4">
                <span className={`gods:block gods:text-lg gods:tracking-wider gods:mb-1 ${
                  isAuthored ? "gods:text-foreground gods:group-hover:text-primary gods:transition-colors" : "gods:text-muted-foreground"
                }`}>
                  {country.name}
                </span>
                <span className={`gods:block gods:text-xs gods:tracking-widest gods:uppercase gods:font-display ${
                  isAuthored ? "gods:text-primary/80" : "gods:text-muted-foreground/70"
                }`}>
                  {isAuthored ? country.region : "À venir"}
                </span>
              </div>

              {/* Action (Flèche ou Cadenas) */}
              <div className={`gods:shrink-0 gods:flex gods:items-center gods:justify-center gods:w-8 gods:h-8 gods:rounded-full ${
                isAuthored 
                  ? "gods:bg-primary/10 gods:text-primary gods:group-hover:bg-primary/20 gods:transition-colors" 
                  : "gods:bg-muted/50 gods:text-muted-foreground"
              }`}>
                {isAuthored ? (
                  <ArrowRight size={16} className="gods:group-hover:translate-x-0.5 gods:transition-transform" />
                ) : (
                  <Lock size={14} />
                )}
              </div>
            </button>
          );
        })}
      </section>
      
    </main>
  );
}