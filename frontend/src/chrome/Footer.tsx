import { ROUTES, NAV_FEATURES, ADMIN_NAV } from "../shared/routes";

export default function Footer({ isAdmin = false }: { isAdmin?: boolean }) {
  const allNavFeatures = isAdmin ? [...NAV_FEATURES, ...ADMIN_NAV] : NAV_FEATURES;

  return (
    <footer className="gods:border-t gods:border-border gods:py-14 gods:px-6 gods:bg-background">
      <div className="gods:max-w-7xl gods:mx-auto gods:grid gods:grid-cols-1 gods:md:grid-cols-3 gods:gap-10 gods:md:gap-6">
        <div>
          <span className="gods:font-display gods:text-3xl gods:tracking-wider gods:uppercase gods:text-primary gods:block gods:mb-2">
            GODS
          </span>
          <p className="gods:text-base gods:text-muted-foreground gods:leading-relaxed gods:max-w-[16rem]">
            La plateforme dédiée aux aventuriers et Maîtres du Jeu du jeu de rôle GODS.
          </p>
        </div>
        <div className="gods:md:col-span-2">
          <p className="gods:text-xs gods:text-muted-foreground gods:tracking-widest gods:uppercase gods:font-display gods:mb-4">
            Navigation
          </p>
          <div className="gods:grid gods:grid-cols-2 gods:sm:grid-cols-4 gods:gap-4">
            {allNavFeatures.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="gods:text-base gods:font-medium !gods:text-foreground gods:hover:!text-primary gods:transition-colors gods:py-1"
              >
                {link.label}
              </a>
            ))}
            <a
              href={ROUTES.login}
              className="gods:text-base gods:font-medium !gods:text-foreground gods:hover:!text-primary gods:transition-colors gods:py-1"
            >
              Se connecter
            </a>
            <a
              href={ROUTES.register}
              className="gods:text-base gods:font-medium !gods:text-foreground gods:hover:!text-primary gods:transition-colors gods:py-1"
            >
              Créer un compte
            </a>
          </div>
        </div>
      </div>
      <div className="gods:max-w-7xl gods:mx-auto gods:mt-12 gods:pt-6 gods:border-t gods:border-border gods:flex gods:flex-col gods:sm:flex-row gods:items-center gods:justify-between gods:gap-4">
        <p className="gods:text-xs gods:text-muted-foreground gods:tracking-widest">
          © 2026 GODS Platform. Tous droits réservés.
        </p>
        <div className="gods:flex gods:items-center gods:gap-1.5 gods:text-xs gods:text-muted-foreground gods:tracking-widest">
          <span className="gods:w-1 gods:h-1 gods:rounded-full gods:bg-primary/50 gods:inline-block" />
          <span>Fait pour les dieux, joué par des mortels.</span>
          <span className="gods:w-1 gods:h-1 gods:rounded-full gods:bg-primary/50 gods:inline-block" />
        </div>
      </div>
    </footer>
  );
}