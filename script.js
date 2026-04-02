/* ═══════════════════════════════════════════════
   TAMANNA KHURANA — Portfolio JS
   Rule: GSAP is ONLY used for bg, sparks, skill tilt,
         proj/exp rows, magnetics, click sparks.
   Cards, counters, reveals = pure CSS + JS only.
   ═══════════════════════════════════════════════ */
gsap.registerPlugin(ScrollTrigger);

/* ════════════════════════════════
   LOADER
════════════════════════════════ */
const lf = document.getElementById('lf');
const lp = document.getElementById('lp');
let pct = 0;
const lt = setInterval(() => {
  pct = Math.min(pct + Math.random() * 14, 99);
  if (lf) lf.style.width = pct + '%';
  if (lp) lp.textContent = Math.floor(pct) + '%';
}, 90);

window.addEventListener('load', () => {
  clearInterval(lt);
  if (lf) lf.style.width = '100%';
  if (lp) lp.textContent = '100%';
  setTimeout(() => {
    gsap.to('#loader', {
      yPercent: -100, duration: .8, ease: 'power3.inOut',
      onComplete: () => {
        document.getElementById('loader').style.display = 'none';
        boot();
      }
    });
  }, 350);
});

/* ════════════════════════════════
   BOOT
════════════════════════════════ */
function boot() {
  initCursor();
  initCursorTrail();
  initScrollProgress();
  initNav();
  initGlobalBg();
  initCinSparks();
  initTyper();
  initCounters();
  initDataReveal();
  initWordSplit();
  initWhoCards();
  initSectionGhosts();
  initSkillCards();
  initProjRows();
  initExpRows();
  initMagnetic();
  initClickSparks();
  initSkillRipple();
  initForm();
}

/* ════════════════════════════════
   CURSOR
════════════════════════════════ */
function initCursor() {
  const dot = document.getElementById('cd');
  const ring = document.getElementById('cr');
  if (!dot) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  gsap.ticker.add(() => {
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    rx += (mx - rx) * .12; ry += (my - ry) * .12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  });
  document.querySelectorAll('a,button,.who-card,.sk-card,.proj-row,.exp-row').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hov'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hov'));
  });
}

/* ════════════════════════════════
   CURSOR TRAIL
════════════════════════════════ */
function initCursorTrail() {
  const wrap = document.getElementById('trailWrap');
  if (!wrap) return;
  const N = 8;
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
      dot.x += (prev.x - dot.x) * (0.35 - i * 0.03);
      dot.y += (prev.y - dot.y) * (0.35 - i * 0.03);
      const scale = 1 - i / N;
      dot.el.style.cssText = `
        left:${dot.x}px; top:${dot.y}px;
        opacity:${(1 - i / N) * 0.4};
        transform:translate(-50%,-50%) scale(${scale});
      `;
    });
  });
}

/* ════════════════════════════════
   SCROLL PROGRESS
════════════════════════════════ */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
  }, { passive: true });
}

/* ════════════════════════════════
   NAV
════════════════════════════════ */
function initNav() {
  const nav = document.getElementById('nav');
  const mb = document.getElementById('mb');
  const mo = document.getElementById('mo');
  let open = false;
  window.addEventListener('scroll', () => nav.classList.toggle('on', scrollY > 40), { passive: true });
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
      open = false; mb.classList.remove('on'); mo.classList.remove('on');
      document.body.style.overflow = '';
      setTimeout(() => t?.scrollIntoView({ behavior: 'smooth' }), 380);
    });
  });
}

/* ════════════════════════════════
   GLOBAL BG CANVAS
════════════════════════════════ */
function initGlobalBg() {
  const canvas = document.getElementById('globalBg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, frame = 0, mx = -999, my = -999;
  const nodes = [];
  function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  for (let i = 0; i < 90; i++) nodes.push({
    x: Math.random() * innerWidth, y: Math.random() * innerHeight,
    vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28,
    r: Math.random() * 1.8 + .35, pulse: Math.random() * Math.PI * 2,
    glow: Math.random() > .75
  });
  (function draw() {
    frame++;
    ctx.clearRect(0, 0, W, H);
    const g1x = W/2+Math.sin(frame*.007)*W*.28, g1y = H/2+Math.cos(frame*.005)*H*.22;
    const grd = ctx.createRadialGradient(g1x, g1y, 0, g1x, g1y, W*.5);
    grd.addColorStop(0, 'rgba(0,170,255,.05)'); grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H);
    if (mx > 0) {
      const mg = ctx.createRadialGradient(mx, my, 0, mx, my, 260);
      mg.addColorStop(0, 'rgba(0,170,255,.07)'); mg.addColorStop(1, 'transparent');
      ctx.fillStyle = mg; ctx.fillRect(0, 0, W, H);
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i+1; j < nodes.length; j++) {
        const d = Math.hypot(nodes[i].x-nodes[j].x, nodes[i].y-nodes[j].y);
        if (d < 125) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,170,255,${.09*(1-d/125)})`;
          ctx.lineWidth = .55;
          ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
      const md = Math.hypot(nodes[i].x-mx, nodes[i].y-my);
      if (md < 200) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,170,255,${.22*(1-md/200)})`;
        ctx.lineWidth = .9;
        ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(mx, my);
        ctx.stroke();
      }
    }
    nodes.forEach(n => {
      n.pulse += .038;
      const pr = n.r + Math.sin(n.pulse) * .5;
      ctx.beginPath(); ctx.arc(n.x, n.y, pr, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(0,170,255,.55)'; ctx.fill();
      if (n.glow) {
        ctx.beginPath(); ctx.arc(n.x, n.y, pr+3.5, 0, Math.PI*2);
        ctx.strokeStyle = 'rgba(0,170,255,.1)'; ctx.lineWidth = 1; ctx.stroke();
      }
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });
    requestAnimationFrame(draw);
  })();
}

/* ════════════════════════════════
   CINEMATIC SPARKS
════════════════════════════════ */
function initCinSparks() {
  const c = document.getElementById('cinSparks');
  if (!c) return;
  function burst(n) {
    const cols = ['#00aaff','#00ddff','#fff','#ffcc00','#ff8800'];
    for (let i = 0; i < n; i++) {
      const sp = document.createElement('div');
      const ang = Math.random()*Math.PI*2, dist = 80+Math.random()*260, size = Math.random()*4+2;
      const col = cols[Math.floor(Math.random()*cols.length)];
      Object.assign(sp.style, { position:'absolute', left:c.offsetWidth/2+'px', top:c.offsetHeight/2+'px', width:size+'px', height:size+'px', background:col, borderRadius:'50%', pointerEvents:'none', boxShadow:`0 0 ${size*3}px ${col}` });
      c.appendChild(sp);
      gsap.to(sp, { x:Math.cos(ang)*dist, y:Math.sin(ang)*dist-Math.random()*80, opacity:0, scale:.2, duration:.6+Math.random()*1, ease:'power2.out', onComplete:()=>sp.remove() });
    }
  }
  setTimeout(() => { burst(80); setTimeout(()=>burst(40),400); setTimeout(()=>burst(25),800); }, 2000);
}

/* ════════════════════════════════
   TYPEWRITER
════════════════════════════════ */
function initTyper() {
  const el = document.getElementById('typer');
  if (!el) return;
  const roles = ['Cybersecurity Engineer','Penetration Tester','Full-Stack Developer','Ethical Hacker','SDE @ NFSU Delhi'];
  let ri = 0, ci = 0, del = false, pause = 0;
  function tick() {
    if (pause-- > 0) { setTimeout(tick, 55); return; }
    const cur = roles[ri];
    if (!del && ci <= cur.length) { el.textContent = cur.slice(0,ci++); setTimeout(tick,75); }
    else if (!del) { del=true; pause=22; setTimeout(tick,55); }
    else if (del && ci>0) { el.textContent=cur.slice(0,--ci); setTimeout(tick,36); }
    else { del=false; ri=(ri+1)%roles.length; pause=7; setTimeout(tick,55); }
  }
  tick();
}

/* ════════════════════════════════
   COUNTERS
   — observe each element individually
   — disconnect after firing so it NEVER resets
   — hard fallback at 2.5s
════════════════════════════════ */
function initCounters() {
  document.querySelectorAll('.hv[data-to]').forEach(el => {
    const target = +el.dataset.to;
    let fired = false;

    function run() {
      if (fired) return;
      fired = true;
      el.textContent = target; // set immediately, then animate
      const duration = 1400;
      const start = performance.now();
      function step(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target; // guarantee final value
      }
      requestAnimationFrame(step);
    }

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        obs.disconnect(); // ← disconnect immediately so never fires again
        run();
      }
    }, { threshold: 0.1 });
    obs.observe(el);

    // Hard fallback — runs at 2.5s no matter what
    setTimeout(run, 2500);
  });
}

/* ════════════════════════════════
   DATA-REV REVEALS
   — IntersectionObserver fires once then disconnects
════════════════════════════════ */
function initDataReveal() {
  document.querySelectorAll('[data-rev]').forEach(el => {
    el.style.transitionDelay = (el.dataset.revD || 0) + 's';
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        obs.disconnect();
        el.classList.add('rev-on');
      }
    }, { threshold: 0.07, rootMargin: '0px 0px -20px 0px' });
    obs.observe(el);
  });
}

/* ════════════════════════════════
   WORD SPLIT
════════════════════════════════ */
function initWordSplit() {
  document.querySelectorAll('[data-words]').forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w, i) =>
      `<span class="wsp"><span class="wsp-in" style="transition-delay:${i*.1}s">${w}</span></span>`
    ).join(' ');
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        obs.disconnect();
        el.querySelectorAll('.wsp-in').forEach(s => s.classList.add('wsp-on'));
      }
    }, { threshold: 0.15 });
    obs.observe(el);
  });
}

/* ════════════════════════════════
   WHO CARDS
   — Pure CSS slide from right
   — class .wc-on added ONCE, never removed
   — tilt done via direct style, never touches opacity/transform axis
════════════════════════════════ */
function initWhoCards() {
  const c0 = document.getElementById('wc0');
  const c1 = document.getElementById('wc1');
  const container = document.getElementById('whoCards');
  if (!c0 || !c1 || !container) return;

  let fired = false;
  function show() {
    if (fired) return;
    fired = true;
    c0.classList.add('wc-on');
    setTimeout(() => c1.classList.add('wc-on'), 230);
  }

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      obs.disconnect();
      show();
    }
  }, { threshold: 0.15 });
  obs.observe(container);

  // Fallback — if already visible or scrolled past
  setTimeout(() => {
    const r = container.getBoundingClientRect();
    if (r.top < window.innerHeight) show();
  }, 500);

  // 3D tilt — only adjusts rotateX/Y, never opacity or translateX
  [c0, c1].forEach(card => {
    let tiltActive = false;
    card.addEventListener('mouseenter', () => { tiltActive = true; });
    card.addEventListener('mouseleave', () => {
      tiltActive = false;
      card.style.transform = '';  // clear tilt, CSS .wc-on translateX(0) takes over
      card.style.transition = 'transform .7s cubic-bezier(.16,1,.3,1), opacity .9s, box-shadow .4s';
    });
    card.addEventListener('mousemove', e => {
      if (!tiltActive || !card.classList.contains('wc-on')) return;
      const r = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width/2) / (r.width/2);
      const dy = (e.clientY - r.top - r.height/2) / (r.height/2);
      card.style.transition = 'transform .1s linear, box-shadow .3s';
      card.style.transform = `translateX(0) translateY(-7px) rotateY(${dx*8}deg) rotateX(${-dy*7}deg) scale(1.012)`;
    });
  });
}

/* ════════════════════════════════
   SECTION GHOST NUMBERS
════════════════════════════════ */
function initSectionGhosts() {
  const sections = document.querySelectorAll('.section');
  ['01','02','03','04','05'].forEach((num, i) => {
    if (!sections[i]) return;
    sections[i].style.position = 'relative';
    const ghost = document.createElement('div');
    ghost.className = 's-ghost';
    ghost.textContent = num;
    sections[i].appendChild(ghost);
    gsap.to(ghost, {
      yPercent: -25, ease: 'none',
      scrollTrigger: { trigger: sections[i], start: 'top bottom', end: 'bottom top', scrub: 2 }
    });
  });
}

/* ════════════════════════════════
   SKILL CARDS (GSAP is fine here — no opacity/vis issues)
════════════════════════════════ */
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
      gsap.to(el, { rotateY:(e.clientX-r.left-r.width/2)/(r.width/2)*12, rotateX:-(e.clientY-r.top-r.height/2)/(r.height/2)*12, scale:1.03, duration:.1, ease:'power1.out', transformPerspective:900 });
    });
    el.addEventListener('mouseleave', () => gsap.to(el, { rotateY:0, rotateX:0, scale:1, duration:.7, ease:'elastic.out(1,.5)', transformPerspective:900 }));
  });
}

/* ════════════════════════════════
   PROJECT ROWS
════════════════════════════════ */
function initProjRows() {
  document.querySelectorAll('[data-proj]').forEach((el, i) => {
    gsap.set(el, { opacity: 0, y: 20 });
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: .6, delay: i*.05, ease: 'power3.out' })
    });
    // thumbnail parallax
    const thumb = el.querySelector('.pthumb');
    if (thumb) gsap.to(thumb, { yPercent:-10, ease:'none', scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:1.5} });
  });
}

/* ════════════════════════════════
   EXPERIENCE ROWS
════════════════════════════════ */
function initExpRows() {
  document.querySelectorAll('[data-exp]').forEach((el, i) => {
    gsap.set(el, { opacity: 0, x: -22 });
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => gsap.to(el, { opacity: 1, x: 0, duration: .6, delay: i*.07, ease: 'power3.out' })
    });
  });
}

/* ════════════════════════════════
   MAGNETIC BUTTONS
════════════════════════════════ */
function initMagnetic() {
  document.querySelectorAll('.btn-fill,.btn-line,.nav-logo').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      gsap.to(el, { x:(e.clientX-r.left-r.width/2)*.3, y:(e.clientY-r.top-r.height/2)*.3, duration:.35, ease:'power2.out' });
    });
    el.addEventListener('mouseleave', () => gsap.to(el, { x:0, y:0, duration:.55, ease:'elastic.out(1,.5)' }));
  });
}

/* ════════════════════════════════
   CLICK SPARKS
════════════════════════════════ */
function initClickSparks() {
  const canvas = document.getElementById('sparks');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = innerWidth; canvas.height = innerHeight;
  window.addEventListener('resize', () => { canvas.width = innerWidth; canvas.height = innerHeight; });
  const COLS = ['#00aaff','#00ddff','#fff','#66ccff','#0077ff'];
  let parts = [];
  class P {
    constructor(x, y) {
      this.x=x; this.y=y;
      this.vx=(Math.random()-.5)*10; this.vy=(Math.random()-1.4)*10;
      this.a=1; this.r=Math.random()*3+1;
      this.c=COLS[Math.floor(Math.random()*COLS.length)];
    }
    step() { this.vx*=.95; this.vy+=.28; this.x+=this.vx; this.y+=this.vy; this.a-=.022; this.r*=.97; }
    draw() { ctx.globalAlpha=Math.max(0,this.a); ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fillStyle=this.c; ctx.fill(); }
  }
  document.addEventListener('click', e => {
    if (e.target.closest('a,button,input,textarea')) return;
    for (let i=0;i<22;i++) parts.push(new P(e.clientX,e.clientY));
  });
  document.addEventListener('dblclick', e => { for (let i=0;i<60;i++) parts.push(new P(e.clientX,e.clientY)); });
  (function loop() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    parts = parts.filter(p=>p.a>0);
    parts.forEach(p=>{p.step();p.draw();});
    ctx.globalAlpha=1;
    requestAnimationFrame(loop);
  })();
}

/* ════════════════════════════════
   SKILL PILL RIPPLE
════════════════════════════════ */
function initSkillRipple() {
  document.querySelectorAll('.sk-pills span').forEach(pill => {
    pill.addEventListener('click', e => {
      const r = document.createElement('span');
      const size = 60;
      Object.assign(r.style, {
        position:'absolute', borderRadius:'50%',
        width:size+'px', height:size+'px',
        background:'rgba(0,170,255,.3)',
        left:(e.offsetX-size/2)+'px', top:(e.offsetY-size/2)+'px',
        pointerEvents:'none', transform:'scale(0)', opacity:'1'
      });
      pill.appendChild(r);
      gsap.to(r, { scale:3, opacity:0, duration:.5, ease:'power2.out', onComplete:()=>r.remove() });
    });
  });
}

/* ════════════════════════════════
   CONTACT FORM
════════════════════════════════ */
function initForm() {
  const form = document.querySelector('.c-form');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button');
    btn.textContent = 'Sending…';
    try {
      const res = await fetch('https://formspree.io/f/mdkwwowb', { method:'POST', body:new FormData(form), headers:{Accept:'application/json'} });
      toast(res.ok ? '✅ Sent! Talk soon.' : '⚠️ Failed. Email me directly.');
      if (res.ok) form.reset();
    } catch { toast('⚠️ Network error.'); }
    finally { btn.innerHTML = 'Send It <i class="fas fa-paper-plane"></i>'; }
  });
}

function toast(msg) {
  const t = document.createElement('div');
  t.innerHTML = msg;
  Object.assign(t.style, { position:'fixed', bottom:'2rem', right:'2rem', background:'rgba(6,9,14,.97)', border:'1px solid rgba(0,170,255,.4)', color:'#00aaff', fontFamily:'Share Tech Mono,monospace', fontSize:'.82rem', padding:'.85rem 1.4rem', borderRadius:'5px', zIndex:'99999', backdropFilter:'blur(14px)', boxShadow:'0 8px 30px rgba(0,170,255,.2)' });
  document.body.appendChild(t);
  gsap.fromTo(t, { opacity:0,y:16 }, { opacity:1,y:0,duration:.35,ease:'power2.out' });
  setTimeout(() => gsap.to(t, { opacity:0,y:16,duration:.35,onComplete:()=>t.remove() }), 3800);
}