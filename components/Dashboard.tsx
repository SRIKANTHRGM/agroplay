import React, { useState, useEffect, useRef } from 'react';
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
  Scan,
  ShieldCheck,
  Camera,
  X,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { chatFast, predictHarvestYield, verifyTaskCompletion } from '../services/geminiService';
import { Link, useNavigate } from 'react-router-dom';
import {
  getUserItem,
  setUserItem,
  removeUserItem
} from '../services/storageService';
import VoiceAssistant from './VoiceAssistant';

interface Props {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const Dashboard: React.FC<Props> = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [msgInput, setMsgInput] = useState('');
  const [chatResponse, setChatResponse] = useState<string | null>(null);
  const [loadingChat, setLoadingChat] = useState(false);
  const [activePlot, setActivePlot] = useState<CropPlot | null>(null);
  const [statCounters, setStatCounters] = useState({ temp: 32, moisture: 45, humidity: 62 });
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  // Verification State
  const [verifyingItem, setVerifyingItem] = useState<{ id: string, title: string, reward: number, type: 'challenge' | 'goal' } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationImg, setVerificationImg] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState<{ verified: boolean, reasoning: string } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Challenges State - Daily rotating challenges
  const generateDailyChallenges = () => {
    const today = new Date().toDateString();
    const allChallenges = [
      { id: 'ch-1', title: "Plant 2 new crops", reward: 50 },
      { id: 'ch-2', title: "Check soil health", reward: 30 },
      { id: 'ch-3', title: "Engage in Community", reward: 20 },
      { id: 'ch-4', title: "Water efficient irrigation", reward: 40 },
      { id: 'ch-5', title: "Research crop rotation", reward: 35 },
      { id: 'ch-6', title: "Monitor pest activity", reward: 45 },
      { id: 'ch-7', title: "Update farm records", reward: 25 },
      { id: 'ch-8', title: "Share best practices", reward: 30 },
      { id: 'ch-9', title: "Test soil nutrients", reward: 50 }
    ];

    // Use date to seed selection for consistent daily challenges
    const dateHash = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const startIdx = dateHash % allChallenges.length;

    // Select 3 challenges for the day
    const selected = [];
    for (let i = 0; i < 3; i++) {
      selected.push({
        ...allChallenges[(startIdx + i) % allChallenges.length],
        progress: 0,
        completed: false
      });
    }

    return selected;
  };

  const [dailyChallenges, setDailyChallenges] = useState(() => {
    const today = new Date().toDateString();
    const saved = getUserItem('kisaanmitra_daily_challenges');
    const lastUpdate = getUserItem('kisaanmitra_challenges_date');

    // If it's a new day, generate new challenges
    if (!saved || lastUpdate !== today) {
      const newChallenges = generateDailyChallenges();
      localStorage.setItem('kisaanmitra_daily_challenges', JSON.stringify(newChallenges));
      localStorage.setItem('kisaanmitra_challenges_date', today);
      return newChallenges;
    }

    return JSON.parse(saved);
  });

  // Goals State
  const [activeGoals, setActiveGoals] = useState([
    { id: 'g-1', title: 'Water Audit', pts: 50, status: 'In Progress', icon: Droplets, color: 'blue' },
    { id: 'g-2', title: 'Pest Scouting', pts: 100, status: 'Available', icon: Sparkles, color: 'green' },
    { id: 'g-3', title: 'Soil pH Check', pts: 150, status: 'Available', icon: Thermometer, color: 'amber' }
  ]);

  // Yield Prediction States
  const [prediction, setPrediction] = useState<any>(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);

  useEffect(() => {
    // Sync completed status with activePlot if exists
    if (activePlot) {
      setActiveGoals(prev => prev.map(g =>
        g.id === 'g-1' && activePlot.progress > 20 ? { ...g, status: 'Completed' } : g
      ));

      // Load cached prediction first
      if (!prediction && !loadingPrediction) {
        const cached = getUserItem(`km_pred_${activePlot.crop!.name}`);
        if (cached) {
          setPrediction(JSON.parse(cached));
        } else {
          handleGetPrediction(activePlot.crop!.name);
        }
      }
    }
  }, [activePlot, prediction, loadingPrediction]);

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

    // Real-time stat simulation
    const interval = setInterval(() => {
      setStatCounters(prev => ({
        temp: +(28 + Math.random() * 8).toFixed(1),
        moisture: +(40 + Math.random() * 15).toFixed(0),
        humidity: +(55 + Math.random() * 20).toFixed(0)
      }));
    }, 10000);

    // Check for daily challenge reset
    const checkDailyChallenges = () => {
      const today = new Date().toDateString();
      const lastUpdate = getUserItem('kisaanmitra_challenges_date');

      if (lastUpdate !== today) {
        const newChallenges = generateDailyChallenges();
        setDailyChallenges(newChallenges);
        localStorage.setItem('kisaanmitra_daily_challenges', JSON.stringify(newChallenges));
        localStorage.setItem('kisaanmitra_challenges_date', today);
      }
    };

    // Check every minute for day rollover
    const challengeInterval = setInterval(checkDailyChallenges, 60000);

    return () => {
      clearInterval(interval);
      clearInterval(challengeInterval);
    };
  }, []);

  const startCamera = async () => {
    setIsCameraActive(true);
    setVerificationImg(null);
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
      setVerificationImg(dataUrl);
      stopCamera();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVerificationImg(reader.result as string);
        setVerificationFeedback(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerify = (item: any, type: 'challenge' | 'goal') => {
    setVerifyingItem({
      id: item.id,
      title: item.title,
      reward: type === 'challenge' ? item.reward : item.pts,
      type
    });
    setVerificationImg(null);
    setVerificationFeedback(null);
  };

  const confirmVerification = async () => {
    if (!verifyingItem || !verificationImg) return;
    setIsVerifying(true);
    setVerificationFeedback(null);

    try {
      const base64 = verificationImg.split(',')[1];
      const result = await verifyTaskCompletion(
        verifyingItem.title,
        `Complete the ${verifyingItem.type}: ${verifyingItem.title}`,
        base64
      );

      setVerificationFeedback(result);

      if (result.verified) {
        // Success
        setTimeout(() => {
          setUser(prev => ({
            ...prev,
            points: prev.points + verifyingItem.reward
          }));

          if (verifyingItem.type === 'challenge') {
            const updated = dailyChallenges.map(ch =>
              ch.id === verifyingItem.id ? { ...ch, progress: 100, completed: true } : ch
            );
            setDailyChallenges(updated);
            localStorage.setItem('kisaanmitra_daily_challenges', JSON.stringify(updated));
          } else {
            setActiveGoals(prev => prev.map(g =>
              g.id === verifyingItem.id ? { ...g, status: 'Completed' } : g
            ));
          }
          setVerifyingItem(null);
          setVerificationImg(null);
          setVerificationFeedback(null);
        }, 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleGetPrediction = async (cropName: string) => {
    setLoadingPrediction(true);
    try {
      const data = await predictHarvestYield(cropName, user.location, user.soilType);
      setPrediction(data);
      // Cache the result using the storage service for consistent keys
      setUserItem(`km_pred_${cropName}`, JSON.stringify(data));
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

      {/* Verification Modal */}
      {verifyingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden p-10 text-center space-y-6 animate-in zoom-in-95 relative">
            <button
              onClick={() => { setVerifyingItem(null); stopCamera(); }}
              className="absolute top-8 right-8 w-10 h-10 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-200 transition-all z-20"
            >
              <X size={20} />
            </button>

            <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-xl ${isVerifying ? 'bg-blue-100 text-blue-600' : verificationFeedback?.verified ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
              {isVerifying ? <Loader2 size={32} className="animate-spin" /> : verificationFeedback?.verified ? <CheckCircle2 size={32} /> : <ShieldCheck size={32} />}
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black outfit text-slate-800 tracking-tight">
                {isVerifying ? 'Analyzing Proof...' : verificationFeedback ? (verificationFeedback.verified ? 'Verification Success!' : 'Verification Denied') : 'Submit Proof'}
              </h3>
              <p className="text-slate-300 font-bold text-xs uppercase tracking-widest">{verifyingItem.title}</p>
            </div>

            <div className="relative group">
              <div className="aspect-square bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 overflow-hidden flex flex-col items-center justify-center relative">
                {isCameraActive ? (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <button
                      onClick={capturePhoto}
                      className="absolute bottom-6 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-all"
                    >
                      <div className="w-12 h-12 border-4 border-slate-900 rounded-full" />
                    </button>
                    <button
                      onClick={stopCamera}
                      className="absolute top-6 left-6 w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center"
                    >
                      <ArrowLeft size={20} />
                    </button>
                  </div>
                ) : verificationImg ? (
                  <div className="absolute inset-0 z-10">
                    <img src={verificationImg} className="w-full h-full object-cover" alt="Verification" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button onClick={startCamera} className="bg-white/90 text-slate-900 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2">
                        <Camera size={16} /> Retake
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 p-8">
                    <div className="flex gap-4">
                      <button
                        onClick={startCamera}
                        className="flex-1 aspect-square bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-all group/btn"
                      >
                        <Camera size={32} className="text-slate-300 group-hover/btn:text-green-600 transition-colors" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Camera</span>
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 aspect-square bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-all group/btn"
                      >
                        <Scan size={32} className="text-slate-300 group-hover/btn:text-blue-600 transition-colors" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload</span>
                      </button>
                    </div>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </div>
            </div>

            {verificationFeedback && (
              <div className={`p-5 rounded-2xl text-left border ${verificationFeedback.verified ? 'bg-green-50 border-green-100 text-green-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                <p className="text-xs font-bold leading-relaxed">{verificationFeedback.reasoning}</p>
              </div>
            )}

            {!verificationFeedback && (
              <div className="flex flex-col gap-3">
                <button
                  disabled={!verificationImg || isVerifying}
                  onClick={confirmVerification}
                  className={`w-full py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3 ${!verificationImg || isVerifying ? 'bg-slate-100 text-slate-400 grayscale' : 'bg-slate-900 text-white hover:scale-[1.02] active:scale-95 shadow-slate-200'}`}
                >
                  {isVerifying ? (
                    <>RUNNING AI NEURAL SCAN <Loader2 size={16} className="animate-spin" /></>
                  ) : (
                    <>VERIFY COMPLETION <Zap size={16} fill="white" /></>
                  )}
                </button>
                <p className="text-[10px] font-black text-slate-200 uppercase tracking-widest">Powered by AgroPlay AI Vision™</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Real-time Environmental Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: Thermometer, label: 'Temperature', val: statCounters.temp, unit: '°C', color: 'blue', max: 50 },
          { icon: Droplets, label: 'Soil Moisture', val: statCounters.moisture, unit: '%', color: 'sky', max: 100 },
          { icon: Wind, label: 'Humidity', val: statCounters.humidity, unit: '%', color: 'indigo', max: 100 },
          { icon: Calendar, label: 'Deployment', val: 'Kharif', unit: '', color: 'green', max: 1 }
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-[2rem] border border-green-500/10 card-pop relative overflow-hidden group">
            <div className="absolute inset-0 scanning-line opacity-5" />
            <div className="flex items-center gap-5 relative z-10">
              <div className={`w-12 h-12 bg-slate-800 text-${stat.color}-500 rounded-xl flex items-center justify-center border border-${stat.color}-500/20 shadow-[0_0_15px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} className={i === 3 ? '' : 'animate-pulse'} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-green-500/40 font-black uppercase tracking-[0.2em]">{stat.label}</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-black text-white outfit tabular-nums">{stat.val}</p>
                  <p className="text-xs font-bold text-slate-300">{stat.unit}</p>
                </div>
              </div>
            </div>
            {stat.unit && (
              <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 relative">
                <div
                  className={`h-full bg-${stat.color}-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor]`}
                  style={{ width: `${(typeof stat.val === 'number' ? stat.val / stat.max : 0) * 100}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Dynamic Journey Section */}
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-slate-900 border border-green-500/20 rounded-[3.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-green-900/20 group">
            <div className="absolute inset-0 grid-bg opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-slate-900" />

            <div className="relative z-10 space-y-8">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-1.5 bg-green-500/10 rounded-full text-[10px] font-black tracking-[0.3em] uppercase backdrop-blur-md border border-green-500/20 text-green-400">QUEST PROGRESSION</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                  </div>
                  <h2 className="text-6xl font-black outfit tracking-tighter italic uppercase text-shadow-glow">
                    {activePlot ? activePlot.crop?.name : "Deployment Pending"}
                  </h2>
                </div>
                {activePlot && (
                  <div className="bg-slate-800/80 p-5 rounded-[2rem] backdrop-blur-xl border border-green-500/20 animate-float shadow-2xl">
                    <p className="text-[10px] font-black text-green-500/60 uppercase tracking-widest mb-1 text-center italic">STAKED XP</p>
                    <p className="text-4xl font-black text-white tabular-nums">+{activePlot.progress * 10}</p>
                  </div>
                )}
              </div>

              {activePlot ? (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-green-500/60 font-mono">MATURITY SENSOR [L-v4]</span>
                        <Zap size={14} className="text-amber-500 animate-pulse" />
                      </div>
                      <span className="text-3xl font-black tabular-nums text-green-400 font-mono">{activePlot.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-8 rounded-2xl p-1.5 shadow-inner border border-green-500/10 relative group-hover:border-green-500/30 transition-colors">
                      <div className="bg-gradient-to-r from-green-600 via-green-400 to-emerald-300 h-full rounded-xl transition-all duration-[2000ms] shadow-[0_0_25px_rgba(34,197,94,0.6)] relative overflow-hidden" style={{ width: `${activePlot.progress}%` }}>
                        <div className="absolute inset-0 bg-white/20 scanning-line opacity-40" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-8 items-center">
                    <Link to={`/learn/${activePlot.crop?.name}`} className="w-full sm:w-auto bg-green-600 text-slate-950 px-12 py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 hover:bg-green-400 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(34,197,94,0.4)] uppercase italic">
                      RESUME MISSION <ArrowRight size={24} />
                    </Link>
                    <div className="flex flex-col gap-1">
                      <p className="text-green-400 font-black text-[10px] uppercase tracking-[0.4em] italic mb-1">Upcoming Directive:</p>
                      <p className="text-white/80 text-sm font-bold uppercase tracking-widest italic animate-pulse flex items-center gap-2">
                        <Activity size={14} /> Organic Soil Enrichment Layer 02
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 space-y-8">
                  <p className="text-green-50/60 text-2xl font-medium leading-relaxed italic">Strategic readiness confirmed. Awaiting initial crop deployment protocol.</p>
                  <Link to="/new-journey" className="w-fit bg-slate-100 text-slate-950 px-12 py-6 rounded-[2rem] font-black text-xl flex items-center gap-3 hover:bg-green-500 transition-all hover:scale-105 active:scale-95 shadow-2xl uppercase italic">
                    SELECT CORE ASSET <ArrowRight size={24} />
                  </Link>
                </div>
              )}
            </div>
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-[30deg] transition-transform duration-[1.5s] pointer-events-none">
              <Leaf size={350} strokeWidth={1} className="text-green-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900 rounded-[3rem] p-10 border border-green-500/10 shadow-2xl space-y-6 group hover:shadow-green-500/10 transition-all cursor-pointer overflow-hidden relative" onClick={() => navigate('/diagnosis')}>
              <div className="absolute inset-0 grid-bg opacity-5 group-hover:opacity-10 transition-opacity" />
              <div className="absolute bottom-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-[45deg] transition-transform duration-[2s]">
                <Scan size={200} className="text-green-400" />
              </div>
              <div className="flex justify-between items-start relative z-10">
                <div className="w-16 h-16 bg-slate-800 text-rose-500 rounded-2xl flex items-center justify-center border border-rose-500/20 shadow-inner group-hover:scale-110 transition-transform">
                  <Microscope size={32} />
                </div>
                <div className="px-4 py-1.5 bg-rose-500/10 text-rose-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-500/20">BIO-VISUAL SCANNER</div>
              </div>
              <div className="space-y-2 relative z-10">
                <h3 className="text-3xl font-black outfit text-white tracking-tighter uppercase italic">Neural Diagnosis</h3>
                <p className="text-slate-300 text-sm leading-relaxed font-medium uppercase tracking-wide">Initiate high-strictness spectral analysis for pathogen detection and remediation.</p>
              </div>
              <div className="pt-4 flex items-center text-rose-500 font-black text-xs uppercase tracking-[0.3em] gap-3 relative z-10">
                ENGAGE SCANNER <ChevronRight size={18} className="group-hover:translate-x-3 transition-transform" />
              </div>
            </div>

            {/* Yield Prediction Card */}
            <div className="bg-slate-900 rounded-[3rem] p-10 border border-green-500/10 shadow-2xl space-y-6 group hover:shadow-green-500/10 transition-all relative overflow-hidden">
              <div className="absolute inset-0 grid-bg opacity-5 group-hover:opacity-10 transition-opacity" />
              <div className="absolute bottom-0 right-0 p-12 opacity-5 scale-150 -rotate-12 group-hover:-rotate-[45deg] transition-transform duration-[2s]">
                <BarChart3 size={200} className="text-blue-400" />
              </div>

              <div className="flex justify-between items-start relative z-10">
                <div className="w-16 h-16 bg-slate-800 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-inner group-hover:scale-110 transition-transform">
                  <TrendingUp size={32} />
                </div>
                <div className="px-4 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20 flex items-center gap-2">
                  <Zap size={10} fill="currentColor" className="animate-pulse" /> YIELD PROJECTION NODE
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <h3 className="text-3xl font-black outfit text-white tracking-tighter uppercase italic">Harvest Forecast</h3>

                {loadingPrediction ? (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <Loader2 size={40} className="animate-spin text-blue-400" />
                    <p className="text-[10px] font-black text-slate-200 uppercase tracking-widest animate-pulse">Running Monte Carlo Simulations...</p>
                  </div>
                ) : prediction ? (
                  <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-800/80 p-5 rounded-3xl border border-white/5 shadow-2xl">
                        <p className="text-[9px] font-black text-blue-400/60 uppercase tracking-widest mb-1 italic">EST. OUTPUT</p>
                        <p className="text-2xl font-black text-white outfit uppercase italic">{prediction.forecastedYield}</p>
                      </div>
                      <div className="bg-slate-800/80 p-5 rounded-3xl border border-white/5 shadow-2xl">
                        <p className="text-[9px] font-black text-green-400/60 uppercase tracking-widest mb-1 italic">MKT. VALUATION</p>
                        <p className="text-2xl font-black text-green-400 outfit uppercase italic">₹{prediction.marketValue}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${prediction.trend === 'Up' ? 'bg-green-500/10 text-green-500' : 'bg-rose-500/10 text-rose-500'}`}>
                          {prediction.trend === 'Up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        </div>
                        <span className={`text-[11px] font-black uppercase tracking-widest ${prediction.trend === 'Up' ? 'text-green-500' : 'text-rose-500'}`}>Vector: {prediction.trend}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest font-mono">Conf: {prediction.confidenceScore}%</span>
                      </div>
                    </div>
                    <button
                      onClick={() => activePlot && handleGetPrediction(activePlot.crop!.name)}
                      className="flex items-center gap-2 text-blue-500 font-black text-[10px] uppercase tracking-widest hover:text-blue-400 transition-colors pt-2 italic"
                    >
                      <RefreshCw size={14} className="animate-spin-slow" /> RE-PROCESS TELEMETRY
                    </button>
                  </div>
                ) : (
                  <div className="py-10 flex flex-col items-center text-center space-y-4 opacity-30">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center border border-white/5 overflow-hidden relative">
                      <AlertCircle size={40} className="text-slate-400" />
                      <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
                    </div>
                    <p className="text-xs font-black text-slate-300 uppercase leading-relaxed tracking-[0.2em] italic">DEPLOY CORE ASSET TO<br />ACTIVATE FORECASTING</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Assistant - Dynamic Interaction */}
          <div className="bg-slate-950 rounded-[3.5rem] p-10 border border-green-500/20 shadow-2xl space-y-8 group transition-all duration-500 relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/20 to-transparent scanning-line" />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-900 border-2 border-green-500/30 text-green-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)] group-hover:scale-110 transition-transform">
                  <Bot size={32} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="text-3xl font-black outfit tracking-tighter uppercase italic text-shadow-glow">Neural Uplink</h3>
                  <p className="text-[10px] text-green-500/40 font-black uppercase tracking-[0.4em]">Integrated Intelligence Node</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-4">
                <button
                  onClick={() => setIsVoiceOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-amber-500/10 text-amber-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-amber-500/20 hover:bg-amber-500/20 transition-all shadow-sm active:scale-95 italic"
                >
                  <Mic size={14} fill="currentColor" /> LIVE VOICE CHAT
                </button>
                <div className="flex items-center gap-2 px-4 py-3 bg-green-500/10 text-green-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-green-500/20 italic">
                  <Sparkles size={14} className="animate-pulse" /> FAST v2.5
                </div>
              </div>
            </div>

            <div className={`p-10 rounded-[2.5rem] min-h-[160px] flex items-center justify-center transition-all duration-700 relative overflow-hidden ${chatResponse ? 'bg-slate-900 border border-green-500/20 shadow-inner group-hover:border-green-500/40' : 'bg-slate-900/50 border border-dashed border-green-500/10'}`}>
              <div className="absolute inset-0 scanning-line opacity-5" />
              {loadingChat ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="animate-spin text-green-500" size={48} />
                  <p className="text-[10px] font-black text-green-500/40 uppercase tracking-[0.4em] italic">Synthesizing Regional Data Streams...</p>
                </div>
              ) : (
                chatResponse ? (
                  <p className="text-2xl text-green-300 leading-relaxed font-black italic text-center outfit uppercase tracking-tight">"{chatResponse}"</p>
                ) : (
                  <p className="text-xs text-slate-400 font-black uppercase tracking-[0.3em] italic opacity-60 text-center px-10">System Ready. Submit Intelligence Inquiry...</p>
                )
              )}
            </div>

            <div className="relative group/input">
              <input
                type="text"
                value={msgInput}
                onChange={e => setMsgInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleFastChat()}
                placeholder="Inquiry: Soil optimization for Triticum..."
                className="w-full bg-slate-900 border border-green-500/10 rounded-[2rem] pl-10 pr-44 py-8 outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500/30 transition-all font-black outfit text-2xl shadow-2xl text-green-400 placeholder:text-slate-800 uppercase italic"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-3">
                <button
                  onClick={() => setIsVoiceOpen(true)}
                  className="w-16 h-16 bg-amber-600 text-white rounded-2xl flex items-center justify-center hover:bg-amber-500 transition-all shadow-[0_0_20px_rgba(217,119,6,0.4)] hover:scale-110 active:scale-90"
                >
                  <Mic size={28} />
                </button>
                <button onClick={handleFastChat} className="w-16 h-16 bg-green-600 text-slate-950 rounded-2xl flex items-center justify-center hover:bg-green-400 transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-110 active:scale-90">
                  <Send size={28} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Staggered entrance */}
        <div className="lg:col-span-4 space-y-10 stagger-in">
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
                <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-600">+12</div>
                <span className="ml-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">In your region</span>
              </div>
            </div>
          </div>

          {/* Daily Challenges */}
          <div className="bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 p-8 rounded-[3rem] shadow-xl space-y-6 relative overflow-hidden group border border-orange-200">
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
              <Trophy size={120} className="text-amber-600" />
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4">
                <div className="space-y-1">
                  <h3 className="font-black outfit text-2xl tracking-tight text-slate-900">Daily Challenges</h3>
                  <p className="text-[9px] font-black text-amber-700 uppercase tracking-widest">Resets Every 24 Hours</p>
                </div>
                <Trophy size={24} className="animate-bounce text-amber-600" />
              </div>
              <div className="space-y-3">
                {dailyChallenges.map((challenge, i) => (
                  <div key={i} className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-amber-200 group/item transition-all hover:bg-white hover:shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-800">{challenge.title}</span>
                      <div className="flex items-center gap-2">
                        {challenge.completed ? (
                          <CheckCircle2 size={16} className="text-green-600" />
                        ) : (
                          <button onClick={() => handleVerify(challenge, 'challenge')} className="text-[9px] font-black bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1 rounded-full hover:scale-105 transition-transform active:scale-95 shadow-sm">VERIFY</button>
                        )}
                        <span className="text-[10px] font-black bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{challenge.reward} XP</span>
                      </div>
                    </div>
                    <div className="w-full bg-amber-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-600 h-full transition-all duration-1000 shadow-sm" style={{ width: `${challenge.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Goals */}
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-lg space-y-8 relative overflow-hidden">
            <div className="flex justify-between items-center relative z-10">
              <h3 className="font-black text-slate-800 outfit text-2xl tracking-tight">Active Goals</h3>
              <TrendingUp size={28} className="text-green-500" />
            </div>
            <div className="space-y-5 relative z-10">
              {activeGoals.map((task, i) => (
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
                    <div className="text-right">
                      <button onClick={(e) => { e.stopPropagation(); handleVerify(task, 'goal'); }} className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full group-hover:bg-green-600 group-hover:text-white transition-all">+{task.pts} XP</button>
                      <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{task.status}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-10 rounded-[3.5rem] space-y-8 relative overflow-hidden group border border-green-200 shadow-lg hover:shadow-xl transition-all">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-90 transition-transform duration-[2s]">
              <IndianRupee size={180} className="text-green-600" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Star size={20} fill="white" className="text-white" />
                </div>
                <h3 className="font-black outfit text-2xl tracking-tight text-slate-900">Market Insight</h3>
              </div>
              <p className="text-slate-700 text-lg leading-relaxed font-medium">
                Wheat prices in <span className="text-slate-900 font-bold">Punjab Mandis</span> are projected to climb <span className="text-green-600 font-black">+14%</span> by next week.
              </p>
              <Link to="/market" className="text-green-600 text-sm font-black uppercase tracking-[0.2em] hover:text-green-700 transition-all flex items-center gap-3 group/link">
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
