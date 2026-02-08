
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



  return (
    <div className="min-h-screen mesh-gradient flex items-center justify-center p-4 md:p-6 relative overflow-hidden font-inter">
      <div className="absolute inset-0 grid-bg opacity-20 z-0" />

      <div className={`w-full max-w-md bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] md:rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.6)] relative z-10 overflow-hidden border border-white/10 transition-all duration-700 ${shake ? 'shake' : ''}`}>

        {(isLoading) && (
          <div className="absolute inset-0 z-50 overflow-hidden bg-slate-950/60 flex flex-col items-center justify-center gap-6 animate-in fade-in duration-300">
            <div className="scanning-line" />
            <div className="w-20 h-20 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin shadow-[0_0_30px_rgba(34,197,94,0.4)]" />
            <p className="text-[10px] font-black text-green-500 uppercase tracking-[0.5em] animate-pulse text-center px-10">
              {isLogin ? 'Authenticating via JWT...' : 'Creating secure account...'}
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
                  {API_BASE.includes('localhost')
                    ? " Ensure 'npm start' is running in the server directory."
                    : " Verify the backend service is active on Render."}
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
            <div className="relative flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">JWT Secure Uplink</span>
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
