import { ROUTES } from "../shared/routes";

type Mode = "login" | "register";

const COPY: Record<Mode, { title: string; action: string; submit: string }> = {
  login: { title: "Connexion", action: "/auth/login", submit: "Se connecter" },
  register: { title: "Inscription", action: "/auth/register", submit: "S'inscrire" },
};

const inputClass =
  "gods:w-full gods:bg-background gods:border gods:border-border gods:text-foreground gods:rounded-md gods:px-3 gods:py-2 gods:placeholder:text-foreground/35 gods:placeholder:italic gods:placeholder:text-sm gods:focus:outline-none gods:focus:border-primary gods:focus:ring-2 gods:focus:ring-primary/20 gods:transition-colors";

const labelClass =
  "gods:block gods:text-foreground/55 gods:text-sm gods:font-medium gods:uppercase gods:tracking-wide gods:mb-1";

export default function AuthCard({ mode, error }: { mode: Mode; error?: string }) {
  const copy = COPY[mode];

  return (
    <div className="gods:relative gods:min-h-screen gods:flex gods:items-center gods:justify-center gods:px-4 gods:py-32 gods:overflow-hidden">
      {/* Same soft decorative glow used behind the hero on the home page, for visual continuity */}
      <div
        aria-hidden
        className="gods:absolute gods:top-1/3 gods:left-1/2 gods:-translate-x-1/2 gods:-translate-y-1/2 gods:w-[600px] gods:h-[500px] gods:rounded-full gods:bg-primary/5 gods:blur-[140px] gods:pointer-events-none"
      />

      <div className="gods:relative gods:z-10 gods:w-full gods:max-w-[420px] gods:bg-card gods:border gods:border-border gods:rounded-lg gods:shadow-lg">
        <div className="gods:px-6 gods:pt-6 gods:pb-4 gods:border-b gods:border-border gods:text-center">
          <h1 className="gods:font-[family-name:var(--gods-font-display)] gods:text-primary gods:text-3xl gods:tracking-wide">
            {copy.title}
          </h1>
        </div>
        <div className="gods:px-8 gods:py-8">
          <form action={copy.action} method="POST">
            {error && (
              <div
                role="alert"
                className="gods:bg-destructive/10 gods:border gods:border-destructive/30 gods:text-destructive gods:rounded-md gods:text-center gods:text-sm gods:py-2 gods:px-3 gods:mb-4"
              >
                {error}
              </div>
            )}

            {mode === "register" && (
              <div className="gods:mb-4">
                <label htmlFor="pseudo" className={labelClass}>Pseudo</label>
                <input type="text" name="pseudo" id="pseudo" required placeholder="Votre pseudo..." className={inputClass} />
              </div>
            )}

            <div className="gods:mb-4">
              <label htmlFor="email" className={labelClass}>Email</label>
              <input type="email" name="email" id="email" required placeholder="Votre email..." className={inputClass} />
            </div>

            <div className="gods:mb-2">
              <label htmlFor="password" className={labelClass}>Mot de passe</label>
              <input type="password" name="password" id="password" required placeholder="Votre mot de passe..." className={inputClass} />
            </div>

            <button
              type="submit"
              className="gods:w-full gods:mt-5 gods:bg-primary gods:hover:bg-primary/85 gods:text-primary-foreground gods:font-medium gods:uppercase gods:tracking-wide gods:font-[family-name:var(--gods-font-display)] gods:text-sm gods:rounded-md gods:py-2.5 gods:transition-all gods:cursor-pointer"
            >
              {copy.submit}
            </button>

            {mode === "login" ? (
              <p className="gods:text-center gods:text-foreground/50 gods:text-sm gods:mt-5">
                Pas encore de compte ?{" "}
                <a href={ROUTES.register} className="gods:text-primary gods:hover:text-primary/80">
                  S'inscrire
                </a>
              </p>
            ) : (
              <p className="gods:text-center gods:text-foreground/50 gods:text-sm gods:mt-5">
                Déjà un compte ?{" "}
                <a href={ROUTES.login} className="gods:text-primary gods:hover:text-primary/80">
                  Se connecter
                </a>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}