const fs = require('fs');
const path = require('path');

// ── Read source tokens ──────────────────────────────────────────────
const sourcePath = path.join(__dirname, '../limex-tokens.json');
const tokens = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

// ── Helpers ─────────────────────────────────────────────────────────

/**
 * Convert hex color string to Figma's native color object.
 */
function hexToFigmaColor(hex) {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;

    return {
        colorSpace: 'srgb',
        components: [r, g, b],
        alpha: 1,
        hex: `#${clean.toUpperCase()}`
    };
}

/**
 * Convert oklch() string to hex.
 */
function oklchToHex(oklchStr) {
    const match = oklchStr.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
    if (!match) return null;

    const L = parseFloat(match[1]);
    const C = parseFloat(match[2]);
    const h = parseFloat(match[3]);

    const hRad = h * (Math.PI / 180);
    const a = C * Math.cos(hRad);
    const bLab = C * Math.sin(hRad);

    const l_ = L + 0.3963377774 * a + 0.2158037573 * bLab;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * bLab;
    const s_ = L - 0.0894841775 * a - 1.2914855480 * bLab;

    const l = l_ * l_ * l_;
    const m = m_ * m_ * m_;
    const s = s_ * s_ * s_;

    let rLin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    let gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    let bLin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

    function toSRGB(c) {
        return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1.0 / 2.4) - 0.055;
    }

    rLin = Math.max(0, Math.min(1, toSRGB(rLin)));
    gLin = Math.max(0, Math.min(1, toSRGB(gLin)));
    bLin = Math.max(0, Math.min(1, toSRGB(bLin)));

    const rH = Math.round(rLin * 255).toString(16).padStart(2, '0');
    const gH = Math.round(gLin * 255).toString(16).padStart(2, '0');
    const bH = Math.round(bLin * 255).toString(16).padStart(2, '0');

    return `#${rH}${gH}${bH}`;
}

/**
 * Convert rem / px / calc values to a raw px number.
 */
function toPx(value) {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string') return value;

    if (value.startsWith('calc(')) {
        let inner = value.slice(5, -1);
        inner = inner.replace(/(\d+(?:\.\d+)?)rem/g, (_, v) => `${parseFloat(v) * 16}`);
        inner = inner.replace(/px/g, '');
        try { return eval(inner); } catch { return value; }
    }
    if (value.includes('rem')) return parseFloat(value) * 16;
    if (value.includes('px')) return parseFloat(value);

    return value;
}

/**
 * Set a value at a nested path inside an object.
 */
function setNested(obj, keys, value) {
    let cur = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!cur[keys[i]]) cur[keys[i]] = {};
        cur = cur[keys[i]];
    }
    cur[keys[keys.length - 1]] = value;
}

/**
 * Check if value is a color string.
 */
function isColorString(v) {
    return typeof v === 'string' &&
        (v.startsWith('#') || v.startsWith('rgb') || v.startsWith('hsl') || v.startsWith('oklch'));
}

// ── ARQUIVO 1: Primitives ───────────────────────────────────────────

const primitivesTree = {};
const primitiveLookup = {}; // for resolving semantic aliases

Object.entries(tokens).forEach(([flatKey, rawValue]) => {
    if (!flatKey.startsWith('primitives/')) return;

    const relKey = flatKey.replace('primitives/', '');
    const segments = relKey.split('/');

    // Skip CSS var() references (e.g. fontFamily)
    if (typeof rawValue === 'string' && rawValue.startsWith('var(')) return;

    let resolved = rawValue;

    // Convert oklch → hex
    if (typeof resolved === 'string' && resolved.startsWith('oklch')) {
        resolved = oklchToHex(resolved) || resolved;
    }

    // Store for semantic alias resolution
    primitiveLookup[relKey] = resolved;

    if (isColorString(resolved)) {
        setNested(primitivesTree, segments, {
            $type: 'color',
            $value: hexToFigmaColor(resolved)
        });
    } else {
        const px = toPx(resolved);
        if (typeof px === 'number') {
            setNested(primitivesTree, segments, { $type: 'number', $value: px });
        } else {
            setNested(primitivesTree, segments, { $type: 'string', $value: String(resolved) });
        }
    }
});

// ── ARQUIVO 2: Semantic (Light + Dark, valores resolvidos + $description) ──

const lightTree = {};
const darkTree = {};

// Track alias mappings for reference guide
const aliasMappings = []; // { semantic, light, dark }

// Collect all semantic keys (from light, we assume dark has same keys)
const semanticKeys = new Set();
Object.keys(tokens).forEach(k => {
    if (k.startsWith('semantic/light/')) semanticKeys.add(k.replace('semantic/light/', ''));
    if (k.startsWith('semantic/dark/')) semanticKeys.add(k.replace('semantic/dark/', ''));
});

// Build light and dark alias lookups
const lightAliases = {};  // relKey → alias ref string
const darkAliases = {};

Object.entries(tokens).forEach(([flatKey, rawValue]) => {
    if (flatKey.startsWith('semantic/light/')) {
        const relKey = flatKey.replace('semantic/light/', '');
        if (typeof rawValue === 'string' && rawValue.startsWith('{') && rawValue.endsWith('}')) {
            lightAliases[relKey] = rawValue.slice(1, -1); // "color.zinc.100"
        }
    }
    if (flatKey.startsWith('semantic/dark/')) {
        const relKey = flatKey.replace('semantic/dark/', '');
        if (typeof rawValue === 'string' && rawValue.startsWith('{') && rawValue.endsWith('}')) {
            darkAliases[relKey] = rawValue.slice(1, -1);
        }
    }
});

function processSemanticTokens(prefix, target, aliasMap) {
    Object.entries(tokens).forEach(([flatKey, rawValue]) => {
        if (!flatKey.startsWith(prefix)) return;

        const relKey = flatKey.replace(prefix, '');
        const segments = relKey.split('/');

        let resolved = rawValue;
        let aliasRef = null;

        // Resolve alias references like "{color.zinc.100}" → lookup hex value
        if (typeof resolved === 'string' && resolved.startsWith('{') && resolved.endsWith('}')) {
            aliasRef = resolved.slice(1, -1);             // "color.zinc.100"
            const lookupKey = aliasRef.replace(/\./g, '/'); // "color/zinc/100"

            if (primitiveLookup[lookupKey] !== undefined) {
                resolved = primitiveLookup[lookupKey];
            }
        }

        // oklch fallback
        if (typeof resolved === 'string' && resolved.startsWith('oklch')) {
            resolved = oklchToHex(resolved) || resolved;
        }

        // Build token entry with resolved values + description
        let tokenEntry;
        const aliasPath = aliasRef ? aliasRef.replace(/\./g, '/') : null;
        const description = aliasPath ? `Alias → ${aliasPath}` : null;

        if (isColorString(resolved)) {
            tokenEntry = { $type: 'color', $value: hexToFigmaColor(resolved) };
        } else {
            const px = toPx(resolved);
            if (typeof px === 'number') {
                tokenEntry = { $type: 'number', $value: px };
            } else {
                tokenEntry = { $type: 'string', $value: String(resolved) };
            }
        }

        if (description) {
            tokenEntry.$description = description;
        }

        setNested(target, segments, tokenEntry);
    });
}

processSemanticTokens('semantic/light/', lightTree, lightAliases);
processSemanticTokens('semantic/dark/', darkTree, darkAliases);

// Build mappings table
semanticKeys.forEach(relKey => {
    const lightRef = lightAliases[relKey];
    const darkRef = darkAliases[relKey];
    aliasMappings.push({
        semantic: relKey,
        light: lightRef ? lightRef.replace(/\./g, '/') : '(valor direto)',
        dark: darkRef ? darkRef.replace(/\./g, '/') : '(valor direto)'
    });
});

// ── Write files ─────────────────────────────────────────────────────

const outDir = path.join(__dirname, '..');

// File 1: Primitives (single mode)
const primitivesOutput = {
    ...primitivesTree,
    $extensions: { 'com.figma.modeName': 'Primitives' }
};

// File 2a: Semantic Light (variables at root, not nested under "Light")
const lightOutput = {
    ...lightTree,
    $extensions: { 'com.figma.modeName': 'Light' }
};

// File 2b: Semantic Dark (same structure, different values)
const darkOutput = {
    ...darkTree,
    $extensions: { 'com.figma.modeName': 'Dark' }
};

fs.writeFileSync(
    path.join(outDir, 'limex-figma-primitives.json'),
    JSON.stringify(primitivesOutput, null, 2)
);

fs.writeFileSync(
    path.join(outDir, 'limex-figma-semantic-light.json'),
    JSON.stringify(lightOutput, null, 2)
);

fs.writeFileSync(
    path.join(outDir, 'limex-figma-semantic-dark.json'),
    JSON.stringify(darkOutput, null, 2)
);

// File 3: Alias mapping guide (Markdown)
let md = `# 🔗 Mapa de Aliases — Semantic → Primitives\n\n`;
md += `Após importar os JSONs no Figma, use esta tabela para criar os aliases manualmente.\n`;
md += `Para cada variável semântica, clique nela no Figma → troque o valor para **"Alias"** → selecione o primitivo indicado.\n\n`;
md += `> **Dica**: No Figma, a descrição de cada variável semântica já contém o alias (ex: \`Alias → color/zinc/100\`).\n\n`;
md += `## Como importar\n\n`;
md += `1. Importe \`limex-figma-primitives.json\` → cria collection **Primitives**\n`;
md += `2. Importe \`limex-figma-semantic-light.json\` → cria collection **Semantic** (modo Light)\n`;
md += `3. Importe \`limex-figma-semantic-dark.json\` → **na mesma collection Semantic** → cria modo **Dark** como coluna\n\n`;

// Group by category
const categories = {};
aliasMappings.forEach(m => {
    const cat = m.semantic.split('/')[0];
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(m);
});

Object.entries(categories).forEach(([cat, mappings]) => {
    md += `## ${cat.charAt(0).toUpperCase() + cat.slice(1)}\n\n`;
    md += `| Variável Semântica | Light → Primitivo | Dark → Primitivo |\n`;
    md += `|---|---|---|\n`;
    mappings.forEach(m => {
        md += `| \`${m.semantic}\` | \`${m.light}\` | \`${m.dark}\` |\n`;
    });
    md += `\n`;
});

fs.writeFileSync(path.join(outDir, 'alias-map.md'), md);

// Clean up old single semantic file
const oldFile = path.join(outDir, 'limex-figma-semantic.json');
if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);

console.log('✅ Arquivos gerados com sucesso:');
console.log('   → limex-figma-primitives.json      (collection: Primitives)');
console.log('   → limex-figma-semantic-light.json   (collection: Semantic, modo: Light)');
console.log('   → limex-figma-semantic-dark.json    (collection: Semantic, modo: Dark)');
console.log('   → alias-map.md                      (guia de referência para aliases)');
console.log('');
console.log('📋 Para importar no Figma:');
console.log('   1. Importe primitives → cria collection Primitives');
console.log('   2. Importe semantic-light → cria collection Semantic (modo Light)');
console.log('   3. Importe semantic-dark na MESMA collection Semantic → cria modo Dark');
