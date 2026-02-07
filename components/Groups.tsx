import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Plus,
  X,
  MessageSquare,
  Trophy,
  Globe,
  MapPin,
  Send,
  ArrowLeft,
  Zap,
  Sparkles,
  ChevronRight,
  Boxes,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Camera,
  Loader2,
  BrainCircuit,
  Crown,
  Medal,
  Activity,
  Heart,
  Target,
  ArrowUpRight,
  History
} from 'lucide-react';
import { Group, GroupMessage, GroupAccomplishment, Challenge } from '../types';
import { generateGroupChallenge } from '../services/geminiService';
import { getUserItem, setUserItem } from '../services/storageService';

const INITIAL_GROUPS: Group[] = [
  {
    id: 'g1',
    name: 'Punjab Wheat Masters',
    description: 'Expert advice for high-yield winter wheat in Punjab.',
    category: 'Crop',
    image: 'https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?auto=format&fit=crop&q=80&w=800',
    members: [{ name: 'Rajesh Kumar', role: 'Admin', points: 1200 }, { name: 'Amit Sharma', role: 'Member', points: 850 }],
    messages: [{ id: 'm1', sender: 'Amit Sharma', text: 'Has anyone started sowing?', timestamp: '10:00 AM' }],
    challenges: [{ id: 'c1', title: 'Perfect Sowing', description: 'Maintain 5cm depth.', rewardPoints: 200, type: 'other', deadline: 'Nov 1', status: 'active' }],
    accomplishments: [],
    totalPoints: 20500,
    consistencyDays: 14,
    perksUnlocked: ['Premium Seed Access'],
    stabilityFund: 4500
  },
  {
    id: 'g2',
    name: 'Kerala Coconut Collective',
    description: 'Sustainable coconut hub for coastal regions.',
    category: 'Region',
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&q=80&w=800',
    members: [{ name: 'Sajid Ali', role: 'Admin', points: 2100 }],
    messages: [],
    challenges: [],
    accomplishments: [],
    totalPoints: 12000,
    consistencyDays: 45,
    perksUnlocked: ['Export Support'],
    stabilityFund: 1200
  }
];

const HUB_SECTORS = [
  { id: 'my-groups', label: 'My Alliances', icon: Users, angle: 0 },
  { id: 'fund', label: 'Stability Fund', icon: Heart, angle: 60 },
  { id: 'global', label: 'Global Grid', icon: Trophy, angle: 120 },
  { id: 'tasks', label: 'Grid Missions', icon: Zap, angle: 180 },
  { id: 'genesis', label: 'Alliance Genesis', icon: Plus, angle: 240 },
];

const Groups: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = getUserItem('km_community_groups');
    return saved ? JSON.parse(saved) : INITIAL_GROUPS;
  });

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [activeSector, setActiveSector] = useState<string>('my-groups');
  const [isCreating, setIsCreating] = useState(false);

  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCat, setNewCat] = useState<'Crop' | 'Region' | 'Technique' | 'Livestock'>('Crop');

  const [viewMode, setViewMode] = useState<'chat' | 'challenges' | 'fund' | 'gallery'>('chat');
  const [chatInput, setChatInput] = useState('');
  const [isGeneratingChallenge, setIsGeneratingChallenge] = useState(false);
  const [donationAmount, setDonationAmount] = useState(100);

  useEffect(() => {
    setUserItem('km_community_groups', JSON.stringify(groups));
  }, [groups]);

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    const g: Group = {
      id: 'g' + Date.now(),
      name: newName,
      description: newDesc,
      category: newCat,
      image: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?auto=format&fit=crop&q=80&w=800`,
      members: [{ name: 'You', role: 'Admin', points: 0 }],
      messages: [],
      challenges: [],
      accomplishments: [],
      totalPoints: 0,
      consistencyDays: 1,
      perksUnlocked: [],
      stabilityFund: 0
    };
    setGroups([...groups, g]);
    setIsCreating(false);
    setActiveSector('my-groups');
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() || !selectedGroup) return;
    const newMsg: GroupMessage = {
      id: Date.now().toString(),
      sender: 'You',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updated = groups.map(g => g.id === selectedGroup.id ? { ...g, messages: [...(g.messages ?? []), newMsg] } : g);
    setGroups(updated);
    setSelectedGroup({ ...selectedGroup, messages: [...(selectedGroup.messages ?? []), newMsg] });
    setChatInput('');
  };

  const handleDonate = () => {
    if (!selectedGroup) return;
    const updated = groups.map(g => g.id === selectedGroup.id ? { ...g, stabilityFund: (g.stabilityFund ?? 0) + donationAmount } : g);
    setGroups(updated);
    setSelectedGroup({ ...selectedGroup, stabilityFund: (selectedGroup.stabilityFund ?? 0) + donationAmount });
    setDonationAmount(100);
  };

  const handleAiChallenge = async () => {
    if (!selectedGroup) return;
    setIsGeneratingChallenge(true);
    try {
      const challenge = await generateGroupChallenge(selectedGroup.name, selectedGroup.category);
      const newChallenge: Challenge = { ...challenge, id: 'c' + Date.now(), status: 'active' };
      const updated = groups.map(g => g.id === selectedGroup.id ? { ...g, challenges: [newChallenge, ...(g.challenges ?? [])] } : g);
      setGroups(updated);
      setSelectedGroup({ ...selectedGroup, challenges: [newChallenge, ...(selectedGroup.challenges ?? [])] });
    } catch (e) { console.error(e); } finally { setIsGeneratingChallenge(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 page-transition -m-4 md:-m-8 p-4 md:p-12 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-green-100 text-green-700 rounded-full font-black text-[10px] tracking-[0.4em] uppercase border border-green-200">
              <Sparkles size={14} className="animate-pulse" /> Community Grid
            </div>
            <h2 className="text-6xl font-black outfit tracking-tighter">Social Nexus</h2>
            <p className="text-slate-500 max-w-xl text-lg font-medium">Form an alliance, pool resources in the stability fund, and compete for global rank.</p>
          </div>
          <button onClick={() => { setIsCreating(true); setSelectedGroup(null); }} className="flex items-center gap-4 bg-green-600 text-white px-10 py-5 rounded-[2rem] font-black text-lg shadow-xl hover:bg-green-700 transition-all active:scale-95">
            <Plus size={24} /> INITIATE ALLIANCE
          </button>
        </div>

        {!selectedGroup && !isCreating && (
          <div className="flex flex-col items-center justify-center py-24 relative h-[600px]">
            {HUB_SECTORS.map((sector) => {
              const Icon = sector.icon;
              const radius = 240;
              const angleRad = (sector.angle - 90) * (Math.PI / 180);
              const x = Math.cos(angleRad) * radius;
              const y = Math.sin(angleRad) * radius;
              return (
                <button
                  key={sector.id}
                  onClick={() => { setActiveSector(sector.id); if (sector.id === 'genesis') setIsCreating(true); }}
                  className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 w-32 h-32 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 ${activeSector === sector.id ? 'bg-green-600 text-white shadow-2xl scale-110' : 'bg-white text-slate-400 border border-slate-200 shadow-sm hover:text-green-600'}`}
                  style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
                >
                  <Icon size={32} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{sector.label}</span>
                </button>
              );
            })}
            <div className="w-64 h-64 bg-white rounded-full flex items-center justify-center shadow-2xl border-8 border-slate-50 relative">
              <div className="text-center space-y-1">
                <div className="w-16 h-16 bg-green-50 rounded-3xl mx-auto flex items-center justify-center text-green-600 animate-float"><Users size={32} /></div>
                <p className="text-[10px] font-black text-green-700 uppercase tracking-widest mt-4">Active Sync</p>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-700 pb-24">
          {selectedGroup ? (
            <div className="space-y-10">
              <button onClick={() => setSelectedGroup(null)} className="flex items-center gap-3 text-slate-500 font-bold hover:text-green-600 group"><ArrowLeft size={20} /> Back to Nexus</button>
              <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col lg:flex-row h-[750px]">
                <div className="lg:w-80 bg-slate-900 text-white p-10 flex flex-col justify-between">
                  <div className="space-y-10 text-center lg:text-left">
                    <img src={selectedGroup.image} className="w-32 h-32 rounded-[2.5rem] border-4 border-slate-800 shadow-2xl mx-auto lg:mx-0 object-cover" alt="" />
                    <h3 className="text-3xl font-black outfit tracking-tighter leading-tight">{selectedGroup.name}</h3>
                    <nav className="space-y-2">
                      {[
                        { id: 'chat', label: 'Alliance Comms', icon: MessageSquare },
                        { id: 'challenges', label: 'Grid Missions', icon: Zap },
                        { id: 'fund', label: 'Stability Fund', icon: Heart }
                      ].map(item => (
                        <button key={item.id} onClick={() => setViewMode(item.id as any)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${viewMode === item.id ? 'bg-green-600' : 'text-slate-400 hover:bg-white/5'}`}><item.icon size={20} /> {item.label}</button>
                      ))}
                    </nav>
                  </div>
                  <div className="pt-10 border-t border-white/5 space-y-4">
                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest"><span>Fund Reserve</span><span className="text-amber-400">{selectedGroup.stabilityFund ?? 0} XP</span></div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-amber-500" style={{ width: '40%' }} /></div>
                  </div>
                </div>

                <div className="flex-1 p-12 flex flex-col relative overflow-y-auto custom-scrollbar">
                  {viewMode === 'chat' && (
                    <div className="flex flex-col h-full">
                      <div className="flex-1 space-y-8">{(selectedGroup.messages ?? []).map(m => <div key={m.id} className={`flex flex-col ${m.sender === 'You' ? 'items-end' : 'items-start'}`}><div className={`p-6 rounded-[1.8rem] ${m.sender === 'You' ? 'bg-green-50' : 'bg-slate-50'}`}>{m.text}</div></div>)}</div>
                      <div className="mt-10 relative"><input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} className="w-full bg-slate-50 border-none rounded-[2rem] px-8 py-6 outline-none" placeholder="Localized intel..." /><button onClick={handleSendMessage} className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 bg-green-600 text-white rounded-[1.5rem] flex items-center justify-center"><Send size={24} /></button></div>
                    </div>
                  )}
                  {viewMode === 'fund' && (
                    <div className="space-y-10">
                      <div className="p-10 bg-amber-50 rounded-[3rem] border-4 border-amber-100 flex items-center justify-between">
                        <div className="space-y-2">
                          <h4 className="text-4xl font-black text-amber-900 outfit tracking-tighter">Stability Fund Pool</h4>
                          <p className="text-amber-700 font-bold uppercase text-[10px] tracking-widest">Pool collective XP to unlock shared infrastructure</p>
                        </div>
                        <Heart size={64} className="text-amber-500 animate-pulse" />
                      </div>
                      <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 space-y-8">
                        <p className="text-center text-slate-500 font-bold uppercase tracking-widest">Contribute to the Alliance Stability</p>
                        <div className="flex items-center justify-center gap-6">
                          {[100, 500, 1000].map(amt => <button key={amt} onClick={() => setDonationAmount(amt)} className={`px-10 py-5 rounded-2xl font-black outfit text-2xl transition-all ${donationAmount === amt ? 'bg-amber-500 text-white shadow-xl scale-110' : 'bg-white border text-slate-400'}`}>{amt}</button>)}
                        </div>
                        <button onClick={handleDonate} className="w-full py-7 bg-slate-900 text-white rounded-[2.5rem] font-black text-2xl shadow-2xl hover:bg-green-600 transition-all active:scale-95">POOL {donationAmount} XP</button>
                      </div>
                    </div>
                  )}
                  {viewMode === 'challenges' && (
                    <div className="space-y-8">
                      <button onClick={handleAiChallenge} disabled={isGeneratingChallenge} className="w-full py-6 bg-slate-900 text-white rounded-[1.8rem] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-4 shadow-xl active:scale-95">{isGeneratingChallenge ? <Loader2 className="animate-spin" /> : <BrainCircuit size={20} className="text-green-400" />} Initiate Grid Mission</button>
                      <div className="grid grid-cols-1 gap-6">{(selectedGroup.challenges ?? []).map(c => <div key={c.id} className="p-8 bg-slate-50 rounded-[2.5rem] flex items-center justify-between"><div className="space-y-1"><p className="font-black text-xl outfit">{c.title}</p><p className="text-slate-500 text-sm">{c.description}</p></div><div className="text-right"><p className="text-amber-600 font-black text-xl">+{c.rewardPoints} XP</p><button className="mt-2 px-6 py-2 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase">Commit</button></div></div>)}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : isCreating ? (
            <div className="bg-white rounded-[4rem] p-12 shadow-2xl border border-slate-100 relative overflow-hidden">
              <div className="relative z-10 space-y-10">
                <div className="flex justify-between items-center"><h3 className="text-4xl font-black outfit tracking-tighter text-slate-800">Alliance Genesis</h3><button onClick={() => setIsCreating(false)} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors"><X size={24} /></button></div>
                <form onSubmit={handleCreateGroup} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Alliance Name</label><input required value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Northern Soil Coalition" className="w-full bg-slate-50 border-none rounded-[2rem] px-8 py-6 outline-none focus:ring-4 focus:ring-green-500/10 font-black text-2xl outfit" /></div>
                  <div className="space-y-4"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Category</label><select value={newCat} onChange={e => setNewCat(e.target.value as any)} className="w-full bg-slate-50 border-none rounded-[2rem] px-8 py-6 outline-none font-bold text-xl outfit appearance-none"><option value="Crop">Crop Based</option><option value="Region">Regional Hub</option><option value="Livestock">Livestock/Poultry</option></select></div>
                  <div className="md:col-span-2 space-y-4"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Mission Oath</label><textarea required value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Shared goals for all operatives..." className="w-full bg-slate-50 border-none rounded-[2rem] px-8 py-6 outline-none focus:ring-4 focus:ring-green-500/10 min-h-[150px]" /></div>
                  <button type="submit" className="md:col-span-2 bg-slate-900 text-white py-8 rounded-[2.5rem] font-black text-2xl flex items-center justify-center gap-4 hover:bg-green-600 transition-all active:scale-95">ACTIVATE NODE</button>
                </form>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {activeSector === 'global' ? (
                <div className="col-span-full bg-white rounded-[4rem] border p-12 space-y-10 shadow-2xl">
                  <div className="flex items-center gap-6"><Trophy size={48} className="text-amber-500" /><h3 className="text-4xl font-black outfit tracking-tighter">Stability Grid Rankings</h3></div>
                  <table className="w-full text-left">
                    <thead><tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b"><th className="px-8 py-6">Rank</th><th className="px-8 py-6">Alliance</th><th className="px-8 py-6 text-right">Stability (XP)</th></tr></thead>
                    <tbody className="divide-y">{groups.sort((a, b) => (b.totalPoints ?? 0) - (a.totalPoints ?? 0)).map((g, i) => <tr key={g.id} className="hover:bg-slate-50 transition-colors"><td className="px-8 py-8"><span className="text-2xl font-black outfit text-slate-300">#{i + 1}</span></td><td className="px-8 py-8"><div className="flex items-center gap-4"><img src={g.image} className="w-12 h-12 rounded-xl object-cover" alt="" /><div><p className="font-black text-lg outfit">{g.name}</p><p className="text-[10px] text-slate-400 font-bold uppercase">{g.category}</p></div></div></td><td className="px-8 py-8 text-right font-black text-green-600 outfit text-xl">{(g.totalPoints ?? 0).toLocaleString()}</td></tr>)}</tbody>
                  </table>
                </div>
              ) : groups.map(g => (
                <div key={g.id} onClick={() => { setSelectedGroup(g); setViewMode('chat'); }} className="group bg-white border border-slate-200 rounded-[3.5rem] p-10 hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-6"><div className="w-20 h-20 rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-xl"><img src={g.image} className="w-full h-full object-cover" alt="" /></div><div><h4 className="text-3xl font-black outfit tracking-tighter text-slate-800">{g.name}</h4><p className="text-[10px] font-black text-green-600 uppercase tracking-widest">{(g.members?.length ?? 0)} Operatives</p></div></div>
                    <div className="p-4 bg-green-50 text-green-600 rounded-2xl group-hover:bg-green-600 group-hover:text-white transition-all"><ChevronRight /></div>
                  </div>
                  <p className="mt-8 text-slate-500 text-lg leading-relaxed line-clamp-2 italic">"{g.description}"</p>
                  <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between"><div className="flex -space-x-3">{[1, 2, 3].map(i => <img key={i} src={`https://picsum.photos/seed/${i + g.id}/100`} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" alt="" />)}<div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-black text-slate-400">+9</div></div><div className="flex items-center gap-2 text-amber-600 font-black outfit"><Zap size={14} fill="currentColor" /> {(g.totalPoints ?? 0).toLocaleString()} XP</div></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Groups;