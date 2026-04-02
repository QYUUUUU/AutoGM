import { Tool } from "@langchain/core/tools";
import { GodsEnemiesEncounterChain } from "../../chains/Encounter/GodsEnemiesEncounterChain.js";

export class GodsEnemiesEncounterTool extends Tool {
    name = "encounter-enemies";
  
    description = "This tool uses an enemy type string to create a list of enemies for an encounter";
  
    async _call(arg){
      try {
        // Perform your custom tool logic here with the input text
        var chain = await new GodsEnemiesEncounterChain().call(arg);
        // and return the output text
        return `Réponse: ${chain.res}`;
      } catch (error) {
        // Handle any errors that occur during the processing
        return `Error occurred: ${error.message}`;
      }
    }
  }