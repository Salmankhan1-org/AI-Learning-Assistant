exports.getContext = (document, prompt)=>{
    let context = "";
    const lowerPrompt = prompt.toLowerCase();

    // Limit number of matched chunks
    const MAX_CHUNKS = 5;

    const matchedChunks = document.chunks
      .filter(chunk =>
        chunk.content.toLowerCase().includes(lowerPrompt)
      )
      .slice(0, MAX_CHUNKS);

    for (let chunk of matchedChunks) {
      context += chunk.content + "\n\n";
    }

    // if no context find then take some portion of extracted text
    if (!context) {
      context = document.extractedText.slice(0, 3000);
    }

    return context;
}