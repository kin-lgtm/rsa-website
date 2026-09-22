import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Lenis from 'lenis';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { hasHomePreloaderPlayed, markHomePreloaderPlayed } from '../lib/session';
import '../styles/theme.css';

const SVG_NS = 'http://www.w3.org/2000/svg' as const;
const ASSET_BASE =
  'https://api.getlayers.ai/storage/v1/object/public/public/assets/marcus-vane-6799bd1fb6';

interface Voice {
  name: string;
  role: string;
  quote: string;
  img: string;
}

const VOICES: Voice[] = [
  {
    name: 'Kasun Fernando',
    role: 'Managing Partner, Meridian Ventures',
    quote:
      "RSA saw the need three years before the rest of us. Partnering alongside RSA changed the trajectory of my entire career.",
    img: `${ASSET_BASE}/voices/voice-01.webp`,
  },
  {
    name: 'Thivya Selvarajah',
    role: 'Founder & CEO, Cadence Health',
    quote:
      "He doesn't just write checks — he gets in the trenches at 6am and refuses to leave until the impossible part is solved.",
    img: `${ASSET_BASE}/voices/voice-02.webp`,
  },
  {
    name: 'Fathima Rizwan',
    role: 'CEO, Northwind Energy',
    quote:
      'The most demanding mentor I’ve ever had, and the only reason our company survived its first winter. Relentless, generous, right.',
    img: `${ASSET_BASE}/voices/voice-03.webp`,
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
      const nameEngines = [
        prepareLetterReveal(nameLines[0], { duration: 900, letterStagger: 52, baseDelay: 0 }),
        prepareLetterReveal(nameLines[1], { duration: 900, letterStagger: 52, baseDelay: 240 }),
      ];
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
    <div ref={rootRef}>
      <div id="preloader" aria-hidden="false">
        <p className="preloader-brand">Road Safety Academy</p>
        <p className="preloader-count">
          <span id="preloaderNumber">0</span>
          <span className="accent">%</span>
        </p>
      </div>

      <Navbar />

      <main>
        <section id="top" className="hero">
          <div className="hero-bg" style={{ backgroundImage: 'url(/hero-bg.jfif)' }}></div>
          <div className="hero-scrim"></div>

          <div className="hero-top">
            <p className="hero-desc reveal-16" id="heroDesc">
              I start companies that shouldn&rsquo;t be possible — then make them inevitable.
              Four exits, one playbook: conviction before consensus.
            </p>
          </div>

          <h1 className="hero-name" id="heroName">
            <span className="name-line">RSA</span>
            <span className="name-line">Academy</span>
          </h1>

          <div className="scroll-cue reveal-fade-only" id="scrollCue">
            <span className="cue-rule"></span>
            Scroll to enter
          </div>
        </section>

        <section className="marquee" aria-label="Operating principles">
          <div className="marquee-track">
            <div className="marquee-group">
              <span className="marquee-word">Build Bold</span>
              <span className="marquee-dot"></span>
              <span className="marquee-word">Scale Relentlessly</span>
              <span className="marquee-dot"></span>
              <span className="marquee-word">Think In Decades</span>
              <span className="marquee-dot"></span>
              <span className="marquee-word">Bet On People</span>
              <span className="marquee-dot"></span>
              <span className="marquee-word">Ship The Future</span>
              <span className="marquee-dot"></span>
            </div>
            <div className="marquee-group">
              <span className="marquee-word">Build Bold</span>
              <span className="marquee-dot"></span>
              <span className="marquee-word">Scale Relentlessly</span>
              <span className="marquee-dot"></span>
              <span className="marquee-word">Think In Decades</span>
              <span className="marquee-dot"></span>
              <span className="marquee-word">Bet On People</span>
              <span className="marquee-dot"></span>
              <span className="marquee-word">Ship The Future</span>
              <span className="marquee-dot"></span>
            </div>
          </div>
        </section>

        <section id="story" className="section">
          <div className="story-grid">
            <div className="story-left">
              <p className="eyebrow">The Story</p>
              <h2 className="heading-lg" data-reveal-lines="">
                Conviction is a competitive advantage.
              </h2>
              <p className="lead reveal-16" data-reveal="" data-delay="0">
                For twenty years I&rsquo;ve backed the version of the future most people
                couldn&rsquo;t see yet. From a dorm-room prototype to companies serving a hundred
                million people, the through-line never changed: find the hard problem everyone
                avoids, assemble the team nobody else could, and out-stubborn the doubt.
              </p>
            </div>
            <ul className="story-list">
              <li className="reveal-32" data-reveal="" data-delay="0">
                <span className="story-index">01</span>
                <div>
                  <h3>Move before it&rsquo;s obvious</h3>
                  <p>
                    The best opportunities look like mistakes right up until they look
                    inevitable. I commit while the room is still hesitating.
                  </p>
                </div>
              </li>
              <li className="reveal-32" data-reveal="" data-delay="90">
                <span className="story-index">02</span>
                <div>
                  <h3>Hire founders, not employees</h3>
                  <p>
                    I build teams of people who would start their own thing — then give them
                    a reason not to. Ownership compounds faster than talent alone.
                  </p>
                </div>
              </li>
              <li className="reveal-32" data-reveal="" data-delay="180">
                <span className="story-index">03</span>
                <div>
                  <h3>Distribution is the product</h3>
                  <p>
                    Genius unshipped is a hobby. Every venture is engineered around how it
                    reaches the people it was built for.
                  </p>
                </div>
              </li>
              <li className="reveal-32" data-reveal="" data-delay="270">
                <span className="story-index">04</span>
                <div>
                  <h3>Play the long game loudly</h3>
                  <p>
                    Patience and ambition are not opposites. I think in decades and act with
                    urgency every single day.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section id="ventures" className="section">
          <div className="section-header">
            <div>
              <p className="eyebrow">Selected Ventures</p>
              <h2 className="heading-lg" data-reveal-lines="">
                The work that moved markets.
              </h2>
            </div>
            <p className="section-counter">04 / Companies</p>
          </div>
          <ul className="ventures-grid">
            <li className="venture-card reveal-60" data-reveal="" data-delay="0">
              <div
                className="liquid venture-liquid"
                data-no-hover=""
                data-scale="28"
                data-alt="Helix Robotics"
                data-src="/gallery-1.JPG"
              ></div>
              <div className="venture-row">
                <div>
                  <h3 className="venture-name">Helix Robotics</h3>
                  <p className="venture-blurb">
                    Reinvented warehouse logistics with autonomous fleets now running in 40
                    countries.
                  </p>
                </div>
                <div className="venture-meta">
                  <p className="venture-year">2019</p>
                  <p className="venture-outcome">Acquired — $1.1B</p>
                </div>
              </div>
              <p className="venture-category">Industrial Automation</p>
            </li>
            <li className="venture-card venture-offset reveal-60" data-reveal="" data-delay="120">
              <div
                className="liquid venture-liquid"
                data-no-hover=""
                data-scale="28"
                data-alt="Northwind Energy"
                data-src="/gallery-2.png"
              ></div>
              <div className="venture-row">
                <div>
                  <h3 className="venture-name">Northwind Energy</h3>
                  <p className="venture-blurb">
                    Brought utility-scale storage to the grid years before the market believed
                    it was viable.
                  </p>
                </div>
                <div className="venture-meta">
                  <p className="venture-year">2015</p>
                  <p className="venture-outcome">IPO — NYSE: NWND</p>
                </div>
              </div>
              <p className="venture-category">Climate Infrastructure</p>
            </li>
            <li className="venture-card reveal-60" data-reveal="" data-delay="0">
              <div
                className="liquid venture-liquid"
                data-no-hover=""
                data-scale="28"
                data-alt="Cadence Health"
                data-src="/gallery-3.JPG"
              ></div>
              <div className="venture-row">
                <div>
                  <h3 className="venture-name">Cadence Health</h3>
                  <p className="venture-blurb">
                    Put a clinician in every pocket and rewired how chronic care gets delivered.
                  </p>
                </div>
                <div className="venture-meta">
                  <p className="venture-year">2011</p>
                  <p className="venture-outcome">Acquired — $640M</p>
                </div>
              </div>
              <p className="venture-category">Digital Medicine</p>
            </li>
            <li className="venture-card venture-offset reveal-60" data-reveal="" data-delay="120">
              <div
                className="liquid venture-liquid"
                data-no-hover=""
                data-scale="28"
                data-alt="RSA Capital"
                data-src="/gallery-4.JPG"
              ></div>
              <div className="venture-row">
                <div>
                  <h3 className="venture-name">RSA Capital</h3>
                  <p className="venture-blurb">
                    Backing the next generation of contrarian founders building hard, durable
                    companies.
                  </p>
                </div>
                <div className="venture-meta">
                  <p className="venture-year">2008</p>
                  <p className="venture-outcome">Active — $900M AUM</p>
                </div>
              </div>
              <p className="venture-category">Venture Investing</p>
            </li>
          </ul>
        </section>

        <section id="impact" className="section">
          <div className="section-header">
            <div>
              <p className="eyebrow">By The Numbers</p>
              <h2 className="heading" data-reveal-lines="">
                Two decades, measured.
              </h2>
            </div>
          </div>
          <dl className="stats-grid">
            <div className="stat-cell reveal-32" data-reveal="" data-delay="0">
              <dd className="stat-figure">4</dd>
              <dt className="stat-label">Companies founded &amp; exited</dt>
            </div>
            <div className="stat-cell reveal-32" data-reveal="" data-delay="110">
              <dd className="stat-figure">$3.2B</dd>
              <dt className="stat-label">Enterprise value created</dt>
            </div>
            <div className="stat-cell reveal-32" data-reveal="" data-delay="220">
              <dd className="stat-figure">120M+</dd>
              <dt className="stat-label">People served by his products</dt>
            </div>
            <div className="stat-cell reveal-32" data-reveal="" data-delay="330">
              <dd className="stat-figure">2,400</dd>
              <dt className="stat-label">Jobs created across ventures</dt>
            </div>
          </dl>
        </section>

        <section id="voices" className="section">
          <div className="section-header">
            <div>
              <p className="eyebrow">Voices</p>
              <h2 className="heading" data-reveal-lines="">
                What they say.
              </h2>
            </div>
          </div>
          <div className="voices-body">
            <ul className="voices-list" id="voicesList">
              <li>
                <button className="voice-btn active" data-index="0">
                  <span className="voice-num">01</span>
                  <span className="voice-info">
                    <span className="voice-name">Kasun Fernando</span>
                    <span className="voice-role">Managing Partner, Meridian Ventures</span>
                  </span>
                  <span className="voice-rule"></span>
                </button>
              </li>
              <li>
                <button className="voice-btn" data-index="1">
                  <span className="voice-num">02</span>
                  <span className="voice-info">
                    <span className="voice-name">Thivya Selvarajah</span>
                    <span className="voice-role">Founder &amp; CEO, Cadence Health</span>
                  </span>
                  <span className="voice-rule"></span>
                </button>
              </li>
              <li>
                <button className="voice-btn" data-index="2">
                  <span className="voice-num">03</span>
                  <span className="voice-info">
                    <span className="voice-name">Fathima Rizwan</span>
                    <span className="voice-role">CEO, Northwind Energy</span>
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
                  Kasun Fernando — Managing Partner, Meridian Ventures
                </footer>
              </div>
              <div className="voice-portrait-wrap">
                <div
                  className="liquid voice-liquid"
                  id="voiceLiquid"
                  data-scale="22"
                  data-alt="Kasun Fernando"
                  data-src={`${ASSET_BASE}/voices/voice-01.webp`}
                ></div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="contact">
          <p className="eyebrow">Let&rsquo;s Build</p>
          <h2 className="heading-xl" data-reveal-lines="">
            Have something the world says can&rsquo;t be done?
          </h2>
          <p className="lead reveal-16" data-reveal="" data-delay="0">
            That&rsquo;s usually where I start. I read every message I&rsquo;m sent.
          </p>
          <Link to="/donate" className="btn">
            Donate Now
            <span aria-hidden="true">&#8599;</span>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
