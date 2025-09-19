import React, { useState } from 'react';


interface FlashCardProps {
  question: string;
  answer: string | string[];
  translation: string;
  translationAnswer: string | string[];
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

const FlashCard: React.FC<FlashCardProps> = ({ question, answer, translation, translationAnswer, showAnswer, onShowAnswer }) => {
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
        style={{ cursor: 'pointer' }}
        title={'点击题目朗读（首次点击显示答案）'}
        onClick={handleQuestionClick}
      >
        {question} / {translation}
      </h3>
      {showAnswer && (
        <div className="answer">
          <div style={{ display: 'flex', gap: '2em' }}>
            <div>
              <strong>English:</strong>
              <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
                {Array.isArray(answer)
                  ? answer.map((ans, idx) => (
                      <li
                        key={idx}
                        style={{ cursor: 'pointer' }}
                        title="点击朗读答案"
                        onClick={e => handleAnswerClick(ans, e)}
                      >
                        {ans}
                      </li>
                    ))
                  : (
                      <li
                        style={{ cursor: 'pointer' }}
                        title="点击朗读答案"
                        onClick={e => handleAnswerClick(answer as string, e)}
                      >
                        {answer}
                      </li>
                    )}
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