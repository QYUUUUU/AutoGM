import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { ROUTES, NAV_FEATURES, ADMIN_NAV } from "../shared/routes";

export default function Header({ isAdmin = false }: { isAdmin?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const allNavFeatures = isAdmin ? [...NAV_FEATURES, ...ADMIN_NAV] : NAV_FEATURES;
  const isAdminHref = (href: string) => ADMIN_NAV.some((a) => a.href === href);

  return (
    <header
      className={`gods:fixed gods:top-0 gods:left-0 gods:right-0 gods:z-50 gods:transition-all gods:duration-500 ${
        scrolled
          ? "gods:bg-background/95 gods:backdrop-blur-md gods:border-b gods:border-border gods:shadow-sm"
          : "gods:bg-transparent gods:border-b gods:border-transparent"
      }`}
    >
      <nav className="gods:max-w-7xl gods:mx-auto gods:px-6 gods:flex gods:items-center gods:justify-between gods:h-16">
        <a
          href={ROUTES.home}
          className="gods:font-[family-name:var(--gods-font-display)] gods:text-2xl gods:tracking-[0.25em] gods:text-primary gods:font-bold gods:uppercase gods:select-none"
        >
          GODS
        </a>

        {/* Desktop Navigation */}
        <div className="gods:hidden gods:lg:flex gods:items-center gods:gap-2">
          {allNavFeatures.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`gods:px-3 gods:py-2 gods:text-[15px] gods:font-medium gods:rounded-md gods:transition-colors ${
                isAdminHref(link.href)
                  ? "gods:text-amber-700 gods:hover:bg-muted"
                  : "gods:text-foreground/80 gods:hover:text-foreground gods:hover:bg-muted"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="gods:hidden gods:lg:flex gods:items-center gods:gap-3">
          <a
            href={ROUTES.login}
            className="gods:px-4 gods:py-1.5 gods:text-[15px] gods:font-medium gods:text-foreground/80 gods:hover:text-foreground gods:border gods:border-border gods:hover:border-primary/40 gods:rounded-md gods:transition-all gods:tracking-wide"
          >
            Se connecter
          </a>
          <a
            href={ROUTES.register}
            className="gods:px-4 gods:py-1.5 gods:text-[15px] gods:bg-primary gods:!text-primary-foreground gods:hover:bg-primary/85 gods:rounded-md gods:transition-colors gods:font-semibold gods:tracking-wide"
          >
            Créer un compte
          </a>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="gods:lg:hidden gods:p-2 gods:text-foreground/80 gods:hover:text-foreground gods:transition-colors gods:bg-transparent gods:border-0 gods:cursor-pointer"
          aria-label="Menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={`gods:lg:hidden gods:bg-background gods:border-b gods:border-border gods:overflow-hidden gods:transition-all gods:duration-300 ${
          menuOpen ? "gods:max-h-screen" : "gods:max-h-0"
        }`}
      >
        <div className="gods:px-6 gods:py-4 gods:space-y-0.5">
          {allNavFeatures.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`gods:block gods:px-3 gods:py-2.5 gods:text-[15px] gods:font-medium gods:rounded-md gods:transition-colors ${
                isAdminHref(link.href)
                  ? "gods:text-amber-700 gods:hover:bg-muted"
                  : "gods:text-foreground/80 gods:hover:text-foreground gods:hover:bg-muted"
              }`}
            >
              {link.label}
            </a>
          ))}
          <div className="gods:pt-4 gods:mt-3 gods:border-t gods:border-border gods:flex gods:flex-col gods:gap-2">
            <a
              href={ROUTES.login}
              className="gods:block gods:px-3 gods:py-2.5 gods:text-[15px] gods:font-medium gods:text-center gods:border gods:border-border gods:rounded-md gods:text-foreground/80 gods:hover:text-foreground gods:transition-colors"
            >
              Se connecter
            </a>
            <a
              href={ROUTES.register}
              className="gods:block gods:px-3 gods:py-2.5 gods:text-[15px] gods:text-center gods:bg-primary gods:!text-primary-foreground gods:rounded-md gods:font-semibold"
            >
              Créer un compte
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}