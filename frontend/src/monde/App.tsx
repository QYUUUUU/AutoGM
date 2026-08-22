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
      <OriginExperience
        country={country}
        isAdmin={isAdmin}
        onExit={() => { window.location.hash = "#/monde"; }}
      />
    );
  }

  return (
    <CountryLanding
      onSelect={(id) => { window.location.hash = `#/monde/${id}`; }}
    />
  );
}
