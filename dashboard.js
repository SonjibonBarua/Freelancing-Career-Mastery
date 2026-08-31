(() => {
  const modules = window.COURSE_MODULES || [];
  const allLessons = modules.flatMap(module => module.lessons.map(lesson => ({...lesson,moduleId:module.id,moduleTitle:module.title})));
  const moduleRoot = document.getElementById('modules');
  const filterInput = document.getElementById('lessonFilter');
  const themeToggle = document.getElementById('themeToggle');
  const searchBtn = document.getElementById('searchBtn');
  const searchPanel = document.getElementById('searchPanel');
  const globalSearch = document.getElementById('globalSearch');
  const searchResults = document.getElementById('searchResults');
  const publishedLessons = allLessons.filter(l => l.status === 'available');
  const publishedCount = publishedLessons.length;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function lessonComplete(lesson){
    const num = String(lesson.n).padStart(2,'0');
    const modern = localStorage.getItem(`sure-earning-lesson-${num}-complete`) === 'true';
    if(lesson.n === 4){
      return modern || localStorage.getItem('sure-earning-class11-complete') === 'true';
    }
    return modern;
  }

  function applyTheme(theme){
    const dark = theme === 'dark';
    document.body.classList.toggle('dark', dark);
    themeToggle.textContent = dark ? '☀' : '☾';
    themeToggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  const savedTheme = localStorage.getItem('sure-earning-theme');
  applyTheme(savedTheme || 'dark');
  themeToggle.addEventListener('click', () => {
    const next = document.body.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('sure-earning-theme', next);
  });

  function lessonRow(lesson){
    const number = String(lesson.n).padStart(2,'0');
    const available = lesson.status === 'available';
    const done = available && lessonComplete(lesson);
    const status = available ? (done ? 'Completed' : 'Available') : 'Planned';
    const tag = available ? 'a' : 'div';
    const href = available ? ` href="${lesson.href}"` : '';
    return `<${tag}${href} class="lesson-row ${available ? 'available' : 'planned'} ${done ? 'done' : ''}">
      <span class="lesson-no">${number}</span>
      <span class="lesson-copy"><strong>${lesson.title}</strong><small>${available ? 'Full lesson · Practice · Quiz · Notes' : 'Curriculum planned · Content coming progressively'}</small></span>
      <span class="status">${status}</span>
    </${tag}>`;
  }

  function enhanceModule(section){
    const head = section.querySelector('.module-head');
    const list = section.querySelector('.lesson-list');
    if(!head || !list) return;
    head.style.position = 'relative';
    head.style.paddingRight = '58px';
    head.style.cursor = 'pointer';
    head.tabIndex = 0;
    head.setAttribute('role','button');
    head.setAttribute('aria-expanded','true');
    head.title = 'Click to collapse or expand this module';
    const indicator = document.createElement('span');
    indicator.textContent = '⌄';
    indicator.setAttribute('aria-hidden','true');
    Object.assign(indicator.style,{position:'absolute',right:'18px',top:'50%',transform:'translateY(-50%)',width:'28px',height:'28px',display:'grid',placeItems:'center',borderRadius:'9px',background:'var(--soft)',color:'var(--primary)',fontWeight:'900',transition:'transform .28s cubic-bezier(.2,.8,.2,1)'});
    head.appendChild(indicator);
    const toggle = () => {
      const open = head.getAttribute('aria-expanded') === 'true';
      head.setAttribute('aria-expanded', String(!open));
      indicator.style.transform = `translateY(-50%) rotate(${open ? 180 : 0}deg)`;
      if(reduceMotion){list.hidden = open;return;}
      if(open){
        const h = list.scrollHeight;
        const anim = list.animate([{height:`${h}px`,opacity:1},{height:'0px',opacity:0}],{duration:300,easing:'cubic-bezier(.2,.8,.2,1)'});
        anim.onfinish = () => {list.hidden = true;list.style.height='';list.style.opacity=''};
      } else {
        list.hidden = false;
        const h = list.scrollHeight;
        const anim = list.animate([{height:'0px',opacity:0},{height:`${h}px`,opacity:1}],{duration:340,easing:'cubic-bezier(.2,.8,.2,1)'});
        anim.onfinish = () => {list.style.height='';list.style.opacity=''};
      }
    };
    head.addEventListener('click', toggle);
    head.addEventListener('keydown', e => {if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}});
    if(!reduceMotion) section.animate([{opacity:.3,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:420,easing:'cubic-bezier(.2,.8,.2,1)'});
  }

  function render(query=''){
    const q = query.trim().toLowerCase();
    moduleRoot.innerHTML = '';
    modules.forEach(module => {
      const matched = module.lessons.filter(l => !q || `${l.n} ${l.title} ${module.title} ${module.subtitle}`.toLowerCase().includes(q));
      if(!matched.length) return;
      const completedInModule = module.lessons.filter(l => l.status === 'available' && lessonComplete(l)).length;
      const availableInModule = module.lessons.filter(l => l.status === 'available').length;
      const section = document.createElement('section');
      section.className = 'module';
      section.dataset.module = module.id;
      section.innerHTML = `
        <div class="module-head">
          <span class="module-number">${String(module.id).padStart(2,'0')}</span>
          <span class="module-title"><strong>${module.title}</strong><small>${module.subtitle}</small></span>
          <span class="module-meta"><b>${module.lessons.length} lessons</b><span>${availableInModule ? `${completedInModule}/${availableInModule} completed · ` : ''}${module.level}</span></span>
        </div>
        <div class="lesson-list">${matched.map(lessonRow).join('')}</div>`;
      moduleRoot.appendChild(section);
      enhanceModule(section);
    });
  }
  render();
  filterInput.addEventListener('input', e => render(e.target.value));

  const completedPublished = publishedLessons.filter(lessonComplete).length;
  document.getElementById('roadmapTotal').textContent = allLessons.length;
  document.getElementById('publishedTotal').textContent = publishedCount;
  document.getElementById('plannedTotal').textContent = allLessons.length - publishedCount;
  document.getElementById('availableProgress').textContent = `${completedPublished} / ${publishedCount}`;
  document.getElementById('availableMeter').style.width = `${publishedCount ? Math.round((completedPublished/publishedCount)*100) : 0}%`;
  document.getElementById('buildMeter').style.width = `${Math.round((publishedCount/allLessons.length)*100)}%`;
  document.getElementById('buildPercent').textContent = `${Math.round((publishedCount/allLessons.length)*100)}%`;

  function renderSearch(value=''){
    const q = value.trim().toLowerCase();
    if(!q){searchResults.innerHTML = '<div class="empty">Search lesson titles, modules, or topics.</div>';return;}
    const matches = allLessons.filter(l => `${l.n} ${l.title} ${l.moduleTitle}`.toLowerCase().includes(q)).slice(0,12);
    if(!matches.length){searchResults.innerHTML = '<div class="empty">No matching roadmap lesson found.</div>';return;}
    searchResults.innerHTML = matches.map(l => {
      const available = l.status === 'available';
      const tag = available ? 'a' : 'div';
      const href = available ? ` href="${l.href}"` : '';
      const state = available ? (lessonComplete(l) ? 'Completed' : 'Available') : 'Planned';
      return `<${tag}${href} class="search-result"><strong>Lesson ${l.n} · ${l.title}</strong><small>Module ${l.moduleId} · ${l.moduleTitle} · ${state}</small></${tag}>`;
    }).join('');
  }

  function openSearch(){searchPanel.classList.add('show');globalSearch.focus();renderSearch(globalSearch.value)}
  function closeSearch(){searchPanel.classList.remove('show')}
  searchBtn.addEventListener('click', () => searchPanel.classList.contains('show') ? closeSearch() : openSearch());
  globalSearch.addEventListener('input', e => renderSearch(e.target.value));
  document.addEventListener('keydown', e => {const typing = ['INPUT','TEXTAREA'].includes(document.activeElement.tagName);if(e.key === '/' && !typing){e.preventDefault();openSearch()}if(e.key === 'Escape') closeSearch()});
  document.addEventListener('click', e => {if(!searchPanel.contains(e.target) && !searchBtn.contains(e.target)) closeSearch()});

  const topics = window.REAL_LIFE_TOPICS || [];
  document.getElementById('survivalTopics').innerHTML = topics.map(t => `<span class="topic">${t}</span>`).join('');

  if(!document.querySelector('link[data-premium-polish-css]')){
    const polish=document.createElement('link');
    polish.rel='stylesheet';
    polish.href='premium-polish.css';
    polish.dataset.premiumPolishCss='true';
    document.head.appendChild(polish);
  }

  if(!document.querySelector('script[data-premium-motion-loader]')){
    const premium=document.createElement('script');
    premium.src='premium-motion.js';
    premium.dataset.premiumMotionLoader='true';
    document.body.appendChild(premium);
  }
  if(!document.querySelector('script[data-training-product-loader]')){
    const training=document.createElement('script');training.src='training-product.js';training.dataset.trainingProductLoader='true';document.body.appendChild(training);
  }
})();