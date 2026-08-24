import React from "react";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="gods:text-xs gods:tracking-widest gods:uppercase gods:text-primary gods:font-display">
      {children}
    </span>
  );
}

export function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="gods:text-3xl gods:tracking-wider gods:uppercase gods:text-foreground gods:mt-3 gods:mb-4">
      {children}
    </h1>
  );
}

export function PageDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="gods:text-base gods:text-muted-foreground gods:leading-relaxed gods:max-w-2xl">
      {children}
    </p>
  );
}