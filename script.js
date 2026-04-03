// CURSOR
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.width = '50px';
    ring.style.height = '50px';
    ring.style.borderColor = 'rgba(91,110,245,0.6)';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width = '32px';
    ring.style.height = '32px';
    ring.style.borderColor = 'rgba(91,110,245,0.4)';
  });
});

// NAV SCROLL
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 50);
});

// TYPING ANIMATION
const words = ['Java', 'Spring Boot', 'Microservices', 'Kafka', 'Docker', 'Kubernetes', 'Spring AI'];
let wi = 0, ci = 0, del = false;
const el = document.getElementById('typed-text');

function type() {
  const w = words[wi];
  if (!del) {
    el.textContent = '"' + w.slice(0, ci + 1) + '"';
    ci++;
    if (ci === w.length) {
      del = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    el.textContent = '"' + w.slice(0, ci - 1) + '"';
    ci--;
    if (ci === 0) {
      del = false;
      wi = (wi + 1) % words.length;
      setTimeout(type, 400);
      return;
    }
  }
  setTimeout(type, del ? 60 : 90);
}
type();

// FADE UP ON SCROLL
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
