import React, { useState, useEffect } from 'react';
import { UserProfile, CropPlot, Group } from '../types';
import {
  Trophy,
  Droplets,
  Wind,
  Thermometer,
  ArrowRight,
  TrendingUp,
  Calendar,
  Star,
  Leaf,
  Bot,
  Send,
  Loader2,
  Sparkles,
  IndianRupee,
  Mic,
  Microscope,
  ShieldAlert,
  ChevronRight,
  BarChart3,
  RefreshCw,
  TrendingDown,
  Activity,
  AlertCircle,
  Zap,
  Users,
  CheckCircle2,
  ArrowUpRight,
  Clock,
  Scan
} from 'lucide-react';
import { chatFast, predictHarvestYield } from '../services/geminiService';
import { Link, useNavigate } from 'react-router-dom';
import VoiceAssistant from './VoiceAssistant';
import { getUserItem } from '../services/storageService';

interface Props {
  user: UserProfile;
}

const Dashboard: React.FC<Props> = ({ user }) => {
  const navigate = useNavigate();
  const [msgInput, setMsgInput] = useState('');
  const [chatResponse, setChatResponse] = useState<string | null>(null);
  const [loadingChat, setLoadingChat] = useState(false);
  const [activePlot, setActivePlot] = useState<CropPlot | null>(null);
  const [statCounters, setStatCounters] = useState({ temp: 0, moisture: 0, humidity: 0 });
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  // Yield Prediction States
  const [prediction, setPrediction] = useState<any>(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);

  useEffect(() => {
    const saved = getUserItem('kisaanmitra_farm_plots');
    if (saved) {
      const plots: CropPlot[] = JSON.parse(saved);
      const firstActive = plots.find(p => p.crop !== null);
      if (firstActive) {
        setActivePlot(firstActive);
        handleGetPrediction(firstActive.crop!.name);
      }
    }

    const timer = setTimeout(() => {
      setStatCounters({ temp: 32, moisture: 45, humidity: 62 });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleGetPrediction = async (cropName: string) => {
    setLoadingPrediction(true);
    try {
      const data = await predictHarvestYield(cropName, user.location, user.soilType);
      setPrediction(data);
    } catch (e) {
      console.error("Prediction failed", e);
    } finally {
      setLoadingPrediction(false);
    }
  };

  const handleFastChat = async () => {
    if (!msgInput.trim()) return;
    setLoadingChat(true);
    try {
      const res = await chatFast(msgInput);
      setChatResponse(res);
      setMsgInput('');
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <div className="space-y-10 page-transition pb-20">
      <VoiceAssistant isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />

      {/* Real-time Environmental Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: Thermometer, label: 'Temperature', val: `${statCounters.temp}°C`, color: 'blue' },
          { icon: Droplets, label: 'Soil Moisture', val: `${statCounters.moisture}%`, color: 'sky' },
          { icon: Wind, label: 'Humidity', val: `${statCounters.humidity}%`, color: 'indigo' },
          { icon: Calendar, label: 'Season', val: 'Kharif', color: 'green' }
        ].map((stat, i) => (
          <div key={i} className={`bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 card-pop`}>
            <div className={`w-14 h-14 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center shadow-inner`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800 outfit tabular-nums">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Dynamic Journey Section */}
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-gradient-to-br from-green-600 via-green-700 to-green-900 rounded-[3.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-green-100 group">
            <div className="relative z-10 space-y-8">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <span className="px-4 py-1.5 bg-white/20 rounded-full text-[10px] font-black tracking-[0.3em] uppercase backdrop-blur-md border border-white/10">LIVE PROGRESSION</span>
                  <h2 className="text-5xl font-black outfit tracking-tighter">
                    {activePlot ? activePlot.crop?.name : "Empty Plot"}
                  </h2>
                </div>
                {activePlot && (
                  <div className="bg-white/10 p-5 rounded-[2rem] backdrop-blur-xl border border-white/20 animate-float shadow-2xl">
                    <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1 text-center">CURRENT XP</p>
                    <p className="text-3xl font-black text-white tabular-nums">+{activePlot.progress * 10}</p>
                  </div>
                )}
              </div>

              {activePlot ? (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-black uppercase tracking-[0.2em] text-white/80">Journey Maturity</span>
                      <span className="text-2xl font-black tabular-nums">{activePlot.progress}%</span>
                    </div>
                    <div className="w-full bg-white/10 h-6 rounded-full p-1.5 shadow-inner border border-white/5">
                      <div className="bg-gradient-to-r from-white to-green-100 h-full rounded-full transition-all duration-[2000ms] shadow-[0_0_20px_rgba(255,255,255,0.5)]" style={{ width: `${activePlot.progress}%` }} />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-6 items-center">
                    <Link to={`/learn/${activePlot.crop?.name}`} className="w-full sm:w-auto bg-white text-green-800 px-12 py-5 rounded-[1.8rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-green-50 transition-all hover:scale-105 active:scale-95 shadow-xl">
                      CONTINUE GROWING <ArrowRight size={24} />
                    </Link>
                    <p className="text-green-50/70 text-sm font-bold uppercase tracking-widest italic animate-pulse">
                      NEXT: Organic Soil Enrichment
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-10 space-y-6">
                  <p className="text-green-50 text-2xl font-medium opacity-80 leading-relaxed">Ready to transform your virtual field? Start your first journey now.</p>
                  <Link to="/new-journey" className="w-fit bg-white text-green-800 px-12 py-5 rounded-[1.8rem] font-black text-lg flex items-center gap-3 hover:bg-green-50 transition-all hover:scale-105 active:scale-95 shadow-xl">
                    CHOOSE A CROP <ArrowRight size={24} />
                  </Link>
                </div>
              )}
            </div>
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-[30deg] transition-transform duration-[1.5s] pointer-events-none">
              <Leaf size={300} strokeWidth={1} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl space-y-6 group hover:shadow-2xl transition-all cursor-pointer overflow-hidden relative" onClick={() => navigate('/diagnosis')}>
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                <Scan size={200} />
              </div>
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-[1.5rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  <Microscope size={32} />
                </div>
                <div className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-[10px] font-black uppercase tracking-widest">AI Vision Lab</div>
              </div>
              <div className="space-y-2 relative z-10">
                <h3 className="text-2xl font-black outfit text-slate-800 tracking-tight">Plant Health Scanner</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Upload a specimen photo for instant AI-powered bio-metric diagnosis and remediation.</p>
              </div>
              <div className="pt-4 flex items-center text-rose-600 font-black text-xs uppercase tracking-[0.2em] gap-2 relative z-10">
                Capture & Diagnose <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </div>

            {/* Yield Prediction Card */}
            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl space-y-6 group hover:shadow-2xl transition-all relative overflow-hidden">
              {prediction && (
                <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12 pointer-events-none">
                  <BarChart3 size={120} />
                </div>
              )}

              <div className="flex justify-between items-start">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-[1.5rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  <TrendingUp size={32} />
                </div>
                <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                  <Zap size={10} fill="currentColor" /> Yield Predictor
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-black outfit text-slate-800 tracking-tight">AI Harvest Forecast</h3>

                {loadingPrediction ? (
                  <div className="flex flex-col items-center justify-center py-6 space-y-3">
                    <Loader2 size={32} className="animate-spin text-blue-500" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Analyzing regional history...</p>
                  </div>
                ) : prediction ? (
                  <div className="space-y-5 animate-in slide-in-from-bottom-2 duration-500">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">PROJ. YIELD</p>
                        <p className="text-lg font-black text-slate-800 outfit">{prediction.forecastedYield}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">MKT. VALUE</p>
                        <p className="text-lg font-black text-green-600 outfit">{prediction.marketValue}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {prediction.trend === 'Up' ? <TrendingUp size={16} className="text-green-500" /> : prediction.trend === 'Down' ? <TrendingDown size={16} className="text-rose-500" /> : <Activity size={16} className="text-blue-500" />}
                        <span className={`text-[11px] font-black uppercase ${prediction.trend === 'Up' ? 'text-green-600' : 'text-slate-500'}`}>Trend: {prediction.trend}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conf: {prediction.confidenceScore}%</span>
                      </div>
                    </div>
                    <button
                      onClick={() => activePlot && handleGetPrediction(activePlot.crop!.name)}
                      className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline pt-2"
                    >
                      <RefreshCw size={12} /> Recalculate Analysis
                    </button>
                  </div>
                ) : (
                  <div className="py-6 flex flex-col items-center text-center space-y-3 opacity-40">
                    <AlertCircle size={32} className="text-slate-300" />
                    <p className="text-xs font-bold text-slate-400 uppercase leading-relaxed tracking-widest">Start a journey to<br />unlock yield forecasts</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Assistant - Dynamic Interaction */}
          <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-xl space-y-8 group transition-all duration-500 hover:shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-[1.5rem] flex items-center justify-center shadow-inner group-hover:rotate-[15deg] transition-transform">
                  <Bot size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-black outfit tracking-tight">AgroPlay AI Assistant</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">Low-Latency Farm Intelligence</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-4">
                <button
                  onClick={() => setIsVoiceOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-amber-50 text-amber-700 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-amber-100 hover:bg-amber-100 transition-all shadow-sm active:scale-95"
                >
                  <Mic size={14} fill="currentColor" /> LIVE VOICE CHAT
                </button>
                <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-blue-100">
                  <Sparkles size={14} className="animate-pulse" /> FAST LITE 2.5
                </div>
              </div>
            </div>

            <div className={`p-10 rounded-[2.5rem] min-h-[160px] flex items-center justify-center transition-all duration-700 ${chatResponse ? 'bg-slate-50 border border-slate-100 animate-in zoom-in-95' : 'bg-slate-50/40 border border-dashed border-slate-200'}`}>
              {loadingChat ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="animate-spin text-green-600" size={40} />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Crunching Agronomy Data...</p>
                </div>
              ) : (
                chatResponse ? (
                  <p className="text-xl text-slate-700 leading-relaxed font-medium italic text-center">"{chatResponse}"</p>
                ) : (
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest italic opacity-60 text-center px-10">Ask about planting dates, pest control, or market trends...</p>
                )
              )}
            </div>

            <div className="relative group">
              <input
                type="text"
                value={msgInput}
                onChange={e => setMsgInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleFastChat()}
                placeholder="How do I prepare soil for wheat?"
                className="w-full bg-slate-50 border-none rounded-[2rem] pl-10 pr-40 py-8 outline-none focus:ring-4 focus:ring-green-500/10 transition-all font-medium outfit text-xl shadow-inner placeholder:text-slate-300"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-3">
                <button
                  onClick={() => setIsVoiceOpen(true)}
                  className="w-16 h-16 bg-amber-500 text-white rounded-2xl flex items-center justify-center hover:bg-amber-600 transition-all shadow-xl hover:scale-110 active:scale-90"
                >
                  <Mic size={28} />
                </button>
                <button onClick={handleFastChat} className="w-16 h-16 bg-green-600 text-white rounded-2xl flex items-center justify-center hover:bg-green-700 transition-all shadow-xl hover:scale-110 active:scale-90">
                  <Send size={28} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Staggered entrance */}
        <div className="lg:col-span-4 space-y-8 stagger-in">
          {/* Community Group Highlights */}
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-lg space-y-6 relative overflow-hidden group hover:shadow-2xl transition-all cursor-pointer" onClick={() => navigate('/groups')}>
            <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                  <Users size={20} />
                </div>
                <h3 className="font-black text-slate-800 outfit text-xl tracking-tight">Active Hubs</h3>
              </div>
              <ArrowUpRight size={20} className="text-slate-400 group-hover:text-green-500 transition-colors" />
            </div>

            <div className="space-y-4 relative z-10">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Punjab Masters</span>
                  <span className="flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full">ACTIVE CHALLENGE</span>
                </div>
                <p className="text-sm font-bold text-slate-700">Bio-Fertilizer Sourcing</p>
                <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                  <Clock size={12} /> 2 days remaining
                </div>
              </div>

              <div className="flex -space-x-3 items-center">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} src={`https://picsum.photos/seed/${i + 10}/100`} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" alt="" />
                ))}
                <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-500">+12</div>
                <span className="ml-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">In your region</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-lg space-y-8 relative overflow-hidden">
            <div className="flex justify-between items-center relative z-10">
              <h3 className="font-black text-slate-800 outfit text-2xl tracking-tight">Active Goals</h3>
              <TrendingUp size={28} className="text-green-500" />
            </div>
            <div className="space-y-5 relative z-10">
              {[
                { title: 'Water Audit', pts: '+50', status: 'In Progress', icon: Droplets, color: 'blue' },
                { title: 'Pest Scouting', pts: '+100', status: 'Completed', icon: Sparkles, color: 'green' },
                { title: 'Soil pH Check', pts: '+150', status: 'Available', icon: Thermometer, color: 'amber' }
              ].map((task, i) => (
                <div key={i} className="flex items-center justify-between p-5 rounded-[1.8rem] bg-slate-50 border border-slate-100 hover:bg-green-50 transition-all cursor-pointer group card-pop">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 bg-${task.color}-100 text-${task.color}-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <task.icon size={20} />
                    </div>
                    <span className="text-sm font-black text-slate-700 uppercase tracking-wide">{task.title}</span>
                  </div>
                  {task.status === 'Completed' ? (
                    <CheckCircle2 size={18} className="text-green-500" />
                  ) : (
                    <span className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full group-hover:bg-green-600 group-hover:text-white transition-all">{task.pts} XP</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-90 transition-transform duration-[2s]">
              <IndianRupee size={180} />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                  <Star size={20} fill="currentColor" />
                </div>
                <h3 className="font-black outfit text-2xl tracking-tight">Market Insight</h3>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed font-medium">
                Wheat prices in <span className="text-white font-bold">Punjab Mandis</span> are projected to climb <span className="text-green-400 font-black">+14%</span> by next week.
              </p>
              <Link to="/market" className="text-green-400 text-sm font-black uppercase tracking-[0.2em] hover:text-green-300 transition-all flex items-center gap-3 group/link">
                FULL ANALYSIS <ArrowRight size={18} className="group-hover/link:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
