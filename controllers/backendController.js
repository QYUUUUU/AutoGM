import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export async function getEmbedding(req, res) {
  if (req.session.userId != "undefined" && req.session.userId != ""  && req.session.userId != null){
    try {

        await embedPDF();
        await embedRules();

        //Render OK
        res.render('../views/embedding.html.twig');

    } catch (error) {
      console.error(error);
      res.status(500).send("Error processing request");
    }
  }else{
    res.render('../views/login.html.twig');
  }
}

  async function embedPDF(){
    const loaderpdf = new PDFLoader("Documentation/docJDR.pdf");

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
    const directory = 'data/VectorStores/pdf/';
    await vectorStore.save(directory);
  }

  async function embedRules(){
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