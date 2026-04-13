import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PracticeAreas from "./components/PracticeAreas";
import About from "./components/About";
import WhyChoose from "./components/WhyChoose";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ContactPage from "./pages/ContactPage";
import AIPage from "./pages/AIPage";
import AlcoholBeveragePage from "./pages/AlcoholBeveragePage";

function HomePage() {
  return (
    <>
      <Hero />
      <PracticeAreas />
      <About />
      <WhyChoose />
      <Contact />
    </>
  );
}

export default function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar />
      <main id="main-content">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/ai" element={<AIPage />} />
        <Route path="/alcohol-beverage-law" element={<AlcoholBeveragePage />} />
      </Routes>
      </main>
      <Footer />
    </>
  );
}
