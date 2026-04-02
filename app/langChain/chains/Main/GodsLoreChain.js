import { OpenAI } from "@langchain/openai";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "@langchain/openai";
import { BaseChain } from "@langchain/classic/chains";

export class GodsLoreChain extends BaseChain {
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

    const model = new OpenAI({
      temperature: 0,
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
      5
    );

    var context = "";

    retrievedContext.forEach((document) => {
      context += document["pageContent"];
    });

    var QA_PROMPT = `Les informations de contexte sont ci-dessous. 
      ---------------------
      ${context}
      ---------------------
      Compte tenu des informations contextuelles et non des connaissances préalables, répondez à la question suivante : ${sanitizedQuestion} ?:
      
      `;

    const res = await model.call(QA_PROMPT);

    return { res };
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