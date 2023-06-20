import { Tool } from "langchain/tools";
import { GodsDiceChain } from "../../chains/Main/GodsDiceChain.js";

export class GodsDiceTool extends Tool {
    name = "gods-throws";
  
    description = "This tool is used to help know from a characteristic and a skill of the user and a modifier (ex :précision, lance, default is 0) the number of dices to throw for the user";
  
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