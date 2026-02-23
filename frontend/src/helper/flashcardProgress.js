export const calculateFlashcardProgress = (flashcard)=>{
    let totalCards = flashcard?.cards?.length || 0;

    if(totalCards === 0) return 0;

    let viewedCards = flashcard?.cards?.filter(card=>card?.reviewCount > 0).length;

    let progress = (viewedCards / totalCards) * 100;

    return Number(progress).toFixed(2);
}