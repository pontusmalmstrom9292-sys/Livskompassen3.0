/**
 * Gemini / extern mock — KompisChat UI (inkorg only).
 * NOT part of Vite build. Source: user paste 2026-05-23.
 *
 * LÅST MED: screenshots-inkorg-2026-05-23/23-valv-chatt-ux-referens.png
 *
 * Placering vid implementation: UX-målbild för **Valv-chatt** (`ValvChatPanel`),
 * bakom Fyren — INTE ny route `/kompis`. Backend: `valvChatQuery`.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Brain, User } from 'lucide-react';
import type { ChatMessage } from './gemini-kompis-chat-types';

interface KompisChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
}

const KompisChat: React.FC<KompisChatProps> = ({ messages, onSendMessage }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="glass-panel-purple rounded-3xl p-5 mb-4 shrink-0 flex items-center gap-4">
        <div className="p-3 bg-fuchsia-500/20 rounded-2xl border border-fuchsia-500/30 shadow-[0_0_15px_rgba(217,70,239,0.3)]">
          <Sparkles className="w-6 h-6 text-fuchsia-400" />
        </div>
        <div>
          <h2 className="text-[10px] font-bold text-fuchsia-400 tracking-widest uppercase mb-1">Din AI-Livsarkitekt</h2>
          <h1 className="text-xl font-bold text-slate-100">Kompis</h1>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4 pb-4 px-1">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
            <Brain className="w-12 h-12 text-fuchsia-400 mb-4" />
            <p className="text-sm text-slate-300 max-w-[200px]">Hej! Jag är Kompis. Hur kan jag hjälpa dig att navigera dagen?</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex w-full animate-slide-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-auto ${
                msg.role === 'user' ? 'bg-slate-800 border border-slate-700' : 'bg-fuchsia-500/20 border border-fuchsia-500/30'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-slate-400" /> : <Sparkles className="w-4 h-4 text-fuchsia-400" />}
              </div>
              <div className={`p-4 rounded-3xl ${
                msg.role === 'user' 
                  ? 'bg-slate-800 text-slate-200 rounded-br-sm' 
                  : 'glass-panel-purple text-slate-100 rounded-bl-sm shadow-[0_4px_20px_rgba(168,85,247,0.1)]'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <span className="text-[9px] text-slate-500 mt-2 block text-right">{msg.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="shrink-0 pt-2">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Skriv till Kompis..."
            className="w-full glass-panel rounded-full pl-6 pr-14 py-4 text-sm text-slate-200 focus:outline-none focus:border-fuchsia-500 transition-colors placeholder:text-slate-500"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 w-10 h-10 rounded-full bg-fuchsia-500 hover:bg-fuchsia-400 flex items-center justify-center text-white transition-all disabled:opacity-50 disabled:scale-90"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>

    </div>
  );
};

export default KompisChat;
