const { Worker } = require("bullmq");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf");

const Document = require("../models/document.schema");
const bullMQRedisConnection = require("../config/bull.redis.connection");
const { chunkText } = require("../utils/chunkService");
const { uploadPDFBuffer } = require("../utils/uploadFilesToCloudinary");

const worker = new Worker(
  "documentQueue",
  async (job) => {
    const { documentId, buffer, mimetype } = job.data;

    const document = await Document.findById(documentId);
    if (!document) throw new Error("Document not found");

    // Restore buffer
    const pdfBuffer = Buffer.from(buffer, "base64");

    //  Convert to PDF if needed
    // const pdfBuffer = await convertToPDF(fileBuffer, mimetype);

    //  Load PDF using pdfjs
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(pdfBuffer),
    });

    const pdf = await loadingTask.promise;

    let extractedText = "";
    let chunks = [];
    let globalChunkIndex = 0;

    //  Loop pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);

      const content = await page.getTextContent();

      const pageText = content.items.map(item => item.str).join(" ");

      extractedText += pageText + "\n";

      const pageChunks = chunkText(pageText, 500);

      pageChunks.forEach((chunk) => {
        chunks.push({
          content: chunk,
          pageNumber: pageNum,
          chunkIndex: globalChunkIndex++,
        });
      });
    }


    //  Upload PDF to Cloudinary
    const cloudinaryResult = await uploadPDFBuffer(pdfBuffer);

    //  Update document
    document.file.url = cloudinaryResult.secure_url;
    document.file.mimeType = "application/pdf";
    document.extractedText = extractedText;
    document.chunks = chunks;
    document.status = "ready";
    document.lastAccessedAt = new Date();

    await document.save();

    return {
      message: "Document processed successfully",
      pages: pdf.numPages,
      chunksCount: chunks.length,
    };
  },
  {
    connection: bullMQRedisConnection,
    concurrency: 2,
  }
);

worker.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed`, result);
});

worker.on("failed", async (job, err) => {
  console.error(` Job ${job?.id} failed:`, err.message);

  if (job?.data?.documentId) {
    await Document.findByIdAndUpdate(job.data.documentId, {
      status: "failed",
    });
  }
});

module.exports = worker;
