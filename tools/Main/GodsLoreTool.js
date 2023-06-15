import { Tool } from "langchain/tools";
import { GodsLoreChain } from "../../chains/Main/GodsLoreChain.js";

export class GodsLoreTool extends Tool {
    name = "gods-lore";
  
    description = "This tool answer questions about the Lore of GODS a Tabletop RPG Game.";
  
    async _call(arg){
      try {
        // Perform your custom tool logic here with the input text
        var chain = await new GodsLoreChain().call(arg);
        // and return the output text
        return `Réponse: ${chain.res}`;
      } catch (error) {
        // Handle any errors that occur during the processing
        return `Error occurred: ${error.message}`;
      }
    }
  }