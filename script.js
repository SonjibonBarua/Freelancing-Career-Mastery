const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const progress = document.getElementById('progress');
const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menuBtn');
const closeMenu = document.getElementById('closeMenu');
const mobileOverlay = document.getElementById('mobileOverlay');
const noteSearch = document.getElementById('noteSearch');
const topSearch = document.getElementById('topSearch');
const clearSearch = document.getElementById('clearSearch');
const searchResultsBar = document.getElementById('searchResultsBar');
const searchMessage = document.getElementById('searchMessage');
const noResults = document.getElementById('noResults');
const toast = document.getElementById('toast');
const shareBtn = document.getElementById('shareBtn');
const footerShare = document.getElementById('footerShare');
const copyLinkBtn = document.getElementById('copyLinkBtn');
const printBtn = document.getElementById('printBtn');
const completeBtn = document.getElementById('completeBtn');
const markCompleteHero = document.getElementById('markCompleteHero');
const completionCard = document.getElementById('completion');
const completionTitle = document.getElementById('completionTitle');
const completionText = document.getElementById('completionText');
const sideProgressLabel = document.getElementById('sideProgressLabel');
const sideProgressBar = document.getElementById('sideProgressBar');
const taskCount = document.getElementById('taskCount');
const progressRing = document.getElementById('progressRing');
const ringLabel = document.getElementById('ringLabel');
const activeSectionLabel = document.getElementById('activeSectionLabel');
const checkboxes = [...document.querySelectorAll('[data-task]')];
const outlineLinks = [...document.querySelectorAll('.outline-link')];
const lessonSections = [...document.querySelectorAll('.lesson-section')];

const STORAGE = {
  theme: 'sure-earning-theme',
  tasks: 'sure-earning-class11-tasks',
  complete: 'sure-earning-class11-complete'
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function applyTheme(theme) {
  const isDark = theme === 'dark';
  body.classList.toggle('dark', isDark);
  themeToggle.textContent = isDark ? '☀' : '☾';
  themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
}

const savedTheme = localStorage.getItem(STORAGE.theme);
const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme || (systemDark ? 'dark' : 'light'));

themeToggle.addEventListener('click', () => {
  const next = body.classList.contains('dark') ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem(STORAGE.theme, next);
});

function updateReadingProgress() {
  const scrollTop = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  progress.style.width = `${height ? (scrollTop / height) * 100 : 0}%`;
}
window.addEventListener('scroll', updateReadingProgress, { passive: true });
updateReadingProgress();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

function openMenu() {
  sidebar.classList.add('open');
  mobileOverlay.classList.add('show');
  body.style.overflow = 'hidden';
}
function closeSidebar() {
  sidebar.classList.remove('open');
  mobileOverlay.classList.remove('show');
  body.style.overflow = '';
}
menuBtn.addEventListener('click', openMenu);
closeMenu.addEventListener('click', closeSidebar);
mobileOverlay.addEventListener('click', closeSidebar);
document.querySelectorAll('.side-nav a').forEach(link => link.addEventListener('click', closeSidebar));

function searchableText(el) {
  return `${el.dataset.search || ''} ${el.textContent || ''}`.toLowerCase();
}
function resetSearchClasses() {
  document.querySelectorAll('.searchable-item').forEach(el => el.classList.remove('search-hidden', 'search-match'));
  document.querySelectorAll('.searchable-section').forEach(el => el.classList.remove('search-hidden'));
}
function runSearch(value) {
  const query = value.trim().toLowerCase();
  const items = [...document.querySelectorAll('.searchable-item')];
  const sections = [...document.querySelectorAll('.searchable-section')];
  resetSearchClasses();

  if (!query) {
    searchResultsBar.hidden = true;
    noResults.hidden = true;
    return;
  }

  items.forEach(el => {
    const match = searchableText(el).includes(query);
    el.classList.toggle('search-hidden', !match);
    el.classList.toggle('search-match', match);
  });

  sections.forEach(section => {
    const nestedItems = [...section.querySelectorAll('.searchable-item')];
    const directMatch = searchableText(section).includes(query);
    if (nestedItems.length) {
      const hasVisibleItem = nestedItems.some(item => !item.classList.contains('search-hidden'));
      section.classList.toggle('search-hidden', !hasVisibleItem && !directMatch);
    } else {
      section.classList.toggle('search-hidden', !directMatch);
    }
  });

  const visibleSections = sections.filter(el => !el.classList.contains('search-hidden'));
  searchResultsBar.hidden = false;
  searchMessage.textContent = visibleSections.length
    ? `Showing results for “${value.trim()}”`
    : `No results for “${value.trim()}”`;
  noResults.hidden = visibleSections.length > 0;

  if (visibleSections.length) visibleSections[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (window.innerWidth <= 980) closeSidebar();
}

noteSearch.addEventListener('input', e => runSearch(e.target.value));
clearSearch.addEventListener('click', () => {
  noteSearch.value = '';
  runSearch('');
  noteSearch.focus();
});
topSearch.addEventListener('click', () => {
  if (window.innerWidth <= 980) openMenu();
  setTimeout(() => noteSearch.focus(), 150);
});

document.addEventListener('keydown', e => {
  const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
  if (e.key === '/' && !typing) {
    e.preventDefault();
    if (window.innerWidth <= 980) openMenu();
    setTimeout(() => noteSearch.focus(), 150);
  }
  if (e.key === 'Escape') {
    if (noteSearch.value) {
      noteSearch.value = '';
      runSearch('');
    }
    closeSidebar();
  }
});

function loadTasks() {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(STORAGE.tasks) || '{}'); } catch (_) {}
  checkboxes.forEach(box => { box.checked = Boolean(saved[box.dataset.task]); });
  updateTaskProgress();
}
function saveTasks() {
  const saved = {};
  checkboxes.forEach(box => { saved[box.dataset.task] = box.checked; });
  localStorage.setItem(STORAGE.tasks, JSON.stringify(saved));
  updateTaskProgress();
}
function updateTaskProgress() {
  const done = checkboxes.filter(box => box.checked).length;
  const total = checkboxes.length || 1;
  const percent = Math.round((done / total) * 100);
  taskCount.textContent = `${done} of ${total} actions complete`;
  sideProgressLabel.textContent = `${percent}%`;
  sideProgressBar.style.width = `${percent}%`;
  ringLabel.textContent = `${percent}%`;
  progressRing.style.setProperty('--p', percent);
  if (percent === 100) showToast('Action checklist complete ✓');
}
checkboxes.forEach(box => box.addEventListener('change', saveTasks));
loadTasks();

function isLessonComplete() {
  return localStorage.getItem(STORAGE.complete) === 'true';
}
function renderCompletion() {
  const complete = isLessonComplete();
  completionCard.classList.toggle('completed', complete);
  markCompleteHero.classList.toggle('completed', complete);
  completeBtn.textContent = complete ? 'Completed ✓' : 'Mark lesson complete';
  markCompleteHero.textContent = complete ? '✓ Lesson completed' : '✓ Mark complete';
  completionTitle.textContent = complete ? 'Class 11 completed.' : 'Ready to finish Class 11?';
  completionText.textContent = complete
    ? 'Your completion status is saved on this device. You can revisit the lesson anytime.'
    : 'Mark the lesson complete when you are satisfied with your understanding.';
}
function toggleCompletion() {
  const next = !isLessonComplete();
  localStorage.setItem(STORAGE.complete, String(next));
  renderCompletion();
  showToast(next ? 'Class 11 marked complete ✓' : 'Completion status removed');
}
completeBtn.addEventListener('click', toggleCompletion);
markCompleteHero.addEventListener('click', toggleCompletion);
renderCompletion();

async function copyLessonLink() {
  const url = 'https://sonjibonbarua.github.io/Sure-Earning-Class-Lesson/';
  try {
    await navigator.clipboard.writeText(url);
    showToast('Lesson link copied');
  } catch (_) {
    const temp = document.createElement('textarea');
    temp.value = url;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    temp.remove();
    showToast('Lesson link copied');
  }
}
async function shareLesson() {
  const shareData = {
    title: 'Class 11 — Foundation of Freelancing',
    text: 'Sure Earning Course Notes — Class 11: Foundation of Freelancing',
    url: 'https://sonjibonbarua.github.io/Sure-Earning-Class-Lesson/'
  };
  if (navigator.share) {
    try { await navigator.share(shareData); } catch (_) {}
  } else {
    copyLessonLink();
  }
}
shareBtn.addEventListener('click', shareLesson);
footerShare.addEventListener('click', shareLesson);
copyLinkBtn.addEventListener('click', copyLessonLink);
printBtn.addEventListener('click', () => window.print());

const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter(entry => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  const id = visible.target.id;
  const title = visible.target.dataset.sectionTitle || 'Foundation of Freelancing';
  activeSectionLabel.textContent = title;
  outlineLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
}, { rootMargin: '-22% 0px -62% 0px', threshold: [0, .15, .35, .6] });
lessonSections.forEach(section => sectionObserver.observe(section));

outlineLinks.forEach(link => {
  link.addEventListener('click', () => {
    outlineLinks.forEach(item => item.classList.remove('active'));
    link.classList.add('active');
  });
});
