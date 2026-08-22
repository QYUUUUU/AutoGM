import { createRoot } from "react-dom/client";
import App from "./App";
import { readIsAdmin } from "../shared/routes";
import "../shared/styles/fonts.css";
import "../shared/styles/tailwind.css";

const isAdmin = readIsAdmin();

const container = document.getElementById("gods-landing-root");
if (!container) {
  throw new Error(
    "[home] #gods-landing-root not found -- home.html.twig markup is out of sync with the home bundle."
  );
}

createRoot(container).render(<App isAdmin={isAdmin} />);
