import { useState } from 'react';
import { ElongatedModule } from '../ui/ElongatedModule';
import {
  HOME_ACTION_CATEGORIES,
  getHomeActionCategory,
  type HomeActionId,
} from './homeActionCategories';
import { HomeDagbokPanel } from './panels/HomeDagbokPanel';
import { HomeTaskPanel } from './panels/HomeTaskPanel';
import { HomeVaultLearningPanel } from './panels/HomeVaultLearningPanel';

const toneMap = {
  gold: 'gold',
  emerald: 'emerald',
  indigo: 'indigo',
  lavender: 'lavender',
} as const;

type Props = {
  onSaved?: () => void;
};

/** Snabbmoduler under kompasserna — en avlång rad i taget. */
export function HomeQuickModules({ onSaved }: Props) {
  const [expanded, setExpanded] = useState<HomeActionId | null>(null);
  const items = HOME_ACTION_CATEGORIES.filter((c) => c.id !== 'kompass');

  return (
    <div className="home-module-stack" aria-label="Snabbval">
      {items.map((item) => {
        const Icon = item.icon;
        const isOpen = expanded === item.id;
        const category = getHomeActionCategory(item.id);
        return (
          <ElongatedModule
            key={item.id}
            id={`home-quick-${item.id}`}
            title={category.label}
            lead={category.desc}
            icon={Icon}
            tone={toneMap[item.tone]}
            expanded={isOpen}
            onToggle={() => setExpanded(isOpen ? null : item.id)}
          >
            {item.id === 'dagbok' && <HomeDagbokPanel />}
            {item.id === 'uppgift' && <HomeTaskPanel />}
            {item.id === 'quiz' && (
              <HomeVaultLearningPanel mode="quiz" onSaved={onSaved} />
            )}
            {item.id === 'lucka' && (
              <HomeVaultLearningPanel mode="gap" onSaved={onSaved} />
            )}
          </ElongatedModule>
        );
      })}
    </div>
  );
}
