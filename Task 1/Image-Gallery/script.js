/* ==========================================================================
   LUMEN — script.js
   CodeAlpha Frontend Development Internship
   Vanilla JavaScript only — no frameworks, no dependencies.
   Organized into small modules: Data, State, Render, Filters, Search,
   Favorites, Lightbox, Slideshow, Theme, Cursor, Particles, Misc UI.
   ========================================================================== */

(() => {
  'use strict';

  /* ------------------------------------------------------------------
     1. DATA — the photograph collection
     ------------------------------------------------------------------ */
  const IMAGES = [
    { id: 1,  title: 'Emerald Canopy',        category: 'nature',       url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80' },
    { id: 2,  title: 'Path Through the Pines', category: 'nature',       url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80' },
    { id: 3,  title: 'Golden Hour Meadow',     category: 'nature',       url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80' },
    { id: 4,  title: 'Mirror Lake',            category: 'mountains',    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80' },
    { id: 5,  title: 'Alpine Ridgeline',       category: 'mountains',    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80' },
    { id: 6,  title: 'Summit at Dawn',         category: 'mountains',    url: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1200&q=80' },
    { id: 7,  title: 'Turquoise Shoreline',    category: 'beach',        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
    { id: 8,  title: 'Palm-Lined Bay',         category: 'beach',        url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80' },
    { id: 9,  title: 'Tidewash at Sunset',     category: 'beach',        url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80' },
    { id: 10, title: 'Skyline After Rain',     category: 'city',         url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80' },
    { id: 11, title: 'Neon District',          category: 'city',        url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80' },
    { id: 12, title: 'Avenue at Rush Hour',    category: 'city',        url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1200&q=80' },
    { id: 13, title: 'The Watchful Lion',      category: 'wildlife',    url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80' },
    { id: 14, title: 'Giants of the Savannah', category: 'wildlife',    url: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1200&q=80' },
    { id: 15, title: 'Stillness in the Wild',  category: 'wildlife',    url: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=1200&q=80' },
    { id: 16, title: 'Glass & Geometry',       category: 'architecture', url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=80' },
    { id: 17, title: 'Modern Facade',          category: 'architecture', url: 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&w=1200&q=80' },
    { id: 18, title: 'Interior Light Study',   category: 'architecture', url: 'https://images.unsplash.com/photo-1519642918688-7e43b19245d8?auto=format&fit=crop&w=1200&q=80' }
  ];

  /* ------------------------------------------------------------------
     2. STATE
     ------------------------------------------------------------------ */
  const state = {
    order: IMAGES.map(img => img.id),   // current display order (for shuffle)
    activeFilter: 'all',
    searchTerm: '',
    favorites: new Set(JSON.parse(localStorage.getItem('lumen-favorites') || '[]')),
    showFavoritesOnly: false,
    masonry: false,
    lightboxIndex: 0,
    visibleIds: [],                      // ids currently rendered (respects filter/search)
    slideshowTimer: null
  };

  /* ------------------------------------------------------------------
     3. DOM REFS
     ------------------------------------------------------------------ */
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  const galleryGrid   = $('#galleryGrid');
  const emptyState    = $('#emptyState');
  const resultCount   = $('#resultCount');
  const filterBar     = $('#filterBar');
  const searchInput   = $('#searchInput');
  const favToggle     = $('#favToggle');
  const favCount      = $('#favCount');
  const shuffleBtn    = $('#shuffleBtn');
  const layoutToggle  = $('#layoutToggle');
  const themeToggle   = $('#themeToggle');
  const slideshowBtn  = $('#slideshowBtn');
  const backToTop     = $('#backToTop');
  const toastEl       = $('#toast');

  const lightbox        = $('#lightbox');
  const lbImage          = $('#lbImage');
  const lbSpinner         = $('#lbSpinner');
  const lbTitle           = $('#lbTitle');
  const lbCategory        = $('#lbCategory');
  const lbCounter         = $('#lbCounter');
  const lbFav              = $('#lbFav');
  const lbDownload         = $('#lbDownload');
  const lbClose            = $('#lbClose');
  const lbPrev             = $('#lbPrev');
  const lbNext             = $('#lbNext');
  const lbFullscreen       = $('#lbFullscreen');
  const lightboxBackdrop   = $('#lightboxBackdrop');

  /* ------------------------------------------------------------------
     4. UTILITIES
     ------------------------------------------------------------------ */
  const byId = id => IMAGES.find(img => img.id === id);

  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  function persistFavorites() {
    localStorage.setItem('lumen-favorites', JSON.stringify(Array.from(state.favorites)));
    favCount.textContent = state.favorites.size;
  }

  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* ------------------------------------------------------------------
     5. RENDER GALLERY
     ------------------------------------------------------------------ */
  function computeVisible() {
    const term = state.searchTerm.trim().toLowerCase();
    return state.order
      .map(byId)
      .filter(img => {
        const matchesFilter = state.activeFilter === 'all' || img.category === state.activeFilter;
        const matchesSearch = !term || img.title.toLowerCase().includes(term) || img.category.includes(term);
        const matchesFav = !state.showFavoritesOnly || state.favorites.has(img.id);
        return matchesFilter && matchesSearch && matchesFav;
      });
  }

  function cardTemplate(img, index) {
    const isFav = state.favorites.has(img.id);
    const card = document.createElement('article');
    card.className = 'card';
    card.style.animationDelay = `${Math.min(index * 0.06, 0.6)}s`;
    card.dataset.id = img.id;
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Open ${img.title} in viewer`);

    card.innerHTML = `
      <div class="card-media">
        <div class="card-shimmer"></div>
        <img data-src="${img.url}" alt="${img.title} — ${img.category} photograph" loading="lazy" />
        <span class="card-badge">${capitalize(img.category)}</span>
        <button class="card-fav ripple ${isFav ? 'active' : ''}" aria-label="Toggle favorite for ${img.title}" data-id="${img.id}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>
          </svg>
        </button>
        <div class="card-overlay">
          <span class="card-category">${capitalize(img.category)}</span>
          <h3 class="card-title">${img.title}</h3>
        </div>
      </div>
    `;
    return card;
  }

  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function renderGallery() {
    const visible = computeVisible();
    state.visibleIds = visible.map(img => img.id);

    galleryGrid.innerHTML = '';
    visible.forEach((img, i) => galleryGrid.appendChild(cardTemplate(img, i)));

    emptyState.hidden = visible.length !== 0;
    resultCount.textContent = `${visible.length} photograph${visible.length === 1 ? '' : 's'}`;

    lazyLoadImages();
    attachCardEvents();
  }

  /* ------------------------------------------------------------------
     6. LAZY LOADING (IntersectionObserver)
     ------------------------------------------------------------------ */
  const imgObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
        obs.unobserve(img);
      }
    });
  }, { rootMargin: '200px 0px' });

  function lazyLoadImages() {
    $$('.card-media img[data-src]').forEach(img => imgObserver.observe(img));
  }

  /* ------------------------------------------------------------------
     7. CARD EVENTS (open lightbox / toggle favorite)
     ------------------------------------------------------------------ */
  function attachCardEvents() {
    $$('.card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.card-fav')) return;
        openLightboxById(Number(card.dataset.id));
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightboxById(Number(card.dataset.id));
        }
      });
    });

    $$('.card-fav').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(Number(btn.dataset.id));
      });
    });
  }

  function toggleFavorite(id) {
    if (state.favorites.has(id)) {
      state.favorites.delete(id);
      showToast('Removed from favorites');
    } else {
      state.favorites.add(id);
      showToast('Added to favorites ♥');
    }
    persistFavorites();

    // Update any visible UI referencing this id without a full re-render
    const btn = document.querySelector(`.card-fav[data-id="${id}"]`);
    if (btn) {
      const isFav = state.favorites.has(id);
      btn.classList.toggle('active', isFav);
      btn.querySelector('svg').setAttribute('fill', isFav ? 'currentColor' : 'none');
    }
    if (Number(lightbox.dataset.currentId) === id) updateLightboxFavIcon(id);

    if (state.showFavoritesOnly) renderGallery();
  }

  /* ------------------------------------------------------------------
     8. FILTERS
     ------------------------------------------------------------------ */
  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    $$('.filter-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    state.activeFilter = btn.dataset.filter;
    animateFilterOut(() => renderGallery());
  });

  function animateFilterOut(callback) {
    const cards = $$('.card');
    if (!cards.length) return callback();
    cards.forEach(c => c.classList.add('filtering-out'));
    setTimeout(callback, 220);
  }

  /* ------------------------------------------------------------------
     9. SEARCH
     ------------------------------------------------------------------ */
  let searchDebounce;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      state.searchTerm = e.target.value;
      renderGallery();
    }, 180);
  });

  /* ------------------------------------------------------------------
     10. FAVORITES TOGGLE VIEW
     ------------------------------------------------------------------ */
  favToggle.addEventListener('click', () => {
    state.showFavoritesOnly = !state.showFavoritesOnly;
    favToggle.classList.toggle('is-active', state.showFavoritesOnly);
    favToggle.setAttribute('aria-pressed', String(state.showFavoritesOnly));
    renderGallery();
    if (state.showFavoritesOnly) showToast(`Showing ${state.favorites.size} favorite${state.favorites.size === 1 ? '' : 's'}`);
  });

  /* ------------------------------------------------------------------
     11. SHUFFLE
     ------------------------------------------------------------------ */
  shuffleBtn.addEventListener('click', () => {
    shuffleBtn.style.transform = 'rotate(360deg)';
    setTimeout(() => { shuffleBtn.style.transform = ''; }, 500);
    state.order = shuffleArray(state.order);
    renderGallery();
    showToast('Gallery shuffled');
  });

  /* ------------------------------------------------------------------
     12. MASONRY LAYOUT TOGGLE
     ------------------------------------------------------------------ */
  layoutToggle.addEventListener('click', () => {
    state.masonry = !state.masonry;
    galleryGrid.classList.toggle('masonry', state.masonry);
    layoutToggle.classList.toggle('is-active', state.masonry);
    showToast(state.masonry ? 'Masonry layout on' : 'Grid layout restored');
  });

  /* ------------------------------------------------------------------
     13. DARK / LIGHT MODE
     ------------------------------------------------------------------ */
  function applyTheme(mode) {
    document.body.classList.toggle('light-mode', mode === 'light');
    localStorage.setItem('lumen-theme', mode);
  }
  themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-mode');
    applyTheme(isLight ? 'dark' : 'light');
  });
  applyTheme(localStorage.getItem('lumen-theme') || 'dark');

  /* ------------------------------------------------------------------
     14. LIGHTBOX
     ------------------------------------------------------------------ */
  function openLightboxById(id) {
    const idx = state.visibleIds.indexOf(id);
    state.lightboxIndex = idx === -1 ? 0 : idx;
    lightbox.dataset.currentId = id;
    renderLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    stopSlideshow();
  }

  function renderLightbox() {
    const id = state.visibleIds[state.lightboxIndex];
    const img = byId(id);
    if (!img) return;
    lightbox.dataset.currentId = id;

    lbImage.classList.remove('loaded');
    lbSpinner.classList.remove('hidden');
    lbImage.src = img.url;
    lbImage.alt = img.title;
    lbImage.onload = () => { lbImage.classList.add('loaded'); lbSpinner.classList.add('hidden'); };

    lbTitle.textContent = img.title;
    lbCategory.textContent = capitalize(img.category);
    lbCounter.textContent = `${state.lightboxIndex + 1} / ${state.visibleIds.length}`;
    lbDownload.href = img.url + '&fm=jpg';
    lbDownload.setAttribute('download', `${img.title.replace(/\s+/g, '-').toLowerCase()}.jpg`);

    updateLightboxFavIcon(id);
  }

  function updateLightboxFavIcon(id) {
    const isFav = state.favorites.has(id);
    lbFav.classList.toggle('active', isFav);
    lbFav.querySelector('svg').setAttribute('fill', isFav ? 'currentColor' : 'none');
  }

  function showNext() {
    state.lightboxIndex = (state.lightboxIndex + 1) % state.visibleIds.length;
    renderLightbox();
  }
  function showPrev() {
    state.lightboxIndex = (state.lightboxIndex - 1 + state.visibleIds.length) % state.visibleIds.length;
    renderLightbox();
  }

  lbClose.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);
  lbNext.addEventListener('click', showNext);
  lbPrev.addEventListener('click', showPrev);
  lbFav.addEventListener('click', () => toggleFavorite(Number(lightbox.dataset.currentId)));

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // Swipe support for mobile
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 50) dx > 0 ? showPrev() : showNext();
  }, { passive: true });

  // Fullscreen
  lbFullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      lightbox.requestFullscreen?.().catch(() => showToast('Fullscreen not supported'));
    } else {
      document.exitFullscreen?.();
    }
  });

  /* ------------------------------------------------------------------
     15. SLIDESHOW MODE
     ------------------------------------------------------------------ */
  slideshowBtn.addEventListener('click', () => {
    if (state.slideshowTimer) {
      stopSlideshow();
    } else {
      if (!state.visibleIds.length) return;
      if (!lightbox.classList.contains('open')) openLightboxById(state.visibleIds[0]);
      state.slideshowTimer = setInterval(showNext, 2600);
      slideshowBtn.classList.add('active');
      showToast('Slideshow started');
    }
  });
  function stopSlideshow() {
    if (state.slideshowTimer) {
      clearInterval(state.slideshowTimer);
      state.slideshowTimer = null;
      slideshowBtn.classList.remove('active');
    }
  }

  /* ------------------------------------------------------------------
     16. RIPPLE EFFECT (delegated)
     ------------------------------------------------------------------ */
  document.addEventListener('click', (e) => {
    const target = e.target.closest('.ripple');
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const circle = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    circle.className = 'ripple-circle';
    circle.style.width = circle.style.height = `${size}px`;
    circle.style.left = `${e.clientX - rect.left - size / 2}px`;
    circle.style.top = `${e.clientY - rect.top - size / 2}px`;
    target.appendChild(circle);
    setTimeout(() => circle.remove(), 620);
  });

  /* ------------------------------------------------------------------
     17. CUSTOM CURSOR (desktop only)
     ------------------------------------------------------------------ */
  const cursorDot = $('#cursorDot');
  const cursorRing = $('#cursorRing');
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (supportsHover) {
    document.body.classList.add('custom-cursor-on');
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
      document.body.classList.add('cursor-active');
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('.card, .icon-btn, .filter-btn, .lb-btn, .lb-nav, a, button, input')) {
        cursorRing.classList.add('hovering');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('.card, .icon-btn, .filter-btn, .lb-btn, .lb-nav, a, button, input')) {
        cursorRing.classList.remove('hovering');
      }
    });
  }

  /* ------------------------------------------------------------------
     18. FLOATING PARTICLES BACKGROUND (canvas)
     ------------------------------------------------------------------ */
  const canvas = $('#particles');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initParticles() {
    const count = window.innerWidth < 700 ? 26 : 55;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.5 + 0.15
    }));
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(203, 198, 224, ${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  initParticles();
  drawParticles();
  window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

  /* ------------------------------------------------------------------
     19. MOUSE PARALLAX ON HERO BLOBS
     ------------------------------------------------------------------ */
  const blobs = $$('.blob');
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    blobs.forEach((blob, i) => {
      const strength = (i + 1) * 8;
      blob.style.marginLeft = `${x * strength}px`;
      blob.style.marginTop = `${y * strength}px`;
    });
  });

  /* ------------------------------------------------------------------
     20. SCROLL REVEAL (IntersectionObserver)
     ------------------------------------------------------------------ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  function initRevealTargets() {
    $$('.reveal').forEach(el => revealObserver.observe(el));
  }

  /* ------------------------------------------------------------------
     21. ANIMATED STAT COUNTERS
     ------------------------------------------------------------------ */
  function animateCounters() {
    $$('.stat-num').forEach(el => {
      const target = Number(el.dataset.count);
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const tick = () => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current < target) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  /* ------------------------------------------------------------------
     22. BACK TO TOP + NAVBAR SCROLL STATE
     ------------------------------------------------------------------ */
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ------------------------------------------------------------------
     23. PAGE LOADER
     ------------------------------------------------------------------ */
  function runLoader() {
    const loader = $('#loader');
    const progress = $('#loaderProgress');
    let pct = 0;
    const interval = setInterval(() => {
      pct += Math.random() * 18;
      if (pct >= 100) {
        pct = 100;
        clearInterval(interval);
        setTimeout(() => {
          loader.classList.add('hidden');
          animateCounters();
        }, 250);
      }
      progress.style.width = `${pct}%`;
    }, 140);
  }

  /* ------------------------------------------------------------------
     24. INIT
     ------------------------------------------------------------------ */
  function init() {
    favCount.textContent = state.favorites.size;
    renderGallery();
    initRevealTargets();
    runLoader();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
