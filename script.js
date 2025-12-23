// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

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
// YOUTUBE EMBED ENHANCEMENTS
// ==========================================
function initYouTubeEmbeds() {
    const videoContainers = document.querySelectorAll('.video-container');
    
    videoContainers.forEach(container => {
        const iframe = container.querySelector('iframe');
        const playOverlay = container.querySelector('.youtube-play-overlay');
        
        if (playOverlay && iframe) {
            // Click overlay to play video
            playOverlay.addEventListener('click', () => {
                // Get the YouTube URL
                const youtubeUrl = iframe.src;
                // Open in new tab for better viewing
                window.open(youtubeUrl.replace('/embed/', '/watch?v='), '_blank');
            });
        }
        
        // Add click handler to entire container
        container.addEventListener('click', (e) => {
            if (!e.target.closest('.youtube-play-overlay')) {
                const youtubeUrl = iframe.src;
                window.open(youtubeUrl.replace('/embed/', '/watch?v='), '_blank');
            }
        });
    });
}

// ==========================================
// FIXED LOAD ANIMATIONS - NO INITIAL HIDING
// ==========================================
function initLoadAnimations() {
    // Hero section entrance animation (gentle fade in)
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
    gsap.from('.glass-nav', {
        y: -30,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        delay: 0.2
    });
}

// ==========================================
// SCROLL-BASED ANIMATIONS (FIXED)
// ==========================================
function initScrollAnimations() {
    // Section title animations
    gsap.utils.toArray('.section-title').forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none none"
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
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power2.out",
            delay: i * 0.1
        });
    });
    
    // Gallery item animations
    gsap.utils.toArray('.gallery-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 90%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            scale: 0.95,
            duration: 0.6,
            ease: "back.out(1.2)",
            delay: i * 0.1
        });
    });
    
    // About section animation
    gsap.from('.about-container', {
        scrollTrigger: {
            trigger: '.about-section',
            start: "top 85%",
            toggleActions: "play none none none"
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
                start: "top 90%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            x: -15,
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
                start: "top 92%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            x: i % 2 === 0 ? -30 : 30,
            duration: 0.6,
            ease: "power2.out",
            delay: i * 0.1
        });
    });
    
    // Contact section animation
    gsap.from('.contact-container', {
        scrollTrigger: {
            trigger: '.contact-section',
            start: "top 85%",
            toggleActions: "play none none none"
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
                start: "top 90%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            scale: 0.9,
            duration: 0.6,
            ease: "back.out(1.2)",
            delay: i * 0.15
        });
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
// NAVIGATION SCROLL EFFECT (FIXED)
// ==========================================
function initNavigationScroll() {
    const nav = document.querySelector('.glass-nav');
    if (!nav) return;
    
    let lastScroll = 0;
    let ticking = false;
    
    function updateNav() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.classList.add('is-compact');
        } else {
            nav.classList.remove('is-compact');
        }
        
        lastScroll = currentScroll;
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateNav);
            ticking = true;
        }
    });
}

// ==========================================
// BUTTON RIPPLE EFFECT
// ==========================================
function initButtonRipples() {
    const buttons = document.querySelectorAll('.glass-button:not(#backToTop)');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Don't create ripple for back-to-top button
            if (this.id === 'backToTop') return;
            
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
    const buttons = document.querySelectorAll('.glass-button:not(#backToTop)');
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
// INITIALIZE EVERYTHING
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Anu Visuals - Initializing...');
    
    // Initialize Particle System
    new ParticleSystem();
    
    // Make sure body is visible immediately
    document.body.style.opacity = '1';
    
    // Initialize core functions
    initSmoothScrolling();
    initNavigationScroll();
    initHeroImage();
    initButtonRipples();
    initHoverAnimations();
    initBackToTop();
    initYouTubeEmbeds();
    
    // Initialize animations after a short delay
    setTimeout(() => {
        initLoadAnimations();
        initScrollAnimations();
    }, 100);
    
    console.log('Anu Visuals - Initialized successfully!');
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Handle any resize-related updates here
    }, 250);
});

// Add console message for debugging
console.log('Anu Visuals Script Loaded');

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