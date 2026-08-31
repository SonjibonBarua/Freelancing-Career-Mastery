(() => {
  if(document.documentElement.dataset.trainingProductReady) return;
  document.documentElement.dataset.trainingProductReady='true';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const body=document.body;
  const modules=window.COURSE_MODULES||[];
  const allLessons=modules.flatMap(m=>m.lessons.map(l=>({...l,moduleId:m.id,moduleTitle:m.title,moduleLevel:m.level})));
  const lessonMatch=body.dataset.lesson?.match(/lesson-(\d+)/i) || location.pathname.match(/lesson-(\d+)/i) || (location.pathname.endsWith('/lesson.html')?['',new URLSearchParams(location.search).get('lesson')]:null);
  const lessonNo=lessonMatch?Number(lessonMatch[1]):null;
  const current=allLessons.find(l=>l.n===lessonNo);
  const module=current?modules.find(m=>m.id===current.moduleId):null;
  const lessonData=window.ADVANCED_LESSONS?.[lessonNo];
  const isLesson=body.classList.contains('lesson-page')||Boolean(lessonNo);
  const hrefFor=n=>n<=6?`lesson-${String(n).padStart(2,'0')}.html`:`lesson.html?lesson=${n}`;
  function completed(n){const pad=String(n).padStart(2,'0');return localStorage.getItem(`sure-earning-lesson-${pad}-complete`)==='true'||(n===4&&localStorage.getItem('sure-earning-class11-complete')==='true')}
  function ensureCss(){if($('link[data-training-product-css]'))return;const l=document.createElement('link');l.rel='stylesheet';l.href='training-product.css';l.dataset.trainingProductCss='true';document.head.appendChild(l)}ensureCss();

  if(isLesson&&lessonNo){
    localStorage.setItem('sure-earning-last-lesson',String(lessonNo));
    setupBrief();setupConfidence();setupAppliedOutput();setupMastery();setupModuleCheckpoint();
  } else if($('#modules')) {
    setupDashboard();
  }

  function setupBrief(){
    const hero=$('.hero'); if(!hero||$('.training-brief'))return;
    const article=$('.lesson-main');
    const words=article?(article.innerText.match(/\S+/g)||[]).length:0;
    const mins=Math.max(4,Math.ceil(words/210));
    const difficulty=module?.level||'Progressive';
    const brief=document.createElement('section');brief.className='training-brief';brief.setAttribute('aria-label','Lesson training brief');
    brief.innerHTML=`<div class="training-brief-intro"><small>TRAINING BRIEF</small><strong>${current?.title||document.title}</strong></div><div class="training-brief-chip"><small>LEVEL</small><strong>${difficulty}</strong></div><div class="training-brief-chip"><small>TIME</small><strong>~${mins} min</strong></div><div class="training-brief-chip"><small>PRACTICE</small><strong>Applied output</strong></div><div class="training-brief-chip"><small>ASSESS</small><strong>${$$('.quiz-card').length||3}-question check</strong></div>`;
    hero.insertAdjacentElement('afterend',brief);
  }

  function setupConfidence(){
    const goals=$('.learning-goals'); if(!goals||$('.confidence-card'))return;
    const key=`sure-earning-confidence-${String(lessonNo).padStart(2,'0')}`;
    const saved=Number(localStorage.getItem(key)||0);
    const card=document.createElement('div');card.className='confidence-card motion-card';
    card.innerHTML=`<div class="confidence-head"><div><h3>Confidence check</h3><p>Before moving deeper, rate how confidently you could explain or use this lesson right now. This is for your own reflection—not a grade.</p></div></div><div class="confidence-scale">${[1,2,3,4,5].map(n=>`<button type="button" class="confidence-btn ${saved===n?'selected':''}" data-confidence="${n}">${n}<small>${['New','Unsure','Okay','Confident','Can teach'][n-1]}</small></button>`).join('')}</div>`;
    goals.insertAdjacentElement('afterend',card);
    $$('.confidence-btn',card).forEach(btn=>btn.addEventListener('click',()=>{$$('.confidence-btn',card).forEach(b=>b.classList.remove('selected'));btn.classList.add('selected');localStorage.setItem(key,btn.dataset.confidence)}));
  }

  function setupAppliedOutput(){
    const action=$('#action'); if(!action||$('.applied-output'))return;
    const titles=$$('.action-item strong,.check-item strong',action).map(x=>x.textContent.trim()).slice(0,4);
    if(!titles.length)return;
    const box=document.createElement('div');box.className='applied-output motion-card';
    box.innerHTML=`<span class="section-tag">APPLIED OUTPUT</span><h3>What you should leave this lesson with</h3><p>A training lesson is useful when it changes something you can do. Use the action plan to produce these outputs.</p><ul class="output-list">${titles.map((t,i)=>`<li><b>${i+1}</b><span><strong>${t}</strong></span></li>`).join('')}</ul>`;
    action.querySelector('.section-heading')?.insertAdjacentElement('afterend',box);
  }

  function setupMastery(){
    const completion=$('#completion'); if(!completion||$('.mastery-panel'))return;
    const panel=document.createElement('section');panel.className='mastery-panel motion-card';
    panel.innerHTML=`<div class="mastery-head"><div><span class="section-tag">MASTERY READINESS</span><h3>Are you ready to move on?</h3><p>Completion is not locked, but these three signals make the lesson more likely to stick.</p></div><div class="mastery-score" id="masteryScore"><strong>0%</strong></div></div><div class="mastery-grid"><div class="mastery-item" data-mastery="actions"><i>1</i><span><strong>Apply</strong><small>Finish the action plan</small></span></div><div class="mastery-item" data-mastery="quiz"><i>2</i><span><strong>Check</strong><small>Score at least 70%</small></span></div><div class="mastery-item" data-mastery="note"><i>3</i><span><strong>Reflect</strong><small>Write a useful personal note</small></span></div></div><div class="mastery-note" id="masteryNote">Recommended: complete at least two signals before moving on.</div>`;
    completion.insertAdjacentElement('beforebegin',panel);
    const update=()=>{
      const checks=$$('[data-check],[data-task]');const actionDone=checks.length>0&&checks.every(c=>c.checked);
      const quizCards=$$('.quiz-card');let quizScore=Number(localStorage.getItem(`sure-earning-lesson-${String(lessonNo).padStart(2,'0')}-quiz`)||0);if(lessonNo===4){try{const q=JSON.parse(localStorage.getItem('sure-earning-class11-quiz')||'{}');quizScore=Math.max(quizScore,Number(q.score||0))}catch(_){}}
      const quizDone=quizCards.length?quizScore/quizCards.length>=.7:false;
      const note=$('#lessonNote,.note-box textarea');const noteDone=Boolean(note&&note.value.trim().length>=30);
      const states={actions:actionDone,quiz:quizDone,note:noteDone};let count=0;
      Object.entries(states).forEach(([k,v])=>{const item=$(`[data-mastery="${k}"]`,panel);item?.classList.toggle('done',v);if(v)count++});
      const pct=Math.round(count/3*100);const score=$('#masteryScore',panel);if(score){score.style.setProperty('--mastery',`${pct}%`);$('strong',score).textContent=`${pct}%`}
      const noteEl=$('#masteryNote',panel);if(noteEl){noteEl.textContent=count===3?'Strong mastery signals: applied, checked, and reflected.':count>=2?'Good readiness. You have enough evidence to move on with intention.':'Recommended: complete at least two signals before moving on.';noteEl.classList.toggle('ready',count>=2)}
    };
    document.addEventListener('change',e=>{if(e.target.matches('[data-check],[data-task],input[type=radio]'))setTimeout(update,30)});$('#quizSubmit')?.addEventListener('click',()=>setTimeout(update,80));$('#lessonNote,.note-box textarea')?.addEventListener('input',()=>setTimeout(update,50));update();
  }

  function setupModuleCheckpoint(){
    if(!module||!current||module.lessons[module.lessons.length-1]?.n!==lessonNo||$('.module-checkpoint'))return;
    const completion=$('#completion');if(!completion)return;
    const key=`sure-earning-module-${module.id}-reflection`;
    const done=module.lessons.filter(l=>completed(l.n)).length;const pct=Math.round(done/module.lessons.length*100);
    const box=document.createElement('section');box.className='module-checkpoint motion-card';
    box.innerHTML=`<div class="checkpoint-head"><div><span class="section-tag">MODULE ${module.id} REVIEW</span><h2>${module.title} checkpoint</h2><p>Before entering the next module, look back at what changed in your thinking or workflow—not just what pages you finished.</p></div></div><div class="checkpoint-progress"><div class="checkpoint-progress-head"><span>Module completion</span><strong>${done}/${module.lessons.length}</strong></div><div class="checkpoint-meter"><span style="width:${pct}%"></span></div></div><div class="checkpoint-lessons">${module.lessons.map(l=>`<div class="checkpoint-lesson ${completed(l.n)?'done':''}">${completed(l.n)?'✓':'○'} Lesson ${l.n} · ${l.title}</div>`).join('')}</div><div class="checkpoint-reflection"><label for="moduleReflection">What is the single most useful change you will carry into the next module?</label><textarea id="moduleReflection" placeholder="Write the principle, habit, script, system, or decision rule you want to keep using...">${localStorage.getItem(key)||''}</textarea></div>`;
    completion.insertAdjacentElement('beforebegin',box);$('#moduleReflection',box)?.addEventListener('input',e=>localStorage.setItem(key,e.target.value));
  }

  function setupDashboard(){
    const completedCount=allLessons.filter(l=>completed(l.n)).length;const pct=Math.round(completedCount/allLessons.length*100);
    const last=Number(localStorage.getItem('sure-earning-last-lesson')||0);let next=last&&last<64?last:allLessons.find(l=>!completed(l.n))?.n||64;if(completed(next)&&next<64)next=allLessons.find(l=>l.n>next&&!completed(l.n))?.n||next;
    const lesson=allLessons.find(l=>l.n===next)||allLessons[0];
    const roadmap=$('.roadmap-strip');if(roadmap&&!$('.course-resume')){const resume=document.createElement('section');resume.className='course-resume';resume.innerHTML=`<div><small>${completedCount?`COURSE PROGRESS · ${pct}%`:'START YOUR TRAINING'}</small><h3>${completedCount?'Continue where your learning needs you next':'Begin with the foundation'}</h3><p>${completedCount} of ${allLessons.length} lessons completed · Next: Lesson ${lesson.n} — ${lesson.title}</p></div><a href="${hrefFor(lesson.n)}">${completedCount?'Continue training →':'Start Lesson 1 →'}</a>`;roadmap.insertAdjacentElement('beforebegin',resume)}
    $$('.milestone').forEach((m,i)=>m.classList.toggle('current',pct<20?i===0:pct<40?i===1:pct<60?i===2:pct<80?i===3:i===4));
    $$('.module').forEach(section=>{const id=Number(section.dataset.module);const m=modules.find(x=>x.id===id);const meta=$('.module-meta',section);if(!m||!meta||$('.module-training-meter',meta))return;const d=m.lessons.filter(l=>completed(l.n)).length;const p=Math.round(d/m.lessons.length*100);const meter=document.createElement('div');meter.className='module-training-meter';meter.innerHTML=`<span style="width:${p}%"></span>`;meta.appendChild(meter)});
    const survival=$('.survival');if(survival&&!$('.training-system')){const section=document.createElement('section');section.className='wrap training-system';section.innerHTML=`<div class="section-head"><div><span class="eyebrow">HOW THIS COURSE TRAINS YOU</span><h2>A four-part learning system</h2><p>The curriculum is designed to move from understanding to action, then reflection and realistic pressure-testing.</p></div></div><div class="training-system-grid"><article class="training-pillar"><b>01</b><strong>Learn</strong><p>Build the mental model with concepts, examples and frameworks.</p></article><article class="training-pillar"><b>02</b><strong>Apply</strong><p>Turn each lesson into a concrete action or output you can use.</p></article><article class="training-pillar"><b>03</b><strong>Reflect</strong><p>Use notes, confidence checks and module checkpoints to make the learning personal.</p></article><article class="training-pillar"><b>04</b><strong>Pressure-test</strong><p>Use the Survival Lab to practice judgment when client work becomes messy.</p></article></div>`;survival.insertAdjacentElement('beforebegin',section)}
  }
})();
