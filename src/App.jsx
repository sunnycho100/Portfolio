import './App.css';
import TopNav from './components/TopNav.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Education from './components/Education.jsx';
import Experience from './components/Experience.jsx';
import Skills from './components/Skills.jsx';
import Activities from './components/Activities.jsx';
import More from './components/More.jsx';
import Contact from './components/Contact.jsx';

export default function App() {
  return (
    <>
      <TopNav />
      <div className="container">
        <Hero />
        <About />
        <Education />
        <Experience />
        <Skills />
        <Activities />
        <More />
        <Contact />
      </div>
    </>
  );
}