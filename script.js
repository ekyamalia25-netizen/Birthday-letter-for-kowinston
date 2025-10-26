const scene = document.getElementById('scene');
const openBtn = document.getElementById('openBtn');
const letterArea = document.getElementById('letterArea');
const closeBtn = document.getElementById('closeBtn');
const confettiCanvas = document.getElementById('confetti');
const ctx = confettiCanvas.getContext('2d');

function resizeCanvas(){
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

openBtn.addEventListener('click', () => {
  scene.classList.add('open');

  // Delay reveal so the flap animation feels natural
  setTimeout(() => {
    letterArea.classList.add('show');
    openBtn.setAttribute('aria-expanded', 'true');
    burstConfetti();
  }, 600);
});

closeBtn.addEventListener('click', () => {
  letterArea.classList.remove('show');
  openBtn.setAttribute('aria-expanded', 'false');
});

/* --- Tiny confetti engine --- */
const confetti = [];
const COLORS = ['#ffb3cc','#ffd1e0','#ffc2d6','#ffe0eb','#ffffff'];

function makePiece(){
  const size = Math.random()*6 + 4;
  return {
    x: Math.random()*confettiCanvas.width,
    y: -10,
    vx: (Math.random() - 0.5) * 2,
    vy: Math.random()*2 + 2,
    rot: Math.random()*360,
    vr: (Math.random() - 0.5) * 6,
    w: size,
    h: size*0.6,
    color: COLORS[Math.floor(Math.random()*COLORS.length)],
    life: 0,
    maxLife: 220 + Math.random()*120
  };
}

function burstConfetti(){
  // create a burst
  for(let i=0;i<170;i++){
    confetti.push(makePiece());
  }
  animate();
}

let animating = false;
function animate(){
  if(animating) return;
  animating = true;

  const step = () => {
    ctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
    for(let i=confetti.length-1; i>=0; i--){
      const p = confetti[i];
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.02; // gravity
      p.rot += p.vr;

      // draw rectangle piece
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI/180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();

      // remove when off screen or too old
      if(p.y > confettiCanvas.height + 20 || p.life > p.maxLife){
        confetti.splice(i,1);
      }
    }

    if(confetti.length > 0){
      requestAnimationFrame(step);
    }else{
      animating = false;
    }
  };

  requestAnimationFrame(step);
}
