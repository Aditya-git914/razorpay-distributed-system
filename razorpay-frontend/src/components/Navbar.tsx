import React, { useState } from 'react';
import { Search, Sparkles, ShieldCheck, Zap, Bell, CheckCircle2 } from 'lucide-react';
import { ApiClient } from '../api/client';

interface NavbarProps {
  onOpenCheckout: () => void;
  onRunAiQuery: (query: string) => void;
  isTestMode: boolean;
  setIsTestMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCheckout,
  onRunAiQuery,
  isTestMode,
  setIsTestMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const res = await ApiClient.executeNaturalLanguageQuery(searchQuery);
    setQueryResult(res);
    setIsSearching(false);
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-[#081225]/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Brand & Mode */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-[#0052cc] to-[#3395ff] text-white font-black text-xl shadow-lg shadow-[#0052cc]/30">
              R
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white">Razorpay</span>
                <span className="rounded bg-sky-500/10 px-1.5 py-0.5 text-[10px] font-bold text-sky-400 border border-sky-500/20">
                  DISTRIBUTED
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Acme Online Store</p>
            </div>
          </div>

          {/* Test / Live Toggle */}
          <div className="flex items-center gap-2 rounded-full bg-slate-900/90 p-1 border border-slate-800">
            <button
              onClick={() => setIsTestMode(true)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                isTestMode
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Test Mode
            </button>
            <button
              onClick={() => setIsTestMode(false)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                !isTestMode
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Live Mode
            </button>
          </div>
        </div>

        {/* AI Natural Language Query Bar */}
        <div className="relative flex-1 max-w-xl mx-8">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative flex items-center">
              <Sparkles className="absolute left-3.5 h-4 w-4 text-[#3395ff] animate-pulse" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask AI: 'Compare UPI vs Card' or 'What was my highest volume day?'..."
                className="w-full rounded-full border border-slate-700/80 bg-slate-900/80 py-2 pl-10 pr-24 text-xs text-white placeholder-slate-400 focus:border-[#3395ff] focus:outline-none focus:ring-1 focus:ring-[#3395ff] transition-all"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="absolute right-1.5 rounded-full bg-[#0c66e4] hover:bg-[#3395ff] px-3 py-1 text-[11px] font-semibold text-white transition-colors"
              >
                {isSearching ? 'Thinking...' : 'AI Query'}
              </button>
            </div>
          </form>

          {/* Floating AI Query Popover */}
          {queryResult && (
            <div className="absolute left-0 right-0 top-12 z-50 rounded-xl border border-sky-500/30 bg-[#0f1f38]/95 p-4 shadow-2xl backdrop-blur-xl">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs">
                  <Sparkles className="h-4 w-4" /> AI Answer
                </div>
                <button
                  onClick={() => setQueryResult(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-200 leading-relaxed font-medium">
                {queryResult.answer}
              </p>
              {queryResult.suggestedAction && (
                <div className="mt-2.5 rounded-lg bg-sky-500/10 p-2 text-[11px] text-sky-300 border border-sky-500/20">
                  <span className="font-bold">Recommendation:</span> {queryResult.suggestedAction}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCheckout}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#0c66e4] to-[#00d2ff] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[#0c66e4]/25 hover:opacity-95 transition-all transform hover:-translate-y-0.5"
          >
            <Zap className="h-4 w-4 fill-white" />
            Test Checkout
          </button>

          <div className="h-6 w-px bg-slate-800" />

          <div className="flex items-center gap-3 pl-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200">
              AC
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-white">Merchant Admin</p>
              <p className="text-[10px] text-slate-400 font-mono">ID: rzp_11111111</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
