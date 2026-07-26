// ---------- garland renderer ----------
function buildGarland(containerId, count){
  const el = document.getElementById(containerId);
  if(!el) return;
  const w = 1200, h = 64;
  const colors = ['#f6b8d0','#eec16b','#d9648b','#fbf1e6'];
  let bulbs = '';
  let path = `M0,20 `;
  const n = count || 22;
  for(let i=0;i<=n;i++){
    const x = (w/n)*i;
    const y = 20 + Math.sin(i*0.9)*14 + 10;
    path += `${i===0?'M':'S'}${x-30},${y+30} ${x},${y} `;
  }
  for(let i=0;i<n;i++){
    const x = (w/n)*i + (w/n)/2;
    const y = 20 + Math.sin((i+0.5)*0.9)*14 + 22;
    const c = colors[i % colors.length];
    bulbs += `<circle class="bulb" cx="${x}" cy="${y}" r="5" fill="${c}" style="color:${c}"/>`;
  }
  el.innerHTML = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <path d="${path}" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="1.5"/>
    ${bulbs}
  </svg>`;
}

// ---------- nav active link ----------
function markActiveNav(){
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.topnav a').forEach(a=>{
    if(a.getAttribute('href') === here) a.classList.add('active');
  });
}

// ---------- confetti burst ----------
function confettiBurst(x, y, amount){
  const colors = ['#f6b8d0','#eec16b','#d9648b','#fbf1e6','#c9a7ff'];
  const n = amount || 60;
  for(let i=0;i<n;i++){
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    const size = 6 + Math.random()*7;
    p.style.width = size+'px';
    p.style.height = (size*0.4 + 4)+'px';
    p.style.background = colors[Math.floor(Math.random()*colors.length)];
    p.style.left = (x!==undefined ? x : Math.random()*window.innerWidth) + 'px';
    p.style.top = (y!==undefined ? y : -20) + 'px';
    const duration = 2.4 + Math.random()*1.8;
    const drift = (Math.random()-0.5)*300;
    p.style.animationDuration = duration+'s';
    p.style.setProperty('transform', `translateX(${drift}px)`);
    p.style.left = (parseFloat(p.style.left) ) + 'px';
    document.body.appendChild(p);
    // horizontal drift via keyframe override using WAAPI for simplicity
    p.animate([
      { transform:`translate(0,0) rotate(0deg)`, opacity:1 },
      { transform:`translate(${drift}px, 110vh) rotate(${360+Math.random()*360}deg)`, opacity:.9 }
    ], { duration: duration*1000, easing:'ease-in' });
    setTimeout(()=>p.remove(), duration*1000+100);
  }
}

// ---------- gentle floating balloons (ambient) ----------
function spawnBalloons(colors){
  const cols = colors || ['#d9648b','#eec16b','#f6b8d0','#7c5ea6'];
  setInterval(()=>{
    const b = document.createElement('div');
    b.className = 'balloon';
    b.style.left = Math.random()*94+'%';
    b.style.background = cols[Math.floor(Math.random()*cols.length)];
    b.style.setProperty('--drift', (Math.random()*80-40)+'px');
    const dur = 10 + Math.random()*6;
    b.style.animationDuration = dur+'s';
    document.body.appendChild(b);
    setTimeout(()=>b.remove(), dur*1000+200);
  }, 3200);
}

// ---------- scroll reveal ----------
function initReveal(){
  const items = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold:.15 });
  items.forEach(i=>io.observe(i));
}

// ---------- countdown to the birthday ----------
function buildCountdown(targetISO, containerId){
  const el = document.getElementById(containerId);
  if(!el) return;
  const target = new Date(targetISO).getTime();

  function render(){
    const now = Date.now();
    const diff = target - now;
    if(diff <= 0){
      el.classList.add('arrived');
      el.innerHTML = `<p style="font-family:var(--font-hand); font-size:1.6rem; color:var(--gold-soft); margin:0;">🎉 ถึงวันเกิดของเธอแล้ว! 🎉</p>`;
      clearInterval(timer);
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const parts = [
      { v:d, l:'วัน' }, { v:h, l:'ชั่วโมง' }, { v:m, l:'นาที' }, { v:s, l:'วินาที' }
    ];
    if(!el.dataset.built){
      el.innerHTML = parts.map((p,i)=>`
        <div class="unit">
          <span class="num" id="cd-${i}">${String(p.v).padStart(2,'0')}</span>
          <span class="lbl">${p.l}</span>
        </div>`).join('');
      el.dataset.built = '1';
    } else {
      parts.forEach((p,i)=>{
        const numEl = document.getElementById('cd-'+i);
        const next = String(p.v).padStart(2,'0');
        if(numEl.textContent !== next){
          numEl.textContent = next;
          numEl.classList.add('tick');
          setTimeout(()=>numEl.classList.remove('tick'), 250);
        }
      });
    }
  }
  render();
  const timer = setInterval(render, 1000);
}

document.addEventListener('DOMContentLoaded', ()=>{
  buildGarland('garland-top');
  markActiveNav();
  initReveal();
});
