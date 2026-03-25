document.addEventListener('DOMContentLoaded', function () {
    // Smooth scroll to booking section
    const appointmentBtn = document.querySelector('.appointment-btn');
    appointmentBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const bookingSection = document.querySelector('#booking');
        bookingSection.scrollIntoView({ behavior: 'smooth' });

        // Add highlight effect when reaching the section
        setTimeout(() => {
            bookingSection.classList.add('highlight-section');
            setTimeout(() => {
                bookingSection.classList.remove('highlight-section');
            }, 1000);
        }, 1000);
    });

    // Button ripple effect
    appointmentBtn.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        ripple.classList.add('button-ripple');
        this.appendChild(ripple);

        const x = e.clientX - e.target.offsetLeft;
        const y = e.clientY - e.target.offsetTop;

        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('highlight-section');
                setTimeout(() => {
                    entry.target.classList.remove('highlight-section');
                }, 1000);
            }
        });
    }, { threshold: 0.5 });

    // Observe the booking section
    const bookingSection = document.querySelector('#booking');
    if (bookingSection) {
        observer.observe(bookingSection);
    }

    // Add click handler for the appointment button
    appointmentBtn.addEventListener('click', function () {
        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);

        // Remove ripple after animation
        setTimeout(() => ripple.remove(), 1000);

        // You can replace this with your actual booking logic
        // alert('Opening appointment scheduler...');
    });

    appointmentBtn.addEventListener('click', function () {
        // Open appointment page in new window
        window.location.href = 'appointment.html';
    });

    appointmentBtn.addEventListener('click', function () {
        window.open('appointment.html', '_blank');
    });

    // Enhanced Slider Functionality
    const slider = {
        container: document.querySelector('.slider-container'),
        slides: document.querySelectorAll('.slide'),
        prevBtn: document.querySelector('.slider-btn.prev'),
        nextBtn: document.querySelector('.slider-btn.next'),
        dots: document.querySelector('.slider-dots'),
        currentSlide: 0,
        isAnimating: false,

        init() {
            this.createDots();
            this.setupEventListeners();
            this.startAutoSlide();
            this.updateSlide();
        },

        createDots() {
            this.slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dots.appendChild(dot);
            });
        },

        setupEventListeners() {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());

            // Touch/Swipe support
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
        },

        updateSlide(direction = 'next') {
            if (this.isAnimating) return;
            this.isAnimating = true;

            // Remove active class from current slide
            this.slides[this.currentSlide].classList.remove('active');
            this.dots.children[this.currentSlide].classList.remove('active');

            // Hide current slide content
            const currentContent = this.slides[this.currentSlide].querySelector('.para');
            currentContent.style.opacity = '0';
            currentContent.style.transform = 'translateY(20px)';

            // Update current slide index
            if (direction === 'next') {
                this.currentSlide = (this.currentSlide + 1) % this.slides.length;
            } else {
                this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            }

            // Show new slide
            this.slides[this.currentSlide].classList.add('active');
            this.dots.children[this.currentSlide].classList.add('active');

            // Animate new slide content
            const newContent = this.slides[this.currentSlide].querySelector('.para');
            setTimeout(() => {
                newContent.style.opacity = '1';
                newContent.style.transform = 'translateY(0)';
                this.isAnimating = false;
            }, 500);
        },

        nextSlide() {
            this.updateSlide('next');
            this.resetAutoSlide();
        },

        prevSlide() {
            this.updateSlide('prev');
            this.resetAutoSlide();
        },

        goToSlide(index) {
            if (this.currentSlide === index || this.isAnimating) return;
            const direction = index > this.currentSlide ? 'next' : 'prev';
            this.currentSlide = index - 1;
            this.updateSlide(direction);
            this.resetAutoSlide();
        },

        startAutoSlide() {
            this.autoSlideInterval = setInterval(() => this.nextSlide(), 5000);
        },

        resetAutoSlide() {
            clearInterval(this.autoSlideInterval);
            this.startAutoSlide();
        }
    };

    // Initialize slider
    slider.init();

    // Footer Newsletter Form Submission
    document.querySelector('.newsletter form').addEventListener('submit', function (e) {
        e.preventDefault();
        const email = this.querySelector('input').value;
        if (email) {
            // Add your newsletter subscription logic here
            alert('Thank you for subscribing!');
            this.querySelector('input').value = '';
        }
    });

    // Smooth scroll for footer links
    document.querySelectorAll('.footer a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll reveal animation to footer sections
    window.addEventListener('scroll', function () {
        const footerSections = document.querySelectorAll('.footer-section');
        footerSections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (sectionTop < windowHeight * 0.75) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    });

    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        // Animate hamburger to X
        navToggle.classList.toggle('active');
        const spans = navToggle.querySelectorAll('span');
        if (navToggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
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
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Gallery functionality
    const gallery = {
        init() {
            this.container = document.querySelector('.gallery-grid');
            this.modal = document.querySelector('.gallery-modal');
            this.modalImg = this.modal.querySelector('.modal-img');
            this.items = document.querySelectorAll('.gallery-item');
            this.categoryBtns = document.querySelectorAll('.category-btn');
            this.bindEvents();
        },

        bindEvents() {
            // Category filtering
            this.categoryBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const category = e.target.dataset.category;
                    this.filterItems(category);

                    // Update active button
                    this.categoryBtns.forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                });
            });

            // Open modal
            this.items.forEach(item => {
                item.addEventListener('click', (e) => {
                    const imgSrc = item.querySelector('img').src;
                    const title = item.querySelector('h3').textContent;
                    const desc = item.querySelector('p').textContent;
                    this.openModal(imgSrc, title, desc);
                });
            });

            // Close modal
            this.modal.querySelector('.modal-close').addEventListener('click', () => {
                this.closeModal();
            });
        },

        filterItems(category) {
            this.items.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        },

        openModal(imgSrc, title, desc) {
            this.modalImg.src = imgSrc;
            this.modal.querySelector('.modal-title').textContent = title;
            this.modal.querySelector('.modal-description').textContent = desc;
            this.modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        },

        closeModal() {
            this.modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    gallery.init();
});

// Page Loader
window.addEventListener('load', () => {
    const loader = document.querySelector('.page-loader');
    loader.style.opacity = '0';
    setTimeout(() => {
        loader.style.display = 'none';
    }, 500);
});

// Scroll Animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
});

document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));

/*// Modern Gallery Filter
const filterButtons = document.querySelectorAll('.category-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.dataset.category;
        galleryItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });

        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});*/
document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       GALLERY FILTER
    ========================== */

    const categoryBtns = document.querySelectorAll(".category-btn");
    const galleryItems = document.querySelectorAll(".gallery-item");

    categoryBtns.forEach(btn => {
        btn.addEventListener("click", function () {

            document.querySelector(".category-btn.active").classList.remove("active");
            this.classList.add("active");

            const category = this.dataset.category;

            galleryItems.forEach(item => {
                if (category === "all" || item.dataset.category === category) {
                    item.style.display = "block";
                } else {
                    item.style.display = "none";
                }
            });
        });
    });


    /* =========================
       MODAL FUNCTIONALITY
    ========================== */

    const modal = document.querySelector(".gallery-modal");
    const modalImg = document.querySelector(".modal-img");
    const modalTitle = document.querySelector(".modal-title");
    const modalDesc = document.querySelector(".modal-description");
    const closeModal = document.querySelector(".modal-close");

    document.querySelectorAll(".view-btn").forEach(button => {
        button.addEventListener("click", function (e) {
            e.stopPropagation();

            const item = this.closest(".gallery-item");
            const img = item.querySelector("img").src;
            const title = item.querySelector("h3").innerText;
            const desc = item.querySelector("p").innerText;

            modal.style.display = "flex";
            modalImg.src = img;
            modalTitle.innerText = title;
            modalDesc.innerText = desc;

            document.body.style.overflow = "hidden";
        });
    });

    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    });

});

// Counter Animation
const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const increment = target / 200;

    const updateCounter = () => {
        const value = +counter.innerText;
        if (value < target) {
            counter.innerText = Math.ceil(value + increment);
            setTimeout(updateCounter, 1);
        } else {
            counter.innerText = target;
        }
    };

    updateCounter();
});

// Login dropdown functionality
document.addEventListener('DOMContentLoaded', function () {
    const loginTrigger = document.querySelector('.login-trigger');
    const loginDropdown = document.querySelector('.login-dropdown');

    // Toggle login dropdown
    loginTrigger.addEventListener('click', function (e) {
        e.preventDefault();
        loginDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
        if (!loginTrigger.contains(e.target) && !loginDropdown.contains(e.target)) {
            loginDropdown.classList.remove('active');
        }
    });

    // Handle login form submission
    const loginForm = document.querySelector('.login-form');
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        // Add your login logic here
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;
        console.log('Login attempt:', { email, password });
        // You would typically send this to your server
    });
});

// ...existing code...

// Login Modal
// const loginBtn = document.getElementById('loginBtn');
// const loginModal = document.getElementById('loginModal');
// const closeBtn = document.querySelector('.close');
// const loginForm = document.getElementById('loginForm');

// loginBtn.onclick = function () {
//     loginModal.style.display = 'block';
//     document.body.style.overflow = 'hidden';
// }

// closeBtn.onclick = function () {
//     loginModal.style.display = 'none';
//     document.body.style.overflow = 'auto';
// }

// window.onclick = function (event) {
//     if (event.target == loginModal) {
//         loginModal.style.display = 'none';
//         document.body.style.overflow = 'auto';
//     }
// }

// loginForm.onsubmit = function (e) {
//     e.preventDefault();
//     // Add your login logic here
//     console.log('Login submitted');
// }