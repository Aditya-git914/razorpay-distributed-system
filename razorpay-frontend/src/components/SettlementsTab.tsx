import React, { useState } from 'react';
import { Landmark, ArrowUpRight, CheckCircle2, Clock, Zap, Check } from 'lucide-react';
import { Settlement } from '../types';
import { ApiClient } from '../api/client';

interface SettlementsTabProps {
  settlements: Settlement[];
  onRefresh: () => void;
}

export const SettlementsTab: React.FC<SettlementsTabProps> = ({ settlements, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [instantAmount, setInstantAmount] = useState('35000');
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const parsedAmount = parseFloat(instantAmount) || 0;
  const estimatedFee = +(parsedAmount * 0.02).toFixed(2);
  const estimatedGst = +(estimatedFee * 0.18).toFixed(2);
  const estimatedNet = +(parsedAmount - estimatedFee - estimatedGst).toFixed(2);

  const handleTriggerInstantSettlement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await ApiClient.triggerSettlement(parsedAmount);
      setIsModalOpen(false);
      setToast(`Instant settlement of ₹${res.netAmount.toFixed(2)} dispatched! Bank UTR: ${res.utrNumber}`);
      onRefresh();
      setTimeout(() => setToast(null), 5000);
    } catch (e: any) {
      alert(e.message || 'Settlement failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-emerald-500/90 text-white px-4 py-3 shadow-2xl backdrop-blur-md animate-bounce">
          <Check className="h-5 w-5" />
          <span className="text-xs font-bold">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Settlements & Automated Payouts</h2>
          <p className="text-xs text-slate-400">
            T+1 automated clearing cycle with instant 24x7 bank payout capability
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all"
        >
          <Zap className="h-4 w-4" />
          Trigger Instant Settlement
        </button>
      </div>

      {/* Settlement Balance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-[#0f1f38]/60 p-5 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Available for Instant Payout</span>
          <div className="text-2xl font-black text-white">₹48,250.00</div>
          <p className="text-[11px] text-emerald-400 font-medium">Ready for immediate NEFT/IMPS transfer</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#0f1f38]/60 p-5 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Next Scheduled Batch (T+1)</span>
          <div className="text-2xl font-black text-white">Tomorrow, 08:00 AM</div>
          <p className="text-[11px] text-slate-400">Standard batch clearing via RBI nodal account</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#0f1f38]/60 p-5 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Linked Bank Account</span>
          <div className="text-sm font-bold text-white flex items-center gap-2 pt-1">
            <Landmark className="h-4 w-4 text-sky-400" />
            HDFC Bank Ltd ••••8901
          </div>
          <p className="text-[10px] text-slate-400 font-mono">IFSC: HDFC0001234 (Verified)</p>
        </div>
      </div>

      {/* Settlements Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#0f1f38]/60 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Settlement History</h3>
          <span className="text-xs text-slate-400">All payouts cleared successfully</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-900/40 text-slate-400 font-semibold">
              <tr>
                <th className="py-3 px-4">Settlement ID</th>
                <th className="py-3 px-4">Gross Collected</th>
                <th className="py-3 px-4">Platform Fee + GST</th>
                <th className="py-3 px-4">Net Settled to Bank</th>
                <th className="py-3 px-4">Bank UTR</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Settled At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {settlements.map((s) => (
                <tr key={s.settlementId} className="hover:bg-slate-800/25 transition-colors">
                  <td className="py-3 px-4 font-bold text-sky-400">{s.settlementId}</td>
                  <td className="py-3 px-4 font-sans text-slate-300">
                    ₹{s.grossAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-400">
                    -₹{(s.feesDeducted + s.taxDeducted).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 font-sans font-bold text-emerald-400 text-xs">
                    ₹{s.netAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-mono">{s.utrNumber}</td>
                  <td className="py-3 px-4 font-sans">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold">
                      <CheckCircle2 className="h-3 w-3" />
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-sans text-[10px]">
                    {new Date(s.settledAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instant Settlement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-[#0f1f38] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-400" />
                Instant Settlement Transfer
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleTriggerInstantSettlement} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Settlement Amount (₹)
                </label>
                <input
                  type="number"
                  step="100"
                  min="100"
                  max="48250"
                  value={instantAmount}
                  onChange={(e) => setInstantAmount(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-3 text-sm text-white focus:border-[#3395ff] focus:outline-none"
                  required
                />
              </div>

              {/* Fee Breakdown Calculation */}
              <div className="rounded-xl bg-slate-900/80 p-3.5 space-y-2 text-xs border border-slate-800">
                <div className="flex justify-between text-slate-400">
                  <span>Gross Payout:</span>
                  <span className="text-white font-semibold">₹{parsedAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Standard Gateway Fee (2.0%):</span>
                  <span className="text-rose-400">-₹{estimatedFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>GST on Fee (18.0%):</span>
                  <span className="text-rose-400">-₹{estimatedGst.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-white">
                  <span>Net Credited to HDFC Bank:</span>
                  <span className="text-emerald-400 text-sm">₹{estimatedNet.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || parsedAmount <= 0}
                  className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-md transition-all"
                >
                  {isProcessing ? 'Processing Transfer...' : 'Initiate Bank Payout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
