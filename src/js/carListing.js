import { loadHeaderFooter } from './utils.mjs';
import { fetchModelsByMake } from './carInventory.mjs';
import { getCarImage, renderCarCard } from './gallery.mjs';
 
import { generateRandomPrice, toggleCurrency } from './priceConversion.mjs';

// GLOBAL EVENT LISTENER (Outside of all functions) ---
document.addEventListener('click', (e) => {
    const toggleEl = e.target.closest('.price-toggle');
    if (toggleEl) {
        console.log("Price clicked!"); 
        toggleCurrency(toggleEl); // This uses the function imported from priceConversion.mjs
    }
});

async function init() {
    await loadHeaderFooter(); 
    await initInventory();
}

async function initInventory() {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedBrand = urlParams.get('brand'); 

    const titleElement = document.getElementById("brand-title");
    const container = document.getElementById("car-list-container");

    if (selectedBrand) {
        titleElement.textContent = `HOT DEALS: ${selectedBrand.toUpperCase()} INVENTORY`;
        try {
            const models = await getCarData(selectedBrand);
            if (models && models.length > 0) {
                // Limit to 12 for performance
                await renderInventoryList(container, selectedBrand, models.slice(0, 12));
            } else {
                container.innerHTML = `<p>No models found for ${selectedBrand}.</p>`;
            }
        } catch (error) {
            console.error("Error:", error);
            container.innerHTML = "<p>Error loading cars. Please try again.</p>";
        }
    } else {
        titleElement.textContent = "Browse Our Brands";
        container.innerHTML = "<p>Please select a brand from the home page.</p>";
    }
}

async function getCarData(brand) {
    const cacheKey = `models_${brand}`;
    const cachedData = sessionStorage.getItem(cacheKey);
    if (cachedData) return JSON.parse(cachedData);

    const models = await fetchModelsByMake(brand);
    sessionStorage.setItem(cacheKey, JSON.stringify(models));
    return models;
}

async function renderInventoryList(container, brand, carList) {
    container.innerHTML = ""; 
    
    // 1. Load the Price Book from LocalStorage
    let priceBook = JSON.parse(localStorage.getItem('car_price_book')) || {};
    let bookUpdated = false;

    const carCardPromises = carList.map(async (car) => {
        try {
            const modelName = car.Model_Name;
            // This ID must match the one used in Car Details
            const carKey = String(car.Model_ID); 
            const imageUrl = await getCarImage(brand, modelName);

            //If this specific car doesn't have a price yet, CREATE IT
            if (!priceBook[carKey]) {
                priceBook[carKey] = Math.floor(Math.random() * (45000 - 18000 + 1)) + 18000;
                bookUpdated = true;
            }

            //Always pull the price from the Book
            const usdPrice = priceBook[carKey];

            // Ensure renderCarCard is receiving the ID if needed for the data-attributes
            return renderCarCard(brand, modelName, imageUrl, usdPrice);
        } catch (err) { 
            console.error("Error rendering card:", err);
            return ""; 
        }
    });

    const allCards = await Promise.all(carCardPromises);

    //Save the Book back to LocalStorage ONLY if we added new prices
    if (bookUpdated) {
        localStorage.setItem('car_price_book', JSON.stringify(priceBook));
    }

    container.innerHTML = allCards.join('');

    //Re-attach button listeners
    const buttons = container.querySelectorAll('.detail-btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const carBrand = button.getAttribute('data-brand');
            const carModel = button.getAttribute('data-model');
            window.location.href = `../car-details/carDetails.html?brand=${carBrand}&model=${carModel}`;
        });
    });
}

document.addEventListener('DOMContentLoaded', init);