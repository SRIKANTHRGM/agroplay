
import React, { useState, useEffect } from 'react';
import {
  Leaf,
  Mail,
  Lock,
  User,
  Loader2,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { login, register, googleLogin, API_BASE } from '../services/authService';
import { UserProfile } from '../types';

interface Props {
  onLogin: (profile: UserProfile) => void;
}

const Auth: React.FC<Props> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/health`);
        if (res.ok) setServerStatus('online');
        else setServerStatus('offline');
      } catch (e) {
        setServerStatus('offline');
      }
    };
    checkServer();
  }, []);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleTraditionalAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let result;

      if (isLogin) {
        // Login with JWT
        result = await login(email, password);
      } else {
        // Register with JWT
        result = await register(name, email, password);
      }

      // Pass user profile to parent
      onLogin(result.user as UserProfile);

    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await googleLogin();
      onLogin(result.user as UserProfile);
    } catch (err: any) {
      setError(err.message || 'Google login failed. Please try again.');
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen mesh-gradient flex items-center justify-center p-4 md:p-6 relative overflow-hidden font-inter">
      <div className="absolute inset-0 grid-bg opacity-20 z-0" />

      <div className={`w-full max-w-md bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] md:rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.6)] relative z-10 overflow-hidden border border-white/10 transition-all duration-700 ${shake ? 'shake' : ''}`}>

        {(isLoading) && (
          <div className="absolute inset-0 z-50 overflow-hidden bg-slate-950/60 flex flex-col items-center justify-center gap-6 animate-in fade-in duration-300">
            <div className="scanning-line" />
            <div className="w-20 h-20 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin shadow-[0_0_30px_rgba(34,197,94,0.4)]" />
            <p className="text-[10px] font-black text-green-500 uppercase tracking-[0.5em] animate-pulse text-center px-10">
              Establishing Secure Uplink...
            </p>
          </div>
        )}

        <div className="p-6 md:p-12 space-y-8 md:space-y-10 relative z-10">
          <div className="text-center space-y-6">
            <div className="relative group mx-auto w-20 h-20 md:w-24 md:h-24">
              <div className="absolute inset-0 bg-green-500/20 rounded-[2.5rem] blur-2xl" />
              <div className="absolute inset-0 bg-green-600 text-white rounded-[2.2rem] flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.5)] neon-flicker">
                <Leaf size={32} className="group-hover:rotate-12 transition-transform md:w-12 md:h-12" />
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl md:text-5xl font-black text-white outfit tracking-tighter">AgroPlay</h2>
              <p className="text-[9px] font-black text-green-500 uppercase tracking-[0.5em] ml-1 opacity-80">Autonomous Farming Nexus</p>
            </div>
          </div>

          {serverStatus === 'offline' && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 animate-in slide-in-from-top-2">
              <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
              <div className="space-y-1">
                <p className="text-red-400 text-[10px] font-black uppercase tracking-widest">System Offline</p>
                <p className="text-white/60 text-[9px] font-medium leading-relaxed italic">
                  Critical uplink failure at {API_BASE}.
                  Ensure the backend service is active.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 animate-in slide-in-from-top-2">
              <AlertCircle className="text-rose-400 flex-shrink-0" size={20} />
              <p className="text-rose-400 text-xs font-bold">{error}</p>
            </div>
          )}

          <div className="space-y-8">
            <button
              onClick={handleGoogleAuth}
              disabled={isLoading || serverStatus === 'offline'}
              className="w-full bg-white/5 border border-white/10 py-5 rounded-2xl flex items-center justify-center gap-4 hover:bg-white/10 transition-all font-black text-[10px] md:text-xs uppercase tracking-[0.2em] text-white shadow-xl active:scale-95 disabled:opacity-30 group"
            >
              <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              </div>
              <span className="text-white/90">Establish Google Uplink</span>
            </button>

            <div className="relative flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">Secure Protocol</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <form onSubmit={handleTraditionalAuth} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2 animate-in slide-in-from-top-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                    <User size={12} className="text-green-500" /> Full Operator Name
                  </label>
                  <input
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Identification name"
                    className="w-full px-6 py-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white font-bold text-sm focus:border-green-500/50 outline-none transition-all"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                  <Mail size={12} className="text-green-500" /> System Email / ID
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Uplink address"
                  className="w-full px-6 py-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white font-bold text-sm focus:border-green-500/50 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                  <Lock size={12} className="text-green-500" /> Secure Keyphrase
                </label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Access code"
                  minLength={6}
                  className="w-full px-6 py-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white font-bold text-sm focus:border-green-500/50 outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full group bg-green-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(22,101,52,0.4)] hover:bg-green-500 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 mt-6 relative overflow-hidden"
              >
                <span className="text-[11px] md:text-xs">{isLogin ? 'Establish Link' : 'Register Operator'}</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-green-400 transition-colors py-2 group"
            >
              {isLogin ? "New Operator? Create Node" : "Already Registered? Log In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
