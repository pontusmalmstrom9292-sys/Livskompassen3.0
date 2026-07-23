import { useRef, useState } from 'react';
import { ImagePlus, Film } from 'lucide-react';
import { Button } from '@/design-system';

type Props = {
  disabled?: boolean;
  onPick: (file: File) => void;
  acceptVideo?: boolean;
};

const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50 MB

/** Web + Capacitor: filväljare för projektmedia (P2). */
export function ProjectMediaPicker({ disabled, onPick, acceptVideo = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptString = acceptVideo ? 'image/*,video/mp4,video/quicktime,video/webm' : 'image/*';

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={acceptString}
        className="sr-only"
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          setError(null);
          if (!file) {
            setFileName(null);
            setPreview(null);
            setIsVideo(false);
            return;
          }
          
          const isVid = file.type.startsWith('video/');
          if (isVid && file.size > MAX_VIDEO_BYTES) {
            setError('Filen är för stor (max 50 MB). Välj en kortare video.');
            setFileName(null);
            setPreview(null);
            setIsVideo(false);
            inputRef.current!.value = '';
            return;
          }

          if (preview) URL.revokeObjectURL(preview);
          setFileName(file.name);
          setIsVideo(isVid);
          setPreview(URL.createObjectURL(file));
          onPick(file);
        }}
      />
      <Button type="button" disabled={disabled} variant="secondary" className="--secondary inline-flex min-h-11 items-center gap-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40" onClick={() => inputRef.current?.click()}>
        {acceptVideo ? <Film className="h-4 w-4" /> : <ImagePlus className="h-4 w-4" />}
        {acceptVideo ? 'Välj fil (Bild/Video)' : 'Välj bild'}
      </Button>
      
      {error && <p className="text-sm text-danger">{error}</p>}
      
      {fileName && !error && (
        <p className="text-xs text-accent" aria-live="polite">
          Vald fil: {fileName}
        </p>
      )}
      {!fileName && !error && (
        <p className="text-xs text-text-muted">Ingen fil vald än — tryck «Välj fil».</p>
      )}
      
      {preview && !isVideo && (
        <img
          src={preview}
          alt="Förhandsgranskning"
          className="max-h-40 w-full rounded-xl border border-white/10 object-cover"
        />
      )}
      {preview && isVideo && (
        <video
          src={preview}
          controls
          className="max-h-60 w-full rounded-xl border border-white/10 bg-black"
        />
      )}
    </div>
  );
}
