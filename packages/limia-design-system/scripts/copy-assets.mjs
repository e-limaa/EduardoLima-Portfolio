import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..");
const sourceCss = path.join(packageRoot, "styles", "globals.css");
const targetCss = path.join(packageRoot, "dist", "styles.css");

fs.mkdirSync(path.dirname(targetCss), { recursive: true });
fs.copyFileSync(sourceCss, targetCss);
