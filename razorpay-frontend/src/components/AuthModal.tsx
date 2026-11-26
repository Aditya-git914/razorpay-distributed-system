import React, { useState } from 'react';
import { X, Lock, Mail, User, Building, Phone, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { ApiClient } from '../api/client';
import { AuthUser, LoginCredentials, SignupData } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signin',
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleDemoLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
    setLoading(true);

    try {
      const user = await ApiClient.signin({ email: demoEmail, password: demoPass });
      setSuccessMsg(`Welcome back, ${user.fullName || user.email}!`);
      setTimeout(() => {
        onSuccess(user);
        onClose();
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Demo signin failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        const credentials: LoginCredentials = { email: email.trim(), password };
        const user = await ApiClient.signin(credentials);
        setSuccessMsg(`Signed in successfully as ${user.fullName || user.email}`);
        setTimeout(() => {
          onSuccess(user);
          onClose();
        }, 700);
      } else {
        const signupData: SignupData = {
          fullName: fullName.trim(),
          email: email.trim(),
          password,
          phone: phone.trim() || undefined,
          businessName: businessName.trim() || `${fullName} Store`,
          role: 'MERCHANT',
        };
        const user = await ApiClient.signup(signupData);
        setSuccessMsg(`Account created successfully! Welcome to Razorpay.`);
        setTimeout(() => {
          onSuccess(user);
          onClose();
        }, 700);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-700/80 bg-[#0d1829] shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="relative border-b border-slate-800 bg-gradient-to-r from-[#0052cc]/20 via-[#0a192f] to-[#0052cc]/10 p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0052cc] to-[#3395ff] text-white font-black text-xl shadow-lg shadow-[#0052cc]/30">
              R
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {mode === 'signin' ? 'Sign In to Merchant Console' : 'Create Merchant Account'}
              </h2>
              <p className="text-xs text-slate-400">Razorpay Distributed Microservices Platform</p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="mt-4 flex rounded-lg bg-slate-900/90 p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
                mode === 'signin'
                  ? 'bg-[#0052cc] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In / Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
                mode === 'signup'
                  ? 'bg-[#0052cc] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up / Register
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* Quick Demo Login Pill Buttons */}
          {mode === 'signin' && (
            <div className="mb-5 rounded-xl border border-sky-500/20 bg-sky-500/5 p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-400 mb-2">
                <ShieldCheck className="h-3.5 w-3.5" /> 1-Click Demo Accounts:
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('merchant@razorpay.clone', 'Merchant@12345')}
                  disabled={loading}
                  className="rounded-lg border border-sky-500/30 bg-slate-900/80 px-2.5 py-1.5 text-[11px] font-medium text-slate-200 hover:bg-sky-500/20 hover:text-white transition-all text-left"
                >
                  <span className="font-bold block text-sky-300">Merchant User</span>
                  <span className="text-[10px] text-slate-400 font-mono">merchant@razorpay...</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('admin@razorpay.clone', 'Admin@12345')}
                  disabled={loading}
                  className="rounded-lg border border-sky-500/30 bg-slate-900/80 px-2.5 py-1.5 text-[11px] font-medium text-slate-200 hover:bg-sky-500/20 hover:text-white transition-all text-left"
                >
                  <span className="font-bold block text-sky-300">Admin User</span>
                  <span className="text-[10px] text-slate-400 font-mono">admin@razorpay...</span>
                </button>
              </div>
            </div>
          )}

          {/* Error & Success Messages */}
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Aditya Sharma"
                      className="w-full rounded-lg border border-slate-700 bg-slate-900/90 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-[#3395ff] focus:outline-none focus:ring-1 focus:ring-[#3395ff]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Business / Store Name</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Apex Retail Private Limited"
                      className="w-full rounded-lg border border-slate-700 bg-slate-900/90 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-[#3395ff] focus:outline-none focus:ring-1 focus:ring-[#3395ff]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-lg border border-slate-700 bg-slate-900/90 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-[#3395ff] focus:outline-none focus:ring-1 focus:ring-[#3395ff]"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@business.com"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/90 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-[#3395ff] focus:outline-none focus:ring-1 focus:ring-[#3395ff]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/90 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-[#3395ff] focus:outline-none focus:ring-1 focus:ring-[#3395ff]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#0052cc] to-[#3395ff] py-2.5 text-xs font-bold text-white shadow-lg shadow-[#0052cc]/30 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In to Console' : 'Create Merchant Account'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 text-center text-[11px] text-slate-400">
            {mode === 'signin' ? (
              <p>
                Don't have a merchant account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  className="text-sky-400 font-semibold hover:underline"
                >
                  Sign Up now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setError(null);
                  }}
                  className="text-sky-400 font-semibold hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
