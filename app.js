// One-time reveal on scroll for elements with .reveal
(function () {
  const revealables = Array.from(document.querySelectorAll('.reveal'));

  // Respect reduced motion
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    revealables.forEach(el => el.classList.add('reveal-active'));
    return;
  }

  // Prepare initial state
  revealables.forEach(el => el.classList.add('reveal-init'));

  // Observer to reveal once
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
})();