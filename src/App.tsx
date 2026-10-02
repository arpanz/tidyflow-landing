import { Download } from './components/Download'
import { Features } from './components/Features'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { Navbar } from './components/Navbar'
import { Product } from './components/Product'
import { Starfield } from './components/Starfield'
import { WizardFlight } from './components/WizardFlight'
import { WizardFlyby } from './components/WizardFlyby'

function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Starfield />
      <Navbar />
      <main id="main">
        <Hero />
        <Product />
        <Features />
        <WizardFlight />
        <HowItWorks />
        <WizardFlyby />
        <Download />
      </main>
      <Footer />
    </>
  )
}

export default App
