import { createRoot } from "react-dom/client";
import App from "./App";
import { readIsAdmin } from "../shared/routes";
import "../shared/styles/fonts.css";
import "../shared/styles/tailwind.css";
import "./styles/scrollytelling.css";
import "./styles/landing.css";

const container = document.getElementById("gods-monde-root");
if (!container) throw new Error("[monde] #gods-monde-root not found.");

createRoot(container).render(<App isAdmin={readIsAdmin()} />);
