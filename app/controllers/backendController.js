import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

/**
 * @fileoverview backendController.js
 * @description Controller responsible for vector embeddings extraction via LangChain.
 * Generates the local HNSW vector store containing rules from the official TTRPG book.
 */

/**
 * @function getEmbedding
 * @description HTTP Endpoint logic to regenerate the Rules embedding from the core book PDF.
 * Features:
 * - Checks that a user is logged in via `req.session.userId`.
 * - Intercepts exceptions to prevent unhandled rejection crashes.
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
export async function getEmbedding(req, res) {
  if (req.session.userId != "undefined" && req.session.userId != "" && req.session.userId != null) {
    try {
      await embedRules();
      //Render OK
      res.render('../views/embedding.html.twig');
    } catch (error) {
      console.error(error);
      res.status(500).send("Error processing request");
    }
  } else {
    res.render('../views/login.html.twig');
  }
}

/**
 * @function embedRules
 * @description Extracts and processes the text from the core Rulebook PDF `GODS_Le_livre_de_base.pdf`.
 * Features:
 * - Cleans whitespace and newlines from raw PDF extractions.
 * - Stores vectors locally in `./app/langChain/data/VectorStores/pdf/` matching `GodsRulesChain.js`.
 */
async function embedRules() {
  const loaderpdf = new PDFLoader("./app/langChain/Documentation/GODS_Le_livre_de_base.pdf");

  // Initialize the Text Splitter with a maximum chunk size of 2000 characters and an overlap of 100 characters
  const splitter = new RecursiveCharacterTextSplitter({ maxChunkSize: 2000, overlapSize: 100 });

  // Load and split the PDF document
  const docspdf = await loaderpdf.loadAndSplit(splitter);

  docspdf.forEach(doc => {
    doc.pageContent = doc.pageContent.replace(/(\n\s*)+/g, '\n');
    doc.pageContent = doc.pageContent.trim().replaceAll('\n', '  ');
  });

  // Create vector store and index the docs
  const vectorStore = await HNSWLib.fromDocuments(docspdf, new OpenAIEmbeddings());

  // Save the vector store to the correct directory matching GodsRulesChain.js
  const directory = './app/langChain/data/VectorStores/pdf/';
  await vectorStore.save(directory);
}
