
import { loadHeaderFooter, loadDynamicBrands } from './utils.mjs';
import { initHeroSlider } from './hero.mjs';

async function initSite() {
    // 1. Always load the Header and Footer (Every page needs this)
    await loadHeaderFooter();

    const path = window.location.pathname;

    // 2. THE STRICT GUARD
    // Only run if we are at the root / or index.html
    // AND we are NOT in the static folder
    const isActuallyHome = (path === '/' || path.endsWith('index.html') || path.endsWith('/WDD330-Final-Project-Bahins-Auto-Sales/')) && 
                           !path.includes('/static/');

    if (isActuallyHome) {
        console.log("Home Page Detected: Loading Hero and Brands");
        
        const brandListElement = document.querySelector('.brand-logos');
        if (brandListElement) {
            await loadDynamicBrands(brandListElement);
        }
        
        initHeroSlider(); 
    } else {
        console.log("Sub-page Detected: Skipping Hero Slider");
    }
}

document.addEventListener('DOMContentLoaded', initSite);