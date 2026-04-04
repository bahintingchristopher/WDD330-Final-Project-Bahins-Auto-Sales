export function initHeroSlider() {
    // Select the specific elements from index.html
    const heroImage = document.querySelector('.hero-image');
    const heroTitle = document.querySelector('.cta h1');
    const heroSubtitle = document.querySelector('.cta p');

    if (!heroImage) return; // Safety check

    // Data for hero slides - using local images and some from Unsplash for variety
    const slides = [
        {
            image: '/hero_image.webp',
            title: 'Find Your Dream Car Today!',
            subtitle: 'Explore our premium selection and experience the ride of your life.'
        },
        {
            image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
            title: 'Quality You Can Trust',
            subtitle: 'Every vehicle in our inventory is strictly inspected for your safety.'
        },
        {
            image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
            title: 'Best Deals in Cebu',
            subtitle: 'Get the most value for your money with Bahins Car Sales.'
        },
        {
            image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
            title: 'Best Deals in Cebu',
            subtitle: 'Get the most value for your money with Bahins Car Sales.'
        },
        {
            image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
            title: 'New Arrivals: SUVs',
            subtitle: 'Perfect for family trips across the island.'
        },
        {
            image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80',
            title: 'Fuel Efficient Sedans',
            subtitle: 'Save more on your daily commute in Lapu-Lapu City.'
        },
        {
            image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
            title: 'Premium Selection',
            subtitle: 'Experience luxury and performance on the road.'
        },
        {
            image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
            title: 'Certified Pre-Owned',
            subtitle: 'Quality inspected vehicles you can trust.'
        }

   ];

    let currentSlide = 0;

    function updateHero() {
        const slide = slides[currentSlide];

        // Update the image source
        heroImage.src = slide.image;
        
        // Update the text content
        if (heroTitle) heroTitle.textContent = slide.title;
        if (heroSubtitle) heroSubtitle.textContent = slide.subtitle;

        // Move to the next index
        currentSlide = (currentSlide + 1) % slides.length;
    }

    // Set a timer to change every 6 seconds
    setInterval(updateHero,2000);
}