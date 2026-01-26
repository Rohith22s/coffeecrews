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
    (function () {
    const serviceItems = document.querySelectorAll('.service-item');
    const servicesCol = document.getElementById('servicesColumn');

    // Desktop details
    const detailTitleDesktop = document.getElementById('detailTitleDesktop');
    const detailDescDesktop  = document.getElementById('detailDescDesktop');

    // Mobile details
    const serviceDetailsMobile = document.getElementById('serviceDetailsMobile');
    const detailTitleMobile = document.getElementById('detailTitleMobile');
    const detailDescMobile  = document.getElementById('detailDescMobile');
    const backBtn = document.getElementById('backBtn');

    function isMobile() {
      return window.innerWidth < 768;
    }

    // Clear active class on all items then set active one (desktop visual)
    function setActiveService(el) {
      serviceItems.forEach(i => i.classList.remove('active'));
      if (el) el.classList.add('active');
    }

    // Populate both desktop and mobile detail panels
    function populateDetails(title, desc) {
      detailTitleDesktop.textContent = title;
      detailDescDesktop.textContent = desc;
      detailTitleMobile.textContent = title;
      detailDescMobile.textContent = desc;
    }

    // Click on a service
    serviceItems.forEach(item => {
      item.addEventListener('click', function () {
        const title = this.dataset.title || 'SERVICE DETAILS';
        const desc  = this.dataset.desc  || 'No additional details available.';

        setActiveService(this);
        populateDetails(title, desc);

        if (isMobile()) {
          // hide services and show mobile details (take its place)
          servicesCol.classList.add('d-none');
          serviceDetailsMobile.classList.remove('d-none');
          // ensure it's visible as full-width (already col-12)
          // set focus to back button for accessibility
          backBtn.focus();
        } else {
          // Desktop: ensure details panel visible (desktop panel is d-md-block)
          // nothing else to toggle
        }
      });
    });

    // Back button for mobile: restore services and hide mobile details
    backBtn.addEventListener('click', function () {
      serviceDetailsMobile.classList.add('d-none');
      servicesCol.classList.remove('d-none');
      // return focus to first service for UX
      const first = document.querySelector('.service-item');
      if (first) first.focus();
    });

    // Window resize handler: keep layout consistent when switching sizes
    window.addEventListener('resize', function () {
      if (isMobile()) {
        // on mobile: desktop details should not be forced; ensure mobile details hidden by default
        // (we only show mobile details after a click)
        // nothing to change except ensure desktop panel remains hidden by bootstrap classes
      } else {
        // on desktop: always show services column and hide mobile details
        servicesCol.classList.remove('d-none');
        serviceDetailsMobile.classList.add('d-none');
      }
    });

    // OPTIONAL: initialize first service as active & populate desktop details (comment out if undesired)
    // const first = document.querySelector('.service-item');
    // if (first) { setActiveService(first); populateDetails(first.dataset.title, first.dataset.desc); }
  })();


  
