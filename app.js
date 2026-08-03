document.addEventListener("DOMContentLoaded", () => {
  // --- LOCALIZED FEEDBACK & FORM MESSAGES ---
  const feedbackMessages = {
    de: {
      fileReady: "✓ Datei bereit",
      cvReset: "Zieh dein Motorsport-CV / Ergebnislisten hierhin oder <span class='text-accent' style='text-decoration: underline;'>klicke zum Durchsuchen</span>",
      driverSuccessTitle: "Vielen Dank für deine Bewerbung!",
      driverSuccessText: "Dein Fahrerprofil wurde erfolgreich eingereicht. Unser Coaching- und Ingenieursteam prüft deine Daten persönlich. Wir melden uns innerhalb der nächsten 48 Stunden bei dir.",
      sponsorSuccessTitle: "Vielen Dank für Ihre Anfrage!",
      sponsorSuccessText: "Ihre Partneranfrage wurde erfolgreich übermittelt. Wir senden Ihnen das detaillierte Sponsoring-Exposé zu und setzen uns für ein erstes persönliches Kennenlernen kurzfristig mit Ihnen in Verbindung.",
      submitting: "Wird übermittelt..."
    },
    en: {
      fileReady: "✓ File ready",
      cvReset: "Drag your motorsport CV / result lists here or <span class='text-accent' style='text-decoration: underline;'>click to browse</span>",
      driverSuccessTitle: "Thank you for your application!",
      driverSuccessText: "Your driver profile was successfully submitted. Our coaching and engineering team will personally review your details. We will get in touch with you within the next 48 hours.",
      sponsorSuccessTitle: "Thank you for your inquiry!",
      sponsorSuccessText: "Your partnership inquiry was successfully submitted. We will send you the detailed sponsorship exposé and contact you shortly for a personal introduction.",
      submitting: "Submitting..."
    }
  };
  // --- 1. ROUTING & TAB NAVIGATION ---
  const navLinks = document.querySelectorAll("nav ul li a, .btn-navigate");
  const sections = document.querySelectorAll(".page-section");
  const header = document.querySelector("header");

  function navigateTo(targetId) {
    const cleanId = targetId.replace("#", "");
    let targetSection = document.getElementById(cleanId);
    
    if (!targetSection) return;

    // Remove active class from all sections and nav links
    sections.forEach(sec => sec.classList.remove("active"));
    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${cleanId}`) {
        link.classList.add("active");
      }
    });

    // Make target section visible
    targetSection.classList.add("active");
    
    // Smooth scroll to top of section
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    // Update URL hash without jumping
    history.pushState(null, null, `#${cleanId}`);
  }

  // Bind navigation links
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        navigateTo(href);
      }
    });
  });

  // Handle back/forward buttons & initial load hash
  window.addEventListener("popstate", () => {
    const hash = window.location.hash || "#home";
    navigateTo(hash);
  });

  // Initial routing
  const initialHash = window.location.hash || "#home";
  navigateTo(initialHash);

  // --- 2. HEADER SCROLL EFFECT ---
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // --- 3. DYNAMIC IMAGE CAROUSEL / SLIDER ---
  const track = document.querySelector(".carousel-track");
  const slides = document.querySelectorAll(".carousel-slide");
  const nextButton = document.querySelector(".carousel-btn.next");
  const prevButton = document.querySelector(".carousel-btn.prev");
  
  if (track && slides.length > 0) {
    let currentIndex = 0;
    
    function updateSlidePosition() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    
    nextButton.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlidePosition();
    });
    
    prevButton.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlidePosition();
    });

    // Auto-advance slide every 6 seconds
    let autoSlide = setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlidePosition();
    }, 6000);

    // Pause auto slide on hover/click
    const carouselContainer = document.querySelector(".carousel-container");
    carouselContainer.addEventListener("mouseenter", () => clearInterval(autoSlide));
    carouselContainer.addEventListener("mouseleave", () => {
      autoSlide = setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlidePosition();
      }, 6000);
    });
  }

  // --- 4. FAQ ACCORDION LOGIC & SEARCH ---
  const faqItems = document.querySelectorAll(".faq-item");
  const faqSearch = document.getElementById("faq-search-input");

  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      
      // Close all other FAQs
      faqItems.forEach(i => i.classList.remove("active"));
      
      // Toggle current
      if (!isActive) {
        item.classList.add("active");
      }
    });
  });

  // Filter FAQs based on search input
  if (faqSearch) {
    faqSearch.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      
      faqItems.forEach(item => {
        const questionText = item.querySelector(".faq-question").textContent.toLowerCase();
        const answerText = item.querySelector(".faq-answer").textContent.toLowerCase();
        
        if (questionText.includes(query) || answerText.includes(query)) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
          item.classList.remove("active");
        }
      });
    });
  }

  // --- 5. APPLICATION FORM TOGGLING ---
  const driverToggle = document.getElementById("toggle-driver");
  const sponsorToggle = document.getElementById("toggle-sponsor");
  const driverFormSection = document.getElementById("driver-form-wrapper");
  const sponsorFormSection = document.getElementById("sponsor-form-wrapper");

  if (driverToggle && sponsorToggle) {
    driverToggle.addEventListener("click", () => {
      driverToggle.classList.add("active");
      sponsorToggle.classList.remove("active");
      driverFormSection.classList.add("active");
      sponsorFormSection.classList.remove("active");
    });

    sponsorToggle.addEventListener("click", () => {
      sponsorToggle.classList.add("active");
      driverToggle.classList.remove("active");
      sponsorFormSection.classList.add("active");
      driverFormSection.classList.remove("active");
    });
  }

  // --- 6. FILE UPLOAD SIMULATOR ---
  const uploadBox = document.getElementById("cv-upload-box");
  const uploadText = document.getElementById("upload-box-text");
  
  if (uploadBox) {
    uploadBox.addEventListener("click", () => {
      // Create a dummy file dialog simulation
      const dummyInput = document.createElement("input");
      dummyInput.type = "file";
      dummyInput.accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png";
      dummyInput.onchange = (e) => {
        if (e.target.files.length > 0) {
          const file = e.target.files[0];
          const lang = localStorage.getItem("selectedLanguage") || "de";
          const fileReadyText = feedbackMessages[lang].fileReady;
          uploadText.innerHTML = `<span style="color: var(--accent); font-weight: 600;">${fileReadyText}:</span> ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
          uploadBox.style.borderColor = "var(--accent)";
          uploadBox.style.background = "rgba(234, 91, 12, 0.03)";
        }
      };
      dummyInput.click();
    });
  }

  // --- 7. FORM SUBMISSIONS ---
  const driverForm = document.getElementById("form-driver");
  const sponsorForm = document.getElementById("form-sponsor");

  if (driverForm) {
    driverForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const lang = localStorage.getItem("selectedLanguage") || "de";
      const submitBtn = driverForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = feedbackMessages[lang].submitting;
      submitBtn.disabled = true;
      
      // Simulate API request delay
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success feedback
        const feedback = document.getElementById("driver-feedback");
        feedback.className = "form-feedback success";
        feedback.innerHTML = `<h4>${feedbackMessages[lang].driverSuccessTitle}</h4><p>${feedbackMessages[lang].driverSuccessText}</p>`;
        driverForm.reset();
        
        // Reset file upload text
        if (uploadText) {
          uploadText.innerHTML = feedbackMessages[lang].cvReset;
          uploadBox.style.borderColor = "var(--border-color)";
          uploadBox.style.background = "rgba(255, 255, 255, 0.01)";
        }
        
        // Scroll feedback into view
        feedback.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 1500);
    });
  }

  if (sponsorForm) {
    sponsorForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const lang = localStorage.getItem("selectedLanguage") || "de";
      const submitBtn = sponsorForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = feedbackMessages[lang].submitting;
      submitBtn.disabled = true;
      
      // Simulate API request delay
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success feedback
        const feedback = document.getElementById("sponsor-feedback");
        feedback.className = "form-feedback success";
        feedback.innerHTML = `<h4>${feedbackMessages[lang].sponsorSuccessTitle}</h4><p>${feedbackMessages[lang].sponsorSuccessText}</p>`;
        sponsorForm.reset();
        
        // Scroll feedback into view
        feedback.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 1500);
    });
  }

  // --- MOBILE MENU TOGGLE ---
  const mobileToggle = document.getElementById("mobile-toggle");
  const mainNav = document.getElementById("main-nav");

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener("click", () => {
      mainNav.classList.toggle("open");
      const icon = mobileToggle.querySelector("i");
      if (mainNav.classList.contains("open")) {
        icon.className = "fas fa-xmark";
      } else {
        icon.className = "fas fa-bars";
      }
    });

    // Close mobile nav when clicking a link
    const mobileLinks = mainNav.querySelectorAll("ul li a");
    mobileLinks.forEach(link => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        const icon = mobileToggle.querySelector("i");
        icon.className = "fas fa-bars";
      });
    });
  }

  // --- 8. LANGUAGE SWITCHER LOGIC ---
  const langButtons = document.querySelectorAll(".lang-btn");
  
  function applyLanguage(lang) {
    // Set active class on switcher buttons
    langButtons.forEach(btn => {
      if (btn.getAttribute("data-lang") === lang) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Apply translations across all selectors
    if (typeof translations !== "undefined" && translations[lang]) {
      const langData = translations[lang];
      for (const selector in langData) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (element.tagName === "INPUT") {
            // Update placeholders for search fields
            element.placeholder = langData[selector];
          } else {
            // Update text content / HTML markup for nodes
            element.innerHTML = langData[selector];
          }
        });
      }
    }
    
    // Persist language choice
    localStorage.setItem("selectedLanguage", lang);
  }

  langButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      applyLanguage(lang);
    });
  });

  // Load language from storage or default to German
  const savedLang = localStorage.getItem("selectedLanguage") || "de";
  applyLanguage(savedLang);

  // --- HERO SLIDESHOW LOGIC ---
  const heroSlides = document.querySelectorAll(".hero-slide");
  if (heroSlides.length > 0) {
    let currentHeroIndex = 0;
    
    function nextHeroSlide() {
      heroSlides[currentHeroIndex].classList.remove("active");
      currentHeroIndex = (currentHeroIndex + 1) % heroSlides.length;
      heroSlides[currentHeroIndex].classList.add("active");
    }
    
    // Rotate slide every 5 seconds
    setInterval(nextHeroSlide, 5000);
  }
});
