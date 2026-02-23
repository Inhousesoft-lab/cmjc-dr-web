import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget = env.VITE_PROXY_TARGET || "http://127.0.0.1:8080";

  return {
    plugins: [react()],
    base: "/",
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
        "/drugsafe_pp": {
          target: proxyTarget,
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
