/** Obsidian Calm — statisk gradient, inga rörliga blobs. */
export function AmbientBackground() {
  return (
    <div className="ambient-bg" aria-hidden>
      <div
        className="ambient-blob ambient-blob--gold"
        style={{ width: 420, height: 420, top: '-8%', left: '-10%' }}
      />
      <div
        className="ambient-blob ambient-blob--indigo"
        style={{ width: 360, height: 360, bottom: '10%', right: '-5%' }}
      />
    </div>
  );
}
