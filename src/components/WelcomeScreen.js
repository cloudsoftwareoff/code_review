import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState(null);

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 relative overflow-hidden">
      {/* Dotted background */}
      <div 
        className="absolute inset-0 w-full h-full" 
        style={{
          backgroundImage: 'radial-gradient(circle, #9c5bcc 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      />

      {/* Purple curve shape */}
      <div className="absolute bottom-0 w-full h-32 bg-purple-600 rounded-t-full" 
        style={{ borderTopLeftRadius: '100%', borderTopRightRadius: '100%', transform: 'scale(1.5)' }}
      />

      {/* Purple squares floating */}
      <div className="absolute top-24 right-36 w-16 h-16 bg-purple-600 rotate-12 opacity-80" />
      <div className="absolute top-48 right-48 w-12 h-12 bg-purple-500 -rotate-6 opacity-60" />
      <div className="absolute top-16 right-24 w-20 h-20 bg-purple-700 rotate-45 opacity-70" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-6xl font-bold text-purple-800 mb-4">
              Assistant Code Review
            </h1>
            <p className="text-xl text-purple-900 mb-8">
              Join us and make every code review a step towards excellence.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
              <button
                className={`px-8 py-3 text-lg font-medium rounded-lg transition-all duration-300 ${
                  hoveredButton === 'login' 
                    ? 'bg-purple-700 text-white transform -translate-y-1 shadow-lg' 
                    : 'bg-purple-600 text-white shadow-md'
                }`}
                onMouseEnter={() => setHoveredButton('login')}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() => handleNavigate('/login')}
              >
                Login
              </button>
              <button
                className={`px-8 py-3 text-lg font-medium rounded-lg transition-all duration-300 ${
                  hoveredButton === 'dashboard' 
                    ? 'bg-indigo-700 text-white transform -translate-y-1 shadow-lg' 
                    : 'bg-indigo-600 text-white shadow-md'
                }`}
                onMouseEnter={() => setHoveredButton('dashboard')}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() => handleNavigate('/dashboard')}
              >
                Dashboard
              </button>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              {/* Robot character */}
              <div className="w-64 h-64 relative">
                {/* Robot body */}
                <div className="absolute w-36 h-40 bg-gray-200 rounded-2xl bottom-0 left-12 shadow-lg" />
                
                {/* Robot head */}
                <div className="absolute w-32 h-32 bg-gray-200 rounded-xl top-0 left-14 shadow-lg">
                  {/* Robot eye 1 */}
                  <div className="absolute w-10 h-10 bg-blue-500 rounded-full top-6 left-4 flex items-center justify-center">
                    <div className="w-6 h-6 bg-black rounded-full"></div>
                  </div>
                  {/* Robot eye 2 */}
                  <div className="absolute w-10 h-10 bg-green-500 rounded-full top-6 right-4 flex items-center justify-center">
                    <div className="w-6 h-6 bg-black rounded-full"></div>
                  </div>
                </div>
                
                {/* Robot arms */}
                <div className="absolute w-8 h-24 bg-gray-300 rounded-full top-24 left-2 transform rotate-12" />
                <div className="absolute w-8 h-24 bg-gray-300 rounded-full top-24 right-2 transform -rotate-12" />
                
                {/* Robot legs */}
                <div className="absolute w-10 h-16 bg-gray-400 rounded-full bottom-0 left-16" />
                <div className="absolute w-10 h-16 bg-gray-400 rounded-full bottom-0 right-16" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-2 right-4 text-xs text-white opacity-80">
          Built with Spline
        </div>
      </div>
    </div>
  );
}