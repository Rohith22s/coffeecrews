 // Animations: trigger visibility classes and handle offcanvas link stagger + toggler rotation
    (function () {
      const infoContent = document.getElementById('infoContent');
      const imageBox = document.getElementById('imageBox');
      const offcanvasEl = document.getElementById('offcanvasNavbar');
      const toggler = document.getElementById('navToggler');
      const links = offcanvasEl.querySelectorAll('.nav-link');

      // Reveal main content with a short delay for pleasant entrance
      document.addEventListener('DOMContentLoaded', function () {
        // small timeout to allow paint
        requestAnimationFrame(() => {
          setTimeout(() => {
            if (infoContent) infoContent.classList.add('is-visible');
            if (imageBox) imageBox.classList.add('is-visible');
          }, 90);
        });
      });

      // When offcanvas opens, animate nav links in a staggered fashion
      offcanvasEl.addEventListener('show.bs.offcanvas', function () {
        // rotate toggler icon
        toggler.classList.add('toggled');

        links.forEach((link, i) => {
          link.classList.remove('is-visible');
          // staggered reveal
          setTimeout(() => link.classList.add('is-visible'), i * 55 + 80);
        });
      });

      // When offcanvas hides, reverse changes
      offcanvasEl.addEventListener('hide.bs.offcanvas', function () {
        toggler.classList.remove('toggled');
        links.forEach(link => link.classList.remove('is-visible'));
      });

      // Optional: small parallax on mousemove for desktop image (subtle)
      let supportsPointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
      if (imageBox && supportsPointer) {
        let lastX = 0, lastY = 0, raf = null;
        imageBox.addEventListener('mousemove', function (e) {
          const rect = imageBox.getBoundingClientRect();
          const cx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 -> 0.5
          const cy = (e.clientY - rect.top) / rect.height - 0.5;
          lastX = cx;
          lastY = cy;
          if (!raf) {
            raf = requestAnimationFrame(() => {
              imageBox.style.transform = `translate(${lastX * 6}px, ${lastY * 6}px) scale(1.01)`;
              raf = null;
            });
          }
        });
        imageBox.addEventListener('mouseleave', function () {
          imageBox.style.transform = '';
        });
      }

      // Respect reduced-motion: avoid JS animations if user requested reduced motion
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (reduce && reduce.matches) {
        // remove classes that animate or alter transitions
        if (infoContent) infoContent.classList.add('is-visible');
        if (imageBox) imageBox.classList.add('is-visible');
        links.forEach(link => link.classList.add('is-visible'));
      }
    })();

 // Scoped slider JS (only targets elements inside .slider-wrap)
    document.addEventListener('DOMContentLoaded', () => {
      const sliderRoot = document.querySelector('.slider-wrap');
      if (!sliderRoot) return;

      const cards = Array.from(sliderRoot.querySelectorAll('.card'));
      const dots = Array.from(sliderRoot.querySelectorAll('.dot'));

      // Per-slide data (title, description, extra) — edit as needed
      const slideInfos = [
        {
          title: 'Blend A',
          desc: 'Rich aroma, light roast. Bright citrus notes with mild acidity.',
          extra: 'Roast: Light • 250g'
        },
        {
          title: 'Blend B',
          desc: 'Smooth and balanced with a creamy mouthfeel.',
          extra: 'Roast: Medium • 500g'
        },
        {
          title: 'Signature',
          desc: 'Our classic, full-bodied blend with a chocolatey finish.',
          extra: 'Roast: Medium • 250g'
        },
        {
          title: 'Organic',
          desc: '100% organic, mild taste and eco-friendly farming.',
          extra: 'Roast: Light-Med • 250g'
        },
        {
          title: 'Limited',
          desc: 'Rare seasonal small-batch roast. Notes of berries and caramel.',
          extra: 'Limited release • 200g'
        }
      ];

      let active = 2; // starting index (center)
      const total = cards.length;

      // helper to set ARIA selected on tab buttons
      function setAriaSelectedOnDots() {
        dots.forEach((d, i) => d.setAttribute('aria-selected', i === active ? 'true' : 'false'));
      }

      function update() {
        cards.forEach((card, i) => {
          // reset classes cleanly while preserving the label span
          card.className = 'card';
          const diff = (i - active + total) % total;

          if (diff === 0) {
            card.classList.add('center');
            card.setAttribute('aria-hidden', 'false');
          } else if (diff === total - 1) {
            card.classList.add('back', 'left');
            card.setAttribute('aria-hidden', 'true');
          } else if (diff === 1) {
            card.classList.add('back', 'right');
            card.setAttribute('aria-hidden', 'true');
          } else {
            card.classList.add('hidden');
            card.setAttribute('aria-hidden', 'true');
          }
        });

        dots.forEach(d => d.classList.remove('active'));
        if (dots[active]) dots[active].classList.add('active');
        setAriaSelectedOnDots();

        // Update info columns with the active slide's data
        const info1 = document.getElementById('info1');
        const info2 = document.getElementById('info2');

        if (info1) {
          info1.innerHTML = `
            <div class="info-title">${escapeHtml(slideInfos[active].title)}</div>
            <p class="info-desc">${escapeHtml(slideInfos[active].desc)}</p>
            <div class="info-extra">${escapeHtml(slideInfos[active].extra)}</div>
          `;
        }

        // Info2 shows a different/complimentary view (customize as needed)
        if (info2) {
          info2.innerHTML = `
            <div class="info-title">About ${escapeHtml(slideInfos[active].title)}</div>
            <p class="info-desc">Tasting notes: ${escapeHtml(getTastingNotes(slideInfos[active].desc))}</p>
            <div class="info-extra">More: ${escapeHtml(slideInfos[active].extra)}</div>
          `;
        }
      }

      // small helper to extract a short tasting-note-ish snippet
      function getTastingNotes(desc) {
        // naive: return first sentence or full desc if one sentence
        const idx = desc.indexOf('.');
        return idx !== -1 ? desc.slice(0, idx + 1) : desc;
      }

      // escape any potential text (defensive)
      function escapeHtml(str) {
        return String(str)
          .replaceAll('&', '&amp;')
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;')
          .replaceAll('"', '&quot;')
          .replaceAll("'", '&#39;');
      }

      // click/dot handlers
      dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
          active = i;
          update();
        });
      });

      // clicking a visible card can focus it to center
      cards.forEach((card, i) => {
        card.addEventListener('click', () => {
          active = i;
          update();
        });
      });

      // keyboard navigation (left/right)
      const frame = sliderRoot.querySelector('.frame');
      if (frame) {
        frame.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight') { active = (active + 1) % total; update(); }
          if (e.key === 'ArrowLeft') { active = (active - 1 + total) % total; update(); }
        });
      }

      // Auto-advance (optional) with pause-on-hover
      const AUTO_MS = 3000;
      let autoId = setInterval(()=> { active = (active + 1) % total; update(); }, AUTO_MS);

      sliderRoot.addEventListener('mouseenter', () => clearInterval(autoId));
      sliderRoot.addEventListener('mouseleave', () => {
        clearInterval(autoId);
        autoId = setInterval(()=> { active = (active + 1) % total; update(); }, AUTO_MS);
      });

      // initialize labels from slideInfos (so span.label matches data)
      cards.forEach((card, i) => {
        const labelSpan = card.querySelector('.label');
        if (labelSpan) labelSpan.textContent = slideInfos[i].title;
      });

      // initial update
      update();
    });

    // Fallback JS for smooth scrolling (in case CSS doesn't work)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  
