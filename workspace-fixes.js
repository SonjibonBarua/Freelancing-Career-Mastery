(() => {
  if (document.documentElement.dataset.workspaceFixesReady) return;
  document.documentElement.dataset.workspaceFixesReady = 'true';

  const $ = (s, r = document) => r.querySelector(s);
  const body = document.body;

  function ensureCss(){
    if ($('link[data-workspace-fixes-css]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'workspace-fixes.css';
    link.dataset.workspaceFixesCss = 'true';
    document.head.appendChild(link);
  }
  ensureCss();

  /* A page can be restored from the browser back/forward cache with the
     outgoing page-transition class still applied. Remove every visual state
     that can leave the restored page transparent/black. */
  function restorePageFromHistory(){
    body.classList.remove('page-leaving');
    document.documentElement.classList.remove('page-leaving');
    ['opacity','filter','transform','pointer-events','visibility'].forEach(p => body.style.removeProperty(p));
    if (!body.classList.contains('premium-ready')) body.classList.add('premium-ready');
  }
  restorePageFromHistory();
  addEventListener('pageshow', restorePageFromHistory);
  addEventListener('pagehide', e => {
    if (e.persisted) body.classList.remove('page-leaving');
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) restorePageFromHistory();
  });

  function boot(attempt = 0){
    const sidebar = $('#sidebar');
    const rail = $('#workspaceRightRail');
    const courseHandle = $('#menuBtn');
    const resourceHandle = $('#workspaceToolsToggle');
    if (!sidebar || !rail || !courseHandle || !resourceHandle) {
      if (attempt < 80) setTimeout(() => boot(attempt + 1), 100);
      return;
    }

    const closeCourseButton = $('#closeMenu');
    const closeResourceButton = $('#workspaceRailClose');
    const overlay = $('#mobileOverlay');
    const finePointer = matchMedia('(hover:hover) and (pointer:fine)').matches;
    let courseTimer = 0;
    let resourceTimer = 0;

    const compact = () => innerWidth <= 680;
    const cancelCourseClose = () => { clearTimeout(courseTimer); courseTimer = 0; };
    const cancelResourceClose = () => { clearTimeout(resourceTimer); resourceTimer = 0; };

    function syncPageLock(){
      const open = sidebar.classList.contains('open') || rail.classList.contains('open');
      if (compact()) {
        overlay?.classList.toggle('show', open);
        body.style.overflow = open ? 'hidden' : '';
      } else {
        overlay?.classList.remove('show');
        body.style.overflow = '';
      }
    }

    function renderHandleState(){
      const courseOpen = sidebar.classList.contains('open');
      const resourceOpen = rail.classList.contains('open');
      courseHandle.classList.toggle('is-active', courseOpen);
      resourceHandle.classList.toggle('is-active', resourceOpen);
      courseHandle.setAttribute('aria-expanded', String(courseOpen));
      resourceHandle.setAttribute('aria-expanded', String(resourceOpen));
      courseHandle.setAttribute('aria-label', courseOpen ? 'Close course navigation' : 'Open course navigation');
      resourceHandle.setAttribute('aria-label', resourceOpen ? 'Close lesson resources' : 'Open lesson resources');
      syncPageLock();
    }

    function setCourse(open){
      cancelCourseClose();
      if (open) {
        rail.classList.remove('open');
        cancelResourceClose();
      }
      sidebar.classList.toggle('open', Boolean(open));
      renderHandleState();
    }

    function setResources(open){
      cancelResourceClose();
      if (open) {
        sidebar.classList.remove('open');
        cancelCourseClose();
      }
      rail.classList.toggle('open', Boolean(open));
      renderHandleState();
    }

    /* Capture-phase handlers deliberately replace older open-only handlers. */
    courseHandle.addEventListener('click', e => {
      e.preventDefault();
      e.stopImmediatePropagation();
      setCourse(!sidebar.classList.contains('open'));
    }, true);

    resourceHandle.addEventListener('click', e => {
      e.preventDefault();
      e.stopImmediatePropagation();
      setResources(!rail.classList.contains('open'));
    }, true);

    closeCourseButton?.addEventListener('click', e => {
      e.preventDefault();
      e.stopImmediatePropagation();
      setCourse(false);
    }, true);

    closeResourceButton?.addEventListener('click', e => {
      e.preventDefault();
      e.stopImmediatePropagation();
      setResources(false);
    }, true);

    overlay?.addEventListener('click', () => {
      setCourse(false);
      setResources(false);
    }, true);

    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      setCourse(false);
      setResources(false);
    });

    if (finePointer) {
      sidebar.addEventListener('mouseenter', cancelCourseClose);
      sidebar.addEventListener('mouseleave', () => {
        cancelCourseClose();
        courseTimer = setTimeout(() => {
          if (!sidebar.matches(':hover') && !sidebar.contains(document.activeElement)) setCourse(false);
        }, 520);
      });
      rail.addEventListener('mouseenter', cancelResourceClose);
      rail.addEventListener('mouseleave', () => {
        cancelResourceClose();
        resourceTimer = setTimeout(() => {
          if (!rail.matches(':hover') && !rail.contains(document.activeElement)) setResources(false);
        }, 520);
      });
    }

    sidebar.addEventListener('focusout', () => setTimeout(() => {
      if (!sidebar.contains(document.activeElement) && !sidebar.matches(':hover')) setCourse(false);
    }, 80));
    rail.addEventListener('focusout', () => setTimeout(() => {
      if (!rail.contains(document.activeElement) && !rail.matches(':hover')) setResources(false);
    }, 80));

    addEventListener('resize', renderHandleState, {passive:true});
    renderHandleState();
  }

  boot();
})();