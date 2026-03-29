import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const banners = [
  {
    id: 1,
    title: 'Aquaguard',
    subtitle: '2 year filter life\nUp to 60% Off',
    detail: 'Save up to ₹18,000 on filters',
    bg: 'from-amber-800 to-amber-900',
    tag: 'AD',
  },
  {
    id: 2,
    title: 'SAMSUNG',
    subtitle: 'Galaxy S26 Ultra\nJust ₹7,778/M',
    detail: 'Galaxy AI',
    bg: 'from-slate-800 to-slate-900',
    tag: 'AD',
  },
  {
    id: 3,
    title: 'Nova 2 Pro',
    subtitle: 'Android Tablet\nLaunching 9th Apr',
    detail: 'Safe. Secure. Yours.',
    bg: 'from-violet-600 to-pink-500',
    tag: '',
  },
];

const BannerCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % banners.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((p) => (p - 1 + banners.length) % banners.length);
  const next = () => setCurrent((p) => (p + 1) % banners.length);

  return (
    <div className="relative bg-card rounded-sm overflow-hidden">
      <div className="relative h-[200px] md:h-[250px]">
        {banners.map((banner, i) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-500 bg-gradient-to-r ${banner.bg} flex items-center px-8 md:px-16 ${
              i === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="text-primary-foreground">
              <h3 className="text-2xl md:text-3xl font-bold mb-1">{banner.title}</h3>
              <p className="text-lg md:text-xl font-medium whitespace-pre-line">{banner.subtitle}</p>
              <p className="text-sm mt-2 opacity-80">{banner.detail}</p>
              {banner.tag && (
                <span className="inline-block mt-3 text-[10px] bg-primary-foreground/20 px-2 py-0.5 rounded-sm">
                  {banner.tag}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-card/90 shadow-md rounded-r-sm p-2 hover:bg-card"
      >
        <ChevronLeft className="w-5 h-5 text-foreground" />
      </button>
      <button
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-card/90 shadow-md rounded-l-sm p-2 hover:bg-card"
      >
        <ChevronRight className="w-5 h-5 text-foreground" />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === current ? 'bg-primary-foreground' : 'bg-primary-foreground/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
