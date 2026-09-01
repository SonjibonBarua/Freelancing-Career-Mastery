(() => {
  if (document.documentElement.dataset.workspaceFixesV3Ready) return;
  document.documentElement.dataset.workspaceFixesV3Ready = 'true';

  const $=(s,r=document)=>r.querySelector(s);
  const body=document.body;

  function ensureCss(){
    if ($('link[data-workspace-fixes-v3-css]')) return;
    const l=document.createElement('link');
    l.rel='stylesheet';
    l.href='workspace-fixes-v2.css?v=20260901-6';
    l.dataset.workspaceFixesV3Css='true';
    document.head.appendChild(l);
  }
  ensureCss();

  function restoreVisible(){
    body.classList.remove('page-leaving');
    document.documentElement.classList.remove('page-leaving');
    body.style.setProperty('opacity','1','important');
    body.style.setProperty('visibility','visible','important');
    body.style.setProperty('filter','none','important');
    body.style.setProperty('transform','none','important');
    body.style.setProperty('pointer-events','auto','important');
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      if(body.classList.contains('page-leaving'))return;
      ['opacity','visibility','filter','transform','pointer-events'].forEach(p=>body.style.removeProperty(p));
    }));
  }

  restoreVisible();
  addEventListener('pageshow',restoreVisible,true);
  addEventListener('popstate',restoreVisible,true);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)restoreVisible()});

  function replaceNode(node){
    if(!node)return null;
    const clone=node.cloneNode(true);
    node.replaceWith(clone);
    return clone;
  }

  function boot(attempt=0){
    const sidebar=$('#sidebar');
    const rail=$('#workspaceRightRail');
    const rawCourse=$('#menuBtn');
    const rawResource=$('#workspaceToolsToggle');
    const hero=$('.hero');
    if(!sidebar||!rail||!rawCourse||!rawResource||!hero){
      if(attempt<160)setTimeout(()=>boot(attempt+1),75);
      return;
    }
    if(document.documentElement.dataset.workspaceDrawerBindings==='v5')return;
    document.documentElement.dataset.workspaceDrawerBindings='v5';

    const courseHome=rawCourse.parentElement;
    const resourceHome=rawResource.parentElement;

    /* Replace stale controls so older cached open-only listeners cannot win. */
    const courseHandle=replaceNode(rawCourse);
    const resourceHandle=replaceNode(rawResource);
    const courseClose=replaceNode($('#closeMenu'));
    const resourceClose=replaceNode($('#workspaceRailClose'));
    const overlay=$('#mobileOverlay');

    if(!courseHandle||!resourceHandle)return;
    document.documentElement.dataset.workspaceFixesReady='v2';

    const courseClosedHtml=courseHandle.innerHTML||'☰';
    const resourceClosedHtml=resourceHandle.innerHTML||'▣';
    const finePointer=matchMedia('(hover:hover) and (pointer:fine)').matches;
    let courseTimer=0, resourceTimer=0;
    let courseScrollTop=sidebar.scrollTop||0;
    let resourceScrollTop=rail.scrollTop||0;

    courseHandle.title='Open or close course navigation';
    resourceHandle.title='Open or close lesson resources';

    const mobile=()=>innerWidth<=680;
    const cancelCourse=()=>{clearTimeout(courseTimer);courseTimer=0};
    const cancelResource=()=>{clearTimeout(resourceTimer);resourceTimer=0};

    function updateDrawerAnchor(){
      if(mobile()){
        document.documentElement.style.removeProperty('--workspace-drawer-anchor-top');
        return;
      }
      const rect=hero.getBoundingClientRect();
      const top=Math.round(rect.top+scrollY+8);
      document.documentElement.style.setProperty('--workspace-drawer-anchor-top',`${top}px`);
    }

    function placeHandles(){
      if(!mobile()){
        if(courseHandle.parentElement!==hero)hero.appendChild(courseHandle);
        if(resourceHandle.parentElement!==hero)hero.appendChild(resourceHandle);
        updateDrawerAnchor();
      }else{
        if(courseHome&&courseHandle.parentElement!==courseHome)courseHome.appendChild(courseHandle);
        if(resourceHome&&resourceHandle.parentElement!==resourceHome)resourceHome.prepend(resourceHandle);
        document.documentElement.style.removeProperty('--workspace-drawer-anchor-top');
      }
    }

    function syncLock(){
      const anyOpen=sidebar.classList.contains('open')||rail.classList.contains('open');
      if(mobile()){
        overlay?.classList.toggle('show',anyOpen);
        body.style.overflow=anyOpen?'hidden':'';
      }else{
        overlay?.classList.remove('show');
        body.style.overflow='';
      }
    }

    function render(){
      const c=sidebar.classList.contains('open');
      const r=rail.classList.contains('open');
      courseHandle.classList.toggle('is-active',c);
      resourceHandle.classList.toggle('is-active',r);
      courseHandle.setAttribute('aria-expanded',String(c));
      resourceHandle.setAttribute('aria-expanded',String(r));
      courseHandle.setAttribute('aria-label',c?'Close course navigation':'Open course navigation');
      resourceHandle.setAttribute('aria-label',r?'Close lesson resources':'Open lesson resources');
      courseHandle.innerHTML=c?'×':courseClosedHtml;
      resourceHandle.innerHTML=r?'×':resourceClosedHtml;
      syncLock();
    }

    function setCourse(open){
      cancelCourse();
      if(open){rail.classList.remove('open');cancelResource()}
      sidebar.classList.toggle('open',Boolean(open));
      if(open)sidebar.scrollTop=courseScrollTop;
      render();
    }
    function setResources(open){
      cancelResource();
      if(open){sidebar.classList.remove('open');cancelCourse()}
      rail.classList.toggle('open',Boolean(open));
      if(open)rail.scrollTop=resourceScrollTop;
      render();
    }

    courseHandle.addEventListener('click',e=>{e.preventDefault();setCourse(!sidebar.classList.contains('open'))});
    resourceHandle.addEventListener('click',e=>{e.preventDefault();setResources(!rail.classList.contains('open'))});
    courseClose?.addEventListener('click',e=>{e.preventDefault();setCourse(false)});
    resourceClose?.addEventListener('click',e=>{e.preventDefault();setResources(false)});
    overlay?.addEventListener('click',()=>{setCourse(false);setResources(false)});

    document.addEventListener('keydown',e=>{
      if(e.key==='Escape'){setCourse(false);setResources(false)}
    });

    /* Drawer content keeps its own position. Scrolling the lesson does not
       touch either drawer's scrollTop; only scrolling inside the drawer does. */
    sidebar.addEventListener('scroll',()=>{courseScrollTop=sidebar.scrollTop},{passive:true});
    rail.addEventListener('scroll',()=>{resourceScrollTop=rail.scrollTop},{passive:true});
    addEventListener('scroll',()=>{
      if(sidebar.classList.contains('open'))cancelCourse();
      if(rail.classList.contains('open'))cancelResource();
    },{passive:true});

    if(finePointer){
      sidebar.addEventListener('pointerenter',cancelCourse);
      courseHandle.addEventListener('pointerenter',cancelCourse);
      sidebar.addEventListener('pointerleave',()=>{
        cancelCourse();
        courseTimer=setTimeout(()=>{
          if(!sidebar.matches(':hover')&&!courseHandle.matches(':hover')&&!sidebar.contains(document.activeElement))setCourse(false)
        },900);
      });

      rail.addEventListener('pointerenter',cancelResource);
      resourceHandle.addEventListener('pointerenter',cancelResource);
      rail.addEventListener('pointerleave',()=>{
        cancelResource();
        resourceTimer=setTimeout(()=>{
          if(!rail.matches(':hover')&&!resourceHandle.matches(':hover')&&!rail.contains(document.activeElement))setResources(false)
        },900);
      });
    }

    placeHandles();
    render();

    addEventListener('resize',()=>{placeHandles();render()},{passive:true});
    addEventListener('load',updateDrawerAnchor,{once:true});
    addEventListener('pageshow',()=>{placeHandles();setCourse(false);setResources(false);restoreVisible()});
  }

  boot();
})();