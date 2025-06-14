import { smallSphere, stars } from '../assets'
import Button from './Button'
import Heading from './Heading'
import Section from './Section'

const Pricing = () => {
  return (
    <Section className="overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500" id="pricing">
      <div className="container relative z-2">
        
        {/* Enhanced visual elements */}
        <div className="hidden relative justify-center mb-[6.5rem] lg:flex">
          {/* Animated sphere */}
          <div className="relative">
            <img 
              src={smallSphere} 
              className="relative z-1 animate-float filter dark:brightness-110 hover:scale-110 transition-transform duration-500" 
              width={255} 
              height={255} 
              alt="Sphere" 
            />
            
            {/* Glowing effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 rounded-full blur-3xl opacity-20 dark:opacity-30 animate-pulse-slow"></div>
          </div>

     

          {/* Floating particles */}
       
        </div>

        {/* Enhanced heading with better styling */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-6">
            <span className="inline-block px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 text-sm font-semibold rounded-full mb-6 shadow-lg">
              💰 Simple Pricing
            </span>
          </div>
          
          <Heading 
            tag="Get started with CodeReviewer" 
            title={
              <span>
                It's{' '}
                <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent animate-pulse-slow">
                  Free
                </span>
                {' '}!
              </span>
            }
            className="text-gray-900 dark:text-white"
          />

          {/* Additional pricing content */}
          <div className="mt-12 p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl dark:shadow-black/30 border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="text-6xl font-bold text-gray-900 dark:text-white">0 TND</div>
              <div className="ml-2 text-gray-500 dark:text-gray-400">/month</div>
            </div>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Start reviewing your code with AI-powered insights completely free. No credit card required, no hidden fees.
            </p>

            <div className="space-y-4 mb-8">
              {[
                'Unlimited code reviews',
                'AI-powered suggestions',
                'GitHub integration',
                'Team collaboration',
                '24/7 support'
              ].map((feature, index) => (
                <div key={index} className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <Button 
              href="/signup"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 dark:from-green-400 dark:to-emerald-500 dark:hover:from-green-500 dark:hover:to-emerald-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl py-4 text-lg font-semibold"
            >
              🚀 Get Started Free
            </Button>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        
        @keyframes spin-very-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(8px); }
        }
        
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-12px) translateX(-5px); }
        }
        
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-18px) translateX(12px); }
        }
        
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-spin-very-slow { animation: spin-very-slow 60s linear infinite; }
        .animate-float-1 { animation: float-1 5s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 6s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 7s ease-in-out infinite; }
      `}</style>
    </Section>
  )
}

export default Pricing