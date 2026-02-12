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
import { analyzeMarketDemand, generatePriceForecast, fetchGlobalHarvestOutlook } from '../services/geminiService';
import { AVAILABLE_CROPS } from '../types';

import { useTranslation } from 'react-i18next'; // Added import

const Market: React.FC = () => {
  const { t } = useTranslation(); // Added hook
  const [demandAnalysis, setDemandAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [marketPrices, setMarketPrices] = useState([
    { name: 'Organic Turmeric', price: 145, unit: 'kg', trend: '+18%', status: 'high' },
    { name: 'Basmati Rice', price: 82, unit: 'kg', trend: '+5%', status: 'high' },
    { name: 'Potatoes', price: 22, unit: 'kg', trend: '-12%', status: 'low' },
    { name: 'Cotton (Short)', price: 62, unit: 'kg', trend: '+2%', status: 'medium' },
    { name: 'Mustard Seeds', price: 55, unit: 'kg', trend: '+30%', status: 'high' },
    { name: 'Wheat (Grade A)', price: 28, unit: 'kg', trend: '+1%', status: 'medium' },
    { name: 'Onions (Red)', price: 35, unit: 'kg', trend: '+22%', status: 'high' }
  ]);

  // Forecast States
  const [showForecastModal, setShowForecastModal] = useState(false);
  const [selectedForecastCrop, setSelectedForecastCrop] = useState(AVAILABLE_CROPS[0].name);
  const [forecastData, setForecastData] = useState<any>(null);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [harvestOutlook, setHarvestOutlook] = useState<any[]>([]);
  const [loadingHarvest, setLoadingHarvest] = useState(true);
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

    const fetchHarvestData = async () => {
      setLoadingHarvest(true);
      try {
        const result = await fetchGlobalHarvestOutlook();
        setHarvestOutlook(result);
      } catch (error) {
        console.error("Failed to fetch harvest outlook", error);
      } finally {
        setLoadingHarvest(false);
      }
    };
    fetchHarvestData();
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
          <h2 className="text-4xl font-black text-slate-900 outfit tracking-tight italic uppercase">{t('market.title')}</h2>
          <p className="text-slate-500 text-lg uppercase tracking-wide font-medium">{t('market.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm">
          <Calendar className="text-green-600" size={20} />
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">{t('market.outlook_title')}</p>
            <p className="text-sm font-bold text-slate-900">
              {currentDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* AI Demand Analysis Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-slate-900 outfit flex items-center gap-3 italic uppercase">
            <Sparkles className="text-amber-500" size={24} fill="currentColor" /> {t('market.ai_analysis')}
          </h3>
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-amber-100">
            <Zap size={12} fill="currentColor" /> {t('market.gemini_model')}
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-[3rem] p-20 border border-slate-100 shadow-xl flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="animate-spin text-green-600" size={48} />
            <div>
              <p className="text-xl font-black text-slate-900 outfit uppercase italic">{t('market.analyzing')}</p>
              <p className="text-slate-500 uppercase tracking-widest text-[10px] font-black">{t('market.analyzing_desc')}</p>
            </div>
          </div>
        ) : demandAnalysis ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* High Demand */}
            <div className="bg-green-50 rounded-[2.5rem] p-8 border border-green-100 shadow-sm space-y-6 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-green-800 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-100">
                  <ArrowUp size={24} />
                </div>
                <span className="px-3 py-1 bg-green-800 text-white rounded-full text-[10px] font-bold uppercase tracking-widest">{t('market.demand.high')}</span>
              </div>
              <div className="flex-1 space-y-4">
                {demandAnalysis.highDemand.map((item: any, i: number) => (
                  <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-green-100">
                    <p className="font-black text-slate-900 text-sm mb-1 uppercase italic">{item.name}</p>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium uppercase tracking-wide">{item.reason}</p>
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
                <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest">{t('market.demand.stable')}</span>
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
            <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center border border-slate-200 shadow-inner">
                  <ArrowDown size={24} />
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">{t('market.demand.low')}</span>
              </div>
              <div className="flex-1 space-y-4">
                {demandAnalysis.lowDemand.map((item: any, i: number) => (
                  <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    <p className="font-black text-slate-900 text-sm mb-1 uppercase italic">{item.name}</p>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium uppercase tracking-wide">{item.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Strategic Harvest Planner */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-slate-900 outfit flex items-center gap-3 italic uppercase">
            <Calendar className="text-green-600" size={24} /> {t('market.harvest_planner')}
          </h3>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-green-500/20 pb-1">{t('market.roi_projections')}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {loadingHarvest ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-[2.5rem] border border-slate-200" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {harvestOutlook.map((item, i) => (
                  <div key={i} className="p-6 bg-white rounded-[2rem] border border-slate-100 hover:border-green-300 transition-all group relative overflow-hidden shadow-lg hover:shadow-xl">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <TrendingUp size={48} className="text-green-600" />
                    </div>
                    <div className="space-y-3 relative z-10">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] font-black text-green-700/60 uppercase tracking-widest leading-none mb-1">{item.harvestWindow}</p>
                          <h6 className="text-xl font-black text-slate-900 outfit uppercase italic">{item.name}</h6>
                        </div>
                        <div className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${item.roiPotential === 'High' ? 'bg-green-50 text-green-700 shadow-sm border border-green-100' : 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'}`}>
                          {item.roiPotential} ROI
                        </div>
                      </div>
                      <div className="flex items-end justify-between">
                        <p className="text-2xl font-black text-amber-500 outfit leading-none">{item.projectedPrice}</p>
                        <span className="text-[9px] font-black text-slate-400 uppercase italic">{t('market.projected_value')}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight italic font-medium">"{item.strategy}"</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-green-900 p-8 rounded-[3rem] border border-green-800 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-white opacity-5" />
            <div className="space-y-6 relative z-10">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg">
                <Maximize2 size={24} className="text-white" />
              </div>
              <h4 className="text-3xl font-black text-white outfit leading-tight uppercase italic">{t('market.optimization_title')}</h4>
              <p className="text-xs text-green-100 leading-relaxed uppercase font-black tracking-wider opacity-80">
                {t('market.optimization_desc')}
              </p>
            </div>
            <div className="pt-8 relative z-10">
              <div className="p-4 bg-black/20 rounded-2xl border border-white/5 backdrop-blur-md">
                <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1 italic">{t('market.pro_strategy')}</p>
                <p className="text-[10px] text-green-50 font-bold uppercase italic leading-tight">{t('market.strategy_tip')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Revenue Chart (Simulated) */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-[0.03] pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-50 text-green-700 rounded-2xl flex items-center justify-center border border-green-100 shadow-sm">
                <BarChart3 size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 outfit uppercase italic">{t('market.revenue_title')}</h3>
                <p className="text-xs text-slate-500 font-black uppercase tracking-widest">{t('market.performance_tracking')}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-slate-900 outfit uppercase italic">₹3,64,000</p>
              <p className="text-[10px] text-green-600 font-black uppercase tracking-widest">{t('market.vs_last_quarter')}</p>
            </div>
          </div>

          <div className="flex items-end justify-between h-64 gap-4 px-4 relative z-10">
            {revenueData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                <div className="relative w-full flex items-end justify-center">
                  <div
                    className="w-full max-w-[40px] bg-green-500 rounded-t-xl transition-all duration-700 group-hover:bg-green-600 group-hover:shadow-lg border border-green-600/10"
                    style={{ height: `${(d.value / maxRevenue) * 100}%` }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-black uppercase tracking-widest shadow-xl">
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
        <div className="bg-white rounded-[3rem] p-10 text-slate-900 space-y-8 relative overflow-hidden border border-slate-200 shadow-xl">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
            <TrendingUp size={200} />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center border border-green-100">
              <IndianRupee size={28} className="text-green-600" />
            </div>
            <h4 className="text-3xl font-black outfit leading-tight uppercase italic">{t('market.pricing_strategies')}</h4>
            <p className="text-slate-500 text-sm leading-relaxed font-black uppercase tracking-wide">{t('market.pricing_desc')}</p>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-green-700 uppercase tracking-widest">
                <Info size={14} /> {t('market.expert_tip')}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">"{t('market.expert_tip_content')}"</p>
            </div>
            <button
              onClick={() => openForecast()}
              className="w-full bg-green-800 text-white py-4 rounded-2xl font-bold hover:bg-green-700 transition-all shadow-xl shadow-green-100 active:scale-95"
            >
              {t('market.view_forecasts')}
            </button>
          </div>
        </div>
      </div>

      {/* Current Crop Prices Table */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden relative">
        <div className="absolute inset-0 grid-bg opacity-[0.03] pointer-events-none" />
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/50 backdrop-blur-xl relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-50 text-green-600 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
              <TableIcon size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 outfit uppercase italic">{t('market.live_prices')}</h3>
              <p className="text-[10px] text-green-600/60 font-black uppercase tracking-[0.2em] italic">{t('market.simulated_data')}</p>
            </div>
          </div>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder={t('market.filter_placeholder')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-900 focus:ring-2 focus:ring-green-500 transition-all shadow-inner placeholder:text-slate-400"
            />
          </div>
        </div>
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] border-b border-slate-100">
                <th className="px-10 py-5">{t('market.table.commodity')}</th>
                <th className="px-10 py-5">{t('market.table.rate')}</th>
                <th className="px-10 py-5">{t('market.table.trend')}</th>
                <th className="px-10 py-5 text-right">{t('market.table.action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {marketPrices.map((item, i) => (
                <tr key={i} className="hover:bg-green-50 transition-colors group">
                  <td className="px-10 py-6">
                    <p className="font-black text-slate-900 group-hover:text-green-700 transition-colors uppercase italic">{item.name}</p>
                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest italic leading-none">{t('market.agmarknet_verified')}</p>
                  </td>
                  <td className="px-10 py-6">
                    <p className="text-xl font-black text-green-700 outfit uppercase italic">₹{item.price}/{item.unit}</p>
                  </td>
                  <td className="px-10 py-6">
                    <div className={`flex items-center gap-1 font-black outfit uppercase italic ${item.status === 'high' ? 'text-green-600' : item.status === 'low' ? 'text-rose-600' : 'text-slate-500'}`}>
                      {item.trend} {item.status === 'high' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button
                      onClick={() => openForecast(item.name.replace('Organic ', '').replace(' (Red)', '').replace(' (Grade A)', ''))}
                      className="text-[10px] font-black text-slate-400 hover:text-green-600 transition-all border-b border-transparent hover:border-green-600 uppercase tracking-widest italic"
                    >
                      {t('market.ai_forecast')}
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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-white w-full max-w-6xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh] animate-in zoom-in-95 duration-500 relative border border-slate-100">
            {/* Modal Left - Selection & Context */}
            <div className="w-full md:w-96 md:min-w-[320px] flex-shrink-0 bg-slate-50 px-6 py-10 text-slate-900 space-y-10 border-r border-slate-100 overflow-y-auto custom-scrollbar relative z-20">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-green-700">
                  <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center border border-green-200 shadow-sm">
                    <BrainCircuit size={18} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-80">{t('market.neural_engine')}</span>
                </div>
                <h3 className="text-4xl font-black outfit tracking-tighter leading-none italic uppercase">{t('market.market_predictor')}</h3>
              </div>

              <div className="space-y-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <div className="w-1 h-1 bg-green-500 rounded-full" />
                  {t('market.strategic_selection')}
                </label>
                <div className="space-y-2">
                  {AVAILABLE_CROPS.slice(0, 8).map(crop => (
                    <button
                      key={crop.id}
                      onClick={() => { setSelectedForecastCrop(crop.name); handleFetchForecast(crop.name); }}
                      className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-black transition-all flex items-center justify-between group border ${selectedForecastCrop === crop.name ? 'bg-green-800 text-white border-green-700 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:bg-white hover:text-green-700 hover:border-green-300'}`}
                    >
                      <span className="truncate">{crop.name}</span>
                      <ChevronRight size={16} className={`flex-shrink-0 transition-transform ${selectedForecastCrop === crop.name ? 'translate-x-1 outline-none' : 'opacity-0 group-hover:opacity-100'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-white rounded-[2rem] border border-slate-200 mt-auto shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('market.algo_data')}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{t('market.algo_desc')}</p>
              </div>
            </div>

            {/* Modal Right - Dashboard */}
            <div className="flex-1 p-12 bg-white flex flex-col overflow-y-auto custom-scrollbar relative">
              <div className="absolute inset-0 grid-bg opacity-[0.03] pointer-events-none" />
              <div className="flex justify-between items-start mb-12 relative z-10">
                <div>
                  <h4 className="text-4xl font-black text-slate-900 outfit tracking-tighter mb-2 uppercase italic">{selectedForecastCrop} {t('market.analysis_suffix')}</h4>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-200">{t('market.projection_4w')}</span>
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-200 shadow-sm">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                      {t('market.live_signal')}
                    </div>
                    {forecastData && <span className="text-xs font-black text-slate-400 uppercase italic">{t('market.current_rate')}: {forecastData.currentPrice}</span>}
                  </div>
                </div>
                <button onClick={() => setShowForecastModal(false)} className="p-4 bg-slate-50 hover:bg-rose-50 rounded-2xl transition-all text-slate-400 hover:text-rose-600 border border-slate-200">
                  <X size={28} />
                </button>
              </div>

              {loadingForecast ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in relative z-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500/10 rounded-full animate-ping" />
                    <div className="w-24 h-24 bg-white rounded-[2rem] border-4 border-green-100 flex items-center justify-center text-green-600 shadow-xl">
                      <Loader2 size={48} className="animate-spin" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-xl font-black text-slate-900 outfit uppercase italic">{t('market.computing_values')}</p>
                    <p className="text-[10px] font-black text-green-600/60 uppercase tracking-[0.3em] italic">{t('market.aggregating_telemetry')}</p>
                  </div>
                </div>
              ) : forecastData ? (
                <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
                  {/* Forecast Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                    {forecastData.forecast.map((week: any, i: number) => (
                      <div key={i} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 group hover:bg-white hover:shadow-xl transition-all cursor-default relative overflow-hidden shadow-sm">
                        <div className="space-y-4 relative z-10">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{week.week}</p>
                          <p className="text-3xl font-black text-slate-900 outfit">{week.predictedPrice}</p>
                          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                            <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${week.trend === 'Up' ? 'text-green-600' : week.trend === 'Down' ? 'text-rose-600' : 'text-blue-600'}`}>
                              {week.trend === 'Up' ? <TrendingUp size={14} /> : week.trend === 'Down' ? <TrendingDown size={14} /> : <Activity size={14} />}
                              {week.trend}
                            </div>
                            <div className="text-[9px] font-black text-slate-400 uppercase">Conf: {week.confidence}%</div>
                          </div>
                        </div>
                        {/* Simple Bar Chart Visual */}
                        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-100">
                          <div
                            className={`h-full transition-all duration-[1.5s] ${week.trend === 'Up' ? 'bg-green-500' : week.trend === 'Down' ? 'bg-rose-500' : 'bg-blue-500'}`}
                            style={{ width: `${week.confidence}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Post-Harvest Intelligence */}
                  <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-1000">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-4">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-amber-50 backdrop-blur-md rounded-2xl flex items-center justify-center border border-amber-200 shadow-sm">
                          <TrendingUp size={28} className="text-amber-600" />
                        </div>
                        <div>
                          <h5 className="text-3xl font-black text-slate-900 outfit tracking-tight uppercase italic">{t('market.post_harvest_intelligence')}</h5>
                          <p className="text-[11px] font-black text-amber-600/60 uppercase tracking-[0.4em]">{t('market.strategic_outlook')}</p>
                        </div>
                      </div>

                      {/* Harvest Period Badge */}
                      <div className="px-8 py-4 bg-slate-50 rounded-[2rem] border border-amber-200 flex flex-col justify-center items-center backdrop-blur-xl">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('market.harvest_window')}</p>
                        <p className="text-xl font-black text-amber-600 outfit uppercase italic tracking-tighter">
                          {forecastData.postHarvestOutlook?.harvestingPeriod || 'Seasonal'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                      <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 space-y-4 shadow-lg">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('market.market_hype')}</p>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed italic">"{forecastData.postHarvestOutlook?.hype || 'Mandi telemetry suggests strong seasonal accumulation patterns.'}"</p>
                      </div>
                      <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 space-y-4 shadow-lg">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('market.expected_demand')}</p>
                        <div className="flex items-center gap-3">
                          <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${forecastData.postHarvestOutlook?.demand === 'High' ? 'bg-green-50 text-green-700 border border-green-200' : forecastData.postHarvestOutlook?.demand === 'Low' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                            {forecastData.postHarvestOutlook?.demand || 'Stable'} Demand
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">{t('market.post_harvest_cycle')}</p>
                      </div>
                      <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 space-y-4 shadow-lg flex flex-col justify-between">
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{t('market.est_market_value')}</p>
                          <p className="text-2xl font-black text-slate-900 outfit leading-tight">{forecastData.postHarvestOutlook?.estimatedValue || t('market.calculating')}</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                          <p className="text-[10px] text-green-700 font-black uppercase tracking-widest italic">{t('market.roi_projection')}</p>
                          <span className="text-2xl font-black text-green-600 outfit">
                            {forecastData.postHarvestOutlook?.projectedROI || '0%'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Deep Insights */}
                  <div className="bg-white rounded-[3rem] p-10 text-slate-900 relative overflow-hidden group border border-slate-100 shadow-xl">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                      <Info size={160} />
                    </div>
                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 backdrop-blur-md rounded-2xl flex items-center justify-center border border-slate-200">
                          <Zap size={24} className="text-amber-500" />
                        </div>
                        <h5 className="text-2xl font-black outfit tracking-tight">{t('market.neural_insights')}</h5>
                      </div>
                      <p className="text-slate-500 text-lg leading-relaxed font-medium italic">
                        "{forecastData.neuralInsights}"
                      </p>
                      <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('market.decision_matrix_updated')}</p>
                        </div>
                        <button className="flex items-center gap-3 px-8 py-3 bg-slate-50 text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-50 transition-all shadow-md active:scale-95 border border-slate-200">
                          {t('market.expert_pdf')} <Download size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                  <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border border-slate-100">
                    <TrendingUp size={64} className="text-slate-300" />
                  </div>
                  <p className="text-xl font-black outfit uppercase tracking-widest text-slate-300">{t('market.awaiting_signal')}</p>
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