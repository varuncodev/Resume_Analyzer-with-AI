// src/App.jsx
import React, { useState, useEffect } from 'react';
import Header        from './components/Header';
import UploadForm    from './components/UploadForm';
import LoadingScreen from './components/LoadingScreen';
import Results       from './components/Results';
import AuthScreen    from './components/AuthScreen';
import PaymentWall   from './components/PaymentWall';
import { extractTextFromPDF } from './utils/pdfExtractor';
import { analyzeResume }       from './utils/analyzeResume';
import { auth, getUserUsage, incrementFreeUsage, logOut } from './utils/firebase';
import { onAuthStateChanged }  from 'firebase/auth';
import './styles/global.css';
import './App.css';

const VIEW = { FORM: 'form', LOADING: 'loading', RESULTS: 'results', ERROR: 'error', PAYMENT: 'payment' };

export default function App() {
  const [view, setView]         = useState(VIEW.FORM);
  const [results, setResults]   = useState(null);
  const [fileName, setFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [user, setUser]         = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [usage, setUsage]       = useState(null);
  // Store pending analysis while user pays
  const [pendingAnalysis, setPendingAnalysis] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const data = await getUserUsage(u.uid);
        setUsage(data);
      } else {
        setUsage(null);
      }
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  const handleAnalyze = async (file, jobDesc) => {
    if (!user) return; // shouldn't happen but guard

    setView(VIEW.LOADING);
    setFileName(file.name);

    const apiKey = process.env.REACT_APP_GROQ_API_KEY;
    if (!apiKey) {
      setErrorMsg('API key not found. Please add REACT_APP_GROQ_API_KEY to your .env file.');
      setView(VIEW.ERROR);
      return;
    }

    try {
      const resumeText = await extractTextFromPDF(file);
      if (resumeText.length < 50) {
        throw new Error('Could not extract text from the PDF. Make sure it is not a scanned image.');
      }

      // Refresh usage from Firestore
      const currentUsage = await getUserUsage(user.uid);
      setUsage(currentUsage);

      if (!currentUsage.canAnalyzeFree) {
        // Show payment wall — save pending file+desc
        setPendingAnalysis({ resumeText, jobDesc });
        setView(VIEW.PAYMENT);
        return;
      }

      // Free analysis
      const data = await analyzeResume(resumeText, jobDesc);
      await incrementFreeUsage(user.uid);
      const updatedUsage = await getUserUsage(user.uid);
      setUsage(updatedUsage);
      setResults(data);
      setView(VIEW.RESULTS);

    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred. Please try again.');
      setView(VIEW.ERROR);
    }
  };

  // Called after successful Razorpay payment
  const handlePaymentSuccess = async () => {
    if (!pendingAnalysis) return;
    setView(VIEW.LOADING);
    try {
      const data = await analyzeResume(pendingAnalysis.resumeText, pendingAnalysis.jobDesc);
      const updatedUsage = await getUserUsage(user.uid);
      setUsage(updatedUsage);
      setPendingAnalysis(null);
      setResults(data);
      setView(VIEW.RESULTS);
    } catch (err) {
      setErrorMsg(err.message || 'Analysis failed after payment. Please contact support.');
      setView(VIEW.ERROR);
    }
  };

  const handleReset = () => {
    setView(VIEW.FORM);
    setResults(null);
    setFileName('');
    setErrorMsg('');
    setPendingAnalysis(null);
  };

  const handleLogout = async () => {
    await logOut();
    handleReset();
  };

  // Free analyses remaining badge
  const freeLeft = usage ? Math.max(0, 2 - usage.freeUsed) : null;

  if (authLoading) {
    return (
      <div className="app-wrapper">
        <div className="auth-loading">
          <div className="spinner-large" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <Header />

      {/* User bar */}
      {user && (
        <div className="user-bar">
          <div className="user-info">
            {user.photoURL && <img src={user.photoURL} alt="" className="user-avatar" />}
            <span className="user-name">{user.displayName || user.email}</span>
            {freeLeft !== null && (
              <span className={`usage-badge ${freeLeft === 0 ? 'usage-exhausted' : ''}`}>
                {freeLeft > 0 ? `${freeLeft} free left` : 'Free limit reached'}
              </span>
            )}
          </div>
          <button className="logout-btn" onClick={handleLogout}>Sign out</button>
        </div>
      )}

      <main className="main-content">
        {/* Show auth screen if not logged in */}
        {!user ? (
          <>
            {view === VIEW.FORM && (
              <div className="hero fade-in-up">
                <div className="hero-badge">AI-Powered · 2 Free Analyses</div>
                <h1 className="hero-title">Analyze Your Resume<br />with Groq AI</h1>
                <p className="hero-sub">
                  Get ATS score, keyword gap analysis, skill recommendations<br />
                  and actionable suggestions — in under 30 seconds.
                </p>
                <div className="hero-stats">
                  <div className="stat"><span className="stat-num">2</span><span className="stat-label">Free</span></div>
                  <div className="stat-div"></div>
                  <div className="stat"><span className="stat-num">₹9</span><span className="stat-label">After</span></div>
                  <div className="stat-div"></div>
                  <div className="stat"><span className="stat-num">AI</span><span className="stat-label">Powered</span></div>
                </div>
              </div>
            )}
            <div className="content-panel">
              <AuthScreen onLogin={(u) => setUser(u)} />
            </div>
          </>
        ) : (
          <>
            {view === VIEW.FORM && (
              <div className="hero fade-in-up">
                <div className="hero-badge">AI-Powered · {freeLeft > 0 ? `${freeLeft} Free ${freeLeft === 1 ? 'Analysis' : 'Analyses'} Left` : '₹9 per analysis'}</div>
                <h1 className="hero-title">Analyze Your Resume<br />with Groq AI</h1>
                <p className="hero-sub">
                  Get ATS score, keyword gap analysis, skill recommendations<br />
                  and actionable suggestions — in under 30 seconds.
                </p>
                <div className="hero-stats">
                  <div className="stat"><span className="stat-num">5</span><span className="stat-label">Metrics</span></div>
                  <div className="stat-div"></div>
                  <div className="stat"><span className="stat-num">AI</span><span className="stat-label">Powered</span></div>
                  <div className="stat-div"></div>
                  <div className="stat"><span className="stat-num">Free</span><span className="stat-label">Trial</span></div>
                </div>
              </div>
            )}

            <div className="content-panel">
              {view === VIEW.FORM     && <UploadForm onSubmit={handleAnalyze} loading={false} />}
              {view === VIEW.LOADING  && <LoadingScreen />}
              {view === VIEW.PAYMENT  && (
                <PaymentWall
                  user={user}
                  onPaymentSuccess={handlePaymentSuccess}
                  onCancel={handleReset}
                />
              )}
              {view === VIEW.RESULTS && results && (
                <Results data={results} fileName={fileName} onReset={handleReset} />
              )}
              {view === VIEW.ERROR && (
                <div className="error-panel fade-in-up">
                  <div className="error-icon">⚠</div>
                  <h2 className="error-title">Analysis Failed</h2>
                  <p className="error-message">{errorMsg}</p>
                  <button className="error-retry-btn" onClick={handleReset}>Try Again</button>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>Built with React + Groq AI · College Project</p><em>Credit-Varun Sharma</em>
      </footer>
    </div>
  );
}
