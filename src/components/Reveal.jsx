import { useEffect, useRef } from 'react';

export default function Reveal({ delay = '0ms', children, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion
    const reduce = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      el.classList.add('reveal-active');
      return;
    }

    el.classList.add('reveal-init');
    el.style.setProperty('--reveal-delay', delay);

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('reveal-active');
            el.classList.remove('reveal-init');
            obs.unobserve(el);
          }
        });
      },
      { rootMargin: '0px 0px -5% 0px', threshold: 0.12 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}