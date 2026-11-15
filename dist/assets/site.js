(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-main-nav]');

  let lenis = null;
  if (!reduceMotion && window.Lenis) {
    lenis = new window.Lenis({
      duration: 1.05,
      smoothWheel: true,
      anchors: true
    });

    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      lenis.on('scroll', window.ScrollTrigger.update);
      window.gsap.ticker.add((time) => lenis.raf(time * 1000));
      window.gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => {
        lenis.raf(time);
        window.requestAnimationFrame(raf);
      };
      window.requestAnimationFrame(raf);
    }
  }

  const closeMenu = () => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Menü öffnen');
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(willOpen));
      menuButton.setAttribute('aria-label', willOpen ? 'Menü schließen' : 'Menü öffnen');
      nav.classList.toggle('is-open', willOpen);
      document.body.classList.toggle('menu-open', willOpen);
    });

    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 18);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  document.querySelectorAll('[data-compare]').forEach((compare) => {
    const input = compare.querySelector('input[type="range"]');
    if (!input) return;
    const update = () => compare.style.setProperty('--position', `${input.value}%`);
    input.addEventListener('input', update);
    update();
  });

  const lightbox = document.querySelector('[data-lightbox-dialog]');
  const lightboxImage = lightbox?.querySelector('[data-lightbox-image]');
  const lightboxCaption = lightbox?.querySelector('[data-lightbox-caption]');
  const lightboxClose = lightbox?.querySelector('[data-lightbox-close]');
  let lightboxTrigger = null;

  const closeLightbox = () => {
    if (!lightbox) return;
    if (lightbox.open && typeof lightbox.close === 'function') lightbox.close();
    else lightbox.removeAttribute('open');
    document.body.classList.remove('lightbox-open');
  };

  if (lightbox && lightboxImage) {
    document.querySelectorAll('[data-lightbox-open]').forEach((button) => {
      button.addEventListener('click', () => {
        lightboxTrigger = button;
        lightboxImage.src = button.dataset.lightboxSrc || '';
        lightboxImage.alt = button.dataset.lightboxAlt || '';
        if (lightboxCaption) lightboxCaption.textContent = button.dataset.lightboxAlt || '';
        document.body.classList.add('lightbox-open');
        if (typeof lightbox.showModal === 'function') lightbox.showModal();
        else lightbox.setAttribute('open', '');
        lightboxClose?.focus();
      });
    });

    lightboxClose?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    lightbox.addEventListener('close', () => {
      document.body.classList.remove('lightbox-open');
      lightboxImage.removeAttribute('src');
      lightboxImage.alt = '';
      if (lightboxCaption) lightboxCaption.textContent = '';
      lightboxTrigger?.focus();
      lightboxTrigger = null;
    });
    lightbox.addEventListener('cancel', () => {
      document.body.classList.remove('lightbox-open');
    });
  }

  const qualificationModals = [...document.querySelectorAll('[data-qualification-modal]')];
  let qualificationTrigger = null;

  const closeQualificationModal = (modal) => {
    if (!modal) return;
    if (modal.open && typeof modal.close === 'function') modal.close();
    else modal.removeAttribute('open');
  };

  document.querySelectorAll('[data-qualification-open]').forEach((button) => {
    button.addEventListener('click', () => {
      const modal = document.getElementById(button.dataset.qualificationOpen || '');
      if (!modal) return;
      qualificationTrigger = button;
      document.body.classList.add('qualification-overlay-open');
      if (typeof modal.showModal === 'function') modal.showModal();
      else modal.setAttribute('open', '');
      modal.querySelector('[data-qualification-close]')?.focus();
    });
  });

  qualificationModals.forEach((modal) => {
    modal.querySelector('[data-qualification-close]')?.addEventListener('click', () => closeQualificationModal(modal));
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeQualificationModal(modal);
    });
    modal.addEventListener('close', () => {
      if (!qualificationModals.some((item) => item.open)) document.body.classList.remove('qualification-overlay-open');
      qualificationTrigger?.focus();
      qualificationTrigger = null;
    });
    modal.addEventListener('cancel', () => {
      document.body.classList.remove('qualification-overlay-open');
    });
  });

  document.querySelectorAll('[data-region-showcase]').forEach((showcase) => {
    const name = showcase.querySelector('[data-region-name]');
    const counter = showcase.querySelector('[data-region-counter]');
    const progress = showcase.querySelector('[data-region-progress]');
    const controls = [...showcase.querySelectorAll('[data-region-select]')];
    let places = [];

    try {
      places = JSON.parse(showcase.dataset.places || '[]');
    } catch {
      places = [];
    }

    if (!name || !places.length) return;

    const duration = 4300;
    let current = 0;
    let timer = 0;
    let nameAnimation = null;
    let progressAnimation = null;
    let started = false;

    const frames = (index) => index % 2 === 0 ? [
      { opacity: 0, transform: 'translate3d(0, 1rem, 0) scale(.72)', filter: 'blur(12px)', offset: 0 },
      { opacity: 1, transform: 'translate3d(0, 0, 0) scale(.96)', filter: 'blur(0)', offset: .18 },
      { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1.07)', filter: 'blur(0)', offset: .78 },
      { opacity: 0, transform: 'translate3d(0, -.2rem, 0) scale(1.3)', filter: 'blur(9px)', offset: 1 }
    ] : [
      { opacity: 0, transform: 'translate3d(0, -.45rem, 0) scale(1.48)', filter: 'blur(12px)', offset: 0 },
      { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1.08)', filter: 'blur(0)', offset: .2 },
      { opacity: 1, transform: 'translate3d(0, 0, 0) scale(.96)', filter: 'blur(0)', offset: .78 },
      { opacity: 0, transform: 'translate3d(0, .4rem, 0) scale(.76)', filter: 'blur(9px)', offset: 1 }
    ];

    const showPlace = (index, animate = true) => {
      window.clearTimeout(timer);
      nameAnimation?.cancel();
      progressAnimation?.cancel();

      current = (index + places.length) % places.length;
      const place = places[current];
      name.textContent = place.city;
      name.href = place.href;
      name.setAttribute('aria-label', `Einsatzgebiet ${place.city} öffnen`);
      name.dataset.length = place.city.length > 20 ? 'long' : 'normal';
      if (counter) counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(places.length).padStart(2, '0')}`;
      controls.forEach((control, controlIndex) => {
        if (controlIndex === current) control.dataset.active = 'true';
        else control.removeAttribute('data-active');
      });

      if (reduceMotion || !animate || typeof name.animate !== 'function') {
        name.style.opacity = '1';
        name.style.transform = 'none';
        name.style.filter = 'none';
        if (progress) progress.style.transform = 'scaleX(1)';
        return;
      }

      name.style.removeProperty('opacity');
      name.style.removeProperty('transform');
      name.style.removeProperty('filter');
      nameAnimation = name.animate(frames(current), {
        duration,
        easing: 'cubic-bezier(.22,.74,.24,1)',
        fill: 'both'
      });
      if (progress && typeof progress.animate === 'function') {
        progressAnimation = progress.animate([
          { transform: 'scaleX(0)' },
          { transform: 'scaleX(1)' }
        ], { duration, easing: 'linear', fill: 'both' });
      }
      timer = window.setTimeout(() => showPlace(current + 1), duration);
    };

    controls.forEach((control, index) => {
      control.addEventListener('pointerenter', () => showPlace(index));
      control.addEventListener('focus', () => showPlace(index));
    });

    if (reduceMotion || !('IntersectionObserver' in window)) {
      showPlace(0, false);
    } else {
      const showcaseObserver = new IntersectionObserver((entries) => {
        if (!started && entries.some((entry) => entry.isIntersecting)) {
          started = true;
          showPlace(0);
          showcaseObserver.disconnect();
        }
      }, { threshold: .28 });
      showcaseObserver.observe(showcase);
    }
  });

  const revealItems = [...document.querySelectorAll('.reveal')];
  const hasGsap = !reduceMotion && Boolean(window.gsap && window.ScrollTrigger);

  if (hasGsap) {
    revealItems.forEach((item) => {
      item.classList.add('is-visible');
      window.gsap.fromTo(item, { y: 34 }, {
        y: 0,
        duration: .8,
        ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 88%', once: true }
      });
    });

    const hero = document.querySelector('.hero');
    if (hero) {
      const heroTimeline = window.gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTimeline
        .from(hero.querySelector('.eyebrow'), { y: 18, duration: .55 })
        .from(hero.querySelector('h1'), { y: 42, duration: .9 }, '-=.28')
        .from(hero.querySelector('.hero-lead'), { y: 24, duration: .65 }, '-=.48')
        .from(hero.querySelectorAll('.hero-actions > *'), { y: 16, duration: .45, stagger: .09 }, '-=.35')
        .from(hero.querySelectorAll('.hero-trust > div'), { x: 24, duration: .5, stagger: .11 }, '-=.48');
    }

    window.gsap.utils.toArray('.section-heading').forEach((heading) => {
      window.gsap.from(heading.children, {
        y: 28,
        duration: .75,
        stagger: .12,
        ease: 'power3.out',
        scrollTrigger: { trigger: heading, start: 'top 84%', once: true }
      });
    });

    window.gsap.utils.toArray('.page-hero > img, .hero-bg > img').forEach((media) => {
      window.gsap.fromTo(media, { scale: 1.04, yPercent: -2 }, {
        scale: 1.08,
        yPercent: 5,
        ease: 'none',
        scrollTrigger: { trigger: media.parentElement, start: 'top top', end: 'bottom top', scrub: .8 }
      });
    });
  } else if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.09, rootMargin: '0px 0px -4% 0px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  document.querySelectorAll('.diagnosis-card, .process-step, .qualification-mini, .qualification-overview-card, .blog-card').forEach((card) => {
    card.classList.add('rb-spotlight-card');
    card.dataset.reactBits = 'SpotlightCard';
    const spotlight = document.createElement('span');
    spotlight.className = 'rb-spotlight';
    spotlight.setAttribute('aria-hidden', 'true');
    card.prepend(spotlight);
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`);
      card.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`);
    }, { passive: true });
  });

  const hero = document.querySelector('.hero');
  const rays = document.querySelector('.trio-light-rays');
  if (hero && rays && !reduceMotion) {
    hero.addEventListener('pointermove', (event) => {
      const shift = ((event.clientX / window.innerWidth) - .5) * 4;
      rays.style.transform = `translate3d(${shift}%, 0, 0)`;
    }, { passive: true });
  }

  document.querySelectorAll('[data-mail-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const service = data.get('service') || 'Bauwerksabdichtung';
      const name = `${data.get('vorname') || ''} ${data.get('nachname') || ''}`.trim();
      const phone = data.get('telefon') || 'nicht angegeben';
      const email = data.get('email') || 'nicht angegeben';
      const message = data.get('nachricht') || '';
      const subject = encodeURIComponent(`Anfrage: ${service}`);
      const body = encodeURIComponent(
        `Guten Tag BT Bautenschutz,\n\n` +
        `ich interessiere mich für: ${service}\n\n` +
        `${message}\n\n` +
        `Name: ${name}\nTelefon: ${phone}\nE-Mail: ${email}`
      );
      const status = form.querySelector('[data-form-status]');
      if (status) status.textContent = 'Ihre E-Mail-Anfrage wird jetzt vorbereitet.';
      window.location.href = `mailto:info@bt-bautenschutz.de?subject=${subject}&body=${body}`;
    });
  });

  document.querySelectorAll('[data-blog]').forEach((blog) => {
    const cards = [...blog.querySelectorAll('[data-blog-card]')];
    const input = blog.querySelector('[data-blog-search]');
    const filters = [...blog.querySelectorAll('[data-blog-filter]')];
    const moreButton = blog.querySelector('[data-blog-more]');
    const emptyState = blog.querySelector('[data-blog-empty]');
    const count = blog.querySelector('[data-blog-count]');
    let activeCategory = 'all';
    let visibleLimit = 12;

    const updateBlog = () => {
      const query = (input?.value || '').trim().toLocaleLowerCase('de');
      const matches = cards.filter((card) => {
        const matchesCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
        const matchesQuery = !query || (card.dataset.search || '').includes(query);
        return matchesCategory && matchesQuery;
      });

      cards.forEach((card) => { card.hidden = true; });
      matches.slice(0, visibleLimit).forEach((card) => { card.hidden = false; });
      if (count) count.textContent = `${matches.length} ${matches.length === 1 ? 'Beitrag' : 'Beiträge'}`;
      if (emptyState) emptyState.hidden = matches.length !== 0;
      if (moreButton) moreButton.hidden = matches.length <= visibleLimit;
    };

    input?.addEventListener('input', () => {
      visibleLimit = 12;
      updateBlog();
    });

    filters.forEach((filter) => {
      filter.addEventListener('click', () => {
        activeCategory = filter.dataset.blogFilter || 'all';
        visibleLimit = 12;
        filters.forEach((item) => {
          const selected = item === filter;
          item.setAttribute('aria-pressed', String(selected));
          item.classList.toggle('is-active', selected);
        });
        updateBlog();
      });
    });

    moreButton?.addEventListener('click', () => {
      visibleLimit += 12;
      updateBlog();
    });

    updateBlog();
  });

  document.querySelectorAll('[data-year]').forEach((item) => {
    item.textContent = String(new Date().getFullYear());
  });
})();
