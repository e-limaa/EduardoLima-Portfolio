import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

const rootDir = __dirname;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, "");
  const apiProxyTarget = env.PORTFOLIO_API_PROXY_TARGET?.trim() || "http://127.0.0.1:3010";

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
      alias: {
        "@limia/design-system": path.resolve(rootDir, "../../packages/limia-design-system/src/index.ts"),
        "@limia/design-system-src": path.resolve(rootDir, "../../packages/limia-design-system/src"),
        "@limia/tokens": path.resolve(rootDir, "../../packages/limia-tokens/src/index.ts"),
        "@limia/design-system/styles.css": path.resolve(rootDir, "../../packages/limia-design-system/styles/globals.css"),
        "@limia/tokens/css": path.resolve(rootDir, "../../packages/limia-tokens/styles/tokens.css"),
        "@": path.resolve(rootDir, "./src")
      }
    },
    build: { target: "esnext" },
    server: {
      port: 3000,
      open: true,
      proxy: {
        "/api": {
          target: apiProxyTarget,
          changeOrigin: false
        }
      }
    }
  };
});
