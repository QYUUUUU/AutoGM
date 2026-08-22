import React from "react";
import { ChevronDown } from "lucide-react";
import { cls } from "../utils/classNames";

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="gods:text-[11px] gods:tracking-[.22em] gods:uppercase gods:text-foreground/50 gods:font-[family-name:var(--font-display)] gods:font-semibold gods:mb-2">
      {children}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="gods:block"><Label>{label}</Label>{children}</label>;
}

export function Select({ value, onChange, children, className = "" }: any) {
  return (
    <div className="gods:relative">
      <select
        value={value}
        onChange={onChange}
        className={cls(
          "gods:w-full gods:appearance-none gods:bg-input-background gods:border gods:border-border gods:rounded-md gods:px-3 gods:py-2.5 gods:pr-8 gods:text-foreground gods:outline-none focus:gods:border-primary/45",
          className,
        )}
      >
        {children}
      </select>
      <ChevronDown size={13} className="gods:pointer-events-none gods:absolute gods:right-3 gods:top-1/2 gods:-translate-y-1/2 gods:text-foreground/35" />
    </div>
  );
}

export function Button({ children, variant = "default", className = "", ...props }: any) {
  const styles: Record<string, string> = {
    default: "gods:border gods:border-border gods:text-foreground/70 hover:gods:text-foreground hover:gods:border-primary/35",
    primary: "gods:bg-primary gods:text-primary-foreground hover:gods:bg-primary/85",
    danger: "gods:border gods:border-destructive/35 gods:text-destructive hover:gods:bg-destructive/10",
    gold: "gods:bg-primary/12 gods:border gods:border-primary/35 gods:text-primary hover:gods:bg-primary/20",
  };

  return (
    <button
      {...props}
      className={cls(
        "gods:inline-flex gods:items-center gods:justify-center gods:gap-2 gods:rounded-md gods:px-3 gods:py-2 gods:text-sm gods:font-[family-name:var(--font-display)] gods:tracking-wide gods:transition-all disabled:gods:opacity-35",
        styles[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Panel({
  title,
  icon,
  children,
  className = "",
  contentClassName = "",
}: any) {
  return (
    <section
      className={cls(
        "gods:border gods:border-border gods:bg-card/35 gods:rounded-lg gods:overflow-hidden",
        className
      )}
    >
      <header className="gods:px-4 gods:py-3 gods:border-b gods:border-border gods:flex gods:items-center gods:gap-2">
        <span className="gods:text-primary">{icon}</span>
        <h2 className="gods:text-sm gods:tracking-[.14em] gods:uppercase gods:font-[family-name:var(--font-display)] gods:text-foreground">
          {title}
        </h2>
      </header>

      <div className={cls("gods:p-4", contentClassName)}>
        {children}
      </div>
    </section>
  );
}

export const inputClass = "gods:w-full gods:bg-input-background gods:border gods:border-border gods:rounded-md gods:px-3 gods:py-2.5 gods:text-foreground gods:outline-none focus:gods:border-primary/45";
