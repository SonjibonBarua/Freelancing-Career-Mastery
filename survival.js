(() => {
  if(!document.querySelector('link[data-palette-theme-css]')){
    const palette=document.createElement('link');
    palette.rel='stylesheet';
    palette.href='palette-theme.css?v=20260903-softneon1';
    palette.dataset.paletteThemeCss='true';
    document.head.appendChild(palette);
  }

  const cases=window.SURVIVAL_CASES||[];
  const list=document.getElementById('caseList');
  const stage=document.getElementById('caseStage');
  const debrief=document.getElementById('debrief');
  const themeToggle=document.getElementById('themeToggle');
  const meter=document.getElementById('survivalMeter');
  const doneEl=document.getElementById('caseDone');
  const totalEl=document.getElementById('caseTotal');
  const complete=document.getElementById('survivalComplete');
  const KEY='sure-earning-survival-progress', REFKEY='sure-earning-survival-reflections';
  let progress={},reflections={};
  try{progress=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(_){progress={}}
  try{reflections=JSON.parse(localStorage.getItem(REFKEY)||'{}')}catch(_){reflections={}}
  let active=0;
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));

  function applyTheme(theme){const dark=theme==='dark';document.body.classList.toggle('dark',dark);themeToggle.textContent=dark?'☀':'☾';themeToggle.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode')}
  const savedTheme=localStorage.getItem('sure-earning-theme');
  applyTheme(savedTheme||'dark');
  themeToggle.addEventListener('click',()=>{const next=document.body.classList.contains('dark')?'light':'dark';applyTheme(next);localStorage.setItem('sure-earning-theme',next)});

  function recordFor(c){
    const raw=progress[c.id];
    if(raw===undefined)return null;
    if(typeof raw==='number')return {legacy:true,first:raw,second:null,finalType:c.choices[raw]?.type||'mixed'};
    if(raw&&typeof raw==='object')return {legacy:false,first:Number(raw.first),second:Number(raw.second),finalType:raw.finalType||'mixed'};
    return null;
  }
  function profile(){const p={good:0,mixed:0,bad:0};cases.forEach(c=>{const record=recordFor(c);const type=record?.finalType;if(type&&p[type]!==undefined)p[type]++});return p}
  function ensureProfile(){const card=document.querySelector('.hero-card');if(!card||document.getElementById('judgmentProfile'))return;const box=document.createElement('div');box.className='judgment-profile';box.id='judgmentProfile';box.innerHTML='<div class="profile-head"><strong>Judgment profile</strong><small>Not a grade · a pattern check</small></div><div class="profile-grid"><div class="profile-stat good"><b id="strongCount">0</b><span>Strong</span></div><div class="profile-stat mixed"><b id="mixedCount">0</b><span>Mixed</span></div><div class="profile-stat bad"><b id="riskCount">0</b><span>High-risk</span></div></div>';card.appendChild(box)}
  ensureProfile();

  function updateProgress(){
    const done=cases.filter(c=>recordFor(c)).length;
    doneEl.textContent=done;totalEl.textContent=cases.length;meter.style.width=`${cases.length?done/cases.length*100:0}%`;
    const p=profile();const s=document.getElementById('strongCount'),m=document.getElementById('mixedCount'),r=document.getElementById('riskCount');if(s)s.textContent=p.good;if(m)m.textContent=p.mixed;if(r)r.textContent=p.bad;
    complete.classList.toggle('show',done===cases.length&&cases.length>0);
    if(done===cases.length&&cases.length>0){
      const dominant=p.bad>p.good?'Your answers show several pressure points worth revisiting. That is useful evidence: build boundaries, payment systems and response scripts before you need them.':p.mixed>p.good?'You often see the risk but recover once the situation becomes clearer. Revisit the mixed cases and turn the debriefs into personal operating rules.':'Your choices generally protect clarity, boundaries and long-term trust—even after the situation changes. Keep the scripts flexible and verify the facts of each real situation.';
      complete.innerHTML=`<span class="case-badge">SURVIVAL LAB COMPLETE</span><h2>You finished all ${cases.length} cases.</h2><p>${dominant}</p><div class="final-profile"><span><b>${p.good}</b> Strong</span><span><b>${p.mixed}</b> Mixed</span><span><b>${p.bad}</b> High-risk</span></div><p class="final-note">The goal was never perfect answers. It was to notice what stress makes you want to do, see how the situation changes after your first move, and replace impulse with a repeatable professional system.</p><a href="index.html">Return to course dashboard →</a>`;
    }
    renderList();
  }

  function renderList(){
    list.innerHTML=cases.map((c,i)=>{const rec=recordFor(c);return `<button class="case-link ${i===active?'active':''} ${rec?'done':''} ${rec&&!rec.legacy?'branch-complete':''}" data-index="${i}"><b>${String(i+1).padStart(2,'0')}</b><span><strong>${esc(c.title)}</strong><small>${esc(c.category)}</small></span></button>`}).join('');
    list.querySelectorAll('.case-link').forEach(btn=>btn.addEventListener('click',()=>{active=Number(btn.dataset.index);renderCase();renderList();window.scrollTo({top:document.querySelector('.lab-layout').offsetTop-80,behavior:'smooth'})}));
  }

  function typeLabel(type){return type==='good'?'Strong choice':type==='mixed'?'Reasonable, but incomplete':'High-risk choice'}
  function branchResult(firstType,secondType){
    if(secondType==='good')return firstType==='bad'?'mixed':'good';
    if(secondType==='mixed')return firstType==='good'?'mixed':'bad';
    return 'bad';
  }
  function branchBadge(firstType,secondType){
    if(firstType==='bad'&&secondType==='good')return 'Recovered after a risky first reaction';
    if(firstType==='mixed'&&secondType==='good')return 'Strengthened the response';
    if(firstType==='good'&&secondType==='good')return 'Strong process under pressure';
    if(secondType==='mixed')return 'The second move still leaves ambiguity';
    return 'Pressure is still driving the process';
  }

  const categoryFollowup={
    Communication:'The first message is sent, but the client still gives you no firm commitment. Your time and attention are now part of the decision.',
    Money:'The client asks for more time and wants the relationship to continue before the money issue is fully resolved.',
    Scope:'The client pushes back and says they genuinely believed the extra work was already included.',
    Boundaries:'The client says they need faster access to you and treats the boundary as an inconvenience.',
    Safety:'The prospect increases the urgency and asks you to act before you have time to verify the request independently.',
    Dispute:'The client escalates the complaint and hints at a review, chargeback, or formal dispute.',
    Delivery:'The client now wants an exact recovery plan, not another reassurance.',
    Feedback:'The client is still unhappy but cannot yet describe the mismatch clearly enough for a useful revision.',
    Growth:'The relationship is positive, but the next opportunity is vague and can easily disappear without a clear next step.',
    Confidentiality:'The request expands beyond the access, information, or permissions you originally understood.'
  };
  function followupText(c,firstType){
    const prefix=firstType==='good'?'Your first response lowers the temperature, but the situation is not finished.':firstType==='mixed'?'Your first response helps a little, but the underlying ambiguity is still there.':'Your first reaction increases pressure and reduces your options. You now have a chance to recover before the situation gets worse.';
    return `${prefix} ${categoryFollowup[c.category]||'New information arrives and you need to make a second decision before the situation is truly under control.'}`;
  }
  function secondChoices(c){
    const good=[c.next?.[0],c.next?.[1]].filter(Boolean).join(' Then ');
    return [
      {q:'React quickly again to make the discomfort go away, even if the facts, terms, or next step are still unclear.',type:'bad',feedback:'Speed is not the same as control. Repeated reactive decisions usually make documentation, boundaries, and recovery harder.'},
      {q:good?`${good}. Put the next step in writing so both sides know what happens next.`:'Pause, verify the facts, choose the professional next step, and document it clearly.',type:'good',feedback:'This turns the response into a process: facts first, a clear decision second, and a documented next step.'},
      {q:'Pause the conversation, but leave the next step vague and hope the situation resolves itself.',type:'mixed',feedback:'Pausing can be useful, but without a clear owner, date, boundary, or documented next action the same uncertainty remains.'}
    ];
  }

  function renderDebrief(c){
    const reflection=reflections[c.id]||'';
    debrief.innerHTML=`<h3>What a professional should notice</h3><div class="debrief-grid"><div class="debrief-block"><small>WHAT IS ACTUALLY HAPPENING</small><p>${esc(c.reality)}</p></div><div class="debrief-block"><small>PREVENTION SYSTEM</small><p>${esc(c.prevention)}</p></div><div class="debrief-block"><small>RED FLAGS</small><ul>${c.redFlags.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div class="debrief-block"><small>WHAT TO DO NEXT</small><ul>${c.next.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div><div class="script-box"><strong>Possible response — adapt it to your facts and agreement:</strong>\n\n${esc(c.script)}</div><div class="survival-reflection"><span class="case-badge">PERSONAL REFLECTION</span><h4>What pressure in this case could make you react badly?</h4><p>Write the trigger and the rule you want to follow instead. This turns the scenario into a personal operating principle.</p><textarea id="caseReflection" placeholder="Example: When I fear losing the client, I tend to accept extra work too quickly. My rule: pause, check scope, then respond in writing.">${esc(reflection)}</textarea><small id="reflectionStatus">Saved automatically on this device.</small></div>`;
    debrief.classList.add('show');
    document.getElementById('caseReflection')?.addEventListener('input',e=>{reflections[c.id]=e.target.value;localStorage.setItem(REFKEY,JSON.stringify(reflections));const st=document.getElementById('reflectionStatus');if(st){st.textContent='Saved ✓';clearTimeout(st.t);st.t=setTimeout(()=>st.textContent='Saved automatically on this device.',1200)}});
  }

  function renderSecondStage(c,firstIndex,savedSecond=null){
    const mount=document.getElementById('branchMount');if(!mount)return;
    const first=c.choices[firstIndex];const choices=secondChoices(c);
    mount.innerHTML=`<section class="branch-stage" aria-labelledby="branchTitle"><span class="branch-stage-kicker">STEP 2 · CONSEQUENCE</span><h3 id="branchTitle">The situation changes after your first move.</h3><p>${esc(followupText(c,first.type))}</p><div class="branch-message"><small>NEW PRESSURE</small><p>${esc(categoryFollowup[c.category]||'The client responds in a way that creates a second decision point.')}</p></div><div class="branch-question">What do you do now?</div><div class="branch-choices">${choices.map((x,i)=>`<button class="branch-choice" data-branch-choice="${i}"><i>${String.fromCharCode(65+i)}</i><span>${esc(x.q)}</span></button>`).join('')}</div><div class="branch-feedback" role="status" aria-live="polite"></div></section>`;
    mount.querySelectorAll('.branch-choice').forEach(btn=>btn.addEventListener('click',()=>chooseSecond(firstIndex,Number(btn.dataset.branchChoice))));
    if(savedSecond!==null&&Number.isFinite(Number(savedSecond))){
      const secondIndex=Number(savedSecond),second=choices[secondIndex];
      mount.querySelectorAll('.branch-choice').forEach((btn,i)=>{btn.disabled=true;if(i===secondIndex)btn.classList.add('selected',second.type)});
      const fb=mount.querySelector('.branch-feedback');fb.className='branch-feedback show';fb.innerHTML=`<strong>${typeLabel(second.type)}</strong><p>${esc(second.feedback)}</p><span class="branch-recovery">${esc(branchBadge(first.type,second.type))}</span>`;
    }
  }

  function chooseFirst(index){
    const c=cases[active],choice=c.choices[index];
    debrief.classList.remove('show');debrief.innerHTML='';
    stage.querySelectorAll('.choice').forEach((btn,i)=>{btn.disabled=true;btn.classList.remove('selected','good','bad','mixed');if(i===index)btn.classList.add('selected',choice.type)});
    const fb=stage.querySelector('.feedback');fb.className='feedback show';fb.innerHTML=`<strong>${typeLabel(choice.type)}</strong><p>${esc(choice.feedback)}</p><p><b>Now see what happens after this first move.</b></p>`;
    renderSecondStage(c,index);
    document.getElementById('branchMount')?.scrollIntoView({behavior:'smooth',block:'nearest'});
  }

  function chooseSecond(firstIndex,secondIndex){
    const c=cases[active],first=c.choices[firstIndex],choices=secondChoices(c),second=choices[secondIndex];
    const finalType=branchResult(first.type,second.type);
    progress[c.id]={first:firstIndex,second:secondIndex,finalType};localStorage.setItem(KEY,JSON.stringify(progress));
    const mount=document.getElementById('branchMount');
    mount?.querySelectorAll('.branch-choice').forEach((btn,i)=>{btn.disabled=true;btn.classList.remove('selected','good','bad','mixed');if(i===secondIndex)btn.classList.add('selected',second.type)});
    const fb=mount?.querySelector('.branch-feedback');if(fb){fb.className='branch-feedback show';fb.innerHTML=`<strong>${typeLabel(second.type)}</strong><p>${esc(second.feedback)}</p><span class="branch-recovery">${esc(branchBadge(first.type,second.type))}</span>`}
    renderDebrief(c);updateProgress();
  }

  function renderCase(){
    const c=cases[active],saved=recordFor(c);
    debrief.classList.remove('show');debrief.innerHTML='';
    stage.innerHTML=`<div class="case-head"><div class="case-head-row"><div><span class="case-badge">CASE ${String(active+1).padStart(2,'0')} · ${esc(c.category).toUpperCase()}</span><h2>${esc(c.title)}</h2><p>${esc(c.intro)}</p></div><div class="stress">PRESSURE LEVEL · <b>${'●'.repeat(c.stress)}${'○'.repeat(Math.max(0,5-c.stress))}</b></div></div></div><div class="scene"><div class="scene-label">PUT YOURSELF IN THE MOMENT</div><p class="inner-voice">${esc(c.inner)}</p><div class="message"><small>CLIENT MESSAGE</small><p>${esc(c.message)}</p></div><div class="choice-title">Decision 1 of 2 · What would you do first?</div><div class="choices">${c.choices.map((x,i)=>`<button class="choice" data-choice="${i}"><i>${String.fromCharCode(65+i)}</i><span>${esc(x.q)}</span></button>`).join('')}</div><div class="feedback" role="status" aria-live="polite"></div><div id="branchMount"></div><div class="case-actions"><button class="secondary" id="prevCase" ${active===0?'disabled':''}>← Previous case</button><button class="primary" id="nextCase">${active===cases.length-1?'Finish / review':'Next case →'}</button></div></div>`;
    stage.querySelectorAll('.choice').forEach(btn=>btn.addEventListener('click',()=>chooseFirst(Number(btn.dataset.choice))));
    document.getElementById('prevCase').addEventListener('click',()=>{if(active>0){active--;renderCase();renderList()}});
    document.getElementById('nextCase').addEventListener('click',()=>{if(active<cases.length-1){active++;renderCase();renderList()}else{complete.scrollIntoView({behavior:'smooth',block:'center'})}});

    if(saved){
      const first=c.choices[saved.first];
      stage.querySelectorAll('.choice').forEach((btn,i)=>{btn.disabled=true;if(i===saved.first)btn.classList.add('selected',first.type)});
      const fb=stage.querySelector('.feedback');fb.className='feedback show';
      if(saved.legacy){
        fb.innerHTML=`<strong>${typeLabel(first.type)}</strong><p>${esc(first.feedback)}</p><p><b>This case was completed before the two-step simulation upgrade.</b></p><button class="secondary" id="upgradeCase" type="button" style="margin-top:8px">Try the 2-step version</button>`;
        document.getElementById('upgradeCase')?.addEventListener('click',()=>{delete progress[c.id];localStorage.setItem(KEY,JSON.stringify(progress));renderCase();updateProgress()});
        renderDebrief(c);
      }else{
        fb.innerHTML=`<strong>${typeLabel(first.type)}</strong><p>${esc(first.feedback)}</p><p><b>Then the situation changed.</b></p>`;
        renderSecondStage(c,saved.first,saved.second);renderDebrief(c);
      }
    }
  }

  document.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA'].includes(document.activeElement?.tagName))return;if(e.key==='ArrowRight'&&active<cases.length-1){active++;renderCase();renderList()}if(e.key==='ArrowLeft'&&active>0){active--;renderCase();renderList()}});
  renderList();renderCase();updateProgress();
})();