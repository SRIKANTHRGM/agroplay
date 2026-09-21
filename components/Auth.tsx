
import React, { useState } from 'react';
import { 
  Leaf, 
  Mail, 
  Lock, 
  User, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2
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
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleTraditionalAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const uid = `u-${btoa(email).substr(0, 8)}`;
      const userRef = doc(db, 'users', uid, 'profile');
      const snap = await getDoc(userRef);
      
      if (snap.exists()) {
        onLogin(snap.data() as UserProfile);
      } else {
        const skeleton: UserProfile = {
          uid,
          name: name || email.split('@')[0],
          email,
          phone: '',
          onboardingComplete: false,
          points: 1250,
          ecoPoints: 0,
          badges: [],
          location: 'Warangal, Telangana',
          soilType: 'Deep Red Sandy & Chalky Black Soil',
          role: 'Farmer',
          farmSize: '2.5 Acres',
          cropPreferences: ['Cotton', 'Chili Pepper', 'Paddy / Rice'],
          sustainabilityGoals: ['Drip Irrigation Optimization'],
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
          const profileData: UserProfile = {
            uid: user.uid,
            name: user.displayName || "Modern Farmer",
            email: user.email || "",
            phone: (user as any).phoneNumber || "",
            avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
            role: 'Farmer',
            points: 1250,
            ecoPoints: 100,
            location: 'Warangal, Telangana',
            soilType: 'Deep Red Sandy & Chalky Black Soil',
            onboardingComplete: false,
            farmSize: "2.5 Acres",
            cropPreferences: ['Cotton', 'Chili Pepper'],
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-6 relative overflow-hidden font-inter">
      {/* Background Soft Ambient Green Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-green-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-30 z-0" />
      
      <div className={`w-full max-w-md bg-white rounded-[3rem] shadow-[0_20px_70px_rgba(16,185,129,0.15)] relative z-10 overflow-hidden border-2 border-emerald-100/80 transition-all duration-500 ${shake ? 'shake' : ''}`}>
        
        {(isLoading || isGoogleLoading) && (
          <div className="absolute inset-0 z-50 overflow-hidden bg-white/90 backdrop-blur-md flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin shadow-lg shadow-emerald-200" />
            <p className="text-xs font-black text-emerald-700 uppercase tracking-[0.3em] animate-pulse text-center px-8">
              Connecting Smart Farm Network...
            </p>
          </div>
        )}
        
        <div className="p-8 sm:p-10 space-y-8 relative z-10">
          {/* Top Brand Header */}
          <div className="text-center space-y-4">
            <div className="relative group mx-auto w-20 h-20">
              <div className="absolute inset-0 bg-emerald-400/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative w-full h-full bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-[2rem] flex items-center justify-center shadow-lg shadow-emerald-300">
                <Leaf size={40} className="group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-slate-900 outfit tracking-tight">AgroPlay</h1>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em]">Smart Agriculture Platform</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Google Authentication Button */}
            <button 
              onClick={handleGoogleLogin}
              disabled={isLoading || isGoogleLoading}
              className="w-full py-4 px-6 rounded-2xl font-bold text-xs tracking-wider text-slate-800 transition-all active:scale-95 disabled:opacity-50 bg-white hover:bg-emerald-50/60 border-2 border-emerald-100 hover:border-emerald-300 shadow-sm flex items-center justify-center gap-3 group"
            >
              <div className="w-6 h-6 flex items-center justify-center transition-transform group-hover:scale-110">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-full h-full" />
              </div>
              <span className="uppercase">Continue with Google Account</span>
            </button>

            <div className="relative flex items-center gap-4 py-1">
              <div className="flex-1 h-px bg-emerald-100" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Or Sign In With Email</span>
              <div className="flex-1 h-px bg-emerald-100" />
            </div>

            {/* Email Form */}
            <form onSubmit={handleTraditionalAuth} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1.5 animate-in slide-in-from-top-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-2 flex items-center gap-2">
                    <User size={13} className="text-emerald-600" /> Full Name / Operator Name
                  </label>
                  <input 
                    required 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="Enter your full name" 
                    className="w-full px-5 py-3.5 bg-slate-50 border border-emerald-200/80 rounded-2xl text-slate-900 font-semibold text-sm focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-400" 
                  />
                </div>
              )}
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-2 flex items-center gap-2">
                  <Mail size={13} className="text-emerald-600" /> Email Address
                </label>
                <input 
                  required 
                  type="email"
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="farmer@domain.com" 
                  className="w-full px-5 py-3.5 bg-slate-50 border border-emerald-200/80 rounded-2xl text-slate-900 font-semibold text-sm focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-400" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-2 flex items-center gap-2">
                  <Lock size={13} className="text-emerald-600" /> Password
                </label>
                <input 
                  required 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••••••" 
                  className="w-full px-5 py-3.5 bg-slate-50 border border-emerald-200/80 rounded-2xl text-slate-900 font-semibold text-sm focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-400" 
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading || isGoogleLoading}
                className="w-full group bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 mt-6"
              >
                <span>{isLogin ? 'Log In to Farm Dashboard' : 'Create Free Farmer Account'}</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          <div className="text-center pt-2 border-t border-emerald-100">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[11px] font-black text-emerald-700 hover:text-emerald-800 uppercase tracking-wider transition-colors py-2"
            >
              {isLogin ? "New to AgroPlay? Create an Account" : "Already have an account? Sign In"}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 pt-1">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Encrypted • Verified All-India Mandi & Soil Network</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

