export default function Hero() {
  return (
    <div id="home" className="header-container section">
      <div className="hero-text">
        <h1>Hello, I&apos;m Sunny!</h1>
        <p>A third-year Computer Engineering student at the University of Wisconsin–Madison.</p>
        <p><span className="badge">Computer Engineering · UW–Madison</span></p>
        <a href="/Sunny_Cho_Resume.pdf" className="resume-button" download>
          <i className="fa-solid fa-file-pdf" aria-hidden="true"></i> Download Résumé
        </a>
      </div>

      <div className="hero-photo">
        <img src="/passport_photo.JPG" alt="Photo of Sunny Cho" loading="lazy" />
      </div>
    </div>
  );
}