var caracteristiqueValue;
var competenceValue;
var caracteristiqueMalusValue;
var competenceMalusValue;
var modifierValue;

var effort = 0;
var sangfroid = 0;

var legere = 0;
var grave = 0;
var mortelle = 0;

function buildPage() {
const losanges = document.querySelectorAll('.losange');
async function processLosanges() {
  losanges.forEach(losange => {
    losange.addEventListener('click', function() {
      var id = this.id;
      var caracteristique = id.substring(0, id.indexOf("losange"));
      var note = parseInt(id.charAt(id.length - 1));
      selectNote(caracteristique, note);
      const currentNote = parseInt(this.id.slice(-1));
      for (let i = 1; i <= currentNote; i++) {
        document.getElementById(this.id.slice(0, -1) + i).src = '/images/losangered.png';
      }
      for (let i = currentNote + 1; i <= 5; i++) {
        document.getElementById(this.id.slice(0, -1) + i).src = '/images/losange.png';
      }
    });
  });
}
processLosanges();

function selectBlessure(blessure, note) {
  switch (blessure) {
    case "legere":
      legere = note;
      break;
    case "grave":
      grave = note;
      break;
    case "mortelle":
      mortelle = note;
      break;
  }
  updateCharacterField(id_Character, "blessure"+blessure, note);
}



function selectReserve(reserve, note) {
  switch (reserve) {
    case "effort":
      effort = note;
      break;
    case "sangfroid":
      sangfroid = note;
      break;
  }
  updateCharacterField(id_Character, reserve, note);
}

// Variables globales pour stocker les notes sélectionnées
var puissance = 0;
var precicion = 0;
var connaissance = 0;
var volonte = 0;
var resistance = 0;
var reflexes = 0;
var perception = 0;
var empathie = 0;

// Fonction pour gérer la sélection de la note pour chaque caractéristique
function selectNote(caracteristique, note) {
  switch (caracteristique) {
    case "puissance":
      puissance = note;
      break;
    case "precicion":
      precicion = note;
      break;
    case "connaissance":
      connaissance = note;
      break;
    case "volonte":
      volonte = note;
      break;
    case "resistance":
      resistance = note;
      break;
    case "reflexes":
      reflexes = note;
      break;
    case "perception":
      perception = note;
      break;
    case "empathie":
      empathie = note;
      break;
  }
  updateCharacterField(id_Character, caracteristique, note);
}

const losangescomp = document.querySelectorAll('.losangecarac');

async function processLosangescarac() {
  losangescomp.forEach(losange => {
    losange.addEventListener('click', function() {
      var id = this.id;
      var competence = id.substring(0, id.indexOf("losange"));
      var note = parseInt(id.charAt(id.length - 1));
      var thisImage = this.src;
      thisImage = thisImage.split("/").pop().split("\\").pop();
      if(note == 1 && thisImage=="losangered.png"){
        selectNoteCompetence(competence, 0);
        this.src = "/images/losange.png";
        for (let i = 2; i <= 6; i++) {
          var image = document.getElementById(this.id.slice(0, -1) + i).src;
          image = image.split("/").pop().split("\\").pop();
          if(image == "losangered.png" || image == "losange.png"){
            document.getElementById(this.id.slice(0, -1) + i).src = '/images/losange.png';
          }else{
            document.getElementById(this.id.slice(0, -1) + i).src = '/images/circle.png';
          }
        }
      }else{
        selectNoteCompetence(competence, note);
        const currentNote = parseInt(this.id.slice(-1));
        for (let i = 1; i <= currentNote; i++) {
          var image = document.getElementById(this.id.slice(0, -1) + i).src;
          image = image.split("/").pop().split("\\").pop();
          if(image == "losangered.png" || image == "losange.png"){
            document.getElementById(this.id.slice(0, -1) + i).src = '/images/losangered.png';
          }else{
            document.getElementById(this.id.slice(0, -1) + i).src = '/images/circlered.png';
          }
        }
        for (let i = currentNote + 1; i <= 6; i++) {
          var image = document.getElementById(this.id.slice(0, -1) + i).src;
          image = image.split("/").pop().split("\\").pop();
          if(image == "losangered.png" || image == "losange.png"){
            document.getElementById(this.id.slice(0, -1) + i).src = '/images/losange.png';
          }else{
            document.getElementById(this.id.slice(0, -1) + i).src = '/images/circle.png';
          }
        }
      }
    });
  });
}
processLosangescarac();
var arts = 0;
var animalisme = 0;
var cite = 0; 
var faune = 0;
var civilisations = 0;
var montures = 0;
var relationnel = 0;
var pistage = 0;
var soins = 0;
var territoire = 0;
var adresse = 0;
var athletisme = 0;
var armurerie = 0;
var discretion = 0;
var artisanat = 0;
var flore = 0;
var mecanisme = 0;
var vigilance = 0;
var runes = 0;
var voyage = 0;
var bouclier = 0;
var eclats = 0;
var cac = 0;
var lunes = 0;
var lancer = 0;
var mythes = 0;
var melee = 0;
var pantheons = 0;
var tir = 0;
var rituels = 0;

function selectNoteCompetence(competence, note) {
  switch (competence) {
    case "arts":
      arts = note;
      break;
    case "animalisme":
      animalisme = note;
      break;
    case "cite":
      cite = note;
      break;
    case "faune":
      faune = note;
      break;
    case "civilisations":
      civilisations = note;
      break;
    case "montures":
      montures = note;
      break;
    case "relationnel":
      relationnel = note;
      break;
    case "pistage":
      pistage = note;
      break;
    case "soins":
      soins = note;
      break;
    case "territoire":
      territoire = note;
      break;
    case "adresse":
      adresse = note;
      break;
    case "athletisme":
      athletisme = note;
      break;
    case "armurerie":
      armurerie = note;
      break;
    case "discretion":
      discretion = note;
      break;
    case "artisanat":
      artisanat = note;
      break;
    case "flore":
      flore = note;
      break;
    case "mecanisme":
      mecanisme = note;
      break;
    case "vigilance":
      vigilance = note;
      break;
    case "runes":
      runes = note;
      break;
    case "voyage":
      voyage = note;
      break;
    case "bouclier":
      bouclier = note;
      break;
    case "eclats":
      eclats = note;
      break;
    case "cac":
      cac = note;
      break;
    case "lunes":
      lunes = note;
      break;
    case "lancer":
      lancer = note;
      break;
    case "mythes":
      mythes = note;
      break;
    case "melee":
      melee = note;
      break;
    case "pantheons":
      pantheons = note;
      break;
    case "tir":
      tir = note;
      break;
    case "rituels":
      rituels = note;
      break;
  }
  updateCharacterField(id_Character, competence, note)
}

  const inputFields = document.querySelectorAll(".rowToUpdate");
  inputFields.forEach(inputField => {
    // Add change event listener to each input field
    inputField.addEventListener("change", function() {
      // Call the relevant function based on the input field's ID
       updateCharacterField(id_Character, inputField.id, inputField.value)
    });
  });


  function updateCharacterField(id, field, value) {
    const url = '/Character';
  
    // Updated payload to be sent in the request body
    const data = {
      id: id,
      field: field,
      value: value
    };
  
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) // Convert data to JSON string
    })
    .then(response => {
      if (response.ok) {
        // Handle successful response
        console.log(`Character field ${field} for ID ${id} updated successfully.`);
      } else {
        console.error(`Error updating ${field} for Character with ID ${id}`);
        console.error(response.status, response.statusText);
      }
    })
    .catch(error => {
      console.error(`Error updating ${field} for Character with ID ${id}`);
      console.error(error);
    });
  }


function updateInventory(quill) {
  var contents = quill.getContents();
  console.log(contents)
  const jsonString = JSON.stringify(contents);
  console.log(jsonString)
  updateCharacterField(id_Character, "inventory", jsonString);
}

function makeQuill(quillContent){
  var quill = new Quill('#editor', {
    theme: 'snow',
    placeholder: 'Take notes here...',
    modules: {
    toolbar: [
    [
    {
    'header': [1, 2, false]
    }
    ],
    [
    'bold', 'italic', 'underline'
    ],
    ['code-block']
    ]
    }
  });
  quill.on('text-change', function() {
      updateInventory(quill);
  });
  quillContent = JSON.parse(quillContent);
  quill.setContents(quillContent);
}


async function getCharacter(id_Character) {
  try {
    const response = await fetch(`/Character/${id_Character}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data)
    return data;
  } catch (error) {
    console.error(error);
  }
}


getCharacter(id_Character)
  .then((data) => {
    document.getElementById('nom').value = data.nom;
    document.getElementById('age').value = data.age;
    document.getElementById('genre').value = data.genre;
    document.getElementById('instinct').value = data.instinct;
    document.getElementById('signeastro').value = data.signeastro;
    document.getElementById('origine').value = data.origine;
    document.getElementById('depensee').value = data.depensee;
    document.getElementById('totale').value = data.totale;
    document.getElementById('malusphysique').value = data.malusphysique;
    document.getElementById('malusmanuel').value = data.malusmanuel;
    document.getElementById('malussocial').value = data.malussocial;
    document.getElementById('malushumain').value = data.malushumain;
    document.getElementById('malusanimal').value = data.malusanimal;
    document.getElementById('malusoutils').value = data.malusoutils;
    document.getElementById('malusterres').value = data.malusterres;
    document.getElementById('malusarme').value = data.malusarme;
    document.getElementById('malusinconnu').value = data.malusinconnu;
    document.getElementById('malusmental').value = data.malusmental;
    makeQuill(data.inventory);

    if (data.connaissance !== 0 && data.connaissance !== null) {
      document.getElementById('connaissancelosange'+data.connaissance).click();
    }

    if (data.volonte !== 0 && data.volonte !== null) {
      document.getElementById('volontelosange'+data.volonte).click();
    }

    if (data.puissance !== 0 && data.puissance !== null) {
      document.getElementById('puissancelosange'+data.puissance).click();
    }

    if (data.resistance !== 0 && data.resistance !== null) {
      document.getElementById('resistancelosange'+data.resistance).click();
    }

    if (data.reflexes !== 0 && data.reflexes !== null) {
      document.getElementById('reflexeslosange'+data.reflexes).click();
    }

    if (data.perception !== 0 && data.perception !== null) {
      document.getElementById('perceptionlosange'+data.perception).click();
    }

    if (data.empathie !== 0 && data.empathie !== null) {
      document.getElementById('empathielosange'+data.empathie).click();
    }

    if (data.precicion !== 0 && data.precicion !== null) {
      document.getElementById('precicionlosange'+data.precicion).click();
    }

    if (data.arts !== 0 && data.arts !== null) {
      document.getElementById('artslosange'+data.arts).click();
    }

    if (data.animalisme !== 0 && data.animalisme !== null) {
      document.getElementById('animalismelosange'+data.animalisme).click();
    }

    if (data.cite !== 0 && data.cite !== null) {
      document.getElementById('citelosange'+data.cite).click();
    }

    if (data.faune !== 0 && data.faune !== null) {
      document.getElementById('faunelosange'+data.faune).click();
    }

    if (data.civilisations !== 0 && data.civilisations !== null) {
      document.getElementById('civilisationslosange'+data.civilisations).click();
    }

    if (data.relationnel !== 0 && data.relationnel !== null) {
      document.getElementById('relationnellosange'+data.relationnel).click();
    }

    if (data.pistage !== 0 && data.pistage !== null) {
      document.getElementById('pistagelosange'+data.pistage).click();
    }

    if (data.soins !== 0 && data.soins !== null) {
      document.getElementById('soinslosange'+data.soins).click();
    }

    if (data.territoire !== 0 && data.territoire !== null) {
      document.getElementById('territoirelosange'+data.territoire).click();
    }

    if (data.adresse !== 0 && data.adresse !== null) {
      document.getElementById('adresselosange'+data.adresse).click();
    }

    if (data.athletisme !== 0 && data.athletisme !== null) {
      document.getElementById('athletismelosange'+data.athletisme).click();
    }

    if (data.armurerie !== 0 && data.armurerie !== null) {
      document.getElementById('armurerielosange'+data.armurerie).click();
    }

    if (data.discretion !== 0 && data.discretion !== null) {
      document.getElementById('discretionlosange'+data.discretion).click();
    }

    if (data.artisanat !== 0 && data.artisanat !== null) {
      document.getElementById('artisanatlosange'+data.artisanat).click();
    }
        if (data.flore !== 0 && data.flore !== null) {
      document.getElementById('florelosange'+data.flore).click();
    }

    if (data.mecanisme !== 0 && data.mecanisme !== null) {
      document.getElementById('mecanismelosange'+data.mecanisme).click();
    }

    if (data.vigilance !== 0 && data.vigilance !== null) {
      document.getElementById('vigilancelosange'+data.vigilance).click();
    }

    if (data.runes !== 0 && data.runes !== null) {
      document.getElementById('runeslosange'+data.runes).click();
    }

    if (data.voyage !== 0 && data.voyage !== null) {
      document.getElementById('voyagelosange'+data.voyage).click();
    }

    if (data.bouclier !== 0 && data.bouclier !== null) {
      document.getElementById('bouclierlosange'+data.bouclier).click();
    }

    if (data.eclats !== 0 && data.eclats !== null) {
      document.getElementById('eclatslosange'+data.eclats).click();
    }

    if (data.cac !== 0 && data.cac !== null) {
      document.getElementById('caclosange'+data.cac).click();
    }

    if (data.lunes !== 0 && data.lunes !== null) {
      document.getElementById('luneslosange'+data.lunes).click();
    }

    if (data.lancer !== 0 && data.lancer !== null) {
      document.getElementById('lancerlosange'+data.lancer).click();
    }

    if (data.mythes !== 0 && data.mythes !== null) {
      document.getElementById('mytheslosange'+data.mythes).click();
    }

    if (data.melee !== 0 && data.melee !== null) {
      document.getElementById('meleelosange'+data.melee).click();
    }

    if (data.pantheons !== 0 && data.pantheons !== null) {
      document.getElementById('pantheonslosange'+data.pantheons).click();
    }

    if (data.tir !== 0 && data.tir !== null) {
      document.getElementById('tirlosange'+data.tir).click();
    }

    if (data.rituels !== 0 && data.rituels !== null) {
      document.getElementById('rituelslosange'+data.rituels).click();
    }

    if (data.montures !== 0 && data.montures !== null) {
      document.getElementById('montureslosange'+data.montures).click();
    }

    //  
    //Gérer les réserves :
    //
    var maxeffort = data.maxeffort;
    var maxsangfroid = data.maxsangfroid;
    effort = data.effort;
    sangfroid = data.sangfroid;
    function reservesDisplay(maxeffort, maxsangfroid, effort, sangfroid){

      const effortBox = document.getElementById('effort');
      for (let i = 1; i <= maxeffort; i++) {
        const effortCircle = document.createElement("img");
        effortCircle.id="effortcircle"+i;
        effortCircle.classList.add("circlereserve");
        effortCircle.src="/images/circle.png";
        effortBox.appendChild(effortCircle);
      }

      const sangfroidBox = document.getElementById('sangfroid');
      for (let i = 1; i <= maxsangfroid; i++) {
        const sangfroidCircle = document.createElement("img");
        sangfroidCircle.id="sangfroidcircle"+i;
        sangfroidCircle.classList.add("circlereserve");
        sangfroidCircle.src="/images/circle.png";
        sangfroidBox.appendChild(sangfroidCircle);
      }

      const circlesReserve = document.querySelectorAll('.circlereserve');
      circlesReserve.forEach(circle => {
        circle.addEventListener('click', function() {
          var id = this.id;
          var reserve = id.substring(0, id.indexOf("circle"));
          const match = id.match(/\d+$/);
          var note = match ? parseInt(match[0]) : 0;
          var thisImage = this.src;
          thisImage = thisImage.split("/").pop().split("\\").pop();

          if(reserve=="effort"){
            var maxreserve = maxeffort;
          }

          if(reserve=="sangfroid"){
            var maxreserve = maxsangfroid;
          }

          if(thisImage == "circlered.png" && note =="1"){
            this.src="/images/circle.png";
            selectReserve(reserve,0);
            for (let i = note + 1; i <= maxreserve; i++) {
              var tempID= id.replace(/\d+/g, "")+i;
              document.getElementById(tempID).src = '/images/circle.png';
            }
          }else if(thisImage == "circle.png" && note =="1"){
            this.src="/images/circlered.png";
            selectReserve(reserve,note);
            for (let i = note + 1; i <= maxreserve; i++) {
              var tempID= id.replace(/\d+/g, "")+i;
              document.getElementById(tempID).src = '/images/circle.png';
            }
          }else{
            selectReserve(reserve,note);
            for (let i = 1; i <= note; i++) {
              var tempID= id.replace(/\d+/g, "")+i;
              document.getElementById(tempID).src = '/images/circlered.png';
            }
            for (let i = note + 1; i <= maxreserve; i++) {
              var tempID= id.replace(/\d+/g, "")+i;
              document.getElementById(tempID).src = '/images/circle.png';
            }
          }
        });
      });


      if(effort){
        if (effort !== 0 && effort !== null) {
          document.getElementById('effortcircle'+effort).click();
        }
      }else{
        if (data.effort !== 0 && data.effort !== null) {
          document.getElementById('effortcircle'+data.effort).click();
        }
      }
      
      if(sangfroid){
        if (sangfroid !== 0 && sangfroid !== null) {
          document.getElementById('sangfroidcircle'+sangfroid).click();
        }
      }else{
        if (data.sangfroid !== 0 && data.sangfroid !== null) {
          document.getElementById('sangfroidcircle'+data.sangfroid).click();
        }
      }
    }

  reservesDisplay(maxeffort, maxsangfroid);
    //  
    //Gérer les blessures :
    //
    var maxblessurelegere = data.maxblessurelegere;
    var maxblessuregrave = data.maxblessuregrave;
    var maxblessuremortelle = data.maxblessuremortelle;

    legere = data.blessurelegere;
    grave = data.blessuregrave;
    mortelle = data.blessuremortelle;
    
    function blessureDisplay(maxblessurelegere, maxblessuregrave, maxblessuremortelle, legere, grave, mortelle){
      const blessurelegereBox = document.getElementById('blessurelegere');
      for (let i = 1; i <= maxblessurelegere; i++) {
        const legerereCircle = document.createElement("img");
       legerereCircle.id="legerecircle"+i;
       legerereCircle.classList.add("circleblessure");
       legerereCircle.src="/images/circle.png";
        blessurelegereBox.appendChild(legerereCircle);
      }
  
      const blessuregraveBox = document.getElementById('blessuregrave');
      for (let i = 1; i <= maxblessuregrave; i++) {
        const graveCircle = document.createElement("img");
        graveCircle.id="gravecircle"+i;
        graveCircle.classList.add("circleblessure");
        graveCircle.src="/images/circle.png";
        blessuregraveBox.appendChild(graveCircle);
      }
  
      const blessuremortelleBox = document.getElementById('blessuremortelle');
      for (let i = 1; i <= maxblessuremortelle; i++) {
        const mortelleCircle = document.createElement("img");
        mortelleCircle.id="mortellecircle"+i;
        mortelleCircle.classList.add("circleblessure");
        mortelleCircle.src="/images/circle.png";
        blessuremortelleBox.appendChild(mortelleCircle);
      }
  
      const circlesblessure = document.querySelectorAll('.circleblessure');
      circlesblessure.forEach(circle => {
        circle.addEventListener('click', function() {
          var id = this.id;
          var blessure = id.substring(0, id.indexOf("circle"));
          var note = parseInt(id.charAt(id.length - 1));
          var thisImage = this.src;
          thisImage = thisImage.split("/").pop().split("\\").pop();
          if(blessure=="legere"){
            var maxblessure = maxblessurelegere;
          }
          if(blessure=="grave"){
            var maxblessure = maxblessuregrave;
          }
  
          if(blessure=="mortelle"){
            var maxblessure = maxblessuremortelle;
          }
  
          if(thisImage == "circlered.png" && note =="1"){
            this.src="/images/circle.png";
            selectBlessure(blessure,0);
            for (let i = note + 1; i <= maxblessure; i++) {
              document.getElementById(this.id.slice(0, -1) + i).src = '/images/circle.png';
            }
          }else if(thisImage == "circle.png" && note =="1"){
            this.src="/images/circlered.png";
            selectBlessure(blessure,note);
            for (let i = note + 1; i <= maxblessure; i++) {
              document.getElementById(this.id.slice(0, -1) + i).src = '/images/circle.png';
            }
          }else{
            // selectBlessure(blessure, note);
            const currentNote = parseInt(this.id.slice(-1));
            selectBlessure(blessure,note);
            for (let i = 1; i <= currentNote; i++) {
              document.getElementById(this.id.slice(0, -1) + i).src = '/images/circlered.png';
            }
            for (let i = currentNote + 1; i <= maxblessure; i++) {
              document.getElementById(this.id.slice(0, -1) + i).src = '/images/circle.png';
            }
          }
        });
      });
  

      if(legere){
        if (legere !== 0 && legere !== null) {
          console.log("lost in the speed");
          document.getElementById('legerecircle'+legere).click();
        }
      }else{
        if (data.blessurelegere !== 0 && data.blessurelegere !== null) {
          document.getElementById('legerecircle'+data.blessurelegere).click();
        }
      }


      if(grave){
        if (grave !== 0 && grave !== null) {
          console.log("lost in the speed");
          document.getElementById('gravecircle'+grave).click();
        }
      }else{
        if (data.blessuregrave !== 0 && data.blessuregrave !== null) {
          document.getElementById('gravecircle'+data.blessuregrave).click();
        }
      }

      if(mortelle){
        if (mortelle !== 0 && mortelle !== null) {
          console.log("lost in the speed");
          document.getElementById('mortellecircle'+mortelle).click();
        }
      }else{
        if (data.blessuremortelle !== 0 && data.blessuremortelle !== null) {
          document.getElementById('mortellecircle'+data.blessuremortelle).click();
        }
      }
  
    }
    blessureDisplay(maxblessurelegere, maxblessuregrave, maxblessuremortelle);

    function reserveClear(){
      const circleReserves= document.getElementsByClassName('circlereserve');
      while (circleReserves.length > 0) {
        circleReserves[0].parentNode.removeChild(circleReserves[0]);
      }
    }
    function blessureClear(){
      const circleBlessures= document.getElementsByClassName('circleblessure');
      while (circleBlessures.length > 0) {
        circleBlessures[0].parentNode.removeChild(circleBlessures[0]);
      }
    }

    const increments = document.querySelectorAll(".increments");
    increments.forEach(increment => {
      increment.addEventListener('click', function() {
        var id = increment.id;

        if (id === 'pluslegere') {
          maxblessurelegere = maxblessurelegere+1;
          updateCharacterField(id_Character, "maxblessurelegere", maxblessurelegere);
        } else if (id === 'moinslegere') {
          maxblessurelegere = maxblessurelegere-1;
          updateCharacterField(id_Character, "maxblessurelegere", maxblessurelegere);
        } else if (id === 'plusgrave') {
          maxblessuregrave = maxblessuregrave+1;
          updateCharacterField(id_Character, "maxblessuregrave", maxblessuregrave);
        } else if (id === 'moinsgrave') {
          maxblessuregrave = maxblessuregrave-1;
          updateCharacterField(id_Character, "maxblessuregrave", maxblessuregrave);
        } else if (id === 'plusmortelle') {
          maxblessuremortelle = maxblessuremortelle+1;
          updateCharacterField(id_Character, "maxblessuremortelle", maxblessuremortelle);
        } else if (id === 'moinsmortelle') {
          maxblessuremortelle = maxblessuremortelle-1;
          updateCharacterField(id_Character, "maxblessuremortelle", maxblessuremortelle);
        }
        blessureClear();
        blessureDisplay(maxblessurelegere, maxblessuregrave, maxblessuremortelle, legere, grave, mortelle);
      });
    });

    const incrementsreserve = document.querySelectorAll(".incrementsreserve");
    incrementsreserve.forEach(increment => {
      increment.addEventListener('click', function() {
        var id = increment.id;

        if (id === 'pluseffort') {
          maxeffort = maxeffort+1;
          updateCharacterField(id_Character, "maxeffort", maxeffort);
        } else if (id === 'moinseffort') {
          maxeffort = maxeffort-1;
          updateCharacterField(id_Character, "maxeffort", maxeffort);
        } else if (id === 'plussangfroid') {
          maxsangfroid = maxsangfroid+1;
          updateCharacterField(id_Character, "maxsangfroid", maxsangfroid);
        } else if (id === 'moinssangfroid') {
          maxsangfroid = maxsangfroid-1;
          updateCharacterField(id_Character, "maxsangfroid", maxsangfroid);
        }
        reserveClear();
        reservesDisplay(maxeffort, maxsangfroid, effort, sangfroid);
      });
    });
   
  })
  .catch((error) => {
    console.error(error);
  });
};

buildPage();