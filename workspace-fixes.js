(() => {
  if (document.documentElement.dataset.workspaceFixesV3Ready) return;
  if (document.querySelector('script[data-workspace-stability-v3-loader]')) return;

  const appendSoftNeonPalette=(force=false)=>{
    if(force){
      document.querySelectorAll('link[data-neon-theme],link[data-neon-continuous]').forEach(link=>link.remove());
    }
    if(!document.querySelector('link[data-neon-theme]')){
      const theme=document.createElement('link');
      theme.rel='stylesheet';
      theme.href='palette-theme.css?v=20260903-softneon1';
      theme.dataset.neonTheme='true';
      document.head.appendChild(theme);
    }
    if(!document.querySelector('link[data-neon-continuous]')){
      const canvas=document.createElement('link');
      canvas.rel='stylesheet';
      canvas.href='palette-continuous.css?v=20260903-softneon1';
      canvas.dataset.neonContinuous='true';
      document.head.appendChild(canvas);
    }
  };

  const appendResponsive=()=>{
    document.querySelectorAll('link[data-responsive-system-final]').forEach(link=>link.remove());
    const css=document.createElement('link');
    css.rel='stylesheet';
    css.href='responsive-system.css?v=20260901-responsive1';
    css.dataset.responsiveSystemFinal='true';
    document.head.appendChild(css);
    if(!document.querySelector('script[data-responsive-system-loader]')){
      const rs=document.createElement('script');
      rs.src='responsive-system.js?v=20260901-responsive1';
      rs.dataset.responsiveSystemLoader='true';
      document.body.appendChild(rs);
    }
  };

  const appendPlatform=()=>{
    document.querySelectorAll('link[data-platform-workspace-final]').forEach(link=>link.remove());
    const css=document.createElement('link');
    css.rel='stylesheet';
    css.href='platform-enhancements.css?v=20260903-platform1';
    css.dataset.platformWorkspaceFinal='true';
    document.head.appendChild(css);
    if(!document.querySelector('script[data-platform-enhancements-loader]')){
      const js=document.createElement('script');
      js.src='platform-enhancements.js?v=20260903-platform1';
      js.dataset.platformEnhancementsLoader='true';
      document.body.appendChild(js);
    }
  };

  const appendLearningExperience=()=>{
    document.querySelectorAll('link[data-learning-experience-final]').forEach(link=>link.remove());
    const css=document.createElement('link');
    css.rel='stylesheet';
    css.href='learning-experience.css?v=20260903-learning1';
    css.dataset.learningExperienceFinal='true';
    document.head.appendChild(css);
    if(!document.querySelector('script[data-learning-experience-loader]')){
      const js=document.createElement('script');
      js.src='learning-experience.js?v=20260903-learning1';
      js.dataset.learningExperienceLoader='true';
      document.body.appendChild(js);
    }
  };

  const appendQuality=()=>{
    document.querySelectorAll('link[data-quality-layer-final]').forEach(link=>link.remove());
    const css=document.createElement('link');
    css.rel='stylesheet';
    css.href='quality-layer.css?v=20260903-quality1';
    css.dataset.qualityLayerFinal='true';
    document.head.appendChild(css);
    if(!document.querySelector('script[data-quality-layer-loader]')){
      const js=document.createElement('script');
      js.src='quality-layer.js?v=20260903-quality1';
      js.dataset.qualityLayerLoader='true';
      document.body.appendChild(js);
    }
  };

  const s=document.createElement('script');
  s.src='workspace-fixes-v3.js?v=20260901-13';
  s.dataset.workspaceStabilityV3Loader='true';
  s.addEventListener('load',()=>{appendSoftNeonPalette(true);appendResponsive();appendPlatform();appendLearningExperience();appendQuality()},{once:true});
  document.head.appendChild(s);
  appendSoftNeonPalette();
  appendResponsive();
  appendPlatform();
  appendLearningExperience();
  appendQuality();
})();