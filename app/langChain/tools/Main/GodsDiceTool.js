import { Tool } from "@langchain/core/tools";
import { GodsDiceChain } from "../../chains/Main/GodsDiceChain.js";

export class GodsDiceTool extends Tool {
    name = "gods-throws";
  
    description = 'Ce bot permet de calculer le nombre de dés à lancer pour le joueur à partir d\'une caractéristique, d\'une compétence et d\'un modificateur éventuel (ex: précision et tir). Retourne STRICTEMENT le JSON renvoyé par cet outil sans aucun ajout.';
  
    async _call(arg){
      try {
        console.log("GODS THROW TOOL CALLED WIH : "+ arg)
        // Perform your custom tool logic here with the input text
        var chain = await new GodsDiceChain().call(arg);
        // and return the output text
        return chain.res;
      } catch (error) {
        // Handle any errors that occur during the processing
        return `Une erreur s\'est produite lors du calcul des dés : ${error.message}`;
      }
    }
  }