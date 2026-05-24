/** Theme-aware ambient background — reads data-theme-bg on html. */
export function AmbientBackground() {
  return (
    <div className="ambient-bg" aria-hidden>
      <div
        className="ambient-blob ambient-blob--gold"
        style={{ width: 420, height: 420, top: '-8%', left: '-10%' }}
      />
      <div
        className="ambient-blob ambient-blob--accent-secondary"
        style={{ width: 360, height: 360, bottom: '10%', right: '-5%' }}
      />
    </div>
  );
}
