import React, { useState } from 'react';


interface FlashCardProps {
  question: string;
  answer: string | string[];
  showAnswer: boolean;
  onShowAnswer: () => void;
}


const speakText = (text: string) => {
  if ('speechSynthesis' in window) {
    const speak = () => {
      const voices = window.speechSynthesis.getVoices();
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      const voiceObj = voices.find(v => v.name === 'Google US English' && v.lang === 'en-US');
      if (voiceObj) utter.voice = voiceObj;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    };
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        speak();
      };
      // Trigger loading voices
      window.speechSynthesis.getVoices();
    } else {
      speak();
    }
  }
};

const FlashCard: React.FC<FlashCardProps> = ({ question, answer, showAnswer, onShowAnswer }) => {
  // Handler for clicking the question (always reads, always shows answer)
  const handleQuestionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    speakText(question);
    if (!showAnswer) onShowAnswer();
  } 

  // Handler for clicking the answer (always reads)
  const handleAnswerClick = (ans: string, e: React.MouseEvent) => {
    e.stopPropagation();
    speakText(ans);
  } 

  return (
    <div
      className={`flashcard${showAnswer ? ' show-answer' : ''}`}
      tabIndex={0}
      role="button"
      aria-pressed={showAnswer}
    >
      <h3
        style={{ cursor: 'pointer', marginBottom: '1em', fontSize: '1.2em' }}
        title={'Click to read question (first click shows answer)'}
        onClick={handleQuestionClick}
      >
        {question}
      </h3>
      {showAnswer && (
        <div className="answer" style={{ marginBottom: '1em' }}>
          <strong>Answer:</strong>
          <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
            {Array.isArray(answer)
              ? answer.map((ans, idx) => (
                  <li
                    key={idx}
                    style={{ cursor: 'pointer' }}
                    title="Click to read answer"
                    onClick={e => handleAnswerClick(ans, e)}
                  >
                    {ans}
                  </li>
                ))
              : (
                  <li
                    style={{ cursor: 'pointer' }}
                    title="Click to read answer"
                    onClick={e => handleAnswerClick(answer as string, e)}
                  >
                    {answer}
                  </li>
                )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FlashCard;