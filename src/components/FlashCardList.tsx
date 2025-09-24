import React from 'react';
import FlashCard from './FlashCard';

interface Question {
  question: string;
  answer: string | string[];
  translation: string;
  translation_answer: string | string[];
}

interface FlashCardListProps {
  questions: Question[];
}

const FlashCardList: React.FC<FlashCardListProps> = ({ questions }) => {
  return (
    <div className="flash-card-list">
      {questions.map((q, index) => (
        <FlashCardListItem key={index} question={q} />
      ))}
    </div>
  );
};

// Helper wrapper to manage showAnswer state per card
const FlashCardListItem: React.FC<{ question: Question }> = ({ question }) => {
  const [showAnswer, setShowAnswer] = React.useState(false);
  return (
    <FlashCard
  question={question.question}
  answer={question.answer}
  showAnswer={showAnswer}
  onShowAnswer={() => setShowAnswer(true)}
    />
  );
};

export default FlashCardList;