/** Obsidian Calm — guld + indigo blur-blobs bakom innehåll. */
export function AmbientBackground() {
  return (
    <div className="ambient-bg" aria-hidden>
      <div
        className="ambient-blob ambient-blob--gold ambient-blob--1"
        style={{ width: 420, height: 420, top: '-8%', left: '-10%' }}
      />
      <div
        className="ambient-blob ambient-blob--indigo ambient-blob--2"
        style={{ width: 360, height: 360, bottom: '10%', right: '-5%' }}
      />
      <div
        className="ambient-blob ambient-blob--gold ambient-blob--3"
        style={{ width: 280, height: 280, bottom: '25%', left: '20%', opacity: 0.6 }}
      />
    </div>
  );
}
