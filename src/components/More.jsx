// src/components/More.jsx
import Reveal from './Reveal.jsx';
import BookCarousel from './BookCarousel.jsx';
import CommentsSection from './CommentsSection.jsx';

export default function More() {
  const books = [
    { id:'how-to-win-friends', src: encodeURI('/books/How to Win Friends and Influence People - Dale Carnegie.jpg'), title:'How to Win Friends and Influence People', author:'Dale Carnegie', review:'People feel seen → trust grows.' },
    { id:'life-leverage', src: encodeURI('/books/Life Leverage - Rob Moore.jpg'), title:'Life Leverage', author:'Rob Moore', review:'Design life first; fit work around it.' },
    { id:'bitcoin-standard', src: encodeURI('/books/The Bitcoin Standard - Saifedean Ammous.jpg'), title:'The Bitcoin Standard', author:'Saifedean Ammous', review:'Sound money → long-term thinking.' },
    { id:'one-thing', src: encodeURI('/books/The ONE Thing - Gary Keller.jpg'), title:'The ONE Thing', author:'Gary Keller', review:'Focus multiplies results.' },
    { id:'psychology-money', src: encodeURI('/books/The Psychology of Money - Morgan Housel.jpg'), title:'The Psychology of Money', author:'Morgan Housel', review:'Behavior > spreadsheets.' },
    { id:'unstoppable', src: encodeURI('/books/Unstoppable - Brian Tracy.jpg'), title:'Unstoppable', author:'Brian Tracy', review:'Discipline compounds.' },
  ];

  return (
    <section id="more" className="section">
      <Reveal delay="320ms" className="list-container">
        <h2>More About Me</h2>

        <details className="accordion" open>
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
              <BookCarousel books={books} />
            </div>

            <div className="about-block">
              <h3>Interests</h3>
              <ul className="chips-inline">
                <li>Traveling</li>
                <li>Learning systems</li>
                <li>Writing reflections</li>
                <li>Technology consulting</li>
              </ul>
            </div>

            <div className="about-block">
              <h3>My Mentors and Lessons Learned</h3>
              <ul className="bulleted">
                <li>My Beloved Parents – “Always share what you have.”</li>
                <li>Major Ok – “Provide unconditional love to everyone.”</li>
                <li>Lawyer Kim – “Imagine where you’ll be in 3 days, 3 weeks, 3 months.”</li>
              </ul>
            </div>
          </div>
        </details>

        {/* New: Comments accordion */}
        <CommentsSection />
      </Reveal>
    </section>
  );
}