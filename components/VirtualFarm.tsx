import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Droplets,
  Settings2,
  Plus,
  Loader2,
  CheckCircle,
  BadgeDollarSign,
  Info,
  Trash2,
  X,
  Zap,
  Leaf,
  CloudSun,
  IndianRupee,
  Maximize2,
  Waves,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Cpu,
  ShieldCheck,
  TrendingUp,
  Wind,
  Monitor,
  Activity,
  Calendar,
  Layers,
  Database,
  Search,
  Scan,
  Terminal,
  BrainCircuit,
  Orbit
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Crop, CropPlot, AVAILABLE_CROPS } from '../types';
import { generateCropImage } from '../services/geminiService';
import { getUserItem, setUserItem } from '../services/storageService';

const GENERATION_PHASES = [
  { threshold: 0, msg: "Initializing Bio-Gen Engine...", icon: Cpu, log: "Core initialized. Awaiting sequence." },
  { threshold: 12, msg: "Analyzing DNA Sequences...", icon: Database, log: "Sequence mapping: 88% match found." },
  { threshold: 25, msg: "Mapping Soil Bio-Metrics...", icon: Search, log: "Nutrient density: Optimal (Nitrogen+)." },
  { threshold: 40, msg: "Synthesizing Cellular Structure...", icon: Sprout, log: "Lattice structure forming. Stability: 94%." },
  { threshold: 55, msg: "Calibrating Photosynthetic Rate...", icon: Zap, log: "Photon efficiency boosted (+12%)." },
  { threshold: 70, msg: "Synthesizing Photorealistic Foliage...", icon: Leaf, log: "Rendering textures. Alpha channel active." },
  { threshold: 85, msg: "Applying Environmental Shaders...", icon: CloudSun, log: "Directing sunlight vectors. Rayleigh active." },
  { threshold: 95, msg: "Finalizing Neural Model...", icon: Sparkles, log: "Model integrity check. Export ready." }
];

const getPhaseInfo = (progress: number) => {
  return [...GENERATION_PHASES].reverse().find(p => progress >= p.threshold) || GENERATION_PHASES[0];
};

const GeneratingPlotOverlay: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>(["[SYS]: Neural link established."]);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 99) return 99;
        const inc = prev < 60 ? Math.floor(Math.random() * 6) + 2 : Math.floor(Math.random() * 2) + 1;
        return Math.min(99, prev + inc);
      });
    }, 450);

    return () => clearInterval(progressInterval);
  }, []);

  const phase = getPhaseInfo(progress);

  useEffect(() => {
    if (phase.log && !logs.includes(`[SYS]: ${phase.log}`)) {
      setLogs(prev => [`[SYS]: ${phase.log}`, ...prev].slice(0, 3));
    }
  }, [phase.log, logs]);

  return (
    <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group">
      {/* Moving Tech Grid Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(#166534 1px, transparent 1px), linear-gradient(90deg, #166534 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        perspective: '1000px',
        transform: 'rotateX(60deg) scale(3) translateY(-100px)',
        top: '-20%'
      }} />

      {/* Scanning Laser Line */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-green-400 to-transparent z-20 pointer-events-none shadow-[0_0_25px_rgba(34,197,94,1)]" style={{
        animation: 'scanVerticalLoop 3s ease-in-out infinite'
      }} />

      {/* Floating Elements */}
      <div className="absolute top-10 right-10 opacity-20 animate-spin-slow">
        <Orbit size={100} className="text-green-500" />
      </div>

      <div className="relative z-10 w-full space-y-8 flex flex-col items-center">
        {/* Central Core Visual */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <div className="absolute inset-0 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute inset-[-15px] border-2 border-green-500/10 rounded-full animate-[spin_20s_linear_infinite]" />
          <div className="absolute inset-[-5px] border border-green-500/30 rounded-full border-dashed animate-[spin_10s_linear_infinite_reverse]" />

          <div className="relative w-28 h-28 bg-slate-900 border border-green-500/40 rounded-full shadow-[0_0_50px_rgba(34,197,94,0.4)] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-transparent" />
            <phase.icon size={48} className="text-green-400 animate-in zoom-in duration-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]" />

            {/* Circular Progress Border */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="56" cy="56" r="52"
                stroke="currentColor" strokeWidth="2"
                fill="transparent" className="text-white/5"
              />
              <circle
                cx="56" cy="56" r="52"
                stroke="currentColor" strokeWidth="4"
                fill="transparent"
                strokeDasharray="326.7"
                strokeDashoffset={326.7 * (1 - progress / 100)}
                className="text-green-400 transition-all duration-500"
              />
            </svg>
          </div>
        </div>

        {/* Dynamic Text Indicator */}
        <div className="space-y-4 w-full">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,1)]" />
              <p className="text-[9px] font-black text-green-500 uppercase tracking-[0.6em]">Neural Engine Running</p>
            </div>
            <div className="h-12 flex items-center justify-center overflow-hidden">
              <h4 className="text-2xl font-black text-white outfit tracking-tighter animate-in slide-in-from-bottom-4 duration-500 key={phase.msg}">
                {phase.msg}
              </h4>
            </div>
          </div>

          {/* Progress Bar with Shimmer */}
          <div className="w-full max-w-xs mx-auto space-y-3">
            <div className="relative w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/10 ring-2 ring-green-500/10">
              <div
                className="bg-gradient-to-r from-green-700 via-green-400 to-emerald-300 h-full rounded-full transition-all duration-700 ease-out relative shadow-[0_0_20px_rgba(34,197,94,0.6)]"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              </div>
            </div>
            <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
              <span className="flex items-center gap-1.5"><BrainCircuit size={10} className="text-green-600" /> SYNC RATIO</span>
              <span className="text-white tabular-nums text-sm font-black">{progress}%</span>
            </div>
          </div>
        </div>

        {/* Live System Logs */}
        <div className="w-full max-w-[200px] h-20 overflow-hidden bg-black/40 rounded-xl border border-white/5 p-3 flex flex-col gap-1 text-left stagger-in">
          {logs.map((log, i) => (
            <div key={i} className="flex items-center gap-2 opacity-0 animate-in fade-in slide-in-from-left-2 duration-300">
              <Terminal size={8} className="text-green-600 flex-shrink-0" />
              <p className="text-[8px] font-mono text-green-500/80 truncate leading-none uppercase tracking-tighter">{log}</p>
            </div>
          ))}
          {logs.length === 0 && <p className="text-[8px] font-mono text-slate-700 uppercase italic">Awaiting telemetry...</p>}
        </div>
      </div>

      <style>{`
        @keyframes scanVerticalLoop {
          0% { transform: translateY(-50px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(450px); opacity: 0; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const VirtualFarm: React.FC = () => {
  const navigate = useNavigate();
  const [plots, setPlots] = useState<CropPlot[]>([]);
  const [irrigation, setIrrigation] = useState(() => getUserItem('km_farm_irrigation') || 'Drip Irrigation');
  const [enrichment, setEnrichment] = useState(() => getUserItem('km_farm_enrichment') || 'Organic Compost');
  const [pestPolicy, setPestPolicy] = useState(() => getUserItem('km_farm_pest') || 'Biological Control');
  const [selectedPlotIndex, setSelectedPlotIndex] = useState<number | null>(null);
  const [isPlantingOpen, setIsPlantingOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [clickedPlot, setClickedPlot] = useState<number | null>(null);

  useEffect(() => {
    setUserItem('km_farm_irrigation', irrigation);
    setUserItem('km_farm_enrichment', enrichment);
    setUserItem('km_farm_pest', pestPolicy);
  }, [irrigation, enrichment, pestPolicy]);

  useEffect(() => {
    const savedPlots = getUserItem('kisaanmitra_farm_plots');
    let initialPlots: CropPlot[];
    if (savedPlots) initialPlots = JSON.parse(savedPlots);
    else initialPlots = Array.from({ length: 12 }, (_, i) => ({ id: i, crop: null, progress: 0, imageUrl: null }));
    setPlots(initialPlots);
    initialPlots.forEach((plot, idx) => {
      if (plot.isGeneratingImage && plot.crop) startCropGeneration(idx, plot.crop.name);
    });
  }, []);

  useEffect(() => {
    if (plots.length > 0) setUserItem('kisaanmitra_farm_plots', JSON.stringify(plots));
  }, [plots]);

  useEffect(() => {
    const growthInterval = setInterval(() => {
      setPlots(current => current.map(plot => {
        if (plot.crop && !plot.isGeneratingImage && plot.progress < 100) {
          const increment = Math.floor(Math.random() * 2) + 1;
          return { ...plot, progress: Math.min(100, plot.progress + increment) };
        }
        return plot;
      }));
    }, 15000);
    return () => clearInterval(growthInterval);
  }, []);

  const startCropGeneration = async (index: number, cropName: string) => {
    try {
      const imageUrl = await generateCropImage(cropName);
      setPlots(current => current.map((p, idx) =>
        idx === index ? { ...p, imageUrl, isGeneratingImage: false, progress: 5 } : p
      ));
    } catch (error) {
      console.error("Image generation failed:", error);
      setPlots(current => current.map((p, idx) =>
        idx === index ? { ...p, isGeneratingImage: false, progress: 5 } : p
      ));
    }
  };

  const handlePlantCrop = (crop: Crop) => {
    if (selectedPlotIndex === null) return;
    const updatedPlots = [...plots];
    updatedPlots[selectedPlotIndex] = { ...updatedPlots[selectedPlotIndex], crop, progress: 0, isGeneratingImage: true, imageUrl: null };
    setPlots(updatedPlots);
    setIsPlantingOpen(false);
    startCropGeneration(selectedPlotIndex, crop.name);
  };

  const handlePlotClick = (idx: number) => {
    if (plots[idx].isGeneratingImage) return;
    setClickedPlot(idx);
    setTimeout(() => {
      setSelectedPlotIndex(idx);
      setIsDetailOpen(true);
      setClickedPlot(null);
    }, 200);
  };

  const handleRemoveCrop = () => {
    if (selectedPlotIndex === null) return;
    const updatedPlots = [...plots];
    updatedPlots[selectedPlotIndex] = { id: selectedPlotIndex, crop: null, progress: 0, imageUrl: null };
    setPlots(updatedPlots);
    setIsDetailOpen(false);
  };

  const getGrowthStage = (progress: number) => {
    if (progress < 20) return { label: 'Germination', color: 'bg-blue-500' };
    if (progress < 50) return { label: 'Vegetative', color: 'bg-green-500' };
    if (progress < 80) return { label: 'Flowering', color: 'bg-amber-500' };
    return { label: 'Ripe / Harvest Ready', color: 'bg-emerald-600' };
  };

  const getDetailedStatus = (plot: CropPlot) => {
    if (plot.progress < 5) return 'Stabilizing Neural Root';
    if (plot.progress < 20) return 'Needs Water & Sun';
    if (plot.progress < 50) return 'Growth Phase: Nominal';
    if (plot.progress < 85) return 'Thriving & Healthy';
    if (plot.progress < 98) return 'Elite Maturity Level';
    return 'Optimized for Harvest';
  };

  const plotsUsed = plots.filter(p => p.crop !== null).length;
  const waterSaved = irrigation === 'Drip Irrigation' ? 85 : irrigation === 'Precision Sprinkler' ? 55 : 15;
  const yieldBonus = enrichment === 'Organic Compost' ? 25 : enrichment === 'Liquid Jeevamrut' ? 15 : 5;

  return (
    <div className="space-y-10 page-transition pb-24">
      <div className="relative h-80 rounded-[4rem] overflow-hidden shadow-2xl group border-8 border-white">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[4s]"
          alt="Farm"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-12 left-12 text-white space-y-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-amber-400 rounded-3xl text-black shadow-2xl animate-float">
              <CloudSun size={40} />
            </div>
            <div>
              <h1 className="text-6xl font-black outfit tracking-tighter text-white">Virtual Acreage</h1>
              <p className="text-white/70 font-black uppercase tracking-[0.4em] text-xs">SUSTAINABLE SANDBOX v2.5</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex items-center gap-8 group hover:shadow-xl transition-all">
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-[2rem] flex items-center justify-center shadow-inner group-hover:rotate-[15deg] transition-transform">
                <Sprout size={44} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mb-1">PLOTS OCCUPIED</p>
                <p className="text-5xl font-black text-slate-800 outfit tabular-nums">{plotsUsed} <span className="text-xl text-slate-300">/ 12</span></p>
              </div>
            </div>
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex items-center gap-8 group hover:shadow-xl transition-all">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                <Waves size={44} className="animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mb-1">CONSERVATION EFFICIENCY</p>
                <p className="text-5xl font-black text-slate-800 outfit tabular-nums">{waterSaved}% <span className="text-xl text-slate-300">SAVE</span></p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 stagger-in">
            {plots.map((plot, idx) => (
              <div key={idx} className="aspect-square relative">
                {!plot.crop ? (
                  <button
                    onClick={() => { setSelectedPlotIndex(idx); setIsPlantingOpen(true); }}
                    className="w-full h-full rounded-[4rem] border-4 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center group hover:bg-white hover:border-green-400 transition-all hover:scale-[1.03] active:scale-95 duration-500 shadow-inner hover:shadow-2xl"
                  >
                    <div className="w-20 h-20 rounded-3xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-slate-300 group-hover:text-green-500 transition-all group-hover:rotate-90 duration-700">
                      <Plus size={40} />
                    </div>
                    <p className="mt-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">ZONE {idx + 1}</p>
                  </button>
                ) : (
                  <div className="group h-full">
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 px-5 py-3 bg-slate-900 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none z-[100] whitespace-nowrap shadow-2xl border border-white/10 flex items-center gap-3 scale-75 group-hover:scale-100 -translate-y-2 group-hover:translate-y-0">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{getDetailedStatus(plot)}</span>
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 rotate-45 border-b border-r border-white/10" />
                    </div>

                    <div
                      onClick={() => handlePlotClick(idx)}
                      className={`w-full h-full rounded-[4rem] bg-white shadow-xl border-8 border-white overflow-hidden relative cursor-pointer group-hover:scale-[1.05] group-hover:-translate-y-3 group-hover:shadow-[0_40px_80px_rgba(34,197,94,0.2)] transition-all duration-500 transform ${plot.isGeneratingImage ? 'cursor-wait shadow-inner' : ''} ${clickedPlot === idx ? 'scale-90 opacity-80' : 'scale-100 opacity-100'}`}
                    >
                      <div className="absolute inset-0 z-0">
                        {plot.isGeneratingImage ? (
                          <GeneratingPlotOverlay />
                        ) : (
                          <>
                            <img
                              src={plot.imageUrl || plot.crop.image}
                              className="w-full h-full object-cover transition-all duration-[800ms] group-hover:scale-110 group-hover:brightness-110"
                              alt=""
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                          </>
                        )}
                      </div>

                      {!plot.isGeneratingImage && (
                        <div className="absolute inset-x-0 bottom-0 p-8 z-10 space-y-4">
                          <div className="flex justify-between items-center transform transition-transform group-hover:translate-y-[-6px]">
                            <p className="text-white font-black outfit text-2xl tracking-tight">{plot.crop.name}</p>
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all">
                              <Zap size={14} className="text-white" fill="currentColor" />
                            </div>
                          </div>
                          <div className="space-y-2 transition-opacity group-hover:opacity-100 opacity-80">
                            <div className="flex justify-between items-center text-[10px] font-black text-white/60 uppercase tracking-widest">
                              <span>MATURITY</span>
                              <span className="tabular-nums">{plot.progress}%</span>
                            </div>
                            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden shadow-inner border border-white/5">
                              <div className="bg-gradient-to-r from-green-400 to-emerald-300 h-full rounded-full transition-all duration-[2000ms]" style={{ width: `${plot.progress}%` }} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl space-y-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-700">
              <Settings2 size={160} />
            </div>
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                <div className="space-y-1">
                  <h3 className="font-black text-slate-800 outfit text-3xl tracking-tighter">Farm Settings</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GLOBAL OPERATING PROTOCOLS</p>
                </div>
                <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-2xl">
                  <Monitor size={24} />
                </div>
              </div>
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Droplets size={16} className="text-blue-500" /> Irrigation Preference
                    </label>
                    <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase">-{waterSaved}% Water</div>
                  </div>
                  <select
                    value={irrigation}
                    onChange={(e) => setIrrigation(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-100 rounded-2xl text-xs font-black py-5 px-6 focus:ring-4 focus:ring-blue-500/10 shadow-inner appearance-none cursor-pointer transition-all"
                  >
                    <option>Drip Irrigation</option>
                    <option>Precision Sprinkler</option>
                    <option>Flood Irrigation</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Leaf size={16} className="text-green-500" /> Nutrient Protocol
                    </label>
                    <div className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[9px] font-black uppercase">+{yieldBonus}% Yield</div>
                  </div>
                  <select
                    value={enrichment}
                    onChange={(e) => setEnrichment(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-green-100 rounded-2xl text-xs font-black py-5 px-6 focus:ring-4 focus:ring-green-500/10 shadow-inner appearance-none cursor-pointer transition-all"
                  >
                    <option>Organic Compost</option>
                    <option>Liquid Jeevamrut</option>
                    <option>Chemical Fertilizer</option>
                  </select>
                </div>
              </div>
              <div className="pt-8 border-t border-slate-50 flex items-center gap-5">
                <div className="w-14 h-14 bg-green-600 text-white rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
                  <TrendingUp size={28} />
                </div>
                <div className="space-y-1">
                  <p className="font-black outfit text-slate-800 text-lg leading-none">Yield Multiplier Active</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CURRENT STRATEGY: RATING A+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isPlantingOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-2xl animate-in fade-in duration-500">
          <div className="bg-white w-full max-w-4xl rounded-[4rem] shadow-[0_0_150px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-700">
            <div className="p-12 border-b flex justify-between items-center bg-slate-50/50">
              <div className="space-y-2">
                <h3 className="text-5xl font-black text-slate-800 outfit tracking-tighter">Sow New Variety</h3>
                <p className="text-slate-500 text-lg font-medium">Deploying {irrigation} for Zone {selectedPlotIndex! + 1}.</p>
              </div>
              <button onClick={() => setIsPlantingOpen(false)} className="p-5 hover:bg-slate-200 rounded-[2rem] transition-all group shadow-sm bg-white">
                <X size={40} className="text-slate-400 group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 stagger-in">
                {AVAILABLE_CROPS.map(crop => (
                  <button
                    key={crop.id}
                    onClick={() => handlePlantCrop(crop)}
                    className="p-10 rounded-[3rem] border border-slate-100 bg-white text-left hover:bg-green-50 hover:border-green-400 transition-all group flex flex-col gap-6 shadow-sm hover:shadow-2xl hover:-translate-y-2 duration-500"
                  >
                    <div className="w-20 h-20 bg-slate-50 rounded-[1.8rem] shadow-inner flex items-center justify-center text-slate-300 group-hover:text-green-600 transition-all group-hover:scale-110">
                      <Leaf size={40} />
                    </div>
                    <div className="space-y-3">
                      <p className="font-black text-slate-800 text-3xl group-hover:text-green-700 transition-colors outfit tracking-tighter leading-none">{crop.name}</p>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{crop.category}</p>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 font-medium">"{crop.funFact}"</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {isDetailOpen && selectedPlotIndex !== null && plots[selectedPlotIndex].crop && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-3xl animate-in fade-in duration-700 overflow-hidden">
          <div className="bg-white w-full max-w-5xl rounded-[4rem] shadow-[0_60px_120px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row max-h-[95vh] animate-in zoom-in-90 slide-in-from-bottom-20 duration-[700ms] transition-all ease-[cubic-bezier(0.34,1.76,0.64,1)] border border-white/20">
            <div className="w-full md:w-2/5 relative h-96 md:h-auto overflow-hidden group/modalimg">
              <img
                src={plots[selectedPlotIndex].imageUrl || plots[selectedPlotIndex].crop!.image}
                className="w-full h-full object-cover transition-all duration-[1200ms] group-hover/modalimg:scale-105"
                alt={plots[selectedPlotIndex].crop!.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent pointer-events-none" />
              <div className="absolute top-8 left-8 space-y-3">
                <div className="flex items-center gap-3 px-6 py-2.5 bg-green-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
                  <Activity size={14} className="animate-pulse" /> STATUS: VITAL
                </div>
              </div>
              <div className="absolute bottom-12 left-12 right-12 space-y-4">
                <div className="flex justify-between items-end text-white/80 font-black text-[10px] uppercase tracking-widest mb-1">
                  <span>Maturity Pipeline</span>
                  <span>{plots[selectedPlotIndex].progress}%</span>
                </div>
                <div className="w-full h-4 bg-white/10 rounded-full border border-white/20 p-1 shadow-inner overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-[2000ms] shadow-[0_0_15px_rgba(255,255,255,0.5)] ${getGrowthStage(plots[selectedPlotIndex].progress).color}`}
                    style={{ width: `${plots[selectedPlotIndex].progress}%` }}
                  />
                </div>
                <p className="text-white font-black outfit text-lg uppercase tracking-tight flex items-center gap-2">
                  <Calendar size={18} className="text-green-400" /> Current Stage: {getGrowthStage(plots[selectedPlotIndex].progress).label}
                </p>
              </div>
            </div>

            <div className="flex-1 p-12 md:p-16 flex flex-col relative bg-white">
              <div className="flex justify-between items-start mb-12">
                <div className="space-y-3 animate-in slide-in-from-left-6 duration-700 delay-200">
                  <p className="text-slate-400 text-xs font-black uppercase tracking-[0.4em]">CULTIVATION ZONE {selectedPlotIndex + 1}</p>
                  <h3 className="text-7xl font-black text-slate-800 outfit tracking-tighter leading-none">{plots[selectedPlotIndex].crop!.name}</h3>
                </div>
                <button onClick={() => setIsDetailOpen(false)} className="p-4 text-slate-300 hover:text-slate-800 transition-all hover:rotate-90 duration-500 bg-slate-50 rounded-2xl">
                  <X size={44} />
                </button>
              </div>

              <div className="space-y-10 flex-1 overflow-y-auto pr-6 custom-scrollbar animate-in fade-in duration-700 delay-300">
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100/50 flex flex-col gap-4 group/stat hover:bg-white hover:shadow-xl transition-all duration-500 cursor-default">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm transition-transform group-hover/stat:scale-110"><Droplets size={24} /></div>
                    <div>
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Moisture</p>
                      <p className="text-2xl font-black text-blue-900 outfit uppercase">Optimal</p>
                    </div>
                  </div>
                  <div className="p-8 bg-amber-50/50 rounded-[2.5rem] border border-amber-100/50 flex flex-col gap-4 group/stat hover:bg-white hover:shadow-xl transition-all duration-500 cursor-default">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-600 shadow-sm transition-transform group-hover/stat:scale-110"><Activity size={24} /></div>
                    <div>
                      <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Integrity</p>
                      <p className="text-2xl font-black text-amber-900 outfit uppercase">98% Solid</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-900 p-10 rounded-[3rem] space-y-6 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                    <Sparkles size={160} />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <h4 className="flex items-center gap-4 font-black text-green-400 text-[10px] outfit uppercase tracking-[0.3em]">
                      <Sparkles size={16} /> AGRONOMY FUN FACT
                    </h4>
                    <p className="text-white text-3xl font-black tracking-tight leading-snug italic">
                      "{plots[selectedPlotIndex].crop!.funFact}"
                    </p>
                  </div>
                </div>
                <div className="space-y-8">
                  <h4 className="flex items-center gap-4 font-black text-slate-800 text-[10px] outfit uppercase tracking-[0.3em]">
                    <IndianRupee size={16} className="text-green-600" /> ACTIVE PERKS
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {plots[selectedPlotIndex].crop!.subsidies.map((sub, i) => (
                      <div key={i} className="flex items-center gap-5 p-6 bg-slate-50 rounded-[2.2rem] border border-slate-100 hover:bg-green-50 transition-all shadow-sm">
                        <CheckCircle size={24} className="text-green-500" />
                        <span className="text-sm font-black text-slate-700 uppercase tracking-wide">{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-12 mt-12 border-t border-slate-100 flex flex-col sm:flex-row gap-8 animate-in slide-in-from-bottom-6 duration-700 delay-500">
                <button
                  onClick={() => navigate(`/learn/${plots[selectedPlotIndex!].crop!.name}`)}
                  className="flex-1 py-8 bg-green-600 text-white rounded-[2.5rem] font-black text-2xl hover:bg-green-700 shadow-xl transition-all flex items-center justify-center gap-4 transform active:scale-95"
                >
                  START GROWTH PHASE <ChevronRight size={32} strokeWidth={3} />
                </button>
                <button
                  onClick={handleRemoveCrop}
                  className="px-12 py-8 text-rose-500 font-black hover:bg-rose-50 rounded-[2.5rem] transition-all flex items-center justify-center gap-4 text-xl border-4 border-transparent hover:border-rose-100 active:scale-95"
                >
                  <Trash2 size={32} /> CLEAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualFarm;