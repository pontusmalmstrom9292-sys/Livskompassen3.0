export type ForalderTryggCategory = 'trygghet' | 'reflektion' | 'vardag';

export interface ForalderTryggTip {
  id: string;
  title: string;
  category: ForalderTryggCategory;
  content: string; // Markdown format
  reflectionQuestion: string;
}

export interface ForalderTryggManifest {
  tips: ForalderTryggTip[];
}

export interface ReflectionEntry {
  userId: string;
  reflectionDate: string; // ISO-sträng
  tipId: string;
  reflectionText: string;
  timestamp: any; // Server timestamp marker
}
