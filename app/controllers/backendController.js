import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

/**
 * @fileoverview backendController.js
 * @description Controller responsible for vector embeddings extraction via LangChain. 
 * Allows generation/regeneration of local HNSW vector stores containing rules and lore from PDF documents.
 */

/**
 * @function getEmbedding
 * @description HTTP Endpoint logic to regenerate both Lore (docJDR.pdf) and Rules (rulesJDR.pdf) embeddings sequentially.
 * Features:
 * - Checks that a user is logged in via `req.session.userId`.
 * - Intercepts exceptions to prevent unhandled rejection crashes.
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
export async function getEmbedding(req, res) {
  if (req.session.userId != "undefined" && req.session.userId != "" && req.session.userId != null) {
    try {

      await embedPDF();
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
 * @function embedPDF
 * @description Extracts and processes the text from Lore/Setting PDF (`docJDR.pdf`).
 * Features:
 * - Cleans whitespace and newlines from raw PDF extractions.
 * - Stores vectors locally.
 * 
 * Wait for confirmation: Bug / Inconsistency on folder paths!
 * - Saves to an _absolute_ linux environment path (`/app/data/VectorStores/pdf/`).
 * - Might fail horribly outside of a Docker setup mapping `/app`.
 */
async function embedPDF() {
  const loaderpdf = new PDFLoader("Documentation/docJDR.pdf");

  // Initialize the Text Splitter with a maximum chunk size of 1000 characters and an overlap of 100 characters
  const splitter = new RecursiveCharacterTextSplitter({ maxChunkSize: 2000, overlapSize: 100 });

  // Load and split the PDF document
  const docspdf = await loaderpdf.loadAndSplit(splitter);

  docspdf.forEach(doc => {
    doc.pageContent = doc.pageContent.replace(/(\n\s*)+/g, '\n');
/**
 * @function embedRules
 * @description Extracts and processes the text from Rulebook PDF (`rulesJDR.pdf`).
 * 
 * Wait for confirmation: Bug / Inconsistency on folder paths!
 * - Unlike `embedPDF`, this saves to a _relative_ path (`data/VectorStores/rules/`).
 * - Assuming execution from `/home/moi/projets/AutoGM/` or `/app`, the generated stores are scattering.
 */
    doc.pageContent = doc.pageContent.trim().replaceAll('\n', '  ');
  });

  // Create vector store and index the docs
  const vectorStore = await HNSWLib.fromDocuments(docspdf, new OpenAIEmbeddings());

  // Save the vector store to a directory
  const directory = '/app/data/VectorStores/pdf/';
  await vectorStore.save(directory);
}

async function embedRules() {
  const loaderpdf = new PDFLoader("Documentation/rulesJDR.pdf");

  // Initialize the Text Splitter with a maximum chunk size of 1000 characters and an overlap of 100 characters
  const splitter = new RecursiveCharacterTextSplitter({ maxChunkSize: 2000, overlapSize: 100 });

  // Load and split the PDF document
  const docspdf = await loaderpdf.loadAndSplit(splitter);

  docspdf.forEach(doc => {
    doc.pageContent = doc.pageContent.replace(/(\n\s*)+/g, '\n');
    doc.pageContent = doc.pageContent.trim().replaceAll('\n', '  ');
  });

  // Create vector store and index the docs
  const vectorStore = await HNSWLib.fromDocuments(docspdf, new OpenAIEmbeddings());


  // Save the vector store to a directory
  const directory = 'data/VectorStores/rules/';
  await vectorStore.save(directory);
}