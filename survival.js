(() => {
  const cases=window.SURVIVAL_CASES||[];
  const list=document.getElementById('caseList');
  const stage=document.getElementById('caseStage');
  const debrief=document.getElementById('debrief');
  const themeToggle=document.getElementById('themeToggle');
  const meter=document.getElementById('survivalMeter');
  const doneEl=document.getElementById('caseDone');
  const totalEl=document.getElementById('caseTotal');
  const complete=document.getElementById('survivalComplete');
  const KEY='sure-earning-survival-progress';
  let progress={};
  try{progress=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(_){progress={}}
  let active=0;
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));

  function applyTheme(theme){const dark=theme==='dark';document.body.classList.toggle('dark',dark);themeToggle.textContent=dark?'☀':'☾';themeToggle.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode')}
  const savedTheme=localStorage.getItem('sure-earning-theme');
  const systemDark=matchMedia&&matchMedia('(prefers-color-scheme:dark)').matches;
  applyTheme(savedTheme||(systemDark?'dark':'light'));
  themeToggle.addEventListener('click',()=>{const next=document.body.classList.contains('dark')?'light':'dark';applyTheme(next);localStorage.setItem('sure-earning-theme',next)});

  function updateProgress(){
    const done=cases.filter(c=>progress[c.id]!==undefined).length;
    doneEl.textContent=done;totalEl.textContent=cases.length;meter.style.width=`${cases.length?done/cases.length*100:0}%`;
    complete.classList.toggle('show',done===cases.length&&cases.length>0);
    renderList();
  }

  function renderList(){
    list.innerHTML=cases.map((c,i)=>`<button class="case-link ${i===active?'active':''} ${progress[c.id]!==undefined?'done':''}" data-index="${i}"><b>${String(i+1).padStart(2,'0')}</b><span><strong>${esc(c.title)}</strong><small>${esc(c.category)}</small></span></button>`).join('');
    list.querySelectorAll('.case-link').forEach(btn=>btn.addEventListener('click',()=>{active=Number(btn.dataset.index);renderCase();renderList();window.scrollTo({top:document.querySelector('.lab-layout').offsetTop-80,behavior:'smooth'})}));
  }

  function typeLabel(type){return type==='good'?'Strong choice':type==='mixed'?'Reasonable, but incomplete':'High-risk choice'}

  function renderDebrief(c){
    debrief.innerHTML=`<h3>What a professional should notice</h3><div class="debrief-grid"><div class="debrief-block"><small>WHAT IS ACTUALLY HAPPENING</small><p>${esc(c.reality)}</p></div><div class="debrief-block"><small>PREVENTION SYSTEM</small><p>${esc(c.prevention)}</p></div><div class="debrief-block"><small>RED FLAGS</small><ul>${c.redFlags.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div class="debrief-block"><small>WHAT TO DO NEXT</small><ul>${c.next.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div><div class="script-box"><strong>Possible response — adapt it to your facts and agreement:</strong>\n\n${esc(c.script)}</div>`;
    debrief.classList.add('show');
  }

  function choose(index){
    const c=cases[active];
    progress[c.id]=index;localStorage.setItem(KEY,JSON.stringify(progress));
    const choice=c.choices[index];
    stage.querySelectorAll('.choice').forEach((btn,i)=>{btn.disabled=true;btn.classList.remove('selected','good','bad','mixed');if(i===index)btn.classList.add('selected',choice.type)});
    const fb=stage.querySelector('.feedback');fb.className='feedback show';fb.innerHTML=`<strong>${typeLabel(choice.type)}</strong><p>${esc(choice.feedback)}</p>`;
    renderDebrief(c);updateProgress();
  }

  function renderCase(){
    const c=cases[active];
    const saved=progress[c.id];
    debrief.classList.remove('show');debrief.innerHTML='';
    stage.innerHTML=`<div class="case-head"><div class="case-head-row"><div><span class="case-badge">CASE ${String(active+1).padStart(2,'0')} · ${esc(c.category).toUpperCase()}</span><h2>${esc(c.title)}</h2><p>${esc(c.intro)}</p></div><div class="stress">PRESSURE LEVEL · <b>${'●'.repeat(c.stress)}${'○'.repeat(Math.max(0,5-c.stress))}</b></div></div></div><div class="scene"><div class="scene-label">PUT YOURSELF IN THE MOMENT</div><p class="inner-voice">${esc(c.inner)}</p><div class="message"><small>CLIENT MESSAGE</small><p>${esc(c.message)}</p></div><div class="choice-title">What would you do next?</div><div class="choices">${c.choices.map((x,i)=>`<button class="choice" data-choice="${i}"><i>${String.fromCharCode(65+i)}</i><span>${esc(x.q)}</span></button>`).join('')}</div><div class="feedback" role="status" aria-live="polite"></div><div class="case-actions"><button class="secondary" id="prevCase" ${active===0?'disabled':''}>← Previous case</button><button class="primary" id="nextCase">${active===cases.length-1?'Finish / review':'Next case →'}</button></div></div>`;
    stage.querySelectorAll('.choice').forEach(btn=>btn.addEventListener('click',()=>choose(Number(btn.dataset.choice))));
    document.getElementById('prevCase').addEventListener('click',()=>{if(active>0){active--;renderCase();renderList()}});
    document.getElementById('nextCase').addEventListener('click',()=>{if(active<cases.length-1){active++;renderCase();renderList()}else{complete.scrollIntoView({behavior:'smooth',block:'center'})}});
    if(saved!==undefined){
      const choice=c.choices[saved];
      stage.querySelectorAll('.choice').forEach((btn,i)=>{btn.disabled=true;if(i===saved)btn.classList.add('selected',choice.type)});
      const fb=stage.querySelector('.feedback');fb.className='feedback show';fb.innerHTML=`<strong>${typeLabel(choice.type)}</strong><p>${esc(choice.feedback)}</p>`;
      renderDebrief(c);
    }
  }

  document.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA'].includes(document.activeElement?.tagName))return;if(e.key==='ArrowRight'&&active<cases.length-1){active++;renderCase();renderList()}if(e.key==='ArrowLeft'&&active>0){active--;renderCase();renderList()}});
  renderList();renderCase();updateProgress();
})();