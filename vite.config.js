
import { defineConfig } from 'vite';

export default defineConfig({
    base: "./",
    build: {
        minify: "terser"
    },
    server: {
        headers: {
          "Cache-Control": "no-store",
        },
    },
})