   // vite.config.js
   import { defineConfig } from 'vite';

   export default defineConfig({
     css: {
       preprocessorOptions: {
         scss: {
           additionalData: `@import "src/styles/variables.scss";` // Optional: Import global variables
         }
       }
     }
   });