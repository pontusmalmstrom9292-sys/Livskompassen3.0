type Props = {
  /** Endast när Valv är upplåst — en diskret väg tillbaka utan att exponera Valv i publikt läge. */
  showValvShell: boolean;
  onBackToVardag: () => void;
};

export function DrawerModeToggle({ showValvShell, onBackToVardag }: Props) {
  if (!showValvShell) return null;

  return (
    <div className="nav-drawer__mode" role="navigation" aria-label="Tillbaka från Valv">
      <button
        type="button"
        className="nav-drawer__mode-btn nav-drawer__mode-btn--active nav-drawer__mode-btn--solo min-h-11 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
        aria-label="Tillbaka till Vardag"
        onClick={onBackToVardag}
      >
        Vardag
      </button>
    </div>
  );
}
