# Leverans B1-1 — Valv vision + inventering (ChatBox-equivalent)

**Datum:** 2026-06-15  
**Agent:** Cursor CHECKPOINT (ersätter Opus chatt 1)  
**Repomix:** `exports/repomix-valv/repomix-valv-komplett-2026-06-15.md`

---

## Sammanfattning

Valv har redan `ValvInputSuperModule` med tier primary/more, URL-synk i `ValvetRoutePage`, och förenklad `VaultSamlaHub`. Kvarvarande arbete: polish Fas 1C–1E, zonväljare forensik, export index.

Beslut sparade i:
- `docs/evaluations/2026-06-15-valv-vision-beslut.md`
- `docs/evaluations/2026-06-15-valv-ui-design-lock.md`

---

## Död kod / deprecated (Valv-relaterat)

| Fil | Status | Åtgärd |
|-----|--------|--------|
| `zones/ValvInboxZone.tsx` | @deprecated | Behåll re-export; granska via `valvMode=granska` |
| `InkastDirectPanel.tsx` | @deprecated | Defer — CaptureSuperModule kanon |
| `vaultTabs.ts` LEGACY_INBOX | Kommentar | Redirect → `granska` i route |
| `ValvZoneModulValjare` | LIVE | Saknade `forensik` i picker — **fix i B1** |
| `VaultMonsterPanel` etc. | **LOCKED** | Rör ej |

---

## LIVE kärna

- `VaultPage.tsx` — gate + `ValvInputSuperModule`
- `valvInputModes.ts` — 7 lägen, tier, `canonicalValvRoute`
- `ValvSuperModule.tsx` — zon-router
- `VaultSamlaHub.tsx` — inkast + pending badge + manuell post fold
- `ValvForensikZone.tsx` — progressive disclosure
