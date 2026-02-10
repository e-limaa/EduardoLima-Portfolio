const fs = require('fs');
const path = require('path');

// Read the source tokens
const sourcePath = path.join(__dirname, '../limex-tokens.json');
const rawData = fs.readFileSync(sourcePath, 'utf8');
const tokens = JSON.parse(rawData);

// --- OKLCH to Hex Conversion Helpers ---
function oklchToHex(oklchStr) {
    // Parse "oklch(0.646 0.222 41.116)"
    // Allow optional spaces around values
    const match = oklchStr.match(/oklch\(\s*([\d\.]+)\s+([\d\.]+)\s+([\d\.]+)\s*\)/);
    if (!match) return oklchStr;

    const L = parseFloat(match[1]);
    const C = parseFloat(match[2]);
    const h = parseFloat(match[3]);

    // 1. OKLCH to OKLab
    // h is in degrees, convert to radians
    const hRad = h * (Math.PI / 180);
    const a = C * Math.cos(hRad);
    const bLab = C * Math.sin(hRad);

    // 2. OKLab to Linear sRGB (approximate matrix)
    // From http://www.ottosport.com/en/oklab-color-space.html or similar standard matrices
    const l_ = L + 0.3963377774 * a + 0.2158037573 * bLab;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * bLab;
    const s_ = L - 0.0894841775 * a - 1.2914855480 * bLab;

    const l = l_ * l_ * l_;
    const m = m_ * m_ * m_;
    const s = s_ * s_ * s_;

    const rLinear = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    const gLinear = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    const bLinear = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

    // 3. Linear sRGB to sRGB (Gamma correction)
    function toSRGB(c) {
        if (c <= 0.0031308) {
            return 12.92 * c;
        } else {
            return 1.055 * Math.pow(c, 1.0 / 2.4) - 0.055;
        }
    }

    let r = toSRGB(rLinear);
    let g = toSRGB(gLinear);
    let b = toSRGB(bLinear);

    // Clamp 0-1
    r = Math.max(0, Math.min(1, r));
    g = Math.max(0, Math.min(1, g));
    b = Math.max(0, Math.min(1, b));

    // 4. sRGB to Hex
    const rHex = Math.round(r * 255).toString(16).padStart(2, '0');
    const gHex = Math.round(g * 255).toString(16).padStart(2, '0');
    const bHex = Math.round(b * 255).toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`;
}
// ---------------------------------------

// Helper to check if a value is a color
function isColor(value) {
    return value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl') || value.startsWith('oklch');
}

// Helper to check if a value is a dimension (spacing, radius)
function isDimension(key, value) {
    return key.includes('spacing') || key.includes('radius') || key.includes('fontSize');
}

// Helper to convert rem to px (assuming 16px root)
function convertRemToPx(value) {
    if (typeof value === 'string' && value.includes('rem')) {
        const remValue = parseFloat(value.replace('rem', ''));
        return remValue * 16;
    }
    return value;
}

// Helper to resolve calc() strings
function resolveCalc(value) {
    if (typeof value === 'string' && value.startsWith('calc(')) {
        // Remove calc() wrapper
        let inner = value.slice(5, -1);
        // Replace rem with * 16
        inner = inner.replace(/(\d+(?:\.\d+)?)rem/g, (match, p1) => {
            return `${parseFloat(p1) * 16}`;
        });
        // Remove px units for calculation
        inner = inner.replace(/px/g, '');

        try {
            // Safe eval for simple math
            return eval(inner);
        } catch (e) {
            console.warn(`Failed to resolve calc: ${value}`);
            return value;
        }
    }
    return value;
}

// Helper to determine type
function getType(key, value) {
    if (isColor(value)) return 'color';
    if (key.includes('spacing') || key.includes('radius') || key.includes('fontSize')) return 'number';
    if (key.includes('fontFamily')) return 'string';
    if (key.includes('fontWeight')) return 'number';
    return 'string';
}

const primitives = {};
const light = {};
const dark = {};

// Process all keys
Object.entries(tokens).forEach(([key, value]) => {
    // Keep dots in keys as requested
    const parts = key.split('/');
    const cleanKey = parts.join('/');

    // Determine target collection based on prefix
    if (key.startsWith('primitives/')) {
        let finalValue = value;
        let finalType = getType(key, value);

        // Convert OKLCH to Hex if needed
        if (typeof value === 'string' && value.startsWith('oklch')) {
            finalValue = oklchToHex(value);
            // Verify if conversion worked, otherwise keep original
        }

        // Convert dimensions
        if (isDimension(key, value)) {
            finalValue = resolveCalc(value);
            finalValue = convertRemToPx(finalValue);
            if (typeof finalValue === 'string' && finalValue.includes('px')) {
                finalValue = parseFloat(finalValue.replace('px', ''));
            }
        }

        primitives[cleanKey.replace('primitives/', '')] = {
            $type: finalType,
            $value: finalValue
        };
    } else if (key.startsWith('semantic/light/')) {
        let finalValue = value;
        // Restore Alias Logic
        if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
            const ref = value.slice(1, -1);
            const aliasKey = ref.replace(/\./g, '/');
            // Use alias reference
            finalValue = `{${aliasKey}}`;
        }

        light[cleanKey.replace('semantic/light/', '')] = {
            $type: getType(key, value),
            $value: finalValue
        };

        if (
            key.includes('border') ||
            key.includes('background') ||
            key.includes('text') ||
            key.includes('foreground') ||
            key.includes('ring') ||
            key.includes('chart') ||
            key.includes('action')
        ) {
            light[cleanKey.replace('semantic/light/', '')].$type = 'color';
        }

    } else if (key.startsWith('semantic/dark/')) {
        let finalValue = value;
        // Restore Alias Logic
        if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
            const ref = value.slice(1, -1);
            const aliasKey = ref.replace(/\./g, '/');
            // Use alias reference
            finalValue = `{${aliasKey}}`;
        }

        dark[cleanKey.replace('semantic/dark/', '')] = {
            $type: getType(key, value),
            $value: finalValue
        };

        if (
            key.includes('border') ||
            key.includes('background') ||
            key.includes('text') ||
            key.includes('foreground') ||
            key.includes('ring') ||
            key.includes('chart') ||
            key.includes('action')
        ) {
            dark[cleanKey.replace('semantic/dark/', '')].$type = 'color';
        }
    }
});

// Write files
fs.writeFileSync(path.join(__dirname, '../limex-primitives.json'), JSON.stringify(primitives, null, 2));
fs.writeFileSync(path.join(__dirname, '../limex-light.json'), JSON.stringify(light, null, 2));
fs.writeFileSync(path.join(__dirname, '../limex-dark.json'), JSON.stringify(dark, null, 2));

console.log('Successfully generated Figma token files.');
