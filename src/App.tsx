
import React, { useState } from 'react';
import FlashCardViewer from './components/FlashCardViewer';
import RandomTen from './components/RandomTen';
import WritingPractice from './components/WritingPractice';
import ReadingPractice from './components/ReadingPractice';
import ProfileViewer from './components/ProfileViewer';
import Layout from './components/Layout';
import questionsData from './data/questions.json';


type Mode = 'all' | 'random' | 'writing' | 'reading' | 'profile';

const PASSWORD = 'luka@20221111';
const SESSION_KEY = 'profileAuthTime';
const SESSION_DURATION = 60 * 60 * 1000; // 1 hour

const App: React.FC = () => {
  const [mode, setMode] = useState<Mode>('all');
  const [randomKey, setRandomKey] = useState(0);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Check session validity
  const isProfileAuthed = (() => {
    const t = localStorage.getItem(SESSION_KEY);
    if (!t) return false;
    return Date.now() - parseInt(t, 10) < SESSION_DURATION;
  })();

  const handleProfileClick = () => {
    if (isProfileAuthed) {
      setMode('profile');
    } else {
      setShowPasswordPrompt(true);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === PASSWORD) {
      localStorage.setItem(SESSION_KEY, Date.now().toString());
      setShowPasswordPrompt(false);
      setPasswordInput('');
      setAuthError('');
      setMode('profile');
    } else {
      setAuthError('密码错误，请重试');
    }
  };

  const handleLogoutProfile = () => {
    localStorage.removeItem(SESSION_KEY);
    setMode('all');
  };

  return (
    <Layout>
      <div style={{ display: 'flex', gap: '1em', marginBottom: '1em', alignItems: 'center' }}>
        {/* Navigation buttons */}
        <button onClick={handleProfileClick} style={{ background: '#d32f2f', color: '#fff', borderRadius: 6, border: 'none', padding: '0.6em 1.2em' }}>
          我的资料
        </button>
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
        {mode !== 'random' && mode !== 'writing' && mode !== 'reading' && mode !== 'profile' && (
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
      {/* Password prompt modal */}
      {showPasswordPrompt && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form onSubmit={handlePasswordSubmit} style={{ background: '#fff', padding: '2em', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.15)', minWidth: 320 }}>
            <h2 style={{ color: '#d32f2f', marginBottom: 16 }}>请输入密码访问“我的资料”</h2>
            <input
              type="password"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              style={{ width: '100%', padding: '0.8em', fontSize: '1.1em', borderRadius: 6, border: '1px solid #ccc', marginBottom: 16 }}
              autoFocus
            />
            {authError && <div style={{ color: '#d32f2f', marginBottom: 12 }}>{authError}</div>}
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" style={{ background: '#d32f2f', color: '#fff', borderRadius: 6, border: 'none', padding: '0.6em 1.2em' }}>确认</button>
              <button type="button" style={{ background: '#8e24aa', color: '#fff', borderRadius: 6, border: 'none', padding: '0.6em 1.2em' }} onClick={() => { setShowPasswordPrompt(false); setPasswordInput(''); setAuthError(''); }}>取消</button>
            </div>
          </form>
        </div>
      )}
      {/* Main content */}
      {mode === 'random' && <RandomTen key={randomKey} questions={questionsData} />} 
      {mode === 'all' && <FlashCardViewer />} 
      {mode === 'writing' && <WritingPractice />} 
      {mode === 'reading' && <ReadingPractice />} 
      {mode === 'profile' && (
        <div>
          <ProfileViewer />
          <div style={{ marginTop: 24 }}>
            <button onClick={handleLogoutProfile} style={{ background: '#d32f2f', color: '#fff', borderRadius: 6, border: 'none', padding: '0.6em 1.2em' }}>退出我的资料</button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;