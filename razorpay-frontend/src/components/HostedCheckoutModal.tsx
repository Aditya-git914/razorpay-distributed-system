import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Smartphone, 
  CreditCard, 
  Building2, 
  Wallet, 
  QrCode, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  Loader2 
} from 'lucide-react';
import { ApiClient } from '../api/client';
import { Payment } from '../types';

interface HostedCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount?: number;
  description?: string;
  orderId?: string;
  onPaymentSuccess?: (payment: Payment) => void;
}

export const HostedCheckoutModal: React.FC<HostedCheckoutModalProps> = ({
  isOpen,
  onClose,
  amount = 2499.00,
  description = 'Acme Store Premium Order',
  orderId,
  onPaymentSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi');
  
  // Checkout form states
  const [customerEmail, setCustomerEmail] = useState('rahul.sharma@example.com');
  const [customerPhone, setCustomerPhone] = useState('+919876543210');
  
  // UPI
  const [vpa, setVpa] = useState('customer@okhdfcbank');
  
  // Card
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [cardHolder, setCardHolder] = useState('Rahul Sharma');
  
  // Netbanking
  const [selectedBank, setSelectedBank] = useState('HDFC');

  // Status states
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [completedPayment, setCompletedPayment] = useState<Payment | null>(null);

  // QR countdown timer
  const [qrTimer, setQrTimer] = useState(300); // 5 mins

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setCompletedPayment(null);
      setIsProcessing(false);
      setQrTimer(300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || isSuccess) return;
    const interval = setInterval(() => {
      setQrTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isSuccess]);

  if (!isOpen) return null;

  const currentOrderId = orderId || `order_${Math.random().toString(36).substring(2, 9)}`;

  const playSuccessSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      // AudioContext unavailable
    }
  };

  const handleProcessPayment = async (methodOverride?: 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET' | 'QR') => {
    setIsProcessing(true);

    const method = methodOverride || (activeTab === 'card' ? 'CARD' : activeTab === 'netbanking' ? 'NETBANKING' : activeTab === 'wallet' ? 'WALLET' : 'UPI');

    try {
      // Artificial slight delay for realistic processing feel
      await new Promise((resolve) => setTimeout(resolve, 900));

      const payment = await ApiClient.processPayment({
        orderId: currentOrderId,
        amount,
        method,
        vpa: activeTab === 'upi' ? vpa : undefined,
        cardNumber: activeTab === 'card' ? cardNumber : undefined,
        cardExpiry: activeTab === 'card' ? cardExpiry : undefined,
        cardCvv: activeTab === 'card' ? cardCvv : undefined,
        bankCode: activeTab === 'netbanking' ? selectedBank : undefined,
        customerEmail,
        customerPhone,
      });

      playSuccessSound();
      setCompletedPayment(payment);
      setIsSuccess(true);
      if (onPaymentSuccess) {
        onPaymentSuccess(payment);
      }
    } catch (err: any) {
      alert(err.message || 'Payment simulation failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const minutes = Math.floor(qrTimer / 60);
  const seconds = qrTimer % 60;
  const timerString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700 bg-white shadow-2xl text-slate-800">
        
        {/* Authentic Razorpay Dark Header */}
        <div className="bg-[#0c2340] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0052cc] to-[#3395ff] text-white font-black text-xl shadow-md">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-white">Acme Online Store</span>
                <span className="flex items-center gap-1 rounded bg-sky-500/20 px-1.5 py-0.5 text-[9px] font-bold text-sky-300">
                  <ShieldCheck className="h-3 w-3" /> VERIFIED
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate max-w-[200px]">{description}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400">Amount to Pay</span>
            <div className="text-xl font-black text-white">
              ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Success View */}
        {isSuccess && completedPayment ? (
          <div className="p-8 text-center space-y-5 animate-in zoom-in-95 duration-300">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-xl shadow-emerald-500/20 animate-bounce">
              <CheckCircle2 className="h-12 w-12 stroke-[2.5]" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Payment Successful!</h2>
              <p className="text-xs text-slate-500 mt-1">
                Receipt and confirmation sent to {customerEmail}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 text-xs space-y-2 border border-slate-200 text-left font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Payment ID:</span>
                <span className="font-bold text-slate-900">{completedPayment.paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Order ID:</span>
                <span className="text-slate-700">{completedPayment.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bank Reference:</span>
                <span className="text-slate-700">{completedPayment.bankReference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Method:</span>
                <span className="font-sans font-bold text-emerald-600">{completedPayment.method}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full rounded-xl bg-[#0c2340] hover:bg-[#0c3970] py-3 text-xs font-bold text-white shadow-lg transition-all"
            >
              Close and Return to Store
            </button>
          </div>
        ) : (
          /* Payment Methods Body */
          <div className="flex flex-col sm:flex-row min-h-[380px]">
            {/* Left Method Tabs */}
            <div className="w-full sm:w-44 bg-slate-50 border-r border-slate-200 p-2 space-y-1">
              <button
                onClick={() => setActiveTab('upi')}
                className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold text-left transition-all ${
                  activeTab === 'upi'
                    ? 'bg-white text-[#0c66e4] shadow-sm border border-slate-200 font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Smartphone className="h-4 w-4 text-emerald-600" />
                <span>UPI / QR</span>
              </button>

              <button
                onClick={() => setActiveTab('card')}
                className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold text-left transition-all ${
                  activeTab === 'card'
                    ? 'bg-white text-[#0c66e4] shadow-sm border border-slate-200 font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <CreditCard className="h-4 w-4 text-sky-600" />
                <span>Cards</span>
              </button>

              <button
                onClick={() => setActiveTab('netbanking')}
                className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold text-left transition-all ${
                  activeTab === 'netbanking'
                    ? 'bg-white text-[#0c66e4] shadow-sm border border-slate-200 font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Building2 className="h-4 w-4 text-purple-600" />
                <span>Netbanking</span>
              </button>

              <button
                onClick={() => setActiveTab('wallet')}
                className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold text-left transition-all ${
                  activeTab === 'wallet'
                    ? 'bg-white text-[#0c66e4] shadow-sm border border-slate-200 font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Wallet className="h-4 w-4 text-amber-600" />
                <span>Wallet</span>
              </button>
            </div>

            {/* Right Method Content */}
            <div className="flex-1 p-5 flex flex-col justify-between">
              {/* UPI Tab */}
              {activeTab === 'upi' && (
                <div className="space-y-4">
                  {/* QR Code Container */}
                  <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="h-20 w-20 bg-slate-900 rounded-lg p-1.5 flex flex-col items-center justify-center shrink-0">
                      <div className="grid grid-cols-4 gap-0.5 w-full h-full">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div
                            key={i}
                            className={`rounded-xs ${
                              i % 2 === 0 || i === 0 || i === 15 ? 'bg-white' : 'bg-transparent'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-800">Scan QR Code</span>
                      <p className="text-[10px] text-slate-500">
                        Scan using any UPI app (GPay, PhonePe, Paytm)
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold">
                        <span>Expires in:</span>
                        <span className="font-mono bg-emerald-100 px-1.5 py-0.2 rounded text-[10px]">
                          {timerString}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink mx-2 text-[10px] uppercase font-bold text-slate-400">
                      Or Enter UPI ID
                    </span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">UPI ID / VPA</label>
                    <input
                      type="text"
                      value={vpa}
                      onChange={(e) => setVpa(e.target.value)}
                      placeholder="username@okhdfcbank"
                      className="w-full rounded-lg border border-slate-300 py-2 px-3 text-xs text-slate-900 focus:border-[#0c66e4] focus:outline-none"
                    />
                  </div>

                  {/* Quick VPA buttons */}
                  <div className="flex flex-wrap gap-1.5">
                    {['@okhdfcbank', '@paytm', '@ybl', '@okaxis'].map((suffix) => (
                      <button
                        key={suffix}
                        type="button"
                        onClick={() => setVpa(`rahul${suffix}`)}
                        className="rounded-md bg-slate-100 hover:bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700"
                      >
                        {suffix}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Cards Tab */}
              {activeTab === 'card' && (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] font-bold text-slate-700">Card Number</label>
                      <span className="text-[10px] font-bold text-sky-600">VISA / MASTERCARD</span>
                    </div>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      className="w-full rounded-lg border border-slate-300 py-2 px-3 text-xs font-mono text-slate-900 focus:border-[#0c66e4] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full rounded-lg border border-slate-300 py-2 px-3 text-xs font-mono text-slate-900 focus:border-[#0c66e4] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                        className="w-full rounded-lg border border-slate-300 py-2 px-3 text-xs font-mono text-slate-900 focus:border-[#0c66e4] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 py-2 px-3 text-xs text-slate-900 focus:border-[#0c66e4] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Netbanking Tab */}
              {activeTab === 'netbanking' && (
                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-slate-700">Select Bank</span>
                  <div className="grid grid-cols-2 gap-2">
                    {['HDFC', 'ICICI', 'SBI', 'Axis', 'Kotak', 'PNB'].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`rounded-lg border p-2.5 text-xs font-bold text-left transition-all ${
                          selectedBank === bank
                            ? 'border-[#0c66e4] bg-sky-50 text-[#0c66e4]'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {bank} Bank
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Wallet Tab */}
              {activeTab === 'wallet' && (
                <div className="space-y-3 text-center py-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <Wallet className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800">Razorpay Digital Wallet</span>
                    <p className="text-lg font-black text-slate-900 mt-0.5">Available: ₹50,000.00</p>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Instant 1-click payment with zero OTP friction.
                  </p>
                </div>
              )}

              {/* Pay Button */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <button
                  onClick={() => handleProcessPayment()}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0c66e4] to-[#0052cc] hover:from-[#0052cc] hover:to-[#0c66e4] py-3 text-xs font-extrabold text-white shadow-lg shadow-[#0c66e4]/25 transition-all transform hover:-translate-y-0.5"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Authorizing Securely...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-3.5 w-3.5" />
                      <span>Pay ₹{amount.toFixed(2)}</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-emerald-600" /> 256-Bit SSL Encrypted
                  </span>
                  <span>Secured by Razorpay</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-white/10 hover:bg-white/20 p-1 text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
