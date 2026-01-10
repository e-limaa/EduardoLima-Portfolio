const fs = require('fs');
const path = require('path');

// --- Helper Functions ---

/**
 * Parses a hex color string (e.g., "#fff", "#ffffff") into [r, g, b]
 */
function hexToRgb(hex) {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
        cleanHex = cleanHex.split('').map(c => c + c).join('');
    }
    const num = parseInt(cleanHex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * Calculates the relative luminance of a color.
 * Formula: https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
function getLuminance(r, g, b) {
    const a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Calculates contrast ratio between two relative luminances.
 * Formula: https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 */
function getContrast(l1, l2) {
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Recursively flattens an object keys.
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

// --- Data Loading & Resolution ---

const TOKENS_DIR = path.join(__dirname, '../tokens');
const primitives = require(path.join(TOKENS_DIR, 'primitives.json'));
const semantic = require(path.join(TOKENS_DIR, 'semantic.json'));

const flattenedPrimitives = flattenObject(primitives);

/**
 * Resolves a token value to its final hex code.
 * Handles {reference} syntax.
 */
function resolveValue(value) {
    if (typeof value !== 'string') return value;
    const match = value.match(/^{(.+)}$/);
    if (match) {
        const refKey = match[1];
        if (flattenedPrimitives[refKey]) {
            return flattenedPrimitives[refKey];
        }
        return value; // Return as is if not found (might error later)
    }
    return value;
}

function resolveTokens(obj) {
    const flattened = flattenObject(obj);
    const resolved = {};
    for (const key in flattened) {
        resolved[key] = resolveValue(flattened[key]);
    }
    return resolved;
}

// --- Contrast Checking Logic ---

// The Test Matrix
// Each entry defines a Foreground and Background token path to check.
const CHECKS = [
    { fg: 'text.primary', bg: 'background.default', name: 'Body Text vs Background' },
    { fg: 'text.primary', bg: 'background.surface', name: 'Body Text vs Surface' },
    { fg: 'text.secondary', bg: 'background.default', name: 'Secondary Text vs Background' },
    { fg: 'action.primary.foreground', bg: 'action.primary.background', name: 'Primary Button' },
    { fg: 'action.destructive.foreground', bg: 'action.destructive.background', name: 'Destructive Button' },
];

function checkMode(modeName, tokens) {
    console.log(`\n🔍 Checking ${modeName.toUpperCase()} Mode...`);
    let errors = 0;

    CHECKS.forEach(check => {
        const fgHex = tokens[check.fg];
        const bgHex = tokens[check.bg];

        if (!fgHex || !bgHex) {
            console.warn(`  ⚠️  Skipping ${check.name}: Token missing (${check.fg} or ${check.bg})`);
            return;
        }

        const fgRgb = hexToRgb(fgHex);
        const bgRgb = hexToRgb(bgHex);

        const fgLum = getLuminance(...fgRgb);
        const bgLum = getLuminance(...bgRgb);

        const ratio = getContrast(fgLum, bgLum);
        const passed = ratio >= 4.5;
        const score = ratio.toFixed(2);

        if (passed) {
            console.log(`  ✅ ${check.name.padEnd(25)}: ${score}:1`);
        } else {
            console.error(`  ❌ ${check.name.padEnd(25)}: ${score}:1 (Expected 4.5:1)`);
            console.error(`     FG: ${check.fg} (${fgHex})`);
            console.error(`     BG: ${check.bg} (${bgHex})`);
            errors++;
        }
    });

    return errors;
}

// Run Checks
const lightTokens = resolveTokens(semantic.light);
const darkTokens = resolveTokens(semantic.dark);

let totalErrors = 0;

totalErrors += checkMode('light', lightTokens);
totalErrors += checkMode('dark', darkTokens);

console.log('\n----------------------------------------');
if (totalErrors > 0) {
    console.error(`💥 Found ${totalErrors} contrast violations.`);
    process.exit(1);
} else {
    console.log('🎉 All contrast checks passed!');
    process.exit(0);
}
