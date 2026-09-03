(() => {
  if(document.documentElement.dataset.learningExperienceV1)return;
  document.documentElement.dataset.learningExperienceV1='true';
  if(!document.body.classList.contains('lesson-page'))return;
  const $=(s,r=document)=>r.querySelector(s);

  function actionTarget(){
    if($('#action'))return '#action';
    if($('#practice-lab'))return '#practice-lab';
    if($('#quiz'))return '#quiz';
    return '#completion';
  }

  function enhanceVideo(){
    const card=$('.inline-video-card');
    if(!card||$('.video-apply-bridge',card))return false;
    const copy=$('.inline-video-copy',card)||card;
    const bridge=document.createElement('div');
    bridge.className='video-apply-bridge';
    bridge.innerHTML=`<div><small>AFTER WATCHING</small><strong>Take one useful idea from the video and apply it inside the lesson.</strong></div><a href="${actionTarget()}">Apply this idea ↓</a>`;
    copy.appendChild(bridge);
    return true;
  }

  function enhanceDiagram(){
    const focus=$('.diagram-focus');
    if(!focus||$('.diagram-apply-bridge'))return false;
    const bridge=document.createElement('div');
    bridge.className='diagram-apply-bridge';
    bridge.innerHTML=`<div><small>MODEL → ACTION</small><span>Use the visual as a decision rule, then test it in the practical section.</span></div><a href="${actionTarget()}">Practice the model ↓</a>`;
    focus.insertAdjacentElement('afterend',bridge);
    return true;
  }

  function enhanceNotes(){
    const note=$('#lessonNote');
    if(!note||$('.platform-note-tools'))return false;
    const status=$('#noteStatus');
    const tools=document.createElement('div');
    tools.className='platform-note-tools';
    tools.innerHTML=`<div class="platform-note-meta"><span data-note-words>0 words</span><span>Saved on this device</span></div><button type="button" class="platform-note-copy">Copy note</button>`;
    (status?.parentElement||note.parentElement)?.appendChild(tools);
    const words=$('[data-note-words]',tools);
    const render=()=>{const count=note.value.trim()?note.value.trim().split(/\s+/).length:0;if(words)words.textContent=`${count} word${count===1?'':'s'}`};
    note.addEventListener('input',render);render();
    $('.platform-note-copy',tools)?.addEventListener('click',async()=>{
      const text=note.value.trim();if(!text)return;
      try{await navigator.clipboard.writeText(text);const btn=$('.platform-note-copy',tools);if(btn){const old=btn.textContent;btn.textContent='Copied ✓';setTimeout(()=>btn.textContent=old,1400)}}catch(_){}
    });
    return true;
  }

  function enhanceCompletion(){
    const panel=$('#completion');
    if(!panel||$('.platform-next-step',panel))return false;
    const next=$('.nav-lesson.next');
    if(!next)return false;
    const href=next.getAttribute('href');
    if(!href||href==='#')return false;
    const label=$('strong',next)?.textContent?.replace(/\s*→\s*$/,'').trim()||'Continue learning';
    const step=document.createElement('div');
    step.className='platform-next-step';
    step.innerHTML=`<div><strong>Keep the momentum.</strong><small>Your next lesson is ready when you are.</small></div><a href="${href}">${label} →</a>`;
    panel.appendChild(step);
    return true;
  }

  function semanticPolish(){
    $('.inline-video-player iframe')?.setAttribute('loading','lazy');
    document.querySelectorAll('.diagram-node').forEach(node=>{if(!node.getAttribute('aria-label')){const t=$('strong',node)?.textContent?.trim();if(t)node.setAttribute('aria-label',`Explore visual model item: ${t}`)}});
  }

  function boot(attempt=0){
    const v=enhanceVideo();
    const d=enhanceDiagram();
    const n=enhanceNotes();
    const c=enhanceCompletion();
    semanticPolish();
    if(attempt<80&&(!v||!d||!n||!c))setTimeout(()=>boot(attempt+1),100);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>boot(),{once:true});else boot();
})();
