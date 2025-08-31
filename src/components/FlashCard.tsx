

import React, { useState, useEffect } from 'react';

interface FlashCardProps {
  question: string;
  answer: string | string[];
  translation: string;
  translationAnswer: string | string[];
  showAnswer: boolean;
  onShowAnswer: () => void;
  voices: SpeechSynthesisVoice[];
  selectedVoice: string;
}

const FlashCard: React.FC<FlashCardProps> = ({
  question,
  answer,
  translation,
  translationAnswer,
  showAnswer,
  onShowAnswer,
  voices,
  selectedVoice,
}) => {
  // Remove local voice state, use props instead

  const speakText = (text: string) => {
    if (!text) return;
    const synth = window.speechSynthesis;
    const voice = voices.find(v => v.name === selectedVoice) || voices[0];
    if (!voice) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = voice;
    synth.cancel();
    synth.speak(utter);
  };

  const handleQuestionClick = () => {
    speakText(question);
    if (!showAnswer) onShowAnswer();
  };

  const handleAnswerClick = (ans: string, e: React.MouseEvent) => {
    e.stopPropagation();
    speakText(ans);
  };

  // Remove dropdown and voice display from FlashCard
  return (
    <div
      className={`flashcard${showAnswer ? ' show-answer' : ''}`}
      tabIndex={0}
      role="button"
      aria-pressed={showAnswer}
    >
      <h3
        style={{ cursor: 'pointer' }}
        title={'点击题目朗读'}
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
                  ? (answer as string[]).map((ans: string, idx: number) => (
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
                  ? (translationAnswer as string[]).map((ans: string, idx: number) => <li key={idx}>{ans}</li>)
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