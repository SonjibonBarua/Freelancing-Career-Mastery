(() => {
  const modules=window.COURSE_MODULES||[];
  modules.forEach(module=>module.lessons.forEach(lesson=>{
    lesson.status='available';
    if(!lesson.href) lesson.href=lesson.n<=6?`lesson-${String(lesson.n).padStart(2,'0')}.html`:`lesson.html?lesson=${lesson.n}`;
  }));
})();
