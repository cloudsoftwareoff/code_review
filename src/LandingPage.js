import ButtonGradient from './assets/svg/ButtonGradient'
import Benefits from './landing/Benefits'
import Collaboration from './landing/Collaboration'
import Footer from './landing/Footer'
import Header from './landing/Header'
import Hero from './landing/Hero'
import Pricing from './landing/Pricing'
import Roadmap from './landing/Roadmap'

const LandingPage = () => {
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Hero />
        <Benefits />
        <Collaboration />
        <Pricing />
        <Roadmap />
        <Footer />
      </div>

      <ButtonGradient />
    </>
  )
}

export default LandingPage
