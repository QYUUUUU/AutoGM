import React from "react";
import { countries } from "../data/registry";

export function CountryLanding({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <main className="monde-landing">
      <div className="monde-landing-noise" />
      <header className="monde-landing-header">
        <div>
          <span className="monde-eyebrow">GODS / LE MONDE</span>
          <h1>Les Terres Sauvages</h1>
          <p>Choisissez une terre pour entrer dans son histoire.</p>
        </div>
        <span className="monde-count">{Object.keys(countries).length} territoires</span>
      </header>

      <section className="country-grid">
        {Object.values(countries).map((country, i) => (
          <button
            key={country.id}
            className={`country-card ${country.authored ? "is-authored" : "is-locked"}`}
            onClick={() => country.authored && onSelect(country.id)}
            disabled={!country.authored}
            style={{ ["--i" as string]: i }}
          >
            <span className="country-index">{String(i + 1).padStart(2, "0")}</span>
            <span className="country-name">{country.name}</span>
            <span className="country-region">{country.authored ? country.region : "À venir"}</span>
            <span className="country-arrow">{country.authored ? "↗" : "—"}</span>
          </button>
        ))}
      </section>
    </main>
  );
}
