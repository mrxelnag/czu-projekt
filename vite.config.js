import path from "path";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import TanStackRouterVite from "@tanstack/router-plugin/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
export default defineConfig({
    server: {
        port: 5192,
    },
    // base: "/app/",
    plugins: [
        cloudflare(),
        TanStackRouterVite({ autoCodeSplitting: true }),
        viteReact(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
