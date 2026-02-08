import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types';
import {
  MapPin,
  ShieldCheck,
  Award,
  Settings,
  Camera,
  Check,
  X,
  Mail,
  Phone,
  Link as LinkIcon,
  AlertCircle,
  Sprout,
  Save,
  Tractor,
  TrendingUp,
  Target,
  Loader2,
  Trash2,
  Plus,
  ChevronRight,
  Globe,
  Clock,
  Database,
  Star
} from 'lucide-react';
import { setDoc, doc, db } from '../services/firebase';

interface Props {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const ROLES = ['Farmer', 'Learner', 'Expert'] as const;
const SOIL_TYPES = ['Alluvial Soil', 'Black Soil', 'Red Soil', 'Laterite Soil', 'Mountain Soil'] as const;

const Profile: React.FC<Props> = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  const [formData, setFormData] = useState<UserProfile>({
    ...user,
    badges: user.badges ?? [],
    cropPreferences: user.cropPreferences ?? [],
    sustainabilityGoals: user.sustainabilityGoals ?? []
  });
  const [newPreference, setNewPreference] = useState('');
  const [newGoal, setNewGoal] = useState('');

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData({
      ...user,
      badges: user.badges ?? [],
      cropPreferences: user.cropPreferences ?? [],
      sustainabilityGoals: user.sustainabilityGoals ?? []
    });
  }, [user, isEditing]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const calculateCompletion = () => {
    const fields = [
      formData.name, formData.email, formData.phone,
      formData.location, formData.farmSize,
      (formData.cropPreferences?.length ?? 0) > 0,
      (formData.sustainabilityGoals?.length ?? 0) > 0
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      showToast("Name is a mandatory biometric field.", "error");
      return;
    }

    setIsSyncing(true);
    try {
      const path = `users/${user.name?.toLowerCase().replace(/\s+/g, '-') ?? 'unknown'}/profile`;
      const userRef = doc(db, path);

      await setDoc(userRef, { ...formData });
      setUser({ ...formData });

      setLastSynced(new Date().toLocaleTimeString());
      setIsEditing(false);
      showToast("Profile synchronized with cloud node.", "success");
    } catch (e) {
      showToast("Sync failed. Check terminal connection.", "error");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addPreference = () => {
    const val = newPreference.trim();
    if (val && !formData.cropPreferences?.includes(val)) {
      setFormData(prev => ({
        ...prev,
        cropPreferences: [...(prev.cropPreferences ?? []), val]
      }));
      setNewPreference('');
    }
  };

  const removePreference = (item: string) => {
    setFormData(prev => ({
      ...prev,
      cropPreferences: (prev.cropPreferences ?? []).filter(p => p !== item)
    }));
  };

  const addGoal = () => {
    const val = newGoal.trim();
    if (val && !formData.sustainabilityGoals?.includes(val)) {
      setFormData(prev => ({
        ...prev,
        sustainabilityGoals: [...(prev.sustainabilityGoals ?? []), val]
      }));
      setNewGoal('');
    }
  };

  const removeGoal = (item: string) => {
    setFormData(prev => ({
      ...prev,
      sustainabilityGoals: (prev.sustainabilityGoals ?? []).filter(g => g !== item)
    }));
  };

  const completion = calculateCompletion();

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 relative px-4">
      {toast && (
        <div className={`fixed top-10 right-10 z-[200] flex items-center gap-3 px-8 py-4 rounded-3xl shadow-2xl animate-in slide-in-from-right-10 border border-white/20 backdrop-blur-xl ${toast.type === 'success' ? 'bg-green-600/90 text-white' : 'bg-rose-600/90 text-white'
          }`}>
          {toast.type === 'success' ? <Check size={24} /> : <AlertCircle size={24} />}
          <p className="font-black outfit text-xs uppercase tracking-widest">{toast.message}</p>
        </div>
      )}

      <div className="relative h-72 md:h-96 rounded-[4rem] overflow-hidden shadow-2xl mb-24 group border-8 border-white">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600"
          className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110"
          alt="Banner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent" />

        <div className="absolute top-10 right-10 flex flex-col items-end gap-3">
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-3xl shadow-2xl animate-in fade-in delay-500">
            <div className="relative w-14 h-14">
              <svg className="w-full h-full -rotate-90">
                <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/10" />
                <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent"
                  strokeDasharray={150.8} strokeDashoffset={150.8 * (1 - completion / 100)}
                  className="text-green-400 transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">{completion}%</div>
            </div>
            <div className="hidden md:block">
              <p className="text-[10px] font-black text-green-400 uppercase tracking-widest leading-none mb-1">Dossier Integrity</p>
              <p className="text-xs font-bold text-white">Encrypted Node Access</p>
            </div>
          </div>

          {lastSynced && (
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/60 backdrop-blur-md rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest border border-white/5 animate-in slide-in-from-right-4">
              <Database size={10} className="text-green-500" /> Last Synced: {lastSynced}
            </div>
          )}
        </div>

        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:left-24 md:translate-x-0">
          <div className="relative">
            <div className={`absolute -inset-3 rounded-full blur-md opacity-40 transition-all duration-1000 ${isEditing ? 'bg-amber-400 animate-pulse' : 'bg-green-50 shadow-[0_0_40px_rgba(34,197,94,0.5)]'}`} />
            <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full border-[12px] border-white bg-slate-100 shadow-2xl overflow-hidden group/avatar cursor-pointer">
              <img src={formData.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=AgroPlay"} className="w-full h-full object-cover" alt="User" />
              {isEditing && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center text-white opacity-0 group-hover/avatar:opacity-100 transition-all backdrop-blur-sm"
                >
                  <Camera className="mb-2 animate-bounce" size={40} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Update Optic</span>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
            <div className={`absolute bottom-4 right-4 p-4 rounded-[1.5rem] border-4 border-white shadow-2xl transition-all ${formData.role === 'Expert' ? 'bg-amber-500 scale-110' : 'bg-green-600'} text-white`}>
              {formData.role === 'Expert' ? <Award size={32} /> : <ShieldCheck size={32} />}
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 md:left-[340px] md:translate-x-0 text-center md:text-left text-white w-full max-w-2xl px-6 md:px-0">
          <div className="space-y-4">
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-white/10 border-b-2 border-white/40 rounded-t-2xl px-6 py-3 text-white text-4xl md:text-6xl font-black outfit outline-none focus:bg-white/20 focus:border-green-400 transition-all w-full md:w-[500px]"
                placeholder="Operative Name"
              />
            ) : (
              <h2 className="text-5xl md:text-7xl font-black outfit tracking-tighter leading-none">{user.name ?? 'Operative'}</h2>
            )}
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 px-4 py-1.5 bg-green-500/20 text-green-300 border border-green-500/30 rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">
                <TrendingUp size={12} /> LEVEL {Math.floor((user.points ?? 0) / 500) + 1} {(user.role ?? 'Farmer').toUpperCase()}
              </div>
              <span className="w-1 h-1 bg-white/30 rounded-full" />
              <span className="text-white/60 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                <MapPin size={14} className="text-green-400" /> {user.location}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <div className="bg-white rounded-[4rem] p-12 border border-slate-100 shadow-2xl space-y-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-[2s] pointer-events-none">
              <Globe size={280} />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-10">
              <div className="space-y-1">
                <h3 className="text-4xl font-black outfit tracking-tighter text-slate-800">Operative Intel</h3>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em]">Primary Node Configuration</p>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      disabled={isSyncing}
                      className="flex-1 md:flex-none px-10 py-5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-[1.8rem] font-black text-xs uppercase tracking-widest transition-all"
                    >
                      Abort
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSyncing}
                      className="flex-1 md:flex-none px-12 py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl transition-all disabled:opacity-50"
                    >
                      {isSyncing ? <Loader2 className="animate-spin" size={20} /> : <Save size={18} />}
                      {isSyncing ? 'SYNCHRONIZING...' : 'COMMIT CHANGES'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full md:w-auto px-12 py-5 bg-green-600 hover:bg-green-700 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-green-100 transition-all hover:scale-105 active:scale-95"
                  >
                    <Settings size={20} /> MODIFY CONFIG
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
              <div className="space-y-10">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
                    <Mail size={14} className="text-blue-500" /> Communication Link
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-200 rounded-[2rem] outline-none transition-all font-bold text-lg outfit shadow-inner"
                      placeholder="node@agroplay.nexus"
                    />
                  ) : (
                    <div className="px-8 py-5 bg-slate-50 rounded-[2rem] font-black text-slate-700 outfit text-xl shadow-inner border border-slate-100/50">{user.email ?? 'N/A'}</div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
                    <Phone size={14} className="text-green-500" /> Satellite Mobile
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-green-200 rounded-[2rem] outline-none transition-all font-bold text-lg outfit shadow-inner"
                      placeholder="+91-0000000000"
                    />
                  ) : (
                    <div className="px-8 py-5 bg-slate-50 rounded-[2rem] font-black text-slate-700 outfit text-xl shadow-inner border border-slate-100/50">{user.phone ?? 'N/A'}</div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Assigned Operative Role</label>
                  {isEditing ? (
                    <div className="grid grid-cols-3 gap-4">
                      {ROLES.map(role => (
                        <button
                          key={role}
                          onClick={() => setFormData(prev => ({ ...prev, role }))}
                          className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.role === role ? 'bg-slate-900 text-white shadow-2xl scale-105 border-slate-900' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-8 py-5 bg-green-50 rounded-[2rem] font-black text-green-700 uppercase text-xs tracking-[0.3em] border border-green-100">{user.role ?? 'Farmer'} Operative</div>
                  )}
                </div>
              </div>

              <div className="space-y-10">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
                    <MapPin size={14} className="text-rose-500" /> Geographic Grid
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-rose-200 rounded-[2rem] outline-none transition-all font-bold text-lg outfit shadow-inner"
                      placeholder="District, State"
                    />
                  ) : (
                    <div className="px-8 py-5 bg-slate-50 rounded-[2rem] font-black text-slate-700 outfit text-xl shadow-inner border border-slate-100/50">{user.location ?? 'India'}</div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
                    <Tractor size={14} className="text-amber-500" /> Acreage Magnitude
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.farmSize}
                      onChange={e => setFormData(prev => ({ ...prev, farmSize: e.target.value }))}
                      className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-amber-200 rounded-[2rem] outline-none transition-all font-bold text-lg outfit shadow-inner"
                      placeholder="e.g. 10.5 Acres"
                    />
                  ) : (
                    <div className="px-8 py-5 bg-slate-50 rounded-[2rem] font-black text-slate-700 outfit text-xl shadow-inner border border-slate-100/50">{user.farmSize ?? 'N/A'}</div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
                    <Globe size={14} className="text-emerald-500" /> Sub-Strata Baseline
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <select
                        value={formData.soilType}
                        onChange={e => setFormData(prev => ({ ...prev, soilType: e.target.value }))}
                        className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-emerald-200 rounded-[2rem] outline-none transition-all font-bold text-lg outfit appearance-none shadow-inner cursor-pointer"
                      >
                        {SOIL_TYPES.map(st => <option key={st}>{st}</option>)}
                      </select>
                      <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-slate-300 pointer-events-none" size={24} />
                    </div>
                  ) : (
                    <div className="px-8 py-5 bg-slate-50 rounded-[2rem] font-black text-slate-700 outfit text-xl shadow-inner border border-slate-100/50">{user.soilType ?? 'Alluvial Soil'}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-2xl space-y-10 relative overflow-hidden group">
              <div className="flex items-center justify-between border-b border-slate-50 pb-8">
                <div className="space-y-1">
                  <h4 className="text-3xl font-black outfit tracking-tighter text-slate-800">Variety Matrix</h4>
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Active Managed Crops</p>
                </div>
                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-[1.5rem] flex items-center justify-center shadow-inner group-hover:rotate-[15deg] transition-transform">
                  <Sprout size={28} />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {(formData.cropPreferences ?? []).map(crop => (
                  <span key={crop} className="px-5 py-2.5 bg-green-50 text-green-700 border border-green-100 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-in zoom-in duration-300 group/tag">
                    {crop}
                    {isEditing && (
                      <button onClick={() => removePreference(crop)} className="hover:text-rose-500 transition-colors">
                        <X size={14} strokeWidth={3} />
                      </button>
                    )}
                  </span>
                ))}
                {(formData.cropPreferences?.length ?? 0) === 0 && <p className="text-slate-400 font-medium italic">No managed varieties detected.</p>}
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <input
                    type="text"
                    value={newPreference}
                    onChange={e => setNewPreference(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addPreference()}
                    className="flex-1 bg-slate-50 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-green-500/10 outline-none shadow-inner border border-slate-100"
                    placeholder="New cultivar..."
                  />
                  <button onClick={addPreference} className="w-14 h-14 bg-slate-900 text-white rounded-2xl hover:bg-green-600 shadow-xl active:scale-90 transition-all flex items-center justify-center">
                    <Plus size={24} />
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-2xl space-y-10 relative overflow-hidden group">
              <div className="flex items-center justify-between border-b border-slate-50 pb-8">
                <div className="space-y-1">
                  <h4 className="text-3xl font-black outfit tracking-tighter text-slate-800">Mission Vector</h4>
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Target Objectives</p>
                </div>
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  <Target size={28} />
                </div>
              </div>

              <div className="space-y-4">
                {(formData.sustainabilityGoals ?? []).map(goal => (
                  <div key={goal} className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-[2rem] animate-in slide-in-from-left-4 duration-500 group/goal">
                    <span className="text-sm font-bold text-slate-700 leading-tight">{goal}</span>
                    {isEditing && (
                      <button onClick={() => removeGoal(goal)} className="text-slate-300 hover:text-rose-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
                {(formData.sustainabilityGoals?.length ?? 0) === 0 && <p className="text-slate-400 font-medium italic">No active objectives queued.</p>}
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <input
                    type="text"
                    value={newGoal}
                    onChange={e => setNewGoal(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addGoal()}
                    className="flex-1 bg-slate-50 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none shadow-inner border border-slate-100"
                    placeholder="Define mission..."
                  />
                  <button onClick={addGoal} className="w-14 h-14 bg-blue-600 text-white rounded-2xl hover:bg-slate-900 shadow-xl active:scale-90 transition-all flex items-center justify-center">
                    <Plus size={24} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-12">
          <div className="bg-slate-900 rounded-[4rem] p-12 text-white space-y-10 relative overflow-hidden group shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] border border-white/5">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform duration-[1.5s]">
              <TrendingUp size={220} />
            </div>
            <div className="relative z-10 space-y-10">
              <div>
                <p className="text-[11px] font-black text-green-400 uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
                  Network Status: Prime
                </p>
                <p className="text-8xl font-black outfit tracking-tighter leading-none mb-2">{user.points ?? 0}</p>
                <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.4em] mt-1">Global Mastery Score</p>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase text-white/50 tracking-widest">Uplink Maturity Stage</span>
                  <span className="text-2xl font-black outfit text-green-400">STAGE {Math.floor((user.points ?? 0) / 500) + 1}</span>
                </div>
                <div className="w-full h-5 bg-white/5 rounded-full overflow-hidden p-1.5 border border-white/10 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-green-600 via-green-400 to-emerald-300 h-full rounded-full transition-all duration-[2.5s] shadow-[0_0_20px_rgba(34,197,94,0.7)]"
                    style={{ width: `${((user.points ?? 0) % 500) / 5}%` }}
                  />
                </div>
                <p className="text-[9px] font-bold text-slate-500 text-center uppercase tracking-widest">{500 - ((user.points ?? 0) % 500)} XP to next terminal upgrade</p>
              </div>

              <div className="pt-10 border-t border-white/10 grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Certifications</p>
                  <p className="text-3xl font-black outfit tracking-tighter">{user.badges?.length ?? 0}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Journeys</p>
                  <p className="text-3xl font-black outfit tracking-tighter">4 <span className="text-xs text-green-500">↑</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[4rem] p-12 border border-slate-100 shadow-2xl space-y-10">
            <h4 className="text-3xl font-black outfit tracking-tighter text-slate-800">Honor Commendations</h4>
            <div className="grid grid-cols-2 gap-6">
              {(user.badges ?? []).map(badge => (
                <div key={badge.id} className="group relative bg-slate-50 p-8 rounded-[3rem] flex flex-col items-center text-center gap-5 hover:bg-green-50 transition-all cursor-help border border-transparent hover:border-green-100 shadow-sm">
                  <div className="w-20 h-20 bg-white rounded-[1.8rem] flex items-center justify-center text-amber-500 shadow-xl shadow-slate-200/50 group-hover:scale-110 transition-all duration-500 group-hover:rotate-6">
                    <Award size={40} />
                  </div>
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-tight">{badge.name}</p>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-slate-900/98 rounded-[3rem] p-6 flex flex-col items-center justify-center transition-all duration-500 pointer-events-none z-20 scale-90 group-hover:scale-100">
                    <Star size={20} className="text-amber-400 mb-2 animate-spin-slow" />
                    <p className="text-[9px] text-white font-black leading-relaxed uppercase tracking-widest text-center">{badge.description}</p>
                  </div>
                </div>
              ))}
              {(user.badges?.length ?? 0) === 0 && (
                <div className="col-span-2 text-center py-8 opacity-40">
                  <Award className="mx-auto mb-2 text-slate-400" size={32} />
                  <p className="text-[10px] font-black uppercase tracking-widest">No badges awarded yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-[3.5rem] p-10 border border-amber-100 flex items-center gap-8 group hover:shadow-2xl transition-all duration-500 cursor-pointer">
            <div className="w-20 h-20 bg-white rounded-[1.8rem] flex items-center justify-center text-amber-600 shadow-xl border border-amber-100 group-hover:rotate-[15deg] transition-transform">
              <LinkIcon size={32} />
            </div>
            <div className="flex-1">
              <h5 className="font-black outfit text-2xl text-amber-900 leading-none tracking-tight">Kisan Credential</h5>
              <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mt-2 flex items-center gap-2">
                <Clock size={12} /> Active Sync Enabled
              </p>
            </div>
            <ChevronRight className="text-amber-300 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;