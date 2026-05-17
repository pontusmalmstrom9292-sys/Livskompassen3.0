const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
require("dotenv").config({ path: '.env.local' });

const app = express();
app.use(express.json());
app.use(cors());

// Initiera Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.GOOGLE_CLOUD_PROJECT || "livskompassen-v2",
  });
}
const db = admin.firestore();

// 🛡️ API-Route: Spara till Verklighetsvalvet (Oföränderligt)
// Optimerad för Clean Input och strikt mappad mot firebase-blueprint.json (VaultLog)
app.post("/api/vault/entry", async (req, res) => {
  try {
    const { userId, category, action, truth, childrenImpact, evidenceUrl, biffUsed } = req.body;

    if (!userId || !action || !truth) {
      return res.status(400).json({ error: "Clean Input-fel: Saknar obligatoriska fält (userId, action, truth)." });
    }

    const vaultRef = db.collection("vault");
    
    // Skapa ett Immutable Snapshot. (Oföränderlighets-flaggor för Clean Input)
    const newEntry = {
      userId: userId,
      category: category || "Oklassificerad",
      action: action,
      truth: truth,
      childrenImpact: childrenImpact || "",
      evidenceUrl: evidenceUrl || "",
      biffUsed: biffUsed || false,
      isLocked: true,
      isImmutable: true, 
      createdAt: admin.firestore.FieldValue.serverTimestamp(), // Google sätter tiden obestridligt (Oföränderlig)
    };

    const docRef = await vaultRef.add(newEntry);
    res.status(201).json({ success: true, id: docRef.id });
  } catch (error) {
    console.error("[Säkerhetsvarning] Kunde inte skriva till valvet:", error);
    res.status(500).json({ error: "Kunde inte säkra datan i valvet. Systemisolering bibehållen." });
  }
});

const PORT = process.env.API_BACKEND_PORT || 5000;
app.listen(PORT, () => console.log(`[Layered Defense] Server körs på port ${PORT}`));