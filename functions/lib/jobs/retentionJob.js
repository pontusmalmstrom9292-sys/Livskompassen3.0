"use strict";
/**
 * GDPR Data Retention Job (körbar modul)
 * Livskompassen v2 - Fas 3, Steg 3.1
 *
 * Exporterar en default-funktion så att den kan anropas både
 * som ett fristående Cloud Run Job (process.argv) och
 * som en inlineimport från scheduledRetentionJob i index.ts.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = runRetention;
const firestore_1 = require("@google-cloud/firestore");
const PROJECT_ID = process.env.GCP_PROJECT_ID ?? 'livskompassen-v2';
const RETENTION_DAYS = parseInt(process.env.RETENTION_DAYS ?? '90', 10);
const COLLECTIONS_TO_PURGE = ['kampspar', 'interaction_logs', 'dcap_analysis_cache'];
function getCutoffTimestamp() {
    const cutoffMs = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;
    return firestore_1.Timestamp.fromMillis(cutoffMs);
}
async function purgeFirestoreCollection(db, userId, collection, cutoff) {
    const ref = db.collection(`users/${userId}/${collection}`);
    const snapshot = await ref.where('createdAt', '<', cutoff).get();
    if (snapshot.empty)
        return { collection, deletedCount: 0, prunedVectorIds: [] };
    const batch = db.batch();
    const prunedVectorIds = [];
    for (const doc of snapshot.docs) {
        batch.delete(doc.ref);
        const vectorId = doc.data()?.vectorId;
        if (vectorId)
            prunedVectorIds.push(vectorId);
    }
    await batch.commit();
    console.log(`[RetentionJob] ${collection}: ${snapshot.size} dok. raderade för uid=${userId}`);
    return { collection, deletedCount: snapshot.size, prunedVectorIds };
}
async function removeVectors(vectorIds) {
    const indexId = process.env.VECTOR_SEARCH_INDEX_ID;
    if (!indexId || vectorIds.length === 0)
        return;
    // Dynamic import för att undvika onödigt beroende vid inline-körning
    const { IndexServiceClient } = await Promise.resolve().then(() => __importStar(require('@google-cloud/aiplatform')));
    const client = new IndexServiceClient({ apiEndpoint: `europe-west1-aiplatform.googleapis.com` });
    await client.removeDatapoints({
        index: `projects/${PROJECT_ID}/locations/europe-west1/indexes/${indexId}`,
        datapointIds: vectorIds,
    });
    console.log(`[RetentionJob] ${vectorIds.length} vektorer borttagna från Vector Search.`);
}
async function runRetention() {
    console.log(`[RetentionJob] Startar. Retention: ${RETENTION_DAYS} dagar.`);
    const db = new firestore_1.Firestore({ projectId: PROJECT_ID });
    const cutoff = getCutoffTimestamp();
    const usersSnap = await db.collection('users').select().get();
    const userIds = usersSnap.docs.map((d) => d.id);
    console.log(`[RetentionJob] ${userIds.length} användare att bearbeta.`);
    const allVectorIds = [];
    let totalDeleted = 0;
    for (const userId of userIds) {
        for (const collection of COLLECTIONS_TO_PURGE) {
            const result = await purgeFirestoreCollection(db, userId, collection, cutoff);
            totalDeleted += result.deletedCount;
            allVectorIds.push(...result.prunedVectorIds);
        }
    }
    await removeVectors(allVectorIds);
    console.log(`[RetentionJob] Klart. ${totalDeleted} dok., ${allVectorIds.length} vektorer raderade.`);
}
// Kör direkt om filen anropas som Cloud Run Job
if (require.main === module) {
    runRetention().catch((err) => {
        console.error('[RetentionJob] Kritiskt fel:', err);
        process.exit(1);
    });
}
//# sourceMappingURL=retentionJob.js.map