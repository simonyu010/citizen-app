import React, { useState, useEffect } from 'react';
import FlashCard from './FlashCard';
import questionsData from '../data/questions.json';

const FlashCardViewer: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [showAnswerMap, setShowAnswerMap] = useState<{ [key: number]: boolean }>({});
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>(() => localStorage.getItem('selectedVoice') || '');
  const [voiceLoading, setVoiceLoading] = useState(true);
  const [voiceError, setVoiceError] = useState(false);

  const loadVoices = () => {
    setVoiceLoading(true);
    setVoiceError(false);
    const synth = window.speechSynthesis;
    const updateVoices = () => {
      const allVoices = synth.getVoices();
      const filtered = allVoices.filter(v => v.name === 'Aaron' || v.name === 'Google US English');
      setVoices(filtered);
      if (filtered.length > 0) {
        setVoiceLoading(false);
        const saved = localStorage.getItem('selectedVoice');
        setSelectedVoice(saved && filtered.some(v => v.name === saved) ? saved : filtered[0].name);
      } else {
        // Wait at least 2 seconds before showing error
        setTimeout(() => {
          if (synth.getVoices().filter(v => v.name === 'Aaron' || v.name === 'Google US English').length === 0) {
            setVoiceLoading(false);
            setVoiceError(true);
          }
        }, 2000);
      }
    };
    if (synth.getVoices().length === 0) {
      // Dummy utterance to force voice loading
      const dummy = new window.SpeechSynthesisUtterance('');
      window.speechSynthesis.speak(dummy);
      setTimeout(updateVoices, 2000);
    } else {
      updateVoices();
    }
    synth.onvoiceschanged = updateVoices;
  };

  useEffect(() => {
    loadVoices();
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedVoice', selectedVoice);
  }, [selectedVoice]);

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVoice(e.target.value);
  };

  const handleNext = () => setIndex((prev) => (prev + 1) % questionsData.length);
  const handlePrev = () => setIndex((prev) => (prev - 1 + questionsData.length) % questionsData.length);

  const current = questionsData[index];

  const handleShowAnswer = () => {
    setShowAnswerMap((prev) => ({ ...prev, [current.id]: true }));
  };

  if (voiceLoading) {
    return (
      <div className="flashcard-viewer">
        <h2>全部题目</h2>
        <div style={{ margin: '18px 0', color: '#888', fontSize: '1.1em' }}>
          正在加载语音选项...
        </div>
      </div>
    );
  }
  if (voiceError) {
    return (
      <div className="flashcard-viewer">
        <h2>全部题目</h2>
        <div style={{ margin: '18px 0', color: '#d32f2f', fontSize: '1.1em' }}>
          未能加载语音选项，请重试。
          <button style={{ marginLeft: 12 }} onClick={loadVoices}>重试加载语音</button>
        </div>
      </div>
    );
  }
  return (
    <div className="flashcard-viewer">
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
      <FlashCard
        question={current.question}
        answer={current.answer}
        translation={current.translation}
        translationAnswer={current.translation_answer}
        showAnswer={!!showAnswerMap[current.id]}
        onShowAnswer={handleShowAnswer}
        voices={voices}
        selectedVoice={selectedVoice}
      />
      <div style={{ marginTop: 16 }}>
        <button onClick={handlePrev}>上一题</button>
        <button onClick={handleNext}>下一题</button>
      </div>
      <div style={{ marginTop: 8, fontSize: '0.9em', color: '#888' }}>
        {index + 1} / {questionsData.length}
      </div>
    </div>
  );
};

export default FlashCardViewer;
