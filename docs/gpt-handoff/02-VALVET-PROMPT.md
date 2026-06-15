# Pack 02 — Valvet (Verklighetsvalvet)

Ladda upp `exports/gpt-handoff/repomix/gpt-pack-02-valvet.md` till GPT **efter** pack 01.

---

## Prompt för GPT

Du granskar **Valvet** — den del av Livskompassen med hårdast regler (WORM, PIN, plausible deniability).

**Fokus:**

1. **PIN-flöde** — `vaultPin.ts`, `VaultLockedGate`, `unlockVault` callable
2. **WebAuthn / biometri** — `vaultWebAuthnClient.ts`, `beginVaultWebAuthnChallenge`, native biometric
3. **Evidence-logik** — `VaultService`, `normalizeVaultLog`, `reality_vault` WORM
4. **SaveAsEvidencePrompt** — HITL-bro från barn/livslogg/inkast → Valv (aldrig auto-promote)
5. **Låsta paneler** — Mönster, Orkester, Aktörskarta, Kunskapsbank
6. **Dossier** + pattern scan

### Verifiera

- [ ] WORM: inga `update`/`delete` på `reality_vault` i klient eller rules
- [ ] Ingen auto-promote barnlogg → Valv
- [ ] Valv-RAG läser **endast** `reality_vault` (`valvChatQuery` + `vaultRag.ts`)
- [ ] Kunskap i Valv bakom PIN (`VaultKunskapsbankPanel`) — inte publik `/vardagen?tab=kunskap`
- [ ] Prompts centraliserade i `sharedRules.ts`

### Uppgift

Beskriv PIN→session→write-flödet, identifiera säkerhetsluckor, och föreslå förenklingar utan att bryta Sacred Features.

Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän analysen är komplett.
