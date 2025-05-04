class ParticleBackground {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', { alpha: true });
        this.particles = [];
        this.settings = {
            particleCount: window.innerWidth < 768 ? 50 : 100,
            maxDistance: 120,
            mouseRadius: 200,
            speed: 1.5,
            trailLength: 8,
        };
        this.trails = [];
        this.mouse = { x: null, y: null };
        this.isRunning = false;
        this.lastFrameTime = performance.now();
        this.init();
    }

    init() {
        this.resizeCanvas();
        this.createParticles();
        this.bindEvents();
        this.start();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth * window.devicePixelRatio;
        this.canvas.height = window.innerHeight * window.devicePixelRatio;
        this.canvas.style.width = `${window.innerWidth}px`;
        this.canvas.style.height = `${window.innerHeight}px`;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    createParticles() {
        this.particles = Array.from({ length: this.settings.particleCount }, () => ({
            x: Math.random() * this.canvas.width / window.devicePixelRatio,
            y: Math.random() * this.canvas.height / window.devicePixelRatio,
            vx: (Math.random() - 0.5) * this.settings.speed,
            vy: (Math.random() - 0.5) * this.settings.speed,
            radius: Math.random() * 2 + 1,
        }));
        this.trails = this.particles.map(() => []);
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    draw() {
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentTime;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const theme = document.documentElement.getAttribute('data-theme');
        const particleColor = theme === 'light' ? 'rgba(2, 132, 199, 0.8)' : 'rgba(0, 221, 235, 0.8)';
        const lineColor = theme === 'light' ? 'rgba(2, 132, 199,' : 'rgba(0, 180, 216,';

        this.particles.forEach((p, i) => {
            p.x += p.vx * deltaTime * 60;
            p.y += p.vy * deltaTime * 60;

            if (p.x < 0 || p.x > this.canvas.width / window.devicePixelRatio) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height / window.devicePixelRatio) p.vy *= -1;

            if (this.mouse.x && this.mouse.y) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < this.settings.mouseRadius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (this.settings.mouseRadius - distance) / this.settings.mouseRadius;
                    p.vx -= Math.cos(angle) * force * 1.5;
                    p.vy -= Math.sin(angle) * force * 1.5;
                }
            }

            this.trails[i].push({ x: p.x, y: p.y });
            if (this.trails[i].length > this.settings.trailLength) {
                this.trails[i].shift();
            }

            for (let j = 0; j < this.trails[i].length - 1; j++) {
                const alpha = j / this.settings.trailLength;
                this.ctx.beginPath();
                this.ctx.moveTo(this.trails[i][j].x, this.trails[i][j].y);
                this.ctx.lineTo(this.trails[i][j + 1].x, this.trails[i][j + 1].y);
                this.ctx.strokeStyle = `${lineColor}${alpha * 0.5})`;
                this.ctx.lineWidth = p.radius * 0.5;
                this.ctx.stroke();
            }

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particleColor;
            this.ctx.fill();

            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < this.settings.maxDistance) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `${lineColor}${(1 - distance / this.settings.maxDistance) * 0.5})`;
                    this.ctx.lineWidth = 0.8;
                    this.ctx.stroke();
                }
            }
        });
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        const animate = () => {
            if (!this.isRunning) return;
            this.draw();
            requestAnimationFrame(animate);
        };
        animate();
    }

    stop() {
        this.isRunning = false;
    }
}

class PortfolioController {
    constructor() {
        this.preloader = document.querySelector('.preloader');
        this.init();
    }

    init() {
        this.hidePreloader();
        this.setupNameAnimation();
        this.setupMobileMenu();
        this.setupContactForm();
        this.setupThemeToggle();
        this.setupSmoothScroll();
        this.setupCanvasAnimation();
        this.setupProjectFilters();
        this.setupProjectAnimations();
        this.setupProjectTilt();
        this.setupSkillsAnimation();
        this.setupAccessibility();
    }

    hidePreloader() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.preloader.classList.add('hidden');
            }, 500);
        });
    }

    setupNameAnimation() {
        const nameElement = document.getElementById('animated-name');
        nameElement.innerHTML = '<span class="name-typewriter">NATALIE 👋</span>';
    }

    setupMobileMenu() {
        const menuBtn = document.querySelector('.menu-btn');
        const closeBtn = document.querySelector('.close-menu');
        const mobileMenu = document.querySelector('.mobile-menu');
        const overlay = document.querySelector('.overlay');
        const mobileLinks = document.querySelectorAll('.mobile-links a');

        const toggleMenu = () => {
            const isActive = mobileMenu.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = isActive ? 'hidden' : '';
            menuBtn.setAttribute('aria-expanded', isActive);
        };

        menuBtn.addEventListener('click', toggleMenu);
        closeBtn.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);
        mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));
    }

    setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        const inputs = ['name', 'email', 'subject', 'message'].map(id => document.getElementById(id));

        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.checkValidity()) {
                    input.classList.remove('invalid');
                } else {
                    input.classList.add('invalid');
                }
            });
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const isValid = inputs.every(input => input.checkValidity());
            if (isValid) {
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                setTimeout(() => {
                    alert('Thank you for your message! I will get back to you soon.');
                    contactForm.reset();
                    submitBtn.textContent = 'Send Message';
                    submitBtn.disabled = false;
                }, 1000);
            } else {
                inputs.forEach(input => {
                    if (!input.checkValidity()) {
                        input.classList.add('invalid');
                    }
                });
                alert('Please fill out all fields correctly.');
            }
        });
    }

    setupThemeToggle() {
        const toggles = document.querySelectorAll('.theme-toggle');
        const currentTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', currentTheme);
        toggles.forEach(toggle => {
            toggle.textContent = currentTheme === 'dark' ? '🌙' : '☀';
            toggle.addEventListener('click', () => {
                const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                toggles.forEach(t => t.textContent = newTheme === 'dark' ? '🌙' : '☀');
            });
        });
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    setupCanvasAnimation() {
        const canvas = document.getElementById('background-canvas');
        if (canvas && canvas.getContext) {
            new ParticleBackground(canvas);
        } else {
            console.warn('Canvas not supported or not found.');
        }
    }

    setupProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                projectCards.forEach(card => {
                    const tech = card.getAttribute('data-tech').split(',');
                    if (filter === 'all' || tech.includes(filter)) {
                        card.style.display = 'block';
                        card.classList.add('in-view');
                    } else {
                        card.style.display = 'none';
                        card.classList.remove('in-view');
                    }
                });
            });
        });
    }

    setupProjectAnimations() {
        const projectCards = document.querySelectorAll('.project-card');
        const projectTitles = document.querySelectorAll('.project-title');

        projectTitles.forEach(title => {
            const text = title.textContent;
            title.innerHTML = '';
            [...text].forEach((letter, index) => {
                const span = document.createElement('span');
                span.className = 'project-title-letter';
                span.textContent = letter;
                span.style.setProperty('--i', index);
                title.appendChild(span);
            });
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, { threshold: 0.2 });

        projectCards.forEach(card => observer.observe(card));
    }

    setupSkillsAnimation() {
        const progressBars = document.querySelectorAll('.progress');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progress = entry.target;
                    const percentage = progress.getAttribute('data-progress');
                    progress.style.width = `${percentage}%`;
                    observer.unobserve(progress);
                }
            });
        }, { threshold: 0.5 });

        progressBars.forEach(bar => observer.observe(bar));
    }

    setupProjectTilt() {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const tiltX = (y - centerY) / centerY * 10;
                const tiltY = -(x - centerX) / centerX * 10;
                card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            });
        });
    }

    setupAccessibility() {
        document.querySelectorAll('.skill-tag, .project-card, .filter-btn, .btn, .theme-toggle, .menu-btn, .close-menu').forEach(element => {
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new PortfolioController());