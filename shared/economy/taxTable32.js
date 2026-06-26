"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaxAmount = getTaxAmount;
exports.getTaxBracketForGross = getTaxBracketForGross;
/**
 * Skattetabell 32, kolumn 1 — månadslön 2026 (SKVFS 2025:20).
 * Källa: fixtures/taxTable32-2026.json (parsad från Skatteverket PDF).
 */
const taxTable32_2026_json_1 = __importDefault(require("./__fixtures__/taxTable32-2026.json"));
const BRACKETS = taxTable32_2026_json_1.default.brackets;
/** Preliminärskatt Tabell 32 kolumn 1 för månadsbrutto (kr). */
function getTaxAmount(monthlyGrossSek) {
    const gross = Math.round(monthlyGrossSek);
    if (gross <= 0)
        return 0;
    const bracket = BRACKETS.find((b) => gross >= b.min && gross <= b.max);
    if (bracket)
        return bracket.col1;
    const last = BRACKETS[BRACKETS.length - 1];
    if (gross > last.max)
        return last.col1;
    return 0;
}
function getTaxBracketForGross(monthlyGrossSek) {
    const gross = Math.round(monthlyGrossSek);
    return BRACKETS.find((b) => gross >= b.min && gross <= b.max) ?? null;
}
//# sourceMappingURL=taxTable32.js.map