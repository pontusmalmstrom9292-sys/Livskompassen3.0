# Valv — SuperModule SPEC (Fas 1A–1E)

**Datum:** 2026-06-15  
**Status:** Godkänd — Cursor implementation  
**Kanon:** [`VALVET_SUPERMODULE_PLAN.md`](../specs/modules/VALVET_SUPERMODULE_PLAN.md)

---

## Wireframes (text)

### Lägesväljare (alltid synlig)

```
┌─────────────────────────────────────────────────────────┐
│ SANNINGSARKIV · [aktivt läge]                         │
│ [Inkast][Granska][Analysera][Kunskap]  [Mer… ▼]         │
├─────────────────────────────────────────────────────────┤
│ (innehåll per läge)                                     │
└─────────────────────────────────────────────────────────┘
```

### Samla (`spara`)

```
[ Dropzone — VaultInkastCompact ]
[ Väntar granskning (N) ]  → öppnar granska
[ details: Manuell post → VaultEntryForm ]
Sub-tabs: [ Arkiv ] [ Sök i arkiv ]
  → VaultLogList / Valv-Chat
```

### Granska

```
InboxReviewQueue (HITL) — full bredd, tillbaka → Inkast
```

### Analysera (locked)

```
Sub-tabs: [ Mönster ] [ Orkester ]
VaultMonsterPanel | VaultOrkesterPanel
```

### Kunskap (locked)

```
Sub-tabs: [ Kunskapsbank ] [ Aktörskarta ]
```

### Mer → vit / rapporter / forensik

- **vit:** `ValvVitZone`
- **rapporter:** Dossier
- **mer:** `ValvForensikZone` — 1 flik + «Visa fler»

---

## URL-kontrakt

| Intent | URL |
|--------|-----|
| Inkast + arkiv | `/valvet?valvMode=spara` |
| Granskningskö | `/valvet?valvMode=granska` |
| Mönster | `/valvet?valvMode=analysera&vaultTab=monster` |
| Orkester | `/valvet?valvMode=analysera&vaultTab=orkester` |
| Kunskapsbank | `/valvet?valvMode=kunskap&vaultTab=kunskapsbank` |
| Hamn analys | `/valvet?valvMode=mer&vaultTab=hamn_analys` |
| Legacy inbox | → `valvMode=granska` |

**Regel:** `vaultTab`-byte skriver `valvMode` via `resolveValvInputModeFromVaultTab`.

---

## Faser

### Fas 1A — URL-synk (MUST först)
`ValvetRoutePage`, `VaultPage`, `valvInputModes`, `valvNavCopy` (`sok` label)

### Fas 1B — Inkast-konsolidering
`ValvInputSuperModule` tier picker, `VaultSamlaHub` fold, deprecated inbox-zon

### Fas 1C — Forensik polish
`ValvForensikZone`, `ValvSuperModule` fallback, `ValvZoneModulValjare` + forensik

### Fas 1D — Nav & copy
`navTruth` `valv_granska`, `tabRegistry`, smoke asserts

### Fas 1E — Export
`vault/index.ts` exportera `parseValvInputMode`, `ValvInputMode`, `buildValvSearchParams`

---

## Manuell checklista

1. `/valvet?valvMode=granska` → InboxReviewQueue, inte Hamn
2. Granskningskö från Samla → samma kö, URL uppdateras
3. Drawer Mönster → `VaultMonsterPanel`
4. `/valvet?valvMode=mer&vaultTab=speglar_fordjupat` → rätt panel
5. Legacy `?vaultTab=sok` → Valv-Chat, inte inkorg
6. `smoke:locked-ux` PASS

---

## Locked (MUST NOT)

`VaultMonsterPanel`, `VaultOrkesterPanel`, `VaultKunskapsbankPanel`, `VaultAktorskartaPanel`, `vaultPatternScan.ts`
