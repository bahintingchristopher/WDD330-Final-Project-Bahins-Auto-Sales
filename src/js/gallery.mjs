//Access Vite environment variable
const PIXABAY_KEY = import.meta.env.VITE_PIXABAY_KEY;

//Internal cache to save API calls within the same session
const imageCache = new Map();


//Fetches an image URL for a given make and model from Pixabay 
export async function getCarImage(make, model) {
  const cacheKey = `${make}_${model}`.toLowerCase();

  //Check internal memory cache first
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey);
  }

  const query = encodeURIComponent(`${make} ${model} car vehicle`);
  const url = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${query}&image_type=photo&orientation=horizontal&per_page=3&safesearch=true`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Pixabay limit reached or error");
    
    const data = await response.json();

    let finalUrl;
    if (data.hits && data.hits.length > 0) {
      finalUrl = data.hits[0].webformatURL;
    } else {
      //Fallback if no specific model found
      finalUrl = 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=600';
    }

    //Store in cache before returning
    imageCache.set(cacheKey, finalUrl);
    return finalUrl;
    
  } catch (error) {
    console.error("Gallery Image Fetch Error:", error);
    return 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
}


//   // Generates the HTML string for a single car card
//  export function renderCarCard(make, model, imageUrl, pricePHP) {
//   // Use a nice fallback if model name is missing
//   const displayName = model || "Featured Model";
  
//   return `
//     <article class="car-card">
//       <div class="image-container">
//         <img src="${imageUrl}" 
//              alt="Photo of ${make} ${displayName}" 
//              loading="lazy" 
//              onerror="this.src='https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=600'">
//       </div>
//       <div class="card-info">
//         <span class="make-label">${make}</span>
//         <h3 class="model-name">${displayName}</h3>
//         <p class="price-tag">Est. Price: <span class="price-val">₱${pricePHP}</span></p>
//         <button class="detail-btn" aria-label="View details for ${make} ${displayName}">View Details</button>
//       </div>
//     </article>
//   `;
// }

// Inside the gallery.mjs 
// Generates the HTML string for a single car card
export function renderCarCard(make, displayName, imageUrl, usdPrice) {
  // Ensure we have a clean number for the data-attribute
  const basePrice = Number(usdPrice);

  return `
    <div class="car-card">
      <div class="image-container">
        <img src="${imageUrl}" 
             alt="${make} ${displayName}" 
             loading="lazy"
             onerror="this.src='https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=600'">
      </div>
      <div class="card-content">
        <span class="make-label">${make}</span>
        <h3>${displayName}</h3>
        
        <p class="price-toggle" 
           data-base-price="${basePrice}" 
           data-currency="USD" 
           title="Click to switch to PHP">
           Price: $${basePrice.toLocaleString()}
        </p>
        
        <button class="detail-btn" 
                data-brand="${make}" 
                data-model="${displayName}"
                aria-label="View details for ${make} ${displayName}">
          View Details
        </button>
      </div>
    </div>
  `;
}