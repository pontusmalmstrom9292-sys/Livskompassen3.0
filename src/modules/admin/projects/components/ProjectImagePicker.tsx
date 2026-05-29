import { useRef, useState } from 'react';
import { ImagePlus } from 'lucide-react';

type Props = {
  disabled?: boolean;
  onPick: (file: File) => void;
};

/** Web + Capacitor: filväljare för projektbilder (P2). */
export function ProjectImagePicker({ disabled, onPick }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setPreview(URL.createObjectURL(file));
          onPick(file);
          e.target.value = '';
        }}
      />
      <button
        type="button"
        disabled={disabled}
        className="btn-pill--secondary inline-flex items-center gap-2 text-sm"
        onClick={() => inputRef.current?.click()}
      >
        <ImagePlus className="h-4 w-4" />
        Välj bild
      </button>
      {preview && (
        <img
          src={preview}
          alt="Förhandsgranskning"
          className="max-h-40 w-full rounded-xl border border-white/10 object-cover"
        />
      )}
    </div>
  );
}
