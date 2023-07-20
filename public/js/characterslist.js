const newCaracButton = document.getElementById("newCharacter");

newCaracButton.addEventListener("click", ()=>{
    //Call api to make it create a new character for his profil id
    apiNewCharacter();
});

async function apiNewCharacter() {
    try {
      const response = await fetch(`/Character/create/new/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      location.reload(); // Reload the page after successful creation
    } catch (error) {
      console.error(error);
    }
  }


const characters = document.getElementsByClassName("charactersheet");


for (let i = 0; i < characters.length; i++) {
  characters[i].addEventListener("click", ()=>{
    window.location.href = `/Character/show/${characters[i].id}`;
  })
}