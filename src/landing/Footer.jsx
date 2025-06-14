import { socials } from '../constants'
import Section from './Section'

const Footer = () => {
  return (
    <Section crosses className="!px-0 !py-10">
      <div className="container flex sm:justify-between justify-center items-center gap-10 max-sm:flex-col">
        <p className="caption text-n-4 dark:text-n-3 lg:block transition-colors">
          © {new Date().getFullYear()}. All rights reserved.
        </p>

        <ul className="flex gap-5 flex-wrap">
          {socials.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 bg-n-7 dark:bg-n-8 rounded-full transition-all duration-300 hover:bg-n-6 dark:hover:bg-n-7 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-n-5 dark:focus:ring-n-4"
              aria-label={item.title}
            >
              <img 
                src={item.iconUrl} 
                width={16} 
                height={16} 
                alt={item.title}
                className="filter dark:brightness-110 dark:contrast-110 transition-all duration-300"
              />
            </a>
          ))}
        </ul>
      </div>
    </Section>
  )
}

export default Footer