import { loadHeaderFooter, updateCartCount } from './utils.mjs';

// Define a conversion rate
const PHP_TO_USD = 0.018; 

async function init() {
    await loadHeaderFooter();
    renderCart();

    // Attach ONE listener to the container (Event Delegation)
    const container = document.querySelector('#cart-list');
    if (container) {
        container.addEventListener('click', handleContainerClick);
    }

    // for the finalied reservation button, we can clear the cart and redirect to the thank you page
    const checkoutBtn = document.querySelector('#checkout-btn');

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
         
                localStorage.removeItem('car-reservation-cart');
            
                // window.location.href = "../thankyou/thankyou.html"; this was the original path, but it caused issues when deployed on render, so I changed it to an absolute path
                window.location.href = "/thankyou/thankyou.html";
            
        });
    }
}

function renderCart() {
    const cartItems = JSON.parse(localStorage.getItem('car-reservation-cart')) || [];
    const container = document.querySelector('#cart-list');

    if (!container) return;

    if (cartItems.length === 0) {
        container.innerHTML = "<p>Your reservation cart is empty.</p>";
        updateCartCount();
        return;
    }

    container.innerHTML = cartItems.map((item, index) => {
        // High-precision fix: ensure the price is a clean number
        const cleanPrice = parseFloat(String(item.price).replace(/[^0-9.-]+/g, ""));

        return `
            <div class="cart-item">
                <div class="cart-info">
                    <h3>${item.year} ${item.make} ${item.model}</h3>
                    <p class="price-toggle" 
                       title="Click to switch between PHP and USD" 
                       data-index="${index}" 
                       data-currency="PHP" 
                       data-base-price="${cleanPrice}">
                       Price: ₱${cleanPrice.toLocaleString()}
                    </p>
                    <p class="reserved-date">Reserved: ${item.reservationDate || 'Recent'}</p>
                </div>
                <button class="remove-btn" data-index="${index}">[×] Remove</button>
            </div>
        `;
    }).join('');
}

// Unified Handler for clicks inside the cart list
function handleContainerClick(e) {
    // Handle Currency Toggle
    const toggleEl = e.target.closest('.price-toggle');
    if (toggleEl) {
        toggleCurrency(toggleEl);
        return; // Stop here if we found a toggle
    }

    // Handle Remove Button
    const removeBtn = e.target.closest('.remove-btn');
    if (removeBtn) {
        const index = removeBtn.getAttribute('data-index');
        if (confirm("Remove this vehicle from your reservations?")) {
            removeFromCart(index);
        }
    }
}

function toggleCurrency(element) {
    const basePrice = parseFloat(element.getAttribute('data-base-price'));
    const currentCurrency = element.getAttribute('data-currency');

    if (currentCurrency === "PHP") {
        const usdPrice = basePrice * PHP_TO_USD;
        element.textContent = `Price: $${usdPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        element.setAttribute('data-currency', 'USD');
        element.classList.add('usd-active');
    } else {
        element.textContent = `Price: ₱${basePrice.toLocaleString()}`;
        element.setAttribute('data-currency', 'PHP');
        element.classList.remove('usd-active');
    }
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('car-reservation-cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('car-reservation-cart', JSON.stringify(cart));
    
    renderCart(); // Re-draw the list
    updateCartCount(); // Update the header badge
}

init();