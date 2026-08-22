import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CharacterSheetApp from "./CharacterSheetApp";

// Global styles + the shared Figma theme
import "../shared/styles/fonts.css";
import "../shared/styles/tailwind.css";
import "../shared/styles/theme.css";

const container = document.getElementById("gods-character-root");
const dataScript = document.getElementById("gods-character-data");

if (!container || !dataScript) {
  throw new Error("[character] Missing root or data script");
}

const initialData = JSON.parse(dataScript.textContent || "{}");
const rawChar = initialData.character || {};

const safeParse = (data: any) => (typeof data === "string" ? JSON.parse(data || "[]") : data || []);

const safeCharacter = {
  ...rawChar,
  inventory: safeParse(rawChar.inventory),
  langues: safeParse(rawChar.langues),
  specialites: safeParse(rawChar.specialites),
  rituelsMaitrises: safeParse(rawChar.rituelsMaitrises),
  capacitesEclat: safeParse(rawChar.capacitesEclat),
  faveurs: safeParse(rawChar.faveurs),
};

createRoot(container).render(
  <StrictMode>
    <CharacterSheetApp initialCharacter={safeCharacter} />
  </StrictMode>
);