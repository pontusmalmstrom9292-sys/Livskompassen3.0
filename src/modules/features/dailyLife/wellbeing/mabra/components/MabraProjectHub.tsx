import { Archive, CloudRain, HeartCrack, Leaf } from 'lucide-react';
import { Button, ButtonLink } from '@/design-system';
import { ElongatedModule } from '@/core/ui/ElongatedModule';
import { sectionEyebrowClass } from '@/core/ui/typeScale';
import { VIT_HUB_KRAVLOST, VIT_HUB_VAULT_LINK } from '../lib/vitHubCopy';
import { VAULT_VIT_TAB_LINK } from '../lib/vitHubLinks';
import { MABRA_PROJECTS } from '../constants/mabraProjects';
import type { MabraProjectId } from '../constants/mabraProjects';
import { SYMPTOM_HUB_OPTIONS, VALUES_COMPASS_COPY } from '../constants';
import type { MabraSymptomHub } from '../types';

const AKUT_ICONS = {
  panic_rsd: CloudRain,
  self_critical: HeartCrack,
  find_self: Leaf,
} as const;

type Props = {
  onSelectProject: (id: MabraProjectId) => void;
  onSelectAkut: (hub: MabraSymptomHub) => void;
  onOpenValues: () => void;
};

/** MåBra — avlånga rader: akut + egna projekt. */
export function MabraProjectHub({ onSelectProject, onSelectAkut, onOpenValues }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <p className={`${sectionEyebrowClass} mb-2`}>Akut nu</p>
        <div className="home-module-stack">
          {SYMPTOM_HUB_OPTIONS.map((option) => (
            <ElongatedModule
              key={option.id}
              id={`mabra-akut-${option.id}`}
              title={option.label}
              lead={option.hint}
              icon={AKUT_ICONS[option.id]}
              tone="lavender"
              expanded={false}
              onToggle={() => onSelectAkut(option.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className={`${sectionEyebrowClass} mb-2`}>Egna projekt</p>
        <p className="mb-2 text-xs text-text-muted">
          Valvet skapar en plan — frågekort, chatt eller känslominnen — sparat i din Vit hub.{' '}
          {VIT_HUB_KRAVLOST}
        </p>
        <div className="home-module-stack">
          {MABRA_PROJECTS.map((project) => (
            <ElongatedModule
              key={project.id}
              id={`mabra-project-${project.id}`}
              title={project.title}
              lead={project.lead}
              icon={project.icon}
              tone="gold"
              expanded={false}
              onToggle={() => onSelectProject(project.id)}
            />
          ))}
        </div>
      </div>

      <ButtonLink
        to={VAULT_VIT_TAB_LINK}
        variant="ghost"
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        <Archive className="h-4 w-4" aria-hidden />
        {VIT_HUB_VAULT_LINK}
      </ButtonLink>

      <Button
        variant="ghost"
        className="min-h-11 w-full text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        onClick={onOpenValues}
      >
        {VALUES_COMPASS_COPY.hubLinkLabel}
      </Button>
    </div>
  );
}
