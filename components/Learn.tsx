
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Sprout,
  Tractor,
  Droplets,
  Recycle,
  Zap,
  Wheat,
  Check,
  Loader2,
  PlayCircle,
  Star,
  Award,
  ShieldCheck,
  X,
  ChevronRight,
  Sparkles,
  Volume2,
  Play,
  RotateCcw,
  CheckCircle2,
  Camera,
  Smartphone,
  ShieldAlert,
  History,
  FileText,
  BadgeCheck,
  Lock,
  ArrowRight,
  Activity,
  Trash2,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { UserCultivationJourney, UserProfile, CULTIVATION_LIBRARY, CultivationStep } from '../types';
import { verifyTaskCompletion, textToSpeech, decodeBase64, decodeAudioData } from '../services/geminiService';

interface Props {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const iconMap: any = { Sprout, Tractor, Droplets, Recycle, Zap, Wheat, Check };

const Learn: React.FC<Props> = ({ user, setUser }) => {
  const { t } = useTranslation();
  const { journeyId } = useParams();
  const navigate = useNavigate();

  const [journeys, setJourneys] = useState<UserCultivationJourney[]>([]);
  const [activeJourney, setActiveJourney] = useState<UserCultivationJourney | null>(null);
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [aiFeedback, setAiFeedback] = useState<any>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`km_journeys_${user.uid}`);
    if (saved) {
      const data: UserCultivationJourney[] = JSON.parse(saved);
      setJourneys(data);

      if (journeyId) {
        const found = data.find(j => j.id === journeyId);
        if (found) {
          setActiveJourney(found);
          setSelectedStepIndex(found.currentStepIndex);
        }
      }
    }
  }, [journeyId, user.uid]);

  // Cleanup camera stream on unmount or when scanner closes
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error('Camera access denied:', err);
      alert(t('learn.camera_error_alert'));
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setProofImage(imageData);
        stopCamera();
      }
    }
  };

  const saveJourneys = (updated: UserCultivationJourney[]) => {
    localStorage.setItem(`km_journeys_${user.uid}`, JSON.stringify(updated));
    setJourneys(updated);
  };

  const handleVerify = async () => {
    if (!proofImage || !activeJourney) return;
    setVerifying(true);
    setAiFeedback(null);

    const crop = CULTIVATION_LIBRARY.find(c => c.id === activeJourney.cropId);
    const step = crop?.workflow?.[selectedStepIndex];
    if (!step) return;

    try {
      const base64 = proofImage.split(',')[1];
      const result = await verifyTaskCompletion(step.title, step.description, base64);
      setAiFeedback(result);

      if (result.verified) {
        const updatedSteps = [...activeJourney.steps];
        updatedSteps[selectedStepIndex] = {
          ...updatedSteps[selectedStepIndex],
          verified: true,
          verifiedAt: new Date().toISOString(),
          proofImageUrl: proofImage,
          aiFeedback: result.reasoning
        };

        const isLastStep = selectedStepIndex === (crop?.workflow?.length ?? 0) - 1;
        const updatedJourney: UserCultivationJourney = {
          ...activeJourney,
          steps: updatedSteps,
          currentStepIndex: isLastStep ? selectedStepIndex : selectedStepIndex + 1,
          status: isLastStep ? 'completed' : 'active'
        };

        const newJourneys = journeys.map(j => j.id === activeJourney.id ? updatedJourney : j);
        saveJourneys(newJourneys);
        setActiveJourney(updatedJourney);

        // Update User Reward
        setUser(prev => ({
          ...prev,
          points: prev.points + step.points,
          ecoPoints: prev.ecoPoints + step.ecoPoints
        }));
      }
    } catch (e) {
      console.error(e);
      setAiFeedback({ verified: false, reasoning: t('learn.sensor_fail') });
    } finally {
      setVerifying(false);
    }
  };

  const handleResetJourney = () => {
    if (!activeJourney) return;

    const confirmReset = window.confirm(t('learn.restart_confirm'));
    if (!confirmReset) return;

    const resetSteps = activeJourney.steps.map(s => ({
      ...s,
      verified: false,
      verifiedAt: undefined,
      proofImageUrl: undefined,
      aiFeedback: undefined
    }));

    const updatedJourney: UserCultivationJourney = {
      ...activeJourney,
      steps: resetSteps,
      currentStepIndex: 0,
      status: 'active'
    };

    const newJourneys = journeys.map(j => j.id === activeJourney.id ? updatedJourney : j);
    saveJourneys(newJourneys);
    setActiveJourney(updatedJourney);
    setSelectedStepIndex(0);
    setAiFeedback(null);
    setProofImage(null);
  };

  const handleTTS = async () => {
    if (isSpeaking || !activeJourney) return;
    const crop = CULTIVATION_LIBRARY.find(c => c.id === activeJourney.cropId);
    const step = crop?.workflow?.[selectedStepIndex];
    if (!step) return;

    setIsSpeaking(true);
    setIsSpeaking(true);
    try {
      const text = `${t('learn.tts.step', { step: selectedStepIndex + 1 })}: ${t('learn.tts.description', { title: step.title, description: step.description })}. ${t('learn.tts.tasks_include', { tools: step.tools?.join(', ') })}. ${t('learn.tts.warnings', { warnings: step.warnings || t('learn.tts.none') })}`;
      const b64 = await textToSpeech(text);
      if (b64) {
        const bytes = decodeBase64(b64);
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const buffer = await decodeAudioData(bytes, ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
      }
    } catch (e) { setIsSpeaking(false); }
  };

  if (!activeJourney) {
    return (
      <div className="space-y-12 animate-in fade-in duration-500">
        <div className="flex justify-between items-center px-4">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 outfit tracking-tighter uppercase italic">{t('sidebar.active_training')}</h2>
            <p className="text-slate-500 text-lg md:xl font-medium italic uppercase tracking-tight">{t('learn.real_time_tracking')}</p>
          </div>
          <Link to="/new-journey" className="px-10 py-5 bg-[#2d6a4f] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-sm hover:bg-[#1b4332] transition-all active:scale-95 flex items-center gap-3 italic">
            <Sprout size={18} /> {t('learn.initiate_batch')}
          </Link>
        </div>

        {journeys.length === 0 ? (
          <div className="py-32 bg-white rounded-[4rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-center space-y-8">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 shadow-inner">
              <Activity size={48} strokeWidth={1} />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-black text-slate-400 outfit tracking-tighter">{t('learn.no_pipelines')}</p>
              <p className="text-slate-400 font-medium max-w-xs mx-auto">{t('learn.start_journey_prompt')}</p>
            </div>
            <Link to="/new-journey" className="px-12 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-2xl hover:bg-green-600 transition-all">{t('learn.go_to_archive')}</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {journeys.map(j => (
              <div key={j.id} onClick={() => navigate(`/learn/${j.id}`)} className="group bg-white rounded-[3.5rem] border border-[#E0E5E2] p-10 hover:shadow-md transition-all cursor-pointer relative overflow-hidden card-pop">
                <div className="absolute inset-0 grid-bg opacity-[0.02] pointer-events-none" />
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="w-16 h-16 bg-[#E8F5E9] text-[#2d6a4f] rounded-2xl flex items-center justify-center border border-[#C8E6C9] shadow-sm group-hover:scale-110 transition-transform">
                      <Wheat size={32} />
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${j.status === 'completed' ? 'bg-[#E8F5E9] text-[#2d6a4f] border-[#C8E6C9]' : 'bg-[#E3F2FD] text-[#1E88E5] border-[#BBDEFB]'}`}>
                      {j.status}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 outfit tracking-tighter uppercase italic">{j.cropName}</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t('learn.journey_started', { date: new Date(j.startDate).toLocaleDateString() })}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('learn.progress_pipe')}</span>
                      <span className="text-sm font-black text-slate-700 tabular-nums">{Math.round((j.currentStepIndex / j.steps.length) * 100)}%</span>
                    </div>
                    <div className="h-2.5 bg-[#F1F3F2] rounded-full overflow-hidden p-0.5 border border-[#E0E5E2] shadow-inner">
                      <div className="h-full bg-gradient-to-r from-[#C8E6C9] to-[#2d6a4f] rounded-full transition-all duration-[2s]" style={{ width: `${(j.currentStepIndex / j.steps.length) * 100}%` }} />
                    </div>
                  </div>
                  <div className="pt-4 flex items-center gap-3 text-[#2d6a4f] font-black text-[10px] uppercase tracking-[0.3em] italic">
                    {t('learn.resume_operations')} <ChevronRight size={18} className="group-hover:translate-x-3 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const cropData = CULTIVATION_LIBRARY.find(c => c.id === activeJourney.cropId);
  const currentStep = cropData?.workflow?.[selectedStepIndex];
  const isLocked = selectedStepIndex > activeJourney.currentStepIndex;
  const isVerified = activeJourney.steps[selectedStepIndex]?.verified;

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700 pb-24">
      {/* HUD Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <button
            onClick={handleResetJourney}
            className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-rose-600 shadow-sm transition-all active:scale-95 group relative"
            title={t('learn.restart_session')}
          >
            <RotateCcw size={24} className="group-hover:rotate-[-180deg] transition-transform duration-500" />
            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase tracking-widest whitespace-nowrap">{t('learn.restart_pipeline')}</span>
          </button>
          <Link to="/learn" className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-green-600 shadow-sm transition-all active:scale-95" title={t('learn.back_to_missions')}>
            <History size={24} />
          </Link>
          <div>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 outfit tracking-tighter leading-tight truncate max-w-xs md:max-w-md">{t('learn.pipeline_title', { cropName: activeJourney.cropName })}</h2>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[9px] font-black uppercase tracking-widest border border-green-200">{t('learn.session_id', { id: activeJourney.id.split('-')?.pop() ?? 'ID' })}</span>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Activity size={14} className="text-blue-500" /> {t('learn.bio_stability', { score: activeJourney.healthScore })}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xl flex items-center gap-10">
          <div className="flex items-center gap-4 px-6 border-r border-slate-100">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shadow-inner">
              <Zap size={20} fill="currentColor" />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{t('learn.session_xp')}</p>
              <p className="text-lg font-black text-slate-800 outfit tabular-nums">{activeJourney.steps.filter(s => s.verified).length * 100}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 px-6">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-inner">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{t('learn.eco_rating')}</p>
              <p className="text-lg font-black text-slate-800 outfit tabular-nums">{activeJourney.steps.filter(s => s.verified).length * 50}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Step Rail */}
        <div className="lg:col-span-4 space-y-6 lg:block">
          <div className="bg-white rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 border border-slate-100 shadow-xl space-y-6 md:space-y-10">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4 md:pb-8">
              <h3 className="font-black text-slate-800 outfit text-xl md:text-3xl tracking-tighter">{t('learn.workflow_rail')}</h3>
              <div className="px-3 py-1.5 bg-slate-100 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest tabular-nums">{selectedStepIndex + 1} / {cropData?.workflow?.length}</div>
            </div>
            <div className="flex lg:flex-col gap-3 md:gap-4 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 custom-scrollbar -mx-2 px-2 lg:mx-0 lg:px-0">
              {cropData?.workflow?.map((step, i) => {
                const locked = i > activeJourney.currentStepIndex;
                const verified = activeJourney.steps[i]?.verified;
                const Icon = iconMap[step.icon] || Sprout;

                return (
                  <button
                    key={step.id}
                    disabled={locked}
                    onClick={() => setSelectedStepIndex(i)}
                    className={`shrink-0 lg:w-full text-left p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] transition-all flex items-center gap-4 md:gap-6 group relative overflow-hidden ${selectedStepIndex === i
                      ? 'bg-slate-900 text-white shadow-2xl scale-[1.05] z-10'
                      : locked
                        ? 'bg-slate-50 text-slate-300 opacity-60 grayscale'
                        : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
                      }`}
                  >
                    <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-sm md:text-lg flex-shrink-0 transition-all shadow-inner ${selectedStepIndex === i ? 'bg-white/10 text-white' : verified ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                      {verified ? <CheckCircle2 size={28} strokeWidth={3} /> : locked ? <Lock size={24} /> : <Icon size={28} />}
                    </div>
                    <div className="pr-2 hidden md:block">
                      <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] block mb-0.5 md:mb-1 ${selectedStepIndex === i ? 'text-green-400' : 'text-slate-500'}`}>{t('learn.phase', { number: i + 1 })}</span>
                      <span className="text-base md:text-xl font-black leading-tight outfit truncate block w-24 md:w-auto">{t(`crops.${cropData.id}.steps.${step.id}.title`, step.title)}</span>
                    </div>
                    {verified && (
                      <div className="absolute top-4 right-4 animate-in zoom-in">
                        <BadgeCheck size={20} className="text-green-500" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="hidden md:block bg-amber-50 p-6 md:p-10 rounded-2xl md:rounded-[3rem] border border-amber-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-1000"><Award size={160} /></div>
            <h4 className="text-xl font-black text-amber-900 outfit mb-2">{t('learn.rewards_active')}</h4>
            <p className="text-amber-800/70 text-sm font-medium leading-relaxed">{t('learn.rewards_desc')}</p>
          </div>
        </div>

        {/* Action Zone */}
        <div className="lg:col-span-8 space-y-10">
          {currentStep && (
            <div className="bg-white rounded-3xl md:rounded-[4.5rem] overflow-hidden border-4 md:border-8 border-white shadow-2xl relative animate-in zoom-in-95 duration-700">
              <div className="aspect-video bg-slate-900 relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                {isVerified && activeJourney.steps[selectedStepIndex].proofImageUrl ? (
                  <img src={activeJourney.steps[selectedStepIndex].proofImageUrl} className="w-full h-full object-cover" alt="Verified Proof" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/20 space-y-6">
                    <PlayCircle size={100} strokeWidth={1} />
                    <p className="font-black outfit text-2xl uppercase tracking-[0.4em]">{t('learn.visual_lab_offline')}</p>
                  </div>
                )}
                <div className="absolute top-10 left-10 flex items-center gap-4">
                  <div className="px-6 py-2.5 bg-black/60 backdrop-blur-xl rounded-2xl text-white font-black text-[10px] uppercase tracking-widest border border-white/20">
                    {isVerified ? t('learn.verification_record') : (currentStep.tutorialVideo ? t('learn.tutorial_mode') : t('learn.practice_mode'))}
                  </div>
                  {isVerified && <div className="px-6 py-2.5 bg-green-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">{t('learn.bio_authenticated')}</div>}
                </div>
              </div>

              <div className="p-6 md:p-16 space-y-8 md:space-y-16">
                <div className="flex flex-col md:flex-row justify-between items-start gap-10">
                  <div className="flex items-center gap-8">
                    <div className="w-24 h-24 bg-green-50 text-green-600 rounded-[2.2rem] flex items-center justify-center shadow-inner animate-float">
                      {React.createElement(iconMap[currentStep.icon] || Sprout, { size: 56 })}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <h3 className="text-2xl md:text-6xl font-black text-slate-800 outfit tracking-tighter leading-none">{t(`crops.${cropData.id}.steps.${currentStep.id}.title`, currentStep.title)}</h3>
                        <button onClick={handleTTS} className={`p-5 rounded-2xl transition-all shadow-xl hover:scale-110 active:scale-90 ${isSpeaking ? 'bg-amber-100 text-amber-600 ring-2 ring-amber-200 animate-pulse' : 'bg-slate-50 text-slate-400 hover:text-green-600'}`}>
                          {isSpeaking ? <Loader2 size={20} className="animate-spin md:w-8 md:h-8" /> : <Volume2 size={20} className="md:w-8 md:h-8" />}
                        </button>
                      </div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] pt-1">{t('learn.protocol_phase', { number: selectedStepIndex + 1 })}</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 px-12 py-8 rounded-[2.5rem] border border-slate-100 text-center shadow-inner group transition-all hover:bg-white hover:shadow-xl">
                    <p className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">{t('learn.mastery_yield')}</p>
                    <p className="text-6xl font-black text-slate-800 outfit tracking-tighter tabular-nums transition-transform group-hover:scale-110">+{currentStep.points}</p>
                  </div>
                </div>

                <div className="p-12 bg-[#F9FBFA] rounded-[3.5rem] border border-[#E0E5E2] relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 opacity-[0.02] pointer-events-none group-hover:rotate-12 transition-transform duration-[2s]"><Zap size={300} /></div>
                  <p className="text-lg md:text-3xl text-slate-600 leading-relaxed font-black relative z-10 italic uppercase tracking-tight">"{t(`crops.${cropData.id}.steps.${currentStep.id}.description`, currentStep.description)}"</p>
                </div>

                {/* Watch Tutorial Button */}
                {currentStep.tutorialVideo && (
                  <div className="bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-600 p-8 rounded-[2.5rem] flex items-center justify-between shadow-xl">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                        <PlayCircle size={36} className="text-white" />
                      </div>
                      <div className="text-white">
                        <p className="font-black text-xl outfit">{t('learn.video_tutorial_available')}</p>
                        <p className="text-sm opacity-80">{t('learn.learn_visually')}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => window.open(currentStep.tutorialVideo, '_blank')}
                      className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-indigo-50 transition-all active:scale-95 flex items-center gap-3"
                    >
                      <PlayCircle size={20} /> {t('learn.watch_tutorial')}
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                      <Tractor size={18} className="text-green-500" /> {t('learn.tactical_inventory')}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {currentStep.tools?.map((t, i) => (
                        <span key={i} className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 shadow-sm">{t}</span>
                      ))}
                      {(!currentStep.tools || currentStep.tools.length === 0) && <p className="text-slate-400 italic">{t('learn.no_tools')}</p>}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                      <ShieldAlert size={18} className="text-rose-500" /> {t('learn.operational_hazards')}
                    </h4>
                    <div className="p-6 bg-rose-50 rounded-[1.5rem] border border-rose-100">
                      <p className="text-sm text-rose-700 font-bold leading-relaxed">{currentStep.warnings || t('learn.safety_mandatory')}</p>
                    </div>
                  </div>
                </div>

                {/* Verification Interaction */}
                <div className="pt-10 flex flex-col sm:flex-row items-center gap-8">
                  {isVerified ? (
                    <div className="flex-1 flex items-center gap-8 px-12 py-10 bg-[#2d6a4f] text-white rounded-[3.5rem] font-black text-4xl shadow-sm animate-in zoom-in duration-500 border-8 border-[#C8E6C9] italic uppercase tracking-tighter">
                      <CheckCircle2 size={64} strokeWidth={3} />
                      <div>
                        <p className="leading-none">{t('learn.bio_verified')}</p>
                        <p className="text-[10px] font-bold text-[#A5D6A7] uppercase tracking-[0.3em] mt-3">{t('learn.authenticated_on', { date: new Date(activeJourney.steps[selectedStepIndex].verifiedAt!).toLocaleDateString() })}</p>
                      </div>
                      {selectedStepIndex < (cropData?.workflow?.length ?? 0) - 1 && (
                        <button
                          onClick={() => setSelectedStepIndex(selectedStepIndex + 1)}
                          className="ml-auto bg-white text-[#2d6a4f] p-5 rounded-[2rem] hover:scale-110 transition-all shadow-sm active:scale-95"
                        >
                          <ArrowRight size={32} strokeWidth={3} />
                        </button>
                      )}
                    </div>
                  ) : isLocked ? (
                    <div className="flex-1 flex items-center justify-center gap-6 px-12 py-10 bg-[#F9FBFA] text-slate-400 rounded-[3.5rem] border border-dashed border-[#E0E5E2]">
                      <Lock size={32} />
                      <p className="font-black text-xl uppercase tracking-[0.3em] italic">{t('learn.path_locked')}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsScannerOpen(true)}
                      className="flex-1 py-10 bg-[#2d6a4f] text-white rounded-[4rem] font-black text-3xl hover:bg-[#1b4332] shadow-sm transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-8 group overflow-hidden relative italic uppercase tracking-tighter"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1.2s]" />
                      <Camera size={32} className="md:w-12 md:h-12 group-hover:rotate-12 transition-transform" />
                      <span className="text-xl md:text-4xl">{t('learn.verify_phase', { number: selectedStepIndex + 1 })}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SCANNER MODAL */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-500 overflow-hidden">
          <div className="bg-white w-full max-w-4xl rounded-[4.5rem] shadow-[0_0_150px_rgba(34,197,94,0.4)] overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-500 relative border-8 border-white">
            {/* Scanner Visuals */}
            <div className="w-full md:w-1/2 relative bg-slate-900 overflow-hidden group">
              <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
              {proofImage ? (
                <div className="w-full h-full relative p-8">
                  <img src={proofImage} className="w-full h-full object-cover rounded-[3rem] border-4 border-white/20 shadow-2xl" alt="Proof" />
                  {verifying && (
                    <div className="absolute inset-8 rounded-[3rem] overflow-hidden pointer-events-none">
                      <div className="absolute top-0 left-0 w-full h-2 bg-green-400 shadow-[0_0_30px_#22c55e] animate-[scan_3s_linear_infinite]" />
                    </div>
                  )}
                  <button
                    onClick={() => { setProofImage(null); setAiFeedback(null); }}
                    className="absolute top-12 right-12 p-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-all shadow-xl"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ) : isCameraActive ? (
                <div className="w-full h-full relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 gap-4">
                    <button
                      onClick={capturePhoto}
                      className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all active:scale-90 border-4 border-green-500"
                    >
                      <Camera size={36} className="text-green-600" />
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-6 py-2 bg-white/20 backdrop-blur-xl text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/30 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-10 text-center space-y-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="w-32 h-32 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center text-white relative z-10 shadow-2xl">
                      <Camera size={64} strokeWidth={1} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black text-white outfit uppercase tracking-tighter">{t('learn.capture_proof')}</h4>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest leading-relaxed px-6">{t('learn.take_photo_prompt')}</p>
                  </div>
                  <div className="flex flex-col gap-3 w-full max-w-[200px]">
                    {/* Live Camera Button */}
                    <button
                      onClick={startCamera}
                      className="w-full px-6 py-4 bg-green-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.15em] hover:bg-green-400 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
                    >
                      <Camera size={18} /> {t('learn.open_camera')}
                    </button>
                    {/* Upload Button */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full px-6 py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-black text-xs uppercase tracking-[0.15em] hover:bg-white/20 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                    >
                      <Smartphone size={18} /> {t('learn.upload_photo')}
                    </button>
                  </div>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => { setProofImage(reader.result as string); setAiFeedback(null); };
                  reader.readAsDataURL(file);
                }
              }} accept="image/*" className="hidden" />
            </div>

            {/* Verification Controls - Scrollable */}
            <div className="flex-1 p-6 md:p-8 flex flex-col bg-white overflow-y-auto">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-green-600">
                      <ShieldCheck size={18} />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em]">{t('learn.auth_protocol')}</p>
                    </div>
                    <h3 className="text-3xl font-black text-slate-800 outfit tracking-tighter">{t('learn.bio_scanner')}</h3>
                  </div>
                  <button onClick={() => { setIsScannerOpen(false); setProofImage(null); setAiFeedback(null); stopCamera(); }} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-800 rounded-2xl transition-all">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('learn.active_phase')}</p>
                    <p className="text-xl font-black text-slate-800 outfit tracking-tight leading-tight">{currentStep?.title}</p>
                    <p className="text-slate-500 text-sm mt-2 font-medium leading-relaxed">"{currentStep?.description?.slice(0, 100)}..."</p>
                  </div>

                  {aiFeedback && (
                    <div className={`p-6 rounded-2xl animate-in slide-in-from-bottom-4 duration-700 flex gap-4 shadow-xl ${aiFeedback.verified ? 'bg-green-600 text-white' : 'bg-rose-100 text-rose-800'
                      }`}>
                      <div className="flex-shrink-0">
                        {aiFeedback.verified ? <BadgeCheck size={32} /> : <AlertCircle size={32} />}
                      </div>
                      <div className="space-y-1">
                        <p className="font-black text-xl outfit tracking-tighter leading-none">{aiFeedback.verified ? t('learn.phase_cleared') : t('learn.rescan_required')}</p>
                        <p className={`text-sm font-bold leading-relaxed ${aiFeedback.verified ? 'opacity-90' : 'opacity-80'}`}>{aiFeedback.reasoning}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Verify Button - Always visible */}
              <div className="mt-auto pt-4 space-y-2">
                {!aiFeedback?.verified ? (
                  <button
                    onClick={handleVerify}
                    disabled={!proofImage || verifying}
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-4 shadow-xl transition-all active:scale-95 disabled:opacity-30"
                  >
                    {verifying ? <Loader2 className="animate-spin" size={24} /> : <Zap size={24} fill="currentColor" className="text-amber-400" />}
                    <span>{verifying ? t('learn.verifying') : t('learn.verify_now')}</span>
                  </button>
                ) : (
                  <button onClick={() => { setIsScannerOpen(false); setProofImage(null); setAiFeedback(null); }} className="w-full py-5 bg-green-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-4 shadow-xl active:scale-95">
                    <Check size={24} strokeWidth={4} /> {t('learn.done')}
                  </button>
                )}
                <p className="text-[9px] text-center font-bold text-slate-400 uppercase tracking-widest">{t('learn.ai_vision_verification')}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-50px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(500px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Learn;
