/**
 * Star Wars themed Birthday Website Script
 * Synthesizes Star Wars ambient hums, lightsber igntions, wind blowing, Confetti canvas,
 * Starfield flight simulator (hyperdrive transitions), and 3D crawl triggers.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIG & STATE ---
    const CONFIG = {
        birthdayDate: new Date('2003-07-29T00:00:00'),
        passcode: '6969',
        slideInterval: 3500
    };

    let audioContext = null;
    let synthInterval = null;
    let isPlayingMusic = false;
    let starfield = null;
    let activeCrawlTimeout1 = null;
    let activeCrawlTimeout2 = null;

    // Auto-sliding carousel handles
    let carouselTimers = { 1: null, 2: null };
    let carouselIndices = { 1: 0, 2: 0 };

    // Romantic quotes in sci-fi style
    const quotes = [
        "Initializing sector scan... happy 23rd rotation, Gim Baby! 🎂",
        "Gim Baby's 23rd Solar Rotation: May the Force be with you, always! 🛰️",
        "Planet Earth Coordinate log: Gim Baby is officially 23 years old today! 🪐",
        "Scanning the Outer Rim... no match found for Gim Baby's greatness! 🌌",
        "Calculating orbital alignment... rotation 23 complete! 💫",
        "Log Update: Gim Baby is the chosen one in this sector! ✨",
        "May our paths through the galaxy remain guided by the Force. ⚓"
    ];

    // --- DOM ELEMENT QUERY SELECTORS ---
    const screens = {
        loading: document.getElementById('loading-screen'),
        lock: document.getElementById('lock-screen'),
        greeting: document.getElementById('greeting-screen'),
        countdown: document.getElementById('countdown-screen'),
        main: document.getElementById('main-screen')
    };

    const elements = {
        loadingProgress: document.getElementById('loading-progress'),
        passwordInput: document.getElementById('password-input'),
        avatarHint: document.getElementById('avatar-hint-trigger'),
        hintModal: document.getElementById('hint-modal'),
        closeHintModal: document.querySelector('.close-modal'),
        closeHintBtn: document.getElementById('close-hint-button'),
        openGiftBtn: document.getElementById('open-gift-btn'),
        countdownNextBtn: document.getElementById('countdown-next-btn'),
        homeQuote: document.getElementById('home-quote-rotator'),
        musicToggle: document.getElementById('music-toggle'),

        // Envelope & Letter
        openLetterSeal: document.getElementById('open-letter-seal'),
        sealLetterBack: document.getElementById('seal-letter-back'),
        envelopeOuter: document.getElementById('envelope-outer'),
        letterSheet: document.getElementById('letter-sheet'),

        // Lightbox
        lightbox: document.getElementById('lightbox'),
        lightboxImg: document.getElementById('lightbox-img'),
        lightboxCaption: document.getElementById('lightbox-caption'),

        // Age tracker
        compYears: document.getElementById('completed-years'),
        compMonths: document.getElementById('completed-months'),
        compDays: document.getElementById('completed-days'),
        compHours: document.getElementById('tracker-hours'),
        compMinutes: document.getElementById('tracker-minutes'),
        compSeconds: document.getElementById('tracker-seconds'),

        // Countdown timer
        cdHours: document.getElementById('clock-hours'),
        cdMinutes: document.getElementById('clock-minutes'),
        cdSeconds: document.getElementById('clock-seconds'),
        cdHeading: document.getElementById('countdown-heading'),

        // Memories tabs
        galTab1: document.getElementById('gal-tab-1'),
        galTab2: document.getElementById('gal-tab-2'),
        galContainer1: document.getElementById('gallery-container-1'),
        galContainer2: document.getElementById('gallery-container-2'),

        // Cake
        candlesWrapper: document.getElementById('candles-wrapper'),
        blowCandlesBtn: document.getElementById('blow-candles-btn'),
        rekindleCandlesBtn: document.getElementById('rekindle-candles-btn'),
        wishOutcomeBanner: document.getElementById('wish-outcome-banner')
    };

    // --- SCREEN NAVIGATION CONTROLLER ---
    function navigateTo(targetScreenId) {
        Object.keys(screens).forEach(screenName => {
            const screen = screens[screenName];
            if (screen.id === targetScreenId) {
                screen.classList.remove('hidden-screen');
                screen.classList.add('active-screen');
            } else {
                screen.classList.remove('active-screen');
                screen.classList.add('hidden-screen');
            }
        });

        // Toggle focus state
        if (targetScreenId === 'lock-screen') {
            setTimeout(() => {
                elements.passwordInput.focus();
            }, 800);
        } else {
            elements.passwordInput.blur();
        }

        // Carousel activation
        if (targetScreenId === 'main-screen') {
            startCarousel(1);
            stopCarousel(2);
        } else {
            stopCarousel(1);
            stopCarousel(2);
        }

        // Warp hyperdrive triggers
        if (targetScreenId === 'greeting-screen' || targetScreenId === 'main-screen') {
            if (starfield) starfield.setWarp(true);
            setTimeout(() => {
                if (starfield) starfield.setWarp(false);
            }, 2500);
        }
    }

    // --- 1. SIMULATE LOADING BAR ---
    function runFakeLoadingBar() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 15) + 3;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                elements.loadingProgress.style.width = '100%';
                setTimeout(() => {
                    navigateTo('lock-screen');
                }, 500);
            } else {
                elements.loadingProgress.style.width = `${progress}%`;
            }
        }, 80);
    }
    runFakeLoadingBar();

    // --- 2. RETRIEVE LOCK SCREEN PIN ---
    elements.avatarHint.addEventListener('click', () => {
        elements.hintModal.classList.add('active-modal');
        playTone(523, 'sine', 0.1, 0.05); // High beep
    });

    const closeModal = () => elements.hintModal.classList.remove('active-modal');
    elements.closeHintModal.addEventListener('click', closeModal);
    elements.closeHintBtn.addEventListener('click', closeModal);
    elements.hintModal.addEventListener('click', (e) => {
        if (e.target === elements.hintModal) closeModal();
    });

    elements.passwordInput.addEventListener('input', (e) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        elements.passwordInput.value = val;

        if (val.length === 4) {
            verifyPassword(val);
        }
    });

    function verifyPassword(enteredCode) {
        if (enteredCode === CONFIG.passcode) {
            initAudioContext();
            playLightsaberIgnition();
            setTimeout(() => {
                navigateTo('greeting-screen');
                triggerStarWarsCrawl();
            }, 600);
        } else {
            // Bad code feedback
            playVaderBreathErr();
            const lockCabinet = document.querySelector('.keypad-cabinet');
            lockCabinet.classList.add('shake-card');
            elements.passwordInput.classList.add('incorrect-flash');

            setTimeout(() => {
                lockCabinet.classList.remove('shake-card');
                elements.passwordInput.classList.remove('incorrect-flash');
                elements.passwordInput.value = '';
            }, 600);
        }
    }

    // --- 3. STAR WARS 3D INTRO CRAWL SEQUENCE ---
    function triggerStarWarsCrawl() {
        const blueText = document.getElementById('blue-intro-text');
        const crawlView = document.getElementById('crawl-viewport');
        const crawlContent = document.getElementById('crawl-content');
        const skipBtn = elements.openGiftBtn;

        // Reset crawl anim classes
        blueText.style.opacity = '1';
        crawlView.classList.remove('animate-viewport');
        crawlContent.classList.remove('crawl-active');
        skipBtn.classList.add('hidden-element');
        skipBtn.classList.remove('show-btn');

        // Step A: Show blue introduction "23 years ago..." (fade out happens via CSS keyframe)
        activeCrawlTimeout1 = setTimeout(() => {
            blueText.style.opacity = '0';

            // Step B: Set active 3D scroll crawl viewport
            crawlView.classList.add('animate-viewport');
            crawlContent.classList.add('crawl-active');

            // Play ambient theme chord
            playStarWarsChords();

            // Step C: Display coordinates skip button after 5.5 seconds
            activeCrawlTimeout2 = setTimeout(() => {
                skipBtn.classList.remove('hidden-element');
                // Force layout flush helper
                skipBtn.offsetHeight;
                skipBtn.classList.add('show-btn');
            }, 5500);

        }, 5000); // Intro show duration
    }

    elements.openGiftBtn.addEventListener('click', () => {
        // Clear timeouts if clicked prematurely
        if (activeCrawlTimeout1) clearTimeout(activeCrawlTimeout1);
        if (activeCrawlTimeout2) clearTimeout(activeCrawlTimeout2);

        playTone(587, 'sine', 0.15, 0.08); // Blip
        navigateTo('countdown-screen');
    });

    // --- 4. COUNT-UP AGE & BIRTHDAY COUNTDOWNS ---
    elements.countdownNextBtn.addEventListener('click', () => {
        playTone(659, 'sine', 0.2, 0.08);
        navigateTo('main-screen');
        startQuoteRotator();
        setupCakeCelebration(); // Initialize candle structures
    });

    function updateAgeCalculators() {
        const now = new Date();

        // Age delta calculations
        let years = now.getFullYear() - CONFIG.birthdayDate.getFullYear();
        let months = now.getMonth() - CONFIG.birthdayDate.getMonth();
        let days = now.getDate() - CONFIG.birthdayDate.getDate();

        if (days < 0) {
            const prevMonthDate = new Date(now.getFullYear(), now.getMonth(), 0);
            days += prevMonthDate.getDate();
            months--;
        }
        if (months < 0) {
            months += 12;
            years--;
        }

        elements.compYears.textContent = years;
        elements.compMonths.textContent = months;
        elements.compDays.textContent = days;

        elements.compHours.textContent = String(now.getHours()).padStart(2, '0');
        elements.compMinutes.textContent = String(now.getMinutes()).padStart(2, '0');
        elements.compSeconds.textContent = String(now.getSeconds()).padStart(2, '0');

        // B. Ticking Countdown target
        let nextBirthday = new Date(now.getFullYear(), CONFIG.birthdayDate.getMonth(), CONFIG.birthdayDate.getDate());
        if (now > nextBirthday) {
            nextBirthday.setFullYear(now.getFullYear() + 1);
        }

        const delta = Math.floor((nextBirthday - now) / 1000);

        if (delta <= 0) {
            elements.cdHeading.innerHTML = "🎉 TODAY GIM BABY WAS BORN! MAY THE FORCE BE WITH YOU! ❤️🚀";
            elements.cdHours.textContent = "00";
            elements.cdMinutes.textContent = "00";
            elements.cdSeconds.textContent = "00";
        } else {
            elements.cdHeading.textContent = `Counting down to orbital alignment (Rotation ${years + 1})...`;
            const hours = Math.floor(delta / 3600);
            const mins = Math.floor((delta % 3600) / 60);
            const secs = delta % 60;

            elements.cdHours.textContent = String(hours).padStart(2, '0');
            elements.cdMinutes.textContent = String(mins).padStart(2, '0');
            elements.cdSeconds.textContent = String(secs).padStart(2, '0');
        }

        const homeAgeBrief = document.getElementById('home-age-brief');
        if (homeAgeBrief) {
            homeAgeBrief.textContent = `${years} Rotations`;
        }
    }

    setInterval(updateAgeCalculators, 1000);
    updateAgeCalculators();

    // --- 5. TAB NAVIGATION SYSTEM ---
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const dest = item.getAttribute('data-tab');
            switchTab(dest);
        });
    });

    window.switchTab = function (tabName) {
        navItems.forEach(ni => {
            if (ni.getAttribute('data-tab') === tabName) {
                ni.classList.add('active-nav-item');
            } else {
                ni.classList.remove('active-nav-item');
            }
        });

        const panels = document.querySelectorAll('.tab-panel');
        panels.forEach(p => {
            if (p.id === `tab-${tabName}`) {
                p.classList.remove('hidden-panel');
                p.classList.add('active-panel');
            } else {
                p.classList.remove('active-panel');
                p.classList.add('hidden-panel');
            }
        });

        // Humming tab sweep sounds
        playLightsaberHumShort();

        // Autoplay carousel control boundaries
        if (tabName === 'memories') {
            const activeGalId = elements.galContainer1.classList.contains('active-gallery') ? 1 : 2;
            startCarousel(activeGalId);
            stopCarousel(activeGalId === 1 ? 2 : 1);
        } else {
            stopCarousel(1);
            stopCarousel(2);
        }
    };

    // --- 5A. QUOTE ROTATOR ---
    let quoteIndex = 0;
    let quoteTimer = null;
    function startQuoteRotator() {
        if (quoteTimer) clearInterval(quoteTimer);
        quoteTimer = setInterval(() => {
            elements.homeQuote.style.opacity = '0';
            setTimeout(() => {
                quoteIndex = (quoteIndex + 1) % quotes.length;
                elements.homeQuote.textContent = quotes[quoteIndex];
                elements.homeQuote.style.opacity = '1';
                spawnFloatingStarDust();
            }, 300);
        }, 5500);
    }

    function spawnFloatingStarDust() {
        const wrap = elements.homeQuote.parentElement;
        if (!wrap) return;
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const star = document.createElement('span');
                star.className = 'floating-star-dust';
                star.style.width = '3px';
                star.style.height = '3px';
                star.style.left = `${Math.random() * 80 + 10}%`;
                star.style.top = '80%';
                star.style.boxShadow = '0 0 5px #fff';
                wrap.appendChild(star);

                // Animate rising stars
                star.animate([
                    { transform: 'translateY(0) scale(0)', opacity: 0 },
                    { opacity: 0.8, offset: 0.1 },
                    { transform: 'translateY(-100px) scale(1.5)', opacity: 0 }
                ], { duration: 3000, easing: 'ease-out', fill: 'forwards' });

                setTimeout(() => star.remove(), 3200);
            }, i * 300);
        }
    }

    // --- 5B. AUTO-SLIDING GALLERY CAROUSELS ---
    elements.galTab1.addEventListener('click', () => {
        elements.galTab1.classList.add('active-gallery-tab');
        elements.galTab2.classList.remove('active-gallery-tab');

        elements.galContainer1.classList.remove('hidden-gallery');
        elements.galContainer1.classList.add('active-gallery');
        elements.galContainer2.classList.add('hidden-gallery');
        elements.galContainer2.classList.remove('active-gallery');

        startCarousel(1);
        stopCarousel(2);
        playTone(392, 'triangle', 0.08, 0.04);
    });

    elements.galTab2.addEventListener('click', () => {
        elements.galTab2.classList.add('active-gallery-tab');
        elements.galTab1.classList.remove('active-gallery-tab');

        elements.galContainer2.classList.remove('hidden-gallery');
        elements.galContainer2.classList.add('active-gallery');
        elements.galContainer1.classList.add('hidden-gallery');
        elements.galContainer1.classList.remove('active-gallery');

        startCarousel(2);
        stopCarousel(1);
        playTone(440, 'triangle', 0.08, 0.04);
    });

    function showSlide(carouselId, index) {
        const track = document.getElementById(`carousel-inner-${carouselId}`);
        const slides = track.querySelectorAll('.carousel-item');
        const dots = document.querySelectorAll(`#indicators-${carouselId} .indicator-dot`);

        if (index >= slides.length) {
            carouselIndices[carouselId] = 0;
        } else if (index < 0) {
            carouselIndices[carouselId] = slides.length - 1;
        } else {
            carouselIndices[carouselId] = index;
        }

        const currActive = carouselIndices[carouselId];

        slides.forEach((slide, idx) => {
            if (idx === currActive) {
                slide.classList.add('active-slide');
            } else {
                slide.classList.remove('active-slide');
            }
        });

        dots.forEach((dot, idx) => {
            if (idx === currActive) {
                dot.classList.add('active-dot');
            } else {
                dot.classList.remove('active-dot');
            }
        });
    }

    function initCarouselBinds(carouselId) {
        const next = document.getElementById(`next-btn-${carouselId}`);
        const prev = document.getElementById(`prev-btn-${carouselId}`);
        const dots = document.querySelectorAll(`#indicators-${carouselId} .indicator-dot`);

        next.addEventListener('click', (e) => {
            e.stopPropagation();
            resetAutoplay(carouselId);
            showSlide(carouselId, carouselIndices[carouselId] + 1);
            playTone(350, 'sine', 0.06, 0.02);
        });

        prev.addEventListener('click', (e) => {
            e.stopPropagation();
            resetAutoplay(carouselId);
            showSlide(carouselId, carouselIndices[carouselId] - 1);
            playTone(350, 'sine', 0.06, 0.02);
        });

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                const tid = parseInt(dot.getAttribute('data-slide'));
                resetAutoplay(carouselId);
                showSlide(carouselId, tid);
                playTone(350, 'sine', 0.06, 0.02);
            });
        });
    }

    initCarouselBinds(1);
    initCarouselBinds(2);

    function startCarousel(carouselId) {
        stopCarousel(carouselId);
        carouselTimers[carouselId] = setInterval(() => {
            showSlide(carouselId, carouselIndices[carouselId] + 1);
        }, CONFIG.slideInterval);
    }

    function stopCarousel(carouselId) {
        if (carouselTimers[carouselId]) {
            clearInterval(carouselTimers[carouselId]);
            carouselTimers[carouselId] = null;
        }
    }

    function resetAutoplay(carouselId) {
        stopCarousel(carouselId);
        startCarousel(carouselId);
    }

    // --- LIGHTBOX CONTROLS ---
    window.openLightbox = function (src, cap) {
        elements.lightboxImg.src = src;
        elements.lightboxCaption.textContent = cap;
        elements.lightbox.classList.add('active-lightbox');
    };

    window.closeLightbox = function () {
        elements.lightbox.classList.remove('active-lightbox');
    }

    // --- 5C. EXCLUSIVE CELEBRATION TAB (Cake candle blow action) ---
    let candlesBlownCount = 0;

    function setupCakeCelebration() {
        elements.candlesWrapper.innerHTML = '';
        candlesBlownCount = 0;
        elements.wishOutcomeBanner.classList.add('hidden-message');
        elements.rekindleCandlesBtn.classList.add('hidden-element');
        elements.blowCandlesBtn.classList.remove('hidden-element');

        const topCreamLayerWidth = 130;
        const topCreamLayerHeight = 20;
        const saberClasses = ['saber-blue', 'saber-red', 'saber-green', 'saber-yellow'];

        // Render 23 distinct glowing candles inside the top cream layer boundaries
        for (let i = 0; i < 23; i++) {
            const candle = document.createElement('div');
            const saberColor = saberClasses[i % saberClasses.length];
            candle.className = `candle ${saberColor}`;
            candle.id = `candle-${i}`;

            // Distribute randomly across the top cream ellipse coordinates
            // Ellipse parametric coordinates: x = a * cos(t), y = b * sin(t)
            const angle = Math.random() * Math.PI * 2;
            const radiusScale = Math.random() * 0.7; // Keep slightly inner
            const posX = (topCreamLayerWidth / 2) + (topCreamLayerWidth / 2 * radiusScale * Math.cos(angle)) - 2;
            const posY = (topCreamLayerHeight / 2) + (topCreamLayerHeight / 2 * radiusScale * Math.sin(angle)) - 24;

            candle.style.left = `${posX}px`;
            candle.style.top = `${posY}px`;

            // Taller candles for lightsaber hilt base design
            candle.style.height = `${18 + Math.floor(Math.random() * 4)}px`;

            elements.candlesWrapper.appendChild(candle);
        }
    }

    elements.blowCandlesBtn.addEventListener('click', () => {
        elements.blowCandlesBtn.classList.add('hidden-element');

        // 1. Play blowing wind noise synth
        playCandleBlowWindNoise();

        // 2. Extinguish all candles with a nice sequential sweep animation
        const candles = document.querySelectorAll('.candle');
        candles.forEach((c, idx) => {
            setTimeout(() => {
                c.classList.add('blown');
                playTone(400 + (idx * 15), 'sine', 0.05, 0.015); // soft pop chime
            }, idx * 60);
        });

        // 3. Complete blow sequence
        setTimeout(() => {
            // Show outcome banner
            elements.wishOutcomeBanner.classList.remove('hidden-message');

            // Confetti burst explosion!
            triggerVividConfettiBurst();

            // Play celebratory triumphant chords
            playTriumphantMelodyScale();

            // Show Rekindle option button
            elements.rekindleCandlesBtn.classList.remove('hidden-element');
        }, candles.length * 60 + 200);
    });

    elements.rekindleCandlesBtn.addEventListener('click', () => {
        playTone(650, 'triangle', 0.1, 0.04);
        setupCakeCelebration();
    });

    // Confetti physics canvas simulator
    function triggerVividConfettiBurst() {
        const duration = 4000;
        const animationEnd = Date.now() + duration;
        const confettiParticles = [];
        const canvas = elements.wishOutcomeBanner.parentElement.appendChild(document.createElement('canvas'));

        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '500';

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const colors = ['#ffe81f', '#00f0ff', '#ff1e42', '#ffffff', '#e3a857'];

        // Spawn confetti sets
        for (let i = 0; i < 110; i++) {
            confettiParticles.push({
                x: canvas.width / 2,
                y: canvas.height * 0.7,
                vx: (Math.random() - 0.5) * 18,
                vy: -Math.random() * 15 - 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 4,
                rotation: Math.random() * 360,
                rSpeed: (Math.random() - 0.5) * 10
            });
        }

        function frame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            confettiParticles.forEach((p, idx) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.38; // gravity
                p.vx *= 0.98; // drag
                p.rotation += p.rSpeed;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            });

            if (Date.now() < animationEnd) {
                requestAnimationFrame(frame);
            } else {
                canvas.remove();
            }
        }
        frame();
    }

    // --- 5D. PHYSICAL ENVELOPE SEALS ---
    elements.openLetterSeal.addEventListener('click', () => {
        elements.openLetterSeal.style.pointerEvents = 'none';
        playLightsaberIgnition();

        const flap = document.querySelector('.envelope-flap');
        flap.style.transform = 'rotateX(180deg)';
        flap.style.zIndex = '9';

        setTimeout(() => {
            elements.envelopeOuter.classList.add('fade-envelope');
            setTimeout(() => {
                elements.envelopeOuter.style.display = 'none';
                elements.letterSheet.style.display = 'block';

                elements.letterSheet.offsetHeight; // force recalculate layout
                elements.letterSheet.classList.remove('hidden-sheet');
                elements.letterSheet.classList.add('active-sheet');
            }, 600);
        }, 800);
    });

    elements.sealLetterBack.addEventListener('click', () => {
        elements.letterSheet.classList.remove('active-sheet');
        elements.letterSheet.classList.add('hidden-sheet');
        playTone(392, 'sine', 0.1, 0.05);

        setTimeout(() => {
            elements.letterSheet.style.display = 'none';
            elements.envelopeOuter.style.display = 'flex';
            elements.envelopeOuter.offsetHeight;
            elements.envelopeOuter.classList.remove('fade-envelope');

            const flap = document.querySelector('.envelope-flap');
            flap.style.transform = 'rotateX(0deg)';
            flap.style.zIndex = '12';
            elements.openLetterSeal.style.pointerEvents = 'all';
        }, 800);
    });


    // --- WEB AUDIO SYNTH MUSIC PROCEDURAL CONSOLE ---
    function initAudioContext() {
        if (audioContext) return;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            audioContext = new AudioContextClass();
        }
    }

    elements.musicToggle.addEventListener('click', () => {
        if (!audioContext) initAudioContext();
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }

        if (isPlayingMusic) {
            stopAmbience();
        } else {
            startAmbience();
        }
    });

    function playTone(freq, type = 'sine', duration = 0.3, volume = 0.1) {
        if (!audioContext) return;
        try {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);

            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioContext.currentTime);

            gain.gain.setValueAtTime(volume, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

            osc.start();
            osc.stop(audioContext.currentTime + duration);
        } catch (e) { }
    }

    function playLightsaberIgnition() {
        if (!audioContext) return;
        try {
            // Rising sawtooth sweep for lightsaber ignite
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(80, audioContext.currentTime);
            osc.frequency.exponentialRampToValueAtTime(320, audioContext.currentTime + 0.45);

            gain.gain.setValueAtTime(0.001, audioContext.currentTime);
            gain.gain.linearRampToValueAtTime(0.07, audioContext.currentTime + 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);

            osc.start();
            osc.stop(audioContext.currentTime + 0.5);
        } catch (err) { }
    }

    function playLightsaberHumShort() {
        if (!audioContext) return;
        try {
            // Detuned low frequency hum oscillation
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(100, audioContext.currentTime);
            osc.frequency.linearRampToValueAtTime(70, audioContext.currentTime + 0.3);

            gain.gain.setValueAtTime(0.06, audioContext.currentTime);
            gain.gain.linearRampToValueAtTime(0.001, audioContext.currentTime + 0.3);

            osc.start();
            osc.stop(audioContext.currentTime + 0.3);
        } catch (e) { }
    }

    function playVaderBreathErr() {
        if (!audioContext) return;
        try {
            // Low filters noise simulation for errors
            const bufferSize = audioContext.sampleRate * 0.4;
            const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = audioContext.createBufferSource();
            noise.buffer = buffer;

            const filter = audioContext.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(120, audioContext.currentTime);

            const gain = audioContext.createGain();
            gain.gain.setValueAtTime(0.12, audioContext.currentTime);
            gain.gain.linearRampToValueAtTime(0.001, audioContext.currentTime + 0.4);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(audioContext.destination);

            noise.start();
        } catch (err) { }
    }

    function playStarWarsChords() {
        if (!audioContext) return;
        try {
            // Space minor brass synth chord (G-minor)
            const chords = [196.00, 233.08, 293.66, 392.00];
            chords.forEach(freq => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);

                osc.type = 'triangle';
                osc.frequency.value = freq;

                gain.gain.setValueAtTime(0.001, audioContext.currentTime);
                gain.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 1.2);
                gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 4.8);

                osc.start();
                osc.stop(audioContext.currentTime + 4.9);
            });
        } catch (e) { }
    }


    // Procedural Ambient Star Wars Main Theme Music Player
    // Synthesizes the famous melody: G3(392) -> D4(293) -> C4(261) -> B3(246) -> A3(220) -> G4(783) -> D4(293)
    const melodySeq = [
        { f: 196.00, d: 450 }, // G3
        { f: 293.66, d: 450 }, // D4
        { f: 261.63, d: 150 }, // C4
        { f: 246.94, d: 150 }, // B3
        { f: 220.00, d: 150 }, // A3
        { f: 392.00, d: 450 }, // G4 (High)
        { f: 293.66, d: 350 }, // D4

        { f: 261.63, d: 150 }, // C4
        { f: 246.94, d: 150 }, // B3
        { f: 220.00, d: 150 }, // A3
        { f: 392.00, d: 450 }, // G4 (High)
        { f: 293.66, d: 350 }, // D4

        { f: 261.63, d: 150 }, // C4
        { f: 246.94, d: 150 }, // B3
        { f: 261.63, d: 150 }, // C4
        { f: 220.00, d: 400 }  // A3
    ];

    let melodyStep = 0;

    function startAmbience() {
        isPlayingMusic = true;
        elements.musicToggle.classList.add('playing');

        runSequencerLoop();
    }

    function runSequencerLoop() {
        if (!isPlayingMusic || !audioContext) return;

        const note = melodySeq[melodyStep];
        playTone(note.f, 'sine', note.d / 1000 + 0.6, 0.05);

        synthInterval = setTimeout(() => {
            melodyStep = (melodyStep + 1) % melodySeq.length;
            runSequencerLoop();
        }, note.d + 350); // Pause duration between note steps
    }

    function stopAmbience() {
        isPlayingMusic = false;
        elements.musicToggle.classList.remove('playing');
        if (synthInterval) {
            clearTimeout(synthInterval);
            synthInterval = null;
        }
    }


    // --- 3D SPACE FLIGHT STARFIELD ENGINE ---
    class StarfieldCanvas {
        constructor() {
            this.canvas = document.getElementById('particle-canvas');
            this.ctx = this.canvas.getContext('2d');
            this.stars = [];
            this.count = 200;
            this.warpMode = false;

            this.resize();
            window.addEventListener('resize', () => this.resize());

            for (let i = 0; i < this.count; i++) {
                this.stars.push(this.newStar(true));
            }

            this.render();
        }

        resize() {
            this.width = this.canvas.width = window.innerWidth;
            this.height = this.canvas.height = window.innerHeight;
            this.centerX = this.width / 2;
            this.centerY = this.height / 2;
        }

        newStar(randomZ = false) {
            return {
                x: (Math.random() - 0.5) * this.width,
                y: (Math.random() - 0.5) * this.height,
                z: randomZ ? Math.random() * this.width : this.width,
                color: Math.random() > 0.85 ? '#ffe81f' : '#ffffff' // Blend some Star Wars yellows
            };
        }

        setWarp(on) {
            this.warpMode = on;
        }

        render() {
            // When warping, clear with a trailing alpha mask to create star streak paths
            if (this.warpMode) {
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
                this.ctx.fillRect(0, 0, this.width, this.height);
            } else {
                this.ctx.clearRect(0, 0, this.width, this.height);
            }

            this.stars.forEach((s, idx) => {
                const prevZ = s.z;
                s.z -= this.warpMode ? 28 : 1.2;

                if (s.z <= 0) {
                    this.stars[idx] = this.newStar(false);
                    return;
                }

                // 3D coordinate projection
                const k = 120 / s.z;
                const px = s.x * k + this.centerX;
                const py = s.y * k + this.centerY;

                if (px < 0 || px > this.width || py < 0 || py > this.height) {
                    this.stars[idx] = this.newStar(false);
                    return;
                }

                const size = (1 - s.z / this.width) * 3;
                const opacity = (1 - s.z / this.width) * 0.95;

                this.ctx.beginPath();
                if (this.warpMode) {
                    // Draw velocity line lines instead of dots
                    const pkPrev = 120 / prevZ;
                    const pxx = s.x * pkPrev + this.centerX;
                    const pyy = s.y * pkPrev + this.centerY;
                    this.ctx.strokeStyle = s.color;
                    this.ctx.lineWidth = size * 0.7;
                    this.ctx.lineCap = 'round';
                    this.ctx.moveTo(px, py);
                    this.ctx.lineTo(pxx, pyy);
                    this.ctx.stroke();
                } else {
                    this.ctx.fillStyle = s.color;
                    this.ctx.globalAlpha = opacity;
                    this.ctx.arc(px, py, size, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            });

            requestAnimationFrame(() => this.render());
        }
    }

    starfield = new StarfieldCanvas();

    // Sound effects for wind blowing
    function playCandleBlowWindNoise() {
        if (!audioContext) return;
        try {
            // White noise buffer for blowing wind
            const bufferSize = audioContext.sampleRate * 0.8;
            const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = audioContext.createBufferSource();
            noise.buffer = buffer;

            const filter = audioContext.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(600, audioContext.currentTime);
            filter.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.8);

            const gain = audioContext.createGain();
            gain.gain.setValueAtTime(0.15, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.8);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(audioContext.destination);

            noise.start();
        } catch (err) { }
    }

    function playTriumphantMelodyScale() {
        if (!audioContext) return;
        try {
            // celebratory major arpeggio
            const arpeggio = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
            arpeggio.forEach((freq, idx) => {
                setTimeout(() => {
                    playTone(freq, 'sine', 0.8, 0.08);
                }, idx * 100);
            });
        } catch (err) { }
    }
});
