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
      contactSuccessTitle: "Vielen Dank für Ihre Nachricht!",
      contactSuccessText: "Ihre Nachricht wurde erfolgreich übermittelt. Wir werden uns so schnell wie möglich bei Ihnen melden.",
      contactValidationError: "Bitte füllen Sie alle erforderlichen Pflichtfelder (*) aus.",
      contactEmailError: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
      submitting: "Wird übermittelt..."
    },
    en: {
      fileReady: "✓ File ready",
      cvReset: "Drag your motorsport CV / result lists here or <span class='text-accent' style='text-decoration: underline;'>click to browse</span>",
      driverSuccessTitle: "Thank you for your application!",
      driverSuccessText: "Your driver profile was successfully submitted. Our coaching and engineering team will personally review your details. We will get in touch with you within the next 48 hours.",
      sponsorSuccessTitle: "Thank you for your inquiry!",
      sponsorSuccessText: "Your partnership inquiry was successfully submitted. We will send you the detailed sponsorship exposé and contact you shortly for a personal introduction.",
      contactSuccessTitle: "Thank you for your message!",
      contactSuccessText: "Your message was successfully submitted. We will get back to you as soon as possible.",
      contactValidationError: "Please fill out all required fields (*).",
      contactEmailError: "Please enter a valid email address.",
      submitting: "Submitting..."
    }
  };

  const header = document.querySelector("header");

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
  const nextButton = document.querySelector(".carousel-btn.next-btn") || document.querySelector(".carousel-btn.next");
  const prevButton = document.querySelector(".carousel-btn.prev-btn") || document.querySelector(".carousel-btn.prev");
  
  if (track && slides.length > 0) {
    let currentIndex = 0;
    
    function updateSlidePosition() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    
    if (nextButton) {
      nextButton.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlidePosition();
      });
    }
    
    if (prevButton) {
      prevButton.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlidePosition();
      });
    }

    // Auto-advance slide every 6 seconds
    let autoSlide = setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlidePosition();
    }, 6000);

    // Pause auto slide on hover/click
    const carouselContainer = document.querySelector(".carousel-container");
    if (carouselContainer) {
      carouselContainer.addEventListener("mouseenter", () => clearInterval(autoSlide));
      carouselContainer.addEventListener("mouseleave", () => {
        autoSlide = setInterval(() => {
          currentIndex = (currentIndex + 1) % slides.length;
          updateSlidePosition();
        }, 6000);
      });
    }
  }

  // --- 4. FAQ ACCORDION LOGIC & SEARCH ---
  const faqItems = document.querySelectorAll(".faq-item");
  const faqSearch = document.getElementById("faq-search-input");

  // --- 4b. GERMAN F4 ACCORDION LOGIC ---
  const f4FaqItems = document.querySelectorAll(".f4-faq-item");
  f4FaqItems.forEach(item => {
    const question = item.querySelector(".f4-faq-question");
    if (question) {
      question.addEventListener("click", () => {
        const isActive = item.classList.contains("active");
        f4FaqItems.forEach(i => i.classList.remove("active"));
        if (!isActive) {
          item.classList.add("active");
        }
      });
    }
  });

  // --- 4c. COMPARATIVE RACING SERIES TAB SWITCHER ---
  const seriesCards = document.querySelectorAll(".series-card");
  const contentBlocks = document.querySelectorAll(".series-content-block");

  seriesCards.forEach(card => {
    card.addEventListener("click", () => {
      const seriesId = card.getAttribute("data-series");
      const isCurrentlyActive = card.classList.contains("active");

      if (isCurrentlyActive) {
        // If clicking the active card, collapse it and reset opacity for all cards
        seriesCards.forEach(c => {
          c.classList.remove("active");
          c.classList.remove("inactive");
        });
        contentBlocks.forEach(block => {
          block.classList.remove("active");
        });
      } else {
        // If clicking an inactive card, activate it and dim the other cards
        seriesCards.forEach(c => {
          if (c === card) {
            c.classList.add("active");
            c.classList.remove("inactive");
          } else {
            c.classList.remove("active");
            c.classList.add("inactive");
          }
        });

        // Hide all details blocks and activate the clicked one
        contentBlocks.forEach(block => {
          block.classList.remove("active");
        });

        const targetBlock = document.getElementById(`content-${seriesId}`);
        if (targetBlock) {
          targetBlock.classList.add("active");
        }
      }
    });
  });

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

  // --- 5. FILE UPLOAD SIMULATOR ---
  const uploadBox = document.getElementById("cv-upload-box");
  const uploadText = document.getElementById("upload-box-text");
  
  if (uploadBox) {
    uploadBox.addEventListener("click", () => {
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

  // --- 6. MULTI-STEP FORMS INITIALIZATION & LOGIC ---
  function initMultistepForm(formId, isDriverForm = false) {
    const form = document.getElementById(formId);
    if (!form) return;

    const steps = form.querySelectorAll(".form-step");
    const prevBtn = form.querySelector(".btn-prev");
    const nextBtn = form.querySelector(".btn-next");
    const submitBtn = form.querySelector(".btn-submit");
    const progressBar = document.getElementById(isDriverForm ? "driver-progress-bar" : "sponsor-progress-bar");
    
    let currentStepIdx = 0; 
    let activeSteps = isDriverForm ? [0, 1, 2, 4] : [0, 1, 2, 3]; // default steps arrays (adult vs sponsor)

    const dobInput = document.getElementById("driver-dob");
    const stepNumMinor = document.getElementById("step-num-minor");

    function getAge(dateString) {
      if (!dateString) return 0;
      const today = new Date();
      const birthDate = new Date(dateString);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }

    function updateDriverSteps() {
      if (!isDriverForm || !dobInput) return;
      const age = getAge(dobInput.value);
      const parentName = document.getElementById("parent-name");
      const parentEmail = document.getElementById("parent-email");
      const parentPhone = document.getElementById("parent-phone");
      const parentConsent = document.getElementById("parent-consent");

      if (dobInput.value && age < 18) {
        activeSteps = [0, 1, 2, 3, 4]; // add index 3 (parent consent step)
        if (stepNumMinor) stepNumMinor.style.display = "flex";
        
        if (parentName) parentName.required = true;
        if (parentEmail) parentEmail.required = true;
        if (parentPhone) parentPhone.required = true;
        if (parentConsent) parentConsent.required = true;
      } else {
        activeSteps = [0, 1, 2, 4]; // skip parent consent step
        if (stepNumMinor) stepNumMinor.style.display = "none";
        
        if (parentName) { parentName.required = false; parentName.value = ""; }
        if (parentEmail) { parentEmail.required = false; parentEmail.value = ""; }
        if (parentPhone) { parentPhone.required = false; parentPhone.value = ""; }
        if (parentConsent) { parentConsent.required = false; parentConsent.checked = false; }
      }
    }

    if (isDriverForm && dobInput) {
      dobInput.addEventListener("change", () => {
        updateDriverSteps();
        if (currentStepIdx >= activeSteps.length) {
          currentStepIdx = activeSteps.length - 1;
        }
        updateFormView();
      });
      updateDriverSteps();
    }

    function validateField(input) {
      const parent = input.closest(".form-group");
      if (!parent) return true;

      let isValid = true;
      let errorMsg = "";

      const lang = localStorage.getItem("selectedLanguage") || "de";
      const messages = {
        de: {
          required: "Dieses Feld ist ein Pflichtfeld.",
          email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
          checkbox: "Sie müssen den Bedingungen zustimmen."
        },
        en: {
          required: "This field is required.",
          email: "Please enter a valid email address.",
          checkbox: "You must agree to the terms."
        }
      };

      const msg = messages[lang];

      if (input.required) {
        if (input.type === "checkbox") {
          if (!input.checked) {
            isValid = false;
            errorMsg = msg.checkbox;
          }
        } else if (!input.value.trim()) {
          isValid = false;
          errorMsg = msg.required;
        }
      }

      if (isValid && input.type === "email" && input.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
          isValid = false;
          errorMsg = msg.email;
        }
      }

      if (!isValid) {
        parent.classList.add("has-error");
        let feedback = parent.querySelector(".invalid-feedback");
        if (!feedback) {
          feedback = document.createElement("div");
          feedback.className = "invalid-feedback";
          parent.appendChild(feedback);
        }
        feedback.textContent = errorMsg;
      } else {
        parent.classList.remove("has-error");
      }

      return isValid;
    }

    function validateCurrentStep() {
      const activeStepIdx = activeSteps[currentStepIdx];
      const stepEl = steps[activeStepIdx];
      if (!stepEl) return true;

      const inputs = stepEl.querySelectorAll("input, textarea, select");
      let stepValid = true;

      inputs.forEach(input => {
        const isFieldValid = validateField(input);
        if (!isFieldValid) {
          stepValid = false;
        }

        input.addEventListener("input", () => validateField(input), { once: true });
        input.addEventListener("change", () => validateField(input), { once: true });
      });

      return stepValid;
    }

    function updateFormView() {
      steps.forEach(step => step.style.display = "none");

      const activeStepIdx = activeSteps[currentStepIdx];
      if (steps[activeStepIdx]) {
        steps[activeStepIdx].style.display = "block";
      }

      if (currentStepIdx === 0) {
        prevBtn.style.display = "none";
      } else {
        prevBtn.style.display = "block";
      }

      if (currentStepIdx === activeSteps.length - 1) {
        nextBtn.style.display = "none";
        submitBtn.style.display = "block";
      } else {
        nextBtn.style.display = "block";
        submitBtn.style.display = "none";
      }

      if (progressBar) {
        const percent = ((currentStepIdx + 1) / activeSteps.length) * 100;
        progressBar.style.width = `${percent}%`;
      }

      const stepDots = form.querySelectorAll(".step-num");
      stepDots.forEach(dot => {
        const dotStep = parseInt(dot.getAttribute("data-step"));
        const currentActiveStepNumber = activeStepIdx + 1;

        dot.classList.remove("active", "completed");
        if (dotStep === currentActiveStepNumber) {
          dot.classList.add("active");
        } else if (dotStep < currentActiveStepNumber) {
          dot.classList.add("completed");
        }
      });
    }

    nextBtn.addEventListener("click", () => {
      if (validateCurrentStep()) {
        if (currentStepIdx < activeSteps.length - 1) {
          currentStepIdx++;
          updateFormView();
          form.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }
    });

    prevBtn.addEventListener("click", () => {
      if (currentStepIdx > 0) {
        currentStepIdx--;
        updateFormView();
        form.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });

    updateFormView();
  }

  // Initialize both Forms
  initMultistepForm("form-driver-multistep", true);
  initMultistepForm("form-sponsor-multistep", false);

  // --- 7. FORM SUBMISSIONS ---
  const driverForm = document.getElementById("form-driver-multistep");
  const sponsorForm = document.getElementById("form-sponsor-multistep");

  if (driverForm) {
    driverForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const lang = localStorage.getItem("selectedLanguage") || "de";
      const submitBtn = driverForm.querySelector('.btn-submit');
      const originalText = submitBtn.innerHTML;
      
      // Honeypot check on client
      const honeypotVal = document.getElementById("driver-website") ? document.getElementById("driver-website").value : "";
      if (honeypotVal && honeypotVal.trim() !== "") {
        // Silently mock success to trick simple bots
        submitBtn.innerHTML = feedbackMessages[lang].submitting;
        submitBtn.disabled = true;
        setTimeout(() => {
          const feedback = document.getElementById("driver-feedback");
          feedback.className = "form-feedback success";
          feedback.innerHTML = `<h4>${feedbackMessages[lang].driverSuccessTitle}</h4><p>${feedbackMessages[lang].driverSuccessText}</p>`;
          feedback.style.display = "block";
          driverForm.reset();
          feedback.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 1000);
        return;
      }

      submitBtn.innerHTML = feedbackMessages[lang].submitting;
      submitBtn.disabled = true;

      // Extract values securely
      const payload = {
        formType: 'driver',
        website: honeypotVal,
        driverFirstname: document.getElementById("driver-firstname")?.value || "",
        driverLastname: document.getElementById("driver-lastname")?.value || "",
        driverDob: document.getElementById("driver-dob")?.value || "",
        driverEmail: document.getElementById("driver-email")?.value || "",
        driverPhone: document.getElementById("driver-phone")?.value || "",
        driverSeries: document.getElementById("driver-series")?.value || "",
        driverExperience: document.getElementById("driver-experience")?.value || "",
        driverResults: document.getElementById("driver-results")?.value || "",
        driverVideo: document.getElementById("driver-video")?.value || "",
        driverSocial: document.getElementById("driver-social")?.value || "",
        parentName: document.getElementById("parent-name")?.value || "",
        parentEmail: document.getElementById("parent-email")?.value || "",
        parentPhone: document.getElementById("parent-phone")?.value || "",
        parentConsent: document.getElementById("parent-consent")?.checked || false,
        driverProgram: document.getElementById("driver-program-choice")?.value || "",
        driverGoals: document.getElementById("driver-goals")?.value || ""
      };

      fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Submission failed");
        }
        
        // Success
        const feedback = document.getElementById("driver-feedback");
        feedback.className = "form-feedback success";
        feedback.innerHTML = `<h4>${feedbackMessages[lang].driverSuccessTitle}</h4><p>${feedbackMessages[lang].driverSuccessText}</p>`;
        feedback.style.display = "block";
        
        driverForm.reset();
        
        // Reset file upload text
        if (uploadText) {
          uploadText.innerHTML = feedbackMessages[lang].cvReset;
          uploadBox.style.borderColor = "var(--border-color)";
          uploadBox.style.background = "rgba(255, 255, 255, 0.01)";
        }

        feedback.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
          window.location.reload();
        }, 4000);
      })
      .catch((err) => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        const feedback = document.getElementById("driver-feedback");
        feedback.className = "form-feedback error";
        feedback.innerHTML = `<h4>Fehler / Error</h4><p>${err.message}</p>`;
        feedback.style.display = "block";
        feedback.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });
  }

  if (sponsorForm) {
    sponsorForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const lang = localStorage.getItem("selectedLanguage") || "de";
      const submitBtn = sponsorForm.querySelector('.btn-submit');
      const originalText = submitBtn.innerHTML;

      // Honeypot check on client
      const honeypotVal = document.getElementById("sponsor-website-honeypot") ? document.getElementById("sponsor-website-honeypot").value : "";
      if (honeypotVal && honeypotVal.trim() !== "") {
        // Silently mock success to trick simple bots
        submitBtn.innerHTML = feedbackMessages[lang].submitting;
        submitBtn.disabled = true;
        setTimeout(() => {
          const feedback = document.getElementById("sponsor-feedback");
          feedback.className = "form-feedback success";
          feedback.innerHTML = `<h4>${feedbackMessages[lang].sponsorSuccessTitle}</h4><p>${feedbackMessages[lang].sponsorSuccessText}</p>`;
          feedback.style.display = "block";
          sponsorForm.reset();
          feedback.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 1000);
        return;
      }

      submitBtn.innerHTML = feedbackMessages[lang].submitting;
      submitBtn.disabled = true;

      // Extract values securely
      const payload = {
        formType: 'sponsor',
        website: honeypotVal,
        sponsorCompany: document.getElementById("sponsor-company")?.value || "",
        sponsorIndustry: document.getElementById("sponsor-industry")?.value || "",
        sponsorWebsite: document.getElementById("sponsor-website")?.value || "",
        sponsorGoal: document.getElementById("sponsor-goal")?.value || "",
        sponsorBudget: document.getElementById("sponsor-budget")?.value || "",
        sponsorName: document.getElementById("sponsor-name")?.value || "",
        sponsorPosition: document.getElementById("sponsor-position")?.value || "",
        sponsorEmail: document.getElementById("sponsor-email")?.value || "",
        sponsorPhone: document.getElementById("sponsor-phone")?.value || "",
        sponsorMessage: document.getElementById("sponsor-message")?.value || ""
      };

      fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Submission failed");
        }
        
        // Success
        const feedback = document.getElementById("sponsor-feedback");
        feedback.className = "form-feedback success";
        feedback.innerHTML = `<h4>${feedbackMessages[lang].sponsorSuccessTitle}</h4><p>${feedbackMessages[lang].sponsorSuccessText}</p>`;
        feedback.style.display = "block";
        
        sponsorForm.reset();
        
        feedback.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
          window.location.reload();
        }, 4000);
      })
      .catch((err) => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        const feedback = document.getElementById("sponsor-feedback");
        feedback.className = "form-feedback error";
        feedback.innerHTML = `<h4>Fehler / Error</h4><p>${err.message}</p>`;
        feedback.style.display = "block";
        feedback.scrollIntoView({ behavior: "smooth", block: "center" });
      });
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
    langButtons.forEach(btn => {
      if (btn.getAttribute("data-lang") === lang) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    if (typeof translations !== "undefined" && translations[lang]) {
      const langData = translations[lang];
      for (const selector in langData) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
            element.placeholder = langData[selector];
          } else {
            element.innerHTML = langData[selector];
          }
        });
      }
    }
    
    localStorage.setItem("selectedLanguage", lang);
  }

  langButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      applyLanguage(lang);
    });
  });

  const savedLang = localStorage.getItem("selectedLanguage") || "de";
  applyLanguage(savedLang);

  // --- 7b. GENERAL CONTACT FORM SUBMISSION ---
  const generalContactForm = document.getElementById("form-general-contact");
  if (generalContactForm) {
    generalContactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const lang = localStorage.getItem("selectedLanguage") || "de";
      const submitBtn = generalContactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      const feedback = document.getElementById("general-contact-feedback");
      
      feedback.style.display = "none";
      feedback.className = "form-feedback";
      
      const nameVal = document.getElementById("contact-name").value.trim();
      const emailVal = document.getElementById("contact-email").value.trim();
      const messageVal = document.getElementById("contact-message").value.trim();
      
      // Basic client-side validation
      if (!nameVal || !emailVal || !messageVal) {
        feedback.className = "form-feedback error";
        feedback.innerHTML = `<p>${feedbackMessages[lang].contactValidationError}</p>`;
        feedback.style.display = "block";
        feedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
        return;
      }
      
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!emailRegex.test(emailVal)) {
        feedback.className = "form-feedback error";
        feedback.innerHTML = `<p>${feedbackMessages[lang].contactEmailError}</p>`;
        feedback.style.display = "block";
        feedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
        return;
      }
      
      // Honeypot check
      const honeypotVal = document.getElementById("contact-website") ? document.getElementById("contact-website").value : "";
      if (honeypotVal && honeypotVal.trim() !== "") {
        submitBtn.innerHTML = feedbackMessages[lang].submitting;
        submitBtn.disabled = true;
        setTimeout(() => {
          feedback.className = "form-feedback success";
          feedback.innerHTML = `<h4>${feedbackMessages[lang].contactSuccessTitle}</h4><p>${feedbackMessages[lang].contactSuccessText}</p>`;
          feedback.style.display = "block";
          generalContactForm.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          feedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 1000);
        return;
      }
      
      submitBtn.innerHTML = feedbackMessages[lang].submitting;
      submitBtn.disabled = true;
      
      // Extract values securely
      const payload = {
        formType: 'contact',
        website: honeypotVal,
        contactName: nameVal,
        contactEmail: emailVal,
        contactMessage: messageVal
      };
      
      fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(data => { throw new Error(data.error || 'Server error'); });
        }
        return response.json();
      })
      .then(data => {
        feedback.className = "form-feedback success";
        feedback.innerHTML = `<h4>${feedbackMessages[lang].contactSuccessTitle}</h4><p>${feedbackMessages[lang].contactSuccessText}</p>`;
        feedback.style.display = "block";
        generalContactForm.reset();
      })
      .catch(err => {
        feedback.className = "form-feedback error";
        feedback.innerHTML = `<p>${err.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später noch einmal.'}</p>`;
        feedback.style.display = "block";
      })
      .finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        feedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    });
  }

  // --- HERO SLIDESHOW LOGIC ---
  const heroSlides = document.querySelectorAll(".hero-slide");
  if (heroSlides.length > 0) {
    let currentHeroIndex = 0;
    
    function nextHeroSlide() {
      heroSlides[currentHeroIndex].classList.remove("active");
      currentHeroIndex = (currentHeroIndex + 1) % heroSlides.length;
      heroSlides[currentHeroIndex].classList.add("active");
    }
    
    setInterval(nextHeroSlide, 5000);
  }
});
