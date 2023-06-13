import { OpenAI } from "langchain/llms/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";

import { CallbackManagerForChainRun } from "langchain/callbacks";
import { BaseChain } from "langchain/chains";
import { BaseMemory } from "langchain/memory";

export class GodsLoreChain extends BaseChain {
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
      maxTokens: 300,
      modelName: "gpt-3.5-turbo",
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