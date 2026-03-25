const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const primitivesPath = path.join(rootDir, 'packages', 'limia-tokens', 'tokens', 'primitives.json');
const semanticPath = path.join(rootDir, 'packages', 'limia-tokens', 'tokens', 'semantic.json');

const primitives = JSON.parse(fs.readFileSync(primitivesPath, 'utf8'));
const semantic = JSON.parse(fs.readFileSync(semanticPath, 'utf8'));

function flattenObject(obj, prefix = '') {
    const result = {};

    Object.entries(obj).forEach(([key, value]) => {
        const nextKey = prefix ? `${prefix}/${key}` : key;

        if (value && typeof value === 'object' && !Array.isArray(value)) {
            Object.assign(result, flattenObject(value, nextKey));
            return;
        }

        result[nextKey] = value;
    });

    return result;
}

function setNested(obj, keys, value) {
    let current = obj;

    for (let index = 0; index < keys.length - 1; index += 1) {
        const key = keys[index];
        if (!current[key]) current[key] = {};
        current = current[key];
    }

    current[keys[keys.length - 1]] = value;
}

function isColorString(value) {
    return typeof value === 'string' && (
        value.startsWith('#') ||
        value.startsWith('rgb') ||
        value.startsWith('hsl') ||
        value.startsWith('oklch')
    );
}

function hexToFigmaColor(hex) {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.slice(0, 2), 16) / 255;
    const g = parseInt(clean.slice(2, 4), 16) / 255;
    const b = parseInt(clean.slice(4, 6), 16) / 255;

    return {
        colorSpace: 'srgb',
        components: [r, g, b],
        alpha: 1,
        hex: `#${clean.toUpperCase()}`
    };
}

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
    const s_ = L - 0.0894841775 * a - 1.291485548 * bLab;

    const l = l_ ** 3;
    const m = m_ ** 3;
    const s = s_ ** 3;

    let rLin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    let gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    let bLin = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

    function toSRGB(channel) {
        return channel <= 0.0031308
            ? 12.92 * channel
            : 1.055 * Math.pow(channel, 1 / 2.4) - 0.055;
    }

    rLin = Math.max(0, Math.min(1, toSRGB(rLin)));
    gLin = Math.max(0, Math.min(1, toSRGB(gLin)));
    bLin = Math.max(0, Math.min(1, toSRGB(bLin)));

    const rHex = Math.round(rLin * 255).toString(16).padStart(2, '0');
    const gHex = Math.round(gLin * 255).toString(16).padStart(2, '0');
    const bHex = Math.round(bLin * 255).toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`;
}

function toPx(value) {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string') return value;

    if (value.startsWith('calc(')) {
        let expression = value.slice(5, -1);
        expression = expression.replace(/(\d+(?:\.\d+)?)rem/g, (_, numberValue) => `${parseFloat(numberValue) * 16}`);
        expression = expression.replace(/px/g, '');

        try {
            return Function(`return (${expression});`)();
        } catch {
            return value;
        }
    }

    if (value.endsWith('rem')) return parseFloat(value) * 16;
    if (value.endsWith('px')) return parseFloat(value);

    return value;
}

const primitiveFlat = flattenObject(primitives);

function resolvePrimitiveReference(reference) {
    const slashKey = reference.replace(/\./g, '/');
    return primitiveFlat[slashKey];
}

function resolveSemanticValue(value) {
    if (typeof value !== 'string') return value;

    const aliasMatch = value.match(/^\{(.+)\}$/);
    if (!aliasMatch) return value;

    const resolved = resolvePrimitiveReference(aliasMatch[1]);
    return resolved === undefined ? value : resolved;
}

function resolveObject(obj) {
    const result = Array.isArray(obj) ? [] : {};

    Object.entries(obj).forEach(([key, value]) => {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            result[key] = resolveObject(value);
            return;
        }

        result[key] = resolveSemanticValue(value);
    });

    return result;
}

function normalizeFigmaValue(value) {
    if (typeof value === 'string' && value.startsWith('oklch(')) {
        return oklchToHex(value) || value;
    }

    return value;
}

function toFigmaTokenValue(value) {
    const normalized = normalizeFigmaValue(value);

    if (isColorString(normalized)) {
        return {
            $type: 'color',
            $value: hexToFigmaColor(normalized)
        };
    }

    const px = toPx(normalized);
    if (typeof px === 'number' && Number.isFinite(px)) {
        return {
            $type: 'number',
            $value: px
        };
    }

    return {
        $type: 'string',
        $value: String(normalized)
    };
}

function buildPrimitiveFigmaTree() {
    const tree = {};

    Object.entries(primitiveFlat).forEach(([key, value]) => {
        setNested(tree, key.split('/'), toFigmaTokenValue(value));
    });

    return tree;
}

function buildSemanticFigmaTree(modeValues, rawModeValues) {
    const tree = {};
    const flatMode = flattenObject(modeValues);

    Object.entries(flatMode).forEach(([key, resolvedValue]) => {
        const rawSegments = key.split('/');
        const rawValue = rawSegments.reduce((current, segment) => current[segment], rawModeValues);
        const tokenEntry = toFigmaTokenValue(resolvedValue);
        const aliasMatch = typeof rawValue === 'string' && rawValue.match(/^\{(.+)\}$/);

        if (aliasMatch) {
            tokenEntry.$description = `Alias -> ${aliasMatch[1].replace(/\./g, '/')}`;
        }

        setNested(tree, rawSegments, tokenEntry);
    });

    return tree;
}

function buildAliasMappings() {
    const lightFlat = flattenObject(semantic.light);
    const darkFlat = flattenObject(semantic.dark);
    const semanticKeys = Array.from(new Set([
        ...Object.keys(lightFlat),
        ...Object.keys(darkFlat)
    ])).sort();

    return semanticKeys.map((key) => {
        const lightRaw = lightFlat[key];
        const darkRaw = darkFlat[key];
        const lightAlias = typeof lightRaw === 'string' && lightRaw.match(/^\{(.+)\}$/)
            ? lightRaw.slice(1, -1).replace(/\./g, '/')
            : '(valor direto)';
        const darkAlias = typeof darkRaw === 'string' && darkRaw.match(/^\{(.+)\}$/)
            ? darkRaw.slice(1, -1).replace(/\./g, '/')
            : '(valor direto)';

        return {
            semantic: key,
            light: lightAlias,
            dark: darkAlias
        };
    });
}

const semanticResolved = {
    light: resolveObject(semantic.light),
    dark: resolveObject(semantic.dark)
};

const figmaVariablesFlat = {
    primitives: Object.fromEntries(
        Object.entries(primitiveFlat).map(([key, value]) => [key, normalizeFigmaValue(value)])
    ),
    semantic: {
        light: Object.fromEntries(
            Object.entries(flattenObject(semanticResolved.light)).map(([key, value]) => [key, normalizeFigmaValue(value)])
        ),
        dark: Object.fromEntries(
            Object.entries(flattenObject(semanticResolved.dark)).map(([key, value]) => [key, normalizeFigmaValue(value)])
        )
    }
};

const consolidatedExport = {
    ds: 'Limia',
    generatedAt: new Date().toISOString(),
    source: {
        primitives: path.relative(rootDir, primitivesPath).replace(/\\/g, '/'),
        semantic: path.relative(rootDir, semanticPath).replace(/\\/g, '/')
    },
    tokens: {
        primitives,
        semanticRaw: semantic,
        semanticResolved
    },
    figmaVariablesFlat
};

const aliasMappings = buildAliasMappings();
const groupedMappings = aliasMappings.reduce((accumulator, mapping) => {
    const category = mapping.semantic.split('/')[0];
    if (!accumulator[category]) accumulator[category] = [];
    accumulator[category].push(mapping);
    return accumulator;
}, {});

let aliasMapMarkdown = '# 🔗 Mapa de Aliases — Semantic → Primitives\n\n';
aliasMapMarkdown += 'Após importar os JSONs no Figma, use esta tabela para criar os aliases manualmente.\n';
aliasMapMarkdown += 'Para cada variável semântica, clique nela no Figma → troque o valor para **"Alias"** → selecione o primitivo indicado.\n\n';
aliasMapMarkdown += '> **Dica**: No Figma, a descrição de cada variável semântica já contém o alias (ex: `Alias -> color/zinc/100`).\n\n';
aliasMapMarkdown += '## Como importar\n\n';
aliasMapMarkdown += '1. Importe `limia-figma-primitives.json` → cria collection **Primitives**\n';
aliasMapMarkdown += '2. Importe `limia-figma-semantic-light.json` → cria collection **Semantic** (modo Light)\n';
aliasMapMarkdown += '3. Importe `limia-figma-semantic-dark.json` → **na mesma collection Semantic** → cria modo **Dark** como coluna\n\n';

Object.entries(groupedMappings).forEach(([category, mappings]) => {
    const title = category.charAt(0).toUpperCase() + category.slice(1);
    aliasMapMarkdown += `## ${title}\n\n`;
    aliasMapMarkdown += '| Variável Semântica | Light → Primitivo | Dark → Primitivo |\n';
    aliasMapMarkdown += '|---|---|---|\n';

    mappings.forEach((mapping) => {
        aliasMapMarkdown += `| \`${mapping.semantic}\` | \`${mapping.light}\` | \`${mapping.dark}\` |\n`;
    });

    aliasMapMarkdown += '\n';
});

const primitiveFigmaOutput = {
    ...buildPrimitiveFigmaTree(),
    $extensions: { 'com.figma.modeName': 'Primitives' }
};

const semanticLightFigmaOutput = {
    ...buildSemanticFigmaTree(semanticResolved.light, semantic.light),
    $extensions: { 'com.figma.modeName': 'Light' }
};

const semanticDarkFigmaOutput = {
    ...buildSemanticFigmaTree(semanticResolved.dark, semantic.dark),
    $extensions: { 'com.figma.modeName': 'Dark' }
};

fs.writeFileSync(
    path.join(rootDir, 'limia-ds-variables-for-figma.json'),
    `${JSON.stringify(consolidatedExport, null, 2)}\n`
);

fs.writeFileSync(
    path.join(rootDir, 'limia-figma-primitives.json'),
    `${JSON.stringify(primitiveFigmaOutput, null, 2)}\n`
);

fs.writeFileSync(
    path.join(rootDir, 'limia-figma-semantic-light.json'),
    `${JSON.stringify(semanticLightFigmaOutput, null, 2)}\n`
);

fs.writeFileSync(
    path.join(rootDir, 'limia-figma-semantic-dark.json'),
    `${JSON.stringify(semanticDarkFigmaOutput, null, 2)}\n`
);

fs.writeFileSync(
    path.join(rootDir, 'alias-map.md'),
    aliasMapMarkdown
);

console.log('✅ Arquivos gerados com sucesso:');
console.log('   → limia-ds-variables-for-figma.json');
console.log('   → limia-figma-primitives.json');
console.log('   → limia-figma-semantic-light.json');
console.log('   → limia-figma-semantic-dark.json');
console.log('   → alias-map.md');
