(() => {
  if (document.documentElement.dataset.workspaceFixesReady === 'v2') return;
  if (document.querySelector('script[data-workspace-stability-v2-loader]')) return;
  const s=document.createElement('script');
  s.src='workspace-fixes-v2.js?v=20260901-2';
  s.dataset.workspaceStabilityV2Loader='true';
  document.head.appendChild(s);
})();