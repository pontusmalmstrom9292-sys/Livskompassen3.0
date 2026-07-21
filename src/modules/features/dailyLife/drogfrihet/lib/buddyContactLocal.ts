/** @locked MOD-FAM-DROG — låst modul; unlock via docs/evaluations/*-unlock-MOD-FAM-DROG.md */
/** Lokal trygg kontakt — telefon stannar på enheten (Zero Footprint). */

export type BuddyContactLocal = {
  displayName: string;
  phoneE164: string;
  buddyCodeMine?: string;
  linked?: boolean;
};

const KEY = 'livskompassen_df_buddy:';

function k(uid?: string) {
  return `${KEY}${uid || 'local'}`;
}

export function loadBuddyContact(uid?: string): BuddyContactLocal {
  try {
    const raw = localStorage.getItem(k(uid));
    if (!raw) return { displayName: '', phoneE164: '' };
    const p = JSON.parse(raw) as Partial<BuddyContactLocal>;
    return {
      displayName: String(p.displayName ?? '').slice(0, 40),
      phoneE164: String(p.phoneE164 ?? '').replace(/[^\d+]/g, '').slice(0, 20),
      buddyCodeMine: typeof p.buddyCodeMine === 'string' ? p.buddyCodeMine : undefined,
      linked: Boolean(p.linked),
    };
  } catch {
    return { displayName: '', phoneE164: '' };
  }
}

export function saveBuddyContact(contact: BuddyContactLocal, uid?: string): void {
  localStorage.setItem(
    k(uid),
    JSON.stringify({
      displayName: contact.displayName.slice(0, 40),
      phoneE164: contact.phoneE164.replace(/[^\d+]/g, '').slice(0, 20),
      buddyCodeMine: contact.buddyCodeMine,
      linked: contact.linked,
    }),
  );
}

export const BUDDY_SMS_BODY =
  'Hej — jag behöver ett kort check-in. Inget mer. /Livskompassen';

export function buddyTelHref(phone: string): string | null {
  const p = phone.replace(/[^\d+]/g, '');
  if (p.length < 8) return null;
  return `tel:${p}`;
}

export function buddySmsHref(phone: string): string | null {
  const p = phone.replace(/[^\d+]/g, '');
  if (p.length < 8) return null;
  return `sms:${p}?body=${encodeURIComponent(BUDDY_SMS_BODY)}`;
}
