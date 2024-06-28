const characters = document.getElementsByClassName("charactersheet");

for (let i = 0; i < characters.length; i++) {
  characters[i].addEventListener("click", () => {
    window.location.href = `/Character/show/${characters[i].id}`;
  })
}