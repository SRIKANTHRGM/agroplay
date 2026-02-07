import React, { useState } from 'react';
import { 
  Award, 
  Search, 
  Filter, 
  ExternalLink, 
  Info, 
  X, 
  Landmark, 
  Zap, 
  Trophy, 
  CheckCircle2, 
  ChevronRight,
  ShoppingCart,
  Wheat,
  Tractor,
  Droplets,
  Star,
  Boxes,
  Cpu,
  Monitor
} from 'lucide-react';
import { UserProfile, Subsidy, RewardItem, MOCK_SUBSIDIES, MOCK_REWARDS } from '../types';

interface Props {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const Subsidies: React.FC<Props> = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState<'schemes' | 'rewards'>('schemes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubsidy, setSelectedSubsidy] = useState<Subsidy | null>(null);
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [filterState, setFilterState] = useState('All');
  const [toast, setToast] = useState<string | null>(null);

  const filteredSchemes = MOCK_SUBSIDIES.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = filterState === 'All' || s.state.includes(filterState);
    return matchesSearch && matchesState;
  });

  const handleRedeem = (reward: RewardItem) => {
    if (user.points < reward.pointsPrice) return;
    setUser(prev => ({ ...prev, points: prev.points - reward.pointsPrice }));
    setToast(`Redeemed ${reward.name} successfully! Check your inventory.`);
    setSelectedReward(null);
    setTimeout(() => setToast(null), 3000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Crops': return <Wheat size={20} />;
      case 'Machinery': return <Tractor size={20} />;
      case 'Water': return <Droplets size={20} />;
      default: return <Landmark size={20} />;
    }
  };

  const getRewardCategoryIcon = (category?: string) => {
    switch (category) {
      case 'Inventory': return <Boxes size={14} />;
      case 'Virtual': return <Monitor size={14} />;
      case 'Tech': return <Cpu size={14} />;
      case 'Experience': return <Star size={14} />;
      default: return <Trophy size={14} />;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 relative">
      {toast && (
        <div className="fixed top-20 right-10 z-[200] bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10">
          <CheckCircle2 size={24} />
          <p className="font-bold outfit">{toast}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 outfit tracking-tight">Grants & Perks</h2>
          <p className="text-slate-500 text-lg">Financial support for your real farm and rewards for your progress.</p>
        </div>
        <div className="flex p-1 bg-slate-200/50 rounded-[1.5rem] w-fit shrink-0">
          <button
            onClick={() => setActiveTab('schemes')}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'schemes' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Landmark size={18} /> Govt Schemes
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'rewards' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Trophy size={18} /> App Rewards
          </button>
        </div>
      </div>

      {activeTab === 'schemes' ? (
        <div className="space-y-8">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search by scheme name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-green-500 transition-all font-medium outfit"
              />
            </div>
            <div className="flex items-center gap-3 bg-white px-6 py-2 rounded-2xl border border-slate-100 shadow-sm">
              <Filter className="text-slate-400" size={18} />
              <select 
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer"
              >
                <option value="All">All Regions</option>
                <option value="Central">Central Govt</option>
                <option value="Punjab">Punjab</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
              </select>
            </div>
          </div>

          {/* Schemes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchemes.map(scheme => (
              <div 
                key={scheme.id}
                onClick={() => setSelectedSubsidy(scheme)}
                className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                    {getCategoryIcon(scheme.category)}
                  </div>
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-widest">{scheme.state}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 outfit mb-3 group-hover:text-green-600 transition-colors">{scheme.name}</h3>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 flex-1">{scheme.description}</p>
                <div className="mt-8 flex items-center justify-between text-green-600 font-bold text-sm">
                  View Eligibility <ChevronRight size={18} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-amber-50 p-8 rounded-[3rem] border border-amber-100 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
              <Zap size={200} />
            </div>
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 bg-amber-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-amber-200 animate-float">
                <Zap size={32} fill="currentColor" />
              </div>
              <div>
                <p className="text-xs text-amber-600 font-black uppercase tracking-[0.2em] mb-1">XP Wallet Standing</p>
                <p className="text-5xl font-black text-amber-700 outfit tabular-nums">{user.points} <span className="text-xl opacity-60">XP</span></p>
              </div>
            </div>
            <div className="max-w-md text-center md:text-right relative z-10">
              <h4 className="text-amber-900 font-black outfit text-lg uppercase tracking-tight">Earning Protocol Active</h4>
              <p className="text-amber-800/60 font-medium text-sm leading-relaxed mt-1">Convert your Hard-Earned Mastery XP into high-fidelity agricultural tech, rare seeds, and professional consulting sessions.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {MOCK_REWARDS.map(reward => (
              <div key={reward.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-2xl transition-all relative">
                <div className="h-56 relative overflow-hidden">
                  <img src={reward.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" alt={reward.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-xl text-[9px] font-black text-slate-800 uppercase tracking-widest border border-white/20 shadow-xl flex items-center gap-2">
                       {getRewardCategoryIcon(reward.category)}
                       {reward.category || 'General'}
                    </span>
                  </div>
                </div>
                <div className="p-8 space-y-6 flex-1 flex flex-col">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-slate-800 outfit leading-none group-hover:text-amber-600 transition-colors">{reward.name}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium line-clamp-3">"{reward.description}"</p>
                  </div>
                  <div className="pt-6 mt-auto border-t border-slate-50 flex items-center justify-between">
                    <div className="flex flex-col">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mastery Price</p>
                       <p className="text-2xl font-black text-amber-600 outfit tabular-nums">{reward.pointsPrice} <span className="text-xs font-bold uppercase">XP</span></p>
                    </div>
                    <button 
                      onClick={() => setSelectedReward(reward)}
                      disabled={user.points < reward.pointsPrice}
                      className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center hover:bg-amber-600 transition-all shadow-xl shadow-amber-100 disabled:opacity-30 active:scale-95 group/btn"
                    >
                      <ShoppingCart size={24} className="group-hover/btn:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
                {user.points < reward.pointsPrice && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-slate-900 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Needs {reward.pointsPrice - user.points} more XP</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subsidy Detail Modal */}
      {selectedSubsidy && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b bg-slate-50 flex justify-between items-start">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-green-600 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-green-100">
                  {getCategoryIcon(selectedSubsidy.category)}
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-slate-800 outfit leading-tight">{selectedSubsidy.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-widest">{selectedSubsidy.state}</span>
                    <span className="px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-widest">{selectedSubsidy.category}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedSubsidy(null)} className="p-3 hover:bg-slate-200 rounded-2xl transition-all text-slate-400">
                <X size={28} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Info size={16} /> Eligibility
                  </h4>
                  <p className="text-slate-600 leading-relaxed font-medium">{selectedSubsidy.eligibility}</p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Award size={16} /> Benefits
                  </h4>
                  <p className="text-slate-600 leading-relaxed font-medium">{selectedSubsidy.benefits}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Application Process</h4>
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 border-dashed text-slate-700 leading-relaxed italic">
                  "{selectedSubsidy.process}"
                </div>
              </div>
            </div>

            <div className="p-10 border-t bg-slate-50 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Always verify on official portals</p>
              <a 
                href={selectedSubsidy.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl"
              >
                Official Apply Portal <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Reward Redemption Modal */}
      {selectedReward && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[4rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden p-12 text-center space-y-10 animate-in zoom-in-95 duration-300 relative border-8 border-white">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500" />
            <div className="w-28 h-28 bg-amber-50 text-amber-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner border-2 border-amber-100 animate-float">
              <ShoppingCart size={56} />
            </div>
            <div className="space-y-4">
              <h3 className="text-4xl font-black text-slate-800 outfit tracking-tighter">Confirm Transaction</h3>
              <p className="text-slate-500 font-medium text-lg leading-relaxed px-4">
                 Deduct <span className="font-black text-amber-600 text-2xl outfit">{selectedReward.pointsPrice} XP</span> from your account to unlock <span className="font-black text-slate-800 outfit">{selectedReward.name}</span>?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <button 
                onClick={() => setSelectedReward(null)}
                className="py-5 border-4 border-slate-50 bg-slate-50 hover:bg-slate-100 hover:border-slate-100 rounded-3xl font-black text-slate-500 transition-all uppercase text-xs tracking-widest active:scale-95"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleRedeem(selectedReward)}
                className="py-5 bg-amber-500 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-amber-600 transition-all shadow-2xl shadow-amber-200 active:scale-95"
              >
                DEPLOY POINTS
              </button>
            </div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">Transaction verified by AgroPlay Cloud</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subsidies;