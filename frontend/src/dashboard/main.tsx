import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import DashboardApp from "./DashboardApp";

// Import your global styles AND the new Figma theme!
import "../shared/styles/fonts.css";
import "../shared/styles/tailwind.css";
import "../shared/styles/theme.css"; 

const container = document.getElementById("gods-dashboard-root");
const dataScript = document.getElementById("gods-dashboard-data");

if (!container || !dataScript) {
  throw new Error("[dashboard] Missing root or data script");
}

const initialData = JSON.parse(dataScript.textContent || "{}");

const rawChar = initialData.character || {};
const safeParse = (data: any) => (typeof data === "string" ? JSON.parse(data || "[]") : data || []);

const safeCharacter = {
  ...rawChar,
  inventory: safeParse(rawChar.inventory),
  langues: safeParse(rawChar.langues),
  specialites: safeParse(rawChar.specialites),
  rituelsMaitrises: safeParse(rawChar.rituelsMaitrises),
  capacitesEclat: safeParse(rawChar.capacitesEclat),
  faveurs: safeParse(rawChar.faveurs),
};

const equipmentList = initialData.equipmentList || [];
const weapons = equipmentList.filter((i: any) => i.type === 'Armes' || i.type === 'Armes de jet' || i.type === 'Armure et boucliers');
const armors = equipmentList.filter((i: any) => i.type === 'Armures' || i.type === 'Armure et boucliers');

createRoot(container).render(
  <StrictMode>
    <DashboardApp
      initialCharacter={safeCharacter}
      characters={initialData.characters || []}
      weapons={weapons}
      armors={armors}
      equipmentList={equipmentList}
      allGroupes={initialData.allGroupes || []}
      conversationId={initialData.conversationId || null}
    />
  </StrictMode>
);