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

  function themeChrome(){
    let meta=$('meta[name="theme-color"]');
    if(!meta){meta=document.createElement('meta');meta.name='theme-color';document.head.appendChild(meta)}
    meta.content='#071007';
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

  function semanticNode(node){
    const roots=[];
    if(node.nodeType===1)roots.push(node);
    const all=(selector)=>roots.flatMap(root=>[...(root.matches?.(selector)?[root]:[]),...(root.querySelectorAll?.(selector)||[])]);
    all('#quizResult,.feedback,.branch-feedback').forEach(el=>{el.setAttribute('role','status');el.setAttribute('aria-live','polite')});
    all('#noteStatus,#reflectionStatus').forEach(el=>el.setAttribute('aria-live','polite'));
    all('.course-link.active,.workspace-lesson-link.current').forEach(a=>a.setAttribute('aria-current','page'));
    all('button:not([type])').forEach(b=>{if(!b.closest('form'))b.type='button'});
    all('#lessonNote').forEach(t=>{if(!t.getAttribute('aria-label'))t.setAttribute('aria-label','My lesson notes')});
    all('#caseReflection').forEach(t=>{if(!t.getAttribute('aria-label'))t.setAttribute('aria-label','My reflection for this Survival Lab case')});
  }

  function dynamicQualityPass(){
    optimizeNode(document.documentElement);semanticNode(document.documentElement);
    const observer=new MutationObserver(records=>records.forEach(r=>r.addedNodes.forEach(n=>{if(n.nodeType===1){optimizeNode(n);semanticNode(n)}})));
    observer.observe(document.body,{childList:true,subtree:true});
  }

  function accessibilityPass(){
    const dialog=$('#searchPanel');
    if(dialog){
      dialog.setAttribute('aria-modal','false');
      const sync=()=>dialog.setAttribute('aria-hidden',String(!dialog.classList.contains('show')));
      new MutationObserver(sync).observe(dialog,{attributes:true,attributeFilter:['class']});sync();
    }
  }

  function boot(){networkMode();themeChrome();ensureCanonical();metaPass();dynamicQualityPass();accessibilityPass()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
