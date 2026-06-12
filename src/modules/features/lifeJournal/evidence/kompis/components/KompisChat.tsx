import { useState, useRef, useEffect } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Send, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { KompisMark } from './KompisMark';
import { useStore } from '@/modules/core/store';

type ChatMessage = {
  role: 'user' | 'model';
  parts: { text: string }[];
};

type ChatWithKompisRequest = {
  history: ChatMessage[];
  message: string;
};

type ChatWithKompisResponse = {
  reply: string;
};

export function KompisChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const setKompisAura = useStore((s) => s.setKompisAura);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg = inputText.trim();
    setInputText('');
    setIsLoading(true);
    setKompisAura(true);

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', parts: [{ text: userMsg }] },
    ];
    setMessages(newMessages);

    try {
      const functions = getFunctions();
      const chatFunction = httpsCallable<ChatWithKompisRequest, ChatWithKompisResponse>(
        functions,
        'chatWithKompis'
      );

      const result = await chatFunction({
        history: messages,
        message: userMsg,
      });

      if (result.data && result.data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: 'model', parts: [{ text: result.data.reply }] },
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'model', parts: [{ text: 'Ett fel uppstod. Vänligen försök igen senare.' }] },
      ]);
    } finally {
      setIsLoading(false);
      setKompisAura(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] max-h-[70vh] rounded-2xl border border-border/15 bg-surface-2/30 backdrop-blur-md overflow-hidden shadow-lg">
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-text-muted space-y-3 opacity-60">
            <KompisMark className="h-10 w-10 text-accent/50" />
            <p className="text-sm">Skriv ett meddelande för att prata med Kompis.</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={clsx(
                'flex w-full',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={clsx(
                  'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm',
                  msg.role === 'user'
                    ? 'bg-accent/10 text-accent rounded-br-sm'
                    : 'glass-card text-text rounded-bl-sm'
                )}
              >
                {msg.parts[0].text}
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex w-full justify-start">
            <div className="glass-card text-text-muted rounded-2xl rounded-bl-sm px-4 py-3 text-sm flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-accent" />
              <span>Kompis skriver...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-surface/50 border-t border-border/15">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Skriv ett meddelande..."
            className="input-glass w-full resize-none py-3 pl-4 pr-12 min-h-[44px] max-h-[120px] rounded-xl overflow-y-auto"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="absolute right-2 bottom-2 p-2 rounded-full text-accent hover:bg-accent/10 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            aria-label="Skicka meddelande"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
