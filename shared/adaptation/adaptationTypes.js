"use strict";
/**
 * Adaptation Core — delade typer (client + Cloud Functions).
 * Lager 1: preferenser, signaler, append-only audit (ej semantisk RAG).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ADAPTATION_PREFS = exports.ADAPTATION_LAYER_FLAG = void 0;
exports.ADAPTATION_LAYER_FLAG = 'adaptation_layer_v1';
exports.DEFAULT_ADAPTATION_PREFS = {
    coachTone: 'standard',
    uiDensity: 'normal',
    routingDefaults: {},
    dismissedHints: [],
    inferredSignals: {},
};
//# sourceMappingURL=adaptationTypes.js.map