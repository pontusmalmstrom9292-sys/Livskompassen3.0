# Valv-zon register

**Syfte:** Vilken funktion tillhör publikt skikt vs valv-zon. Samma PIN överallt; separat session per zon.

| Zon | Nyckel | Innehåll | Publikt skikt |
|-----|--------|----------|---------------|
| `valv_core` | Fyren 3s + PIN | Bevis, Triage, Mönster, Orkester, Dossier | Dold (`HIDE_BEVIS_TAB`) |
| `hamn_forensic` | PIN per session | Risk, agent, spara bevis | Grey Rock-svar |
| `speglar_forensic` | PIN per session | VIVIR, Svart på vitt, bevisjämförelse | ACT-validering |
| `familjen_forensic` | PIN per session | Mönster-flik, Kunskap valv/barn-RAG | Barnfokus, livslogg, tillsammans |
| `dagbok_forensic` | PIN per session | Journalarkiv, vävare, kampspar-opt-in | Humör + reflektion spara |

**Zero Footprint (solo-läge):** Rensas vid flik-byte och 15 min idle — **inte** vid blur.

**WebAuthn:** Valfritt fingeravtryck/Face ID före PIN i `VaultZoneGate` (samma som Fyren).
