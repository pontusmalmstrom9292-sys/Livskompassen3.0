import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { admin } from '../../lib/firebaseAdmin';
import {
  askMabraCoach,
  askVitChatCoach,
  askKbtTransformator,
} from '../../agents/vertexAgent';
import {
  MABRA_SPEGLAR_REDIRECT_MESSAGE,
  shouldRedirectMabraCoachToSpeglar,
} from '../../lib/mabraCoachGuard';
import { guardSensitiveCallableV2 } from '../../lib/callableGuards';
import { resolveCoachToneForUser } from '../../lib/adaptationCoachTone';
import { loadAdaptationSemanticContext } from '../../lib/adaptationSemanticContext';
import {
  fetchUserCapacityScore,
  parafraseCoachFromBankWithCapacity,
  toCapacityBand,
} from '../../lib/mabraCapacityParafras';
import {
  getMabraCoachBankEntry,
  parafraseGoalAssist,
  parafraseRsdErrorFromBank,
  resolveBankParafrasBankId,
  resolveCoachBankId,
  resolveGoalAssistBankId,
  resolveRsdErrorBankId,
  resolveVitChatBankId,
  type MabraCoachExercise,
  type MabraCoachHub,
} from '../../lib/mabraContentBank';
import { invalidBankIdError } from './helpers';

export const mabraCoach = onCall(
  { region: 'europe-west1', secrets: ['GEMINI_API_KEY'] },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'mabraCoach', 30);

    const hubSymptom = request.data.hubSymptom;
    const exerciseType = request.data.exerciseType;
    const optionalNote = typeof request.data.optionalNote === 'string' ? request.data.optionalNote : undefined;
    const mode = typeof request.data.mode === 'string' ? request.data.mode : 'coach';
    const thought = typeof request.data.thought === 'string' ? request.data.thought.trim() : '';

    if (mode === 'rsd_error') {
      const requestedBankId =
        typeof request.data.bankId === 'string' ? request.data.bankId.trim() : undefined;
      let bankId: string;
      try {
        bankId = resolveRsdErrorBankId(requestedBankId);
      } catch {
        throw invalidBankIdError('Ogiltig bankId för rsd_error.');
      }
      const bankEntry = getMabraCoachBankEntry(bankId);
      if (!bankEntry) {
        throw invalidBankIdError('Bankrad saknas för rsd_error.');
      }
      const coach = parafraseRsdErrorFromBank(bankEntry);
      return { coach, redirectToSpeglar: false, bankId };
    }

    if (mode === 'bank_parafras') {
      const requestedBankId =
        typeof request.data.bankId === 'string' ? request.data.bankId.trim() : '';
      if (!requestedBankId) {
        throw new HttpsError('invalid-argument', 'Fältet "bankId" krävs för bank_parafras.');
      }
      let bankId: string;
      try {
        bankId = resolveBankParafrasBankId(requestedBankId);
      } catch {
        throw invalidBankIdError('Ogiltig bankId för bank_parafras.');
      }
      const bankNote =
        typeof request.data.optionalNote === 'string' ? request.data.optionalNote : undefined;
      if (bankNote && bankNote.length > 500) {
        throw new HttpsError('invalid-argument', 'optionalNote max 500 tecken.');
      }
      if (shouldRedirectMabraCoachToSpeglar(bankNote)) {
        return {
          coach: MABRA_SPEGLAR_REDIRECT_MESSAGE,
          redirectToSpeglar: true,
        };
      }
      const bankEntry = getMabraCoachBankEntry(bankId);
      if (!bankEntry) {
        throw invalidBankIdError('Bankrad saknas för bank_parafras.');
      }
      const validHubs = ['panic_rsd', 'self_critical', 'find_self'] as const;
      const validExercises = ['breathing', 'grounding', 'reframing'] as const;
      const hubRaw = request.data.hubSymptom;
      const exerciseRaw = request.data.exerciseType;
      const hubCtx =
        typeof hubRaw === 'string' && (validHubs as readonly string[]).includes(hubRaw)
          ? (hubRaw as MabraCoachHub)
          : undefined;
      const exerciseCtx =
        typeof exerciseRaw === 'string' && (validExercises as readonly string[]).includes(exerciseRaw)
          ? (exerciseRaw as MabraCoachExercise)
          : undefined;
      const capacityScore = await fetchUserCapacityScore(uid);
      const capacityBand = toCapacityBand(capacityScore);
      const coachTone = await resolveCoachToneForUser(uid);
      const capacityCoach = parafraseCoachFromBankWithCapacity(
        bankEntry,
        capacityBand,
        hubCtx,
        exerciseCtx,
        coachTone,
      );
      return {
        coach: capacityCoach.coach,
        redirectToSpeglar: false,
        bankId,
        capacityBand: capacityCoach.capacityBand,
        ...(capacityCoach.microSteps ? { microSteps: capacityCoach.microSteps } : {}),
        ...(capacityCoach.coachToneApplied
          ? { coachToneApplied: capacityCoach.coachToneApplied }
          : {}),
      };
    }

    if (mode === 'transformator') {
      if (!thought || thought.length > 500) {
        throw new HttpsError(
          'invalid-argument',
          'Fältet "thought" krävs (max 500 tecken) för transformator-läge.',
        );
      }
      if (shouldRedirectMabraCoachToSpeglar(thought)) {
        return {
          redirectToSpeglar: true,
          coach: MABRA_SPEGLAR_REDIRECT_MESSAGE,
        };
      }
      const transform = await askKbtTransformator(thought, process.env.GEMINI_API_KEY);
      return { transform, redirectToSpeglar: false };
    }

    if (mode === 'goal_assist') {
      const draftGoal =
        typeof request.data.draftGoal === 'string' ? request.data.draftGoal.trim() : undefined;
      if (draftGoal && draftGoal.length > 500) {
        throw new HttpsError('invalid-argument', 'draftGoal max 500 tecken.');
      }
      if (draftGoal && shouldRedirectMabraCoachToSpeglar(draftGoal)) {
        return {
          coach: MABRA_SPEGLAR_REDIRECT_MESSAGE,
          redirectToSpeglar: true,
        };
      }
      const requestedBankId =
        typeof request.data.bankId === 'string' ? request.data.bankId.trim() : undefined;
      let bankId: string;
      try {
        bankId = resolveGoalAssistBankId(draftGoal, requestedBankId);
      } catch {
        throw invalidBankIdError('Ogiltig bankId för goal_assist.');
      }
      const bankEntry = getMabraCoachBankEntry(bankId);
      if (!bankEntry) {
        throw invalidBankIdError('Bankrad saknas för goal_assist.');
      }
      const coach = parafraseGoalAssist(bankEntry, draftGoal);
      return { coach, redirectToSpeglar: false, bankId };
    }

    if (mode === 'vit_chat') {
      const projectId = typeof request.data.projectId === 'string' ? request.data.projectId.trim() : '';
      const vitMessage = typeof request.data.vitMessage === 'string' ? request.data.vitMessage.trim() : '';
      const seedPrompt = typeof request.data.seedPrompt === 'string' ? request.data.seedPrompt.trim() : undefined;
      const validProjects = ['self_esteem', 'emotional_memory', 'learn_together', 'who_am_i'];

      if (!projectId || !validProjects.includes(projectId)) {
        throw new HttpsError(
          'invalid-argument',
          'Fältet "projectId" krävs (self_esteem | emotional_memory | learn_together | who_am_i).',
        );
      }
      if (!vitMessage || vitMessage.length > 500) {
        throw new HttpsError(
          'invalid-argument',
          'Fältet "vitMessage" krävs (max 500 tecken) för vit_chat.',
        );
      }
      if (shouldRedirectMabraCoachToSpeglar(vitMessage)) {
        return {
          coach: MABRA_SPEGLAR_REDIRECT_MESSAGE,
          redirectToSpeglar: true,
        };
      }
      const vitBankId =
        typeof request.data.bankId === 'string' ? request.data.bankId.trim() : undefined;
      let resolvedVitBankId: string | undefined;
      try {
        resolvedVitBankId = resolveVitChatBankId(seedPrompt, vitBankId);
      } catch {
        throw invalidBankIdError('Ogiltig bankId för vit_chat.');
      }
      const vitBankEntry = resolvedVitBankId
        ? getMabraCoachBankEntry(resolvedVitBankId)
        : undefined;
      const coach = await askVitChatCoach(
        projectId,
        vitMessage,
        vitBankEntry,
        process.env.GEMINI_API_KEY,
      );
      return {
        coach,
        redirectToSpeglar: false,
        ...(resolvedVitBankId ? { bankId: resolvedVitBankId } : {}),
      };
    }

    if (mode === 'nutrition_coach') {
      const { askMabraNutritionCoach } = await import('../../agents/vertexAgent');
      const coach = await askMabraNutritionCoach(optionalNote || 'Jag vill ha ett näringstillägg', process.env.GEMINI_API_KEY);
      
      await admin.firestore().collection('mabra_sessions').add({
        ownerId: uid,
        exerciseType: 'nutrition_coach',
        durationSeconds: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        coachConversation: {
          note: String(optionalNote || '').slice(0, 2000),
          coachReply: String(coach || '').slice(0, 8000),
        },
      });

      return { coach, redirectToSpeglar: false };
    }

    if (mode === 'movement_coach') {
      const { askMabraMovementCoach } = await import('../../agents/vertexAgent');
      const coach = await askMabraMovementCoach(optionalNote || 'Jag vill röra på mig i 2 minuter', process.env.GEMINI_API_KEY);
      
      await admin.firestore().collection('mabra_sessions').add({
        ownerId: uid,
        exerciseType: 'movement_coach',
        durationSeconds: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        coachConversation: {
          note: String(optionalNote || '').slice(0, 2000),
          coachReply: String(coach || '').slice(0, 8000),
        },
      });

      return { coach, redirectToSpeglar: false };
    }

    const validHubs = ['panic_rsd', 'self_critical', 'find_self'];
    const validExercises = ['breathing', 'grounding', 'reframing'];

    if (!hubSymptom || typeof hubSymptom !== 'string' || !validHubs.includes(hubSymptom)) {
      throw new HttpsError(
        'invalid-argument',
        'Fältet "hubSymptom" krävs (panic_rsd | self_critical | find_self).',
      );
    }

    if (!exerciseType || typeof exerciseType !== 'string' || !validExercises.includes(exerciseType)) {
      throw new HttpsError(
        'invalid-argument',
        'Fältet "exerciseType" krävs (breathing | grounding | reframing).',
      );
    }

    if (optionalNote && optionalNote.length > 500) {
      throw new HttpsError('invalid-argument', 'optionalNote får vara max 500 tecken.');
    }

    if (shouldRedirectMabraCoachToSpeglar(optionalNote)) {
      return {
        coach: MABRA_SPEGLAR_REDIRECT_MESSAGE,
        redirectToSpeglar: true,
      };
    }

    const requestedBankId =
      typeof request.data.bankId === 'string' ? request.data.bankId.trim() : undefined;
    let bankId: string;
    try {
      bankId = resolveCoachBankId(
        hubSymptom as MabraCoachHub,
        exerciseType as MabraCoachExercise,
        requestedBankId,
      );
    } catch {
      throw invalidBankIdError('Ogiltig bankId för coach-läge.');
    }
    const bankEntry = getMabraCoachBankEntry(bankId);
    if (!bankEntry) {
      throw invalidBankIdError('Bankrad saknas för coach-läge.');
    }

    const parafrasTier = request.data.parafrasTier === 'deterministic' ? 'deterministic' : 'llm';
    if (parafrasTier === 'deterministic') {
      const capacityScore = await fetchUserCapacityScore(uid);
      const capacityBand = toCapacityBand(capacityScore);
      const coachTone = await resolveCoachToneForUser(uid);
      const capacityCoach = parafraseCoachFromBankWithCapacity(
        bankEntry,
        capacityBand,
        hubSymptom as MabraCoachHub,
        exerciseType as MabraCoachExercise,
        coachTone,
      );
      return {
        coach: capacityCoach.coach,
        redirectToSpeglar: false,
        bankId,
        capacityBand: capacityCoach.capacityBand,
        ...(capacityCoach.microSteps ? { microSteps: capacityCoach.microSteps } : {}),
        ...(capacityCoach.coachToneApplied
          ? { coachToneApplied: capacityCoach.coachToneApplied }
          : {}),
      };
    }

    const coachTone = await resolveCoachToneForUser(uid);
    const coach = await askMabraCoach(
      hubSymptom as MabraCoachHub,
      exerciseType as MabraCoachExercise,
      bankEntry,
      optionalNote,
      process.env.GEMINI_API_KEY,
      await loadAdaptationSemanticContext(uid),
      coachTone,
    );
    return { coach, redirectToSpeglar: false, bankId };
  }
);
