import { Component, Suspense, lazy, useEffect, useRef, useState } from 'react';
import { portfolio as p } from './data.js';
import { AmbientWorld, MotionControl, ProjectSculpture, useImmersiveMotion } from './ImmersiveEffects.jsx';

const OrbitalScene = lazy(() => import('./OrbitalScene.jsx'));
const nav = [['work', 'Work'], ['about', 'About'], ['skills', 'Skills'], ['experience', 'Journey']];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}
function ExternalLink({ href, children, ...props }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}<span className="sr-only"> (opens in a new tab)</span></a>;
}
class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}
function useScenePreferences() {
  const [preferences, setPreferences] = useState(null);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPreferences({ reduced: media.matches, saveData: Boolean(navigator.connection?.saveData) });
    update(); media.addEventListener('change', update);
    navigator.connection?.addEventListener('change', update);
    return () => { media.removeEventListener('change', update); navigator.connection?.removeEventListener('change', update); };
  }, []);
  return preferences;
}
function HeroScene({ motionEnabled }) {
  const preferences = useScenePreferences();
  const [requested, setRequested] = useState(false);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(true);
  const [orientation, setOrientation] = useState(0);
  const [selection, setSelection] = useState(0);
  const frame = useRef(null);
  const [idle, setIdle] = useState(false);
  const [graphics, setGraphics] = useState(false);
  const restricted = !preferences || preferences.reduced || preferences.saveData;
  const enabled = !failed && graphics && idle && (requested || !restricted);
  useEffect(() => {
    if (!idle || !inView || (!requested && restricted) || graphics || failed) return;
    // Probe WebGL before downloading the heavy scene. Async renderer errors may
    // occur outside a React boundary, so unsupported contexts are caught here.
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true });
      if (!context) { setFailed(true); return; }
      context.getExtension('WEBGL_lose_context')?.loseContext();
      setGraphics(true);
    } catch { setFailed(true); }
  }, [idle, inView, requested, restricted, graphics, failed]);
  const moving = motionEnabled && enabled && !paused && !restricted && inView && visible;
  useEffect(() => {
    if (!enabled || ready) return;
    const timeout = window.setTimeout(() => setFailed(true), 12000);
    return () => window.clearTimeout(timeout);
  }, [enabled, ready]);
  useEffect(() => {
    const callback = () => setIdle(true);
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(callback, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(callback, 350); return () => clearTimeout(id);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    observer.observe(frame.current);
    const update = () => setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', update); update();
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  return <div className="scene-column">
    <div className="scene-topline"><span>EXPLORING WHAT’S POSSIBLE</span><span className="coordinates">01 / ∞</span></div>
    <div className="scene-frame" ref={frame}>
      <div className={`scene-fallback ${ready && enabled ? 'concealed' : ''}`} aria-hidden="true">
        <div className="fallback-type">IDEAS<br /><em>IN ORBIT</em></div>
      </div>
      {enabled && <SceneBoundary onFailure={() => { setFailed(true); setReady(false); }}>
        <Suspense fallback={null}>
          <OrbitalScene moving={moving} orientation={orientation} selection={selection} onReady={() => setReady(true)} onFailure={() => { setFailed(true); setReady(false); }} />
        </Suspense>
      </SceneBoundary>}
      <div className="scene-caption"><span className="crosshair" aria-hidden="true">+</span><span>{['Intelligence meets imagination.', 'Good design starts with curiosity.', 'Every idea has a story.'][selection]}</span></div>
    </div>
    <div className="scene-controls">
      <p id="scene-instructions">{failed ? 'Still view · 3D unavailable' : !enabled ? 'A little room for imagination.' : !ready ? 'Preparing 3D…' : 'Drag to orbit · scroll to explore'}</p>
      {!failed && (!enabled || ready) && <div className="scene-buttons">
        {!enabled ? <button type="button" onClick={() => setRequested(true)}>Explore 3D <span aria-hidden="true">＋</span></button> : <>
          <button type="button" onClick={() => setOrientation(n => n - 0.4)} aria-label="Rotate scene left">←</button>
          <button type="button" onClick={() => setOrientation(n => n + 0.4)} aria-label="Rotate scene right">→</button>
          {!restricted && <button type="button" aria-pressed={paused} onClick={() => setPaused(v => !v)}>{paused ? 'Resume' : 'Pause'}</button>}
          <button type="button" onClick={() => setSelection(n => (n + 1) % 3)} aria-label="Change scene color">◈</button>
        </>}
      </div>}
    </div>
  </div>;
}
function SectionHeader({ number, label, title, children }) {
  return <div className="section-heading" data-reveal=""><div><p className="eyebrow">{number} / {label}</p><h2>{title}</h2></div>{children}</div>;
}
function ProjectCard({ project }) {
  return <article className={`project-card project-${project.visual}`} data-depth="6" data-reveal="">
    <div className="project-cover">
      <ProjectSculpture kind={project.visual} />
      <span className="project-type">{project.category}</span><span className="project-no">/{project.number}</span>
      <div className="project-wordmark" aria-hidden="true">{project.visual === 'discovery' ? <>glow<span>sync</span><i>PERSONAL BY DESIGN</i></> : project.visual === 'voice' ? <>interview<span>pro.</span><i>FIND YOUR VOICE</i></> : project.visual === 'talk' ? <>TED<span>x</span><i>WHY I LEFT MY BOOK UNTITLED</i></> : <>UNTITLED<i>J SHAMEENKHAN</i></>}</div>
      <span className="cover-caption">{project.label}</span>
    </div>
    <div className="project-content"><h3>{project.title}</h3><p>{project.description}</p>
      <div className="tags">{[...project.tags, ...project.tech].map(tag => <span key={tag}>{tag}</span>)}</div>
      {project.link ? <ExternalLink className="text-link" href={project.link}>{project.linkLabel}<Arrow /></ExternalLink> : null}
    </div>
  </article>;
}
export default function App() {
  const motion = useImmersiveMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('');
  const menuButton = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: '-15% 0px -60% 0px' });
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const close = e => { if (e.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); } };
    const media = window.matchMedia('(min-width: 761px)');
    const resize = () => { if (media.matches) setMenuOpen(false); };
    window.addEventListener('keydown', close); media.addEventListener('change', resize);
    return () => { window.removeEventListener('keydown', close); media.removeEventListener('change', resize); };
  }, [menuOpen]);
  return <div className={`portfolio-shell ${motion.enabled ? 'motion-enabled' : 'motion-disabled'}`} style={{ '--accent': p.theme.accent, '--warm': p.theme.warm }}>
    <AmbientWorld enabled={motion.enabled} />
    <div className="reading-progress" aria-hidden="true" />
    <MotionControl {...motion} />
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><div className="header-inner">
      <a className="brand" href="#home" aria-label={`${p.name}, home`} onClick={() => setMenuOpen(false)}><span className="brand-symbol" aria-hidden="true">✳</span>{p.shortName.toLowerCase()}<span className="brand-dot">.</span></a>
      <button ref={menuButton} className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen(v => !v)}>{menuOpen ? 'Close' : 'Menu'} <span aria-hidden="true">{menuOpen ? '×' : '+'}</span></button>
      <nav id="main-nav" aria-label="Main navigation" className={menuOpen ? 'nav-open' : ''}>
        {nav.map(([id, title]) => <a href={`#${id}`} key={id} aria-current={active === id ? 'location' : undefined} onClick={() => setMenuOpen(false)}>{title}</a>)}
        <a href="#contact" className="nav-contact" data-depth="7" onClick={() => setMenuOpen(false)}>Let’s connect <Arrow /></a>
      </nav>
    </div></header>
    <main id="main" tabIndex={-1}>
      <section className="hero container" id="home" aria-labelledby="hero-title">
        <div className="hero-copy depth-heading"><p className="eyebrow"><span className="tiny-star" aria-hidden="true">✦</span> {p.role}</p>
          <h1 id="hero-title">{p.headline[0]}<br /><em>{p.headline[1]}</em></h1>
          <p className="hero-intro">{p.introduction}</p>
          <div className="hero-actions"><a className="button button-primary" data-depth="7" href="#work">Explore my work <span aria-hidden="true">↓</span></a><a className="button button-ghost" data-depth="7" href={p.resume} download>Resume <span aria-hidden="true">↓</span></a></div>
          <p className="availability"><span aria-hidden="true" />{p.availability}</p>
        </div>
        <HeroScene motionEnabled={motion.enabled} />
        <div className="hero-footer"><span>BASED IN {p.location.toUpperCase()}</span><a href="#work">SCROLL TO DISCOVER <span aria-hidden="true">↓</span></a><span>CODE · DESIGN · IMAGINATION</span></div>
      </section>
      <section className="section container" id="work" aria-labelledby="work-title">
        <SectionHeader number="01" label="SELECTED WORK" title={<span id="work-title">Ideas made <em>tangible.</em></span>}><p>From applied AI to the written word.<br />A few things I’ve been exploring.</p></SectionHeader>
        <div className="project-grid">{p.projects.map(project => <ProjectCard key={project.id} project={project} />)}</div>
      </section>
      <section className="section about-section container" id="about" aria-labelledby="about-title">
        <div className="about-heading depth-heading" data-reveal=""><p className="eyebrow">02 / BEHIND THE WORK</p><h2 id="about-title">A technical mind.<br /><em>A storyteller’s heart.</em></h2><span className="about-signature">{p.name}</span></div>
        <div className="about-copy" data-depth="3" data-reveal="">{p.about.map(text => <p key={text}>{text}</p>)}<div className="about-facts"><div><span>CURRENT CHAPTER</span><strong>AI & Machine Learning</strong></div><div><span>BEYOND THE SCREEN</span><strong>Poetry & storytelling</strong></div></div></div>
      </section>
      <section className="section container" id="skills" aria-labelledby="skills-title">
        <SectionHeader number="03" label="MY TOOLKIT" title={<span id="skills-title">Always <em>learning.</em></span>}><p>The foundations and tools<br />I bring to my work.</p></SectionHeader>
        <div className="skills-grid">{p.skills.map(group => <article className="skill-group" data-depth="8" data-reveal="" key={group.title}><p className="micro-label">{group.label}</p><h3>{group.title}</h3><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul></article>)}</div>
      </section>
      <section className="section container" id="experience" aria-labelledby="experience-title">
        <SectionHeader number="04" label="EXPERIENCE & LEARNING" title={<span id="experience-title">The journey <em>so far.</em></span>} />
        <div className="journey-grid"><div className="timeline">{p.journey.map(item => <article className="timeline-item" data-depth="3" data-reveal="" key={item.title}><span className="micro-label">{item.date}</span><h3>{item.title}</h3><p className="organization">{item.organization}</p><p>{item.description}</p></article>)}</div>
        <div className="certificates" data-depth="3" data-reveal=""><div className="certificate-heading"><h3>Learning, with intention.</h3><span>{String(p.certificates.length).padStart(2, '0')}</span></div><ul>{p.certificates.map(cert => <li key={cert.name}>{cert.url ? <ExternalLink href={cert.url}><span><strong>{cert.name}</strong><small>{cert.issuer} · {cert.date}</small></span><Arrow /></ExternalLink> : <div className="certificate-entry"><span><strong>{cert.name}</strong><small>{cert.issuer} · {cert.date}</small></span></div>}</li>)}</ul></div></div>
      </section>
      <section className="contact-section container" data-depth="2" data-reveal="" id="contact" aria-labelledby="contact-title"><p className="eyebrow">05 / THE NEXT CHAPTER</p><h2 id="contact-title">Have something<br /><em>in mind?</em> <span className="contact-star" aria-hidden="true">✳</span></h2><div className="contact-bottom"><p>I’m looking for opportunities to learn,<br />build and contribute. Let’s start a conversation.</p><ExternalLink href={p.links.linkedin} className="button button-primary" data-depth="7">Let’s connect on LinkedIn <Arrow /></ExternalLink>{p.email && <a className="text-link" href={`mailto:${p.email}`}>Email me <Arrow /></a>}</div></section>
    </main>
    <footer className="site-footer container"><span>© {new Date().getFullYear()} {p.name}</span><div><ExternalLink href={p.links.github}>GitHub <Arrow /></ExternalLink><ExternalLink href={p.links.linkedin}>LinkedIn <Arrow /></ExternalLink><ExternalLink href={p.links.unstop}>Unstop <Arrow /></ExternalLink></div><a href="#home">Back to top ↑</a></footer>
  </div>;
}
