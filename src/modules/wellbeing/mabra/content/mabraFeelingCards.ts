/** Känslokort — namn + reflektion (Mabra-CONTENT-BANK, inget rätt svar). */

export type MabraFeelingCard = {
  id: string;
  emoji: string;
  label: string;
  prompt_sv: string;
};

export const MABRA_FEELING_CARDS: readonly MabraFeelingCard[] = [
  { id: 'lugn', emoji: '🙂', label: 'Lugn', prompt_sv: 'Var i kroppen känner du lugn — eller nästan lugn?' },
  { id: 'glad', emoji: '😊', label: 'Glad', prompt_sv: 'Vad är den lilla glädjen bakom känslan?' },
  { id: 'oro', emoji: '😟', label: 'Oro', prompt_sv: 'Vad behöver oron inte att du löser just nu?' },
  { id: 'arg', emoji: '😤', label: 'Arg', prompt_sv: 'Vad skyddar ilskan — ett ord?' },
  { id: 'trott', emoji: '😴', label: 'Trött', prompt_sv: 'Är det sömn, eller trötthet i nervsystemet?' },
  { id: 'tom', emoji: '😶', label: 'Tom', prompt_sv: 'Tomhet är också en känsla — vad vill den ha av dig?' },
  { id: 'spand', emoji: '😬', label: 'Spänd', prompt_sv: 'Var sitter spänningen — axlar, käke, mage?' },
  { id: 'overvaldigad', emoji: '🌊', label: 'Överväldigad', prompt_sv: 'Vilket är det minsta du kan göra för att sänka tempot?' },
  { id: 'tacksam', emoji: '💛', label: 'Tacksam', prompt_sv: 'Vad är du tacksam för som bara är för dig?' },
  { id: 'hopfull', emoji: '🌱', label: 'Hoppfull', prompt_sv: 'Vad är ett litet tecken på framåt?' },
] as const;
