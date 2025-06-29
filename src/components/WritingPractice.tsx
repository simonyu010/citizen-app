import React, { useEffect, useState } from 'react';
import writingData from '../data/writing.json';

interface WritingItem {
  id: number;
  write: string;
}

const WritingPractice: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffled, setShuffled] = useState<WritingItem[]>([]);

  useEffect(() => {
    // Shuffle the writing data once on mount
    const shuffledData = [...(writingData as WritingItem[])]
      .sort(() => Math.random() - 0.5);
    setShuffled(shuffledData);
    setCurrentIndex(0);
  }, []);

  useEffect(() => {
    if (shuffled.length > 0) {
      speakSentence(shuffled[currentIndex].write);
    }
    // eslint-disable-next-line
  }, [currentIndex, shuffled]);


  const speakSentence = (sentence: string) => {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(sentence);
      utter.lang = 'en-US';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    }
  };


  useEffect(() => {
    const replayListener = () => {
      if (shuffled.length > 0) {
        speakSentence(shuffled[currentIndex].write);
      }
    };
    window.addEventListener('writing-replay', replayListener);
    return () => {
      window.removeEventListener('writing-replay', replayListener);
    };
  }, [shuffled, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? shuffled.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === shuffled.length - 1 ? 0 : prev + 1));
  };

  if (shuffled.length === 0) return <div>Loading...</div>;

  return (
    <div className="writing-practice">
      <div
        className="sentence-box"
        style={{
          background: '#f9f9f9',
          border: '2px solid #4a90e2',
          borderRadius: '12px',
          padding: '1.2em',
          margin: '1.5em auto',
          maxWidth: '98vw',
          width: '100%',
          boxSizing: 'border-box',
          boxShadow: '0 2px 12px rgba(74,144,226,0.08)',
          textAlign: 'center',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
        }}
      >
        <span style={{ fontSize: '1.2em', color: '#333', fontWeight: 500, lineHeight: 1.5, display: 'block' }}>
          {shuffled[currentIndex].write}
        </span>
      </div>
      <div style={{ marginTop: 20, display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button onClick={handlePrev}>上一题</button>
        <button onClick={handleNext}>下一题</button>
      </div>
    </div>
  );
};

export default WritingPractice;
