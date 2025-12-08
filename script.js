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
        this.particleCount = 60; // Reduced for performance
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
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                connections: [],
                opacity: Math.random() * 0.4 + 0.2
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
                
                if (distance < 80) { // Reduced connection distance
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(122, 158, 192, ${0.1 * (1 - distance / 80)})`;
                    this.ctx.lineWidth = 0.3;
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
            particle.speedX += (Math.random() - 0.5) * 0.005;
            particle.speedY += (Math.random() - 0.5) * 0.005;
            
            // Limit speed
            const maxSpeed = 0.5;
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
                
                if (distance < 80) {
                    const force = (80 - distance) / 80;
                    particle.speedX -= (dx / distance) * force * 0.03;
                    particle.speedY -= (dy / distance) * force * 0.03;
                }
            });
        });
    }
}

// ==========================================
// INITIAL LOAD ANIMATIONS - SIMPLIFIED
// ==========================================
function initLoadAnimations() {
    // Only hide elements that will be animated in
    gsap.set('.hero-title, .hero-subtitle, .hero-description, .hero-buttons', {
        opacity: 0,
        y: 20
    });
    
    // Hero text staggered animation - faster
    const heroTl = gsap.timeline({ delay: 0.2 });
    heroTl.to('.hero-title', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
    })
    .to('.hero-subtitle', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
    }, "-=0.3")
    .to('.hero-description', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
    }, "-=0.2")
    .to('.hero-buttons', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
    }, "-=0.2");
    
    // Nav animation
    gsap.from('.nav-container', {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.1
    });
}

// ==========================================
// SCROLL-BASED ANIMATIONS - SIMPLIFIED
// ==========================================
function initScrollAnimations() {
    // Section title animations
    gsap.utils.toArray('.section-title').forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 90%",
                toggleActions: "play none none reverse",
                once: true
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power2.out"
        });
    });
    
    // Edit row animations
    gsap.utils.toArray('.edit-row').forEach((row, i) => {
        gsap.from(row, {
            scrollTrigger: {
                trigger: row,
                start: "top 90%",
                toggleActions: "play none none reverse",
                once: true
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power2.out",
            delay: i * 0.05
        });
    });
    
    // Gallery item animations
    gsap.utils.toArray('.gallery-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 90%",
                toggleActions: "play none none reverse",
                once: true
            },
            opacity: 0,
            scale: 0.95,
            duration: 0.6,
            ease: "power2.out",
            delay: i * 0.05
        });
    });
    
    // About section animation
    gsap.from('.about-container', {
        scrollTrigger: {
            trigger: '.about-section',
            start: "top 85%",
            toggleActions: "play none none reverse",
            once: true
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out"
    });
    
    // Skills tag animations
    gsap.utils.toArray('.skill-tag').forEach((tag, i) => {
        gsap.from(tag, {
            scrollTrigger: {
                trigger: '.skills-section',
                start: "top 85%",
                toggleActions: "play none none reverse",
                once: true
            },
            opacity: 0,
            scale: 0.8,
            duration: 0.4,
            ease: "power2.out",
            delay: i * 0.03
        });
    });
    
    // Timeline animations
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 90%",
                toggleActions: "play none none reverse",
                once: true
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power2.out",
            delay: i * 0.05
        });
    });
    
    // Contact section animation
    gsap.from('.contact-container', {
        scrollTrigger: {
            trigger: '.contact-section',
            start: "top 85%",
            toggleActions: "play none none reverse",
            once: true
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out"
    });
    
    // Contact item animations
    gsap.utils.toArray('.contact-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: '.contact-info',
                start: "top 85%",
                toggleActions: "play none none reverse",
                once: true
            },
            opacity: 0,
            scale: 0.9,
            duration: 0.5,
            ease: "power2.out",
            delay: i * 0.1
        });
    });
}

// ==========================================
// SEAMLESS VIDEO AUTO-PLAY
// ==========================================
function initSeamlessVideos() {
    const videoContainers = document.querySelectorAll('.video-container');
    
    videoContainers.forEach(container => {
        const video = container.querySelector('video');
        if (!video) return;
        
        // Pre-set common aspect ratio
        container.style.paddingBottom = '56.25%';
        
        // Force immediate playback
        video.preload = "auto";
        video.muted = true;
        video.playsInline = true;
        
        // Try to play immediately
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Auto-play was prevented
            });
        }
        
        // Set aspect ratio
        video.addEventListener('loadedmetadata', function() {
            if (video.videoWidth && video.videoHeight) {
                const aspectRatio = video.videoWidth / video.videoHeight;
                const paddingPercentage = (1 / aspectRatio) * 100;
                container.style.paddingBottom = `${paddingPercentage}%`;
            }
        }, { once: true });
        
        // Play when in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(() => {
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
            gsap.to(heroImage, {
                opacity: 1,
                duration: 0.8,
                ease: "power2.out"
            });
        };
        if (heroImage.complete && heroImage.naturalWidth !== 0) {
            reveal();
        } else {
            heroImage.addEventListener('load', reveal, { once: true });
            setTimeout(() => {
                if (parseFloat(getComputedStyle(heroImage).opacity) === 0) reveal();
            }, 1000);
        }
    }
}

// ==========================================
// FIXED NAVIGATION SCROLL EFFECT
// ==========================================
let lastScrollY = 0;
let ticking = false;

function handleScroll() {
    const nav = document.querySelector('.glass-nav');
    const currentScroll = window.pageYOffset;
    
    // Show/hide nav based on scroll direction
    if (currentScroll > lastScrollY && currentScroll > 100) {
        nav.style.transform = 'translateX(-50%) translateY(-100px)';
    } else {
        nav.style.transform = 'translateX(-50%) translateY(0)';
    }
    
    // Compact state
    const heroHeight = document.querySelector('.hero-section')?.offsetHeight || 600;
    const scrollThreshold = heroHeight * 0.8;
    
    if (currentScroll > scrollThreshold) {
        nav.classList.add('is-compact');
        nav.classList.remove('is-expanding');
    } else {
        nav.classList.remove('is-compact');
        nav.classList.add('is-expanding');
    }
    
    lastScrollY = currentScroll;
    ticking = false;
}

// ==========================================
// BACK TO TOP BUTTON
// ==========================================
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==========================================
// SIMPLIFIED HOVER ANIMATIONS
// ==========================================
function initHoverAnimations() {
    // Button hover animations
    const buttons = document.querySelectorAll('.glass-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.05,
                duration: 0.2
            });
        });
        
        button.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.2
            });
        });
    });
    
    // Card hover animations
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                y: -3,
                duration: 0.3
            });
        });
        
        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                y: 0,
                duration: 0.3
            });
        });
    });
}

// ==========================================
// MOBILE NAVIGATION OPTIMIZATION
// ==========================================
function optimizeMobileNavigation() {
    const nav = document.querySelector('.glass-nav');
    const navLinks = document.querySelector('.nav-links');
    
    if (!nav || !navLinks) return;
    
    function checkNavOverflow() {
        const navWidth = nav.offsetWidth;
        const linksWidth = navLinks.scrollWidth;
        
        if (linksWidth > navWidth * 0.7) {
            navLinks.classList.add('overflowing');
        } else {
            navLinks.classList.remove('overflowing');
        }
    }
    
    checkNavOverflow();
    window.addEventListener('resize', checkNavOverflow);
}

// ==========================================
// INITIALIZE EVERYTHING - SIMPLIFIED
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Particle System
    new ParticleSystem();
    
    // Initialize Load Animations
    initLoadAnimations();
    
    // Initialize Smooth Scrolling
    initSmoothScrolling();
    
    // Initialize hero image animation
    initHeroImage();
    
    // Initialize seamless auto-play videos
    initSeamlessVideos();
    
    // Initialize hover animations
    initHoverAnimations();
    
    // Initialize scroll-based animations
    initScrollAnimations();
    
    // Initialize Back to Top button
    initBackToTop();
    
    // Initialize mobile navigation optimization
    optimizeMobileNavigation();
    
    // Setup scroll listener
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(handleScroll);
            ticking = true;
        }
    });
    
    // Force show all content after a short delay (fallback)
    setTimeout(() => {
        document.querySelectorAll('.glass-card').forEach(card => {
            card.style.opacity = '1';
        });
    }, 1000);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    const videos = document.querySelectorAll('video');
    if (document.hidden) {
        videos.forEach(video => video.pause());
    }
});
