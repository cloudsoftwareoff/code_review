import Button from './Button'
import Heading from './Heading'
import Section from './Section'
import Tagline from './Tagline'
import { roadmap } from '../constants'
import { check2, grid, loading1, smallSphere, stars } from '../assets'
import { Gradient } from './design/Roadmap'

// Enhanced Roadmap Component
const Roadmap = () => (
  <Section className="overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-500" id="roadmap">
    <div className="container md:pb-10">
      <Heading 
        tag="Ready to get started" 
        title="What we're working on" 
        className="text-gray-900 dark:text-white"
      />

      <div className="relative grid gap-8 md:grid-cols-2 md:gap-6 md:pb-[7rem]">
        {roadmap.map((item, index) => {
          const status = item.status === 'done' ? 'Done' : 'In progress'
          const isDone = item.status === 'done'

          return (
            <div
              className={`group md:flex even:md:translate-y-[7rem] p-0.5 rounded-[2.5rem] transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl dark:hover:shadow-black/30 ${
                item.colorful 
                  ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400' 
                  : 'bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600'
              }`}
              key={item.id}
              style={{
                animationDelay: `${index * 200}ms`
              }}
            >
              <div className="relative p-8 bg-white dark:bg-gray-800 rounded-[2.4375rem] overflow-hidden xl:p-15 transition-colors duration-300">
                
                {/* Enhanced grid background */}
                <div className="absolute top-0 left-0 max-w-full opacity-10 dark:opacity-5">
                  <img 
                    className="w-full filter dark:invert" 
                    src={grid} 
                    width={550} 
                    height={550} 
                    alt="Grid" 
                  />
                </div>

                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 dark:from-blue-400/10 dark:to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-1">
                  {/* Enhanced header with better spacing */}
                  <div className="flex items-center justify-between max-w-[27rem] mb-8 md:mb-20">
                    <div className="transform group-hover:scale-105 transition-transform duration-300">
                      <Tagline className="text-blue-600 dark:text-blue-400">{item.date}</Tagline>
                    </div>

                    {/* Enhanced status badge */}
                    <div className={`flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                      isDone 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 shadow-green-500/20' 
                        : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 shadow-orange-500/20'
                    } shadow-lg group-hover:shadow-xl`}>
                      <div className={`w-3 h-3 mr-2 rounded-full ${isDone ? 'bg-green-500' : 'bg-orange-500'} ${!isDone && 'animate-pulse'}`}></div>
                      <img
                        className={`mr-2 ${isDone ? 'filter-none' : 'animate-spin'} transition-transform duration-500`}
                        src={item.status === 'done' ? check2 : loading1}
                        width={16}
                        height={16}
                        alt={status}
                      />
                      <span className="tagline">{status}</span>
                    </div>
                  </div>

                  {/* Enhanced image container */}
                  <div className="mb-10 -my-10 -mx-15 group-hover:scale-105 transition-transform duration-500 overflow-hidden rounded-2xl">
                    <img
                      className="w-full filter dark:brightness-90 group-hover:brightness-110 dark:group-hover:brightness-100 transition-all duration-500"
                      src={item.imageUrl}
                      width={628}
                      height={426}
                      alt={item.title}
                    />
                    {/* Image overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Enhanced content */}
                  <h4 className="h4 mb-4 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {item.title}
                  </h4>
                  <p className="body-2 text-gray-600 dark:text-gray-300 leading-relaxed">
                    {item.text}
                  </p>

                  {/* Progress indicator for in-progress items */}
                  {!isDone && (
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <span>Progress</span>
                        <span>75%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Corner accent */}
                <div className={`absolute top-4 right-4 w-12 h-12 rounded-full ${
                  item.colorful 
                    ? 'bg-gradient-to-br from-blue-400 to-purple-600' 
                    : 'bg-gradient-to-br from-gray-400 to-gray-600'
                } opacity-20 group-hover:opacity-40 transition-opacity duration-300`}></div>
              </div>
            </div>
          )
        })}

        <div className="opacity-70 dark:opacity-40">
          <Gradient />
        </div>
      </div>

    
      <div className="flex justify-center mt-12 md:mt-15 xl:mt-20">
        <Button 
          href="/roadmap"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl px-8 py-4"
        >
          <span className="mr-2">🗺️</span>
          Our roadmap
        </Button>
      </div>
    </div>
  </Section>
)
export default Roadmap