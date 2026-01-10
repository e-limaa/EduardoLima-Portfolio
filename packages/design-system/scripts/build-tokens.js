const fs = require('fs');
const path = require('path');

// Paths
const TOKENS_DIR = path.join(__dirname, '../tokens');
const OUTPUT_DIR = path.join(__dirname, '../styles');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'tokens.css');

// Load JSONs
const primitives = require(path.join(TOKENS_DIR, 'primitives.json'));
const semantic = require(path.join(TOKENS_DIR, 'semantic.json'));

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
 * THIS FILE IS AUTO-GENERATED. DO NOT EDIT MANUALY.
 * Source: packages/design-system/tokens/*.json
 */

:root {
`;

// Add Primitives (optional, if we want them available globally as vars)
// cssContent += `    /* Primitives */\n`;
// cssContent += toCssVars(primitives, '    ');

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

fs.writeFileSync(OUTPUT_FILE, cssContent);
console.log(`✅ Tokens built successfully to ${OUTPUT_FILE}`);

/* --- Generate TypeScript Types --- */
const TS_OUTPUT_FILE = path.join(__dirname, '../src/tokens/index.ts');
const TS_OUTPUT_DIR = path.dirname(TS_OUTPUT_FILE);

if (!fs.existsSync(TS_OUTPUT_DIR)) {
    fs.mkdirSync(TS_OUTPUT_DIR, { recursive: true });
}

// Generate Flattened Token Map for TS
// "background.default": "var(--background-default)"
const semanticLight = resolvedSemantic.light || {};
const flattenedSemantic = flattenObject(semanticLight);
const tsTokenMap = {};

Object.keys(flattenedSemantic).forEach(key => {
    // Convert dots to hyphens for the var name
    const varName = '--' + key.replace(/\./g, '-');
    tsTokenMap[key] = `var(${varName})`;
});

// Generate content
const tsContent = `/**
 * THIS FILE IS AUTO-GENERATED. DO NOT EDIT MANUALY.
 * Source: packages/design-system/tokens/semantic.json
 */

export const tokens = ${JSON.stringify(tsTokenMap, null, 4)} as const;

export type TokenPath = keyof typeof tokens;

// Domain Specific Types
export type ColorTokenPath = Extract<TokenPath, \`\${'background' | 'text' | 'border' | 'action' | 'chart'}\${string}\`>;
// Add Radius/Spacing if they exist in semantic
`;

fs.writeFileSync(TS_OUTPUT_FILE, tsContent);
console.log(`✅ TypeScript tokens built successfully to ${TS_OUTPUT_FILE}`);
