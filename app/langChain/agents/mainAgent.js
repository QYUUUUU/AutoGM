import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { GodsLoreTool } from "../tools/Main/GodsLoreTool.js";
import { GodsRulesTool } from "../tools/Main/GodsRulesTool.js";
import { GodsDiceTool } from "../tools/Main/GodsDiceTool.js";
import { GodsConversationTool } from "../tools/Main/GodsConversationTool.js";
import { RandomNumberGeneratorTool } from "../tools/Main/RandomNumberGeneratorTool.js";
import { setUserId } from "./app/../../../controllers/globals.js";

const prefixLore = `Vous êtes le système d'assistance principal pour le jeu de rôle GODS. Vous fournissez des réponses exactes sur les règles et le récit (lore). Utilisez la base de données RAG jointe pour fournir votre réponse en français.`;
const prefixDice = `Vous êtes le moteur central de Game Master automatisé pour GODS. Votre système délègue les calculs et affiche la réponse JSON finale. Vous générez le JSON approprié pour les calculs de dés sans inventer d'information supplémentaires (utilisez l outil 'Dice-RNG-Tool' pour les dés simples, ou 'gods-throws' pour les compétences complexes, et renvoyez le JSON brut).`;

export const startMain = async (question, userId) => {
  setUserId(userId);

  const questionLower = question.toLowerCase().trim();
  let isDice = false;

  if (questionLower.startsWith("lance") || questionLower.startsWith("jette") || questionLower.startsWith("jet")) {
    isDice = true;
  } else {
    const routerModel = new ChatOpenAI({ temperature: 0, modelName: "gpt-3.5-turbo" });
    const route = await routerModel.invoke([
      new SystemMessage("Vous êtes le routeur d'entrée du système GODS. L'utilisateur souhaite-t-il lancer des dés, générer des nombres aléatoires ou résoudre un test de compétence (ex: 'jette perception', 'lance 5d20') ? Tolérez les erreurs de frappe (ex: 'pistae'). Répondez UNIQUEMENT par YES (c'est un jet de dés) ou NO (c'est une question de règles/lore)."),
      new HumanMessage(question)
    ]);
    isDice = route.content.trim().toUpperCase().includes("YES") || route.content.trim().toUpperCase().includes("OUI");
  }

  const model = new ChatOpenAI({ 
    temperature: 0, 
    verbose: true, 
    modelName: "gpt-3.5-turbo-1106",
    modelKwargs: isDice ? { response_format: { type: "json_object" } } : undefined
  });

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
    agentArgs: {
      prefix: isDice ? prefixDice : prefixLore,
    },
  });

  const input = question;
  const result = await executor.invoke({ input, timeout: 30000 });
  return result;
};
