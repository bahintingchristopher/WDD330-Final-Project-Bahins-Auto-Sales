import { loadHeaderFooter, loadDynamicBrands } from './utils.mjs';
import { initHeroSlider } from './hero.mjs';

async function headerfooter7logo() {
    // Load header and footer
    await loadHeaderFooter();

    const path = window.location.pathname;

    //HOME PAGE LOGIC
      if (path.endsWith('index.html') || path === '/' || path.endsWith('/')) {
        
        const brandListElement = document.querySelector('.brand-logos');
        
        if (brandListElement) {
            await loadDynamicBrands(brandListElement);
        }
        // initialize from hero.js
        initHeroSlider(); 
    } 
}

document.addEventListener('DOMContentLoaded', headerfooter7logo);