import { getLiveExchangeRate } from './currency.js';

//  Converts a USD amount to PHP using the LIVE rate from currency.mjs
export async function convertToPHP(usdAmount) {
    if (!usdAmount || isNaN(usdAmount)) return "₱0";

    try {
        // Fetch the live rate (uses cache automatically from the currency logic)
        const rate = await getLiveExchangeRate();
        const phpTotal = usdAmount * rate;

        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(phpTotal);
    } catch (error) {
        console.error("Conversion Error:", error);
        return "₱0";
    }
}

// Toggles the UI element between USD and PHP display.
export async function toggleCurrency(element) {
    const basePriceUSD = parseFloat(element.getAttribute('data-base-price'));
    const currentCurrency = element.getAttribute('data-currency');

    if (currentCurrency === "USD") {
        // Change to PHP using live data
        const formattedPHP = await convertToPHP(basePriceUSD);
        
        element.textContent = `Price: ${formattedPHP}`;
        element.setAttribute('data-currency', 'PHP');
        element.title = "Click to switch back to USD";
    } else {
        // Change back to USD
        element.textContent = `Price: $${basePriceUSD.toLocaleString()}`;
        element.setAttribute('data-currency', 'USD');
        element.title = "Click to switch to PHP";
    }
}


export function generateRandomPrice() {
    return Math.floor(Math.random() * (85000 - 15000 + 1) + 15000);
}