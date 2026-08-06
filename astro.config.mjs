import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://andregiron.me",
  image: {
    domains: ["s.gravatar.com"],
  },
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
