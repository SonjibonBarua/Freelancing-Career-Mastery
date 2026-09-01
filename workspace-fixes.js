(() => {
  if (document.documentElement.dataset.workspaceFixesV3Ready) return;
  if (document.querySelector('script[data-workspace-stability-v3-loader]')) return;

  const appendNeonPalette=(force=false)=>{
    if(force){
      document.querySelectorAll('link[data-neon-theme],link[data-neon-continuous]').forEach(link=>link.remove());
    }
    if(!document.querySelector('link[data-neon-theme]')){
      const theme=document.createElement('link');
      theme.rel='stylesheet';
      theme.href='palette-theme.css?v=20260901-neon1';
      theme.dataset.neonTheme='true';
      document.head.appendChild(theme);
    }
    if(!document.querySelector('link[data-neon-continuous]')){
      const canvas=document.createElement('link');
      canvas.rel='stylesheet';
      canvas.href='palette-continuous.css?v=20260901-neon1';
      canvas.dataset.neonContinuous='true';
      document.head.appendChild(canvas);
    }
  };

  const s=document.createElement('script');
  s.src='workspace-fixes-v3.js?v=20260901-13';
  s.dataset.workspaceStabilityV3Loader='true';
  s.addEventListener('load',()=>appendNeonPalette(true),{once:true});
  document.head.appendChild(s);
  appendNeonPalette();
})();