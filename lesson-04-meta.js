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

  function replaceClassLabel(node) {
    if (!node || !node.textContent.includes('Class 11')) return;
    node.textContent = node.textContent.replace('Class 11', 'Lesson 4');
  }

  function patchCompletionCopy() {
    replaceClassLabel(completionTitle);
    replaceClassLabel(completionText);
    replaceClassLabel(markCompleteHero);
  }

  [completionTitle, completionText, markCompleteHero].filter(Boolean).forEach((node) => {
    new MutationObserver(patchCompletionCopy).observe(node, { childList: true, subtree: true, characterData: true });
  });
  patchCompletionCopy();

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(LESSON_URL);
      showToast('Lesson 4 link copied ✓');
    } catch (_) {
      const area = document.createElement('textarea');
      area.value = LESSON_URL;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
      showToast('Lesson 4 link copied ✓');
    }
  }

  async function shareLesson() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Lesson 4 — Understanding Client Problems',
          text: 'Module 1 of Freelancing Career Mastery',
          url: LESSON_URL
        });
        return;
      } catch (_) {}
    }
    await copyLink();
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('#shareBtn, #footerShare, #copyLinkBtn');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (button.id === 'copyLinkBtn') copyLink();
    else shareLesson();
  }, true);
})();