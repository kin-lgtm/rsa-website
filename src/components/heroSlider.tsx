import { useEffect, useState } from 'react';

const slides = [
  { image: '/hero.jpg', alt: 'Sri Lankan tea estate' },
  { image: '/gallery-1.JPG', alt: 'Traditional handicraft' },
  { image: '/gallery-3.JPG', alt: 'Sri Lankan heritage craftsmanship' },
];

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full aspect-4/3 lg:aspect-square bg-gray-200 overflow-hidden">
      {slides.map((slide, index) => (
        <img
          key={slide.image}
          src={slide.image}
          alt={slide.alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.image}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === activeIndex ? 'w-6 bg-white' : 'w-2.5 bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
