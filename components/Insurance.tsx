import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  X, 
  ExternalLink, 
  Info, 
  ChevronRight, 
  CheckCircle2, 
  CloudRain, 
  Zap, 
  AlertCircle,
  Landmark,
  FileText,
  BadgeCheck,
  Building2
} from 'lucide-react';
import { InsuranceScheme, MOCK_INSURANCE } from '../types';

const Insurance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Gov' | 'App'>('Gov');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScheme, setSelectedScheme] = useState<InsuranceScheme | null>(null);

  const filteredSchemes = MOCK_INSURANCE.filter(s => {
    const matchesTab = activeTab === 'Gov' ? s.type === 'Government' : s.type === 'App-Based';
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.coverage.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.agency?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 outfit tracking-tight">Farm Protection Hub</h2>
          <p className="text-slate-500 text-lg">Official government insurance portfolios and smart app-based coverage.</p>
        </div>
        <div className="flex p-1 bg-slate-200/50 rounded-[1.5rem] w-fit">
          <button
            onClick={() => setActiveTab('Gov')}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'Gov' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Landmark size={18} /> Government Portfolios
          </button>
          <button
            onClick={() => setActiveTab('App')}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'App' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Zap size={18} /> Smart In-App Coverage
          </button>
        </div>
      </div>

      {/* Info Alert */}
      <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 flex items-start gap-6 text-blue-800 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 transition-transform group-hover:scale-110">
          <ShieldCheck size={120} />
        </div>
        <div className="w-14 h-14 bg-white rounded-[1.2rem] flex items-center justify-center shadow-sm flex-shrink-0 relative z-10">
          <Info size={28} className="text-blue-600" />
        </div>
        <div className="space-y-2 relative z-10">
          <p className="font-black outfit text-2xl tracking-tight">Strategic Coverage Intelligence</p>
          <p className="text-lg opacity-80 leading-relaxed font-medium">Our AI monitors your active crop journeys. When a module qualifies for a government scheme (like PMFBY), you will receive an immediate <span className="font-bold text-blue-900 underline decoration-blue-300">Eligibility Alert</span>.</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-2xl group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={24} />
        <input 
          type="text" 
          placeholder="Search by crop, coverage, or agency..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-16 pr-6 py-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 focus:ring-4 focus:ring-blue-500/10 transition-all text-xl outfit font-medium placeholder:text-slate-300"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredSchemes.map(scheme => (
          <div 
            key={scheme.id}
            onClick={() => setSelectedScheme(scheme)}
            className="group bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all cursor-pointer flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-700">
              <Landmark size={200} />
            </div>
            
            <div className="relative z-10 space-y-8 h-full flex flex-col">
              <div className="flex justify-between items-start">
                <div className={`w-20 h-20 rounded-[1.8rem] flex items-center justify-center shadow-inner ${scheme.type === 'Government' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                  {scheme.name.includes('Weather') ? <CloudRain size={40} /> : <ShieldCheck size={40} />}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${scheme.type === 'Government' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
                    {scheme.agency || 'Authorized'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3 flex-1">
                <h3 className="text-4xl font-black text-slate-800 outfit tracking-tighter leading-tight group-hover:text-blue-600 transition-colors">{scheme.name}</h3>
                <p className="text-slate-500 text-lg leading-relaxed line-clamp-3 font-medium">{scheme.coverage}</p>
              </div>

              <div className="pt-8 grid grid-cols-2 gap-8 border-t border-slate-50">
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Fixed Premium</p>
                  <p className="text-xl font-black text-slate-700 outfit">{scheme.premium}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Asset Class</p>
                  <p className="text-xl font-black text-slate-700 outfit">{scheme.type}</p>
                </div>
              </div>

              <div className="pt-6 flex items-center justify-between text-blue-600 font-black text-sm uppercase tracking-widest">
                <span>View Critical Intel</span>
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                   <ChevronRight size={20} />
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredSchemes.length === 0 && (
          <div className="col-span-full py-32 text-center space-y-6 bg-slate-100/50 rounded-[4rem] border-4 border-dashed border-slate-200 animate-pulse">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto text-slate-300 shadow-inner">
              <Search size={48} />
            </div>
            <div>
              <p className="text-slate-500 font-black outfit text-3xl tracking-tight">No intelligence matches.</p>
              <p className="text-slate-400 text-lg font-medium mt-1">Try searching for broader terms like "Rice" or "Central".</p>
            </div>
          </div>
        )}
      </div>

      {/* Insurance Detail Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-white w-full max-w-5xl rounded-[4rem] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-500 border border-white/20">
            <div className="p-12 border-b bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex justify-between items-start relative">
              <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                 <Building2 size={240} />
              </div>
              <div className="flex items-center gap-8 relative z-10">
                <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[2.2rem] flex items-center justify-center shadow-2xl border border-white/20 animate-float">
                  <ShieldCheck size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-5xl font-black outfit tracking-tighter leading-none">{selectedScheme.name}</h3>
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
                        <Landmark size={14} /> Official Government Scheme
                     </div>
                     <span className="w-2 h-2 bg-blue-400 rounded-full" />
                     <p className="text-blue-100 font-bold text-sm uppercase tracking-widest">{selectedScheme.agency || 'Nodal Ministry Approval'}</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedScheme(null)} className="p-5 bg-white/10 hover:bg-white/20 rounded-[1.8rem] transition-all text-white border border-white/10 group relative z-10">
                <X size={32} className="group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-16 space-y-16 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-blue-600">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center"><FileText size={20} /></div>
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Coverage Mandate</h4>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-2xl font-bold outfit">"{selectedScheme.coverage}"</p>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-amber-500">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center"><Zap size={20} /></div>
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Standardized Premium</h4>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-2xl font-bold outfit">{selectedScheme.premium}</p>
                </div>
              </div>

              <div className="p-12 bg-slate-50 rounded-[3.5rem] border border-slate-100 flex flex-col xl:flex-row gap-16 shadow-inner relative overflow-hidden">
                <div className="absolute -bottom-10 -left-10 opacity-[0.03]"><BadgeCheck size={200} /></div>
                <div className="flex-1 space-y-6 relative z-10">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Enrollment Eligibility</h4>
                   </div>
                   <p className="text-lg text-slate-600 leading-relaxed font-bold italic">"{selectedScheme.eligibility}"</p>
                </div>
                <div className="w-px bg-slate-200 hidden xl:block" />
                <div className="flex-1 space-y-8 relative z-10">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Applicable Asset Classes</h4>
                   </div>
                   <div className="flex flex-wrap gap-3">
                      {selectedScheme.eligibleCrops.map((crop, i) => (
                        <span key={i} className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-700 shadow-sm hover:border-blue-200 transition-colors">{crop}</span>
                      ))}
                   </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="text-2xl font-black text-slate-800 outfit tracking-tight uppercase tracking-widest">Official Claim Lifecycle</h4>
                </div>
                <div className="p-10 bg-white border-2 border-slate-100 rounded-[3rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)] text-slate-600 leading-relaxed italic text-2xl font-medium">
                  "{selectedScheme.claimProcess}"
                </div>
              </div>

              <div className="bg-amber-50 p-10 rounded-[3rem] border border-amber-100 flex items-start gap-8">
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-amber-500 shadow-sm flex-shrink-0">
                  <AlertCircle size={32} />
                </div>
                <div className="space-y-2">
                   <p className="text-xl font-black text-amber-900 outfit tracking-tight">Important Policy Notice</p>
                   <p className="text-lg text-amber-800/70 font-medium leading-relaxed">It is mandatory to provide notification of loss within <span className="font-bold text-amber-900 underline">72 hours</span> of the calamity to ensure valid claim processing through designated government portals.</p>
                </div>
              </div>
            </div>

            <div className="p-12 border-t bg-slate-50 flex flex-col md:flex-row gap-8 items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_12px_#22c55e]" />
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Neural Verification Link Established</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
                 <button onClick={() => setSelectedScheme(null)} className="px-10 py-5 bg-white border-2 border-slate-200 text-slate-600 rounded-[1.8rem] font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all">Close Portfolio</button>
                 <a 
                  href={selectedScheme.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-12 py-5 bg-slate-900 text-white rounded-[1.8rem] font-black text-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-4 shadow-2xl hover:scale-[1.03] active:scale-95 group/btn"
                 >
                    VISIT OFFICIAL PORTAL 
                    <ExternalLink size={24} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                 </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insurance;