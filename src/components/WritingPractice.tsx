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
  const [selectedVoice, setSelectedVoice] = useState<string>(() => localStorage.getItem('selectedVoice') || '');

  useEffect(() => {
    // Shuffle the writing data once on mount
    const shuffledData = [...(writingData as WritingItem[])]
      .sort(() => Math.random() - 0.5);
    setShuffled(shuffledData);
    setCurrentIndex(0);

    // Load voices
    const loadVoices = () => {
      const voicesList = window.speechSynthesis.getVoices();
      // Only keep Aaron and Google US English
      const filtered = voicesList.filter(v =>
        (v.name === 'Aaron' && v.lang === 'en-US') ||
        (v.name.includes('Google US English') && v.lang === 'en-US')
      );
      setVoices(filtered);
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
      const voicesList = window.speechSynthesis.getVoices();
      const filtered = voicesList.filter(v =>
        (v.name === 'Aaron' && v.lang === 'en-US') ||
        (v.name.includes('Google US English') && v.lang === 'en-US')
      );
      const utter = new window.SpeechSynthesisUtterance(sentence);
      utter.lang = 'en-US';
      let voiceObj = filtered.find(v => v.name === selectedVoice);
      if (!voiceObj) {
        voiceObj = filtered[0];
      }
      if (voiceObj) {
        utter.voice = voiceObj;
        setCurrentVoiceName(voiceObj.name);
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

  // Store selection in localStorage
  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVoice(e.target.value);
    localStorage.setItem('selectedVoice', e.target.value);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: 40 }}>
      <div>
        <span style={{ fontSize: 24, fontWeight: 'bold' }}>
          {shuffled[currentIndex].write}
        </span>
      </div>
      <div style={{ margin: '18px 0' }}>
        <label htmlFor="voice-select">选择语音: </label>
        <select
          id="voice-select"
          value={selectedVoice}
          onChange={handleVoiceChange}
          style={{ fontSize: '1em', padding: '0.3em', minWidth: 180 }}
        >
          {voices.map(v => (
            <option key={v.name + v.lang} value={v.name}>
              {v.name} ({v.lang})
            </option>
          ))}
        </select>
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
