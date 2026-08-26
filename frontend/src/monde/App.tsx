import React, { useEffect, useState } from "react";
import { CountryLanding } from "./components/CountryLanding";
import { OriginExperience } from "./components/OriginExperience";
import { getCountry } from "./data/registry";

export default function App({ isAdmin }: { isAdmin: boolean }) {
  const [countryId, setCountryId] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      const match = window.location.hash.match(/^#\/monde\/([^/]+)/);
      setCountryId(match ? decodeURIComponent(match[1]) : null);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const country = countryId ? getCountry(countryId) : null;

  if (country) {
    return (
      // Changed: Removed gods:relative and gods:z-10 so the fixed modal can escape to the top
      <div className="gods:pt-16 gods:min-h-screen gods:bg-background gods:flex gods:flex-col">
        <OriginExperience
          country={country}
          isAdmin={isAdmin}
          onExit={() => { window.location.hash = "#/monde"; }}
        />
      </div>
    );
  }

  return (
    // Updated to standard wrapper (pt-16 offset, min-h-screen, flex behavior)
    <div className="gods:pt-16 gods:min-h-screen gods:bg-background gods:relative gods:z-10 gods:flex gods:flex-col">
      <CountryLanding
        onSelect={(id) => { window.location.hash = `#/monde/${id}`; }}
      />
    </div>
  );
}