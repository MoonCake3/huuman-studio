document.addEventListener('DOMContentLoaded', function() {
    // Language toggle functionality
    const langToggle = document.getElementById('langToggle');
    const htmlElement = document.documentElement;
    const bodyElement = document.body;

    // Load saved language or default to English
    const savedLang = localStorage.getItem('huuman-studio-lang') || 'en';
    if (savedLang === 'th') {
        htmlElement.setAttribute('lang', 'th');
        bodyElement.classList.add('lang-th');
        bodyElement.classList.remove('lang-en');
    } else {
        htmlElement.setAttribute('lang', 'en');
        bodyElement.classList.add('lang-en');
        bodyElement.classList.remove('lang-th');
    }

    // Apply language to all elements with data-th and data-en attributes
    function applyLanguage(lang) {
        const elements = document.querySelectorAll('[data-th], [data-en], [data-th-placeholder], [data-en-placeholder]');

        elements.forEach(function(el) {
            if (lang === 'th') {
                // Use Thai text
                if (el.hasAttribute('data-th')) {
                    el.textContent = el.getAttribute('data-th');
                }
                if (el.hasAttribute('data-th-placeholder') && el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = el.getAttribute('data-th-placeholder');
                }
            } else {
                // Use English text
                if (el.hasAttribute('data-en')) {
                    el.textContent = el.getAttribute('data-en');
                }
                if (el.hasAttribute('data-en-placeholder') && el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = el.getAttribute('data-en-placeholder');
                }
            }
        });

        // Save language preference
        localStorage.setItem('huuman-studio-lang', lang);
    }

    // Set initial language
    applyLanguage(savedLang);

    // Toggle language on button click
    langToggle.addEventListener('click', function() {
        const currentLang = bodyElement.classList.contains('lang-th') ? 'th' : 'en';
        const newLang = currentLang === 'th' ? 'en' : 'th';

        if (newLang === 'th') {
            htmlElement.setAttribute('lang', 'th');
            bodyElement.classList.add('lang-th');
            bodyElement.classList.remove('lang-en');
        } else {
            htmlElement.setAttribute('lang', 'en');
            bodyElement.classList.add('lang-en');
            bodyElement.classList.remove('lang-th');
        }

        applyLanguage(newLang);
    });

    // Smooth scroll for navigation links
    const scrollLinks = document.querySelectorAll('a[href^="#"]');

    scrollLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(targetId);
                if (target) {
                    const headerHeight = 80;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Header background opacity on scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.85)';
        }
    });

    // Form submit handler (demo)
    const form = document.querySelector('.form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = form.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="btn-icon">✓</span> SKICKAT';
            submitBtn.style.background = '#2d6a4f';
            setTimeout(function() {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
            }, 2000);
        });
    }

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for fade-in
    const fadeElements = document.querySelectorAll('.service-card, .portfolio-item, .stat, .about-image, .about-content, .contact-form, .contact-text');
    fadeElements.forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
