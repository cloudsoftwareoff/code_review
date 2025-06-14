import { brainwaveSymbol, check } from '../assets'
import { collabApps, collabContent, collabText } from '../constants'
import Button from './Button'
import Section from './Section'
import { LeftCurve, RightCurve } from './design/Collaboration'

const Collaboration = () => {
  return (
    <Section crosses className="bg-white dark:bg-gray-900 transition-colors duration-500">
      <div className="container lg:flex lg:items-center lg:gap-16">
        
        {/* Left Content Section */}
        <div className="max-w-[28rem] lg:flex-shrink-0">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-full mb-4">
              🤝 Collaboration Tools
            </span>
            <h2 className="h2 mb-4 md:mb-8 text-gray-900 dark:text-white leading-tight">
              CodeSync / 
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                AI-Enhanced GitHub Integration Tool
              </span>
            </h2>
          </div>

          {/* Enhanced Feature List */}
          <ul className="max-w-[26rem] mb-10 md:mb-14 space-y-1">
            {collabContent.map((item, index) => (
              <li 
                className="group mb-3 py-4 px-4 rounded-xl transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:shadow-lg dark:hover:shadow-black/20 border border-transparent hover:border-gray-200 dark:hover:border-gray-700" 
                key={item.id}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <img 
                      src={check} 
                      width={20} 
                      height={20} 
                      alt="check" 
                      className="filter dark:brightness-110"
                    />
                  </div>
                  <h6 className="body-2 ml-4 font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {item.title}
                  </h6>
                </div>
                {item.text && (
                  <p className="body-2 mt-3 ml-14 text-gray-600 dark:text-gray-300 leading-relaxed">
                    {item.text}
                  </p>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center space-x-4">
            <Button 
              href={'/login'} 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Try it now
            </Button>
            <button className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors duration-300">
              Learn more →
            </button>
          </div>
        </div>

        {/* Right Visualization Section */}
        <div className="lg:ml-auto xl:w-[42rem] mt-8 lg:mt-0">
          <p className="body-2 mb-8 text-gray-600 dark:text-gray-300 md:mb-16 lg:mb-32 lg:w-[24rem] lg:mx-auto text-center lg:text-left leading-relaxed">
            {collabText}
          </p>

          {/* Enhanced Circular Visualization */}
          <div className="relative left-1/2 flex w-[22rem] aspect-square -translate-x-1/2 scale-75 md:scale-100">
            
            {/* Outer rotating ring */}
            <div className="absolute inset-0 border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-full animate-spin-slow opacity-30"></div>
            
            {/* Main circle with enhanced styling */}
            <div className="relative flex w-full aspect-square border-2 border-gray-200 dark:border-gray-700 rounded-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-2xl dark:shadow-black/50">
              
              {/* Inner circle */}
              <div className="flex w-60 aspect-square m-auto border-2 border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 shadow-xl dark:shadow-black/30">
                
                {/* Center logo with enhanced styling */}
                <div className="w-[6rem] aspect-square m-auto p-[0.2rem] bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 rounded-full shadow-lg animate-pulse-slow">
                  <div className="flex items-center justify-center w-full h-full bg-white dark:bg-gray-800 rounded-full">
                    <img 
                      src={brainwaveSymbol} 
                      width={48} 
                      height={48} 
                      alt="CodeReviewer" 
                      className="filter dark:brightness-110 animate-float"
                    />
                  </div>
                </div>
              </div>

              {/* Enhanced App Icons */}
              <ul className="absolute inset-0">
                {collabApps.map((app, index) => (
                  <li
                    key={app.id}
                    className={`absolute top-0 left-1/2 h-1/2 -ml-[1.8rem] origin-bottom transition-transform duration-500 hover:scale-110`}
                    style={{
                      transform: `rotate(${index * 45}deg)`,
                      animationDelay: `${index * 200}ms`
                    }}
                  >
                    <div
                      className={`relative -top-[1.8rem] flex w-[3.6rem] h-[3.8rem] bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-lg dark:shadow-black/30 hover:shadow-xl dark:hover:shadow-black/50 hover:bg-blue-50 dark:hover:bg-gray-600 transition-all duration-300 group`}
                      style={{
                        transform: `rotate(-${index * 45}deg)`
                      }}
                    >
                      <img
                        className="m-auto filter dark:brightness-110 group-hover:scale-110 transition-transform duration-300"
                        src={app.icon}
                        width={app.width}
                        height={app.height}
                        alt={app.title}
                      />
                      
                      {/* Tooltip */}
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                        {app.title}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Enhanced Curves */}
              <div className="opacity-70 dark:opacity-40">
                <LeftCurve />
                <RightCurve />
              </div>

              {/* Additional decorative elements */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 dark:from-blue-400/10 dark:to-purple-400/10"></div>
            </div>

            {/* Floating particles animation */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-2 h-2 bg-blue-400 dark:bg-blue-300 rounded-full opacity-30 animate-float-${i % 3 + 1}`}
                  style={{
                    top: `${20 + i * 10}%`,
                    left: `${15 + i * 12}%`,
                    animationDelay: `${i * 0.5}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-10px) translateX(5px); }
        }
        
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-8px) translateX(-3px); }
        }
        
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-12px) translateX(8px); }
        }
        
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-float-1 { animation: float-1 4s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 5s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 6s ease-in-out infinite; }
      `}</style>
    </Section>
  )
}

export default Collaboration