# MåBra 3.0 — Firestore Rules Audit (Kat 7 & Kat 8)

**Datum:** 2026-06-14  
**Status:** Revisionsdokument — **ingen** ändring i `firestore.rules` i detta steg  
**Scope:** Kategori 7 (Kärnidentitet) och Kategori 8 (Drogfrihet / Återhämtning)  
**Kanon:** [`docs/specs/modules/MABRA-3.0-MASTER-SPEC.md`](../specs/modules/MABRA-3.0-MASTER-SPEC.md) · [`.context/security.md`](../../.context/security.md) · [`firestore.rules`](../../firestore.rules)

---

## 1. Sammanfattning

| Kategori | Firestore idag | Verdict |
|----------|----------------|---------|
| **Kat 7 — Kärnidentitet** | Fyra befintliga sökvägar (`emotional_memory`, `vit_entries`, `mabra_progress`, `vit_hub`) + `evolution_hub` för kapacitetsgate | **Delvis compliant** — `emotional_memory` stark; `vit_entries` och mutable profiler **svagare** än SPEC L3 |
| **Kat 8 — Drogfrihet** | P0 = `localStorage` only (ingen rules) · P1 = `recovery_profile/{uid}` **saknas helt** | **Gap** — planerad collection finns inte i rules |

**Tre silos:** Inga rules-ändringar får öppna cross-RAG. Kat 7/8 data ska **inte** indexeras i `kampspar`/`kb_docs` (backend/retention — ej rules). Valv (`reality_vault`) förblir **separat silo** med `isOwnerVault()` — identitets-/recovery-data ska **inte** auto-promotas (HITL + `sourceRef` endast).

---

## 2. SPEC-krav → rules-mapping

### 2.1 Kat 7 — Kärnidentitet (L3 Hög)

| SPEC-krav | Förväntad lagring | Nuvarande rules | Gap |
|-----------|-------------------|-----------------|-----|
| Vit WORM (`self_esteem`, `who_am_i`, …) | `vit_entries/{docId}` | WORM create, **read/create: `isOwner()`** | **Saknar `isSensitiveAuth`** · saknar `wormKeysOnly` · `responseText`/`cardDateKey` ej whitelistade |
| Känslominne WORM | `emotional_memory/{docId}` | `isOwnerSensitive()` + `isValidEmotionalMemoryCreate()` | **PASS** |
| ACT värderingar (mutable) | `mabra_progress/{uid}` | `isAuthenticated()` only | **Saknar `isSensitiveAuth`** · inga `keys().hasOnly` på create/update |
| Projektstatus (mutable) | `vit_hub/{uid}` | `isAuthenticated()` only | **Saknar `isSensitiveAuth`** · `updatedAt` tillåten utan schema-lock |
| Kapacitetsgate `who_am_i` | `evolution_hub/{uid}` | Mutable, auth uid | OK för gate (ej identitetsinnehåll) |
| **Valv default Nej** | — | `reality_vault` kräver vault session | **PASS** — ingen client create utan `isOwnerCreateVault()` |
| Zero Footprint draft | UI/localStorage | Ej Firestore | N/A |

Känslighetsklass L3 enligt SPEC: läs/skriv ska följa samma band som `journal` / `emotional_memory` (`isSensitiveAuth` = verifierad e-post, inte anonym dev i prod).

### 2.2 Kat 8 — Drogfrihet (L4 Kritisk)

| SPEC-krav | Förväntad lagring | Nuvarande rules | Gap |
|-----------|-------------------|-----------------|-----|
| P0 dagräknare | `localStorage` (`drogfrihetCounter.ts`) | Ingen collection | **OK** — inga rules krävs |
| P1 isolerad profil | `recovery_profile/{uid}` | **Finns inte** | **BLOCKER** för M3.0-D |
| REFLECTION DF-REF-* | Client-bank / framtida append | Ingen dedikerad collection P0 | **OK** P0 · valfri WORM P2 (se §4.3) |
| **Aldrig auto-Valv** | — | `reality_vault` vault-gated | **PASS** — men client måste blockera promote (ej rules) |
| **Ingen RAG** | — | Ej `kampspar` client write | **PASS** |
| Device Clear | localStorage | N/A | Klientpolicy — ej rules |

---

## 3. Saknade Firestore-sökvägar (exakt lista)

### 3.1 Obligatoriska (SPEC M3.0-D / Kat 8 P1)

| Sökväg | Typ | Syfte | SPEC-referens |
|--------|-----|-------|---------------|
| **`recovery_profile/{uid}`** | Mutable doc (1 per user) | `programType`, `startDateKey`, `shareWithCoach` — **aldrig** `reality_vault` | MABRA-3.0 § Kat 8 · §7 |

**Fält (minimum enligt SPEC):**

```typescript
// Planerat schema — ej implementerat
{
  userId: string;
  ownerId: string;
  programType: 'twelve_step_inspired' | 'custom_abstinence' | 'other';
  startDateKey: string;        // YYYY-MM-DD
  shareWithCoach: boolean;     // default false
  updatedAt: timestamp;          // endast mutable metadata
}
```

**FÖRBJUDET på `recovery_profile`:** fritext dagbok, återfallsanteckningar, `sourceRef` till Valv, fält som `truth`/`action` (WORM-bevissemantik).

### 3.2 Valfria (rekommenderas i audit — ej blockerande P1)

| Sökväg | Typ | Syfte | Prioritet |
|--------|-----|-------|-----------|
| **`recovery_reflection/{docId}`** | WORM append | Sparade svar på `DF-REF-*` (ersätter ev. framtida molnsync av reflektion) | P2 |
| **`recovery_profile/{uid}/settings/private`** | — | **Avråds** — håll platt `recovery_profile/{uid}` | — |

Kat 7 kräver **inga nya top-level collections** enligt SPEC — endast **regelhårdning** av befintliga sökvägar.

---

## 4. Befintliga sökvägar — regelgap (Kat 7)

### 4.1 `emotional_memory/{docId}` — **PASS (referensnivå)**

```149:166:firestore.rules
    function isValidEmotionalMemoryCreate() {
      return wormKeysOnly([
          'userId', 'ownerId', 'createdAt', 'memoryType', 'content', 'intensity',
        ])
        ...
    }

    match /emotional_memory/{docId} {
      allow read: if isOwnerSensitive();
      allow create: if isOwnerCreateSensitive() && isValidEmotionalMemoryCreate();
      allow update, delete: if false;
    }
```

**Retention:** `emotional_memory` finns i `WORM_COLLECTIONS_NEVER_PURGE` (`retentionJob.ts` rad 21).

**Rekommendation:** Behåll som mall för Kat 7-övrigt. Valfritt tillägg: `pillar: 'identity'` i whitelist vid M3.0-B (kräver klient + rules sync).

---

### 4.2 `vit_entries/{docId}` — **GAP (kritisk för Kat 7)**

**Nuvarande:**

```394:402:firestore.rules
    match /vit_entries/{docId} {
      allow read: if isOwner();
      allow create: if isOwnerCreate()
        && isValidVitEntryKind()
        && isValidVitContentClass()
        && request.resource.data.projectId is string
        && request.resource.data.bankId is string;
      allow update, delete: if false;
    }
```

**Problem:**

| # | Problem | Risk |
|---|---------|------|
| 1 | **`isOwner()` / `isOwnerCreate()`** — inte `isSensitiveAuth` | Anonym dev-auth kan läsa/skriva identitetsinnehåll i prod om `VITE_REQUIRE_EMAIL_AUTH` felkonfigurerad |
| 2 | **Ingen `wormKeysOnly`** | Shadow fields (`updatedAt`, extra PII) kan smugglas på create |
| 3 | **`responseText` ej validerad** | Klient skriver `responseText` (`vitHubFirestore.ts` rad 122–124) — rules tillåter **obegränsad** extra data om key whitelist saknas |
| 4 | **`projectId` ej enum** | Kat 7 kräver `self_esteem` \| `emotional_memory` \| `who_am_i` \| `learn_together` — godtycklig sträng tillåten |
| 5 | **Ej retention allowlist** | `vit_entries` saknas i `WORM_COLLECTIONS_NEVER_PURGE` — risk vid framtida retention-utvidgning |

**Föreslagen rules-tillägg (skiss — ej applicerad):**

```javascript
function isValidKat7ProjectId() {
  return request.resource.data.projectId in [
    'self_esteem', 'emotional_memory', 'learn_together', 'who_am_i'
  ];
}

function isValidVitEntryCreate() {
  return wormKeysOnly([
      'userId', 'ownerId', 'createdAt', 'projectId', 'kind', 'bankId',
      'content_class', 'responseText', 'cardDateKey', 'zone', 'inputMode',
    ])
    && isValidVitEntryKind()
    && isValidVitContentClass()
    && isValidKat7ProjectId()
    && request.resource.data.bankId is string
    && request.resource.data.bankId.size() > 0
    && request.resource.data.bankId.size() <= 32
    && (!('responseText' in request.resource.data)
      || (request.resource.data.responseText is string
        && request.resource.data.responseText.size() <= 5000))
    && (!('cardDateKey' in request.resource.data)
      || request.resource.data.cardDateKey.matches('^\\d{4}-\\d{2}-\\d{2}$'))
    && (!('zone' in request.resource.data)
      || request.resource.data.zone == 'mabra')
    && (!('inputMode' in request.resource.data)
      || request.resource.data.inputMode in [
        'vit_card', 'vit_chat', 'vit_memory', 'checkin'
      ]);
}

match /vit_entries/{docId} {
  allow read: if isOwnerSensitive();
  allow create: if isOwnerCreateSensitive() && isValidVitEntryCreate();
  allow update, delete: if false;
}
```

**Backend/retention:** Lägg `vit_entries` i `WORM_COLLECTIONS_NEVER_PURGE`.

---

### 4.3 `mabra_progress/{uid}` — **GAP (medium)**

**Nuvarande:** read/create/update med `isAuthenticated()` only; **ingen** field whitelist.

**Klient skriver:** `coreValues: string[]`, `updatedAt` (`firestore.ts` rad 432–440).

**SPEC:** Mutable ACT-värderingar (L3) — ska inte vara world-readable via svag auth.

**Föreslagen rules-tillägg (skiss):**

```javascript
function isValidMabraProgressCreate() {
  return request.resource.data.keys().hasOnly([
      'userId', 'ownerId', 'coreValues', 'updatedAt',
    ])
    && request.resource.data.coreValues is list
    && request.resource.data.coreValues.size() <= 8
    && request.resource.data.coreValues.size() >= 0;
}

function isValidMabraProgressUpdate() {
  return isValidMabraProgressCreate()
    && request.resource.data.userId == resource.data.userId
    && request.resource.data.ownerId == resource.data.ownerId;
}

match /mabra_progress/{uid} {
  allow read: if isAuthenticated() && request.auth.uid == uid && isSensitiveAuth();
  allow create: if isAuthenticated()
    && uid == request.auth.uid
    && isOwnerCreateSensitive()
    && isValidMabraProgressCreate();
  allow update: if isAuthenticated()
    && uid == request.auth.uid
    && isOwnerSensitive()
    && isValidMabraProgressUpdate();
  allow delete: if false;
}
```

**Validering:** Varje `coreValues`-element `string`, max 80 tecken (lägg till i validator).

---

### 4.4 `vit_hub/{uid}` — **GAP (medium)**

**Nuvarande:** mutable utan `isSensitiveAuth`; `updatedAt` på update utan `hasOnly`.

**Föreslagen rules-tillägg (skiss):**

```javascript
function isValidVitHubWrite() {
  return request.resource.data.keys().hasOnly([
      'userId', 'ownerId', 'activeProjectIds', 'updatedAt',
    ])
    && (!('activeProjectIds' in request.resource.data)
      || request.resource.data.activeProjectIds is list);
}

match /vit_hub/{uid} {
  allow read: if isAuthenticated() && request.auth.uid == uid && isSensitiveAuth();
  allow create: if isAuthenticated()
    && uid == request.auth.uid
    && isOwnerCreateSensitive()
    && isValidVitHubWrite();
  allow update: if isAuthenticated()
    && uid == request.auth.uid
    && isOwnerSensitive()
    && isValidVitHubWrite()
    && request.resource.data.userId == resource.data.userId
    && request.resource.data.ownerId == resource.data.ownerId;
  allow delete: if false;
}
```

---

### 4.5 `evolution_hub/{uid}` — **OK (gate only)**

Används för kapacitetsnivå ≥2 innan `who_am_i`-djup (SPEC). Innehåller **inte** identitetsfritext — befintliga mutable rules acceptabla för gate. **Ingen ändring krävs** för Kat 7 unless `featureFlags.identity_deep_unlock` läggs till (då whitelist).

---

### 4.6 Valv (`reality_vault`) — HITL från Kat 7

**Nuvarande:** Strikt vault session + `isValidRealityVaultCreate()` med `sourceRef` optional.

**SPEC:** Identitetsdata ska **inte** bli forensisk bevis utan explicit beslut.

**Rules:** Ingen ändring krävs för att **blockera** auto-promote (client/HITL ansvar). **Rekommendation (valfri hårdning):**

- Kräv att `sourceRef.collection` ∈ `['vit_entries', 'emotional_memory', 'journal']` när `category` ∈ identity-relaterade värden.
- **Admin SDK** (inkast) ska **inte** klassificera Kat 7-innehåll som bevis → `reality_vault` (G10 — redan policy, ej rules).

**Cross-silo:** `valvChatQuery` läser endast `reality_vault` — rules ska **inte** ge client read på Valv utan `isOwnerVault()`. **PASS.**

---

## 5. Saknade sökvägar & regler — Kat 8 (detalj)

### 5.1 `recovery_profile/{uid}` — **NY (obligatorisk P1)**

**Designprinciper (L4 Kritisk):**

1. **Isolerad collection** — inte `mabra_progress`, inte `vit_entries`, inte `journal`.
2. **Mutable** — användaren får nollställa `startDateKey` via app (tvåstegs UI), inte radera doc.
3. **`isSensitiveAuth`** på read/write.
4. **Ingen client read för andra uid** — doc-id = `auth.uid`.
5. **`shareWithCoach: false` default** — om `true` i framtiden: endast via callable med separat audit (ej rules-only).
6. **Aldrig** `reality_vault` write från denna collection (ingen `promote`-fält).

**Föreslagen rules-block (skiss):**

```javascript
function isValidRecoveryProfileCreate() {
  return request.resource.data.keys().hasOnly([
      'userId', 'ownerId', 'programType', 'startDateKey', 'shareWithCoach', 'updatedAt',
    ])
    && request.resource.data.programType in [
      'twelve_step_inspired', 'custom_abstinence', 'other'
    ]
    && request.resource.data.startDateKey.matches('^\\d{4}-\\d{2}-\\d{2}$')
    && request.resource.data.shareWithCoach is bool
    && request.resource.data.shareWithCoach == false;  // P1: tvinga false tills coach-share PMIR
}

function isValidRecoveryProfileUpdate() {
  return request.resource.data.keys().hasOnly([
      'userId', 'ownerId', 'programType', 'startDateKey', 'shareWithCoach', 'updatedAt',
    ])
    && request.resource.data.userId == resource.data.userId
    && request.resource.data.ownerId == resource.data.ownerId
    && request.resource.data.startDateKey.matches('^\\d{4}-\\d{2}-\\d{2}$')
    && request.resource.data.shareWithCoach == false;
}

match /recovery_profile/{uid} {
  allow read: if isAuthenticated()
    && request.auth.uid == uid
    && isSensitiveAuth();
  allow create: if isAuthenticated()
    && uid == request.auth.uid
    && isOwnerCreateSensitive()
    && isValidRecoveryProfileCreate();
  allow update: if isAuthenticated()
    && uid == request.auth.uid
    && isOwnerSensitive()
    && isValidRecoveryProfileUpdate();
  allow delete: if false;
}
```

**Retention:** Lägg **inte** i purge-lista; behandla som **permanent känslig profil** (lik `mabra_progress` — användaren nollställer, system raderar inte).

**Index:** Ingen composite index krävs (doc-id lookup only).

---

### 5.2 Valfri P2: `recovery_reflection/{docId}` (WORM)

Om molnsync av `DF-REF-*`-svar behövs (idag client-bank + local UI):

```javascript
function isValidRecoveryReflectionCreate() {
  return wormKeysOnly([
      'userId', 'ownerId', 'createdAt', 'bankId', 'responseText', 'dayKey',
    ])
    && request.resource.data.bankId.matches('^DF-REF-\\d{2}$')
    && request.resource.data.responseText is string
    && request.resource.data.responseText.size() > 0
    && request.resource.data.responseText.size() <= 2000
    && request.resource.data.dayKey.matches('^\\d{4}-\\d{2}-\\d{2}$');
}

match /recovery_reflection/{docId} {
  allow read: if isOwnerSensitive();
  allow create: if isOwnerCreateSensitive() && isValidRecoveryReflectionCreate();
  allow update, delete: if false;
}
```

**Retention:** Lägg i `WORM_COLLECTIONS_NEVER_PURGE`.

**Valv:** **STRICT MUST NOT** — separata collection; HITL får inte föreslå promote default.

---

### 5.3 P0 `localStorage` (dagräknare)

**Ingen Firestore-regel.** SPEC integritetsregler 1–5 är **klient + Device Clear** (`signOutUser` rensar nycklar `livskompassen_drogfrihet_start:*`).

**Verifiering vid implementation:** `npm run smoke:valv-security` / manuell — räknare syns **inte** på dashboard (UI-policy, ej rules).

---

## 6. Tre silos & WORM — compliance-matris

| Collection | Silo | WORM rules | Sensitive auth | Retention safe | Kat |
|------------|------|------------|----------------|----------------|-----|
| `emotional_memory` | Vit | ✅ | ✅ | ✅ | 7 |
| `vit_entries` | Vit | ⚠️ partial | ❌ | ❌ | 7 |
| `mabra_progress` | Vit | N/A (mutable) | ❌ | ⚠️ | 7 |
| `vit_hub` | Vit | N/A | ❌ | ⚠️ | 7 |
| `reality_vault` | Valv | ✅ | ✅ vault | ✅ | HITL only |
| `kampspar` / `kb_docs` | Kunskap | ✅ | owner | ✅ | **Ej Kat 7/8 write** |
| `recovery_profile` | **Saknas** | — | — | — | 8 P1 |
| localStorage counter | UI | N/A | N/A | N/A | 8 P0 |

**3-silo-regel i rules:** Det finns **ingen** regel som tillåter client att skriva Kat 7/8-data till `kampspar` eller läsa `reality_vault` utan vault — **PASS på silo-nivå**. Svagheten är **auth-band** och **field whitelist** på Vit-collections.

---

## 7. Prioriterad ändringslista för `firestore.rules`

| Prio | Ändring | Kat | Effort |
|------|---------|-----|--------|
| **P0** | Ny `match /recovery_profile/{uid}` + validators | 8 | Medium |
| **P0** | `vit_entries` → `isOwnerSensitive` + `isValidVitEntryCreate()` med `wormKeysOnly` | 7 | Medium |
| **P1** | `mabra_progress` → `isSensitiveAuth` + key whitelist | 7 | Low |
| **P1** | `vit_hub` → `isSensitiveAuth` + key whitelist | 7 | Low |
| **P2** | `recovery_reflection` WORM (om molnsync) | 8 | Medium |
| **P2** | `vit_entries` + `recovery_*` i `WORM_COLLECTIONS_NEVER_PURGE` | 7/8 | Low (functions) |
| **P3** | Valfri `sourceRef`-validator på `reality_vault` för identity-kategorier | 7 HITL | Low |

---

## 8. Vad som **inte** ska ändras

- **Öppna inte** client read/write på `reality_vault` för MåBra (brott mot Valv-silo och plausible deniability).
- **Inför inte** `knowledgeVaultQuery`-data i rules (ingen collection-koppling).
- **Slå inte ihop** `recovery_profile` med `mabra_progress` eller `vit_entries`.
- **Tillåt inte** `delete` på WORM Kat 7-data (`emotional_memory`, `vit_entries`).
- **Använd inte** `isOwner()` alone för L3/L4 känslig data i prod (`security.md` § WORM + `isSensitiveAuth`).

---

## 9. Verifiering efter framtida rules-PR

| Steg | Kommando / check |
|------|------------------|
| 1 | Firebase Rules simulator: anonym user **denied** på `vit_entries` create |
| 2 | Verifierad user: create `emotional_memory` **allowed** |
| 3 | Verifierad user utan vault: read `reality_vault` **denied** |
| 4 | `recovery_profile` update med extra fält `notes` **denied** |
| 5 | `npm run build` + `npm run smoke:innehall` + `npm run smoke:mabra` |
| 6 | Uppdatera `EMOTIONAL_MEMORY_WORM_KEYS` / `vitHubFirestore` parity med rules |
| 7 | Kör [`firebase-security-rules-auditor`](../../.context/security.md) plugin review |

---

## 10. Referenser (kod & kanon)

| Källa | Rad / fil |
|-------|-----------|
| `isValidEmotionalMemoryCreate` | `firestore.rules:149–166` |
| `vit_entries` match | `firestore.rules:394–402` |
| `mabra_progress` match | `firestore.rules:336–348` |
| `reality_vault` match | `firestore.rules:263–267` |
| `isSensitiveAuth` | `firestore.rules:19–22` |
| Klient `saveVitEntry` | `src/modules/core/firebase/vitHubFirestore.ts:111–131` |
| Klient `saveEmotionalMemory` | `src/modules/core/firebase/emotionalMemoryFirestore.ts:88–114` |
| Retention allowlist | `functions/src/jobs/retentionJob.ts:17–30` |
| Drogfrihet P0 localStorage | `src/modules/features/dailyLife/drogfrihet/lib/drogfrihetCounter.ts` |

---

**Nästa steg:** PMIR för rules-PR → implementera P0-raderna → synka klient validators → deploy `firestore:rules` → smoke enligt §9.

**Detta dokument:** endast revision — **`firestore.rules` oförändrad.**
