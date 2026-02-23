const { generateUsingAI } = require("./gemini.ai");

async function explainUsingAI(prompt, context){
    let aiInput = `You are an intelligent document assistant.

        Carefully analyze the context below.
        The context may contain formatting issues or repeated numbering.
        Extract relevant information even if formatting is imperfect.

        Rules:
        1. Use ONLY information from the context.
        2. The answer may not appear immediately after the question.
        3. Search carefully through the entire context.
        4. If relevant information exists, answer confidently.
        5. Only say "The document does not contain enough information to answer this." if absolutely no relevant sentence exists.

        CONTEXT:
        ---------------------
        ${context}
        ---------------------

        USER QUESTION:
        ${prompt}

        Answer:

        `

        const response = await generateUsingAI(aiInput, false);

        return response;
}

module.exports = explainUsingAI;