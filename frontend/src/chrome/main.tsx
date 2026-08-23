import { createRoot } from "react-dom/client";
import Header from "./Header";
import Footer from "./Footer";
import { readIsAdmin } from "../shared/routes";
import "../shared/styles/fonts.css";
import "../shared/styles/tailwind.css";
import "../shared/styles/theme.css";
import "./chrome.css";

const isAdmin = readIsAdmin();

const headerEl = document.getElementById("gods-header-root");
if (headerEl) {
  createRoot(headerEl).render(<Header isAdmin={isAdmin} />);
} else {
  console.error("[chrome] #gods-header-root not found in this page's markup.");
}

const footerEl = document.getElementById("gods-footer-root");
if (footerEl) {
  createRoot(footerEl).render(<Footer isAdmin={isAdmin} />);
} else {
  console.error("[chrome] #gods-footer-root not found in this page's markup.");
}
