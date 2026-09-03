(() => {
  if(document.documentElement.dataset.qualityLayerV1)return;
  document.documentElement.dataset.qualityLayerV1='true';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const pad=n=>String(n).padStart(2,'0');
  const hrefFor=n=>n<=6?`lesson-${pad(n)}.html`:`lesson.html?lesson=${n}`;
  const currentLesson=()=>{
    const data=document.body.dataset.lesson?.match(/lesson-(\d+)/i);
    const path=location.pathname.match(/lesson-(\d+)/i);
    const query=new URLSearchParams(location.search).get('lesson');
    return Number(data?.[1]||path?.[1]||query||0);
  };
  const canonicalBase='https://sonjibonbarua.github.io/Freelancing-Career-Mastery/';

  function networkMode(){
    const c=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
    if(c?.saveData)document.documentElement.dataset.saveData='true';
    if(c&&/(^|-)2g$/.test(c.effectiveType||''))document.documentElement.dataset.slowNetwork='true';
  }

  function ensureCanonical(){
    const n=currentLesson();
    let href=canonicalBase;
    if(n)href=canonicalBase+hrefFor(n);
    else if(location.pathname.endsWith('survival.html'))href=canonicalBase+'survival.html';
    let link=$('link[rel="canonical"]');
    if(!link){link=document.createElement('link');link.rel='canonical';document.head.appendChild(link)}
    link.href=href;
  }

  function ensureMeta(property,content){
    let meta=$(`meta[property="${property}"]`);
    if(!meta){meta=document.createElement('meta');meta.setAttribute('property',property);document.head.appendChild(meta)}
    meta.setAttribute('content',content);
  }
  function metaPass(){
    const n=currentLesson();
    if(n){
      const title=document.title.replace(/\s*\|\s*Freelancing Career Mastery\s*$/,'');
      const description=$('meta[name="description"]')?.content||`Lesson ${n} of Freelancing Career Mastery.`;
      ensureMeta('og:title',title);ensureMeta('og:description',description);ensureMeta('og:type','article');ensureMeta('og:url',canonicalBase+hrefFor(n));
    }else if(location.pathname.endsWith('survival.html')){
      ensureMeta('og:title','Real-Life Freelancer Survival Lab | Freelancing Career Mastery');
      ensureMeta('og:description',$('meta[name="description"]')?.content||'Interactive freelancer survival scenarios.');
      ensureMeta('og:type','website');ensureMeta('og:url',canonicalBase+'survival.html');
    }
  }

  function optimizeNode(node){
    if(node.matches?.('iframe')){if(!node.loading)node.loading='lazy';node.setAttribute('referrerpolicy',node.getAttribute('referrerpolicy')||'strict-origin-when-cross-origin')}
    if(node.matches?.('img')){if(!node.loading)node.loading='lazy';node.decoding='async'}
    node.querySelectorAll?.('iframe').forEach(f=>{if(!f.loading)f.loading='lazy';f.setAttribute('referrerpolicy',f.getAttribute('referrerpolicy')||'strict-origin-when-cross-origin')});
    node.querySelectorAll?.('img').forEach(img=>{if(!img.loading)img.loading='lazy';img.decoding='async'});
  }
  function mediaPass(){
    optimizeNode(document.documentElement);
    const observer=new MutationObserver(records=>records.forEach(r=>r.addedNodes.forEach(n=>{if(n.nodeType===1)optimizeNode(n)})));
    observer.observe(document.body,{childList:true,subtree:true});
  }

  function accessibilityPass(){
    const quiz=$('#quizResult');if(quiz){quiz.setAttribute('role','status');quiz.setAttribute('aria-live','polite')}
    $('#noteStatus')?.setAttribute('aria-live','polite');
    $('#reflectionStatus')?.setAttribute('aria-live','polite');
    $$('.course-link.active,.workspace-lesson-link.current').forEach(a=>a.setAttribute('aria-current','page'));
    $$('button:not([type])').forEach(b=>{if(!b.closest('form'))b.type='button'});
    const dialog=$('#searchPanel');if(dialog){dialog.setAttribute('aria-modal','false');const sync=()=>dialog.setAttribute('aria-hidden',String(!dialog.classList.contains('show')));new MutationObserver(sync).observe(dialog,{attributes:true,attributeFilter:['class']});sync()}
    const lessonNote=$('#lessonNote');if(lessonNote&&!lessonNote.getAttribute('aria-label'))lessonNote.setAttribute('aria-label','My lesson notes');
  }

  function boot(){networkMode();ensureCanonical();metaPass();mediaPass();accessibilityPass()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
