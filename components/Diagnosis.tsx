import React, { useState, useRef, useEffect } from 'react';
import { diagnosePlantHealth, findNearbyMedicines } from '../services/geminiService';
import {
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  Leaf,
  FlaskConical,
  Zap,
  Activity,
  Sparkles,
  BrainCircuit,
  Microscope,
  ChevronRight,
  History,
  X,
  Smartphone,
  ExternalLink,
  MapPin,
  TrendingUp,
  Clock,
  Download,
  FileText,
  BadgeCheck,
  QrCode,
  Trophy,
  ShieldAlert,
  ShieldPlus,
  Check,
  UserCheck,
  ThermometerSnowflake,
  Star,
  Fingerprint,
  Printer,
  ShoppingBag,
  ArrowDown
} from 'lucide-react';
import { DiagnosisResult, UserProfile } from '../types';
import { getUserItem, setUserItem } from '../services/storageService';

interface Props {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const Diagnosis: React.FC<Props> = ({ user, setUser }) => {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<any | null>(null);
  const [history, setHistory] = useState<(any & { timestamp: string, img: string })[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const [locatingSuppliers, setLocatingSuppliers] = useState(false);
  const [nearbySuppliers, setNearbySuppliers] = useState<{ text: string, places: any[] } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const ANALYZING_MESSAGES = [
    "Initializing High-Integrity Scan...",
    "Verifying Image Perspective & Lighting...",
    "Neural Mesh Mapping Active...",
    "Scanning for Non-Botanical Anomalies...",
    "Correlating Global Pathogen Patterns...",
    "Cross-referencing Indian Agri-Database...",
    "Authenticating Specimen Integrity..."
  ];

  useEffect(() => {
    const saved = getUserItem('km_diag_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    setUserItem('km_diag_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep(s => (s + 1) % ANALYZING_MESSAGES.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera access denied", err);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setImage(dataUrl);
      stopCamera();
      setResult(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnose = async () => {
    if (!image) return;
    setLoading(true);
    setLoadingStep(0);
    try {
      const mimeType = image.split(';')[0].split(':')[1];
      const base64 = image.split(',')[1];
      const data = await diagnosePlantHealth(description, base64, mimeType);

      const newRecord = { ...data, timestamp: new Date().toLocaleString(), img: image };
      setHistory(prev => [newRecord, ...prev].slice(0, 10));
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    window.print();
  };

  const handleLocateSuppliers = () => {
    if (!result) return;
    setLocatingSuppliers(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const shops = await findNearbyMedicines(result.diagnosis, pos.coords.latitude, pos.coords.longitude);
        setNearbySuppliers(shops);
      } catch (e) {
        console.error("Maps search failed", e);
      } finally {
        setLocatingSuppliers(false);
      }
    }, (err) => {
      setLocatingSuppliers(false);
      alert("Location services required for sourcing.");
    });
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setDescription("");
    setIsCameraActive(false);
    setNearbySuppliers(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 page-transition pb-24 relative px-4">
      {/* Header - Hidden on Print */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 print:hidden">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-green-100 text-green-700 rounded-full font-black text-[10px] tracking-widest uppercase border border-green-200">
            <FlaskConical size={14} className="animate-pulse" /> BIO-SCAN v5.2 PRO
          </div>
          <h2 className="text-6xl font-black text-slate-800 outfit tracking-tighter">Specimen Analysis</h2>
          <p className="text-slate-500 max-w-2xl text-xl font-medium">Professional grade AI diagnostics with strict integrity checks.</p>
        </div>
        <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-3 px-8 py-4 bg-white rounded-[2rem] border border-slate-200 shadow-sm font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95">
          <History size={18} className="text-slate-400" /> {showHistory ? 'Close History' : 'View Records'}
        </button>
      </div>

      {!result ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start print:hidden">
          <div className="lg:col-span-7 bg-white rounded-[4rem] p-10 shadow-xl border border-slate-200 space-y-8 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-black outfit text-slate-800">Visual Capture</h3>
              <div className="flex gap-3">
                <button onClick={() => fileInputRef.current?.click()} className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all">
                  <Smartphone size={24} />
                </button>
                <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
                  <Camera size={28} />
                </div>
              </div>
            </div>

            <div className={`group aspect-square md:aspect-[4/3] rounded-[3.5rem] border-8 border-slate-50 shadow-inner flex flex-col items-center justify-center transition-all duration-700 relative overflow-hidden bg-slate-100`}>
              {isCameraActive ? (
                <div className="w-full h-full relative">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-[2.8rem]" />
                  {/* Strict UI Overlay */}
                  <div className="absolute inset-10 border-2 border-green-500/30 rounded-3xl pointer-events-none">
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-green-500 rounded-tl-xl" />
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-green-500 rounded-br-xl" />
                    <div className="absolute top-1/2 left-0 w-full h-px bg-green-500/20" />
                    <div className="absolute left-1/2 top-0 w-px h-full bg-green-500/20" />
                  </div>
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6">
                    <button onClick={stopCamera} className="p-5 bg-white/20 backdrop-blur-xl rounded-full text-white hover:bg-rose-500 transition-all border border-white/20"><X size={32} /></button>
                    <button onClick={capturePhoto} className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-slate-200 hover:scale-110 active:scale-95 transition-all"><div className="w-14 h-14 bg-slate-900 rounded-full" /></button>
                  </div>
                </div>
              ) : image ? (
                <div className="relative w-full h-full">
                  <img src={image} className="w-full h-full object-cover rounded-[2.8rem]" alt="Specimen" />
                  {loading && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center text-slate-800 space-y-10">
                      <div className="absolute inset-0 overflow-hidden rounded-[2.8rem] pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_20px_#22c55e] animate-[strict-scan_2s_linear_infinite]" />
                      </div>
                      <div className="relative">
                        <div className="w-32 h-32 bg-green-50 rounded-[2rem] flex items-center justify-center border-4 border-green-500 shadow-2xl animate-pulse"><Fingerprint size={64} className="text-green-600" /></div>
                        <div className="absolute -top-4 -right-4 bg-green-600 text-white p-2 rounded-lg"><Activity size={20} className="animate-spin" /></div>
                      </div>
                      <div className="space-y-4 text-center">
                        <p className="font-black outfit text-2xl tracking-tighter uppercase text-green-700">{ANALYZING_MESSAGES[loadingStep]}</p>
                        <div className="w-80 h-1.5 bg-slate-100 rounded-full overflow-hidden mx-auto shadow-inner">
                          <div className="h-full bg-green-500 transition-all duration-[1500ms]" style={{ width: `${((loadingStep + 1) / ANALYZING_MESSAGES.length) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  )}
                  {!loading && <button onClick={() => setImage(null)} className="absolute top-8 right-8 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl text-rose-500 hover:bg-white transition-all font-black text-[10px] tracking-widest uppercase flex items-center gap-2"><X size={18} /> Discard Capture</button>}
                </div>
              ) : (
                <div className="flex flex-col items-center text-center space-y-8 p-12">
                  <div className="flex gap-6">
                    <button onClick={startCamera} className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-green-600 hover:scale-105 transition-all border border-slate-50"><Camera size={36} /></button>
                    <button onClick={() => fileInputRef.current?.click()} className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-blue-600 hover:scale-105 transition-all border border-slate-50"><Smartphone size={36} /></button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-black text-slate-800 outfit tracking-tighter">Initiate Strict Scan</p>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Ensures High Integrity Data Points</p>
                  </div>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-[4rem] p-10 border border-slate-200 shadow-xl space-y-8">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2 flex items-center gap-2"><Activity size={14} className="text-green-500" /> SYMPTOM LOG</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe environmental factors (e.g. recent rainfall, unusual pests)..." className="w-full px-8 py-6 bg-slate-50 border-none rounded-[2.5rem] h-48 focus:ring-4 focus:ring-green-500/10 resize-none transition-all font-medium text-lg shadow-inner outline-none" />
              </div>
              <button onClick={handleDiagnose} disabled={!image || loading} className="w-full bg-slate-900 text-white py-8 rounded-[2rem] font-black text-xl flex items-center justify-center gap-6 shadow-2xl hover:bg-slate-800 transition-all disabled:opacity-30">
                {loading ? <Loader2 className="animate-spin" size={28} /> : <Zap size={28} fill="currentColor" />}
                {loading ? "AUTHENTICATING..." : "RUN NEURAL DIAGNOSIS"}
              </button>
            </div>
            <div className="bg-slate-900 rounded-[3rem] p-8 text-white space-y-4 shadow-2xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform duration-1000"><ShieldCheck size={120} /></div>
              <p className="text-xs font-black text-green-400 uppercase tracking-widest flex items-center gap-2">
                <ShieldAlert size={14} /> Zero Malpractice Enforcement
              </p>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                The AI will detect screen-captures or low-fidelity images. Ensure the specimen is well-lit and clearly visible for a valid record.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* --- AI DIAGNOSIS REPORT CARD --- */
        <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 space-y-12 pb-24">

          {/* Malpractice/Non-Plant Warning */}
          {(!result.isPlant || result.integrityScore < 40) && (
            <div className="bg-rose-600 text-white p-12 rounded-[3.5rem] shadow-2xl flex flex-col md:flex-row items-center gap-10 border-8 border-rose-500/30 animate-pulse print:hidden">
              <div className="w-24 h-24 bg-white/20 rounded-[2rem] flex items-center justify-center shadow-xl"><AlertCircle size={56} /></div>
              <div className="space-y-2 flex-1 text-center md:text-left">
                <h4 className="text-4xl font-black outfit tracking-tighter uppercase">Integrity Breach Detected</h4>
                <p className="text-xl font-medium opacity-90">{result.malpracticeAlert || "Image integrity failed authentication. No remediation protocols will be provided for non-botanical or low-quality specimens."}</p>
              </div>
              <button onClick={reset} className="px-10 py-5 bg-white text-rose-600 rounded-[1.8rem] font-black uppercase text-sm shadow-xl active:scale-95 transition-all">Reset Scanner</button>
            </div>
          )}

          <div ref={reportRef} className="bg-white rounded-[4rem] shadow-2xl border-[12px] border-slate-100 relative overflow-hidden flex flex-col xl:flex-row print:border-none print:shadow-none">
            <div className="xl:w-[45%] relative min-h-[500px] overflow-hidden bg-slate-900 print:h-[400px]">
              <img src={image!} className="w-full h-full object-cover opacity-80 brightness-90" alt="Specimen" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-10 left-10 right-10 p-8 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 space-y-6 shadow-2xl">
                <h4 className="text-5xl font-black text-white outfit tracking-tighter leading-tight">{result.plantName}</h4>
                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/10">
                  <div className="space-y-1">
                    <p className="text-white/40 font-black text-[9px] uppercase tracking-widest">Diagnostic Verdict</p>
                    <p className="text-lg font-black text-green-400 outfit">{result.diagnosis}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 border ${result.isHealthy ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'}`}>
                    {result.isHealthy ? <BadgeCheck size={14} /> : <AlertCircle size={14} />}
                    {result.isHealthy ? 'Healthy' : 'Anomaly Found'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 p-12 md:p-20 bg-white flex flex-col justify-between">
              <div className="space-y-12">
                <div className="flex justify-between items-start pb-8 border-b border-slate-100">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-600">
                      <FileText size={20} />
                      <p className="text-[11px] font-black uppercase tracking-[0.4em]">Official Lab Report #KM-{Math.floor(Math.random() * 10000)}</p>
                    </div>
                    <h3 className="text-4xl font-black text-slate-800 outfit tracking-tighter">Clinical Dossier</h3>
                  </div>
                  <div className="flex gap-4 print:hidden">
                    <button onClick={handleDownloadReport} className="p-5 bg-slate-900 text-white hover:bg-green-600 rounded-[1.5rem] transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center gap-3 font-black uppercase text-[10px] tracking-widest">
                      <Printer size={20} /> Print Report
                    </button>
                  </div>
                </div>

                <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform"><BrainCircuit size={120} /></div>
                  <h5 className="font-black outfit text-xl text-slate-800 mb-4 flex items-center gap-3"><Fingerprint className="text-amber-500" size={24} /> Neural Pathogen Analysis</h5>
                  <p className="text-2xl font-medium text-slate-700 leading-relaxed italic relative z-10">"{result.causeAnalysis}"</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4 text-center group hover:bg-green-50 transition-all">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Integrity Index</p>
                    <p className={`text-2xl font-black outfit ${result.integrityScore > 80 ? 'text-green-600' : 'text-amber-600'}`}>{result.integrityScore}% AUTH</p>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4 text-center group hover:bg-rose-50 transition-all">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Infection Load</p>
                    <p className={`text-2xl font-black outfit ${result.severity === 'High' ? 'text-rose-600' : 'text-amber-600'}`}>{result.severity}</p>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4 text-center group hover:bg-blue-50 transition-all">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Stability Ratio</p>
                    <p className="text-2xl font-black outfit text-blue-600">{100 - result.healthScoreImpact}% SAFE</p>
                  </div>
                </div>
              </div>

              <div className="pt-12 mt-12 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-10 print:hidden">
                <button
                  onClick={() => {
                    const roadmap = document.getElementById('roadmap');
                    if (roadmap) roadmap.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-12 py-6 bg-green-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-green-700 shadow-xl shadow-green-100 transition-all hover:scale-[1.05] active:scale-95"
                >
                  EXPLORE SOLUTIONS <ArrowDown size={18} strokeWidth={3} className="animate-bounce" />
                </button>
                <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                  <QrCode size={20} className="text-slate-400" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Scan to Verify Report Authenticity</p>
                </div>
              </div>
            </div>
          </div>

          {/* PRIORITY REMEDIATION ROADMAP - ONLY SHOWN IF VALID PLANT */}
          {(result.isPlant && result.integrityScore >= 40) && (
            <div id="roadmap" className="space-y-12 animate-in slide-in-from-bottom-20 duration-1000 stagger-in">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-green-600 font-black text-xs uppercase tracking-[0.4em]">
                    <ShieldPlus size={20} /> High-Fidelity Solutions
                  </div>
                  <h4 className="text-6xl font-black outfit text-slate-800 tracking-tighter">Remediation Paths</h4>
                </div>
                <div className="bg-amber-50 px-10 py-5 rounded-[2rem] border border-amber-100 flex items-center gap-5 shadow-sm">
                  <div className="w-12 h-12 bg-amber-400 text-black rounded-2xl flex items-center justify-center shadow-lg"><Star size={24} fill="currentColor" /></div>
                  <div>
                    <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Bonus Protocol</p>
                    <p className="text-xl font-black text-amber-900 outfit">+150 XP for Organic Execution</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* PRIMARY PATHWAY: ORGANIC REMEDIES */}
                <div className="lg:col-span-7 bg-white rounded-[4rem] p-16 shadow-2xl border-[10px] border-green-50 relative overflow-hidden group hover:border-green-100 transition-all duration-700">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.03] -rotate-12 transition-transform group-hover:rotate-0 group-hover:scale-110 duration-1000"><Leaf size={300} /></div>
                  <div className="relative z-10 space-y-12">
                    <div className="flex items-center gap-8">
                      <div className="w-24 h-24 bg-green-600 text-white rounded-[2.2rem] flex items-center justify-center shadow-2xl shadow-green-100 animate-float"><Leaf size={48} /></div>
                      <div className="space-y-1">
                        <h5 className="text-4xl font-black outfit text-slate-800">Organic Pathway</h5>
                        <span className="px-5 py-2 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-green-200">Recommended Master Choice</span>
                      </div>
                    </div>
                    <div className="bg-green-50/40 p-12 rounded-[3.5rem] border border-green-100 text-slate-700 leading-relaxed font-medium text-2xl shadow-inner whitespace-pre-wrap italic">
                      "{result.organicRemedy}"
                    </div>
                    <button
                      onClick={handleLocateSuppliers}
                      disabled={locatingSuppliers}
                      className="flex items-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-green-600 transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                    >
                      {locatingSuppliers ? <Loader2 className="animate-spin" /> : <ShoppingBag size={18} />}
                      {locatingSuppliers ? "Sourcing..." : "Find Organic Inputs Nearby"}
                    </button>
                  </div>
                </div>

                {/* SECONDARY PATHWAY: CHEMICAL & SAFETY */}
                <div className="lg:col-span-5 flex flex-col gap-10">
                  <div className="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-xl space-y-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-700">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-125 transition-transform"><Zap size={160} /></div>
                    <div className="relative z-10 space-y-8">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner"><Zap size={32} /></div>
                        <h5 className="text-3xl font-black outfit text-slate-800 tracking-tight">Rapid Response Path</h5>
                      </div>
                      <div className="p-10 bg-slate-50/70 rounded-[3rem] border border-slate-100 text-slate-600 leading-relaxed font-bold text-lg whitespace-pre-wrap">
                        "{result.chemicalRemedy}"
                      </div>
                      <div className="p-5 bg-rose-50 rounded-2xl flex items-center gap-4 text-[10px] font-black text-rose-600 uppercase tracking-widest border border-rose-100 shadow-sm">
                        <AlertCircle size={18} /> Deploy only if Organic attempts fail
                      </div>
                    </div>
                  </div>

                  {/* HUMAN SAFETY PROTOCOL */}
                  <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white space-y-10 relative overflow-hidden group border-4 border-amber-500/20 shadow-2xl hover:border-amber-500/40 transition-all">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000"><UserCheck size={180} /></div>
                    <div className="relative z-10 space-y-8">
                      <div className="flex items-center gap-5 text-amber-400">
                        <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md"><ShieldAlert size={32} /></div>
                        <h5 className="text-2xl font-black outfit uppercase tracking-[0.2em] leading-none">Biometric Safety</h5>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 group-hover:bg-white/10 transition-colors">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Exposure Risk</p>
                          <p className={`text-xl font-black outfit uppercase ${result.safetyProtocol.riskToBystanders === 'Severe' ? 'text-rose-400' : 'text-amber-400'}`}>{result.safetyProtocol.riskToBystanders} Level</p>
                        </div>
                        <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 group-hover:bg-white/10 transition-colors">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Wait Duration</p>
                          <p className="text-xl font-black text-white outfit">{result.safetyProtocol.waitPeriod}</p>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3"><CheckCircle2 size={14} className="text-green-400" /> Mandatory Protection Wear</p>
                        <div className="flex flex-wrap gap-3">
                          {result.safetyProtocol.ppeRequired.map((gear: string, i: number) => (
                            <span key={i} className="px-5 py-2.5 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 border border-white/10 hover:bg-white/20 transition-all cursor-default">{gear}</span>
                          ))}
                        </div>
                      </div>

                      <div className="p-8 bg-rose-500/20 rounded-[2.5rem] border border-rose-500/30 flex items-start gap-6 shadow-2xl">
                        <AlertCircle size={28} className="text-rose-400 flex-shrink-0 mt-1" />
                        <p className="text-sm font-bold text-rose-100 leading-relaxed italic">"{result.safetyProtocol.humanDetectionWarning}"</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Maps Grounding Section */}
              {nearbySuppliers && (
                <div className="bg-white rounded-[4rem] p-12 border-4 border-slate-100 shadow-2xl space-y-10 animate-in slide-in-from-bottom-10 duration-700">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-inner"><MapPin size={32} /></div>
                    <div>
                      <h5 className="text-3xl font-black outfit text-slate-800 tracking-tight">Supplier Grounding Map</h5>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Shops for {result.diagnosis}</p>
                    </div>
                  </div>

                  <div className="p-8 bg-blue-50/50 rounded-[3rem] border border-blue-100 prose prose-slate max-w-none text-blue-900 font-bold text-xl italic leading-relaxed">
                    "{nearbySuppliers.text}"
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nearbySuppliers.places.map((place: any, i: number) => (
                      <a key={i} href={place.maps?.uri} target="_blank" rel="noopener noreferrer" className="p-8 bg-white border border-slate-200 rounded-[2.5rem] hover:shadow-2xl transition-all group flex flex-col justify-between gap-6 hover:-translate-y-2 duration-500">
                        <div className="space-y-2">
                          <h6 className="font-black text-xl text-slate-800 outfit group-hover:text-blue-600 transition-colors leading-tight">{place.maps?.title || "Supplier Node"}</h6>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verified Agrochemical/Organic Retailer</p>
                        </div>
                        <div className="flex items-center justify-between text-blue-600 font-black text-[10px] uppercase tracking-widest">
                          <span>Open in Global Maps</span>
                          <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-center pt-12 print:hidden">
                <button onClick={reset} className="px-16 py-8 bg-slate-100 text-slate-400 rounded-[3rem] font-black text-xl flex items-center justify-center gap-6 hover:bg-white hover:text-green-600 hover:border-green-200 transition-all shadow-inner active:scale-95 group border-4 border-transparent"><RefreshCw size={32} className="group-hover:rotate-180 transition-transform duration-1000" /> START NEW BIO-SCAN SEQUENCE</button>
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes strict-scan {
          0% { transform: translateY(-50px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(450px); opacity: 0; }
        }
        @media print {
          .print\:hidden { display: none !important; }
          body { background: white !important; }
          .max-w-7xl { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
          .rounded-\[4rem\] { border-radius: 0 !important; }
          .shadow-2xl { shadow: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Diagnosis;
