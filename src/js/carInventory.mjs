import { getCarImage, renderCarCard } from './gallery.mjs';

// Ensurings the price never changes for a specific car ID
function getStickyPrice(carId) {
    let priceBook = JSON.parse(localStorage.getItem('car_price_book')) || {};
    

    if (priceBook[carId]) {
        return priceBook[carId];
    }

    // Generate a random price between $18,000 and $45,000
    const newPrice = Math.floor(Math.random() * (45000 - 18000 + 1)) + 18000;

    priceBook[carId] = newPrice;
    localStorage.setItem('car_price_book', JSON.stringify(priceBook));

    return newPrice;
}


export async function fetchModelsByMake(make) {
    const cleanMake = make.trim().toUpperCase();
    const cacheKey = `raw_models_${cleanMake}`;

    try {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) return JSON.parse(cached);

        // We use the 'getmodelsformake' endpoint
        const url = `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${cleanMake}?format=json`;
        const response = await fetch(url);
        const data = await response.json();
        const results = data.Results || [];

        sessionStorage.setItem(cacheKey, JSON.stringify(results));
        return results;
    } catch (error) {
        console.error("Inventory Fetch Error:", error);
        return [];
    }
}

// 3. Updated Filter Function (The Bridge)
export async function filterInventoryByBrand(brandName) {
    const container = document.getElementById('car-list-container');
    if (!container) return;

    const models = await fetchModelsByMake(brandName);
    
    // We only take the first 12 to avoid hitting the Pixabay limit too fast
    const selectedModels = models.slice(0, 12);

    // CRITICAL: We use Promise.all because we are fetching images for 12 cars at once
    const formattedCars = await Promise.all(selectedModels.map(async (m) => {
        const stablePrice = getStickyPrice(m.Model_ID);
        
        // FETCH THE SUPER-OBJECT (Attributes 6, 7, 8, 9, 10)
        const imageData = await getCarImage(m.Make_Name, m.Model_Name);

        return {
            id: m.Model_ID,          // Attr 1
            brand: m.Make_Name,      // Attr 2
            model: m.Model_Name,     // Attr 3
            makeId: m.Make_ID,       // Attr 4
            priceUSD: stablePrice,   // Business Logic
            imageData: imageData,    // Attr 6, 7, 8, 9 (The Pixabay Object)
            year: 2020               // Attr 5 (Direct from our search intent)
        };
    }));

    // 4. Render the List using the new renderCarCard function
    const html = formattedCars.map(car => 
        renderCarCard(car.brand, car.model, car.imageData, car.priceUSD)
    ).join('');

    container.innerHTML = `<div class="inventory-grid">${html}</div>`;
}