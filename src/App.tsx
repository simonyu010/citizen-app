import React, { useState } from 'react';
import FlashCardViewer from './components/FlashCardViewer';
import RandomTen from './components/RandomTen';
import Layout from './components/Layout';
import questionsData from './data/questions.json';

const App: React.FC = () => {
  const [showRandom, setShowRandom] = useState(false);
  const [randomKey, setRandomKey] = useState(0);

  const toggleRandom = () => {
    setShowRandom(!showRandom);
  };

  return (
    <Layout>
      <div style={{ display: 'flex', gap: '1em', marginBottom: '1em' }}>
        <button onClick={toggleRandom}>
          {showRandom ? '全部题目' : '随机10题'}
        </button>
        {showRandom && (
          <button onClick={() => setRandomKey(k => k + 1)}>
            再来10题
          </button>
        )}
      </div>
      {showRandom ? (
        <RandomTen key={randomKey} questions={questionsData} />
      ) : (
        <FlashCardViewer />
      )}
    </Layout>
  );
};

export default App;