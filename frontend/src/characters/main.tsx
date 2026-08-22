import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Importation de vos bons fichiers CSS globaux !
import "../shared/styles/fonts.css";
import "../shared/styles/tailwind.css";

const container = document.getElementById("characters-root");

if (!container) {
  throw new Error("[characters] #characters-root not found -- characterslist.html.twig markup is out of sync with the characters bundle.");
}

// On récupère les données passées depuis Node/Twig
const rawData = container.getAttribute("data-characters");
const characters = rawData ? JSON.parse(rawData) : [];

createRoot(container).render(
  <StrictMode>
    <App characters={characters} />
  </StrictMode>
);