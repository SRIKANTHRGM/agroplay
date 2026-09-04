
import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Mail, 
  Lock, 
  User, 
  ChevronRight, 
  Loader2, 
  Sparkles,
  ShieldCheck,
  Globe,
  ArrowRight
} from 'lucide-react';
import { auth, googleProvider, signInWithPopup, doc, setDoc, getDoc, db } from '../services/firebase';
import { UserProfile } from '../types';

interface Props {
  onLogin: (profile: UserProfile) => void;
}

const Auth: React.FC<Props> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const triggerShake = () => {
    setShake(shake);
    setTimeout(() => setShake(false), 500);
  };

  const handleTraditionalAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Logic: Simple mock for now, assuming UID derived from email
      const uid = `u-${btoa(email).substr(0, 8)}`;
      const userRef = doc(db, 'users', uid, 'profile');
      const snap = await getDoc(userRef);
      
      if (snap.exists()) {
        onLogin(snap.data() as UserProfile);
      } else {
        // Create skeleton for Onboarding
        // Added missing phone property to satisfy UserProfile interface
        const skeleton: UserProfile = {
          uid,
          name: name || email.split('@')[0],
          email,
          phone: '',
          onboardingComplete: false,
          points: 1250,
          ecoPoints: 0,
          badges: [],
          location: 'India',
          soilType: 'Alluvial Soil',
          role: 'Farmer',
          farmSize: '0',
          cropPreferences: [],
          sustainabilityGoals: [],
          irrigationPreference: 'Drip Irrigation',
          languagePreference: 'English'
        };
        onLogin(skeleton);
      }
    } catch (err) {
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (user) {
        const userRef = doc(db, 'users', user.uid, 'profile');
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          onLogin(userSnap.data() as UserProfile);
        } else {
          // Added missing phone property to satisfy UserProfile interface
          const profileData: UserProfile = {
            uid: user.uid,
            name: user.displayName || "Modern Farmer",
            email: user.email || "",
            phone: user.phoneNumber || "",
            avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
            role: 'Farmer',
            points: 1250,
            ecoPoints: 100,
            location: 'India',
            soilType: 'Alluvial Soil',
            onboardingComplete: false,
            farmSize: "Ready to map",
            cropPreferences: [],
            sustainabilityGoals: ["Reduce Water Usage"],
            irrigationPreference: 'Drip Irrigation',
            languagePreference: 'English',
            badges: []
          };
          onLogin(profileData);
        }
      }
    } catch (error) {
      triggerShake();
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen mesh-gradient flex items-center justify-center p-6 relative overflow-hidden font-inter">
      <div className="absolute inset-0 grid-bg opacity-20 z-0" />
      
      <div className={`w-full max-w-md bg-slate-900/80 backdrop-blur-2xl rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.6)] relative z-10 overflow-hidden border border-white/10 transition-all duration-700 ${shake ? 'shake' : ''}`}>
        
        {(isLoading || isGoogleLoading) && (
          <div className="absolute inset-0 z-50 overflow-hidden bg-slate-950/40 backdrop-blur-sm flex flex-col items-center justify-center gap-6">
            <div className="scanning-line" />
            <div className="w-20 h-20 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin shadow-[0_0_30px_rgba(34,197,94,0.4)]" />
            <p className="text-[10px] font-black text-green-500 uppercase tracking-[0.5em] animate-pulse text-center px-10">Syncing with Node archives...</p>
          </div>
        )}
        
        <div className="p-12 space-y-10 relative z-10">
          <div className="text-center space-y-6">
            <div className="relative group mx-auto w-24 h-24">
              <div className="absolute inset-0 bg-green-500/20 rounded-[2.5rem] blur-2xl" />
              <div className="absolute inset-0 bg-green-600 text-white rounded-[2.2rem] flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.5)] neon-flicker">
                <Leaf size={48} className="group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="text-5xl font-black text-white outfit tracking-tighter">AgroPlay</h2>
              <p className="text-[9px] font-black text-green-500 uppercase tracking-[0.5em] ml-1 opacity-80">Autonomous Farming Nexus</p>
            </div>
          </div>

          <div className="space-y-8">
            <button 
              onClick={handleGoogleLogin}
              disabled={isLoading || isGoogleLoading}
              className="relative w-full py-5 rounded-2xl font-black text-[11px] tracking-widest text-slate-800 transition-all active:scale-95 disabled:opacity-50 overflow-hidden bg-white hover:bg-slate-50 shadow-xl flex items-center justify-center gap-4 group"
            >
              <div className="w-8 h-8 flex items-center justify-center p-1.5 transition-transform group-hover:scale-110">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-full h-full" />
              </div>
              <span className="uppercase">Continue with Google Account</span>
            </button>

            <div className="relative flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">Secure Uplink</span>
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
                  className="w-full px-6 py-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white font-bold text-sm focus:border-green-500/50 outline-none transition-all" 
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading || isGoogleLoading}
                className="w-full group bg-green-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(22,101,52,0.4)] hover:bg-green-500 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 mt-6 relative overflow-hidden"
              >
                <span>{isLogin ? 'Establish Link' : 'Register Operator'}</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          <div className="text-center pt-2">
            <button 
              onClick={() => setIsLogin(!isLogin)}
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
