
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { generateCropPlan, translateText, DetailedSoilMetrics, fetchWeatherContext, WeatherContext } from '../services/geminiService';
import {
  Sparkles, MapPin, Search, Loader2, Calendar, FileText, Download,
  Languages, ChevronDown, CheckCircle, Star, Zap, Waves, TrendingUp,
  IndianRupee, FlaskConical, Activity, Settings2, SlidersHorizontal, Info, X,
  RefreshCw, BarChart4, PieChart, Beaker, CloudRain, Sun, Thermometer, CloudSun
} from 'lucide-react';

interface Props { user: UserProfile; }
const LANGUAGES = ["Hindi", "Punjabi", "Tamil", "Telugu", "Marathi", "Bengali", "Gujarati", "Kannada", "Malayalam"];
const NUTRIENT_LEVELS = ["Low", "Medium", "High"];

const Planner: React.FC<Props> = ({ user }) => {
  const [location, setLocation] = useState(user.location);
  const [soil, setSoil] = useState(user.soilType);
  const [showDetailedSoil, setShowDetailedSoil] = useState(false);

  // Weather Context
  const [weather, setWeather] = useState<WeatherContext | null>(null);
  const [syncingWeather, setSyncingWeather] = useState(false);

  // Detailed Metrics State
  const [detailedMetrics, setDetailedMetrics] = useState<DetailedSoilMetrics>({
    ph: 7.0,
    nitrogen: "Medium",
    phosphorus: "Medium",
    potassium: "Medium"
  });

  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);
  const [translatedPlan, setTranslatedPlan] = useState<string | null>(null);
  const [targetLang, setTargetLang] = useState("Hindi");
  const [activeTab, setActiveTab] = useState<'strategy' | 'fertilization' | 'irrigation' | 'financials' | 'timeline'>('strategy');

  const handleSyncWeather = async () => {
    setSyncingWeather(true);
    try {
      // Use browser geolocation to get city name via AI if possible, 
      // or just use the existing location string to fetch context
      const context = await fetchWeatherContext(location);
      setWeather(context);
    } catch (e) {
      console.error(e);
      alert("Failed to sync real-time weather data.");
    } finally {
      setSyncingWeather(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setPlan(null);
    setTranslatedPlan(null);
    try {
      const result = await generateCropPlan(
        location,
        soil,
        showDetailedSoil ? detailedMetrics : undefined,
        weather || undefined
      );
      setPlan(result);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleTranslate = async () => {
    if (!plan) return;
    setTranslating(true);
    try {
      const result = await translateText(plan, targetLang);
      setTranslatedPlan(result);
    } catch (error) { console.error(error); }
    finally { setTranslating(false); }
  };

  const currentDisplayPlan = translatedPlan || plan;

  const getFilteredContent = () => {
    if (!currentDisplayPlan) return [];
    const lines = currentDisplayPlan.split('\n');

    const sections: Record<string, string[]> = {
      strategy: [],
      fertilization: [],
      irrigation: [],
      financials: [],
      timeline: []
    };

    let currentSection = 'strategy';
    lines.forEach(line => {
      const t = line.trim();
      if (t.includes('Climate-Adapted Strategy')) currentSection = 'strategy';
      else if (t.includes('Nutrient Protocol')) currentSection = 'fertilization';
      else if (t.includes('Irrigation Schedule')) currentSection = 'irrigation';
      else if (t.includes('Economic Outlook')) currentSection = 'financials';
      else if (t.includes('Timeline') || t.includes('Cycle')) currentSection = 'timeline';

      sections[currentSection].push(line);
    });

    return sections[activeTab] || lines;
  };

  const renderedLines = getFilteredContent();

  const getWeatherIcon = (cond: string) => {
    const c = cond.toLowerCase();
    if (c.includes('rain') || c.includes('showers')) return <CloudRain className="text-blue-400" size={32} />;
    if (c.includes('clear') || c.includes('sunny')) return <Sun className="text-amber-400" size={32} />;
    if (c.includes('cloud')) return <CloudSun className="text-slate-400" size={32} />;
    return <Thermometer className="text-rose-400" size={32} />;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 page-transition pb-24">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-green-100 text-green-700 rounded-full font-black text-[10px] tracking-widest uppercase border border-green-200">
          <Sparkles size={14} className="animate-pulse" /> CLIMATE-ADAPTIVE PLANNING
        </div>
        <h2 className="text-5xl font-black text-white outfit tracking-tighter">Strategic Crop Planner</h2>
        <p className="text-slate-300 max-w-2xl mx-auto text-xl font-medium">Architect a high-yield season using real-time weather patterns and sub-strata diagnostics.</p>
      </div>

      {!plan ? (
        <div className="bg-white rounded-[4rem] p-12 shadow-[0_50px_100px_rgba(0,0,0,0.1)] border border-slate-50 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-50 rounded-full blur-[100px] opacity-60" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
            <div className="lg:col-span-7 space-y-10">
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Regional Deployment Zone</label>
                  <div className="flex gap-4">
                    <div className="relative group flex-1">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-500 transition-colors" size={28} />
                      <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full pl-16 pr-8 py-7 bg-slate-50 border-none rounded-[2rem] focus:ring-4 focus:ring-green-500/10 transition-all font-black outfit text-2xl shadow-inner placeholder:text-slate-300 text-slate-900" placeholder="e.g. Ludhiana, PB" />
                    </div>
                    <button
                      onClick={handleSyncWeather}
                      disabled={syncingWeather}
                      className="px-8 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                      title="Sync Real-time Weather"
                    >
                      {syncingWeather ? <Loader2 className="animate-spin" size={24} /> : <Sun size={24} />}
                    </button>
                  </div>
                </div>

                {weather && (
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden animate-in slide-in-from-top-4 duration-500">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                      {getWeatherIcon(weather.condition)}
                    </div>
                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center justify-between border-b border-white/20 pb-6">
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30">
                            {getWeatherIcon(weather.condition)}
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Live Climate Sync</p>
                            <h4 className="text-4xl font-black outfit tracking-tighter">{weather.temp}</h4>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-white">{weather.condition}</p>
                          <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mt-1">Humidity: {weather.humidity}</p>
                        </div>
                      </div>
                      <div className="p-6 bg-white/10 rounded-2xl border border-white/20 flex items-start gap-4">
                        <Info size={20} className="text-amber-300 flex-shrink-0 mt-1" />
                        <p className="text-sm font-medium text-white leading-relaxed italic">"{weather.summary}"</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Sub-strata Analysis (Soil)</label>
                  <div className="relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-500 transition-colors" size={28} />
                    <select value={soil} onChange={(e) => setSoil(e.target.value)} className="w-full appearance-none pl-16 pr-12 py-7 bg-slate-50 border-none rounded-[2rem] focus:ring-4 focus:ring-green-500/10 transition-all font-black outfit text-2xl shadow-inner cursor-pointer text-slate-900">
                      <option>Alluvial Soil</option><option>Black Soil</option><option>Red Soil</option><option>Laterite Soil</option><option>Mountain Soil</option>
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" size={28} />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setShowDetailedSoil(!showDetailedSoil)}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${showDetailedSoil ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    <SlidersHorizontal size={18} /> {showDetailedSoil ? 'Disable Detailed Metrics' : 'Enable Detailed Bio-Metrics'}
                  </button>
                </div>

                {showDetailedSoil && (
                  <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-inner space-y-8 animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-4 text-amber-600">
                      <FlaskConical size={24} />
                      <h4 className="font-black outfit text-xl">Advanced Bio-Metrics</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">pH Level: <span className="text-amber-600 text-sm">{detailedMetrics.ph}</span></label>
                          <div className="px-3 py-1 bg-white rounded-lg text-[9px] font-black text-slate-400 shadow-sm uppercase">{detailedMetrics.ph < 6 ? 'Acidic' : detailedMetrics.ph > 8 ? 'Alkaline' : 'Neutral'}</div>
                        </div>
                        <input
                          type="range" min="0" max="14" step="0.1"
                          value={detailedMetrics.ph}
                          onChange={(e) => setDetailedMetrics({ ...detailedMetrics, ph: parseFloat(e.target.value) })}
                          className="w-full accent-amber-500"
                        />
                      </div>

                      {[
                        { id: 'nitrogen', label: 'Nitrogen (N)', color: 'blue' },
                        { id: 'phosphorus', label: 'Phosphorus (P)', color: 'rose' },
                        { id: 'potassium', label: 'Potassium (K)', color: 'green' }
                      ].map(n => (
                        <div key={n.id} className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{n.label} Content</label>
                          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
                            {NUTRIENT_LEVELS.map(level => (
                              <button
                                key={level}
                                onClick={() => setDetailedMetrics({ ...detailedMetrics, [n.id]: level })}
                                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${detailedMetrics[n.id as keyof DetailedSoilMetrics] === level ? `bg-${n.color}-500 text-white shadow-lg` : 'text-slate-400 hover:bg-slate-50'}`}
                              >
                                {level}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button onClick={handleGenerate} disabled={loading} className="w-full bg-slate-900 text-white py-8 rounded-[2.5rem] font-black text-2xl flex items-center justify-center gap-6 shadow-[0_25px_50px_rgba(0,0,0,0.3)] hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin" size={32} /> : <Zap size={32} fill="currentColor" />}
                {loading ? "ARCHITECTING STRATEGY..." : "INITIATE AI ANALYSIS"}
              </button>
            </div>
            <div className="lg:col-span-5 bg-slate-50 rounded-[3.5rem] p-12 border border-slate-100 border-dashed flex flex-col items-center justify-center text-center space-y-8">
              <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center text-green-500 animate-float">
                <Activity size={64} strokeWidth={1} />
              </div>
              <div className="space-y-4">
                <p className="text-3xl font-black text-slate-800 outfit tracking-tighter">Climate Intelligence</p>
                <p className="text-slate-400 font-medium leading-relaxed uppercase text-[10px] tracking-[0.2em]">
                  {weather
                    ? `DYNAMIC WEATHER ACTIVE: SYNCED ${weather.temp} CONTEXT. ADJUSTING IRRIGATION & CROP RESILIENCE.`
                    : "GEMINI PRO ANALYSIS INCLUDES: MICRO-CLIMATE TRENDS • MANDI PRICE FORECASTS • BIO-DIVERSITY RATINGS"}
                </p>
              </div>
              {weather && (
                <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100 flex items-center gap-4 animate-pulse">
                  <CloudSun size={24} className="text-blue-600" />
                  <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest text-left">Optimizing for {weather.condition} conditions...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-10 animate-in zoom-in-95 duration-700">
          <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-10 border-b bg-slate-50/50 flex flex-col xl:flex-row gap-8 xl:items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-green-600 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-green-200">
                  <FileText size={40} />
                </div>
                <div>
                  <h3 className="text-4xl font-black outfit tracking-tighter text-slate-800">Precision Strategy</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">FOR: {location.toUpperCase()} • CLIMATE SYNC ACTIVE</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 bg-white px-6 py-4 rounded-[1.5rem] border shadow-inner">
                  <Languages size={20} className="text-slate-400" />
                  <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} className="bg-transparent border-none text-xs font-black uppercase tracking-widest focus:ring-0">
                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <button onClick={handleTranslate} disabled={translating} className="bg-slate-900 text-white px-10 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-3 shadow-xl">
                  {translating ? <Loader2 className="animate-spin" size={16} /> : <Languages size={16} />}
                  {translating ? "TRANSLATING..." : "APPLY LOCALIZATION"}
                </button>
              </div>
            </div>

            <div className="flex p-4 bg-slate-100/50 border-b border-slate-100 overflow-x-auto no-scrollbar">
              {[
                { id: 'strategy', label: 'Climate Strategy', icon: Zap },
                { id: 'fertilization', label: 'Nutrient Protocol', icon: Beaker },
                { id: 'irrigation', label: 'Irrigation Schedule', icon: Waves },
                { id: 'financials', label: 'Economic Outlook', icon: IndianRupee },
                { id: 'timeline', label: 'Seasonal Cycle', icon: Calendar }
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 flex items-center justify-center gap-3 py-4 px-8 min-w-[200px] rounded-3xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-green-700 shadow-xl scale-105' : 'text-slate-400 hover:text-slate-600'}`}>
                  <tab.icon size={18} /> {tab.label}
                </button>
              ))}
            </div>

            <div className="p-12 md:p-24 prose prose-xl prose-slate max-w-none">
              {renderedLines.map((line, i) => {
                const t = line.trim();
                if (!t) return <div key={i} className="h-6" />;
                if (t.startsWith('###')) return (
                  <h3 key={i} className="text-4xl font-black text-slate-900 outfit mt-16 mb-10 border-l-8 border-green-500 pl-8 leading-none">
                    {t.replace('###', '').trim()}
                  </h3>
                );
                if (t.startsWith('-')) return (
                  <div key={i} className="flex gap-6 mb-8 items-start animate-in slide-in-from-left-4" style={{ animationDelay: `${i * 50}ms` }}>
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-3 flex-shrink-0 shadow-[0_0_10px_#22c55e]" />
                    <div className="text-slate-800 m-0 leading-relaxed font-medium text-lg">
                      {t.includes('**') ? (() => {
                        const match = t.match(/\*\*(.*?)\*\*(.*)/);
                        if (match) {
                          return (
                            <>
                              <strong className="text-slate-900 font-black">{match[1]}</strong>
                              {match[2]}
                            </>
                          );
                        }
                        return t.replace('-', '').trim();
                      })() : t.replace('-', '').trim()}
                    </div>
                  </div>
                );
                return <p key={i} className="text-slate-800 text-2xl font-medium leading-relaxed mb-10">{t}</p>;
              })}
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-12 flex flex-col md:flex-row items-center justify-between gap-10 border-t border-slate-200">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-amber-400/30">
                  <Star size={36} fill="currentColor" />
                </div>
                <div className="space-y-1">
                  <p className="text-slate-900 font-black outfit text-2xl tracking-tight">Precision Unlock Bonus</p>
                  <p className="text-slate-700 font-medium">Implementing this cycle earns <span className="text-green-600 font-bold">1,200 XP Points</span> & Bio-Scientist Badge.</p>
                </div>
              </div>
              <button className="w-full md:w-auto px-16 py-6 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-[1.8rem] font-black text-lg hover:shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shadow-xl">
                <Download size={24} /> SAVE BLUEPRINT
              </button>
            </div>
          </div>

          <div className="flex justify-center pt-10">
            <button onClick={() => setPlan(null)} className="flex items-center gap-3 px-10 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95">
              <RefreshCw size={18} /> Start New Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Planner;
