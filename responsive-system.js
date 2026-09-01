(() => {
  if(document.documentElement.dataset.responsiveSystemV1) return;
  document.documentElement.dataset.responsiveSystemV1='true';
  const $=(s,r=document)=>r.querySelector(s);
  const body=document.body;
  const phone=()=>matchMedia('(max-width:767px)').matches;

  function setDeviceClass(){
    const w=innerWidth;
    document.documentElement.dataset.deviceClass=w<=480?'phone-small':w<=767?'phone':w<=1024?'tablet':w<=1366?'compact-desktop':'desktop';
  }
  setDeviceClass();
  addEventListener('resize',setDeviceClass,{passive:true});
  addEventListener('orientationchange',()=>setTimeout(setDeviceClass,120),{passive:true});

  function cleanHref(a){
    if(!a||a.classList.contains('disabled')) return null;
    const href=a.getAttribute('href');
    return href&&href!=='#'?href:null;
  }

  function setupLessonMobile(attempt=0){
    if(!body.classList.contains('lesson-page')) return;
    const course=$('#menuBtn');
    const resources=$('#workspaceToolsToggle');
    const sidebar=$('#sidebar');
    const rail=$('#workspaceRightRail');
    const nav=[...document.querySelectorAll('.workspace-top-nav .workspace-nav-arrow')];
    if(!course||!resources||!sidebar||!rail||nav.length<2){
      if(attempt<180)setTimeout(()=>setupLessonMobile(attempt+1),80);
      return;
    }

    let dock=$('#mobileLearningDock');
    if(!dock){
      dock=document.createElement('nav');
      dock.id='mobileLearningDock';
      dock.className='mobile-learning-dock';
      dock.setAttribute('aria-label','Mobile lesson navigation');
      dock.innerHTML=`
        <button type="button" id="mobileCourseBtn" aria-label="Open course navigation"><b>☰</b><span>Course</span></button>
        <a id="mobilePrevBtn" aria-label="Previous lesson"><b>‹</b><span>Previous</span></a>
        <a id="mobileNextBtn" aria-label="Next lesson"><b>›</b><span>Next</span></a>
        <button type="button" id="mobileResourcesBtn" aria-label="Open lesson resources"><b>▣</b><span>Resources</span></button>`;
      document.body.appendChild(dock);
    }

    const courseBtn=$('#mobileCourseBtn',dock), resourceBtn=$('#mobileResourcesBtn',dock);
    const prevBtn=$('#mobilePrevBtn',dock), nextBtn=$('#mobileNextBtn',dock);
    const prevHref=cleanHref(nav[0]), nextHref=cleanHref(nav[nav.length-1]);
    if(prevHref){prevBtn.href=prevHref;prevBtn.classList.remove('is-disabled')}else{prevBtn.removeAttribute('href');prevBtn.classList.add('is-disabled')}
    if(nextHref){nextBtn.href=nextHref;nextBtn.classList.remove('is-disabled')}else{nextBtn.removeAttribute('href');nextBtn.classList.add('is-disabled')}

    if(!courseBtn.dataset.bound){
      courseBtn.dataset.bound='true';
      courseBtn.addEventListener('click',()=>course.click());
      resourceBtn.addEventListener('click',()=>resources.click());
    }

    const sync=()=>{
      const c=sidebar.classList.contains('open'),r=rail.classList.contains('open');
      courseBtn.classList.toggle('is-primary',c);
      resourceBtn.classList.toggle('is-primary',r);
      courseBtn.setAttribute('aria-expanded',String(c));
      resourceBtn.setAttribute('aria-expanded',String(r));
      courseBtn.querySelector('b').textContent=c?'×':'☰';
      courseBtn.querySelector('span').textContent=c?'Close':'Course';
      resourceBtn.querySelector('b').textContent=r?'×':'▣';
      resourceBtn.querySelector('span').textContent=r?'Close':'Resources';
    };
    new MutationObserver(sync).observe(sidebar,{attributes:true,attributeFilter:['class']});
    new MutationObserver(sync).observe(rail,{attributes:true,attributeFilter:['class']});
    sync();

    /* Swipe down on either mobile sheet to dismiss it. */
    [sidebar,rail].forEach((panel)=>{
      if(panel.dataset.mobileSwipeBound)return;
      panel.dataset.mobileSwipeBound='true';
      let startY=0,startX=0,tracking=false;
      panel.addEventListener('touchstart',e=>{
        if(!phone()||e.touches.length!==1)return;
        startY=e.touches[0].clientY;startX=e.touches[0].clientX;tracking=true;
      },{passive:true});
      panel.addEventListener('touchend',e=>{
        if(!tracking||!phone())return;tracking=false;
        const t=e.changedTouches[0];
        const dy=t.clientY-startY,dx=Math.abs(t.clientX-startX);
        if(dy>75&&dx<70){
          if(panel===sidebar&&sidebar.classList.contains('open'))course.click();
          if(panel===rail&&rail.classList.contains('open'))resources.click();
        }
      },{passive:true});
    });

    addEventListener('pageshow',()=>{requestAnimationFrame(sync)},{once:true});
  }

  function optimizeMedia(){
    document.querySelectorAll('iframe').forEach(f=>{if(!f.loading)f.loading='lazy'});
    document.querySelectorAll('img').forEach(img=>{if(!img.loading)img.loading='lazy';img.decoding='async'});
  }

  function boot(){
    optimizeMedia();
    setupLessonMobile();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();