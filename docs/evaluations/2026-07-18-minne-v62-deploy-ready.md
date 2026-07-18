# Evigt Minne v62 — deploy ready (PAUS)

**Kod:** GO (functions build PASS, cost-guard PASS, wave-machine PASS)  
**Deploy:** SKIP tills Pontus skriver **OK deploy**

```bash
npm run waves:autorun -- --phrase="OK deploy"
export SDK_YOLO_ALLOW_DEPLOY=1
npm run waves:autorun -- --from=62 --through=62
# eller: firebase deploy --only functions
# + firebase deploy --only firestore:rules  (efter OK rules redan satt)
```

**Admin-only create** redan i `firestore.rules` (v61 apply).
