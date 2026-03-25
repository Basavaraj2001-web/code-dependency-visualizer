// ─── Hero Slider ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const dotEls = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!slides.length) return;

    let current = 0;
    let autoTimer;

    // Ensure clean initial state
    slides.forEach(s => s.classList.remove('active'));
    dotEls.forEach(d => d.classList.remove('active'));
    slides[0].classList.add('active');
    dotEls[0]?.classList.add('active');

    function goTo(index) {
        slides[current].classList.remove('active');
        dotEls[current]?.classList.remove('active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('active');
        dotEls[current]?.classList.add('active');
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }
    function startAuto() { autoTimer = setInterval(next, 4500); }
    function resetAuto() { clearInterval(autoTimer); startAuto(); }

    prevBtn?.addEventListener('click', () => { prev(); resetAuto(); });
    nextBtn?.addEventListener('click', () => { next(); resetAuto(); });
    dotEls.forEach((dot, i) => {
        dot.addEventListener('click', () => { goTo(i); resetAuto(); });
    });

    startAuto();
});

// ─── Cart & Other Logic ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart from localStorage or create new cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Add click event listeners to all add to cart buttons
    const addToCartButtons = document.querySelectorAll('.book-btn, .add-cart-btn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const card = this.closest('.card') || this.closest('.tool-card');
            const product = {
                id: Date.now(), // Unique ID for each item
                name: card.querySelector('h3').textContent,
                price: card.querySelector('.price, .tool-price').textContent,
                image: card.querySelector('img').src
            };

            // Add to cart with animation
            addToCart(product, this);
        });
    });

    function addToCart(product, button) {
        // Add item to cart array
        cart.push(product);

        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Show success animation
        showAddedAnimation(button);

        // Update cart count
        updateCartCount();

        // Optional: Show mini cart preview
        showMiniCartPreview();
    }

    function showAddedAnimation(button) {
        // Store original text
        const originalText = button.textContent;

        // Change button appearance
        button.textContent = '✓ Added!';
        button.style.backgroundColor = '#4CAF50';
        button.style.transform = 'scale(1.1)';

        // Create floating animation
        const floatingItem = document.createElement('div');
        floatingItem.className = 'floating-cart-item';
        floatingItem.innerHTML = '🛍️';
        button.parentNode.appendChild(floatingItem);

        // Reset button after animation
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
            button.style.transform = '';
            floatingItem.remove();
        }, 2000);
    }

    function updateCartCount() {
        // Create or update cart count badge
        let cartBadge = document.querySelector('.cart-count');
        if (!cartBadge) {
            cartBadge = document.createElement('div');
            cartBadge.className = 'cart-count';
            document.querySelector('.service-nav').appendChild(cartBadge);
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

        // Calculate total
        const total = cart.reduce((sum, item) => {
            const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
            return sum + price;
        }, 0);

        // Update mini cart content with items list and delete buttons
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
                        <button class="delete-item" onclick="removeFromCart(${item.id})">×</button>
                    </div>
                `).join('')}
            </div>
            <div class="mini-cart-total">
                Total: $${total.toFixed(2)}
            </div>
            <div class="cart-actions">
                <button class="clear-cart-btn">Clear Cart</button>
                <button class="checkout-btn" onclick="processCheckout()">Checkout</button>
            </div>
        `;

        // Add event listeners for cart actions
        miniCart.querySelector('.clear-cart-btn').addEventListener('click', clearCart);
        miniCart.querySelector('.close-cart').addEventListener('click', () => miniCart.classList.remove('show'));

        // Show mini cart
        miniCart.classList.add('show');
    }

    // Add these new functions for cart management
    window.removeFromCart = function (itemId) {
        cart = cart.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showMiniCartPreview();

        // Show removal animation
        showRemovalAnimation();
    }

    function clearCart() {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showMiniCartPreview();
    }

    function showRemovalAnimation() {
        const notification = document.createElement('div');
        notification.className = 'removal-notification';
        notification.textContent = 'Item removed from cart';
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    // Add new checkout related functions
    window.processCheckout = function () {
        if (cart.length === 0) {
            showNotification('Your cart is empty!', 'error');
            return;
        }

        // Save order to profile
        const order = {
            orderId: 'ORD-' + Date.now(),
            items: cart,
            total: cart.reduce((sum, item) => sum + parseFloat(item.price.replace(/[^\d.]/g, '')), 0),
            date: new Date().toLocaleString()
        };

        // Get existing orders or initialize new array
        let userOrders = JSON.parse(localStorage.getItem('userOrders')) || [];
        userOrders.push(order);
        localStorage.setItem('userOrders', JSON.stringify(userOrders));

        // Show success message
        showCheckoutSuccess(order);

        // Clear cart
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();

        // Close mini cart
        document.querySelector('.mini-cart').classList.remove('show');
    }

    function showCheckoutSuccess(order) {
        const successModal = document.createElement('div');
        successModal.className = 'checkout-modal';
        successModal.innerHTML = `
            <div class="modal-content">
                <h2>🎉 Order Confirmed!</h2>
                <p>Order ID: ${order.orderId}</p>
                <p>Total Amount: $${order.total.toFixed(2)}</p>
                <p>Items: ${order.items.length}</p>
                <div class="modal-buttons">
                    <button onclick="viewProfile()">View in Profile</button>
                    <button onclick="closeModal(this)">Continue Shopping</button>
                </div>
            </div>
        `;
        document.body.appendChild(successModal);

        // Add animation class after a small delay
        setTimeout(() => successModal.classList.add('show'), 10);
    }

    window.viewProfile = function () {
        // You can implement profile page navigation here
        showNotification('Order saved to your profile!', 'success');
        closeModal(document.querySelector('.checkout-modal'));
    }

    window.closeModal = function (element) {
        const modal = element.closest('.checkout-modal');
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

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
                if (spans.length >= 3) {
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
        });
    }

    // Add necessary styles
    addCartStyles();
});

function addCartStyles() {
    const styles = `
        .cart-count {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff9a9e;
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            z-index: 1000;
        }

        .floating-cart-item {
            position: absolute;
            right: 0;
            top: 0;
            animation: floatToCart 1s ease-out forwards;
            font-size: 24px;
        }

        .mini-cart {
            position: fixed;
            top: 60px;
            right: -300px;
            width: 300px;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            border-radius: 10px;
            padding: 15px;
            transition: right 0.3s ease;
            z-index: 1000;
        }

        .mini-cart.show {
            right: 20px;
        }

        .mini-cart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .close-cart {
            cursor: pointer;
            font-size: 24px;
        }

        .checkout-btn {
            width: 100%;
            padding: 10px;
            background: linear-gradient(to right, #ff9a9e, #fad0c4);
            border: none;
            border-radius: 5px;
            color: white;
            cursor: pointer;
            margin-top: 15px;
        }

        @keyframes floatToCart {
            0% {
                transform: translate(0, 0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(50px, -100px) scale(0);
                opacity: 0;
            }
        }

        .cart-items {
            max-height: 300px;
            overflow-y: auto;
            margin-bottom: 15px;
        }

        .cart-item {
            display: flex;
            align-items: center;
            padding: 10px;
            border-bottom: 1px solid #eee;
            position: relative;
        }

        .cart-item img {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 5px;
            margin-right: 10px;
        }

        .item-details {
            flex-grow: 1;
        }

        .item-details h4 {
            font-size: 0.9rem;
            margin: 0;
        }

        .item-details p {
            color: #ff9a9e;
            margin: 5px 0 0;
            font-size: 0.8rem;
        }

        .delete-item {
            background: none;
            border: none;
            color: #ff9a9e;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 5px;
            transition: all 0.3s ease;
        }

        .delete-item:hover {
            // color: #ff6b6b;
            transform: scale(1.2);
        }

        .cart-actions {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }

        .clear-cart-btn {
            padding: 10px;
            background: #ff6b6b;
            border: none;
            border-radius: 5px;
            color: white;
            cursor: pointer;
            flex: 1;
        }

        .removal-notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ff6b6b;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
            from {
                transform: translate(-50%, 100%);
                opacity: 0;
            }
            to {
                transform: translate(-50%, 0);
                opacity: 1;
            }
        }

        .checkout-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1100;
        }

        .checkout-modal.show {
            opacity: 1;
        }

        .modal-content {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            text-align: center;
            transform: scale(0.7);
            transition: transform 0.3s ease;
        }

        .checkout-modal.show .modal-content {
            transform: scale(1);
        }

        .modal-content h2 {
            color: #333;
            margin-bottom: 1rem;
        }

        .modal-buttons {
            margin-top: 1.5rem;
            display: flex;
            gap: 1rem;
            justify-content: center;
        }

        .modal-buttons button {
            padding: 0.8rem 1.5rem;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .modal-buttons button:first-child {
            background: linear-gradient(to right, #ff6b6b,  #ff6b6b);
            color: white;
        }

        .modal-buttons button:last-child {
            background: #333;
            color: white;
        }

        .notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            padding: 1rem 2rem;
            border-radius: 5px;
            color: white;
            transition: transform 0.3s ease;
            z-index: 1200;
        }

        .notification.success {
            background: #4CAF50;
        }

        .notification.error {
            background: #ff6b6b;
        }

        .notification.show {
            transform: translateX(-50%) translateY(0);
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// Initializers already handled in first DOMContentLoaded
