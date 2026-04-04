import { loadHeaderFooter, getParam } from './utils.mjs';
import { getCarImage } from './gallery.mjs'; 
import { fetchModelsByMake } from './carInventory.mjs'; 
import { toggleCurrency } from './priceConversion.mjs';

async function init() {
    await loadHeaderFooter();
    
    const brand = getParam('brand');
    const model = getParam('model');

    if (brand && model) {
        try {
            // 1. Set up the basic UI immediately
            document.querySelector('#car-title').textContent = `${brand.toUpperCase()} ${model.toUpperCase()}`;

            // 2. Fetch the data for this specific brand
            const allModels = await fetchModelsByMake(brand);
            
            // 3. Find the exact car (using trim() to avoid invisible spaces)
            const carData = allModels.find(m => 
                m.Model_Name.trim().toLowerCase() === model.trim().toLowerCase()
            );

            if (carData) {
                // Fill in Specifications
                document.querySelector('#spec-model').textContent = carData.Model_Name;
                document.querySelector('#spec-type').textContent = carData.VehicleTypeName || "Sedan/SUV";
                document.querySelector('#spec-id').textContent = carData.Model_ID;
                document.querySelector('#spec-brand').textContent = brand.toUpperCase();
                document.querySelector('#car-description').textContent = 
                    `This ${brand} ${model} is a top-tier vehicle. System ID: ${carData.Model_ID}`;

                // Fetch and display Image
                const imageUrl = await getCarImage(brand, model);
                const carImgElement = document.querySelector('#car-image');
                if (carImgElement) carImgElement.src = imageUrl;

                // --- THE PRICE SYNC LOGIC ---
                // Load the "Book" created by the Listing Page
                const priceBook = JSON.parse(localStorage.getItem('car_price_book')) || {};
                const carIdKey = String(carData.Model_ID).trim();

                // Look for the price. If not found, use a fixed fallback so we can spot errors.
                const usdPrice = priceBook[carIdKey] || 25000;

                const priceElement = document.querySelector('#car-price');
                if (priceElement) {
                    priceElement.classList.add('price-toggle');
                    priceElement.setAttribute('data-base-price', usdPrice);
                    priceElement.setAttribute('data-currency', 'USD');
                    priceElement.textContent = `$${usdPrice.toLocaleString()}`;
                    priceElement.style.cursor = 'pointer';
                    priceElement.style.fontWeight = 'bold';
                    
                    // Log to console for debugging
                    console.log(`Successfully synced Price for ID ${carIdKey}: $${usdPrice}`);
                }
            } else {
                console.warn("Match not found in API for model:", model);
            }
        } catch (err) {
            console.error("Failed to load details:", err);
        }
    }

    // --- RESERVE BUTTON LOGIC ---
    const reserveBtn = document.querySelector('.button-style'); 

    if (reserveBtn) {
        reserveBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Grab the synchronized data from the screen/attributes
            const currentBrand = document.querySelector('#spec-brand').textContent;
            const currentModel = document.querySelector('#spec-model').textContent;
            const currentPrice = document.querySelector('#car-price').getAttribute('data-base-price');
            const currentImage = document.querySelector('#car-image').src;
            const currentId = document.querySelector('#spec-id').textContent;

            // Pack the suitcase for the Reserve Now page
            const params = new URLSearchParams({
                id: currentId,
                make: currentBrand,
                model: currentModel,
                price: currentPrice,
                image: currentImage,
                year: "2025"
            });

            window.location.href = `/src/static/reserveNow/reserveNow.html?${params.toString()}`;
        });
    }
}

// Global Click Listener for Price Toggle
document.addEventListener('click', (e) => {
    const toggleEl = e.target.closest('.price-toggle');
    if (toggleEl) {
        toggleCurrency(toggleEl);
    }
});

document.addEventListener('DOMContentLoaded', init);