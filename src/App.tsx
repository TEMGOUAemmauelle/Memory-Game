import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, RotateCcw } from 'lucide-react';

type Card = {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const emojis = ['🎮', '🎲', '🎨', '🎭', '🎪', '🎯', '🎱', '🎳'];

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);

  const initializeCards = () => {
    const duplicatedEmojis = [...emojis, ...emojis];
    const shuffledEmojis = duplicatedEmojis.sort(() => Math.random() - 0.5);
    return shuffledEmojis.map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false,
    }));
  };

  useEffect(() => {
    setCards(initializeCards());
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      if (cards[first].emoji === cards[second].emoji) {
        setCards(cards.map((card, index) =>
          index === first || index === second
            ? { ...card, isMatched: true }
            : card
        ));
        setScore(score + 1);
      }
      setTimeout(() => {
        setCards(cards.map((card, index) =>
          flippedCards.includes(index) && !card.isMatched
            ? { ...card, isFlipped: false }
            : card
        ));
        setFlippedCards([]);
      }, 1000);
      setMoves(moves + 1);
    }
  }, [flippedCards]);

  const handleCardClick = (index: number) => {
    if (
      flippedCards.length === 2 ||
      cards[index].isFlipped ||
      cards[index].isMatched
    )
      return;

    setCards(cards.map((card, i) =>
      i === index ? { ...card, isFlipped: true } : card
    ));
    setFlippedCards([...flippedCards, index]);
  };

  const resetGame = () => {
    setCards(initializeCards());
    setFlippedCards([]);
    setScore(0);
    setMoves(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white flex items-center gap-2">
            Memory Game <Sparkles className="w-8 h-8" />
          </h1>
          <div className="flex gap-4">
            <div className="bg-white/20 rounded-lg px-4 py-2 text-white">
              <Trophy className="inline-block w-5 h-5 mr-2" />
              Score: {score}
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2 text-white">
              Moves: {moves}
            </div>
            <button
              onClick={resetGame}
              className="bg-white/20 hover:bg-white/30 transition-colors rounded-lg px-4 py-2 text-white flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" /> Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {cards.map((card, index) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(index)}
              className={`aspect-square bg-white/20 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                card.isFlipped || card.isMatched
                  ? 'rotate-y-180'
                  : ''
              }`}
            >
              <div className="w-full h-full flex items-center justify-center">
                {(card.isFlipped || card.isMatched) ? (
                  <span className="text-4xl">{card.emoji}</span>
                ) : (
                  <span className="text-4xl text-white">❔</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {score === emojis.length && (
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              🎉 Congratulations! You won! 🎉
            </h2>
            <p className="text-white">
              You completed the game in {moves} moves!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;