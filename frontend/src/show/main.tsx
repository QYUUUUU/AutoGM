import { createRoot } from "react-dom/client";
import App from "./BabelExperience";
import { readIsAdmin } from "../shared/routes";

const container = document.getElementById("gods-show-root");
if (!container) throw new Error("[show] #gods-show-root not found.");

createRoot(container).render(<App/>);
