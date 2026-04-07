import { ChatOpenAI } from "@langchain/openai";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "@langchain/openai";
import { BaseChain } from "@langchain/classic/chains";

/**
 * @fileoverview GodsRulesChain.js
 * @description The solitary remaining functional LangChain feature in the application.
 * Manages the RAG (Retrieval-Augmented Generation) query pipeline for the TTRPG Rules Assistant.
 */

/**
 * @class GodsRulesChain
 * @extends BaseChain
 * @description Custom Langchain BaseChain implementation. Executes a similarity search over the HNSW vector store and constructs a bound context prompt for ChatGPT 3.5 Turbo.
 */
export class GodsRulesChain extends BaseChain {
  _chainType() {
    return "custom";
  }
  serialize() {
    throw new Error("Method not implemented.");
  }
  inputKeys = ["data"];
  outputKeys = ["res"];

  async _call(inputs) {
    const vectorStore = await getVectorStore();

    const model = new ChatOpenAI({
      temperature: 0,
      maxTokens: 800,
      modelName: "gpt-3.5-turbo",
      verbose: false,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    let sanitizedQuestion = '';
    for (const key in inputs) {
      sanitizedQuestion += inputs[key];
    }


    const retrievedContext = await vectorStore.similaritySearch(
      sanitizedQuestion,
      3
    );

    var context = "";

    retrievedContext.forEach((document) => {
      context += document["pageContent"];
    });

    var QA_PROMPT = `Vous êtes un système RAG expert dédié aux règles et au lore du jeu de rôle GODS.
Utilisez UNIQUEMENT les extraits de documentation ci-dessous pour générer votre réponse.
Ne vous appuyez sur aucune connaissance externe. Si la réponse ne figure pas dans le contexte, indiquez simplement "L'information n'est pas dans mes archives."

CONTEXTE:
---------------------
${context}
---------------------

QUESTION UTILISATEUR: ${sanitizedQuestion}
RÉPONSE:
`;

    const res = await model.invoke(QA_PROMPT);
    return { res: res.content };
  }
}

/**
 * @function getVectorStore
 * @description Initializes and loads the requested pre-calculated NLP embeddings from disk via OpenAIEmbeddings.
 * 
 * Wait for obsolete code confirmation: Path inconsistency!
 * It looks blindly into `./app/langChain/data/VectorStores/pdf/`. 
 * If ran strictly native (node `app.js`), this folder starts from `.` (AutoGM root). If ran internally in docker via `/app/app.js` it might be structurally invalid/duplicated due to `/app/data` vs `/app/langChain/data`.
 * Moreover, `backendController` saves embeddings into `/app/data/VectorStores/pdf/`. Here it reads from `./app/langChain/data/VectorStores/pdf/`. This will crash if the folders are distinct in production.
 * @returns {Promise<HNSWLib>} The instantiated index database.
 */
async function getVectorStore() {
  // Load the vector store from the same directory
  const directory = "./app/langChain/data/VectorStores/pdf/";
  const loadedVectorStore = await HNSWLib.load(
    directory,
    new OpenAIEmbeddings({
      verbose: false,
      openAIApiKey: process.env.OPENAI_API_KEY,
    })
  );
  return loadedVectorStore;
}

/**
 * @function startRules
 * @description Exported trigger for the controller (`RulesAgentcall`). Initiates the chain and routes the final string output.
 * @param {string} question - The user's query from the frontend bot.
 * @param {number|string} userId - Not used here but structurally passed by the controller.
 * @returns {Promise<{output: string}>} The resulting LLM conversational response.
 */
export const startRules = async (question, userId) => {
  const chain = new GodsRulesChain();
  const res = await chain.invoke({ data: question });
  return { output: res.res };
};
