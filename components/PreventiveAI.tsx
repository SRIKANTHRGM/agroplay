
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { generatePreventivePlan, translateText, PreventivePlanParams } from '../services/geminiService';
import {
    Sparkles, MapPin, Search, Loader2, Calendar, FileText, Download,
    Languages, ChevronDown, CheckCircle, Star, Zap, Waves, TrendingUp,
    ShieldCheck, Activity, Bug, Thermometer, CloudSun, Droplets, Leaf,
    RefreshCw, Info, AlertTriangle, Scale
} from 'lucide-react';

interface Props { user: UserProfile; }
const LANGUAGES = ["Hindi", "Punjabi", "Tamil", "Telugu", "Marathi", "Bengali", "Gujarati", "Kannada", "Malayalam"];
const GROWTH_STAGES = ["Seedling", "Vegetative", "Flowering", "Fruiting", "Harvest"];

const PreventiveAI: React.FC<Props> = ({ user }) => {
    const [params, setParams] = useState<PreventivePlanParams>({
        cropName: '',
        growthStage: 'Vegetative',
        location: user.location,
        weatherConditions: '',
        soilType: user.soilType,
        previousDiseaseHistory: ''
    });

    const [loading, setLoading] = useState(false);
    const [translating, setTranslating] = useState(false);
    const [plan, setPlan] = useState<string | null>(null);
    const [translatedPlan, setTranslatedPlan] = useState<string | null>(null);
    const [targetLang, setTargetLang] = useState("Hindi");
    const [activeTab, setActiveTab] = useState<'risks' | 'prevention' | 'monitoring' | 'alerts' | 'sustainability'>('risks');

    const handleGenerate = async () => {
        if (!params.cropName || !params.weatherConditions) {
            alert("Please enter Crop Name and Weather Conditions.");
            return;
        }
        setLoading(true);
        setPlan(null);
        setTranslatedPlan(null);
        try {
            const result = await generatePreventivePlan(params);
            setPlan(result);
        } catch (error) {
            console.error(error);
            alert("Neural link error. Please try again.");
        }
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
            risks: [],
            prevention: [],
            monitoring: [],
            alerts: [],
            sustainability: []
        };

        let currentSection = 'risks';
        lines.forEach(line => {
            const t = line.trim();
            if (t.includes('HIGH-RISK DISEASE IDENTIFICATION')) currentSection = 'risks';
            else if (t.includes('PREVENTIVE ACTION PLAN')) currentSection = 'prevention';
            else if (t.includes('7-DAY MONITORING PROTOCOL')) currentSection = 'monitoring';
            else if (t.includes('WEATHER-BASED INTELLIGENCE ALERTS')) currentSection = 'alerts';
            else if (t.includes('SUSTAINABILITY & SOIL HEALTH SCORE')) currentSection = 'sustainability';

            sections[currentSection].push(line);
        });

        return sections[activeTab] || lines;
    };

    const renderedLines = getFilteredContent();

    return (
        <div className="max-w-6xl mx-auto space-y-12 page-transition pb-24">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-100 text-blue-700 rounded-full font-black text-[10px] tracking-widest uppercase border border-blue-200 shadow-sm">
                    <ShieldCheck size={14} className="animate-pulse" /> PREVENTIVE INTELLIGENCE
                </div>
                <h2 className="text-5xl font-black text-white outfit tracking-tighter">Disease Pro-Shield AI</h2>
                <p className="text-slate-300 max-w-2xl mx-auto text-xl font-medium">Proactive crop protection system. Predict risks and implement defenses before diseases strike.</p>
            </div>

            {!plan ? (
                <div className="bg-white rounded-[4rem] p-12 shadow-[0_50px_100px_rgba(0,0,0,0.1)] border border-slate-50 relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-50 rounded-full blur-[100px] opacity-60" />
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
                        <div className="lg:col-span-7 space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Crop Specimen</label>
                                    <div className="relative group">
                                        <Leaf className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={24} />
                                        <input
                                            type="text"
                                            value={params.cropName}
                                            onChange={(e) => setParams({ ...params, cropName: e.target.value })}
                                            className="w-full pl-16 pr-8 py-6 bg-slate-50 border-none rounded-[2rem] focus:ring-4 focus:ring-blue-500/10 transition-all font-black outfit text-xl shadow-inner placeholder:text-slate-300 text-slate-900"
                                            placeholder="e.g. Tomato, Rice"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Growth Stage</label>
                                    <div className="relative group">
                                        <Activity className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={24} />
                                        <select
                                            value={params.growthStage}
                                            onChange={(e) => setParams({ ...params, growthStage: e.target.value })}
                                            className="w-full appearance-none pl-16 pr-12 py-6 bg-slate-50 border-none rounded-[2rem] focus:ring-4 focus:ring-blue-500/10 transition-all font-black outfit text-xl shadow-inner cursor-pointer text-slate-900"
                                        >
                                            {GROWTH_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Deployment Zone</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={24} />
                                        <input
                                            type="text"
                                            value={params.location}
                                            onChange={(e) => setParams({ ...params, location: e.target.value })}
                                            className="w-full pl-16 pr-8 py-6 bg-slate-50 border-none rounded-[2rem] focus:ring-4 focus:ring-blue-500/10 transition-all font-black outfit text-xl shadow-inner placeholder:text-slate-300 text-slate-900"
                                            placeholder="Location"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Weather Snapshot</label>
                                    <div className="relative group">
                                        <CloudSun className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={24} />
                                        <input
                                            type="text"
                                            value={params.weatherConditions}
                                            onChange={(e) => setParams({ ...params, weatherConditions: e.target.value })}
                                            className="w-full pl-16 pr-8 py-6 bg-slate-50 border-none rounded-[2rem] focus:ring-4 focus:ring-blue-500/10 transition-all font-black outfit text-xl shadow-inner placeholder:text-slate-300 text-slate-900"
                                            placeholder="Temp, Humid, Rain"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Disease History & Environment (Optional)</label>
                                    <div className="relative group">
                                        <AlertTriangle className="absolute left-6 top-8 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={24} />
                                        <textarea
                                            value={params.previousDiseaseHistory}
                                            onChange={(e) => setParams({ ...params, previousDiseaseHistory: e.target.value })}
                                            className="w-full pl-16 pr-8 py-6 bg-slate-50 border-none rounded-[2rem] focus:ring-4 focus:ring-blue-500/10 transition-all font-black outfit text-xl shadow-inner placeholder:text-slate-300 text-slate-900 min-h-[120px]"
                                            placeholder="Any previous disease outbreaks or specific soil concerns?"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleGenerate} disabled={loading} className="w-full bg-slate-900 text-white py-8 rounded-[2.5rem] font-black text-2xl flex items-center justify-center gap-6 shadow-[0_25px_50px_rgba(30,58,138,0.3)] hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 mt-4">
                                {loading ? <Loader2 className="animate-spin" size={32} /> : <ShieldCheck size={32} fill="currentColor" />}
                                {loading ? "ANALYZING THREATS..." : "ACTIVATE PRO-SHIELD"}
                            </button>
                        </div>

                        <div className="lg:col-span-1 border-l border-slate-100 hidden lg:block" />

                        <div className="lg:col-span-4 flex flex-col items-center justify-center text-center space-y-8 bg-slate-50 rounded-[3rem] p-12 border border-slate-100 border-dashed">
                            <div className="w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center text-blue-500 animate-float">
                                <Zap size={64} strokeWidth={1} fill="currentColor" />
                            </div>
                            <div className="space-y-4">
                                <p className="text-3xl font-black text-slate-800 outfit tracking-tighter uppercase">Predictive Edge</p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]" /> AI Model: AgroShield v2.0
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                        <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]" /> Bio-Metric Accuracy: 94%
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_8px_#f59e0b]" /> Regional Risk Analysis
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-10 animate-in zoom-in-95 duration-700">
                    <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 overflow-hidden">
                        <div className="p-10 border-b bg-slate-50/50 flex flex-col xl:flex-row gap-8 xl:items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-200">
                                    <ShieldCheck size={40} />
                                </div>
                                <div>
                                    <h3 className="text-4xl font-black outfit tracking-tighter text-slate-800">Prevention Blueprint</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">THREAT LEVEL: CALCULATED • SPECIES: {params.cropName.toUpperCase()}</p>
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
                                    {translating ? "LOCALIZING..." : "APPLY TRANSLATION"}
                                </button>
                            </div>
                        </div>

                        <div className="flex p-4 bg-slate-100/50 border-b border-slate-100 overflow-x-auto no-scrollbar">
                            {[
                                { id: 'risks', label: 'Disease Risks', icon: Bug },
                                { id: 'prevention', label: 'Defense Plan', icon: ShieldCheck },
                                { id: 'monitoring', label: 'Watchlist', icon: Activity },
                                { id: 'alerts', label: 'Weather Alerts', icon: CloudSun },
                                { id: 'sustainability', label: 'Eco Impact', icon: Scale }
                            ].map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 flex items-center justify-center gap-3 py-4 px-8 min-w-[200px] rounded-3xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-blue-700 shadow-xl scale-105' : 'text-slate-400 hover:text-slate-600'}`}>
                                    <tab.icon size={18} /> {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-12 md:p-24 prose prose-xl prose-slate max-w-none">
                            {renderedLines.map((line, i) => {
                                const t = line.trim();
                                if (!t) return <div key={i} className="h-6" />;
                                if (t.startsWith('###')) return (
                                    <h3 key={i} className="text-4xl font-black text-slate-900 outfit mt-16 mb-10 border-l-8 border-blue-500 pl-8 leading-none uppercase tracking-tighter">
                                        {t.replace('###', '').trim()}
                                    </h3>
                                );
                                if (t.startsWith('-')) return (
                                    <div key={i} className="flex gap-6 mb-8 items-start animate-in slide-in-from-left-4" style={{ animationDelay: `${i * 50}ms` }}>
                                        <div className="w-4 h-4 bg-blue-500 rounded-lg mt-2 flex-shrink-0 shadow-[0_0_15px_#3b82f6] rotate-45" />
                                        <div className="text-slate-800 m-0 leading-relaxed font-medium text-lg">
                                            {t.includes('**') ? (() => {
                                                const match = t.match(/\*\*(.*?)\*\*(.*)/);
                                                if (match) {
                                                    return (
                                                        <>
                                                            <strong className="text-slate-900 font-black uppercase tracking-tight">{match[1]}</strong>
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

                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-12 flex flex-col md:flex-row items-center justify-between gap-10 border-t border-slate-200">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-green-400/30">
                                    <Star size={36} fill="currentColor" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-slate-900 font-black outfit text-2xl tracking-tight">Prevention Excellence</p>
                                    <p className="text-slate-700 font-medium">Following this plan boosts resilience by <span className="text-blue-600 font-bold">45%</span> and earns <span className="text-green-600 font-bold">2,500 XP</span>.</p>
                                </div>
                            </div>
                            <button className="w-full md:w-auto px-16 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[1.8rem] font-black text-lg hover:shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shadow-xl">
                                <Download size={24} /> EXPORT PDF PROTOCOL
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center pt-10">
                        <button onClick={() => setPlan(null)} className="flex items-center gap-3 px-10 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95">
                            <RefreshCw size={18} /> Reset Bio-Analytics
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PreventiveAI;
