import { useState } from "react";
import {
  Sword, Map, Flame, Crown, Gem, Dices,
  ArrowRight, ChevronLeft, ChevronRight,
} from "lucide-react";
import { ROUTES, ADMIN_NAV } from "../shared/routes";

// One card per real nav feature -- keep this list 1:1 with NAV_FEATURES in
// shared/routes.ts so nothing advertised on the homepage is ever a dead end.
const FEATURE_CARDS = [
  {
    title: "Mon Assistant",
    description: "Bénéficiez d'un assistant pour jeter vos dés et gérer vos jets en session.",
    Icon: Dices,
    href: ROUTES.assistant,
  },
  {
    title: "Mes Personnages",
    description: "Créez et gérez vos héros divins. Statistiques, compétences, et historique au fil de vos campagnes.",
    Icon: Sword,
    href: ROUTES.characters,
  },
  {
    title: "Les Cartes",
    description: "Naviguez entre les royaumes divins et mortels. Cartes interactives des Terres Sauvages.",
    Icon: Map,
    href: ROUTES.maps,
  },
  {
    title: "Rituels",
    description: "Maîtrisez l'art des rituels sacrés. Invoquez des pouvoirs anciens et façonnez votre destin.",
    Icon: Flame,
    href: ROUTES.rituels,
  },
  {
    title: "Le monde",
    description: "Explorez les différents royaumes et territoires des terres sauvages.",
    Icon: Map,
    href: ROUTES.monde,
  },
  {
    title: "Éclats",
    description: "Suivez et dépensez vos éclats de divinité durement gagnés.",
    Icon: Gem,
    href: ROUTES.eclats,
  },
];

const COUNTRIES = [
  {
    name: "Babel",
    subtitle: "Le Centre du Monde",
    lore: "Royaume d'une richesse et d'une influence inégalées, dont la culture rayonne en mêlant traditions anciennes et innovations.",
    badge: "Arkadie",
    img: "/images/banners/bannerbabel.png",
  },
  {
    name: "Empire du Soleil Noir",
    subtitle: "Théocratie Militaire",
    lore: "Née d'un coup d'État sanglant, l'Empire est le cœur d'une expansion impitoyable portée par ses redoutables légions impériales.",
    badge: "Lux",
    img: "/images/banners/bannercultedusoleil.png",
  },
  {
    name: "Horde",
    subtitle: "Les Nomades Exilés",
    lore: "Peuple de cavaliers fiers et redoutés du Grand Au-Delà, dont l'aura est marquée par la rigueur impitoyable de la vie sauvage.",
    badge: "Grand Au-Delà",
    img: "/images/banners/bannerhorde.png",
  },
  {
    name: "Aon",
    subtitle: "Archipel Pluvieux",
    lore: "Insulaires taiseux et maîtres-forgerons, ils sont les seuls de ce monde à détenir le secret de l'Acier Véritable.",
    badge: "Îles d'Aon",
    img: "/images/banners/banneraon.png",
  },
];

// Replaced placeholders with your actual map assets
const MAPS = [
  {
    title: "Carte de Saeth",
    description: "Les Terres Sauvages, telles que relevées par les cartographes d'Empyrion.",
    img: "/images/maps/saeth.png",
    alt: "Carte de Saeth",
  },
  {
    title: "Le Centre du Monde (Babel)",
    description: "Cartographie détaillée de la région d'Arkadie et des jardins suspendus de Sabaah.",
    img: "/images/maps/babel.png",
    alt: "Carte de Babel",
  },
  {
    title: "L'Empire du Soleil Noir",
    description: "Relevé stratégique des territoires et de la cité de Lux, sous le contrôle des légions impériales.",
    img: "/images/maps/soleilnoir.png",
    alt: "Carte de l'Empire du Soleil Noir",
  },
];

function SectionLabel({ children }: { children: string }) {
  return (
    <span className="gods:text-[10px] gods:tracking-[0.35em] gods:uppercase gods:text-primary/80 gods:font-[family-name:var(--gods-font-display)]">
      {children}
    </span>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="gods:font-[family-name:var(--gods-font-display)] gods:text-3xl gods:md:text-4xl gods:tracking-widest gods:uppercase gods:text-foreground gods:mt-3 gods:mb-4">
      {children}
    </h2>
  );
}

export default function App({ isAdmin = false }: { isAdmin?: boolean }) {
  const [currentMap, setCurrentMap] = useState(0);
  const prevMap = () => setCurrentMap((i) => (i - 1 + MAPS.length) % MAPS.length);
  const nextMap = () => setCurrentMap((i) => (i + 1) % MAPS.length);

  return (
    <div className="gods:font-[family-name:var(--gods-font-body)]">
      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="gods:relative gods:min-h-[85vh] gods:flex gods:flex-col gods:items-center gods:justify-center gods:px-6 gods:text-center gods:overflow-hidden">        <div className="gods:absolute gods:inset-0 gods:pointer-events-none gods:select-none gods:overflow-hidden">
        {/* Existing ambient glow */}
        <div className="gods:absolute gods:inset-0 gods:bg-gradient-to-b gods:from-[#E8C97A]/12 gods:via-transparent gods:to-transparent" />

        {/* Left background illustration (Hidden below 1250px) */}
        <div
          className="
            gods:absolute
            gods:z-0
            gods:left-0
            gods:bottom-0
            gods:h-[100%]
            gods:w-auto
            gods:max-w-[85vw]
            gods:pointer-events-none
            gods:select-none
            gods:hidden
            gods:[@media(min-width:1250px)]:block
          "
        >
          <img
            src="/images/background_illustration.png"
            alt=""
            aria-hidden="true"
            className="
              gods:w-auto
              gods:h-full
              gods:max-w-none
              gods:object-contain
              gods:object-left-bottom
              gods:opacity-90
            "
          />
        </div>

        {/* Landing illustration (Right) (Hidden below 1250px) */}
        <div
          className="
            gods:absolute
            gods:z-0
            gods:right-0
            gods:bottom-0
            gods:h-[90%]
            gods:w-auto
            gods:max-w-[72vw]
            gods:pointer-events-none
            gods:select-none
            gods:hidden
            gods:[@media(min-width:1250px)]:block
          "
        >
          <img
            src="/images/landing_llustration.png"
            alt=""
            aria-hidden="true"
            className="
              gods:w-auto
              gods:h-full
              gods:max-w-none
              gods:object-contain
              gods:object-right-bottom
              gods:opacity-90
            "
          />
        </div>

        {/* Existing glow */}
        <div className="gods:absolute gods:top-1/3 gods:left-1/2 gods:-translate-x-1/2 gods:-translate-y-1/2 gods:w-[700px] gods:h-[600px] gods:rounded-full gods:bg-primary/5 gods:blur-[140px]" />
      </div>

        {/* Text container: adds a background glass box when screen width is below 1620px */}
        <div className="gods:relative gods:z-10 gods:max-w-4xl gods:mx-auto gods:px-6 gods:py-10 gods:rounded-2xl gods:transition-all gods:[@media(max-width:1620px)]:bg-background/70 gods:[@media(max-width:1620px)]:backdrop-blur-md gods:[@media(max-width:1620px)]:border gods:[@media(max-width:1620px)]:border-border/60 gods:[@media(max-width:1620px)]:shadow-2xl">
          <div className="gods:inline-flex gods:items-center gods:gap-2.5 gods:mb-10 gods:px-5 gods:py-1.5 gods:border gods:border-primary/30 gods:rounded-full gods:text-[10px] gods:tracking-[0.3em] gods:text-primary/80 gods:uppercase gods:font-[family-name:var(--gods-font-display)]">
            <span className="gods:w-1 gods:h-1 gods:rounded-full gods:bg-primary/60" />
            Plateforme de jeu de rôle
            <span className="gods:w-1 gods:h-1 gods:rounded-full gods:bg-primary/60" />
          </div>

          <h1 className="gods:font-[family-name:var(--gods-font-display)] gods:text-[clamp(5rem,18vw,11rem)] gods:tracking-[0.2em] gods:uppercase gods:text-foreground gods:leading-none gods:mb-2">
            GODS
          </h1>

          <div className="gods:flex gods:items-center gods:justify-center gods:gap-3 gods:my-8">
            <div className="gods:h-px gods:w-24 gods:bg-gradient-to-r gods:from-transparent gods:to-primary/50" />
            <Crown size={14} className="gods:text-primary/70" />
            <div className="gods:h-px gods:w-24 gods:bg-gradient-to-l gods:from-transparent gods:to-primary/50" />
          </div>

          <p className="gods:text-foreground/72 gods:max-w-lg gods:mx-auto gods:text-xl gods:leading-relaxed gods:mb-12">
            La plateforme dédiée aux Maîtres du Jeu et joueurs de{" "}
            <em className="gods:text-primary gods:font-medium gods:not-italic">GODS</em>.{" "}
            Gérez vos personnages, rituels et campagnes en un seul endroit.
          </p>

          <div className="gods:flex gods:flex-col gods:sm:flex-row gods:items-center gods:justify-center gods:gap-4">
            <a
              href={ROUTES.register}
              className="gods:group gods:flex gods:items-center gods:gap-2.5 gods:px-8 gods:py-3 gods:bg-primary gods:!text-primary-foreground gods:rounded-md gods:font-medium gods:hover:bg-primary/85 gods:transition-all gods:text-sm gods:tracking-wider gods:font-[family-name:var(--gods-font-display)]"
            >
              Commencer à jouer
              <ArrowRight size={15} className="gods:group-hover:translate-x-0.5 gods:transition-transform" />
            </a>
            <a
              href="#features"
              className="gods:flex gods:items-center gods:gap-2 gods:px-8 gods:py-3 gods:border gods:border-border gods:text-foreground/65 gods:hover:text-foreground gods:hover:border-primary/35 gods:rounded-md gods:transition-all gods:text-sm gods:tracking-wider"
            >
              Découvrir les fonctionnalités
            </a>
          </div>
        </div>
      </section>

      {/* ── FEATURE CARDS ──────────────────────────────────────── */}
      <section id="features" className="gods:py-28 gods:px-6 gods:border-t gods:border-border">
        <div className="gods:max-w-6xl gods:mx-auto">
          <div className="gods:text-center gods:mb-20">
            <SectionLabel>Fonctionnalités</SectionLabel>
            <SectionTitle>Tout ce dont vous avez besoin</SectionTitle>
            <p className="gods:text-foreground/65 gods:max-w-sm gods:mx-auto gods:text-base gods:leading-relaxed">
              Des outils puissants pour enrichir chaque session de jeu.
            </p>
          </div>

          <div className="gods:grid gods:grid-cols-1 gods:sm:grid-cols-2 gods:lg:grid-cols-3 gods:gap-5">
            {FEATURE_CARDS.map((card) => (
              <a
                key={card.title}
                href={card.href}
                className="gods:group gods:relative gods:p-8 gods:rounded-lg gods:border gods:border-border gods:bg-card gods:hover:border-primary/40 gods:hover:shadow-lg gods:transition-all gods:duration-300"
              >
                <div className="gods:inline-flex gods:p-3 gods:rounded-md gods:border gods:border-primary/20 gods:bg-primary/5 gods:text-primary gods:mb-6">
                  <card.Icon size={24} /> {/* Icon size increased slightly */}
                </div>
                <h3 className="gods:font-[family-name:var(--gods-font-display)] gods:text-2xl gods:tracking-wide gods:mb-3 gods:text-foreground gods:group-hover:text-primary gods:transition-colors gods:duration-200">
                  {card.title}
                </h3>
                <p className="gods:text-foreground/75 gods:text-lg gods:leading-relaxed gods:mb-8">
                  {card.description}
                </p>
                <div className="gods:flex gods:items-center gods:gap-2 gods:text-xs gods:tracking-[0.2em] gods:uppercase gods:text-foreground/60 gods:group-hover:text-primary gods:transition-colors gods:duration-200 gods:font-[family-name:var(--gods-font-display)]">
                  Découvrir <ArrowRight size={14} className="gods:group-hover:translate-x-1 gods:transition-transform" />
                </div>
              </a>
            ))}
          </div>

          {isAdmin && (
            <div className="gods:mt-14 gods:pt-10 gods:border-t gods:border-dashed gods:border-primary/25">
              <p className="gods:text-[10px] gods:tracking-[0.3em] gods:uppercase gods:text-amber-700/80 gods:mb-5 gods:font-[family-name:var(--gods-font-display)] gods:flex gods:items-center gods:gap-2">
                <Crown size={12} /> Outils Maître du Jeu
              </p>
              <div className="gods:grid gods:grid-cols-1 gods:sm:grid-cols-2 gods:gap-5">
                {ADMIN_NAV.map((a) => (
                  <a
                    key={a.href}
                    href={a.href}
                    className="gods:group gods:relative gods:p-6 gods:rounded-lg gods:border gods:border-amber-700/25 gods:bg-amber-700/5 gods:hover:border-amber-700/50 gods:transition-all gods:duration-300 gods:flex gods:items-center gods:justify-between"
                  >
                    <span className="gods:font-[family-name:var(--gods-font-display)] gods:text-base gods:tracking-wide gods:text-amber-800">
                      {a.label}
                    </span>
                    <ArrowRight size={15} className="gods:text-amber-700/70 gods:group-hover:translate-x-0.5 gods:transition-transform" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── COUNTRY ILLUSTRATIONS (Vertical Banners) ── */}
      <section className="gods:py-28 gods:px-6 gods:border-t gods:border-border">
        <div className="gods:max-w-6xl gods:mx-auto">
          <div className="gods:mb-16">
            <SectionLabel>Le Monde</SectionLabel>
            <SectionTitle>Territoires & Royaumes</SectionTitle>
            <p className="gods:text-foreground/65 gods:text-base gods:max-w-md gods:leading-relaxed">
              Chaque région de GODS possède sa propre culture, ses dieux tutélaires et ses secrets.
            </p>
          </div>

          <div className="gods:grid gods:grid-cols-2 gods:md:grid-cols-4 gods:gap-4">
            {COUNTRIES.map((country) => (
              <a
                key={country.name}
                href={ROUTES.monde}
                className="gods:group gods:relative gods:overflow-hidden gods:rounded-lg gods:border gods:border-border gods:bg-muted gods:aspect-[9/16] gods:flex gods:flex-col gods:justify-end gods:cursor-pointer"
              >
                <img
                  src={country.img}
                  alt={`Illustration de ${country.name}`}
                  className="gods:absolute gods:inset-0 gods:w-full gods:h-full gods:object-cover gods:object-top gods:transition-transform gods:duration-700 gods:group-hover:scale-105"
                />
                
                <div className="gods:absolute gods:inset-0 gods:bg-gradient-to-t gods:from-black gods:via-black/80 gods:to-transparent" />
                
                {/* Le conteneur de texte */}
                <div className="gods:relative gods:z-10 gods:p-6 gods:flex gods:flex-col">
                  
                  {/* Badge */}
                  <div className="gods:mb-3">
                    <span className="gods:inline-block gods:px-2.5 gods:py-1 gods:rounded-full gods:text-[11px] gods:tracking-widest gods:uppercase gods:border gods:border-primary/50 gods:text-primary gods:bg-primary/20 gods:backdrop-blur-sm gods:font-[family-name:var(--gods-font-display)] gods:shadow-md">
                      {country.badge}
                    </span>
                  </div>
                  
                  {/* Titre : Hauteur fixe (4.5rem) et aligné en bas (items-end) 
                      Cela garantit que les titres à 1 ou 2 lignes se terminent tous exactement à la même hauteur ! */}
                  <div className="gods:h-[4.5rem] gods:flex gods:items-end gods:mb-2">
                    <h3 className="gods:font-[family-name:var(--gods-font-display)] gods:text-3xl gods:tracking-wider gods:text-white gods:leading-tight gods:drop-shadow-lg">
                      {country.name}
                    </h3>
                  </div>
                  
                  {/* Sous-titre */}
                  <p className="gods:text-xs gods:text-white/90 gods:font-[family-name:var(--gods-font-display)] gods:tracking-wider gods:uppercase gods:drop-shadow-md">
                    {country.subtitle}
                  </p>
                  
                  {/* Lore : Wrapper avec hauteur fixe (6rem) 
                      Le texte est toujours là (invisible), mais la carte garde la même proportion. */}
                  <div className="gods:h-[6rem] gods:mt-4">
                    <p className="gods:text-sm gods:text-white/90 gods:leading-relaxed gods:opacity-0 gods:group-hover:opacity-100 gods:transition-opacity gods:duration-300 gods:line-clamp-4 gods:drop-shadow-md">
                      {country.lore}
                    </p>
                  </div>

                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAPS CAROUSEL ───────────────────────────────────────── */}
      <section id="cartes" className="gods:py-28 gods:px-6 gods:border-t gods:border-border">
        <div className="gods:max-w-6xl gods:mx-auto">
          <div className="gods:mb-12">
            <SectionLabel>Cartographie</SectionLabel>
            <SectionTitle>Les Cartes du Monde</SectionTitle>
            <p className="gods:text-foreground/65 gods:text-base gods:max-w-md gods:leading-relaxed">
              Des cartes détaillées de chaque région, disponibles pour vos sessions de jeu.
            </p>
          </div>

          <div className="gods:relative gods:overflow-hidden gods:rounded-lg gods:border gods:border-border gods:bg-card">
            <div className="gods:relative gods:aspect-[2/1] gods:bg-muted gods:overflow-hidden">
              {MAPS.map((map, i) => (
                <img
                  key={map.title}
                  src={map.img}
                  alt={map.alt}
                  className={`gods:absolute gods:inset-0 gods:w-full gods:h-full gods:object-cover gods:transition-opacity gods:duration-500 ${
                    i === currentMap ? "gods:opacity-100" : "gods:opacity-0"
                  }`}
                />
              ))}
              <button
                onClick={prevMap}
                aria-label="Carte précédente"
                className="gods:absolute gods:left-4 gods:top-1/2 gods:-translate-y-1/2 gods:p-2.5 gods:rounded-full gods:bg-background/80 gods:border gods:border-border gods:text-foreground/65 gods:hover:text-foreground gods:hover:bg-background gods:transition-all gods:backdrop-blur-sm gods:cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextMap}
                aria-label="Carte suivante"
                className="gods:absolute gods:right-4 gods:top-1/2 gods:-translate-y-1/2 gods:p-2.5 gods:rounded-full gods:bg-background/80 gods:border gods:border-border gods:text-foreground/65 gods:hover:text-foreground gods:hover:bg-background gods:transition-all gods:backdrop-blur-sm gods:cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="gods:p-6 gods:flex gods:items-start gods:justify-between gods:gap-6">
              <div>
                <h3 className="gods:font-[family-name:var(--gods-font-display)] gods:text-lg gods:tracking-wide gods:text-foreground gods:mb-1">
                  {MAPS[currentMap].title}
                </h3>
                <p className="gods:text-foreground/65 gods:text-base gods:leading-relaxed">{MAPS[currentMap].description}</p>
              </div>
              <div className="gods:flex gods:items-center gods:gap-2 gods:pt-1 gods:shrink-0">
                {MAPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentMap(i)}
                    aria-label={`Carte ${i + 1}`}
                    className={`gods:rounded-full gods:transition-all gods:duration-200 gods:cursor-pointer ${
                      i === currentMap ? "gods:w-5 gods:h-2 gods:bg-primary" : "gods:w-2 gods:h-2 gods:bg-border gods:hover:bg-muted-foreground/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="gods:mt-6 gods:text-center">
            <a
              href={ROUTES.maps}
              className="gods:inline-flex gods:items-center gods:gap-2 gods:text-sm gods:text-primary gods:hover:text-primary/80 gods:transition-colors gods:font-[family-name:var(--gods-font-display)] gods:tracking-wide"
            >
              Voir toutes les cartes <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}