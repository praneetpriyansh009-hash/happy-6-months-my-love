// SPARKLE TRAIL & FLOATING BACKGROUND PARTICLES
class BackgroundSparkles {
    constructor() {
        this.canvas = document.getElementById('sparkleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        this.colors = ['#ff4a70', '#ff7b98', '#ff9fb4', '#ffd0d0', '#dfa83d'];
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.addSparkles(e));
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.addSparkles(e.touches[0]);
            }
        });
        
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    addSparkles(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        
        // Spawn 2 particles per movement
        for (let i = 0; i < 2; i++) {
            this.particles.push(new Sparkle(this.mouse.x, this.mouse.y, this.colors));
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw & update existing sparkles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update();
            p.draw(this.ctx);
            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // Occasionally spawn floating background hearts/circles randomly
        if (Math.random() < 0.05 && this.particles.length < 100) {
            const rx = Math.random() * this.canvas.width;
            const ry = this.canvas.height + 20;
            this.particles.push(new FloatingParticle(rx, ry, this.colors));
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

class Sparkle {
    constructor(x, y, colors) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 4 + 2;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * -2 - 0.5; // Rise up
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.015;
        this.type = Math.random() < 0.3 ? 'heart' : 'star';
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= this.decay;
        if (this.size > 0.2) this.size -= 0.05;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        
        if (this.type === 'heart') {
            ctx.font = `${this.size * 3.5}px sans-serif`;
            ctx.fillText('❤️', this.x - this.size * 1.5, this.y);
        } else {
            // Draw a tiny star/sparkle diamond
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - this.size);
            ctx.lineTo(this.x + this.size, this.y);
            ctx.lineTo(this.x, this.y + this.size);
            ctx.lineTo(this.x - this.size, this.y);
            ctx.closePath();
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fill();
        }
        ctx.restore();
    }
}

class FloatingParticle {
    constructor(x, y, colors) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 6 + 4;
        this.speedX = Math.sin(Math.random() * 10) * 0.5;
        this.speedY = -(Math.random() * 1 + 0.5);
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.3 + 0.15; // Semi-transparent background elements
        this.decay = Math.random() * 0.001 + 0.001;
        this.isHeart = Math.random() < 0.5;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        // Float side to side slightly
        this.speedX += Math.sin(Date.now() * 0.001 + this.x) * 0.02;
        if (this.y < -20) this.alpha = 0; // Fade out offscreen
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        
        if (this.isHeart) {
            ctx.font = `${this.size * 3}px sans-serif`;
            ctx.fillText('❤️', this.x, this.y);
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}


// INTERACTIVE 3D PARTICLE HEART
class Heart3D {
    constructor() {
        this.canvas = document.getElementById('heart3dCanvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        this.particles = [];
        this.numParticles = 450;
        this.angleX = 0.01; // Auto rotation speeds
        this.angleY = 0.012;
        this.angleZ = 0.005;
        
        this.mouse = { x: 0, y: 0, active: false };
        
        this.init();
        this.resize();
        
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());
        this.canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) this.handleMouseMove(e.touches[0]);
        });
        this.canvas.addEventListener('touchend', () => this.handleMouseLeave());
        
        this.animate();
    }
    
    init() {
        // Generate points on the 3D heart shell
        for (let i = 0; i < this.numParticles; i++) {
            // Parametric heart formula t parameter [0, 2*PI]
            const t = Math.PI * 2 * (i / this.numParticles);
            
            // X and Y formula for flat heart
            // x = 16 * sin^3(t)
            // y = 13*cos(t) - 5*cos(2t) - 2*cos(3t) - cos(4t)
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
            
            // Z depth component (extrusion and double-sided lobe shaping)
            // We want it to be thick in the middle, thin on edges
            const thickness = Math.max(0, 1 - Math.abs(t - Math.PI) / Math.PI); 
            const z = (Math.random() - 0.5) * 20 * thickness;
            
            // Scale points to comfortable unit size
            const scale = 5.2;
            
            this.particles.push({
                x: x * scale,
                y: y * scale,
                z: z * scale,
                origX: x * scale,
                origY: y * scale,
                origZ: z * scale,
                // Soft gradient color from pink to red
                color: `hsl(${340 + Math.random() * 20}, 95%, ${65 + Math.random() * 15}%)`,
                size: Math.random() * 2.5 + 1.2
            });
        }
    }
    
    resize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
    }
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        // Mouse coordinate relative to canvas center
        this.mouse.x = e.clientX - rect.left - rect.width / 2;
        this.mouse.y = e.clientY - rect.top - rect.height / 2;
        this.mouse.active = true;
    }
    
    handleMouseLeave() {
        this.mouse.active = false;
    }
    
    rotateX(point, angle) {
        const rad = angle;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const y = point.y * cos - point.z * sin;
        const z = point.y * sin + point.z * cos;
        point.y = y;
        point.z = z;
    }
    
    rotateY(point, angle) {
        const rad = angle;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const x = point.x * cos + point.z * sin;
        const z = -point.x * sin + point.z * cos;
        point.x = x;
        point.z = z;
    }
    
    rotateZ(point, angle) {
        const rad = angle;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const x = point.x * cos - point.y * sin;
        const y = point.x * sin + point.y * cos;
        point.x = x;
        point.y = y;
    }
    
    animate() {
        const rect = this.canvas.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const centerX = width / 2;
        const centerY = height / 2;
        
        this.ctx.clearRect(0, 0, width, height);
        
        // Define rotation speed. If mouse is active, we let mouse position guide rotation
        let rx = this.angleX;
        let ry = this.angleY;
        
        if (this.mouse.active) {
            // Map mouse offset to slight rotations
            ry = this.mouse.x * 0.0001;
            rx = -this.mouse.y * 0.0001;
        } else {
            // Auto rotate slightly over time
            ry = Math.sin(Date.now() * 0.0005) * 0.015;
            rx = Math.cos(Date.now() * 0.0004) * 0.01;
        }
        
        // Perspective projection settings
        const fov = 200; // Field of view/camera distance
        
        // Sort particles by Z depth (painter's algorithm) so back particles are drawn first
        this.particles.sort((a, b) => b.z - a.z);
        
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // 1. Rotate particle in 3D
            this.rotateX(p, rx);
            this.rotateY(p, ry);
            this.rotateZ(p, this.angleZ * 0.2);
            
            // 2. Mouse magnetic push effect
            // Project the point temporarily to screen coordinates first
            const screenScale = fov / (fov + p.z);
            const projX = p.x * screenScale;
            const projY = p.y * screenScale;
            
            if (this.mouse.active) {
                // Distance in 2D between projected particle and mouse cursor
                const dx = projX - this.mouse.x;
                const dy = projY - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                // Repulse particles within 60px radius
                if (dist < 70) {
                    const force = (70 - dist) / 70; // 0 (outer limit) to 1 (at cursor)
                    const angle = Math.atan2(dy, dx);
                    // Push the particle slightly outward
                    p.x += Math.cos(angle) * force * 3;
                    p.y += Math.sin(angle) * force * 3;
                    p.z += (Math.random() - 0.5) * force * 2;
                }
            }
            
            // 3. Easing back to heart shell structure (self-gravity)
            // Gently pull coordinates back to their rotated shell coordinates
            // (We calculate where they "should" be by applying rotation to original, but we've already done that by continuously updating x,y,z. So instead, we let them decay towards the shell center)
            const distFromOrigin = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
            const origDist = Math.sqrt(p.origX * p.origX + p.origY * p.origY + p.origZ * p.origZ);
            
            if (Math.abs(distFromOrigin - origDist) > 0.5) {
                const pullFactor = 0.08;
                p.x += (p.x / distFromOrigin) * (origDist - distFromOrigin) * pullFactor;
                p.y += (p.y / distFromOrigin) * (origDist - distFromOrigin) * pullFactor;
                p.z += (p.z / distFromOrigin) * (origDist - distFromOrigin) * pullFactor;
            }
            
            // 4. Project 3D coordinate to 2D screen coordinate
            const scale = fov / (fov + p.z);
            const x2d = p.x * scale + centerX;
            const y2d = p.y * scale + centerY;
            
            // Draw particle with glow/opacity based on Z depth
            const alpha = Math.max(0.2, Math.min(1, (fov + p.z) / (fov * 1.5))); // Farther particles are dimmer
            
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = p.color;
            
            // Particle shape (draw simple circles or small heart symbols)
            this.ctx.beginPath();
            this.ctx.arc(x2d, y2d, p.size * scale, 0, Math.PI * 2);
            
            // Add subtle glow to closer particles
            if (p.z > 0) {
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = p.color;
            }
            
            this.ctx.fill();
            this.ctx.restore();
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Instantiate both layers when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new BackgroundSparkles();
    new Heart3D();
});
