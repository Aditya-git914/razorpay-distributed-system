import React, { useState } from 'react';
import { 
  Landmark, ArrowRight, ShieldCheck, CreditCard, Send, Link as LinkIcon, 
  Building2, Globe2, Percent, Calculator, FileText, CheckCircle2, 
  ArrowUpRight, Sparkles, Building, Briefcase, Plus, RefreshCw, Zap
} from 'lucide-react';
import { BankingFeatureId } from './BankingFeatureModal';

interface BankingPlusTabProps {
  onSelectFeature: (id: BankingFeatureId) => void;
  onOpenCheckout: () => void;
}

export const BankingPlusTab: React.FC<BankingPlusTabProps> = ({ onSelectFeature }) => {
  const [balance, setBalance] = useState(2845290.50);

  const featuresList: Array<{
    id: BankingFeatureId;
    title: string;
    subtitle: string;
    badge?: string;
    icon: React.ReactNode;
    color: string;
  }> = [
    // Column 1
    {
      id: 'razorpayx',
      title: 'RazorpayX',
      subtitle: 'Business Banking Supercharged for disruptors',
      icon: <span className="font-black text-sm">X</span>,
      color: 'bg-blue-600',
    },
    {
      id: 'vendor_payments',
      title: 'Vendor Payments',
      subtitle: 'Integrated Accounts Payable Automation',
      badge: 'NEW',
      icon: <Briefcase className="h-4 w-4" />,
      color: 'bg-blue-600',
    },
    {
      id: 'payouts',
      title: 'Payouts',
      subtitle: '24×7, Instant & Automated Payouts',
      icon: <Send className="h-4 w-4" />,
      color: 'bg-blue-600',
    },
    {
      id: 'payout_links',
      title: 'Payout Links',
      subtitle: 'Send money without recipient account details',
      icon: <LinkIcon className="h-4 w-4" />,
      color: 'bg-blue-600',
    },
    {
      id: 'corporate_cards',
      title: 'Corporate Cards',
      subtitle: 'Streamline your business expenses',
      badge: 'NEW',
      icon: <CreditCard className="h-4 w-4" />,
      color: 'bg-blue-600',
    },

    // Column 2
    {
      id: 'current_account',
      title: 'Current Account',
      subtitle: 'Supercharged for businesses',
      icon: <Landmark className="h-4 w-4" />,
      color: 'bg-blue-600',
    },
    {
      id: 'escrow',
      title: 'Escrow+ Account',
      subtitle: 'Escrow account for digital-first businesses',
      badge: 'NEW',
      icon: <ShieldCheck className="h-4 w-4" />,
      color: 'bg-blue-600',
    },
    {
      id: 'forex',
      title: 'Forex/FDI Transfers',
      subtitle: 'Expert-led service to bring foreign currency',
      badge: 'NEW',
      icon: <Globe2 className="h-4 w-4" />,
      color: 'bg-blue-600',
    },
    {
      id: 'verification',
      title: 'Bank Account Verification',
      subtitle: 'Instantly verify Bank Account, UPI ID or IFSC',
      badge: 'NEW',
      icon: <CheckCircle2 className="h-4 w-4" />,
      color: 'bg-blue-600',
    },
    {
      id: 'tax_payments',
      title: 'Tax Payments',
      subtitle: 'Pay your business taxes in under 30 seconds',
      icon: <Percent className="h-4 w-4" />,
      color: 'bg-blue-600',
    },

    // Column 3
    {
      id: 'lending',
      title: 'Lending Tech Stack',
      subtitle: 'Fully compliant, 10-second disbursals',
      icon: <Building2 className="h-4 w-4" />,
      color: 'bg-blue-600',
    },
    {
      id: 'business_banking_plus',
      title: 'Business Banking+',
      subtitle: 'Next-generation banking, beyond payouts',
      icon: <Landmark className="h-4 w-4" />,
      color: 'bg-blue-600',
    },
    {
      id: 'free_tools',
      title: 'Free Tools',
      subtitle: 'Essential Business Tools & Calculators',
      icon: <Calculator className="h-4 w-4" />,
      color: 'bg-blue-600',
    },
    {
      id: 'company_registration',
      title: 'Company Registration',
      subtitle: 'Simplify your business incorporation journey',
      icon: <FileText className="h-4 w-4" />,
      color: 'bg-blue-600',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded-md bg-[#0052cc]/20 px-2 py-0.5 text-xs font-bold text-sky-400 border border-[#0052cc]/40">
              RAZORPAYX
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Business Banking Suite
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Banking+ Ecosystem
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Unified corporate banking, instant 24x7 payouts, automated vendor tax deduction, and verified corporate credit cards.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectFeature('payouts')}
            className="flex items-center gap-2 rounded-lg bg-[#0052cc] hover:bg-[#3395ff] px-4 py-2 text-xs font-bold text-white shadow-lg transition-all"
          >
            <Send className="h-3.5 w-3.5" />
            New Payout
          </button>
          <button
            onClick={() => onSelectFeature('verification')}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 transition-all"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-sky-400" />
            Verify Account
          </button>
        </div>
      </div>

      {/* Account Highlights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Live Bank Balance */}
        <div className="rounded-2xl border border-sky-500/30 bg-gradient-to-br from-[#0c2340] via-[#09182d] to-[#071322] p-6 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-400">Current Account (Scheduled Bank Partner)</span>
              <div className="text-3xl font-black text-white mt-1">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Landmark className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between text-xs font-mono text-slate-400">
            <span>Acc: <span className="text-white font-bold">RZPX9821449012</span></span>
            <span>IFSC: <span className="text-sky-400 font-bold">RZPX0000001</span></span>
          </div>
        </div>

        {/* Working Capital Facility */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-400">Instant Credit Line (Pre-Approved)</span>
              <div className="text-3xl font-black text-emerald-400 mt-1">₹15,00,000</div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Zap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
            <span>10-Second Disbursal Available</span>
            <button
              onClick={() => onSelectFeature('lending')}
              className="text-sky-400 hover:underline font-bold flex items-center gap-1"
            >
              Draw Funds <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Corporate Cards Spend */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-400">Corporate Card Spend (Month)</span>
              <div className="text-3xl font-black text-white mt-1">₹68,400</div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
            <span>Card Active • VISA Platinum</span>
            <button
              onClick={() => onSelectFeature('corporate_cards')}
              className="text-sky-400 hover:underline font-bold flex items-center gap-1"
            >
              Manage Card <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Complete Business Banking Plus Catalog (14 Features Matching Screenshot) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Business Banking Plus Products</h2>
            <p className="text-xs text-slate-400">Click any product to launch its live simulator & API sandbox.</p>
          </div>
          <span className="text-xs text-sky-400 font-semibold font-mono">14 Capabilities Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuresList.map((f) => (
            <div
              key={f.id}
              onClick={() => onSelectFeature(f.id)}
              className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/70 p-4 transition-all hover:border-sky-500/50 hover:bg-slate-800/50 hover:shadow-lg hover:shadow-sky-500/5 flex items-start gap-3.5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0052cc] text-white shadow-md group-hover:scale-105 transition-transform">
                {f.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-white group-hover:text-sky-400 transition-colors truncate">
                    {f.title}
                  </h3>
                  {f.badge && (
                    <span className="rounded bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-bold text-emerald-400 border border-emerald-500/20">
                      {f.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-2">
                  {f.subtitle}
                </p>
              </div>

              <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-sky-400 shrink-0 transition-colors self-center" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer Legal text from screenshot */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 text-[11px] text-slate-400 leading-relaxed">
        <span className="font-semibold text-slate-300">Regulatory & Compliance Disclosure: </span>
        Business Banking+ is operated under RZPX Limited where the banking services are provided by scheduled commercial banks. Digital Lending is operated under Razorpay Tech Solutions Private Limited, a Lending Service Provider to Regulated Entities authorised by RBI.
      </div>
    </div>
  );
};
