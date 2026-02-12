import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
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
  Sprout,
  Database,
  Map as MapIcon,
  LineChart,
  Calendar,
  History as HistoryIcon,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { DiagnosisResult, UserProfile, ScanHistoryItem, DiseaseAlert } from '../types';
import { getUserItem, setUserItem } from '../services/storageService';
import { analyzeVideoForAgriInsights, generateRegionalDiseaseAlerts } from '../services/geminiService';

interface Props {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const Diagnosis: React.FC<Props> = ({ user, setUser }) => {
  const { t } = useTranslation();
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const extractCoords = (uri: string) => {
    if (!uri) return null;
    const atMatch = uri.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
    const qMatch = uri.match(/[q|ll]=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (qMatch) return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
    return null;
  };

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
  const [showNearbySuppliers, setShowNearbySuppliers] = useState(false);
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
  const [userCoords, setUserCoords] = useState<{ lat: number, lng: number } | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const ANALYZING_MESSAGES = [
    t('diagnosis.analyzing_messages.init'),
    t('diagnosis.analyzing_messages.extracting'),
    t('diagnosis.analyzing_messages.mapping'),
    t('diagnosis.analyzing_messages.anomalies'),
    t('diagnosis.analyzing_messages.movement'),
    t('diagnosis.analyzing_messages.database'),
    t('diagnosis.analyzing_messages.insights')
  ];

  useEffect(() => {
    try {
      const saved = getUserItem('km_diag_history');
      if (saved) setHistory(JSON.parse(saved));
    } catch (err) {
      console.error("Failed to load history", err);
      setHistory([]);
    }
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
      const { latitude, longitude } = pos.coords;
      setUserCoords({ lat: latitude, lng: longitude });
      const shops = await findNearbyMedicines(result.diagnosis, latitude, longitude);
      setNearbySuppliers(shops);
      setShowNearbySuppliers(true);
      setLocatingSuppliers(false);
    }, async (err) => {
      console.error("Geolocation error:", err.code, err.message);

      // Try with a default location (Chennai, India) as fallback
      if (err.code === 1) { // Permission denied
        const useDefault = confirm("Location permission denied. Would you like to search near Chennai, India instead?");
        if (useDefault) {
          const lat = 13.0827;
          const lng = 80.2707;
          setUserCoords({ lat, lng });
          const shops = await findNearbyMedicines(result.diagnosis, lat, lng); // Chennai coords
          setNearbySuppliers(shops);
          setShowNearbySuppliers(true);
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
    setUserCoords(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 page-transition pb-24 relative px-4 md:px-6">
      {/* Header - Cockpit Style */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 print:hidden relative z-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-green-50 text-green-700 rounded-full font-black text-[10px] tracking-widest uppercase border border-green-200 shadow-sm">
            <FlaskConical size={14} className="animate-pulse" /> {t('diagnosis.title')}
          </div>
          <h2 className="text-xl md:text-6xl font-black text-slate-900 outfit tracking-tighter uppercase italic">{t('diagnosis.specimen_analysis')}</h2>
          <p className="text-slate-600 max-w-2xl text-base md:text-xl font-medium uppercase tracking-tight italic">{t('diagnosis.specimen_desc')}</p>
        </div>
        <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-3 px-8 py-4 bg-white rounded-[2rem] border border-slate-200 shadow-sm font-black text-xs uppercase tracking-widest text-slate-900 hover:bg-slate-50 transition-all active:scale-95">
          <HistoryIcon size={18} className="text-slate-400" /> {showHistory ? t('diagnosis.terminate_history') : t('diagnosis.access_records')}
        </button>
      </div>

      {/* Disease Heatmap Section */}
      <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl print:hidden relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-[0.03] pointer-events-none" />
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 text-rose-600 rounded-2xl flex items-center justify-center border border-rose-100 shadow-sm">
              <MapIcon size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 outfit tracking-tight uppercase italic">{t('diagnosis.disease_radar')}</h3>
              <p className="text-[10px] text-green-600 font-black uppercase tracking-[0.3em]">{t('diagnosis.regional_monitoring', { location: user.location })}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {loadingAlerts && <Loader2 className="animate-spin text-rose-600" size={20} />}
            <span className="px-4 py-2 bg-rose-50 text-rose-700 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse border border-rose-100 shadow-sm">{t('diagnosis.active_scan')}</span>
          </div>
        </div>

        {/* Dynamic Alerts Radar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
          {regionalAlerts.map((alert) => (
            <div key={alert.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col justify-between hover:border-rose-200 hover:bg-white transition-all group relative overflow-hidden shadow-sm hover:shadow-md">
              <div className="absolute inset-0 bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-start justify-between relative z-10">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{alert.crop}</p>
                  <h4 className="text-xl font-black text-slate-900 outfit uppercase italic">{alert.disease}</h4>
                </div>
                <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase border ${alert.severity === 'High' ? 'bg-rose-50 text-rose-700 border-rose-200' : alert.severity === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                  {alert.severity}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                  <MapPin size={14} className="text-rose-600" />
                  {alert.location} ({alert.distanceKm}km)
                </div>
                <div className="text-[9px] font-black text-slate-400 flex items-center gap-1 uppercase tracking-widest">
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
              className={`p-4 rounded-2xl border-2 cursor-pointer hover:scale-105 transition-all bg-white overflow-hidden relative group ${item.severity === 'high' ? 'border-rose-100 shadow-sm' :
                item.severity === 'medium' ? 'border-amber-100 shadow-sm' :
                  'border-green-100 shadow-sm'
                }`}
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${item.severity === 'high' ? 'bg-rose-500' : item.severity === 'medium' ? 'bg-amber-500' : 'bg-green-500'}`} />
              <p className="font-black text-slate-900 text-sm truncate relative z-10">{item.region}</p>
              <p className={`text-xs font-black mt-1 relative z-10 uppercase tracking-tighter ${item.severity === 'high' ? 'text-rose-600' :
                item.severity === 'medium' ? 'text-amber-600' :
                  'text-green-600'
                }`}>{item.disease}</p>
              <div className="flex items-center justify-between mt-2">
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${item.severity === 'high' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                  item.severity === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                    'bg-green-50 text-green-700 border border-green-100'
                  }`}>{item.severity}</span>
                <span className="text-[10px] font-bold text-slate-400">{item.cases} cases</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
            <span className="text-xs font-bold text-slate-500">{t('diagnosis.high_alert')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span className="text-xs font-bold text-slate-500">{t('diagnosis.moderate')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs font-bold text-slate-500">{t('diagnosis.low_risk')}</span>
          </div>
        </div>
      </div>

      {!result ? (
        <div className="max-w-4xl mx-auto space-y-10 print:hidden animate-in fade-in slide-in-from-bottom-5 duration-700">

          {/* Main Engagement Center */}
          <div className="bg-white rounded-[4rem] p-8 md:p-12 shadow-2xl border border-slate-100 space-y-10 relative overflow-hidden group">
            <div className="absolute inset-0 grid-bg opacity-[0.03] pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-4xl font-black outfit text-slate-900 uppercase italic tracking-tighter">{t('diagnosis.visual_interface')}</h3>
                <p className="text-green-500/60 text-[10px] font-black uppercase tracking-[0.4em]">{scanMode === 'photo' ? t('diagnosis.strict_integrity') : t('diagnosis.volumetric_discovery')}</p>
              </div>

              <div className="flex gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                <button
                  onClick={() => { setScanMode('photo'); setImage(null); setRecordedVideo(null); }}
                  className={`px-8 py-3 rounded-xl font-black text-[10px] tracking-[0.2em] uppercase transition-all flex items-center gap-3 ${scanMode === 'photo' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-400 hover:text-green-600'}`}
                >
                  <Camera size={14} /> {t('diagnosis.spectral_photo')}
                </button>
                <button
                  onClick={() => { setScanMode('video'); setImage(null); setRecordedVideo(null); }}
                  className={`px-8 py-3 rounded-xl font-black text-[10px] tracking-[0.2em] uppercase transition-all flex items-center gap-3 ${scanMode === 'video' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-400 hover:text-green-600'}`}
                >
                  <Video size={14} /> {t('diagnosis.neural_video')}
                </button>
              </div>
            </div>

            {/* Viewfinder Area */}
            <div className={`group aspect-square md:aspect-[16/9] rounded-[3rem] border-8 border-slate-50 shadow-inner flex flex-col items-center justify-center transition-all duration-700 relative overflow-hidden bg-slate-50/50`}>
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-4">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <div key={i} className="border-[0.5px] border-green-500/20" />
                  ))}
                </div>
              </div>

              {isCameraActive ? (
                <div className="w-full h-full relative">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />

                  {/* High Tech HUD Overlays */}
                  <div className="absolute inset-0 pointer-events-none border-[20px] border-transparent">
                    <div className="absolute inset-0 border border-green-500/10 rounded-2xl" />
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-green-500 rounded-tl-2xl shadow-[-5px_-5px_15px_rgba(34,197,94,0.3)]" />
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-green-500 rounded-tr-2xl shadow-[5px_-5px_15px_rgba(34,197,94,0.3)]" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-green-500 rounded-bl-2xl shadow-[-5px_5px_15px_rgba(34,197,94,0.3)]" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-green-500 rounded-br-2xl shadow-[5px_5px_15px_rgba(34,197,94,0.3)]" />

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-px bg-green-500/20" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-px bg-green-500/20" />
                  </div>

                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-10 relative z-20">
                    <button onClick={stopCamera} className="p-6 bg-white/60 backdrop-blur-xl rounded-full text-rose-500 hover:bg-rose-600 hover:text-white transition-all border border-rose-100 shadow-2xl"><X size={32} /></button>

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
                          <div className={`transition-all ${isVideoRecording ? 'w-10 h-10 rounded-xl' : 'w-14 h-14 rounded-full'} bg-white shadow-[0_0_15px_white]`} />
                        </button>
                        {isVideoRecording && (
                          <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-rose-600 text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-2xl border border-rose-400/50">
                            <Clock size={16} /> {5 - recordingTime}S
                          </div>
                        )}
                      </div>
                    )}
                    <div className="w-14 h-14" />
                  </div>
                </div>
              ) : (image || recordedVideo) ? (
                <div className="relative w-full h-full">
                  {recordedVideo ? (
                    <video src={recordedVideo} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                  ) : (
                    <img src={image!} className="w-full h-full object-cover" alt="Specimen" />
                  )}
                  {loading && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center text-slate-900 space-y-8">
                      <div className="absolute top-0 left-0 w-full h-2 bg-green-500 shadow-[0_0_30px_#22c55e] animate-[strict-scan_2s_linear_infinite] z-20" />
                      <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border-4 border-green-500/50 shadow-2xl animate-pulse">
                        <BrainCircuit size={64} className="text-green-500" />
                      </div>
                      <div className="space-y-4 text-center">
                        <p className="font-black outfit text-2xl tracking-tighter uppercase text-green-600 italic animate-pulse">{ANALYZING_MESSAGES[loadingStep]}</p>
                        <div className="w-64 h-2 bg-slate-100 rounded-full overflow-hidden mx-auto border border-slate-200">
                          <div className="h-full bg-green-500 transition-all duration-[1500ms]" style={{ width: `${((loadingStep + 1) / ANALYZING_MESSAGES.length) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  )}
                  {!loading && (
                    <button
                      onClick={() => { setImage(null); setRecordedVideo(null); }}
                      className="absolute top-8 right-8 bg-white/90 backdrop-blur-xl rounded-2xl px-6 py-4 shadow-2xl text-rose-500 border border-rose-100 hover:bg-rose-500 hover:text-white transition-all font-black text-[10px] tracking-[0.3em] uppercase flex items-center gap-3"
                    >
                      <X size={20} /> {t('diagnosis.terminate_session')}
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center text-center space-y-10 p-12 relative z-10 w-full">
                  <div className="flex flex-col sm:flex-row gap-8 w-full max-w-lg">
                    <button
                      onClick={startCamera}
                      className="flex-1 py-12 bg-white rounded-[2.5rem] shadow-xl border-2 border-slate-50 hover:border-green-500/50 hover:scale-105 transition-all flex flex-col items-center gap-4 text-green-600"
                    >
                      <div className="p-4 bg-green-50 rounded-2xl">
                        {scanMode === 'photo' ? <Camera size={40} /> : <Video size={40} />}
                      </div>
                      <span className="font-black outfit uppercase italic tracking-tighter text-xl">{t('diagnosis.engage_scanner')}</span>
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-12 bg-white rounded-[2.5rem] shadow-xl border-2 border-slate-50 hover:border-blue-500/50 hover:scale-105 transition-all flex flex-col items-center gap-4 text-blue-600"
                    >
                      <div className="p-4 bg-blue-50 rounded-2xl">
                        <Smartphone size={40} />
                      </div>
                      <span className="font-black outfit uppercase italic tracking-tighter text-xl">Upload Media</span>
                    </button>
                  </div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em]">{t('diagnosis.volumetric_discovery')}</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept={scanMode === 'photo' ? "image/*" : "video/*"} className="hidden" />
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Symptom Log Area */}
            <div className="space-y-6 pt-6">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-6 flex items-center gap-3">
                  <Activity size={14} className="text-green-500" /> {t('diagnosis.bio_symptom_log')}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('diagnosis.inquiry_placeholder')}
                  className="w-full px-8 py-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] h-44 focus:ring-4 focus:ring-green-500/5 focus:border-green-500/20 resize-none transition-all font-black outfit text-xl shadow-inner outline-none text-slate-700 placeholder:text-slate-300 uppercase italic"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 flex items-center gap-5">
                  <div className="p-4 bg-white rounded-2xl shadow-sm text-amber-500"><ShieldAlert size={24} /></div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('diagnosis.zero_malpractice')}</p>
                    <p className="text-xs font-bold text-slate-600 leading-tight italic">{t('diagnosis.malpractice_desc')}</p>
                  </div>
                </div>

                <button
                  onClick={handleDiagnose}
                  disabled={(!image && !recordedVideo) || loading}
                  className="bg-green-900 text-white rounded-[2rem] font-black text-2xl uppercase italic tracking-widest flex items-center justify-center gap-5 hover:bg-black transition-all shadow-2xl disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed active:scale-95 group"
                >
                  {loading ? <Loader2 className="animate-spin" size={28} /> : <Zap size={28} fill={(!image && !recordedVideo) ? "none" : "currentColor"} />}
                  {loading ? t('diagnosis.authenticating') : t('diagnosis.run_inference')}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="p-6 bg-rose-50 border border-rose-100 rounded-[2.5rem] text-rose-500 font-black text-sm uppercase tracking-wider italic flex items-center gap-4 animate-in zoom-in-95">
                <AlertTriangle size={24} /> {t('diagnosis.interface_error', { message: errorMessage })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* --- REDESIGNED AI DIAGNOSIS REPORT --- */
        <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000 stagger-in relative z-10 pb-24">

          {/* Integrity Breach Alert */}
          {result && (!result.isPlant || result.integrityScore < 40) && (
            <div className="bg-rose-50/80 backdrop-blur-xl p-10 rounded-[3.5rem] shadow-2xl border border-rose-100 flex flex-col md:flex-row items-center gap-8 animate-pulse relative overflow-hidden text-center md:text-left">
              <div className="absolute inset-0 bg-rose-500/5" />
              <div className="w-20 h-20 bg-white text-rose-500 rounded-3xl flex items-center justify-center shadow-lg border border-rose-100 shrink-0"><AlertCircle size={40} /></div>
              <div className="space-y-1 flex-1">
                <h4 className="text-3xl font-black outfit uppercase italic tracking-tighter text-rose-900">{t('diagnosis.integrity_breach')}</h4>
                <p className="text-lg font-black text-rose-700/60 uppercase tracking-tight italic">{result?.malpracticeAlert || "Authentication failed. Specimen integrity insufficient for remediation protocol."}</p>
              </div>
              <button onClick={reset} className="px-10 py-5 bg-rose-600 text-white rounded-[1.8rem] font-black uppercase text-xs shadow-xl active:scale-95 transition-all hover:bg-rose-700">{t('diagnosis.terminated_protocol')}</button>
            </div>
          )}

          {result && (
            <div ref={reportRef} className="space-y-12">

              {/* Identity & Specimen Hub */}
              <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-50 overflow-hidden relative group">
                <div className="absolute inset-0 grid-bg opacity-[0.03] pointer-events-none" />
                <div className="flex flex-col lg:flex-row h-full">

                  {/* Specimen Media Panel */}
                  <div className="lg:w-1/2 aspect-square md:aspect-[4/3] lg:aspect-auto relative overflow-hidden bg-slate-100">
                    {recordedVideo ? (
                      <video src={recordedVideo} autoPlay loop muted playsInline className="w-full h-full object-cover scale-105" />
                    ) : (
                      <img src={image!} className="w-full h-full object-cover scale-105" alt="Specimen" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-green-400 uppercase tracking-[0.5em]">{t('diagnosis.specimen_authenticated')}</p>
                        <h4 className="text-4xl md:text-5xl font-black text-white outfit uppercase italic tracking-tighter shadow-sm">{result?.plantName}</h4>
                      </div>
                      <div className={`px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 backdrop-blur-xl border ${result?.isHealthy ? 'bg-green-500/30 text-green-300 border-green-500/40' : 'bg-rose-500/30 text-rose-300 border-rose-500/40'}`}>
                        {result?.isHealthy ? <BadgeCheck size={14} className="animate-pulse" /> : <AlertCircle size={14} className="animate-pulse" />}
                        {result?.isHealthy ? t('diagnosis.bio_integrity_stable') : t('diagnosis.anomalous_matrix')}
                      </div>
                    </div>
                  </div>

                  {/* Core Intelligence Briefing */}
                  <div className="lg:w-1/2 p-10 md:p-14 lg:p-16 flex flex-col justify-between space-y-12 relative overflow-hidden">
                    <div className="space-y-10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-green-600">
                          <BrainCircuit size={24} className="opacity-60" />
                          <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Neural Inference Verdict</p>
                        </div>
                        <div className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black text-slate-400 font-mono tracking-widest">#AG-{Math.floor(Math.random() * 9999)}</div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-4xl md:text-6xl font-black text-slate-900 outfit tracking-tighter uppercase italic leading-none">{result.diagnosis}</h3>
                        <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner group/cause relative overflow-hidden">
                          <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover/cause:opacity-100 transition-opacity" />
                          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 flex items-center gap-3 italic"><Fingerprint size={16} /> Cause Analysis Matrix</h5>
                          <p className="text-2xl font-black text-green-800 leading-tight italic uppercase tracking-tighter">"{result.causeAnalysis}"</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-xl space-y-1 flex flex-col justify-center">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t('diagnosis.integrity_index')}</p>
                          <p className={`text-2xl font-black outfit italic uppercase ${result.integrityScore > 80 ? 'text-green-600' : 'text-amber-600'}`}>{result.integrityScore}%</p>
                        </div>
                        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-xl space-y-1 flex flex-col justify-center">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t('diagnosis.pathogen_load')}</p>
                          <p className={`text-2xl font-black outfit italic uppercase ${result.severity === 'High' ? 'text-rose-600' : 'text-amber-600'}`}>{result.severity}</p>
                        </div>
                        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-xl space-y-1 flex flex-col justify-center col-span-2 md:col-span-1">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t('diagnosis.stability_ratio')}</p>
                          <p className="text-2xl font-black outfit text-blue-600 italic uppercase">{100 - result.healthScoreImpact}%</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-10 border-t border-slate-100">
                      <button
                        onClick={() => document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth' })}
                        className="flex-1 px-8 py-5 bg-green-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl active:scale-95 italic"
                      >
                        {t('diagnosis.deploy_solutions')} <ArrowDown size={14} className="animate-bounce" />
                      </button>
                      <button
                        onClick={() => setShowPassport(true)}
                        className="flex-1 px-8 py-5 bg-slate-50 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-100 transition-all border border-slate-200 active:scale-95 italic"
                      >
                        <BadgeCheck size={18} className="text-green-600" /> {t('diagnosis.gen_passport')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* PRIORITY REMEDIATION ROADMAP - ACTION CENTER */}
              {(result.isPlant && result.integrityScore >= 40) && (
                <div id="roadmap" className="space-y-12 animate-in slide-in-from-bottom-20 duration-1000 stagger-in relative z-10">

                  {/* Organic Remediation Hub */}
                  <div className="bg-[#234d3a] rounded-[4rem] p-10 md:p-16 text-white relative overflow-hidden group shadow-2xl">
                    <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
                    <div className="relative z-10 space-y-10">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div className="space-y-4 text-center md:text-left">
                          <div className="flex items-center justify-center md:justify-start gap-4 text-[#C8E6C9]">
                            <Sprout size={32} className="shrink-0" />
                            <h4 className="text-4xl md:text-6xl font-black outfit tracking-tighter uppercase italic">{t('diagnosis.organic_remedy')}</h4>
                          </div>
                          <p className="text-lg md:text-xl font-medium text-[#A5D6A7] uppercase tracking-tight italic max-w-2xl">{t('diagnosis.remedy_desc')}</p>
                        </div>
                        <div className="p-6 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 flex items-center gap-6 self-center md:self-start">
                          <div className="text-right hidden md:block">
                            <p className="text-[10px] font-black text-[#C8E6C9] uppercase tracking-[0.3em]">{t('diagnosis.auth_source')}</p>
                            <p className="text-lg font-black text-white outfit uppercase italic">Botany-AI v4.2</p>
                          </div>
                          <div className="w-14 h-14 bg-[#C8E6C9] text-[#234d3a] rounded-2xl flex items-center justify-center shadow-lg"><Zap size={28} /></div>
                        </div>
                      </div>

                      <div className="bg-white/5 backdrop-blur-md p-10 md:p-14 rounded-[3.5rem] border border-white/10 shadow-inner group/remedy relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover/remedy:rotate-12 transition-transform duration-1000"><FlaskConical size={200} /></div>
                        <p className="text-2xl md:text-4xl font-black outfit leading-tight italic uppercase tracking-tighter text-[#C8E6C9] relative z-10 text-center">"{result.organicRemedy}"</p>
                      </div>

                      <div className="flex flex-col md:flex-row items-center justify-between gap-10 pt-10 border-t border-white/10">
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                          {result.safetyProtocol.ppeRequired.map((gear: string, i: number) => (
                            <span key={i} className="px-5 py-3 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#C8E6C9] border border-white/10 hover:bg-white/20 transition-all cursor-default">{gear}</span>
                          ))}
                        </div>
                        <button
                          onClick={() => handleTTS(`Recommended organic protocol: ${result.organicRemedy}. Please ensure you use ${result.safetyProtocol.ppeRequired.join(', ')} during application.`)}
                          className={`flex items-center gap-4 px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-2xl ${isSpeaking ? 'bg-amber-500 text-white animate-pulse' : 'bg-[#C8E6C9] text-[#1b4332] hover:bg-white'}`}
                        >
                          <Volume2 size={20} /> {isSpeaking ? t('diagnosis.broadcasting') : t('diagnosis.ai_guidance')}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="bg-white rounded-[3.5rem] p-10 md:p-14 border border-slate-100 shadow-xl space-y-10 relative overflow-hidden group hover:border-rose-100 transition-all">
                      <div className="space-y-8 relative z-10">
                        <div className="flex items-center gap-5 text-rose-500">
                          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 shadow-sm"><FlaskConical size={32} /></div>
                          <h5 className="text-2xl font-black outfit uppercase tracking-[0.3em] leading-none italic">{t('diagnosis.chemical_counter_measures')}</h5>
                        </div>
                        <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-inner text-center">
                          <p className="text-xl font-black text-rose-900 leading-tight italic uppercase tracking-tighter">"{result.chemicalRemedy}"</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-[3.5rem] p-10 md:p-14 border border-slate-100 shadow-xl space-y-10 relative overflow-hidden group hover:border-amber-100 transition-all">
                      <div className="space-y-8 relative z-10">
                        <div className="flex items-center gap-5 text-amber-500">
                          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 shadow-sm"><ShieldAlert size={32} /></div>
                          <h5 className="text-2xl font-black outfit uppercase tracking-[0.3em] leading-none italic">{t('diagnosis.biosafety_overlays')}</h5>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-center">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('diagnosis.exposure_index')}</p>
                            <p className="text-xl font-black outfit uppercase italic text-rose-600">{result?.safetyProtocol?.riskToBystanders || 'Calculating...'}</p>
                          </div>
                          <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-center">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('diagnosis.matrix_lockout')}</p>
                            <p className="text-xl font-black text-slate-950 outfit uppercase italic">{result?.safetyProtocol?.waitPeriod || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-2 bg-[#1a1c1e] rounded-[4rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
                      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
                      <div className="relative z-10 space-y-12">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                          <div className="space-y-4 text-center md:text-left">
                            <h4 className="text-4xl md:text-6xl font-black outfit tracking-tighter uppercase italic text-blue-400">{t('diagnosis.supplier_proximity_matrix')}</h4>
                            <p className="text-lg font-medium text-slate-400 uppercase tracking-tight italic">{t('diagnosis.matrix_desc')}</p>
                          </div>
                          <Link to="/marketplace" className="px-10 py-5 bg-blue-600 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-widest hover:bg-white hover:text-blue-600 transition-all shadow-xl active:scale-95 italic">
                            {t('diagnosis.full_inventory')}
                          </Link>
                        </div>

                        {showNearbySuppliers && nearbySuppliers && (
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                            {nearbySuppliers.places.slice(0, 4).map((place: any, i: number) => (
                              <div key={i} className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity"><ExternalLink size={32} /></div>
                                <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em] mb-4">{place.distance || '2.4'} {t('diagnosis.km_radius')}</p>
                                <h5 className="text-xl font-black outfit text-white uppercase italic tracking-tight mb-2 truncate">{place.name}</h5>
                                <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-6 h-8 line-clamp-2">{place.address}</p>
                                <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full w-fit">
                                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                                  <span className="text-[8px] font-black uppercase tracking-widest text-blue-400">{place.availability || 'In Stock'}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="p-8 bg-rose-500/10 rounded-[2.5rem] border border-rose-500/20 flex items-start gap-6 shadow-2xl relative overflow-hidden group">
                          <div className="absolute inset-0 bg-rose-500/5 animate-pulse" />
                          <AlertCircle size={28} className="text-rose-500 shrink-0 mt-1 relative z-10" />
                          <p className="text-sm font-black text-rose-400 leading-relaxed italic uppercase tracking-tight relative z-10">"{result?.safetyProtocol?.humanDetectionWarning || "Ensure area is clear during bio-application."}"</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* History & Biometric Trends Section - HUD Style */}
              <div className="bg-white rounded-[4rem] p-12 border border-slate-100 shadow-inner space-y-10 relative overflow-hidden">
                <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
                      <LineChart size={24} />
                    </div>
                    <div>
                      <h5 className="text-2xl font-black text-slate-900 outfit tracking-tight uppercase italic">{t('diagnosis.biometric_trends')}</h5>
                      <p className="text-[10px] text-green-600 font-black uppercase tracking-[0.3em]">{t('diagnosis.historical_data', { plant: result.plantName })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-[9px] font-black uppercase text-green-600 tracking-widest">
                    <Calendar size={14} /> {t('diagnosis.live_update', { date: new Date().toLocaleDateString() })}
                  </div>
                </div>

                <div className="h-64 flex items-end justify-between px-8 pb-6 border-b border-slate-100 relative z-10">
                  <div className="absolute inset-x-0 top-0 h-px bg-slate-50" />
                  <div className="absolute inset-x-0 top-1/4 h-px bg-slate-50" />
                  <div className="absolute inset-x-0 top-2/4 h-px bg-slate-50" />
                  <div className="absolute inset-x-0 top-3/4 h-px bg-slate-50" />

                  {history.slice(0, 7).reverse().map((record, i) => {
                    const health = 100 - record.healthScoreImpact;
                    return (
                      <div key={i} className="flex flex-col items-center gap-4 group cursor-crosshair">
                        <div className="relative">
                          <div
                            className={`w-14 rounded-t-xl transition-all duration-1000 group-hover:brightness-120 group-hover:shadow-md relative ${record.isHealthy ? 'bg-green-500' : record.severity === 'High' ? 'bg-rose-500' : 'bg-amber-500'}`}
                            style={{ height: `${health * 1.5}px` }}
                          >
                            <div className="absolute inset-0 opacity-20" />
                          </div>
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-white text-slate-900 text-[10px] px-3 py-1.5 rounded-lg border border-slate-200 font-black whitespace-nowrap shadow-2xl z-20 -translate-y-2 group-hover:translate-y-0">
                            {health}% {t('diagnosis.stability')}
                          </div>
                        </div>
                        <div className="space-y-1 text-center">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{new Date(record.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                          <div className={`w-1 h-1 rounded-full mx-auto ${record.isHealthy ? 'bg-green-500 animate-pulse' : 'bg-rose-500'}`} />
                        </div>
                      </div>
                    );
                  })}
                  {history.length < 2 && (
                    <div className="flex-1 flex flex-col items-center justify-center h-full text-slate-300 space-y-4 animate-pulse">
                      <HistoryIcon size={48} className="opacity-20" />
                      <p className="text-xs font-black uppercase tracking-[0.5em]">{t('diagnosis.establishing_baseline')}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Maps Grounding Section - HUD Style */}
              {
                nearbySuppliers && (
                  <div className="bg-white rounded-[4rem] p-12 border border-slate-200 shadow-2xl space-y-10 animate-in slide-in-from-bottom-10 duration-700 relative overflow-hidden">
                    <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />

                    {/* Tactical Operations Hub */}
                    <div className="space-y-8 relative z-10 w-full">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-slate-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center border border-blue-100 shadow-sm"><MapPin size={32} /></div>
                        <div>
                          <h5 className="text-3xl font-black outfit text-slate-900 tracking-tight uppercase italic">{t('diagnosis.supplier_matrix')}</h5>
                          <p className="text-[10px] font-black text-green-600/40 uppercase tracking-[0.4em]">{t('diagnosis.verified_nodes', { diagnosis: result.diagnosis })}</p>
                        </div>
                      </div>

                      {/* Primary Tactical Map */}
                      {userCoords && (
                        <div className="rounded-[3.5rem] overflow-hidden border-4 border-slate-100 shadow-xl h-[500px] relative animate-in slide-in-from-top-10 duration-1000 bg-slate-50">
                          <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps?q=agricultural+supply+shops+near+${encodeURIComponent(result.diagnosis)}+at+${userCoords.lat},${userCoords.lng}&output=embed`}
                            className="opacity-90 grayscale-[0.5] contrast-125 active:grayscale-0 transition-all hover:opacity-100 hover:grayscale-0"
                          ></iframe>
                          <div className="absolute top-8 left-8 flex flex-col gap-3">
                            <div className="px-6 py-3 bg-white/90 backdrop-blur-xl rounded-full border border-slate-200 flex items-center gap-3 shadow-2xl">
                              <MapPin size={20} className="animate-pulse text-green-500" />
                              <span className="text-[12px] font-black text-slate-900 uppercase tracking-widest italic">{t('diagnosis.live_logistics')}</span>
                            </div>
                          </div>
                          <div className="absolute bottom-8 right-8 flex flex-col items-end gap-3">
                            <div className="px-6 py-3 bg-green-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg">
                              {t('diagnosis.gps_locked', { lat: userCoords.lat.toFixed(4), lng: userCoords.lng.toFixed(4) })}
                            </div>
                          </div>
                          {/* Map Overlay Scan Line */}
                          <div className="absolute inset-x-0 top-0 h-1 bg-green-500/20 pointer-events-none" />
                        </div>
                      )}

                      {/* AI Advisory Uplink */}
                      <div className="p-10 bg-blue-50/40 backdrop-blur-xl rounded-[3rem] border border-blue-100 prose prose-invert max-w-none text-blue-700 font-black text-xl italic leading-relaxed relative overflow-hidden group">
                        <div className="absolute inset-0 bg-blue-500/5 opacity-10 group-hover:opacity-20 transition-opacity" />
                        <div className="relative z-10">
                          <span className="px-4 py-1.5 bg-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block border border-blue-500/30">{t('diagnosis.intelligence_briefing')}</span>
                          <p className="mt-4 leading-relaxed whitespace-pre-wrap">"{nearbySuppliers.text}"</p>
                        </div>
                      </div>

                      {/* Supplier Node Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {nearbySuppliers.places.map((place: any, i: number) => {
                          const coords = extractCoords(place.maps?.uri);
                          const distance = userCoords && coords ? calculateDistance(userCoords.lat, userCoords.lng, coords.lat, coords.lng) : null;

                          return (
                            <a key={i} href={place.maps?.uri} target="_blank" rel="noopener noreferrer" className="p-10 bg-slate-50 border border-slate-200 rounded-[3rem] hover:border-blue-400 transition-all group flex flex-col justify-between gap-8 hover:-translate-y-3 duration-500 shadow-inner overflow-hidden relative border-t-4 border-t-green-100 hover:border-t-blue-400">
                              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100" />
                              <div className="space-y-6 relative z-10">
                                <div className="flex justify-between items-start gap-4">
                                  <h6 className="font-black text-2xl text-slate-900 outfit group-hover:text-blue-600 transition-colors uppercase italic leading-tight flex-1 tracking-tighter">{place.maps?.title || "Supplier Node"}</h6>
                                  {distance && (
                                    <div className="flex flex-col items-end gap-1">
                                      <span className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg">
                                        {distance} KM
                                      </span>
                                      <span className="text-[7px] font-black text-blue-400/60 uppercase tracking-widest">{t('diagnosis.range')}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 py-3 border-y border-slate-100">
                                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                                  <p className="text-[9px] font-black text-green-600 uppercase tracking-widest">{t('diagnosis.active_node')}</p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-blue-600 font-black text-xs uppercase tracking-[0.4em] relative z-10 pt-4">
                                <span>{t('diagnosis.establish_link')}</span>
                                <ChevronRight size={22} className="group-hover:translate-x-3 transition-transform" />
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )
              }

              <div className="flex justify-center pt-12 print:hidden">
                <button onClick={reset} className="px-16 py-8 bg-slate-50 text-slate-600 rounded-[3rem] font-black text-xl flex items-center justify-center gap-6 hover:bg-white hover:text-green-600 hover:border-green-200 transition-all shadow-inner active:scale-95 group border-4 border-transparent"><RefreshCw size={32} className="group-hover:rotate-180 transition-transform duration-1000" /> {t('diagnosis.start_new_sequence')}</button>
              </div>
            </div>
          )}
        </div>
      )
      }

      <style>{`
        @keyframes strict-scan {
          0% { transform: translateY(-10%); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(1000%); opacity: 0; }
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
      {
        showPassport && result && (
          <div className="fixed inset-0 z-[200] bg-white/98 backdrop-blur-3xl flex items-center justify-center p-6 page-transition">
            <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
            <div className="bg-white w-full max-w-5xl rounded-[4rem] overflow-hidden shadow-2xl flex flex-col md:flex-row relative border border-slate-100">

              {/* Left Side: Biometric ID Card */}
              <div className="md:w-[45%] bg-slate-50 p-16 flex flex-col items-center justify-center space-y-12 border-r border-slate-100 relative overflow-hidden">
                <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
                <div className="w-full flex justify-between items-start absolute top-10 px-10">
                  <div className="p-4 bg-white rounded-2xl border border-green-200"><ShieldCheck className="text-green-600" size={32} /></div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-green-600/80 uppercase tracking-[0.4em]">{t('diagnosis.auth_level')}</p>
                    <p className="text-xl font-black text-green-600 outfit italic">{t('diagnosis.secured_phi')}</p>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-10 bg-green-500/10 rounded-full blur-3xl opacity-50 animate-pulse" />
                  <div className="w-64 h-64 rounded-[3.5rem] bg-white border-4 border-slate-100 overflow-hidden shadow-xl relative z-10 group-hover:scale-105 transition-transform duration-700">
                    <div className="absolute inset-0 bg-green-500/10" />
                    <img src={image || "/placeholder-plant.jpg"} className="w-full h-full object-cover" alt="Specimen Profile" />
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-green-600 text-white rounded-3xl flex items-center justify-center shadow-2xl z-20 animate-float"><QrCode size={40} /></div>
                </div>

                <div className="text-center space-y-3 relative z-10">
                  <h3 className="text-5xl font-black text-slate-900 outfit uppercase italic tracking-tighter">{result.plantName}</h3>
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-ping" />
                    <p className="text-xs text-green-600/60 font-black uppercase tracking-[0.5em]">{t('diagnosis.active_bio_node')}</p>
                  </div>
                </div>

                <div className="w-full pt-10 border-t border-slate-200 space-y-6 relative z-10">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">{t('diagnosis.specimen_hash')}</span>
                    <span className="text-green-600 font-mono">#PHI-{Math.floor(Math.random() * 999999)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">{t('diagnosis.authority_date')}</span>
                    <span className="text-green-600 font-mono">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Security Clearance Data */}
              <div className="flex-1 p-16 space-y-12 relative overflow-hidden flex flex-col justify-center">
                <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-green-600 font-black text-xs uppercase tracking-[0.5em] italic">
                    <BadgeCheck size={20} /> {t('diagnosis.security_clearance')}
                  </div>
                  <h2 className="text-6xl font-black text-slate-900 outfit tracking-tighter uppercase italic leading-none">{t('diagnosis.bio_passport')}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-4 shadow-inner group hover:border-green-200 transition-all">
                    <h6 className="text-[10px] font-black text-green-600 uppercase tracking-[0.5em]">{t('diagnosis.health_index')}</h6>
                    <div className="flex items-end gap-3">
                      <span className="text-6xl font-black text-slate-900 outfit italic">{100 - result.healthScoreImpact}%</span>
                      <span className="text-green-600 font-black text-xs uppercase mb-3 italic">{t('diagnosis.stable')}</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-4 shadow-inner group hover:border-blue-200 transition-all">
                    <h6 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.5em]">{t('diagnosis.integrity_auth')}</h6>
                    <div className="flex items-end gap-3">
                      <span className="text-6xl font-black text-slate-900 outfit italic">{result.integrityScore}%</span>
                      <span className="text-blue-600 font-black text-xs uppercase mb-3 italic">{t('diagnosis.verified')}</span>
                    </div>
                  </div>
                </div>

                <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 space-y-6 relative overflow-hidden group">
                  <div className="absolute inset-0 opacity-5" />
                  <h6 className="text-[11px] font-black text-green-600 uppercase tracking-[0.4em] flex items-center gap-3"><Fingerprint size={16} /> {t('diagnosis.diagnostic_signature')}</h6>
                  <p className="text-2xl font-black text-green-600 leading-tight italic uppercase tracking-tighter">"{result.diagnosis}"</p>
                </div>

                <div className="pt-8 flex flex-col sm:flex-row items-center gap-6 text-slate-900">
                  <button
                    onClick={() => handleDownloadReport()}
                    className="w-full py-6 bg-green-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-green-500 shadow-xl transition-all italic active:scale-95"
                  >
                    <Download size={20} /> {t('diagnosis.encrypt_export')}
                  </button>
                  <button
                    onClick={() => setShowPassport(false)}
                    className="w-full py-6 bg-slate-100 text-slate-600 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-slate-200 transition-all italic active:scale-95 border border-slate-200"
                  >
                    {t('diagnosis.terminate_session')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* History Overlay - Bio-Archive Database */}
      {
        showHistory && (
          <div className="fixed inset-0 z-[200] bg-white/95 backdrop-blur-2xl flex items-center justify-end p-0 md:p-6 page-transition">
            <div className="bg-white w-full max-w-3xl h-full md:h-auto md:max-h-[90vh] md:rounded-[3.5rem] overflow-hidden shadow-2xl relative flex flex-col border border-slate-100">
              <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />

              <div className="p-12 border-b border-slate-100 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-slate-50 text-green-600 rounded-3xl flex items-center justify-center border border-green-100 shadow-inner animate-pulse">
                    <Database size={32} />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 outfit uppercase italic tracking-tighter">{t('diagnosis.bio_archive')}</h2>
                    <p className="text-[10px] text-green-600/40 font-black uppercase tracking-[0.5em]">{t('diagnosis.secure_records', { count: history.length })}</p>
                  </div>
                </div>
                <button onClick={() => setShowHistory(false)} className="p-5 bg-slate-100 text-slate-400 rounded-2xl hover:bg-rose-50 hover:text-rose-600 transition-all border border-slate-200"><X size={28} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 space-y-8 custom-scrollbar relative z-10">
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
                    <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-300 animate-pulse border border-slate-100"><HistoryIcon size={64} /></div>
                    <div>
                      <p className="text-2xl font-black text-slate-600 outfit uppercase italic">{t('diagnosis.database_empty')}</p>
                      <p className="text-xs text-slate-700 font-black uppercase tracking-widest mt-2 px-12 leading-relaxed">{t('diagnosis.initial_captures')}</p>
                    </div>
                  </div>
                ) : (
                  history.map((record, i) => (
                    <div key={i} onClick={() => { setResult(record); setShowHistory(false); setImage(record.img?.startsWith('data:image') ? record.img : null); setRecordedVideo(record.img?.startsWith('data:video') ? record.img : null); }} className="p-8 bg-slate-50 border border-slate-100 hover:border-green-400 hover:bg-white transition-all cursor-pointer group flex items-center gap-8 rounded-[2.5rem] relative overflow-hidden shadow-sm hover:shadow-xl">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" />
                      <div className="w-28 h-28 rounded-2xl overflow-hidden bg-white flex-shrink-0 animate-in zoom-in duration-500 border border-slate-100 shadow-2xl relative">
                        {record.img?.startsWith('data:video') ? (
                          <video src={record.img} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" />
                        ) : (
                          <img src={record.img || ''} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" alt="History Item" />
                        )}
                        {record.isHealthy && <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]" />}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${record.isHealthy ? 'bg-green-500/10 text-green-600 border-green-500/30' : 'bg-rose-500/10 text-rose-600 border-rose-500/30'}`}>
                              {record.isHealthy ? t('diagnosis.health_nominal') : record.severity + '_ALERT'}
                            </span>
                            <span className="text-[10px] font-black text-slate-400 font-mono tracking-tighter uppercase">#AG-{Math.floor(Math.random() * 1000)}</span>
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">{new Date(record.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <h4 className="text-2xl font-black text-slate-900 outfit uppercase italic tracking-tighter group-hover:text-green-600 transition-colors">{record.plantName}</h4>
                        <div className="flex items-center gap-3">
                          <FlaskConical size={14} className="text-green-600/60" />
                          <p className="text-xs text-slate-600 font-black uppercase tracking-tight italic opacity-80 truncate max-w-[300px]">{record.diagnosis}</p>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-green-600 group-hover:bg-slate-50 transition-all border border-slate-100">
                        <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-10 bg-slate-50 border-t border-slate-100 relative z-10 text-slate-900">
                <button
                  onClick={() => { if (confirm(t('diagnosis.initiate_wipe'))) { setHistory([]); setUserItem('km_diag_history', '[]'); } }}
                  className="w-full py-6 bg-rose-50 text-rose-600 font-black text-xs uppercase tracking-[0.4em] hover:bg-rose-600 hover:text-white rounded-[2rem] border border-rose-200 transition-all italic active:scale-95 shadow-2xl"
                >
                  {t('diagnosis.flush_cache')}
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default Diagnosis;
