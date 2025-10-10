// ---------- Smooth Scroll ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Close mobile menu after clicking
      const hamburger = document.getElementById('hamburger');
      const navLinks = document.querySelector('.nav-links');
      if (hamburger && navLinks) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      }
    }
  });
});

// ---------- Navbar Scroll Effect ----------
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ---------- Hamburger Menu Toggle ----------
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });
}

// ---------- Typing Effect ----------
function typeWriter(element, text, speed = 120) {
  let i = 0;
  element.innerHTML = '';
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

window.addEventListener('load', () => {
  const heroTitle = document.querySelector('.hero h1');
  if (heroTitle) typeWriter(heroTitle, 'Tamanna Khurana', 150);
});

// ---------- Fade-in Observer ----------
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.section, .project-card, .skill-category, .experience-item').forEach(el => observer.observe(el));

// ---------- Stat Counter ----------
function animateCounter(element, target, duration = 2000) {
  const start = parseInt(element.textContent) || 0;
  const increment = (target - start) / (duration / 16);
  let current = start;
  const counter = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + (element.textContent.includes('+') ? '+' : '');
      clearInterval(counter);
    } else {
      element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
    }
  }, 16);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const number = entry.target.querySelector('.stat-number');
      const text = number.textContent;
      const value = parseInt(text.replace(/\D/g, '')) || 0;
      
      // Special handling for "6th" ranking
      if (text.includes('th')) {
        number.textContent = '6th';
      } else {
        animateCounter(number, value);
      }
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => statObserver.observe(card));

// ---------- Glowing Cursor Trail ----------
const cursor = document.createElement('div');
cursor.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  background: radial-gradient(circle, rgba(0,255,255,0.9) 0%, rgba(168,85,247,0.9) 50%, transparent 80%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
  transform: translate(-50%, -50%);
`;
document.body.appendChild(cursor);

window.addEventListener('mousemove', (e) => {
  cursor.animate({
    transform: `translate(${e.clientX}px, ${e.clientY}px)`
  }, { duration: 300, fill: 'forwards' });
});

// ---------- Matrix Rain Background ----------
function createMatrixRain() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
    opacity: 0.12;
  `;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
  const letters = matrix.split("");
  const fontSize = 14;
  const columns = canvas.width / fontSize;
  const drops = Array(Math.floor(columns)).fill(1);

  function draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00ffff";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
      const text = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }
  setInterval(draw, 35);
  
  // Resize canvas on window resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}
createMatrixRain();

// ---------- Contact Form (Formspree Integration) ----------
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const response = await fetch('https://formspree.io/f/mdkwwowb', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    // Create glowing toast notification
    const toast = document.createElement('div');
    toast.textContent = response.ok
      ? '✅ Message sent successfully!'
      : '⚠️ There was an issue sending your message.';
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(0, 255, 255, 0.1);
      border: 1px solid #00ffff;
      color: #00ffff;
      font-weight: 500;
      padding: 10px 20px;
      border-radius: 10px;
      box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
      z-index: 9999;
      animation: fadeInOut 4s ease forwards;
    `;
    document.body.appendChild(toast);

    // Remove toast after animation
    setTimeout(() => toast.remove(), 4000);

    // Reset form
    if (response.ok) {
      contactForm.reset();
    }
  });
}

// ---------- Add fade animation keyframes ----------
const styleToast = document.createElement('style');
styleToast.textContent = `
@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(20px); }
  10% { opacity: 1; transform: translateY(0); }
  90% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(20px); }
}`;
document.head.appendChild(styleToast);

// ---------- Subtle Float Animation for Project Cards ----------
document.querySelectorAll('.project-card').forEach((card, index) => {
  card.style.animation = `float 6s ease-in-out infinite`;
  card.style.animationDelay = `${index * -2}s`;
});

// ---------- Parallax Effect for Hero (Optional) ----------
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  if (hero && window.innerWidth > 768) {
    hero.style.transform = `translateY(${scrolled * 0.3}px)`;
  }
});

// ---------- Add Glitch Effect to Logo ----------
const logo = document.querySelector('.logo');
if (logo) {
  logo.addEventListener('mouseenter', function() {
    this.style.animation = 'glitch 0.5s ease-in-out';
  });

  logo.addEventListener('animationend', function() {
    this.style.animation = '';
  });
}

// Add glitch animation
const glitchStyle = document.createElement('style');
glitchStyle.textContent = `
@keyframes glitch {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
}`;
document.head.appendChild(glitchStyle);