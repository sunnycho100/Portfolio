import Reveal from './Reveal.jsx';

export default function Skills() {
  return (
    <section id="skills" className="section">
      <Reveal delay="260ms" className="list-container">
        <h2>Skills</h2>
        <ul className="chip-list">
          <li className="skill-chip">SystemVerilog</li>
          <li className="skill-chip">Java</li>
          <li className="skill-chip">Python</li>
          <li className="skill-chip">MATLAB</li>
          <li className="skill-chip">Excel</li>
          <li className="skill-chip">PowerPoint</li>
        </ul>
      </Reveal>
    </section>
  );
}