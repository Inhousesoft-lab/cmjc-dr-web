import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1"]);

function resolveProxyTarget(env: Record<string, string>) {
  const proxyTarget = env.VITE_PROXY_TARGET?.trim();
  if (proxyTarget) {
    if (/^https?:\/\//i.test(proxyTarget)) {
      return proxyTarget;
    }
    if (proxyTarget.startsWith("/")) {
      return "http://localhost:8080";
    }
    return `http://${proxyTarget.replace(/^\/+/, "")}`;
  }

  const apiBaseUrl = env.VITE_API_BASE_URL?.trim();
  if (apiBaseUrl && /^https?:\/\//i.test(apiBaseUrl)) {
    return apiBaseUrl;
  }

  return "http://localhost:8080";
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget = resolveProxyTarget(env);
  const proxyUrl = new URL(proxyTarget);
  const rewriteCookies = LOCAL_HOSTNAMES.has(proxyUrl.hostname);
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
          secure: proxyUrl.protocol === "https:",
          ...(rewriteCookies
            ? {
                cookieDomainRewrite: {
                  "*": "localhost",
                },
                cookiePathRewrite: {
                  "*": "/",
                },
              }
            : {}),
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
