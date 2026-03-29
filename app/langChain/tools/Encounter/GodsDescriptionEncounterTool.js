import { Tool } from "langchain/tools";
import { GodsDescriptionEncounterChain } from "../../chains/Encounter/GodsDescriptionEncounterChain.js";

export class GodsDescriptionEncounterTool extends Tool {
    name = "encounter-description";
  
    description = "This tool uses an environment string to create a description for an encounter";
  
    async _call(arg){
      try {
        // Perform your custom tool logic here with the input text
        var chain = await new GodsDescriptionEncounterChain().call(arg);
        // and return the output text
        return `Réponse: ${chain.res}`;
      } catch (error) {
        // Handle any errors that occur during the processing
        return `Error occurred: ${error.message}`;
      }
    }
  }
  