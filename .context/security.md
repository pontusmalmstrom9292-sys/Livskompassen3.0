# Säkerhet, Biometri och Integritet

Säkerheten i Livskompassen v2 är rigorös på grund av hanteringen av djupt personlig psykologisk data. "Mock-säkerhet" är strängt förbjudet.

## Biometrisk Låsning via WebAuthn Passkeys
- **Mekanism:** Asymmetrisk kryptografi. Den privata nyckeln lämnar aldrig enheten (lagras i Secure Enclave/TPM).
- **Inloggning:** Servern skickar en "challenge". Enhetens biometri (ansikte/fingeravtryck) signerar utmaningen. Servern verifierar den publika nyckeln.
- **Frontend-säkerhet (Kritiskt):** Känsligt kryptografiskt material FÅR ALDRIG exponeras i JavaScript-miljöns minne (heap) pga risk för minnesläckor/injektioner. Biometrin låser upp en inpackad huvudnyckel uteslutande i enhetens ursprungliga (native) minne, vilken används för autentisering mot RAG-modulen.

## Kryptografisk Säkerhet via CMEK
- **Cloud KMS:** Customer-Managed Encryption Keys används för all lagring i Firestore.
- **Fördelar:** Möjliggör omedelbar dataförstöring (crypto-shredding) och fullständig spårbarhet via Cloud Logging.

## GDPR och AADC (Children's Code)
- **AADC:** Måste strikt överensstämma med Age-Appropriate Design Code. "High privacy" by default. Profilering och geolokalisering avstängt som standard.
- **Transparens:** Användare måste informeras om hur AI processar data.
- **Lagring:** Interaktionsloggar får inte sparas på obestämd tid.

## Skydd mot Narcissism (DCAP)
Digital Conversation Analysis Pipeline (DCAP) skyddar användare mot psykologiskt missbruk.
1.  **Explicit (Regex):** Regelbaserad skanning för direkta språkliga indikatorer på bristande empati.
2.  **Implicit (Domain-adapted BERT):** Djupinlärningsmodell som analyserar kontext över tid (ex. DARVO-tekniker).
3.  **Åtgärd:** Om toxicitet detekteras erbjuder Kompis "Grey Rock"-coachning.
