import { Link } from 'react-router-dom';

type Props = {
  onDone: () => void;
};

export function MabraComplete({ onDone }: Props) {
  return (
    <div className="space-y-4 text-center">
      <p className="text-lg text-success">Du har landat.</p>
      <p className="text-sm text-text-muted">Bra jobbat. Du tog hand om dig.</p>
      <div className="flex flex-col gap-2 pt-2">
        <Link to="/dagbok" className="btn-pill--ghost text-sm">
          Spara insikt till Dagbok
        </Link>
        <Link to="/vardagen" className="btn-pill--ghost text-sm">
          Gå till kväll (Kompasser)
        </Link>
        <button type="button" onClick={onDone} className="btn-pill--secondary mt-2">
          Klar
        </button>
      </div>
    </div>
  );
}
