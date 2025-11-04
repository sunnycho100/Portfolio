import Reveal from './Reveal.jsx';

export default function Experience() {
  return (
    <section id="experience" className="section">
      <Reveal delay="220ms" className="list-container">
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
      </Reveal>
    </section>
  );
}