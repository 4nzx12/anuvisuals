// Register GSAP plugins
gsap.registerPlugin(Draggable, ScrollTrigger);

// ==========================================
// PARTICLE SYSTEM FOR FLOWY ABSTRACT BACKGROUND
// ==========================================
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.colors = [
            'rgba(122, 158, 192, 0.6)',   // Light blue
            'rgba(90, 124, 168, 0.6)',    // Medium blue
            'rgba(212, 184, 150, 0.6)',   // Beige
            'rgba(168, 146, 112, 0.6)',   // Dark beige
            'rgba(245, 240, 230, 0.6)'    // Light beige
        ];
        
        this.init();
        this.animate();
        this.handleResize();
        this.addEventListeners();
    }
    
    init() {
        this.resizeCanvas();
        this.createParticles();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                connections: [],
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(122, 158, 192, ${0.2 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
        
        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        });
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Boundary check with smooth bounce
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX *= -1;
                particle.x = particle.x < 0 ? 0 : this.canvas.width;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.speedY *= -1;
                particle.y = particle.y < 0 ? 0 : this.canvas.height;
            }
            
            // Gentle floating motion
            particle.speedX += (Math.random() - 0.5) * 0.01;
            particle.speedY += (Math.random() - 0.5) * 0.01;
            
            // Limit speed
            const maxSpeed = 0.8;
            const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
            if (speed > maxSpeed) {
                particle.speedX = (particle.speedX / speed) * maxSpeed;
                particle.speedY = (particle.speedY / speed) * maxSpeed;
            }
        });
    }
    
    animate() {
        this.updateParticles();
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
    
    handleResize() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            // Reposition particles within new bounds
            this.particles.forEach(particle => {
                particle.x = (particle.x / this.canvas.width) * window.innerWidth;
                particle.y = (particle.y / this.canvas.height) * window.innerHeight;
            });
        });
    }
    
    addEventListeners() {
        // Add subtle interaction
        this.canvas.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            this.particles.forEach(particle => {
                const dx = mouseX - particle.x;
                const dy = mouseY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    particle.speedX -= (dx / distance) * force * 0.05;
                    particle.speedY -= (dy / distance) * force * 0.05;
                }
            });
        });
    }
}

// ==========================================
// INITIAL LOAD ANIMATIONS
// ==========================================
function initLoadAnimations() {
    // Hide all elements initially
    gsap.set(['.hero-content', '.section-title', '.edit-row', '.gallery-item', '.about-container', '.timeline-item', '.contact-container'], {
        opacity: 0,
        y: 20
    });
    
    // Hide hero elements individually
    gsap.set('.hero-title, .hero-subtitle, .hero-description, .hero-buttons', {
        opacity: 0,
        y: 30
    });
    
    // Hero section entrance animation
    gsap.to('.hero-content', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        delay: 0.3
    });
    
    // Hero text staggered animation
    const heroTl = gsap.timeline({ delay: 0.5 });
    heroTl.to('.hero-title', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "back.out(1.7)"
    })
    .to('.hero-subtitle', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.5")
    .to('.hero-description', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.3")
    .to('.hero-buttons', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
    }, "-=0.2");
    
    // Nav animation
    gsap.from('.nav-container', {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        delay: 0.2
    });
}

// ==========================================
// SCROLL-BASED ANIMATIONS
// ==========================================
function initScrollAnimations() {
    // Section title animations
    gsap.utils.toArray('.section-title').forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power2.out"
        });
    });
    
    // Edit row animations
    gsap.utils.toArray('.edit-row').forEach((row, i) => {
        gsap.from(row, {
            scrollTrigger: {
                trigger: row,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: "power2.out",
            delay: i * 0.1
        });
    });
    
    // Gallery item animations
    gsap.utils.toArray('.gallery-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            ease: "back.out(1.7)",
            delay: i * 0.1
        });
    });
    
    // About section animation
    gsap.from('.about-container', {
        scrollTrigger: {
            trigger: '.about-section',
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out"
    });
    
    // Skills tag animations
    gsap.utils.toArray('.skill-tag').forEach((tag, i) => {
        gsap.from(tag, {
            scrollTrigger: {
                trigger: '.skills-section',
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            x: -20,
            duration: 0.5,
            ease: "power2.out",
            delay: i * 0.05
        });
    });
    
    // Timeline animations
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 90%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            x: i % 2 === 0 ? -50 : 50,
            duration: 0.8,
            ease: "power2.out",
            delay: i * 0.1
        });
    });
    
    // Contact section animation
    gsap.from('.contact-container', {
        scrollTrigger: {
            trigger: '.contact-section',
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out"
    });
    
    // Contact item animations
    gsap.utils.toArray('.contact-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: '.contact-info',
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            scale: 0.8,
            duration: 0.6,
            ease: "back.out(1.7)",
            delay: i * 0.15
        });
    });
}

// ==========================================
// SEAMLESS VIDEO AUTO-PLAY WITH DYNAMIC ASPECT RATIO
// ==========================================
function initSeamlessVideos() {
    const videoContainers = document.querySelectorAll('.video-container');
    
    videoContainers.forEach(container => {
        const video = container.querySelector('video');
        if (!video) return;
        
        // Pre-set common aspect ratio to avoid layout shift
        container.style.paddingBottom = '56.25%'; // Default 16:9
        
        // Force immediate playback
        video.preload = "auto";
        video.load();
        
        // Try to play immediately
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Auto-play prevented, trying muted play:", error);
                video.muted = true;
                video.play();
            });
        }
        
        // Set aspect ratio when metadata loads (happens quickly)
        video.addEventListener('loadedmetadata', function() {
            if (video.videoWidth && video.videoHeight) {
                const aspectRatio = video.videoWidth / video.videoHeight;
                const paddingPercentage = (1 / aspectRatio) * 100;
                container.style.paddingBottom = `${paddingPercentage}%`;
            }
        }, { once: true });
        
        // Ensure video plays even if scrolled into view later
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(e => {
                        video.muted = true;
                        video.play();
                    });
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(video);
    });
}

// Handle window resize for video containers
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const videoContainers = document.querySelectorAll('.video-container');
        videoContainers.forEach(container => {
            const video = container.querySelector('video');
            if (video && video.videoWidth && video.videoHeight) {
                const aspectRatio = video.videoWidth / video.videoHeight;
                const paddingPercentage = (1 / aspectRatio) * 100;
                container.style.paddingBottom = `${paddingPercentage}%`;
            }
        });
    }, 100);
});

// ==========================================
// SMOOTH SCROLLING
// ==========================================
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================
// HERO IMAGE ANIMATION
// ==========================================
function initHeroImage() {
    const heroImage = document.querySelector('.hero-face');
    if (heroImage) {
        heroImage.style.opacity = 0;
        const reveal = () => {
            gsap.fromTo(heroImage, 
                {
                    opacity: 0,
                    scale: 1.1,
                    rotation: -2
                },
                {
                    opacity: 1,
                    scale: 1,
                    rotation: 0,
                    duration: 1.2,
                    ease: "power2.out",
                    delay: 0.2
                }
            );
        };
        if (heroImage.complete && heroImage.naturalWidth !== 0) {
            reveal();
        } else {
            heroImage.addEventListener('load', reveal, { once: true });
            setTimeout(() => {
                if (parseFloat(getComputedStyle(heroImage).opacity) === 0) reveal();
            }, 1500);
        }
    }
}

// ==========================================
// FIXED NAVIGATION SCROLL EFFECT (80% threshold)
// ==========================================
let scrollThreshold = 0;
let heroHeight = 0;
let lastCompactState = false;

// Calculate threshold (80% of hero section)
function calculateScrollThreshold() {
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroHeight = heroSection.offsetHeight;
        scrollThreshold = heroHeight * 0.8;
    }
}

// Calculate on load
calculateScrollThreshold();

// Recalculate on window resize
window.addEventListener('resize', calculateScrollThreshold, { passive: true });

// Scroll Logic
let ticking = false;
window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
    }
}, { passive: true });

function handleScroll() {
    const nav = document.querySelector('.glass-nav');
    const currentScroll = window.pageYOffset;
    
    if (heroHeight > 0) {
        const isCompact = currentScroll > scrollThreshold;
        
        // Only update if state changed
        if (isCompact !== lastCompactState) {
            if (isCompact) {
                nav.classList.add('is-compact');
                nav.classList.remove('is-expanding');
            } else {
                nav.classList.remove('is-compact');
                nav.classList.add('is-expanding');
            }
            lastCompactState = isCompact;
        }
    }
    
    // Ensure nav is always at y:0
    gsap.set(nav, { y: 0 });
    
    ticking = false;
}

// ==========================================
// BUTTON RIPPLE EFFECT
// ==========================================
function initButtonRipples() {
    const buttons = document.querySelectorAll('.glass-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation CSS
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ==========================================
// HOVER ANIMATIONS
// ==========================================
function initHoverAnimations() {
    // Button hover animations
    const buttons = document.querySelectorAll('.glass-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        button.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
    
    // Card hover animations
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                y: -5,
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                duration: 0.4,
                ease: "power2.out"
            });
        });
        
        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                y: 0,
                boxShadow: 'none',
                duration: 0.4,
                ease: "power2.out"
            });
        });
    });
    
    // Social link hover animations
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.15,
                rotation: 5,
                duration: 0.3,
                ease: "back.out(1.7)"
            });
        });
        
        link.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
}

// ==========================================
// BACK TO TOP BUTTON
// ==========================================
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
            gsap.to(backToTopBtn, {
                opacity: 0.9,
                duration: 0.3
            });
        } else {
            backToTopBtn.classList.remove('visible');
            gsap.to(backToTopBtn, {
                opacity: 0,
                duration: 0.3
            });
        }
    });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Add a little bounce animation
        gsap.to(this, {
            scale: 0.9,
            duration: 0.1,
            yoyo: true,
            repeat: 1
        });
    });
    
    // Add hover effect
    backToTopBtn.addEventListener('mouseenter', function() {
        gsap.to(this, {
            scale: 1.1,
            duration: 0.2
        });
    });
    
    backToTopBtn.addEventListener('mouseleave', function() {
        gsap.to(this, {
            scale: 1,
            duration: 0.2
        });
    });
}

// ==========================================
// VIDEO CONTROLS STYLES (injected via JS)
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Inject styles to hide all video controls
    const videoControlStyles = document.createElement('style');
    videoControlStyles.textContent = `
        /* Hide native video controls completely */
        video::-webkit-media-controls {
            display: none !important;
        }
        
        video::-webkit-media-controls-enclosure {
            display: none !important;
        }
        
        video::-webkit-media-controls-panel {
            display: none !important;
        }
        
        video::-webkit-media-controls-play-button {
            display: none !important;
        }
        
        video::-webkit-media-controls-timeline {
            display: none !important;
        }
        
        video::-webkit-media-controls-current-time-display {
            display: none !important;
        }
        
        video::-webkit-media-controls-time-remaining-display {
            display: none !important;
        }
        
        video::-webkit-media-controls-timeline-container {
            display: none !important;
        }
        
        video::-webkit-media-controls-volume-control-container {
            display: none !important;
        }
        
        video::-webkit-media-controls-volume-slider {
            display: none !important;
        }
        
        video::-webkit-media-controls-seek-back-button {
            display: none !important;
        }
        
        video::-webkit-media-controls-seek-forward-button {
            display: none !important;
        }
        
        video::-webkit-media-controls-fullscreen-button {
            display: none !important;
        }
        
        video::-webkit-media-controls-rewind-button {
            display: none !important;
        }
        
        video::-webkit-media-controls-return-to-realtime-button {
            display: none !important;
        }
        
        video::-webkit-media-controls-toggle-closed-captions-button {
            display: none !important;
        }
        
        /* Prevent video interaction */
        .video-container {
            pointer-events: none;
        }
        
        .video-container video {
            pointer-events: none;
        }
        
        /* Smooth aspect ratio transitions */
        .video-container {
            transition: padding-bottom 0.3s ease;
        }
    `;
    document.head.appendChild(videoControlStyles);
});

// ==========================================
// MOBILE NAVIGATION OPTIMIZATION
// ==========================================
function optimizeMobileNavigation() {
    const nav = document.querySelector('.glass-nav');
    const navLinks = document.querySelector('.nav-links');
    
    if (!nav || !navLinks) return;
    
    // Function to check if nav links are overflowing
    function checkNavOverflow() {
        const navWidth = nav.offsetWidth;
        const linksWidth = navLinks.scrollWidth;
        
        // If links are wider than nav container
        if (linksWidth > navWidth * 0.7) {
            navLinks.classList.add('overflowing');
        } else {
            navLinks.classList.remove('overflowing');
        }
    }
    
    // Initial check
    checkNavOverflow();
    
    // Check on resize
    window.addEventListener('resize', checkNavOverflow);
    
    // Add touch scrolling for mobile nav
    let touchStartX = 0;
    let touchEndX = 0;
    
    navLinks.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    navLinks.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        // Optional: Add swipe functionality if needed
    });
}

// ==========================================
// INITIALIZE EVERYTHING
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Particle System
    new ParticleSystem();
    
    // Initialize Load Animations (runs once on load)
    initLoadAnimations();
    
    // Initialize Smooth Scrolling
    initSmoothScrolling();
    
    // Initialize hero image animation
    initHeroImage();
    
    // Initialize seamless auto-play videos
    initSeamlessVideos();
    
    // Initialize button ripple effects
    initButtonRipples();
    
    // Initialize hover animations
    initHoverAnimations();
    
    // Initialize scroll-based animations
    initScrollAnimations();
    
    // Calculate initial scroll threshold
    calculateScrollThreshold();
    
    // Initialize mobile navigation optimization
    optimizeMobileNavigation();
    
    // Initialize Back to Top button
    initBackToTop();
    
    // Force a reflow to prevent any initial animation jumps
    setTimeout(() => {
        document.body.style.opacity = 1;
    }, 100);
});

// Handle page visibility changes (pause videos when tab is not active)
document.addEventListener('visibilitychange', function() {
    const videos = document.querySelectorAll('video');
    if (document.hidden) {
        videos.forEach(video => video.pause());
    } else {
        videos.forEach(video => {
            if (isElementInViewport(video)) {
                video.play().catch(e => {
                    video.muted = true;
                    video.play();
                });
            }
        });
    }
});

// Helper function to check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add mobile navigation CSS
const mobileNavStyles = document.createElement('style');
mobileNavStyles.textContent = `
    .nav-links.overflowing {
        justify-content: flex-start;
        padding-right: 10px;
    }
    
    @media (max-width: 320px) {
        .nav-links {
            max-width: 200px;
        }
    }
`;
document.head.appendChild(mobileNavStyles);