import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Paths
const PACKAGE_ROOT = path.join(__dirname, "..");
const TOKENS_DIR = path.join(PACKAGE_ROOT, "tokens");
const OUTPUT_DIR = path.join(PACKAGE_ROOT, "dist");
const STYLES_DIR = path.join(PACKAGE_ROOT, "styles");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "tokens.css");
const STYLES_OUTPUT_FILE = path.join(STYLES_DIR, "tokens.css");

// Load JSONs
const primitives = require(path.join(TOKENS_DIR, "primitives.json"));
const semantic = require(path.join(TOKENS_DIR, "semantic.json"));

/**
 * Flattens an object into a single level map:
 * { "color.zinc.100": "#f4f4f5" }
 */
function flattenObject(obj, prefix = '') {
    let result = {};
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            const nested = flattenObject(obj[key], `${prefix}${key}.`);
            result = { ...result, ...nested };
        } else {
            result[`${prefix}${key}`] = obj[key];
        }
    }
    return result;
}

const flattenedPrimitives = flattenObject(primitives);

/**
 * Resolves a value like "{color.zinc.100}" to "#f4f4f5"
 * Handles direct values and references.
 */
function resolveValue(value) {
    if (typeof value !== 'string') return value;

    // Check for {reference} pattern
    const match = value.match(/^{(.+)}$/);
    if (match) {
        const refKey = match[1];
        if (flattenedPrimitives[refKey]) {
            return flattenedPrimitives[refKey];
        } else {
            console.warn(`⚠️ Warning: Reference not found: ${value}`);
            return value;
        }
    }
    return value;
}

/**
 * Recursively resolves an object's values
 */
function resolveObject(obj) {
    const result = {};
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            result[key] = resolveObject(obj[key]);
        } else {
            result[key] = resolveValue(obj[key]);
        }
    }
    return result;
}

/**
 * Converts a flattened object to CSS variables
 * prefix: 'semantic' (optional, to avoid collisions if needed, but we usually want semantic-background-default)
 * We will assume the keys in semantic.json are the variable names (e.g. background.default -> --background-default)
 */
function toCssVars(obj, indent = '    ') {
    const flattened = flattenObject(obj);
    let css = '';
    for (const key in flattened) {
        // Convert dots to hyphens: background.default -> --background-default
        const varName = '--' + key.replace(/\./g, '-');
        css += `${indent}${varName}: ${flattened[key]};\n`;
    }
    return css;
}

// --- Main Execution ---

// 1. Resolve Semantic Tokens
const resolvedSemantic = resolveObject(semantic);

// 2. Generate CSS Content
let cssContent = `/**
 * THIS FILE IS AUTO-GENERATED. DO NOT EDIT MANUALLY.
 * Source: packages/limia-tokens/tokens/*.json
 */

:root {
`;

// Add Spacing Primitives
if (primitives.spacing) {
    cssContent += `\n    /* Spacing */\n`;
    const flatSpacing = flattenObject(primitives.spacing);
    for (const key in flatSpacing) {
        const varName = '--spacing-' + key.replace(/\./g, '-');
        cssContent += `    ${varName}: ${flatSpacing[key]};\n`;
    }
}

// Add Typography Scale
if (primitives.typography && primitives.typography.scale) {
    cssContent += `\n    /* Typography Scale */\n`;
    const flatScale = flattenObject(primitives.typography.scale);
    for (const key in flatScale) {
        const varName = '--text-' + key.replace(/\./g, '-');
        cssContent += `    ${varName}: ${flatScale[key]};\n`;
    }
}

// Add Semantic Light (default)
const lightTokens = resolvedSemantic.light || {};
cssContent += `\n    /* Semantic - Light */\n`;
cssContent += toCssVars(lightTokens, '    ');
cssContent += `}\n`;

// Add Semantic Dark
if (resolvedSemantic.dark) {
    cssContent += `\n.dark {\n    /* Semantic - Dark */\n`;
    cssContent += toCssVars(resolvedSemantic.dark, '    ');
    cssContent += `}\n`;
}

// 3. Write File
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(STYLES_DIR)) {
    fs.mkdirSync(STYLES_DIR, { recursive: true });
}

fs.writeFileSync(OUTPUT_FILE, cssContent);
fs.writeFileSync(STYLES_OUTPUT_FILE, cssContent);
const semanticLight = resolvedSemantic.light || {};
const flattenedSemantic = flattenObject(semanticLight);
const tsTokenMap = {};

Object.keys(flattenedSemantic).forEach(key => {
    // Convert dots to hyphens for the var name
    const varName = '--' + key.replace(/\./g, '-');
    tsTokenMap[key] = `var(${varName})`;
});

console.log(`✅ Tokens built successfully to ${OUTPUT_FILE}`);

const JS_OUTPUT_FILE = path.join(OUTPUT_DIR, 'index.js');
const DTS_OUTPUT_FILE = path.join(OUTPUT_DIR, 'index.d.ts');

const jsContent = `/**
 * THIS FILE IS AUTO-GENERATED. DO NOT EDIT MANUALLY.
 * Source: packages/limia-tokens/tokens/semantic.json
 */

export const tokens = ${JSON.stringify(tsTokenMap, null, 2)};
`;

const dtsContent = `/**
 * THIS FILE IS AUTO-GENERATED. DO NOT EDIT MANUALLY.
 * Source: packages/limia-tokens/tokens/semantic.json
 */

export declare const tokens: {
${Object.keys(tsTokenMap)
    .map((key) => `  readonly "${key}": "${tsTokenMap[key]}";`)
    .join('\n')}
};

export type TokenPath = keyof typeof tokens;
export type ColorTokenPath = Extract<TokenPath, \`\${'background' | 'text' | 'border' | 'action' | 'chart' | 'sidebar'}\${string}\`>;
`;

fs.writeFileSync(JS_OUTPUT_FILE, jsContent);
fs.writeFileSync(DTS_OUTPUT_FILE, dtsContent);
console.log(`✅ Token modules built successfully to ${OUTPUT_DIR}`);
