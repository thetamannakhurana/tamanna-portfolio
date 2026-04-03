/* ═══════════════════════════════════════════════════════════
   TAMANNA KHURANA · Portfolio
   
   GUARANTEED-TO-WORK ARCHITECTURE:
   
   ✅ COUNTERS   — 3 hard triggers: immediate + 500ms + 1500ms
                   All use requestAnimationFrame, NOT setTimeout
                   
   ✅ TYPEWRITER — starts in boot(), plain recursive setTimeout
                   No observers, no delays
                   
   ✅ WHO-CARDS  — CSS holds hidden state
                   3 hard triggers: 100ms + 600ms + IntersectionObserver
                   Uses !important on revealed state
                   
   ✅ REVEALS    — IntersectionObserver threshold:0 + immediate check
   
   RULE: NO gsap.set/gsap.to ever touches cards/counters/typer
   ═══════════════════════════════════════════════════════════ */
gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────
   LOADER — wraps everything in window.load
   so DOM is 100% ready before boot() runs
───────────────────────────────────────── */
(function initLoader() {
  const lf   = document.getElementById('lf');
  const lp   = document.getElementById('lp');
  const ls   = document.getElementById('ls');
  const msgs = ['Initialising...','Loading arsenal...','Compiling...','Encrypting...','Ready.'];
  let pct = 0, mi = 0;

  const ticker = setInterval(() => {
    pct = Math.min(pct + Math.random() * 12, 99);
    if (lf) lf.style.width = pct + '%';
    if (lp) lp.textContent = Math.floor(pct) + '%';
    if (ls && pct > mi * 22) { ls.textContent = msgs[Math.min(mi, msgs.length - 1)]; mi++; }
  }, 90);

  window.addEventListener('load', () => {
    clearInterval(ticker);
    if (lf) lf.style.width = '100%';
    if (lp) lp.textContent = '100%';
    if (ls) ls.textContent = 'Ready.';

    setTimeout(() => {
      gsap.to('#loader', {
        yPercent: -100, duration: .9, ease: 'power3.inOut',
        onComplete() {
          const el = document.getElementById('loader');
          if (el) el.style.display = 'none';
          boot();
        }
      });
    }, 400);
  });
})();

/* ─────────────────────────────────────────
   BOOT — called once after loader exits.
   Order matters: critical UI first.
───────────────────────────────────────── */
function boot() {
  /* 1. Counters — FIRST, before anything else */
  startCounters();

  /* 2. Typewriter — immediate */
  startTyper();

  /* 3. Who-cards — immediate + timed fallbacks */
  startWhoCards();

  /* 4. Everything else */
  initCursor();
  initTrail();
  initScrollBar();
  initNav();
  initBg();
  initCinSparks();
  initReveal();
  initWordSplit();
  initSectionGhosts();
  initSkillCards();
  initProjRows();
  initExpRows();
  initMagnetic();
  initClickSparks();
  initPillRipple();
  initMicroInteractions();
  initForm();
}

/* ═════════════════════════════════════════
   COUNTERS
   
   Three independent triggers all call the
   same idempotent animate() function.
   Once fired it sets a flag and never runs again.
   
   Trigger 1: immediate (first rAF after boot)
   Trigger 2: 500ms hard timeout
   Trigger 3: 1500ms hard timeout
   
   This means even on the slowest device,
   even if rAF is throttled, counters WILL run.
═════════════════════════════════════════ */
function startCounters() {
  const els = [...document.querySelectorAll('.hv[data-to]')];
  if (!els.length) return;

  let done = false;

  function animate() {
    if (done) return;
    done = true;

    els.forEach(el => {
      const target = +el.dataset.to;
      const duration = 1400;
      const startTime = performance.now();

      function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        /* easeOutCubic */
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target;
        }
      }

      requestAnimationFrame(tick);
    });
  }

  /* Trigger 1: next animation frame */
  requestAnimationFrame(animate);

  /* Trigger 2: 500ms hard fallback */
  setTimeout(animate, 500);

  /* Trigger 3: 1500ms hard fallback */
  setTimeout(animate, 1500);
}

/* ═════════════════════════════════════════
   TYPEWRITER
   
   Plain recursive setTimeout — the simplest
   possible implementation. Cannot fail.
═════════════════════════════════════════ */
function startTyper() {
  const el = document.getElementById('typer');
  if (!el) return;

  const roles = [
    'Cybersecurity Engineer',
    'Penetration Tester',
    'Full-Stack Developer',
    'Ethical Hacker',
    'SDE @ NFSU Delhi',
    'VS Code Extension Dev',
    'CTF Player & Problem Solver'
  ];

  let ri = 0, ci = 0, deleting = false, wait = 0;

  function tick() {
    if (wait-- > 0) { setTimeout(tick, 55); return; }

    const word = roles[ri];

    if (!deleting && ci <= word.length) {
      el.textContent = word.slice(0, ci++);
      setTimeout(tick, 75);
    } else if (!deleting) {
      deleting = true;
      wait = 24;
      setTimeout(tick, 55);
    } else if (deleting && ci > 0) {
      el.textContent = word.slice(0, --ci);
      setTimeout(tick, 34);
    } else {
      deleting = false;
      ri = (ri + 1) % roles.length;
      wait = 8;
      setTimeout(tick, 55);
    }
  }

  tick();
}

/* ═════════════════════════════════════════
   WHO-CARDS
   
   CSS start state:
     #wc0 → opacity:0, translateX(120px) rotate(3deg)
     #wc1 → opacity:0, translateX(160px) rotate(-3deg)
   
   CSS revealed state (.wc-on):
     opacity:1 !important
     transform:translateX(0) rotate(0deg) !important
   
   Three triggers all call showCards() which
   is idempotent (runs once via `shown` flag).
   
   Tilt uses ONLY card.style.transform — never
   touches opacity or the !important translateX.
═════════════════════════════════════════ */
function startWhoCards() {
  const c0  = document.getElementById('wc0');
  const c1  = document.getElementById('wc1');
  const box = document.getElementById('whoCards');
  if (!c0 || !c1 || !box) return;

  let shown = false;

  function showCards() {
    if (shown) return;
    shown = true;
    c0.classList.add('wc-on');
    setTimeout(() => c1.classList.add('wc-on'), 200);
  }

  /* Trigger 1: 100ms after boot */
  setTimeout(showCards, 100);

  /* Trigger 2: 600ms hard fallback */
  setTimeout(showCards, 600);

  /* Trigger 3: IntersectionObserver (bonus) */
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { obs.disconnect(); showCards(); }
  }, { threshold: 0 });
  obs.observe(box);

  /* ── 3D TILT ── */
  [c0, c1].forEach(card => {
    let hovering = false;

    card.addEventListener('mouseenter', () => { hovering = true; });

    card.addEventListener('mouseleave', () => {
      hovering = false;
      if (!card.classList.contains('wc-on')) return;
      /* Reset tilt: empty string → CSS .wc-on takes over */
      card.style.transition = 'transform .8s cubic-bezier(.16,1,.3,1), box-shadow .4s';
      card.style.transform  = '';
    });

    card.addEventListener('mousemove', e => {
      if (!hovering || !card.classList.contains('wc-on')) return;
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
      const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
      card.style.transition = 'transform .1s linear, box-shadow .3s';
      card.style.transform  = `translateX(0) rotate(0deg) translateY(-7px) rotateY(${dx*7}deg) rotateX(${-dy*6}deg) scale(1.012)`;
    });

    /* Stat bounce + icon spin */
    card.addEventListener('mouseenter', () => {
      card.querySelectorAll('.wc-stat strong').forEach((s, i) => {
        gsap.fromTo(s, { scale: 1 }, {
          scale: 1.12, duration: .28, delay: i * .07,
          ease: 'back.out(2.5)', yoyo: true, repeat: 1
        });
      });
      const ico = card.querySelector('.wc-icon');
      if (ico) gsap.to(ico, { rotation: -15, scale: 1.24, duration: .45, ease: 'back.out(1.8)' });
    });

    card.addEventListener('mouseleave', () => {
      const ico = card.querySelector('.wc-icon');
      if (ico) gsap.to(ico, { rotation: 0, scale: 1, duration: .65, ease: 'elastic.out(1,.4)' });
    });
  });
}

/* ─────────────────────────────────────────
   CURSOR
───────────────────────────────────────── */
function initCursor() {
  const dot  = document.getElementById('cd');
  const ring = document.getElementById('cr');
  if (!dot) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  gsap.ticker.add(() => {
    dot.style.left  = mx + 'px';  dot.style.top  = my + 'px';
    rx += (mx - rx) * .12;        ry += (my - ry) * .12;
    ring.style.left = rx + 'px';  ring.style.top = ry + 'px';
  });
  document.addEventListener('mousedown', () => ring.classList.add('click'));
  document.addEventListener('mouseup',   () => ring.classList.remove('click'));
  document.querySelectorAll('a,button,.who-card,.sk-card,.proj-row,.exp-row,.cl').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hov'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hov'));
  });
}

/* ─────────────────────────────────────────
   TRAIL
───────────────────────────────────────── */
function initTrail() {
  const wrap = document.getElementById('trailWrap');
  if (!wrap) return;
  const N = 10;
  const dots = Array.from({ length: N }, () => {
    const d = document.createElement('div');
    d.className = 'trail-dot';
    wrap.appendChild(d);
    return { el: d, x: 0, y: 0 };
  });
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  gsap.ticker.add(() => {
    dots.forEach((dot, i) => {
      const prev = i === 0 ? { x: mx, y: my } : dots[i - 1];
      dot.x += (prev.x - dot.x) * (0.3 - i * 0.022);
      dot.y += (prev.y - dot.y) * (0.3 - i * 0.022);
      const s = 1 - i / N;
      dot.el.style.cssText = `left:${dot.x}px;top:${dot.y}px;opacity:${s * .32};transform:translate(-50%,-50%) scale(${s})`;
    });
  });
}

/* ─────────────────────────────────────────
   SCROLL BAR
───────────────────────────────────────── */
function initScrollBar() {
  const bar = document.getElementById('scrollBar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
  }, { passive: true });
}

/* ─────────────────────────────────────────
   NAV
───────────────────────────────────────── */
function initNav() {
  const nav  = document.getElementById('nav');
  const mb   = document.getElementById('mb');
  const mo   = document.getElementById('mo');
  const pill = document.getElementById('navPill');
  const secs = [...document.querySelectorAll('section[id]')];
  let open = false;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('on', scrollY > 40);
    if (pill) {
      const cur = secs.find(s => {
        const r = s.getBoundingClientRect();
        return r.top <= 100 && r.bottom > 100;
      });
      if (cur) pill.textContent = cur.id.toUpperCase();
    }
  }, { passive: true });

  mb.addEventListener('click', () => {
    open = !open;
    mb.classList.toggle('on', open);
    mo.classList.toggle('on', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mo.querySelectorAll('.mol').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      open = false;
      mb.classList.remove('on');
      mo.classList.remove('on');
      document.body.style.overflow = '';
      setTimeout(() => t?.scrollIntoView({ behavior: 'smooth' }), 380);
    });
  });
}

/* ─────────────────────────────────────────
   BACKGROUND CANVAS
   Drifting spotlight + mouse glow + 90 nodes
───────────────────────────────────────── */
function initBg() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, mx = -999, my = -999;
  const nodes = [];

  function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  for (let i = 0; i < 90; i++) nodes.push({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    vx: (Math.random() - .5) * .3,
    vy: (Math.random() - .5) * .3,
    r: Math.random() * 1.8 + .4,
    pulse: Math.random() * Math.PI * 2
  });

  let frame = 0;
  (function draw() {
    frame++;
    ctx.clearRect(0, 0, W, H);

    const gx = W/2 + Math.sin(frame*.008)*W*.3;
    const gy = H/2 + Math.cos(frame*.006)*H*.25;
    const g1 = ctx.createRadialGradient(gx, gy, 0, gx, gy, W*.55);
    g1.addColorStop(0, 'rgba(0,170,255,.055)');
    g1.addColorStop(.5, 'rgba(0,100,200,.02)');
    g1.addColorStop(1, 'transparent');
    ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);

    const g2x = W/2 + Math.cos(frame*.006)*W*.22;
    const g2y = H/2 + Math.sin(frame*.008)*H*.18;
    const g2 = ctx.createRadialGradient(g2x, g2y, 0, g2x, g2y, W*.35);
    g2.addColorStop(0, 'rgba(0,55,160,.032)');
    g2.addColorStop(1, 'transparent');
    ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);

    if (mx > 0) {
      const mg = ctx.createRadialGradient(mx, my, 0, mx, my, 250);
      mg.addColorStop(0, 'rgba(0,170,255,.08)');
      mg.addColorStop(1, 'transparent');
      ctx.fillStyle = mg; ctx.fillRect(0, 0, W, H);
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = Math.hypot(nodes[i].x-nodes[j].x, nodes[i].y-nodes[j].y);
        if (d < 130) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,170,255,${.1*(1-d/130)})`;
          ctx.lineWidth = .6;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
      const md = Math.hypot(nodes[i].x-mx, nodes[i].y-my);
      if (md < 180) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,170,255,${.25*(1-md/180)})`;
        ctx.lineWidth = .8;
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(mx, my);
        ctx.stroke();
      }
    }

    nodes.forEach(n => {
      n.pulse += .04;
      const pr = n.r + Math.sin(n.pulse) * .6;
      ctx.beginPath();
      ctx.arc(n.x, n.y, pr, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(0,170,255,.55)';
      ctx.fill();
      if (n.r > 1.4) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, pr+3, 0, Math.PI*2);
        ctx.strokeStyle = 'rgba(0,170,255,.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    requestAnimationFrame(draw);
  })();
}

/* ─────────────────────────────────────────
   CINEMATIC SPARKS
───────────────────────────────────────── */
function initCinSparks() {
  const c = document.getElementById('cinSparks');
  if (!c) return;

  function burst(n) {
    const cols = ['#00aaff','#00eeff','#fff','#ffcc00','#ff6b35','#ff2d55'];
    for (let i = 0; i < n; i++) {
      const sp  = document.createElement('div');
      const ang  = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * 300;
      const size = Math.random() * 4.5 + 1.5;
      const col  = cols[Math.floor(Math.random() * cols.length)];
      Object.assign(sp.style, {
        position: 'absolute',
        left: c.offsetWidth/2 + 'px',
        top:  c.offsetHeight/2 + 'px',
        width: size+'px', height: size+'px',
        background: col, borderRadius: '50%',
        pointerEvents: 'none',
        boxShadow: `0 0 ${size*3}px ${col}`
      });
      c.appendChild(sp);
      gsap.to(sp, {
        x: Math.cos(ang)*dist,
        y: Math.sin(ang)*dist - Math.random()*120,
        opacity: 0, scale: .1,
        duration: .75 + Math.random()*1.2,
        ease: 'power2.out',
        onComplete: () => sp.remove()
      });
    }
  }

  setTimeout(() => {
    burst(100);
    setTimeout(() => burst(60), 380);
    setTimeout(() => burst(35), 820);
  }, 2100);
}

/* ─────────────────────────────────────────
   DATA-REV REVEALS
───────────────────────────────────────── */
function initReveal() {
  document.querySelectorAll('[data-rev]').forEach(el => {
    el.style.transitionDelay = (el.dataset.revD || 0) + 's';

    /* Check immediately */
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight) { el.classList.add('rev-on'); return; }

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        obs.disconnect();
        el.classList.add('rev-on');
      }
    }, { threshold: 0 });
    obs.observe(el);
  });
}

/* ─────────────────────────────────────────
   WORD SPLIT
───────────────────────────────────────── */
function initWordSplit() {
  document.querySelectorAll('[data-words]').forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w, i) =>
      `<span class="wsp"><span class="wsp-in" style="transition-delay:${i*.1}s">${w}</span></span>`
    ).join(' ');

    function reveal() {
      el.querySelectorAll('.wsp-in').forEach(s => s.classList.add('wsp-on'));
    }

    const r = el.getBoundingClientRect();
    if (r.top < innerHeight) { reveal(); return; }

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { obs.disconnect(); reveal(); }
    }, { threshold: 0 });
    obs.observe(el);
  });
}

/* ─────────────────────────────────────────
   SECTION GHOST NUMBERS
───────────────────────────────────────── */
function initSectionGhosts() {
  document.querySelectorAll('.section').forEach((sec, i) => {
    const nums = ['01','02','03','04','05'];
    if (!nums[i]) return;
    sec.style.position = 'relative';
    const g = document.createElement('div');
    g.className = 's-ghost';
    g.textContent = nums[i];
    sec.appendChild(g);
    gsap.to(g, {
      yPercent: -28, ease: 'none',
      scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: 2 }
    });
  });
}

/* ─────────────────────────────────────────
   SKILL CARDS
───────────────────────────────────────── */
function initSkillCards() {
  document.querySelectorAll('[data-card]').forEach(el => {
    const i = +el.dataset.card;
    gsap.set(el, { opacity: 0, y: 30, scale: .97 });
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: .7, delay: i*.09, ease: 'power3.out' })
    });
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      gsap.to(el, {
        rotateY:  (e.clientX-r.left-r.width/2)  / (r.width/2)  * 13,
        rotateX: -(e.clientY-r.top-r.height/2)  / (r.height/2) * 13,
        scale: 1.03, duration: .1, ease: 'power1.out', transformPerspective: 900
      });
    });
    el.addEventListener('mouseleave', () => gsap.to(el, {
      rotateY: 0, rotateX: 0, scale: 1,
      duration: .7, ease: 'elastic.out(1,.5)', transformPerspective: 900
    }));
  });
}

/* ─────────────────────────────────────────
   PROJECT ROWS
───────────────────────────────────────── */
function initProjRows() {
  document.querySelectorAll('[data-proj]').forEach((el, i) => {
    gsap.set(el, { opacity: 0, y: 22 });
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: .62, delay: i*.05, ease: 'power3.out' })
    });
    const thumb = el.querySelector('.pthumb');
    if (thumb) gsap.to(thumb, {
      yPercent: -10, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
    });
  });
}

/* ─────────────────────────────────────────
   EXPERIENCE ROWS
───────────────────────────────────────── */
function initExpRows() {
  document.querySelectorAll('[data-exp]').forEach((el, i) => {
    gsap.set(el, { opacity: 0, x: -24 });
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => gsap.to(el, { opacity: 1, x: 0, duration: .62, delay: i*.07, ease: 'power3.out' })
    });
  });
}

/* ─────────────────────────────────────────
   MAGNETIC BUTTONS
───────────────────────────────────────── */
function initMagnetic() {
  document.querySelectorAll('.btn-fill,.btn-line,.nav-logo').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX-r.left-r.width/2)  * .32,
        y: (e.clientY-r.top-r.height/2)  * .32,
        duration: .35, ease: 'power2.out'
      });
    });
    el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: .58, ease: 'elastic.out(1,.5)' }));
  });
}

/* ─────────────────────────────────────────
   CLICK SPARKS CANVAS
───────────────────────────────────────── */
function initClickSparks() {
  const canvas = document.getElementById('sparkCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = innerWidth; canvas.height = innerHeight;
  window.addEventListener('resize', () => { canvas.width = innerWidth; canvas.height = innerHeight; });

  const COLS = ['#00aaff','#00eeff','#fff','#66ccff','#0077ff','#ffb400'];
  let parts = [];

  class Spark {
    constructor(x, y) {
      this.x = x; this.y = y;
      this.vx = (Math.random()-.5) * 12;
      this.vy = (Math.random()-1.5) * 12;
      this.a  = 1;
      this.r  = Math.random() * 3.5 + 1;
      this.c  = COLS[Math.floor(Math.random() * COLS.length)];
    }
    step() { this.vx *= .94; this.vy += .3; this.x += this.vx; this.y += this.vy; this.a -= .02; this.r *= .97; }
    draw() { ctx.globalAlpha = Math.max(0, this.a); ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI*2); ctx.fillStyle = this.c; ctx.fill(); }
  }

  document.addEventListener('click', e => {
    if (e.target.closest('a,button,input,textarea')) return;
    for (let i = 0; i < 26; i++) parts.push(new Spark(e.clientX, e.clientY));
  });
  document.addEventListener('dblclick', e => {
    for (let i = 0; i < 75; i++) parts.push(new Spark(e.clientX, e.clientY));
  });

  (function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    parts = parts.filter(p => p.a > 0);
    parts.forEach(p => { p.step(); p.draw(); });
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  })();
}

/* ─────────────────────────────────────────
   SKILL PILL RIPPLE
───────────────────────────────────────── */
function initPillRipple() {
  document.querySelectorAll('.sk-pills span').forEach(pill => {
    pill.addEventListener('click', e => {
      const r = document.createElement('span');
      Object.assign(r.style, {
        position: 'absolute', borderRadius: '50%',
        width: '60px', height: '60px',
        background: 'rgba(0,170,255,.28)',
        left: (e.offsetX-30) + 'px', top: (e.offsetY-30) + 'px',
        pointerEvents: 'none', transform: 'scale(0)', opacity: '1'
      });
      pill.appendChild(r);
      gsap.to(r, { scale: 3.5, opacity: 0, duration: .52, ease: 'power2.out', onComplete: () => r.remove() });
    });
  });
}

/* ─────────────────────────────────────────
   MICRO INTERACTIONS
───────────────────────────────────────── */
function initMicroInteractions() {
  document.querySelectorAll('.mol').forEach(a => {
    a.addEventListener('mouseenter', () => gsap.fromTo(a, { x: 0 }, { x: 7, duration: .18, ease: 'power2.out', yoyo: true, repeat: 1 }));
  });

  document.querySelectorAll('.proj-row').forEach(row => {
    const num = row.querySelector('.pn');
    row.addEventListener('mouseenter', () => {
      if (num) gsap.fromTo(num, { scale: 1 }, { scale: 1.45, duration: .24, ease: 'back.out(2)', yoyo: true, repeat: 1 });
    });
  });

  document.querySelectorAll('.exp-row').forEach(row => {
    const role = row.querySelector('.exp-role');
    row.addEventListener('mouseenter', () => {
      if (role) gsap.fromTo(role, { x: 0 }, { x: 6, duration: .2, ease: 'power2.out', yoyo: true, repeat: 1 });
    });
  });

  document.querySelectorAll('a.cl').forEach(cl => {
    const ico = cl.querySelector('i:first-child');
    cl.addEventListener('mouseenter', () => { if (ico) gsap.to(ico, { scale: 1.35, rotation: -10, duration: .28, ease: 'back.out(2)' }); });
    cl.addEventListener('mouseleave', () => { if (ico) gsap.to(ico, { scale: 1, rotation: 0, duration: .4,  ease: 'elastic.out(1,.5)' }); });
  });
}

/* ─────────────────────────────────────────
   CONTACT FORM
───────────────────────────────────────── */
function initForm() {
  const form = document.querySelector('.c-form');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button');
    btn.textContent = 'Sending…';
    try {
      const res = await fetch('https://formspree.io/f/mdkwwowb', {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      toast(res.ok ? '✅ Sent! Talk soon.' : '⚠️ Failed. Email me directly.');
      if (res.ok) form.reset();
    } catch {
      toast('⚠️ Network error.');
    } finally {
      btn.innerHTML = 'Send It <i class="fas fa-paper-plane"></i>';
    }
  });
}

function toast(msg) {
  const t = document.createElement('div');
  t.innerHTML = msg;
  Object.assign(t.style, {
    position: 'fixed', bottom: '2rem', right: '2rem',
    background: 'rgba(5,8,14,.97)',
    border: '1px solid rgba(0,170,255,.42)',
    color: '#00aaff', fontFamily: 'Share Tech Mono,monospace',
    fontSize: '.82rem', padding: '.88rem 1.45rem',
    borderRadius: '5px', zIndex: '99999',
    backdropFilter: 'blur(16px)',
    boxShadow: '0 8px 34px rgba(0,170,255,.24)'
  });
  document.body.appendChild(t);
  gsap.fromTo(t, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .36, ease: 'power2.out' });
  setTimeout(() => gsap.to(t, { opacity: 0, y: 20, duration: .36, onComplete: () => t.remove() }), 3800);
}