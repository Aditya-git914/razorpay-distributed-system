import React, { useState } from 'react';
import { KeyRound, Eye, EyeOff, Copy, Check, Plus, ShieldCheck, Terminal, Webhook as WebhookIcon } from 'lucide-react';
import { ApiKey, Webhook } from '../types';
import { ApiClient } from '../api/client';

interface ApiKeysTabProps {
  apiKeys: ApiKey[];
  webhooks: Webhook[];
  onRefresh: () => void;
}

export const ApiKeysTab: React.FC<ApiKeysTabProps> = ({ apiKeys, webhooks, onRefresh }) => {
  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSnippetTab, setSelectedSnippetTab] = useState<'node' | 'curl' | 'java'>('node');

  const toggleSecret = (id: string) => {
    setShowSecret((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerateKey = async () => {
    if (!confirm('Generating a new API key will invalidate previously active test keys. Proceed?')) {
      return;
    }
    setIsGenerating(true);
    await ApiClient.generateApiKey();
    setIsGenerating(false);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">API Credentials & Webhooks</h2>
          <p className="text-xs text-slate-400">
            Secure HMAC API keys and cryptographic webhook signatures for server-to-server integration
          </p>
        </div>
        <button
          onClick={handleGenerateKey}
          disabled={isGenerating}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#0c66e4] to-[#3395ff] px-4 py-2 text-xs font-bold text-white shadow-lg hover:opacity-90 transition-all"
        >
          <Plus className="h-4 w-4" />
          {isGenerating ? 'Generating...' : 'Generate New Key'}
        </button>
      </div>

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.map((k) => (
          <div
            key={k.keyId}
            className="rounded-2xl border border-slate-800 bg-[#0f1f38]/60 p-5 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-sky-500/10 p-2 text-sky-400">
                  <KeyRound className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">Razorpay Standard API Key</h3>
                  <p className="text-[11px] text-slate-400">Environment: {k.environment} mode</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold">
                ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Key ID */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Key ID</span>
                <div className="flex items-center justify-between rounded-xl bg-slate-900/90 p-2.5 font-mono text-xs text-sky-300 border border-slate-800">
                  <span>{k.keyId}</span>
                  <button
                    onClick={() => copyToClipboard(k.keyId, `id_${k.keyId}`)}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedKey === `id_${k.keyId}` ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Key Secret */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Key Secret</span>
                <div className="flex items-center justify-between rounded-xl bg-slate-900/90 p-2.5 font-mono text-xs text-white border border-slate-800">
                  <span>
                    {showSecret[k.keyId] ? 'rzp_secret_9988776655443322' : '••••••••••••••••••••••••'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSecret(k.keyId)}
                      className="text-slate-400 hover:text-white"
                    >
                      {showSecret[k.keyId] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() =>
                        copyToClipboard('rzp_secret_9988776655443322', `secret_${k.keyId}`)
                      }
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedKey === `secret_${k.keyId}` ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Webhooks Section */}
      <div className="rounded-2xl border border-slate-800 bg-[#0f1f38]/60 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-purple-500/10 p-2 text-purple-400">
              <WebhookIcon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">Configured Webhook Endpoints</h3>
              <p className="text-xs text-slate-400">Subscribed to real-time payment and refund callbacks</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {webhooks.map((wh) => (
            <div
              key={wh.id}
              className="rounded-xl border border-slate-800/80 bg-slate-900/80 p-4 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-white text-xs font-semibold">{wh.url}</span>
                <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold">
                  ACTIVE
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                <span className="font-bold text-slate-300">Subscribed Events: </span>
                <span className="font-mono text-purple-300">{wh.events}</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Secret: <span className="text-slate-300">whsec_••••••••••••••••</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Integration Code Snippets */}
      <div className="rounded-2xl border border-slate-800 bg-[#0f1f38]/60 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white">Quick Integration Snippet</h3>
          </div>
          <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-1 border border-slate-800">
            {(['node', 'curl', 'java'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedSnippetTab(tab)}
                className={`rounded px-2.5 py-1 text-[11px] font-semibold transition-all ${
                  selectedSnippetTab === tab
                    ? 'bg-[#0c66e4] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-slate-950 p-4 font-mono text-[11px] text-slate-300 overflow-x-auto border border-slate-800 leading-relaxed">
          {selectedSnippetTab === 'node' && (
            <pre>{`const Razorpay = require('razorpay');

const instance = new Razorpay({
  key_id: '${apiKeys[0]?.keyId || 'rzp_test_8877AAbbCCddEE'}',
  key_secret: 'YOUR_KEY_SECRET',
});

// Create Order
const order = await instance.orders.create({
  amount: 249900, // in paise (₹2499)
  currency: 'INR',
  receipt: 'order_rcptid_11',
});`}</pre>
          )}

          {selectedSnippetTab === 'curl' && (
            <pre>{`curl -X POST https://api.razorpay.com/api/v1/orders \\
  -u ${apiKeys[0]?.keyId || 'rzp_test_8877AAbbCCddEE'}:YOUR_KEY_SECRET \\
  -H "Content-Type: application/json" \\
  -d '{"amount": 2499.00, "currency": "INR", "receipt": "rcpt_1001"}'`}</pre>
          )}

          {selectedSnippetTab === 'java' && (
            <pre>{`RazorpayClient razorpay = new RazorpayClient("${apiKeys[0]?.keyId || 'rzp_test_8877AAbbCCddEE'}", "YOUR_KEY_SECRET");

JSONObject orderRequest = new JSONObject();
orderRequest.put("amount", 249900); // in paise
orderRequest.put("currency", "INR");
orderRequest.put("receipt", "rcpt_1001");

Order order = razorpay.orders.create(orderRequest);`}</pre>
          )}
        </div>
      </div>
    </div>
  );
};
