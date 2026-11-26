import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { OverviewTab } from './components/OverviewTab';
import { TransactionsTab } from './components/TransactionsTab';
import { PaymentLinksTab } from './components/PaymentLinksTab';
import { SettlementsTab } from './components/SettlementsTab';
import { ApiKeysTab } from './components/ApiKeysTab';
import { AiInsightsTab } from './components/AiInsightsTab';
import { HostedCheckoutModal } from './components/HostedCheckoutModal';
import { AiCopilotDrawer } from './components/AiCopilotDrawer';
import { AuthModal } from './components/AuthModal';
import { BankingFeatureModal, BankingFeatureId } from './components/BankingFeatureModal';
import { BankingPlusTab } from './components/BankingPlusTab';
import { ApiClient } from './api/client';
import { TabType, AnalyticsOverview, Payment, Settlement, ApiKey, Webhook, AIInsight, AuthUser } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isTestMode, setIsTestMode] = useState(true);

  // Authentication state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(ApiClient.getCurrentUser());
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Banking+ Selected Feature Modal state
  const [selectedBankingFeature, setSelectedBankingFeature] = useState<BankingFeatureId | null>(null);

  // Data states
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [insights, setInsights] = useState<AIInsight | null>(null);

  // Hosted Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutAmount, setCheckoutAmount] = useState(2499.00);
  const [checkoutDesc, setCheckoutDesc] = useState('Acme Store Premium Order');
  const [checkoutOrderId, setCheckoutOrderId] = useState<string | undefined>(undefined);

  const loadAllData = async () => {
    try {
      const [an, pm, st, ak, wh, inRes] = await Promise.all([
        ApiClient.getAnalytics(),
        ApiClient.getTransactions(),
        ApiClient.getSettlements(),
        ApiClient.getApiKeys(),
        ApiClient.getWebhooks(),
        ApiClient.getAIInsights(),
      ]);
      setAnalytics(an);
      setPayments(pm);
      setSettlements(st);
      setApiKeys(ak);
      setWebhooks(wh);
      setInsights(inRes);
    } catch (e) {
      console.error('Error fetching dashboard records', e);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleOpenSpecificCheckout = (amount: number, description: string, orderId?: string) => {
    setCheckoutAmount(amount);
    setCheckoutDesc(description);
    setCheckoutOrderId(orderId);
    setIsCheckoutOpen(true);
  };

  const handlePaymentSuccess = (newPayment: Payment) => {
    setPayments((prev) => [newPayment, ...prev]);
    if (analytics) {
      setAnalytics({
        ...analytics,
        totalTransactions: analytics.totalTransactions + 1,
        successfulTransactions: analytics.successfulTransactions + 1,
        grossVolume: analytics.grossVolume + newPayment.amount,
        netVolume: analytics.netVolume + (newPayment.amount - (newPayment.fee || 0) - (newPayment.tax || 0)),
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#081225] text-slate-100">
      {/* Top Navigation */}
      <Navbar
        onOpenCheckout={() => {
          setCheckoutAmount(2499.00);
          setCheckoutDesc('Acme Store Premium Order');
          setCheckoutOrderId(undefined);
          setIsCheckoutOpen(true);
        }}
        onRunAiQuery={() => setActiveTab('ai-insights')}
        isTestMode={isTestMode}
        setIsTestMode={setIsTestMode}
        currentUser={currentUser}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setIsAuthOpen(true);
        }}
        onLogout={() => {
          ApiClient.logout();
          setCurrentUser(null);
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectBankingFeature={(id) => setSelectedBankingFeature(id)}
      />

      {/* Main Layout: Sidebar + Tab Content */}
      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-8 max-w-7xl mx-auto overflow-y-auto">
          {activeTab === 'overview' && analytics && (
            <OverviewTab
              analytics={analytics}
              recentPayments={payments.slice(0, 5)}
              onOpenCheckout={() => setIsCheckoutOpen(true)}
              onGoToTransactions={() => setActiveTab('transactions')}
            />
          )}

          {activeTab === 'banking' && (
            <BankingPlusTab
              onSelectFeature={(id) => setSelectedBankingFeature(id)}
              onOpenCheckout={() => setIsCheckoutOpen(true)}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsTab payments={payments} onRefresh={loadAllData} />
          )}

          {activeTab === 'payment-links' && (
            <PaymentLinksTab onOpenSpecificCheckout={handleOpenSpecificCheckout} />
          )}

          {activeTab === 'settlements' && (
            <SettlementsTab settlements={settlements} onRefresh={loadAllData} />
          )}

          {activeTab === 'apikeys' && (
            <ApiKeysTab apiKeys={apiKeys} webhooks={webhooks} onRefresh={loadAllData} />
          )}

          {activeTab === 'ai-insights' && insights && (
            <AiInsightsTab insights={insights} onRefresh={loadAllData} />
          )}

          {activeTab === 'wallet' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-[#0f1f38]/60 p-6 space-y-4">
                <h2 className="text-xl font-bold text-white">Merchant & Customer Digital Wallets</h2>
                <p className="text-xs text-slate-400">
                  Strictly serializable transactions managed via PostgreSQL pessimistic locking with optimistic JPA `@Version` concurrency controls.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-2">
                    <span className="text-xs text-slate-400 font-semibold">Merchant Escrow Wallet</span>
                    <div className="text-2xl font-black text-emerald-400">₹1,25,840.50</div>
                    <p className="text-[11px] text-slate-400">Currency: INR • Status: ACTIVE</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-2">
                    <span className="text-xs text-slate-400 font-semibold">Customer Test Wallet</span>
                    <div className="text-2xl font-black text-sky-400">₹50,000.00</div>
                    <p className="text-[11px] text-slate-400">Zero-OTP 1-click balance available</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Razorpay Standard Hosted Checkout Modal */}
      <HostedCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        amount={checkoutAmount}
        description={checkoutDesc}
        orderId={checkoutOrderId}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Floating AI Copilot Assistant */}
      <AiCopilotDrawer />

      {/* Login, Signup and Signin Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          loadAllData();
        }}
      />

      {/* Interactive Banking+ Feature Modal for 14 Business Banking Tools */}
      <BankingFeatureModal
        featureId={selectedBankingFeature}
        onClose={() => setSelectedBankingFeature(null)}
      />
    </div>
  );
};
export default App;
