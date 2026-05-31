/* ─── Portfolio App — data.json driven ─── */

const DATA_URL = `./data.json?v=${Date.now()}`;

// ─── Space Background ─────────────────────────────────────────────────────
function initCanvas() {
  const canvas = document.getElementById('grid-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, stars = [], meteors = [], rocks = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildStars();
    buildRocks();
  }

  function buildStars() {
    stars = [];
    const count = Math.floor((W * H) / 3500);
    for (let i = 0; i < count; i++) {
      stars.push({
        x:             Math.random() * W,
        y:             Math.random() * H,
        r:             Math.random() * 1.8 + 0.3,
        alpha:         Math.random() * 0.55 + 0.25,
        twinkleSpeed:  Math.random() * 0.015 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }
  }

  function makeRockVerts(sides, r) {
    const verts = [];
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2;
      const jitter = r * (0.6 + Math.random() * 0.4);
      verts.push({ x: Math.cos(angle) * jitter, y: Math.sin(angle) * jitter });
    }
    return verts;
  }

  function buildRocks() {
    rocks = [];
    const count = Math.floor(W / 280);
    for (let i = 0; i < count; i++) {
      const r = Math.random() * 10 + 5;
      rocks.push({
        x:      Math.random() * W,
        y:      Math.random() * H,
        r,
        vx:     (Math.random() - 0.5) * 0.18,
        vy:     (Math.random() - 0.5) * 0.12,
        rot:    Math.random() * Math.PI * 2,
        rotV:   (Math.random() - 0.5) * 0.004,
        alpha:  Math.random() * 0.12 + 0.05,
        verts:  makeRockVerts(Math.floor(Math.random() * 4) + 6, r),
      });
    }
  }

  function spawnMeteor() {
    const startX = Math.random() * W * 1.5;
    meteors.push({
      x:     startX,
      y:     -10,
      vx:    -(Math.random() * 3 + 2.5),
      vy:    Math.random() * 3 + 2.5,
      len:   Math.random() * 120 + 80,
      alpha: 0.9,
      fade:  Math.random() * 0.010 + 0.006,
    });
  }

  setInterval(() => { if (Math.random() < 0.7) spawnMeteor(); }, 2000);

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.016;

    // Stars
    stars.forEach(s => {
      const twinkle = Math.sin(t * s.twinkleSpeed * 60 + s.twinkleOffset);
      const a = s.alpha + twinkle * 0.12;
      const r = s.r + twinkle * 0.15;
      ctx.beginPath();
      ctx.arc(s.x, s.y, Math.max(0.2, r), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(210,230,255,${Math.max(0.08, a)})`;
      ctx.fill();
    });

    // Rocks
    rocks.forEach(rock => {
      rock.x   += rock.vx;
      rock.y   += rock.vy;
      rock.rot += rock.rotV;
      if (rock.x < -rock.r * 2) rock.x = W + rock.r;
      if (rock.x > W + rock.r * 2) rock.x = -rock.r;
      if (rock.y < -rock.r * 2) rock.y = H + rock.r;
      if (rock.y > H + rock.r * 2) rock.y = -rock.r;

      ctx.save();
      ctx.translate(rock.x, rock.y);
      ctx.rotate(rock.rot);
      ctx.beginPath();
      rock.verts.forEach((v, i) => i === 0 ? ctx.moveTo(v.x, v.y) : ctx.lineTo(v.x, v.y));
      ctx.closePath();
      ctx.strokeStyle = `rgba(160,180,210,${rock.alpha})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.restore();
    });

    // Meteors
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      const angle = Math.atan2(m.vy, m.vx);
      const tailX = m.x - Math.cos(angle) * m.len;
      const tailY = m.y - Math.sin(angle) * m.len;
      const grad  = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
      grad.addColorStop(0, `rgba(180,220,255,0)`);
      grad.addColorStop(1, `rgba(180,220,255,${m.alpha})`);
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(m.x, m.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      m.x += m.vx;
      m.y += m.vy;
      m.alpha -= m.fade;
      if (m.alpha <= 0 || m.y > H + 50) meteors.splice(i, 1);
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

// ─── Scroll Reveal ────────────────────────────────────────────────────────
function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        const el = e.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => el.classList.add('visible'), delay);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach((el, i) => {
    io.observe(el);
  });
}

// ─── Theme toggle ─────────────────────────────────────────────────────────
function initTheme() {
  const btn  = document.getElementById('theme-toggle');
  const icon = btn.querySelector('.theme-icon');
  const root = document.documentElement;

  const saved = localStorage.getItem('theme') || 'dark';
  root.setAttribute('data-theme', saved);
  icon.textContent = saved === 'light' ? '☽' : '☀';

  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    icon.textContent = next === 'light' ? '☽' : '☀';
  });
}

// ─── Navbar scroll effect ─────────────────────────────────────────────────
function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    nav.style.background = window.scrollY > 40
      ? (isLight ? 'rgba(240,244,248,0.99)' : 'rgba(8,11,18,0.99)')
      : (isLight ? 'rgba(240,244,248,0.96)' : 'rgba(8,11,18,0.96)');
  }, { passive: true });

  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('mobile-menu');
  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
  document.querySelectorAll('.mobile-link').forEach(a => {
    a.addEventListener('click', () => menu.classList.remove('open'));
  });
}

// ─── Active nav link on scroll ────────────────────────────────────────────
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => io.observe(s));
}

// ─── Hero code block typewriter ───────────────────────────────────────────
function buildHeroCode(data) {
  const p = data.personal;
  const firstName  = p.name.split(' ')[1] || p.name.split(' ')[0];
  const domainList = (p.domains || [])
    .map(d => `<span class="str">"${d.split(' ')[0]}"</span>`)
    .join('<span class="punct">, </span>');
  const lines = [
    `<span class="key">from</span> dataclasses <span class="key">import</span> dataclass`,
    ``,
    `<span class="key">@dataclass</span>`,
    `<span class="key">class</span> <span class="str">Engineer</span><span class="punct">:</span>`,
    `    name<span class="punct">:</span>     <span class="key">str</span>   <span class="punct">=</span> <span class="str">"${firstName}"</span>`,
    `    location<span class="punct">:</span> <span class="key">str</span>   <span class="punct">=</span> <span class="str">"${p.location}"</span>`,
    `    gpa<span class="punct">:</span>      <span class="key">float</span> <span class="punct">=</span> <span class="num">${p.gpa}</span>`,
    `    domains<span class="punct">:</span>  <span class="key">list</span>  <span class="punct">= [</span>${domainList}<span class="punct">]</span>`,
    `    open_to<span class="punct">:</span>  <span class="key">bool</span>  <span class="punct">=</span> <span class="num">${p.openToWork ? 'True' : 'False'}</span>`,
  ];

  const el = document.getElementById('hero-code');
  if (!el) return;
  el.innerHTML = '';
  let i = 0;
  function typeLine() {
    if (i >= lines.length) return;
    el.innerHTML += lines[i] + '\n';
    i++;
    setTimeout(typeLine, 90);
  }
  setTimeout(typeLine, 500);
}

// ─── Render: Hero ─────────────────────────────────────────────────────────
function renderHero(data) {
  const p = data.personal;
  document.title = p.name;
  document.getElementById('nav-name').textContent    = p.shortName;
  document.getElementById('hero-name').textContent   = p.name;
  document.getElementById('hero-title').textContent  = p.title;
  document.getElementById('hero-tagline').textContent= p.tagline;

  const domainsEl = document.getElementById('hero-domains');
  if (domainsEl && p.domains) {
    const icons = { 'Software Engineering': '⌨', 'AI Engineering': '◈', 'Data Engineering': '⬡' };
    domainsEl.innerHTML = p.domains.map(d =>
      `<span class="domain-badge"><span class="domain-icon">${icons[d] || '◆'}</span>${d}</span>`
    ).join('');
  }

  const social = document.getElementById('hero-social');
  const links = [
    { href: p.github,   icon: '⌥', label: 'GitHub'   },
    { href: p.linkedin, icon: 'in', label: 'LinkedIn' },
    { href: `mailto:${p.email}`, icon: '✉', label: 'Email' },
  ];
  links.forEach(l => {
    if (!l.href) return;
    const a = document.createElement('a');
    a.href = l.href;
    a.title = l.label;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">${getSVG(l.label)}</svg>`;
    social.appendChild(a);
  });

  buildHeroCode(data);
}

// ─── Render: About ────────────────────────────────────────────────────────
function renderAbout(data) {
  document.getElementById('about-text').textContent = data.about;

  const resumeLink = document.getElementById('resume-link');
  if (data.personal.resumePdf) {
    resumeLink.href = data.personal.resumePdf;
    resumeLink.style.display = 'inline-flex';
  }

  const statsEl = document.getElementById('about-stats');
  const stats = [
    { value: data.personal.gpa, label: 'Masters GPA' },
    { value: `${data.experience.length}+`, label: 'Roles' },
    { value: `${data.projects.length}+`, label: 'Projects' },
    { value: `${data.certifications.length}+`, label: 'Certs' },
  ];
  stats.forEach((s, i) => {
    const card = document.createElement('div');
    card.className = 'stat-card reveal';
    card.dataset.delay = i * 80;
    card.innerHTML = `<div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div>`;
    statsEl.appendChild(card);
  });
}

// ─── Render: Skills ───────────────────────────────────────────────────────
function renderSkills(data) {
  const container = document.getElementById('skills-container');
  Object.entries(data.skills).forEach(([cat, items], ci) => {
    const div = document.createElement('div');
    div.className = 'skill-category reveal';
    div.dataset.delay = ci * 100;
    div.innerHTML = `
      <div class="skill-cat-title">${cat}</div>
      <div class="skill-tags">
        ${items.map(t => `<span class="skill-tag">${t}</span>`).join('')}
      </div>`;
    container.appendChild(div);
  });
}

// ─── Render: Experience ───────────────────────────────────────────────────
function renderExperience(data) {
  const container = document.getElementById('experience-container');
  data.experience.forEach((job, i) => {
    const item = document.createElement('div');
    item.className = 'timeline-item reveal';
    item.dataset.delay = i * 120;
    item.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-card">
        <div class="timeline-header">
          <span class="timeline-role">${job.role}</span>
          <span class="timeline-period">${job.period}</span>
        </div>
        <div class="timeline-meta">${job.company} · ${job.location} · ${job.type}</div>
        <ul class="timeline-bullets">
          ${job.bullets.map(b => `<li>${b}</li>`).join('')}
        </ul>
        <div class="tags">
          ${job.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>`;
    container.appendChild(item);
  });
}

// ─── Render: Projects ─────────────────────────────────────────────────────
function renderProjects(data) {
  const container = document.getElementById('projects-container');
  data.projects.forEach((proj, i) => {
    const card = document.createElement('div');
    card.className = 'project-card reveal';
    card.dataset.delay = i * 100;

    const ghLink      = proj.github ? `<a href="${proj.github}" target="_blank" rel="noopener" title="GitHub">↗</a>` : '';
    const demoLink    = proj.demo   ? `<a href="${proj.demo}"   target="_blank" rel="noopener" title="Live Demo">⬡</a>` : '';
    const domainBadge = proj.domain ? `<span class="project-domain">${proj.domain}</span>` : '';
    const statusBadge = proj.status ? `<span class="project-status">${proj.status}</span>` : '';
    const imageHTML   = proj.image  ? `<img class="project-img" src="${proj.image}" alt="${proj.title} screenshot" loading="lazy" />` : '';
    const bulletsHTML = proj.bullets && proj.bullets.length
      ? `<ul class="project-bullets">${proj.bullets.map(b => `<li>${b}</li>`).join('')}</ul>`
      : '';

    card.innerHTML = `
      ${imageHTML}
      <div class="project-body">
        <div class="project-top">
          <div class="project-badges">${domainBadge}${statusBadge}</div>
          <div class="project-links">${ghLink}${demoLink}</div>
        </div>
        <div class="project-title">${proj.title}</div>
        <div class="project-desc">${proj.description}</div>
        ${bulletsHTML}
        <div class="project-tags">
          ${proj.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
        </div>
      </div>`;
    container.appendChild(card);
  });
}

// ─── Render: Education ────────────────────────────────────────────────────
function renderEducation(data) {
  const container = document.getElementById('education-container');
  data.education.forEach((edu, i) => {
    const card = document.createElement('div');
    card.className = 'edu-card reveal';
    card.dataset.delay = i * 120;

    const specBadge = edu.specialization
      ? `<span style="color:var(--purple);font-size:0.78rem;">Spec: ${edu.specialization}</span>`
      : '';
    const minorBadge = edu.minor
      ? `<span style="color:var(--text-dim);font-size:0.78rem;">Minor: ${edu.minor}</span>`
      : '';
    const coursesHTML = edu.courses && edu.courses.length
      ? `<div class="edu-courses-label">Coursework</div>
         <div class="edu-courses">
           ${edu.courses.map(c => `<span class="edu-course">${c}</span>`).join('')}
         </div>`
      : '';

    card.innerHTML = `
      <div class="edu-school">${edu.school}</div>
      <div class="edu-degree">${edu.degree}</div>
      <div class="edu-meta">
        <span>${edu.location}</span>
        <span>${edu.period}</span>
        ${specBadge}${minorBadge}
      </div>
      <div class="edu-gpa">GPA ${edu.gpa}</div>
      ${coursesHTML}`;
    container.appendChild(card);
  });
}

// ─── Render: Certifications ───────────────────────────────────────────────
function renderCerts(data) {
  const container = document.getElementById('certs-container');
  data.certifications.forEach((cert, i) => {
    const el = document.createElement(cert.url ? 'a' : 'div');
    el.className = 'cert-card reveal';
    el.dataset.delay = i * 70;
    if (cert.url) {
      el.href = cert.url;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    }
    el.innerHTML = `
      <div class="cert-name">${cert.name}</div>
      <div class="cert-issuer">${cert.issuer}</div>
      <div class="cert-year">${cert.year}</div>`;
    container.appendChild(el);
  });
}

// ─── Render: Contact ──────────────────────────────────────────────────────
function renderContact(data) {
  const p = data.personal;
  const container = document.getElementById('contact-links');
  if (!container) return;
  const links = [
    p.email    && { href: `mailto:${p.email}`, icon: '✉', label: p.email },
    p.linkedin && { href: p.linkedin,          icon: 'in', label: 'LinkedIn' },
    p.github   && { href: p.github,            icon: '⌥', label: 'GitHub'   },
    p.phone    && { href: `tel:${p.phone}`,    icon: '☏', label: p.phone    },
  ].filter(Boolean);

  links.forEach(l => {
    const a = document.createElement('a');
    a.className = 'contact-link';
    a.href = l.href;
    if (!l.href.startsWith('mailto') && !l.href.startsWith('tel')) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    a.innerHTML = `<span class="icon">${l.icon}</span><span>${l.label}</span>`;
    container.appendChild(a);
  });
}

// ─── Render: Footer ───────────────────────────────────────────────────────
function renderFooter(data) {
  const el = document.getElementById('footer-text');
  if (!el) return;
  el.textContent = `Built by ${data.personal.name}`;
}

// ─── SVG icons (inline, no external dep) ────────────────────────────────
function getSVG(label) {
  const icons = {
    GitHub:   `<path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>`,
    LinkedIn: `<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>`,
    Email:    `<path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>`,
  };
  return icons[label] || '';
}

// ─── Main ─────────────────────────────────────────────────────────────────
async function main() {
  initCanvas();
  initTheme();
  initNavbar();

  try {
    const res  = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    renderHero(data);
    renderAbout(data);
    renderSkills(data);
    renderExperience(data);
    renderProjects(data);
    renderEducation(data);
    renderCerts(data);
    renderContact(data);
    renderFooter(data);

    // Kick off reveal observer after DOM is populated
    setTimeout(() => {
      initReveal();
      initActiveNav();
    }, 50);

  } catch (err) {
    console.error('Failed to load data.json:', err);
    document.getElementById('hero-name').textContent = 'Portfolio';
    document.getElementById('hero-title').textContent = 'data.json not found — check the console';
  }
}

document.addEventListener('DOMContentLoaded', main);
