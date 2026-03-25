// / Preloader
document.body.classList.add('loading');

window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    preloader.classList.add('fade-out');

    setTimeout(() => {
        preloader.style.display = 'none';
        document.body.classList.remove('loading');
    }, 500);
});

// Counter Animation
const counters = document.querySelectorAll('.counter');
const speed = 200;

const startCounters = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        }
        updateCount();
    });
}

// Scroll to Top Button
const scrollTopBtn = document.querySelector('.scroll-top');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Intersection Observer for Counter Animation
const statsSection = document.querySelector('.stats-section');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startCounters();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (statsSection) {
    observer.observe(statsSection);
}

// Timeline Animation
const timelineBlocks = document.querySelectorAll('.timeline-block');

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            timelineObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2
});

timelineBlocks.forEach(block => {
    timelineObserver.observe(block);
});

// Chat Widget Functionality
const chatToggle = document.querySelector('.chat-toggle');
const chatBox = document.querySelector('.chat-box');
const closeChat = document.querySelector('.close-chat');
const chatInput = document.querySelector('.chat-input input');
const chatSend = document.querySelector('.chat-input button');
const chatMessages = document.querySelector('.chat-messages');

chatToggle.addEventListener('click', () => {
    chatBox.classList.add('active');
    chatToggle.querySelector('.notification').style.display = 'none';
});

closeChat.addEventListener('click', () => {
    chatBox.classList.remove('active');
});

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message
    const userMsg = `
        <div class="message user">
            <div class="message-content">
                <p>${message}</p>
                <span class="time">Just now</span>
            </div>
        </div>
    `;
    chatMessages.insertAdjacentHTML('beforeend', userMsg);
    chatInput.value = '';

    // Auto-scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate bot response
    setTimeout(() => {
        const botMsg = `
            <div class="message bot">
                <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Agent">
                <div class="message-content">
                    <p>Thanks for your message! Our team will get back to you soon.</p>
                    <span class="time">Just now</span>
                </div>
            </div>
        `;
        chatMessages.insertAdjacentHTML('beforeend', botMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}