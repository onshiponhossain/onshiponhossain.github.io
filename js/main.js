/**
 * ============================================================================
 * MAIN JAVASCRIPT - PROFESSIONAL PORTFOLIO
 * Architecture: Vanilla JS (ES6+)
 * Performance: Optimized with Throttle, Debounce, requestAnimationFrame
 * Accessibility: WCAG Compliant, Prefers-Reduced-Motion Support
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* ==========================================================================
       1. UTILITIES & CONFIGURATION
       ========================================================================== */
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isReducedMotion = prefersReducedMotion.matches;

    prefersReducedMotion.addEventListener("change", (e) => {
        isReducedMotion = e.matches;
    });

    /**
     * Throttle function for high-frequency events (scroll)
     */
    const throttle = (func, limit) => {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    };

    /**
     * Debounce function for resize events
     */
    const debounce = (func, delay) => {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    };

    /* ==========================================================================
       2. LOADING SCREEN & PAGE TRANSITIONS
       ========================================================================== */
    
    const loader = document.getElementById("loader");
    if (loader) {
        // Fade out loader after initial render
        window.addEventListener("load", () => {
            loader.style.opacity = "0";
            loader.style.transition = "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
            setTimeout(() => {
                loader.style.display = "none";
                loader.classList.add("hidden");
            }, 600);
        });
    }

    // Page Transition for internal links
    const internalLinks = document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"])');
    internalLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            // Check if holding modifier keys (Ctrl, Cmd, Shift) to allow native behavior
            if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
            
            e.preventDefault();
            const targetUrl = link.getAttribute("href");
            
            document.body.style.opacity = "0";
            document.body.style.transition = "opacity 0.4s ease";
            
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 400);
        });
    });

    /* ==========================================================================
       3. NAVIGATION (MOBILE, STICKY, ACTIVE)
       ========================================================================== */
    
    const header = document.querySelector(".site-header");
    const menuToggle = document.querySelector(".mobile-menu-toggle");
    const mobileNav = document.getElementById("mobile-nav");
    const body = document.body;

    // Sticky Header
    if (header) {
        const handleScroll = throttle(() => {
            if (window.scrollY > 60) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }, 100);
        window.addEventListener("scroll", handleScroll, { passive: true });
    }

    // Active Navigation Highlight
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");
    
    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });

    // Mobile Hamburger Menu
    if (menuToggle && mobileNav) {
        const toggleMenu = () => {
            const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
            menuToggle.setAttribute("aria-expanded", !isExpanded);
            mobileNav.classList.toggle("open");
            mobileNav.setAttribute("aria-hidden", isExpanded);
            
            if (!isExpanded) {
                body.style.overflow = "hidden"; // Prevent background scroll
            } else {
                body.style.overflow = "";
            }
        };

        menuToggle.addEventListener("click", toggleMenu);

        // Close on link click
        const mobileLinks = mobileNav.querySelectorAll(".mobile-nav-link");
        mobileLinks.forEach(link => {
            link.addEventListener("click", () => {
                if (menuToggle.getAttribute("aria-expanded") === "true") {
                    toggleMenu();
                }
            });
        });

        // Close when clicking outside
        document.addEventListener("click", (e) => {
            if (mobileNav.classList.contains("open") && !mobileNav.contains(e.target) && !menuToggle.contains(e.target)) {
                toggleMenu();
            }
        });

        // Accessibility: Close on Escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && mobileNav.classList.contains("open")) {
                toggleMenu();
                menuToggle.focus();
            }
        });
    }

    /* ==========================================================================
       4. SCROLL PROGRESS & SCROLL TO TOP
       ========================================================================== */
    
    // Inject Scroll Progress Bar
    const progressBar = document.createElement("div");
    progressBar.id = "scroll-progress";
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: var(--clr-primary, #0078D4);
        z-index: 9999;
        width: 0%;
        transition: width 0.1s ease-out;
        pointer-events: none;
    `;
    document.body.appendChild(progressBar);

    // Inject Scroll To Top Button
    const scrollTopBtn = document.createElement("button");
    scrollTopBtn.id = "scroll-to-top";
    scrollTopBtn.innerHTML = "↑";
    scrollTopBtn.setAttribute("aria-label", "Scroll to top");
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: var(--clr-surface, #FFFFFF);
        color: var(--clr-text, #1F2937);
        border: 1px solid var(--clr-border, #E5E7EB);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
    `;
    document.body.appendChild(scrollTopBtn);

    const updateScrollFeatures = throttle(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Update Progress Bar
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${scrollPercent}%`;

        // Toggle Scroll to Top Button
        if (scrollTop > 300) {
            scrollTopBtn.style.opacity = "1";
            scrollTopBtn.style.visibility = "visible";
            scrollTopBtn.style.transform = "translateY(0)";
        } else {
            scrollTopBtn.style.opacity = "0";
            scrollTopBtn.style.visibility = "hidden";
