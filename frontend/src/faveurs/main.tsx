import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import FaveursApp from "./FaveursApp";

// Import des styles globaux et du thème (identique au dashboard)
import "../shared/styles/fonts.css";
import "../shared/styles/tailwind.css";
import "../shared/styles/theme.css"; 

// 1. Cibler les éléments injectés par le template Twig (faveurs.html.twig)
const container = document.getElementById("gods-faveurs-root");
const dataScript = document.getElementById("gods-faveurs-data");

if (!container || !dataScript) {
  throw new Error("[faveurs] Missing root or data script in the DOM.");
}

// 2. Récupérer et parser les données initiales
const initialData = JSON.parse(dataScript.textContent || "{}");

// On sécurise les tableaux au cas où la base de données renverrait null
const faveurs = initialData.faveurs || [];
const characters = initialData.characters || [];

// 3. Monter l'application React
createRoot(container).render(
  <StrictMode>
    <FaveursApp
      faveurs={faveurs}
      characters={characters}
    />
  </StrictMode>
);