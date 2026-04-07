import { getLiveExchangeRate } from './currency.js';

export async function loadHeaderFooter() {
  try {
    // Use the base URL for GitHub Pages or local development
    const baseUrl = import.meta.env.BASE_URL;

    const headerHtml = await loadTemplate(`${baseUrl}partial/header.html`);
    const footerHtml = await loadTemplate(`${baseUrl}partial/footer.html`);

    const headerElement = document.getElementById("main-header");
    const footerElement = document.getElementById("main-footer");


    if (headerElement) {
        renderWithTemplate(headerHtml, headerElement);
        
  
        const cartLink = headerElement.querySelector("#cart-link");
        if (cartLink) {
            cartLink.href = `${baseUrl}src/static/reservationCart/reservationCart.html`;
        }

       const logoImg = headerElement.querySelector("#main-logo");
        if (logoImg) {
            logoImg.src = `${baseUrl}images/final_project_logo.svg`;
        }
    }

    if (footerElement) renderWithTemplate(footerHtml, footerElement);


    setTimeout(() => {
        updateCartCount();
    }, 50);

    const rate = await getLiveExchangeRate();
    window.currentExchangeRate = rate;
    
    console.log("Header and Footer injected!");
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

 
const localLogos = {
  "FORD": "images/ford-logo.png",
  "HONDA": "images/honda-logo.png",
  "MAZDA": "images/mazda-logo.png",
  "MITSUBISHI": "images/mitsubishi-logo.png",
  "NISSAN": "images/nissan-logo.png",
  "TESLA": "images/tesla-logo.png",
  "TOYOTA": "images/toyota-logo.png",
};

export async function loadDynamicBrands(parentElement) {
  if (!parentElement) return;

  const baseUrl = import.meta.env.BASE_URL; // Get base path for GitHub
  const brands = Object.keys(localLogos); 

   
  parentElement.innerHTML = brands.map(brand => `
    <a href="${baseUrl}src/static/car-listing/carListing.html?brand=${brand.toLowerCase()}" class="brand-item">
      <img src="${baseUrl}${localLogos[brand]}" alt="${brand} logo">
    </a>
  `).join('');
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('car-reservation-cart')) || [];
    const badge = document.querySelector('#cart-count');

    if (badge) {
        const count = cart.length;
        badge.textContent = count;
        badge.style.display = count > 0 ? "flex" : "none";
    }
}

export function formatPHP(usdAmount) {
    const rate = window.currentExchangeRate || 56.20;
    return `₱${(usdAmount * rate).toLocaleString()}`;
}