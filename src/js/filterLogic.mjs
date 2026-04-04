import {filterInventoryByBrand } from './carInventory.mjs';

console.log("Filter Logic Script Loaded and Ready");

export function initBrandFilters(selector) {
    const brandContainer = document.querySelector(selector);
    
    if (!brandContainer) {
        console.error("Could not find the logo container with selector:", selector);
        return;
    }

    brandContainer.addEventListener('click', async (event) => {
        // This stops the browser from potentially refreshing or following a link
        event.preventDefault();

        // 1. Find the LI or the IMG that was clicked
        const target = event.target.closest('li');
        if (!target) return;

        // 2. Get the brand name (Check data-brand first, then the image alt)
        const brandName = target.getAttribute('data-brand') || 
                          target.querySelector('img')?.getAttribute('alt');

        if (!brandName) {
            console.warn("Clicked a logo but couldn't find a brand name.");
            return;
        }

        console.log("!!! LOGO CLICKED !!! Brand:", brandName);

        // 3. Clear the app area and show a loading message
        const displayArea = document.getElementById('app');
        if (displayArea) {
            displayArea.innerHTML = `<h2 class="loading-text">Loading ${brandName} inventory...</h2>`;
        }

        // Call the inventory logic  
        try {
            // Assuming the initInventory can accept a filter 
            await filterInventoryByBrand(brandName); 
            console.log("Inventory updated for:", brandName);
        } catch (err) {
            console.error("Failed to filter inventory:", err);
        }
    });
}