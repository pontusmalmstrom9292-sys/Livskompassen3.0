import { useCallback, useRef, useState } from 'react';
import { ImagePlus } from 'lucide-react';

type Props = {
  label?: string;
  defaultSrc?: string;
  alt?: string;
  onPick?: (file: File) => void;
};

/** Bildyta med inset-ram och «lägg till bild» (sandbox). */
export function ExecutiveMediaFrame({
  label = 'Lägg till bild',
  defaultSrc,
  alt = 'Reflektionsbild',
  onPick,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(defaultSrc ?? null);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      const url = URL.createObjectURL(file);
      setPreview(url);
      onPick?.(file);
    },
    [onPick],
  );

  return (
    <div className="design-freeport__exec-media">
      <div
        className="design-freeport__exec-media-frame"
        style={preview ? { backgroundImage: `url(${preview})` } : undefined}
        role="img"
        aria-label={alt}
      >
        {!preview ? <span className="design-freeport__exec-media-placeholder" aria-hidden /> : null}
        <button
          type="button"
          className="design-freeport__exec-media-add"
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus className="h-4 w-4" />
          {label}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}
