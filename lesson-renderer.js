(() => {
  const all = window.ADVANCED_LESSONS || {};
  const params = new URLSearchParams(location.search);
  const requested = Number(params.get('lesson'));
  const lesson = all[requested];
  const mount = document.getElementById('lessonMount');
  const modules = window.COURSE_MODULES || [];
  const esc = value => String(value ?? '').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#039;'}[m]));
  const hrefFor = n => n <= 6 ? `lesson-${String(n).padStart(2,'0')}.html` : `lesson.html?lesson=${n}`;

  if(!lesson){
    document.title='Lesson not found | Freelancing Career Mastery';
    mount.innerHTML=`<div class="dynamic-error"><div><span class="section-tag">COURSE NAVIGATION</span><h1>That lesson is not available.</h1><p>Return to the dashboard and choose an available lesson.</p><a class="primary-btn" href="index.html">Course dashboard</a></div></div>`;
    return;
  }

  const module = modules.find(m=>m.id===lesson.module);
  document.body.dataset.lesson=`lesson-${String(lesson.n).padStart(2,'0')}`;
  document.body.dataset.url=`https://sonjibonbarua.github.io/Freelancing-Career-Mastery/${hrefFor(lesson.n)}`;
  document.title=`Lesson ${lesson.n} — ${lesson.title} | Freelancing Career Mastery`;
  document.getElementById('metaDescription')?.setAttribute('content',lesson.description);
  document.getElementById('sideModuleName').textContent=`Module ${lesson.module} · ${module?.title || ''}`;
  document.getElementById('sideLessonStatus').textContent=`Module ${lesson.module} · Lesson ${lesson.n}`;
  document.getElementById('topLessonNo').textContent=`Lesson ${lesson.n}`;
  document.getElementById('activeSectionLabel').textContent=lesson.title;
  document.getElementById('footerLessonName').textContent=`Module ${lesson.module} · Lesson ${lesson.n} · ${lesson.title}`;

  const sideNav=document.getElementById('dynamicSideNav');
  if(module){
    sideNav.innerHTML=`<p class="nav-label">MODULE ${module.id} · ${esc(module.title).toUpperCase()}</p>`+module.lessons.map(l=>`<a class="course-link ${l.n===lesson.n?'active':''}" href="${hrefFor(l.n)}"><span>${String(l.n).padStart(2,'0')}</span><div><strong>Lesson ${l.n}</strong><small>${esc(l.title)}</small></div></a>`).join('')+`<div class="outline-tools" style="margin-top:16px"><a href="index.html" style="text-decoration:none;color:var(--primary);font-weight:800;font-size:.76rem">← Course dashboard</a></div>`;
  }

  const concepts=lesson.concepts.map(c=>`<article class="concept-card"><div class="concept-icon">${esc(c.icon)}</div><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p></article>`).join('');
  const steps=lesson.framework.map((s,i)=>`<div class="framework-step"><span>${i+1}</span><div><strong>${esc(s.title)}</strong><p>${esc(s.text)}</p></div></div>`).join('');
  const mistakes=lesson.mistakes.map(m=>`<article class="mistake-card"><span>×</span><h3>${esc(m.title)}</h3><p>${esc(m.text)}</p></article>`).join('');
  const actions=lesson.actions.map((a,i)=>`<label class="action-item"><input type="checkbox" data-check="a${i+1}"><span><strong>${esc(a.title)}</strong><small>${esc(a.text)}</small></span></label>`).join('');
  const quiz=lesson.quiz.map((q,i)=>`<article class="quiz-card" data-correct="${q.correct}"><fieldset><legend>${i+1}. ${esc(q.q)}</legend>${q.options.map((o,j)=>`<label class="quiz-option"><input type="radio" name="q${i+1}" value="${String.fromCharCode(97+j)}"> ${esc(o)}</label>`).join('')}</fieldset><div class="quiz-feedback">${esc(q.feedback)}</div></article>`).join('');
  const takeaways=lesson.takeaways.map((t,i)=>`<div class="summary-point"><b>${String(i+1).padStart(2,'0')}</b><strong>${esc(t)}</strong></div>`).join('');
  const video=lesson.video?`<section class="section reveal lesson-section" id="video" data-section-title="Recommended video"><div class="section-heading"><span class="section-tag">RECOMMENDED VIDEO</span><h2>Watch a useful companion resource</h2><p>This embedded video supports the topic. Platform interfaces and policies can change, so use it for concepts and verify current platform rules when needed.</p></div><div class="video-resource"><div><span class="resource-chip">▶ ${esc(lesson.video.channel)}</span><h3>${esc(lesson.video.title)}</h3><p>${esc(lesson.video.note)}</p><div class="lesson-disclaimer">Watch directly inside this course page. We do not own or reproduce the external video content.</div></div><div class="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/${esc(lesson.video.id)}" title="${esc(lesson.video.title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div></div></section>`:'';

  const previous=lesson.n-1, next=lesson.n+1;
  const prevLink=previous>=1?`<a class="nav-lesson" href="${hrefFor(previous)}"><small>PREVIOUS · LESSON ${previous}</small><strong>← ${esc(modules.flatMap(m=>m.lessons).find(l=>l.n===previous)?.title||'Previous lesson')}</strong></a>`:`<a class="nav-lesson disabled" href="#"><small>PREVIOUS</small><strong>Course start</strong></a>`;
  const nextLink=next<=64?`<a class="nav-lesson next" href="${hrefFor(next)}"><small>NEXT · LESSON ${next}</small><strong>${esc(modules.flatMap(m=>m.lessons).find(l=>l.n===next)?.title||'Next lesson')} →</strong></a>`:`<a class="nav-lesson next" href="survival.html"><small>NEXT EXPERIENCE</small><strong>Real-Life Freelancer Survival →</strong></a>`;

  mount.innerHTML=`
    <section class="hero"><div class="hero-inner content-width"><div class="breadcrumb"><a href="index.html" style="color:inherit;text-decoration:none">Freelancing Career Mastery</a><b>›</b><span>Module ${lesson.module}</span><b>›</b><span>Lesson ${lesson.n}</span></div><span class="eyebrow">MODULE ${lesson.module} · ${esc(module?.title||'')} · LESSON ${lesson.n}</span><h1>${esc(lesson.title)}<br><span>${esc(lesson.subtitle)}</span></h1><p class="hero-copy">${esc(lesson.description)}</p><div class="hero-actions"><a class="primary-btn" href="#lesson-content">Start lesson ↓</a><span class="reading-time">◷ Practical lesson · quiz · notes</span></div></div></section>
    <div class="lesson-layout content-width" id="lesson-content"><article class="lesson-main">
      <section class="section reveal lesson-section" id="overview" data-section-title="Lesson overview"><div class="section-heading"><span class="section-tag">LESSON OVERVIEW</span><h2>${esc(lesson.overviewTitle)}</h2><p>${esc(lesson.overview)}</p></div><div class="learning-goals"><div class="goal-icon">◎</div><div><h3>By the end of this lesson, you should be able to:</h3><ul>${lesson.objectives.map(o=>`<li>${esc(o)}</li>`).join('')}</ul></div></div></section>
      <section class="section reveal lesson-section" id="deep-dive" data-section-title="Deep dive"><div class="section-heading"><span class="section-tag">01 · DEEP DIVE</span><h2>Build the professional mental model</h2></div><div class="deep-dive">${lesson.deepDive.map(p=>`<p>${esc(p)}</p>`).join('')}</div></section>
      <section class="section reveal lesson-section" id="concepts" data-section-title="Core concepts"><div class="section-heading"><span class="section-tag">02 · CORE CONCEPTS</span><h2>The ideas you need to understand</h2></div><div class="concept-grid">${concepts}</div></section>
      <section class="section reveal lesson-section" id="framework" data-section-title="Practical framework"><div class="section-heading"><span class="section-tag">03 · PRACTICAL FRAMEWORK</span><h2>${esc(lesson.frameworkTitle)}</h2><p>${esc(lesson.frameworkIntro)}</p></div><div class="framework-steps">${steps}</div></section>
      <section class="section reveal lesson-section" id="scenario" data-section-title="Real-life scenario"><div class="section-heading"><span class="section-tag">04 · REAL-LIFE SCENARIO</span><h2>${esc(lesson.scenario.title)}</h2><p>Read this like a situation that could land in your inbox tomorrow.</p></div><article class="scenario-card"><p class="scenario-quote">“${esc(lesson.scenario.quote)}”</p><div class="scenario-grid"><div><small>WHAT IS REALLY HAPPENING</small><p>${esc(lesson.scenario.problem)}</p></div><div><small>WEAK REACTION</small><p>${esc(lesson.scenario.weak)}</p></div><div><small>PROFESSIONAL RESPONSE</small><p>${esc(lesson.scenario.response)}</p></div><div><small>DESIRED OUTCOME</small><p>${esc(lesson.scenario.outcome)}</p></div></div></article></section>
      ${video}
      <section class="section reveal lesson-section" id="mistakes" data-section-title="Common mistakes"><div class="section-heading"><span class="section-tag">${lesson.video?'06':'05'} · COMMON MISTAKES</span><h2>What usually goes wrong</h2></div><div class="mistake-grid">${mistakes}</div></section>
      <section class="section reveal lesson-section" id="action" data-section-title="Action plan"><div class="section-heading"><span class="section-tag">ACTION PLAN</span><h2>Turn the lesson into something usable</h2><p>Do these before moving on. Progress is stored on this device.</p></div><div class="action-list">${actions}</div><p id="checkCount" class="reading-time" style="margin-top:12px;color:var(--muted)"></p></section>
      <section class="section reveal lesson-section" id="quiz" data-section-title="Knowledge check"><div class="section-heading"><span class="section-tag">KNOWLEDGE CHECK</span><h2>Test your judgment</h2><p>The goal is not memorization. Choose the answer you would actually use in client work.</p></div><div class="quiz-list">${quiz}</div><div class="quiz-submit-row"><button class="quiz-submit" id="quizSubmit">Check answers</button><span class="quiz-result" id="quizResult"></span></div></section>
      <section class="section reveal lesson-section" id="summary" data-section-title="Key takeaways"><div class="section-heading"><span class="section-tag">KEY TAKEAWAYS</span><h2>Carry these ideas forward</h2></div><div class="lesson-summary">${takeaways}</div></section>
      <section class="section reveal lesson-section" id="notes" data-section-title="My notes"><div class="lesson-note"><span class="section-tag">MY NOTES</span><h2>Translate the lesson into your own situation</h2><textarea id="lessonNote" placeholder="Write what this lesson changes about how you will work, communicate, price, position, or make decisions..."></textarea><small id="noteStatus" style="color:var(--muted)">Saved automatically on this device.</small></div></section>
      <section class="lesson-complete-panel reveal" id="completion"><div><h2 id="completionTitle">Ready to complete this lesson?</h2><p id="completionText">Complete the lesson when you understand the core ideas and finish the practice.</p></div><button class="lesson-complete-btn" id="completeBtn">Mark lesson complete</button></section>
      <nav class="prev-next">${prevLink}${nextLink}</nav>
    </article><aside class="lesson-outline"><div class="outline-card"><p class="nav-label">ON THIS PAGE</p><a href="#overview" class="outline-link active">Overview</a><a href="#deep-dive" class="outline-link">Deep dive</a><a href="#concepts" class="outline-link">Core concepts</a><a href="#framework" class="outline-link">Framework</a><a href="#scenario" class="outline-link">Real-life scenario</a>${lesson.video?'<a href="#video" class="outline-link">Recommended video</a>':''}<a href="#mistakes" class="outline-link">Common mistakes</a><a href="#action" class="outline-link">Action plan</a><a href="#quiz" class="outline-link">Knowledge check</a><a href="#summary" class="outline-link">Takeaways</a><div class="outline-tools"><button id="printBtn">Print / Save PDF</button><button id="copyLinkBtn">Copy lesson link</button></div></div></aside></div>`;
})();