// DYNAMIC RELATIONSHIP TIMER
const ANNIVERSARY_START = new Date("2026-01-04T00:00:00+05:30"); // 6 months ago from July 4th, 2026

function updateCounter() {
    const now = new Date();
    const diffMs = now - ANNIVERSARY_START;
    
    // Calculations
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    const millis = Math.floor(diffMs % 1000);
    
    // Formatting with leading zeros
    document.getElementById('countDays').innerText = String(days).padStart(2, '0');
    document.getElementById('countHours').innerText = String(hours).padStart(2, '0');
    document.getElementById('countMinutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('countSeconds').innerText = String(seconds).padStart(2, '0');
    document.getElementById('countMillis').innerText = '.' + String(millis).padStart(3, '0');
}

// =============================================
// CURSOR TRAIL OF HEARTS
// =============================================
const trailSymbols = ['❤️', '💕', '✨', '💖', '🌸', '💝'];
let lastTrailTime = 0;

document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTrailTime < 80) return; // throttle to ~12fps
    lastTrailTime = now;

    const el = document.createElement('div');
    el.classList.add('cursor-heart');
    el.textContent = trailSymbols[Math.floor(Math.random() * trailSymbols.length)];
    el.style.left = e.clientX + 'px';
    el.style.top = e.clientY + 'px';
    el.style.fontSize = (0.7 + Math.random() * 0.6) + 'rem';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 800);
});


// WEB AUDIO SYNTHESIZER FOR SOUND EFFECTS & AMBIENT CHORDS
class CuteAudioEngine {
    constructor() {
        this.ctx = null;
        this.isPlayingAmbient = false;
        this.ambientInterval = null;
        this.synthVolume = 0.15;
    }
    
    init() {
        if (this.ctx) return;
        // Setup AudioContext
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContextClass();
    }
    
    // Synthesize a bell chime
    playBell(frequency, duration = 1.5, type = 'sine') {
        this.init();
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
        
        // Bell physics: quick attack, long exponential decay
        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(this.synthVolume, this.ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }
    
    // Play a sweet arpeggio chord (e.g. C Major 7 or F Major 7)
    playChimeSwoop() {
        const notes = [261.63, 329.63, 392.00, 493.88, 523.25]; // C4, E4, G4, B4, C5
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playBell(freq, 1.2, 'sine');
            }, idx * 100);
        });
    }

    // Play a cute pop sound for flowers/jar clicks
    playPop() {
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.15);
        
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.16);
    }
    
    // Soft procedural ambient looping
    startAmbient() {
        this.isPlayingAmbient = true;
        this.playAmbientChord();
        
        // Loop every 5 seconds
        this.ambientInterval = setInterval(() => {
            if (this.isPlayingAmbient) {
                this.playAmbientChord();
            }
        }, 5500);
    }
    
    stopAmbient() {
        this.isPlayingAmbient = false;
        if (this.ambientInterval) clearInterval(this.ambientInterval);
    }
    
    playAmbientChord() {
        // Soft romantic chord progressions:
        // Cmaj7 -> Am9 -> Fmaj9 -> G7sus4
        const progressions = [
            [130.81, 196.00, 261.63, 329.63, 493.88], // C major 7 chord
            [110.00, 196.00, 261.63, 329.63, 440.00], // A minor 7/9
            [87.31,  174.61, 261.63, 349.23, 440.00], // F major 7
            [98.00,  196.00, 293.66, 349.23, 392.00]  // G7
        ];
        
        const randomChord = progressions[Math.floor(Math.random() * progressions.length)];
        
        // Play each note slowly in sequence (soft arpeggio strum)
        randomChord.forEach((freq, index) => {
            const timeOffset = index * 300;
            setTimeout(() => {
                if (!this.isPlayingAmbient) return;
                this.init();
                
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                
                osc.type = 'triangle'; // Soft flute/organ-like wave
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
                
                // Super slow attack and release for padding
                gain.gain.setValueAtTime(0, this.ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 1.5);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 4.5);
                
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                
                osc.start();
                osc.stop(this.ctx.currentTime + 4.6);
            }, timeOffset);
        });
    }
}

const audio = new CuteAudioEngine();

// ENVELOPE / ENTRANCE ANIMATION
document.getElementById('waxSeal').addEventListener('click', () => {
    const envelope = document.getElementById('envelope');
    
    // Add opening classes to trigger CSS transitions
    envelope.classList.add('open');
    audio.playChimeSwoop();
    
    // GSAP Sequence to transition layout
    setTimeout(() => {
        gsap.to('#envelopeOverlay', {
            opacity: 0,
            duration: 1.2,
            ease: "power2.out",
            onComplete: () => {
                document.getElementById('envelopeOverlay').style.display = 'none';
                revealMainSite();
            }
        });
    }, 1300);
});

function revealMainSite() {
    const main = document.getElementById('mainContainer');
    main.classList.add('visible');
    
    // Start ticking counter
    setInterval(updateCounter, 33);
    
    // Spotify widget handles background music
    
    // GSAP ScrollTrigger setups for each section fading/sliding in
    gsap.utils.toArray('.animate-txt').forEach((elem) => {
        gsap.fromTo(elem, 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: "power2.out", scrollTrigger: {
                trigger: elem,
                start: "top 85%"
            }}
        );
    });
    
    // Timeline polaroid reveal
    gsap.utils.toArray('.timeline-item').forEach((item) => {
        gsap.fromTo(item, 
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", scrollTrigger: {
                trigger: item,
                start: "top 80%",
                onEnter: () => item.classList.add('visible')
            }}
        );
    });

    // Hero left (photo) entrance — slide in from left
    gsap.fromTo('.hero-left',
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 1.2, delay: 0.3, ease: "power3.out" }
    );

    // Hero right (title etc) entrance — slide in from right
    gsap.fromTo('.hero-right',
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 1.2, delay: 0.5, ease: "power3.out" }
    );

    // Tags pop in one by one
    gsap.utils.toArray('.couple-tag').forEach((tag, i) => {
        gsap.fromTo(tag,
            { opacity: 0, y: 15, scale: 0.85 },
            { opacity: 1, y: 0, scale: 1, duration: 0.4, delay: 0.8 + i * 0.1, ease: "back.out(1.7)" }
        );
    });
}

// Spotify widget manages audio playback natively.

// =============================================
// SPOTIFY MINIMIZE TOGGLE
// =============================================
document.getElementById('spotifyMinimize').addEventListener('click', () => {
    const widget = document.getElementById('spotifyWidget');
    const btn = document.getElementById('spotifyMinimize');
    widget.classList.toggle('minimized');
    btn.textContent = widget.classList.contains('minimized') ? '⌃' : '⌄';
});

// =============================================
// PHOTO LIGHTBOX
// =============================================
const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.polaroid-clickable').forEach(el => {
    el.addEventListener('click', () => {
        // Support both a wrapper div (data-* on div) and a direct img (data-* on img)
        const src = el.getAttribute('data-src') || el.src;
        const caption = el.getAttribute('data-caption') || el.alt || '';
        lightboxImg.src = src;
        lightboxImg.alt = caption;
        lightboxCaption.textContent = caption;
        lightboxOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) closeLightbox();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

function closeLightbox() {
    lightboxOverlay.classList.remove('active');
    document.body.style.overflow = '';
}


// REASONS CARD FLIPPING AND 3D TILT EFFECT
const loveCards = document.querySelectorAll('.love-card');

loveCards.forEach(card => {
    // Click to flip
    card.addEventListener('click', (e) => {
        card.classList.toggle('flipped');
        audio.playPop();
    });
    
    // 3D Tilt effect
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position inside element
        const y = e.clientY - rect.top;  // y position inside element
        
        // Calculate tilt
        const xRot = -((y - rect.height / 2) / (rect.height / 2)) * 12; // tilt max 12 deg
        const yRot = ((x - rect.width / 2) / (rect.width / 2)) * 12;
        
        card.style.transform = `rotateX(${xRot}deg) rotateY(${yRot}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
});

// FLOWER BOUQUET BUILDER
const flowerBtns = document.querySelectorAll('.flower-btn');
const bouquetContainer = document.getElementById('bouquetContainer');
const ribbonOverlay = document.getElementById('ribbonOverlay');

const flowerEmojis = {
    'red-rose': '🌹',
    'pink-tulip': '🌷',
    'sunflower': '🌻',
    'daisy': '🌼',
    'lavender': '🌾'
};

let flowerCount = 0;

flowerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (flowerCount >= 22) return; // Limit flowers inside vase
        
        const flowerType = btn.getAttribute('data-flower');
        const emoji = flowerEmojis[flowerType];
        
        // Create element
        const flowerEl = document.createElement('div');
        flowerEl.classList.add('spawned-flower');
        flowerEl.innerHTML = emoji;
        
        // Random placement inside the vase throat/mouth
        // X ranges from 15% to 85% of bouquet container width
        const x = 20 + Math.random() * 60;
        // Y ranges from 5px to 140px (shorter height means deeper in vase)
        const y = Math.random() * 120;
        // Rotation between -45deg and +45deg
        const rotation = (Math.random() - 0.5) * 80;
        
        flowerEl.style.left = `${x}%`;
        flowerEl.style.bottom = `${y}px`;
        flowerEl.style.setProperty('--rot', `${rotation}deg`);
        
        // Z-Index layering based on height, so higher flowers sit in back
        flowerEl.style.zIndex = Math.floor(150 - y);
        
        bouquetContainer.appendChild(flowerEl);
        flowerCount++;
        audio.playPop();
        
        // Add random floating hearts on flower add
        if (window.backgroundSparkles) {
            const rect = btn.getBoundingClientRect();
            for (let i=0; i<3; i++) {
                window.backgroundSparkles.particles.push(
                    new Sparkle(rect.left + rect.width/2, rect.top, window.backgroundSparkles.colors)
                );
            }
        }
    });
});

// Reset Bouquet
document.getElementById('resetBouquet').addEventListener('click', () => {
    // Clear all spawned flowers
    const flowers = bouquetContainer.querySelectorAll('.spawned-flower');
    flowers.forEach(f => f.remove());
    flowerCount = 0;
    
    // Hide ribbon
    ribbonOverlay.classList.remove('visible');
    audio.playPop();
});

// Wrap Bouquet with Ribbon
document.getElementById('wrapBouquet').addEventListener('click', () => {
    if (flowerCount === 0) return;
    
    ribbonOverlay.classList.toggle('visible');
    audio.playChimeSwoop();
    
    // Spawn floating sparkles around the ribbon
    if (window.backgroundSparkles) {
        const rect = ribbonOverlay.getBoundingClientRect();
        for (let i=0; i<15; i++) {
            const sp = new Sparkle(rect.left + rect.width/2 + (Math.random()-0.5)*50, rect.top + (Math.random()-0.5)*30, window.backgroundSparkles.colors);
            sp.speedY = -Math.random()*4 - 1;
            sp.speedX = (Math.random()-0.5)*4;
            window.backgroundSparkles.particles.push(sp);
        }
    }
});

// MAGIC LOVE JAR
const loveJar = document.getElementById('loveJar');
const floatingNoteContainer = document.getElementById('floatingNoteContainer');

const loveMessages = [
    "You are my favorite notification 📱",
    "I love you to the moon and back 🌙",
    "Every day with you is a gift 🎁",
    "You make my heart skip a beat ❤️",
    "My safe space, my home 🏡",
    "Thank you for being you 💖",
    "I'm so incredibly proud of you 🌟",
    "Your laugh is my favorite soundtrack 🎶",
    "You look gorgeous every single day 🌸",
    "I can't wait for our future ✨"
];

loveJar.addEventListener('click', () => {
    audio.playPop();
    
    // 1. Release a message card
    const msg = loveMessages[Math.floor(Math.random() * loveMessages.length)];
    const note = document.createElement('div');
    note.classList.add('floating-love-note');
    note.innerText = msg;
    
    // Center it on the jar
    note.style.left = `calc(50% - 100px)`;
    note.style.bottom = `180px`;
    floatingNoteContainer.appendChild(note);
    
    // GSAP animation for floating note
    gsap.fromTo(note, 
        { opacity: 0, scale: 0.5, y: 0, rotation: (Math.random()-0.5)*20 },
        { 
            opacity: 1, 
            scale: 1, 
            y: -120, 
            duration: 1.2, 
            ease: "back.out(1.5)",
            onComplete: () => {
                gsap.to(note, {
                    opacity: 0,
                    y: -250,
                    duration: 1.5,
                    delay: 2,
                    ease: "power1.in",
                    onComplete: () => note.remove()
                });
            }
        }
    );
    
    // 2. Release multiple floating hearts
    const jarRect = loveJar.getBoundingClientRect();
    const startX = jarRect.left + jarRect.width / 2;
    const startY = jarRect.top + 40; // open lip
    
    for (let i = 0; i < 6; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.classList.add('floating-heart');
            heart.innerHTML = ['❤️','💖','✨','🌸','🎈'][Math.floor(Math.random()*5)];
            heart.style.left = `${startX + (Math.random()-0.5)*30}px`;
            heart.style.top = `${startY}px`;
            document.body.appendChild(heart);
            
            gsap.fromTo(heart,
                { opacity: 0, scale: 0.2, y: 0 },
                {
                    opacity: Math.random()*0.6 + 0.4,
                    scale: Math.random()*1.2 + 0.8,
                    x: (Math.random() - 0.5) * 150,
                    y: -window.innerHeight * 0.6,
                    duration: Math.random()*2 + 2,
                    ease: "power1.out",
                    onComplete: () => heart.remove()
                }
            );
        }, i * 100);
    }
});

// =============================================
// CLAIM ANNIVERSARY GIFT BUTTON — CELEBRATION MODAL + CONFETTI
// =============================================
const celebrationModal = document.getElementById('celebrationModal');
const celebrationClose = document.getElementById('celebrationClose');

document.getElementById('claimKissBtn').addEventListener('click', () => {
    audio.playChimeSwoop();
    
    // Show celebration modal
    celebrationModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    const colors = ['#ff4a70', '#ff7b98', '#ff9fb4', '#ffd0d0', '#dfa83d', '#a2d2ff', '#b39ddb'];
    
    // Trigger massive confetti explosion
    for (let i = 0; i < 180; i++) {
        const x = window.innerWidth / 2;
        const y = window.innerHeight * 0.85;
        
        const p = new Sparkle(x, y, colors);
        p.size = Math.random() * 9 + 4;
        p.speedY = -Math.random() * 18 - 5;
        p.speedX = (Math.random() - 0.5) * 18;
        p.decay = Math.random() * 0.008 + 0.004;
        
        if (window.backgroundSparkles) {
            window.backgroundSparkles.particles.push(p);
        }
    }
    
    setTimeout(() => audio.playPop(), 200);
    setTimeout(() => audio.playPop(), 400);
    setTimeout(() => audio.playPop(), 600);
});

celebrationClose.addEventListener('click', () => {
    celebrationModal.classList.remove('active');
    document.body.style.overflow = '';
});

celebrationModal.addEventListener('click', (e) => {
    if (e.target === celebrationModal) {
        celebrationModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

