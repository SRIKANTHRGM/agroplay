
import React, { useState } from 'react';
import {
  Sprout,
  MapPin,
  Droplets,
  Languages,
  User,
  ChevronRight,
  Loader2,
  Check,
  AlertCircle,
  Tractor,
  Wheat,
  Waves,
  ShieldCheck,
  Layout,
  Info
} from 'lucide-react';
import { UserProfile } from '../types';
import { updateProfile } from '../services/authService';

interface Props {
  user: UserProfile;
  onComplete: (updatedUser: UserProfile) => void;
}

const ROLES = ['Farmer', 'Learner', 'Expert'] as const;
const LANGUAGES = ['English', 'Hindi', 'Punjabi', 'Tamil', 'Telugu'] as const;
const IRRIGATION = ['Drip Irrigation', 'Precision Sprinkler', 'Flood Irrigation'] as const;

const Onboarding: React.FC<Props> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: user.name || '',
    role: 'Farmer',
    location: '',
    cropPreferences: [],
    irrigationPreference: 'Drip Irrigation',
    languagePreference: 'English',
    onboardingComplete: false,
    points: 1250,
    ecoPoints: 100,
    farmSize: 'Ready to map'
  });
  const [isSaving, setIsSaving] = useState(false);

  const totalSteps = 4;
  const progress = Math.round((step / totalSteps) * 100);

  const isStepValid = () => {
    switch (step) {
      case 1: return (formData.name?.length ?? 0) > 2 && formData.role;
      case 2: return (formData.location?.length ?? 0) > 3;
      case 3: return (formData.cropPreferences?.length ?? 0) > 0;
      case 4: return !!formData.irrigationPreference && !!formData.languagePreference;
      default: return false;
    }
  };

  const handleFinish = async () => {
    setIsSaving(true);
    try {
      const updatedUser = await updateProfile({
        ...formData,
        onboardingComplete: true
      });
      onComplete(updatedUser.user);
    } catch (e) {
      console.error("Onboarding sync failed:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCrop = (crop: string) => {
    const current = formData.cropPreferences || [];
    if (current.includes(crop)) {
      setFormData({ ...formData, cropPreferences: current.filter(c => c !== crop) });
    } else {
      setFormData({ ...formData, cropPreferences: [...current, crop] });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-inter">
      <div className="absolute inset-0 grid-bg opacity-10" />

      <div className="w-full max-w-2xl bg-white rounded-[4rem] shadow-[0_0_120px_rgba(34,197,94,0.15)] relative overflow-hidden animate-in zoom-in-95 duration-700">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
          <div
            className="h-full bg-green-600 transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-12 md:p-20 space-y-12">
          {/* Step Indicators */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-100">
                <User size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-800 outfit tracking-tighter">Profile Protocol</h2>
                <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Phase {step} of {totalSteps} • Identification</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-slate-200 outfit leading-none">{progress}%</p>
            </div>
          </div>

          <div className="min-h-[300px]">
            {step === 1 && (
              <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Display Identification</label>
                  <input
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-8 py-6 bg-slate-50 border-none rounded-[2rem] text-xl font-bold focus:ring-4 focus:ring-green-500/10 shadow-inner outline-none"
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Your Node Role</label>
                  <div className="grid grid-cols-3 gap-4">
                    {ROLES.map(r => (
                      <button
                        key={r}
                        onClick={() => setFormData({ ...formData, role: r })}
                        className={`py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${formData.role === r ? 'bg-slate-900 text-white shadow-xl scale-105' : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Geographic deployment zone</label>
                  <div className="relative group">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-green-500 transition-colors" size={24} />
                    <input
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      className="w-full pl-16 pr-8 py-6 bg-slate-50 border-none rounded-[2rem] text-xl font-bold focus:ring-4 focus:ring-green-500/10 shadow-inner outline-none"
                      placeholder="City, State, Country"
                    />
                  </div>
                </div>
                <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 flex items-start gap-5">
                  {/* Missing Info import caused error here */}
                  <Info className="text-blue-500 flex-shrink-0 mt-1" size={20} />
                  <p className="text-sm text-blue-700 font-medium leading-relaxed italic">"Precise location allows our AI to sync with regional weather patterns and soil grids."</p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Primary Cultivars</label>
                  <div className="grid grid-cols-2 gap-4">
                    {['Wheat', 'Rice', 'Cotton', 'Turmeric', 'Coconut', 'Tomato'].map(c => (
                      <button
                        key={c}
                        onClick={() => toggleCrop(c)}
                        className={`flex items-center gap-4 p-5 rounded-3xl border-4 transition-all ${formData.cropPreferences?.includes(c) ? 'bg-green-50 border-green-500 text-green-700 shadow-xl' : 'bg-white border-slate-50 text-slate-400'}`}
                      >
                        <Wheat size={20} className={formData.cropPreferences?.includes(c) ? 'text-green-600' : 'text-slate-200'} />
                        <span className="font-black text-sm uppercase tracking-widest">{c}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">System Preferences</label>
                  <div className="space-y-3">
                    <select
                      value={formData.irrigationPreference}
                      onChange={e => setFormData({ ...formData, irrigationPreference: e.target.value })}
                      className="w-full px-8 py-5 bg-slate-50 border-none rounded-[1.5rem] font-bold text-slate-700 shadow-inner focus:ring-2 focus:ring-green-500 outline-none"
                    >
                      {IRRIGATION.map(i => <option key={i}>{i}</option>)}
                    </select>
                    <select
                      value={formData.languagePreference}
                      onChange={e => setFormData({ ...formData, languagePreference: e.target.value })}
                      className="w-full px-8 py-5 bg-slate-50 border-none rounded-[1.5rem] font-bold text-slate-700 shadow-inner focus:ring-2 focus:ring-green-500 outline-none"
                    >
                      {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-1000"><ShieldCheck size={160} /></div>
                  <h5 className="text-xl font-black outfit text-green-400 mb-2">Security Verification</h5>
                  <p className="text-slate-400 text-xs font-medium leading-relaxed uppercase tracking-widest">Profile data is encrypted and synced with the AgroPlay neural network.</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-6">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 py-6 bg-slate-100 text-slate-400 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
              >
                Back
              </button>
            )}
            <button
              disabled={!isStepValid() || isSaving}
              onClick={() => step < totalSteps ? setStep(step + 1) : handleFinish()}
              className="flex-[2] py-6 bg-green-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl shadow-green-100 transition-all hover:bg-green-700 active:scale-95 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin" size={20} /> : step === totalSteps ? 'Activate Profile' : 'Confirm & Continue'}
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
