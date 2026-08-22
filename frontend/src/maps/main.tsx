import { createRoot } from "react-dom/client";
import App from "./App";
import "../shared/styles/fonts.css";
import "../shared/styles/tailwind.css";

const container = document.getElementById("gods-maps-root");

if (!container) {
  throw new Error(
    "[maps] #gods-maps-root not found -- maps.html.twig markup is out of sync with the maps bundle."
  );
}

createRoot(container).render(<App />);