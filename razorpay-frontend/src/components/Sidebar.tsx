import React from 'react';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Link2, 
  Landmark, 
  KeyRound, 
  BrainCircuit, 
  Wallet,
  ExternalLink
} from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems: Array<{ id: TabType; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'transactions', label: 'Transactions', icon: <ArrowLeftRight className="h-4 w-4" /> },
    { id: 'payment-links', label: 'Payment Links', icon: <Link2 className="h-4 w-4" /> },
    { id: 'settlements', label: 'Settlements', icon: <Landmark className="h-4 w-4" /> },
    { id: 'ai-insights', label: 'AI Intelligence', icon: <BrainCircuit className="h-4 w-4" />, badge: 'Spring AI' },
    { id: 'wallet', label: 'Digital Wallet', icon: <Wallet className="h-4 w-4" /> },
    { id: 'apikeys', label: 'API Keys & Webhooks', icon: <KeyRound className="h-4 w-4" /> },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-[#081225]/60 flex flex-col justify-between p-4">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Payment Core
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-[#0c66e4]/20 to-transparent text-[#3395ff] border-l-4 border-[#3395ff] shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={active ? 'text-[#3395ff]' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded bg-sky-500/10 px-1.5 py-0.5 text-[9px] font-bold text-sky-400 border border-sky-500/20">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Microservice Topology Quick Status */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300">Cluster Status</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <div className="text-[10px] space-y-1 text-slate-400 font-mono">
            <div className="flex justify-between">
              <span>Discovery:</span>
              <span className="text-emerald-400">Eureka :8761</span>
            </div>
            <div className="flex justify-between">
              <span>Gateway:</span>
              <span className="text-emerald-400">Active :8080</span>
            </div>
            <div className="flex justify-between">
              <span>Event Broker:</span>
              <span className="text-emerald-400">Kafka :9092</span>
            </div>
            <div className="flex justify-between">
              <span>AI Engine:</span>
              <span className="text-sky-400">Spring AI :8088</span>
            </div>
          </div>
        </div>
      </div>

      {/* Docs Link */}
      <div className="border-t border-slate-800/80 pt-4">
        <a
          href="https://razorpay.com/docs"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/40"
        >
          <span>Developer Docs</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </aside>
  );
};
