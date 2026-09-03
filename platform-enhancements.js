(() => {
  if(document.documentElement.dataset.platformEnhancementsV1) return;
  document.documentElement.dataset.platformEnhancementsV1='true';

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const safeGet=(k,fallback=null)=>{try{const v=localStorage.getItem(k);return v===null?fallback:v}catch(_){return fallback}};
  const safeSet=(k,v)=>{try{localStorage.setItem(k,v);return true}catch(_){return false}};
  const safeJSON=(k,fallback)=>{try{return JSON.parse(safeGet(k,'')||'')||fallback}catch(_){return fallback}};
  const pad=n=>String(n).padStart(2,'0');
  const hrefFor=n=>n<=6?`lesson-${pad(n)}.html`:`lesson.html?lesson=${n}`;
  const complete=n=>safeGet(`sure-earning-lesson-${pad(n)}-complete`)==='true'||(n===4&&safeGet('sure-earning-class11-complete')==='true');
  const lessonNo=()=>{
    const data=document.body.dataset.lesson?.match(/lesson-(\d+)/i);
    const path=location.pathname.match(/lesson-(\d+)/i);
    const query=new URLSearchParams(location.search).get('lesson');
    return Number(data?.[1]||path?.[1]||query||0);
  };
  const allLessons=()=>window.COURSE_MODULES?.flatMap(m=>m.lessons.map(l=>({...l,moduleId:m.id,moduleTitle:m.title})))||[];
  const lessonByNo=n=>allLessons().find(l=>l.n===n);

  function ensureCssFinal(){
    if(document.querySelector('link[data-platform-enhancements-final]')) return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='platform-enhancements.css?v=20260903-platform1';
    link.dataset.platformEnhancementsFinal='true';
    document.head.appendChild(link);
  }
  ensureCssFinal();

  function completedCount(){return allLessons().filter(l=>complete(l.n)).length}
  function completedModules(){return (window.COURSE_MODULES||[]).filter(m=>m.lessons.every(l=>complete(l.n))).length}
  function favorites(){const raw=safeJSON('fcm-favorite-lessons',[]);return Array.isArray(raw)?raw.map(Number).filter(Boolean):[]}
  function recentLessons(){const raw=safeJSON('fcm-recent-lessons',[]);return Array.isArray(raw)?raw.filter(x=>x&&Number(x.n)):[]}
  function noteEntries(){
    const out=[];
    try{
      for(let i=0;i<localStorage.length;i++){
        const key=localStorage.key(i)||'';
        const m=key.match(/^sure-earning-lesson-(\d+)-note$/);
        if(!m)continue;
        const text=(localStorage.getItem(key)||'').trim();
        if(text)out.push({n:Number(m[1]),text});
      }
    }catch(_){}
    return out.sort((a,b)=>a.n-b.n);
  }

  function recordLessonVisit(n){
    if(!n)return;
    const info=lessonByNo(n);
    const title=info?.title||document.title.replace(/^Lesson\s*\d+\s*[—-]\s*/,'').split('|')[0].trim();
    const state={n,title,moduleId:info?.moduleId||info?.module||null,moduleTitle:info?.moduleTitle||'',href:hrefFor(n),at:Date.now()};
    safeSet('fcm-last-lesson',JSON.stringify(state));
    const next=[state,...recentLessons().filter(x=>Number(x.n)!==n)].slice(0,6);
    safeSet('fcm-recent-lessons',JSON.stringify(next));
  }

  function chooseContinue(){
    const lessons=allLessons();
    if(!lessons.length)return null;
    const last=safeJSON('fcm-last-lesson',null);
    if(last?.n&&!complete(Number(last.n)))return lessonByNo(Number(last.n))||last;
    if(last?.n){
      const after=lessons.find(l=>l.n>Number(last.n)&&!complete(l.n));
      if(after)return after;
    }
    return lessons.find(l=>!complete(l.n))||lessons[lessons.length-1];
  }

  function moduleProgressFor(n){
    const modules=window.COURSE_MODULES||[];
    const mod=modules.find(m=>m.lessons.some(l=>l.n===n));
    if(!mod)return null;
    const done=mod.lessons.filter(l=>complete(l.n)).length;
    return {id:mod.id,title:mod.title,done,total:mod.lessons.length,pct:Math.round(done/mod.lessons.length*100)};
  }

  function listMarkup(numbers,empty){
    const entries=numbers.map(Number).filter(Boolean).map(lessonByNo).filter(Boolean).slice(0,3);
    if(!entries.length)return `<div class="learning-empty">${esc(empty)}</div>`;
    return `<div class="learning-list">${entries.map(l=>`<a href="${hrefFor(l.n)}"><span class="learning-list-num">${pad(l.n)}</span><span><strong>${esc(l.title)}</strong><small>Module ${l.moduleId} · ${esc(l.moduleTitle||'Course lesson')}</small></span><span class="learning-list-arrow">›</span></a>`).join('')}</div>`;
  }

  function setupDashboard(){
    const hero=$('main > .hero');
    const roadmap=$('.roadmap-strip');
    if(!hero||!roadmap||$('#learningHome'))return;
    const lessons=allLessons();
    if(!lessons.length)return;
    const cont=chooseContinue();
    const progress=completedCount();
    const modulesDone=completedModules();
    const fav=favorites();
    const rec=recentLessons();
    const notes=noteEntries();
    const mp=cont?moduleProgressFor(cont.n):null;
    const last=safeJSON('fcm-last-lesson',null);
    const reading=cont?Number(safeGet(`fcm-reading-lesson-${cont.n}`,'0'))||0:0;
    const section=document.createElement('section');
    section.id='learningHome';
    section.className='wrap learning-home';
    section.setAttribute('aria-labelledby','learningHomeTitle');
    section.innerHTML=`
      <div class="learning-home-head"><div><span class="learning-home-kicker">✦ MY LEARNING</span><h2 id="learningHomeTitle">Pick up without losing momentum.</h2><p>Your progress, saved lessons, notes and recent activity stay on this device.</p></div></div>
      <div class="learning-home-grid">
        <article class="learning-panel learning-continue">
          <div><div class="learning-continue-top"><span class="learning-state-chip">${progress===64?'✓ COURSE COMPLETE':'↗ CONTINUE LEARNING'}</span><small>${progress} / 64 lessons complete</small></div>
          <h3>${esc(cont?.title||'Start your learning journey')}</h3>
          <p>${cont?`Continue with Lesson ${cont.n}${mp?` in Module ${mp.id} · ${esc(mp.title)}`:''}.`:'Begin with the first lesson and build from the foundation.'}</p>
          <div class="learning-continue-meta">${mp?`<span>Module ${mp.done}/${mp.total}</span>`:''}<span>Course ${Math.round(progress/64*100)}%</span>${reading>4&&reading<98?`<span>Reading ${Math.round(reading)}%</span>`:''}${last?.n?`<span>Last opened Lesson ${last.n}</span>`:''}</div></div>
          <div><div class="learning-meter" aria-hidden="true"><span style="width:${Math.round(progress/64*100)}%"></span></div><div class="learning-continue-actions"><a class="learning-primary" href="${cont?hrefFor(cont.n):'lesson-01.html'}">${progress===64?'Review final lesson':'Continue lesson'} →</a><a class="learning-secondary" href="#curriculum">Browse curriculum</a>${notes.length?'<button class="learning-secondary" id="exportLearningNotes" type="button">Export notes</button>':''}</div></div>
        </article>
        <div class="learning-home-side">
          <article class="learning-panel"><h3>Your journey</h3><div class="learning-journey-grid"><div class="learning-metric"><strong>${progress}</strong><span>Lessons complete</span></div><div class="learning-metric"><strong>${modulesDone}</strong><span>Modules complete</span></div><div class="learning-metric"><strong>${fav.length}</strong><span>Saved lessons</span></div><div class="learning-metric"><strong>${notes.length}</strong><span>Notes written</span></div></div></article>
          <article class="learning-panel"><h3>Saved lessons</h3>${listMarkup(fav,'Save useful lessons from the Resources panel and they will appear here.')}</article>
        </div>
      </div>
      ${rec.length?`<article class="learning-panel" style="margin-top:14px"><h3>Recently viewed</h3>${listMarkup(rec.map(x=>x.n),'Your recently opened lessons will appear here.')}</article>`:''}`;
    roadmap.insertAdjacentElement('beforebegin',section);
    $('#exportLearningNotes',section)?.addEventListener('click',exportNotes);
  }

  function exportNotes(){
    const notes=noteEntries();
    if(!notes.length)return;
    const lines=['Freelancing Career Mastery — My Notes','',...notes.flatMap(entry=>{
      const lesson=lessonByNo(entry.n);
      return [`Lesson ${entry.n} — ${lesson?.title||'Course lesson'}`,entry.text,''];
    })];
    const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download='freelancing-career-mastery-notes.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  function readingPercent(){
    const root=$('#lesson-content .lesson-main')||$('.lesson-main')||$('#lesson-content')||$('main');
    if(!root)return 0;
    const top=root.getBoundingClientRect().top+scrollY;
    const length=Math.max(1,root.scrollHeight-innerHeight*.72);
    return Math.max(0,Math.min(100,((scrollY-top+innerHeight*.18)/length)*100));
  }

  function setupReadingContinuity(n){
    if(!n)return;
    recordLessonVisit(n);
    if(!$('.platform-reading-line')){const line=document.createElement('div');line.className='platform-reading-line';line.setAttribute('aria-hidden','true');document.body.appendChild(line)}
    let queued=false,lastSave=0;
    const update=()=>{
      queued=false;
      const pct=readingPercent();
      document.documentElement.style.setProperty('--platform-reading',`${pct.toFixed(2)}%`);
      const dock=$('#mobileLearningDock');if(dock)dock.style.setProperty('--dock-reading',pct.toFixed(2));
      const now=Date.now();
      if(now-lastSave>350){lastSave=now;safeSet(`fcm-scroll-lesson-${n}`,String(Math.round(scrollY)));safeSet(`fcm-reading-lesson-${n}`,String(Math.round(pct)))}
    };
    addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update)}},{passive:true});
    addEventListener('pagehide',()=>{safeSet(`fcm-scroll-lesson-${n}`,String(Math.round(scrollY)));safeSet(`fcm-reading-lesson-${n}`,String(Math.round(readingPercent())))});
    update();
    setTimeout(()=>showResumePrompt(n),850);
  }

  function showResumePrompt(n){
    if(location.hash||complete(n)||$('.resume-reading-card'))return;
    const y=Number(safeGet(`fcm-scroll-lesson-${n}`,'0'))||0;
    const pct=Number(safeGet(`fcm-reading-lesson-${n}`,'0'))||0;
    if(y<360||pct<5||pct>94||scrollY>160)return;
    const card=document.createElement('aside');
    card.className='resume-reading-card';card.setAttribute('aria-label','Resume reading');
    card.innerHTML=`<div class="resume-reading-icon">↗</div><div><h3>Resume where you stopped?</h3><p>You were around ${Math.round(pct)}% through this lesson.</p></div><div class="resume-reading-actions"><button type="button" data-resume-dismiss>Start from top</button><button class="resume-primary" type="button" data-resume-go>Resume at ${Math.round(pct)}%</button></div>`;
    document.body.appendChild(card);
    $('[data-resume-go]',card)?.addEventListener('click',()=>{scrollTo({top:y,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});card.remove()});
    $('[data-resume-dismiss]',card)?.addEventListener('click',()=>card.remove());
  }

  function showAchievement(n){
    const modules=window.COURSE_MODULES||[];
    const mod=modules.find(m=>m.lessons.some(l=>l.n===n));
    if(!mod||!mod.lessons.every(l=>complete(l.n)))return;
    const allDone=allLessons().length===64&&completedCount()===64;
    const key=allDone?'fcm-course-celebrated':`fcm-module-celebrated-${mod.id}`;
    if(safeGet(key)==='true'||$('.platform-achievement'))return;
    safeSet(key,'true');
    const nextModule=modules.find(m=>m.id===mod.id+1);
    const card=document.createElement('aside');card.className='platform-achievement';card.setAttribute('role','status');
    card.innerHTML=`<span class="platform-achievement-badge">${allDone?'COURSE MILESTONE':'MODULE MILESTONE'}</span><h3>${allDone?'64 lessons completed.':`Module ${mod.id} complete ✓`}</h3><p>${allDone?'You have completed the full Freelancing Career Mastery lesson roadmap. You can now revisit weak areas and pressure-test your judgment in the Survival Lab.':`You completed all ${mod.lessons.length} lessons in ${esc(mod.title)}. Keep the momentum while the ideas are still fresh.`}</p><div class="platform-achievement-actions">${allDone?'<a class="learning-primary" href="survival.html">Enter Survival Lab →</a>':nextModule?`<a class="learning-primary" href="${hrefFor(nextModule.lessons[0].n)}">Start Module ${nextModule.id} →</a>`:'<a class="learning-primary" href="index.html">Course dashboard →</a>'}<button class="learning-secondary" type="button" data-achievement-close>Close</button></div>`;
    document.body.appendChild(card);
    $('[data-achievement-close]',card)?.addEventListener('click',()=>card.remove());
  }

  function setupAchievementWatch(n){
    if(!n)return;
    document.addEventListener('click',e=>{
      if(!e.target.closest('#completeBtn,#workspaceComplete,.lesson-complete-btn'))return;
      setTimeout(()=>showAchievement(n),180);
    });
  }

  function loadMediaData(callback){
    if(window.LESSON_MEDIA){callback();return}
    const existing=$('script[data-platform-media-data]');
    if(existing){existing.addEventListener('load',callback,{once:true});return}
    const s=document.createElement('script');s.src='media-data.js';s.dataset.platformMediaData='true';s.addEventListener('load',callback,{once:true});document.body.appendChild(s);
  }

  function setupEnhancedSearch(){
    const input=$('#globalSearch'),results=$('#searchResults'),button=$('#searchBtn');
    if(!input||!results)return;
    const render=value=>{
      const q=String(value||'').trim().toLowerCase();
      if(!q)return;
      const matches=allLessons().map(l=>{
        const media=window.LESSON_MEDIA?.[l.n];
        const concepts=[media?.title,...(media?.items||[])].filter(Boolean).join(' ');
        const hay=`${l.n} ${l.title} ${l.moduleTitle||''} ${concepts}`.toLowerCase();
        const score=(l.title.toLowerCase().includes(q)?5:0)+((l.moduleTitle||'').toLowerCase().includes(q)?3:0)+(concepts.toLowerCase().includes(q)?2:0)+(hay.includes(q)?1:0);
        return {l,score,concepts};
      }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.l.n-b.l.n).slice(0,10);
      const topics=(window.REAL_LIFE_TOPICS||[]).filter(t=>String(t).toLowerCase().includes(q)).slice(0,3);
      if(!matches.length&&!topics.length){results.innerHTML='<div class="empty">No matching lesson, visual concept, or survival topic found.</div>';return}
      results.innerHTML=matches.map(({l})=>`<a href="${hrefFor(l.n)}" class="search-result"><strong><span class="platform-search-type">LESSON</span>Lesson ${l.n} · ${esc(l.title)}</strong><small>Module ${l.moduleId} · ${esc(l.moduleTitle||'Course roadmap')}</small></a>`).join('')+topics.map(t=>`<a href="survival.html" class="search-result"><strong><span class="platform-search-type">SURVIVAL</span>${esc(t)}</strong><small>Real-Life Freelancer Survival Lab</small></a>`).join('');
    };
    input.addEventListener('input',()=>render(input.value));
    button?.addEventListener('click',()=>setTimeout(()=>render(input.value),0));
  }

  function accessibilityPass(){
    $$('.course-link.active,.workspace-lesson-link.current,.lesson-row.done').forEach(el=>{if(el.matches('.course-link.active,.workspace-lesson-link.current'))el.setAttribute('aria-current','page')});
    $$('.meter,.workspace-overall-meter,.workspace-side-meter,.workspace-rail-meter').forEach(m=>{if(!m.getAttribute('role'))m.setAttribute('role','presentation')});
    const filter=$('#lessonFilter');if(filter&&!filter.getAttribute('autocomplete'))filter.setAttribute('autocomplete','off');
  }

  function injectStructuredData(n){
    if($('#platformStructuredData'))return;
    let data;
    const canonical='https://sonjibonbarua.github.io/Freelancing-Career-Mastery/';
    if(n){
      const info=lessonByNo(n);const name=info?.title||document.title.split('|')[0].replace(/^Lesson\s*\d+\s*[—-]\s*/,'').trim();
      data={"@context":"https://schema.org","@graph":[{"@type":"LearningResource","name":name,"url":canonical+hrefFor(n),"learningResourceType":"Lesson","position":n,"isPartOf":{"@type":"Course","name":"Freelancing Career Mastery","url":canonical}},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Freelancing Career Mastery","item":canonical},{"@type":"ListItem","position":2,"name":`Lesson ${n}: ${name}`,"item":canonical+hrefFor(n)}]}]};
    }else if($('#curriculum')){
      data={"@context":"https://schema.org","@type":"Course","name":"Freelancing Career Mastery","description":"A structured 64-lesson freelancing career roadmap from foundations through client acquisition, delivery, business systems and long-term growth.","url":canonical,"educationalLevel":"Beginner to advanced","inLanguage":"en"};
    }else if(location.pathname.endsWith('survival.html')){
      data={"@context":"https://schema.org","@type":"LearningResource","name":"Real-Life Freelancer Survival Lab","learningResourceType":"Interactive learning experience","isPartOf":{"@type":"Course","name":"Freelancing Career Mastery","url":canonical},"url":canonical+'survival.html'};
    }
    if(!data)return;
    const script=document.createElement('script');script.id='platformStructuredData';script.type='application/ld+json';script.textContent=JSON.stringify(data);document.head.appendChild(script);
  }

  function boot(attempt=0){
    ensureCssFinal();
    const n=lessonNo();
    const needsCourseData=Boolean($('#curriculum')||document.body.classList.contains('lesson-page'));
    if(needsCourseData&&!window.COURSE_MODULES?.length){
      if(attempt<100){setTimeout(()=>boot(attempt+1),80);return}
    }
    if($('#curriculum')){
      setupDashboard();
      loadMediaData(setupEnhancedSearch);
    }
    if(document.body.classList.contains('lesson-page')&&n){setupReadingContinuity(n);setupAchievementWatch(n)}
    accessibilityPass();injectStructuredData(n);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>boot(),{once:true});else boot();
})();
