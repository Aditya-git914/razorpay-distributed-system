import React, { useState } from 'react';
import { Link2, Plus, QrCode, Copy, Check, ExternalLink, ArrowRight } from 'lucide-react';
import { ApiClient } from '../api/client';

interface PaymentLinksTabProps {
  onOpenSpecificCheckout: (amount: number, description: string, orderId?: string) => void;
}

export const PaymentLinksTab: React.FC<PaymentLinksTabProps> = ({ onOpenSpecificCheckout }) => {
  const [links, setLinks] = useState([
    {
      id: 'plink_demo01',
      title: 'Annual SaaS Pro Membership',
      amount: 4999.00,
      slug: 'rzp.io/l/pro_sub_9921',
      orderId: 'order_pro_9921',
      status: 'ACTIVE',
      createdAt: '2026-10-23',
    },
    {
      id: 'plink_demo02',
      title: 'Ergonomic Standing Desk',
      amount: 18500.00,
      slug: 'rzp.io/l/desk_8829',
      orderId: 'order_desk_8829',
      status: 'ACTIVE',
      createdAt: '2026-10-22',
    },
    {
      id: 'plink_demo03',
      title: 'Design System Masterclass eBook',
      amount: 999.00,
      slug: 'rzp.io/l/ebook_7719',
      orderId: 'order_ebook_7719',
      status: 'PAID',
      createdAt: '2026-10-20',
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeQrModal, setActiveQrModal] = useState<any | null>(null);

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) return;

    const order = await ApiClient.createOrder(parsedAmount, title || 'Payment Link');

    const newLink = {
      id: `plink_${Math.random().toString(36).substring(2, 8)}`,
      title: title || 'Custom Payment Link',
      amount: parsedAmount,
      slug: `rzp.io/l/${order.orderId.replace('order_', '')}`,
      orderId: order.orderId,
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setLinks([newLink, ...links]);
    setTitle('');
    setAmount('');
    setIsCreating(false);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(`https://${text}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Payment Links & QR Invoices</h2>
          <p className="text-xs text-slate-400">
            Shareable multi-channel payment links and dynamic UPI QR codes
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#0c66e4] to-[#3395ff] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[#0c66e4]/20 hover:opacity-90 transition-all"
        >
          <Plus className="h-4 w-4" />
          Create Payment Link
        </button>
      </div>

      {/* Payment Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link) => (
          <div
            key={link.id}
            className="rounded-2xl border border-slate-800 bg-[#0f1f38]/60 p-5 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      link.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-700/50 text-slate-300'
                    }`}
                  >
                    {link.status}
                  </span>
                  <h3 className="mt-2 text-sm font-bold text-white leading-snug">{link.title}</h3>
                </div>
                <button
                  onClick={() => setActiveQrModal(link)}
                  className="rounded-lg bg-slate-800/80 p-2 text-slate-300 hover:text-sky-400 hover:bg-slate-800 transition-colors"
                  title="View Dynamic QR"
                >
                  <QrCode className="h-4 w-4" />
                </button>
              </div>

              <div className="text-2xl font-black text-white tracking-tight">
                ₹{link.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>

              {/* Slug copy box */}
              <div className="flex items-center justify-between rounded-lg bg-slate-900/80 p-2 text-[11px] font-mono text-slate-300 border border-slate-800">
                <span className="truncate pr-2">{link.slug}</span>
                <button
                  onClick={() => handleCopy(link.id, link.slug)}
                  className="text-slate-400 hover:text-sky-400"
                >
                  {copiedId === link.id ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/60">
              <button
                onClick={() => onOpenSpecificCheckout(link.amount, link.title, link.orderId)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800/80 hover:bg-[#0c66e4] py-2 text-xs font-semibold text-white transition-all group"
              >
                <span>Test in Hosted Checkout</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Link Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-[#0f1f38] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Create New Payment Link</h3>
              <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLink} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Purpose / Item Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Consulting Retainer, Product Purchase"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-3 text-xs text-white placeholder-slate-500 focus:border-[#3395ff] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="2499.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-3 text-sm text-white focus:border-[#3395ff] focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#0c66e4] hover:bg-[#3395ff] px-4 py-2 text-xs font-bold text-white shadow-md transition-all"
                >
                  Generate Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dynamic QR Modal */}
      {activeQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-[#0f1f38] p-6 shadow-2xl space-y-4 text-center">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-300">Dynamic UPI QR Code</span>
              <button
                onClick={() => setActiveQrModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-white rounded-xl inline-block shadow-inner">
              {/* Synthetic SVG QR pattern */}
              <div className="h-44 w-44 bg-slate-900 rounded-lg flex flex-col items-center justify-center p-3 relative overflow-hidden">
                <div className="grid grid-cols-6 gap-1 w-full h-full">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-sm ${
                        (i % 2 === 0 && i % 3 === 0) || i < 8 || i > 28
                          ? 'bg-white'
                          : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-md bg-[#0052cc] p-1.5 shadow-lg text-white font-extrabold text-[10px]">
                    UPI
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-white">₹{activeQrModal.amount.toFixed(2)}</p>
              <p className="text-xs text-slate-400">{activeQrModal.title}</p>
              <p className="mt-1 text-[10px] text-emerald-400 font-mono">Scan with any UPI app (GPay, PhonePe, Paytm)</p>
            </div>

            <button
              onClick={() => {
                const item = activeQrModal;
                setActiveQrModal(null);
                onOpenSpecificCheckout(item.amount, item.title, item.orderId);
              }}
              className="w-full rounded-xl bg-gradient-to-r from-[#0c66e4] to-[#00d2ff] py-2 text-xs font-bold text-white shadow-md"
            >
              Simulate Live QR Scan & Pay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
