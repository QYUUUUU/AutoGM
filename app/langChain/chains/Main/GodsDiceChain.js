import { ChatOpenAI } from "@langchain/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { BaseChain } from "langchain/chains";
import { getUserId } from "./app/../../../../controllers/globals.js"

export class GodsDiceChain extends BaseChain {
  _chainType() {
    return "custom";
  }
  serialize() {
    throw new Error("Method not implemented.");
  }
  inputKeys = ["data"];
  outputKeys = ["res"];

  async _call(inputs) {

    var userId = getUserId();

    const model = new ChatOpenAI({
      temperature: 0,
      modelName: "gpt-3.5-turbo-1106", modelKwargs: { response_format: { type: "json_object" } },
      verbose: false,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    var data = {}
    try {
      const response = await fetch(`http://213.165.83.226/Favorite/Character/get/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      data = await response.json();
    } catch (error) {
      console.error(error)
      return { res: JSON.stringify({ type: "error", message: "Désolé, mais vous n'avez pas sélectionné de personnage pour lancer ces dés." }) }
    }

    let sanitizedQuestion = '';
    try {
      for (const key in inputs) {
        sanitizedQuestion += inputs[key];
      }
    } catch (error) {
      console.error(error)
      return { res: JSON.stringify({ type: "error", message: "BROKEN HERE." }) }
    }

    const modifier = parseInt(extractNumbersFromString(sanitizedQuestion));

    sanitizedQuestion = stripNumbers(sanitizedQuestion);
    const blessurelegere = data.blessurelegere
    const blessuregrave = data.blessuregrave
    const blessuremortelle = data.blessuremortelle

    const blessureModifier =
      blessuremortelle && blessuremortelle > 0 ? -3 :
        blessuregrave && blessuregrave > 0 ? -2 :
          blessurelegere && blessurelegere > 0 ? -1 : 0;

    const characterInfo = JSON.stringify(data);
    var context = "";

    async function getDiceAmount() {
      var QA_PROMPT = `Vous êtes le système d'analyse et de calcul de dés pour le jeu GODS.
        Voici la feuille de personnage :
        ---------------------
        ${characterInfo}
        ---------------------
        Définitions :
        - Caractéristiques = Puissance, Précision, Connaissance, Volonté, Résistance, Réflexes, Perception, Empathie.
        - Les autres mots sont des Compétences.
        
        Extrayez les valeurs numériques pour cette demande : input( ${sanitizedQuestion} )
        RÉPONDEZ EXCLUSIVEMENT ET STRICTEMENT sous forme de JSON valide (exemple : {"caracteristique": nombre, "competence": nombre}) sans aucun autre texte :
        `;
      const msg = await model.invoke(QA_PROMPT);
      return msg.content;
    };

    const filteredData = Object.keys(data)
      .filter(key => key.includes('malus'))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});

    const malusInfo = JSON.stringify(filteredData);

    async function getMalusAmount() {
      var carac = removeNumbersFromString(sanitizedQuestion);
      var QA_PROMPT = `Vous êtes le système de pénalité de règles GODS.
      État actuel des blessures (malus) :
      ---------------------
      ${malusInfo}
      ---------------------
      Domaines d'application:
      - Malus physique cible: puissance, résistance
      - Malus manuel cible: Précision, Réflexes
      - Malus social cible: Connaissance, Perception
      - Malus mental cible: Volonté, Empathie
      - Malus humain cible: Arts, Cité, Civilisations, Relationnel, Soins
      - Malus Animal cible: Animalisme, Faune, Montures, Pistage, Territoire
      - Malus Outil cible: Adresse, Armurerie, Artisanat, Mécanisme, Runes
      - Malus Arme cible: Bouclier, Corps à corps (cac), Lance, Mêlée, Tir
      - Malus Terres cible: Athlétisme, Discrétion, Flore, Vigilance, Voyage
      - Malus Inconnu cible: Eclat, Lunes, Mythes, Panthéons, Rituels
      
      Analysez les mots-clés : "${carac}" et déterminez le total du pénalité à imposer.
      RÉPONDEZ EXCLUSIVEMENT ET STRICTEMENT sous forme de JSON valide (exemple : {"dice": nombre, "throw": nombre}) sans aucun autre texte:
      `;
      const msg = await model.invoke(QA_PROMPT);
      return msg.content;
    }
    var [diceAmount, malusAmount] = await Promise.all([getDiceAmount(), getMalusAmount()]);

    diceAmount = extractValuesFromString(diceAmount);

    malusAmount = extractValuesFromString(malusAmount);
    var { lancers, relances } = calculerLancersEtRelances(diceAmount.competence);
    var totalDice = modifier + diceAmount.caracteristique + lancers + malusAmount.dice + malusAmount.throw + blessureModifier;
    if (totalDice < 1) {
      return { res: JSON.stringify({ type: "error", message: "Jet impossible, il y a trop de malus." }) };
    } else if (!Number.isInteger(totalDice)) {
      return { res: JSON.stringify({ type: "error", message: "Les données de votre personnage sont probablement mal remplies ou la demande n'a pas été comprise." }) };
    } else {
      let payload = { type: "dice", diceCounts: { d10: totalDice }, caracteristic: null, competence: null, relances: relances }; return { res: JSON.stringify(payload) };
    }
  }
}

function removeNumbersFromString(str) {
  return str.replace(/\d+/g, '');
}

function extractValuesFromString(str) {
  try {
    const jsonMatch = str.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (typeof parsed === 'object' && parsed !== null) return parsed;
    }
  } catch (e) {}
  
  const cleanedStr = str.replace(/[{}"']/g, '');
  const pairs = cleanedStr.split(',');

  const values = {};

  pairs.forEach(pair => {
    const ix = pair.indexOf(':');
    if (ix === -1) return;
    const key = pair.slice(0, ix).trim();
    const val = parseInt(pair.slice(ix + 1).trim());
    values[key] = isNaN(val) ? 0 : val;
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

function extractNumbersFromString(inputString) {
  const regex = /-?\d+/g; // Modifié pour inclure le signe négatif
  const matches = inputString.match(regex);
  if (matches === null) {
    return "0";
  }
  return matches.map(Number);
}

function stripNumbers(inputString) {
  return inputString.replace(/\d+/g, "");
}