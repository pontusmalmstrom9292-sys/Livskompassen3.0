# Fas 20 — Zon 1: Valv + Security (beslutsmemo)

**Datum:** 2026-06-18 · **Läge:** READ-ONLY preflight · **Status:** Godkänd för våg 20.2

## Sammanfattning

Valv-säkerhet i stort PASS. Primär lucka: JWT `vaultUnlocked` rensas inte vid `invalidateSession` (Zero Footprint). App Check guards PASS; Console Enforce = manuell Pontus.

## IMPLEMENTERA → våg 20.2

- Rensa `vaultUnlocked`/`vaultExpiresAt` i `invalidateSession` (`functions/src/callables/agents.ts`)
- App Check runbook (docs)

## DEFER

Play Integrity biometri · hex P2 · firestore.rules (PMIR-stopp)

## Smoke

`smoke:valv-security`, `smoke:valv-gate`, `smoke:locked-ux`, `smoke:vault-worm`

## Deploy

`functions:invalidateSession` · `hosting` om klient ändras
