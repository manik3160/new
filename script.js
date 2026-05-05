// ===== 3D PARALLAX MOUSE TRACKING =====
const scene = document.getElementById('scene');
const perspectiveContainer = document.getElementById('perspectiveContainer');
const bgImage = document.getElementById('bgImage');

let mouseX = 0, mouseY = 0;
let currentX = 0, currentY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function animate3D() {
    currentX += (mouseX - currentX) * 0.06;
    currentY += (mouseY - currentY) * 0.06;

    const rotateY = currentX * 4;
    const rotateX = -currentY * 3;

    perspectiveContainer.style.transform =
        `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;

    bgImage.style.transform =
        `scale(1.08) translate(${-currentX * 15}px, ${-currentY * 10}px)`;

    requestAnimationFrame(animate3D);
}
animate3D();

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
            section.offsetHeight; // trigger reflow
            section.style.animation = 'fadeInSection 0.5s ease';
        }

        // Update notes panel based on section
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

    const heading = document.querySelector('.notes-heading');
    const textContainer = document.querySelector('.notes-text');

    heading.style.opacity = '0';
    textContainer.style.opacity = '0';

    setTimeout(() => {
        heading.textContent = data.title;
        textContainer.innerHTML = data.text.map(p => `<p>${p}</p>`).join('');
        heading.style.opacity = '1';
        textContainer.style.opacity = '1';
    }, 200);

    heading.style.transition = 'opacity 0.2s ease';
    textContainer.style.transition = 'opacity 0.2s ease';
}

// ===== FLOATING PARTICLES =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.hue = Math.random() > 0.5 ? 255 : 180; // purple or cyan
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
        ctx.fillStyle = this.hue === 255
            ? `rgba(162, 155, 254, ${this.opacity})`
            : `rgba(0, 206, 201, ${this.opacity})`;
        ctx.fill();
    }
}

const particles = Array.from({ length: 60 }, () => new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== SEE MORE BUTTON =====
document.getElementById('seeMoreBtn').addEventListener('click', () => {
    const personalNav = document.querySelector('[data-section="personal"]');
    personalNav.click();
});

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.innerHTML = '<span>Sent! ✓</span>';
    btn.style.background = 'linear-gradient(135deg, #00b894, #00cec9)';
    setTimeout(() => {
        btn.innerHTML = '<span>Send Message</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
        btn.style.background = '';
        e.target.reset();
    }, 2000);
});
