import { useState, useEffect, useCallback } from 'react';
import './HomepageSlider.css';

const SLIDES = [
  'https://rukminim2.flixcart.com/fk-p-flap/3160/1540/image/8ff6eada99b13189.png?q=60',
  'https://rukminim2.flixcart.com/fk-p-flap/3160/1540/image/1e8153aaffe8eb50.png?q=60',
  'https://rukminim2.flixcart.com/fk-p-flap/3160/1540/image/ca6c419e0a0d38d3.png?q=60',
  'https://rukminim2.flixcart.com/fk-p-flap/3160/1540/image/acdf34b03c394077.png?q=60',
];

const HomepageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Navigate to specific slide
  const goTo = useCallback((idx) => {
    setCurrentIndex((idx + SLIDES.length) % SLIDES.length);
  }, []);

  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);
  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);

  // ── Auto-play: advance every 3 seconds ──
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 3000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  return (
    <div className="hp-slider">
      {/* ── Image Track ── */}
      <div className="hp-slider-track">
        {SLIDES.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`Flipkart Sale Banner ${idx + 1}`}
            className={`hp-slider-img ${idx === currentIndex ? 'hp-slide-active' : 'hp-slide-hidden'}`}
            loading={idx === 0 ? 'eager' : 'lazy'}
          />
        ))}
      </div>

      {/* ── Previous / Next Arrows ── */}
      <button
        className="hp-slider-arrow hp-arrow-left"
        onClick={goPrev}
        aria-label="Previous slide"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        className="hp-slider-arrow hp-arrow-right"
        onClick={goNext}
        aria-label="Next slide"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 6 15 12 9 18" />
        </svg>
      </button>

      {/* ── Dot Indicators ── */}
      <div className="hp-slider-dots">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            className={`hp-dot ${idx === currentIndex ? 'hp-dot-active' : ''}`}
            onClick={() => goTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HomepageSlider;
