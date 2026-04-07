import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  
  // base: '/WDD330-Final-Project-Bahins-Auto-Sales/', 

  base: '/',
  
  root: './', 
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        carListing: resolve(__dirname, 'src/static/car-listing/carListing.html'),
        carDetails: resolve(__dirname, 'src/static/car-details/carDetails.html'),
        reserveNow: resolve(__dirname, 'src/static/reserveNow/reserveNow.html'),
        reservationCart: resolve(__dirname, 'src/static/reservationCart/reservationCart.html'),
        thankyou: resolve(__dirname, 'src/static/thankyou/thankyou.html'),
      },
    },
  },
});