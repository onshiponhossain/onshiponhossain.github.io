document.addEventListener("DOMContentLoaded", () => {
    // 1. Loading Screen
    const loader = document.getElementById("loader");
    if (loader) {
        // Simple fade out for loader
        setTimeout(() => {
            loader.style.opacity = "0";
            setTimeout(() => {
                loader.style.display = "none";
            }, 500); // match CSS transition
        }, 300);
    }

    // 2. Reading Progress Bar
    const progressBar = document.getElementById("readingProgress");
    window.addEventListener("scroll", () => {
        if (progressBar) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + "%";
        }
    }, { passive: true });

    // 3. Sticky Header shadow on scroll
    const header = document.getElementById("header");
    window.addEventListener("scroll", () => {
        if (header) {
            if (window.scrollY > 10) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }
    }, { passive: true });

    // 4. Mobile Menu Toggle
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            menuToggle.classList.toggle("active");
            navLinks.classList.toggle("active");
            
            // Trap focus or manage accessibility (aria-expanded)
            const isExpanded = menuToggle.classList.contains("active");
            menuToggle.setAttribute("aria-expanded", isExpanded);
        });

        // Close menu on outside click
        document.addEventListener("click", (e) => {
            if (navLinks.classList.contains("active") && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove("active");
                navLinks.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });

        // Close menu on ESC key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && navLinks.classList.contains("active")) {
                menuToggle.classList.remove("active");
                navLinks.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    // 5. Scroll Reveal Animation using Intersection Observer
    const reveals = document.querySelectorAll(".reveal");
    
    if (reveals.length > 0) {
        const revealOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };
        
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    return;
                } else {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target); // Stop observing once revealed
                }
            });
        }, revealOptions);
        
        reveals.forEach(reveal => {
            revealObserver.observe(reveal);
        });
    }

    // 6. Ripple Effect for Buttons
    const rippleButtons = document.querySelectorAll('.ripple');
    rippleButtons.forEach(btn => {
        btn.addEventListener('mousedown', function (e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripples = document.createElement('span');
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            ripples.classList.add('ripple-span');
            
            this.appendChild(ripples);
            
            setTimeout(() => {
                ripples.remove();
            }, 600); // match animation duration
        });
    });

    // 7. Back to Top Button
    const backToTopBtn = document.getElementById("backToTop");
    if (backToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add("visible");
            } else {
                backToTopBtn.classList.remove("visible");
            }
        }, { passive: true });

        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // 8. Auto-update Footer Year
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
