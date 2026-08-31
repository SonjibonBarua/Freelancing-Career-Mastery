(() => {
  if(document.documentElement.dataset.workspaceBooted) return;
  document.documentElement.dataset.workspaceBooted='true';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const body=document.body;
  if(!body.classList.contains('lesson-page')) return;
  const fromData=body.dataset.lesson?.match(/lesson-(\d+)/i);
  const fromPath=location.pathname.match(/lesson-(\d+)/i);
  const fromQuery=new URLSearchParams(location.search).get('lesson');
  const lessonNo=Number(fromData?.[1]||fromPath?.[1]||fromQuery||0);
  if(!lessonNo) return;
  const hrefFor=n=>n<=6?`lesson-${String(n).padStart(2,'0')}.html`:`lesson.html?lesson=${n}`;
  const complete=n=>localStorage.getItem(`sure-earning-lesson-${String(n).padStart(2,'0')}-complete`)==='true'||(n===4&&localStorage.getItem('sure-earning-class11-complete')==='true');
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));

  function ensureCss(){
    if(!$('link[data-workspace-css]')){const l=document.createElement('link');l.rel='stylesheet';l.href='learning-workspace.css';l.dataset.workspaceCss='true';document.head.appendChild(l)}
    if(!$('#workspaceEnhancementCss')){const s=document.createElement('style');s.id='workspaceEnhancementCss';s.textContent=`
      .workspace-phase-tabs{width:min(100% - 36px,980px);margin:0 auto;padding:10px 0 0;display:flex;gap:5px;overflow:auto;scrollbar-width:none;border-bottom:1px solid var(--line)}
      .workspace-phase-tabs::-webkit-scrollbar{display:none}.workspace-phase-tab{flex:0 0 auto;display:flex;align-items:center;gap:7px;padding:11px 13px;border-bottom:2px solid transparent;color:var(--muted);text-decoration:none;font-size:.7rem;font-weight:800;transition:.2s}.workspace-phase-tab i{font-style:normal;color:var(--primary)}.workspace-phase-tab:hover,.workspace-phase-tab.active{color:var(--text);border-bottom-color:var(--primary);background:linear-gradient(180deg,transparent,var(--primary-soft))}
      @media(max-width:1180px){.workspace-phase-tabs{width:min(100% - 30px,980px)}}@media(max-width:680px){.workspace-phase-tabs{width:calc(100% - 22px);padding-top:6px}.workspace-phase-tab{padding:10px 9px;font-size:.63rem}}
    `;document.head.appendChild(s)}
  }
  ensureCss();

  function withCourseData(callback){
    if(window.COURSE_MODULES?.length){callback();return;}
    const existing=$('script[data-workspace-course-data]');if(existing){existing.addEventListener('load',callback,{once:true});return;}
    const s=document.createElement('script');s.src='course-data.js';s.dataset.workspaceCourseData='true';s.onload=callback;document.body.appendChild(s);
  }

  function init(){
    const modules=window.COURSE_MODULES||[];
    const all=modules.flatMap(m=>m.lessons.map(l=>({...l,moduleId:m.id,moduleTitle:m.title})));
    const current=all.find(l=>l.n===lessonNo);
    const currentModule=modules.find(m=>m.id===current?.moduleId)||modules.find(m=>m.lessons.some(l=>l.n===lessonNo));
    body.classList.add('workspace-ready');
    setupSidebar(modules,currentModule);
    setupTopbar(all,current);
    setupPhaseTabs();
    setupRightRail(all,current,currentModule);
    setTimeout(()=>$('.workspace-lesson-link.current')?.scrollIntoView({block:'center'}),80);
  }

  function setupSidebar(modules,currentModule){
    const sidebar=$('#sidebar');if(!sidebar)return;
    const nav=$('.side-nav',sidebar);if(!nav)return;
    const completed=modules.flatMap(m=>m.lessons).filter(l=>complete(l.n)).length;
    const pct=Math.round(completed/64*100);
    const moduleHtml=modules.map(m=>{
      const isCurrent=m.id===currentModule?.id;
      const done=m.lessons.filter(l=>complete(l.n)).length;
      const lessons=m.lessons.map(l=>`<a class="workspace-lesson-link ${l.n===lessonNo?'current':''} ${complete(l.n)?'done':''}" href="${hrefFor(l.n)}"><span class="workspace-lesson-dot">${complete(l.n)?'✓':String(l.n).padStart(2,'0')}</span><span><strong>Lesson ${l.n}</strong><small>${esc(l.title)}</small></span><span class="workspace-lesson-state">${complete(l.n)?'●':''}</span></a>`).join('');
      return `<section class="workspace-module ${isCurrent?'current open':''}" data-workspace-module="${m.id}"><button type="button" class="workspace-module-head" aria-expanded="${isCurrent?'true':'false'}"><span class="workspace-module-num">${String(m.id).padStart(2,'0')}</span><span><strong>Module ${m.id} · ${esc(m.title)}</strong><small>${done}/${m.lessons.length} completed · ${esc(m.level||'')}</small></span><span class="workspace-module-caret">⌄</span></button><div class="workspace-module-lessons">${lessons}</div></section>`;
    }).join('');
    nav.innerHTML=`<div class="workspace-side-progress"><div class="workspace-side-progress-head"><strong>Course Progress</strong><small>${completed} / 64</small></div><div class="workspace-side-meter"><span style="width:${pct}%"></span></div></div><div class="workspace-course-nav">${moduleHtml}</div><a class="workspace-survival-link" href="survival.html"><b>◇</b><span><strong>Real-Life Survival Lab</strong><small>Pressure-test your freelancer judgment</small></span></a>`;
    $$('.workspace-module-head',nav).forEach(btn=>btn.addEventListener('click',()=>{const section=btn.closest('.workspace-module');const open=section.classList.toggle('open');btn.setAttribute('aria-expanded',String(open))}));
    const footer=$('.sidebar-footer',sidebar);if(footer)footer.innerHTML=`<span class="status-dot"></span><span>Lesson ${lessonNo} · ${pct}% course progress</span>`;
    const brandSmall=$('.side-brand small',sidebar);if(brandSmall)brandSmall.textContent='64-Lesson Professional Roadmap';
  }

  function setupTopbar(all,current){
    const bar=$('.topbar');if(!bar||$('.workspace-top-nav',bar))return;
    const prev=lessonNo>1?lessonNo-1:null,next=lessonNo<64?lessonNo+1:null;
    const nav=document.createElement('div');nav.className='workspace-top-nav';
    nav.innerHTML=`<a class="workspace-nav-arrow ${!prev?'disabled':''}" href="${prev?hrefFor(prev):'#'}" aria-label="Previous lesson">‹</a><div class="workspace-lesson-count"><small>LESSON ${lessonNo} OF 64</small><strong>${esc(current?.title||document.title.replace(/^Lesson\s*\d+\s*[—-]\s*/,'').split('|')[0])}</strong></div><a class="workspace-nav-arrow ${!next?'disabled':''}" href="${next?hrefFor(next):'survival.html'}" aria-label="Next lesson">›</a>`;
    const title=$('.topbar-title',bar);title?.insertAdjacentElement('beforebegin',nav);
    const completed=all.filter(l=>complete(l.n)).length;const pct=Math.round(completed/64*100);
    const overall=document.createElement('div');overall.className='workspace-overall';overall.innerHTML=`<small>Overall Progress</small><div class="workspace-overall-meter"><span style="width:${pct}%"></span></div><b>${pct}%</b>`;
    const actions=$('.top-actions',bar);actions?.insertAdjacentElement('beforebegin',overall);
    if(actions&&!$('#workspaceToolsToggle')){const t=document.createElement('button');t.className='icon-btn workspace-tools-toggle';t.id='workspaceToolsToggle';t.type='button';t.setAttribute('aria-label','Open lesson tools');t.textContent='▣';actions.prepend(t)}
  }

  function setupPhaseTabs(){
    if($('#workspacePhaseTabs'))return;
    const hero=$('.hero');if(!hero)return;
    const candidates=[
      ['✦','Learn','#overview'],
      ['✓','Practice',$('#action')?'#action':($('#practice-lab')?'#practice-lab':'#lessonVisualModel')],
      ['▣','Quiz',$('#quiz')?'#quiz':'#practice-lab'],
      ['◇','Reflection',$('#notes')?'#notes':'#completion'],
      ['↗','Resources',$('#video')?'#video':'#lessonVisualModel']
    ].filter(x=>x[2]&&$(x[2]));
    if(!candidates.length)return;
    const tabs=document.createElement('nav');tabs.id='workspacePhaseTabs';tabs.className='workspace-phase-tabs';tabs.setAttribute('aria-label','Lesson learning stages');
    tabs.innerHTML=candidates.map((x,i)=>`<a class="workspace-phase-tab ${i===0?'active':''}" href="${x[2]}"><i>${x[0]}</i><span>${x[1]}</span></a>`).join('');
    hero.insertAdjacentElement('afterend',tabs);
    const map=new Map(candidates.map(x=>[x[2],$(x[2])]));
    if('IntersectionObserver' in window){const o=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;$$('.workspace-phase-tab',tabs).forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${e.target.id}`))}),{rootMargin:'-22% 0px -65% 0px',threshold:.01});map.forEach(el=>el&&o.observe(el))}
  }

  function videoInfo(){
    const spec=window.LESSON_MEDIA?.[lessonNo]?.video;
    if(spec){const provider=spec.provider||'youtube';return {provider,id:spec.id,title:spec.title,channel:spec.channel,note:spec.note,watch:spec.watch||[]}}
    const central=$('#video');const iframe=$('iframe',central||document);if(!central||!iframe)return null;
    const src=iframe.src||'';let provider='youtube',id='';
    if(src.includes('vimeo.com')){provider='vimeo';id=(src.match(/video\/(\d+)/)||[])[1]||''}else{id=(src.match(/embed\/([^?&/]+)/)||[])[1]||''}
    if(!id)return null;
    return {provider,id,title:$('h3',central)?.textContent||iframe.title||'Companion video',channel:$('.resource-chip',central)?.textContent?.replace(/^▶\s*/,'')||'Companion resource',note:$('.video-resource p',central)?.textContent||'Watch this resource without leaving the lesson.',watch:[]};
  }

  function videoCard(v){
    if(!v)return '';
    const src=v.provider==='vimeo'?`https://player.vimeo.com/video/${encodeURIComponent(v.id)}?dnt=1`:`https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.id)}?rel=0`;
    return `<section class="workspace-rail-card workspace-rail-video"><div class="workspace-video-copy"><small>▶ COMPANION VIDEO</small><strong>${esc(v.title)}</strong><p>${esc(v.channel||'External educator')}</p></div><div class="workspace-video-player"><iframe src="${src}" title="${esc(v.title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><div class="workspace-video-note">Watch directly here. ${esc(v.note||'Use the video to reinforce the lesson, then return to the practice below.')}</div></section>`;
  }

  function getTakeaway(){
    const advanced=window.ADVANCED_LESSONS?.[lessonNo]?.takeaways;
    if(advanced?.length)return advanced[0];
    const dom=$('.lesson-summary strong, .takeaway-card strong, #summary li, .key-takeaways li');
    if(dom)return dom.textContent.trim();
    const spec=window.LESSON_MEDIA?.[lessonNo];
    if(spec?.items?.length)return `${spec.items.slice(0,3).join(' → ')}. Use the visual model as a decision rule, not just a diagram.`;
    return 'Turn the lesson into one concrete action, then test it in realistic client work.';
  }

  function setupRightRail(all,current,currentModule){
    if($('#workspaceRightRail'))return;
    const v=videoInfo();
    const completed=complete(lessonNo);
    const rail=document.createElement('aside');rail.id='workspaceRightRail';rail.className='workspace-right-rail';rail.setAttribute('aria-label','Lesson tools and companion resources');
    const spec=window.LESSON_MEDIA?.[lessonNo];
    rail.innerHTML=`<button class="icon-btn workspace-rail-close" id="workspaceRailClose" type="button" aria-label="Close lesson tools" style="display:none;align-self:flex-end">×</button>${videoCard(v)}<section class="workspace-rail-card workspace-rail-pad"><div class="workspace-rail-title"><strong>Lesson Progress</strong><small id="workspaceLessonPct">${completed?'100':'0'}%</small></div><div class="workspace-rail-meter"><span id="workspaceLessonMeter" style="width:${completed?'100':'0'}%"></span></div><div class="workspace-rail-progress-value"><span>Module ${currentModule?.id||''} · Lesson ${lessonNo}</span><b id="workspaceLessonState">${completed?'Completed':'In progress'}</b></div></section><section class="workspace-rail-card workspace-rail-pad"><div class="workspace-rail-title"><strong>Lesson Tools</strong><small>Quick actions</small></div><div class="workspace-tool-list"><button class="workspace-tool" id="workspaceComplete"><i>✓</i><span>${completed?'Mark as incomplete':'Mark lesson complete'}</span></button><button class="workspace-tool" id="workspaceFavorite"><i>♡</i><span>Save lesson to favorites</span></button><button class="workspace-tool" id="workspacePrint"><i>⇩</i><span>Print / Save lesson PDF</span></button><button class="workspace-tool" id="workspaceCopy"><i>↗</i><span>Copy lesson link</span></button><button class="workspace-tool" id="workspaceDashboard"><i>⌂</i><span>Back to course dashboard</span></button></div></section>${!v&&spec?.items?.length?`<section class="workspace-rail-card workspace-rail-pad"><div class="workspace-rail-title"><strong>Visual Model</strong><small>${esc(spec.title)}</small></div><div class="workspace-visual-mini">${spec.items.slice(0,6).map(x=>`<span>${esc(x)}</span>`).join('')}</div></section>`:''}<section class="workspace-rail-card workspace-rail-pad workspace-takeaway"><div class="workspace-rail-title"><strong><span class="takeaway-icon">✦</span> Key Takeaway</strong><small>Carry forward</small></div><p>${esc(getTakeaway())}</p></section>`;
    document.body.appendChild(rail);
    if(v){const central=$('#video');if(central)central.remove()}
    setupRailActions(rail);
    updateReadingProgress(rail);
    addEventListener('scroll',()=>updateReadingProgress(rail),{passive:true});
    const toggle=$('#workspaceToolsToggle');toggle?.addEventListener('click',()=>rail.classList.add('open'));
    $('#workspaceRailClose',rail)?.addEventListener('click',()=>rail.classList.remove('open'));
    const renderClose=()=>{const c=$('#workspaceRailClose',rail);if(c)c.style.display=innerWidth<=1180?'grid':'none'};renderClose();addEventListener('resize',renderClose);
  }

  function setupRailActions(rail){
    const favKey='fcm-favorite-lessons';let fav=[];try{fav=JSON.parse(localStorage.getItem(favKey)||'[]')}catch(_){fav=[]}
    const favBtn=$('#workspaceFavorite',rail);const renderFav=()=>{const on=fav.includes(lessonNo);if(favBtn){$('i',favBtn).textContent=on?'♥':'♡';$('span',favBtn).textContent=on?'Saved to favorites':'Save lesson to favorites'}};renderFav();
    favBtn?.addEventListener('click',()=>{fav=fav.includes(lessonNo)?fav.filter(n=>n!==lessonNo):[...fav,lessonNo];localStorage.setItem(favKey,JSON.stringify(fav));renderFav()});
    $('#workspaceComplete',rail)?.addEventListener('click',()=>{const btn=$('#completeBtn,#markCompleteHero');btn?.click();setTimeout(()=>{const done=complete(lessonNo);const w=$('#workspaceComplete',rail);if(w)$('span',w).textContent=done?'Mark as incomplete':'Mark lesson complete';const state=$('#workspaceLessonState',rail);if(state)state.textContent=done?'Completed':'In progress';updateReadingProgress(rail)},80)});
    $('#workspacePrint',rail)?.addEventListener('click',()=>{const b=$('#printBtn');if(b)b.click();else window.print()});
    $('#workspaceCopy',rail)?.addEventListener('click',()=>{const b=$('#copyLinkBtn');if(b)b.click();else navigator.clipboard?.writeText(location.href.split('#')[0])});
    $('#workspaceDashboard',rail)?.addEventListener('click',()=>location.href='index.html');
  }

  function updateReadingProgress(rail){
    const max=document.documentElement.scrollHeight-innerHeight;const read=max?Math.min(100,Math.max(0,Math.round(scrollY/max*100))):0;const pct=complete(lessonNo)?100:read;
    const meter=$('#workspaceLessonMeter',rail),label=$('#workspaceLessonPct',rail);if(meter)meter.style.width=`${pct}%`;if(label)label.textContent=`${pct}%`;
  }

  withCourseData(init);
})();