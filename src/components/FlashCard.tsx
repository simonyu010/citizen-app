import React, { useState } from 'react';


interface FlashCardProps {
  question: string;
  answer: string | string[];
  translation: string;
  translationAnswer: string | string[];
  showAnswer: boolean;
  onShowAnswer: () => void;
}


const getVoiceName = (voice: SpeechSynthesisVoice | null, isIOS: boolean) => {
  if (isIOS) return 'System Default';
  if (!voice) return 'Unknown';
  return voice.name || 'Unknown';
};

const FlashCard: React.FC<FlashCardProps> = ({ question, answer, translation, translationAnswer, showAnswer, onShowAnswer }) => {
  const [currentVoiceName, setCurrentVoiceName] = useState<string>('');

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      setCurrentVoiceName('System Default');
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    }
  };


  // Handler for clicking the question
  const handleQuestionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    speakText(question);
    onShowAnswer();
  };

  // Handler for clicking the answer
  const handleAnswerClick = (ans: string, e: React.MouseEvent) => {
    e.stopPropagation();
    speakText(ans);
  };

  return (
    <div
      className={`flashcard${showAnswer ? ' show-answer' : ''}`}
      tabIndex={0}
      role="button"
      aria-pressed={showAnswer}
    >
      <h3
        style={{ cursor: showAnswer ? 'default' : 'pointer' }}
        title={showAnswer ? undefined : '点击题目显示答案并朗读'}
        onClick={showAnswer ? undefined : handleQuestionClick}
      >
        {question} / {translation}
      </h3>
      <div style={{ fontSize: '0.95em', color: '#888', marginBottom: '0.5em' }}>
        <span>Current Voice: {currentVoiceName || 'Not played yet'}</span>
      </div>
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