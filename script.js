// View Transitions + Smooth Scroll + Active Nav State

// Mark ready for initial load reveal
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('ready');
  setupSwipeUpAnimations();
});

function scrollWithTransition(target) {
  const el = document.querySelector(target);
  if (!el) return;

  const doScroll = () => {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.startViewTransition(() => {
      doScroll();
    });
  } else {
    doScroll();
  }
}

// Intercept internal anchor clicks
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const href = a.getAttribute('href');
  if (href === '#' || href.length < 2) return;
  e.preventDefault();
  scrollWithTransition(href);
});

// Active state tracking for nav links
const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
const sections = navLinks
  .map(a => ({ id: a.getAttribute('href').slice(1), a }))
  .map(({ id, a }) => ({ el: document.getElementById(id), a }))
  .filter(({ el }) => !!el);

function setActiveBySection() {
  const y = window.scrollY;
  const winH = window.innerHeight;
  let best = null;
  for (const { el, a } of sections) {
    const rect = el.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const delta = Math.abs(top - y - winH * 0.2);
    if (!best || delta < best.delta) best = { a, delta };
  }
  navLinks.forEach(l => l.classList.remove('is-active'));
  if (best) best.a.classList.add('is-active');
}

let t;
window.addEventListener('scroll', () => {
  clearTimeout(t);
  t = setTimeout(setActiveBySection, 50);
}, { passive: true });

window.addEventListener('load', setActiveBySection);
window.addEventListener('resize', setActiveBySection);

// Swipe-up reveal on scroll
function setupSwipeUpAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const candidates = [
    ...document.querySelectorAll('section, .card, .project-card, .impact-card, .tech-card, .cert-card, .edu-item, .xp-item, .contact-item, .skill, .skills-cards > *, .skills-grid > *')
  ];
  candidates.forEach(el => el.classList.add('swipe-up'));

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.swipe-up').forEach(el => io.observe(el));
}
