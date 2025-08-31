import React, { useState, useEffect } from 'react';
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

const speakText = (text: string, selectedVoice: string, voices: SpeechSynthesisVoice[]) => {
  if ('speechSynthesis' in window) {
    const filtered = voices.filter(v =>
      (v.name === 'Aaron' && v.lang === 'en-US') ||
      (v.name.includes('Google US English') && v.lang === 'en-US')
    );
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    let voiceObj = filtered.find(v => v.name === selectedVoice);
    if (!voiceObj) {
      voiceObj = filtered[0];
    }
    if (voiceObj) {
      utter.voice = voiceObj;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }
};

const ProfileViewer: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [showAnswerMap, setShowAnswerMap] = useState<{ [key: number]: boolean }>({});
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>(() => localStorage.getItem('selectedVoice') || '');
  useEffect(() => {
    const loadVoices = () => {
      const voicesList = window.speechSynthesis.getVoices();
      const filtered = voicesList.filter(v =>
        (v.name === 'Aaron' && v.lang === 'en-US') ||
        (v.name.includes('Google US English') && v.lang === 'en-US')
      );
      setVoices(filtered);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleNext = () => setIndex((prev) => (prev + 1) % identityQuestions.length);
  const handlePrev = () => setIndex((prev) => (prev - 1 + identityQuestions.length) % identityQuestions.length);

  const currentQ = identityQuestions[index] as IQ;
  const currentA = identityAnswers.find((a: IA) => a.id === currentQ.id);

  const handleShowAnswer = (e: React.MouseEvent) => {
    e.stopPropagation();
    speakText(currentQ.identityQuestions, selectedVoice, voices);
    setShowAnswerMap((prev) => ({ ...prev, [currentQ.id]: true }));
  };

  const handleAnswerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentA) speakText(currentA.identityAnswers, selectedVoice, voices);
  };
  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVoice(e.target.value);
    localStorage.setItem('selectedVoice', e.target.value);
  };

  return (
    <div className="profile-viewer">
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
      <div
        className="profile-question"
        style={{ cursor: 'pointer', fontSize: '1.2em', color: '#800000', marginBottom: '1em', background: '#ffe6f7', padding: '1em', borderRadius: '10px' }}
        title={'点击题目朗读'}
        onClick={(e) => {
          speakText(currentQ.identityQuestions, selectedVoice, voices);
          if (!showAnswerMap[currentQ.id]) {
            setShowAnswerMap((prev) => ({ ...prev, [currentQ.id]: true }));
          }
        }}
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
