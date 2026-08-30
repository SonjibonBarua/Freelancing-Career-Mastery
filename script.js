const themeToggle = document.getElementById('themeToggle');
const progress = document.getElementById('progress');

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeToggle.textContent = isDark ? '☀' : '☾';
  localStorage.setItem('class11-theme', isDark ? 'dark' : 'light');
});

if (localStorage.getItem('class11-theme') === 'dark') {
  document.body.classList.add('dark');
  themeToggle.textContent = '☀';
}

window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  progress.style.width = `${height ? (scrollTop / height) * 100 : 0}%`;
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
