import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Camera, ShieldCheck, CheckCircle2, AlertCircle, FileText, Sparkles, Smartphone, PlayCircle, BookOpen, Volume2, Info, Check, X, Maximize2, Star } from 'lucide-react';
import { generateSurplusGuide, verifyTaskCompletion } from '../services/geminiService';
import { MOCK_SURPLUS, CONVERSION_RECIPES } from '../types';

const ConverterVerify: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cropId = searchParams.get('cropId');
  const recipeId = searchParams.get('recipeId');

  const [loadingGuide, setLoadingGuide] = useState(true);
  const [guide, setGuide] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ verified: boolean, reasoning: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'video' | 'recipe'>('video');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const crop = MOCK_SURPLUS.find(c => c.id === cropId);
  const recipe = crop ? CONVERSION_RECIPES[crop.name]?.find(r => r.id === recipeId) : null;

  useEffect(() => {
    if (crop && recipe) {
      handleGenerateGuide();
    }
  }, [crop, recipe]);

  const handleGenerateGuide = async () => {
    if (!crop || !recipe) return;
    setLoadingGuide(true);
    try {
      const result = await generateSurplusGuide(crop.name, recipe.productName);
      setGuide(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingGuide(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setVerificationResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerify = async () => {
    if (!image || !crop || !recipe) return;
    setVerifying(true);
    try {
      const base64 = image.split(',')[1];
      const result = await verifyTaskCompletion(
        `Convert surplus ${crop.name} into ${recipe.productName}`,
        `Show the surplus ${crop.name} harvest you intend to preserve.`,
        base64
      );
      setVerificationResult(result);
      if (result.verified) {
        setTimeout(() => {
          navigate(`/converter?verified=true&cropId=${cropId}&recipeId=${recipeId}`);
        }, 3000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setVerifying(false);
    }
  };

  if (!crop || !recipe) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">Invalid selection.</h2>
        <Link to="/converter" className="text-green-600 hover:underline mt-4 inline-block font-black uppercase text-sm">Return to Hub</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 page-transition pb-20">
      <div className="flex items-center justify-between">
        <Link to="/converter" className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-slate-500 hover:text-green-600 font-bold shadow-sm transition-all group active:scale-95">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="uppercase text-xs tracking-widest font-black">Exit Lab</span>
        </Link>
        <div className="flex items-center gap-4">
           <div className="px-5 py-2 bg-green-50 text-green-700 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-green-100">Verification Active</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: AI Learning Zone */}
        <div className="lg:col-span-7 space-y-10">
          <div className="bg-white rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col h-full min-h-[800px]">
            <div className="p-10 border-b bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl">
                  {activeTab === 'video' ? <PlayCircle size={32} /> : <BookOpen size={32} />}
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-800 outfit tracking-tighter">{recipe.productName}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Specialized Value Addition Module</p>
                </div>
              </div>
              
              <div className="flex p-1.5 bg-slate-200/50 rounded-2xl shadow-inner border border-slate-200">
                <button 
                  onClick={() => setActiveTab('video')} 
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'video' ? 'bg-white text-green-700 shadow-md scale-105' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <PlayCircle size={16} /> Tutorial
                </button>
                <button 
                  onClick={() => setActiveTab('recipe')} 
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'recipe' ? 'bg-white text-green-700 shadow-md scale-105' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <FileText size={16} /> Recipe Guide
                </button>
              </div>
            </div>

            <div className="flex-1 p-10 animate-in fade-in duration-700">
               {activeTab === 'video' ? (
                 <div className="space-y-10 h-full flex flex-col">
                   {recipe.videoUrl ? (
                     <div className="aspect-video bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white relative group">
                        <iframe 
                          src={recipe.videoUrl} 
                          className="w-full h-full" 
                          title={`${recipe.productName} Tutorial`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen 
                        />
                        <div className="absolute top-6 right-6 pointer-events-none">
                           <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl text-white font-black text-[10px] uppercase tracking-widest border border-white/20">LIVE VIDEO LAB</div>
                        </div>
                     </div>
                   ) : (
                     <div className="aspect-video bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 space-y-4">
                        <PlayCircle size={80} strokeWidth={1} />
                        <p className="text-xl font-black outfit uppercase tracking-widest">Tutorial Link Pending</p>
                     </div>
                   )}
                   
                   <div className="p-10 bg-amber-50 rounded-[3rem] border border-amber-100 flex items-start gap-8 relative overflow-hidden group shadow-inner">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-1000"><Maximize2 size={120} /></div>
                      <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-amber-500 shadow-sm flex-shrink-0"><Info size={32} /></div>
                      <div className="space-y-3 relative z-10">
                         <h4 className="text-xl font-black text-amber-900 outfit leading-none">Expert Technique Note</h4>
                         <p className="text-amber-800/80 font-medium text-lg leading-relaxed italic">"Follow the preservation steps precisely to ensure your {crop.name} derived product meets global export quality standards."</p>
                      </div>
                   </div>
                 </div>
               ) : (
                 <div className="h-full flex flex-col">
                   {loadingGuide ? (
                     <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                       <div className="relative">
                          <div className="absolute inset-0 bg-green-500/10 rounded-full animate-ping" />
                          <div className="w-24 h-24 bg-white rounded-[2rem] border-4 border-green-100 flex items-center justify-center text-green-600 shadow-2xl">
                             <Loader2 size={48} className="animate-spin" />
                          </div>
                       </div>
                       <p className="font-black text-slate-400 uppercase tracking-[0.4em] text-xs">Architecting Knowledge Base...</p>
                     </div>
                   ) : (
                     <div className="prose prose-xl prose-slate prose-green max-w-none space-y-8 animate-in slide-in-from-bottom-4 duration-700">
                       {guide.split('\n').map((line, i) => {
                         const trimmed = line.trim();
                         if (trimmed.startsWith('###')) return <h3 key={i} className="text-4xl font-black text-slate-800 outfit mt-12 mb-8 border-l-8 border-green-500 pl-8 leading-none">{trimmed.replace('###', '').trim()}</h3>;
                         if (trimmed.startsWith('-')) return (
                           <div key={i} className="flex gap-4 items-center mb-4">
                              <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" />
                              <p className="text-slate-600 font-medium m-0">{trimmed.replace('-', '').trim()}</p>
                           </div>
                         );
                         if (trimmed.match(/^\d\./)) return (
                           <div key={i} className="flex gap-6 mb-8 items-start bg-slate-50 p-8 rounded-[2rem] border border-slate-100 group hover:bg-white hover:shadow-xl transition-all">
                              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex-shrink-0 flex items-center justify-center font-black outfit text-lg group-hover:scale-110 transition-transform">{trimmed[0]}</div>
                              <span className="text-slate-600 font-bold leading-relaxed">{trimmed.substring(3)}</span>
                           </div>
                         );
                         if (!trimmed) return null;
                         return <p key={i} className="text-slate-600 leading-relaxed font-medium text-lg mb-6 px-4 italic border-l-2 border-slate-100">"{trimmed}"</p>;
                       })}
                     </div>
                   )}
                 </div>
               )}
            </div>
            
            <div className="p-10 border-t bg-slate-50/50 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100"><Sparkles size={24} /></div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mastery Tier Knowledge Base</p>
               </div>
               <button onClick={() => window.print()} className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm hover:bg-slate-100 transition-all active:scale-95">Download PDF Guide</button>
            </div>
          </div>
        </div>

        {/* Right: Verification Area */}
        <div className="lg:col-span-5 space-y-10">
          <div className="bg-white rounded-[4rem] p-12 shadow-[0_50px_100px_rgba(0,0,0,0.12)] border-8 border-white space-y-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform duration-1000"><ShieldCheck size={200} /></div>
            
            <div className="space-y-8 relative z-10">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-[1.8rem] flex items-center justify-center shadow-2xl ring-4 ring-slate-100">
                  <ShieldCheck size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-800 outfit tracking-tighter">Harvest Verify</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Authentication Protocol Required</p>
                </div>
              </div>

              <div className="p-8 bg-blue-50/50 rounded-[3rem] border border-blue-100/50 space-y-6">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm"><Smartphone size={20} /></div>
                   <p className="text-xs font-black text-blue-900 uppercase tracking-widest">Active Task Mission</p>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed font-bold">
                  Document your surplus <span className="text-blue-600 font-black">{crop.name}</span> stock ({crop.quantity}{crop.unit}) to unlock the production line.
                </p>
              </div>

              <div 
                onClick={() => !verifying && !verificationResult?.verified && fileInputRef.current?.click()}
                className={`group aspect-[4/3] rounded-[3.5rem] border-8 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden shadow-inner ${
                  image ? 'border-green-500 bg-green-50/20 ring-4 ring-green-100' : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-green-400 hover:shadow-2xl'
                }`}
              >
                {image ? (
                  <div className="relative w-full h-full p-4 animate-in zoom-in duration-500">
                    <img src={image} className="w-full h-full object-cover rounded-[2.5rem] shadow-2xl border-4 border-white" alt="Preview" />
                    {!verificationResult?.verified && (
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center rounded-[2.5rem] backdrop-blur-sm">
                         <Camera size={48} className="text-white mb-4 animate-bounce" />
                         <p className="text-white font-black uppercase text-xs tracking-widest">Swap Selection</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-8">
                    <div className="w-24 h-24 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all border-2 border-slate-50">
                      <Camera className="text-slate-300 group-hover:text-green-500 transition-colors" size={48} />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="font-black text-2xl text-slate-800 outfit tracking-tighter">Initiate Capture</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile Camera or Cloud Upload</p>
                    </div>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
              </div>

              {verificationResult && (
                <div className={`p-8 rounded-[3rem] animate-in slide-in-from-bottom-4 duration-700 flex gap-6 shadow-xl ${
                  verificationResult.verified ? 'bg-green-600 text-white ring-8 ring-green-100' : 'bg-rose-100 text-rose-800'
                }`}>
                  <div className="flex-shrink-0 pt-1">
                    {verificationResult.verified ? <CheckCircle2 size={32} className="animate-in zoom-in" /> : <AlertCircle size={32} />}
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-2xl outfit tracking-tighter leading-none">{verificationResult.verified ? 'Protocol Approved!' : 'Verification Refused'}</p>
                    <p className={`text-sm font-medium leading-relaxed ${verificationResult.verified ? 'opacity-90' : 'opacity-80'}`}>{verificationResult.reasoning}</p>
                  </div>
                </div>
              )}

              <button 
                onClick={handleVerify}
                disabled={!image || verifying || verificationResult?.verified}
                className="w-full bg-slate-900 text-white py-8 rounded-[2.5rem] font-black text-2xl flex items-center justify-center gap-5 shadow-2xl transition-all disabled:opacity-30 transform hover:scale-[1.02] active:scale-95 group overflow-hidden"
              >
                {verifying ? (
                  <>
                    <Loader2 className="animate-spin" size={32} />
                    <span>Neural Scanning...</span>
                  </>
                ) : (
                  <>
                    {verificationResult?.verified ? (
                      <div className="flex items-center gap-4"><Check size={32} /> COMMIT TO LINE</div>
                    ) : (
                      <div className="flex items-center gap-4"><ShieldCheck size={32} /> AUTHENTICATE BATCH</div>
                    )}
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s]" />
              </button>
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-6 relative overflow-hidden group shadow-2xl">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-1000"><Star size={160} /></div>
             <div className="relative z-10 flex items-center gap-6">
                <div className="w-16 h-16 bg-amber-400 rounded-3xl flex items-center justify-center text-black shadow-xl"><Star size={32} fill="currentColor" /></div>
                <div className="space-y-1">
                   <h5 className="font-black outfit text-2xl tracking-tighter leading-none">Integrity Bonus</h5>
                   <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Earn +25% XP for high-fidelity images</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConverterVerify;