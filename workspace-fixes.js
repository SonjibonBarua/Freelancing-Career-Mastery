(() => {
  if (document.documentElement.dataset.workspaceFixesV3Ready) return;
  if (document.querySelector('script[data-workspace-stability-v3-loader]')) return;
  const s=document.createElement('script');
  s.src='workspace-fixes-v3.js?v=20260901-4';
  s.dataset.workspaceStabilityV3Loader='true';
  document.head.appendChild(s);
})();