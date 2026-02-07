
import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  Waves, 
  Loader2, 
  Volume2, 
  VolumeX, 
  ArrowLeft,
  Sparkles,
  Info
} from 'lucide-react';
import { connectLiveAPI, decodeBase64, decodeAudioData, encodeBase64 } from '../services/geminiService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const VoiceAssistant: React.FC<Props> = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [isAiTalking, setIsAiTalking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const liveSessionPromiseRef = useRef<Promise<any> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const streamRef = useRef<MediaStream | null>(null);
  const audioWorkletRef = useRef<ScriptProcessorNode | null>(null);

  useEffect(() => {
    if (isOpen) {
      startSession();
    } else {
      stopSession();
    }
    return () => stopSession();
  }, [isOpen]);

  const startSession = async () => {
    setIsActive(true);
    setError(null);
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = connectLiveAPI({
        onopen: () => {
          setupMicrophone(sessionPromise);
        },
        onmessage: async (message: any) => {
          const base64EncodedAudioString = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (base64EncodedAudioString && audioContextRef.current) {
            setIsAiTalking(true);
            const audioBytes = decodeBase64(base64EncodedAudioString);
            const audioBuffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);
            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContextRef.current.destination);
            const now = audioContextRef.current.currentTime;
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, now);
            source.onended = () => {
              setTimeout(() => {
                if (audioContextRef.current && nextStartTimeRef.current <= audioContextRef.current.currentTime) {
                  setIsAiTalking(false);
                }
              }, 100);
            };
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
          }
          if (message.serverContent?.interrupted) {
            setIsAiTalking(false);
            nextStartTimeRef.current = 0;
          }
        },
        onerror: (e: any) => {
          setError("Connection error. Try again.");
          setIsActive(false);
        },
        onclose: () => setIsActive(false)
      });

      liveSessionPromiseRef.current = sessionPromise;
    } catch (err) {
      setError("Mic access denied. Please check hardware settings.");
      setIsActive(false);
    }
  };

  const setupMicrophone = (sessionPromise: Promise<any>) => {
    if (!streamRef.current) return;
    const inputAudioContext = new AudioContext({ sampleRate: 16000 });
    const source = inputAudioContext.createMediaStreamSource(streamRef.current);
    const processor = inputAudioContext.createScriptProcessor(4096, 1, 1);
    processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      const int16 = new Int16Array(inputData.length);
      for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
      const b64 = encodeBase64(new Uint8Array(int16.buffer));
      // CRITICAL: Always use .then on the session promise before sending input
      sessionPromise.then((session) => {
        if (session && typeof session.sendRealtimeInput === 'function') {
          session.sendRealtimeInput({ media: { data: b64, mimeType: 'audio/pcm;rate=16000' } });
        }
      });
    };
    source.connect(processor);
    processor.connect(inputAudioContext.destination);
    audioWorkletRef.current = processor;
  };

  const stopSession = () => {
    setIsActive(false);
    setIsAiTalking(false);
    if (liveSessionPromiseRef.current) {
      liveSessionPromiseRef.current.then(session => {
        if (session && typeof session.close === 'function') {
          session.close();
        }
      });
      liveSessionPromiseRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioWorkletRef.current) {
      audioWorkletRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-2xl animate-in fade-in duration-500">
      <div className="relative w-full max-w-2xl bg-slate-800 rounded-[4rem] shadow-[0_0_100px_rgba(34,197,94,0.2)] border border-slate-700 overflow-hidden flex flex-col p-12 text-center space-y-12">
        <div className="absolute top-8 right-8 flex gap-4">
           <button onClick={onClose} className="p-4 bg-slate-700 hover:bg-slate-600 text-white rounded-2xl transition-all group">
             <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
           </button>
        </div>
        <div className="absolute top-8 left-8">
           <div className="flex items-center gap-3 px-4 py-2 bg-green-500/10 text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">
             <Sparkles size={14} className="animate-pulse" /> Native Audio 2.5
           </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center space-y-12 py-10">
          <div className="relative">
            <div className={`absolute inset-0 rounded-full blur-3xl transition-all duration-1000 ${isAiTalking ? 'bg-green-500/40 scale-150 animate-pulse' : 'bg-green-500/10 scale-110'}`} />
            <div className={`relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-700 ${isActive ? 'bg-green-600 shadow-[0_0_60px_rgba(34,197,94,0.5)]' : 'bg-slate-700'}`}>
              {isAiTalking ? <Waves size={80} className="text-white animate-pulse" /> : <Mic size={80} className={`text-white ${isActive ? 'animate-bounce' : 'opacity-40'}`} />}
            </div>
            {isActive && (
              <>
                <div className="absolute inset-0 border-2 border-green-500/20 rounded-full animate-[ping_3s_linear_infinite]" />
                <div className="absolute inset-[-20px] border border-green-500/10 rounded-full animate-[ping_4s_linear_infinite_1s]" />
              </>
            )}
          </div>
          <div className="space-y-4">
            <h3 className="text-4xl font-black text-white outfit tracking-tighter">{isAiTalking ? "KisaanMitra is speaking..." : isActive ? "I'm listening, ask me anything." : "Starting session..."}</h3>
            <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">Speak naturally about your crops, weather patterns, or sustainable techniques.</p>
          </div>
        </div>
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-3xl text-rose-400 flex items-center gap-4 animate-in slide-in-from-bottom-4">
             <Info size={24} />
             <p className="text-sm font-bold text-left">{error}</p>
             <button onClick={startSession} className="ml-auto underline font-black text-xs">RETRY</button>
          </div>
        )}
        <div className="grid grid-cols-2 gap-6">
           <div className="bg-slate-700/30 p-6 rounded-3xl border border-slate-700 flex items-center gap-4">
             <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`} />
             <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Mic Active</span>
           </div>
           <div className="bg-slate-700/30 p-6 rounded-3xl border border-slate-700 flex items-center gap-4">
             <div className={`w-3 h-3 rounded-full ${isAiTalking ? 'bg-blue-400 animate-pulse' : 'bg-slate-600'}`} />
             <span className="text-xs font-black text-slate-400 uppercase tracking-widest">AI Responding</span>
           </div>
        </div>
        <button onClick={onClose} className="w-full py-6 bg-white text-slate-900 rounded-3xl font-black text-xl hover:bg-green-50 transition-all transform active:scale-95">STOP ASSISTANT</button>
      </div>
    </div>
  );
};

export default VoiceAssistant;
