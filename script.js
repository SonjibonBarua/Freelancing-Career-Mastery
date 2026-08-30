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

function applyTheme(theme) {
  const isDark = theme === 'dark';
  body.classList.toggle('dark', isDark);
  themeToggle.textContent = isDark ? '☀' : '☾';
}

applyTheme(localStorage.getItem('course-theme') || 'light');

themeToggle.addEventListener('click', () => {
  const next = body.classList.contains('dark') ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('course-theme', next);
});

function updateProgress() {
  const scrollTop = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  progress.style.width = `${height ? (scrollTop / height) * 100 : 0}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

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

function runSearch(value) {
  const query = value.trim().toLowerCase();
  const items = [...document.querySelectorAll('.searchable-item')];
  const sections = [...document.querySelectorAll('.searchable-section')];

  items.forEach(el => {
    el.classList.remove('search-hidden', 'search-match');
  });
  sections.forEach(el => el.classList.remove('search-hidden'));

  if (!query) {
    searchResultsBar.hidden = true;
    noResults.hidden = true;
    return;
  }

  let matches = 0;
  items.forEach(el => {
    const match = searchableText(el).includes(query);
    el.classList.toggle('search-hidden', !match);
    el.classList.toggle('search-match', match);
    if (match) matches++;
  });

  sections.forEach(section => {
    const nestedItems = section.querySelectorAll('.searchable-item');
    if (nestedItems.length) {
      const hasVisible = [...nestedItems].some(item => !item.classList.contains('search-hidden'));
      const ownMatch = searchableText(section).includes(query);
      section.classList.toggle('search-hidden', !hasVisible && !ownMatch);
    } else {
      section.classList.toggle('search-hidden', !searchableText(section).includes(query));
    }
  });

  const visibleSections = [...document.querySelectorAll('.searchable-section')].filter(el => !el.classList.contains('search-hidden'));
  searchResultsBar.hidden = false;
  searchMessage.textContent = visibleSections.length
    ? `Showing results for “${value.trim()}”`
    : `No results for “${value.trim()}”`;
  noResults.hidden = visibleSections.length > 0;

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
  if (e.key === '/' && document.activeElement !== noteSearch) {
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
