import { useMemo } from 'react';
import { useTheme } from '../theme';
import { getTheme } from '../theme/themeRegistry';
import {
  DESIGN_PACK_CHROME,
  getDesignPackIdFromTheme,
  resolveCenterTitle,
  type DesignPackChrome,
  type DesignPackId,
} from './designPackMeta';

export function useDesignPack(): {
  active: boolean;
  packId: DesignPackId | null;
  chrome: DesignPackChrome | null;
  centerTitle: string;
} {
  const { themeId } = useTheme();
  return useMemo(() => {
    const packId =
      getTheme(themeId).designPackId ?? getDesignPackIdFromTheme(themeId);
    if (!packId) {
      return { active: false, packId: null, chrome: null, centerTitle: 'LIVSKOMPASSEN' };
    }
    const chrome = DESIGN_PACK_CHROME[packId];
    return {
      active: true,
      packId,
      chrome,
      centerTitle: 'LIVSKOMPASSEN',
    };
  }, [themeId]);
}

export function useDesignPackCenterTitle(pathname: string): string | null {
  const { active, chrome } = useDesignPack();
  if (!active || !chrome || chrome.header !== 'center-ornament') return null;
  return resolveCenterTitle(pathname, chrome);
}
