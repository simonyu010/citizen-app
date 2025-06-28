import React, { useState } from 'react';


interface FlashCardProps {
  question: string;
  answer: string | string[];
  translation: string;
  translationAnswer: string | string[];
  showAnswer: boolean;
  onShowAnswer: () => void;
}

const FlashCard: React.FC<FlashCardProps> = ({ question, answer, translation, translationAnswer, showAnswer, onShowAnswer }) => {
  return (
    <div
      className={`flashcard${showAnswer ? ' show-answer' : ''}`}
      onClick={showAnswer ? undefined : onShowAnswer}
      style={{ cursor: showAnswer ? 'default' : 'pointer' }}
      tabIndex={0}
      role="button"
      aria-pressed={showAnswer}
      title={showAnswer ? undefined : 'Click to show answer'}
    >
      <h3>{question} / {translation}</h3>
      {showAnswer && (
        <div className="answer">
          <div style={{ display: 'flex', gap: '2em' }}>
            <div>
              <strong>English:</strong>
              <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
                {Array.isArray(answer)
                  ? answer.map((ans, idx) => <li key={idx}>{ans}</li>)
                  : <li>{answer}</li>}
              </ul>
            </div>
            <div>
              <strong>中文:</strong>
              <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
                {Array.isArray(translationAnswer)
                  ? translationAnswer.map((ans, idx) => <li key={idx}>{ans}</li>)
                  : <li>{translationAnswer}</li>}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashCard;