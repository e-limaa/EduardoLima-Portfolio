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
        "figma:asset/fe1addf78ff4776eb2ba01a20bd652eabe95c942.png": path.resolve(rootDir, "./src/assets/fe1addf78ff4776eb2ba01a20bd652eabe95c942.webp"),
        "figma:asset/f8254b1f94d7f936b0be7dfd62c50373257cfd12.png": path.resolve(rootDir, "./src/assets/f8254b1f94d7f936b0be7dfd62c50373257cfd12.webp"),
        "figma:asset/ae81cf578fc1b70d1cd9b353a408f5971601e9a0.png": path.resolve(rootDir, "./src/assets/ae81cf578fc1b70d1cd9b353a408f5971601e9a0.webp"),
        "figma:asset/8926732e6d84f8a31a4ab7a603fb7f29d74326b8.png": path.resolve(rootDir, "./src/assets/8926732e6d84f8a31a4ab7a603fb7f29d74326b8.webp"),
        "figma:asset/0fd29a5a04bdb70fda1a96b5dccc2cb95458d271.png": path.resolve(rootDir, "./src/assets/0fd29a5a04bdb70fda1a96b5dccc2cb95458d271.webp"),
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
