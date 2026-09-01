(() => {
  if (document.documentElement.dataset.workspaceFixesV3Ready) return;
  if (document.querySelector('script[data-workspace-stability-v3-loader]')) return;

  const ensureCalmPalette=()=>{
    if(!document.querySelector('link[data-calm-premium-theme]')){
      const theme=document.createElement('link');
      theme.rel='stylesheet';
      theme.href='palette-theme.css?v=20260901-calm2';
      theme.dataset.calmPremiumTheme='true';
      document.head.appendChild(theme);
    }
    if(!document.querySelector('link[data-calm-premium-continuous]')){
      const canvas=document.createElement('link');
      canvas.rel='stylesheet';
      canvas.href='palette-continuous.css?v=20260901-calm2';
      canvas.dataset.calmPremiumContinuous='true';
      document.head.appendChild(canvas);
    }
  };

  const s=document.createElement('script');
  s.src='workspace-fixes-v3.js?v=20260901-12';
  s.dataset.workspaceStabilityV3Loader='true';
  s.addEventListener('load',ensureCalmPalette,{once:true});
  document.head.appendChild(s);
  ensureCalmPalette();
})();