import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget = "http://localhost:8080";
  const appBase = env.VITE_APP_BASE?.trim() || "/";

  return {
    plugins: [react()],
    base: appBase,
    server: {
      port: 3000,
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: {
            "*": "localhost",
          },
          cookiePathRewrite: {
            "*": "/",
          },
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
