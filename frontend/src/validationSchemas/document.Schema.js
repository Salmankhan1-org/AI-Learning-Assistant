import { z } from "zod";

export const uploadDocumentSchema = z.object({
  title: z.string().min(2, "Document title is required"),
  file: z
    .instanceof(File, { message: "Document is required" })
    .refine(
      (file) =>
        ["application/pdf",
         "application/msword",
         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
         "text/plain"].includes(file.type),
      "Only PDF, DOC, DOCX or TXT files are allowed"
    )
});