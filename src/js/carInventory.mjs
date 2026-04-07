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


// 1. Helper for placeholder images
function getCarImage(brand, id) {
    return `https://loremflickr.com/400/300/car,${brand.toLowerCase()}?lock=${id}`;
}

// 2. Main Fetch Function (NHTSA API)
export async function fetchModelsByMake(make) {
    const cleanMake = make.trim().toUpperCase();
    const cacheKey = `raw_models_${cleanMake}`;

    try {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) return JSON.parse(cached);

        const url = `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${cleanMake}?format=json`;
        const response = await fetch(url);

        if (!response.ok) throw new Error(`NHTSA API Error: ${response.status}`);

        const data = await response.json();
        const results = data.Results || [];

        sessionStorage.setItem(cacheKey, JSON.stringify(results));
        return results;
    } catch (error) {
        console.error("Inventory Fetch Error:", error);
        return []; // Always return an empty array on error, NOT HTML!
    }
}

// 3. Render Function (Building the HTML with Data Attributes)
export function renderCarList(cars) {
    // const container = document.getElementById('app'); 
    const container = document.getElementById('car-list-container');
    if (!container) return;

    const rate = window.currentExchangeRate || 56.20;

    if (cars.length === 0) {
        container.innerHTML = "<p>No vehicles found for this selection.</p>";
        return;
    }

    const html = cars.map(car => {
        const usdPrice = car.priceUSD || 25000;
        const phpPrice = (usdPrice * rate).toLocaleString();

        return `
            <div class="car-card">
                <div class="card-image-wrapper">
                    <img src="${car.image}" alt="${car.brand} ${car.model}" loading="lazy">
                </div>
                <div class="card-info">
                    <h3>${car.brand} ${car.model}</h3>
                    <div class="price-box">
                        <span class="price-usd">$${usdPrice.toLocaleString()}</span>
                        <span class="price-php">₱${phpPrice}</span>
                    </div>
                    <button class="view-btn detail-btn" 
                            data-brand="${car.brand}" 
                            data-model="${car.model}">
                        View Details
                    </button>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = `<div class="inventory-grid">${html}</div>`;
}

// 4. Filter Function (Fixed Syntax)
export async function filterInventoryByBrand(brandName) {
    console.log(`Filtering for: ${brandName}`);
    const models = await fetchModelsByMake(brandName);

   
    const formattedCars = models.slice(0, 12).map(m => {
        const stablePrice = getStickyPrice(m.Model_ID); // Get the "locked" price
        
        return {
            id: m.Model_ID,
            brand: m.Make_Name,
            model: m.Model_Name,
            priceUSD: stablePrice, // Use that same price here
            image: getCarImage(m.Make_Name, m.Model_ID)
        };
    });

    renderCarList(formattedCars);
}

export async function initInventory(limit = 8, brand = "TOYOTA") {
    await filterInventoryByBrand(brand); 
}