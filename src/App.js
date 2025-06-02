import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/landing/Login';
import CodeReviewScreen from './components/CodeReviewScreen';
import WelcomeScreen from './pages/WelcomeScreen';
import Chatbot from './components/Chatbot';
import './App.css';
import { auth } from './lib/firebaseClient';
import { DashboardPage } from './pages/Dashboard';
export const CodeReviewContext = createContext();
export const useCodeReviewContext = () => useContext(CodeReviewContext);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [context, setContext] = useState({ repo: null, file: null });

  useEffect(() => {
  
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="app-loading">Loading...</div>;
  }

  return (
    <CodeReviewContext.Provider value={{ context, setContext }}>
      <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
          {/* Chatbot Button */}
         {user && <button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors z-50"
            aria-label="Open AI Chatbot"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>}

          {/* Chatbot Modal */}
          <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

          <Routes>
            <Route path="/" element={<WelcomeScreen user={user}/>} />
            {/* <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/dashboard" />}
            /> */}
            <Route
              path="/dashboard"
              element={user ? <DashboardPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/review/:repoFullName/:prNumber"
              element={user ? <CodeReviewScreen user={user} /> : <Navigate to="/login" />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </CodeReviewContext.Provider>
  );
}

export default App;