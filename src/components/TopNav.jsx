// src/components/TopNav.jsx
import { useEffect } from 'react';

function useActiveSection(ids) {
  useEffect(() => {
    const links = Array.from(document.querySelectorAll('.nav-links .tab'));
    const setActive = (id) => {
      links.forEach((a) =>
        a.classList.toggle('is-active', a.getAttribute('href') === '#' + id)
      );
    };
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { threshold: 0.5 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [ids]);
}

export default function TopNav() {
  useActiveSection([
  'home',
  'about',
  'education',
  'experience',
  'skills',
  'activities',
  'github',
  'more',
  'contact'
]);

  return (
    <nav className="topnav" aria-label="Primary">
      <div className="topnav-inner">
        {/* Left: Brand */}
        <a className="brand" href="#home">Sunny</a>

        {/* Center: Tabs */}
        <div className="tabbar">
          <ul className="nav-links">
            <li><a className="tab is-active" href="#home">Home</a></li>
            <li><a className="tab" href="#about">About</a></li>
            <li><a className="tab" href="#education">Education</a></li>
            <li><a className="tab" href="#experience">Experience</a></li>
            <li><a className="tab" href="#skills">Skills</a></li>
            <li><a className="tab" href="#activities">Activities</a></li>
            <li><a className="tab" href="#github">GitHub</a></li>   {/* new tab */}
            <li><a className="tab" href="#more">More</a></li>
            <li><a className="tab" href="#contact">Contact</a></li>
          </ul>
        </div>

        {/* Right: empty spacer to balance brand width */}
        <div className="nav-spacer" aria-hidden="true" />
      </div>
    </nav>
  );
}