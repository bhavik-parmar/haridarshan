// ░░ GLOBAL VARIABLES ░░
let currentTestimonialIndex = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialCount = testimonialCards.length;

// ░░ LOADER ░░
window.addEventListener('load', function () {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.style.opacity = '0';
    loader.style.visibility = 'hidden';
    loader.style.transition = 'opacity 0.5s ease, visibility 0.5s ease';
  }, 1500);
});

// ░░ MOBILE MENU ░░
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  // Close menu when nav link clicked
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      hamburger.classList.remove('active');
    });
  });
}

// ░░ ACTIVE NAV LINK ON SCROLL ░░
const sections = document.querySelectorAll('section[id]');
const navLinkElements = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinkElements.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').slice(1) === current) {
      link.classList.add('active');
    }
  });
});

// ░░ SMOOTH SCROLL ░░
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ░░ SCROLL TO TOP BUTTON ░░
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollTopBtn.classList.add('active');
  } else {
    scrollTopBtn.classList.remove('active');
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ░░ PORTFOLIO FILTER ░░
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));
    // Add active class to clicked button
    button.classList.add('active');

    const filterValue = button.getAttribute('data-filter');

    portfolioItems.forEach(item => {
      item.style.opacity = '0';
      item.style.pointerEvents = 'none';

      setTimeout(() => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'grid';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.pointerEvents = 'auto';
          }, 10);
        } else {
          item.style.display = 'none';
        }
      }, 300);
    });
  });
});

// ░░ PORTFOLIO LIGHTBOX ░░
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCaption = document.getElementById('lb-caption');
const lbClose = document.getElementById('lb-close');
const lbPrev = document.getElementById('lb-prev');
const lbNext = document.getElementById('lb-next');

let currentImageIndex = -1;
const zoomButtons = document.querySelectorAll('.portfolio-zoom');

zoomButtons.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    currentImageIndex = index;
    openLightbox(btn);
  });
});

function openLightbox(btn) {
  const imageSrc = btn.getAttribute('data-src');
  const caption = btn.getAttribute('data-caption');
  lbImg.src = imageSrc;
  lbCaption.textContent = caption;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function showNextImage() {
  const nextBtn = zoomButtons[currentImageIndex + 1] || zoomButtons[0];
  currentImageIndex = (currentImageIndex + 1) % zoomButtons.length;
  openLightbox(nextBtn);
}

function showPrevImage() {
  currentImageIndex = (currentImageIndex - 1 + zoomButtons.length) % zoomButtons.length;
  const prevBtn = zoomButtons[currentImageIndex];
  openLightbox(prevBtn);
}

lbClose.addEventListener('click', closeLightbox);
lbNext.addEventListener('click', showNextImage);
lbPrev.addEventListener('click', showPrevImage);

// Close lightbox when clicking outside the image
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('active')) {
    closeLightbox();
  }
  // Arrow keys for navigation
  if (lightbox.classList.contains('active')) {
    if (e.key === 'ArrowRight') {
      showNextImage();
    }
    if (e.key === 'ArrowLeft') {
      showPrevImage();
    }
  }
});

// ░░ TESTIMONIALS SLIDER (RESPONSIVE) ░░
const testimonialTrack = document.getElementById('testimonial-track');
const tPrevBtn = document.getElementById('t-prev');
const tNextBtn = document.getElementById('t-next');

let autoSlideTimer;
let cardsPerView = 2; // Default for desktop
let totalPages = Math.ceil(testimonialCount / cardsPerView);

function getCardsPerView() {
  return window.innerWidth <= 640 ? 1 : 2;
}

function updateCardsPerView() {
  const newCardsPerView = getCardsPerView();
  if (newCardsPerView !== cardsPerView) {
    cardsPerView = newCardsPerView;
    totalPages = Math.ceil(testimonialCount / cardsPerView);
    
    // Reset to first page if we're beyond available pages
    if (currentTestimonialIndex >= totalPages) {
      currentTestimonialIndex = 0;
    }
    updateTestimonialSlider();
  }
}

function updateTestimonialSlider() {
  // For grid layout, show/hide cards based on current page
  testimonialCards.forEach((card, index) => {
    const pageStart = currentTestimonialIndex * cardsPerView;
    const pageEnd = pageStart + cardsPerView;
    
    if (index >= pageStart && index < pageEnd) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

function showNextTestimonial() {
  currentTestimonialIndex = (currentTestimonialIndex + 1) % totalPages;
  updateTestimonialSlider();
  resetAutoSlide();
}

function showPrevTestimonial() {
  currentTestimonialIndex = (currentTestimonialIndex - 1 + totalPages) % totalPages;
  updateTestimonialSlider();
  resetAutoSlide();
}

function startAutoSlide() {
  autoSlideTimer = setInterval(() => {
    showNextTestimonial();
  }, 6000); // Change slide every 06 seconds
}

function resetAutoSlide() {
  clearInterval(autoSlideTimer);
  startAutoSlide();
}

// Event listeners
tNextBtn.addEventListener('click', showNextTestimonial);
tPrevBtn.addEventListener('click', showPrevTestimonial);

// Handle window resize
window.addEventListener('resize', updateCardsPerView);

// Start auto-slide on load
document.addEventListener('DOMContentLoaded', () => {
  cardsPerView = getCardsPerView();
  totalPages = Math.ceil(testimonialCount / cardsPerView);
  updateTestimonialSlider(); // Initialize display
  startAutoSlide();
});

// ░░ CONTACT FORM VALIDATION & SUBMISSION ░░
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous errors
    document.querySelectorAll('.err').forEach(err => err.textContent = '');

    // Get form values
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value.trim();

    // Validation
    let isValid = true;

    if (!name) {
      document.getElementById('err-name').textContent = 'Name is required';
      isValid = false;
    }

    if (!phone) {
      document.getElementById('err-phone').textContent = 'Phone number is required';
      isValid = false;
    } else if (!/^\d{10}$|^\+\d{1,3}\d{1,14}$|^\d{3}\s\d{3}\s\d{4}$/.test(phone.replace(/\s/g, ''))) {
      document.getElementById('err-phone').textContent = 'Enter a valid phone number';
      isValid = false;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById('err-email').textContent = 'Enter a valid email';
      isValid = false;
    }

    if (!message) {
      document.getElementById('err-message').textContent = 'Message is required';
      isValid = false;
    }

    if (!isValid) return;

    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    try {
      // Since you don't have a backend, show success message
      // In production, replace with actual form submission to your server/service
      
      // Simulate sending (you can replace with actual fetch/axios call)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Show success message
      formSuccess.style.display = 'flex';
      contactForm.reset();

      // Hide success message after 5 seconds
      setTimeout(() => {
        formSuccess.style.display = 'none';
      }, 5000);

      // Note: Replace the above with actual backend integration:
      /*
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, service, message })
      });

      if (response.ok) {
        formSuccess.style.display = 'flex';
        contactForm.reset();
        setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
      } else {
        throw new Error('Failed to send message');
      }
      */

    } catch (error) {
      console.error('Error:', error);
      document.getElementById('err-message').textContent = 'Error sending message. Please try again.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

// ░░ HEADER BACKGROUND ON SCROLL ░░
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ░░ FOOTER YEAR ░░
document.getElementById('year').textContent = new Date().getFullYear();

// ░░ AOS INITIALIZATION ░░
AOS.init({
  duration: 1000,
  once: false,
  offset: 100
});
