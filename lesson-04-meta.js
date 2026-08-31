(() => {
  const LESSON_URL = 'https://sonjibonbarua.github.io/Sure-Earning-Class-Lesson/lesson-04.html';
  const toast = document.getElementById('toast');
  const completionTitle = document.getElementById('completionTitle');
  const completionText = document.getElementById('completionText');
  const markCompleteHero = document.getElementById('markCompleteHero');

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  function replaceClass11(text) { return text.includes('Class 11') ? text.replaceAll('Class 11', 'Lesson 4') : text; }
  function patchCompletionCopy() {
    [completionTitle, completionText, markCompleteHero].filter(Boolean).forEach(node => {
      const next = replaceClass11(node.textContent);
      if (next !== node.textContent) node.textContent = next;
    });
  }

  [completionTitle, completionText, markCompleteHero].filter(Boolean).forEach(node => {
    new MutationObserver(patchCompletionCopy).observe(node, { childList: true, subtree: true, characterData: true });
  });
  patchCompletionCopy();

  const sideNav = document.querySelector('.side-nav');
  if (sideNav) sideNav.innerHTML = `
    <p class="nav-label">MODULE 1 · FOUNDATION</p>
    <a class="course-link" href="lesson-01.html"><span>01</span><div><strong>Lesson 1</strong><small>Freelancing explained</small></div></a>
    <a class="course-link" href="lesson-02.html"><span>02</span><div><strong>Lesson 2</strong><small>Freelancer mindset</small></div></a>
    <a class="course-link" href="lesson-03.html"><span>03</span><div><strong>Lesson 3</strong><small>Skills, services & value</small></div></a>
    <a class="course-link active" href="#top"><span>04</span><div><strong>Lesson 4</strong><small>Understanding client problems</small></div></a>
    <a class="course-link" href="lesson-05.html"><span>05</span><div><strong>Lesson 5</strong><small>Problems worth solving</small></div></a>
    <a class="course-link" href="lesson-06.html"><span>06</span><div><strong>Lesson 6</strong><small>Your freelancing roadmap</small></div></a>`;

  const nextCard = document.querySelector('.next-card');
  if (nextCard) {
    const link = document.createElement('a');
    link.className = 'next-card';
    link.href = 'lesson-05.html';
    link.style.textDecoration = 'none';
    link.innerHTML = '<small>NEXT LESSON</small><strong>Lesson 5</strong><span>Choosing Problems Worth Solving →</span>';
    nextCard.replaceWith(link);
  }
  const navCopy = document.querySelector('.course-nav-copy p');
  if (navCopy) navCopy.textContent = 'Continue through Module 1 in sequence. Lesson 5 will help you evaluate which client problems are worth building a service around.';

  async function copyLink() {
    try { await navigator.clipboard.writeText(LESSON_URL); showToast('Lesson 4 link copied ✓'); }
    catch (_) { const area = document.createElement('textarea'); area.value = LESSON_URL; area.style.position='fixed'; area.style.opacity='0'; document.body.appendChild(area); area.select(); document.execCommand('copy'); area.remove(); showToast('Lesson 4 link copied ✓'); }
  }
  async function shareLesson() {
    if (navigator.share) {
      try { await navigator.share({ title:'Lesson 4 — Understanding Client Problems', text:'Module 1 of Freelancing Career Mastery', url:LESSON_URL }); return; }
      catch (_) {}
    }
    await copyLink();
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('#shareBtn, #footerShare, #copyLinkBtn');
    if (!button) return;
    event.preventDefault();event.stopImmediatePropagation();
    if (button.id === 'copyLinkBtn') copyLink(); else shareLesson();
  }, true);

  if(!document.querySelector('script[data-premium-motion-loader]')){
    const premium=document.createElement('script');
    premium.src='premium-motion.js';
    premium.dataset.premiumMotionLoader='true';
    document.body.appendChild(premium);
  }
})();
