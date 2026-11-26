import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User, CheckCircle } from 'lucide-react';
import { ApiClient } from '../api/client';
import { ChatMessage } from '../types';

export const AiCopilotDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am your Razorpay AI Merchant Copilot. How can I assist you with payments, webhooks, settlements, or integrations today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const samplePrompts = [
    'How do I verify webhook signatures?',
    'What is the T+1 settlement fee breakdown?',
    'How to handle customer chargeback disputes?',
  ];

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const reply = await ApiClient.askCopilot(textToSend);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0c66e4] to-[#00d2ff] px-4 py-3 text-xs font-extrabold text-white shadow-2xl shadow-[#0c66e4]/40 hover:scale-105 transition-all"
        >
          <Sparkles className="h-4 w-4 animate-spin text-white" />
          <span>Ask AI Copilot</span>
        </button>
      )}

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[540px] rounded-2xl border border-sky-500/30 bg-[#0c1e38] shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-[#081225] p-3.5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Razorpay AI Copilot
                  <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                </h3>
                <p className="text-[10px] text-slate-400">Spring AI Powered Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="h-6 w-6 rounded-full bg-sky-600/30 text-sky-300 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 leading-relaxed whitespace-pre-wrap ${
                    m.sender === 'user'
                      ? 'bg-[#0c66e4] text-white rounded-tr-none'
                      : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none'
                  }`}
                >
                  {m.text}
                  <span className="block text-[9px] text-slate-400 text-right mt-1 opacity-70">
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                <Sparkles className="h-3.5 w-3.5 animate-spin text-sky-400" />
                Copilot is typing...
              </div>
            )}
          </div>

          {/* Quick Prompt Pills */}
          <div className="px-3 py-1.5 border-t border-slate-800/60 bg-slate-900/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap rounded-full bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1 text-[10px] text-slate-300 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-800 bg-[#081225]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about payments, webhooks, settlements..."
                className="flex-1 rounded-xl border border-slate-700 bg-slate-900 py-2 px-3 text-xs text-white placeholder-slate-500 focus:border-[#3395ff] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="rounded-xl bg-[#0c66e4] hover:bg-[#3395ff] px-3 text-white transition-colors disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
