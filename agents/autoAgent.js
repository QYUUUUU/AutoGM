import { AgentActionOutputParser, AgentExecutor, LLMSingleActionAgent } from "langchain/agents";

import { LLMChain } from "langchain/chains";

import { ChatOpenAI } from "langchain/chat_models/openai";

import { BaseChatPromptTemplate, BasePromptTemplate, renderTemplate } from "langchain/prompts";

import { HumanChatMessage } from "langchain/schema";

import { SerpAPI, Tool } from "langchain/tools";

import { initializeAgentExecutorWithOptions } from "langchain/agents";

import { DynamicTool } from "langchain/tools";

import { Calculator } from "langchain/tools/calculator";

import { GodsLoreTool } from "../tools/Main/GodsLoreTool.js";

import { GodsRulesTool } from "../tools/Main/GodsRulesTool.js";

import { GodsEncounterTool } from "../tools/Main/GodsEncounterTool.js";

import { GodsDiceTool } from "../tools/Main/GodsDiceTool.js";

import { GodsConversationTool } from "../tools/Main/GodsConversationTool.js";

import { RandomNumberGeneratorTool } from "../tools/Main/RandomNumberGeneratorTool.js";

import { setUserId } from "../controllers/globals.js";

var PREFIX = `Your name is GM. You are a Game Master of a tabletop RPG game and you narrate situations in which, I, the player, make decisions. The world you are making me play in is a Dark fantasy themed one. The scenario takes place in a medieval city of the kingdom of Avhorea. The ruler of the kingdom is "Sevire the Red", nickname she acquired by killing all the noble houses that were her ennemies, and by disennobling the weakest ones she still has ennemies within her kingdom, although they don't fight her upfront and scheme in the shadows.

One of those schemes is where the story takes place. One of the representatives of fallen noble houses has made a pact with a neighboring kingdom to fight back and try to seize Sevire's empire.

This other kingdom is named "The Empire of the Dark Sun" and has dark priests that are representatives of a cult that has magic abilities thanks to their God "L'unique", they are corrupted sorcerers, that kill children and meld with dark energies, summoning monstrous beasts from another world.

Sevire has a magical sword, that make her almost as strong as a god, and 8 other blades are weilded by her most faithful servents, and generals of her army, the silver phalanx.

To help yourself, you must use tools when necessary. Always decide the player's actions resolution via the throwing of a d20 dice.

The player ALWAYS explicitly tell you to roll for him, not the other way around.

Always explain your chain of thought to the user, always give him the result of a roll and what they rolled for.

If you have a general question about the lore of GODS or its rules use the tool gods-lore with the Action gods-lore and the Action Input set to the question asked, the tool will then answer your question. 

You need to be less immersive and be blunt about technicalities, share everything you think to the user in tge final answer

Here is the history of your conversation so far :`;


var formatInstructions = (toolNames) => `You must absolutely Use the following format in your response:

Query: the user's last input you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [${toolNames}]
Action Input: the input to the action detailed in the tool
Observation: do I have the answer yet ?
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input Query that must be formulated in French explaining your chain of thought and the results of the rolled dice`;
const SUFFIX = `Start :

Query: {input}
Thought:{agent_scratchpad}`;

class CustomPromptTemplate extends BaseChatPromptTemplate {
  constructor(args) {
    super({ inputVariables: args.inputVariables });
    this.tools = args.tools;
  }

  _getPromptType(){  
    return "custom";  
   }

  async formatMessages(values) {
    /** Construct the final template */
    const toolStrings = this.tools
      .map((tool) => `${tool.name}: ${tool.description}`)
      .join("\n");
    const toolNames = this.tools.map((tool) => tool.name).join("\n");
    const instructions = formatInstructions(toolNames);
    const template = [PREFIX, toolStrings, instructions, SUFFIX].join("\n\n");
    /** Construct the agent_scratchpad */
    const intermediateSteps = values.intermediate_steps;
    const agentScratchpad = intermediateSteps.reduce(
      (thoughts, { action, observation }) =>
        thoughts +
        [action.log, `\nObservation: ${observation}`, "Thought:"].join("\n"),
      ""
    );
    const newInput = { agent_scratchpad: agentScratchpad, ...values };
    /** Format the template. */
    const formatted = renderTemplate(template, "f-string", newInput);
    return [new HumanChatMessage(formatted)];
  }

  partial(_values) {
    throw new Error("Not implemented");
  }

  serialize() {
    throw new Error("Not implemented");
  }
}


class CustomOutputParser extends AgentActionOutputParser {
  async parse(text) {
    if (text.includes("Final Answer:")) {
      const parts = text.split("Final Answer:");
      const input = parts[parts.length - 1].trim();
      const finalAnswers = { output: input };
      return { log: text, returnValues: finalAnswers };
    }

    const match = /Action: (.*)\nAction Input: (.*)/s.exec(text);
    if (!match) {
      throw new Error(`Could not parse LLM output: ${text}`);
    }

    return {
      tool: match[1].trim(),
      toolInput: match[2].trim().replace(/^"+|"+$/g, ""),
      log: text,
    };
  }

  getFormatInstructions() {
    throw new Error("Not implemented");
  }
}

export const startMain = async (Query, userId, memory) => {


  var messages = "";

  memory.forEach(message => {
    messages += message.sender + ": " + message.content + "\n\n";
  });

  // Set the userId value
  setUserId(userId);

  PREFIX += messages;

  const model = new ChatOpenAI({ temperature: 0, verbose: true, modelName: "gpt-3.5-turbo-16k-0613" });
  const tools = [
    // new SerpAPI(process.env.SERPAPI_API_KEY, {
    //   location: "Bordeaux, France",
    //   hl: "fr",
    //   gl: "fr",
    // }),
    // new Calculator(),
    new GodsLoreTool(),
    // new GodsRulesTool(),
    // new GodsDiceTool(),
    new RandomNumberGeneratorTool(),
    // new GodsConversationTool()
  ];

  const llmChain = new LLMChain({
    prompt: new CustomPromptTemplate({
      tools,
      inputVariables: ["input", "agent_scratchpad"],
    }),
    llm: model,
  });

  const agent = new LLMSingleActionAgent({
    llmChain,
    outputParser: new CustomOutputParser(),
    stop: ["\nObservation"],
  });
  const executor = new AgentExecutor({
    agent,
    tools,
  });
  console.log("Loaded agent.");

  const input = Query;

  console.log(`Executing with input "${input}"...`);

  const result = await executor.call({ input, timeout: 20000 });

  console.log(`Got output ${result.output}`);

  return result;
};