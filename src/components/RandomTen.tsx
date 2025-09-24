import React, { useState, useEffect } from 'react';
import FlashCard from './FlashCard';
import questionsData from '../data/questions.json';

type Question = {
  id: number;
  question: string;
  translation: string;
  answer: string | string[];
  translation_answer: string | string[];
};

interface RandomTenProps {
  questions: Question[];
}

const RandomTen: React.FC<RandomTenProps> = ({ questions }) => {
    const [randomQuestions, setRandomQuestions] = useState<any[]>([]);

    useEffect(() => {
        const getRandomQuestions = () => {
            const shuffled = [...questions].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 10);
            setRandomQuestions(selected);
        };

        getRandomQuestions();
    }, [questions]);

    return (
        <div className="random-ten">
            <h2>Random 10 Questions</h2>
            <div className="flashcard-list">
                {randomQuestions.map((question, index) => (
                    <RandomTenFlashCardWrapper key={question.id} question={question} />
                ))}
            </div>
        </div>
    );
};


// Helper wrapper to manage showAnswer state per card
const RandomTenFlashCardWrapper: React.FC<{ question: any }> = ({ question }) => {
    const [showAnswer, setShowAnswer] = useState(false);
    return (
        <FlashCard
            question={question.question}
            answer={question.answer}
            showAnswer={showAnswer}
            onShowAnswer={() => setShowAnswer(true)}
        />
    );
};

export default RandomTen;