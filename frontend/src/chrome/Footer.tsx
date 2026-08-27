export default function Footer() {
  return (
    <footer className="gods:border-t gods:border-border gods:px-6 gods:py-6">
      <div className="gods:max-w-7xl gods:mx-auto gods:flex gods:flex-col gods:sm:flex-row gods:items-center gods:justify-between gods:gap-3">
        <span className="gods:font-display gods:text-sm gods:tracking-widest gods:uppercase gods:text-muted-foreground">
          GODS
        </span>

        <p className="gods:text-xs gods:text-muted-foreground">
          © 2026 GODS Platform
        </p>

        <span className="gods:hidden gods:sm:inline gods:text-xs gods:text-muted-foreground">
          Fait pour les dieux, joué par des mortels.
        </span>
      </div>
    </footer>
  );
}