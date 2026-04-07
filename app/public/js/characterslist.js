/**
 * @fileoverview characterslist.js
 * @description Frontend script for managing list interactivity on the Character Index page.
 * Features:
 * - Scrapes class `.charactersheet` corresponding to UI blocks.
 * - Connects click event listeners dynamically pushing `window.location.href` to jump into the dedicated Character View route natively via the element's DOM ID.
 */
const characters = document.getElementsByClassName("charactersheet");

for (let i = 0; i < characters.length; i++) {
  characters[i].addEventListener("click", () => {
    window.location.href = `/Character/show/${characters[i].id}`;
  })
}