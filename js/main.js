/**
 * Professional Portfolio Website - Main JavaScript
 * * Features:
 * - Modern Vanilla JavaScript (ES6+)
 * - Performance Optimized (rAF, IntersectionObserver, Passive Listeners)
 * - Accessible (Keyboard nav, reduced motion checks, ARIA)
 * - Modular and robust (Error safe)
 */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* ==========================================================================
       0. UTILITIES & CONFIG
       ========================================================================== */
    const CONFIG = {
        scrollThreshold: 60,
        isReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        isTouchDevice: window.matchMedia('(pointer: coarse)').matches,
        themeMediaQuery: window.matchMedia('(prefers-color-scheme: dark)')
    };

    // Throttle utility for performance
    const throttle = (fn, wait) => {
        let time = Date.now();
        return function () {
            if ((time + wait - Date.now()) < 0) {
                fn.apply(this, arguments);
                time = Date.now();
            }
        };
    };

    /* ==========================================================================
       1. LOADING SCREEN
       ========================================================================== */
    const initLoader = () => {
        const loader = document.getElementById('global-loader');
        if (!loader) return;

        // Ensure loader fades out smoothly
        window.addEventListener('load', () => {
            loader.animate([
                { opacity: 1 },
                { opacity: 0 }
            ], {
                duration: 500,
                easing: 'ease-out',
                fill: 'forwards'
            }).onfinish = () => {
                loader.style.display = 'none';
                loader.remove();
            };
        });
    };

    /* ==========================================================================
       2. NAVIGATION (Sticky, Active, Mobile)
       ========================================================================== */
    const initNavigation = () => {
        const navbar = document.querySelector('.navbar');
        const hamburger = document.querySelector('.btn-hamburger');
        const desktopNav = document.querySelector('.desktop-nav');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        // Sticky Navigation
        if (navbar) {
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        if (window.scrollY > CONFIG.scrollThreshold) {
                            navbar.classList.add('scrolled');
                            navbar.style.boxShadow = 'var(--shadow-md)';
                        } else {
                            navbar.classList.remove('scrolled');
                            navbar.style.boxShadow = 'none';
                        }
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });
        }

        // Active Navigation Link Detection
        if (navLinks.length > 0) {
            // Get current file name from URL (default to index.html)
            let currentPath = window.location.pathname.split('/').pop();
            if (currentPath === '' || currentPath === '/') currentPath = 'index.html';

            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === currentPath) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                } else {
                    link.classList.remove('active');
                    link.removeAttribute('aria-current');
                }
            });
        }

        // Responsive Mobile Navigation
        if (hamburger && desktopNav) {
            const toggleMenu = (forceClose = false) => {
                const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
                const willExpand = forceClose ? false : !isExpanded;
                
                hamburger.setAttribute('aria-expanded', willExpand);
                
                if (willExpand) {
                    // Open menu logic (using inline styles for robust standalone behavior)
                    desktopNav.style.display = 'flex';
                    desktopNav.style.position = 'absolute';
                    desktopNav.style.top = '100%';
                    desktopNav.style.left = '0';
                    desktopNav.style.width = '100%';
                    desktopNav.style.backgroundColor = 'var(--surface)';
                    desktopNav.style.padding = 'var(--spacing-xl)';
                    desktopNav.style.borderBottom = '1px solid var(--border)';
                    desktopNav.style.boxShadow = 'var(--shadow-lg)';
                    
                    const ul = desktopNav.querySelector('.nav-links');
                    if (ul) {
                        ul.style.flexDirection = 'column';
                        ul.style.alignItems = 'center';
                        ul.style.width = '100%';
                    }
                    document.body.style.overflow = 'hidden';
                } else {
                    // Close menu logic
                    desktopNav.style.display = '';
                    document.body.style.overflow = '';
                    
                    const ul = desktopNav.querySelector('.nav-links');
                    if (ul) {
                        ul.style.flexDirection = '';
                        ul.style.alignItems = '';
                    }
                }
            };

            hamburger.addEventListener('click', () => toggleMenu());

            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
                    toggleMenu(true);
                    hamburger.focus();
                }
            });

            // Close on outside click
            document.addEventListener('click', (e) => {
                if (hamburger.getAttribute('aria-expanded') === 'true' && !navbar.contains(e.target)) {
                    toggleMenu(true);
                }
            });

            // Close when clicking a nav link (important for mobile)
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth < 768) {
                        toggleMenu(true);
                    }
                });
            });

            // Handle resize reset
            window.addEventListener('resize', throttle(() => {
                if (window.innerWidth >= 768) {
                    toggleMenu(true);
                    desktopNav.style.display = ''; // Let CSS handle desktop layout
                }
            }, 200), { passive: true });
        }
    };

    /* ==========================================================================
       3. PROGRESS BAR & SCROLL TO TOP
       ========================================================================== */
    const initScrollFeatures = () => {
        const navbar = document.querySelector('.navbar');
        const backToTop = document.querySelector('.btn-back-to-top');

        // Setup Progress Bar
        let progressBar = null;
        if (navbar) {
            progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress-bar';
            // Styling via JS to ensure it works without CSS edits
            progressBar.style.position = 'absolute';
            progressBar.style.bottom = '0';
            progressBar.style.left = '0';
            progressBar.style.height = '2px';
            progressBar.style.backgroundColor = 'var(--primary)';
            progressBar.style.width = '0%';
            progressBar.style.transition = 'width 0.1s ease-out';
            progressBar.style.zIndex = 'calc(var(--z-header) + 1)';
            navbar.appendChild(progressBar);
        }

        // Scroll to top button initial state
        if (backToTop) {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
            backToTop.style.transition = 'var(--transition-normal)';
            
            backToTop.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: CONFIG.isReducedMotion ? 'auto' : 'smooth'
                });
            });
        }

        // Scroll Event Listener
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Calculate Progress
                    if (progressBar) {
                        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                        const scrolled = (winScroll / height) * 100;
                        progressBar.style.width = `${scrolled}%`;
                    }

                    // Toggle Back To Top
                    if (backToTop) {
                        if (window.scrollY > 400) {
                            backToTop.style.opacity = '1';
                            backToTop.style.visibility = 'visible';
                        } else {
                            backToTop.style.opacity = '0';
                            backToTop.style.visibility = 'hidden';
                        }
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    };

    /* ==========================================================================
       4. SCROLL REVEAL & LAZY LOADING
       ========================================================================== */
    const initObservers = () => {
        if (CONFIG.isReducedMotion) return;

        // Configuration for standard reveals
        const revealOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    
                    // Apply inline animation safely
                    el.animate([
                        { opacity: 0, transform: 'translateY(20px)' },
                        { opacity: 1, transform: 'translateY(0)' }
                    ], {
                        duration: 600,
                        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                        fill: 'forwards'
                    });

                    // Only animate once
                    observer.unobserve(el);
                }
            });
        }, revealOptions);

        // Select elements to reveal (Cards, Sections, specific components)
        const revealElements = document.querySelectorAll('.modern-card, .glass-panel, .timeline-item, .section-title, .prose p');
        revealElements.forEach(el => {
            el.style.opacity = '0'; // Hide initially
            revealObserver.observe(el);
        });

        // Lazy Loading Images
        const lazyImages = document.querySelectorAll('img[data-src]');
        if (lazyImages.length > 0) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.getAttribute('data-src');
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            }, { rootMargin: '50px 0px' });

            lazyImages.forEach(img => imageObserver.observe(img));
        }
    };

    /* ==========================================================================
       5. ANIMATED STATISTICS (COUNTERS)
       ========================================================================== */
    const initCounters = () => {
        if (CONFIG.isReducedMotion) return;

        const statElements = document.querySelectorAll('.stat-number');
        if (statElements.length === 0) return;

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const originalText = el.innerText.trim();
                    
                    // Check if it contains placeholders like XX+ or 3.xx
                    if (originalText.includes('XX') || originalText.includes('xx') || isNaN(parseFloat(originalText))) {
                        // Creative Scramble effect for placeholders
                        let iterations = 0;
                        const chars = '0123456789+X.';
                        const interval = setInterval(() => {
                            el.innerText = originalText.split('').map((char, index) => {
                                if (index < iterations) return originalText[index];
                                return chars[Math.floor(Math.random() * chars.length)];
                            }).join('');
                            
                            if (iterations >= originalText.length) {
                                clearInterval(interval);
                                el.innerText = originalText; // Ensure exact final text
                            }
                            iterations += 1 / 3;
                        }, 30);
                    } else {
                        // Standard numeric counter
                        const targetNumber = parseFloat(originalText);
                        const hasPlus = originalText.includes('+');
                        const isDecimal = originalText.includes('.');
                        
                        let start = 0;
                        const duration = 1500;
                        const startTime = performance.now();

                        const animate = (currentTime) => {
                            const elapsedTime = currentTime - startTime;
                            const progress = Math.min(elapsedTime / duration, 1);
                            
                            // Easing function (easeOutQuart)
                            const easeProgress = 1 - Math.pow(1 - progress, 4);
                            const currentVal = start + (targetNumber - start) * easeProgress;

                            let displayVal = isDecimal ? currentVal.toFixed(2) : Math.floor(currentVal);
                            el.innerText = displayVal + (hasPlus ? '+' : '');

                            if (progress < 1) {
                                window.requestAnimationFrame(animate);
                            } else {
                                el.innerText = originalText; // Ensure exact match at end
                            }
                        };
                        window.requestAnimationFrame(animate);
                    }

                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        statElements.forEach(stat => counterObserver.observe(stat));
    };

    /* ==========================================================================
       6. BUTTON RIPPLE EFFECT
       ========================================================================== */
    const initRippleEffect = () => {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            // Ensure button can contain absolute elements
            if(window.getComputedStyle(button).position === 'static') {
                button.style.position = 'relative';
            }
            button.style.overflow = 'hidden';

            button.addEventListener('click', function (e) {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const ripple = document.createElement('span');
                ripple.style.position = 'absolute';
                ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
                ripple.style.borderRadius = '50%';
                ripple.style.pointerEvents = 'none';
                ripple.style.width = '100px';
                ripple.style.height = '100px';
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                ripple.style.transform = 'translate(-50%, -50%) scale(0)';
                ripple.style.zIndex = '0';
                
                // Adjust text z-index so it sits above ripple
                Array.from(button.childNodes).forEach(child => {
                    if (child.nodeType === 1) child.style.position = 'relative';
                    if (child.nodeType === 1) child.style.zIndex = '1';
                });

                button.appendChild(ripple);

                // Animate using Web Animations API
                const animation = ripple.animate([
                    { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
                    { transform: 'translate(-50%, -50%) scale(3)', opacity: 0 }
                ], {
                    duration: 600,
                    easing: 'ease-out'
                });

                animation.onfinish = () => ripple.remove();
            });
        });
    };

    /* ==========================================================================
       7. MOUSE GLOW & FLOATING BACKGROUND
       ========================================================================== */
    const initAdvancedVisuals = () => {
        if (CONFIG.isTouchDevice || CONFIG.isReducedMotion) return;

        // Mouse Glow on Cards
        const glowingCards = document.querySelectorAll('.modern-card, .glass-panel');
        
        glowingCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Update CSS variables for potential CSS usage
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);

                // Apply dynamic background gradient via JS to ensure it works
                const currentBg = window.getComputedStyle(card).backgroundColor;
                // Extract base color or fallback
                card.style.background = `
                    radial-gradient(
                        800px circle at ${x}px ${y}px, 
                        rgba(var(--primary-rgb, 0, 120, 212), 0.06),
                        transparent 40%
                    ),
                    ${currentBg}
                `;
            });

            card.addEventListener('mouseleave', () => {
                card.style.background = '';
            });
        });

        // Floating Background Animation
        const bgBlur = document.querySelector('.bg-blur-placeholder');
        if (bgBlur) {
            let start = null;
            const animateBg = (timestamp) => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                
                const x = Math.sin(progress / 3000) * 20;
                const y = Math.cos(progress / 2500) * 20;
                
                bgBlur.style.transform = `translate(${x}px, ${y}px)`;
                window.requestAnimationFrame(animateBg);
            };
            window.requestAnimationFrame(animateBg);
        }
    };

    /* ==========================================================================
       8. FOOTER AUTO-YEAR
       ========================================================================== */
    const initFooter = () => {
        const copyrightText = document.querySelector('.copyright-text');
        if (copyrightText) {
            const currentYear = new Date().getFullYear();
            // Replaces "2026" or any 20XX with the actual current year dynamically
            copyrightText.innerHTML = copyrightText.innerHTML.replace(/20\d{2}/, currentYear);
        }
    };

    /* ==========================================================================
       9. THEME LISTENER (System Detection)
       ========================================================================== */
    const initTheme = () => {
        // Since CSS handles theme via prefers-color-scheme, we just add a JS hook
        // for future potential manual toggle implementations.
        const handleThemeChange = (e) => {
            const isDark = e.matches;
            document.body.classList.toggle('theme-dark', isDark);
            document.body.classList.toggle('theme-light', !isDark);
        };

        // Set initial state
        handleThemeChange(CONFIG.themeMediaQuery);
        
        // Listen for changes
        if (CONFIG.themeMediaQuery.addEventListener) {
            CONFIG.themeMediaQuery.addEventListener('change', handleThemeChange);
        } else {
            // Fallback for older browsers
            CONFIG.themeMediaQuery.addListener(handleThemeChange);
        }
    };

    /* ==========================================================================
       10. FUTURE HOOKS (Blog, Form APIs)
       ========================================================================== */
    const initHooks = () => {
        // Blog Search Hook
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', debounce((e) => {
                const query = e.target.value.toLowerCase();
                const articles = document.querySelectorAll('.card-blog, .featured-article-card');
                
                articles.forEach(article => {
                    const text = article.textContent.toLowerCase();
                    if (text.includes(query)) {
                        article.style.display = '';
                    } else {
                        article.style.display = 'none';
                    }
                });
            }, 300));
        }

        // Category Filter Hook
        const filterBtns = document.querySelectorAll('.btn-filter');
        if (filterBtns.length > 0) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    // Remove active from all
                    filterBtns.forEach(b => b.classList.remove('active', 'aria-pressed'));
                    // Add active to clicked
                    const target = e.currentTarget;
                    target.classList.add('active');
                    target.setAttribute('aria-pressed', 'true');
                    
                    // Placeholder logic for filtering (requires categories in HTML data attributes for full implementation)
                    // console.log(`Filtering for: ${target.textContent}`);
                });
            });
        }
    };

    // Simple debounce utility for the search hook
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
       INITIALIZATION CALLS
       ========================================================================== */
    const init = () => {
        try {
            initLoader();
            initNavigation();
            initScrollFeatures();
            initObservers();
            initCounters();
            initRippleEffect();
            initAdvancedVisuals();
            initFooter();
            initTheme();
            initHooks();
        } catch (error) {
            console.error("Portfolio Initialization Error:", error);
        }
    };

    // Run initialization
    init();
});
