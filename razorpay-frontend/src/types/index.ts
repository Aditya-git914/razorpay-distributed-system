export type TabType = 
  | 'overview' 
  | 'transactions' 
  | 'payment-links' 
  | 'settlements' 
  | 'apikeys' 
  | 'ai-insights' 
  | 'wallet';

export interface Order {
  id?: string;
  orderId: string;
  merchantId: string;
  amount: number;
  currency: string;
  receipt?: string;
  status: 'CREATED' | 'ATTEMPTED' | 'PAID';
  description?: string;
  createdAt: string;
}

export interface Payment {
  id?: string;
  paymentId: string;
  orderId: string;
  merchantId: string;
  amount: number;
  fee?: number;
  tax?: number;
  net?: number;
  currency: string;
  status: 'CREATED' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'REFUNDED';
  method: 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET' | 'QR';
  bankReference?: string;
  vpa?: string;
  cardLast4?: string;
  cardNetwork?: string;
  customerEmail?: string;
  customerPhone?: string;
  errorCode?: string;
  errorDescription?: string;
  createdAt: string;
}

export interface Settlement {
  id?: string;
  settlementId: string;
  merchantId: string;
  grossAmount: number;
  feesDeducted: number;
  taxDeducted: number;
  netAmount: number;
  status: 'SCHEDULED' | 'PROCESSING' | 'SETTLED' | 'FAILED';
  utrNumber: string;
  settledAt: string;
  createdAt?: string;
}

export interface ApiKey {
  keyId: string;
  keySecret: string;
  environment: string;
  active: boolean;
  createdAt: string;
}

export interface Webhook {
  id: string;
  url: string;
  secret: string;
  events: string;
  active: boolean;
}

export interface AnalyticsOverview {
  totalTransactions: number;
  successfulTransactions: number;
  grossVolume: number;
  netVolume: number;
  totalFeesDeducted: number;
  successRatePercent: number;
  averageOrderValue: number;
  methodBreakdown: Record<string, number>;
  dailyVolumeSeries: Array<{ day: string; amount: number; count: number }>;
}

export interface AIInsight {
  summary: string;
  anomalyProbability: number;
  keyObservations: string[];
  recommendations: string[];
  predictedMetrics: {
    forecastedNextWeekGmv: number;
    projectedRefundRatePercent: number;
    healthScore: number;
  };
  generatedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface AuthUser {
  userId: string;
  email: string;
  fullName: string;
  role: string;
  merchantId?: string;
  businessName?: string;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  businessName?: string;
  role?: string;
}
