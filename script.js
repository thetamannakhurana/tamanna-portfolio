/* ═══════════════════════════════════════════
   TAMANNA KHURANA — Portfolio JS
   Who-cards slide from right · All reveals
   ═══════════════════════════════════════════ */
gsap.registerPlugin(ScrollTrigger);

// ── LOADER ──────────────────────────────────
const lf=document.getElementById('lf'), lp=document.getElementById('lp');
let pct=0;
const lt=setInterval(()=>{
  pct=Math.min(pct+Math.random()*14,99);
  if(lf) lf.style.width=pct+'%';
  if(lp) lp.textContent=Math.floor(pct)+'%';
},90);
window.addEventListener('load',()=>{
  clearInterval(lt);
  if(lf) lf.style.width='100%';
  if(lp) lp.textContent='100%';
  setTimeout(()=>{
    gsap.to('#loader',{yPercent:-100,duration:.8,ease:'power3.inOut',
      onComplete:()=>{ document.getElementById('loader').style.display='none'; boot(); }
    });
  },350);
});

function boot(){
  initCursor();
  initNav();
  initGlobalBg();
  initCinSparks();
  initTyper();
  initCounters();
  initReveal();
  initWhoCards();   // ← THE cards
  initSkillCards();
  initProjRows();
  initExpRows();
  initTilt();
  initMagnetic();
  initSparks();
  initForm();
}

// ── CURSOR ──────────────────────────────────
function initCursor(){
  const dot=document.getElementById('cd'), ring=document.getElementById('cr');
  if(!dot) return;
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
  gsap.ticker.add(()=>{
    dot.style.left=mx+'px'; dot.style.top=my+'px';
    rx+=(mx-rx)*.12; ry+=(my-ry)*.12;
    ring.style.left=rx+'px'; ring.style.top=ry+'px';
  });
  document.querySelectorAll('a,button,.who-card,.sk-card,.proj-row,.exp-row').forEach(el=>{
    el.addEventListener('mouseenter',()=>ring.classList.add('hov'));
    el.addEventListener('mouseleave',()=>ring.classList.remove('hov'));
  });
}

// ── NAV ─────────────────────────────────────
function initNav(){
  const nav=document.getElementById('nav');
  const mb=document.getElementById('mb');
  const mo=document.getElementById('mo');
  let open=false;
  window.addEventListener('scroll',()=>nav.classList.toggle('on',scrollY>40));
  mb.addEventListener('click',()=>{
    open=!open; mb.classList.toggle('on',open); mo.classList.toggle('on',open);
    document.body.style.overflow=open?'hidden':'';
  });
  mo.querySelectorAll('.mol').forEach(a=>{
    a.addEventListener('click',e=>{
      e.preventDefault();
      const t=document.querySelector(a.getAttribute('href'));
      open=false; mb.classList.remove('on'); mo.classList.remove('on');
      document.body.style.overflow='';
      setTimeout(()=>t?.scrollIntoView({behavior:'smooth',block:'start'}),380);
    });
  });
}

// ── GLOBAL BG ───────────────────────────────
function initGlobalBg(){
  const canvas=document.getElementById('globalBg');
  if(!canvas) return;
  const ctx=canvas.getContext('2d');
  let W,H,nodes=[],frame=0,mx=-999,my=-999;
  function resize(){W=canvas.width=innerWidth;H=canvas.height=innerHeight;}
  resize(); window.addEventListener('resize',resize);
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
  for(let i=0;i<90;i++) nodes.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.28,vy:(Math.random()-.5)*.28,r:Math.random()*1.8+.35,pulse:Math.random()*Math.PI*2,glow:Math.random()>.75});
  function draw(){
    frame++;
    ctx.clearRect(0,0,W,H);
    const g1x=W/2+Math.sin(frame*.007)*W*.28, g1y=H/2+Math.cos(frame*.005)*H*.22;
    const grd1=ctx.createRadialGradient(g1x,g1y,0,g1x,g1y,W*.5);
    grd1.addColorStop(0,'rgba(0,170,255,.05)'); grd1.addColorStop(1,'transparent');
    ctx.fillStyle=grd1; ctx.fillRect(0,0,W,H);
    if(mx>0){
      const mg=ctx.createRadialGradient(mx,my,0,mx,my,260);
      mg.addColorStop(0,'rgba(0,170,255,.07)'); mg.addColorStop(1,'transparent');
      ctx.fillStyle=mg; ctx.fillRect(0,0,W,H);
    }
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y,d=Math.hypot(dx,dy);
        if(d<125){ctx.beginPath();ctx.strokeStyle=`rgba(0,170,255,${.09*(1-d/125)})`;ctx.lineWidth=.55;ctx.moveTo(nodes[i].x,nodes[i].y);ctx.lineTo(nodes[j].x,nodes[j].y);ctx.stroke();}
      }
      const md=Math.hypot(nodes[i].x-mx,nodes[i].y-my);
      if(md<200){ctx.beginPath();ctx.strokeStyle=`rgba(0,170,255,${.22*(1-md/200)})`;ctx.lineWidth=.9;ctx.moveTo(nodes[i].x,nodes[i].y);ctx.lineTo(mx,my);ctx.stroke();}
    }
    nodes.forEach(n=>{
      n.pulse+=.038;
      const pr=n.r+Math.sin(n.pulse)*.5;
      ctx.beginPath();ctx.arc(n.x,n.y,pr,0,Math.PI*2);ctx.fillStyle='rgba(0,170,255,.55)';ctx.fill();
      if(n.glow){ctx.beginPath();ctx.arc(n.x,n.y,pr+3.5,0,Math.PI*2);ctx.strokeStyle='rgba(0,170,255,.1)';ctx.lineWidth=1;ctx.stroke();}
      n.x+=n.vx;n.y+=n.vy;
      if(n.x<0||n.x>W)n.vx*=-1;
      if(n.y<0||n.y>H)n.vy*=-1;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ── CINEMATIC SPARKS ────────────────────────
function initCinSparks(){
  const c=document.getElementById('cinSparks');
  if(!c) return;
  function burst(n){
    const cols=['#00aaff','#00ddff','#fff','#ffcc00','#ff8800'];
    for(let i=0;i<n;i++){
      const sp=document.createElement('div');
      const ang=Math.random()*Math.PI*2,dist=80+Math.random()*260,size=Math.random()*4+2;
      const col=cols[Math.floor(Math.random()*cols.length)];
      Object.assign(sp.style,{position:'absolute',left:c.offsetWidth/2+'px',top:c.offsetHeight/2+'px',width:size+'px',height:size+'px',background:col,borderRadius:'50%',pointerEvents:'none',boxShadow:`0 0 ${size*3}px ${col}`});
      c.appendChild(sp);
      gsap.to(sp,{x:Math.cos(ang)*dist,y:Math.sin(ang)*dist-Math.random()*80,opacity:0,scale:.2,duration:.6+Math.random()*1,ease:'power2.out',onComplete:()=>sp.remove()});
    }
  }
  setTimeout(()=>{burst(80);setTimeout(()=>burst(40),400);setTimeout(()=>burst(25),800);},2000);
}

// ── TYPEWRITER ──────────────────────────────
function initTyper(){
  const el=document.getElementById('typer');
  if(!el) return;
  const roles=['Cybersecurity Engineer','Penetration Tester','Full-Stack Developer','Ethical Hacker','SDE @ NFSU Delhi'];
  let ri=0,ci=0,del=false,pause=0;
  function tick(){
    if(pause-->0){setTimeout(tick,55);return;}
    const cur=roles[ri];
    if(!del&&ci<=cur.length){el.textContent=cur.slice(0,ci++);setTimeout(tick,75);}
    else if(!del){del=true;pause=22;setTimeout(tick,55);}
    else if(del&&ci>0){el.textContent=cur.slice(0,--ci);setTimeout(tick,36);}
    else{del=false;ri=(ri+1)%roles.length;pause=7;setTimeout(tick,55);}
  }
  tick();
}

// ── COUNTERS ────────────────────────────────
function initCounters(){
  const els=[...document.querySelectorAll('.hv[data-to]')];
  let done=false;
  new IntersectionObserver(entries=>{
    if(!entries[0].isIntersecting||done)return;
    done=true;
    els.forEach(el=>gsap.fromTo(el,{textContent:0},{textContent:+el.dataset.to,duration:1.5,ease:'power2.out',snap:{textContent:1},onUpdate(){el.textContent=Math.round(+el.textContent);}}));
  },{threshold:.5}).observe(document.getElementById('hero'));
}

// ── GENERIC REVEAL [data-rev] ────────────────
function initReveal(){
  // data-rev: fade + slide up
  document.querySelectorAll('[data-rev]').forEach(el=>{
    const d=+(el.dataset.revD||0);
    el.style.transitionDelay=d+'s';
    new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting) el.classList.add('on');
    },{threshold:.07}).observe(el);
  });
  // data-words: Bebas word split
  document.querySelectorAll('[data-words]').forEach(el=>{
    const words=el.textContent.trim().split(/\s+/);
    el.innerHTML=words.map((w,i)=>
      `<span class="wsp"><span class="wsp-in" style="transition-delay:${i*.1}s">${w}</span></span>`
    ).join(' ');
    new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting)
        el.querySelectorAll('.wsp-in').forEach(s=>s.style.transform='translateY(0)');
    },{threshold:.15}).observe(el);
  });
}

// ══════════════════════════════════════════════
// WHO-CARDS: BOTH slide in from the RIGHT, staggered
// Exactly like Dave Holloway's services panels
// ══════════════════════════════════════════════
function initWhoCards(){
  const cards=document.querySelectorAll('.who-card');
  if(!cards.length) return;

  // Use a single observer on the container so both trigger together
  const container=document.getElementById('whoCards');
  if(!container) return;

  let fired=false;
  const obs=new IntersectionObserver(entries=>{
    if(!entries[0].isIntersecting||fired) return;
    fired=true;

    cards.forEach((card,i)=>{
      // Stagger: card 0 at 0s, card 1 at 0.2s delay
      setTimeout(()=>{
        card.classList.add('on');
      }, i*200);
    });

    obs.disconnect();
  },{threshold:.15});

  obs.observe(container);

  // 3D tilt on hover (mouse)
  cards.forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const dx=(e.clientX-r.left-r.width/2)/(r.width/2);
      const dy=(e.clientY-r.top-r.height/2)/(r.height/2);
      gsap.to(card,{rotateY:dx*8,rotateX:-dy*8,duration:.15,ease:'power1.out',transformPerspective:1000,overwrite:true});
    });
    card.addEventListener('mouseleave',()=>{
      gsap.to(card,{rotateY:0,rotateX:0,duration:.8,ease:'elastic.out(1,.4)',transformPerspective:1000});
    });
    // Touch
    card.addEventListener('touchmove',e=>{
      const t=e.touches[0],r=card.getBoundingClientRect();
      gsap.to(card,{rotateY:(t.clientX-r.left-r.width/2)/(r.width/2)*6,rotateX:-(t.clientY-r.top-r.height/2)/(r.height/2)*6,duration:.1,transformPerspective:1000});
    },{passive:true});
    card.addEventListener('touchend',()=>{
      gsap.to(card,{rotateY:0,rotateX:0,duration:.7,ease:'elastic.out(1,.4)',transformPerspective:1000});
    },{passive:true});
  });
}

// ── SKILL CARDS ─────────────────────────────
function initSkillCards(){
  document.querySelectorAll('[data-card]').forEach(el=>{
    const i=+el.dataset.card;
    gsap.set(el,{opacity:0,y:32,scale:.97});
    ScrollTrigger.create({
      trigger:el,start:'top 88%',
      onEnter:()=>gsap.to(el,{opacity:1,y:0,scale:1,duration:.7,delay:i*.09,ease:'power3.out'})
    });
  });
  // Tilt
  document.querySelectorAll('.sk-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      gsap.to(card,{rotateY:(e.clientX-r.left-r.width/2)/(r.width/2)*12,rotateX:-(e.clientY-r.top-r.height/2)/(r.height/2)*12,scale:1.03,duration:.1,ease:'power1.out',transformPerspective:900});
    });
    card.addEventListener('mouseleave',()=>gsap.to(card,{rotateY:0,rotateX:0,scale:1,duration:.7,ease:'elastic.out(1,.5)',transformPerspective:900}));
  });
}

// ── PROJECT ROWS ────────────────────────────
function initProjRows(){
  document.querySelectorAll('[data-proj]').forEach((el,i)=>{
    gsap.set(el,{opacity:0,y:22});
    ScrollTrigger.create({
      trigger:el,start:'top 90%',
      onEnter:()=>gsap.to(el,{opacity:1,y:0,duration:.65,delay:i*.05,ease:'power3.out'})
    });
  });
}

// ── EXPERIENCE ROWS ─────────────────────────
function initExpRows(){
  document.querySelectorAll('[data-exp]').forEach((el,i)=>{
    gsap.set(el,{opacity:0,x:-24});
    ScrollTrigger.create({
      trigger:el,start:'top 90%',
      onEnter:()=>gsap.to(el,{opacity:1,x:0,duration:.65,delay:i*.07,ease:'power3.out'})
    });
  });
}

// ── MAGNETIC ────────────────────────────────
function initMagnetic(){
  document.querySelectorAll('.btn-fill,.btn-line,.nav-logo').forEach(el=>{
    el.addEventListener('mousemove',e=>{
      const r=el.getBoundingClientRect();
      gsap.to(el,{x:(e.clientX-r.left-r.width/2)*.3,y:(e.clientY-r.top-r.height/2)*.3,duration:.35,ease:'power2.out'});
    });
    el.addEventListener('mouseleave',()=>gsap.to(el,{x:0,y:0,duration:.55,ease:'elastic.out(1,.5)'}));
  });
}

// ── CLICK SPARKS ────────────────────────────
function initSparks(){
  const canvas=document.getElementById('sparks');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  canvas.width=innerWidth;canvas.height=innerHeight;
  window.addEventListener('resize',()=>{canvas.width=innerWidth;canvas.height=innerHeight;});
  const COLS=['#00aaff','#00ddff','#fff','#66ccff','#0077ff'];
  let parts=[];
  class P{constructor(x,y){this.x=x;this.y=y;this.vx=(Math.random()-.5)*10;this.vy=(Math.random()-1.4)*10;this.a=1;this.r=Math.random()*3+1;this.c=COLS[Math.floor(Math.random()*COLS.length)];}step(){this.vx*=.95;this.vy+=.28;this.x+=this.vx;this.y+=this.vy;this.a-=.022;this.r*=.97;}draw(){ctx.globalAlpha=Math.max(0,this.a);ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fillStyle=this.c;ctx.fill();}}
  document.addEventListener('click',e=>{if(e.target.closest('a,button,input,textarea'))return;for(let i=0;i<22;i++)parts.push(new P(e.clientX,e.clientY));});
  document.addEventListener('dblclick',e=>{for(let i=0;i<60;i++)parts.push(new P(e.clientX,e.clientY));});
  (function loop(){ctx.clearRect(0,0,canvas.width,canvas.height);parts=parts.filter(p=>p.a>0);parts.forEach(p=>{p.step();p.draw();});ctx.globalAlpha=1;requestAnimationFrame(loop);})();
}

// ── FORM ────────────────────────────────────
function initForm(){
  const form=document.querySelector('.c-form');
  if(!form)return;
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const btn=form.querySelector('button');
    btn.textContent='Sending…';
    try{
      const res=await fetch('https://formspree.io/f/mdkwwowb',{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
      toast(res.ok?'✅ Sent! Talk soon.':'⚠️ Failed. Email me directly.');
      if(res.ok)form.reset();
    }catch{toast('⚠️ Network error.');}
    finally{btn.innerHTML='Send It <i class="fas fa-paper-plane"></i>';}
  });
}

function toast(msg){
  const t=document.createElement('div');
  t.innerHTML=msg;
  Object.assign(t.style,{position:'fixed',bottom:'2rem',right:'2rem',background:'rgba(6,9,14,.97)',border:'1px solid rgba(0,170,255,.4)',color:'#00aaff',fontFamily:'Share Tech Mono,monospace',fontSize:'.82rem',padding:'.85rem 1.4rem',borderRadius:'5px',zIndex:'99999',backdropFilter:'blur(14px)',boxShadow:'0 8px 30px rgba(0,170,255,.2)'});
  document.body.appendChild(t);
  gsap.fromTo(t,{opacity:0,y:16},{opacity:1,y:0,duration:.35,ease:'power2.out'});
  setTimeout(()=>gsap.to(t,{opacity:0,y:16,duration:.35,onComplete:()=>t.remove()}),3800);
}