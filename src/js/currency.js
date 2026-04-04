// Get the key from Vite's environment variables in .env file
const API_KEY = import.meta.env.VITE_APILAYER_KEY; 
const FALLBACK_RATE = 56.20;

// for local testing, we can toggle this to avoid hitting the API limit during development. Set to false for production.
const IS_DEV_MODE = true; // this is only for my local testing, make this  false if for production

export async function getLiveExchangeRate() {
    // --- STEP 1: DEV MODE CHECK ---
    if (IS_DEV_MODE) {
        console.log("Dev Mode: Active. Using static fallback to save 100-request limit.");
        return FALLBACK_RATE;
    }

    // CACHE CHECKING ---
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const cachedData = localStorage.getItem('currency_cache');

    if (cachedData) {
        const parsed = JSON.parse(cachedData);
        if (parsed.month === currentMonth) {
            console.log("Using Cached Rate from today:", parsed.rate);
            return parsed.rate; 
        }
    }

    // API CALLING if no Errors  (Only happens once per month) ---
    console.log("Cache expired or missing. Fetching from APILayer...");
    try {
        const response = await fetch(`https://api.apilayer.com/exchangerates_data/latest?symbols=PHP&base=USD`, {
            headers: { "apikey": API_KEY }
        });
        
        if (!response.ok) throw new Error("API Limit or Network Error");
        
        const data = await response.json();
        const currency = "PHP";
        const rate = data.rates[currency];

        // Save the new rate with the current month in localStorage
        localStorage.setItem('currency_cache', JSON.stringify({ 
            month: currentMonth, 
            rate: rate 
        }));

        return rate;

    // If have errors above, we will catch it here and activaet the code bellow to prevent crashing.
    } catch (error) {
        console.error("API Error - Using Fallback Rate:", error);
        return FALLBACK_RATE;
    }
}