import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Animation from './Animation';
import Login from './Login';

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState(null);
  const [animationReady, setAnimationReady] = useState(false);
  const [clickedLogin,setClickedLogin]=useState(false);
  useEffect(() => {
   
    setTimeout(() => setAnimationReady(true), 100);
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 overflow-hidden">
    
      <div 
        className="absolute inset-0 w-full h-full opacity-70" 
        style={{
          backgroundImage: 'radial-gradient(circle, #9c5bcc 1.5px, transparent 1.5px)',
          backgroundSize: '40px 40px',
          animation: 'pulse 8s infinite alternate'
        }}
      />

      {/* Animated floating elements */}
      <div className="absolute w-full h-full overflow-hidden pointer-events-none">
        {/* Floating shapes */}
        <div className={`absolute top-1/4 left-1/4 w-24 h-24 bg-purple-600/20 rounded-xl transform rotate-12 transition-all duration-1000 ${animationReady ? 'opacity-70' : 'opacity-0'}`} 
             style={{animation: 'float 15s infinite ease-in-out'}} />
        <div className={`absolute bottom-1/3 right-1/4 w-16 h-16 bg-indigo-500/30 rounded-xl transform -rotate-6 transition-all duration-1000 delay-300 ${animationReady ? 'opacity-70' : 'opacity-0'}`}
             style={{animation: 'float 12s infinite ease-in-out reverse'}} />
        <div className={`absolute top-1/3 right-1/4 w-20 h-20 bg-purple-700/20 rounded-xl transform rotate-45 transition-all duration-1000 delay-500 ${animationReady ? 'opacity-70' : 'opacity-0'}`}
             style={{animation: 'float 18s infinite ease-in-out'}} />
        <div className={`absolute bottom-1/4 left-1/3 w-32 h-32 bg-purple-400/20 rounded-full transition-all duration-1000 delay-700 ${animationReady ? 'opacity-70' : 'opacity-0'}`}
             style={{animation: 'float 20s infinite ease-in-out'}} />
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path fill="#8b5cf6" fillOpacity="0.8" d="M0,256L48,261.3C96,267,192,277,288,261.3C384,245,480,203,576,197.3C672,192,768,224,864,240C960,256,1056,256,1152,229.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          <path fill="#9333ea" fillOpacity="0.6" d="M0,288L48,261.3C96,235,192,181,288,181.3C384,181,480,235,576,234.7C672,235,768,181,864,160C960,139,1056,149,1152,165.3C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className={`container mx-auto px-6 z-10 transition-all duration-1000 transform ${animationReady ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="flex flex-col lg:flex-row items-center justify-between max-w-6xl mx-auto">
          <div className="lg:w-1/2 mb-12 lg:mb-0 text-center lg:text-left">
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600 mb-6">
              Assistant Code Review
            </h1>
            <p className="text-xl md:text-2xl text-purple-900 mb-8 max-w-xl mx-auto lg:mx-0">
              Elevate your code quality with AI-powered insights that help you ship with confidence.
            </p>
            {clickedLogin ? (<Login/> ):(
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center lg:justify-start">
              <button
                className={`px-8 py-4 text-lg font-medium rounded-xl transition-all duration-300 ${
                  hoveredButton === 'login' 
                    ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white transform -translate-y-1 shadow-xl shadow-purple-500/30' 
                    : 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                }`}
                onMouseEnter={() => setHoveredButton('login')}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() => setClickedLogin(true)}
              >
                Log In
              </button>
              <button
                className={`px-8 py-4 text-lg font-medium rounded-xl transition-all duration-300 ${
                  hoveredButton === 'dashboard' 
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-800 text-white transform -translate-y-1 shadow-xl shadow-indigo-500/30' 
                    : 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                }`}
                onMouseEnter={() => setHoveredButton('dashboard')}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() => handleNavigate('/dashboard')}
              >
                Dashboard
              </button>
            </div>
            )}
          </div>
          
          <div className="lg:w-1/2 flex justify-center">
            <div className={`relative transition-all duration-1000 delay-500 transform ${animationReady ? 'translate-y-0 opacity-100 rotate-0' : 'translate-y-12 opacity-0 rotate-6'}`}>
            <Animation/>
            </div>
          </div>
        </div>
      </div>
      
    

      
    
      <style jsx global>
        {`
          @keyframes float {
            0% { transform: translateY(0) rotate(0); }
            50% { transform: translateY(-20px) rotate(5deg); }
            100% { transform: translateY(0) rotate(0); }
          }
          @keyframes pulse {
            0% { opacity: 0.5; }
            100% { opacity: 0.8; }
          }
        `}
      </style>
    </div>
  );
}