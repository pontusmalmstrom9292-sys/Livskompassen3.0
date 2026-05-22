import { Router } from 'express';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse
} from '@simplewebauthn/server';
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON
} from '@simplewebauthn/types';

const router = Router();

// RP Configuration
const rpName = 'Livskompassen v2';
const rpID = 'localhost';
const origin = `http://${rpID}:3000`;

// Mock DB for challenges (In prod, use Firestore)
const userChallenges: { [userId: string]: string } = {};

router.post('/register-options', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username required' });

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: Buffer.from(username), // FIXED: Must be Uint8Array (Buffer works)
    userName: username,
    attestationType: 'none',
    authenticatorSelection: {
      residentKey: 'required',
      userVerification: 'required',
    },
  });

  userChallenges[username] = options.challenge;
  res.json(options);
});

router.post('/register-verify', async (req, res) => {
  const { username, attestationResponse } = req.body;
  const expectedChallenge = userChallenges[username];

  if (!expectedChallenge) return res.status(400).json({ error: 'Challenge not found' });

  try {
    const verification = await verifyRegistrationResponse({
      response: attestationResponse as RegistrationResponseJSON,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    if (verification.verified) {
      res.json({ verified: true });
    } else {
      res.status(400).json({ error: 'Verification failed' });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  } finally {
    delete userChallenges[username];
  }
});

router.post('/auth-options', async (req, res) => {
  const { username } = req.body;
  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: 'required',
  });

  userChallenges[username || 'anonymous'] = options.challenge;
  res.json(options);
});

router.post('/auth-verify', async (req, res) => {
  const { username, assertionResponse } = req.body;
  const expectedChallenge = userChallenges[username || 'anonymous'];

  if (!expectedChallenge) return res.status(400).json({ error: 'Challenge not found' });

  // In prod: Hämta sparad credential från DB
  const mockCredential = {
    credentialPublicKey: new Uint8Array(),
    credentialID: new Uint8Array(),
    counter: 0,
  };

  try {
    const verification = await verifyAuthenticationResponse({
      response: assertionResponse as AuthenticationResponseJSON,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: mockCredential,
    });

    if (verification.verified) {
      res.json({ verified: true, message: 'Välkommen in i valvet' });
    } else {
      res.status(400).json({ error: 'Verification failed' });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  } finally {
    delete userChallenges[username || 'anonymous'];
  }
});

export default router;
