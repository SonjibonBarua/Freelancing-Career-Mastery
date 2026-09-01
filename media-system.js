(() => {
  if (document.documentElement.dataset.lessonMediaReady) return;
  document.documentElement.dataset.lessonMediaReady = 'true';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const body=document.body;
  const fromData=body.dataset.lesson?.match(/lesson-(\d+)/i);
  const fromPath=location.pathname.match(/lesson-(\d+)/i);
  const fromQuery=new URLSearchParams(location.search).get('lesson');
  const lessonNo=Number(fromData?.[1]||fromPath?.[1]||fromQuery||0);
  const spec=window.LESSON_MEDIA?.[lessonNo];
  if(!lessonNo||!spec) return;

  function ensureCss(){
    if($('link[data-media-system-css]'))return;
    const l=document.createElement('link');l.rel='stylesheet';l.href='media-system.css';l.dataset.mediaSystemCss='true';document.head.appendChild(l);
  }
  ensureCss();

  function ensureDrawerCss(){
    if($('link[data-workspace-drawers-css]'))return;
    const l=document.createElement('link');
    l.rel='stylesheet';
    l.href='workspace-drawers.css';
    l.dataset.workspaceDrawersCss='true';
    document.head.appendChild(l);
  }

  const type=spec.type||'grid';
  const horizontal=new Set(['flow','timeline','sequence','pipeline','rhythm','lanes','loop']);
  const layered=new Set(['ladder','stack','funnel','pyramid']);
  const radial=new Set(['cycle','orbit','engine','network']);
  const grid=new Set(['matrix','score','compass','persona','position','map','balance','buffer','compare','org','anatomy','box','gate','shield','boundary','decision','radar']);
  const captionFor=t=>{
    if(horizontal.has(t)) return 'Follow the model from left to right. Each step prepares the next one.';
    if(layered.has(t)) return 'Read the layers as a system: weak foundations make the higher layers harder to sustain.';
    if(radial.has(t)) return 'This is a loop, not a one-time checklist. The value comes from repeating the cycle.';
    if(t==='venn') return 'The strongest position lives where these factors overlap rather than where only one is strong.';
    return 'Use the visual as a decision checklist. Click or focus any block to isolate that factor.';
  };

  function glyphFor(item,i){
    const x=String(item).toLowerCase();
    if(/skill|capability|practice|learn/.test(x))return '✦';
    if(/service|offer|deliverable|scope|package/.test(x))return '▣';
    if(/problem|research|diagnos|discover|search/.test(x))return '⌕';
    if(/solution|idea|strategy|plan|concept/.test(x))return '✧';
    if(/value|impact|outcome|profit|authority/.test(x))return '◆';
    if(/payment|price|budget|invoice|deposit|income|revenue|money/.test(x))return '$';
    if(/trust|proof|review|testimonial|quality|verify/.test(x))return '✓';
    if(/client|audience|buyer|prospect|people|network/.test(x))return '◎';
    if(/urgent|risk|warning|red flag|scam/.test(x))return '!';
    if(/repeat|retention|recurring|loop|referral|follow/.test(x))return '↻';
    if(/growth|demand|reach|visibility|scale/.test(x))return '↗';
    if(/fit|focus|niche|position|target/.test(x))return '⊙';
    if(/build|create|production|work/.test(x))return '＋';
    if(/test|experiment|validate/.test(x))return '△';
    return ['◇','✦','◎','↗','▣','✓','↻'][i%7];
  }

  function node(item,i,indent=''){
    return `<button class="diagram-node" type="button" data-media-node="${i}" ${indent?`style="${indent}"`:''}><b>${String(i+1).padStart(2,'0')}</b><span class="diagram-icon" aria-hidden="true">${glyphFor(item,i)}</span><strong>${esc(item)}</strong></button>`;
  }

  function diagram(){
    const items=spec.items||[];
    if(type==='venn') return `<div class="lesson-diagram diagram-venn">${items.map((x,i)=>`<div class="venn-circle" tabindex="0" data-media-node="${i}"><span class="diagram-icon" aria-hidden="true">${glyphFor(x,i)}</span>${esc(x)}</div>`).join('')}</div>`;
    if(radial.has(type)){
      return `<div class="lesson-diagram diagram-${type}"><div class="diagram-center">CORE<br>LOOP</div>${items.map((x,i)=>node(x,i)).join('')}</div>`;
    }
    if(layered.has(type)){
      const count=Math.max(1,items.length-1);
      return `<div class="lesson-diagram diagram-${type}">${items.map((x,i)=>{
        let indent='';
        if(type==='ladder'||type==='stack') indent=`--indent:${Math.min(i*18,90)}px`;
        if(type==='funnel') indent=`width:${Math.max(52,100-i*(44/count))}%`;
        if(type==='pyramid') indent=`width:${Math.max(52,56+i*(44/count))}%`;
        return node(x,i,indent);
      }).join('')}</div>`;
    }
    const klass=horizontal.has(type)?type:(grid.has(type)?type:'grid');
    return `<div class="lesson-diagram diagram-${klass}">${items.map((x,i)=>node(x,i)).join('')}</div>`;
  }

  function insertVisual(){
    if($('#lessonVisualModel'))return;
    const firstSection=$('.lesson-main .lesson-section')||$('.lesson-section');
    const main=$('.lesson-main')||$('article')||$('main');
    if(!main)return;
    const section=document.createElement('section');
    section.id='lessonVisualModel';section.className='lesson-media-section reveal visible lesson-section';section.dataset.sectionTitle='Visual model';
    section.innerHTML=`<div class="lesson-media-card motion-card motion-item motion-visible"><div class="lesson-media-head"><div><span class="lesson-media-kicker">CUSTOM EDUCATIONAL DIAGRAM</span><h3>${esc(spec.title)}</h3><p>${esc(captionFor(type))}</p></div><span class="media-badge">Lesson ${lessonNo} · Visual model</span></div>${diagram()}<div class="diagram-focus" id="diagramFocus"><b>How to use it:</b><span>${esc(captionFor(type))}</span></div></div>`;
    if(firstSection) firstSection.insertAdjacentElement('afterend',section); else main.prepend(section);
    const focus=$('#diagramFocus',section);
    $$('[data-media-node]',section).forEach((el,i)=>{
      const activate=()=>{
        $$('[data-media-node]',section).forEach(n=>n.classList.remove('active'));el.classList.add('active');
        if(focus)focus.innerHTML=`<b>Focus ${String(i+1).padStart(2,'0')}:</b><span>${esc(spec.items[i])}</span>`;
      };
      el.addEventListener('click',activate);el.addEventListener('focus',activate);
    });
    const outline=$('.outline-card');
    if(outline&&!outline.querySelector('a[href="#lessonVisualModel"]')){
      const first=outline.querySelector('.outline-link');
      const a=document.createElement('a');a.href='#lessonVisualModel';a.className='outline-link';a.textContent='Visual model';
      first?.insertAdjacentElement('afterend',a);
    }
  }

  function inlineVideoSrc(v){
    const start=Number(v.start||v.startSeconds||0);
    if(v.provider==='vimeo'){
      return `https://player.vimeo.com/video/${encodeURIComponent(v.id)}?dnt=1&title=0&byline=0&portrait=0`;
    }
    const params=new URLSearchParams({rel:'0'});
    if(start>0)params.set('start',String(start));
    return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.id)}?${params.toString()}`;
  }

  function insertVideo(){
    if(!spec.video)return;
    const old=$('#video');if(old)old.remove();
    const section=document.createElement('section');section.id='video';section.className='lesson-video-section reveal visible lesson-section';section.dataset.sectionTitle='Companion video';
    const v=spec.video;
    const proof=v.credential?`<div class="inline-video-proof"><b>Why this source</b><span>${esc(v.credential)}</span></div>`:'';
    section.innerHTML=`<div class="inline-video-card motion-card motion-item motion-visible"><div class="inline-video-copy"><span class="video-chip">▶ ${esc(v.practiceType||'EXPERT IN PRACTICE')}</span><h3>${esc(v.title)}</h3><p><strong>${esc(v.channel)}</strong> · ${esc(v.note)}</p>${proof}<ul>${(v.watch||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p class="video-privacy-note">The original publisher keeps control of this YouTube video. It plays here through YouTube's privacy-enhanced embedded player.</p></div><div class="inline-video-player"><iframe src="${inlineVideoSrc(v)}" title="${esc(v.title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div></div>`;

    const firstSection=$('.lesson-main .lesson-section')||$('.lesson-section');
    const main=$('.lesson-main')||$('article')||$('main');
    if(firstSection) firstSection.insertAdjacentElement('afterend',section);
    else if(main) main.prepend(section);

    const outline=$('.outline-card');
    if(outline&&!outline.querySelector('a[href="#video"]')){
      const first=outline.querySelector('.outline-link');
      const a=document.createElement('a');a.href='#video';a.className='outline-link';a.textContent='Companion video';
      first?.insertAdjacentElement('afterend',a);
    }
  }

  function syncWorkspaceVideo(attempt=0){
    ensureDrawerCss();
    const rail=$('#workspaceRightRail');
    if(!rail){
      if(attempt<40)setTimeout(()=>syncWorkspaceVideo(attempt+1),100);
      return;
    }

    if(spec.video&&!$('#video')) insertVideo();
    const railVideo=$('.workspace-rail-video',rail);
    if(railVideo){
      $('.workspace-video-player',railVideo)?.remove();
      const note=$('.workspace-video-note',railVideo);
      if(note)note.textContent='The full companion video is placed near the beginning of the lesson so it is easy to discover while reading.';
      if(!$('.workspace-video-jump',railVideo)){
        const jump=document.createElement('a');
        jump.className='workspace-video-jump';
        jump.href='#video';
        jump.innerHTML='<span>Watch in lesson</span><b>↓</b>';
        jump.addEventListener('click',()=>rail.classList.remove('open'));
        railVideo.appendChild(jump);
      }
    }

    const resources=$$('.workspace-phase-tab').find(a=>/resources/i.test(a.textContent||''));
    if(resources&&$('#video'))resources.setAttribute('href','#video');
  }

  function removeRedirectVideoLinks(){ $$('.video-link').forEach(a=>a.remove()); }

  function loadWorkspace(){
    const existing=$('script[data-learning-workspace-loader]');
    if(existing){syncWorkspaceVideo();return;}
    const s=document.createElement('script');
    s.src='learning-workspace.js';
    s.dataset.learningWorkspaceLoader='true';
    s.addEventListener('load',()=>syncWorkspaceVideo(),{once:true});
    document.body.appendChild(s);
  }

  function loadWorkspaceFixes(){
    if($('script[data-workspace-fixes-loader]'))return;
    const s=document.createElement('script');
    s.src='workspace-fixes.js';
    s.dataset.workspaceFixesLoader='true';
    document.body.appendChild(s);
  }

  function init(){ insertVisual();insertVideo();removeRedirectVideoLinks();loadWorkspace();loadWorkspaceFixes(); }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();