import { Tool } from "langchain/tools";
import { startMain } from "../../agents/encounterAgent.js";

export class GodsEncounterTool extends Tool {
    name = "gods-encounter";
  
    description = "This tool uses a difficulty and environmental factors and an encounter type to generate an encounter for GODS a Tabletop RPG Game.";
  
    async _call(arg){
      try {
        // Perform your custom tool logic here with the input text
        var chain = await startMain(arg);
        // and return the output text
        return `Réponse: ${chain}`;
      } catch (error) {
        // Handle any errors that occur during the processing
        return `Error occurred: ${error.message}`;
      }
    }
  }