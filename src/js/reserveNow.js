import { loadHeaderFooter, getParam } from './utils.mjs';

async function init() {
    // This MUST happen first so the exchange rate is available
    await loadHeaderFooter();

    const carData = {
        id: getParam('id'),
        make: getParam('make'),
        model: getParam('model'),
        price: getParam('price'),
        image: getParam('image'),
        year: getParam('year') || '2025'
    };

    renderCarSummary(carData);
    setupForm(carData);
}

function renderCarSummary(car) {
    const container = document.querySelector('#car-summary');
    if (!container) return;

    // Use the live rate or fallback to 56.20 if API hasn't loaded yet
    const rate = window.currentExchangeRate || 56.20;

    if (car.make && car.model) {
        // Only define these once using the dynamic rate
        const usdValue = Number(car.price) || 12500;
        const phpValue = Math.round(usdValue * rate); 
        const decodedImg = car.image ? decodeURIComponent(car.image) : '';

        container.innerHTML = `
            <div class="summary-card">
                <div class="summary-image-wrapper">
                    <img src="${decodedImg}" 
                         alt="${car.make}" 
                         class="summary-img"
                         onerror="this.src='https://via.placeholder.com/400x300?text=Vehicle+Image'">
                </div>
                <div class="summary-details">
                    <span class="hold-badge">RESERVING UNIT</span>
                    <h2>${car.year} ${car.make.toUpperCase()}</h2>
                    <h3 class="model-name">${car.model.toUpperCase()}</h3>
                    
                    <p class="price-toggle" 
                       data-usd="${usdValue}" 
                       data-currency="USD"
                       title="Click to switch currency">
                       Price: $${usdValue.toLocaleString()}
                    </p>
                    
                    <div class="reminder-box">
                        <p><strong>Note:</strong> This unit is held for 48 hours.</p>
                    </div>
                </div>
            </div>
        `;
        
        initPriceToggle();
        
    } else {
        container.innerHTML = `<p class="error">No vehicle selected. <a href="/">Return to Gallery</a></p>`;
    }
}

function initPriceToggle() {
    const priceEl = document.querySelector('.price-toggle');
    if (!priceEl) return;

    // Use the live rate here too
    const rate = window.currentExchangeRate || 56.20;

    priceEl.addEventListener('click', () => {
        const usd = Number(priceEl.getAttribute('data-usd'));
        const currentCurrency = priceEl.getAttribute('data-currency');

        if (currentCurrency === "USD") {
            priceEl.textContent = `Price: ₱${Math.round(usd * rate).toLocaleString()}`;
            priceEl.setAttribute('data-currency', 'PHP');
        } else {
            priceEl.textContent = `Price: $${usd.toLocaleString()}`;
            priceEl.setAttribute('data-currency', 'USD');
        }
    });
}

function setupForm(car) {
    const form = document.querySelector('#reservation-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const reservations = JSON.parse(localStorage.getItem('car-reservation-cart')) || [];
        const entry = {
            ...car,
            name: document.querySelector('#full-name').value,
            email: document.querySelector('#email').value,
            phone: document.querySelector('#phone').value,
            date: new Date().toISOString()
        };
        
        reservations.push(entry);
        localStorage.setItem('car-reservation-cart', JSON.stringify(reservations));
        
        alert("Reservation saved! Redirecting to your cart...");
        
        const baseUrl = import.meta.env.BASE_URL;
        const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
        window.location.href = `${cleanBase}src/static/reservationCart/reservationCart.html`;
    });
}

document.addEventListener('DOMContentLoaded', init);