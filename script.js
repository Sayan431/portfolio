document.addEventListener("DOMContentLoaded", () => {

  /* ============================================================
     1. INTERACTIVE PARTICLE FIELD
     ============================================================ */
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");
  let mouse = { x: -9999, y: -9999 };
  let particles = [];
  const PARTICLE_COUNT = 110;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  const COLORS = ["129,140,248", "167,139,250", "99,102,241", "14,165,233", "52,211,153"];

  class Particle {
    constructor() { this.reset(true); }
    reset(random = false) {
      this.x  = Math.random() * canvas.width;
      this.y  = Math.random() * canvas.height;
      this.r  = Math.random() * 1.8 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.life = Math.random() * 300 + 150;
      this.age  = random ? Math.floor(Math.random() * this.life) : 0;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.age++;
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        const force = (140 - dist) / 140 * 0.6;
        this.vx -= (dx / dist) * force * 0.04;
        this.vy -= (dy / dist) * force * 0.04;
      }
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.97;
      this.vy *= 0.97;
      if (this.age > this.life) this.reset();
    }
    draw() {
      const progress = this.age / this.life;
      const alpha = Math.sin(progress * Math.PI) * 0.75;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          const alpha = (1 - dist / 90) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(129,140,248,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function particleLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(particleLoop);
  }
  particleLoop();


  /* ============================================================
     2. CURSOR GLOW
     ============================================================ */
  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);

  window.addEventListener("mousemove", e => {
    glow.style.left = e.clientX + "px";
    glow.style.top  = e.clientY + "px";
  });


  /* ============================================================
     4. TYPEWRITER EFFECT (hero subtitle)
     ============================================================ */
  const heroSub = document.getElementById("hero-sub");
  if (heroSub) {
    const text    = heroSub.dataset.text || "";
    let   index   = 0;
    const cursor  = document.createElement("span");
    cursor.className = "typewriter-cursor";
    cursor.textContent = "|";
    heroSub.appendChild(cursor);

    function type() {
      if (index < text.length) {
        cursor.before(document.createTextNode(text[index]));
        index++;
        const delay = text[index - 1] === "." || text[index - 1] === "—"
          ? 250 : Math.random() * 40 + 20;
        setTimeout(type, delay);
      }
    }
    setTimeout(type, 900); // start after hero title animation
  }


  /* ============================================================
     5. SCROLL — hue shift + page progress bar
     ============================================================ */
  const progressBar = document.createElement("div");
  progressBar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px; width: 0%;
    background: linear-gradient(90deg, #6366f1, #818cf8, #a78bfa);
    z-index: 9999; transition: width 0.1s ease-out;
    box-shadow: 0 0 8px rgba(129,140,248,0.8);
  `;
  document.body.appendChild(progressBar);

  window.addEventListener("scroll", () => {
    const scrollPx   = document.documentElement.scrollTop;
    const maxScroll   = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (maxScroll > 0) {
      const pct = scrollPx / maxScroll;
      document.documentElement.style.setProperty("--hue-shift", `${pct * 180}deg`);
      progressBar.style.width = `${pct * 100}%`;
    }
  });


  /* ============================================================
     6. ACCORDION (project log rows)
     ============================================================ */
  const heads = document.querySelectorAll(".log-row-head");
  heads.forEach(head => {
    head.addEventListener("click", () => {
      const isOpen = head.getAttribute("aria-expanded") === "true";
      heads.forEach(h => h.setAttribute("aria-expanded", "false"));
      head.setAttribute("aria-expanded", isOpen ? "false" : "true");
    });
  });


  /* ============================================================
     7. SCROLL REVEAL
     ============================================================ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      } else {
        entry.target.classList.remove("active");
      }
    });
  }, { root: null, rootMargin: "0px", threshold: 0.15 });

  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));
});
