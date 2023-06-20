import { Tool } from "langchain/tools";
import { GodsDiceChain } from "../../chains/Main/GodsDiceChain.js";

export class GodsLoreTool extends Tool {
    name = "gods-throws";
  
    description = "This tool is used to generate throws from characteristics and skills of the user (ex :précision, lance)";
  
    async _call(arg){
      try {
        // Perform your custom tool logic here with the input text
        var chain = await new GodsDiceChain().call(arg);
        // and return the output text
        return `Réponse: ${chain.res}`;
      } catch (error) {
        // Handle any errors that occur during the processing
        return `Error occurred: ${error.message}`;
      }
    }
  }