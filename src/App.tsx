
import React, { useState } from 'react';
import FlashCardViewer from './components/FlashCardViewer';
import RandomTen from './components/RandomTen';
import WritingPractice from './components/WritingPractice';
import ReadingPractice from './components/ReadingPractice';
import Layout from './components/Layout';
import questionsData from './data/questions.json';


type Mode = 'all' | 'random' | 'writing' | 'reading';

const App: React.FC = () => {
  const [mode, setMode] = useState<Mode>('all');
  const [randomKey, setRandomKey] = useState(0);

  return (
    <Layout>
      <div style={{ display: 'flex', gap: '1em', marginBottom: '1em', alignItems: 'center' }}>
        {mode !== 'random' && (
          <button onClick={() => setMode('random')}>
            随机10题
          </button>
        )}
        {mode !== 'all' && (
          <button onClick={() => setMode('all')}>
            全部题目
          </button>
        )}
        {mode === 'random' && (
          <>
            <button onClick={() => setRandomKey(k => k + 1)}>
              再来10题
            </button>
            <button onClick={() => setMode('writing')}>
              我读你写
            </button>
            <button onClick={() => setMode('reading')}>
              跟我读
            </button>
          </>
        )}
        {mode === 'writing' && (
          <button onClick={() => setMode('reading')}>
            跟我读
          </button>
        )}
        {mode === 'reading' && (
          <button onClick={() => setMode('writing')}>
            我读你写
          </button>
        )}
        {mode !== 'random' && mode !== 'writing' && mode !== 'reading' && (
          <>
            <button onClick={() => setMode('writing')}>
              我读你写
            </button>
            <button onClick={() => setMode('reading')}>
              跟我读
            </button>
          </>
        )}
      </div>
      {mode === 'random' && <RandomTen key={randomKey} questions={questionsData} />} 
      {mode === 'all' && <FlashCardViewer />} 
      {mode === 'writing' && <WritingPractice />} 
      {mode === 'reading' && <ReadingPractice />} 
    </Layout>
  );
};

export default App;