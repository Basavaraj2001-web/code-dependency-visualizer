document.addEventListener('DOMContentLoaded', function () {
    // 1. Initial Selections
    const appointmentBtn = document.querySelector('.appointment-btn');
    const bookingSection = document.querySelector('#booking');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    // 2. Appointment Button & Smooth Scroll
    if (appointmentBtn) {
        appointmentBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (bookingSection) {
                bookingSection.scrollIntoView({ behavior: 'smooth' });
                bookingSection.classList.add('highlight-section');
                setTimeout(() => bookingSection.classList.remove('highlight-section'), 1000);
            } else {
                window.location.href = 'appoint.html';
            }
        });

        // Ripple Effect
        appointmentBtn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.classList.add('button-ripple');
            this.appendChild(ripple);

            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            setTimeout(() => ripple.remove(), 600);
        });
    }

    // 3. Mobile Navigation Toggle
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');

            const spans = navToggle.querySelectorAll('span');
            if (navToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(-6px, 6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => span.style.transform = 'none');
                if (spans[1]) spans[1].style.opacity = '1';
            }
        });
    }

    // 4. Slider Functionality
    const slider = {
        container: document.querySelector('.slider-container'),
        slides: document.querySelectorAll('.slide'),
        prevBtn: document.querySelector('.slider-btn.prev'),
        nextBtn: document.querySelector('.slider-btn.next'),
        dots: document.querySelector('.slider-dots'),
        currentSlide: 0,
        isAnimating: false,

        init() {
            if (!this.container) return;
            this.createDots();
            this.setupEventListeners();
            this.startAutoSlide();
            this.updateSlide();
        },

        createDots() {
            if (!this.dots) return;
            this.slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dots.appendChild(dot);
            });
        },

        setupEventListeners() {
            if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevSlide());
            if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextSlide());

            if (this.container) {
                let touchStartX = 0;
                this.container.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX);
                this.container.addEventListener('touchend', e => {
                    const touchEndX = e.changedTouches[0].clientX;
                    const diff = touchStartX - touchEndX;
                    if (Math.abs(diff) > 50) {
                        if (diff > 0) this.nextSlide();
                        else this.prevSlide();
                    }
                });
            }
        },

        updateSlide(direction = 'next') {
            if (this.isAnimating || !this.slides.length) return;
            this.isAnimating = true;

            this.slides[this.currentSlide].classList.remove('active');
            if (this.dots && this.dots.children[this.currentSlide]) {
                this.dots.children[this.currentSlide].classList.remove('active');
            }

            const currentPara = this.slides[this.currentSlide].querySelector('.para');
            if (currentPara) {
                currentPara.style.opacity = '0';
                currentPara.style.transform = 'translateY(20px)';
            }

            if (direction === 'next') {
                this.currentSlide = (this.currentSlide + 1) % this.slides.length;
            } else {
                this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            }

            this.slides[this.currentSlide].classList.add('active');
            if (this.dots && this.dots.children[this.currentSlide]) {
                this.dots.children[this.currentSlide].classList.add('active');
            }

            const newPara = this.slides[this.currentSlide].querySelector('.para');
            setTimeout(() => {
                if (newPara) {
                    newPara.style.opacity = '1';
                    newPara.style.transform = 'translateY(0)';
                }
                this.isAnimating = false;
            }, 500);
        },

        nextSlide() { this.updateSlide('next'); this.resetAutoSlide(); },
        prevSlide() { this.updateSlide('prev'); this.resetAutoSlide(); },
        goToSlide(index) {
            if (this.currentSlide === index || this.isAnimating) return;
            const direction = index > this.currentSlide ? 'next' : 'prev';
            this.currentSlide = direction === 'next' ? index - 1 : index + 1;
            this.updateSlide(direction);
            this.resetAutoSlide();
        },
        startAutoSlide() { this.autoSlideInterval = setInterval(() => this.nextSlide(), 5000); },
        resetAutoSlide() { clearInterval(this.autoSlideInterval); this.startAutoSlide(); }
    };
    slider.init();

    // 5. Gallery Logic
    const gallery = {
        init() {
            this.container = document.querySelector('.gallery-grid');
            this.modal = document.querySelector('.gallery-modal');
            if (!this.container || !this.modal) return;

            this.modalImg = this.modal.querySelector('.modal-img');
            this.items = document.querySelectorAll('.gallery-item');
            this.categoryBtns = document.querySelectorAll('.category-btn');
            this.bindEvents();
        },
        bindEvents() {
            this.categoryBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const category = e.target.dataset.category;
                    this.filterItems(category);
                    this.categoryBtns.forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                });
            });
            this.items.forEach(item => {
                item.addEventListener('click', () => {
                    const img = item.querySelector('img');
                    const title = item.querySelector('h3');
                    const desc = item.querySelector('p');
                    if (img) this.openModal(img.src, title ? title.textContent : '', desc ? desc.textContent : '');
                });
            });
            const closeBtn = this.modal.querySelector('.modal-close');
            if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal());
        },
        filterItems(category) {
            this.items.forEach(item => {
                item.style.display = (category === 'all' || item.dataset.category === category) ? 'block' : 'none';
            });
        },
        openModal(imgSrc, title, desc) {
            this.modalImg.src = imgSrc;
            const mTitle = this.modal.querySelector('.modal-title');
            const mDesc = this.modal.querySelector('.modal-description');
            if (mTitle) mTitle.textContent = title;
            if (mDesc) mDesc.textContent = desc;
            this.modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        },
        closeModal() {
            this.modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };
    gallery.init();

    // 6. Intersection Observer for Scroll Animations
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate', 'highlight-section');
                // Optional: remove highlight after a bit
                if (entry.target.id === 'booking') {
                    setTimeout(() => entry.target.classList.remove('highlight-section'), 2000);
                }
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.animate-on-scroll, .luxury-features > div, .middle').forEach(el => {
        scrollObserver.observe(el);
    });

    // 7. Counter Animation
    const counters = document.querySelectorAll('.counter');
    const startCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const increment = target / 200;
        const update = () => {
            const value = +counter.innerText;
            if (value < target) {
                counter.innerText = Math.ceil(value + increment);
                setTimeout(update, 1);
            } else {
                counter.innerText = target;
            }
        };
        update();
    };
    // Observe counters to start when visible
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    });
    counters.forEach(c => counterObserver.observe(c));

    // 8. Login Dropdown
    const loginTrigger = document.querySelector('.login-trigger');
    const loginDropdown = document.querySelector('.login-dropdown');
    if (loginTrigger && loginDropdown) {
        loginTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            loginDropdown.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            if (!loginTrigger.contains(e.target) && !loginDropdown.contains(e.target)) {
                loginDropdown.classList.remove('active');
            }
        });
    }

    // 9. Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form, .newsletter form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const input = this.querySelector('input');
            if (input && input.value) {
                alert('Thank you for subscribing!');
                input.value = '';
            }
        });
    }
});

// 10. Page Loader (Global)
window.addEventListener('load', () => {
    const loader = document.querySelector('.page-loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }
});