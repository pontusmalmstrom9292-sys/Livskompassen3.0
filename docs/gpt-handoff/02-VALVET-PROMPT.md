# Pack 02 — Valvet (Verklighetsvalvet)

**Senast uppdaterad:** 2026-06-15  
Ladda upp `exports/gpt-handoff/repomix/gpt-pack-02-valvet.md` till GPT **efter** pack 01.

**Status:** Security core **LOCK** (CP-1) · G10 Inkast backend **LOCK** (CP-3) · Upload unified **WIP**.

---

## Prompt för GPT

Du granskar **Valvet** — den del av Livskompassen med hårdast regler (WORM, PIN, plausible deniability).

**Fokus:**

1. **PIN-flöde** — `vaultPin.ts`, `VaultLockedGate`, `unlockVault` callable (P0 säkerhetsfix, CP-1)
2. **WebAuthn / biometri** — `vaultWebAuthnClient.ts`, `beginVaultWebAuthnChallenge`, native biometric
3. **Evidence-logik** — `VaultService`, `normalizeVaultLog`, `reality_vault` WORM
4. **HITL-broar** — `SaveAsEvidencePrompt`, `InkastBarnenValvBridge`, `BarnportenInboxPanel` — aldrig auto-promote
5. **Låsta paneler** — Mönster, Orkester, Aktörskarta, Kunskapsbank (locked UX §)
6. **Dossier** + `patternScanOnVaultCreate`
7. **G10 Inkast → Valv** — `submitInkastLite`, `inboxClassifier`, `onInkastEvidenceFinalized` — routing vs manuellt Valv-val
8. **Upload unified** — `InkastDirectPanel` (WIP, defer steg 2) — jämför mot [`UPLOAD-UNIFIED-SPEC.md`](../external-ai/UPLOAD-UNIFIED-SPEC.md)

### Verifiera

- [ ] WORM: inga `update`/`delete` på `reality_vault` i klient eller rules
- [ ] Ingen auto-promote barnlogg eller inkast → Valv utan explicit HITL
- [ ] Valv-RAG läser **endast** `reality_vault` (`valvChatQuery` + `vaultRag.ts`)
- [ ] Kunskap i Valv bakom PIN (`VaultKunskapsbankPanel`) — inte publik `/vardagen?tab=kunskap`
- [ ] `assertVaultSession` på känsliga callables
- [ ] Prompts centraliserade i `sharedRules.ts`
- [ ] Fyren: **"Lås upp"** (inte "Valv") i publikt läge — F4 implementerad
- [ ] Drawer: Valv-sektion endast vid `vaultSessionOpen`

### Uppgift

1. Beskriv PIN → session → write-flödet (inkl. server-side gate).
2. Kartlägg alla vägar in till `reality_vault` (inkast, manuell logg, HITL-broar, dossier).
3. Identifiera säkerhetsluckor (särskilt App Check coverage — **OPEN** i LIFE-OS-BUILD-STATE).
4. Föreslå förenklingar utan att bryta Sacred Features eller locked UX.
5. Bedöm om upload unified bör slås ihop med Valv DirectPanel eller hållas separat.

**Ge INTE kod.** Beslutsmemo: Godkänn / Ändra X / Defer.

Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän analysen är komplett.
