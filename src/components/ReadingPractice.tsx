import React, { useEffect, useState } from 'react';
import readingData from '../data/reading.json';

interface ReadingItem {
  id: number;
  read: string;
}

const ReadingPractice: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffled, setShuffled] = useState<ReadingItem[]>([]);

  useEffect(() => {
    // Shuffle the reading data once on mount
    const shuffledData = [...(readingData as ReadingItem[])]
      .sort(() => Math.random() - 0.5);
    setShuffled(shuffledData);
    setCurrentIndex(0);
  }, []);

  useEffect(() => {
    if (shuffled.length > 0) {
      speakWord(shuffled[currentIndex].read);
    }
    // eslint-disable-next-line
  }, [currentIndex, shuffled]);

  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(word);
      utter.lang = 'en-US';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    }
  };

  const handleReplay = () => {
    if (shuffled.length > 0) {
      speakWord(shuffled[currentIndex].read);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? shuffled.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === shuffled.length - 1 ? 0 : prev + 1));
  };

  if (shuffled.length === 0) return <div>Loading...</div>;

  return (
    <div className="reading-practice">
      <div
        className="word-box"
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
          cursor: 'pointer',
        }}
        onClick={() => speakWord(shuffled[currentIndex].read)}
        title="点击单词再读一遍"
      >
        <span style={{ fontSize: '1.4em', color: '#333', fontWeight: 500, lineHeight: 1.5, display: 'block' }}>
          {shuffled[currentIndex].read}
        </span>
      </div>
      <div style={{ marginTop: 20, display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button onClick={handlePrev}>上个词</button>
        <button onClick={handleNext}>下个词</button>
      </div>
    </div>
  );
};

export default ReadingPractice;
