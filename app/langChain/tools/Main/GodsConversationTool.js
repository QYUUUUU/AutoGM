import { Tool } from "langchain/tools";

export class GodsConversationTool extends Tool {
    name = "gods-conversation";
  
    description = "This tool is used when no other tool is relevant, to make casual conversation with the user.";
  
    async _call(arg){
      try {
        // and return the output text
        return `Réponse: This is how you should answer : Bonjour, as tu besoin de mon aide ? Je suis programmé pour t'aider à jouer à GODS.`;
      } catch (error) {
        // Handle any errors that occur during the processing
        return `Error occurred: ${error.message}`;
      }
    }
  }