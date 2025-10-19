import React, { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    const revealables = Array.from(document.querySelectorAll('.reveal'));

    const reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      revealables.forEach(el => el.classList.add('reveal-active'));
      return;
    }

    revealables.forEach(el => el.classList.add('reveal-init'));

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('reveal-active');
          el.classList.remove('reveal-init');
          obs.unobserve(el);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -5% 0px',
      threshold: 0.12
    });

    revealables.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const ids = ['home','about','education','experience','skills','activities','more','contact'];
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
    const links = Array.from(document.querySelectorAll('.nav-links .tab'));
    const setActive = id => {
      links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + id));
    };
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, { threshold: 0.5 });
    sections.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <div>
      {/* Fixed top navigation bar */}
      <nav className="topnav" aria-label="Primary">
        <div className="topnav-inner">
          <a className="brand" href="#home">Sunny</a>
          <div className="tabbar">
            <ul className="nav-links">
              <li><a className="tab" href="#home">Home</a></li>
              <li><a className="tab" href="#about">About</a></li>
              <li><a className="tab" href="#education">Education</a></li>
              <li><a className="tab" href="#experience">Experience</a></li>
              <li><a className="tab" href="#skills">Skills</a></li>
              <li><a className="tab" href="#activities">Activities</a></li>
              <li><a className="tab" href="#more">More</a></li>
              <li><a className="tab" href="#contact">Contact</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <div className="container">

        {/* Hero */}
        <div id="home" className="header-container section">
          <div className="hero-text">
            <h1>Hello, I'm Sunny!</h1>
            <p>A third-year Computer Engineering student at the University of Wisconsin–Madison.</p>
            <p><span className="badge">Computer Engineering · UW–Madison</span></p>

            <a href="/Sunny_Cho_Resume.pdf" className="resume-button" download>
              <i className="fa-solid fa-file-pdf" aria-hidden="true"></i> Download Résumé
            </a>
          </div>

          <div className="hero-photo">
            <img src="/passport_photo.jpg" alt="Photo of Sunny Cho" loading="lazy" />
          </div>
        </div>

        {/* About */}
        <div id="about" className="about-container section reveal" style={{ '--reveal-delay': '140ms' }}>
          <h2>About Me</h2>
          <div className="about-text stagger">
            <p>Hello, my name is Sunny, and I am a third-year Computer Engineering student at the University of Wisconsin–Madison.</p>
            <p>Recently, as part of an IT consulting team, I have been re-examining the value of inefficiency, especially when it comes to securely transferring data.</p>
            <p>To a recruiter reading my résumé, some of my life experiences and choices might seem inefficient at first. Yet I have learned that growth and creativity often emerge when those scattered experiences begin to interconnect, forming a personal database of knowledge.</p>
            <p>Born in South Korea, raised in Singapore with an Australian education, and now studying in the United States, I have walked a path that may appear unconventional.</p>
            <p>These overlapping identities have shaped my ability to adapt to uncertainty with flexibility and resilience. They continue to teach me how to challenge myself and become a bridge between disciplines, cultures, and ways of thinking.</p>
            <p>I look forward to discovering how I can contribute to your team.</p>
          </div>
        </div>

        {/* Education */}
        <div id="education" className="list-container section reveal" style={{ '--reveal-delay': '180ms' }}>
          <h2>Education</h2>
          <ul className="item-list stagger">
            <li className="list-item">
              <div className="edu-line">
                <strong>University of Wisconsin–Madison</strong>
                <span className="meta">Sep 2022 – Dec 2027 · Madison, WI</span>
              </div>
              <ul className="bullet-list stagger">
                <li>Dean’s Honor List</li>
              </ul>
            </li>

            <li className="list-item">
              <div className="edu-line">
                <strong>Australian International School, Singapore</strong>
                <span className="meta">Jan 2019 – Dec 2021 · Singapore</span>
              </div>
              <ul className="bullet-list stagger">
                <li>Valedictorian, Class of 2021</li>
                <li>International Baccalaureate Diploma Programme</li>
              </ul>
            </li>
          </ul>
        </div>

        {/* Work Experience */}
        <div id="experience" className="list-container section reveal" style={{ '--reveal-delay': '220ms' }}>
          <h2>Work Experience</h2>
          <ul className="item-list stagger">
            <li className="list-item">
              <div className="role-line">
                <strong>Undergraduate Teaching Assistant</strong> — University of Wisconsin–Madison
                <span className="meta">Aug 2025 – Present · Madison, WI</span>
              </div>
              <ul className="bullet-list stagger">
                <li>Provided one-to-one in-class tutoring and hosted weekly office hours to support students outside of lecture.</li>
                <li>Collaborated with the professor and TAs to facilitate a reverse classroom model, improving engagement and comprehension.</li>
              </ul>
            </li>

            <li className="list-item">
              <div className="role-line">
                <strong>Information Technology Consultant</strong> — Deloitte
                <span className="meta">Jun 2025 – Aug 2025 · Seoul, South Korea</span>
              </div>
              <ul className="bullet-list stagger">
                <li>Contributed to the digital transformation of a $50B financial institution by assessing IT infrastructure and document management systems to identify modernization gaps.</li>
                <li>Applied enterprise architecture frameworks to conduct a structured technical review, producing a roadmap that streamlined documentation workflows.</li>
                <li>Evaluated enterprise technology options (AI-OCR, blockchain integration, eForm systems) with financial analysis and technical feasibility using standardized cost estimates.</li>
                <li>Led stakeholder interviews and system analysis to gather requirements and translate business needs into application and technology architecture improvements.</li>
              </ul>
            </li>

            <li className="list-item">
              <div className="role-line">
                <strong>Sergeant, Network Engineer</strong> — Republic of Korea Army
                <span className="meta">Jun 2023 – Dec 2024 · Seoul, South Korea</span>
              </div>
              <ul className="bullet-list stagger">
                <li>Specialized in military signaling and operation of advanced communication devices to ensure secure, reliable communications during missions.</li>
                <li>Performed geospatial analysis to determine optimal relay station placement, enabling stable brigade-level communication networks.</li>
                <li>Coordinated across units during field training exercises, developing effective combat signaling strategies under varied conditions.</li>
                <li>Served as the communication link between upper command and front-line units, strengthening leadership and precise message delivery.</li>
                <li><em>Awards:</em> 2nd Place, Brigade Encryption/Decryption Competition; Soldier of the Month.</li>
              </ul>
            </li>

            <li className="list-item">
              <div className="role-line">
                <strong>Student Tutor</strong> — University of Wisconsin–Madison
                <span className="meta">Jan 2025 – Present · Madison, WI</span>
              </div>
              <ul className="bullet-list stagger">
                <li>Provided tutoring in Physics, Chemistry, Mathematics, and Computer Engineering, adapting explanations to individual learning styles.</li>
                <li>Supported peers through both paid and volunteer tutoring, reinforcing subject mastery while developing communication and mentoring skills.</li>
              </ul>
            </li>
          </ul>
        </div>

        {/* Skills */}
        <div id="skills" className="list-container section reveal" style={{ '--reveal-delay': '260ms' }}>
          <h2>Skills</h2>
          <ul className="chip-list">
            <li className="skill-chip">SystemVerilog</li>
            <li className="skill-chip">Java</li>
            <li className="skill-chip">Python</li>
            <li className="skill-chip">MATLAB</li>
            <li className="skill-chip">Excel</li>
            <li className="skill-chip">PowerPoint</li>
          </ul>
        </div>

        {/* Activities */}
        <div id="activities" className="list-container section reveal" style={{ '--reveal-delay': '300ms' }}>
          <h2>Activities</h2>
          <ul className="item-list stagger">
            <li className="list-item">LikeLion Project Team</li>
            <li className="list-item">Dot Data Science Club</li>
            <li className="list-item">Korean Science and Engineering Association (KSEA) @ UW–Madison</li>
            <li className="list-item">Captaincy Team, AIS</li>
            <li className="list-item">Cambodian House Building (Volunteer)</li>
          </ul>
        </div>

        {/* More About Me */}
        <div id="more" className="list-container section reveal" style={{ '--reveal-delay': '320ms' }}>
          <h2>More About Me</h2>

          <details className="accordion">
            <summary>
              <div className="summary-left">
                <i className="fa-solid fa-user" aria-hidden="true"></i>
                <span>Open to see books, interests, and mentors</span>
              </div>
              <i className="fa-solid fa-chevron-down chev" aria-hidden="true"></i>
            </summary>

            <div className="accordion-content stagger">
              <div className="about-block">
                <h3>Books I Love</h3>
                <ul className="bulleted">
                  <li>The Psychology of Money - Morgan Housel</li>
                  <li>The Bitcoin Standard - Saifedean Ammous</li>
                  <li>How to Win Friends and Influence People - Dale Carnegie</li>
                  <li>Life Leverage - Rob Moore</li>
                  <li>Unstoppable - Brian Tracy</li>
                  <li>The ONE Thing - Gary Keller</li>
                </ul>
              </div>

              <div className="about-block">
                <h3>Interests</h3>
                <ul className="chips-inline">
                  <li>Traveling</li>
                  <li>Learning systems</li>
                </ul>
              </div>

              <div className="about-block">
                <h3>My Mentors and Lessons Learned</h3>
                <ul className="bulleted">
                  <li>My Beloved Parents - "Always share what you have."</li>
                  <li>Major Ok - "Provide unconditional love to everyone."</li>
                  <li>Lawyer Kim — “Imagine where you'd be in 3 days, 3 weeks, 3 months."</li>
                </ul>
              </div>
            </div>
          </details>
        </div>

        {/* Contact */}
        <div id="contact" className="contact-container section reveal" style={{ '--reveal-delay': '340ms' }}>
          <h2>Contact</h2>
          <div className="social-icons stagger">
            <a href="mailto:shcho1551@gmail.com" aria-label="Email">
              <i className="fa-solid fa-envelope" aria-hidden="true"></i>
            </a>
            <a href="https://www.linkedin.com/in/sunghwan-cho-sunny/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <i className="fa-brands fa-linkedin" aria-hidden="true"></i>
            </a>
            <a href="https://github.com/sunnycho100" target="_blank" rel="noreferrer" aria-label="GitHub">
              <i className="fa-brands fa-github" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;