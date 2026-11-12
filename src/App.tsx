import { Download } from './components/Download'
import { Faq } from './components/Faq'
import { Features } from './components/Features'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { Navbar } from './components/Navbar'
import { Privacy } from './components/Privacy'
import { ReviewWays } from './components/ReviewWays'

function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <HowItWorks />
        <Features />
        <ReviewWays />
        <Privacy />
        <Download />
        <Faq />
      </main>
      <Footer />
    </>
  )
}

export default App
