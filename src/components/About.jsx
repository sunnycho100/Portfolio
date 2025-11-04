import Reveal from './Reveal.jsx';

export default function About() {
  return (
    <section id="about" className="section">
      <Reveal delay="140ms" className="about-container">
        <h2>About Me</h2>
        <div className="about-text stagger">
          <p>Hello, my name is Sunny, and I am a third-year Computer Engineering student at the University of Wisconsin–Madison.</p>
          <p>Recently, as part of an IT consulting team, I have been re-examining the value of inefficiency, especially when it comes to securely transferring data.</p>
          <p>To a recruiter reading my résumé, some of my life experiences and choices might seem inefficient at first. Yet I have learned that growth and creativity often emerge when those scattered experiences begin to interconnect, forming a personal database of knowledge.</p>
          <p>Born in South Korea, raised in Singapore with an Australian education, and now studying in the United States, I have walked a path that may appear unconventional.</p>
          <p>These overlapping identities have shaped my ability to adapt to uncertainty with flexibility and resilience. They continue to teach me how to challenge myself and become a bridge between disciplines, cultures, and ways of thinking.</p>
          <p>I look forward to discovering how I can contribute to your team.</p>
        </div>
      </Reveal>
    </section>
  );
}