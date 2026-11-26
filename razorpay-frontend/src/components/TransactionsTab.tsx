import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Download,
  Check
} from 'lucide-react';
import { Payment } from '../types';
import { ApiClient } from '../api/client';

interface TransactionsTabProps {
  payments: Payment[];
  onRefresh: () => void;
}

export const TransactionsTab: React.FC<TransactionsTabProps> = ({ payments, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [methodFilter, setMethodFilter] = useState('ALL');

  // Refund Modal State
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('Customer requested return');
  const [isRefunding, setIsRefunding] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.customerEmail && p.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.bankReference && p.bankReference.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesMethod = methodFilter === 'ALL' || p.method === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const handleOpenRefund = (p: Payment) => {
    setSelectedPayment(p);
    setRefundAmount(p.amount.toString());
  };

  const handleConfirmRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment) return;
    setIsRefunding(true);

    try {
      await ApiClient.refundPayment(
        selectedPayment.paymentId,
        parseFloat(refundAmount),
        refundReason
      );
      setToastMessage(`Refund of ₹${refundAmount} processed for ${selectedPayment.paymentId}`);
      setSelectedPayment(null);
      onRefresh();
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Refund failed');
    } finally {
      setIsRefunding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-emerald-500/90 text-white px-4 py-3 shadow-2xl backdrop-blur-md animate-bounce">
          <Check className="h-5 w-5" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Transactions & Ledger</h2>
          <p className="text-xs text-slate-400">
            Immutable financial audit trail persisted across microservices
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="rounded-xl border border-slate-800 bg-[#0f1f38]/60 p-4 flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Payment ID, Order ID, Email, or Bank Ref..."
            className="w-full rounded-lg border border-slate-800 bg-slate-900/90 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-[#3395ff] focus:outline-none"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs text-white focus:border-[#3395ff] focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="CAPTURED">Captured</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>

        {/* Method Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Method:</span>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs text-white focus:border-[#3395ff] focus:outline-none"
          >
            <option value="ALL">All Methods</option>
            <option value="UPI">UPI / QR</option>
            <option value="CARD">Cards</option>
            <option value="NETBANKING">Netbanking</option>
            <option value="WALLET">Wallet</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#0f1f38]/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-900/40 text-slate-400 font-semibold">
              <tr>
                <th className="py-3.5 px-4">Payment ID</th>
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Fee + GST</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Customer Email</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredPayments.map((p) => (
                <tr key={p.paymentId} className="hover:bg-slate-800/25 transition-colors">
                  <td className="py-3 px-4 font-bold text-sky-400">{p.paymentId}</td>
                  <td className="py-3 px-4 text-slate-400">{p.orderId}</td>
                  <td className="py-3 px-4 font-sans font-bold text-white text-xs">
                    ₹{p.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-sans">
                    {p.fee ? `₹${(p.fee + (p.tax || 0)).toFixed(2)}` : '—'}
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                      {p.method}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-300 truncate max-w-[160px]">
                    {p.customerEmail || 'customer@upi'}
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        p.status === 'CAPTURED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : p.status === 'REFUNDED'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {p.status === 'CAPTURED' && <CheckCircle2 className="h-3 w-3" />}
                      {p.status === 'FAILED' && <XCircle className="h-3 w-3" />}
                      {p.status === 'REFUNDED' && <RotateCcw className="h-3 w-3" />}
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-sans text-[10px]">
                    {new Date(p.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    {p.status === 'CAPTURED' && (
                      <button
                        onClick={() => handleOpenRefund(p)}
                        className="rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-1 text-[11px] font-semibold transition-colors"
                      >
                        Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refund Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-[#0f1f38] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Initiate Refund</h3>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmRefund} className="space-y-4">
              <div className="rounded-lg bg-slate-900/80 p-3 text-xs space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Payment ID:</span>
                  <span className="font-mono text-sky-400">{selectedPayment.paymentId}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Captured:</span>
                  <span className="font-bold text-white">₹{selectedPayment.amount.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Refund Amount (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  max={selectedPayment.amount}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-3 text-sm text-white focus:border-[#3395ff] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reason</label>
                <select
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-3 text-xs text-white focus:border-[#3395ff] focus:outline-none"
                >
                  <option value="Customer requested return">Customer requested return</option>
                  <option value="Order fulfillment issue">Order fulfillment issue</option>
                  <option value="Accidental double charge">Accidental double charge</option>
                  <option value="Goodwill gesture">Goodwill gesture</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPayment(null)}
                  className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRefunding}
                  className="rounded-lg bg-purple-600 hover:bg-purple-500 px-4 py-2 text-xs font-bold text-white shadow-md transition-all"
                >
                  {isRefunding ? 'Processing...' : 'Confirm Refund'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
