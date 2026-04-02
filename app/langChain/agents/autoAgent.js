import { initializeAgentExecutorWithOptions } from "@langchain/classic/agents";
import { ChatOpenAI } from "@langchain/openai";
import { BufferMemory, ChatMessageHistory } from "@langchain/classic/memory";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { GodsLoreTool } from "../tools/Main/GodsLoreTool.js";
import { GodsRulesTool } from "../tools/Main/GodsRulesTool.js";
import { GodsDiceTool } from "../tools/Main/GodsDiceTool.js";
import { GodsConversationTool } from "../tools/Main/GodsConversationTool.js";
import { RandomNumberGeneratorTool } from "../tools/Main/RandomNumberGeneratorTool.js";
import { setUserId } from "./app/../../../controllers/globals.js";

const prefixLore = `Your name is GM. You are a Game Master of a tabletop RPG game named GODS and you narrate situations in which, I, the player, make decisions in a Dark fantasy world.
If you have a general question about the lore of GODS or its rules use the gods-lore and rules tools.`;

const prefixDice = `Your name is GM. You are a Game Master of a tabletop RPG game named GODS. Your only task right now is to help the player throw dice and resolve their throws using the gods-throws and random number generator tools.`;

export const startMain = async (input, userId, chat) => {
  const messages = chat.map(message => ({
    role: message.sender === 'Bot' ? 'system' : 'user',
    content: message.content,
  }));

  const chat_history = [new SystemMessage(messages[0].content)];
  const restOfMessages = messages.slice(1);
  const processedMessages = mergeAIMessages(restOfMessages);
  chat_history.push(...processedMessages);

  const memory = new BufferMemory({
    chatHistory: new ChatMessageHistory(chat_history),
    returnMessages: true,
    memoryKey: "chat_history",
  });

  setUserId(userId);

  const routerModel = new ChatOpenAI({ temperature: 0, modelName: "gpt-3.5-turbo" });
  const route = await routerModel.call([
    new SystemMessage("Determine if the user's input is asking to roll dice or requesting a dice throw calculation. Reply only with YES or NO."),
    new HumanMessage(input)
  ]);
  
  const isDice = route.content.trim().toUpperCase().includes("YES");

  const model = new ChatOpenAI({ temperature: 0, verbose: true, modelName: "gpt-3.5-turbo" });
  
  const tools = isDice ? [
    new GodsDiceTool(),
    new RandomNumberGeneratorTool()
  ] : [
    new GodsLoreTool(),
    new GodsRulesTool(),
    new GodsConversationTool()
  ];

  const executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: "openai-functions",
    verbose: false,
    memory: memory,
    agentArgs: {
      prefix: isDice ? prefixDice : prefixLore,
    },
  });

  const result = await executor.call({ input, timeout: 30000 });
  return result;
};

function mergeAIMessages(messages) {
  let mergedMessages = [];
  let currentMessage = '';
  for (const message of messages) {
    if (message.role === 'system') {
      currentMessage += message.content + ' '; 
    } else {
      if (currentMessage !== '') {
        mergedMessages.push(new AIMessage(currentMessage.trim())); 
        currentMessage = '';
      }
      if (message.role === 'user') {
        mergedMessages.push(new HumanMessage(message.content)); 
      }
    }
  }
  if (currentMessage !== '') {
    mergedMessages.push(new AIMessage(currentMessage.trim())); 
  }
  return mergedMessages;
}
