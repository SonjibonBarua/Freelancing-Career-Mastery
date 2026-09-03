(() => {
  if(document.documentElement.dataset.myLearningCenterV1)return;
  document.documentElement.dataset.myLearningCenterV1='true';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const pad=n=>String(n).padStart(2,'0');
  const hrefFor=n=>n<=6?`lesson-${pad(n)}.html`:`lesson.html?lesson=${n}`;
  const safeGet=(k,fallback=null)=>{try{const v=localStorage.getItem(k);return v===null?fallback:v}catch(_){return fallback}};
  const safeSet=(k,v)=>{try{localStorage.setItem(k,v);return true}catch(_){return false}};
  const safeRemove=k=>{try{localStorage.removeItem(k);return true}catch(_){return false}};
  const safeJSON=(k,fallback)=>{try{return JSON.parse(safeGet(k,'')||'')||fallback}catch(_){return fallback}};
  const lessons=()=>window.COURSE_MODULES?.flatMap(m=>m.lessons.map(l=>({...l,moduleId:m.id,moduleTitle:m.title})))||[];
  const lessonByNo=n=>lessons().find(l=>l.n===Number(n));
  const complete=n=>safeGet(`sure-earning-lesson-${pad(n)}-complete`)==='true'||(Number(n)===4&&safeGet('sure-earning-class11-complete')==='true');

  function notes(){
    const out=[];
    try{
      for(let i=0;i<localStorage.length;i++){
        const key=localStorage.key(i)||'';
        const m=key.match(/^sure-earning-lesson-(\d+)-note$/);
        if(!m)continue;
        const text=(localStorage.getItem(key)||'').trim();
        if(text)out.push({n:Number(m[1]),key,text});
      }
    }catch(_){}
    return out.sort((a,b)=>a.n-b.n);
  }
  function saved(){const v=safeJSON('fcm-favorite-lessons',[]);return Array.isArray(v)?v.map(Number).filter(Boolean):[]}
  function recent(){const v=safeJSON('fcm-recent-lessons',[]);return Array.isArray(v)?v.filter(x=>x&&Number(x.n)):[]}

  function ensureCss(){
    if($('link[data-my-learning-css]'))return;
    const l=document.createElement('link');l.rel='stylesheet';l.href='my-learning.css?v=20260903-learningcenter1';l.dataset.myLearningCss='true';document.head.appendChild(l);
  }

  function exportNotes(){
    const list=notes();if(!list.length)return;
    const lines=['Freelancing Career Mastery — My Notes','',...list.flatMap(x=>{const l=lessonByNo(x.n);return [`Lesson ${x.n} — ${l?.title||'Course lesson'}`,x.text,'']})];
    const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download='freelancing-career-mastery-notes.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  function notesMarkup(query=''){
    const q=query.trim().toLowerCase();
    const list=notes().filter(x=>{const l=lessonByNo(x.n);return !q||`${l?.title||''} ${x.text}`.toLowerCase().includes(q)});
    if(!list.length)return '<div class="my-learning-zero">No matching notes yet. Write a note inside any lesson and it will appear here automatically.</div>';
    return `<div class="my-learning-items">${list.map(x=>{const l=lessonByNo(x.n);const preview=x.text.length>420?x.text.slice(0,420)+'…':x.text;return `<article class="my-learning-item" data-note-row="${x.n}"><div><h3>Lesson ${x.n} · ${esc(l?.title||'Course lesson')}</h3><p>${esc(preview)}</p><div class="my-learning-item-meta">${x.text.trim().split(/\s+/).length} words · Module ${l?.moduleId||''}</div></div><div class="my-learning-item-actions"><a href="${hrefFor(x.n)}#notes">Open lesson</a><button type="button" class="danger" data-delete-note="${x.n}">Delete note</button></div></article>`}).join('')}</div>`;
  }

  function savedMarkup(){
    const list=saved().map(lessonByNo).filter(Boolean);
    if(!list.length)return '<div class="my-learning-zero">No saved lessons yet. Use “Save lesson to favorites” in the Resources panel of any lesson.</div>';
    return `<div class="my-learning-items">${list.map(l=>`<article class="my-learning-item"><div><h3>Lesson ${l.n} · ${esc(l.title)}</h3><p>${esc(l.moduleTitle||'Course module')}</p><div class="my-learning-item-meta">${complete(l.n)?'Completed':'In progress'} · Module ${l.moduleId}</div></div><div class="my-learning-item-actions"><a href="${hrefFor(l.n)}">Open</a><button type="button" data-remove-saved="${l.n}">Remove</button></div></article>`).join('')}</div>`;
  }

  function recentMarkup(){
    const list=recent().map(x=>({...x,lesson:lessonByNo(x.n)})).filter(x=>x.lesson);
    if(!list.length)return '<div class="my-learning-zero">Your recently opened lessons will appear here as you continue through the course.</div>';
    return `<div class="my-learning-items">${list.map(x=>`<article class="my-learning-item"><div><h3>Lesson ${x.lesson.n} · ${esc(x.lesson.title)}</h3><p>${esc(x.lesson.moduleTitle||'Course module')}</p><div class="my-learning-item-meta">${x.at?`Opened ${new Date(x.at).toLocaleDateString()}`:'Recently viewed'} · ${complete(x.lesson.n)?'Completed':'In progress'}</div></div><div class="my-learning-item-actions"><a href="${hrefFor(x.lesson.n)}">Open</a></div></article>`).join('')}</div>`;
  }

  function progressMarkup(){
    const modules=window.COURSE_MODULES||[];
    return `<div class="my-module-progress">${modules.map(m=>{const done=m.lessons.filter(l=>complete(l.n)).length,pct=Math.round(done/m.lessons.length*100);return `<article class="my-module-row"><div class="my-module-row-head"><strong>Module ${m.id} · ${esc(m.title)}</strong><span>${done}/${m.lessons.length} · ${pct}%</span></div><div class="my-module-meter"><span style="width:${pct}%"></span></div></article>`}).join('')}</div>`;
  }

  function renderPanel(name,query=''){
    const panel=$(`[data-learning-panel="${name}"]`);if(!panel)return;
    if(name==='notes')panel.innerHTML=`<div class="my-learning-toolbar"><input type="search" id="myNotesSearch" placeholder="Search your notes..." aria-label="Search your notes" value="${esc(query)}"><button type="button" id="myNotesExport">Export notes</button></div>${notesMarkup(query)}`;
    if(name==='saved')panel.innerHTML=savedMarkup();
    if(name==='recent')panel.innerHTML=`<div class="my-learning-toolbar"><span></span><button type="button" id="clearRecentLearning">Clear recent history</button></div>${recentMarkup()}`;
    if(name==='progress')panel.innerHTML=progressMarkup();
    $('#myNotesSearch',panel)?.addEventListener('input',e=>renderPanel('notes',e.target.value));
    $('#myNotesExport',panel)?.addEventListener('click',exportNotes);
    $('#clearRecentLearning',panel)?.addEventListener('click',()=>{if(confirm('Clear your recently viewed lesson history? This will not remove lesson progress, notes, or saved lessons.')){safeSet('fcm-recent-lessons','[]');renderPanel('recent')}});
    $$('[data-delete-note]',panel).forEach(btn=>btn.addEventListener('click',()=>{const n=Number(btn.dataset.deleteNote);if(confirm(`Delete your note for Lesson ${n}?`)){safeRemove(`sure-earning-lesson-${pad(n)}-note`);renderPanel('notes',$('#myNotesSearch')?.value||'')}}));
    $$('[data-remove-saved]',panel).forEach(btn=>btn.addEventListener('click',()=>{const n=Number(btn.dataset.removeSaved);const next=saved().filter(x=>x!==n);safeSet('fcm-favorite-lessons',JSON.stringify(next));renderPanel('saved')}));
  }

  function switchTab(name){
    $$('.my-learning-tab').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.learningTab===name)));
    $$('[data-learning-panel]').forEach(p=>p.hidden=p.dataset.learningPanel!==name);
    renderPanel(name);
  }

  function setup(){
    const home=$('#learningHome'),head=$('.learning-home-head',home||document);if(!home||!head||$('#openMyLearning'))return false;
    ensureCss();
    const open=document.createElement('button');open.id='openMyLearning';open.className='learning-home-open';open.type='button';open.textContent='Open My Learning →';head.appendChild(open);
    const dialog=document.createElement('dialog');dialog.id='myLearningDialog';dialog.className='my-learning-dialog';dialog.setAttribute('aria-labelledby','myLearningDialogTitle');
    dialog.innerHTML=`<div class="my-learning-head"><div><small>PERSONAL LEARNING WORKSPACE</small><h2 id="myLearningDialogTitle">My Learning</h2></div><button type="button" class="my-learning-close" aria-label="Close My Learning">×</button></div><div class="my-learning-tabs" role="tablist" aria-label="My Learning sections"><button class="my-learning-tab" type="button" role="tab" data-learning-tab="notes" aria-selected="true">Notes</button><button class="my-learning-tab" type="button" role="tab" data-learning-tab="saved" aria-selected="false">Saved lessons</button><button class="my-learning-tab" type="button" role="tab" data-learning-tab="recent" aria-selected="false">Recent</button><button class="my-learning-tab" type="button" role="tab" data-learning-tab="progress" aria-selected="false">Progress</button></div><div class="my-learning-body"><section data-learning-panel="notes"></section><section data-learning-panel="saved" hidden></section><section data-learning-panel="recent" hidden></section><section data-learning-panel="progress" hidden></section></div>`;
    document.body.appendChild(dialog);
    open.addEventListener('click',()=>{renderPanel('notes');if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','')});
    $('.my-learning-close',dialog)?.addEventListener('click',()=>dialog.close?dialog.close():dialog.removeAttribute('open'));
    $$('.my-learning-tab',dialog).forEach(tab=>tab.addEventListener('click',()=>switchTab(tab.dataset.learningTab)));
    dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close?.()}});
    return true;
  }

  function boot(attempt=0){
    if(!$('#curriculum'))return;
    if(!window.COURSE_MODULES?.length||!setup()){if(attempt<100)setTimeout(()=>boot(attempt+1),80)}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>boot(),{once:true});else boot();
})();
