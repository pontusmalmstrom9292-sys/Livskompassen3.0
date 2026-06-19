import { useCallback, useEffect, useState, type CSSProperties, type RefObject } from 'react';

const DEFAULT_PANEL_WIDTH_PX = 46;
const ANCHOR_GAP_PX = 4;
const VIEWPORT_PAD_PX = 8;

export type FyrenHeaderQuickAnchor = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  style: CSSProperties;
};

const INITIAL_ANCHOR: FyrenHeaderQuickAnchor = {
  top: 0,
  left: 0,
  width: DEFAULT_PANEL_WIDTH_PX,
  maxHeight: 480,
  style: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: `${DEFAULT_PANEL_WIDTH_PX}px`,
    transform: 'translateX(-50%)',
    zIndex: 55,
    ['--fyren-panel-width' as string]: `${DEFAULT_PANEL_WIDTH_PX}px`,
  },
};

function measureAnchor(
  toggleBtnEl: HTMLElement | null,
  panelEl: HTMLElement | null,
  open: boolean,
): FyrenHeaderQuickAnchor {
  if (!toggleBtnEl) return INITIAL_ANCHOR;

  const rect = toggleBtnEl.getBoundingClientRect();
  const width = Math.max(Math.round(rect.width), 40);
  const top = rect.bottom + ANCHOR_GAP_PX;
  const left = rect.left + rect.width / 2;

  let naturalHeight = 360;
  if (panelEl) {
    const inner = panelEl.querySelector('.fyren-header-quick__panel');
    if (inner instanceof HTMLElement) {
      const prevMax = inner.style.maxHeight;
      inner.style.maxHeight = 'none';
      naturalHeight = inner.scrollHeight;
      inner.style.maxHeight = prevMax;
    }
  }

  let maxHeight = naturalHeight;
  if (open) {
    const viewportBudget = window.innerHeight - top - VIEWPORT_PAD_PX;
    maxHeight = Math.max(120, Math.min(naturalHeight, viewportBudget));
  }

  return {
    top,
    left,
    width,
    maxHeight,
    style: {
      position: 'fixed',
      top,
      left,
      width,
      maxHeight,
      transform: 'translateX(-50%)',
      zIndex: 55,
      ['--fyren-panel-width' as string]: `${width}px`,
      ['--fyren-panel-max-h' as string]: `${maxHeight}px`,
    },
  };
}

export function useFyrenHeaderQuickAnchor(
  toggleBtnRef: RefObject<HTMLElement | null>,
  panelRef: RefObject<HTMLElement | null>,
  open: boolean,
): FyrenHeaderQuickAnchor {
  const [anchor, setAnchor] = useState<FyrenHeaderQuickAnchor>(INITIAL_ANCHOR);

  const update = useCallback(() => {
    setAnchor(measureAnchor(toggleBtnRef.current, panelRef.current, open));
  }, [toggleBtnRef, panelRef, open]);

  useEffect(() => {
    update();

    const onLayout = () => update();
    window.addEventListener('resize', onLayout, { passive: true });
    window.addEventListener('scroll', onLayout, { passive: true, capture: true });

    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(onLayout)
        : null;
    if (toggleBtnRef.current) ro?.observe(toggleBtnRef.current);
    if (panelRef.current) ro?.observe(panelRef.current);

    return () => {
      window.removeEventListener('resize', onLayout);
      window.removeEventListener('scroll', onLayout, true);
      ro?.disconnect();
    };
  }, [open, update, toggleBtnRef, panelRef]);

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(update);
    });
    return () => cancelAnimationFrame(id);
  }, [open, update]);

  return anchor;
}
