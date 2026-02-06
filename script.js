// Confetti burst synced to the headline moment (one-time, no loop)
(() => {
    const canvas = document.getElementById("confetti-canvas");
    if (!canvas) return;
  
    const ctx = canvas.getContext("2d");
  
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();
  
    const rand = (min, max) => Math.random() * (max - min) + min;
  
    function getOrigin() {
      // Try to burst from the "CRICKET COACH" line if present (main page)
      const target = document.querySelector(".reveal-3") || document.querySelector(".hero-title");
      if (!target) {
        return { x: window.innerWidth / 2, y: window.innerHeight * 0.22 };
      }
  
      const r = target.getBoundingClientRect();
      return {
        x: r.left + r.width / 2,
        y: r.top + Math.min(40, r.height * 0.6),
      };
    }
  
    function burstOnce() {
      const { x: originX, y: originY } = getOrigin();
  
      const pieces = [];
      const COLORS = ["#ff4d6d", "#ffd166", "#06d6a0", "#118ab2", "#9b5de5", "#f15bb5"];
  
      const COUNT = 220;           // density
      const GRAVITY = 0.12;
      const AIR = 0.995;
      const END_AFTER_MS = 1600;   // burst duration
  
      for (let i = 0; i < COUNT; i++) {
        // burst in all directions, slightly upward bias
        const angle = rand(-Math.PI, 0); // upward half
        const spread = rand(-0.7, 0.7);  // widen
        const a = angle + spread;
        const speed = rand(4, 12);
  
        pieces.push({
          x: originX + rand(-50, 50),
          y: originY + rand(-10, 10),
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed,
          size: rand(4, 9),
          rot: rand(0, Math.PI * 2),
          vr: rand(-0.22, 0.22),
          color: COLORS[Math.floor(rand(0, COLORS.length))],
          shape: Math.random() < 0.35 ? "circle" : "rect",
          life: rand(55, 105),
        });
      }
  
      const start = performance.now();
  
      function draw(now) {
        const elapsed = now - start;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
  
        for (const p of pieces) {
          p.vx *= AIR;
          p.vy = p.vy * AIR + GRAVITY;
          p.x += p.vx;
          p.y += p.vy;
          p.rot += p.vr;
          p.life -= 1;
  
          if (p.life <= 0) continue;
  
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
  
          if (p.shape === "circle") {
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.55, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
          }
          ctx.restore();
        }
  
        if (elapsed < END_AFTER_MS) {
          requestAnimationFrame(draw);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
  
      requestAnimationFrame(draw);
    }
  
    // Sync timing:
    // reveal-3 starts at 800ms in your CSS. We fire just after that for impact.
    const SYNC_MS = 860;
  
    // Only fire once, after load
    window.addEventListener("load", () => {
      setTimeout(burstOnce, SYNC_MS);
    });
  })();
  