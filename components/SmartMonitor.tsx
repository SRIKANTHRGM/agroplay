import React, { useState, useEffect, useRef } from 'react';
import {
    MapPin, AlertTriangle, ShieldCheck, Leaf, Wind, Droplets,
    Thermometer, ArrowRight, Bell, Activity, Zap, RefreshCw,
    Eye, Radio, Wifi, CheckCircle, TrendingUp, Navigation,
    Layers, FlaskConical, Sprout, Bug, Shield
} from 'lucide-react';

interface Farm {
    id: string; name: string; crop: string;
    lat: number; lng: number; x: number; y: number;
    status: 'healthy' | 'infected' | 'at-risk';
    disease?: string; humidity: number; temperature: number;
    owner: string; area: string;
}
interface Alert {
    id: string; farmId: string; farmName: string; disease: string;
    crop: string; distance: number; severity: 'Low' | 'Medium' | 'High' | 'Critical';
    time: string; read: boolean;
}
interface Prevention { disease: string; organic: string[]; inorganic: string[]; tips: string[]; }

const FARMS: Farm[] = [
    { id: 'F001', name: 'Green Valley Farm', crop: 'Wheat', lat: 17.385, lng: 78.486, x: 320, y: 210, status: 'infected', disease: 'Wheat Rust', humidity: 78, temperature: 29, owner: 'Rajesh Kumar', area: '4.2 acres' },
    { id: 'F002', name: 'Sunrise Agro', crop: 'Wheat', lat: 17.390, lng: 78.491, x: 450, y: 155, status: 'at-risk', humidity: 74, temperature: 28, owner: 'Suresh Reddy', area: '3.8 acres' },
    { id: 'F003', name: 'Krishna Fields', crop: 'Rice', lat: 17.382, lng: 78.495, x: 520, y: 260, status: 'at-risk', humidity: 80, temperature: 30, owner: 'Anand Rao', area: '6.1 acres' },
    { id: 'F004', name: 'Heritage Farm', crop: 'Cotton', lat: 17.378, lng: 78.480, x: 210, y: 300, status: 'healthy', humidity: 65, temperature: 27, owner: 'Priya Sharma', area: '5.5 acres' },
    { id: 'F005', name: 'Lakshmi Agri', crop: 'Wheat', lat: 17.393, lng: 78.484, x: 360, y: 95, status: 'at-risk', humidity: 72, temperature: 28, owner: 'Venkat Naidu', area: '2.9 acres' },
    { id: 'F006', name: 'Golden Harvest', crop: 'Maize', lat: 17.376, lng: 78.498, x: 550, y: 330, status: 'healthy', humidity: 60, temperature: 26, owner: 'Ravi Teja', area: '7.0 acres' },
    { id: 'F007', name: 'Neem Grove Farm', crop: 'Sugarcane', lat: 17.388, lng: 78.475, x: 155, y: 200, status: 'healthy', humidity: 58, temperature: 25, owner: 'Kavita Devi', area: '3.3 acres' },
];
const CONNECTIONS = [
    { from: 'F001', to: 'F002', risk: 'high' },
    { from: 'F001', to: 'F003', risk: 'medium' },
    { from: 'F001', to: 'F005', risk: 'high' },
    { from: 'F002', to: 'F005', risk: 'medium' },
];
const ALERTS: Alert[] = [
    { id: 'A001', farmId: 'F001', farmName: 'Green Valley Farm', disease: 'Wheat Rust', crop: 'Wheat', distance: 0.4, severity: 'Critical', time: '2 mins ago', read: false },
    { id: 'A002', farmId: 'F002', farmName: 'Sunrise Agro', disease: 'Powdery Mildew', crop: 'Wheat', distance: 0.9, severity: 'High', time: '18 mins ago', read: false },
    { id: 'A003', farmId: 'F005', farmName: 'Lakshmi Agri', disease: 'Leaf Blight', crop: 'Wheat', distance: 1.2, severity: 'Medium', time: '1 hr ago', read: true },
];
const PREVENTION_DB: Record<string, Prevention> = {
    'Wheat Rust': { disease: 'Wheat Rust', organic: ['Neem oil spray (3% solution, every 7 days)', 'Trichoderma viride biofungicide', 'Garlic extract spray (1:10 ratio)', 'Cow urine ferment spray'], inorganic: ['Propiconazole 25% EC (1 ml/L)', 'Mancozeb 75% WP (2.5 g/L)', 'Tebuconazole 250 EC (1 ml/L)'], tips: ['Remove and burn infected leaves immediately', 'Improve field airflow by pruning dense canopy', 'Avoid overhead irrigation — use drip system', 'Monitor humidity — keep below 70%', 'Apply preventive fungicide to neighbouring farms'] },
    'Powdery Mildew': { disease: 'Powdery Mildew', organic: ['Baking soda spray (5 g/L water)', 'Neem oil + mild soap spray', 'Milk spray (40% dilution)', 'Potassium bicarbonate spray'], inorganic: ['Sulfur 80% WDG (3 g/L)', 'Azoxystrobin 23% SC (1 ml/L)', 'Hexaconazole 5% EC (2 ml/L)'], tips: ['Avoid high nitrogen fertilization', 'Prune infected shoots and leaves', 'Space plants for better air circulation', 'Water at base — avoid wetting foliage'] },
    'Leaf Blight': { disease: 'Leaf Blight', organic: ['Copper hydroxide spray', 'Pseudomonas fluorescens (10 g/L)', 'Neem cake soil application', 'Botanical extract (tulsi/neem)'], inorganic: ['Copper oxychloride 50% WP (3 g/L)', 'Iprodione 50% WP (2 g/L)', 'Carbendazim 50% WP (1 g/L)'], tips: ['Drain waterlogged fields promptly', 'Use certified disease-free seeds', 'Apply lime to balance soil pH', 'Scout fields every 3 days during humid weather'] },
};
const SEV_COLOR: Record<string, string> = {
    Critical: 'bg-red-500/20 text-red-400 border-red-500/40',
    High: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
    Medium: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    Low: 'bg-green-500/20 text-green-400 border-green-500/40',
};

const haversineKm = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371, dL = (lat2 - lat1) * Math.PI / 180, dG = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dL / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dG / 2) ** 2;
    return parseFloat((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2));
};
const latLngToSvg = (lat: number, lng: number) => {
    const x = 155 + ((lng - 78.472) / (78.501 - 78.472)) * (550 - 155);
    const y = 330 - ((lat - 17.374) / (17.396 - 17.374)) * (330 - 95);
    return { x: Math.max(30, Math.min(670, x)), y: Math.max(30, Math.min(390, y)) };
};
const getNearbyAffected = (origin: Farm, r = 2) =>
    FARMS.filter(f => f.id !== origin.id && (f.status === 'infected' || f.status === 'at-risk'))
        .map(f => ({ ...f, distKm: haversineKm(origin.lat, origin.lng, f.lat, f.lng), sameCrop: f.crop === origin.crop }))
        .filter(f => f.distKm <= r).sort((a, b) => a.distKm - b.distKm);
const getNearbyFromCoords = (lat: number, lng: number, r = 3) =>
    FARMS.filter(f => f.status === 'infected' || f.status === 'at-risk')
        .map(f => ({ ...f, distKm: haversineKm(lat, lng, f.lat, f.lng) }))
        .filter(f => f.distKm <= r).sort((a, b) => a.distKm - b.distKm);

const statusColor = (s: Farm['status']) => s === 'infected' ? '#ef4444' : s === 'at-risk' ? '#f59e0b' : '#22c55e';

const SmartMonitor: React.FC = () => {
    const [selFarm, setSelFarm] = useState<Farm | null>(FARMS[0]);
    const [selAlert, setSelAlert] = useState<Alert | null>(ALERTS[0]);
    const [alerts, setAlerts] = useState<Alert[]>(ALERTS);
    const [activeTab, setActiveTab] = useState<'organic' | 'inorganic'>('organic');
    const [showRadius, setShowRadius] = useState(true);
    const [pulse, setPulse] = useState(false);
    const [filter, setFilter] = useState<'all' | 'infected' | 'at-risk' | 'healthy'>('all');
    const [liveUpdate, setLiveUpdate] = useState(true);
    const [userPos, setUserPos] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
    const [locErr, setLocErr] = useState<string | null>(null);
    const [locLoading, setLocLoading] = useState(true);
    const watchRef = useRef<number | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) { setLocErr('Geolocation not supported'); setLocLoading(false); return; }
        watchRef.current = navigator.geolocation.watchPosition(
            (p) => { setUserPos({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: Math.round(p.coords.accuracy) }); setLocErr(null); setLocLoading(false); },
            (e) => { setLocErr(e.code === 1 ? 'Location permission denied — please allow access.' : 'Cannot determine location.'); setLocLoading(false); },
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
        );
        return () => { if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current); };
    }, []);

    useEffect(() => { const i = setInterval(() => setPulse(p => !p), 2000); return () => clearInterval(i); }, []);
    useEffect(() => {
        if (!liveUpdate) return;
        const t = setTimeout(() => setAlerts(p => [{ id: 'A_NEW', farmId: 'F003', farmName: 'Krishna Fields', disease: 'Rice Blast', crop: 'Rice', distance: 0.7, severity: 'High', time: 'Just now', read: false }, ...p]), 8000);
        return () => clearTimeout(t);
    }, [liveUpdate]);

    const visible = filter === 'all' ? FARMS : FARMS.filter(f => f.status === filter);
    const prevention = selAlert ? PREVENTION_DB[selAlert.disease] || PREVENTION_DB['Wheat Rust'] : PREVENTION_DB['Wheat Rust'];
    const unread = alerts.filter(a => !a.read).length;
    const markRead = (id: string) => setAlerts(p => p.map(a => a.id === id ? { ...a, read: true } : a));
    const userSvg = userPos ? latLngToSvg(userPos.lat, userPos.lng) : null;
    const liveNearby = userPos ? getNearbyFromCoords(userPos.lat, userPos.lng) : [];

    return (
        <div className="max-w-[1600px] mx-auto space-y-10 pb-24 px-4 md:px-6">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-5 py-2 bg-green-50 text-green-700 rounded-full font-black text-[10px] tracking-widest uppercase border border-green-200">
                        <Radio size={13} className="animate-pulse" /> Smart Farm Monitor
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 outfit tracking-tighter uppercase italic">Agricultural Intelligence Hub</h2>
                    <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider italic">Real-time monitoring · Disease prediction · Neighbour alerts · Smart prevention</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setLiveUpdate(l => !l)} className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all ${liveUpdate ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                        <Wifi size={14} className={liveUpdate ? 'animate-pulse' : ''} />{liveUpdate ? 'Live' : 'Paused'}
                    </button>
                    <button className="relative flex items-center gap-2 px-5 py-3 bg-white rounded-2xl font-black text-xs uppercase tracking-widest border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                        <Bell size={14} />Alerts
                        {unread > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-lg animate-bounce">{unread}</span>}
                    </button>
                </div>
            </div>

            {/* STAT STRIP */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Farms Monitored', value: '7', icon: Layers, color: 'text-blue-600 bg-blue-50 border-blue-100' },
                    { label: 'Infected Farms', value: '1', icon: Bug, color: 'text-red-600 bg-red-50 border-red-100' },
                    { label: 'At-Risk Farms', value: '3', icon: AlertTriangle, color: 'text-amber-600 bg-amber-50 border-amber-100' },
                    { label: 'Active Alerts', value: String(unread), icon: Bell, color: 'text-orange-600 bg-orange-50 border-orange-100' },
                ].map((s, i) => (
                    <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${s.color}`}><s.icon size={22} /></div>
                        <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p><p className="text-3xl font-black text-slate-900 outfit italic">{s.value}</p></div>
                    </div>
                ))}
            </div>

            {/* MODULE 1 — LOCATION-BASED MONITORING */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm"><MapPin size={24} /></div>
                        <div><p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Module 01</p><h3 className="text-2xl font-black text-slate-900 outfit uppercase italic tracking-tight">Location-Based Monitoring</h3></div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <button onClick={() => setShowRadius(r => !r)} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all ${showRadius ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                            <Eye size={12} />{showRadius ? 'Radius On' : 'Radius Off'}
                        </button>
                        {(['all', 'infected', 'at-risk', 'healthy'] as const).map(s => (
                            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all ${filter === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}>{s}</button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row">
                    {/* SVG MAP */}
                    <div className="flex-1 relative bg-gradient-to-br from-slate-50 via-green-50/30 to-blue-50/30 min-h-[440px]">
                        <div className="absolute inset-0 pointer-events-none opacity-10">
                            <svg width="100%" height="100%"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#22c55e" strokeWidth="0.5" /></pattern></defs><rect width="100%" height="100%" fill="url(#grid)" /></svg>
                        </div>
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 700 420" preserveAspectRatio="xMidYMid meet">
                            {showRadius && <circle cx={FARMS[0].x} cy={FARMS[0].y} r="110" fill="rgba(239,68,68,0.06)" stroke="rgba(239,68,68,0.25)" strokeWidth="1.5" strokeDasharray="6 4" />}
                            {CONNECTIONS.map((c, i) => {
                                const from = FARMS.find(f => f.id === c.from)!, to = FARMS.find(f => f.id === c.to)!;
                                const col = c.risk === 'high' ? '#ef4444' : '#f59e0b';
                                const mx = (from.x + to.x) / 2, my = (from.y + to.y) / 2;
                                return (<g key={i}><line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={col} strokeWidth="1.5" strokeDasharray="5 3" opacity="0.6" />
                                    <polygon points={`${mx},${my - 6} ${mx - 5},${my + 4} ${mx + 5},${my + 4}`} fill={col} opacity="0.8" transform={`rotate(${Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI + 90},${mx},${my})`} /></g>);
                            })}
                            {visible.map(farm => {
                                const isSel = selFarm?.id === farm.id;
                                const isNear = selFarm ? getNearbyAffected(selFarm).some(n => n.id === farm.id) : false;
                                return (
                                    <g key={farm.id} onClick={() => setSelFarm(farm)} className="cursor-pointer">
                                        {farm.status === 'infected' && <circle cx={farm.x} cy={farm.y} r={pulse ? 30 : 22} fill="none" stroke="#ef4444" strokeWidth="1" opacity={pulse ? 0.2 : 0.5} style={{ transition: 'r 1s ease,opacity 1s ease' }} />}
                                        {isNear && !isSel && <circle cx={farm.x} cy={farm.y} r={pulse ? 28 : 24} fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 3" opacity={pulse ? 0.9 : 0.5} style={{ transition: 'r 1s ease,opacity 1s ease' }} />}
                                        <circle cx={farm.x} cy={farm.y} r="20" fill={isSel ? statusColor(farm.status) : isNear ? 'rgba(251,191,36,0.15)' : 'white'} stroke={statusColor(farm.status)} strokeWidth={isSel ? 3 : isNear ? 2.5 : 2} filter={isSel ? 'url(#glow)' : isNear ? 'url(#glow-amber)' : ''} />
                                        <text x={farm.x} y={farm.y + 5} textAnchor="middle" fontSize="13" fill={isSel ? 'white' : statusColor(farm.status)}>{farm.status === 'infected' ? '⚠' : farm.status === 'at-risk' ? '◎' : '✓'}</text>
                                        <text x={farm.x} y={farm.y + 36} textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#1e293b" letterSpacing="0.5">{farm.id}</text>
                                        <text x={farm.x} y={farm.y + 47} textAnchor="middle" fontSize="7.5" fill="#64748b" letterSpacing="0.3">{farm.crop}</text>
                                    </g>
                                );
                            })}
                            {userSvg && (
                                <g>
                                    <circle cx={userSvg.x} cy={userSvg.y} r={pulse ? 22 : 14} fill="rgba(59,130,246,0.12)" style={{ transition: 'r 1s ease' }} />
                                    <circle cx={userSvg.x} cy={userSvg.y} r="10" fill="rgba(59,130,246,0.25)" />
                                    <circle cx={userSvg.x} cy={userSvg.y} r="6" fill="#3b82f6" stroke="white" strokeWidth="2" />
                                    <text x={userSvg.x} y={userSvg.y - 16} textAnchor="middle" fontSize="8" fontWeight="800" fill="#3b82f6" letterSpacing="0.5">YOU</text>
                                </g>
                            )}
                            <defs>
                                <filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                                <filter id="glow-amber"><feGaussianBlur stdDeviation="2" result="coloredBlur" /><feFlood floodColor="#f59e0b" floodOpacity="0.4" result="amber" /><feComposite in="amber" in2="coloredBlur" operator="in" result="amberGlow" /><feMerge><feMergeNode in="amberGlow" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                            </defs>
                        </svg>
                        <div className="absolute bottom-5 left-5 flex items-center gap-4 px-5 py-3 bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-lg">
                            {[{ color: '#ef4444', label: 'Infected' }, { color: '#f59e0b', label: 'At Risk' }, { color: '#22c55e', label: 'Healthy' }, { color: '#3b82f6', label: 'You' }].map(l => (
                                <div key={l.label} className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: l.color }} /><span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{l.label}</span></div>
                            ))}
                        </div>
                        {liveUpdate && <div className="absolute top-5 right-5 flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full text-green-700 font-black text-[9px] uppercase tracking-widest shadow-sm"><span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />Live GPS Feed</div>}
                        <div className={`absolute bottom-5 right-5 flex items-center gap-3 px-4 py-2.5 rounded-2xl border shadow-lg text-[9px] font-black uppercase tracking-widest ${locLoading ? 'bg-slate-50 border-slate-200 text-slate-500' : locErr ? 'bg-red-50 border-red-200 text-red-600' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                            {locLoading ? (<><RefreshCw size={11} className="animate-spin" />Acquiring GPS...</>) : locErr ? (<><AlertTriangle size={11} />{locErr}</>) : userPos ? (<><span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse flex-shrink-0" />{userPos.lat.toFixed(5)}, {userPos.lng.toFixed(5)} · ±{userPos.accuracy}m</>) : null}
                        </div>
                    </div>

                    {/* DETAIL PANEL */}
                    <div className="lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-100 p-6 space-y-5 bg-slate-50/50 overflow-y-auto max-h-[520px]">
                        {/* Live Location */}
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${locLoading ? 'bg-slate-300' : locErr ? 'bg-red-400' : 'bg-blue-500 animate-pulse'}`} />Your Live Location
                            </p>
                            {locLoading && <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl"><RefreshCw size={16} className="text-blue-500 animate-spin flex-shrink-0" /><p className="text-[11px] font-bold text-blue-700">Acquiring GPS signal...</p></div>}
                            {locErr && <div className="p-4 bg-red-50 border border-red-100 rounded-2xl space-y-2"><p className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2"><AlertTriangle size={11} />GPS Error</p><p className="text-[11px] font-bold text-red-700">{locErr}</p></div>}
                            {userPos && (
                                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl space-y-2">
                                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse flex-shrink-0" /><p className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Live · High Accuracy</p></div>
                                    <div className="grid grid-cols-2 gap-2 text-center">
                                        <div className="bg-white rounded-xl p-2 border border-blue-100"><p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Latitude</p><p className="text-sm font-black text-slate-900 outfit">{userPos.lat.toFixed(5)}</p></div>
                                        <div className="bg-white rounded-xl p-2 border border-blue-100"><p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Longitude</p><p className="text-sm font-black text-slate-900 outfit">{userPos.lng.toFixed(5)}</p></div>
                                    </div>
                                    <p className="text-[9px] text-blue-500 font-bold text-center">Accuracy: ±{userPos.accuracy} m</p>
                                    <a href={`https://www.google.com/maps/search/agricultural+pesticide+shop/@${userPos.lat},${userPos.lng},14z`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-2.5 mt-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[9px] uppercase tracking-widest transition-all">
                                        <MapPin size={10} />Find Agri Shops Near Me
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Live Nearby Affected Farms */}
                        {userPos && (
                            <div className="pt-4 border-t border-slate-100 space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><AlertTriangle size={10} className="text-amber-500" />Affected Farms Near You</p>
                                    <span className={`text-[8px] font-black px-2 py-1 rounded-full border ${liveNearby.length === 0 ? 'bg-green-50 text-green-600 border-green-200' : liveNearby.length <= 2 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-600 border-red-200'}`}>{liveNearby.length === 0 ? 'Clear' : `${liveNearby.length} Found`}</span>
                                </div>
                                {liveNearby.length === 0 ? (
                                    <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-2xl"><CheckCircle size={18} className="text-green-500 flex-shrink-0" /><p className="text-[11px] font-bold text-green-700">No infected/at-risk farms within 3 km of your location.</p></div>
                                ) : (
                                    liveNearby.map(f => (
                                        <div key={f.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group" onClick={() => setSelFarm(FARMS.find(fm => fm.id === f.id)!)}>
                                            <div className={`h-1 w-full ${f.status === 'infected' ? 'bg-red-500' : 'bg-amber-400'}`} />
                                            <div className="p-4 space-y-2">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div><p className="font-black text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{f.name}</p><p className="text-[9px] text-slate-400 font-bold">{f.id} · {f.crop}</p></div>
                                                    <div className="text-right flex-shrink-0"><p className={`text-lg font-black outfit ${f.status === 'infected' ? 'text-red-600' : 'text-amber-600'}`}>{f.distKm} km</p><p className="text-[8px] text-slate-400 font-bold">from you</p></div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className={`text-[8px] font-black px-2 py-1 rounded-full border uppercase ${f.status === 'infected' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>{f.status === 'infected' ? '⚠ Infected' : '◎ At Risk'}</span>
                                                    {f.disease && <span className="text-[8px] font-bold px-2 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200">{f.disease}</span>}
                                                </div>
                                                <a href={`https://www.google.com/maps/dir/${userPos.lat},${userPos.lng}/${f.lat},${f.lng}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="flex items-center justify-center gap-2 w-full py-2 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-600 border border-slate-200 hover:border-blue-600 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all">
                                                    <Navigation size={10} />Get Directions
                                                </a>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Selected Farm Details */}
                        <div className="pt-4 border-t border-slate-100 space-y-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2"><Navigation size={12} className="text-blue-600" />Selected Farm Details</p>
                            {selFarm ? (
                                <>
                                    <div className="space-y-1">
                                        <div className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${selFarm.status === 'infected' ? 'bg-red-50 text-red-700 border-red-200' : selFarm.status === 'at-risk' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200'}`}>{selFarm.status === 'infected' ? '⚠ Infected' : selFarm.status === 'at-risk' ? '◎ At Risk' : '✓ Healthy'}</div>
                                        <h4 className="text-xl font-black text-slate-900 outfit uppercase italic">{selFarm.name}</h4>
                                        <p className="text-[10px] font-bold text-slate-500">{selFarm.owner} · {selFarm.area}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[{ icon: Leaf, label: 'Crop', value: selFarm.crop }, { icon: MapPin, label: 'ID', value: selFarm.id }, { icon: Droplets, label: 'Humidity', value: `${selFarm.humidity}%` }, { icon: Thermometer, label: 'Temp', value: `${selFarm.temperature}°C` }].map((item, i) => (
                                            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 space-y-1 shadow-sm"><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><item.icon size={10} />{item.label}</p><p className="text-base font-black text-slate-900 outfit">{item.value}</p></div>
                                        ))}
                                    </div>
                                    {selFarm.disease && <div className="p-4 bg-red-50 border border-red-100 rounded-2xl"><p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1">⚠ Disease</p><p className="text-lg font-black text-red-700 outfit italic">{selFarm.disease}</p></div>}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><AlertTriangle size={10} className="text-amber-500" />Nearby Affected Fields</p>
                                            {(() => { const n = getNearbyAffected(selFarm); return (<span className={`text-[8px] font-black px-2 py-1 rounded-full border ${n.length === 0 ? 'bg-green-50 text-green-600 border-green-200' : n.length <= 2 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-600 border-red-200'}`}>{n.length === 0 ? 'Clear' : `${n.length} Found`}</span>); })()}
                                        </div>
                                        {(() => {
                                            const nearby = getNearbyAffected(selFarm);
                                            return nearby.length === 0 ? (
                                                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-2xl"><CheckCircle size={18} className="text-green-500 flex-shrink-0" /><p className="text-[11px] font-bold text-green-700">No affected farms within 2 km. Zone is clear.</p></div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {nearby.map(f => (
                                                        <div key={f.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group" onClick={() => setSelFarm(FARMS.find(fm => fm.id === f.id)!)}>
                                                            <div className={`h-1 w-full ${f.status === 'infected' ? 'bg-red-500' : 'bg-amber-400'}`} />
                                                            <div className="p-4 space-y-2">
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <div><p className="font-black text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{f.name}</p><p className="text-[9px] text-slate-400 font-bold">{f.id} · {f.crop}</p></div>
                                                                    <div className="text-right flex-shrink-0"><p className={`text-lg font-black outfit ${f.status === 'infected' ? 'text-red-600' : 'text-amber-600'}`}>{f.distKm} km</p><p className="text-[8px] text-slate-400 font-bold">distance</p></div>
                                                                </div>
                                                                <div className="flex flex-wrap gap-2">
                                                                    <span className={`text-[8px] font-black px-2 py-1 rounded-full border uppercase ${f.status === 'infected' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>{f.status === 'infected' ? '⚠ Infected' : '◎ At Risk'}</span>
                                                                    {f.sameCrop && <span className="text-[8px] font-black px-2 py-1 rounded-full border uppercase bg-orange-50 text-orange-700 border-orange-200">⚡ Same Crop</span>}
                                                                    {f.disease && <span className="text-[8px] font-bold px-2 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200">{f.disease}</span>}
                                                                </div>
                                                                <div className="flex items-center gap-4 text-[9px] text-slate-500 font-bold"><span className="flex items-center gap-1"><Droplets size={9} />{f.humidity}%</span><span className="flex items-center gap-1"><Thermometer size={9} />{f.temperature}°C</span></div>
                                                                <a href={`https://www.google.com/maps/search/agricultural+pesticide+shop/@${f.lat},${f.lng},14z`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 border border-blue-100 hover:border-blue-600 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all">
                                                                    <MapPin size={10} />Find Agri Shops Near This Farm
                                                                </a>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 text-slate-300">
                                    <MapPin size={36} className="opacity-30" /><p className="font-black uppercase tracking-widest text-sm">Click a farm node<br />to see details</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* MODULE 2 — DISEASE SPREAD PREDICTION */}
            <div className="bg-[#0f172a] rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-8 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center border border-orange-500/30 shadow-sm"><TrendingUp size={24} /></div>
                        <div><p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.3em]">Module 02</p><h3 className="text-2xl font-black text-white outfit uppercase italic tracking-tight">Disease Spread Prediction</h3></div>
                    </div>
                    <div className="px-5 py-2.5 bg-orange-500/10 text-orange-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-500/20 flex items-center gap-2"><Activity size={12} className="animate-pulse" />AI Prediction Engine Active</div>
                </div>
                <div className="p-8 space-y-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[{ label: 'Avg Humidity', value: '74%', icon: Droplets, status: 'warning', desc: 'Favourable for spread' }, { label: 'Avg Temperature', value: '28°C', icon: Thermometer, status: 'warning', desc: 'High disease risk' }, { label: 'Wind Speed', value: '12 km/h', icon: Wind, status: 'neutral', desc: 'NE direction' }, { label: 'Disease Vector', value: 'Airborne', icon: Bug, status: 'danger', desc: 'Spore dispersal' }].map((e, i) => (
                            <div key={i} className={`p-5 rounded-2xl border ${e.status === 'danger' ? 'bg-red-500/10 border-red-500/20' : e.status === 'warning' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-slate-800/60 border-slate-700'}`}>
                                <e.icon size={18} className={`mb-3 ${e.status === 'danger' ? 'text-red-400' : e.status === 'warning' ? 'text-amber-400' : 'text-slate-400'}`} />
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{e.label}</p>
                                <p className="text-2xl font-black text-white outfit italic">{e.value}</p>
                                <p className="text-[9px] text-slate-500 font-bold mt-1">{e.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-5 flex items-center gap-2"><Zap size={12} className="text-orange-400" />Predicted Spread Flow</p>
                        <div className="flex flex-col md:flex-row items-center gap-4 overflow-x-auto pb-2">
                            {[{ id: 'F001', name: 'Green Valley', status: 'infected', risk: 100, crop: 'Wheat', riskLabel: 'SOURCE' }, { id: 'F002', name: 'Sunrise Agro', status: 'at-risk', risk: 82, crop: 'Wheat', riskLabel: 'HIGH RISK' }, { id: 'F005', name: 'Lakshmi Agri', status: 'at-risk', risk: 78, crop: 'Wheat', riskLabel: 'HIGH RISK' }, { id: 'F003', name: 'Krishna Fields', status: 'at-risk', risk: 54, crop: 'Rice', riskLabel: 'MED RISK' }, { id: 'F004', name: 'Heritage Farm', status: 'healthy', risk: 12, crop: 'Cotton', riskLabel: 'LOW RISK' }].map((node, i, arr) => (
                                <React.Fragment key={node.id}>
                                    <div className={`flex-shrink-0 w-44 p-5 rounded-2xl border-2 transition-all cursor-pointer ${node.status === 'infected' ? 'bg-red-500/15 border-red-500/50' : node.risk > 70 ? 'bg-orange-500/15 border-orange-500/50' : node.risk > 40 ? 'bg-amber-500/15 border-amber-500/50' : 'bg-green-500/10 border-green-500/30'}`} onClick={() => setSelFarm(FARMS.find(f => f.id === node.id) || null)}>
                                        <div className="mb-3"><span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${node.status === 'infected' ? 'bg-red-500/20 text-red-400 border-red-500/30' : node.risk > 70 ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : node.risk > 40 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}`}>{node.riskLabel}</span></div>
                                        <p className="text-xs font-black text-white outfit uppercase italic leading-tight mb-1">{node.name}</p>
                                        <p className="text-[9px] text-slate-500 font-bold mb-3">{node.crop}</p>
                                        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-1000 ${node.risk > 70 ? 'bg-red-500' : node.risk > 40 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${node.risk}%` }} /></div>
                                        <p className="text-[10px] font-black text-slate-300 mt-2 outfit">{node.risk}%</p>
                                    </div>
                                    {i < arr.length - 1 && <div className="flex-shrink-0 flex flex-col items-center gap-1"><ArrowRight size={20} className="text-orange-400/60" /><span className="text-[8px] text-slate-600 font-black uppercase tracking-widest hidden md:block">spread</span></div>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* MODULE 3 — NEIGHBOUR FARM ALERT SYSTEM */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center border border-red-100 shadow-sm relative">
                            <Bell size={24} />{unread > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-[8px] font-black flex items-center justify-center">{unread}</span>}
                        </div>
                        <div><p className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em]">Module 03</p><h3 className="text-2xl font-black text-slate-900 outfit uppercase italic tracking-tight">Neighbour Farm Alert System</h3></div>
                    </div>
                    <button onClick={() => setAlerts(p => p.map(a => ({ ...a, read: true })))} className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest border border-slate-200 hover:bg-slate-100 transition-all"><CheckCircle size={14} />Mark All Read</button>
                </div>
                <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-96 border-b lg:border-b-0 lg:border-r border-slate-100 divide-y divide-slate-50">
                        {alerts.map(alert => (
                            <button key={alert.id} onClick={() => { setSelAlert(alert); markRead(alert.id); }} className={`w-full text-left p-6 hover:bg-slate-50 transition-all flex items-start gap-4 ${selAlert?.id === alert.id ? 'bg-slate-50 border-l-4 border-l-red-500' : 'border-l-4 border-l-transparent'} ${!alert.read ? 'bg-red-50/30' : ''}`}>
                                <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${!alert.read ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-slate-300'}`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap"><span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest ${SEV_COLOR[alert.severity]}`}>{alert.severity}</span><span className="text-[9px] text-slate-400 font-bold">{alert.time}</span></div>
                                    <p className="font-black text-slate-900 text-sm truncate">{alert.disease}</p>
                                    <p className="text-[10px] text-slate-500 font-bold">{alert.farmName} · {alert.distance} km away</p>
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="flex-1 p-8 space-y-6">
                        {selAlert ? (
                            <>
                                <div className="space-y-2">
                                    <span className={`inline-flex text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${SEV_COLOR[selAlert.severity]}`}>{selAlert.severity} Severity</span>
                                    <h4 className="text-3xl font-black text-slate-900 outfit italic uppercase tracking-tighter">{selAlert.disease}</h4>
                                    <p className="text-slate-500 text-sm font-bold">Detected at <span className="text-slate-900 font-black">{selAlert.farmName}</span></p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {[{ label: 'Crop', value: selAlert.crop, icon: Leaf }, { label: 'Distance', value: `${selAlert.distance} km`, icon: MapPin }, { label: 'Detected', value: selAlert.time, icon: Activity }].map((d, i) => (
                                        <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2"><d.icon size={16} className="text-slate-400" /><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{d.label}</p><p className="text-base font-black text-slate-900 outfit italic">{d.value}</p></div>
                                    ))}
                                </div>
                                <div className="p-6 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4">
                                    <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                                    <div><p className="font-black text-red-800 text-sm">Your farm may be at risk</p><p className="text-[11px] text-red-600 font-bold mt-1">Airborne spore spread detected. Immediate preventive action recommended.</p></div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-300 py-20"><div className="text-center space-y-3"><Bell size={48} className="mx-auto opacity-30" /><p className="font-black uppercase tracking-widest text-sm">Select an alert</p></div></div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODULE 4 — SMART PREVENTION RECOMMENDATIONS */}
            <div className="bg-[#1a2e1e] rounded-[3rem] border border-green-900/40 shadow-2xl overflow-hidden">
                <div className="p-8 border-b border-green-900/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-2xl flex items-center justify-center border border-green-500/30 shadow-sm"><ShieldCheck size={24} /></div>
                        <div><p className="text-[10px] font-black text-green-400 uppercase tracking-[0.3em]">Module 04</p><h3 className="text-2xl font-black text-white outfit uppercase italic tracking-tight">Smart Prevention Recommendations</h3></div>
                    </div>
                    <div className="flex items-center gap-2 p-1.5 bg-green-900/30 rounded-2xl border border-green-800/40">
                        {(['organic', 'inorganic'] as const).map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-green-500 text-white shadow-lg' : 'text-green-400 hover:text-green-300'}`}>{tab === 'organic' ? '🌿 Organic' : '🧪 Inorganic'}</button>
                        ))}
                    </div>
                </div>
                <div className="p-8 space-y-8">
                    <div className="flex items-center gap-4 p-5 bg-green-900/20 rounded-2xl border border-green-800/30"><Bug size={20} className="text-green-400 flex-shrink-0" /><div><p className="text-[9px] font-black text-green-500 uppercase tracking-widest">Targeting Disease</p><p className="text-xl font-black text-white outfit italic">{prevention.disease}</p></div></div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-5">
                            <div className="flex items-center gap-3">{activeTab === 'organic' ? <Sprout size={18} className="text-green-400" /> : <FlaskConical size={18} className="text-blue-400" />}<p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{activeTab === 'organic' ? 'Organic Treatment Solutions' : 'Inorganic / Chemical Solutions'}</p></div>
                            <div className="space-y-3">
                                {(activeTab === 'organic' ? prevention.organic : prevention.inorganic).map((item, i) => (
                                    <div key={i} className={`flex items-start gap-4 p-5 rounded-2xl border transition-all hover:scale-[1.01] ${activeTab === 'organic' ? 'bg-green-900/20 border-green-800/30 hover:border-green-500/40' : 'bg-blue-900/20 border-blue-800/30 hover:border-blue-500/40'}`}>
                                        <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black ${activeTab === 'organic' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>{i + 1}</span>
                                        <p className="text-sm font-bold text-slate-200 leading-relaxed">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-5">
                            <div className="flex items-center gap-3"><Shield size={18} className="text-amber-400" /><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Preventive Farming Tips</p></div>
                            <div className="space-y-3">
                                {prevention.tips.map((tip, i) => (
                                    <div key={i} className="flex items-start gap-4 p-5 bg-amber-900/15 border border-amber-800/25 rounded-2xl hover:border-amber-500/40 transition-all hover:scale-[1.01]">
                                        <CheckCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" /><p className="text-sm font-bold text-slate-200 leading-relaxed">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-4 p-6 bg-green-500/10 border border-green-500/20 rounded-2xl">
                        <Zap size={24} className="text-green-400 flex-shrink-0" />
                        <div className="flex-1 text-center md:text-left"><p className="font-black text-green-300 text-sm uppercase tracking-wide">Apply preventive treatment immediately</p><p className="text-[11px] text-green-600 font-bold mt-1">Early action reduces spread risk by up to 80%.</p></div>
                        <a href="#" className="flex-shrink-0 px-8 py-4 bg-green-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-green-400 transition-all shadow-xl active:scale-95">Get Full Protocol →</a>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default SmartMonitor;
