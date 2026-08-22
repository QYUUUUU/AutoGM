import { createRoot } from "react-dom/client";
import AuthCard from "./AuthCard";
import "../shared/styles/fonts.css";
import "../shared/styles/tailwind.css";

const container = document.getElementById("gods-auth-root");
if (!container) {
  throw new Error("[auth] #gods-auth-root not found -- login/register .twig markup is out of sync with the auth bundle.");
}

const mode = container.dataset.mode === "register" ? "register" : "login";
const error = container.dataset.error || undefined;

createRoot(container).render(<AuthCard mode={mode} error={error} />);
