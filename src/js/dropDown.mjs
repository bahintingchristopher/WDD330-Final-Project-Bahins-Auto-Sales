
const popularBrands = [
  "Toyota", "Ford", "Honda", "Tesla", "BMW", 
  "Mercedes-Benz", "Nissan", "Hyundai", "Kia", 
  "Mitsubishi", "Chevrolet", "Audi", "Volkswagen"
].sort();

export async function setupBrandDropdown(elementId) {
  const selectElement = document.getElementById(elementId);
  if (!selectElement) {
    console.warn(`Element with ID "${elementId}" not found.`);
    return;
  }

  selectElement.options.length = 1;

  const cachedMakes = localStorage.getItem('all_car_makes');

  if (cachedMakes) {
    console.log("Populating dropdown from local cache...");
    renderOptions(selectElement, JSON.parse(cachedMakes));
  } else {
    console.log("Populating dropdown with popular brands...");
    renderOptions(selectElement, popularBrands);
    
    fetchAndCacheAllMakes();
  }

  selectElement.value = "TOYOTA";
}


function renderOptions(select, brands) {
  brands.forEach(brand => {
    // Handle both simple strings and API objects (Make_Name)
    const brandName = typeof brand === 'string' ? brand : brand.Make_Name;
    
    // Avoid duplicates if they exist in the list
    if ([...select.options].some(opt => opt.text === brandName)) return;

    const option = document.createElement('option');
    option.value = brandName.toUpperCase(); // Normalize for the NHTSA API search
    option.textContent = brandName;
    select.appendChild(option);
  });
}

async function fetchAndCacheAllMakes() {
  try {
    const response = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json');
    if (!response.ok) throw new Error("NHTSA API unavailable");
    
    const data = await response.json();
    
    // Slice top 100 to keep the dropdown manageable and professional
    const allMakes = data.Results.slice(0, 100);
    localStorage.setItem('all_car_makes', JSON.stringify(allMakes));
    
    console.log("Full brand list cached for next visit.");
  } catch (error) {
    console.error("Background fetch failed:", error);
  }
}