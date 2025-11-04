// src/components/Contact.jsx
import Reveal from './Reveal.jsx';
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Contact() {
  return (
    <section id="contact" className="contact-container section">
      <Reveal delay="340ms">
        <h2>Contact</h2>
        <div className="social-icons stagger">
          <a href="mailto:shcho1551@gmail.com" aria-label="Email">
            <FaEnvelope />
          </a>
          <a
            href="https://www.linkedin.com/in/sunghwan-cho-sunny/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://github.com/sunnycho100"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
        </div>
      </Reveal>
    </section>
  );
}