(() => {
  if (document.documentElement.dataset.premiumMotionReady) return;
  document.documentElement.dataset.premiumMotionReady = 'true';

  const body = document.body;
  const isLesson = body.classList.contains('lesson-page') || /^lesson-\d+\.html$/i.test(location.pathname.split('/').pop() || '');
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const lessonKey = body.dataset.lesson || (location.pathname.match(/lesson-(\d+)/i)?.[0] || 'course');
  let activeLessonSection = null;
  let celebrationLocked = false;

  function ensureStylesheet() {
    const hasCss = [...document.styleSheets].some(sheet => String(sheet.href || '').includes('premium-motion.css'));
    if (hasCss || $('link[data-premium-motion-css]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'premium-motion.css';
    link.dataset.premiumMotionCss = 'true';
    document.head.appendChild(link);
  }
  ensureStylesheet();

  requestAnimationFrame(() => requestAnimationFrame(() => body.classList.add('premium-ready')));

  function createPageProgress() {
    if ($('#progress')) return;
    const bar = document.createElement('div');
    bar.className = 'premium-page-progress';
    bar.setAttribute('aria-hidden', 'true');
    bar.innerHTML = '<span></span>';
    document.body.prepend(bar);
    const fill = bar.firstElementChild;
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      fill.style.width = `${max > 0 ? Math.min(100, Math.max(0, scrollY / max * 100)) : 0}%`;
    };
    addEventListener('scroll', update, {passive:true});
    update();
  }
  createPageProgress();

  function setupHero() {
    const hero = $('.hero');
    if (!hero || hero.dataset.premiumHero) return;
    hero.dataset.premiumHero = 'true';
    ['one','two','three'].forEach(c => {
      const orb = document.createElement('span');
      orb.className = `premium-orb ${c}`;
      hero.appendChild(orb);
    });
    if (isLesson) {
      const viz = document.createElement('div');
      viz.className = 'premium-hero-viz';
      viz.setAttribute('aria-hidden','true');
      viz.innerHTML = `<svg viewBox="0 0 180 180"><circle class="orbit" cx="90" cy="90" r="68"/><circle class="orbit b" cx="90" cy="90" r="48"/><circle class="core" cx="90" cy="90" r="25"/><circle class="dot" cx="90" cy="22" r="4"/><circle class="dot" cx="138" cy="90" r="3.5"/><circle class="dot" cx="90" cy="138" r="3"/></svg>`;
      hero.appendChild(viz);
      if (finePointer && !reduceMotion) {
        hero.addEventListener('pointermove', e => {
          const r = hero.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - .5;
          const y = (e.clientY - r.top) / r.height - .5;
          viz.style.transform = `translateY(-50%) translate(${x * 16}px, ${y * 12}px)`;
        });
        hero.addEventListener('pointerleave', () => viz.style.transform = 'translateY(-50%)');
      }
    }
  }
  setupHero();

  function setupMotionReveal() {
    const selector = isLesson
      ? '.section-heading,.learning-goals,.concept-card,.example-card,.framework-step,.mistake-card,.decision-card,.reflection-card,.action-item,.check-item,.quiz-card,.lesson-note,.lesson-complete-panel,.completion-card,.nav-lesson,.phase-card,.lesson-card,.takeaway,.faq-item,.mindset-panel,.compare-strip'
      : '.hero-card,.milestone,.module,.lesson-row,.topic,.section-head';
    const items = $$(selector);
    items.forEach((el, i) => {
      if (el.classList.contains('motion-item')) return;
      el.classList.add('motion-item');
      const group = el.parentElement ? [...el.parentElement.children].indexOf(el) : i;
      el.style.setProperty('--motion-delay', `${Math.min(Math.max(group,0),5) * 55}ms`);
    });
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('motion-visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('motion-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:.08, rootMargin:'0px 0px -5% 0px'});
    items.forEach(el => observer.observe(el));
  }
  setupMotionReveal();

  function setupCardDepth() {
    const selector = isLesson
      ? '.concept-card,.example-card,.mistake-card,.decision-card,.reflection-card,.quiz-card,.lesson-note,.learning-goals,.lesson-complete-panel,.completion-card,.nav-lesson,.phase-card,.lesson-card,.takeaway,.faq-item'
      : '.hero-card,.module,.milestone';
    $$(selector).forEach(card => {
      card.classList.add('motion-card');
      if (!finePointer || reduceMotion) return;
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        const ry = (x - .5) * 3.2;
        const rx = (.5 - y) * 2.6;
        card.style.setProperty('--card-x', `${x * 100}%`);
        card.style.setProperty('--card-y', `${y * 100}%`);
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
      });
      card.addEventListener('pointerleave', () => card.style.transform = '');
    });
  }
  setupCardDepth();

  function setupFrameworkInteraction() {
    $$('.framework-step').forEach(step => {
      step.tabIndex = 0;
      const focus = () => {
        const parent = step.parentElement;
        if (parent) $$('.framework-step', parent).forEach(x => x.classList.remove('is-focus'));
        step.classList.add('is-focus');
      };
      step.addEventListener('click', focus);
      step.addEventListener('focus', focus);
      step.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); focus(); } });
    });
    $$('.inline-formula').forEach(flow => {
      flow.classList.add('motion-flow');
      $$('span', flow).forEach((span, i) => span.style.setProperty('--flow-i', i));
    });
  }
  setupFrameworkInteraction();

  function setupJourney() {
    if (!isLesson || $('.premium-journey-wrap')) return;
    const hero = $('.hero');
    if (!hero) return;
    const wrap = document.createElement('div');
    wrap.className = 'premium-journey-wrap';
    wrap.innerHTML = `<div class="premium-journey"><div class="premium-journey-status"><small>LESSON JOURNEY</small><strong id="premiumJourneyLabel">Learn</strong></div><div class="premium-steps"><div class="premium-step active"><i>1</i><span>Learn</span></div><div class="premium-step"><i>2</i><span>Understand</span></div><div class="premium-step"><i>3</i><span>Practice</span></div><div class="premium-step"><i>4</i><span>Apply</span></div><div class="premium-step"><i>5</i><span>Complete</span></div></div><div class="premium-time-left"><strong id="premiumTimeLeft">—</strong><small>estimated left</small></div></div>`;
    hero.insertAdjacentElement('afterend', wrap);
    const labels = ['Learn','Understand','Practice','Apply','Complete'];
    const steps = $$('.premium-step', wrap);
    const article = $('.lesson-main');
    const wordCount = article ? (article.innerText.match(/\S+/g) || []).length : 0;
    const totalMinutes = Math.max(1, Math.ceil(wordCount / 220));
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      let pct = max > 0 ? scrollY / max : 0;
      pct = Math.max(0, Math.min(1, pct));
      if ($('#completion.completed,.lesson-complete-panel.completed')) pct = 1;
      const stage = pct >= .92 ? 4 : pct >= .67 ? 3 : pct >= .43 ? 2 : pct >= .20 ? 1 : 0;
      steps.forEach((step,i) => {
        step.classList.toggle('done', i < stage);
        step.classList.toggle('active', i === stage);
      });
      const label = $('#premiumJourneyLabel');
      if (label) label.textContent = labels[stage];
      const left = $('#premiumTimeLeft');
      if (left) {
        const mins = Math.max(0, Math.ceil(totalMinutes * (1 - pct)));
        left.textContent = mins ? `~${mins} min` : 'Done';
      }
    };
    addEventListener('scroll', update, {passive:true});
    update();
  }
  setupJourney();

  function getSections() {
    return $$('.lesson-section').filter(s => s.offsetParent !== null);
  }

  function setupActiveSection() {
    if (!isLesson || !('IntersectionObserver' in window)) return;
    const sections = getSections();
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) activeLessonSection = visible.target;
    }, {rootMargin:'-25% 0px -58% 0px',threshold:[0,.15,.35]});
    sections.forEach(s => observer.observe(s));
  }
  setupActiveSection();

  function setupContinueButton() {
    if (!isLesson || $('.premium-continue')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'premium-continue';
    btn.innerHTML = '<i>↓</i><span>Continue</span>';
    document.body.appendChild(btn);
    btn.addEventListener('click', () => {
      const sections = getSections();
      let index = activeLessonSection ? sections.indexOf(activeLessonSection) : -1;
      if (index < sections.length - 1) {
        sections[Math.max(0,index + 1)].scrollIntoView({behavior:reduceMotion?'auto':'smooth',block:'start'});
        return;
      }
      const completion = $('#completion');
      if (completion && !completion.classList.contains('completed') && !completion.classList.contains('visible')) {
        completion.scrollIntoView({behavior:reduceMotion?'auto':'smooth',block:'center'});
        return;
      }
      const next = $('.nav-lesson.next[href]:not(.disabled), .course-nav a[href]');
      if (next) navigateWithTransition(next.href);
      else location.href = 'index.html';
    });
  }
  setupContinueButton();

  function setupFocusMode() {
    if (!isLesson || $('.focus-mode-btn')) return;
    const actions = $('.top-actions');
    if (!actions) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'focus-mode-btn';
    btn.title = 'Focus reading mode (F)';
    btn.setAttribute('aria-label','Toggle focus reading mode');
    btn.textContent = '◎';
    const theme = $('#themeToggle');
    actions.insertBefore(btn, theme || null);
    const toggle = () => {
      const on = body.classList.toggle('reading-focus');
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-pressed', String(on));
    };
    btn.addEventListener('click', toggle);
    document.addEventListener('keydown', e => {
      const tag = document.activeElement?.tagName;
      if (e.key.toLowerCase() === 'f' && !['INPUT','TEXTAREA','SELECT','BUTTON'].includes(tag)) toggle();
    });
  }
  setupFocusMode();

  function setupBookmarks() {
    if (!isLesson) return;
    const key = `premium-bookmarks-${lessonKey}`;
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem(key) || '[]'); } catch (_) { saved = []; }
    const sections = getSections();
    sections.forEach(section => {
      const head = $('.section-heading', section);
      if (!head || $('.section-bookmark,.bookmark-x', head)) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'section-bookmark';
      btn.setAttribute('aria-label',`Bookmark ${section.dataset.sectionTitle || section.id}`);
      btn.textContent = saved.includes(section.id) ? '★' : '☆';
      btn.classList.toggle('saved', saved.includes(section.id));
      head.appendChild(btn);
      btn.addEventListener('click', () => {
        const set = new Set(saved);
        if (set.has(section.id)) set.delete(section.id); else set.add(section.id);
        saved = [...set];
        localStorage.setItem(key, JSON.stringify(saved));
        btn.classList.toggle('saved', set.has(section.id));
        btn.textContent = set.has(section.id) ? '★' : '☆';
        renderBookmarks();
      });
    });
    function renderBookmarks() {
      const outline = $('.outline-card');
      if (!outline) return;
      let box = $('.premium-bookmarks', outline);
      if (!box) {
        box = document.createElement('div');
        box.className = 'premium-bookmarks';
        outline.appendChild(box);
      }
      const links = saved.map(id => {
        const section = document.getElementById(id);
        const title = section?.dataset.sectionTitle || id.replace(/-/g,' ');
        return `<a href="#${id}">${title}</a>`;
      }).join('');
      box.innerHTML = `<div class="premium-bookmarks-head"><span>SAVED SECTIONS</span><b>${saved.length}</b></div><div class="premium-bookmarks-list">${links || '<span style="color:var(--muted);font-size:.65rem">Use ☆ to save a section.</span>'}</div>`;
    }
    renderBookmarks();
  }
  setupBookmarks();

  function setupChecklistFeedback() {
    $$('input[type="checkbox"]').forEach(input => {
      input.addEventListener('change', () => {
        if (!input.checked) return;
        const row = input.closest('.action-item,.check-item');
        if (!row) return;
        row.classList.remove('just-checked');
        void row.offsetWidth;
        row.classList.add('just-checked');
        setTimeout(() => row.classList.remove('just-checked'),650);
      });
    });
  }
  setupChecklistFeedback();

  function setupQuizMotion() {
    $$('.quiz-option input[type="radio"]').forEach(input => {
      input.addEventListener('change', () => {
        const card = input.closest('.quiz-card');
        if (!card) return;
        $$('.quiz-option', card).forEach(o => o.classList.remove('selected'));
        input.closest('.quiz-option')?.classList.add('selected');
      });
    });
    const submit = $('#quizSubmit');
    if (!submit) return;
    submit.addEventListener('click', () => setTimeout(() => {
      const result = $('#quizResult');
      if (!result || !result.textContent.trim()) return;
      result.classList.remove('premium-result');
      void result.offsetWidth;
      result.classList.add('premium-result');
      const match = result.textContent.match(/Score:\s*(\d+)\/(\d+)/i);
      if (match && Number(match[1]) === Number(match[2])) {
        celebrate('Perfect quiz score');
        addAchievement('Quiz Master · Perfect Score');
      }
    }, 60));
  }
  setupQuizMotion();

  function setupNoteFeedback() {
    const note = $('#lessonNote');
    const status = $('#noteStatus');
    if (!note || !status) return;
    let t;
    note.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        status.classList.remove('saved-pop');
        void status.offsetWidth;
        status.classList.add('saved-pop');
      }, 180);
    });
  }
  setupNoteFeedback();

  function ensureStamp() {
    const panel = $('#completion');
    if (!panel || $('.premium-stamp', panel)) return;
    const stamp = document.createElement('span');
    stamp.className = 'premium-stamp';
    stamp.textContent = 'COMPLETED';
    panel.appendChild(stamp);
  }
  ensureStamp();

  function addAchievement(text) {
    const panel = $('#completion');
    if (!panel) return;
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g,'-');
    if ($(`[data-achievement="${id}"]`, panel)) return;
    const badge = document.createElement('span');
    badge.className = 'premium-achievement';
    badge.dataset.achievement = id;
    badge.textContent = `✦ ${text}`;
    const copy = $('div', panel) || panel;
    copy.appendChild(badge);
  }

  function celebrate(reason='Achievement unlocked') {
    if (reduceMotion || celebrationLocked) return;
    celebrationLocked = true;
    const colors = ['#7c5cff','#43c9ae','#f3b34c','#e76b9a','#80a8ff'];
    for (let i=0;i<28;i++) {
      const p = document.createElement('span');
      p.className = 'confetti-piece';
      p.style.left = `${8 + Math.random()*84}%`;
      p.style.background = colors[i % colors.length];
      p.style.setProperty('--drift', `${-80 + Math.random()*160}px`);
      p.style.animationDelay = `${Math.random()*.18}s`;
      p.style.transform = `rotate(${Math.random()*180}deg)`;
      document.body.appendChild(p);
      setTimeout(() => p.remove(),2100);
    }
    const toast = $('#toast');
    if (toast) {
      toast.textContent = `✦ ${reason}`;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'),2200);
    }
    setTimeout(() => celebrationLocked = false,2300);
  }

  const completeBtn = $('#completeBtn');
  completeBtn?.addEventListener('click', () => setTimeout(() => {
    const panel = $('#completion');
    if (panel?.classList.contains('completed')) {
      ensureStamp();
      addAchievement('Lesson Complete');
      celebrate('Lesson completed');
    }
  }, 90));
  if ($('#completion.completed')) addAchievement('Lesson Complete');

  function navigateWithTransition(href) {
    if (!href) return;
    if (reduceMotion) { location.href = href; return; }
    body.classList.add('page-leaving');
    setTimeout(() => { location.href = href; }, 185);
  }

  function setupPageTransitions() {
    document.addEventListener('click', e => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest('a[href]');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const raw = a.getAttribute('href');
      if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:') || raw.startsWith('javascript:')) return;
      let url;
      try { url = new URL(a.href, location.href); } catch (_) { return; }
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return;
      e.preventDefault();
      navigateWithTransition(url.href);
    });
  }
  setupPageTransitions();

  function setupKeyboardLessonNav() {
    if (!isLesson) return;
    document.addEventListener('keydown', e => {
      const tag = document.activeElement?.tagName;
      if (['INPUT','TEXTAREA','SELECT','BUTTON'].includes(tag) || e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.toLowerCase();
      if (key === 'n') {
        const next = $('.nav-lesson.next[href]:not(.disabled), .course-nav a[href]');
        if (next) { e.preventDefault(); navigateWithTransition(next.href); }
      }
      if (key === 'p') {
        const prev = $('.nav-lesson:not(.next)[href]:not(.disabled)');
        if (prev) { e.preventDefault(); navigateWithTransition(prev.href); }
      }
    });
  }
  setupKeyboardLessonNav();

  function setupDashboardPolish() {
    if (isLesson) return;
    $$('.stat strong').forEach(el => {
      const raw = el.textContent.trim();
      const target = Number(raw.replace(/[^0-9.]/g,''));
      if (!Number.isFinite(target)) return;
      const suffix = raw.includes('%') ? '%' : '';
      const duration = 650;
      const start = performance.now();
      el.classList.add('counting');
      const tick = now => {
        const p = Math.min(1,(now-start)/duration);
        const eased = 1-Math.pow(1-p,3);
        el.textContent = `${Math.round(target*eased)}${suffix}`;
        if (p < 1) requestAnimationFrame(tick); else el.textContent = raw;
      };
      requestAnimationFrame(tick);
    });
    const available = window.COURSE_MODULES?.flatMap(m=>m.lessons).filter(l=>l.status==='available') || [];
    let done = 0;
    available.forEach(l => {
      const pad = String(l.n).padStart(2,'0');
      const modern = localStorage.getItem(`sure-earning-lesson-${pad}-complete`) === 'true';
      const oldL4 = l.n === 4 && localStorage.getItem('sure-earning-class11-complete') === 'true';
      if (modern || oldL4) done++;
    });
    const pct = available.length ? done/available.length*100 : 0;
    const milestones = $$('.milestone');
    milestones.forEach(m=>m.classList.remove('current'));
    const idx = Math.min(milestones.length-1, Math.floor(pct/20));
    milestones[idx]?.classList.add('current');
  }
  setupDashboardPolish();
})();
