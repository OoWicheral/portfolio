(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const body = document.body;

  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  body.prepend(progress);

  const revealTargets = document.querySelectorAll(
    '.section-label, .intro-grid, .scroll-down, .projects-heading, .project-row, .site-footer > *,\n' +
    '.collection-hero > *, .intro-block, .life-block, .vision-block, .timeline-section > h2, .timeline-item, .poetry > *, .quote-grid p, .footer'
  );

  revealTargets.forEach((element, index) => {
    element.classList.add('reveal');
    element.style.setProperty('--reveal-delay', `${Math.min((index % 4) * 60, 180)}ms`);
  });

  if (reduceMotion) {
    revealTargets.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  revealTargets.forEach((element) => observer.observe(element));

  let ticking = false;
  const updateScroll = () => {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progressValue = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
    root.style.setProperty('--scroll-progress', `${progressValue}%`);
    body.classList.toggle('is-scrolled', scrollTop > 24);

    const hero = document.querySelector('.hero, .collection-hero');
    const heroMedia = hero?.querySelector('.portrait-placeholder');
    if (heroMedia) {
      const movement = Math.min(scrollTop * 0.045, 22);
      heroMedia.style.setProperty('--parallax-y', `${movement}px`);
    }

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScroll);
      ticking = true;
    }
  }, { passive: true });

  updateScroll();
})();
