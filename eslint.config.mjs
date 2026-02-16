import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    ignores: ["dist/**", ".astro/**", "node_modules/**", "public/**"],
  },
  js.configs.recommended,
  ...astro.configs.recommended,
  eslintConfigPrettier,
];
