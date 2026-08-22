import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import RitualsApp from "./RitualsApp";

// Import your global styles AND the new Figma theme!
import "../shared/styles/fonts.css";
import "../shared/styles/tailwind.css";
import "../shared/styles/theme.css"; 

const container = document.getElementById("gods-rituals-root");
const dataScript = document.getElementById("gods-rituals-data");

if (!container || !dataScript) {
  throw new Error("[rituals] Missing root or data script");
}

// Parse the data injected by Twig
const initialData = JSON.parse(dataScript.textContent || "{}");
const characters = initialData.characters || [];

createRoot(container).render(
  <StrictMode>
    <RitualsApp characters={characters} />
  </StrictMode>
);