// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// YouTube Player Management System
class YouTubePlayerManager {
    constructor() {
        this.players = {}; // Store YouTube player instances
        this.playerStates = {}; // Store player states
        this.pairs = {}; // Store video pairs
        this.isPageVisible = true;
        this.observer = null;
        
        // YouTube API ready handler
        window.onYouTubeIframeAPIReady = () => this.setupPlayers();
        
        // Load YouTube API if not already loaded
        if (typeof YT === 'undefined') {
            console.log('Loading YouTube API...');
            this.loadYouTubeAPI();
        } else {
            this.setupPlayers();
        }
    }
    
    loadYouTubeAPI() {
        // Create script tag for YouTube API
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
    
    setupPlayers() {
        console.log('Setting up YouTube players...');
        
        // Find all video containers
        const videoContainers = document.querySelectorAll('.video-container[data-video-id]');
        
        if (videoContainers.length === 0) {
            console.error('No video containers found');
            return;
        }
        
        // Group by pairs
        videoContainers.forEach(container => {
            const pairId = container.getAttribute('data-pair');
            const videoId = container.getAttribute('data-video-id');
            const playerElement = container.querySelector('.youtube-player');
            
            if (!playerElement) {
                console.error('No youtube-player element found', container);
                return;
            }
            
            const playerId = playerElement.id;
            
            if (!this.pairs[pairId]) {
                this.pairs[pairId] = [];
            }
            
            // Store player info first
            this.playerStates[playerId] = {
                container: container,
                pairId: pairId,
                videoId: videoId,
                isPlaying: false,
                isReady: false,
                player: null
            };
            
            this.pairs[pairId].push(playerId);
            
            // Create YouTube player
            this.createYouTubePlayer(playerId, videoId, pairId, playerElement);
            
            // Add loading indicator
            container.classList.add('loading');
            
            // Add YouTube branding
            const youtubeBrand = document.createElement('div');
            youtubeBrand.className = 'youtube-branding';
            youtubeBrand.innerHTML = '<i class="fab fa-youtube"></i> YouTube';
            container.appendChild(youtubeBrand);
            
            // Add autoplay indicator
            const autoplayBadge = document.createElement('div');
            autoplayBadge.className = 'autoplay-indicator';
            autoplayBadge.innerHTML = '<i class="fas fa-play-circle"></i> Auto-play';
            container.appendChild(autoplayBadge);
        });
        
        // Setup Intersection Observer
        this.setupIntersectionObserver();
        
        // Setup page visibility listener
        this.setupPageVisibility();
        
        // Setup click handlers
        this.setupClickHandlers();
    }
    
    createYouTubePlayer(playerId, videoId, pairId, element) {
        // YouTube player parameters
        const playerVars = {
            'autoplay': 0,
            'mute': 1, // Required for autoplay on most browsers
            'controls': 0, // Hide YouTube controls
            'showinfo': 0,
            'modestbranding': 1,
            'rel': 0,
            'playsinline': 1, // Prevent fullscreen on iOS
            'enablejsapi': 1,
            'origin': window.location.origin,
            'widget_referrer': window.location.href
        };
        
        // Create the player
        this.players[playerId] = new YT.Player(element, {
            videoId: videoId,
            playerVars: playerVars,
            events: {
                'onReady': (event) => this.onPlayerReady(event, playerId, pairId),
                'onStateChange': (event) => this.onPlayerStateChange(event, playerId, pairId),
                'onError': (event) => this.onPlayerError(event, playerId)
            }
        });
    }
    
    onPlayerReady(event, playerId, pairId) {
        console.log(`Player ${playerId} ready`);
        const state = this.playerStates[playerId];
        state.isReady = true;
        state.container.classList.remove('loading');
        
        // Set volume to 0 (muted) for autoplay compliance
        event.target.setVolume(0);
        
        // Add play button overlay for better UX
        this.addPlayOverlay(state.container, pairId);
    }
    
    onPlayerStateChange(event, playerId, pairId) {
        const state = this.playerStates[playerId];
        const playerState = event.data;
        
        // Update playing state
        if (playerState === YT.PlayerState.PLAYING) {
            state.isPlaying = true;
            state.container.classList.add('playing');
            state.container.classList.remove('paused');
        } else if (playerState === YT.PlayerState.PAUSED) {
            state.isPlaying = false;
            state.container.classList.remove('playing');
            state.container.classList.add('paused');
        }
        
        // Update play button icon
        const playButton = state.container.querySelector('.play-pause-btn');
        if (playButton) {
            playButton.innerHTML = state.isPlaying ? 
                '<i class="fas fa-pause"></i>' : 
                '<i class="fas fa-play"></i>';
        }
    }
    
    onPlayerError(event, playerId) {
        console.error(`YouTube player error: ${event.data}`, this.playerStates[playerId]);
        const state = this.playerStates[playerId];
        state.container.classList.remove('loading');
        
        // Show error message
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Video unavailable';
        errorMsg.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            background: rgba(0,0,0,0.7);
            padding: 10px 20px;
            border-radius: 10px;
            z-index: 10;
        `;
        state.container.appendChild(errorMsg);
    }
    
    addPlayOverlay(container, pairId) {
        // Create play overlay
        const overlay = document.createElement('div');
        overlay.className = 'youtube-play-overlay';
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 2;
            cursor: pointer;
            border-radius: 14px;
        `;
        
        const playButton = document.createElement('div');
        playButton.className = 'youtube-play-button';
        playButton.style.cssText = `
            width: 60px;
            height: 60px;
            background: rgba(255, 0, 0, 0.9);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: white;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        `;
        playButton.innerHTML = '<i class="fas fa-play"></i>';
        
        overlay.appendChild(playButton);
        container.appendChild(overlay);
        
        // Add hover effect
        container.addEventListener('mouseenter', () => {
            overlay.style.opacity = '1';
        });
        
        container.addEventListener('mouseleave', () => {
            overlay.style.opacity = '0';
        });
        
        // Click to toggle play/pause
        overlay.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePair(pairId);
        });
    }
    
    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const container = entry.target;
                const pairId = container.getAttribute('data-pair');
                
                if (entry.isIntersecting && this.isPageVisible) {
                    // Play the pair
                    this.playPair(pairId);
                } else {
                    // Pause the pair
                    this.pausePair(pairId);
                }
            });
        }, {
            threshold: 0.7, // Play when 70% visible
            rootMargin: '50px 0px 50px 0px' // Buffer zone
        });
        
        // Observe all video containers
        Object.values(this.playerStates).forEach(state => {
            this.observer.observe(state.container);
        });
    }
    
    setupPageVisibility() {
        document.addEventListener('visibilitychange', () => {
            this.isPageVisible = !document.hidden;
            
            if (this.isPageVisible) {
                // Resume pairs that should be playing
                Object.keys(this.pairs).forEach(pairId => {
                    const editRow = document.querySelector(`.edit-row[data-pair="${pairId}"]`);
                    if (editRow && editRow.classList.contains('playing')) {
                        this.playPair(pairId);
                    }
                });
            } else {
                // Pause all pairs
                Object.keys(this.pairs).forEach(pairId => {
                    this.pausePair(pairId);
                });
            }
        });
    }
    
    setupClickHandlers() {
        // Add click handlers to video containers and play buttons
        Object.values(this.playerStates).forEach(state => {
            const container = state.container;
            const pairId = state.pairId;
            const playButton = container.querySelector('.play-pause-btn');
            
            // Click on container
            container.addEventListener('click', (e) => {
                if (!e.target.closest('.play-pause-btn') && !e.target.closest('.youtube-play-overlay')) {
                    this.togglePair(pairId);
                }
            });
            
            // Click on play button
            if (playButton) {
                playButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.togglePair(pairId);
                });
            }
        });
    }
    
    playPair(pairId) {
        const pair = this.pairs[pairId];
        if (!pair) return;
        
        const editRow = document.querySelector(`.edit-row[data-pair="${pairId}"]`);
        if (!editRow) return;
        
        editRow.classList.add('playing');
        editRow.classList.remove('paused');
        
        // Play all players in the pair
        pair.forEach(playerId => {
            const player = this.players[playerId];
            const state = this.playerStates[playerId];
            
            if (player && state.isReady && !state.isPlaying) {
                try {
                    player.playVideo();
                    state.isPlaying = true;
                    
                    // Update play button icon
                    const playButton = state.container.querySelector('.play-pause-btn');
                    if (playButton) {
                        playButton.innerHTML = '<i class="fas fa-pause"></i>';
                    }
                } catch (error) {
                    console.error('Error playing video:', error);
                }
            }
        });
    }
    
    pausePair(pairId) {
        const pair = this.pairs[pairId];
        if (!pair) return;
        
        const editRow = document.querySelector(`.edit-row[data-pair="${pairId}"]`);
        if (!editRow) return;
        
        editRow.classList.remove('playing');
        editRow.classList.add('paused');
        
        // Pause all players in the pair
        pair.forEach(playerId => {
            const player = this.players[playerId];
            const state = this.playerStates[playerId];
            
            if (player && state.isReady && state.isPlaying) {
                try {
                    player.pauseVideo();
                    state.isPlaying = false;
                    
                    // Update play button icon
                    const playButton = state.container.querySelector('.play-pause-btn');
                    if (playButton) {
                        playButton.innerHTML = '<i class="fas fa-play"></i>';
                    }
                } catch (error) {
                    console.error('Error pausing video:', error);
                }
            }
        });
    }
    
    togglePair(pairId) {
        const editRow = document.querySelector(`.edit-row[data-pair="${pairId}"]`);
        
        if (editRow.classList.contains('playing')) {
            this.pausePair(pairId);
        } else {
            this.playPair(pairId);
        }
    }
    
    // Sync all pairs (in case they get out of sync)
    syncAllPairs() {
        Object.keys(this.pairs).forEach(pairId => {
            const pair = this.pairs[pairId];
            const players = pair.map(id => this.players[id]).filter(p => p);
            
            if (players.length > 1) {
                // Get the current time from the first player
                const firstPlayer = players[0];
                const currentTime = firstPlayer.getCurrentTime();
                
                // Sync all players to the same time
                players.forEach(player => {
                    if (player !== firstPlayer) {
                        player.seekTo(currentTime, true);
                    }
                });
            }
        });
    }
}

// Particle System
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
            this.particles.forEach(particle => {
                particle.x = (particle.x / this.canvas.width) * window.innerWidth;
                particle.y = (particle.y / this.canvas.height) * window.innerHeight;
            });
        });
    }
}

// Navigation and UI Interactions
class NavigationManager {
    constructor() {
        this.nav = document.getElementById('main-nav');
        this.backToTopBtn = document.getElementById('backToTop');
        this.init();
    }
    
    init() {
        // Nav scroll effect
        window.addEventListener('scroll', () => this.handleNavScroll());
        
        // Back to top button
        if (this.backToTopBtn) {
            window.addEventListener('scroll', () => this.handleBackToTop());
            this.backToTopBtn.addEventListener('click', () => this.scrollToTop());
        }
        
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    
                    // Update URL without scrolling
                    history.pushState(null, null, href);
                }
            });
        });
    }
    
    handleNavScroll() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            this.nav.classList.add('is-compact');
            this.nav.classList.remove('is-expanding');
        } else {
            this.nav.classList.remove('is-compact');
            this.nav.classList.add('is-expanding');
        }
    }
    
    handleBackToTop() {
        if (window.scrollY > 300) {
            this.backToTopBtn.classList.add('visible');
        } else {
            this.backToTopBtn.classList.remove('visible');
        }
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    console.log('Anu Visuals - Initializing...');
    
    // Make sure body is visible immediately
    document.body.style.opacity = '1';
    
    // Initialize Particle System
    new ParticleSystem();
    
    // Initialize Navigation
    new NavigationManager();
    
    // Initialize YouTube Player Manager
    window.youtubePlayerManager = new YouTubePlayerManager();
    
    // Add loading spinner for videos
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        .video-container.loading::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255, 255, 255, 0.15);
            border-top-color: var(--blue-light);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            z-index: 3;
        }
        
        .youtube-play-button:hover {
            transform: scale(1) !important;
        }
        
        .youtube-play-overlay {
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .video-container:hover .youtube-play-overlay {
            opacity: 1;
        }
        
        .error-message {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            background: rgba(0,0,0,0.7);
            padding: 10px 20px;
            border-radius: 10px;
            z-index: 10;
            text-align: center;
        }
    `;
    document.head.appendChild(style);
    
    console.log('Anu Visuals - Initialized successfully!');
});

// Fallback in case YouTube API doesn't load
setTimeout(() => {
    if (typeof YT === 'undefined' && !window.youtubePlayerManager) {
        console.warn('YouTube API not loaded, retrying...');
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
}, 3000);
