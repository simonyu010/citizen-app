import React, { useState } from 'react';
import FlashCard from './FlashCard';
import questionsData from '../data/questions.json';

const FlashCardViewer: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [showAnswerMap, setShowAnswerMap] = useState<{ [key: number]: boolean }>({});

  const handleNext = () => setIndex((prev) => (prev + 1) % questionsData.length);
  const handlePrev = () => setIndex((prev) => (prev - 1 + questionsData.length) % questionsData.length);

  const current = questionsData[index];

  const handleShowAnswer = () => {
    setShowAnswerMap((prev) => ({ ...prev, [current.id]: true }));
  };

  return (
    <div className="flashcard-viewer">
      <FlashCard
        question={current.question}
        answer={current.answer}
        translation={current.translation}
        translationAnswer={current.translation_answer}
        showAnswer={!!showAnswerMap[current.id]}
        onShowAnswer={handleShowAnswer}
      />
      <div style={{ marginTop: 16 }}>
        <button onClick={handlePrev}>Previous</button>
        <button onClick={handleNext}>Next</button>
      </div>
      <div style={{ marginTop: 8, fontSize: '0.9em', color: '#888' }}>
        {index + 1} / {questionsData.length}
      </div>
    </div>
  );
};

export default FlashCardViewer;
