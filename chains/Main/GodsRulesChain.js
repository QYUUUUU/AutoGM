import { OpenAI } from "langchain/llms/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { BaseChain } from "langchain/chains";

export class GodsRulesChain extends BaseChain {
  _chainType() {
    throw new Error("Method not implemented.");
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
      maxTokens: 800,
      modelName: "gpt-3.5-turbo-16k-0613",
      verbose: false,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
    console.log(inputs)

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

    var QA_PROMPT = `Tu es un assistant des règles du jeu GODS. Les informations de contexte sont ci-dessous. 
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
  const directory = "data/VectorStores/pdf/";
  const loadedVectorStore = await HNSWLib.load(
    directory,
    new OpenAIEmbeddings({
      verbose: false,
      openAIApiKey: process.env.OPENAI_API_KEY,
    })
  );
  return loadedVectorStore;
}