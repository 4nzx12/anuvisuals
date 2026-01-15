// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initLoadAnimations();
    initScrollAnimations();
    initVideoPlayer();
    initUnifiedLightbox();
    initBackToTop();
});

// ==========================================
// 1. MOBILE MENU TOGGLE
// ==========================================
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    let isOpen = false;

    if (!menuToggle) return;

    function toggleMenu() {
        isOpen = !isOpen;
        menuToggle.classList.toggle('active');
        mobileOverlay.classList.toggle('active');

        if (isOpen) {
            // Animate links in
            gsap.to(mobileLinks, {
                y: 0,
                opacity: 1,
                stagger: 0.1,
                duration: 0.5,
                ease: "back.out(1.7)"
            });
            document.body.style.overflow = 'hidden';
        } else {
            // Animate links out
            gsap.to(mobileLinks, {
                y: 20,
                opacity: 0,
                duration: 0.3
            });
            document.body.style.overflow = '';
        }
    }

    menuToggle.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });
}

// ==========================================
// 2. LOAD ANIMATIONS (HERO)
// ==========================================
function initLoadAnimations() {
    // Fade in Hero Image
    gsap.from('.hero-image-wrapper', {
        y: 50,
        opacity: 0,
        rotation: 5,
        duration: 1.2,
        ease: "power3.out"
    });

    // Stagger Text
    gsap.from('.hero-text > *', {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        delay: 0.2,
        ease: "power2.out"
    });
    
    // Fade in Nav
    gsap.from('.glass-nav', {
        y: -20,
        opacity: 0,
        duration: 1,
        delay: 0.5
    });
}

// ==========================================
// 3. SCROLL ANIMATIONS
// ==========================================
function initScrollAnimations() {
    // Reveal Cards
    gsap.utils.toArray('.glass-card').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 40,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out"
        });
    });

    // Timeline Items
    gsap.utils.toArray('.timeline-item').forEach((item) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 85%"
            },
            opacity: 0,
            y: 20,
            duration: 0.8
        });
    });
}

// ==========================================
// 4. SYNCED VIDEO PLAYER
// ==========================================
function initVideoPlayer() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target.querySelector('video');
            if(!video) return;

            if (entry.isIntersecting) {
                video.play().catch(() => {}); // Catch autoplay preventions
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.6 }); // Play when 60% visible

    const videos = document.querySelectorAll('.video-container');
    videos.forEach(container => observer.observe(container));
}

// ==========================================
// 5. BACK TO TOP
// ==========================================
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if(!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) btn.classList.add('visible');
        else btn.classList.remove('visible');
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// =========================================
// 6. LIGHTBOX FOR FULLSCREEN PLAYBACK
// =========================================
function initUnifiedLightbox() {
    const lightbox = document.getElementById('unifiedLightbox');
    const lbVideo = document.getElementById('lightboxVideo');
    const lbImage = document.getElementById('lightboxImage');
    const closeBtn = document.querySelector('.lightbox-close');

    if (!lightbox || (!lbVideo && !lbImage)) return;

    // 1. SELECT VIDEOS
    document.querySelectorAll('.video-container').forEach(container => {
        container.addEventListener('click', () => {
            const videoElement = container.querySelector('video');
            if (!videoElement) return;
            const source = videoElement.querySelector('source');
            const src = source ? source.src : videoElement.src;

            lbImage.style.display = 'none';
            lbVideo.style.display = 'block';
            lbVideo.src = src;
            lbVideo.muted = false; // Important: Unmute for fullscreen
            openLightbox();
        });
    });

    // 2. SELECT STILLS & GRAPHICS
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const imgElement = item.querySelector('img');
            if (!imgElement) return;

            lbVideo.style.display = 'none';
            lbImage.style.display = 'block';
            lbImage.src = imgElement.src;
            openLightbox();
        });
    });

    function openLightbox() {
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        if (lbVideo) {
            lbVideo.pause();
            lbVideo.src = ""; // Stop video loading in background
            lbVideo.style.display = 'none';
        }
        if (lbImage) {
            lbImage.src = "";
            lbImage.style.display = 'none';
        }
        document.body.style.overflow = '';
    }

    closeBtn && closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    // Close on Escape key
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
}
