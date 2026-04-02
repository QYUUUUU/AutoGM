import { ChatOpenAI } from "@langchain/openai";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "@langchain/openai";
import { BaseChain } from "@langchain/classic/chains";

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
export const startRules = async (question, userId) => {
  const chain = new GodsRulesChain();
  const res = await chain.invoke({ data: question });
  return { output: res.res };
};
