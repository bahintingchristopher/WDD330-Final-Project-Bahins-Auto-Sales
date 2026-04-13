import { loadHeaderFooter, getParam } from './utils.mjs';
import { getCarImage } from './gallery.mjs'; 
import { fetchModelsByMake } from './carInventory.mjs'; 
import { toggleCurrency } from './priceConversion.mjs';
import { getLiveExchangeRate } from './currency.js';

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
                // 1. SET BASIC TECHNICAL SPECS (NHTSA)
                document.querySelector('#spec-model').textContent = carData.Model_Name;
                document.querySelector('#spec-type').textContent = carData.VehicleTypeName || "Sedan/SUV";
                document.querySelector('#spec-id').textContent = carData.Model_ID;
                document.querySelector('#spec-brand').textContent = brand.toUpperCase();

                // fetching the live rate
                const rate = await getLiveExchangeRate();

                if (document.querySelector('#current-rate')) {
                    document.querySelector('#current-rate').textContent = rate.toFixed(2);
                }


                // 2. FETCH ENRICHED DATA (PIXABAY OBJECT)
                // Since getCarImage now returns an object {url, tags, likes, views, author}
                const imageData = await getCarImage(brand, model);
                
                const carImgElement = document.querySelector('#car-image');
                if (carImgElement) carImgElement.src = imageData.url; // Use the .url property

                // 3. REPLACE RANDOM DATA WITH DIRECT API ATTRIBUTES
                // Instead of Math.random(), we use the Pixabay data for extra attributes
                if(document.querySelector('#spec-year')) document.querySelector('#spec-year').textContent = "2020";
                
                // Show 'likes' and 'views' as new direct attributes on the details page
                if(document.querySelector('#spec-likes')) document.querySelector('#spec-likes').textContent = imageData.likes;
                if(document.querySelector('#spec-views')) document.querySelector('#spec-views').textContent = imageData.views.toLocaleString();
                
                // Use the Tags as "Features"
                const description = `This ${brand.toUpperCase()} ${model.toUpperCase()} is a verified vehicle entry. Keywords: ${imageData.tags}. Photo credit: ${imageData.author}.`;
                document.querySelector('#car-description').textContent = description;

                // 4. PRICE HANDLING (LOCALSTORAGE)
                const priceBook = JSON.parse(localStorage.getItem('car_price_book')) || {};
                const carIdKey = String(carData.Model_ID).trim();
                const usdPrice = priceBook[carIdKey] || 25000;

                const priceElement = document.querySelector('#car-price');
                if (priceElement) {
                    priceElement.classList.add('price-toggle');
                    priceElement.setAttribute('data-base-price', usdPrice);
                    priceElement.setAttribute('data-currency', 'USD');
                    priceElement.textContent = `$${usdPrice.toLocaleString()}`;
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
                year: document.querySelector('#spec-year')?.textContent || "2020",
                fuel: "Gasoline",
                transmission: "Automatic"
            });

            
            const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
            const targetPath = 'src/static/reserveNow/reserveNow.html';

            
            window.location.href = `${cleanBase}${targetPath}?${params.toString()}`;
        });
    }
}  

 
document.addEventListener('click', async (e) => {
    const toggleEl = e.target.closest('.price-toggle');
    if (toggleEl) {
        await toggleCurrency(toggleEl);
    }
});

document.addEventListener('DOMContentLoaded', init);