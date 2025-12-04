// Register GSAP plugins
gsap.registerPlugin(Draggable, ScrollTrigger);

// Particle System for Flowy Abstract Background
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Particle System
    new ParticleSystem();
    
    // Initialize Liquid Glass Menu
    initLiquidGlassMenu();
    
    // Initialize Smooth Scrolling
    initSmoothScrolling();
    
    // Initialize Card Animations
    initCardAnimations();
    
    // Initialize hero image lazy load
    initHeroImage();
});

// LIQUID GLASS MENU
function initLiquidGlassMenu() {
    const liquidGlass = document.querySelector('.liquid-glass');
    
    if (liquidGlass) {
        // Make it draggable
        Draggable.create(liquidGlass, {
            type: "x,y",
            bounds: window,
            inertia: true,
            onRelease: function() {
                gsap.to(this.target, {
                    x: 0,
                    y: 0,
                    duration: 1.5,
                    ease: "elastic.out(1,0.3)"
                });
            }
        });

        // Toggle expand on click
        liquidGlass.addEventListener("click", (e) => {
            if (e.target.closest('.liquid-glass__link')) return;
            e.currentTarget.classList.toggle("is-expanded");
        });
    }
}

// SMOOTH SCROLLING
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
                
                // Close liquid glass menu if open
                const liquidGlass = document.querySelector('.liquid-glass');
                if (liquidGlass && liquidGlass.classList.contains('is-expanded')) {
                    liquidGlass.classList.remove('is-expanded');
                }
            }
        });
    });
}

// CARD ANIMATIONS (Slide in on scroll only)
function initCardAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all glass cards
    document.querySelectorAll('.glass-card').forEach(card => {
        observer.observe(card);
    });

    // Add parallax effect to hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        
        if (heroSection) {
            const heroImage = heroSection.querySelector('.hero-image');
            if (heroImage) {
                const speed = 0.5;
                const yPos = -(scrolled * speed);
                gsap.to(heroImage, {
                    y: yPos,
                    duration: 0.1,
                    ease: "none"
                });
            }
        }
    });
}

// HERO IMAGE LAZY LOAD
function initHeroImage() {
    const heroImage = document.querySelector('.hero-face');
    if (heroImage) {
        // Replace with your actual image path
        // heroImage.src = 'path/to/your/actual/face/image.jpg';
        
        heroImage.onload = function() {
            gsap.to(heroImage, {
                opacity: 1,
                duration: 1,
                ease: "power2.out"
            });
        };
        
        heroImage.style.opacity = 0;
    }
}

// NAVIGATION SCROLL EFFECT
let lastScroll = 0;
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.glass-nav');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        if (currentScroll > lastScroll) {
            // Scrolling down
            gsap.to(nav, {
                y: -100,
                duration: 0.3,
                ease: "power2.out"
            });
        } else {
            // Scrolling up
            gsap.to(nav, {
                y: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    } else {
        gsap.to(nav, {
            y: 0,
            duration: 0.3,
            ease: "power2.out"
        });
    }
    
    lastScroll = currentScroll;
});

// ENHANCE ALL BUTTONS WITH RIPPLES
function enhanceButtons() {
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
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
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

// Initialize button enhancements
enhanceButtons();