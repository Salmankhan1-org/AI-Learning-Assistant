const {GoogleGenAI} = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});



exports.generateUsingAI = async(prompt, isParse=true) => {

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const rawText = response.text;

    // Remove markdown if Gemini adds it
    const cleanText = rawText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

    let questions = cleanText;

    // Convert string → JS object
    if(isParse){
      questions = JSON.parse(cleanText);
    }

    

    return questions;
  } catch (err) {
    throw new Error(err?.message || "Error while using Ai")
  }
}
