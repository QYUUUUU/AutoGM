import { Plus } from "lucide-react";

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
    <div className="gods:min-h-[calc(100vh-4rem)] gods:bg-background gods:font-[family-name:var(--gods-font-body)]">
      <div className="gods:max-w-7xl gods:mx-auto gods:px-6 gods:py-24">
        
        {/* ── EN-TÊTE ── */}
        <div className="gods:text-center gods:mb-16">
          <h1 className="gods:font-[family-name:var(--gods-font-display)] gods:text-4xl gods:md:text-5xl gods:tracking-widest gods:uppercase gods:text-foreground gods:mb-5">
            Vos Personnages
          </h1>
          <p className="gods:text-foreground/65 gods:text-lg gods:max-w-2xl gods:mx-auto gods:leading-relaxed">
            Sélectionnez un Élu pour poursuivre l'aventure ou créez-en un nouveau.
          </p>
        </div>

        {/* ── GRILLE ── */}
        <div className="gods:grid gods:grid-cols-1 gods:sm:grid-cols-2 gods:md:grid-cols-3 gods:lg:grid-cols-4 gods:gap-6">
          
          {/* Carte Création */}
          <a
            href="/newcharacter"
            className="gods:group gods:flex gods:flex-col gods:items-center gods:justify-center gods:p-8 gods:rounded-lg gods:border-2 gods:border-dashed gods:border-primary/30 gods:bg-primary/5 gods:hover:bg-primary/10 gods:hover:border-primary/60 gods:transition-all gods:duration-300 gods:min-h-[350px] gods:cursor-pointer gods:text-center"
          >
            <div className="gods:w-16 gods:h-16 gods:rounded-full gods:bg-primary/20 gods:border gods:border-primary/30 gods:flex gods:items-center gods:justify-center gods:mb-5 gods:group-hover:scale-110 gods:transition-transform gods:duration-300 gods:text-primary">
              <Plus size={32} />
            </div>
            <h3 className="gods:font-[family-name:var(--gods-font-display)] gods:text-xl gods:tracking-widest gods:uppercase gods:text-foreground gods:group-hover:text-primary gods:transition-colors">
              Créer un Élu
            </h3>
          </a>

          {/* Cartes Personnages */}
          {characters.map((char) => (
            <a
              key={char.id_Character}
              href={`/Character/show/${char.id_Character}`} /* 👈 Route Node exacte */
              className="gods:group gods:relative gods:rounded-lg gods:overflow-hidden gods:border gods:border-border gods:bg-card gods:hover:border-primary/50 gods:hover:shadow-lg gods:transition-all gods:duration-300 gods:min-h-[350px] gods:flex gods:flex-col gods:cursor-pointer"
            >
              {/* Image & Gradient */}
              <div className="gods:relative gods:h-[250px] gods:w-full gods:overflow-hidden">
                <img
                  src={getAvatar(char)}
                  alt={char.nom}
                  className="gods:w-full gods:h-full gods:object-cover gods:object-top gods:transition-transform gods:duration-700 gods:group-hover:scale-105"
                />
                {/* Dégradé qui fusionne parfaitement l'image avec le fond de la carte en bas */}
                <div className="gods:absolute gods:inset-0 gods:bg-gradient-to-t gods:from-card gods:via-card/40 gods:to-transparent" />
              </div>

              {/* Textes (superposés sur la fin du dégradé) */}
              <div className="gods:p-5 gods:text-center gods:flex-1 gods:flex gods:flex-col gods:justify-center gods:-mt-10 gods:relative gods:z-10">
                <h2 className="gods:font-[family-name:var(--gods-font-display)] gods:text-2xl gods:tracking-wider gods:uppercase gods:text-foreground gods:drop-shadow-md">
                  {char.nom}
                </h2>
                
                {(char.origine || char.instinct) && (
                  <p className="gods:text-[10px] gods:text-primary/80 gods:mt-2 gods:uppercase gods:tracking-[0.2em] gods:font-[family-name:var(--gods-font-display)]">
                    {char.origine || "Inconnu"}
                    {char.instinct ? ` • ${char.instinct}` : ""}
                  </p>
                )}
              </div>
            </a>
          ))}

        </div>
      </div>
    </div>
  );
}