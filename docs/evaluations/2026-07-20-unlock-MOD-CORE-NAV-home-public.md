# Unlock — MOD-CORE-NAV

**Datum:** 2026-07-20  
**Godkänd av:** Pontus (explicit: «push sen fortsätt planen» — push blockerad av e2e)  
approved: yes

## Syfte

Återställ publikt Hem (`/` utan AuthGate). `ProtectedModule` på Home bröt `smoke:e2e-locked-ux` / Obsidian tokens (förväntar `.home-page--basta-design` utan inloggning).

## Scope

- Endast `AppRoutes` Home-route: ta bort `ProtectedModule` runt `HomePage`
- Ingen övrig nav-ombyggnad

## Status

developing; re-lock efter e2e PASS + push.
