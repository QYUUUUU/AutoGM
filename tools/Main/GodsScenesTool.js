import { Tool } from "langchain/tools";
import { GodsLoreChain } from "../../chains/Main/GodsLoreChain.js";

export class GodsLoreTool extends Tool {
    name = "gods-scenes";
  
    description = "This tool gives you the synopsis for the scene of the number given.";
  
    async _call(arg){
      try {
       
        console.log(arg)
        console.log("TOOL SCENES")

        return `Réponse: ${chain.res}`;
      } catch (error) {
        // Handle any errors that occur during the processing
        return `Error occurred: ${error.message}`;
      }
    }
  }