import { useNavigate } from 'react-router-dom';

const NEXT_STEPS = [
  { label: 'Handling — kanban P3', href: '/planering?tab=handling' },
  { label: 'Fokus — ett mikrosteg', href: '/planering?tab=fokus' },
  { label: 'Inkorg — fånga', href: '/planering?tab=inkorg' },
  { label: 'Regler — e-post', href: '/planering?tab=regler' },
  { label: 'Framsteg — vecka', href: '/planering?tab=framsteg' },
  { label: 'Alla verktyg (hub)', href: '/planering' },
] as const;

/** IA Våg 3 — en handlingsrad: dropdown istället för extra pill-rad. */
export function PlaneringNextStepSelect() {
  const navigate = useNavigate();

  return (
    <label className="planering-next-step block text-xs text-text-muted">
      Nästa steg
      <select
        className="input-glass mt-1 w-full rounded-xl px-3 py-2 text-sm"
        value=""
        onChange={(e) => {
          const href = e.target.value;
          if (href) navigate(href);
        }}
        aria-label="Välj nästa planeringssteg"
      >
        <option value="">Välj steg…</option>
        {NEXT_STEPS.map((step) => (
          <option key={step.href} value={step.href}>
            {step.label}
          </option>
        ))}
      </select>
    </label>
  );
}
