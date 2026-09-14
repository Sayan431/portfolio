document.addEventListener("DOMContentLoaded", () => {

  /* ============================================================
     0. WORD CYCLE — hero big word rotator
     ============================================================ */
  const wordCycle = document.getElementById("hero-word-cycle");
  if (wordCycle) {
    const words = wordCycle.querySelectorAll(".word");
    let current = 0;
    setInterval(() => {
      const prev = current;
      current = (current + 1) % words.length;
      words[prev].classList.remove("active");
      words[prev].classList.add("exit");
      setTimeout(() => words[prev].classList.remove("exit"), 500);
      words[current].classList.add("active");
    }, 2200);
  }

  /* ============================================================
     0b. NEURAL NETWORK — hero right visualization
     ============================================================ */
  const nc = document.getElementById("neural-canvas");
  if (nc) {
    const nctx = nc.getContext("2d");

    function resizeNC() {
      nc.width  = nc.offsetWidth;
      nc.height = nc.offsetHeight;
    }
    resizeNC();
    window.addEventListener("resize", resizeNC);

    // Node definitions (positions as 0-1 fractions of canvas size)
    const NODES = [
      // Input layer (backend)
      { x: 0.12, y: 0.18, label: "PY",  color: "#3776AB", r: 20 },
      { x: 0.12, y: 0.50, label: "DB",  color: "#336791", r: 20 },
      { x: 0.12, y: 0.82, label: "API", color: "#009688", r: 20 },
      // Hidden layer (AI/core)
      { x: 0.44, y: 0.12, label: "AI",  color: "#818cf8", r: 22 },
      { x: 0.44, y: 0.38, label: "LLM", color: "#a78bfa", r: 26 }, // main node
      { x: 0.44, y: 0.65, label: "VEC", color: "#4dd9e0", r: 20 },
      { x: 0.44, y: 0.88, label: "RQ",  color: "#f59e0b", r: 18 },
      // Output layer (frontend)
      { x: 0.80, y: 0.22, label: "RE",  color: "#61DAFB", r: 20 },
      { x: 0.80, y: 0.50, label: "UI",  color: "#f1f5f9", r: 20 },
      { x: 0.80, y: 0.78, label: "CDN", color: "#f59e0b", r: 18 },
    ];

    const EDGES = [
      [0,3],[0,4],[1,4],[1,5],[2,5],[2,6],
      [3,4],[4,5],[5,6],
      [3,7],[4,7],[4,8],[5,8],[5,9],[6,9],
    ];

    // Data packets flowing along edges
    const packets = [];
    EDGES.forEach(([a, b]) => {
      const count = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < count; i++) {
        packets.push({
          a, b,
          t: Math.random(),
          speed: 0.0025 + Math.random() * 0.003,
          color: NODES[b].color,
          size: 2.5 + Math.random() * 1.5,
        });
      }
    });

    let mouseNX = -1, mouseNY = -1;
    nc.addEventListener("mousemove", e => {
      const rect = nc.getBoundingClientRect();
      mouseNX = (e.clientX - rect.left) / rect.width;
      mouseNY = (e.clientY - rect.top)  / rect.height;
    });
    nc.addEventListener("mouseleave", () => { mouseNX = -1; mouseNY = -1; });

    function drawNeural(ts) {
      const W = nc.width, H = nc.height;
      nctx.clearRect(0, 0, W, H);

      // Background subtle radial gradient
      const bg = nctx.createRadialGradient(W*0.5,H*0.5,0, W*0.5,H*0.5,W*0.6);
      bg.addColorStop(0, "rgba(30,25,60,0.4)");
      bg.addColorStop(1, "rgba(8,12,28,0.0)");
      nctx.fillStyle = bg;
      nctx.fillRect(0, 0, W, H);

      // Draw edges
      EDGES.forEach(([a, b]) => {
        const na = NODES[a], nb = NODES[b];
        const x1 = na.x*W, y1 = na.y*H;
        const x2 = nb.x*W, y2 = nb.y*H;
        const grad = nctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, na.color + "30");
        grad.addColorStop(1, nb.color + "50");
        nctx.beginPath();
        nctx.moveTo(x1, y1);
        nctx.lineTo(x2, y2);
        nctx.strokeStyle = grad;
        nctx.lineWidth = 1;
        nctx.stroke();
      });

      // Animate packets
      packets.forEach(p => {
        p.t += p.speed;
        if (p.t > 1) p.t = 0;
        const na = NODES[p.a], nb = NODES[p.b];
        const x = (na.x + (nb.x - na.x) * p.t) * W;
        const y = (na.y + (nb.y - na.y) * p.t) * H;
        nctx.beginPath();
        nctx.arc(x, y, p.size, 0, Math.PI * 2);
        nctx.fillStyle = p.color;
        nctx.shadowBlur = 10;
        nctx.shadowColor = p.color;
        nctx.fill();
        nctx.shadowBlur = 0;
      });

      // Draw nodes
      const t = ts * 0.001;
      NODES.forEach((node, i) => {
        const nx = node.x * W, ny = node.y * H;
        const dist = Math.hypot(mouseNX - node.x, mouseNY - node.y);
        const hover = dist < 0.12;
        const pulse = 1 + Math.sin(t * 1.4 + i * 0.9) * 0.08;
        const r = node.r * pulse * (hover ? 1.25 : 1);

        // Outer glow
        const g = nctx.createRadialGradient(nx, ny, 0, nx, ny, r * 2.8);
        g.addColorStop(0, node.color + (hover ? "55" : "33"));
        g.addColorStop(1, "transparent");
        nctx.beginPath();
        nctx.arc(nx, ny, r * 2.8, 0, Math.PI * 2);
        nctx.fillStyle = g;
        nctx.fill();

        // Node circle
        nctx.beginPath();
        nctx.arc(nx, ny, r, 0, Math.PI * 2);
        nctx.fillStyle = "rgba(8,12,28,0.92)";
        nctx.fill();
        nctx.strokeStyle = node.color + (hover ? "ee" : "88");
        nctx.lineWidth = hover ? 2 : 1.2;
        nctx.shadowBlur = hover ? 16 : 6;
        nctx.shadowColor = node.color;
        nctx.stroke();
        nctx.shadowBlur = 0;

        // Label
        nctx.fillStyle = hover ? "#ffffff" : node.color;
        nctx.font = `bold ${Math.floor(r * 0.52)}px 'Inter', monospace`;
        nctx.textAlign = "center";
        nctx.textBaseline = "middle";
        nctx.fillText(node.label, nx, ny);
      });

      requestAnimationFrame(drawNeural);
    }
    requestAnimationFrame(drawNeural);
  }

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
