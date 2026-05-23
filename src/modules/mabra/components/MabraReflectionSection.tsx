import type { EmotionCompassValue } from './EmotionCompass';
import { EmotionCompass } from './EmotionCompass';
import { DailyQuestionCard } from './DailyQuestionCard';
import { CognitivePlaysList, type CognitivePlayId } from './CognitivePlaysList';

type Props = {
  mood: EmotionCompassValue | null;
  onMoodChange: (value: EmotionCompassValue) => void;
  onStartPlay: (play: CognitivePlayId) => void;
};

export function MabraReflectionSection({ mood, onMoodChange, onStartPlay }: Props) {
  return (
    <div className="mabra-reflection-hub space-y-6 border-b border-border-strong pb-6">
      <EmotionCompass value={mood} onChange={onMoodChange} />
      <DailyQuestionCard />
      <CognitivePlaysList onStart={onStartPlay} />
    </div>
  );
}
