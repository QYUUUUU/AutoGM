import { Tool } from "langchain/tools";
import { GodsRewardsEncounterChain } from "../../chains/Encounter/GodsRewardsEncounterChain.js";

export class GodsRewardsEncounterTool extends Tool {
    name = "encounter-enemy-tactics";
  
    description = "This tool uses a list of enemies to design their fighting tactics for an encounter";
  
    async _call(arg){
      try {
        // Perform your custom tool logic here with the input text
        var chain = await new GodsRewardsEncounterChain().call(arg);
        // and return the output text
        return `Réponse: ${chain.res}`;
      } catch (error) {
        // Handle any errors that occur during the processing
        return `Error occurred: ${error.message}`;
      }
    }
  }