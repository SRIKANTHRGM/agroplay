import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Info,
  BarChart3,
  Table as TableIcon,
  Zap,
  Activity,
  ArrowDown,
  ArrowUp,
  Loader2,
  Calendar,
  IndianRupee,
  X,
  ChevronRight,
  TrendingDown,
  BrainCircuit,
  Maximize2,
  // Added missing Download icon import
  Download
} from 'lucide-react';
import { analyzeMarketDemand, generatePriceForecast } from '../services/geminiService';
import { AVAILABLE_CROPS } from '../types';

const Market: React.FC = () => {
  const [demandAnalysis, setDemandAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Forecast States
  const [showForecastModal, setShowForecastModal] = useState(false);
  const [selectedForecastCrop, setSelectedForecastCrop] = useState(AVAILABLE_CROPS[0].name);
  const [forecastData, setForecastData] = useState<any>(null);
  const [loadingForecast, setLoadingForecast] = useState(false);

  const [marketPrices, setMarketPrices] = useState([
    { name: 'Organic Turmeric', price: 145, unit: 'kg', trend: '+18%', status: 'high' },
    { name: 'Basmati Rice', price: 82, unit: 'kg', trend: '+5%', status: 'high' },
    { name: 'Potatoes', price: 22, unit: 'kg', trend: '-12%', status: 'low' },
    { name: 'Cotton (Short)', price: 62, unit: 'kg', trend: '+2%', status: 'medium' },
    { name: 'Mustard Seeds', price: 55, unit: 'kg', trend: '+30%', status: 'high' },
    { name: 'Wheat (Grade A)', price: 28, unit: 'kg', trend: '+1%', status: 'medium' },
    { name: 'Onions (Red)', price: 35, unit: 'kg', trend: '+22%', status: 'high' }
  ]);

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketPrices(prev => prev.map(item => ({
        ...item,
        price: +(item.price + (Math.random() * 2 - 1)).toFixed(2)
      })));
      setCurrentDate(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const revenueData = [
    { month: 'May', value: 45000 },
    { month: 'Jun', value: 52000 },
    { month: 'Jul', value: 38000 },
    { month: 'Aug', value: 61000 },
    { month: 'Sep', value: 75000 },
    { month: 'Oct', value: 89000 },
  ];

  const maxRevenue = Math.max(...revenueData.map(d => d.value));

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      try {
        const cropNames = AVAILABLE_CROPS.map(c => c.name);
        const result = await analyzeMarketDemand(cropNames);
        setDemandAnalysis(result);
      } catch (error) {
        console.error("Failed to fetch market analysis", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, []);

  const handleFetchForecast = async (crop: string) => {
    setLoadingForecast(true);
    setForecastData(null);
    try {
      const result = await generatePriceForecast(crop);
      setForecastData(result);
    } catch (e) {
      console.error(e);
      // Local fallback if service fails entirely
      setForecastData({
        cropName: crop,
        currentPrice: "Market Stable",
        forecast: [
          { week: "Week 1", predictedPrice: "₹--", trend: "Stable", confidence: 50 },
          { week: "Week 2", predictedPrice: "₹--", trend: "Stable", confidence: 40 }
        ],
        neuralInsights: "Mandi telemetry connection interrupted. Using historical seasonal averages."
      });
    } finally {
      setLoadingForecast(false);
    }
  };

  const openForecast = (cropName?: string) => {
    const target = cropName || selectedForecastCrop;
    setSelectedForecastCrop(target);
    setShowForecastModal(true);
    handleFetchForecast(target);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white outfit tracking-tight italic uppercase">Market Scope Hub</h2>
          <p className="text-slate-300 text-lg uppercase tracking-wide font-medium">Intelligent insights and real-time trends for the modern Indian farmer.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm">
          <Calendar className="text-green-600" size={20} />
          <div>
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest leading-none">Market Outlook</p>
            <p className="text-sm font-bold text-slate-100">
              {currentDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* AI Demand Analysis Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-white outfit flex items-center gap-3 italic uppercase">
            <Sparkles className="text-amber-500" size={24} fill="currentColor" /> AI Market Analysis
          </h3>
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-amber-100">
            <Zap size={12} fill="currentColor" /> Gemini Flash 2.0
          </div>
        </div>

        {loading ? (
          <div className="bg-slate-900 rounded-[3rem] p-20 border border-green-500/10 shadow-2xl flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="animate-spin text-green-400" size={48} />
            <div>
              <p className="text-xl font-black text-white outfit uppercase italic">Analyzing Market Trends...</p>
              <p className="text-slate-300 uppercase tracking-widest text-[10px] font-black">Our AI is crunching real-time mandi data and seasonal cycles.</p>
            </div>
          </div>
        ) : demandAnalysis ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* High Demand */}
            <div className="bg-green-50 rounded-[2.5rem] p-8 border border-green-100 shadow-sm space-y-6 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-green-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-100">
                  <ArrowUp size={24} />
                </div>
                <span className="px-3 py-1 bg-green-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest">High Demand</span>
              </div>
              <div className="flex-1 space-y-4">
                {demandAnalysis.highDemand.map((item: any, i: number) => (
                  <div key={i} className="bg-slate-900/80 p-4 rounded-2xl shadow-xl border border-green-500/20">
                    <p className="font-black text-white text-sm mb-1 uppercase italic">{item.name}</p>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium uppercase tracking-wide">{item.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Medium Demand */}
            <div className="bg-blue-50 rounded-[2.5rem] p-8 border border-blue-100 shadow-sm space-y-6 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
                  <Activity size={24} />
                </div>
                <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest">Stable Demand</span>
              </div>
              <div className="flex-1 space-y-4">
                {demandAnalysis.mediumDemand.map((item: any, i: number) => (
                  <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-blue-100/30">
                    <p className="font-bold text-slate-800 text-sm mb-1">{item.name}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Low Demand */}
            <div className="bg-slate-900/50 rounded-[2.5rem] p-8 border border-white/5 shadow-2xl space-y-6 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-slate-800 text-white rounded-2xl flex items-center justify-center border border-white/10 shadow-lg shadow-slate-900">
                  <ArrowDown size={24} />
                </div>
                <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">Low Demand</span>
              </div>
              <div className="flex-1 space-y-4">
                {demandAnalysis.lowDemand.map((item: any, i: number) => (
                  <div key={i} className="bg-slate-900/80 p-4 rounded-2xl shadow-xl border border-white/5">
                    <p className="font-black text-white text-sm mb-1 uppercase italic">{item.name}</p>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium uppercase tracking-wide">{item.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Revenue Chart (Simulated) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-10 border border-green-500/10 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/10 text-green-400 rounded-2xl flex items-center justify-center border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                <BarChart3 size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white outfit uppercase italic">Monthly Sales Revenue</h3>
                <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Performance Tracking</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-white outfit uppercase italic">₹3,64,000</p>
              <p className="text-[10px] text-green-400 font-black uppercase tracking-widest">+12% vs last quarter</p>
            </div>
          </div>

          <div className="flex items-end justify-between h-64 gap-4 px-4 relative z-10">
            {revenueData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                <div className="relative w-full flex items-end justify-center">
                  <div
                    className="w-full max-w-[40px] bg-green-500/20 rounded-t-xl transition-all duration-700 group-hover:bg-green-500 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] border border-green-500/10"
                    style={{ height: `${(d.value / maxRevenue) * 100}%` }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-950 text-green-400 text-[10px] px-2 py-1 rounded border border-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-black uppercase tracking-widest shadow-2xl">
                      ₹{(d.value / 1000).toFixed(0)}k
                    </div>
                  </div>
                </div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{d.month}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5">
            <TrendingUp size={200} />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <IndianRupee size={28} className="text-green-400" />
            </div>
            <h4 className="text-3xl font-black outfit leading-tight uppercase italic">Mandi Pricing Strategies</h4>
            <p className="text-slate-200 text-sm leading-relaxed font-black uppercase tracking-wide">AI analysis suggests holding your turmeric stock for 3 more weeks to capitalize on a projected 15% price spike in the North Indian Mandis.</p>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-green-400 uppercase tracking-widest">
                <Info size={14} /> Expert Tip
              </div>
              <p className="text-xs text-white/70 leading-relaxed italic">"Always check the moisture content (MC) before taking grains to the Mandi. Lower MC often fetches a 5-10% premium."</p>
            </div>
            <button
              onClick={openForecast}
              className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 transition-all shadow-xl shadow-green-900/20 active:scale-95"
            >
              View Price Forecasts
            </button>
          </div>
        </div>
      </div>

      {/* Current Crop Prices Table */}
      <div className="bg-slate-900 rounded-[3rem] border border-green-500/10 shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/50 backdrop-blur-xl relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-800 text-green-400 rounded-2xl flex items-center justify-center shadow-inner border border-white/5">
              <TableIcon size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white outfit uppercase italic">Live Mandi Prices</h3>
              <p className="text-[10px] text-green-500/40 font-black uppercase tracking-[0.2em] italic">Simulated Real-time Data</p>
            </div>
          </div>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Filter crops..."
              className="w-full bg-slate-800 border border-white/5 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-green-400 focus:ring-2 focus:ring-green-500 transition-all shadow-inner placeholder:opacity-20"
            />
          </div>
        </div>
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/80 text-green-500/40 text-[10px] font-black uppercase tracking-[0.3em] border-b border-white/5">
                <th className="px-10 py-5">Commodity</th>
                <th className="px-10 py-5">Current Rate</th>
                <th className="px-10 py-5">24h Trend</th>
                <th className="px-10 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {marketPrices.map((item, i) => (
                <tr key={i} className="hover:bg-green-500/5 transition-colors group">
                  <td className="px-10 py-6">
                    <p className="font-black text-white group-hover:text-green-400 transition-colors uppercase italic">{item.name}</p>
                    <p className="text-[9px] text-green-500/30 uppercase font-black tracking-widest italic leading-none">AGMARKNET Verified</p>
                  </td>
                  <td className="px-10 py-6">
                    <p className="text-xl font-black text-green-400 outfit uppercase italic">₹{item.price}/{item.unit}</p>
                  </td>
                  <td className="px-10 py-6">
                    <div className={`flex items-center gap-1 font-black outfit uppercase italic ${item.status === 'high' ? 'text-green-400' : item.status === 'low' ? 'text-rose-500' : 'text-slate-500'}`}>
                      {item.trend} {item.status === 'high' ? <ArrowUpRight size={18} className="neon-flicker" /> : <ArrowDownRight size={18} />}
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button
                      onClick={() => openForecast(item.name.replace('Organic ', '').replace(' (Red)', '').replace(' (Grade A)', ''))}
                      className="text-[10px] font-black text-slate-400 hover:text-green-400 transition-all border-b border-transparent hover:border-green-400 uppercase tracking-widest italic"
                    >
                      AI Forecast
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRICE FORECAST MODAL */}
      {showForecastModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-slate-900 w-full max-w-5xl rounded-[4rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-500 relative border border-green-500/20">
            {/* Modal Left - Selection & Context */}
            <div className="w-full md:w-1/3 bg-slate-900 p-10 text-white space-y-10 border-r border-white/5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-400">
                  <BrainCircuit size={20} />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Neural Mandi Engine</span>
                </div>
                <h3 className="text-4xl font-black outfit tracking-tighter">Market Predictor</h3>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Commodity</label>
                <div className="space-y-2">
                  {AVAILABLE_CROPS.slice(0, 8).map(crop => (
                    <button
                      key={crop.id}
                      onClick={() => { setSelectedForecastCrop(crop.name); handleFetchForecast(crop.name); }}
                      className={`w-full text-left px-6 py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-between group ${selectedForecastCrop === crop.name ? 'bg-green-600 text-white shadow-xl' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                    >
                      {crop.name}
                      <ChevronRight size={16} className={`transition-transform ${selectedForecastCrop === crop.name ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 mt-auto">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Algorithm Data</p>
                <p className="text-xs text-slate-400 leading-relaxed">Analysis derived from 5-year historical trends, current monsoon patterns, and global trade reports.</p>
              </div>
            </div>

            {/* Modal Right - Dashboard */}
            <div className="flex-1 p-12 bg-slate-900 flex flex-col overflow-y-auto custom-scrollbar relative">
              <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
              <div className="flex justify-between items-start mb-12 relative z-10">
                <div>
                  <h4 className="text-4xl font-black text-white outfit tracking-tighter mb-2 uppercase italic">{selectedForecastCrop} Analysis</h4>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">4-Week Projection</span>
                    {forecastData && <span className="text-xs font-black text-slate-300 uppercase italic">Current Rate: {forecastData.currentPrice}</span>}
                  </div>
                </div>
                <button onClick={() => setShowForecastModal(false)} className="p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-all text-slate-400 hover:text-white border border-white/5">
                  <X size={28} />
                </button>
              </div>

              {loadingForecast ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in relative z-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500/10 rounded-full animate-ping" />
                    <div className="w-24 h-24 bg-slate-800 rounded-[2rem] border-4 border-green-500/20 flex items-center justify-center text-green-400 shadow-2xl">
                      <Loader2 size={48} className="animate-spin" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-xl font-black text-white outfit uppercase italic">Computing Future Values...</p>
                    <p className="text-[10px] font-black text-green-500/40 uppercase tracking-[0.3em] italic">Aggregating Mandi Telemetry</p>
                  </div>
                </div>
              ) : forecastData ? (
                <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
                  {/* Forecast Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                    {forecastData.forecast.map((week: any, i: number) => (
                      <div key={i} className="p-8 bg-slate-900/50 rounded-[2.5rem] border border-white/5 group hover:bg-slate-800 hover:shadow-2xl transition-all cursor-default relative overflow-hidden shadow-inner">
                        <div className="space-y-4 relative z-10">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{week.week}</p>
                          <p className="text-3xl font-black text-white outfit">{week.predictedPrice}</p>
                          <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${week.trend === 'Up' ? 'text-green-400' : week.trend === 'Down' ? 'text-rose-500' : 'text-blue-400'}`}>
                              {week.trend === 'Up' ? <TrendingUp size={14} /> : week.trend === 'Down' ? <TrendingDown size={14} /> : <Activity size={14} />}
                              {week.trend}
                            </div>
                            <div className="text-[9px] font-black text-slate-500 uppercase">Conf: {week.confidence}%</div>
                          </div>
                        </div>
                        {/* Simple Bar Chart Visual */}
                        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-800">
                          <div
                            className={`h-full transition-all duration-[1.5s] ${week.trend === 'Up' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : week.trend === 'Down' ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' : 'bg-blue-500 shadow-[0_0_10px_#3b82f6]'}`}
                            style={{ width: `${week.confidence}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Deep Insights */}
                  <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                      <Info size={160} />
                    </div>
                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                          <Zap size={24} className="text-amber-400" />
                        </div>
                        <h5 className="text-2xl font-black outfit tracking-tight">Neural Market Insights</h5>
                      </div>
                      <p className="text-slate-300 text-lg leading-relaxed font-medium italic">
                        "{forecastData.neuralInsights}"
                      </p>
                      <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Decision Matrix Updated Now</p>
                        </div>
                        <button className="flex items-center gap-3 px-8 py-3 bg-white text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-50 transition-all shadow-xl active:scale-95">
                          Expert Trading PDF <Download size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                  <div className="w-32 h-32 bg-slate-100 rounded-[2.5rem] flex items-center justify-center">
                    <TrendingUp size={64} />
                  </div>
                  <p className="text-xl font-black outfit uppercase tracking-widest">Awaiting Engine Signal</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Market;