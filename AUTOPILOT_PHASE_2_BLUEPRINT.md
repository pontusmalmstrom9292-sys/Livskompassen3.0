# AUTOPILOT PHASE 2 BLUEPRINT: Verklighetsvalvet & Säkerhetskärnan

## Sammanfattning
Denna blueprint definierar den tekniska arkitekturen för att aktivera **Fas 4 (Fördjupad Integration & Verklighetsvalvet)** i Livskompassen v2.0. Den bygger på vår etablerade "Automations-First" och "Layered Defense" (Zero Regression) metodik.

---

## 1. Frontend-integration av Valvet (`knowledgeVaultQuery`)

### Arkitekturskiss: The Tactical-Glass-Stream
För att upprätthålla 100% kognitiv avlastning och Clean Input, integreras `knowledgeVaultQuery` via ett strikt Hub-and-Spoke flöde:

1. **Trigger:** Användaren utför ett 3-sekunders långtryck på "Fyren"-ikonen (The Tactical Macro-Dock).
2. **Autentisering:** WebAuthn (Passkeys/Biometri) + PIN promptas via OS-nivå.
3. **State (Zero Footprint):** Vid framgång låser Zustand upp `VaultState`. Panik-trigger (`Shake-to-Kill`) övervakar accelerometern för omedelbar nollställning av RAM vid plötslig rörelse.
4. **Anrop (A2A):** React-klienten anropar Cloud Function `knowledgeVaultQuery` med Firebase App Check-token (Lager 2).
5. **Bearbetning:** Backend validerar `request.auth.uid` (Lager 1) -> Sannings-Analytikern (Vertex AI) processar fil/text via Vector Search -> Data formateras till `VaultLog`.
6. **Svar:** Data returneras och visas i Arkivets tvåkolumns-layout ("Svart på vitt").

### TypeScript Datastrukturer (RAG-Scheman)
Följande interfaces måste skapas i Frontend (t.ex. `src/types/vault.ts`) för att matcha backendens oföränderliga WORM-protokoll och RAG-scheman.

```typescript
// Svarsstruktur från knowledgeVaultQuery
export interface VaultQueryResponse {
  success: boolean;
  data: VaultLog | SystemSynapse | null;
  bbicReport?: string; // Markdown formaterad analys
  metadata: {
    hallucinationRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    processedBy: 'Sannings-Analytikern' | 'Mönster-Arkivarien';
    timestamp: string; // Server-side ISO-sträng
  };
}

// Payload för att ställa frågor eller lagra Kampspår
export interface VaultQueryRequest {
  query: string;
  contextType: 'EVIDENCE' | 'REFLECTION' | 'BIFF_DRAFT';
  associatedEntities: EntityRole[];
  attachments?: string[]; // Referenser till Google Drive-filer (analyserade via sharedRules.ts)
}

// RAG: EntityProfile (Förhindrar hallucinationer)
export type EntityRole = 'MOTPART' | 'BARN' | 'ANVÄNDARE' | 'NÄTVERK';

export interface EntityProfile {
  id: string;
  role: EntityRole;
  alias: string;
  behavioralPatterns: string[];
}

// RAG: VaultLog (WORM - Write Once, Read Many)
export interface VaultLog {
  id: string; // Genereras av Firestore
  userId: string;
  category: 'KONFLIKT' | 'GRÄNSSÄTTNING' | 'MILSTOLPE';
  action: string;
  truth: string; // Objektiv fakta
  childrenImpact: string; // Lojalitetskonflikter, mående
  evidenceUrl?: string; // Referens till krypterad bilaga
  biffUsed: boolean;
  isLocked: boolean; // Blir automatiskt true (Immutable) på servern
  createdAt: string; // Server Timestamp
}

// RAG: SystemSynapse (AI:ns långtidsminne)
export interface SystemSynapse {
  id: string;
  userId: string;
  title: string;
  category: string;
  analysis: string;
  groundingPoints: string[]; // Objektiva "ankare"
  hallucinationRisk: number; // 0.0 - 1.0
  lastScannedAt: string;
  createdAt: string;
}
```

---

## 2. Biometrisk Låsning & The Vault UI (WebAuthn)

### Isolering av "Fyren" (Layer 2 Security)
För att göra "Valvet" osynligt och inkräktarsäkert använder vi en kombination av plattformsspecifik biometri och dolda interaktionsmönster:

1. **Dold Interaktion (`useLongPress`):** Ikonen ("Fyren") saknar visuella indikationer på att den är klickbar för lagring. Endast ett 3000ms `onPointerDown`/`onTouchStart`-event triggar upplåsningssekvensen.
2. **WebAuthn (Passkeys):** Istället för egna osäkra lösenordsfält, förlitar vi oss på enhetens inbyggda biometri (FaceID, TouchID, Windows Hello) via WebAuthn API. Detta garanterar att den som håller enheten är den legitima ägaren.
3. **Shake-to-Kill (`useShakeToKill`):** En global listener på `DeviceMotionEvent`. Vid acceleration över 15 m/s² rensas Zustand-store direkt (Zero Footprint), sessionen dödas, och användaren omdirigeras omedelbart till den oskyldiga Hem-vyn.

### Steg-för-steg Kommandon för WebAuthn Setup i Frontend
Dessa kommandon körs i Frontend-katalogen för att lägga till robust WebAuthn-stöd.

```bash
# Gå till projektkatalogen (om Frontend ligger i rot eller /src)
# Vi utgår från standard rotkatalog
npm install @simplewebauthn/browser

# Installera framer-motion för taktila och flytande "Glassmorphism"-animationer (upplåsnings-drawer)
npm install framer-motion

# Installera react-use för att snabbt få tillgång till useLongPress och useMotion (för Shake-to-kill)
npm install react-use
```

---

## 3. CMEK (Customer-Managed Encryption Keys) för Firestore

### Arkitektoniska Steg (Layer 1 Data Security)
Cloud Firestore krypterar data "at rest" som standard (Google-managed). För att uppnå den extremt höga juridiska bevisvärdesnivån (Zero-Trust/WORM) implementerar vi CMEK.
Detta innebär att krypteringsnyckeln hanteras helt av oss via Google Cloud KMS. Om vi inaktiverar eller roterar bort nyckeln blir hela databasen omedelbart kryptografiskt otillgänglig ("Crypto-shredding").

**Arkitektur:**
1. Aktivera Cloud KMS API i projektet.
2. Skapa en **Key Ring** (t.ex. `livskompassen-vault-ring`).
3. Skapa en **Crypto Key** inuti ringen.
4. Tilldela Firestores Service Agent rollen `roles/cloudkms.cryptoKeyEncrypterDecrypter`.
5. Provisionera en *ny* Firestore-databas i **Datastore Mode** (enligt `GEMINI.md`) bunden till denna KMS-nyckel.

*(Observera: En befintlig (default) Firestore-databas kan inte konverteras till CMEK i efterhand. En namngiven CMEK-skyddad databas måste skapas för det isolerade Valvet.)*

### Steg-för-steg Kommandon för CMEK Setup
Dessa gcloud-kommandon förbereder Google Cloud-miljön. **OBS:** Byt ut `[PROJECT_ID]` och `[PROJECT_NUMBER]` till de faktiska ID:na innan exekvering.

```bash
# 1. Aktivera Cloud Key Management Service (KMS)
gcloud services enable cloudkms.googleapis.com --project=[PROJECT_ID]

# 2. Skapa en Key Ring för Livskompassen
gcloud kms keyrings create livskompassen-vault-ring \
    --location=europe-west1 \
    --project=[PROJECT_ID]

# 3. Skapa själva krypteringsnyckeln (CMEK)
gcloud kms keys create firestore-cmek-key \
    --location=europe-west1 \
    --keyring=livskompassen-vault-ring \
    --purpose=encryption \
    --project=[PROJECT_ID]

# 4. Ge Firestore tillåtelse att använda KMS-nyckeln (Bindning till Service Agent)
gcloud kms keys add-iam-policy-binding firestore-cmek-key \
    --location=europe-west1 \
    --keyring=livskompassen-vault-ring \
    --member=serviceAccount:service-[PROJECT_NUMBER]@gcp-sa-firestore.iam.gserviceaccount.com \
    --role=roles/cloudkms.cryptoKeyEncrypterDecrypter \
    --project=[PROJECT_ID]

# 5. Skapa Firestore-databasen i Datastore-läge och bind den till CMEK-nyckeln
gcloud firestore databases create \
    --database=livskompassen-vault-db \
    --location=europe-west1 \
    --type=datastore-mode \
    --kms-key-name=projects/[PROJECT_ID]/locations/europe-west1/keyRings/livskompassen-vault-ring/cryptoKeys/firestore-cmek-key \
    --project=[PROJECT_ID]
```

---

## Nästa Steg / Godkännande
Ovanstående blueprint etablerar den strikta grunden för Layer 1 och Layer 2-försvaret i Valvet. 

**Status:** Redo för exekvering. Vill du att vi:
1. Kör WebAuthn NPM-installationerna i React?
2. Börjar implementera TypeScript-modellerna och `useShakeToKill` hooken? 
3. Exekverar CMEK-skriptet via gcloud (om projekt-ID tillhandahålls)?