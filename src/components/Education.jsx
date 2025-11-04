import Reveal from './Reveal.jsx';

export default function Education() {
  return (
    <section id="education" className="section">
      <Reveal delay="180ms" className="list-container">
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
      </Reveal>
    </section>
  );
}