import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VALV_SAMLA_GRANSKA_LINK } from '@/modules/inkast/api/inkastService';
import { clsx } from 'clsx';
import { HomeHeroKanon } from '../home/HomeHeroKanon';
import { CaptureSuperModule } from '../../capture';
import { materialEnabled, useLifeHubPreset } from '../lifeOs';
import { useStore } from '../store';
import { useTheme } from '../theme';
import { getTheme } from '../theme';
import { isMockupTheme } from '../theme/mockupTheme';
import { themeUsesDesignPackChrome } from '../theme/themePackDesign';
import { getBudgetSavings, setBudgetSaving } from '../firebase/economyFirestore';

const demoSeedKey = (uid: string) => `lk_home_widgets_seeded_${uid}`;

export function HomePage() {
  const navigate = useNavigate();
  const [cardRefreshKey, setCardRefreshKey] = useState(0);
  const user = useStore((s) => s.user);
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const { preset, presetId } = useLifeHubPreset();
  const { themeId } = useTheme();
  const mockupSkin = isMockupTheme(themeId) || themeUsesDesignPackChrome(getTheme(themeId));
  const [widgets, setWidgets] = useState<UserWidgetRow[]>([]);
  const seedingRef = useRef(false);

  useEffect(() => {
    if (!user) {
      setWidgets([]);
      return;
    }
    return subscribeUserWidgets(user.uid, (data) => {
      setWidgets(data);
    });
  }, [user]);

  useEffect(() => {
    if (!user || widgets.length > 0 || seedingRef.current) return;
    if (localStorage.getItem(demoSeedKey(user.uid)) === '1') return;

    seedingRef.current = true;

    void (async () => {
      try {
        const demoSavingsTitle = 'Sommarresa med pojkarna';
        const existing = await getBudgetSavings(user.uid);
        const matched = existing.find((g) => g.title === demoSavingsTitle);
        const savingsGoalId =
          matched?.id ??
          (await setBudgetSaving(user.uid, {
            title: demoSavingsTitle,
            targetSek: 15_000,
            currentSek: 4_200,
          }));

        await saveUserWidget(user.uid, {
          type: 'countdown',
          title: 'Skolavslutning & Semester',
          pinnedToHome: true,
          order: 0,
          config: { targetDate: '2026-06-12' },
        });
        await saveUserWidget(user.uid, {
          type: 'checklist',
          title: 'Överlämning — packlista',
          pinnedToHome: true,
          order: 1,
          config: {
            checklistItems: [
              { id: 'item-1', text: 'Kasper: Gosedjur & pyjamas', done: false },
              { id: 'item-2', text: 'Arvid: Medicinskt schema & astmaspray', done: false },
              { id: 'item-3', text: 'Barnens ID-kort & busskort', done: false },
            ],
          },
        });
        await saveUserWidget(user.uid, {
          type: 'linked_savings',
          title: 'Sparmål — Sommarresa',
          pinnedToHome: true,
          order: 2,
          config: { savingsGoalId },
        });

        localStorage.setItem(demoSeedKey(user.uid), '1');
      } catch {
        seedingRef.current = false;
      }
    })();
  }, [user, widgets.length]);

  const handleUpdateWidgetConfig = async (widgetId: string, config: UserWidgetRow['config']) => {
    if (!user) return;
    try {
      await updateUserWidgetConfig(user.uid, widgetId, config);
    } catch {
      // Tyst hantering
    }
  };

  const handleDeleteWidget = async (widgetId: string) => {
    if (!user) return;
    try {
      await deleteUserWidget(user.uid, widgetId);
    } catch {
      // Tyst hantering
    }
  };

  return (
    <div
      className={clsx(
        'home-page home-page--kanon home-page--scenic space-y-4',
        mockupSkin && 'home-page--mockup-skin',
      )}
    >
      <HomeHeroKanon onCheckInSaved={() => setCardRefreshKey((k) => k + 1)} />

      {!mockupSkin &&
        materialEnabled(preset, 'home_inkast') &&
        !materialEnabled(preset, 'home_hero_checkin') &&
        isAuthenticated && <CaptureSuperModule variant="hem-capture" />}

      {!mockupSkin && materialEnabled(preset, 'home_inkast') && !isAuthenticated && (
        <CaptureSuperModule
          variant="hem-inkast"
          onQueued={() => navigate(VALV_SAMLA_GRANSKA_LINK)}
        />
      )}
    </div>
  );
}
