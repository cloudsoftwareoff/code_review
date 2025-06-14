import { benefits } from "../constants";
import Heading from "./Heading";
import Section from "./Section";
import Arrow from "../assets/svg/Arrow";
import { GradientLight } from "./design/Benefits";
import ClipPath from "../assets/svg/ClipPath";

const Benefits = () => {
  return (
    <Section id="features" className="bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container relative z-2">
        <Heading
          className="md:max-w-md lg:max-w-2xl text-gray-900 dark:text-white"
          title="Code Smarter, Not Harder with CodeReviewer!"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-10">
          {benefits.map((item, index) => (
            <div
              className="group block relative p-0.5 bg-no-repeat bg-[length:100%_100%] transform transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:hover:shadow-black/30"
              style={{
                backgroundImage: `url(${item.backgroundUrl})`,
              }}
              key={item.id}
            >
              {/* Enhanced card container with better dark mode */}
              <div className="relative z-2 flex flex-col min-h-[22rem] p-[2.4rem] bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 group-hover:bg-white/95 dark:group-hover:bg-gray-800/95">
                
                {/* Card number indicator */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 text-white text-sm font-bold rounded-full flex items-center justify-center">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Icon with enhanced styling */}
                <div className="mb-5 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl w-fit transition-transform duration-300 group-hover:scale-110">
                  <img
                    src={item.iconUrl}
                    width={48}
                    height={48}
                    alt={item.title}
                    className="filter dark:brightness-110"
                  />
                </div>

                {/* Enhanced title */}
                <h5 className="h5 mb-5 text-gray-900 dark:text-white font-bold leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {item.title}
                </h5>

                {/* Enhanced description */}
                <p className="body-2 mb-6 text-gray-600 dark:text-gray-300 leading-relaxed flex-grow">
                  {item.text}
                </p>

                {/* Enhanced footer with better CTA */}
                <div className="flex items-center mt-auto pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center space-x-3 group-hover:translate-x-2 transition-transform duration-300">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 rounded-full"></div>
                    <p className="font-code text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      Explore more
                    </p>
                    <div className="transform transition-transform duration-300 group-hover:translate-x-1">
                      <Arrow className="fill-blue-600 dark:fill-blue-400" />
                    </div>
                  </div>
                </div>

                {/* Decorative gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 dark:from-blue-400/10 dark:to-purple-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Enhanced gradient light with dark mode */}
              {item.light && (
                <div className="opacity-70 dark:opacity-40">
                  <GradientLight />
                </div>
              )}

              {/* Enhanced background image with better hover effect */}
              <div
                className="absolute inset-0.5 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden"
                style={{ clipPath: "url(#benefits)" }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 transition-all duration-500 transform group-hover:scale-110">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      width={380}
                      height={362}
                      alt={item.title}
                      className="w-full h-full object-cover filter dark:brightness-90"
                    />
                  )}
                </div>
                
    
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent dark:from-gray-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <ClipPath />

           
              <div className="absolute inset-0 rounded-xl ring-2 ring-blue-500/0 dark:ring-blue-400/0 group-focus-within:ring-blue-500/50 dark:group-focus-within:ring-blue-400/50 transition-all duration-300"></div>
            </div>
          ))}
        </div>

     
        <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"></div>
        </div>
      </div>
    </Section>
  );
};

export default Benefits;