import React, { useState } from 'react';
import identityQuestions from '../data/identityQuestions.json';
import identityAnswers from '../data/identityAnswers.json';

interface IQ {
  id: number;
  identityQuestions: string;
}
interface IA {
  id: number;
  identityAnswers: string;
}

const speakText = (text: string) => {
  if ('speechSynthesis' in window) {
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }
};

const ProfileViewer: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [showAnswerMap, setShowAnswerMap] = useState<{ [key: number]: boolean }>({});

  const handleNext = () => setIndex((prev) => (prev + 1) % identityQuestions.length);
  const handlePrev = () => setIndex((prev) => (prev - 1 + identityQuestions.length) % identityQuestions.length);

  const currentQ = identityQuestions[index] as IQ;
  const currentA = identityAnswers.find((a: IA) => a.id === currentQ.id);

  const handleShowAnswer = (e: React.MouseEvent) => {
    e.stopPropagation();
    speakText(currentQ.identityQuestions);
    setShowAnswerMap((prev) => ({ ...prev, [currentQ.id]: true }));
  };

  const handleAnswerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentA) speakText(currentA.identityAnswers);
  };

  return (
    <div className="profile-viewer">
      <div
        className="profile-question"
        style={{ cursor: showAnswerMap[currentQ.id] ? 'default' : 'pointer', fontSize: '1.2em', color: '#800000', marginBottom: '1em', background: '#ffe6f7', padding: '1em', borderRadius: '10px' }}
        title={showAnswerMap[currentQ.id] ? undefined : '点击题目显示答案并朗读'}
        onClick={showAnswerMap[currentQ.id] ? undefined : handleShowAnswer}
      >
        {currentQ.identityQuestions}
      </div>
      <div
        className="profile-answer"
        style={{
          cursor: showAnswerMap[currentQ.id] ? 'pointer' : 'default',
          fontSize: '1.1em',
          color: '#6a1b9a',
          background: '#f3e5f5',
          padding: '1em',
          borderRadius: '10px',
          marginBottom: '1em',
          minHeight: '2.5em',
          visibility: showAnswerMap[currentQ.id] ? 'visible' : 'hidden',
          transition: 'visibility 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title={showAnswerMap[currentQ.id] ? '点击朗读答案' : undefined}
        onClick={showAnswerMap[currentQ.id] ? handleAnswerClick : undefined}
      >
        {currentA ? currentA.identityAnswers : '无答案'}
      </div>
      <div style={{ marginTop: 16 }}>
        <button style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 6, padding: '0.6em 1.2em', marginRight: 8 }} onClick={handlePrev}>上一题</button>
        <button style={{ background: '#8e24aa', color: '#fff', border: 'none', borderRadius: 6, padding: '0.6em 1.2em' }} onClick={handleNext}>下一题</button>
      </div>
      <div style={{ marginTop: 8, fontSize: '0.9em', color: '#888' }}>
        {index + 1} / {identityQuestions.length}
      </div>
    </div>
  );
};

export default ProfileViewer;
