import { useRef } from 'react'
import { curve, heroBackground, robot } from '../assets'
import Generating from './Generating'
import Section from './Section'
import { BackgroundCircles, BottomLine, Gradient } from './design/Hero'

const Hero = () => {
  const parallaxRef = useRef(null)

  return (
    <Section
      className="pt-[12rem] -mt-[5.25rem]"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      <div className="container relative" ref={parallaxRef}>
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
          <h1 className="h1 mb-6 text-gray-900 dark:text-white">
            Enhance your code using AI-driven insights with{` `}
            <span className="inline-block relative" style={{ fontSize: '3rem' }}>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                CodeReviewer
              </span>{' '}
              <img
                src={curve}
                className="absolute top-full left-0 w-full xl:-mt-2 opacity-80 dark:opacity-60"
                width={624}
                height={28}
                alt="Curve"
              />
            </span>
          </h1>
          <p className="body-1 max-w-3xl mx-auto mb-6 text-gray-600 dark:text-gray-300 lg:mb-8">
            " Code Smarter, Not Harder with CodeReviewer ! "
          </p>
        </div>
        
        <div className="relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24">
          {/* Enhanced gradient border with dark mode support */}
          <div className="relative z-1 p-0.5 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400">
            <div className="relative bg-white dark:bg-gray-900 rounded-[1rem] shadow-2xl dark:shadow-black/50">
              {/* Top bar with better dark mode colors */}
              <div className="h-[1.4rem] bg-gray-100 dark:bg-gray-800 rounded-t-[0.9rem] flex items-center px-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>

              <div className="aspect-[33/40] rounded-b-[0.9rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1024/490] bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <img
                  src={robot}
                  className="w-full scale-[1.7] translate-y-[8%] md:scale-[1] md:-translate-y-[10%] lg:-translate-y-[23%] filter dark:brightness-110 dark:contrast-110"
                  width={1024}
                  height={490}
                  alt="AI"
                />

                <Generating className="absolute left-4 right-4 bottom-5 md:left-1/2 md:right-auto md:bottom-8 md:w-[31rem] md:-translate-x-1/2" />
              </div>
            </div>

            <Gradient />
          </div>
          
          {/* Background with dark mode blend mode */}
          <div className="absolute -top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[46%] md:w-[138%] lg:-top-[104%]">
            <img 
              src={heroBackground} 
              className="w-full opacity-90 dark:opacity-40 dark:mix-blend-overlay" 
              width={1440} 
              height={1800} 
              alt="hero" 
            />
          </div>

          {/* Additional dark mode enhancements */}
          <BackgroundCircles className="opacity-70 dark:opacity-30" />
        </div>
      </div>

      <BottomLine />
    </Section>
  )
}

export default Hero