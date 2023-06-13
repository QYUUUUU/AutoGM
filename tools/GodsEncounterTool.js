import { Tool } from "langchain/tools";
import { GodsEncounterChain } from "../models/GodsEncounterChain.js";

export class GodsEncounterTool extends Tool {
    name = "gods-encounter";
  
    description = "This tool uses a difficulty and environmental factors and an encounter type to generate encounters for GODS a Tabletop RPG Game.";
  
    async _call(arg){
      try {
        // Perform your custom tool logic here with the input text
        var chain = await new GodsEncounterChain().call(arg);
        // and return the output text
        return `Réponse: ${chain.res}`;
      } catch (error) {
        // Handle any errors that occur during the processing
        return `Error occurred: ${error.message}`;
      }
    }
  }