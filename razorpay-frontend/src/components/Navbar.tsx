import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Zap, Bell, LogIn, UserPlus, LogOut, 
  ChevronDown, Headphones, Briefcase, Send, Link as LinkIcon, 
  CreditCard, Landmark, ShieldCheck, Globe2, CheckCircle2, 
  Percent, Building2, Calculator, FileText, ArrowRight
} from 'lucide-react';
import { ApiClient } from '../api/client';
import { AuthUser, TabType } from '../types';
import { BankingFeatureId } from './BankingFeatureModal';

interface NavbarProps {
  onOpenCheckout: () => void;
  onRunAiQuery: (query: string) => void;
  isTestMode: boolean;
  setIsTestMode: (val: boolean) => void;
  currentUser: AuthUser | null;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onLogout: () => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onSelectBankingFeature: (id: BankingFeatureId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCheckout,
  onRunAiQuery,
  isTestMode,
  setIsTestMode,
  currentUser,
  onOpenAuth,
  onLogout,
  activeTab,
  setActiveTab,
  onSelectBankingFeature,
}) => {
  const [isBankingMenuOpen, setIsBankingMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close mega menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsBankingMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const res = await ApiClient.executeNaturalLanguageQuery(searchQuery);
    setQueryResult(res);
    setIsSearching(false);
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.slice(0, 2).toUpperCase();
    }
    if (email) return email.slice(0, 2).toUpperCase();
    return 'RZ';
  };

  const handleFeatureClick = (id: BankingFeatureId) => {
    setIsBankingMenuOpen(false);
    onSelectBankingFeature(id);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#081225]/95 backdrop-blur-md">
      {/* Top Main Navigation Bar */}
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        {/* Left: Brand Logo + Primary Nav Menu */}
        <div className="flex items-center gap-7">
          {/* Razorpay Brand Logo */}
          <div 
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0052cc] to-[#3395ff] text-white font-black text-xl shadow-lg shadow-[#0052cc]/30 group-hover:scale-105 transition-transform">
              <span className="-skew-x-6">R</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white">Razorpay</span>
            </div>
          </div>

          {/* Navigation Links matching the screenshot */}
          <nav className="hidden lg:flex items-center gap-5 text-[13px] font-semibold text-slate-300" ref={menuRef}>
            <button
              onClick={() => setActiveTab('ai-insights')}
              className={`hover:text-white transition-colors py-5 border-b-2 ${
                activeTab === 'ai-insights' ? 'border-[#0052cc] text-white' : 'border-transparent'
              }`}
            >
              Agentic Stack
            </button>

            <button
              onClick={() => setActiveTab('overview')}
              className={`hover:text-white transition-colors py-5 border-b-2 ${
                activeTab === 'overview' || activeTab === 'transactions' || activeTab === 'payment-links'
                  ? 'border-[#0052cc] text-white'
                  : 'border-transparent'
              }`}
            >
              Payments
            </button>

            {/* Banking+ Nav Item with Mega Menu Toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsBankingMenuOpen(!isBankingMenuOpen);
                  setActiveTab('banking');
                }}
                onMouseEnter={() => setIsBankingMenuOpen(true)}
                className={`flex items-center gap-1 hover:text-white transition-colors py-5 border-b-2 ${
                  isBankingMenuOpen || activeTab === 'banking'
                    ? 'border-[#0052cc] text-white'
                    : 'border-transparent'
                }`}
              >
                <span>Banking+</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isBankingMenuOpen ? 'rotate-180 text-sky-400' : ''}`} />
              </button>

              {/* Mega Dropdown Menu matching the user's screenshot */}
              {isBankingMenuOpen && (
                <div 
                  onMouseLeave={() => setIsBankingMenuOpen(false)}
                  className="absolute left-[-160px] top-[58px] z-50 w-[940px] rounded-2xl border border-slate-700/80 bg-white shadow-2xl p-6 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  {/* Category Header */}
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4 px-2">
                    BUSINESS BANKING PLUS
                  </div>

                  {/* 3 Columns Grid matching screenshot */}
                  <div className="grid grid-cols-3 gap-x-6 gap-y-2">
                    {/* Column 1 */}
                    <div className="space-y-1">
                      <div
                        onClick={() => handleFeatureClick('razorpayx')}
                        className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0c66e4] text-white font-bold text-xs shadow-sm">
                          X
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-[#0c66e4] transition-colors">
                            RazorpayX
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                            Business Banking Supercharged for disruptors
                          </p>
                        </div>
                      </div>

                      <div
                        onClick={() => handleFeatureClick('vendor_payments')}
                        className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0c66e4] text-white shadow-sm">
                          <Briefcase className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-[#0c66e4] transition-colors">
                              Vendor Payments
                            </span>
                            <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700">
                              NEW
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                            Integrated Accounts Payable Automation
                          </p>
                        </div>
                      </div>

                      <div
                        onClick={() => handleFeatureClick('payouts')}
                        className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0c66e4] text-white shadow-sm">
                          <Send className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-[#0c66e4] transition-colors">
                            Payouts
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                            24×7, Instant & Automated Payouts
                          </p>
                        </div>
                      </div>

                      <div
                        onClick={() => handleFeatureClick('payout_links')}
                        className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0c66e4] text-white shadow-sm">
                          <LinkIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-[#0c66e4] transition-colors">
                            Payout Links
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                            Send money without recipient account details
                          </p>
                        </div>
                      </div>

                      <div
                        onClick={() => handleFeatureClick('corporate_cards')}
                        className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0c66e4] text-white shadow-sm">
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-[#0c66e4] transition-colors">
                              Corporate Cards
                            </span>
                            <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700">
                              NEW
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                            Streamline your business expenses
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-1">
                      <div
                        onClick={() => handleFeatureClick('current_account')}
                        className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0c66e4] text-white shadow-sm">
                          <Landmark className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-[#0c66e4] transition-colors">
                            Current Account
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                            Supercharged for businesses
                          </p>
                        </div>
                      </div>

                      <div
                        onClick={() => handleFeatureClick('escrow')}
                        className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0c66e4] text-white shadow-sm">
                          <ShieldCheck className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-[#0c66e4] transition-colors">
                              Escrow+ Account
                            </span>
                            <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700">
                              NEW
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                            Escrow account for digital-first businesses
                          </p>
                        </div>
                      </div>

                      <div
                        onClick={() => handleFeatureClick('forex')}
                        className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0c66e4] text-white shadow-sm">
                          <Globe2 className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-[#0c66e4] transition-colors">
                              Forex/FDI Transfers
                            </span>
                            <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700">
                              NEW
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                            Expert-led service to bring foreign currency
                          </p>
                        </div>
                      </div>

                      <div
                        onClick={() => handleFeatureClick('verification')}
                        className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0c66e4] text-white shadow-sm">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-[#0c66e4] transition-colors">
                              Bank Account Verification
                            </span>
                            <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700">
                              NEW
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                            Instantly verify Bank Account, UPI ID or IFSC
                          </p>
                        </div>
                      </div>

                      <div
                        onClick={() => handleFeatureClick('tax_payments')}
                        className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0c66e4] text-white shadow-sm">
                          <Percent className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-[#0c66e4] transition-colors">
                            Tax Payments
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                            Pay your business taxes in under 30 seconds
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Column 3 */}
                    <div className="space-y-1">
                      <div
                        onClick={() => handleFeatureClick('lending')}
                        className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0c66e4] text-white shadow-sm">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-[#0c66e4] transition-colors">
                            Lending Tech Stack
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                            Fully compliant, 10-second disbursals
                          </p>
                        </div>
                      </div>

                      <div
                        onClick={() => handleFeatureClick('business_banking_plus')}
                        className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0c66e4] text-white shadow-sm">
                          <Landmark className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-[#0c66e4] transition-colors">
                            Business Banking+
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                            Next-generation banking, beyond payouts
                          </p>
                        </div>
                      </div>

                      <div
                        onClick={() => handleFeatureClick('free_tools')}
                        className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0c66e4] text-white shadow-sm">
                          <Calculator className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-[#0c66e4] transition-colors">
                            Free Tools
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                            Essential Business Tools
                          </p>
                        </div>
                      </div>

                      {/* Start Your Business Subsection */}
                      <div className="pt-2 mt-1 border-t border-slate-100">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 px-2.5">
                          START YOUR BUSINESS
                        </div>
                        <div
                          onClick={() => handleFeatureClick('company_registration')}
                          className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0c66e4] text-white shadow-sm">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-[#0c66e4] transition-colors">
                              Company Registration
                            </div>
                            <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                              Simplify your business incorporation journey
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mega Menu Footer Note matching screenshot */}
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 leading-relaxed px-2">
                    Business Banking+ is operated under RZPX Limited where the banking services are provided by scheduled commercial banks. Digital Lending is operated under Razorpay Tech Solutions Private Limited, a Lending Service Provider to Regulated Entities authorised by RBI.
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveTab('wallet')}
              className={`hover:text-white transition-colors py-5 border-b-2 ${
                activeTab === 'wallet' ? 'border-[#0052cc] text-white' : 'border-transparent'
              }`}
            >
              Payroll
            </button>

            <button
              onClick={() => setActiveTab('payment-links')}
              className="hover:text-white transition-colors py-5 border-b-2 border-transparent"
            >
              Engage
            </button>

            <button
              onClick={() => setActiveTab('apikeys')}
              className="hover:text-white transition-colors py-5 border-b-2 border-transparent"
            >
              Partners
            </button>

            <button
              onClick={() => setActiveTab('settlements')}
              className="hover:text-white transition-colors py-5 border-b-2 border-transparent"
            >
              Pricing
            </button>
          </nav>
        </div>

        {/* Right Section: Support, Locale, Auth Buttons & Test Toggle */}
        <div className="flex items-center gap-3">
          {/* Support Headset Icon */}
          <button 
            title="Razorpay 24x7 Merchant Support"
            onClick={() => alert('Razorpay 24x7 Priority Support: support@razorpay.com | +91 1800-102-6303')}
            className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <Headphones className="h-4 w-4" />
          </button>

          {/* India Flag & Down chevron */}
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-800/60 cursor-pointer text-xs">
            <span className="text-sm">🇮🇳</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </div>

          <div className="h-5 w-px bg-slate-800 hidden sm:block" />

          {/* Test / Live Mode Toggle */}
          <button
            onClick={() => setIsTestMode(!isTestMode)}
            className={`hidden md:block rounded-full px-2.5 py-1 text-[11px] font-bold transition-all ${
              isTestMode
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
            }`}
          >
            {isTestMode ? 'Test Mode' : 'Live Mode'}
          </button>

          {/* Hosted Checkout Simulator CTA */}
          <button
            onClick={onOpenCheckout}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#0c66e4] to-[#00d2ff] px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-[#0c66e4]/25 hover:opacity-95 transition-all"
          >
            <Zap className="h-3.5 w-3.5 fill-white" />
            <span className="hidden sm:inline">Checkout Simulator</span>
            <span className="sm:hidden">Checkout</span>
          </button>

          {/* Auth State Button Group matching screenshot */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#0052cc] to-[#3395ff] border border-sky-400 text-xs font-bold text-white shadow-sm">
                {getInitials(currentUser.fullName, currentUser.email)}
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-semibold text-white leading-tight">
                  {currentUser.fullName || currentUser.email}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {currentUser.role?.replace('ROLE_', '') || 'MERCHANT'}
                </p>
              </div>
              <button
                onClick={onLogout}
                title="Sign Out"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-1">
              {/* Login Button matching screenshot (white pill button with border) */}
              <button
                onClick={() => onOpenAuth('signin')}
                className="rounded-lg border border-slate-600 bg-white hover:bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-900 shadow-sm transition-all cursor-pointer"
              >
                Login
              </button>

              {/* Sign Up -> Button matching screenshot (solid blue pill with right arrow) */}
              <button
                onClick={() => onOpenAuth('signup')}
                className="flex items-center gap-1.5 rounded-lg bg-[#0052cc] hover:bg-[#0c66e4] px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-[#0052cc]/20 transition-all cursor-pointer"
              >
                <span>Sign Up</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
