# Unlock MOD-CORE-UTV — permanent lock (etablering)

```yaml
module: MOD-CORE-UTV
approved: yes
date: 2026-07-19
scope: Etablera Locked UX §22 — låsa Utvecklingskort + faktapack så det aldrig kan tas bort av misstag
pontusOk: yes
```

## Varför

Pontus: hela utvecklingskort-planen (Hem Bento, MåBra, Inställningar faktapack, `home/dev/**`) ska vara permanent låst produktflöde.

## Scope (denna commit)

- Ny modul `MOD-CORE-UTV` i `.context/module-lock-register.json`
- Locked UX §22 + smoke-asserts i `smoke:locked-ux` / `smoke:basta-dock-lock`
- `@locked MOD-CORE-UTV` headers på entryfiler
- Cursor-regler: `locked-ux-features.mdc`, `basta-design-dock-lock.mdc`

## MUST NOT efter re-lock

- Ta bort «Mer för dig», `DevelopmentBentoWidget`, `home/dev/**`, MåBra-mount eller Inställningar-genväg
- Införa cross-RAG i utvecklingsmotor
- Ändra utan ny unlock-doc + Pontus OK
