import React, { useState } from 'react';
import { BrainCircuit, ShieldAlert, Sparkles, TrendingUp, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AIInsight } from '../types';
import { ApiClient } from '../api/client';

interface AiInsightsTabProps {
  insights: AIInsight;
  onRefresh: () => void;
}

export const AiInsightsTab: React.FC<AiInsightsTabProps> = ({ insights, onRefresh }) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [nlResult, setNlResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sampleQueries = [
    'What was my highest volume day?',
    'Compare UPI vs Card success rates',
    'What is our current refund rate?',
    'How much did I pay in platform fees?',
  ];

  const handleRunQuery = async (queryToRun: string) => {
    setIsLoading(true);
    setCustomPrompt(queryToRun);
    const res = await ApiClient.executeNaturalLanguageQuery(queryToRun);
    setNlResult(res);
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">AI Payment Intelligence Hub</h2>
            <span className="rounded-full bg-gradient-to-r from-sky-500/20 to-indigo-500/20 border border-sky-500/30 px-2 py-0.5 text-[10px] font-bold text-sky-400">
              Spring AI + LLM
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time fraud scoring, conversion anomalies, behavioral signals, and natural language analytics
          </p>
        </div>
      </div>

      {/* Top 3 Diagnostic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overall Health */}
        <div className="rounded-2xl border border-slate-800 bg-[#0f1f38]/60 p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Gateway Health Index</span>
            <span className="rounded-md bg-emerald-500/10 text-emerald-400 px-2 py-0.5 text-[10px] font-bold">
              OPTIMAL
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white">96</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Payment authorization latency averaged a lightning-fast 640ms.
          </p>
        </div>

        {/* Fraud Anomaly Risk */}
        <div className="rounded-2xl border border-slate-800 bg-[#0f1f38]/60 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Fraud & Chargeback Risk</span>
            <span className="rounded-md bg-emerald-500/10 text-emerald-400 px-2 py-0.5 text-[10px] font-bold">
              LOW (4.0%)
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-emerald-400">0.04</span>
            <span className="text-xs text-slate-400">anomaly index</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Zero high-risk carding attacks detected in the trailing 24 hours.
          </p>
        </div>

        {/* Forecasted Next Week GMV */}
        <div className="rounded-2xl border border-slate-800 bg-[#0f1f38]/60 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">AI Projected 7-Day GMV</span>
            <span className="rounded-md bg-sky-500/10 text-sky-400 px-2 py-0.5 text-[10px] font-bold">
              FORECAST
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white">₹2,45,000</span>
          </div>
          <p className="text-[11px] text-sky-300 font-medium">
            +12.1% anticipated growth driven by UPI intent adoption.
          </p>
        </div>
      </div>

      {/* Interactive Natural Language Query Box */}
      <div className="rounded-2xl border border-sky-500/30 bg-gradient-to-b from-[#0f2444] to-[#0a172c] p-6 space-y-4 shadow-2xl">
        <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="h-4 w-4" />
          Natural Language Financial Query Bar
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRunQuery(customPrompt);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Type any question about your transactions, failure patterns, or settlement fees..."
            className="flex-1 rounded-xl border border-slate-700 bg-slate-900/90 py-2.5 px-4 text-xs text-white placeholder-slate-400 focus:border-[#3395ff] focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading || !customPrompt.trim()}
            className="rounded-xl bg-[#0c66e4] hover:bg-[#3395ff] px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all whitespace-nowrap"
          >
            {isLoading ? 'Analyzing...' : 'Ask AI'}
          </button>
        </form>

        {/* Sample query tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-400 font-medium">Try asking:</span>
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleRunQuery(q)}
              className="rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 px-2.5 py-1 text-[11px] text-slate-300 hover:text-white transition-colors"
            >
              "{q}"
            </button>
          ))}
        </div>

        {/* Query Result Box */}
        {nlResult && (
          <div className="mt-4 rounded-xl border border-sky-500/30 bg-slate-950/80 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-400">Analysis Result</span>
              <span className="text-[10px] font-mono text-slate-400">
                Confidence: {(nlResult.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-sm font-semibold text-white">{nlResult.answer}</p>
            {nlResult.suggestedAction && (
              <div className="text-xs text-emerald-400 font-medium pt-1">
                <span className="font-bold">Next Best Action:</span> {nlResult.suggestedAction}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Observations & Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Observations */}
        <div className="rounded-2xl border border-slate-800 bg-[#0f1f38]/60 p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-sky-400" />
            Machine Learning Observations
          </h3>
          <ul className="space-y-2.5">
            {insights.keyObservations.map((obs, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{obs}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actionable Recommendations */}
        <div className="rounded-2xl border border-slate-800 bg-[#0f1f38]/60 p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            Strategic Recommendations
          </h3>
          <ul className="space-y-2.5">
            {insights.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                <ArrowRight className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
