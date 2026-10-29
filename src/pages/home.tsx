import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Lenis from 'lenis';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { hasHomePreloaderPlayed, markHomePreloaderPlayed } from '../lib/session';
import '../styles/theme.css';
import '../styles/home-redesign.css';

const SVG_NS = 'http://www.w3.org/2000/svg' as const;

interface Voice {
  name: string;
  role: string;
  quote: string;
  img: string;
}

const VOICES: Voice[] = [
  {
    name: 'Mr. S. Muralitharan',
    role: 'Government Agent & District Secretary, Kilinochchi',
    quote:
      'Sanctioning five acres in Umaiyalpuram for the Road Safety Academy is a vital public safety milestone for our district. Moving learner drivers off active highways into a structured, regulation-compliant training environment will save countless lives across Sri Lanka.',
    img: '/voice-muralitharan.jpg',
  },
  {
    name: 'Mr. Aloysious Santhiapillai',
    role: 'Former Chief Engineer, Traffic Accident Investigation (Bergen, Norway)',
    quote:
      'Norway achieved the world’s safest roads through the Vision Zero framework — designing transport systems that forgive human mistakes without lethal consequences. The Academy brings this scientific standard to Sri Lanka.',
    img: '/voice-santhiapillai.jpg',
  },
  {
    name: 'Rtn. R. Kajendrakumar',
    role: 'Project Lead, Rotary Club of Kilinochchi Town',
    quote:
      'Having attended too many funerals of friends and neighbours lost to preventable accidents, we knew our community needed decisive action. Partnering with government and expert engineers turns our shared grief into lasting protection.',
    img: '/voice-kajendrakumar.jpg',
  },
];

interface RevealEngine {
  play: () => void;
}

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const controller = new AbortController();
    const { signal } = controller;
    const timeouts: number[] = [];
    const observers: IntersectionObserver[] = [];
    let mounted = true;

    /* ---------- adaptive rem grid ---------- */
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
    window.addEventListener('resize', applyAdaptiveGrid, { signal });

    /* ---------- Lenis ---------- */
    const lenis = new Lenis({ smoothWheel: true });
    function raf(t: number) {
      if (!mounted) return;
      lenis.raf(t);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    if (!REDUCED) {
      lenis.stop();
      window.scrollTo(0, 0);
    }

    /* ---------- Preloader (first visit of the session only) ---------- */
    const preloader = root.querySelector<HTMLDivElement>('#preloader')!;
    const preloaderNumber = root.querySelector<HTMLSpanElement>('#preloaderNumber')!;
    const skipPreloader = hasHomePreloaderPlayed();

    function finishPreloader() {
      markHomePreloaderPlayed();
      preloader.classList.add('done');
      preloader.style.display = 'none';
      lenis.start();
    }

    if (REDUCED || skipPreloader) {
      finishPreloader();
    } else {
      const startTime = performance.now();
      const COUNT_MS = 2000;
      const tickCount = (now: number) => {
        if (!mounted) return;
        const t = Math.min(1, (now - startTime) / COUNT_MS);
        preloaderNumber.textContent = String(Math.round(t * 100));
        if (t < 1) requestAnimationFrame(tickCount);
        else onCountDone();
      };
      requestAnimationFrame(tickCount);

      function onCountDone() {
        preloader.classList.add('fade');
        const id1 = window.setTimeout(() => {
          preloader.classList.add('wipe');
          const id2 = window.setTimeout(finishPreloader, 650);
          timeouts.push(id2);
        }, 300 + 200);
        timeouts.push(id1);
      }
    }

    /* ---------- Liquid image component ---------- */
    let liquidCounter = 0;
    const hoverCapable =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches && window.innerWidth > 768;

    function attachLiquidHover(
      el: HTMLElement,
      feDisplacement: SVGFEDisplacementMapElement,
      feTurbulence: SVGFETurbulenceElement,
      scaleTarget: number,
    ) {
      if (!hoverCapable || REDUCED || el.dataset.noHover !== undefined) return;
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

      el.addEventListener(
        'pointerenter',
        () => {
          target = scaleTarget;
          freqTargetCur = freqTarget;
          start();
        },
        { signal },
      );
      el.addEventListener(
        'pointerleave',
        () => {
          target = 0;
          freqTargetCur = freqBase;
          start();
        },
        { signal },
      );
    }

    function buildLiquid(container: HTMLElement) {
      container.replaceChildren();
      liquidCounter++;
      const filterId = 'liquid-filter-' + liquidCounter;
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

      let media: HTMLImageElement | HTMLVideoElement;
      if (container.dataset.video) {
        const video = document.createElement('video');
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'auto';
        video.poster = container.dataset.poster || '';
        const source = document.createElement('source');
        source.src = container.dataset.video;
        source.type = 'video/mp4';
        video.appendChild(source);
        media = video;
      } else {
        const img = document.createElement('img');
        img.src = container.dataset.src || '';
        img.alt = alt;
        img.loading = 'lazy';
        img.decoding = 'async';
        media = img;
      }
      media.className = 'liquid-media';
      media.style.filter = `url(#${filterId})`;
      container.appendChild(media);

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
      return media;
    }

    root.querySelectorAll<HTMLElement>('.liquid').forEach(buildLiquid);

    /* ---------- Text reveal engines ---------- */
    function prepareLetterReveal(
      el: HTMLElement,
      { duration = 900, letterStagger = 52, baseDelay = 0 } = {},
    ): RevealEngine {
      const text = el.textContent || '';
      el.textContent = '';
      el.style.display = 'block';
      el.style.overflow = 'hidden';
      [...text].forEach((ch, i) => {
        const outer = document.createElement('span');
        outer.style.display = 'inline-block';
        outer.style.overflow = 'hidden';
        outer.style.verticalAlign = 'top';
        const inner = document.createElement('span');
        inner.style.display = 'inline-block';
        inner.textContent = ch === ' ' ? ' ' : ch;
        if (REDUCED) {
          inner.style.transform = 'translateY(0)';
          inner.style.opacity = '1';
        } else {
          inner.style.transform = 'translateY(100%)';
          inner.style.opacity = '0';
          const d = baseDelay + i * letterStagger;
          inner.style.transition = `transform ${duration}ms var(--ease-out-expo) ${d}ms, opacity ${duration}ms var(--ease-out-expo) ${d}ms`;
        }
        outer.appendChild(inner);
        el.appendChild(outer);
      });
      return {
        play() {
          if (REDUCED) return;
          requestAnimationFrame(() => {
            el.querySelectorAll<HTMLElement>(':scope > span > span').forEach((s) => {
              s.style.transform = 'translateY(0)';
              s.style.opacity = '1';
            });
          });
        },
      };
    }

    function prepareLineReveal(
      el: HTMLElement,
      { duration = 900, lineStagger = 90 } = {},
    ): RevealEngine {
      const text = (el.textContent || '').trim();
      const words = text.split(/\s+/);
      el.textContent = '';
      el.style.display = 'block';
      const wordEls: { outer: HTMLElement; inner: HTMLElement }[] = [];
      words.forEach((w, i) => {
        const outer = document.createElement('span');
        outer.style.display = 'inline-block';
        outer.style.overflow = 'hidden';
        outer.style.verticalAlign = 'top';
        const inner = document.createElement('span');
        inner.style.display = 'inline-block';
        inner.textContent = w;
        if (REDUCED) {
          inner.style.transform = 'translateY(0)';
          inner.style.opacity = '1';
        } else {
          inner.style.transform = 'translateY(110%)';
          inner.style.opacity = '0';
        }
        outer.appendChild(inner);
        el.appendChild(outer);
        wordEls.push({ outer, inner });
        if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      });

      function applyDelays() {
        if (REDUCED) return;
        const tops = wordEls.map((w) => w.outer.offsetTop);
        const uniqueTops = [...new Set(tops)];
        wordEls.forEach((w, i) => {
          const lineIndex = uniqueTops.indexOf(tops[i]);
          const d = lineIndex * lineStagger;
          w.inner.style.transition = `transform ${duration}ms var(--ease-out-expo) ${d}ms, opacity ${duration}ms var(--ease-out-expo) ${d}ms`;
        });
      }
      applyDelays();
      window.addEventListener('resize', applyDelays, { signal });

      return {
        play() {
          if (REDUCED) return;
          requestAnimationFrame(() => {
            wordEls.forEach((w) => {
              w.inner.style.transform = 'translateY(0)';
              w.inner.style.opacity = '1';
            });
          });
        },
      };
    }

    function playQuote(text: string) {
      const p = root!.querySelector<HTMLParagraphElement>('#voiceQuoteText')!;
      p.innerHTML = '';
      const words = text.split(' ');
      words[0] = '“' + words[0];
      words[words.length - 1] = words[words.length - 1] + '”';
      const inners: HTMLElement[] = [];
      words.forEach((w, i) => {
        const outer = document.createElement('span');
        outer.style.display = 'inline-block';
        outer.style.overflow = 'hidden';
        outer.style.verticalAlign = 'top';
        const inner = document.createElement('span');
        inner.style.display = 'inline-block';
        inner.textContent = w;
        if (REDUCED) {
          inner.style.transform = 'translateY(0)';
          inner.style.opacity = '1';
        } else {
          inner.style.transform = 'translateY(18px)';
          inner.style.opacity = '0';
          inner.style.transition = `transform 520ms var(--ease-out-quart) ${i * 22}ms, opacity 520ms var(--ease-out-quart) ${i * 22}ms`;
        }
        outer.appendChild(inner);
        p.appendChild(outer);
        if (i < words.length - 1) p.appendChild(document.createTextNode(' '));
        inners.push(inner);
      });
      if (!REDUCED) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            inners.forEach((inner) => {
              inner.style.transform = 'translateY(0)';
              inner.style.opacity = '1';
            });
          });
        });
      }
    }

    /* ---------- init after fonts ready ---------- */
    function init() {
      if (!mounted || !root) return;

      /* hero */
      const nameLines = root.querySelectorAll<HTMLElement>('#heroName .name-line');
      const nameEngines = Array.from(nameLines).map((line, idx) =>
        prepareLetterReveal(line, { duration: 900, letterStagger: 40, baseDelay: idx * 200 }),
      );
      const heroDesc = root.querySelector<HTMLElement>('#heroDesc')!;
      const scrollCue = root.querySelector<HTMLElement>('#scrollCue')!;

      if (REDUCED) {
        nameEngines.forEach((e) => e.play());
        heroDesc.classList.add('in-view');
        scrollCue.classList.add('in-view');
      } else {
        // first visit: hold for the preloader's count + wipe; repeat visits
        // (no preloader) reveal almost immediately instead of copying that wait
        const base = skipPreloader ? 100 : 2500;
        timeouts.push(window.setTimeout(() => nameEngines.forEach((e) => e.play()), base));
        timeouts.push(window.setTimeout(() => heroDesc.classList.add('in-view'), base + 400));
        timeouts.push(window.setTimeout(() => scrollCue.classList.add('in-view'), base + 900));
      }

      /* scroll-triggered section heading line reveals */
      const lineEngines = new Map<Element, RevealEngine>();
      root.querySelectorAll<HTMLElement>('[data-reveal-lines]').forEach((el) => {
        lineEngines.set(el, prepareLineReveal(el, { duration: 900, lineStagger: 90 }));
      });

      if (REDUCED) {
        lineEngines.forEach((engine) => engine.play());
      } else {
        const headingIO = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                lineEngines.get(entry.target)?.play();
                headingIO.unobserve(entry.target);
              }
            });
          },
          { threshold: 0 },
        );
        root.querySelectorAll<HTMLElement>('[data-reveal-lines]').forEach((el) => headingIO.observe(el));
        observers.push(headingIO);
      }

      /* generic fade/slide reveals */
      const revealEls = root.querySelectorAll<HTMLElement>('[data-reveal]');
      if (REDUCED) {
        revealEls.forEach((el) => el.classList.add('in-view'));
      } else {
        const revealIO = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                revealIO.unobserve(entry.target);
              }
            });
          },
          { threshold: 0 },
        );
        revealEls.forEach((el) => {
          const delay = el.dataset.delay || '0';
          el.style.transitionDelay = delay + 'ms';
          revealIO.observe(el);
        });
        observers.push(revealIO);
      }

      /* voice portrait scale-in on first view */
      const voiceLiquid = root.querySelector<HTMLElement>('#voiceLiquid')!;
      if (REDUCED) {
        voiceLiquid.classList.add('in-view');
      } else {
        const voiceIO = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                voiceIO.unobserve(entry.target);
              }
            });
          },
          { threshold: 0 },
        );
        voiceIO.observe(voiceLiquid);
        observers.push(voiceIO);
      }

      /* voices interactivity */
      const voiceButtons = root.querySelectorAll<HTMLButtonElement>('.voice-btn');
      const voiceFooter = root.querySelector<HTMLElement>('#voiceFooter')!;
      const voiceMedia = voiceLiquid.querySelector<HTMLImageElement>('.liquid-media');

      function setActiveVoice(i: number, animate: boolean) {
        voiceButtons.forEach((b) => b.classList.toggle('active', Number(b.dataset.index) === i));
        const v = VOICES[i];
        voiceFooter.textContent = `${v.name} — ${v.role}`;
        if (voiceMedia) voiceMedia.src = v.img;
        if (animate) playQuote(v.quote);
        else {
          const p = root!.querySelector<HTMLParagraphElement>('#voiceQuoteText')!;
          p.textContent = `“${v.quote}”`;
        }
      }
      voiceButtons.forEach((btn) => {
        btn.addEventListener(
          'click',
          () => setActiveVoice(Number(btn.dataset.index), true),
          { signal },
        );
      });
      setActiveVoice(0, !REDUCED);
    }

    let fontsTimeoutId: number | undefined;
    if (document.fonts && document.fonts.ready) {
      Promise.race([
        document.fonts.ready,
        new Promise<void>((resolve) => {
          fontsTimeoutId = window.setTimeout(() => resolve(), 400);
        }),
      ]).then(init);
    } else {
      init();
    }

    return () => {
      mounted = false;
      controller.abort();
      if (fontsTimeoutId !== undefined) clearTimeout(fontsTimeoutId);
      timeouts.forEach((id) => clearTimeout(id));
      observers.forEach((o) => o.disconnect());
      lenis.destroy();
      document.documentElement.style.removeProperty('font-size');
    };
  }, []);

  return (
    <div ref={rootRef} className="rsa-home">
      <div id="preloader" aria-hidden="false">
        <p className="preloader-brand">Road Safety Academy</p>
        <p className="preloader-count">
          <span id="preloaderNumber">0</span>
          <span className="accent">%</span>
        </p>
      </div>

      <Navbar />

      <main>
        {/* ──────── HERO ──────── */}
        <section className="rsa-hero">
          <div className="rsa-hero-image"></div>
          <div className="rsa-hero-shade"></div>
          <div className="rsa-container rsa-hero-content">
            <p className="rsa-kicker rsa-kicker-light">
              <span className="rsa-kicker-mark"></span>
              Road Safety Academy &bull; Sri Lanka
            </p>
            <h1 id="heroName">
              <span className="name-line">Road</span>
              <span className="name-line">Safety</span>
              <span className="name-line"><em>Academy</em></span>
            </h1>
            <p className="rsa-hero-copy" id="heroDesc">
              Every Journey Safe. Every Life Valued. Sri Lanka&rsquo;s first
              purpose-built driver education ecosystem, rising in Kilinochchi.
            </p>
            <div className="rsa-hero-actions">
              <Link to="/donate" className="rsa-button rsa-button-primary">
                Donate Now <span aria-hidden="true">&#8599;</span>
              </Link>
              <Link to="/about" className="rsa-button rsa-button-glass">
                Learn More &rarr;
              </Link>
            </div>
            <p className="rsa-hero-note" id="scrollCue">
              <span className="rsa-note-line"></span>
              Scroll to explore
            </p>
          </div>
          <span className="rsa-hero-index">RSA / 2025</span>
        </section>

        {/* ──────── FACTS BAR ──────── */}
        <section className="rsa-facts">
          <div className="rsa-facts-grid">
            <div className="rsa-fact">
              <span className="rsa-fact-value">2,500<small>+</small></span>
              <span className="rsa-fact-label">Lives lost annually on Sri Lankan roads</span>
            </div>
            <div className="rsa-fact">
              <span className="rsa-fact-value">5.0</span>
              <span className="rsa-fact-label">Acres allocated by District Secretariat</span>
            </div>
            <div className="rsa-fact">
              <span className="rsa-fact-value">LKR 325M<small>+</small></span>
              <span className="rsa-fact-label">Total investment across 3 phases</span>
            </div>
            <div className="rsa-fact rsa-fact-statement">
              <span className="rsa-fact-label">Vision</span>
              <strong>Zero preventable road deaths&mdash;designed for human error.</strong>
            </div>
          </div>
        </section>

        {/* ──────── INTRO / STORY ──────── */}
        <section className="rsa-section rsa-intro">
          <div className="rsa-container rsa-intro-grid">
            <div className="rsa-intro-heading">
              <p className="rsa-eyebrow">The Origin &amp; Mission</p>
              <h2 data-reveal-lines="">
                Transforming road safety from <em>crisis to culture.</em>
              </h2>
            </div>
            <div className="rsa-intro-copy" data-reveal="" data-delay="0">
              <p>
                In Sri Lanka, over 2,500 lives are tragically lost each year in road
                traffic accidents&mdash;an average of 6.5 deaths every single day.
                In the Northern Province, learner drivers have historically trained on
                public roads without access to a controlled environment that simulates
                complex real-world situations.
              </p>
              <p>
                The Road Safety Academy changes this paradigm by establishing the
                nation&rsquo;s premier purpose-built driver education ecosystem in
                Kilinochchi, inspired by the Norwegian Vision Zero framework championed
                by retired Chief Engineer Aloysious Santhiapillai.
              </p>
              <Link to="/about" className="rsa-text-link">
                Read Full Story <span aria-hidden="true">&#8599;</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ──────── FACILITIES ──────── */}
        <section className="rsa-section rsa-facilities">
          <div className="rsa-container">
            <div className="rsa-section-heading">
              <div>
                <p className="rsa-eyebrow">The Institute Infrastructure</p>
                <h2 data-reveal-lines="">
                  Purpose-built facilities for <em>real-world mastery.</em>
                </h2>
              </div>
              <p className="rsa-section-description">
                A phased development programme across 5 acres, engineered by Master
                Hellie&rsquo;s Engineering Consultants in strict RDA &amp; RMV compliance.
              </p>
            </div>
            <div className="rsa-facility-grid">
              {/* Card 1 */}
              <div className="rsa-facility-card" data-reveal="" data-delay="0">
                <div className="rsa-facility-image-wrap">
                  <img
                    className="rsa-facility-image"
                    src="/images/training-track.png"
                    alt="Professional Driver Training Track"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="rsa-facility-number">01</span>
                </div>
                <div className="rsa-facility-content">
                  <span className="rsa-facility-tag">Physical Track Infrastructure</span>
                  <h3>Professional Training Track</h3>
                  <p>
                    1.5 km closed-loop network with 4-lane and 2-lane divided
                    carriageways, roundabouts, signalized junctions, railway crossings,
                    skid control areas, and motorcycle 8-tracks.
                  </p>
                </div>
              </div>
              {/* Card 2 */}
              <div className="rsa-facility-card" data-reveal="" data-delay="120">
                <div className="rsa-facility-image-wrap">
                  <img
                    className="rsa-facility-image"
                    src="/images/driving-simulator.png"
                    alt="High-Fidelity Driving Simulation Labs"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="rsa-facility-number">02</span>
                </div>
                <div className="rsa-facility-content">
                  <span className="rsa-facility-tag">Digital Technology &amp; AI</span>
                  <h3>High-Fidelity Simulation Labs</h3>
                  <p>
                    Multi-screen driving simulators replicating rain, dense fog,
                    mountain gradient descent, and critical emergency reaction maneuvers
                    prior to practical track training.
                  </p>
                </div>
              </div>
              {/* Card 3 */}
              <div className="rsa-facility-card" data-reveal="" data-delay="0">
                <div className="rsa-facility-image-wrap">
                  <img
                    className="rsa-facility-image"
                    src="/images/vehicle-inspection.png"
                    alt="Vehicle Testing & Brake Inspection Facility"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="rsa-facility-number">03</span>
                </div>
                <div className="rsa-facility-content">
                  <span className="rsa-facility-tag">Technical Safety &amp; Diagnostics</span>
                  <h3>Vehicle Testing &amp; Inspection Bay</h3>
                  <p>
                    Cargo Weighbridge for axle-load training and computerized Roller
                    Brake Tester (RBT) to teach commercial vehicle dynamics and support
                    roadworthiness assessments.
                  </p>
                </div>
              </div>
              {/* Card 4 */}
              <div className="rsa-facility-card" data-reveal="" data-delay="120">
                <div className="rsa-facility-image-wrap">
                  <img
                    className="rsa-facility-image"
                    src="/images/academy-building.png"
                    alt="Academic and Administrative Centre Complex"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="rsa-facility-number">04</span>
                </div>
                <div className="rsa-facility-content">
                  <span className="rsa-facility-tag">Educational &amp; Admin Campus</span>
                  <h3>Academic &amp; Admin Complex</h3>
                  <p>
                    7,000 sq.ft building featuring multimedia lecture halls, central
                    CCTV observation tower, registration lounges, and cafeteria.
                  </p>
                </div>
              </div>
            </div>
            <p className="rsa-image-note">
              * Rendered visuals based on Master Hellie&rsquo;s engineering proposal;
              final construction may vary.
            </p>
          </div>
        </section>

        {/* ──────── LEARNING / METHODOLOGY ──────── */}
        <section className="rsa-learning">
          <div className="rsa-learning-image"></div>
          <div className="rsa-learning-panel">
            <p className="rsa-eyebrow rsa-eyebrow-light">Training Methodology</p>
            <h2 data-reveal-lines="">
              From simulation to <em>track mastery.</em>
            </h2>
            <p className="rsa-learning-lead">
              A structured 4-stage curriculum integrating theory, high-fidelity
              virtual simulators, closed-loop track maneuvering, and real-world
              competency evaluation.
            </p>
            <div className="rsa-principles">
              <div className="rsa-principle" data-reveal="" data-delay="0">
                <span>01</span>
                <div>
                  <h3>Theory &amp; Road Regulations</h3>
                  <p>Comprehensive classroom instruction covering traffic law, hazard perception, and defensive driving principles.</p>
                </div>
              </div>
              <div className="rsa-principle" data-reveal="" data-delay="90">
                <span>02</span>
                <div>
                  <h3>Virtual Simulation</h3>
                  <p>High-fidelity driving simulators recreating adverse conditions: rain, fog, mountain descents, and emergency scenarios.</p>
                </div>
              </div>
              <div className="rsa-principle" data-reveal="" data-delay="180">
                <span>03</span>
                <div>
                  <h3>Track Maneuvering</h3>
                  <p>Hands-on practice on the 1.5 km closed-loop track with roundabouts, junctions, and skid control areas.</p>
                </div>
              </div>
              <div className="rsa-principle" data-reveal="" data-delay="270">
                <span>04</span>
                <div>
                  <h3>Competency Evaluation</h3>
                  <p>Assessed proficiency under real-world conditions, meeting RDA &amp; RMV certification standards.</p>
                </div>
              </div>
            </div>
            <Link to="/about" className="rsa-button rsa-button-light">
              Explore the Curriculum <span aria-hidden="true">&#8599;</span>
            </Link>
          </div>
        </section>

        {/* ──────── LOCATION ──────── */}
        <section className="rsa-location">
          <div className="rsa-container rsa-location-grid">
            <div>
              <p className="rsa-eyebrow">The Campus</p>
              <h2 data-reveal-lines="">
                Strategically located along <em>the A9 corridor.</em>
              </h2>
            </div>
            <div className="rsa-location-copy" data-reveal="" data-delay="0">
              <p>
                Situated in Umaiyalpuram, Kilinochchi&mdash;5 acres of land
                sanctioned by the District Secretariat. The campus sits along Sri
                Lanka&rsquo;s primary north-south A9 highway, making it accessible
                to learners across the Northern Province and beyond.
              </p>
              <div className="rsa-location-detail">
                <span className="rsa-location-pin" aria-hidden="true">&#9679;</span>
                <div>
                  <strong>Umaiyalpuram, Kilinochchi District</strong>
                  <span>A9 Highway Corridor &bull; Northern Province, Sri Lanka</span>
                </div>
              </div>
              <Link to="/contact" className="rsa-text-link">
                Visit the Project Office <span aria-hidden="true">&#8599;</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ──────── VOICES ──────── */}
        <section className="rsa-section" style={{ background: '#fff' }}>
          <div className="rsa-container">
            <div className="rsa-section-heading">
              <div>
                <p className="rsa-eyebrow">Leadership &amp; Voices</p>
                <h2 data-reveal-lines="">
                  The vision behind the <em>Academy.</em>
                </h2>
              </div>
            </div>
            <div className="voices-body">
              <ul className="voices-list" id="voicesList">
                <li>
                  <button className="voice-btn active" data-index="0">
                    <span className="voice-num">01</span>
                    <span className="voice-info">
                      <span className="voice-name">Mr. S. Muralitharan</span>
                      <span className="voice-role">Government Agent, Kilinochchi</span>
                    </span>
                    <span className="voice-rule"></span>
                  </button>
                </li>
                <li>
                  <button className="voice-btn" data-index="1">
                    <span className="voice-num">02</span>
                    <span className="voice-info">
                      <span className="voice-name">Mr. Aloysious Santhiapillai</span>
                      <span className="voice-role">Accident Investigation Specialist (Norway)</span>
                    </span>
                    <span className="voice-rule"></span>
                  </button>
                </li>
                <li>
                  <button className="voice-btn" data-index="2">
                    <span className="voice-num">03</span>
                    <span className="voice-info">
                      <span className="voice-name">Rtn. R. Kajendrakumar</span>
                      <span className="voice-role">Project Lead, Rotary Kilinochchi</span>
                    </span>
                    <span className="voice-rule"></span>
                  </button>
                </li>
              </ul>
              <div className="voices-featured">
                <div className="voice-text">
                  <blockquote className="voice-quote">
                    <p id="voiceQuoteText"></p>
                  </blockquote>
                  <footer className="voice-footer" id="voiceFooter">
                    Mr. S. Muralitharan &mdash; Government Agent &amp; District Secretary, Kilinochchi
                  </footer>
                </div>
                <div className="voice-portrait-wrap">
                  <div
                    className="liquid voice-liquid"
                    id="voiceLiquid"
                    data-scale="22"
                    data-alt="Mr. S. Muralitharan"
                    data-src="/voice-muralitharan.jpg"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ──────── CTA ──────── */}
        <section className="rsa-cta">
          <div className="rsa-cta-bg"></div>
          <div className="rsa-container rsa-cta-content">
            <p className="rsa-eyebrow rsa-eyebrow-light">Support The Mission</p>
            <h2 data-reveal-lines="">
              Every Journey Safe.<br />Every Life <em>Valued.</em>
            </h2>
            <p>
              Dedicated to eliminating preventable road trauma across Sri Lanka.
              Partner with the Rotary Club of Kilinochchi Town, the District
              Secretariat, and Master Hellie&rsquo;s Engineering Consultants to
              bring this life-saving academy to reality.
            </p>
            <div className="rsa-hero-actions" style={{ marginTop: 34 }}>
              <Link to="/donate" className="rsa-button rsa-button-primary">
                Donate Now <span aria-hidden="true">&#8599;</span>
              </Link>
              <Link to="/contact" className="rsa-button rsa-button-glass">
                Visit the Office &bull; Contact the Team
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
