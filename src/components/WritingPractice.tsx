import React, { useEffect, useState } from 'react';
import writingData from '../data/writing.json';

interface WritingItem {
  id: number;
  write: string;
}

const WritingPractice: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffled, setShuffled] = useState<WritingItem[]>([]);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentVoiceName, setCurrentVoiceName] = useState<string>('');

  useEffect(() => {
    // Shuffle the writing data once on mount
    const shuffledData = [...(writingData as WritingItem[])]
      .sort(() => Math.random() - 0.5);
    setShuffled(shuffledData);
    setCurrentIndex(0);

    // Load voices
    const loadVoices = () => {
      const voicesList = window.speechSynthesis.getVoices();
      setVoices(voicesList);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  useEffect(() => {
    if (shuffled.length > 0) {
      speakSentence(shuffled[currentIndex].write);
    }
    // eslint-disable-next-line
  }, [currentIndex, shuffled]);


  const speakSentence = (sentence: string) => {
    if ('speechSynthesis' in window) {
      const voices = window.speechSynthesis.getVoices();
      const utter = new window.SpeechSynthesisUtterance(sentence);
      utter.lang = 'en-US';
      let googleVoice = voices.find(v => v.name.includes('Google US English') && v.lang === 'en-US');
      if (!googleVoice) {
        googleVoice = voices.find(v => v.lang === 'en-US');
      }
      if (googleVoice) {
        utter.voice = googleVoice;
        setCurrentVoiceName(googleVoice.name);
      } else {
        setCurrentVoiceName('System Default');
      }
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
    <div style={{ textAlign: 'center', marginTop: 40 }}>
      <div>
        <span style={{ fontSize: 24, fontWeight: 'bold' }}>
          {shuffled[currentIndex].write}
        </span>
      </div>
      <div style={{ marginTop: 20, display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button onClick={handlePrev}>上一题</button>
        <button onClick={handleNext}>下一题</button>
      </div>
      <div style={{ marginTop: 10 }}>
        当前语音: {currentVoiceName}
      </div>
    </div>
  );
}

export default WritingPractice;
