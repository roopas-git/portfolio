/**
 * Portfolio Interactive Logic - Roopa S
 */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // Theme Management (Syncs with localStorage and system preferences)
    // --------------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const htmlElement = document.documentElement;

    // Retrieve saved theme preference, or fall back to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'light') {
        htmlElement.classList.add('light-theme');
        htmlElement.classList.remove('dark-theme');
    } else if (savedTheme === 'dark') {
        htmlElement.classList.add('dark-theme');
        htmlElement.classList.remove('light-theme');
    } else {
        // Match system
        if (systemPrefersDark) {
            htmlElement.classList.add('dark-theme');
            htmlElement.classList.remove('light-theme');
        } else {
            htmlElement.classList.add('light-theme');
            htmlElement.classList.remove('dark-theme');
        }
    }

    // Toggle theme handler
    themeToggleBtn.addEventListener('click', () => {
        if (htmlElement.classList.contains('light-theme')) {
            htmlElement.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('theme', 'dark');
        } else if (htmlElement.classList.contains('dark-theme')) {
            htmlElement.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            // Default check
            const currentlyDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (currentlyDark) {
                htmlElement.classList.add('light-theme');
                localStorage.setItem('theme', 'light');
            } else {
                htmlElement.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            }
        }
    });


    // --------------------------------------------------------------------------
    // Mobile Hamburger Menu Navigation
    // --------------------------------------------------------------------------
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const mainNavigation = document.getElementById('main-navigation');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = (isOpen) => {
        menuToggleBtn.setAttribute('aria-expanded', isOpen);
        if (isOpen) {
            mainNavigation.style.opacity = '1';
            mainNavigation.style.visibility = 'visible';
            mainNavigation.style.transform = 'translateY(0)';
        } else {
            mainNavigation.style.opacity = '';
            mainNavigation.style.visibility = '';
            mainNavigation.style.transform = '';
        }
    };

    menuToggleBtn.addEventListener('click', () => {
        const isOpen = menuToggleBtn.getAttribute('aria-expanded') === 'true';
        toggleMenu(!isOpen);
    });

    // Close menu when navigation link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu(false);
        });
    });

    // Close menu on resize to desktop dimensions
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            toggleMenu(false);
        }
    });


    // --------------------------------------------------------------------------
    // Click to Copy Email functionality with Toast
    // --------------------------------------------------------------------------
    const emailBtn = document.getElementById('email-btn');
    const toast = document.getElementById('toast');
    const copyBadgeText = document.getElementById('copy-badge-text');

    emailBtn.addEventListener('click', async () => {
        const emailAddress = 'roopa91213@gmail.com';
        try {
            await navigator.clipboard.writeText(emailAddress);
            
            // Show toast feedback
            toast.textContent = 'Email copied to clipboard!';
            toast.classList.add('show');
            copyBadgeText.textContent = 'Copied!';
            
            // Reset state after delay
            setTimeout(() => {
                toast.classList.remove('show');
                copyBadgeText.textContent = 'Copy';
            }, 3000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            // Fallback alert if clipboard api fails
            toast.textContent = 'Press Ctrl+C to copy: ' + emailAddress;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 4000);
        }
    });


    // --------------------------------------------------------------------------
    // Active Navigation Link Tracking on Scroll
    // --------------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    
    const activeLinkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const hrefId = link.getAttribute('href').slice(1);
                    if (hrefId === sectionId) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-30% 0px -60% 0px' // Focus middle section of screen
    });

    sections.forEach(section => {
        activeLinkObserver.observe(section);
    });


    // --------------------------------------------------------------------------
    // Contact Form Validation & Submit Handling
    // --------------------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    
    // Perform manual check on input blur
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            // Trigger browser validation state CSS (:user-invalid will apply)
            input.checkValidity();
        });
        
        input.addEventListener('input', () => {
            // Remove error styles if input becomes valid
            if (input.validity.valid) {
                const errorSpan = document.getElementById(`${input.name}-error`);
                if (errorSpan) errorSpan.style.display = 'none';
            }
        });
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isFormValid = true;

        inputs.forEach(input => {
            const errorSpan = document.getElementById(`${input.name}-error`);
            
            if (!input.validity.valid) {
                isFormValid = false;
                if (errorSpan) {
                    errorSpan.style.display = 'block';
                }
            } else {
                if (errorSpan) {
                    errorSpan.style.display = 'none';
                }
            }
        });

        if (isFormValid) {
            // Show successful submit message
            toast.textContent = 'Thank you! Message submitted successfully.';
            toast.classList.add('show');
            contactForm.reset();
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 4000);
        }
    });


    // --------------------------------------------------------------------------
    // Scroll-driven Animation Fallback (IntersectionObserver)
    // --------------------------------------------------------------------------
    // Check if the browser does NOT natively support CSS view timelines
    if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
        const animatedTargets = document.querySelectorAll(
            '.timeline-card, .skills-card, .project-card, .contact-card-info, .contact-form'
        );

        // Define options for IntersectionObserver
        const revealObserverOptions = {
            threshold: 0.12,
            rootMargin: '0px 0px -50px 0px'
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Stop observing once it has been revealed (one-shot entry animation)
                    observer.unobserve(entry.target);
                }
            });
        }, revealObserverOptions);

        // Apply fallback classes and start observing
        animatedTargets.forEach(element => {
            element.classList.add('reveal-fallback-item');
            revealObserver.observe(element);
        });
    }
});
