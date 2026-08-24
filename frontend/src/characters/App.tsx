import React from "react";
import { Plus, ArrowRight } from "lucide-react";
import { SectionLabel, PageTitle, PageDescription } from "../shared/Typography";

interface Character {
  id_Character: number | string;
  avatar?: string;
  genre?: string;
  nom: string;
  origine?: string;
  instinct?: string;
}

export default function App({ characters }: { characters: Character[] }) {
  // Utilitaire pour gérer l'avatar ou l'image par défaut selon le genre
  const getAvatar = (char: Character) => {
    if (char.avatar && char.avatar.trim() !== "") {
      return char.avatar;
    }
    const genrePath = char.genre || "homme";
    return `/images/characters/${genrePath}/${genrePath}-1.jpg`;
  };

  return (
    // Added gods:pt-16 to offset the fixed header and changed to min-h-screen
    <div className="gods:pt-16 gods:min-h-screen gods:bg-background gods:relative gods:z-10 gods:flex gods:flex-col">
      {/* Unified max-width, responsive padding, and flex behavior */}
      <main className="gods:flex-1 gods:w-full gods:max-w-7xl gods:mx-auto gods:px-6 gods:py-12 lg:gods:px-12 lg:gods:py-24">
        
        {/* ── EN-TÊTE ── */}
        <header className="gods:mb-12">
          <SectionLabel>Le Panthéon</SectionLabel>
          <PageTitle>Vos Personnages</PageTitle>
          <PageDescription>
            Sélectionnez un Élu pour poursuivre l'aventure ou créez-en un nouveau.
          </PageDescription>
        </header>

        {/* ── GRILLE ── */}
        <div className="gods:grid gods:grid-cols-1 gods:sm:grid-cols-2 gods:md:grid-cols-3 gods:lg:grid-cols-4 gods:gap-6">
          
          {/* Carte Création */}
          <a
            href="/newcharacter"
            className="gods:group gods:relative gods:p-6 gods:xl:p-8 gods:flex gods:flex-col gods:rounded-lg gods:border-2 gods:border-dashed gods:border-border gods:bg-card hover:gods:border-primary/40 hover:gods:shadow-lg gods:transition-all gods:duration-300 !gods:outline-none"
          >
            <div className="gods:relative gods:w-full gods:aspect-[3/4] gods:rounded-md gods:border gods:border-dashed gods:border-primary/30 gods:bg-primary/5 gods:group-hover:bg-primary/10 gods:group-hover:border-primary/50 gods:flex gods:items-center gods:justify-center gods:overflow-hidden gods:mb-6 gods:transition-colors gods:duration-300">
              <div className="gods:w-16 gods:h-16 gods:rounded-full gods:bg-background gods:border gods:border-border gods:flex gods:items-center gods:justify-center gods:group-hover:scale-110 gods:group-hover:border-primary/40 gods:transition-all gods:duration-300 gods:text-primary">
                <Plus size={32} />
              </div>
            </div>
            
            <p className="gods:text-xs gods:font-display gods:tracking-widest gods:uppercase gods:text-primary gods:mb-2">
              Nouveau
            </p>
            
            <h3 className="gods:text-xl gods:tracking-wider gods:mb-3 gods:text-foreground gods:group-hover:text-primary gods:transition-colors gods:duration-200">
              Créer un Élu
            </h3>

            <div className="gods:flex gods:items-center gods:gap-2 gods:text-xs gods:tracking-widest gods:uppercase gods:text-muted-foreground gods:group-hover:text-primary gods:transition-colors gods:duration-200 gods:font-display gods:mt-auto">
              Invoquer <ArrowRight size={14} className="gods:group-hover:translate-x-1 gods:transition-transform" />
            </div>
          </a>

          {/* Cartes Personnages */}
          {characters.map((char) => (
            <a
              key={char.id_Character}
              href={`/Character/show/${char.id_Character}`}
              className="gods:group gods:relative gods:p-6 gods:xl:p-8 gods:flex gods:flex-col gods:rounded-lg gods:border gods:border-border gods:bg-card hover:gods:border-primary/40 hover:gods:shadow-lg gods:transition-all gods:duration-300 !gods:outline-none"
            >
              <div className="gods:relative gods:w-full gods:aspect-[3/4] gods:rounded-md gods:border gods:border-border/50 gods:group-hover:border-primary/40 gods:overflow-hidden gods:mb-6 gods:transition-colors gods:duration-300">
                <img
                  src={getAvatar(char)}
                  alt={char.nom}
                  className="gods:absolute gods:inset-0 gods:w-full gods:h-full gods:object-cover gods:object-top gods:transition-transform gods:duration-500 gods:group-hover:scale-105"
                />
              </div>

              <p className="gods:text-xs gods:font-display gods:tracking-widest gods:uppercase gods:text-primary gods:mb-2">
                {char.origine || "Inconnu"}
                {char.instinct ? ` • ${char.instinct}` : ""}
              </p>
              
              <h3 className="gods:text-xl gods:tracking-wider gods:mb-3 gods:text-foreground gods:group-hover:text-primary gods:transition-colors gods:duration-200">
                {char.nom}
              </h3>

              <div className="gods:flex gods:items-center gods:gap-2 gods:text-xs gods:tracking-widest gods:uppercase gods:text-muted-foreground gods:group-hover:text-primary gods:transition-colors gods:duration-200 gods:font-display gods:mt-auto">
                Incarner <ArrowRight size={14} className="gods:group-hover:translate-x-1 gods:transition-transform" />
              </div>
            </a>
          ))}

        </div>
      </main>
    </div>
  );
}