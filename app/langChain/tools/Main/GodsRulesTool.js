import { Tool } from "langchain/tools";
import { GodsRulesChain } from "../../chains/Main/GodsRulesChain.js";

export class GodsRulesTool extends Tool {
    name = "gods-rules";
  
    description = "This tool answer questions about the Rules of GODS a Tabletop RPG Game.";
  
    async _call(arg){
      try {
        // Perform your custom tool logic here with the input text
        var chain = await new GodsRulesChain().call(arg);
        // and return the output text
        return `Réponse: ${chain.res}`;
      } catch (error) {
        // Handle any errors that occur during the processing
        return `Error occurred: ${error.message}`;
      }
    }
  }