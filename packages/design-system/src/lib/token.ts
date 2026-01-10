import { tokens, type TokenPath } from "../tokens";

/**
 * Returns the CSS variable reference for a given token path.
 * Usage: `style={{ color: t("text.primary") }}`
 */
export function t(path: TokenPath): string {
    return tokens[path];
}
