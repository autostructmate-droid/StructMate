/* =========================================================
   HERO TITLE — letter-by-letter drop animation
   ========================================================= */
function buildHeroTitle() {
  const el = document.getElementById('hero-title');
  if (!el) return;
  const word = 'STRUCTMATE';
  el.innerHTML = '';
  word.split('').forEach((letter, i) => {
    const span = document.createElement('span');
    span.textContent = letter;
    span.className = 'letter';
    span.style.animationDelay = `${0.35 + i * 0.075}s`;
    el.appendChild(span);
  });
}

/* =========================================================
   NAVBAR — scroll state & mobile menu
   ========================================================= */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  const syncScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', syncScroll, { passive: true });
  syncScroll();

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(open));
    navLinks.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* =========================================================
   SCROLL REVEAL — IntersectionObserver
   ========================================================= */
function initReveal() {
  const items = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
}

/* =========================================================
   CALC SHEET CAROUSEL
   ========================================================= */
function initCalcCarousel() {
  const slides   = document.querySelectorAll('.calc-slide');
  const dots     = document.querySelectorAll('.carousel-dots .dot');
  const label    = document.getElementById('carousel-label');
  let current    = 0;
  let timer      = null;
  let paused     = false;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    if (label) label.textContent = slides[current].dataset.label;
  }

  function next() { goTo(current + 1); }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(next, 4200);
  }

  /* Dot click — manual jump */
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      startTimer();          // reset interval so it doesn't jump immediately
    });
  });

  /* Pause on hover, resume on leave */
  const carousel = document.getElementById('calc-carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', () => { clearInterval(timer); });
    carousel.addEventListener('mouseleave', startTimer);
  }

  /* Only start auto-rotating when the section enters the viewport */
  const outputSection = document.getElementById('output');
  if (outputSection) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startTimer();
        } else {
          clearInterval(timer);
        }
      });
    }, { threshold: 0.2 });
    observer.observe(outputSection);
  } else {
    startTimer();
  }
}

/* =========================================================
   HERO PARALLAX — content fades & shifts on scroll
   ========================================================= */
function initParallax() {
  const content   = document.getElementById('hero-content');
  const gridLines = document.querySelector('.hero-grid-lines');
  if (!content) return;

  const vh = window.innerHeight;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > vh) return;
    const pct = y / vh;
    if (gridLines) gridLines.style.transform = `translateY(${y * 0.15}px)`;
    content.style.transform = `translateY(${y * 0.25}px)`;
    content.style.opacity   = String(1 - pct * 1.4);
  }, { passive: true });
}

/* =========================================================
   CARD TILT — subtle 3-D tilt on mouse move
   ========================================================= */
function initCardTilt() {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = ((e.clientX - left) / width  - 0.5) * 10;
      const y = ((e.clientY - top)  / height - 0.5) * -10;
      card.style.transform = `translateY(-10px) rotateX(${y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* =========================================================
   ACTIVE NAV LINK
   ========================================================= */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(link => link.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

/* =========================================================
   CURSOR GLOW — subtle radial that follows mouse in hero
   ========================================================= */
function initCursorGlow() {
  const hero = document.querySelector('.hero');
  const glow = document.querySelector('.hero-glow');
  if (!hero || !glow) return;

  hero.addEventListener('mousemove', e => {
    const { left, top, width, height } = hero.getBoundingClientRect();
    const xPct = ((e.clientX - left) / width  * 100).toFixed(1);
    const yPct = ((e.clientY - top)  / height * 100).toFixed(1);
    glow.style.background =
      `radial-gradient(circle at ${xPct}% ${yPct}%, rgba(91,91,214,0.14) 0%, transparent 65%)`;
  });

  hero.addEventListener('mouseleave', () => {
    glow.style.background =
      'radial-gradient(circle, rgba(91,91,214,0.1) 0%, transparent 65%)';
  });
}

/* =========================================================
   SMOOTH SCROLL
   ========================================================= */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* =========================================================
   INIT ALL
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  buildHeroTitle();
  initNavbar();
  initReveal();
  initCalcCarousel();
  initParallax();
  initCardTilt();
  initActiveNav();
  initCursorGlow();
  initSmoothScroll();
});
