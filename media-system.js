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

  function node(item,i,indent=''){
    return `<button class="diagram-node" type="button" data-media-node="${i}" ${indent?`style="${indent}"`:''}><b>${String(i+1).padStart(2,'0')}</b><strong>${esc(item)}</strong></button>`;
  }
  function diagram(){
    const items=spec.items||[];
    if(type==='venn') return `<div class="lesson-diagram diagram-venn">${items.map((x,i)=>`<div class="venn-circle" tabindex="0" data-media-node="${i}">${esc(x)}</div>`).join('')}</div>`;
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

  function insertVideo(){
    if(!spec.video)return;
    const old=$('#video');if(old)old.remove();
    const section=document.createElement('section');section.id='video';section.className='lesson-video-section reveal visible lesson-section';section.dataset.sectionTitle='Companion video';
    const v=spec.video;
    section.innerHTML=`<div class="inline-video-card motion-card motion-item motion-visible"><div class="inline-video-copy"><span class="video-chip">▶ WATCH INSIDE THIS LESSON</span><h3>${esc(v.title)}</h3><p><strong>${esc(v.channel)}</strong> · ${esc(v.note)}</p><ul>${(v.watch||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p class="video-privacy-note">The video plays directly inside this course page using YouTube's privacy-enhanced embed. Platform interfaces and policies can change, so verify current rules when the lesson depends on them.</p></div><div class="inline-video-player"><iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.id)}?rel=0" title="${esc(v.title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div></div>`;
    const anchor=$('#summary')||$('#notes')||$('#completion');
    if(anchor)anchor.insertAdjacentElement('beforebegin',section);
    else ($('.lesson-main')||$('article')||$('main'))?.appendChild(section);
    const outline=$('.outline-card');
    if(outline&&!outline.querySelector('a[href="#video"]')){
      const target=outline.querySelector('a[href="#summary"],a[href="#notes"]');
      const a=document.createElement('a');a.href='#video';a.className='outline-link';a.textContent='Companion video';
      if(target)target.insertAdjacentElement('beforebegin',a);else outline.appendChild(a);
    }
  }

  function removeRedirectVideoLinks(){
    $$('.video-link').forEach(a=>a.remove());
  }

  function init(){
    insertVisual();insertVideo();removeRedirectVideoLinks();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();