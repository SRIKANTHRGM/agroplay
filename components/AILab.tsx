
import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Video,
  Image as ImageIcon,
  Mic,
  MicOff,
  Send,
  Loader2,
  Settings2,
  Maximize2,
  Play,
  Download,
  Trash2,
  Camera,
  RefreshCw,
  Waves,
  Zap,
  Info,
  Layers,
  Monitor,
  Eye,
  FileVideo,
  CheckCircle,
  X
} from 'lucide-react';
import {
  generateVeoVideo,
  generateProImage,
  editImageWithText,
  connectLiveAPI,
  decodeBase64,
  decodeAudioData,
  encodeBase64,
  blobToBase64,
  analyzeVideoForAgriInsights
} from '../services/geminiService';

const LOADING_MESSAGES = [
  "Gemini is analyzing the seasonal patterns...",
  "Synthesizing high-resolution crop visuals...",
  "Veo 3 is orchestrating the frame sequences...",
  "Applying advanced agricultural logic to frames...",
  "Finalizing your professional farming render..."
];

const AILab: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'video' | 'image' | 'edit' | 'live' | 'analyze'>('video');
  const [loadingStep, setLoadingStep] = useState(0);

  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoResult, setVideoResult] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoAR, setVideoAR] = useState('16:9');

  const [imagePrompt, setImagePrompt] = useState('');
  const [imageResult, setImageResult] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageAR, setImageAR] = useState('1:1');
  const [imageSize, setImageSize] = useState('1K');

  const [editPrompt, setEditPrompt] = useState('');
  const [editBase, setEditBase] = useState<string | null>(null);
  const [editResult, setEditResult] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  const [analyzeVideo, setAnalyzeVideo] = useState<string | null>(null);
  const [analyzeResult, setAnalyzeResult] = useState<string | null>(null);
  const [analyzeLoading, setAnalyzeLoading] = useState(false);

  const [liveActive, setLiveActive] = useState(false);
  const [liveMessages, setLiveMessages] = useState<{ role: string, text: string }[]>([]);
  const liveSessionPromiseRef = useRef<Promise<any> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);

  useEffect(() => {
    let interval: any;
    if (videoLoading || imageLoading || editLoading || analyzeLoading) {
      interval = setInterval(() => {
        setLoadingStep(s => (s + 1) % LOADING_MESSAGES.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [videoLoading, imageLoading, editLoading, analyzeLoading]);

  const ensureKey = async () => {
    // Only check for API key in AI Studio environment
    if ((window as any).aistudio?.hasSelectedApiKey) {
      if (!(await (window as any).aistudio.hasSelectedApiKey())) {
        await (window as any).aistudio.openSelectKey();
      }
    }
    // When running locally, API key is loaded from .env.local automatically
  };

  const handleVideoGen = async () => {
    if (!videoPrompt) return;
    setVideoLoading(true);
    try {
      await ensureKey();
      const url = await generateVeoVideo(videoPrompt, videoAR);
      setVideoResult(url);
    } catch (e: any) {
      console.error(e);
      if (e.message?.includes("Requested entity was not found") && (window as any).aistudio?.openSelectKey) {
        await (window as any).aistudio.openSelectKey();
      } else {
        alert(e.message || "Video generation failed. Please try again.");
      }
    } finally {
      setVideoLoading(false);
    }
  };

  const handleImageGen = async () => {
    if (!imagePrompt) return;
    setImageLoading(true);
    try {
      await ensureKey();
      const url = await generateProImage(imagePrompt, imageAR, imageSize);
      setImageResult(url);
    } catch (e) { console.error(e); } finally { setImageLoading(false); }
  };

  const handleImageEdit = async () => {
    if (!editPrompt || !editBase) return;
    setEditLoading(true);
    try {
      await ensureKey();
      const mime = editBase.split(';')[0].split(':')[1];
      const data = editBase.split(',')[1];
      const url = await editImageWithText(editPrompt, data, mime);
      setEditResult(url);
    } catch (e) { console.error(e); } finally { setEditLoading(false); }
  };

  const handleVideoAnalyze = async () => {
    if (!analyzeVideo) return;
    setAnalyzeLoading(true);
    try {
      await ensureKey();
      const mime = analyzeVideo.split(';')[0].split(':')[1];
      const data = analyzeVideo.split(',')[1];
      const res = await analyzeVideoForAgriInsights(data, mime);
      setAnalyzeResult(res);
    } catch (e) { console.error(e); } finally { setAnalyzeLoading(false); }
  };

  const toggleLive = async () => {
    if (liveActive) {
      if (liveSessionPromiseRef.current) {
        liveSessionPromiseRef.current.then(session => {
          if (session && typeof session.close === 'function') session.close();
        });
        liveSessionPromiseRef.current = null;
      }
      setLiveActive(false);
      return;
    }
    setLiveActive(true);
    setLiveMessages([{ role: 'bot', text: 'Initializing neural uplink...' }]);
    try {
      await ensureKey();
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const sessionPromise = connectLiveAPI({
        onopen: () => {
          setLiveMessages(p => [...p, { role: 'bot', text: 'Namaste! AI Lab Hub active. How can I assist with your cultivation research?' }]);
          const inputCtx = new AudioContext({ sampleRate: 16000 });
          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            const data = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(data.length);
            for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
            const b64 = encodeBase64(new Uint8Array(int16.buffer));
            sessionPromise.then((session) => {
              if (session && typeof session.sendRealtimeInput === 'function') {
                session.sendRealtimeInput({ media: { data: b64, mimeType: 'audio/pcm;rate=16000' } });
              }
            });
          };
          source.connect(processor);
          processor.connect(inputCtx.destination);
        },
        onmessage: async (msg: any) => {
          const audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio && audioContextRef.current) {
            const bytes = decodeBase64(audio);
            const buffer = await decodeAudioData(bytes, audioContextRef.current, 24000, 1);
            const source = audioContextRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContextRef.current.destination);
            const now = audioContextRef.current.currentTime;
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, now);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
          }
        },
        onerror: (e: any) => { setLiveActive(false); },
        onclose: () => setLiveActive(false)
      });
      liveSessionPromiseRef.current = sessionPromise;
    } catch (err) { setLiveActive(false); }
  };

  return (
    <div className="space-y-10 page-transition pb-24">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
        <div className="space-y-2">
          <h2 className="text-5xl font-black text-white outfit flex items-center gap-4 tracking-tight uppercase italic leading-tight">
            <Sparkles className="text-amber-400 animate-pulse" size={48} /> Kisaan AI Lab
          </h2>
          <p className="text-slate-300 text-xl font-medium uppercase tracking-wide italic">Professional generative tools for the next-gen farm.</p>
        </div>
        <div className="flex p-2 bg-slate-900 rounded-[2rem] w-fit overflow-x-auto no-scrollbar shadow-2xl border border-white/5">
          {[
            { id: 'video', label: 'Veo Video', icon: Video },
            { id: 'image', label: 'Nano Pro', icon: ImageIcon },
            { id: 'edit', label: 'AI Edit', icon: Settings2 },
            { id: 'analyze', label: 'Video AI', icon: Eye },
            { id: 'live', label: 'Live Voice', icon: Mic },
          ].map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id as any)}
              className={`flex items-center gap-3 px-6 py-4 rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTool === tool.id ? 'bg-slate-800 text-green-400 shadow-xl scale-105 border border-white/10' : 'text-slate-500 hover:text-slate-300'
                }`}
            >
              <tool.icon size={18} /> {tool.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-4 space-y-8">
          <div className="bg-slate-900 rounded-[3.5rem] p-10 border border-white/5 shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
            {activeTool === 'video' && (
              <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 italic">Video Motion Prompt</label>
                  <textarea value={videoPrompt} onChange={e => setVideoPrompt(e.target.value)} placeholder="e.g. Panoramic lush rice field at sunrise with harvesting drones..." className="w-full bg-slate-950 rounded-[2rem] px-8 py-6 outline-none focus:ring-4 focus:ring-green-500/10 transition-all min-h-[160px] text-lg font-medium shadow-inner text-white border border-white/5" />
                </div>
                <button onClick={handleVideoGen} disabled={videoLoading || !videoPrompt} className="w-full bg-slate-800 text-white py-6 rounded-[2rem] font-black text-lg flex items-center justify-center gap-4 shadow-2xl hover:bg-slate-700 transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-95 border border-white/5 uppercase italic tracking-widest">
                  {videoLoading ? <Loader2 className="animate-spin" size={24} /> : <Zap size={24} fill="currentColor" />}
                  GENERATE VEO VIDEO
                </button>
              </div>
            )}
            {activeTool === 'image' && (
              <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
                <textarea value={imagePrompt} onChange={e => setImagePrompt(e.target.value)} placeholder="e.g. Macro shot of high-quality organic mustard seeds..." className="w-full bg-slate-950 rounded-[2rem] px-8 py-6 outline-none transition-all min-h-[160px] text-lg font-medium shadow-inner text-white border border-white/5" />
                <button onClick={handleImageGen} disabled={imageLoading || !imagePrompt} className="w-full bg-green-500 text-slate-950 py-6 rounded-[2rem] font-black text-lg flex items-center justify-center gap-4 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:bg-green-400 transition-all hover:scale-[1.02] active:scale-95 uppercase italic tracking-widest">
                  {imageLoading ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
                  GENERATE NANO PRO
                </button>
              </div>
            )}
            {activeTool === 'edit' && (
              <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
                <div onClick={() => document.getElementById('edit-up')?.click()} className="aspect-video bg-slate-950 rounded-[2.5rem] border-4 border-dashed border-white/10 flex flex-col items-center justify-center text-slate-500 cursor-pointer overflow-hidden transition-colors hover:border-blue-500/50">
                  {editBase ? <img src={editBase} className="w-full h-full object-cover" /> : <><Camera size={48} /><span className="text-[10px] font-black uppercase tracking-[0.2em] mt-4 italic">Upload Source</span></>}
                  <input id="edit-up" type="file" className="hidden" onChange={async e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setEditBase(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }} />
                </div>
                <input value={editPrompt} onChange={e => setEditPrompt(e.target.value)} placeholder="e.g. Enhance plant green levels" className="w-full bg-slate-950 rounded-3xl px-8 py-6 outline-none transition-all font-medium outfit shadow-inner text-white border border-white/5" />
                <button onClick={handleImageEdit} disabled={editLoading || !editPrompt || !editBase} className="w-full bg-blue-500 text-slate-950 py-6 rounded-[2rem] font-black text-lg flex items-center justify-center gap-4 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:bg-blue-400 transition-all hover:scale-[1.02] active:scale-95 uppercase italic tracking-widest">
                  {editLoading ? <Loader2 className="animate-spin" size={24} /> : <RefreshCw size={24} />}
                  APPLY AI EDIT
                </button>
              </div>
            )}
            {activeTool === 'analyze' && (
              <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
                <div onClick={() => document.getElementById('analyze-up')?.click()} className="aspect-video bg-slate-950 rounded-[2.5rem] border-4 border-dashed border-white/10 flex flex-col items-center justify-center text-slate-500 cursor-pointer overflow-hidden transition-colors hover:border-indigo-500/50">
                  {analyzeVideo ? <div className="p-10 text-green-400 font-black flex items-center gap-2 uppercase italic tracking-widest"><CheckCircle /> Video Ready</div> : <><FileVideo size={48} /><span className="text-[10px] font-black uppercase tracking-[0.2em] mt-4 italic">Upload Footage</span></>}
                  <input id="analyze-up" type="file" accept="video/*" className="hidden" onChange={async e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setAnalyzeVideo(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }} />
                </div>
                <button onClick={handleVideoAnalyze} disabled={analyzeLoading || !analyzeVideo} className="w-full bg-indigo-500 text-slate-950 py-6 rounded-[2rem] font-black text-lg flex items-center justify-center gap-4 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:bg-indigo-400 transition-all hover:scale-[1.02] active:scale-95 uppercase italic tracking-widest">
                  {analyzeLoading ? <Loader2 className="animate-spin" size={24} /> : <Eye size={24} />}
                  EXTRACT INSIGHTS
                </button>
              </div>
            )}
            {activeTool === 'live' && (
              <div className="p-10 bg-slate-950/50 border border-white/5 rounded-[3rem] text-white flex flex-col items-center text-center space-y-8 animate-in slide-in-from-left-4 relative overflow-hidden">
                <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
                <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-700 relative z-10 ${liveActive ? 'bg-green-500 shadow-[0_0_60px_rgba(34,197,94,0.4)] scale-110' : 'bg-white/5'}`}>
                  {liveActive ? <Waves size={64} className="animate-pulse" /> : <Mic size={64} className="text-slate-500" />}
                </div>
                <div className="space-y-2 relative z-10">
                  <p className="font-black text-lg outfit uppercase italic tracking-widest">Low-Latency Research Link</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest italic leading-none">Connect with Kisaan AI Lab</p>
                </div>
                <button onClick={toggleLive} className={`w-full py-6 rounded-[2rem] font-black text-lg transition-all relative z-10 uppercase italic tracking-widest ${liveActive ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)]' : 'bg-white text-slate-950 shadow-xl hover:bg-slate-100'}`}>
                  {liveActive ? 'END SESSION' : 'START TALKING'}
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="xl:col-span-8">
          <div className="bg-slate-900 rounded-[4rem] p-10 border border-white/5 shadow-2xl h-full min-h-[700px] flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
            {(videoLoading || imageLoading || editLoading || analyzeLoading) ? (
              <div className="flex flex-col items-center text-center space-y-8 relative z-10">
                <Loader2 className="animate-spin text-green-400" size={64} />
                <p className="text-2xl font-black text-white outfit uppercase italic tracking-tight">{LOADING_MESSAGES[loadingStep]}</p>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center relative z-10">
                {activeTool === 'video' && videoResult && <video src={videoResult} controls autoPlay loop className="max-w-full max-h-[600px] rounded-[3rem] shadow-2xl border border-white/5" />}
                {activeTool === 'image' && imageResult && <img src={imageResult} className="max-w-full max-h-[600px] rounded-[3rem] shadow-2xl border border-white/5" />}
                {activeTool === 'edit' && editResult && <img src={editResult} className="max-w-full max-h-[600px] rounded-[3rem] shadow-2xl border border-white/5" />}
                {activeTool === 'analyze' && analyzeResult && (
                  <div className="bg-slate-950/50 p-12 rounded-[3.5rem] shadow-2xl border border-white/5 max-w-2xl w-full animate-in slide-in-from-bottom-10 backdrop-blur-xl">
                    <h4 className="text-2xl font-black outfit text-white mb-6 flex items-center gap-3 uppercase italic italic leading-tight"><Eye className="text-indigo-400" /> Lab Observations</h4>
                    <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed font-medium uppercase tracking-wide text-sm">{analyzeResult}</div>
                  </div>
                )}
                {activeTool === 'live' && (
                  <div className="w-full h-full bg-slate-950/50 rounded-[3.5rem] p-12 flex flex-col space-y-6 overflow-y-auto max-h-[600px] custom-scrollbar border border-white/5">
                    {liveMessages.map((m, i) => (
                      <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] px-8 py-5 rounded-[2.2rem] text-sm font-black uppercase tracking-widest italic ${m.role === 'user' ? 'bg-slate-800 text-white rounded-tr-none border border-white/10' : 'bg-green-500/10 text-green-400 border border-green-500/20 rounded-tl-none'}`}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {!videoResult && !imageResult && !editResult && !analyzeResult && !liveActive && (
                  <div className="text-center space-y-6 opacity-20 relative z-10">
                    <div className="w-40 h-40 bg-slate-800 rounded-[3.5rem] mx-auto flex items-center justify-center border border-white/5">
                      <Monitor size={80} className="text-white" />
                    </div>
                    <p className="text-2xl font-black text-white outfit uppercase tracking-[0.3em] italic">Lab Terminal Idle</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AILab;
