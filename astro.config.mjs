import { defineConfig } from "astro/config";

export default defineConfig({
  site: "http://andregiron.me",
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
