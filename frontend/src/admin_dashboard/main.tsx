import { createRoot } from "react-dom/client";
import type { AdminDashboardData } from "./types/admin";
import AdminDashboardApp from "./AdminDashboardApp";
import "../shared/styles/fonts.css";
import "../shared/styles/tailwind.css";
import "./styles.css";

const container = document.getElementById("gods-admin-dashboard-root");
if (!container) {
  throw new Error(
    "[admin-dashboard] #gods-admin-dashboard-root not found -- admin.html.twig markup is out of sync with the admin dashboard bundle."
  );
}

const dataElement = document.getElementById("gods-admin-dashboard-data");
const raw = dataElement?.textContent?.trim() || "{}";

let data: AdminDashboardData;

try {
  data = JSON.parse(raw) as AdminDashboardData;
} catch (error) {
  console.error(
    "[admin-dashboard] Invalid JSON in #gods-admin-dashboard-data",
    error
  );
  data = {};
}

createRoot(container).render(<AdminDashboardApp data={data} />);