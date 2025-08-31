import React from 'react';
import FlashCard from './FlashCard';

interface Question {
  question: string;
  answer: string | string[];
  translation: string;
  translation_answer: string | string[];
}

interface FlashCardListProps {
  questions: Question[];
}

const FlashCardList: React.FC<FlashCardListProps> = ({ questions }) => {
  const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = React.useState<string>(() => localStorage.getItem('selectedVoice') || '');
  const [voiceLoading, setVoiceLoading] = React.useState(true);
  const [voiceError, setVoiceError] = React.useState(false);

  const loadVoices = () => {
    setVoiceLoading(true);
    setVoiceError(false);
    const synth = window.speechSynthesis;
    const updateVoices = () => {
      const allVoices = synth.getVoices();
      const filtered = allVoices.filter(v => v.name === 'Aaron' || v.name === 'Google US English');
      setVoices(filtered);
      setVoiceLoading(false);
      if (filtered.length > 0) {
        const saved = localStorage.getItem('selectedVoice');
        setSelectedVoice(saved && filtered.some(v => v.name === saved) ? saved : filtered[0].name);
      } else {
        setVoiceError(true);
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

  React.useEffect(() => {
    loadVoices();
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  React.useEffect(() => {
    localStorage.setItem('selectedVoice', selectedVoice);
  }, [selectedVoice]);

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVoice(e.target.value);
  };

  if (voiceLoading) {
    return (
      <div className="flash-card-list">
        <h2>全部题目</h2>
        <div style={{ margin: '18px 0', color: '#888', fontSize: '1.1em' }}>
          正在加载语音选项...
        </div>
      </div>
    );
  }
  if (voiceError) {
    return (
      <div className="flash-card-list">
        <h2>全部题目</h2>
        <div style={{ margin: '18px 0', color: '#d32f2f', fontSize: '1.1em' }}>
          未能加载语音选项，请重试。
          <button style={{ marginLeft: 12 }} onClick={loadVoices}>重试加载语音</button>
        </div>
      </div>
    );
  }
  return (
    <div className="flash-card-list">
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
      {questions.map((q, index) => (
        <FlashCardListItem key={index} question={q} voices={voices} selectedVoice={selectedVoice} />
      ))}
    </div>
  );
};

// Helper wrapper to manage showAnswer state per card
const FlashCardListItem: React.FC<{ question: Question; voices: SpeechSynthesisVoice[]; selectedVoice: string }> = ({ question, voices, selectedVoice }) => {
  const [showAnswer, setShowAnswer] = React.useState(false);
  return (
    <FlashCard
      question={question.question}
      answer={question.answer}
      translation={question.translation}
      translationAnswer={question.translation_answer}
      showAnswer={showAnswer}
      onShowAnswer={() => setShowAnswer(true)}
      voices={voices}
      selectedVoice={selectedVoice}
    />
  );
};

export default FlashCardList;