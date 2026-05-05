// ===== BACKGROUND PARALLAX + 3D WORKSPACE TILT =====
const bgImage    = document.getElementById('bgImage');
const vrWorkspace = document.getElementById('vrWorkspace');

// Background parallax targets
let mouseX = 0, mouseY = 0;
let currentX = 0, currentY = 0;

// 3D workspace tilt targets
let targetTiltX = 0, targetTiltY = 0;
let tiltX = 0, tiltY = 0;

// Settled state for when mouse leaves
let isMouseOver = false;

document.addEventListener('mousemove', (e) => {
    const nx = (e.clientX / window.innerWidth  - 0.5) * 2;  // -1 → 1
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;  // -1 → 1

    mouseX = nx;
    mouseY = ny;

    // 3D tilt: subtle rotateX / rotateY — mirroring the Spline camera effect
    targetTiltX = ny * -4.5;   // pitch:  top ↑ tilts back, bottom ↑ tilts forward
    targetTiltY = nx *  6.5;   // yaw:    left → panel turns left, right → turns right
    isMouseOver = true;
});

document.addEventListener('mouseleave', () => {
    targetTiltX = 0;
    targetTiltY = 0;
    isMouseOver = false;
});

function animate() {
    // --- Background parallax (low lerp = silky smooth) ---
    currentX += (mouseX - currentX) * 0.03;
    currentY += (mouseY - currentY) * 0.03;
    bgImage.style.transform = `translate(${-currentX * 30}px, ${-currentY * 22}px)`;

    // --- 3D workspace tilt (slightly faster lerp for responsiveness) ---
    tiltX += (targetTiltX - tiltX) * 0.055;
    tiltY += (targetTiltY - tiltY) * 0.055;

    // Combine a permanent tiny pitch with the mouse-driven tilt
    vrWorkspace.style.transform = `rotateX(${1 + tiltX}deg) rotateY(${tiltY}deg)`;

    requestAnimationFrame(animate);
}
animate();

// ===== NAVIGATION =====
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const target = item.dataset.section;

        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');

        sections.forEach(s => s.classList.remove('active'));
        const section = document.getElementById(`section-${target}`);
        if (section) {
            section.classList.add('active');
            section.style.animation = 'none';
            section.offsetHeight; // force reflow
            section.style.animation = 'fadeInSection 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
        }

        updateNotes(target);
    });
});

// ===== NOTES CONTENT =====
const notesData = {
    home: {
        title: 'Welcome to my portfolio!',
        text: [
            'Hello everyone, welcome to my portfolio website! This site offers a 3D-inspired experience built with pure HTML, CSS, and JavaScript.',
            'I know what you\'re thinking: "A portfolio website in 3D for a developer? Is that really necessary?" In short, the answer is no. But it is fun! And it\'s a great way to showcase my work.',
            'On this website, you\'ll find a collection of my projects, personal information and details about my education and career. So go take a look!'
        ]
    },
    projects: {
        title: 'About my projects',
        text: [
            'Here you can find a detailed overview of all my projects. Each card showcases a different application I\'ve built.',
            'Click on any project card to learn more about the technologies used, the challenges faced, and the solutions implemented.',
            'I\'m always working on something new, so check back often for updates!'
        ]
    },
    personal: {
        title: 'Getting to know me',
        text: [
            'Beyond coding, I\'m passionate about open source contributions and building tools that make developers\' lives easier.',
            'I believe in continuous learning and regularly explore new technologies and frameworks to stay current.',
            'When I\'m not coding, you\'ll find me solving competitive programming problems or exploring system design concepts.'
        ]
    },
    career: {
        title: 'My journey so far',
        text: [
            'My career journey started with a deep curiosity for how things work on the web. From building my first website to contributing to production-grade open source projects.',
            'I\'m currently pursuing my B.Tech in Computer Science while actively contributing to security-focused open source projects like GreedyBear.',
            'I\'m always looking for new opportunities to grow and make an impact through technology.'
        ]
    },
    contact: {
        title: 'Let\'s connect!',
        text: [
            'I\'m always open to discussing new opportunities, collaborations, or just having a chat about technology.',
            'Feel free to reach out through any of the channels listed, or use the contact form to send me a direct message.',
            'I typically respond within 24 hours. Looking forward to hearing from you!'
        ]
    }
};

function updateNotes(section) {
    const data = notesData[section];
    if (!data) return;

    const heading       = document.querySelector('.notes-heading');
    const textContainer = document.querySelector('.notes-text');

    heading.style.opacity       = '0';
    textContainer.style.opacity = '0';
    heading.style.transform       = 'translateY(10px)';
    textContainer.style.transform = 'translateY(10px)';

    heading.style.transition       = 'opacity 0.3s ease, transform 0.3s ease';
    textContainer.style.transition = 'opacity 0.3s ease 0.06s, transform 0.3s ease 0.06s';

    setTimeout(() => {
        heading.textContent    = data.title;
        textContainer.innerHTML = data.text.map(p => `<p>${p}</p>`).join('');
        heading.style.opacity       = '1';
        heading.style.transform     = 'translateY(0)';
        textContainer.style.opacity = '1';
        textContainer.style.transform = 'translateY(0)';
    }, 220);
}

// ===== FLOATING PARTICLES =====
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x       = Math.random() * canvas.width;
        this.y       = Math.random() * canvas.height;
        this.size    = Math.random() * 1.4 + 0.2;
        this.speedX  = (Math.random() - 0.5) * 0.28;
        this.speedY  = (Math.random() - 0.5) * 0.18;
        this.opacity = Math.random() * 0.28 + 0.04;
        this.hue     = Math.random() > 0.55 ? 'purple' : 'teal';
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.hue === 'purple'
            ? `rgba(162,155,254,${this.opacity})`
            : `rgba(0,210,204,${this.opacity})`;
        ctx.fill();
    }
}

const particles = Array.from({ length: 45 }, () => new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== SEE MORE BUTTON =====
document.getElementById('seeMoreBtn').addEventListener('click', () => {
    document.querySelector('[data-section="personal"]').click();
});

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.innerHTML = '<span>Sent! ✓</span>';
    btn.style.background = 'linear-gradient(135deg, #00b894, #00cec9)';
    setTimeout(() => {
        btn.innerHTML = '<span>Send Message</span><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
        btn.style.background = '';
        e.target.reset();
    }, 2200);
});
