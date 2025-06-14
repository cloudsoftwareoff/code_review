import { useLocation } from 'react-router-dom'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'
import { useState, useEffect } from 'react'

import { navigation } from '../constants'
import Button from './Button'
import MenuSvg from '../assets/svg/MenuSvg'
import { HamburgerMenu } from './design/Header'
import github from '../assets/collaboration/github.png'
import Login from '../components/landing/Login'

const Header = () => {
  const { pathname } = useLocation()
  const [openNavigation, setOpenNavigation] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect for enhanced backdrop
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false)
      enablePageScroll()
    } else {
      setOpenNavigation(true)
      disablePageScroll()
    }
  }

  const handleClick = () => {
    if (!openNavigation) return
    enablePageScroll()
    setOpenNavigation(false)
  }

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 border-b border-gray-800/50 transition-all duration-300 ${
        scrolled 
          ? 'bg-gray-900/95 backdrop-blur-xl shadow-2xl shadow-black/20' 
          : 'bg-gray-900/80 backdrop-blur-lg'
      } ${
        openNavigation ? 'bg-gray-900' : ''
      }`}
    >
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        {/* Logo */}
        <a className="block w-[12rem] xl:mr-8 group" href="#hero">
          <img 
            src="logo.png" 
            width={70} 
            height={40} 
            alt="github-icon"
            className="transition-all duration-300 filter brightness-110 hover:brightness-125 group-hover:scale-105"
          />
        </a>

        {/* Navigation */}
        <nav
          className={`${
            openNavigation ? 'flex' : 'hidden'
          } fixed top-[5rem] left-0 right-0 bottom-0 bg-gray-900/98 backdrop-blur-xl lg:static lg:flex lg:mx-auto lg:bg-transparent transition-all duration-300`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={item.url}
                onClick={handleClick}
                className={`block relative font-code text-2xl uppercase text-white transition-all duration-300 hover:scale-105 hover:text-cyan-400 ${
                  item.onlyMobile ? 'lg:hidden' : ''
                } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
                  item.url === pathname.hash 
                    ? 'z-2 lg:text-cyan-400 text-cyan-400' 
                    : 'lg:text-gray-300 hover:lg:text-white'
                } lg:leading-5 xl:px-12 relative overflow-hidden group`}
              >
                <span className="relative z-10">{item.title}</span>
                {/* Animated underline */}
                <div className="absolute bottom-2 left-6 right-6 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center lg:bottom-1"></div>
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-cyan-400/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-lg"></div>
              </a>
            ))}
          </div>

          <HamburgerMenu />
        </nav>

        <Login />

        {/* Mobile Menu Button */}
        <Button 
          className="ml-auto lg:hidden text-white hover:text-cyan-400 transition-all duration-300 group" 
          px="px-3" 
          onClick={toggleNavigation}
        >
          <div className="group-hover:scale-110 transition-transform duration-300">
            <MenuSvg openNavigation={openNavigation} />
          </div>
        </Button>
      </div>

      {/* Subtle gradient border at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
    </div>
  )
}

export default Header