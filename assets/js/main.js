/**
* Template Name: eNno
* Template URL: https://bootstrapmade.com/enno-free-simple-bootstrap-template/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Form validation functions
   */
  function validateForm(form) {
    // Reset previous error states
    form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    form.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
    
    let isValid = true;

    // Validate Name
    const nameInput = form.querySelector('input[name="name"]');
    if (nameInput) {
      const nameRegex = /^[A-Za-z\s]{2,50}$/;
      if (!nameRegex.test(nameInput.value.trim())) {
        showError(nameInput, 'Please enter a valid name (2-50 characters, letters only)');
        isValid = false;
      }
    }

    // Validate Email
    const emailInput = form.querySelector('input[name="email"]');
    if (emailInput) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        showError(emailInput, 'Please enter a valid email address');
        isValid = false;
      }
    }

    // Validate Subject (only for contact form)
    const subjectInput = form.querySelector('input[name="subject"]');
    if (subjectInput && (subjectInput.value.trim().length < 3 || subjectInput.value.trim().length > 100)) {
      showError(subjectInput, 'Subject must be between 3 and 100 characters');
      isValid = false;
    }

    // Validate Message (only for contact form)
    const messageInput = form.querySelector('textarea[name="message"]');
    if (messageInput && (messageInput.value.trim().length < 10 || messageInput.value.trim().length > 2000)) {
      showError(messageInput, 'Message must be between 10 and 2000 characters');
      isValid = false;
    }

    return isValid;
  }

  function showError(element, message) {
    element.classList.add('is-invalid');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    element.parentNode.insertBefore(errorDiv, element.nextSibling);
  }

  /**
   * Handle form submission with validation
   */
  async function handleFormSubmission(form, isNewsletter = false) {
    if (!validateForm(form)) {
      const errorElement = form.querySelector('.error-message');
      if (errorElement) {
        errorElement.style.display = 'block';
        errorElement.textContent = 'Please check the form for errors.';
      }
      return;
    }

    const loadingElement = form.querySelector('.loading');
    const errorElement = form.querySelector('.error-message');
    const sentElement = form.querySelector('.sent-message');
    
    // Show loading
    if (loadingElement) loadingElement.style.display = 'block';
    if (errorElement) errorElement.style.display = 'none';
    if (sentElement) sentElement.style.display = 'none';

    try {
      // Add request throttling
      const lastSubmitTime = form.dataset.lastSubmit ? parseInt(form.dataset.lastSubmit) : 0;
      const currentTime = Date.now();
      
      if (currentTime - lastSubmitTime < 5000) { // 5 seconds cooldown
        throw new Error('Please wait a few seconds before submitting again.');
      }
      
      form.dataset.lastSubmit = currentTime;

      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Hide loading
      if (loadingElement) loadingElement.style.display = 'none';

      if (result.success) {
        if (sentElement) {
          sentElement.style.display = 'block';
          sentElement.textContent = result.message || (isNewsletter ? 
            'Thank you for subscribing!' : 
            'Your message has been sent. Thank you!');
        }
        form.reset();
      } else {
        throw new Error(Array.isArray(result.errors) ? result.errors.join(', ') : 'Form submission failed');
      }
    } catch (error) {
      if (loadingElement) loadingElement.style.display = 'none';
      if (errorElement) {
        errorElement.style.display = 'block';
        errorElement.textContent = error.message || 'Network error. Please check your connection and try again.';
      }
    }
  }

  /**
   * Initialize form handlers
   */
  function initFormHandlers() {
    const contactForm = document.querySelector('form.php-email-form');
    const newsletterForm = document.querySelector('.footer-newsletter form.php-email-form');

    if (contactForm) {
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleFormSubmission(contactForm, false);
      });
    }

    if (newsletterForm) {
      newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleFormSubmission(newsletterForm, true);
      });
    }
  }

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn?.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  
  scrollTop?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      });
    });
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    });
  }

  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  // Initialize form handlers when DOM is loaded
  window.addEventListener('DOMContentLoaded', initFormHandlers);

})();