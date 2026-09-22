import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'shameen-portfolio-motion';

// One event-driven animation frame for the whole page. No React renders on scroll.
export function useImmersiveMotion() {
  const [restricted, setRestricted] = useState(true);
  const [choice, setChoice] = useState(true);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let stored = true;
    try { stored = localStorage.getItem(STORAGE_KEY) !== 'off'; } catch { /* Private browsing can disable storage. */ }
    setChoice(stored);
    const update = () => setRestricted(media.matches || Boolean(navigator.connection?.saveData));
    update();
    media.addEventListener('change', update);
    navigator.connection?.addEventListener('change', update);
    return () => {
      media.removeEventListener('change', update);
      navigator.connection?.removeEventListener('change', update);
    };
  }, []);
  const enabled = choice && !restricted;
  const toggle = () => {
    const next = !choice;
    setChoice(next);
    try { localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off'); } catch { /* Optional preference only. */ }
  };
  return { enabled, restricted, toggle };
}

export function MotionControl({ enabled, restricted, toggle }) {
  return <button className="motion-control" type="button" aria-pressed={enabled}
    disabled={restricted} onClick={toggle}
    title={restricted ? 'Animation is off to respect your reduced-motion or data-saving preference.' : 'Turn all automatic and pointer-driven motion on or off'}>
    <span className="motion-icon" aria-hidden="true">◈</span>
    <span>{restricted ? 'Motion reduced' : `3D motion ${enabled ? 'on' : 'off'}`}</span>
    <span className="motion-led" aria-hidden="true" />
  </button>;
}

export function AmbientWorld({ enabled }) {
  const layer = useRef(null);
  useEffect(() => {
    if (!enabled) return;
    const root = layer.current.closest('.portfolio-shell');
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const surfaces = [...root.querySelectorAll('[data-depth]')];
    const reveals = [...root.querySelectorAll('[data-reveal]')];
    let frame = 0;
    let pointer = { x: 0, y: 0 };
    let surface = null;
    let local = { x: 0, y: 0 };
    let viewportHeight = window.innerHeight;
    let pageHeight = Math.max(1, document.documentElement.scrollHeight - viewportHeight);
    const paint = () => {
      frame = 0;
      const progress = Math.min(1, Math.max(0, window.scrollY / pageHeight));
      layer.current?.style.setProperty('--orbit-turn', `${progress * 160 + pointer.x * 12}deg`);
      layer.current?.style.setProperty('--world-x', `${pointer.x * 22}px`);
      layer.current?.style.setProperty('--world-y', `${pointer.y * 16 - progress * 70}px`);
      root.style.setProperty('--pointer-x', `${pointer.x * 1.8}deg`);
      root.style.setProperty('--pointer-y', `${-pointer.y * 1.8}deg`);
      root.style.setProperty('--scroll-progress', progress);
      if (surface) {
        const depth = Number(surface.dataset.depth) || 6;
        surface.style.setProperty('--tilt-x', `${-local.y * depth}deg`);
        surface.style.setProperty('--tilt-y', `${local.x * depth}deg`);
        surface.style.setProperty('--shine-x', `${(local.x + 1) * 50}%`);
        surface.style.setProperty('--shine-y', `${(local.y + 1) * 50}%`);
      }
    };
    const schedule = () => {
      if (!frame && document.visibilityState === 'visible') frame = requestAnimationFrame(paint);
    };
    const resetSurface = () => {
      if (!surface) return;
      surface.style.removeProperty('--tilt-x'); surface.style.removeProperty('--tilt-y');
      surface.style.removeProperty('--talk-mic-x'); surface.style.removeProperty('--talk-mic-y');
      surface.removeAttribute('data-hovered'); surface = null;
    };
    const move = event => {
      if (!fine.matches || event.pointerType === 'touch') return;
      pointer = { x: event.clientX / window.innerWidth * 2 - 1, y: event.clientY / viewportHeight * 2 - 1 };
      const target = event.target.closest?.('[data-depth]');
      if (surface !== target) { resetSurface(); surface = target; }
      if (surface) {
        const box = surface.getBoundingClientRect();
        local = { x: Math.max(-1, Math.min(1, (event.clientX - box.left) / box.width * 2 - 1)), y: Math.max(-1, Math.min(1, (event.clientY - box.top) / box.height * 2 - 1)) };
        surface.setAttribute('data-hovered', '');
        if (surface.classList.contains('project-talk')) {
          surface.style.setProperty('--talk-mic-x', `${local.x * 4}px`);
          surface.style.setProperty('--talk-mic-y', `${local.y * 3}px`);
        }
      }
      schedule();
    };
    const leave = () => { pointer = { x: 0, y: 0 }; resetSurface(); schedule(); };
    const scroll = () => { resetSurface(); schedule(); };
    const measure = () => { viewportHeight = window.innerHeight; pageHeight = Math.max(1, document.documentElement.scrollHeight - viewportHeight); schedule(); };
    const visibility = () => {
      root.classList.toggle('page-hidden', document.hidden);
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else schedule();
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('depth-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    reveals.forEach((node, i) => {
      // Never hide content already visible or currently focused when motion changes.
      if (node.getBoundingClientRect().top > viewportHeight && !node.contains(document.activeElement)) {
        node.classList.add('depth-pending');
        node.style.setProperty('--reveal-delay', `${(i % 3) * 65}ms`);
        observer.observe(node);
      }
    });
    const focus = event => event.target.closest('[data-reveal]')?.classList.add('depth-visible');
    const sizeObserver = new ResizeObserver(measure);
    sizeObserver.observe(document.body);
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    document.addEventListener('focusin', focus);
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', measure);
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('blur', leave);
    visibility(); schedule();
    return () => {
      cancelAnimationFrame(frame); resetSurface(); observer.disconnect(); sizeObserver.disconnect();
      document.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave);
      document.removeEventListener('focusin', focus); window.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', measure); document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('blur', leave);
      root.classList.remove('page-hidden');
      ['--pointer-x', '--pointer-y', '--scroll-progress'].forEach(key => root.style.removeProperty(key));
      ['--orbit-turn', '--world-x', '--world-y'].forEach(key => layer.current?.style.removeProperty(key));
      surfaces.forEach(node => { node.style.removeProperty('--shine-x'); node.style.removeProperty('--shine-y'); });
      surfaces.forEach(node => { node.style.removeProperty('--talk-mic-x'); node.style.removeProperty('--talk-mic-y'); });
      reveals.forEach(node => { node.classList.remove('depth-pending', 'depth-visible'); node.style.removeProperty('--reveal-delay'); });
    };
  }, [enabled]);
  return <div ref={layer} className="ambient-world" aria-hidden="true">
    <div className="ambient-glow ambient-glow-a" /><div className="ambient-glow ambient-glow-b" />
    <div className="world-grid" />
    <div className="orbital-sculpture"><div className="sculpture-core" />{[0, 1, 2].map(i => <i key={i} style={{ '--ring': i }} />)}</div>
    <div className="floating-cube"><div className="cube-body">{['front', 'back', 'left', 'right', 'top', 'bottom'].map(face => <i className={`cube-${face}`} key={face} />)}</div></div>
    <div className="ambient-diamond" />
    <div className="depth-dots">{Array.from({ length: 14 }, (_, i) => <i key={i} style={{ left: `${(i * 37 + 7) % 100}%`, top: `${(i * 23 + 13) % 100}%`, '--drift-delay': `${-i * 1.7}s` }} />)}</div>
  </div>;
}

export function ProjectSculpture({ kind }) {
  return <div className={`project-sculpture sculpture-${kind}`} aria-hidden="true">
    {kind === 'discovery' ? <div className="lipstick-model">
      <div className="lipstick-shadow" />
      <div className="lipstick-bullet" />
      <div className="lipstick-collar" />
      <div className="lipstick-base"><span>GS</span></div>
      <div className="lipstick-cap"><span>glowsync</span></div>
    </div> : kind === 'voice' ? <div className="voice-bars">{[24, 42, 68, 92, 56, 78, 38].map((height, i) => <i key={i} style={{ '--bar-height': `${height}px`, '--bar-delay': `${-i * 0.18}s` }} />)}</div> : kind === 'talk' ? <div className="talk-stage"><div className="talk-orbit" /><div className="talk-mic">
      <div className="mic-head">{Array.from({ length: 16 }, (_, i) => <i className="mic-facet" key={i} style={{ '--facet': i }} />)}<b className="mic-cap" /></div>
      <div className="mic-handle">{Array.from({ length: 16 }, (_, i) => <i className="mic-facet" key={i} style={{ '--facet': i }} />)}<b className="mic-cap" /></div>
      <span className="mic-band" /><span className="mic-switch" />
    </div><div className="talk-platform" /></div> : <div className="mini-book"><div className="book-pages" />
      {[0, 1, 2].map(i => <div key={i} className="book-leaf" style={{ '--leaf': i }}><span>UNTITLED</span><i /><i /><i /><i /></div>)}
      <div className="book-cover"><div className="book-cover-title">UNTITLED<span>A world within.</span></div></div>
      <div className="book-spine" /></div>}
  </div>;
}
