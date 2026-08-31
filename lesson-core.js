(() => {
  const body = document.body;
  const lesson = body.dataset.lesson || 'lesson';
  const store = {
    theme:'sure-earning-theme',
    complete:`sure-earning-${lesson}-complete`,
    checks:`sure-earning-${lesson}-checks`,
    note:`sure-earning-${lesson}-note`,
    quiz:`sure-earning-${lesson}-quiz`
  };
  const $ = (s,r=document) => r.querySelector(s);
  const $$ = (s,r=document) => [...r.querySelectorAll(s)];
  const themeToggle = $('#themeToggle');
  const progress = $('#progress');
  const sidebar = $('#sidebar');
  const menuBtn = $('#menuBtn');
  const closeMenu = $('#closeMenu');
  const overlay = $('#mobileOverlay');
  const toast = $('#toast');

  function showToast(msg){
    if(!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast.t);
    showToast.t = setTimeout(()=>toast.classList.remove('show'),2200);
  }

  function applyTheme(theme){
    const dark = theme === 'dark';
    body.classList.toggle('dark',dark);
    if(themeToggle){themeToggle.textContent = dark ? '☀' : '☾';themeToggle.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode')}
  }
  const savedTheme = localStorage.getItem(store.theme);
  const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme || (systemDark ? 'dark' : 'light'));
  themeToggle?.addEventListener('click',()=>{const next=body.classList.contains('dark')?'light':'dark';applyTheme(next);localStorage.setItem(store.theme,next)});

  function readingProgress(){
    if(!progress) return;
    const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    progress.style.width = `${max ? (document.documentElement.scrollTop/max)*100 : 0}%`;
  }
  addEventListener('scroll',readingProgress,{passive:true});readingProgress();

  function openMenu(){sidebar?.classList.add('open');overlay?.classList.add('show');body.style.overflow='hidden'}
  function closeSidebar(){sidebar?.classList.remove('open');overlay?.classList.remove('show');body.style.overflow=''}
  menuBtn?.addEventListener('click',openMenu);closeMenu?.addEventListener('click',closeSidebar);overlay?.addEventListener('click',closeSidebar);
  $$('.side-nav a').forEach(a=>a.addEventListener('click',closeSidebar));

  const reveals = $$('.reveal');
  if('IntersectionObserver' in window){
    const o = new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.08});
    reveals.forEach(el=>o.observe(el));
  } else reveals.forEach(el=>el.classList.add('visible'));

  const outlineLinks = $$('.outline-link');
  const sections = $$('.lesson-section');
  if('IntersectionObserver' in window && sections.length){
    const active = new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;outlineLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${e.target.id}`));const label=$('#activeSectionLabel');if(label)label.textContent=e.target.dataset.sectionTitle||label.textContent}),{rootMargin:'-22% 0px -60% 0px',threshold:.01});
    sections.forEach(s=>active.observe(s));
  }

  const checks = $$('[data-check]');
  let savedChecks={};
  try{savedChecks=JSON.parse(localStorage.getItem(store.checks)||'{}')}catch(_){savedChecks={}}
  checks.forEach(c=>{c.checked=Boolean(savedChecks[c.dataset.check]);c.addEventListener('change',()=>{const data={};checks.forEach(x=>data[x.dataset.check]=x.checked);localStorage.setItem(store.checks,JSON.stringify(data));updateChecklist()})});
  function updateChecklist(){
    const done=checks.filter(c=>c.checked).length;
    const count=$('#checkCount');if(count)count.textContent=`${done} of ${checks.length} actions complete`;
  } updateChecklist();

  const note=$('#lessonNote');
  if(note){note.value=localStorage.getItem(store.note)||'';note.addEventListener('input',()=>{localStorage.setItem(store.note,note.value);const s=$('#noteStatus');if(s)s.textContent='Saved on this device'})}

  const quizCards=$$('.quiz-card');
  $('#quizSubmit')?.addEventListener('click',()=>{
    let score=0, answered=0;
    quizCards.forEach(card=>{
      const chosen=card.querySelector('input[type=radio]:checked');
      card.classList.remove('correct','wrong');
      if(!chosen) return;
      answered++;
      const ok=chosen.value===card.dataset.correct;
      if(ok){score++;card.classList.add('correct')} else card.classList.add('wrong');
    });
    const result=$('#quizResult');
    if(result){
      if(answered<quizCards.length){result.textContent=`Answer all ${quizCards.length} questions first.`;result.className='quiz-result'}
      else{result.textContent=`Score: ${score}/${quizCards.length}${score===quizCards.length?' — Excellent!':score>=Math.ceil(quizCards.length*.7)?' — Good understanding.':' — Review the lesson and try again.'}`;result.className=`quiz-result ${score>=Math.ceil(quizCards.length*.7)?'good':''}`;localStorage.setItem(store.quiz,String(score));showToast(`Quiz scored ${score}/${quizCards.length}`)}
    }
  });

  const completeBtn=$('#completeBtn');
  const completePanel=$('#completion');
  function completed(){return localStorage.getItem(store.complete)==='true'}
  function renderComplete(){const yes=completed();completePanel?.classList.toggle('completed',yes);if(completeBtn)completeBtn.textContent=yes?'Completed ✓':'Mark lesson complete';const title=$('#completionTitle');if(title)title.textContent=yes?'Lesson completed.':'Ready to complete this lesson?';const text=$('#completionText');if(text)text.textContent=yes?'Your completion is saved on this device and reflected on the course dashboard.':'Complete the lesson when you understand the core ideas and finish the practice.'}
  completeBtn?.addEventListener('click',()=>{const next=!completed();localStorage.setItem(store.complete,String(next));renderComplete();showToast(next?'Lesson marked complete ✓':'Completion removed')});renderComplete();

  const lessonUrl = body.dataset.url || location.href.split('#')[0];
  async function copyLink(){try{await navigator.clipboard.writeText(lessonUrl);showToast('Lesson link copied ✓')}catch(_){showToast('Copy is unavailable in this browser')}}
  async function share(){if(navigator.share){try{await navigator.share({title:document.title,url:lessonUrl});return}catch(_){}}copyLink()}
  $('#shareBtn')?.addEventListener('click',share);$('#footerShare')?.addEventListener('click',share);$('#copyLinkBtn')?.addEventListener('click',copyLink);$('#printBtn')?.addEventListener('click',()=>print());

  document.addEventListener('keydown',e=>{const typing=['INPUT','TEXTAREA'].includes(document.activeElement.tagName);if(e.key==='d'&&!typing){themeToggle?.click()}if(e.key==='Escape')closeSidebar()});

  if(lesson==='lesson-06'){
    const next=$('.nav-lesson.next');
    if(next){next.classList.remove('disabled');next.href='lesson.html?lesson=7';next.innerHTML='<small>NEXT · MODULE 2 · LESSON 7</small><strong>Choosing a Freelancing Skill Strategically →</strong>'}
  }

  if(!document.querySelector('script[data-premium-motion-loader]')){
    const premium=document.createElement('script');
    premium.src='premium-motion.js';
    premium.dataset.premiumMotionLoader='true';
    document.body.appendChild(premium);
  }

  function loadTraining(){
    if(document.querySelector('script[data-training-product-loader]')) return;
    const training=document.createElement('script');training.src='training-product.js';training.dataset.trainingProductLoader='true';document.body.appendChild(training);
  }
  if(window.COURSE_MODULES){loadTraining()}
  else {
    const course=document.createElement('script');course.src='course-data.js';course.dataset.trainingCourseData='true';course.onload=loadTraining;document.body.appendChild(course);
  }
})();