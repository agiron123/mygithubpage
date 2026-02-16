import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://andregiron.me",
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
        },
      },
    },
  },
});
