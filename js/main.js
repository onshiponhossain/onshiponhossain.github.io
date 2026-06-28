// ==========================================
// main.js - Portfolio Interactive Features
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. REMOVE LOADING SCREEN
       ========================================== */
    const loader = document.getElementById('loader');
    if (loader) {
        // Wait just a moment to ensure smooth transition
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 300); 
    }

    /* ==========================================
       2. STICKY NAVIGATION (Blur & Shadow)
       ========================================== */
    const header = document.querySelector('.site-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================
       3. MOBILE HAMBURGER MENU
       ========================================== */
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            
            // Toggle Accessibility Attribute
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle Menu Visibility
            mobileNav.classList.toggle('open');
            
            // Prevent scrolling on the body when menu is open
            document.body.style.overflow = !isExpanded ? 'hidden' : '';
        });

        // Close menu when clicking a link
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                mobileNav.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    /* ==========================================
       4. SCROLL REVEAL (Intersection Observer)
       ========================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealOptions = {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits the bottom
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                // Stop observing once revealed to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));

    /* ==========================================
       5. ANIMATED COUNTERS
       ========================================== */
    const counters = document.querySelectorAll('.counter');
    
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetNumber = parseFloat(target.getAttribute('data-target'));
                
                // Check if the number is a decimal (like your CGPA)
                const isDecimal = target.getAttribute('data-target').includes('.');
                
                let current = 0;
                // Determine speed based on how large the number is
                const increment = targetNumber / 80; 
                
                const updateCounter = () => {
                    current += increment;
                    
                    if (current < targetNumber) {
                        // Format specifically for CGPA or whole numbers
                        target.innerText = isDecimal ? current.toFixed(2) : Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        // Ensure final number is perfectly exact
                        target.innerText = isDecimal ? targetNumber.toFixed(2) : targetNumber + '+';
                    }
                };
                
                updateCounter();
                observer.unobserve(target); // Only animate once
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of the stat card is visible

    counters.forEach(counter => counterObserver.observe(counter));
});
