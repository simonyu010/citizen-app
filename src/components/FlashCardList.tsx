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

  React.useEffect(() => {
    const synth = window.speechSynthesis;
    const updateVoices = () => {
      const allVoices = synth.getVoices();
      const filtered = allVoices.filter(v => v.name === 'Aaron' || v.name === 'Google US English');
      setVoices(filtered);
      if (filtered.length > 0) {
        const saved = localStorage.getItem('selectedVoice');
        setSelectedVoice(saved && filtered.some(v => v.name === saved) ? saved : filtered[0].name);
      }
    };
    updateVoices();
    synth.onvoiceschanged = updateVoices;
    return () => { synth.onvoiceschanged = null; };
  }, []);

  React.useEffect(() => {
    localStorage.setItem('selectedVoice', selectedVoice);
  }, [selectedVoice]);

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVoice(e.target.value);
  };

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