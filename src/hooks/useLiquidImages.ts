import { useEffect } from 'react';
import type { RefObject } from 'react';

const SVG_NS = 'http://www.w3.org/2000/svg' as const;

/**
 * Builds the "liquid" hover-distortion treatment (SVG turbulence +
 * displacement map, spring-animated on hover) for every `.liquid`
 * element inside the given root. Expects each container to carry
 * `data-src` (image url), `data-alt`, and optionally `data-scale`
 * (hover displacement target, default 24) and `data-bare="true"` to
 * skip the grayscale veil/glow/vignette overlays.
 */
export function useLiquidImages(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hoverCapable =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches && window.innerWidth > 768;
    let mounted = true;
    let liquidCounter = 0;

    function attachLiquidHover(
      el: HTMLElement,
      feDisplacement: SVGFEDisplacementMapElement,
      feTurbulence: SVGFETurbulenceElement,
      scaleTarget: number,
    ) {
      if (!hoverCapable || REDUCED) return;
      const freqBase = 0.009;
      const freqTarget = 0.022;
      const tension = 140;
      const friction = 13;
      const mass = 1;
      let scale = 0;
      let scaleVel = 0;
      let freq = freqBase;
      let freqVel = 0;
      let target = 0;
      let freqTargetCur = freqBase;
      let running = false;
      let lastT: number | null = null;

      function step(now: number) {
        if (!mounted) {
          running = false;
          return;
        }
        if (lastT === null) lastT = now;
        const dt = Math.min(0.032, (now - lastT) / 1000);
        lastT = now;

        const fS = -tension * (scale - target) - friction * scaleVel;
        scaleVel += (fS / mass) * dt;
        scale += scaleVel * dt;

        const fF = -tension * (freq - freqTargetCur) - friction * freqVel;
        freqVel += (fF / mass) * dt;
        freq += freqVel * dt;

        feDisplacement.setAttribute('scale', Math.max(0, scale).toFixed(3));
        feTurbulence.setAttribute('baseFrequency', Math.max(0.001, freq).toFixed(4));

        if (
          Math.abs(scale - target) > 0.05 ||
          Math.abs(scaleVel) > 0.02 ||
          Math.abs(freq - freqTargetCur) > 0.0004 ||
          Math.abs(freqVel) > 0.0004
        ) {
          requestAnimationFrame(step);
        } else {
          running = false;
          lastT = null;
        }
      }
      function start() {
        if (!running) {
          running = true;
          requestAnimationFrame(step);
        }
      }

      el.addEventListener('pointerenter', () => {
        target = scaleTarget;
        freqTargetCur = freqTarget;
        start();
      });
      el.addEventListener('pointerleave', () => {
        target = 0;
        freqTargetCur = freqBase;
        start();
      });
    }

    function buildLiquid(container: HTMLElement) {
      container.replaceChildren();
      liquidCounter++;
      const filterId = 'liquid-filter-' + liquidCounter + '-' + Math.random().toString(36).slice(2, 7);
      const bare = container.dataset.bare === 'true';
      const scaleTarget = Number(container.dataset.scale || 24);
      const alt = container.dataset.alt || '';

      const svg = document.createElementNS(SVG_NS, 'svg');
      svg.setAttribute('width', '0');
      svg.setAttribute('height', '0');
      svg.style.position = 'absolute';
      const filter = document.createElementNS(SVG_NS, 'filter');
      filter.setAttribute('id', filterId);
      const turb = document.createElementNS(SVG_NS, 'feTurbulence');
      turb.setAttribute('type', 'fractalNoise');
      turb.setAttribute('baseFrequency', '0.009');
      turb.setAttribute('numOctaves', '2');
      turb.setAttribute('result', 'noise');
      const disp = document.createElementNS(SVG_NS, 'feDisplacementMap');
      disp.setAttribute('in', 'SourceGraphic');
      disp.setAttribute('in2', 'noise');
      disp.setAttribute('scale', '0');
      filter.appendChild(turb);
      filter.appendChild(disp);
      svg.appendChild(filter);
      container.appendChild(svg);

      const img = document.createElement('img');
      img.src = container.dataset.src || '';
      img.alt = alt;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.className = 'liquid-media';
      img.style.filter = `url(#${filterId})`;
      container.appendChild(img);

      if (!bare) {
        const veil = document.createElement('div');
        veil.className = 'liquid-veil';
        const glow = document.createElement('div');
        glow.className = 'liquid-glow';
        const vignette = document.createElement('div');
        vignette.className = 'liquid-vignette';
        container.appendChild(veil);
        container.appendChild(glow);
        container.appendChild(vignette);
      }

      attachLiquidHover(container, disp, turb, scaleTarget);
    }

    root.querySelectorAll<HTMLElement>('.liquid').forEach(buildLiquid);

    return () => {
      mounted = false;
    };
  }, [rootRef]);
}
