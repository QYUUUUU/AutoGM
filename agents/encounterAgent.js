import { AgentActionOutputParser, AgentExecutor, LLMSingleActionAgent } from "langchain/agents";
import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BaseChatPromptTemplate, renderTemplate } from "langchain/prompts";
import { HumanChatMessage } from "langchain/schema";

import { GodsDescriptionEncounterTool } from "../tools/Encounter/GodsDescriptionEncounterTool.js";
import { GodsEnemiesEncounterTool } from "../tools/Encounter/GodsEnemiesEncounterTool.js";
import { GodsRewardsEncounterTool } from "../tools/Encounter/GodsRewardsEncounterTool.js";
import { GodsTacticsEncounterTool } from "../tools/Encounter/GodsTacticsEncounterTool.js";



const PREFIX = `You are an assistant for the tabletop rpg Dark Fantasy themed game named GODS. You create encounters with the following 4 tools:`;
const formatInstructions = (toolNames) => `Use the following format in your response:

Question: the input specifications of the encounter
Thought: What tool to use to continue processing the request ?
Action: the action to take, should be one of [${toolNames}]
Action Input: the input to call the tool
Observation: do I have the answer yet ?
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now have used all 4 tools and finished the encounter
Final Answer: the complete encounter details I generated with all the tools translated in French`;
const SUFFIX = `Start :

Question: {input}
Thought:{agent_scratchpad}`;

class CustomPromptTemplate extends BaseChatPromptTemplate {
  constructor(args) {
    super({ inputVariables: args.inputVariables });
    this.tools = args.tools;
  }

  _getPromptType() {
    throw new Error("Not implemented");
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

export const startMain = async (question) => {
  const model = new ChatOpenAI({ temperature: 0, verbose: true, modelName: "gpt-3.5-turbo-16k-0613" });
  const tools = [
    // new SerpAPI(process.env.SERPAPI_API_KEY, {
    //   location: "Bordeaux, France",
    //   hl: "fr",
    //   gl: "fr",
    // }),
    // new Calculator(),
    new GodsDescriptionEncounterTool(),
    new GodsEnemiesEncounterTool(),
    new GodsRewardsEncounterTool(),
    new GodsTacticsEncounterTool(),
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

  const input = question;

  console.log(`Executing with input "${input}"...`);

  const result = await executor.call({ input });

  console.log(`Got output ${result.output}`);

  return `Réponse: ${result.output}`;
};