document.addEventListener('DOMContentLoaded', function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header: glass state on scroll
  const header = document.querySelector('header');
  const setHeaderState = () => {
    header.classList.toggle('scrolled', window.scrollY > 24 || header.classList.contains('sticky--solid'));
  };
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  // Parallax — geparst via rAF, uitgeschakeld bij reduced motion
  if (!prefersReducedMotion) {
    const parallaxBg = document.querySelector('.parallax-bg');
    const parallaxSection = document.querySelector('.parallax-section');
    if (parallaxBg && parallaxSection) {
      let ticking = false;
      const update = () => {
        const rect = parallaxSection.getBoundingClientRect();
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const clamped = Math.min(Math.max(progress, 0), 1);
        parallaxBg.style.transform = `translateY(${(clamped - 0.5) * 60}px) translateZ(0)`;
        ticking = false;
      };
      window.addEventListener('scroll', () => {
        if (!ticking && window.innerWidth > 768) {
          requestAnimationFrame(update);
          ticking = true;
        }
      }, { passive: true });
    }
  }

  // Reveal on scroll — gestaggerd binnen elke oudergroep
  const fadeEls = document.querySelectorAll('.fade-in');
  fadeEls.forEach(el => {
    if (!el.style.getPropertyValue('--i')) {
      const siblings = [...el.parentElement.children].filter(c => c.classList.contains('fade-in'));
      el.style.setProperty('--i', Math.min(siblings.indexOf(el), 6));
    }
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  fadeEls.forEach(el => observer.observe(el));

  // FAQ accordion met aria
  const triggers = document.querySelectorAll('.accordion-trigger');
  triggers.forEach(trigger => {
    trigger.addEventListener('click', function () {
      const isOpen = this.classList.contains('active');
      triggers.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-expanded', 'false');
        t.nextElementSibling.classList.remove('active');
      });
      if (!isOpen) {
        this.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
        this.nextElementSibling.classList.add('active');
      }
    });
  });

  // Mobiel menu sluiten bij klik op link
  const navCheckbox = document.getElementById('nav__checkbox');
  document.querySelectorAll('.nav__menu a').forEach(link => {
    link.addEventListener('click', () => { navCheckbox.checked = false; });
  });

  // Smooth anchors (fallback naast scroll-padding)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  // Horizontale scroll: grab-to-scroll + indicator
  const scroller = document.querySelector('.horizontal-scroll-section');
  if (scroller) {
    let isDown = false;
    let startX;
    let scrollLeft;

    scroller.addEventListener('mousedown', (e) => {
      isDown = true;
      scroller.style.cursor = 'grabbing';
      startX = e.pageX - scroller.offsetLeft;
      scrollLeft = scroller.scrollLeft;
    });
    ['mouseleave', 'mouseup'].forEach(evt =>
      scroller.addEventListener(evt, () => {
        isDown = false;
        scroller.style.cursor = 'grab';
      })
    );
    scroller.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scroller.offsetLeft;
      scroller.scrollLeft = scrollLeft - (x - startX) * 1.6;
    });
    scroller.style.cursor = 'grab';

    const indicator = document.querySelector('.scroll-indicator');
    if (indicator) {
      indicator.addEventListener('click', () => {
        const cards = scroller.querySelectorAll('.scroll-card');
        const rect = scroller.getBoundingClientRect();
        for (const card of cards) {
          const cardRect = card.getBoundingClientRect();
          if (cardRect.right > rect.right + 1) {
            scroller.scrollTo({
              left: scroller.scrollLeft + (cardRect.right - rect.right) + 20,
              behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
            break;
          }
        }
      });
    }
  }
});
