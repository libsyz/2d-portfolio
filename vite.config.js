
import { defineConfig } from 'vite';

export default defineConfig({
    base: "./",
    build: {
        minify: "terser",
        rollupOptions: {
            input: {
              main: "index.html",
              mobile: "mobile.html",
            },
          }
    },
    server: {
        headers: {
          "Cache-Control": "no-store",
        },
    },
})