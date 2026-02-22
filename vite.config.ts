import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    base: "/",
    server: {
      port: 3000,
      proxy: {
        "/api": {
          target: "http://localhost:8080", // local: http://localhost:8080 (default), or override via .env
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: {
            "*": "localhost",
          },
          cookiePathRewrite: {
            "*": "/",
          },
          // rewrite: (path) => path.replace(/^\/api/dr/, ""),
        },
      },
    },

    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "@shared": fileURLToPath(new URL("./shared", import.meta.url)),
      },
    },
    build: {
      chunkSizeWarningLimit: 100000000,
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          ".ts": "tsx",
          ".tsx": "tsx",
        },
      },
    },
  };
});
