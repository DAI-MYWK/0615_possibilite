// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all components
  initializeSwiper();
  initializeIntersectionObserver();
  initializeSmoothScroll();
  initializeFormHandling();
  initializeHeaderScroll();
  initializeBackToTop();
});

// Swiper Initialization
function initializeSwiper() {
  // Hero Slider
  const heroSwiper = new Swiper(".hero__slider", {
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    loop: true,
    pagination: {
      el: ".hero__pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".hero__next",
      prevEl: ".hero__prev",
    },
    speed: 1000,
    on: {
      init: function () {
        // Add fade-in animation to hero content
        document.querySelectorAll(".hero__content").forEach((content) => {
          content.style.opacity = "0";
          content.style.transform = "translateY(50px)";
          content.style.transition = "opacity 1s ease, transform 1s ease";
        });

        // Show first slide content
        const firstSlide = document.querySelector(
          ".swiper-slide-active .hero__content"
        );
        if (firstSlide) {
          setTimeout(() => {
            firstSlide.style.opacity = "1";
            firstSlide.style.transform = "translateY(0)";
          }, 500);
        }
      },
      slideChange: function () {
        // Hide all content
        document.querySelectorAll(".hero__content").forEach((content) => {
          content.style.opacity = "0";
          content.style.transform = "translateY(50px)";
        });

        // Show active slide content
        const activeSlide = document.querySelector(
          ".swiper-slide-active .hero__content"
        );
        if (activeSlide) {
          setTimeout(() => {
            activeSlide.style.opacity = "1";
            activeSlide.style.transform = "translateY(0)";
          }, 300);
        }
      },
    },
  });
}

// Intersection Observer for animations
function initializeIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");

        // Add staggered animation for multiple elements
        if (entry.target.classList.contains("stagger-parent")) {
          const children = entry.target.querySelectorAll(".stagger-child");
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add("is-visible");
            }, index * 100);
          });
        }
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animatedElements = document.querySelectorAll(`
        .intro,
        .section-header,
        .service-card,
        .plan-card,
        .about__profile,
        .gallery__item,
        .contact__content,
        .fade-in,
        .slide-up
    `);

  animatedElements.forEach((el) => {
    el.classList.add("fade-in");
    observer.observe(el);
  });

  // Special handling for stats
  const statsElements = document.querySelectorAll(".intro__stat-number");
  statsElements.forEach((stat) => {
    observer.observe(stat);
    stat.addEventListener("animationstart", () => {
      animateNumber(stat);
    });
  });
}

// Animate numbers
function animateNumber(element) {
  const target = element.textContent;
  const isPercentage = target.includes("%");
  const isPlus = target.includes("+");
  const numericValue = parseInt(target.replace(/[^0-9]/g, ""));

  let current = 0;
  const increment = numericValue / 50;
  const timer = setInterval(() => {
    current += increment;
    if (current >= numericValue) {
      current = numericValue;
      clearInterval(timer);
    }

    let displayValue = Math.floor(current);
    if (isPercentage) displayValue += "%";
    if (isPlus) displayValue += "+";

    element.textContent = displayValue;
  }, 50);
}

// Smooth Scroll for navigation links
function initializeSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// Form Handling
function initializeFormHandling() {
  const contactForm = document.querySelector(".contact__form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Show loading state
      const submitButton = this.querySelector(".contact__submit");
      const originalText = submitButton.textContent;
      submitButton.textContent = "送信中...";
      submitButton.disabled = true;

      // Simulate form submission (replace with actual form handling)
      setTimeout(() => {
        showNotification(
          "お問い合わせありがとうございます。担当者より折り返しご連絡いたします。",
          "success"
        );

        // Reset form
        this.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }, 2000);
    });

    // Real-time validation
    const inputs = contactForm.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => {
      input.addEventListener("blur", function () {
        validateField(this);
      });

      input.addEventListener("input", function () {
        if (this.classList.contains("error")) {
          validateField(this);
        }
      });
    });
  }
}

// Field validation
function validateField(field) {
  const value = field.value.trim();
  const fieldType = field.type;
  const isRequired = field.hasAttribute("required");

  // Remove existing error styling
  field.classList.remove("error");
  const existingError = field.parentNode.querySelector(".field-error");
  if (existingError) {
    existingError.remove();
  }

  let isValid = true;
  let errorMessage = "";

  // Required field validation
  if (isRequired && !value) {
    isValid = false;
    errorMessage = "この項目は必須です。";
  }

  // Email validation
  if (fieldType === "email" && value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      isValid = false;
      errorMessage = "正しいメールアドレスを入力してください。";
    }
  }

  // Phone validation
  if (fieldType === "tel" && value) {
    const phonePattern = /^[0-9-+()]+$/;
    if (!phonePattern.test(value)) {
      isValid = false;
      errorMessage = "正しい電話番号を入力してください。";
    }
  }

  if (!isValid) {
    field.classList.add("error");
    const errorElement = document.createElement("span");
    errorElement.className = "field-error";
    errorElement.textContent = errorMessage;
    errorElement.style.color = "#e74c3c";
    errorElement.style.fontSize = "0.9rem";
    errorElement.style.marginTop = "0.5rem";
    errorElement.style.display = "block";
    field.parentNode.appendChild(errorElement);
  }

  return isValid;
}

// Header scroll effect
function initializeHeaderScroll() {
  const header = document.querySelector(".header");
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Hide/show header on scroll
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
      header.style.transform = "translateY(-100%)";
    } else {
      header.style.transform = "translateY(0)";
    }

    lastScrollY = currentScrollY;
  });
}

// Back to top button
function initializeBackToTop() {
  // Create back to top button
  const backToTopButton = document.createElement("button");
  backToTopButton.innerHTML = "↑";
  backToTopButton.className = "back-to-top";
  backToTopButton.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--clr-accent);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    `;

  document.body.appendChild(backToTopButton);

  // Show/hide button based on scroll position
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopButton.style.opacity = "1";
      backToTopButton.style.visibility = "visible";
    } else {
      backToTopButton.style.opacity = "0";
      backToTopButton.style.visibility = "hidden";
    }
  });

  // Scroll to top functionality
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Hover effect
  backToTopButton.addEventListener("mouseenter", () => {
    backToTopButton.style.transform = "translateY(-3px)";
    backToTopButton.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.15)";
  });

  backToTopButton.addEventListener("mouseleave", () => {
    backToTopButton.style.transform = "translateY(0)";
    backToTopButton.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
  });
}

// Notification system
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification--${type}`;
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        padding: 1rem 2rem;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    `;

  // Set background color based on type
  switch (type) {
    case "success":
      notification.style.background = "#27ae60";
      break;
    case "error":
      notification.style.background = "#e74c3c";
      break;
    case "warning":
      notification.style.background = "#f39c12";
      break;
    default:
      notification.style.background = "#3498db";
  }

  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Hide notification after 5 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);

  // Allow manual dismissal
  notification.addEventListener("click", () => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  });
}

// Gallery hover effects
function initializeGalleryEffects() {
  const galleryItems = document.querySelectorAll(".gallery__item");

  galleryItems.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      this.style.zIndex = "10";
      this.style.transform = "scale(1.03)";
    });

    item.addEventListener("mouseleave", function () {
      this.style.zIndex = "1";
      this.style.transform = "scale(1)";
    });
  });
}

// Parallax effect for hero section
function initializeParallax() {
  const heroSection = document.querySelector(".hero");

  if (heroSection) {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const parallaxSpeed = 0.5;

      heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    });
  }
}

// Lazy loading for images
function initializeLazyLoading() {
  const images = document.querySelectorAll("img[data-src]");

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => {
    img.classList.add("lazy");
    imageObserver.observe(img);
  });
}

// Service cards hover effect
function initializeServiceCards() {
  const serviceCards = document.querySelectorAll(".service-card");

  serviceCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });
}

// Plan cards animation
function initializePlanCards() {
  const planCards = document.querySelectorAll(".plan-card");

  planCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      if (!this.classList.contains("plan-card--featured")) {
        this.style.transform = "translateY(-10px) scale(1.02)";
      }
    });

    card.addEventListener("mouseleave", function () {
      if (!this.classList.contains("plan-card--featured")) {
        this.style.transform = "translateY(0) scale(1)";
      }
    });
  });
}

// Initialize additional effects after DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeGalleryEffects();
  initializeParallax();
  initializeLazyLoading();
  initializeServiceCards();
  initializePlanCards();
});

// Performance optimization
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debounce to scroll events
const debouncedScrollHandler = debounce(() => {
  // Any scroll-based animations can be added here
}, 10);

window.addEventListener("scroll", debouncedScrollHandler);

// Preload critical images
function preloadImages() {
  const criticalImages = ["img/marriage.png"];

  criticalImages.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

// Initialize preloading
document.addEventListener("DOMContentLoaded", preloadImages);
