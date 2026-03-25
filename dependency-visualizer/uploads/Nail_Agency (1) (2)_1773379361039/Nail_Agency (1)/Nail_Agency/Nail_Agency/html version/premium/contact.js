document.addEventListener('DOMContentLoaded', () => {
    // 1. Preloader (Only if preloader exists)
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        document.body.classList.add('loading');
        window.addEventListener('load', () => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.classList.remove('loading');
            }, 500);
        });
    }

    // 2. Mobile Menu Toggle (Standardized)
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');

            const spans = navToggle.querySelectorAll('span');
            if (navToggle.classList.contains('active')) {
                if (spans[0]) spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                if (spans[1]) spans[1].style.opacity = '0';
                if (spans[2]) spans[2].style.transform = 'rotate(-45deg) translate(-6px, 6px)';
            } else {
                if (spans[0]) spans[0].style.transform = 'none';
                if (spans[1]) spans[1].style.opacity = '1';
                if (spans[2]) spans[2].style.transform = 'none';
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                if (spans.length >= 3) {
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
        });
    }

    // 3. Counter Animation (Only if counters exist)
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const startCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = parseInt(counter.innerText) || 0;
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

    const statsSection = document.querySelector('.stats-section, .stats-counter');
    if (statsSection && counters.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        observer.observe(statsSection);
    }

    // 4. Scroll to Top Button (Only if exists)
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
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
    }

    // 5. Timeline Animation (Only if exists)
    const timelineBlocks = document.querySelectorAll('.timeline-block');
    if (timelineBlocks.length > 0) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        timelineBlocks.forEach(block => timelineObserver.observe(block));
    }

    // 6. Chat Widget (Only if parts exist)
    const chatToggle = document.querySelector('.chat-toggle');
    const chatBox = document.querySelector('.chat-box');
    const closeChat = document.querySelector('.close-chat');
    const chatInput = document.querySelector('.chat-input input');
    const chatSend = document.querySelector('.chat-input button');
    const chatMessages = document.querySelector('.chat-messages');

    if (chatToggle && chatBox && closeChat) {
        chatToggle.addEventListener('click', () => {
            chatBox.classList.add('active');
            const notif = chatToggle.querySelector('.notification');
            if (notif) notif.style.display = 'none';
        });

        closeChat.addEventListener('click', () => {
            chatBox.classList.remove('active');
        });

        if (chatSend && chatInput && chatMessages) {
            chatSend.addEventListener('click', sendMessage);
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendMessage();
            });
        }
    }

    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

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
        chatMessages.scrollTop = chatMessages.scrollHeight;

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
});