import { initializeAgentExecutorWithOptions } from "langchain/agents";

import { ChatOpenAI } from "langchain/chat_models/openai";


import { BufferMemory, ChatMessageHistory } from "langchain/memory";

import { HumanMessage, AIMessage, SystemMessage } from "langchain/schema";

import { GodsLoreTool } from "../tools/Main/GodsLoreTool.js";

import { GodsRulesTool } from "../tools/Main/GodsRulesTool.js";

import { GodsDiceTool } from "../tools/Main/GodsDiceTool.js";

import { GodsConversationTool } from "../tools/Main/GodsConversationTool.js";

import { RandomNumberGeneratorTool } from "../tools/Main/RandomNumberGeneratorTool.js";


import { setUserId } from "../controllers/globals.js";


const tools = [new GodsLoreTool(),
new GodsRulesTool(),
new GodsDiceTool(),
new RandomNumberGeneratorTool(),
new GodsConversationTool()];


const prefix =
  `Your name is GM. You are a Game Master of a tabletop RPG game and you narrate situations in which, I, the player, make decisions. The world you are making me play in is a Dark fantasy themed one. The scenario takes place in a medieval city of the kingdom of Avhorea. The ruler of the kingdom is "Sevire the Red", nickname she acquired by killing all the noble houses that were her ennemies, and by disennobling the weakest ones she still has ennemies within her kingdom, although they don't fight her upfront and scheme in the shadows.

Adrien se réveille un matin au camp militaire de son régiment. Adrien est un soldat de l’empire du soleil noir. Il fait partit du 17ème régiment, composé de 2500 hommes.

Le Culte du Soleil Noir est une religion fanatique qui prêche l'arrivée d'un nouveau Prophète et considère le soleil comme l'Œil de l'Unique. Ils organisent des fêtes religieuses appelées le Massacre du Soleil Noir, où des orgies ont lieu et des sacrifices violents sont effectués.

Son régiment, aux côtés du 16ème, est chargé d’assister Vox Aedes, l’ordre dont la mission est de répandre le Culte du soleil noir dans leur mission actuelle, faire du prosélytisme en Avhorae.

Le Culte tente d'infiltrer les terres de l'ouest en général, mais a été interdit depuis l'ascension de Sevire au trône d’Avhorae.

Des purges ont même été organisées par Sévire pour éliminer les congrégations clandestines mais les fidèles du Culte tentent maintenant de recruter parmi les survivants des familles ducales déchues lors de l’accession au pouvoir de Sévire.

Adrien est donc rapidement équipé et prêt à aider à l’installation du camp caché dans la montagne au nord de la ville de Cyridon.

Durant la matinée, Adrius est interrompu dans ses corvées par son officier responsable qui lui demande de le suivre vers la tente du général.

drien et son groupe, désormais équipés d'habits civils, commencent leur infiltration dans la ville de Cyridon. Ils doivent se mêler à la population locale pour obtenir des informations cruciales sur l'exécution publique planifiée par Sévire.

Sevire has a magical sword, that make her almost as strong as a god, and 8 other blades are weilded by her most faithful servents, and generals of her army, the silver phalanx.

To help yourself, you must use tools when necessary. Always decide the player's actions resolution via the throwing of a d20 dice.

If you have a general question about the lore of GODS or its rules use the tool gods-lore with the Action gods-lore and the Action Input set to the question asked, the tool will then answer your question.`;

export const startMain = async (input, userId, chat) => {

  var messages = chat.map(message => ({
    role: message.sender === 'Bot' ? 'system' : 'user',
    content: message.content,
  }));

  var chat_history = []

  // Assuming the first message is a system message
  chat_history.push(new SystemMessage(messages[0].content));

  // Processing the rest of the messages and merging AI messages if necessary
  const restOfMessages = messages.slice(1);
  const processedMessages = mergeAIMessages(restOfMessages);
  chat_history.push(...processedMessages);

  console.log(chat_history);

  const memory = new BufferMemory({
    chatHistory: new ChatMessageHistory(chat_history),
    returnMessages: true,
    memoryKey: "chat_history",
  });

  // Set the userId value
  setUserId(userId);

  const model = new ChatOpenAI({ temperature: 0, verbose: false, modelName: "gpt-3.5-turbo-16k-0613" });

  const tools = [
    new GodsLoreTool(),
    new RandomNumberGeneratorTool(),
  ];

  const executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: "openai-functions",
    verbose: false,
    memory: memory, // Add memory here
    agentArgs: {
      prefix,
    },
  });

  const result = await executor.call({ input, timeout: 30000 });

  console.log(`Got output ${result.output}`);

  return result;
};

function mergeAIMessages(messages) {
  let mergedMessages = [];
  let currentMessage = '';

  for (const message of messages) {
    if (message.role === 'system') {
      currentMessage += message.content + ' '; // Merge AI messages
    } else {
      if (currentMessage !== '') {
        mergedMessages.push(new AIMessage(currentMessage.trim())); // Push merged AI message
        currentMessage = '';
      }
      if (message.role === 'user') {
        mergedMessages.push(new HumanMessage(message.content)); // Push HumanMessage
      } else {
        // Handle the case when the message.role is neither 'user' nor 'ai'
        // For example, create a GenericMessage or just ignore it.
      }
    }
  }

  // Handle the case when the last messages are AI messages
  if (currentMessage !== '') {
    mergedMessages.push(new AIMessage(currentMessage.trim())); // Push merged AI message
  }

  return mergedMessages;
}
