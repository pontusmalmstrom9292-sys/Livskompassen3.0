# Inkorg — Verklighetsvalvet (mock UI + WORM)

**Status:** Inkorg — **lås intent, bygg ut** · **bakom Fyren**  
**Datum:** 2026-05-23  
**Källa:** Användare (klistrad `RealityVault.tsx`)  
**Kod:** [`artifacts/gemini-reality-vault-RealityVault.tsx`](./artifacts/gemini-reality-vault-RealityVault.tsx) · [`gemini-reality-vault-types.ts`](./artifacts/gemini-reality-vault-types.ts)  
**Skärmdumpar:** [`20-orkestern-analys-hub-valvet.png`](./artifacts/screenshots-inkorg-2026-05-23/20-orkestern-analys-hub-valvet.png) (Orkestern) · dashboard `07–08` (korsreferens/WORM-form)

**Modul:** `/dagbok?tab=bevis` · `reality_vault` · [`Verklighetsvalvet-SPEC.md`](../specs/modules/Verklighetsvalvet-SPEC.md)

---

## Användarens intent

> Komplett **Verklighetsvalvet**-vy: säkrade loggar, nytt bevis, **Svart på Vitt** (kontrastlogg), sök, WORM-lås — bakom skölden.

---

## Mock-flikar → repo

| Mock-flik | Repo |
|-----------|------|
| Säkrade Loggar + sök | `VaultLogList` + ev. `VaultCrossReference` |
| + Nytt Bevis | `VaultEntryForm` · `entryType: simple` |
| Svart på Vitt | `VaultEntryForm` · `entryType: two_column` (`theirVersion` / `myReality`) |
| Lås-knappar | WORM `saveVaultLog` + `assertWormPayload` |
| Taggar `#…` | Delvis metadata / vävaren — ej fri LLM-etikett i MVP |

---

## Utkast funktionslås (F-V14)

| ID | Krav | Detalj |
|----|------|--------|
| F-V14.1 | Gate | Fyren + PIN — oförändrat |
| F-V14.2 | Tre lägen | Lista \| Nytt bevis \| Svart på Vitt |
| F-V14.3 | Lista | Sök i titel/innehåll/taggar; lås-ikon + datum per post |
| F-V14.4 | Standard | Rubrik + objektiva fakta + valfria taggar |
| F-V14.5 | Kontrast | Hens version (rosa) + min verklighet/fakta (teal) |
| F-V14.6 | WORM | Create-only; **Lås inlägg** / **Lås bevis mot gaslighting** |
| F-V14.7 | Copy | Forensisk header — gaslighting/efterhandskonstruktion tillåtet **endast** i Valv |

---

## Snabb GAP mot repo (preliminär)

| Mock | Repo idag | Label |
|------|-----------|-------|
| WORM save | `saveVaultLog`, rules | **PASS** |
| two_column form | `VaultEntryForm` | **PASS** |
| Unified tab UX som mock | `VaultPage` flikar Logga/Sök/… | **DELVIS** |
| Client-side taggar | Metadata vävaren | **DELVIS** |
| `RealityVault.tsx` | Ej i `src/` | **GAP** (artifact) |

### Typ-mappning

| Mock | Firestore / form |
|------|------------------|
| `type: 'standard'` | `entryType: 'simple'` |
| `type: 'contrast'` | `entryType: 'two_column'` |
| `title` | `truth` / rubrik-fält |
| `content` | `myReality` / `truth` |
| `theirVersion` | `theirVersion` |

---

## Relaterat

| Inkorg | Koppling |
|--------|----------|
| [`2026-05-23-inkorg-orkestern-analys-hub.md`](./2026-05-23-inkorg-orkestern-analys-hub.md) | Orkestern = separat flik (G19) |
| [`2026-05-23-inkorg-biff-detektor-valvet.md`](./2026-05-23-inkorg-biff-detektor-valvet.md) | BIFF = separat modul (F-V12) |
| [`2026-05-23-inkorg-valv-chatt-ux.md`](./2026-05-23-inkorg-valv-chatt-ux.md) | Sök/chatt = `ValvChatPanel` |

## Analys 2026-05-23

| Beslut | Detalj |
|--------|--------|
| **Behåll** | F-V14.1–F-V14.7, `RealityVault.tsx` artifact |
| **PASS** | WORM, `two_column` — `VaultEntryForm.tsx:88-96`, `firestore.rules:43-46` |
| **GAP** | Enhetlig mock-flikstruktur — **addera** `biff` + `orkestern`, behåll logga/korsref/sök/dossier/lön |

**Nästa:** P1 #5 i analys — efter F-V13/F-V12.
