import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";

const rootDir = __dirname;

export default defineConfig({
  plugins: [
    {
      enforce: "pre",
      ...mdx({ remarkPlugins: [remarkGfm], providerImportSource: "@mdx-js/react" }),
    },
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@limia/design-system": path.resolve(rootDir, "../../packages/limia-design-system/src/index.ts"),
      "@limia/tokens": path.resolve(rootDir, "../../packages/limia-tokens/src/index.ts"),
      "@limia/design-system/styles.css": path.resolve(rootDir, "../../packages/limia-design-system/styles/globals.css"),
      "@limia/tokens/css": path.resolve(rootDir, "../../packages/limia-tokens/styles/tokens.css"),
      "@": path.resolve(rootDir, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("motion") || id.includes("framer-motion")) return "vendor-motion";
            if (id.includes("react-router")) return "vendor-router";
            return "vendor";
          }
          return undefined;
        },
      },
    },
  },
  server: {
    port: 3001,
    open: true,
  },
});
