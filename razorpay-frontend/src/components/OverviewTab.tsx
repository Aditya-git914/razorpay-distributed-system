import React from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  CreditCard, 
  CheckCircle, 
  Percent, 
  DollarSign, 
  Smartphone, 
  Building2, 
  Wallet,
  Sparkles
} from 'lucide-react';
import { AnalyticsOverview, Payment } from '../types';

interface OverviewTabProps {
  analytics: AnalyticsOverview;
  recentPayments: Payment[];
  onOpenCheckout: () => void;
  onGoToTransactions: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  analytics,
  recentPayments,
  onOpenCheckout,
  onGoToTransactions,
}) => {
  const maxDayAmount = Math.max(...analytics.dailyVolumeSeries.map((d) => d.amount), 1);

  return (
    <div className="space-y-6">
      {/* Top Banner with AI highlight */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0c2340] via-[#0c3970] to-[#0c66e4] p-6 border border-sky-500/20 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-sky-400/20 px-2.5 py-0.5 text-xs font-semibold text-sky-200 border border-sky-400/30">
                AI Optimization Active
              </span>
              <span className="text-xs text-sky-200 font-medium">95.8% conversion rate</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Welcome back, Acme Online Store
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              All payment microservices are operating smoothly. Distributed tracing via Zipkin, Redis distributed lock idempotency, and Kafka event pipelines are fully synchronized.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCheckout}
              className="rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#0c2340] shadow-lg hover:bg-slate-100 transition-all transform hover:-translate-y-0.5"
            >
              Launch Demo Checkout
            </button>
          </div>
        </div>
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-gradient-to-br from-[#3395ff]/30 to-transparent blur-3xl pointer-events-none" />
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Volume */}
        <div className="rounded-xl border border-slate-800 bg-[#0f1f38]/70 p-4 space-y-3 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Gross Volume (GMV)</span>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">
              ₹{analytics.grossVolume.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-400 font-medium">
              <ArrowUpRight className="h-3 w-3" />
              <span>+18.4% vs last week</span>
            </div>
          </div>
        </div>

        {/* Net Volume */}
        <div className="rounded-xl border border-slate-800 bg-[#0f1f38]/70 p-4 space-y-3 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Net Settled to Bank</span>
            <div className="rounded-lg bg-sky-500/10 p-2 text-sky-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">
              ₹{analytics.netVolume.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400">
              <span>Fee deducted: ₹{analytics.totalFeesDeducted.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="rounded-xl border border-slate-800 bg-[#0f1f38]/70 p-4 space-y-3 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Success Rate</span>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {analytics.successRatePercent}%
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-400 font-medium">
              <span>{analytics.successfulTransactions} of {analytics.totalTransactions} transactions passed</span>
            </div>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="rounded-xl border border-slate-800 bg-[#0f1f38]/70 p-4 space-y-3 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Avg Ticket Size</span>
            <div className="rounded-lg bg-purple-500/10 p-2 text-purple-400">
              <Percent className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">
              ₹{analytics.averageOrderValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400">
              <span>Highest ticket: ₹14,500.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Revenue Bar Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-[#0f1f38]/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Daily Payment Volume</h3>
              <p className="text-xs text-slate-400">Real-time payment throughput across 7 days</p>
            </div>
            <span className="rounded-md bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-300">
              Last 7 Days
            </span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2">
            {analytics.dailyVolumeSeries.map((d, idx) => {
              const heightPercent = Math.max(15, Math.round((d.amount / maxDayAmount) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] text-slate-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{(d.amount / 1000).toFixed(1)}k
                  </div>
                  <div className="w-full bg-slate-800/80 rounded-t-lg relative overflow-hidden h-44 flex items-end">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-gradient-to-t from-[#0c66e4] to-[#3395ff] rounded-t-lg transition-all duration-500 group-hover:from-[#0052cc] group-hover:to-[#00d2ff]"
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-400">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Method Distribution Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-[#0f1f38]/60 p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Payment Method Share</h3>
            <p className="text-xs text-slate-400">Customer checkout preference</p>
          </div>

          <div className="space-y-3 pt-2">
            {/* UPI */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="flex items-center gap-2 text-white">
                  <Smartphone className="h-3.5 w-3.5 text-emerald-400" /> UPI & QR
                </span>
                <span className="font-bold text-emerald-400">64%</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '64%' }}></div>
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="flex items-center gap-2 text-white">
                  <CreditCard className="h-3.5 w-3.5 text-sky-400" /> Cards (Visa, MC, RuPay)
                </span>
                <span className="font-bold text-sky-400">24%</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>

            {/* Netbanking */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="flex items-center gap-2 text-white">
                  <Building2 className="h-3.5 w-3.5 text-purple-400" /> Netbanking
                </span>
                <span className="font-bold text-purple-400">8%</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '8%' }}></div>
              </div>
            </div>

            {/* Digital Wallet */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="flex items-center gap-2 text-white">
                  <Wallet className="h-3.5 w-3.5 text-amber-400" /> Razorpay Wallet
                </span>
                <span className="font-bold text-amber-400">4%</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '4%' }}></div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-3 text-[11px] text-sky-300 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Sparkles className="h-3.5 w-3.5" /> AI Recommendation
            </div>
            <p className="text-slate-300">
              UPI Intent on mobile experiences 14% higher conversion than card form fill.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table Preview */}
      <div className="rounded-2xl border border-slate-800 bg-[#0f1f38]/60 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Transactions</h3>
            <p className="text-xs text-slate-400">Real-time payment events received from Kafka event stream</p>
          </div>
          <button
            onClick={onGoToTransactions}
            className="text-xs font-semibold text-[#3395ff] hover:underline"
          >
            View all transactions →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3">Payment ID</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Method</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Bank Ref</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {recentPayments.map((p) => (
                <tr key={p.paymentId} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 font-semibold text-sky-400">{p.paymentId}</td>
                  <td className="py-3 font-bold text-white font-sans text-xs">
                    ₹{p.amount.toFixed(2)}
                  </td>
                  <td className="py-3 text-slate-300 font-sans">{p.method}</td>
                  <td className="py-3 text-slate-400 font-sans">{p.customerEmail || 'customer@upi'}</td>
                  <td className="py-3 text-slate-400">{p.bankReference || '—'}</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        p.status === 'CAPTURED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : p.status === 'REFUNDED'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
