import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import dotenv from "dotenv";

dotenv.config({ path: "/app/.env" });

async function embedPDF() {
  console.log("Loading GODS_book.pdf...");
  const loaderpdf = new PDFLoader("/app/GODS_book.pdf");

  const splitter = new RecursiveCharacterTextSplitter({ 
    chunkSize: 8000, 
    chunkOverlap: 800 
  });

  const docspdf = await loaderpdf.loadAndSplit(splitter);

  docspdf.forEach(doc => {
    doc.pageContent = doc.pageContent.replace(/(\n\s*)+/g, '\n');
    doc.pageContent = doc.pageContent.trim().replaceAll('\n', '  ');
  });

  console.log("Creating vector store for GODS_book.pdf ...");
  const vectorStore = await HNSWLib.fromDocuments(docspdf, new OpenAIEmbeddings({ batchSize: 20 }));

  const directory = '/app/app/langChain/data/VectorStores/pdf/';
  await vectorStore.save(directory);
  console.log("Saved vector store to " + directory);
}

embedPDF().then(() => console.log("Done")).catch(console.error);
