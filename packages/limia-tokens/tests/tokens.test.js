import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const TOKENS_DIR = path.join(__dirname, "../tokens");
const primitives = require(path.join(TOKENS_DIR, "primitives.json"));
const semantic = require(path.join(TOKENS_DIR, "semantic.json"));

function flattenObject(obj, prefix = "") {
    let result = {};
    for (const key in obj) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
            result = { ...result, ...flattenObject(obj[key], `${prefix}${key}.`) };
        } else {
            result[`${prefix}${key}`] = obj[key];
        }
    }
    return result;
}

const flatPrimitives = flattenObject(primitives);
const modes = Object.keys(semantic);

test("semantic defines light and dark modes", () => {
    assert.deepEqual(modes.sort(), ["dark", "light"]);
});

test("light and dark expose the same semantic tokens", () => {
    const light = Object.keys(flattenObject(semantic.light)).sort();
    const dark = Object.keys(flattenObject(semantic.dark)).sort();
    assert.deepEqual(dark, light);
});

for (const mode of modes) {
    test(`every ${mode} reference resolves to a primitive color`, () => {
        for (const [key, value] of Object.entries(flattenObject(semantic[mode]))) {
            const match = String(value).match(/^{(.+)}$/);
            assert.ok(match, `${mode}.${key} must reference a primitive, got ${value}`);
            assert.ok(match[1] in flatPrimitives, `${mode}.${key} references missing primitive ${match[1]}`);
            assert.ok(match[1].startsWith("color."), `${mode}.${key} must reference a color, got ${match[1]}`);
        }
    });
}

test("per-role typography maps only use roles from the scale", () => {
    const roles = Object.keys(primitives.typography.scale);
    for (const group of ["scaleMobile", "lineHeight", "letterSpacing"]) {
        for (const role of Object.keys(primitives.typography[group] || {})) {
            assert.ok(roles.includes(role), `typography.${group}.${role} is not in typography.scale`);
        }
    }
});

test("every typography role has a line height", () => {
    const roles = Object.keys(primitives.typography.scale);
    assert.deepEqual(Object.keys(primitives.typography.lineHeight).sort(), roles.sort());
});
