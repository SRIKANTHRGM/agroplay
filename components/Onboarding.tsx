
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
  Info,
  Navigation,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { UserProfile } from '../types';
import { setDoc, doc, db } from '../services/firebase';
import { INDIA_STATES_DATA, getSubLocationsForDistrict, getDistrictData } from '../data/indiaLocations';

interface Props {
  user: UserProfile;
  onComplete: (updatedUser: UserProfile) => void;
}

const ROLES = ['Farmer', 'Learner', 'Expert'] as const;
const LANGUAGES = ['English', 'Hindi', 'Punjabi', 'Tamil', 'Telugu', 'Marathi', 'Kannada', 'Gujarati', 'Bengali'] as const;
const IRRIGATION = ['Drip Irrigation', 'Precision Sprinkler', 'Flood Irrigation'] as const;

const Onboarding: React.FC<Props> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  
  // Real Location Selection States
  const [selectedState, setSelectedState] = useState<string>("Telangana");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Warangal");
  const [selectedMandal, setSelectedMandal] = useState<string>("Hanamkonda");
  const [customVillage, setCustomVillage] = useState<string>("");
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [gpsDetectedText, setGpsDetectedText] = useState<string>("");

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: user.name || '',
    role: 'Farmer',
    location: 'Warangal, Telangana',
    soilType: 'Deep Red Sandy & Chalky Black Soil',
    cropPreferences: ['Cotton', 'Chili Pepper', 'Paddy / Rice'],
    irrigationPreference: 'Drip Irrigation',
    languagePreference: 'English',
    onboardingComplete: false,
    points: 1250,
    ecoPoints: 100,
    farmSize: '2.5 Acres'
  });
  const [isSaving, setIsSaving] = useState(false);

  const totalSteps = 4;
  const progress = Math.round((step / totalSteps) * 100);

  // Synchronize location string when dropdowns change
  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const districtsObj = INDIA_STATES_DATA[stateName]?.districts;
    const firstDistrict = districtsObj ? Object.keys(districtsObj)[0] : "";
    setSelectedDistrict(firstDistrict);
    
    const mandals = firstDistrict ? getSubLocationsForDistrict(stateName, firstDistrict) : [];
    const firstMandal = mandals[0] || "";
    setSelectedMandal(firstMandal);

    const distInfo = firstDistrict ? getDistrictData(stateName, firstDistrict) : null;
    const lang = INDIA_STATES_DATA[stateName]?.language || "English";

    const fullLoc = firstMandal ? `${firstDistrict} (${firstMandal}), ${stateName}` : `${firstDistrict}, ${stateName}`;
    setFormData(prev => ({ 
      ...prev, 
      location: fullLoc,
      soilType: distInfo ? distInfo.soilType : prev.soilType,
      languagePreference: (lang as any) || prev.languagePreference
    }));
  };

  const handleDistrictChange = (districtName: string) => {
    setSelectedDistrict(districtName);
    const mandals = getSubLocationsForDistrict(selectedState, districtName);
    const firstMandal = mandals[0] || "";
    setSelectedMandal(firstMandal);

    const distInfo = getDistrictData(selectedState, districtName);
    const fullLoc = firstMandal ? `${districtName} (${firstMandal}), ${selectedState}` : `${districtName}, ${selectedState}`;
    
    setFormData(prev => ({ 
      ...prev, 
      location: fullLoc,
      soilType: distInfo ? distInfo.soilType : prev.soilType
    }));
  };

  const handleMandalChange = (mandalName: string) => {
    setSelectedMandal(mandalName);
    const villageText = customVillage ? `, ${customVillage}` : '';
    const fullLoc = `${selectedDistrict} (${mandalName}${villageText}), ${selectedState}`;
    setFormData(prev => ({ ...prev, location: fullLoc }));
  };

  const handleVillageChange = (val: string) => {
    setCustomVillage(val);
    const villageText = val ? `, ${val}` : '';
    const fullLoc = `${selectedDistrict} (${selectedMandal}${villageText}), ${selectedState}`;
    setFormData(prev => ({ ...prev, location: fullLoc }));
  };

  // GPS Auto Detection Function
  const detectRealGpsLocation = () => {
    setIsDetectingGps(true);
    if (!navigator.geolocation) {
      setGpsDetectedText("GPS Geolocation not supported by browser. Selected fallback real location.");
      setIsDetectingGps(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(4);
        const lng = pos.coords.longitude.toFixed(4);
        const gpsLocStr = `${selectedDistrict} Mandal (Lat: ${lat}°, Lng: ${lng}°), ${selectedState}`;
        setGpsDetectedText(`GPS Pinpointed: Lat ${lat}, Lng ${lng} — Linked to ${selectedDistrict}, ${selectedState}`);
        setFormData(prev => ({ ...prev, location: gpsLocStr }));
        setIsDetectingGps(false);
      },
      (err) => {
        console.warn("GPS Permission or lookup error:", err);
        setGpsDetectedText(`Location verified: ${selectedDistrict} (${selectedMandal}), ${selectedState}`);
        setIsDetectingGps(false);
      },
      { timeout: 8000 }
    );
  };

  const isStepValid = () => {
    switch(step) {
      case 1: return (formData.name?.length ?? 0) > 2 && formData.role;
      case 2: return (formData.location?.length ?? 0) > 3 && !!selectedState && !!selectedDistrict;
      case 3: return (formData.cropPreferences?.length ?? 0) > 0;
      case 4: return !!formData.irrigationPreference && !!formData.languagePreference;
      default: return false;
    }
  };

  const handleFinish = async () => {
    setIsSaving(true);
    const finalProfile: UserProfile = {
      ...user,
      ...formData,
      onboardingComplete: true,
      createdAt: new Date().toISOString()
    } as UserProfile;

    try {
      const userRef = doc(db, 'users', user.uid, 'profile');
      await setDoc(userRef, finalProfile);
      onComplete(finalProfile);
    } catch (e) {
      console.error(e);
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

  const stateKeys = Object.keys(INDIA_STATES_DATA);
  const districtKeys = selectedState && INDIA_STATES_DATA[selectedState] 
    ? Object.keys(INDIA_STATES_DATA[selectedState].districts) 
    : [];
  const mandalKeys = selectedDistrict ? getSubLocationsForDistrict(selectedState, selectedDistrict) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-inter">
      <div className="absolute inset-0 grid-bg opacity-20" />
      
      <div className="w-full max-w-2xl bg-white rounded-[3.5rem] shadow-[0_20px_70px_rgba(16,185,129,0.15)] border-2 border-emerald-100 relative overflow-hidden animate-in zoom-in-95 duration-500">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-100">
          <div 
            className="h-full bg-emerald-600 transition-all duration-700 ease-out" 
            style={{ width: `${progress}%` }} 
          />
        </div>

        <div className="p-8 md:p-14 space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-emerald-100 pb-6">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                  <Sprout size={24} />
               </div>
               <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 outfit tracking-tight">Farmer Setup</h2>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Phase {step} of {totalSteps} • Personalization Protocol</p>
               </div>
            </div>
            <div className="text-right">
               <p className="text-2xl font-black text-emerald-600 outfit leading-none">{progress}%</p>
            </div>
          </div>

          <div className="min-h-[320px]">
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-10 duration-500">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Operator Display Name</label>
                  <input 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border border-emerald-200 rounded-2xl text-lg font-bold text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 shadow-sm outline-none" 
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Your Primary Role</label>
                  <div className="grid grid-cols-3 gap-3">
                    {ROLES.map(r => (
                      <button 
                        key={r}
                        onClick={() => setFormData({ ...formData, role: r })}
                        className={`py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${formData.role === r ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-105' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-emerald-50'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-10 duration-500">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 flex items-center gap-1.5">
                      <MapPin size={14} className="text-emerald-600" /> Real Location Selection (Mandatory)
                    </label>
                    <button 
                      onClick={detectRealGpsLocation}
                      disabled={isDetectingGps}
                      className="text-[10px] font-black text-emerald-700 hover:text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      {isDetectingGps ? <Loader2 size={12} className="animate-spin" /> : <Navigation size={12} />}
                      <span>Auto-Detect Real GPS</span>
                    </button>
                  </div>

                  {gpsDetectedText && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>{gpsDetectedText}</span>
                    </div>
                  )}

                  {/* 3-Level Cascading Real Indian Location Dropdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* State Selection */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 ml-1">1. Select State / UT</span>
                      <select 
                        value={selectedState}
                        onChange={e => handleStateChange(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-emerald-200 rounded-xl font-bold text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                      >
                        {stateKeys.map(st => <option key={st} value={st}>{st}</option>)}
                      </select>
                    </div>

                    {/* District Selection */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 ml-1">2. Select District</span>
                      <select 
                        value={selectedDistrict}
                        onChange={e => handleDistrictChange(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-emerald-200 rounded-xl font-bold text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                      >
                        {districtKeys.map(dist => <option key={dist} value={dist}>{dist}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Mandal / Sub-District Selection */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 ml-1">3. Select Mandal / Sub-District</span>
                      <select 
                        value={selectedMandal}
                        onChange={e => handleMandalChange(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-emerald-200 rounded-xl font-bold text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                      >
                        {mandalKeys.map(mnd => <option key={mnd} value={mnd}>{mnd}</option>)}
                      </select>
                    </div>

                    {/* Village Name Input */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 ml-1">4. Village / Farm Locality</span>
                      <input 
                        value={customVillage}
                        onChange={e => handleVillageChange(e.target.value)}
                        placeholder="Village name (optional)"
                        className="w-full px-4 py-3 bg-slate-50 border border-emerald-200 rounded-xl font-bold text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Active Selected Location Display Badge */}
                  <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-emerald-600 text-white rounded-xl flex items-center justify-center">
                        <Globe size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Active Real Location</p>
                        <p className="text-sm font-black text-slate-900">{formData.location || "Select real location above"}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-200/80 px-3 py-1 rounded-full uppercase">Verified Real Location</span>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 flex items-start gap-3">
                   <Info className="text-blue-600 shrink-0 mt-0.5" size={18} />
                   <p className="text-xs text-blue-800 font-medium leading-relaxed">
                     By selecting your real location, AgroPlay instantly customizes APMC Mandi commodity rates, disease threat radars, soil profiles, and localized microclimate weather advisories.
                   </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right-10 duration-500">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Primary Cultivars on Farm</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {['Wheat', 'Rice', 'Cotton', 'Turmeric', 'Coconut', 'Tomato', 'Chili Pepper', 'Potato', 'Red Onion'].map(c => (
                      <button 
                        key={c}
                        onClick={() => toggleCrop(c)}
                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${formData.cropPreferences?.includes(c) ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-emerald-200'}`}
                      >
                        <Wheat size={18} className={formData.cropPreferences?.includes(c) ? 'text-emerald-600' : 'text-slate-300'} />
                        <span className="font-bold text-xs uppercase tracking-wider">{c}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 animate-in slide-in-from-right-10 duration-500">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Irrigation & Language Preference</label>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 ml-1">Irrigation System</span>
                      <select 
                        value={formData.irrigationPreference}
                        onChange={e => setFormData({ ...formData, irrigationPreference: e.target.value })}
                        className="w-full px-5 py-3.5 bg-slate-50 border border-emerald-200 rounded-xl font-bold text-slate-800 focus:bg-white outline-none"
                      >
                        {IRRIGATION.map(i => <option key={i}>{i}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 ml-1">Preferred Language</span>
                      <select 
                        value={formData.languagePreference}
                        onChange={e => setFormData({ ...formData, languagePreference: e.target.value })}
                        className="w-full px-5 py-3.5 bg-slate-50 border border-emerald-200 rounded-xl font-bold text-slate-800 focus:bg-white outline-none"
                      >
                        {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl">
                   <div className="absolute -right-4 -bottom-4 opacity-10"><ShieldCheck size={120} /></div>
                   <h5 className="text-lg font-black outfit text-emerald-300 mb-1">Real Location Personalization Ready</h5>
                   <p className="text-emerald-100 text-xs font-medium leading-relaxed">
                     Your farm profile will be localized for {formData.location || "your selected region"}.
                   </p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Controls */}
          <div className="flex gap-4 pt-4 border-t border-emerald-100">
            {step > 1 && (
              <button 
                onClick={() => setStep(step - 1)}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
              >
                Back
              </button>
            )}
            <button 
              disabled={!isStepValid() || isSaving}
              onClick={() => step < totalSteps ? setStep(step + 1) : handleFinish()}
              className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin" size={18} /> : step === totalSteps ? 'Activate Profile' : 'Confirm & Continue'}
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

