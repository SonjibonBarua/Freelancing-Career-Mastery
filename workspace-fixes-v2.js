(() => {
  /* This flag is intentionally shared with the previous stability patch so the
     older late-loaded script exits instead of binding duplicate handlers. */
  if (document.documentElement.dataset.workspaceFixesReady) return;
  document.documentElement.dataset.workspaceFixesReady = 'v2';

  const $ = (s, r = document) => r.querySelector(s);
  const body = document.body;

  function ensureCss(){
    if ($('link[data-workspace-fixes-v2-css]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'workspace-fixes-v2.css?v=20260901-2';
    link.dataset.workspaceFixesV2Css = 'true';
    document.head.appendChild(link);
  }
  ensureCss();

  /* BFCache/history recovery. The premium page-out animation uses a fill mode,
     so a restored page can otherwise keep the final transparent frame. */
  function restoreVisiblePage(){
    body.classList.remove('page-leaving');
    document.documentElement.classList.remove('page-leaving');

    body.style.setProperty('opacity', '1', 'important');
    body.style.setProperty('visibility', 'visible', 'important');
    body.style.setProperty('filter', 'none', 'important');
    body.style.setProperty('transform', 'none', 'important');
    body.style.setProperty('pointer-events', 'auto', 'important');

    try {
      body.getAnimations().forEach(animation => {
        const name = String(animation.animationName || animation.effect?.getTiming?.().easing || '');
        if (/premiumPageOut|page-leav/i.test(name)) animation.cancel();
      });
    } catch (_) {}

    if (!body.classList.contains('premium-ready')) body.classList.add('premium-ready');

    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (body.classList.contains('page-leaving')) return;
      ['opacity','visibility','filter','transform','pointer-events'].forEach(prop => body.style.removeProperty(prop));
    }));
  }

  restoreVisiblePage();
  addEventListener('pageshow', restoreVisiblePage, {capture:true});
  addEventListener('popstate', restoreVisiblePage, {capture:true});
  addEventListener('focus', restoreVisiblePage);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) restoreVisiblePage(); });
  addEventListener('pagehide', e => { if (e.persisted) body.classList.remove('page-leaving'); });

  function boot(attempt = 0){
    const sidebar = $('#sidebar');
    const rail = $('#workspaceRightRail');
    const courseHandle = $('#menuBtn');
    const resourceHandle = $('#workspaceToolsToggle');

    if (!sidebar || !rail || !courseHandle || !resourceHandle) {
      if (attempt < 120) setTimeout(() => boot(attempt + 1), 75);
      return;
    }
    if (document.documentElement.dataset.workspaceDrawerBindings === 'v2') return;
    document.documentElement.dataset.workspaceDrawerBindings = 'v2';

    const closeCourse = $('#closeMenu');
    const closeResources = $('#workspaceRailClose');
    const overlay = $('#mobileOverlay');
    const finePointer = matchMedia('(hover:hover) and (pointer:fine)').matches;
    let courseTimer = 0;
    let resourceTimer = 0;

    courseHandle.dataset.closedGlyph = courseHandle.textContent || '☰';
    resourceHandle.dataset.closedGlyph = resourceHandle.textContent || '▣';
    courseHandle.title = 'Open or close course navigation';
    resourceHandle.title = 'Open or close lesson resources';

    const mobile = () => innerWidth <= 680;
    const cancelCourseTimer = () => { clearTimeout(courseTimer); courseTimer = 0; };
    const cancelResourceTimer = () => { clearTimeout(resourceTimer); resourceTimer = 0; };

    function syncLock(){
      const anyOpen = sidebar.classList.contains('open') || rail.classList.contains('open');
      if (mobile()) {
        overlay?.classList.toggle('show', anyOpen);
        body.style.overflow = anyOpen ? 'hidden' : '';
      } else {
        overlay?.classList.remove('show');
        body.style.overflow = '';
      }
    }

    function render(){
      const courseOpen = sidebar.classList.contains('open');
      const resourcesOpen = rail.classList.contains('open');

      courseHandle.classList.toggle('is-active', courseOpen);
      resourceHandle.classList.toggle('is-active', resourcesOpen);
      courseHandle.setAttribute('aria-expanded', String(courseOpen));
      resourceHandle.setAttribute('aria-expanded', String(resourcesOpen));
      courseHandle.setAttribute('aria-label', courseOpen ? 'Close course navigation' : 'Open course navigation');
      resourceHandle.setAttribute('aria-label', resourcesOpen ? 'Close lesson resources' : 'Open lesson resources');

      /* The same edge button becomes an obvious minimize control. */
      courseHandle.textContent = courseOpen ? '×' : courseHandle.dataset.closedGlyph;
      resourceHandle.textContent = resourcesOpen ? '×' : resourceHandle.dataset.closedGlyph;
      syncLock();
    }

    function setCourse(open){
      cancelCourseTimer();
      if (open) {
        rail.classList.remove('open');
        cancelResourceTimer();
      }
      sidebar.classList.toggle('open', Boolean(open));
      render();
    }

    function setResources(open){
      cancelResourceTimer();
      if (open) {
        sidebar.classList.remove('open');
        cancelCourseTimer();
      }
      rail.classList.toggle('open', Boolean(open));
      render();
    }

    /* Capture phase replaces the older open-only bubble handlers. */
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

    closeCourse?.addEventListener('click', e => {
      e.preventDefault();
      e.stopImmediatePropagation();
      setCourse(false);
    }, true);

    closeResources?.addEventListener('click', e => {
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

    /* Desktop pointer users get auto-collapse after leaving the actual panel.
       The delay avoids accidental closes while moving toward the edge handle. */
    if (finePointer) {
      sidebar.addEventListener('pointerenter', cancelCourseTimer);
      sidebar.addEventListener('pointerleave', () => {
        cancelCourseTimer();
        courseTimer = setTimeout(() => {
          if (!sidebar.matches(':hover') && !courseHandle.matches(':hover') && !sidebar.contains(document.activeElement)) setCourse(false);
        }, 650);
      });
      courseHandle.addEventListener('pointerenter', cancelCourseTimer);

      rail.addEventListener('pointerenter', cancelResourceTimer);
      rail.addEventListener('pointerleave', () => {
        cancelResourceTimer();
        resourceTimer = setTimeout(() => {
          if (!rail.matches(':hover') && !resourceHandle.matches(':hover') && !rail.contains(document.activeElement)) setResources(false);
        }, 650);
      });
      resourceHandle.addEventListener('pointerenter', cancelResourceTimer);
    }

    sidebar.addEventListener('focusout', () => setTimeout(() => {
      if (!sidebar.contains(document.activeElement) && !sidebar.matches(':hover')) setCourse(false);
    }, 100));
    rail.addEventListener('focusout', () => setTimeout(() => {
      if (!rail.contains(document.activeElement) && !rail.matches(':hover')) setResources(false);
    }, 100));

    addEventListener('resize', render, {passive:true});
    addEventListener('pageshow', () => { setCourse(false); setResources(false); restoreVisiblePage(); });
    render();
  }

  boot();
})();