// Current estimated exchange rate for 2026
const USD_TO_PHP_RATE = 56.45; 

/**
 * Converts a USD amount to PHP and returns a formatted string.
 */
export function convertToPHP(usdAmount) {
    if (!usdAmount || isNaN(usdAmount)) return "₱0";
    const phpTotal = usdAmount * USD_TO_PHP_RATE;

    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(phpTotal);
}

 
export function toggleCurrency(element) {
    const basePriceUSD = parseFloat(element.getAttribute('data-base-price'));
    const currentCurrency = element.getAttribute('data-currency');

    if (currentCurrency === "USD") {
        // Change to Peso
        element.textContent = `Price: ${convertToPHP(basePriceUSD)}`;
        element.setAttribute('data-currency', 'PHP');
        element.title = "Click to switch to USD"; // Helpful tooltip
    } else {
        // Change back to USD
        element.textContent = `Price: $${basePriceUSD.toLocaleString()}`;
        element.setAttribute('data-currency', 'USD');
        element.title = "Click to switch to PHP";
    }
}

/**
 * Simulates a database price for the car inventory.
 */
export function generateRandomPrice() {
    return Math.floor(Math.random() * (85000 - 15000 + 1) + 15000);
}