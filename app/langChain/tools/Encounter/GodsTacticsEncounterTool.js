import { Tool } from "@langchain/core/tools";
import { GodsTacticsEncounterChain } from "../../chains/Encounter/GodsTacticsEncounterChain.js";

export class GodsTacticsEncounterTool extends Tool {
    name = "encounter-enemy-tactics";
  
    description = "This tool designs fighting tactics for the given enemies for an encounter";
  
    async _call(arg){
      try {
        // Perform your custom tool logic here with the input text
        var chain = await new GodsTacticsEncounterChain().call(arg);
        // and return the output text
        return `Réponse: ${chain.res}`;
      } catch (error) {
        // Handle any errors that occur during the processing
        return `Error occurred: ${error.message}`;
      }
    }
  }