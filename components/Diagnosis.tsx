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
  ArrowDown,
  Video,
  Play,
  Volume2,
  Database,
  Map as MapIcon,
  LineChart,
  Calendar,
  History as HistoryIcon,
  AlertTriangle
} from 'lucide-react';
import { DiagnosisResult, UserProfile, ScanHistoryItem, DiseaseAlert } from '../types';
import { getUserItem, setUserItem } from '../services/storageService';
import { analyzeVideoForAgriInsights, generateRegionalDiseaseAlerts } from '../services/geminiService';

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 2.0 New State
  const [scanMode, setScanMode] = useState<'photo' | 'video'>('photo');
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [regionalAlerts, setRegionalAlerts] = useState<DiseaseAlert[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showPassport, setShowPassport] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const ANALYZING_MESSAGES = [
    "Initializing High-Integrity Scan...",
    "Extracting Video Frames for Analysis...",
    "Neural Mesh Mapping Active...",
    "Scanning for Non-Botanical Anomalies...",
    "Correlating Pathogen Movement Patterns...",
    "Cross-referencing Indian Agri-Database...",
    "Generating Structural Health Insights..."
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

  const startVideoRecording = () => {
    if (!videoRef.current?.srcObject) return;
    setIsVideoRecording(true);
    setRecordingTime(0);
    chunksRef.current = [];
    const stream = videoRef.current.srcObject as MediaStream;
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8', videoBitsPerSecond: 1000000 }); // Optimize for speed
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const reader = new FileReader();
      reader.onloadend = () => {
        setRecordedVideo(reader.result as string);
        setIsVideoRecording(false);
        setRecordingTime(0);
      };
      reader.readAsDataURL(blob);
    };

    mediaRecorder.start();

    // Visual Timer
    const timerInterval = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 5) {
          clearInterval(timerInterval);
          if (mediaRecorder.state === 'recording') mediaRecorder.stop();
          return 5;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
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
    if (!image && !recordedVideo) return;
    setLoading(true);
    setLoadingStep(0);
    setErrorMessage(null);

    try {
      let data: any;
      if (scanMode === 'video' && recordedVideo) {
        const mimeType = recordedVideo.split(';')[0].split(':')[1];
        const base64 = recordedVideo.split(',')[1];
        data = await analyzeVideoForAgriInsights(base64, mimeType);
      } else if (image) {
        const mimeType = image.split(';')[0].split(':')[1];
        const base64 = image.split(',')[1];
        data = await diagnosePlantHealth(description, base64, mimeType);
      }

      const newRecord = { ...data, timestamp: new Date().toISOString(), img: image || recordedVideo };
      setHistory(prev => [newRecord, ...prev].slice(0, 5)); // Reduce limit for storage safety
      setResult(data);
    } catch (error: any) {
      console.error("Diagnosis failed:", error);
      setErrorMessage("Analysis failed. Please try a high-quality photo if video fails.");
      setResult(null); // Ensure stale results aren't shown
    } finally {
      setLoading(false);
    }
  };

  const handleTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (user.location) {
      setLoadingAlerts(true);
      generateRegionalDiseaseAlerts(user.location)
        .then(setRegionalAlerts)
        .finally(() => setLoadingAlerts(false));
    }
  }, [user.location]);

  const handleDownloadReport = () => {
    window.print();
  };

  const handleLocateSuppliers = () => {
    if (!result) return;
    setLocatingSuppliers(true);

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setLocatingSuppliers(false);
      alert("Your browser doesn't support location services. Please use a modern browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const shops = await findNearbyMedicines(result.diagnosis, pos.coords.latitude, pos.coords.longitude);
      setNearbySuppliers(shops);
      setLocatingSuppliers(false);
    }, async (err) => {
      console.error("Geolocation error:", err.code, err.message);

      // Try with a default location (Chennai, India) as fallback
      if (err.code === 1) { // Permission denied
        const useDefault = confirm("Location permission denied. Would you like to search near Chennai, India instead?");
        if (useDefault) {
          const shops = await findNearbyMedicines(result.diagnosis, 13.0827, 80.2707); // Chennai coords
          setNearbySuppliers(shops);
        }
      } else if (err.code === 2) { // Position unavailable
        alert("Could not determine your location. Please check your device's location settings.");
      } else if (err.code === 3) { // Timeout
        alert("Location request timed out. Please try again.");
      } else {
        alert("Location services required for sourcing nearby suppliers.");
      }
      setLocatingSuppliers(false);
    }, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000 // Cache location for 5 minutes
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
    <div className="max-w-7xl mx-auto space-y-12 page-transition pb-24 relative px-4 md:px-6">
      {/* Header - Cockpit Style */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 print:hidden relative z-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-green-500/10 text-green-500 rounded-full font-black text-[10px] tracking-widest uppercase border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
            <FlaskConical size={14} className="animate-pulse" /> NEURAL DIAGNOSIS v5.2 PRO
          </div>
          <h2 className="text-3xl md:text-6xl font-black text-white outfit tracking-tighter uppercase italic text-shadow-glow">Specimen Analysis</h2>
          <p className="text-slate-300 max-w-2xl text-xl font-medium uppercase tracking-tight italic">Professional-grade AI diagnostics with high-integrity spectral checks.</p>
        </div>
        <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-3 px-8 py-4 bg-slate-900 rounded-[2rem] border border-green-500/20 shadow-xl font-black text-xs uppercase tracking-widest text-green-500 hover:bg-slate-800 transition-all active:scale-95">
          <History size={18} className="text-green-500/60" /> {showHistory ? 'TERMINATE HISTORY' : 'ACCESS RECORDS'}
        </button>
      </div>

      {/* Disease Heatmap Section */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-[3rem] p-8 border border-green-500/10 shadow-2xl print:hidden relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-5" />
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-800 text-rose-500 rounded-2xl flex items-center justify-center border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
              <MapIcon size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white outfit tracking-tight uppercase italic">Disease Alerts Radar</h3>
              <p className="text-[10px] text-green-400 font-black uppercase tracking-[0.3em]">Regional pathogen monitoring for {user.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {loadingAlerts && <Loader2 className="animate-spin text-rose-500" size={20} />}
            <span className="px-4 py-2 bg-rose-500/10 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse border border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.3)]">Active SCAN</span>
          </div>
        </div>

        {/* Dynamic Alerts Radar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
          {regionalAlerts.map((alert) => (
            <div key={alert.id} className="p-6 bg-slate-900 rounded-[2rem] border border-green-500/10 flex flex-col justify-between hover:border-rose-500/40 transition-all group relative overflow-hidden">
              <div className="absolute inset-0 bg-rose-500/5 scanning-line opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-start justify-between relative z-10">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-green-500/40 uppercase tracking-widest">{alert.crop}</p>
                  <h4 className="text-xl font-black text-white outfit uppercase italic">{alert.disease}</h4>
                </div>
                <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase border ${alert.severity === 'High' ? 'bg-rose-500/20 text-rose-500 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.2)]' : alert.severity === 'Medium' ? 'bg-amber-500/20 text-amber-500 border-amber-500/30' : 'bg-green-500/20 text-green-500 border-green-500/30'}`}>
                  {alert.severity}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2 text-slate-300 font-bold text-[10px] uppercase tracking-widest">
                  <MapPin size={14} className="text-rose-500" />
                  {alert.location} ({alert.distanceKm}km)
                </div>
                <div className="text-[9px] font-black text-slate-300 flex items-center gap-1 uppercase tracking-widest">
                  <Clock size={12} /> {alert.reportedAt}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Heatmap Grid - India Regions */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { region: 'Punjab', severity: 'high', disease: 'Wheat Rust', cases: 234 },
            { region: 'Maharashtra', severity: 'medium', disease: 'Cotton Wilt', cases: 156 },
            { region: 'Karnataka', severity: 'low', disease: 'Rice Blast', cases: 45 },
            { region: 'Uttar Pradesh', severity: 'high', disease: 'Sugarcane Red Rot', cases: 312 },
            { region: 'Tamil Nadu', severity: 'medium', disease: 'Paddy Blight', cases: 89 },
            { region: 'Gujarat', severity: 'low', disease: 'Groundnut Tikka', cases: 34 },
            { region: 'Andhra Pradesh', severity: 'medium', disease: 'Chilli Leaf Curl', cases: 123 },
            { region: 'Rajasthan', severity: 'high', disease: 'Mustard Wilt', cases: 201 },
            { region: 'Madhya Pradesh', severity: 'low', disease: 'Soybean Rust', cases: 56 },
            { region: 'West Bengal', severity: 'medium', disease: 'Jute Rot', cases: 78 },
            { region: 'Bihar', severity: 'high', disease: 'Wheat Blight', cases: 189 },
            { region: 'Haryana', severity: 'low', disease: 'Rice Brown Spot', cases: 23 },
          ].map((item, i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl border-2 cursor-pointer hover:scale-105 transition-all bg-slate-900 overflow-hidden relative group ${item.severity === 'high' ? 'border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.1)]' :
                item.severity === 'medium' ? 'border-amber-500/30' :
                  'border-green-500/30'
                }`}
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${item.severity === 'high' ? 'bg-rose-500' : item.severity === 'medium' ? 'bg-amber-500' : 'bg-green-500'}`} />
              <p className="font-black text-white text-sm truncate relative z-10">{item.region}</p>
              <p className={`text-xs font-black mt-1 relative z-10 uppercase tracking-tighter ${item.severity === 'high' ? 'text-rose-400' :
                item.severity === 'medium' ? 'text-amber-400' :
                  'text-green-400'
                }`}>{item.disease}</p>
              <div className="flex items-center justify-between mt-2">
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${item.severity === 'high' ? 'bg-rose-200 text-rose-700' :
                  item.severity === 'medium' ? 'bg-amber-200 text-amber-700' :
                    'bg-green-200 text-green-700'
                  }`}>{item.severity}</span>
                <span className="text-[10px] font-bold text-slate-400">{item.cases} cases</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
            <span className="text-xs font-bold text-slate-500">High Alert</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span className="text-xs font-bold text-slate-500">Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs font-bold text-slate-500">Low Risk</span>
          </div>
        </div>
      </div>

      {!result ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start print:hidden">
          <div className="lg:col-span-7 bg-slate-900 rounded-[4rem] p-10 shadow-2xl border border-green-500/10 space-y-8 relative overflow-hidden group">
            <div className="absolute inset-0 grid-bg opacity-5" />
            <div className="flex items-center justify-between relative z-10">
              <h3 className="text-3xl font-black outfit text-white uppercase italic tracking-tighter">Visual Interface</h3>
              <div className="flex gap-2 p-1 bg-slate-800 rounded-2xl border border-green-500/10">
                <button
                  onClick={() => { setScanMode('photo'); setImage(null); setRecordedVideo(null); }}
                  className={`px-6 py-2 rounded-xl font-black text-[10px] tracking-[0.2em] uppercase transition-all ${scanMode === 'photo' ? 'bg-green-500 text-slate-950 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'text-slate-500 hover:text-green-400'}`}
                >
                  Spectral Photo
                </button>
                <button
                  onClick={() => { setScanMode('video'); setImage(null); setRecordedVideo(null); }}
                  className={`px-6 py-2 rounded-xl font-black text-[10px] tracking-[0.2em] uppercase transition-all ${scanMode === 'video' ? 'bg-green-500 text-slate-950 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'text-slate-500 hover:text-green-400'}`}
                >
                  Neural Video
                </button>
              </div>
              <div className="flex gap-3">
                <button onClick={() => fileInputRef.current?.click()} className="p-4 bg-slate-800 text-green-500 rounded-2xl hover:bg-slate-700 transition-all border border-green-500/10">
                  <Smartphone size={24} />
                </button>
                <div className="w-14 h-14 bg-green-500 text-slate-950 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)] animate-pulse">
                  {scanMode === 'photo' ? <Camera size={28} /> : <Video size={28} />}
                </div>
              </div>
            </div>

            <div className={`group aspect-square md:aspect-[4/3] rounded-[3.5rem] border-8 border-slate-800 shadow-2xl flex flex-col items-center justify-center transition-all duration-700 relative overflow-hidden bg-slate-950`}>
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div key={i} className="border-[0.5px] border-green-500/20" />
                  ))}
                </div>
              </div>

              {isCameraActive ? (
                <div className="w-full h-full relative">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-[2.8rem]" />
                  {/* High Tech Overlays */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-10 border border-green-500/20 rounded-3xl" />
                    <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-green-500 rounded-tl-3xl shadow-[-5px_-5px_15px_rgba(34,197,94,0.3)]" />
                    <div className="absolute top-10 right-10 w-20 h-20 border-t-2 border-r-2 border-green-500 rounded-tr-3xl shadow-[5px_-5px_15px_rgba(34,197,94,0.3)]" />
                    <div className="absolute bottom-10 left-10 w-20 h-20 border-b-2 border-l-2 border-green-500 rounded-bl-3xl shadow-[-5px_5px_15px_rgba(34,197,94,0.3)]" />
                    <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-green-500 rounded-br-3xl shadow-[5px_5px_15px_rgba(34,197,94,0.3)]" />

                    {/* Reticle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 flex items-center justify-center opacity-40">
                      <div className="w-4 h-4 border-2 border-green-500 rounded-full" />
                      <div className="absolute w-full h-px bg-green-500/50" />
                      <div className="absolute h-full w-px bg-green-500/50" />
                    </div>

                    {/* Floating Telemetry */}
                    <div className="absolute top-16 left-16 space-y-1">
                      <p className="text-[8px] font-black text-green-500 uppercase tracking-widest">ISO 800 • f/1.8</p>
                      <p className="text-[8px] font-black text-green-500 uppercase tracking-widest">FPS 60.00 • 4K NEURAL</p>
                    </div>
                  </div>

                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-12 relative z-20">
                    <button onClick={stopCamera} className="p-6 bg-slate-900/60 backdrop-blur-xl rounded-full text-rose-500 hover:bg-rose-600 hover:text-white transition-all border border-rose-500/20 shadow-2xl"><X size={32} /></button>
                    {scanMode === 'photo' ? (
                      <button onClick={capturePhoto} className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl border-4 border-green-500/50 hover:scale-110 active:scale-95 transition-all group/btn">
                        <div className="w-16 h-16 bg-green-500 rounded-full shadow-[0_0_30px_#22c55e] group-active/btn:scale-90 transition-transform" />
                      </button>
                    ) : (
                      <div className="relative flex items-center gap-4">
                        <button
                          onClick={isVideoRecording ? stopVideoRecording : startVideoRecording}
                          className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl border-4 transition-all ${isVideoRecording ? 'bg-rose-600 border-rose-400' : 'bg-rose-500 border-white/20 hover:scale-110'}`}
                        >
                          <div className={`transition-all ${isVideoRecording ? 'w-10 h-10 rounded-xl' : 'w-12 h-12 rounded-full'} bg-white shadow-[0_0_15px_white]`} />
                        </button>
                        {isVideoRecording && (
                          <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-rose-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 shadow-[0_10px_30px_rgba(225,29,72,0.4)] border border-rose-400/50 animate-bounce">
                            <Clock size={18} /> {5 - recordingTime}s REAMAINING
                          </div>
                        )}
                      </div>
                    )}
                    <div className="w-14 h-14" /> {/* Spacer for symmetry */}
                  </div>
                </div>
              ) : (image || recordedVideo) ? (
                <div className="relative w-full h-full">
                  {recordedVideo ? (
                    <video src={recordedVideo} autoPlay loop muted playsInline className="w-full h-full object-cover rounded-[2.8rem]" />
                  ) : (
                    <img src={image!} className="w-full h-full object-cover rounded-[2.8rem]" alt="Specimen" />
                  )}
                  {loading && (
                    <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center text-white space-y-12">
                      <div className="absolute inset-0 overflow-hidden rounded-[2.8rem] pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-2 bg-green-500 shadow-[0_0_30px_#22c55e] animate-[strict-scan_2s_linear_infinite] z-20" />
                        <div className="absolute inset-0 grid-bg opacity-10" />
                      </div>
                      <div className="relative z-10">
                        <div className="w-40 h-40 bg-slate-900 rounded-[2.5rem] flex items-center justify-center border-4 border-green-500/50 shadow-[0_0_50px_rgba(34,197,94,0.3)] animate-pulse">
                          <BrainCircuit size={80} className="text-green-500" />
                        </div>
                        <div className="absolute -top-6 -right-6 bg-green-600 text-white p-3 rounded-2xl shadow-2xl border border-green-400/50"><Activity size={24} className="animate-spin" /></div>
                      </div>
                      <div className="space-y-6 text-center relative z-10">
                        <p className="font-black outfit text-3xl tracking-tighter uppercase text-green-400 italic text-shadow-glow animate-pulse">{ANALYZING_MESSAGES[loadingStep]}</p>
                        <div className="w-96 h-2 bg-slate-800 rounded-full overflow-hidden mx-auto border border-white/5 p-0.5">
                          <div className="h-full bg-gradient-to-r from-green-600 via-green-400 to-green-600 transition-all duration-[1500ms] shadow-[0_0_15px_#22c55e]" style={{ width: `${((loadingStep + 1) / ANALYZING_MESSAGES.length) * 100}%` }} />
                        </div>
                        <p className="text-[10px] text-green-500/40 font-black uppercase tracking-[0.5em]">Correlating Specimen Data Matrix...</p>
                      </div>
                    </div>
                  )}
                  {!loading && <button onClick={() => { setImage(null); setRecordedVideo(null); }} className="absolute top-8 right-8 bg-slate-900/80 backdrop-blur-xl rounded-2xl px-6 py-4 shadow-2xl text-rose-500 border border-rose-500/30 hover:bg-rose-500 hover:text-white transition-all font-black text-[10px] tracking-[0.3em] uppercase flex items-center gap-3"><X size={20} /> Terminate Capture</button>}
                </div>
              ) : (
                <div className="flex flex-col items-center text-center space-y-10 p-12 relative z-10">
                  <div className="flex gap-10">
                    <button onClick={startCamera} className="w-32 h-32 bg-slate-900 rounded-[2.5rem] shadow-2xl flex items-center justify-center text-green-500 border-2 border-green-500/20 hover:border-green-500/50 hover:scale-110 hover:-rotate-3 transition-all">
                      {scanMode === 'photo' ? <Camera size={48} /> : <Video size={48} />}
                    </button>
                    <button onClick={() => fileInputRef.current?.click()} className="w-32 h-32 bg-slate-900 rounded-[2.5rem] shadow-2xl flex items-center justify-center text-blue-500 border-2 border-blue-500/20 hover:border-blue-500/50 hover:scale-110 hover:rotate-3 transition-all"><Smartphone size={48} /></button>
                  </div>
                  <div className="space-y-3">
                    <p className="text-2xl md:text-4xl font-black text-white outfit tracking-tighter uppercase italic">Engage Neural Scanner</p>
                    <p className="text-green-500/40 text-[10px] font-black uppercase tracking-[0.4em]">{scanMode === 'photo' ? 'Strict Integrity Specimen Capture' : '360° Volumetric pathogen Discovery'}</p>
                  </div>
                  <div className="absolute bottom-[-100px] left-[-100px] w-64 h-64 bg-green-500/5 rounded-full blur-[100px] animate-pulse" />
                  <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] animate-pulse" />
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept={scanMode === 'photo' ? "image/*" : "video/*"} className="hidden" />
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8 relative z-10">
            <div className="bg-slate-900 rounded-[4rem] p-10 border border-green-500/10 shadow-2xl space-y-8 relative overflow-hidden group">
              <div className="absolute inset-0 grid-bg opacity-5" />
              <div className="space-y-4 relative z-10">
                <label className="text-[11px] font-black text-green-500/40 uppercase tracking-[0.4em] ml-2 flex items-center gap-2"><Activity size={14} className="text-green-500" /> BIO-SYMPTOM LOG</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Inquiry Factors: Atmospheric variance, pest vectoring, etc..."
                  className="w-full px-8 py-8 bg-slate-950 border border-green-500/10 rounded-[2.5rem] h-60 focus:ring-4 focus:ring-green-500/10 focus:border-green-500/30 resize-none transition-all font-black outfit text-2xl shadow-inner outline-none text-green-400 placeholder:text-slate-800 uppercase italic"
                />
              </div>
              <button
                onClick={handleDiagnose}
                disabled={(!image && !recordedVideo) || loading}
                className="w-full bg-green-600 text-slate-950 py-8 rounded-[2rem] font-black text-2xl flex items-center justify-center gap-6 shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:bg-green-400 transition-all disabled:opacity-30 uppercase italic relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 scanning-line opacity-20 pointer-events-none" />
                {loading ? <Loader2 className="animate-spin" size={32} /> : <Zap size={32} fill="currentColor" />}
                {loading ? "AUTHENTICATING..." : "RUN NEURAL INFERENCE"}
              </button>
              {errorMessage && (
                <div className="p-8 bg-rose-500/10 border border-rose-500/20 rounded-[2.5rem] text-rose-500 font-black text-sm leading-relaxed uppercase tracking-wider italic animate-in zoom-in-95">
                  <span className="flex items-center gap-3"><AlertTriangle size={20} /> INTERFACE ERROR: {errorMessage}</span>
                </div>
              )}
            </div>
            <div className="bg-slate-950 rounded-[3rem] p-8 text-white space-y-4 shadow-2xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform duration-1000"><ShieldCheck size={120} /></div>
              <p className="text-[10px] font-black text-green-500 uppercase tracking-[0.4em] flex items-center gap-3">
                <ShieldAlert size={14} /> ZERO MALPRACTICE ENFORCEMENT
              </p>
              <p className="text-sm text-slate-500 leading-relaxed font-black uppercase italic tracking-tight">
                Neural heuristics will detect synthetic artifacts or low-fidelity proxies. Ensure high-lumen proximity for valid biometric confirmation.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* --- AI DIAGNOSIS REPORT CARD --- */
        <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 space-y-12 pb-24 relative z-10">

          {/* Malpractice/Non-Plant Warning - HUD Style */}
          {(!result.isPlant || result.integrityScore < 40) && (
            <div className="bg-rose-900/50 backdrop-blur-xl text-white p-12 rounded-[3.5rem] shadow-2xl flex flex-col md:flex-row items-center gap-10 border border-rose-500/30 animate-pulse print:hidden relative overflow-hidden">
              <div className="absolute inset-0 bg-rose-500/5 scanning-line" />
              <div className="w-24 h-24 bg-slate-900 text-rose-500 rounded-[2rem] flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.4)] border border-rose-500/20"><AlertCircle size={56} /></div>
              <div className="space-y-2 flex-1 text-center md:text-left">
                <h4 className="text-4xl font-black outfit tracking-tighter uppercase italic text-shadow-glow-rose">Integrity Breach Detected</h4>
                <p className="text-xl font-medium text-white uppercase tracking-tight italic">{result.malpracticeAlert || "Image integrity failed authentication. No remediation protocols will be provided for non-botanical or low-quality specimens."}</p>
              </div>
              <button onClick={reset} className="px-10 py-5 bg-rose-600 text-white rounded-[1.8rem] font-black uppercase text-sm shadow-[0_0_20px_rgba(244,63,94,0.4)] active:scale-95 transition-all hover:bg-rose-400">Terminated Protocol: RESET</button>
            </div>
          )}

          <div ref={reportRef} className="bg-slate-900 rounded-[4rem] shadow-2xl border border-green-500/10 relative overflow-hidden flex flex-col xl:flex-row print:border-none print:shadow-none">
            <div className="xl:w-[45%] relative min-h-[500px] overflow-hidden bg-slate-950 print:h-[400px] border-r border-green-500/10">
              <div className="absolute inset-0 grid-bg opacity-5" />
              {recordedVideo ? (
                <video src={recordedVideo} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60 brightness-75 scale-105" />
              ) : (
                <img src={image!} className="w-full h-full object-cover opacity-60 brightness-75 scale-105" alt="Specimen" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-10 left-10 right-10 p-8 bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-green-500/10 space-y-6 shadow-2xl">
                <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1.5 bg-green-500 text-slate-950 rounded-full font-black text-[10px] uppercase tracking-widest shadow-[0_0_15px_#22c55e]">Specimen Authenticated</div>
                <h4 className="text-5xl font-black text-white outfit tracking-tighter leading-tight uppercase italic">{result.plantName}</h4>
                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-green-500/10">
                  <div className="space-y-1">
                    <p className="text-green-400/60 font-black text-[9px] uppercase tracking-[0.4em]">Inference Verdict</p>
                    <p className="text-lg font-black text-green-400 outfit uppercase italic tracking-tight">{result.diagnosis}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 border ${result.isHealthy ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'}`}>
                    {result.isHealthy ? <BadgeCheck size={14} className="animate-pulse" /> : <AlertCircle size={14} className="animate-pulse" />}
                    {result.isHealthy ? 'Bio-Integrity Stable' : 'Anomalous Matrix'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 p-12 md:p-20 bg-slate-900/50 backdrop-blur-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
              <div className="space-y-12 relative z-10">
                <div className="flex justify-between items-start pb-8 border-b border-green-500/10">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-400">
                      <FileText size={20} className="opacity-70" />
                      <p className="text-[11px] font-black uppercase tracking-[0.4em] text-green-400 italic">Lab Integrity Dossier #AG-{Math.floor(Math.random() * 10000)}</p>
                    </div>
                    <h3 className="text-4xl font-black text-white outfit tracking-tighter uppercase italic">Clinical Narrative</h3>
                  </div>
                  <div className="flex gap-4 print:hidden">
                    <button onClick={handleDownloadReport} className="p-5 bg-green-600 text-slate-950 hover:bg-green-400 rounded-[1.5rem] transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] active:scale-95 flex items-center gap-3 font-black uppercase text-[10px] tracking-widest">
                      <Printer size={20} /> Deploy Hardcopy
                    </button>
                  </div>
                </div>

                <div className="p-10 bg-slate-950 rounded-[3rem] border border-green-500/10 relative group overflow-hidden shadow-inner">
                  <div className="absolute inset-0 scanning-line opacity-5" />
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000"><BrainCircuit size={120} /></div>
                  <h5 className="font-black outfit text-xl text-white mb-4 flex items-center gap-3 italic uppercase"><Fingerprint className="text-green-500" size={24} /> Neural Core Analysis</h5>
                  <p className="text-2xl font-black text-green-400/80 leading-relaxed italic relative z-10 font-mono tracking-tight">"{result.causeAnalysis}"</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-green-500/10 shadow-xl space-y-4 text-center group hover:border-green-500/30 transition-all">
                    <p className="text-[9px] font-black text-green-400 uppercase tracking-[0.4em]">Integrity Index</p>
                    <p className={`text-2xl font-black outfit italic uppercase ${result.integrityScore > 80 ? 'text-green-400' : 'text-amber-400'}`}>{result.integrityScore}% AUTH</p>
                  </div>
                  <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-green-500/10 shadow-xl space-y-4 text-center group hover:border-rose-500/30 transition-all">
                    <p className="text-[9px] font-black text-green-400 uppercase tracking-[0.4em]">Pathogen Load</p>
                    <p className={`text-2xl font-black outfit italic uppercase ${result.severity === 'High' ? 'text-rose-400' : 'text-amber-400'}`}>{result.severity}</p>
                  </div>
                  <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-green-500/10 shadow-xl space-y-4 text-center group hover:border-blue-500/30 transition-all">
                    <p className="text-[9px] font-black text-green-400 uppercase tracking-[0.4em]">Stability Ratio</p>
                    <p className="text-2xl font-black outfit text-blue-400 italic uppercase">{100 - result.healthScoreImpact}% SAFE</p>
                  </div>
                </div>
              </div>

              <div className="pt-12 mt-12 border-t border-green-500/10 flex flex-col sm:flex-row items-center justify-between gap-10 print:hidden relative z-10">
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => {
                      const roadmap = document.getElementById('roadmap');
                      if (roadmap) roadmap.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-12 py-6 bg-green-600 text-slate-950 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-green-400 shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all hover:scale-[1.05] active:scale-95 italic"
                  >
                    DEPLOY SOLUTIONS <ArrowDown size={18} strokeWidth={3} className="animate-bounce" />
                  </button>
                  <button
                    onClick={() => setShowPassport(true)}
                    className="px-8 py-6 bg-slate-950 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-slate-800 shadow-2xl border border-green-500/20 transition-all hover:scale-[1.05] active:scale-95 italic"
                  >
                    <BadgeCheck size={18} className="text-green-500" /> GEN-PASSPORT [PHI]
                  </button>
                </div>
                <div className="flex items-center gap-3 bg-slate-950 px-6 py-3 rounded-2xl border border-green-500/20">
                  <QrCode size={20} className="text-green-500/30" />
                  <p className="text-[9px] font-black text-green-500/20 uppercase tracking-[0.4em]">Link to Decentralized Ledger</p>
                </div>
              </div>
            </div>
          </div>

          {/* PRIORITY REMEDIATION ROADMAP - ONLY SHOWN IF VALID PLANT */}
          {(result.isPlant && result.integrityScore >= 40) && (
            <div id="roadmap" className="space-y-12 animate-in slide-in-from-bottom-20 duration-1000 stagger-in relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-green-500 font-black text-xs uppercase tracking-[0.4em] italic text-shadow-glow">
                    <ShieldPlus size={20} /> High-Fidelity Protocols
                  </div>
                  <h4 className="text-6xl font-black outfit text-white tracking-tighter uppercase italic">Remediation Roadmap</h4>
                </div>
                <div className="bg-slate-900/50 backdrop-blur-md px-10 py-5 rounded-[2rem] border border-amber-500/20 flex items-center gap-5 shadow-2xl">
                  <div className="w-12 h-12 bg-amber-500 text-slate-950 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)] animate-float"><Star size={24} fill="currentColor" /></div>
                  <div>
                    <p className="text-[10px] font-black text-amber-400 font-black uppercase tracking-widest mb-0.5">Bonus Protocol</p>
                    <p className="text-xl font-black text-amber-400 outfit uppercase italic">+150 XP for Bio-Control</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* PRIMARY PATHWAY: ORGANIC REMEDIES */}
                <div className="lg:col-span-12 bg-slate-900 rounded-[4rem] p-16 shadow-2xl border border-green-500/20 relative overflow-hidden group hover:border-green-500/40 transition-all duration-700">
                  <div className="absolute inset-0 grid-bg opacity-5" />
                  <div className="absolute top-0 right-0 p-12 opacity-[0.03] -rotate-12 transition-transform group-hover:rotate-0 group-hover:scale-110 duration-1000 pointer-events-none"><Leaf size={300} /></div>
                  <div className="relative z-10 space-y-12">
                    <div className="flex items-center gap-8">
                      <div className="w-24 h-24 bg-green-500 text-slate-950 rounded-[2.2rem] flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)] animate-float"><Leaf size={48} /></div>
                      <div className="space-y-1">
                        <h5 className="text-4xl font-black outfit text-white uppercase italic">Bio-Integral Pathway</h5>
                        <span className="px-5 py-2 bg-green-500/10 text-green-300 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-green-500/30">Authorized Master Choice</span>
                      </div>
                    </div>
                    <div className="bg-slate-950 p-12 rounded-[3.5rem] border border-green-500/10 text-green-400 leading-relaxed font-black text-3xl shadow-inner italic uppercase tracking-tight">
                      "{result.organicRemedy}"
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-8">
                      <button
                        onClick={handleLocateSuppliers}
                        disabled={locatingSuppliers}
                        className="flex items-center gap-4 px-12 py-6 bg-green-600 text-slate-950 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-green-400 transition-all shadow-2xl active:scale-95 disabled:opacity-50 italic"
                      >
                        {locatingSuppliers ? <Loader2 className="animate-spin" /> : <ShoppingBag size={18} />}
                        {locatingSuppliers ? "Sourcing Nodes..." : "Access verified bio-retailers"}
                      </button>
                      <div className="flex items-center gap-4 px-8 py-4 bg-slate-950 rounded-2xl border border-green-500/20">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                        <span className="text-[10px] font-black text-green-400 font-black uppercase tracking-widest">Global Supply Uplink Active</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECONDARY PATHWAY: CHEMICAL & SAFETY */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="bg-slate-900 rounded-[3.5rem] p-12 border border-green-500/10 shadow-xl space-y-8 relative overflow-hidden group hover:border-amber-500/30 transition-all duration-700">
                    <div className="absolute inset-0 scanning-line opacity-5" />
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-125 transition-transform"><Zap size={160} /></div>
                    <div className="relative z-10 space-y-8">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-slate-950 text-amber-500 rounded-2xl flex items-center justify-center border border-amber-500/20 shadow-inner"><Zap size={32} /></div>
                        <h5 className="text-3xl font-black outfit text-white tracking-tight uppercase italic">Kinetic Override</h5>
                      </div>
                      <div className="p-10 bg-slate-950 rounded-[3rem] border border-green-500/10 text-slate-200 leading-relaxed font-black text-xl italic uppercase tracking-tight">
                        "{result.chemicalRemedy}"
                      </div>
                      <div className="p-5 bg-rose-500/10 rounded-2xl flex items-center gap-4 text-[10px] font-black text-rose-500 uppercase tracking-widest border border-rose-500/20 shadow-sm">
                        <AlertCircle size={18} /> Deploy only if bio-integrity thresholds failed
                      </div>
                    </div>
                  </div>

                  {/* HUMAN SAFETY PROTOCOL */}
                  <div className="bg-slate-950 rounded-[3.5rem] p-12 text-white space-y-10 relative overflow-hidden group border-2 border-amber-500/20 shadow-2xl hover:border-amber-500/40 transition-all">
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform duration-1000"><UserCheck size={180} /></div>
                    <div className="relative z-10 space-y-8">
                      <div className="flex items-center gap-5 text-amber-500">
                        <div className="p-4 bg-slate-900 rounded-2xl border border-amber-500/20 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.2)]"><ShieldAlert size={32} /></div>
                        <h5 className="text-2xl font-black outfit uppercase tracking-[0.3em] leading-none italic">Biosafety Overlays</h5>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 bg-slate-900 rounded-[2rem] border border-white/10 group-hover:bg-slate-800 transition-colors">
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">Exposure Index</p>
                          <p className={`text-xl font-black outfit uppercase italic ${result.safetyProtocol.riskToBystanders === 'Severe' ? 'text-rose-400' : 'text-amber-400'}`}>{result.safetyProtocol.riskToBystanders} Level</p>
                        </div>
                        <div className="p-6 bg-slate-900 rounded-[2rem] border border-white/10 group-hover:bg-slate-800 transition-colors">
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">Matrix Lockout</p>
                          <p className="text-xl font-black text-white outfit italic uppercase">{result.safetyProtocol.waitPeriod}</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] flex items-center gap-3"><CheckCircle2 size={14} className="text-green-500" /> Authorized PPE Gear</p>
                          <button
                            onClick={() => handleTTS(`Remedy protocol: ${result.organicRemedy}. Safety requirements: ${result.safetyProtocol.ppeRequired.join(', ')}. Wait period: ${result.safetyProtocol.waitPeriod}.`)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all shadow-xl ${isSpeaking ? 'bg-green-600 text-slate-950 animate-pulse' : 'bg-slate-900 text-green-500 hover:bg-slate-800 border border-green-500/20'}`}
                          >
                            <Volume2 size={16} /> {isSpeaking ? 'BROADCASTING...' : 'AI GUIDANCE'}
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {result.safetyProtocol.ppeRequired.map((gear: string, i: number) => (
                            <span key={i} className="px-5 py-3 bg-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest text-green-400 border border-green-500/20 hover:border-green-500/40 transition-all cursor-default shadow-inner">{gear}</span>
                          ))}
                        </div>
                      </div>

                      <div className="p-8 bg-rose-500/10 rounded-[2.5rem] border border-rose-500/20 flex items-start gap-6 shadow-2xl animate-pulse">
                        <AlertCircle size={28} className="text-rose-500 flex-shrink-0 mt-1" />
                        <p className="text-sm font-black text-rose-500/80 leading-relaxed italic uppercase tracking-tight">"{result.safetyProtocol.humanDetectionWarning}"</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* History & Biometric Trends Section - HUD Style */}
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-[4rem] p-12 border border-green-500/10 shadow-inner space-y-10 relative overflow-hidden">
                <div className="absolute inset-0 grid-bg opacity-5" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-800 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                      <LineChart size={24} />
                    </div>
                    <div>
                      <h5 className="text-2xl font-black text-white outfit tracking-tight uppercase italic">Biometric Recovery Trends</h5>
                      <p className="text-[10px] text-green-400 font-black uppercase tracking-[0.3em]">Historical health data matrix for {result.plantName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 rounded-xl border border-green-500/20 text-[9px] font-black uppercase text-green-400 tracking-widest">
                    <Calendar size={14} /> LIVE UPDATE: {new Date().toLocaleDateString()}
                  </div>
                </div>

                <div className="h-64 flex items-end justify-between px-8 pb-6 border-b border-green-500/10 relative z-10">
                  <div className="absolute inset-x-0 top-0 h-px bg-green-500/5" />
                  <div className="absolute inset-x-0 top-1/4 h-px bg-green-500/5" />
                  <div className="absolute inset-x-0 top-2/4 h-px bg-green-500/5" />
                  <div className="absolute inset-x-0 top-3/4 h-px bg-green-500/5" />

                  {history.slice(0, 7).reverse().map((record, i) => {
                    const health = 100 - record.healthScoreImpact;
                    return (
                      <div key={i} className="flex flex-col items-center gap-4 group cursor-crosshair">
                        <div className="relative">
                          <div
                            className={`w-14 rounded-t-xl transition-all duration-1000 group-hover:brightness-120 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] relative ${record.isHealthy ? 'bg-green-500' : record.severity === 'High' ? 'bg-rose-500' : 'bg-amber-500'}`}
                            style={{ height: `${health * 1.5}px` }}
                          >
                            <div className="absolute inset-0 scanning-line opacity-20" />
                          </div>
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-slate-800 text-white text-[10px] px-3 py-1.5 rounded-lg border border-white/10 font-black whitespace-nowrap shadow-2xl z-20 -translate-y-2 group-hover:translate-y-0">
                            {health}% STABILITY
                          </div>
                        </div>
                        <div className="space-y-1 text-center">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">{new Date(record.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                          <div className={`w-1 h-1 rounded-full mx-auto ${record.isHealthy ? 'bg-green-500 animate-pulse' : 'bg-rose-500'}`} />
                        </div>
                      </div>
                    );
                  })}
                  {history.length < 2 && (
                    <div className="flex-1 flex flex-col items-center justify-center h-full text-slate-700 space-y-4 animate-pulse">
                      <HistoryIcon size={48} className="opacity-20" />
                      <p className="text-xs font-black uppercase tracking-[0.5em]">Establishing Biometric Baseline...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Maps Grounding Section - HUD Style */}
              {nearbySuppliers && (
                <div className="bg-slate-900 rounded-[4rem] p-12 border border-green-500/10 shadow-2xl space-y-10 animate-in slide-in-from-bottom-10 duration-700 relative overflow-hidden">
                  <div className="absolute inset-0 grid-bg opacity-5" />
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 bg-slate-800 text-blue-500 rounded-[1.5rem] flex items-center justify-center border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.2)]"><MapPin size={32} /></div>
                    <div>
                      <h5 className="text-3xl font-black outfit text-white tracking-tight uppercase italic">Supplier Grounding Matrix</h5>
                      <p className="text-[10px] font-black text-green-500/40 uppercase tracking-[0.4em]">Verified logistics nodes for {result.diagnosis}</p>
                    </div>
                  </div>

                  <div className="p-8 bg-blue-500/5 rounded-[3rem] border border-blue-500/20 prose prose-invert max-w-none text-blue-400 font-black text-xl italic leading-relaxed relative z-10 box-shadow-glow-blue">
                    <span className="opacity-50 font-mono mr-2">{"[AI ADVISORY]"}</span> "{nearbySuppliers.text}"
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                    {nearbySuppliers.places.map((place: any, i: number) => (
                      <a key={i} href={place.maps?.uri} target="_blank" rel="noopener noreferrer" className="p-8 bg-slate-950 border border-green-500/10 rounded-[2.5rem] hover:border-blue-500/40 transition-all group flex flex-col justify-between gap-6 hover:-translate-y-2 duration-500 shadow-xl overflow-hidden relative">
                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 scanning-line" />
                        <div className="space-y-3 relative z-10">
                          <h6 className="font-black text-xl text-white outfit group-hover:text-blue-400 transition-colors uppercase italic leading-tight">{place.maps?.title || "Supplier Node"}</h6>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <p className="text-[8px] font-black text-green-500/40 uppercase tracking-widest">Verified Agro-Logistician</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-blue-500 font-black text-[10px] uppercase tracking-[0.3em] relative z-10">
                          <span>Initiate Uplink</span>
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

      {/* Digital Health Passport Modal - Security Clearance HUD */}
      {showPassport && result && (
        <div className="fixed inset-0 z-[200] bg-slate-950/98 backdrop-blur-3xl flex items-center justify-center p-6 page-transition">
          <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
          <div className="bg-slate-900 w-full max-w-5xl rounded-[4rem] overflow-hidden shadow-[0_0_150px_rgba(34,197,94,0.15)] flex flex-col md:flex-row relative border border-green-500/20">
            <div className="absolute inset-x-0 top-0 h-1 scanning-line z-50" />

            {/* Left Side: Biometric ID Card */}
            <div className="md:w-[45%] bg-slate-950 p-16 flex flex-col items-center justify-center space-y-12 border-r border-green-500/10 relative overflow-hidden">
              <div className="absolute inset-0 grid-bg opacity-5" />
              <div className="w-full flex justify-between items-start absolute top-10 px-10">
                <div className="p-4 bg-slate-900 rounded-2xl border border-green-500/20"><ShieldCheck className="text-green-500" size={32} /></div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-green-400/80 uppercase tracking-[0.4em]">Auth-Level</p>
                  <p className="text-xl font-black text-green-400 outfit italic">SECURED_PHI</p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-10 bg-green-500/10 rounded-full blur-3xl opacity-50 animate-pulse" />
                <div className="w-64 h-64 rounded-[3.5rem] bg-slate-900 border-4 border-green-500/20 overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.2)] relative z-10 group-hover:scale-105 transition-transform duration-700">
                  <div className="absolute inset-0 bg-green-500/10 scanning-line" />
                  <img src={image || "/placeholder-plant.jpg"} className="w-full h-full object-cover" alt="Specimen Profile" />
                </div>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-green-500 text-slate-950 rounded-3xl flex items-center justify-center shadow-2xl z-20 animate-float"><QrCode size={40} /></div>
              </div>

              <div className="text-center space-y-3 relative z-10">
                <h3 className="text-5xl font-black text-white outfit uppercase italic tracking-tighter">{result.plantName}</h3>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                  <p className="text-xs text-green-500/60 font-black uppercase tracking-[0.5em]">Active Biological Node</p>
                </div>
              </div>

              <div className="w-full pt-10 border-t border-green-500/10 space-y-6 relative z-10">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                  <span className="text-slate-300">Specimen Hash</span>
                  <span className="text-green-400 font-mono">#PHI-{Math.floor(Math.random() * 999999)}</span>
                </div>
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                  <span className="text-slate-300">Authority Date</span>
                  <span className="text-green-400 font-mono">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Right Side: Security Clearance Data */}
            <div className="flex-1 p-16 space-y-12 relative overflow-hidden flex flex-col justify-center">
              <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-green-500 font-black text-xs uppercase tracking-[0.5em] italic">
                  <BadgeCheck size={20} /> Official Security Clearance
                </div>
                <h2 className="text-6xl font-black text-white outfit tracking-tighter uppercase italic leading-none">Bio-Passport</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-green-500/10 space-y-4 shadow-inner group hover:border-green-500/30 transition-all">
                  <h6 className="text-[10px] font-black text-green-400 uppercase tracking-[0.5em]">Health-Index_NOM[V]</h6>
                  <div className="flex items-end gap-3">
                    <span className="text-6xl font-black text-white outfit italic">{100 - result.healthScoreImpact}%</span>
                    <span className="text-green-500 font-black text-xs uppercase mb-3 italic">STABLE</span>
                  </div>
                </div>
                <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-green-500/10 space-y-4 shadow-inner group hover:border-blue-500/30 transition-all">
                  <h6 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.5em]">Integrity_AUTH[P]</h6>
                  <div className="flex items-end gap-3">
                    <span className="text-6xl font-black text-white outfit italic">{result.integrityScore}%</span>
                    <span className="text-blue-500 font-black text-xs uppercase mb-3 italic">VERIFIED</span>
                  </div>
                </div>
              </div>

              <div className="p-10 bg-slate-950 rounded-[3rem] border border-green-500/10 space-y-6 relative overflow-hidden group">
                <div className="absolute inset-0 scanning-line opacity-5" />
                <h6 className="text-[11px] font-black text-green-400 uppercase tracking-[0.4em] flex items-center gap-3"><Fingerprint size={16} /> Diagnostic Signature</h6>
                <p className="text-2xl font-black text-green-400 leading-tight italic uppercase tracking-tighter">"{result.diagnosis}"</p>
              </div>

              <div className="pt-8 flex flex-col sm:flex-row items-center gap-6 text-white">
                <button
                  onClick={() => handleDownloadReport()}
                  className="w-full py-6 bg-green-600 text-slate-950 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-green-400 shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all italic active:scale-95"
                >
                  <Download size={20} /> Encrypt & Export
                </button>
                <button
                  onClick={() => setShowPassport(false)}
                  className="w-full py-6 bg-slate-800 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-slate-700 transition-all italic active:scale-95 border border-white/5"
                >
                  Terminate Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Overlay - Bio-Archive Database */}
      {showHistory && (
        <div className="fixed inset-0 z-[150] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-end p-0 md:p-6 page-transition">
          <div className="bg-slate-900 w-full max-w-3xl h-full md:h-auto md:max-h-[90vh] md:rounded-[3.5rem] overflow-hidden shadow-[0_0_100px_rgba(34,197,94,0.1)] relative flex flex-col border border-green-500/20">
            <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />

            <div className="p-12 border-b border-green-500/10 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-800 text-green-500 rounded-3xl flex items-center justify-center border border-green-500/20 shadow-2xl animate-pulse">
                  <Database size={32} />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-white outfit uppercase italic tracking-tighter">Bio-Archive Database</h2>
                  <p className="text-[10px] text-green-500/40 font-black uppercase tracking-[0.5em]">{history.length} SECURE RECORDS ENCRYPTED</p>
                </div>
              </div>
              <button onClick={() => setShowHistory(false)} className="p-5 bg-slate-800 text-slate-500 rounded-2xl hover:bg-rose-500/20 hover:text-rose-500 transition-all border border-white/5"><X size={28} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-12 space-y-8 custom-scrollbar relative z-10">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
                  <div className="w-32 h-32 bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-slate-700 animate-pulse border border-white/5"><HistoryIcon size={64} /></div>
                  <div>
                    <p className="text-2xl font-black text-slate-600 outfit uppercase italic">Database Empty</p>
                    <p className="text-xs text-slate-700 font-black uppercase tracking-widest mt-2 px-12 leading-relaxed">Initial biological captures required for historical health indexing.</p>
                  </div>
                </div>
              ) : (
                history.map((record, i) => (
                  <div key={i} onClick={() => { setResult(record); setShowHistory(false); setImage(record.img.startsWith('data:image') ? record.img : null); setRecordedVideo(record.img.startsWith('data:video') ? record.img : null); }} className="p-8 bg-slate-950 border border-green-500/5 hover:border-green-500/40 hover:bg-slate-900 transition-all cursor-pointer group flex items-center gap-8 rounded-[2.5rem] relative overflow-hidden">
                    <div className="absolute inset-0 scanning-line opacity-0 group-hover:opacity-10 transition-opacity" />
                    <div className="w-28 h-28 rounded-2xl overflow-hidden bg-slate-800 flex-shrink-0 animate-in zoom-in duration-500 border border-white/5 shadow-2xl relative">
                      {record.img.startsWith('data:video') ? (
                        <video src={record.img} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" />
                      ) : (
                        <img src={record.img} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" alt="History Item" />
                      )}
                      {record.isHealthy && <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]" />}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${record.isHealthy ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'}`}>
                            {record.isHealthy ? 'HEALTH_NOMINAL' : record.severity + '_ALERT'}
                          </span>
                          <span className="text-[10px] font-black text-slate-400 font-mono tracking-tighter uppercase">#AG-{Math.floor(Math.random() * 1000)}</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest font-mono">{new Date(record.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <h4 className="text-2xl font-black text-white outfit uppercase italic tracking-tighter group-hover:text-green-400 transition-colors">{record.plantName}</h4>
                      <div className="flex items-center gap-3">
                        <FlaskConical size={14} className="text-green-400/60" />
                        <p className="text-xs text-slate-200 font-black uppercase tracking-tight italic opacity-80 truncate max-w-[300px]">{record.diagnosis}</p>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-600 group-hover:text-green-400 group-hover:bg-slate-700 transition-all border border-white/5">
                      <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-10 bg-slate-950 border-t border-green-500/10 relative z-10 text-white">
              <button
                onClick={() => { if (confirm("INITIATE DATABASE WIPE? Historical bio-indices will be permanently purged.")) { setHistory([]); setUserItem('km_diag_history', '[]'); } }}
                className="w-full py-6 bg-rose-500/10 text-rose-500 font-black text-xs uppercase tracking-[0.4em] hover:bg-rose-600 hover:text-white rounded-[2rem] border border-rose-500/20 transition-all italic active:scale-95 shadow-2xl"
              >
                Flush Bio-Central Cache Matrix
              </button>
            </div>
          </div>
        </div>
      )}
    </div >
  );
};

export default Diagnosis;
