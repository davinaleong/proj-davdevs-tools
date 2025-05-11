// @ts-check
import { defineConfig } from "astro/config"

import tailwindcss from "@tailwindcss/vite"

import mdx from "@astrojs/mdx"

import { astroContent } from "@astrojs/content"

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss(), astroContent()],
  },

  integrations: [mdx()],
})
