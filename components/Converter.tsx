
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, RefreshCw, ChevronRight, CheckCircle2, Star, Loader2, Sparkles, AlertCircle, ShoppingBag, Package, ArrowRight, PlayCircle, X, Info, Layers } from 'lucide-react';
import { UserProfile, MOCK_SURPLUS, CONVERSION_RECIPES, SurplusCrop, ConversionRecipe } from '../types';

interface Props {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const Converter: React.FC<Props> = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCrop, setSelectedCrop] = useState<SurplusCrop | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<ConversionRecipe | null>(null);
  const [isProducing, setIsProducing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('verified') === 'true') {
      const cropId = searchParams.get('cropId');
      const recipeId = searchParams.get('recipeId');
      
      const crop = MOCK_SURPLUS.find(c => c.id === cropId);
      if (crop) {
        setSelectedCrop(crop);
        const recipe = CONVERSION_RECIPES[crop.name]?.find(r => r.id === recipeId);
        if (recipe) {
          setSelectedRecipe(recipe);
          startProduction();
        }
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [location.search]);

  const startProduction = () => {
    setIsProducing(true);
    setProgress(0);
    
    timerRef.current = window.setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  useEffect(() => {
    if (progress === 100 && isProducing && selectedRecipe) {
      handleFinish(selectedRecipe);
    }
  }, [progress, isProducing, selectedRecipe]);

  const handleFinish = (recipe: ConversionRecipe) => {
    setUser(prev => ({
      ...prev,
      points: prev.points + recipe.rewardPoints
    }));
    setFinished(true);
    setIsProducing(false);
  };

  const handleStartVerification = () => {
    if (!selectedCrop || !selectedRecipe) return;
    navigate(`/converter/verify?cropId=${selectedCrop.id}&recipeId=${selectedRecipe.id}`);
  };

  const reset = () => {
    setSelectedCrop(null);
    setSelectedRecipe(null);
    setFinished(false);
    setProgress(0);
    setShowVideoPreview(false);
    navigate('/converter', { replace: true });
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-amber-100 text-amber-700 rounded-full font-black text-[10px] tracking-widest uppercase border border-amber-200 mb-2">
          <Sparkles size={14} className="animate-pulse" /> Revenue Expansion Lab
        </div>
        <h2 className="text-5xl font-black text-slate-800 outfit tracking-tighter leading-none">Value Addition Hub</h2>
        <p className="text-slate-500 max-w-xl mx-auto text-xl font-medium">Transform surplus harvest into elite preserved commodities and earn network XP.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Step 1: Select Crop */}
        <div className={`lg:col-span-4 space-y-6 ${isProducing || finished ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
          <div className="flex items-center justify-between px-2">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg">1</div>
               <h3 className="text-2xl font-black text-slate-800 outfit tracking-tight">Available Surplus</h3>
             </div>
          </div>
          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
            {MOCK_SURPLUS.map(crop => (
              <button
                key={crop.id}
                onClick={() => {
                  setSelectedCrop(crop);
                  setSelectedRecipe(null);
                }}
                className={`w-full p-6 rounded-[2.5rem] border-4 transition-all text-left flex items-center gap-5 group shadow-sm ${
                  selectedCrop?.id === crop.id 
                    ? 'bg-green-600 text-white border-green-500 shadow-xl scale-[1.02]' 
                    : 'bg-white border-white hover:border-green-100 hover:bg-green-50/30'
                }`}
              >
                <div className="w-20 h-20 rounded-[1.8rem] overflow-hidden flex-shrink-0 shadow-2xl border-4 border-white/20">
                  <img src={crop.image} className="w-full h-full object-cover" alt={crop.name} />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-black text-2xl leading-none outfit">{crop.name}</p>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit ${selectedCrop?.id === crop.id ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
                    {crop.quantity} {crop.unit} In Stock
                  </div>
                </div>
                {selectedCrop?.id === crop.id && <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-in zoom-in"><CheckCircle2 size={24} /></div>}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Select Product & Production */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className={`space-y-6 ${isProducing || finished || !selectedCrop ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg">2</div>
              <h3 className="text-2xl font-black text-slate-800 outfit tracking-tight">Preservation Path</h3>
            </div>
            <div className="space-y-4 min-h-[300px]">
              {!selectedCrop ? (
                <div className="bg-white rounded-[3rem] p-12 border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-center space-y-6 h-full shadow-inner">
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200"><Box size={48} /></div>
                  <p className="text-lg font-bold text-slate-400 outfit leading-relaxed">Select a surplus source<br/>to calculate conversions</p>
                </div>
              ) : (
                CONVERSION_RECIPES[selectedCrop.name]?.map(recipe => (
                  <div 
                    key={recipe.id}
                    className={`w-full p-8 rounded-[3rem] border-4 transition-all text-left flex flex-col gap-6 group shadow-sm ${
                      selectedRecipe?.id === recipe.id ? 'bg-white border-amber-400 ring-4 ring-amber-50 shadow-2xl' : 'bg-white border-white hover:bg-amber-50/30'
                    }`}
                    onClick={() => setSelectedRecipe(recipe)}
                  >
                    <div className="flex justify-between items-start cursor-pointer">
                      <div className="space-y-1">
                         <h4 className={`font-black text-2xl leading-none outfit tracking-tight ${selectedRecipe?.id === recipe.id ? 'text-amber-600' : 'text-slate-800'}`}>{recipe.productName}</h4>
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Preservation Grade: A+</p>
                      </div>
                      <div className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-xl flex items-center gap-2 text-xs font-black outfit shadow-sm">
                        <Star size={14} fill="currentColor" /> +{recipe.rewardPoints} XP
                      </div>
                    </div>
                    
                    <p className="text-sm leading-relaxed font-medium text-slate-500 italic">
                      "{recipe.description}"
                    </p>

                    {selectedRecipe?.id === recipe.id && (
                      <div className="flex flex-col gap-3 animate-in slide-in-from-top-2 duration-300">
                        {recipe.videoUrl && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); setShowVideoPreview(true); }}
                            className="w-full flex items-center justify-center gap-3 py-4 bg-amber-50 text-amber-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-100 transition-all border-2 border-amber-200/50"
                          >
                            <PlayCircle size={18} /> Watch Video Tutorial
                          </button>
                        )}
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleStartVerification(); }}
                          className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl transform active:scale-95"
                        >
                          <CheckCircle2 size={18} /> Start Process
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Factory Display */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg">3</div>
              <h3 className="text-2xl font-black text-slate-800 outfit tracking-tight">Active Line</h3>
            </div>
            
            <div className="bg-white rounded-[4rem] p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 h-[600px] flex flex-col items-center justify-center text-center relative overflow-hidden group">
              {isProducing ? (
                <div className="space-y-10 w-full animate-in zoom-in-95 duration-500">
                  <div className="relative w-56 h-56 mx-auto">
                     <div className="absolute inset-0 bg-amber-500/10 rounded-full animate-ping" />
                     <div className="absolute inset-0 border-4 border-amber-500/20 border-dashed rounded-full animate-[spin_10s_linear_infinite]" />
                     <div className="absolute inset-4 border-2 border-green-500/20 rounded-full animate-[spin_5s_linear_infinite_reverse]" />
                     <div className="relative w-44 h-44 bg-white rounded-full shadow-2xl flex items-center justify-center text-amber-600 m-6 border-4 border-amber-50/50">
                        <RefreshCw size={80} className="animate-spin text-amber-500" />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                          <Layers size={100} />
                        </div>
                     </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h4 className="text-4xl font-black text-slate-800 outfit tracking-tighter">Synthesizing...</h4>
                      <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em]">Batch #409-A Process Optimization</p>
                    </div>
                    <div className="w-full max-w-xs mx-auto space-y-4">
                      <div className="relative w-full h-4 bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner border border-slate-200/50">
                        <div className="h-full bg-gradient-to-r from-amber-500 via-green-500 to-emerald-400 rounded-full transition-all duration-100 shadow-[0_0_15px_rgba(34,197,94,0.5)]" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                         <span className="flex items-center gap-1.5"><Info size={10} /> Stability: Nominal</span>
                         <span className="text-green-600 font-black">{progress}% Processed</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : finished ? (
                <div className="space-y-10 animate-in zoom-in-95 duration-500 w-full">
                  <div className="w-48 h-48 bg-green-50 text-green-600 rounded-[3.5rem] flex items-center justify-center mx-auto shadow-inner border-4 border-green-100 relative group/finish">
                    <CheckCircle2 size={100} className="animate-bounce" />
                    <div className="absolute -top-4 -right-4 bg-amber-400 text-black w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-xl">XP</div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h4 className="text-5xl font-black text-slate-800 outfit tracking-tighter">Batch Cleared!</h4>
                      <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Produced: {selectedRecipe?.productName.toUpperCase()}</p>
                    </div>
                    <div className="p-10 bg-green-50/50 rounded-[3.5rem] border border-green-100 space-y-4 shadow-inner">
                      <div className="flex items-center justify-center gap-3 text-amber-600 font-black outfit text-6xl tracking-tighter">
                        <Sparkles size={40} className="animate-pulse" /> +{selectedRecipe?.rewardPoints}
                      </div>
                      <p className="text-green-700 font-black uppercase text-[10px] tracking-[0.2em]">Global Contribution Active</p>
                    </div>
                  </div>
                  <button 
                    onClick={reset}
                    className="w-full py-7 bg-slate-900 text-white rounded-[2rem] font-black text-2xl hover:bg-slate-800 transition-all shadow-2xl active:scale-95 transform hover:scale-[1.02]"
                  >
                    DEPLOY TO MARKET
                  </button>
                </div>
              ) : (
                <div className="space-y-8 opacity-40 group-hover:opacity-60 transition-opacity flex flex-col items-center">
                  <div className="w-40 h-40 bg-slate-50 rounded-[3rem] flex items-center justify-center mx-auto border-4 border-slate-100 shadow-inner">
                    <Package size={80} className="text-slate-200" />
                  </div>
                  <div className="space-y-2">
                     <p className="text-3xl font-black outfit text-slate-400 tracking-tighter">Processing Unit Idle</p>
                     <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] px-12 leading-relaxed">Commit a preservation path<br/>to activate the line</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial Video Modal */}
      {showVideoPreview && selectedRecipe && selectedRecipe.videoUrl && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-2xl animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-5xl rounded-[4rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 border border-white/20">
              <div className="p-10 border-b bg-slate-50 flex justify-between items-center">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-[1.5rem] flex items-center justify-center shadow-lg"><PlayCircle size={36} /></div>
                    <div>
                      <h3 className="text-3xl font-black outfit tracking-tighter text-slate-800">{selectedRecipe.productName} Masterclass</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Video Tutorial Protocol</p>
                    </div>
                 </div>
                 <button onClick={() => setShowVideoPreview(false)} className="p-5 hover:bg-slate-200 rounded-[2rem] transition-all group shadow-sm bg-white">
                    <X size={32} className="text-slate-400 group-hover:rotate-90 transition-transform duration-500" />
                 </button>
              </div>
              <div className="flex-1 p-8 md:p-12">
                 <div className="aspect-video bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white relative group">
                    <iframe 
                      src={selectedRecipe.videoUrl} 
                      className="w-full h-full" 
                      title={`${selectedRecipe.productName} Tutorial`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen 
                    />
                    <div className="absolute top-8 right-8 pointer-events-none">
                       <div className="px-6 py-3 bg-black/60 backdrop-blur-xl rounded-2xl text-white font-black text-[10px] uppercase tracking-widest border border-white/20">LIVE VIDEO LAB</div>
                    </div>
                 </div>
                 <div className="mt-10 p-10 bg-amber-50 rounded-[3rem] border-4 border-amber-100 flex items-start gap-8 relative overflow-hidden group shadow-inner">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-amber-500 shadow-sm flex-shrink-0"><Info size={32} /></div>
                    <div className="space-y-3 relative z-10">
                       <h4 className="text-2xl font-black text-amber-900 outfit leading-none">Learning Goal</h4>
                       <p className="text-amber-800/80 font-medium text-lg leading-relaxed italic">"Pay close attention to the preservation temperature and ingredient ratios shown. Correct execution ensures maximum product shelf life and higher XP rewards."</p>
                    </div>
                 </div>
              </div>
              <div className="p-10 bg-slate-50 border-t flex justify-center">
                 <button 
                  onClick={() => { setShowVideoPreview(false); handleStartVerification(); }}
                  className="w-full max-w-md py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 hover:bg-green-600 transition-all shadow-2xl transform active:scale-95"
                 >
                    <CheckCircle2 size={24} /> UNDERSTOOD, PROCEED TO VERIFY
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Converter;
