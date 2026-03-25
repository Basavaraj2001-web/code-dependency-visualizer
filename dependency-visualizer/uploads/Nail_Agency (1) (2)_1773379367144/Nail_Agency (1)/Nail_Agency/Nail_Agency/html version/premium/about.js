document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart from localStorage or create new cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Add click event listeners to all add to cart buttons
    const addToCartButtons = document.querySelectorAll('.book-btn, .add-cart-btn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const card = this.closest('.card') || this.closest('.tool-card');
            if (!card) return;

            const h3 = card.querySelector('h3');
            const priceEl = card.querySelector('.price, .tool-price');
            const img = card.querySelector('img');

            if (!h3 || !priceEl || !img) return;

            const product = {
                id: Date.now(),
                name: h3.textContent,
                price: priceEl.textContent,
                image: img.src
            };

            addToCart(product, this);
        });
    });

    function addToCart(product, button) {
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        showAddedAnimation(button);
        updateCartCount();
        showMiniCartPreview();
    }

    function showAddedAnimation(button) {
        const originalText = button.textContent;
        button.textContent = '✓ Added!';
        button.style.backgroundColor = '#4CAF50';
        button.style.transform = 'scale(1.1)';

        const floatingItem = document.createElement('div');
        floatingItem.className = 'floating-cart-item';
        floatingItem.innerHTML = '🛍️';
        button.parentNode.appendChild(floatingItem);

        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
            button.style.transform = '';
            floatingItem.remove();
        }, 2000);
    }

    function updateCartCount() {
        let cartBadge = document.querySelector('.cart-count');
        if (!cartBadge) {
            cartBadge = document.createElement('div');
            cartBadge.className = 'cart-count';
            const nav = document.querySelector('.service-nav');
            if (nav) nav.appendChild(cartBadge);
            else document.body.appendChild(cartBadge);
        }
        cartBadge.textContent = cart.length;
        cartBadge.style.display = cart.length > 0 ? 'block' : 'none';
    }

    function showMiniCartPreview() {
        let miniCart = document.querySelector('.mini-cart');
        if (!miniCart) {
            miniCart = document.createElement('div');
            miniCart.className = 'mini-cart';
            document.body.appendChild(miniCart);
        }

        const total = cart.reduce((sum, item) => {
            const price = parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
            return sum + price;
        }, 0);

        miniCart.innerHTML = `
            <div class="mini-cart-header">
                <h3>Shopping Cart (${cart.length})</h3>
                <span class="close-cart">×</span>
            </div>
            <div class="cart-items">
                ${cart.map(item => `
                    <div class="cart-item" data-id="${item.id}">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="item-details">
                            <h4>${item.name}</h4>
                            <p>${item.price}</p>
                        </div>
                        <button class="delete-item">×</button>
                    </div>
                `).join('')}
            </div>
            <div class="mini-cart-footer">
                <div class="cart-total">Total: $${total.toFixed(2)}</div>
                <div class="cart-actions">
                    <button class="clear-cart-btn">Clear Cart</button>
                    <button class="checkout-btn">Checkout</button>
                </div>
            </div>
        `;

        miniCart.querySelector('.close-cart').addEventListener('click', () => {
            miniCart.remove();
        });

        miniCart.querySelectorAll('.delete-item').forEach(btn => {
            btn.addEventListener('click', function () {
                const itemId = this.closest('.cart-item').dataset.id;
                cart = cart.filter(item => item.id !== parseInt(itemId));
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                showMiniCartPreview();
            });
        });

        miniCart.querySelector('.clear-cart-btn').addEventListener('click', () => {
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            miniCart.remove();
        });

        miniCart.querySelector('.checkout-btn').addEventListener('click', () => {
            const checkoutModal = document.createElement('div');
            checkoutModal.className = 'checkout-modal';
            checkoutModal.innerHTML = `
                <div class="modal-content">
                    <h2>Checkout Successful!</h2>
                    <p>Thank you for choosing Glam Nails. Your appointment has been drafted.</p>
                    <div class="modal-buttons">
                        <button onclick="viewProfile()">View Profile</button>
                        <button onclick="closeModal(this)">Close</button>
                    </div>
                </div>
            `;
            document.body.appendChild(checkoutModal);
            setTimeout(() => checkoutModal.classList.add('show'), 10);
        });
    }

    window.viewProfile = function () {
        showNotification('Order saved to your profile!', 'success');
        const modal = document.querySelector('.checkout-modal');
        if (modal) closeModal(modal);
    }

    window.closeModal = function (element) {
        const modal = element.closest('.checkout-modal') || element;
        if (modal && modal.classList) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Mobile menu toggle (Standardized)
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

    // Counter Animation
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

    const statsSection = document.querySelector('.stats-counter, .stats-section');
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

    addCartStyles();
});

function addCartStyles() {
    const styles = `
        .cart-count { position: fixed; top: 20px; right: 20px; background: #ff9a9e; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; z-index: 2000; }
        .mini-cart { position: fixed; top: 80px; right: 20px; width: 300px; background: white; box-shadow: 0 5px 25px rgba(0,0,0,0.2); border-radius: 10px; z-index: 2000; padding: 1rem; animation: slideIn 0.3s ease-out; }
        /* Include other minimal styles needed for about page specific features if any */
        .checkout-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; opacity: 0; transition: opacity 0.3s ease; z-index: 2100; }
        .checkout-modal.show { opacity: 1; }
        .modal-content { background: white; padding: 2rem; border-radius: 10px; text-align: center; transform: scale(0.7); transition: transform 0.3s ease; }
        .checkout-modal.show .modal-content { transform: scale(1); }
        .notification { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%) translateY(100px); padding: 1rem 2rem; border-radius: 5px; color: white; transition: transform 0.3s ease; z-index: 2200; }
        .notification.show { transform: translateX(-50%) translateY(0); }
        .notification.success { background: #4CAF50; }
        .notification.error { background: #ff6b6b; }
    `;
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}
