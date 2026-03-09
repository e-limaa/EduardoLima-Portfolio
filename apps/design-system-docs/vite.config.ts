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
      "@limia/design-system/styles.css": path.resolve(rootDir, "../../packages/limia-design-system/styles/globals.css"),
      "@limia/tokens/css": path.resolve(rootDir, "../../packages/limia-tokens/dist/tokens.css"),
      "@": path.resolve(rootDir, "./src"),
    },
  },
  server: {
    port: 3001,
    open: true,
  },
});
