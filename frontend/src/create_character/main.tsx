import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CharacterCreationApp from "./CharacterCreationApp";

// Import de vos styles globaux et du thème Figma
import "../shared/styles/fonts.css";
import "../shared/styles/tailwind.css";
import "../shared/styles/theme.css"; 

// Import des données statiques (Lore du jeu)
import { originData, signData, instinctData } from "./data/characterData";

// 1. Récupération des éléments du DOM
const container = document.getElementById("character-creation-root");
const dataScript = document.getElementById("character-creation-data");

if (!container || !dataScript) {
  throw new Error("[character-creation] Missing root or data script");
}

// 2. Parsing des données dynamiques (Base de données via Twig)
const initialData = JSON.parse(dataScript.textContent || "{}");

// 3. Rendu de l'application React
createRoot(container).render(
  <StrictMode>
    <CharacterCreationApp
      equipmentList={initialData.equipmentList || []}
      originData={originData}
      signData={signData}
      instinctData={instinctData}
    />
  </StrictMode>
);