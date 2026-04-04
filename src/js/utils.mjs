import { getLiveExchangeRate } from './currency.js';

export async function loadHeaderFooter() {
  try {
    const headerHtml = await loadTemplate("/partial/header.html");
    const footerHtml = await loadTemplate("/partial/footer.html");

    const headerElement = document.getElementById("main-header");
    const footerElement = document.getElementById("main-footer");

    if (headerElement) renderWithTemplate(headerHtml, headerElement);
    if (footerElement) renderWithTemplate(footerHtml, footerElement);

    // badge update after header is loaded
    setTimeout(() => {
        updateCartCount();
    }, 50);

    const rate = await getLiveExchangeRate();
    window.currentExchangeRate = rate;
    
    // if no errorr, this log will show the header/foother, counter and the current exchange rate.
    console.log("Header and Footer injected!");

    // if have error, activate this code below.
  } catch (error) {
    console.error("Error loading partials:", error);
  }
  
}
 
export async function loadTemplate(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Could not load template at ${path}`);
  }
  return await response.text();
}


export function renderWithTemplate(template, parentElement) {
  parentElement.innerHTML = template; 
}

// Define logos with correct Vite paths
const localLogos = {
  "FORD": "/images/ford-logo.png",
  "HONDA": "/images/honda-logo.png",
  "MAZDA": "/images/mazda-logo.png",
  "MITSUBISHI": "/images/mitsubishi-logo.png",
  "NISSAN": "/images/nissan-logo.png",
  "TESLA": "/images/tesla-logo.png",
  "TOYOTA": "/images/toyota-logo.png",
};


export async function loadDynamicBrands(parentElement) {
  if (!parentElement) return;

  //set our API DATA linked from carlisting.html to our locallogo object.
  const brands = Object.keys(localLogos); 

  // This creates all 7 links immediately
  parentElement.innerHTML = brands.map(brand => `
    <a href="/src/static/car-listing/carListing.html?brand=${brand.toLowerCase()}" class="brand-item">
      <img src="${localLogos[brand]}" alt="${brand} logo">
    </a>
  `).join('');
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// update cart count in header
export function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('car-reservation-cart')) || [];
    const badge = document.querySelector('#cart-count');

    if (badge) {
        const count = cart.length;
        badge.textContent = count;
        
        // Only show the badge if there is at least 1 item
        if (count > 0) {
            badge.style.display = "flex"; 
        } else {
            badge.style.display = "none";
        }
    }
}

// Public APIs – APILayer
export function formatPHP(usdAmount) {
    const rate = window.currentExchangeRate || 56.20;
    return `₱${(usdAmount * rate).toLocaleString()}`;
}