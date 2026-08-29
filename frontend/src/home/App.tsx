import { useState } from "react";
import {
  Sword, Map, Flame, Crown, Gem, Dices,
  ArrowRight, ArrowLeft,
} from "lucide-react";
import { ROUTES, ADMIN_NAV } from "../shared/routes";

const FEATURE_CARDS = [
  {
    title: "Mon Assistant",
    description: "Bénéficiez d'un assistant pour jeter vos dés et gérer vos jets en session.",
    Icon: Dices,
    href: ROUTES.assistant,
  },
  {
    title: "Mes Personnages",
    description: "Créez et gérez vos élus. Caractéristiques, compétences et autres statistiques.",
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
    img: "/images/banners/bannerbabel.jpg",
  },
  {
    name: "Lux",
    subtitle: "L'Empire du Soleil Noir",
    lore: "Née d'un coup d'État sanglant, l'Empire est le cœur d'une expansion impitoyable portée par ses redoutables légions impériales.",
    badge: "Lux",
    img: "/images/banners/bannercultedusoleil.jpg",
  },
  {
    name: "Horde",
    subtitle: "Les Nomades Exilés",
    lore: "Peuple de cavaliers fiers et redoutés du Grand Au-Delà, dont l'aura est marquée par la rigueur impitoyable de la vie sauvage.",
    badge: "Grand Au-Delà",
    img: "/images/banners/bannerhorde.jpg",
  },
  {
    name: "Aon",
    subtitle: "Archipel Pluvieux",
    lore: "Insulaires taiseux et maîtres-forgerons, ils sont les seuls de ce monde à détenir le secret de l'Acier Véritable.",
    badge: "Îles d'Aon",
    img: "/images/banners/banneraon.jpg",
  },
];

const MAPS = [
  {
    title: "Carte de Saeth",
    description: "Les Terres Sauvages, telles que relevées par les cartographes d'Empyrion.",
    img: "/images/maps/saeth.jpg",
    alt: "Carte de Saeth",
  },
  {
    title: "Le Centre du Monde (Babel)",
    description: "Cartographie détaillée de la région d'Arkadie et des jardins suspendus de Sabaah.",
    img: "/images/maps/babel.jpg",
    alt: "Carte de Babel",
  },
  {
    title: "L'Empire du Soleil Noir",
    description: "Relevé stratégique des territoires et de la cité de Lux, sous le contrôle des légions impériales.",
    img: "/images/maps/soleilnoir.jpg",
    alt: "Carte de l'Empire du Soleil Noir",
  },
];

function SectionLabel({ children }: { children: string }) {
  return (
    <span className="gods:text-xs gods:tracking-widest gods:uppercase gods:text-primary gods:font-display">
      {children}
    </span>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="gods:text-3xl gods:tracking-wider gods:uppercase gods:text-foreground gods:mt-3 gods:mb-4">
      {children}
    </h2>
  );
}

export default function App({ isAdmin = false }: { isAdmin?: boolean }) {
  const [currentMap, setCurrentMap] = useState(0);
  const prevMap = () => setCurrentMap((i) => (i - 1 + MAPS.length) % MAPS.length);
  const nextMap = () => setCurrentMap((i) => (i + 1) % MAPS.length);

  return (
    <div>
      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="gods:relative gods:min-h-[85vh] gods:pt-20 gods:flex gods:flex-col gods:items-center gods:justify-center gods:text-center gods:overflow-hidden">
        <div className="gods:absolute gods:inset-0 gods:pointer-events-none gods:select-none gods:overflow-hidden">
          <div className="gods:absolute gods:inset-0 gods:bg-gradient-to-b gods:from-primary/8 gods:via-transparent gods:to-transparent" />
          <div className="gods:absolute gods:z-0 gods:left-0 gods:bottom-0 gods:h-[100%] gods:w-auto gods:max-w-[85vw] gods:hidden gods:[@media(min-width:1350px)]:block">
            <img src="/images/background_illustration.png" alt="" aria-hidden="true" className="gods:w-auto gods:h-full gods:max-w-none gods:object-contain gods:object-left-bottom gods:opacity-90" />
          </div>
          <div className="gods:absolute gods:z-0 gods:right-0 gods:bottom-0 gods:h-[90%] gods:w-auto gods:max-w-[72vw] gods:hidden gods:[@media(min-width:1350px)]:block">
            <img src="/images/landing_llustration.png" alt="" aria-hidden="true" className="gods:w-auto gods:h-full gods:max-w-none gods:object-contain gods:object-right-bottom gods:opacity-90" />
          </div>
          <div className="gods:absolute gods:top-1/3 gods:left-1/2 gods:-translate-x-1/2 gods:-translate-y-1/2 gods:w-[700px] gods:h-[600px] gods:rounded-full gods:bg-primary/5 gods:blur-[140px]" />
        </div>

        {/* Solid opacity glass card active strictly below 1700px width */}
        <div className="gods:relative gods:z-10 gods:max-w-4xl gods:mx-auto gods:px-6 gods:py-10 gods:rounded-2xl gods:transition-all gods:duration-500 gods:bg-transparent gods:border gods:border-transparent gods:shadow-none gods:[@media(min-width:1350px)_and_(max-width:1700px)]:bg-background/90 gods:[@media(min-width:1350px)_and_(max-width:1700px)]:backdrop-blur-md gods:[@media(min-width:1350px)_and_(max-width:1700px)]:border-border/80 gods:[@media(min-width:1350px)_and_(max-width:1700px)]:shadow-2xl">
          <div className="gods:inline-flex gods:items-center gods:gap-2.5 gods:mb-10 gods:px-5 gods:py-1.5 gods:border gods:border-primary/30 gods:rounded-full gods:text-xs gods:tracking-widest gods:text-primary gods:uppercase gods:font-display">
            <span className="gods:w-1 gods:h-1 gods:rounded-full gods:bg-primary/60" />
            Plateforme de jeu de rôle
            <span className="gods:w-1 gods:h-1 gods:rounded-full gods:bg-primary/60" />
          </div>

          <h1 className="gods:text-7xl gods:md:text-9xl gods:2xl:text-[11rem] gods:tracking-[0.2em] gods:uppercase gods:text-foreground gods:leading-none gods:mb-2">
            GODS
          </h1>

          <div className="gods:flex gods:items-center gods:justify-center gods:gap-3 gods:my-8">
            <div className="gods:h-px gods:w-24 gods:bg-gradient-to-r gods:from-transparent gods:to-primary/50" />
            <Crown size={14} className="gods:text-primary/70" />
            <div className="gods:h-px gods:w-24 gods:bg-gradient-to-l gods:from-transparent gods:to-primary/50" />
          </div>

          <p className="gods:text-muted-foreground gods:max-w-lg gods:mx-auto gods:text-base gods:leading-relaxed gods:mb-12">
            La plateforme dédiée aux Maîtres du Jeu et joueurs de{" "}
            <em className="gods:text-primary gods:font-medium gods:not-italic">GODS</em>.{" "}
            Gérez vos personnages, rituels et campagnes en un seul endroit.
          </p>

          <div className="gods:flex gods:flex-col gods:sm:flex-row gods:items-center gods:justify-center gods:gap-4">
            <a
              href={ROUTES.register}
              className="gods:group gods:flex gods:items-center gods:gap-2.5 gods:px-8 gods:py-3 gods:bg-primary gods:!text-primary-foreground gods:rounded-md gods:hover:bg-primary/85 gods:transition-all gods:text-base gods:tracking-wider gods:font-display"
            >
              Commencer à jouer
              <ArrowRight size={15} className="gods:group-hover:translate-x-0.5 gods:transition-transform" />
            </a>
            <a
              href="#features"
              className="gods:flex gods:items-center gods:gap-2 gods:px-8 gods:py-3 gods:border gods:border-border gods:text-muted-foreground gods:hover:text-foreground gods:hover:border-primary/35 gods:rounded-md gods:transition-all gods:text-base gods:tracking-wider"
            >
              Découvrir les fonctionnalités
            </a>
          </div>
        </div>
      </section>

      {/* ── FEATURE CARDS ──────────────────────────────────────── */}
      <section id="features" className="gods:py-28 gods:px-6 gods:border-t gods:border-border">
        <div className="gods:max-w-7xl gods:mx-auto">
          <div className="gods:text-center gods:mb-16">
            <SectionLabel>Fonctionnalités</SectionLabel>
            <SectionTitle>Tout ce dont vous avez besoin</SectionTitle>
            <p className="gods:text-muted-foreground gods:max-w-sm gods:mx-auto gods:text-base gods:leading-relaxed">
              Des outils puissants pour enrichir chaque session de jeu.
            </p>
          </div>

          <div className="gods:grid gods:grid-cols-1 gods:sm:grid-cols-2 gods:lg:grid-cols-3 gods:gap-6">
            {FEATURE_CARDS.map((card) => (
              <a
                key={card.title}
                href={card.href}
                className="gods:group gods:relative gods:p-6 gods:xl:p-8 gods:rounded-lg gods:border gods:border-border gods:bg-card gods:hover:border-primary/40 gods:hover:shadow-md gods:transition-all gods:duration-300"
              >
                <div className="gods:inline-flex gods:p-3 gods:rounded-md gods:border gods:border-primary/20 gods:bg-primary/5 gods:text-primary gods:mb-6">
                  <card.Icon size={24} />
                </div>
                <h3 className="gods:text-xl gods:tracking-wider gods:mb-3 gods:text-foreground gods:group-hover:text-primary gods:transition-colors gods:duration-200">
                  {card.title}
                </h3>
                <p className="gods:text-muted-foreground gods:text-base gods:leading-relaxed gods:mb-8">
                  {card.description}
                </p>
                <div className="gods:flex gods:items-center gods:gap-2 gods:text-xs gods:tracking-widest gods:uppercase gods:text-muted-foreground gods:group-hover:text-primary gods:transition-colors gods:duration-200 gods:font-display">
                  Découvrir <ArrowRight size={14} className="gods:group-hover:translate-x-1 gods:transition-transform" />
                </div>
              </a>
            ))}
          </div>

          {isAdmin && (
            <div className="gods:mt-14 gods:pt-10 gods:border-t gods:border-dashed gods:border-primary/25">
              <p className="gods:text-xs gods:tracking-widest gods:uppercase gods:text-primary gods:mb-5 gods:font-display gods:flex gods:items-center gods:gap-2">
                <Crown size={12} /> Outils Maître du Jeu
              </p>
              <div className="gods:grid gods:grid-cols-1 gods:sm:grid-cols-2 gods:gap-6">
                {ADMIN_NAV.map((a) => (
                  <a
                    key={a.href}
                    href={a.href}
                    className="gods:group gods:relative gods:p-6 gods:rounded-lg gods:border gods:border-primary/20 gods:bg-primary/5 gods:hover:border-primary/40 gods:hover:shadow-md gods:transition-all gods:duration-300 gods:flex gods:items-center gods:justify-between"
                  >
                    <span className="gods:font-display gods:text-xl gods:tracking-wider gods:text-primary">
                      {a.label}
                    </span>
                    <ArrowRight size={15} className="gods:text-primary/70 gods:group-hover:translate-x-0.5 gods:transition-transform" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── COUNTRY ILLUSTRATIONS ─────────────────────────────── */}
      <section className="gods:py-28 gods:px-6 gods:border-t gods:border-border">
        <div className="gods:max-w-7xl gods:mx-auto">
          <div className="gods:mb-16">
            <SectionLabel>Le Monde</SectionLabel>
            <SectionTitle>Territoires & Royaumes</SectionTitle>
            <p className="gods:text-muted-foreground gods:text-base gods:max-w-md gods:leading-relaxed">
              Chaque région de GODS possède sa propre culture, ses dieux tutélaires et ses secrets.
            </p>
          </div>

          <div className="gods:grid gods:grid-cols-1 gods:md:grid-cols-2 gods:lg:grid-cols-4 gods:gap-6">
            {COUNTRIES.map((country) => (
              <a
                key={country.name}
                href={ROUTES.monde}
                className="gods:group gods:relative gods:p-6 gods:xl:p-8 gods:flex gods:flex-col gods:rounded-lg gods:border gods:border-border gods:bg-card gods:hover:border-primary/40 gods:hover:shadow-md gods:transition-all gods:duration-300"
              >
                <div className="gods:relative gods:w-full gods:aspect-[3/4] gods:rounded-md gods:border gods:border-border/50 gods:group-hover:border-primary/40 gods:overflow-hidden gods:mb-6 gods:transition-colors gods:duration-300">
                  <img
                    src={country.img}
                    alt={`Illustration de ${country.name}`}
                    className="gods:absolute gods:inset-0 gods:w-full gods:h-full gods:object-cover gods:object-top"
                  />
                </div>
                
                <p className="gods:text-xs gods:font-display gods:tracking-widest gods:uppercase gods:text-primary gods:mb-2">
                  {country.subtitle}
                </p>
                
                <h3 className="gods:text-xl gods:tracking-wider gods:mb-3 gods:text-foreground gods:group-hover:text-primary gods:transition-colors gods:duration-200">
                  {country.name}
                </h3>
                
                <p className="gods:text-muted-foreground gods:text-base gods:leading-relaxed gods:mb-8 gods:flex-1">
                  {country.lore}
                </p>
                
                <div className="gods:flex gods:items-center gods:gap-2 gods:text-xs gods:tracking-widest gods:uppercase gods:text-muted-foreground gods:group-hover:text-primary gods:transition-colors gods:duration-200 gods:font-display gods:mt-auto">
                  Explorer <ArrowRight size={14} className="gods:group-hover:translate-x-1 gods:transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAPS CAROUSEL ───────────────────────────────────────── */}
      <section id="cartes" className="gods:py-28 gods:px-6 gods:border-t gods:border-border">
        <div className="gods:max-w-7xl gods:mx-auto">
          <div className="gods:mb-16">
            <SectionLabel>Cartographie</SectionLabel>
            <SectionTitle>Les Cartes du Monde</SectionTitle>
            <p className="gods:text-muted-foreground gods:text-base gods:max-w-md gods:leading-relaxed">
              Des cartes détaillées de chaque région, disponibles pour vos sessions de jeu.
            </p>
          </div>

          <div className="gods:relative gods:overflow-hidden gods:rounded-lg gods:border gods:border-border gods:bg-card gods:hover:border-primary/40 gods:hover:shadow-md gods:transition-all gods:duration-300">
            <div className="gods:relative gods:aspect-video gods:bg-muted gods:overflow-hidden gods:border-b gods:border-border/50">
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
                className="gods:group gods:absolute gods:left-4 gods:top-1/2 gods:-translate-y-1/2 gods:p-2 gods:bg-transparent gods:border-0 gods:shadow-none gods:appearance-none gods:cursor-pointer gods:outline-none"
              >
                <ArrowLeft size={14} className="gods:text-foreground gods:group-hover:-translate-x-1 gods:transition-transform" />
              </button>
              <button
                onClick={nextMap}
                aria-label="Carte suivante"
                className="gods:group gods:absolute gods:right-4 gods:top-1/2 gods:-translate-y-1/2 gods:p-2 gods:bg-transparent gods:border-0 gods:shadow-none gods:appearance-none gods:cursor-pointer gods:outline-none"
              >
                <ArrowRight size={14} className="gods:text-foreground gods:group-hover:translate-x-1 gods:transition-transform" />
              </button>
            </div>

            <div className="gods:p-6 gods:xl:p-8 gods:flex gods:items-start gods:justify-between gods:gap-6">
              <a href={ROUTES.maps} className="gods:group gods:flex-1 gods:block">
                <h3 className="gods:text-xl gods:tracking-wider gods:mb-3 gods:text-foreground gods:group-hover:text-primary gods:transition-colors gods:duration-200">
                  {MAPS[currentMap].title}
                </h3>
                <p className="gods:text-muted-foreground gods:text-base gods:leading-relaxed gods:mb-8">
                  {MAPS[currentMap].description}
                </p>
                <div className="gods:flex gods:items-center gods:gap-2 gods:text-xs gods:tracking-widest gods:uppercase gods:text-muted-foreground gods:group-hover:text-primary gods:transition-colors gods:duration-200 gods:font-display">
                  Explorer <ArrowRight size={14} className="gods:group-hover:translate-x-1 gods:transition-transform" />
                </div>
              </a>

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
        </div>
      </section>
    </div>
  );
}