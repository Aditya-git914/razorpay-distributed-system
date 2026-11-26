import React, { useState } from 'react';
import { 
  X, CheckCircle2, ArrowRight, ShieldCheck, Landmark, CreditCard, 
  Send, Link as LinkIcon, Building2, Globe2, Percent, Calculator, 
  FileText, Sparkles, AlertCircle, RefreshCw, Copy, Check
} from 'lucide-react';

export type BankingFeatureId = 
  | 'razorpayx'
  | 'vendor_payments'
  | 'payouts'
  | 'payout_links'
  | 'corporate_cards'
  | 'current_account'
  | 'escrow'
  | 'forex'
  | 'verification'
  | 'tax_payments'
  | 'lending'
  | 'business_banking_plus'
  | 'free_tools'
  | 'company_registration';

interface BankingFeatureModalProps {
  featureId: BankingFeatureId | null;
  onClose: () => void;
}

export const BankingFeatureModal: React.FC<BankingFeatureModalProps> = ({ featureId, onClose }) => {
  const [copied, setCopied] = useState(false);

  // Penny-Drop Verification state
  const [verifyType, setVerifyType] = useState<'bank' | 'upi'>('upi');
  const [vpaInput, setVpaInput] = useState('merchant@okhdfcbank');
  const [accInput, setAccInput] = useState('987654321098');
  const [ifscInput, setIfscInput] = useState('HDFC0001234');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState<any>(null);

  // Payout form state
  const [payoutAmount, setPayoutAmount] = useState('15000');
  const [payoutMode, setPayoutMode] = useState<'IMPS' | 'NEFT' | 'UPI'>('IMPS');
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [payoutUtr, setPayoutUtr] = useState('');

  // Corporate card limit slider
  const [cardLimit, setCardLimit] = useState(150000);
  const [cardFrozen, setCardFrozen] = useState(false);

  // Free Tool Calculator state
  const [calcAmount, setCalcAmount] = useState(100000);
  const [gstRate, setGstRate] = useState(18);

  if (!featureId) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleRunVerification = () => {
    setVerifyLoading(true);
    setVerifyResult(null);
    setTimeout(() => {
      setVerifyLoading(false);
      if (verifyType === 'upi') {
        setVerifyResult({
          valid: true,
          vpa: vpaInput,
          accountHolderName: 'AARAV SHARMA & ENTERPRISES',
          bank: 'HDFC BANK',
          verifiedAt: new Date().toLocaleTimeString(),
        });
      } else {
        setVerifyResult({
          valid: true,
          accountNumber: accInput,
          ifsc: ifscInput,
          accountHolderName: 'AARAV SHARMA TRADING CO',
          bank: 'HDFC BANK LTD',
          branch: 'FORT MUMBAI',
          verifiedAt: new Date().toLocaleTimeString(),
        });
      }
    }, 700);
  };

  const handleTriggerPayout = (e: React.FormEvent) => {
    e.preventDefault();
    const fakeUtr = 'UTR' + Math.floor(100000000000 + Math.random() * 900000000000);
    setPayoutUtr(fakeUtr);
    setPayoutSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-700/80 bg-[#0d1829] shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-gradient-to-r from-[#0052cc]/20 via-[#0a192f] to-[#0052cc]/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0052cc] to-[#3395ff] text-white shadow-lg shadow-[#0052cc]/30">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400">RazorpayX Business Banking</span>
                <span className="rounded bg-sky-500/20 px-1.5 py-0.5 text-[9px] font-bold text-sky-300 border border-sky-500/30">
                  LIVE SIMULATOR
                </span>
              </div>
              <h2 className="text-base font-bold text-white capitalize">
                {featureId.replace(/_/g, ' ')}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Feature: RazorpayX Hub / Current Account */}
          {(featureId === 'razorpayx' || featureId === 'current_account' || featureId === 'business_banking_plus') && (
            <div className="space-y-5">
              <div className="rounded-xl border border-sky-500/30 bg-gradient-to-br from-[#0c2340] to-[#071322] p-5 shadow-lg">
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>Smart Business Current Account (Powered by ICICI Partner)</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Live Balance
                  </span>
                </div>
                <div className="mt-2 text-3xl font-black text-white tracking-tight">₹28,45,290.50</div>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Virtual Account:</span>
                    <span className="font-mono text-sky-300 font-semibold">RZPX892019230</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">IFSC Code:</span>
                    <span className="font-mono text-sky-300 font-semibold">RZPX0000001</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Auto-Sweep Yield:</span>
                    <span className="text-emerald-400 font-bold">7.20% p.a.</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                    <Send className="h-4 w-4 text-sky-400" /> Automated Daily Payouts
                  </div>
                  <p className="text-[11px] text-slate-400">100% automated payouts to vendors & salaries via API and dashboard.</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                    <ShieldCheck className="h-4 w-4 text-sky-400" /> Multi-Tier Approval Workflow
                  </div>
                  <p className="text-[11px] text-slate-400">Maker-Checker approvals for high-value transactions above ₹1,00,000.</p>
                </div>
              </div>
            </div>
          )}

          {/* Feature: Payouts */}
          {featureId === 'payouts' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Execute 24x7 real-time bank transfers to any vendor, creator, or customer in India via IMPS, NEFT, or UPI.
              </p>

              {payoutSuccess ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="h-5 w-5" /> Payout Executed Successfully!
                  </div>
                  <div className="text-xs text-slate-300 space-y-1 font-mono">
                    <div>Amount Disbursed: <span className="font-bold text-white">₹{payoutAmount}</span></div>
                    <div>Bank Reference / UTR: <span className="font-bold text-emerald-300">{payoutUtr}</span></div>
                    <div>Settlement Cadence: <span className="text-sky-300 font-bold">Instant (24x7)</span></div>
                  </div>
                  <button
                    onClick={() => setPayoutSuccess(false)}
                    className="mt-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                  >
                    Send Another Payout
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTriggerPayout} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Payout Mode</label>
                      <select
                        value={payoutMode}
                        onChange={(e: any) => setPayoutMode(e.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-3 text-xs text-white"
                      >
                        <option value="IMPS">IMPS (Instant 24x7)</option>
                        <option value="UPI">UPI (Instant VPA)</option>
                        <option value="NEFT">NEFT (Batch clearing)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Amount (₹)</label>
                      <input
                        type="number"
                        value={payoutAmount}
                        onChange={(e) => setPayoutAmount(e.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-3 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Beneficiary Account / UPI</label>
                    <input
                      type="text"
                      defaultValue="aarav@okhdfcbank"
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-3 text-xs text-white font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#0052cc] to-[#3395ff] py-2.5 text-xs font-bold text-white shadow-lg hover:opacity-95"
                  >
                    <Send className="h-4 w-4" /> Disburse Payout (₹{payoutAmount})
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Feature: Bank Account Verification */}
          {featureId === 'verification' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Instantly verify Bank Account numbers and UPI IDs using penny-drop validation before transferring funds.
              </p>

              <div className="flex gap-2 border-b border-slate-800 pb-2">
                <button
                  type="button"
                  onClick={() => setVerifyType('upi')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                    verifyType === 'upi' ? 'bg-[#0052cc] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Verify UPI VPA
                </button>
                <button
                  type="button"
                  onClick={() => setVerifyType('bank')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                    verifyType === 'bank' ? 'bg-[#0052cc] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Verify Account Number & IFSC
                </button>
              </div>

              {verifyType === 'upi' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">UPI VPA Address</label>
                  <input
                    type="text"
                    value={vpaInput}
                    onChange={(e) => setVpaInput(e.target.value)}
                    placeholder="e.g. merchant@okhdfcbank"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-3 text-xs text-white font-mono"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Bank Account Number</label>
                    <input
                      type="text"
                      value={accInput}
                      onChange={(e) => setAccInput(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-3 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">IFSC Code</label>
                    <input
                      type="text"
                      value={ifscInput}
                      onChange={(e) => setIfscInput(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-3 text-xs text-white font-mono uppercase"
                    />
                  </div>
                </div>
              )}

              <button
                type="button"
                disabled={verifyLoading}
                onClick={handleRunVerification}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#0052cc] to-[#3395ff] py-2.5 text-xs font-bold text-white shadow-lg hover:opacity-95"
              >
                {verifyLoading ? 'Validating via NPCI/Bank...' : 'Verify Now (₹1 Penny-Drop)'}
              </button>

              {verifyResult && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="h-4 w-4" /> Account Verified & Active
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <div>Beneficiary Name: <span className="font-bold text-white block">{verifyResult.accountHolderName}</span></div>
                    <div>Bank: <span className="font-bold text-white block">{verifyResult.bank}</span></div>
                    <div>Status: <span className="text-emerald-400 font-bold block">ACTIVE & READY</span></div>
                    <div>Verified At: <span className="text-slate-400 font-mono block">{verifyResult.verifiedAt}</span></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Feature: Corporate Cards */}
          {featureId === 'corporate_cards' && (
            <div className="space-y-5">
              {/* Virtual Card Graphic */}
              <div className={`relative h-44 w-full rounded-2xl p-5 shadow-2xl transition-all ${
                cardFrozen ? 'bg-gradient-to-br from-slate-800 to-slate-900 opacity-60' : 'bg-gradient-to-br from-[#0c2340] via-[#0052cc] to-[#3395ff]'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-sky-200">RazorpayX Corporate</span>
                    <p className="text-xs text-white font-bold">Acme Technologies Pvt Ltd</p>
                  </div>
                  <span className="text-lg font-black italic text-white">VISA</span>
                </div>
                <div className="mt-8 font-mono text-lg font-bold tracking-wider text-white">
                  4111 2233 4455 6677
                </div>
                <div className="mt-3 flex justify-between text-[11px] text-sky-100 font-mono">
                  <span>VALID THRU: 08/29</span>
                  <span>CVV: 891</span>
                </div>
              </div>

              {/* Controls */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Monthly Spend Limit</span>
                    <span className="text-[11px] text-slate-400">Current limit: ₹{cardLimit.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="500000"
                    step="10000"
                    value={cardLimit}
                    onChange={(e) => setCardLimit(Number(e.target.value))}
                    className="w-48 accent-sky-400 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-white block">Freeze Card</span>
                    <span className="text-[11px] text-slate-400">Instantly block all outgoing card authorizations</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCardFrozen(!cardFrozen)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                      cardFrozen ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {cardFrozen ? 'Card Frozen' : 'Active'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Feature: Payout Links */}
          {featureId === 'payout_links' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Send a secure payout link to freelancers, customers, or vendors. They enter their own bank or UPI details to claim instant funds.
              </p>
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
                <span className="text-xs text-slate-400 font-semibold block">Generated Payout Link:</span>
                <div className="flex items-center gap-2 rounded-lg bg-slate-950 p-2.5 font-mono text-xs text-sky-300 border border-slate-800">
                  <span className="flex-1 truncate">https://rzpx.me/payout/lnk_982a1bc772</span>
                  <button
                    onClick={() => handleCopy('https://rzpx.me/payout/lnk_982a1bc772')}
                    className="flex items-center gap-1 rounded bg-sky-500/20 px-2 py-1 text-[11px] font-bold text-sky-400 hover:bg-sky-500/30"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">Recipient can choose UPI, NEFT, or IMPS. Automatically expires in 7 days.</p>
              </div>
            </div>
          )}

          {/* Feature: Vendor Payments */}
          {featureId === 'vendor_payments' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Accounts payable automation: auto-scan invoices, compute Section 194C/J TDS, and execute 1-click batch bank payments.
              </p>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                <div className="bg-slate-800/50 px-4 py-2 text-xs font-bold text-slate-300 flex justify-between">
                  <span>Pending Invoices (3)</span>
                  <span className="text-sky-400">Total: ₹1,42,000</span>
                </div>
                <div className="divide-y divide-slate-800 text-xs">
                  <div className="p-3 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-white">Apex Cloud Hosting Pvt Ltd</p>
                      <p className="text-[10px] text-slate-400">Inv #APX-9810 • TDS 194J (10%) deducted</p>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">₹45,000</span>
                  </div>
                  <div className="p-3 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-white">Delta Freight & Logistics</p>
                      <p className="text-[10px] text-slate-400">Inv #DFL-2024 • TDS 194C (2%) deducted</p>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">₹72,000</span>
                  </div>
                  <div className="p-3 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-white">Studio Prism Design Agency</p>
                      <p className="text-[10px] text-slate-400">Inv #SPD-104 • Milestone 2</p>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">₹25,000</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert('Batch payment of ₹1,42,000 scheduled across 3 vendors!')}
                className="w-full rounded-lg bg-gradient-to-r from-[#0052cc] to-[#3395ff] py-2.5 text-xs font-bold text-white shadow-lg hover:opacity-95"
              >
                Approve & Pay All Vendors (₹1,42,000)
              </button>
            </div>
          )}

          {/* Feature: Tax Payments */}
          {featureId === 'tax_payments' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Direct tax, Advance tax, and GST payments generated and cleared in under 30 seconds with automated Challan 280 & 281 receipts.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-400">Q3 Advance Tax</span>
                  <div className="text-xl font-black text-white">₹85,000</div>
                  <p className="text-[11px] text-slate-400">Due Date: 15th December</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-sky-400">GSTR-3B Monthly</span>
                  <div className="text-xl font-black text-white">₹34,180</div>
                  <p className="text-[11px] text-slate-400">Net Tax Liability calculated</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert('Challan 280 generated and Advance Tax paid via auto-debit!')}
                className="w-full rounded-lg bg-gradient-to-r from-[#0052cc] to-[#3395ff] py-2.5 text-xs font-bold text-white shadow-lg hover:opacity-95"
              >
                Pay Advance Tax (₹85,000) in 30 Seconds
              </button>
            </div>
          )}

          {/* Feature: Forex */}
          {featureId === 'forex' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Foreign Inward Remittance (FDI/FII/Exports) with live bank rates, zero hidden conversion markups, and instant e-FIRC issuance.
              </p>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Inward Inflow (USD):</span>
                  <span className="font-mono text-white font-bold">$10,000.00</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">RBI Benchmark Rate:</span>
                  <span className="font-mono text-emerald-400 font-bold">₹84.20 per USD</span>
                </div>
                <div className="flex justify-between text-xs pt-2 border-t border-slate-800">
                  <span className="font-bold text-white">Net Credited in INR:</span>
                  <span className="font-mono text-lg font-black text-sky-400">₹8,42,000.00</span>
                </div>
              </div>
            </div>
          )}

          {/* Feature: Free Tools */}
          {featureId === 'free_tools' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">Interactive GST and Business Tax Calculator.</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Base Amount (₹)</label>
                  <input
                    type="number"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-3 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">GST Slab</label>
                  <select
                    value={gstRate}
                    onChange={(e) => setGstRate(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-3 text-xs text-white"
                  >
                    <option value={5}>5% (Basic Goods)</option>
                    <option value={12}>12% (Standard)</option>
                    <option value={18}>18% (Services / SaaS)</option>
                    <option value={28}>28% (Luxury)</option>
                  </select>
                </div>
              </div>

              <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Base Value:</span>
                  <span className="font-mono text-white">₹{calcAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Calculated GST ({gstRate}%):</span>
                  <span className="font-mono text-sky-400 font-bold">+₹{((calcAmount * gstRate) / 100).toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold">
                  <span className="text-white">Gross Invoice Total:</span>
                  <span className="font-mono text-emerald-400">₹{(calcAmount + (calcAmount * gstRate) / 100).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Feature: Company Registration */}
          {featureId === 'company_registration' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Incorporate your Private Limited, LLP, or OPC with automated MCA filings, DIN issuance, and RazorpayX current account setup.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-white">1. MCA RUN Name Approval</p>
                    <p className="text-[11px] text-slate-300">Approved: Apex Cloud Technologies Private Limited</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-sky-500/30 bg-sky-500/10 p-3">
                  <RefreshCw className="h-5 w-5 text-sky-400 animate-spin shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-white">2. SPICe+ MCA E-Filing</p>
                    <p className="text-[11px] text-slate-300">Digital Signatures verified, awaiting final ROC stamping</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/60 p-3 opacity-60">
                  <FileText className="h-5 w-5 text-slate-400 shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-white">3. Certificate of Incorporation & PAN/TAN</p>
                    <p className="text-[11px] text-slate-400">Includes instant linked RazorpayX Current Account</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feature: Escrow+ or Lending */}
          {(featureId === 'escrow' || featureId === 'lending') && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                {featureId === 'escrow' 
                  ? 'Digital Escrow protection for high-value B2B trade, marketplace platforms, and digital mergers.'
                  : 'Collateral-free working capital lines with 10-second instant disbursals based on transaction history.'
                }
              </p>
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Pre-Approved Facility Limit:</span>
                  <span className="font-mono text-emerald-400 font-bold">₹15,00,000.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Interest / Processing:</span>
                  <span className="font-mono text-white">1.15% monthly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Disbursal Cadence:</span>
                  <span className="text-sky-300 font-semibold">Instant to Current Account</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert('Disbursal of ₹5,00,000 requested to your RazorpayX Current Account!')}
                className="w-full rounded-lg bg-gradient-to-r from-[#0052cc] to-[#3395ff] py-2.5 text-xs font-bold text-white shadow-lg hover:opacity-95"
              >
                Draw ₹5,00,000 to Current Account
              </button>
            </div>
          )}
        </div>

        {/* Footer Disclaimer matching screenshot */}
        <div className="border-t border-slate-800 bg-[#081225] px-6 py-3 text-[10px] text-slate-400 leading-relaxed">
          Business Banking+ is operated under RZPX Limited where the banking services are provided by scheduled commercial banks. Digital Lending is operated under Razorpay Tech Solutions Private Limited, a Lending Service Provider to Regulated Entities authorised by RBI.
        </div>
      </div>
    </div>
  );
};
