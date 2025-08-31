import React, { useState, useEffect } from 'react';
import FlashCard from './FlashCard';
import questionsData from '../data/questions.json';

type Question = {
  id: number;
  question: string;
  translation: string;
  answer: string | string[];
  translation_answer: string | string[];
};

interface RandomTenProps {
  questions: Question[];
}

const RandomTen: React.FC<RandomTenProps> = ({ questions }) => {
    const [randomQuestions, setRandomQuestions] = useState<any[]>([]);

    useEffect(() => {
        const getRandomQuestions = () => {
            const shuffled = [...questions].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 10);
            setRandomQuestions(selected);
        };

        getRandomQuestions();
    }, [questions]);

    // Voice state for all cards
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<string>(() => localStorage.getItem('selectedVoice') || '');
    const [currentVoiceName, setCurrentVoiceName] = useState<string>('');

    useEffect(() => {
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

    useEffect(() => {
        localStorage.setItem('selectedVoice', selectedVoice);
    }, [selectedVoice]);

    const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedVoice(e.target.value);
    };

    return (
        <div className="random-ten">
            <h2>Random 10 Questions</h2>
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
                <span style={{ marginLeft: 12, color: '#888', fontSize: '0.95em' }}>当前语音: {selectedVoice || '未播放'}</span>
            </div>
            <div className="flashcard-list">
                {randomQuestions.map((question, index) => (
                    <RandomTenFlashCardWrapper
                        key={question.id}
                        question={question}
                        voices={voices}
                        selectedVoice={selectedVoice}
                    />
                ))}
            </div>
        </div>
    );
};


// Helper wrapper to manage showAnswer state per card
const RandomTenFlashCardWrapper: React.FC<{ question: any, voices: SpeechSynthesisVoice[], selectedVoice: string }> = ({ question, voices, selectedVoice }) => {
    const [showAnswer, setShowAnswer] = useState(false);
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

export default RandomTen;