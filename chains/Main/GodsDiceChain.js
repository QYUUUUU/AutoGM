import { OpenAI } from "langchain/llms/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { BaseChain } from "langchain/chains";
import { getUserId } from "../../controllers/globals.js";

export class GodsDiceChain extends BaseChain {
  _chainType() {
    throw new Error("Method not implemented.");
  }
  serialize() {
    throw new Error("Method not implemented.");
  }
  inputKeys = ["data"];
  outputKeys = ["res"];

  async _call(inputs) {

    var userId = getUserId();

    console.log(userId);

    const model = new OpenAI({
      temperature: 0,
      modelName: "gpt-3.5-turbo-16k-0613",
      verbose: false,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    var data = {}
    try {
      const response = await fetch(`http://localhost:3000/Favorite/Character/get/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      data = await response.json();
      console.log(data)
    } catch (error) {
      console.error(error)
      return { res:"Bot, dis à l'utilisateur qu'il n'a pas sélectionné de personnage."}
    }

    let sanitizedQuestion = '';
    for (const key in inputs) {
      sanitizedQuestion += inputs[key];
    }

    const blessurelegere = data.blessurelegere
    const blessuregrave = data.blessuregrave
    const blessuremortelle = data.blessuremortelle

    var blessureModifier = 0;
    if(blessuremortelle && blessuremortelle > 0){
      blessureModifier=-3;
    }else if(blessuregrave && blessuremortelle > 0){
      blessureModifier=-2;
    }else if(blessurelegere && blessurelegere > 0){
      blessureModifier=-1;
    }

    const characterInfo = JSON.stringify(data);


    var context = "";

    async function getDiceAmount() {
      var QA_PROMPT = `Les informations du personnage sont ci-dessous.
        ---------------------
        ${characterInfo}
        ---------------------
        Le modifieur est un nombre spécifié dans l'input, ou si il n'y en a pas c'est 0.
        Les Caractéristiques sont Puissance Précision Connaissance Volonté Résistance Réflexes Perception Empathie.
        Les autres mots sont des Compétences.
         Quelles sont les valeurs des informations suivantes : input( ${sanitizedQuestion} ) ? Réponds au format json ex : {"modifieur" : int, "caracteristique": int, "competence": int}:
        
        `;
      return await model.call(QA_PROMPT);
    };

    characterInfo

    const filteredData = Object.keys(data)
    .filter(key => key.includes('malus'))
    .reduce((obj, key) => {
      obj[key] = data[key];
      return obj;
    }, {});

    const malusInfo = JSON.stringify(filteredData);
    console.log(malusInfo);

    async function getMalusAmount() {
      var carac = removeNumbersFromString(sanitizedQuestion);
      var QA_PROMPT = `Les valeurs des malus: 
      ---------------------
      ${malusInfo}
      ---------------------
      Le malus physique s'applique à puissance et résistance,
      Le malus manuel s'applique à Précision et Réflexes,
      Le malus social s'applique à Connaissance et Perception,
      Le malus mental s'applique à Volonté et Empathie,
      Le malus humain s'applique à Arts Cité Civilisations Relationnel Soins,
      Le malus Animal s'applique à Animalisme Faune Montures Pistage Territoire,
      Le malus Outil s'applique à Adresse Armurerie Artisanat Mécanisme Runes,
      Le malus Arme s'applique à Bouclier Corps à corps(cac) Lance Mêlée Tir,
      Le malus Terres s'applique à Athlétisme Discrétion Flore Vigilance Voyage,
      Le malus Inconnu s'applique à Eclat Lunes Mythes Panthéons Rituels
      
      Donne les valeurs des malus qui s'appliquent à cette combinaison : ${carac} ? réponds au format json ex : {"dice": int, "throw": int}:
      
      `;
      return await model.call(QA_PROMPT);
    }
    var [diceAmount, malusAmount] = await Promise.all([getDiceAmount(),getMalusAmount()]);

    diceAmount = extractValuesFromString(diceAmount);
    malusAmount = extractValuesFromString(malusAmount);

    var { lancers, relances } = calculerLancersEtRelances(diceAmount.competence);
    var totalDice = diceAmount.modifieur + diceAmount.caracteristique + lancers + malusAmount.dice + malusAmount.throw + blessureModifier;
    if (totalDice <1){
      return { res:"Jet impossible, il y a trop de malus." };
    }else if (!Number.isInteger(totalDice)) {
      return { res:"Bot, Les données du personnage sont probablement mal remplies. Vérifiez les caractéristiques, compétences, malus et blessures de votre personnage." };
    } else {
      return { res:"Bot, les dés à lancer sont "+totalDice+"d10 et "+relances+"d10 à relancer possibles. S'il te plait Bot fait les lancers pour le joueur et informe lui des possibilités de relance." };
    }
  }
}

function removeNumbersFromString(str) {
  return str.replace(/\d+/g, '');
}

function extractValuesFromString(str) {
  const cleanedStr = str.replace(/[{}]/g, '');
  const pairs = cleanedStr.split(',');

  const values = {};

  pairs.forEach(pair => {
    const [key, value] = pair.split(':');
    const cleanedKey = key.trim().replace(/['"]/g, ''); // Supprimer les guillemets simples ou doubles des clés
    const cleanedValue = parseInt(value.trim());
    values[cleanedKey] = cleanedValue;
  });

  return values;
}

function calculerLancersEtRelances(entier) {
  let lancers = 0;
  let relances = 0;

  switch (entier) {
    case 1:
      lancers = 1;
      relances = 0;
      break;
    case 2:
      lancers = 1;
      relances = 1;
      break;
    case 3:
      lancers = 2;
      relances = 1;
      break;
    case 4:
      lancers = 2;
      relances = 2;
      break;
    case 5:
      lancers = 3;
      relances = 2;
      break;
    case 6:
      lancers = 3;
      relances = 3;
      break;
    default:
      break;
  }

  return { lancers, relances }
}