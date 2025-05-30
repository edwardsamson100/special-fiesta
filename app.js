// Mobile menu toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show-menu');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active link highlighting based on scroll position
const sections = document.querySelectorAll('.section, .hero');
const navLinksArray = Array.from(navLinks);

function updateActiveLink() {
    const scrollPosition = window.scrollY + 100;

    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Remove active class from all links
            navLinksArray.forEach(link => link.classList.remove('active-link'));
            
            // Add active class to current link
            const activeLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active-link');
            }
        }
    });
}

// Scroll to top button
function createScrollTopButton() {
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top';
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollTopBtn);

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    return scrollTopBtn;
}

const scrollTopBtn = createScrollTopButton();

// Show/hide scroll to top button and update active links
function handleScroll() {
    const scrollPosition = window.scrollY;
    
    // Show/hide scroll to top button
    if (scrollPosition > 300) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
    
    // Update active navigation link
    updateActiveLink();
}

// Fade-in animation on scroll
function fadeInOnScroll() {
    const fadeElements = document.querySelectorAll('.card, .hero__content');
    
    fadeElements.forEach(element => {
        element.classList.add('fade-in');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// Header background change on scroll
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    const scrollPosition = window.scrollY;

    if (scrollPosition > 50) {
        header.style.backgroundColor = 'rgba(255, 255, 253, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.backgroundColor = 'var(--color-surface)';
        header.style.backdropFilter = 'none';
    }
}

// Smooth reveal animation for sections
function revealSections() {
    const sections = document.querySelectorAll('.section');
    
    const revealSection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    };

    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null,
        threshold: 0.15,
    });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        sectionObserver.observe(section);
    });
}

// Typing effect for hero title
function typewriterEffect() {
    const title = document.querySelector('.hero__title');
    const text = title.textContent;
    title.textContent = '';
    title.style.borderRight = '2px solid var(--color-primary)';
    
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            title.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
            setTimeout(() => {
                title.style.borderRight = 'none';
            }, 1000);
        }
    }, 100);
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initial setup
    updateActiveLink();
    fadeInOnScroll();
    revealSections();
    
    // Add event listeners
    window.addEventListener('scroll', () => {
        handleScroll();
        handleHeaderScroll();
    });

    // Typing effect with delay
    setTimeout(typewriterEffect, 500);

    // Set initial header state
    handleHeaderScroll();
});

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on resize
    navMenu.classList.remove('show-menu');
    navToggle.classList.remove('active');
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        navMenu.classList.remove('show-menu');
        navToggle.classList.remove('active');
    }
    
    // Scroll to top with Home key
    if (e.key === 'Home' && e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const smoothScrollPolyfill = (target) => {
        const startPosition = window.pageYOffset;
        const targetPosition = target;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const progressPercentage = Math.min(progress / duration, 1);
            
            // Easing function
            const ease = progressPercentage < 0.5 
                ? 2 * progressPercentage * progressPercentage 
                : 1 - Math.pow(-2 * progressPercentage + 2, 3) / 2;
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (progress < duration) {
                requestAnimationFrame(step);
            }
        }
        
        requestAnimationFrame(step);
    };

    // Override smooth scroll for older browsers
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                smoothScrollPolyfill(targetPosition);
            }
        });
    });
}

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll handlers
const throttledScroll = throttle(() => {
    handleScroll();
    handleHeaderScroll();
}, 16); // ~60fps

window.removeEventListener('scroll', handleScroll);
window.removeEventListener('scroll', handleHeaderScroll);
window.addEventListener('scroll', throttledScroll);