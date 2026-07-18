// Teatrul Copilăriei — shared behaviour

// Mobile nav
const burger = document.querySelector('.burger');
const nav = document.querySelector('.main-nav');
if (burger && nav) {
  burger.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
}

// Frame scheduler: setTimeout-driven so animation still runs in renderers
// where requestAnimationFrame is throttled or suspended
function frame(fn) { setTimeout(() => fn(performance.now()), 16); }

// Animated counters
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1600;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased).toLocaleString('ro-RO');
    if (p < 1) frame(tick);
  }
  frame(tick);
}

// Scroll-driven reveal + counters (rect-based; no IntersectionObserver so it
// behaves identically in every rendering environment)
const revealEls = Array.from(document.querySelectorAll('.reveal'));
const counterEls = Array.from(document.querySelectorAll('[data-count]'));
let scrollScheduled = false;

function checkInView() {
  scrollScheduled = false;
  const vh = window.innerHeight;
  for (let i = revealEls.length - 1; i >= 0; i--) {
    const el = revealEls[i];
    if (el.getBoundingClientRect().top < vh * 0.92) {
      el.classList.add('visible');
      revealEls.splice(i, 1);
    }
  }
  for (let i = counterEls.length - 1; i >= 0; i--) {
    const el = counterEls[i];
    const r = el.getBoundingClientRect();
    if (r.top < vh && r.bottom > 0) {
      animateCounter(el);
      counterEls.splice(i, 1);
    }
  }
  if (!revealEls.length && !counterEls.length) {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  }
}
function onScroll() {
  if (!scrollScheduled) {
    scrollScheduled = true;
    frame(checkInView);
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll, { passive: true });
checkInView();
