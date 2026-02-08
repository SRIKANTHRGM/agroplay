
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Sprout, Loader2, X, Star, Zap, Sparkles, BrainCircuit, Droplets, Wind, Calendar } from 'lucide-react';
import { Crop, CULTIVATION_LIBRARY, UserCultivationJourney, UserProfile } from '../types';
import { generateJourneySummary, generateCropImage, generateCropMetadata } from '../services/geminiService';

interface Props {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const NewJourney: React.FC<Props> = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);

  const categories = Array.from(new Set(CULTIVATION_LIBRARY.map(c => c.category)));

  const filteredCrops = CULTIVATION_LIBRARY.filter(crop =>
    crop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const checkAndStartJourney = async (crop: Crop) => {
    // Check if journey already exists
    const savedJourneys = localStorage.getItem(`km_journeys_${user.uid}`);
    if (savedJourneys) {
      const journeys: UserCultivationJourney[] = JSON.parse(savedJourneys);
      const active = journeys.find(j => j.cropId === crop.id && j.status === 'active');
      if (active) {
        navigate(`/learn/${active.id}`);
        return;
      }
    }

    setSelectedCrop(crop);
    setIsConfirmOpen(true);
    setLoadingSummary(true);
    try {
      const aiSummary = await generateJourneySummary(crop.name);
      setSummary(aiSummary);
    } catch (error) {
      setSummary("Expert cultivation roadmap ready for deployment.");
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleConfirmStart = async () => {
    if (!selectedCrop) return;

    const newJourney: UserCultivationJourney = {
      id: `j-${Date.now()}`,
      cropId: selectedCrop.id,
      cropName: selectedCrop.name,
      startDate: new Date().toISOString(),
      status: 'active',
      currentStepIndex: 0,
      healthScore: 100,
      steps: selectedCrop.workflow?.map(s => ({ stepId: s.id, verified: false })) || []
    };

    const savedJourneys = localStorage.getItem(`km_journeys_${user.uid}`);
    const journeys = savedJourneys ? JSON.parse(savedJourneys) : [];
    localStorage.setItem(`km_journeys_${user.uid}`, JSON.stringify([...journeys, newJourney]));

    navigate(`/learn/${newJourney.id}`);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="relative h-64 rounded-[3.5rem] overflow-hidden shadow-2xl bg-green-800 border-8 border-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900 via-green-900/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
          <div className="flex items-center gap-3 px-4 py-1.5 bg-white/20 rounded-full w-fit mb-4 backdrop-blur-md border border-white/10">
            <Zap size={14} className="text-amber-400" fill="currentColor" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">CULTIVATION LAB v4.0</span>
          </div>
          <h1 className="text-6xl font-black outfit tracking-tighter">New Mission</h1>
          <p className="text-green-50/80 mt-2 max-w-lg font-medium text-lg">Architect a precise cultivation journey from seed to surplus.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-500 transition-colors" size={24} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crop archives..."
            className="w-full pl-16 pr-8 py-7 bg-white border-none rounded-[2.5rem] shadow-xl shadow-slate-200/50 text-xl outfit focus:ring-4 focus:ring-green-500/10 transition-all font-bold placeholder:text-slate-300 shadow-inner"
          />
        </div>

        <div className="space-y-12">
          {categories.map(category => {
            const categoryCrops = filteredCrops.filter(c => c.category === category);
            if (categoryCrops.length === 0) return null;

            return (
              <div key={category} className="space-y-8">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-3xl font-black text-slate-800 outfit tracking-tighter">{category}</h3>
                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">{categoryCrops.length} VARIETIES</span>
                  </div>
                  <div className="h-0.5 flex-1 bg-slate-200 mx-6 rounded-full opacity-30" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {categoryCrops.map(crop => (
                    <button
                      key={crop.id}
                      onClick={() => checkAndStartJourney(crop)}
                      className="group relative aspect-[3/4] rounded-[3rem] overflow-hidden shadow-xl border-4 border-white hover:border-green-400 transition-all duration-700 hover:-translate-y-3"
                    >
                      <img src={crop.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt={crop.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90" />

                      <div className="absolute top-5 right-5">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/20">
                          {crop.season === 'Rabi' ? <Calendar size={18} /> : <Zap size={18} />}
                        </div>
                      </div>

                      <div className="absolute inset-x-0 bottom-0 p-8 text-left space-y-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <p className="text-white font-black text-2xl outfit tracking-tighter leading-none">{crop.name}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">{crop.season} Cycle</span>
                          <div className="w-1 h-1 bg-white/30 rounded-full" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{crop.workflow?.length} Phases</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isConfirmOpen && selectedCrop && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] md:rounded-[4rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 relative border-4 md:border-8 border-white max-h-[90vh]">
            <div className="relative h-48 md:h-64 overflow-hidden shrink-0">
              <img src={selectedCrop.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={selectedCrop.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="absolute top-4 md:top-8 right-4 md:right-8 p-3 md:p-4 bg-white/30 backdrop-blur-md hover:bg-white/50 text-white rounded-xl md:rounded-[1.5rem] transition-all"
              >
                <X size={20} className="md:w-6 md:h-6" />
              </button>
            </div>

            <div className="p-6 md:p-12 -mt-8 md:-mt-12 relative bg-white rounded-t-[2.5rem] md:rounded-t-[3.5rem] space-y-6 md:space-y-10 overflow-y-auto custom-scrollbar shrink">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-3xl md:text-5xl font-black text-slate-800 outfit tracking-tighter leading-none">{selectedCrop.name}</h3>
                  <p className="text-[10px] md:text-[11px] font-black text-green-600 uppercase tracking-[0.3em]">{selectedCrop.season} Season • {selectedCrop.workflow?.length} Steps</p>
                </div>
                <div className="w-12 h-12 md:w-16 md:h-16 bg-green-50 rounded-xl md:rounded-[1.5rem] flex items-center justify-center text-green-600 shadow-inner">
                  <Sprout size={24} className="md:w-8 md:h-8" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 md:gap-6">
                <div className="bg-slate-50 p-3 md:p-5 rounded-2xl md:rounded-3xl border border-slate-100 flex flex-col items-center gap-1 md:gap-2">
                  <Droplets size={18} className="text-blue-500 md:w-6 md:h-6" />
                  <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Water</p>
                  <p className="font-bold text-slate-700 text-xs md:text-base">{selectedCrop.waterRequirement}</p>
                </div>
                <div className="bg-slate-50 p-3 md:p-5 rounded-2xl md:rounded-3xl border border-slate-100 flex flex-col items-center gap-1 md:gap-2">
                  <Wind size={18} className="text-green-500 md:w-6 md:h-6" />
                  <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Soil</p>
                  <p className="font-bold text-slate-700 text-xs md:text-base truncate w-full text-center">{selectedCrop.soilSuitability[0]}</p>
                </div>
                <div className="bg-slate-50 p-3 md:p-5 rounded-2xl md:rounded-3xl border border-slate-100 flex flex-col items-center gap-1 md:gap-2">
                  <Zap size={18} className="text-amber-500 md:w-6 md:h-6" />
                  <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Bonus</p>
                  <p className="font-bold text-slate-700 text-xs md:text-base">+12% XP</p>
                </div>
              </div>

              <div className="bg-green-50 p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border-2 border-green-100 shadow-inner relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform duration-1000"><BrainCircuit size={100} /></div>
                {loadingSummary ? (
                  <div className="flex flex-col items-center gap-4 py-4">
                    <Loader2 className="animate-spin text-green-600" size={32} />
                    <p className="text-[10px] text-green-600 font-black uppercase tracking-widest">Architecting Roadmap...</p>
                  </div>
                ) : (
                  <div className="space-y-4 relative z-10">
                    <p className="text-green-800 text-base md:text-lg leading-relaxed font-bold italic text-center">"{summary}"</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="p-6 md:p-8 bg-white border-t border-slate-100 flex flex-col md:flex-row gap-3 md:gap-6 shrink-0">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="flex-1 py-4 md:py-6 bg-slate-100 rounded-xl md:rounded-[2rem] font-black text-[10px] md:text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStart}
                className="flex-[2] py-4 md:py-6 bg-green-600 text-white rounded-xl md:rounded-[2rem] font-black text-[10px] md:text-xs uppercase tracking-[0.3em] hover:bg-green-700 shadow-2xl shadow-green-100 transition-all flex items-center justify-center gap-3 md:gap-4 active:scale-95 group/btn"
              >
                <Zap size={18} fill="currentColor" className="group-hover/btn:animate-pulse" />
                Initiate Journey
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewJourney;
