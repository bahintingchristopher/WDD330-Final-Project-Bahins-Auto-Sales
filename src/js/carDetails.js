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
            document.querySelector('#car-title').textContent = `${brand.toUpperCase()} ${model.toUpperCase()}`;

            const allModels = await fetchModelsByMake(brand);
            
            const carData = allModels.find(m => 
                m.Model_Name.trim().toLowerCase() === model.trim().toLowerCase()
            );

            if (carData) {
                document.querySelector('#spec-model').textContent = carData.Model_Name;
                document.querySelector('#spec-type').textContent = carData.VehicleTypeName || "Sedan/SUV";
                document.querySelector('#spec-id').textContent = carData.Model_ID;
                document.querySelector('#spec-brand').textContent = brand.toUpperCase();
                document.querySelector('#car-description').textContent = 
                    `This ${brand} ${model} is a top-tier vehicle. System ID: ${carData.Model_ID}`;

                const imageUrl = await getCarImage(brand, model);
                const carImgElement = document.querySelector('#car-image');
                if (carImgElement) carImgElement.src = imageUrl;

                const priceBook = JSON.parse(localStorage.getItem('car_price_book')) || {};
                const carIdKey = String(carData.Model_ID).trim();
                const usdPrice = priceBook[carIdKey] || 25000;

                const priceElement = document.querySelector('#car-price');
                if (priceElement) {
                    priceElement.classList.add('price-toggle');
                    priceElement.setAttribute('data-base-price', usdPrice);
                    priceElement.setAttribute('data-currency', 'USD');
                    priceElement.textContent = `$${usdPrice.toLocaleString()}`;
                    priceElement.style.cursor = 'pointer';
                    priceElement.style.fontWeight = 'bold';
                }
            }
        } catch (err) {
            console.error("Failed to load details:", err);
        }
    }

   
    const reserveBtn = document.querySelector('.button-style'); 

    if (reserveBtn) {
        reserveBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const baseUrl = import.meta.env.BASE_URL;

            const currentBrand = document.querySelector('#spec-brand').textContent;
            const currentModel = document.querySelector('#spec-model').textContent;
            const currentPrice = document.querySelector('#car-price').getAttribute('data-base-price');
            const currentImage = document.querySelector('#car-image').src;
            const currentId = document.querySelector('#spec-id').textContent;

            const params = new URLSearchParams({
                id: currentId,
                make: currentBrand,
                model: currentModel,
                price: currentPrice,
                image: currentImage,
                year: "2025"
            });

            
            const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
            const targetPath = 'src/static/reserveNow/reserveNow.html';

            
            window.location.href = `${cleanBase}${targetPath}?${params.toString()}`;
        });
    }
}  

 
document.addEventListener('click', (e) => {
    const toggleEl = e.target.closest('.price-toggle');
    if (toggleEl) {
        toggleCurrency(toggleEl);
    }
});

document.addEventListener('DOMContentLoaded', init);