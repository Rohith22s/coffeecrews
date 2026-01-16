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