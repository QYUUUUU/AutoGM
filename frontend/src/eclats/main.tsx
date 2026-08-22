import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import EclatsApp from "./EclatsApp";

// Import des styles globaux et du thème
import "../shared/styles/fonts.css";
import "../shared/styles/tailwind.css";
import "../shared/styles/theme.css"; 

// 1. Cibler les éléments injectés par le template Twig (eclats.html.twig)
const container = document.getElementById("gods-eclats-root");
const dataScript = document.getElementById("gods-eclats-data");

if (!container || !dataScript) {
  throw new Error("[eclats] Missing root or data script in the DOM.");
}

// 2. Récupérer et parser les données initiales
const initialData = JSON.parse(dataScript.textContent || "{}");

// On sécurise les tableaux au cas où la base de données renverrait null
const eclats = initialData.eclats || [];
const characters = initialData.characters || [];

// 3. Monter l'application React
createRoot(container).render(
  <StrictMode>
    <EclatsApp
      eclats={eclats}
      characters={characters}
    />
  </StrictMode>
);