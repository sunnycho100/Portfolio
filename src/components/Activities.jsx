import Reveal from './Reveal.jsx';

export default function Activities() {
  return (
    <section id="activities" className="section">
      <Reveal delay="300ms" className="list-container">
        <h2>Activities</h2>
        <ul className="item-list stagger">
          <li className="list-item">LikeLion Project Team</li>
          <li className="list-item">Dot Data Science Club</li>
          <li className="list-item">Korean Science and Engineering Association (KSEA) @ UW–Madison</li>
          <li className="list-item">Captaincy Team, AIS</li>
          <li className="list-item">Cambodian House Building (Volunteer)</li>
        </ul>
      </Reveal>
    </section>
  );
}