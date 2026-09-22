import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

/**
 * Shared motion setup for every non-Home page: the same rem-adaptive grid
 * and Lenis smooth scroll Home uses, plus a scroll-triggered fade/slide-in
 * for any descendant carrying `data-reveal` (with an optional `data-delay`
 * in ms), using the `.reveal-16` / `.reveal-32` / `.reveal-60` classes from
 * theme.css. Mirrors `prefers-reduced-motion` by revealing everything
 * immediately and skipping the observer.
 */
export function usePageMotion<T extends HTMLElement>() {
  const rootRef = useRef<T>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const controller = new AbortController();
    let mounted = true;

    const FONT_BASE = 16;
    const BASE_W = 1920;
    const COEF = 0.6666;
    function applyAdaptiveGrid() {
      const w = window.innerWidth;
      const reduction = ((BASE_W - w) / BASE_W) * 100 * COEF;
      const size = FONT_BASE - (FONT_BASE * reduction) / 100;
      if (size > FONT_BASE) document.documentElement.style.fontSize = size + 'px';
      else document.documentElement.style.removeProperty('font-size');
    }
    applyAdaptiveGrid();
    window.addEventListener('resize', applyAdaptiveGrid, { signal: controller.signal });

    const lenis = new Lenis({ smoothWheel: true });
    function raf(t: number) {
      if (!mounted) return;
      lenis.raf(t);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    let observer: IntersectionObserver | null = null;
    if (REDUCED) {
      root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => el.classList.add('in-view'));
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              observer!.unobserve(entry.target);
            }
          });
        },
        { threshold: 0 },
      );
      root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        const delay = el.dataset.delay || '0';
        el.style.transitionDelay = delay + 'ms';
        observer!.observe(el);
      });
    }

    return () => {
      mounted = false;
      controller.abort();
      observer?.disconnect();
      lenis.destroy();
      document.documentElement.style.removeProperty('font-size');
    };
  }, []);

  return rootRef;
}
