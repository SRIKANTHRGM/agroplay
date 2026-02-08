
import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Send, Loader2, Sparkles, User, Bot, BookOpen, ShieldCheck } from 'lucide-react';
import { PRACTICES } from './Practices';
import { askAITutor } from '../services/geminiService';

const PracticeDetail: React.FC = () => {
  const { slug } = useParams();
  const practice = PRACTICES.find(p => p.slug === slug);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!practice) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">Practice module not found.</h2>
        <Link to="/practices" className="text-green-600 hover:underline mt-4 inline-block">Return to Library</Link>
      </div>
    );
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await askAITutor(practice.content, userMsg);
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I had trouble connecting. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <Link to="/practices" className="inline-flex items-center gap-2 text-slate-500 hover:text-green-600 font-bold transition-colors">
        <ArrowLeft size={20} /> Back to Library
      </Link>

      {/* Hero */}
      <div className="relative h-96 rounded-[3rem] overflow-hidden shadow-2xl">
        <img src={practice.image} className="w-full h-full object-cover" alt={practice.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-10 left-10 text-white space-y-2">
          <div className="px-3 py-1 bg-green-600 rounded-full w-fit text-[10px] font-bold uppercase tracking-widest">
            {practice.category}
          </div>
          <h1 className="text-5xl font-bold outfit">{practice.title}</h1>
        </div>
      </div>

      {/* Content Rendering */}
      <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-sm border border-slate-100 prose prose-slate prose-green max-w-none">
        {practice.content.split('\n').map((line, i) => {
          if (line.startsWith('# ')) return <h1 key={i} className="text-slate-800 outfit text-4xl mb-8">{line.replace('# ', '')}</h1>;
          if (line.startsWith('## ')) return <h2 key={i} className="text-slate-800 outfit text-2xl mt-12 mb-6">{line.replace('## ', '')}</h2>;
          if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ')) return <li key={i} className="text-slate-600 ml-4 mb-2">{line.substring(3)}</li>;
          if (line.startsWith('- ')) return <li key={i} className="text-slate-600 ml-4 mb-2 list-disc">{line.replace('- ', '')}</li>;
          if (line.trim().length === 0) return null;
          return <p key={i} className="text-slate-600 text-lg leading-relaxed mb-6">{line}</p>;
        })}
      </div>

      {/* AI Tutor Chat Widget */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col h-[500px] md:h-[650px] group/tutor">
        <div className="p-8 border-b bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-100 group-hover/tutor:rotate-12 transition-transform">
              <Sparkles size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 outfit tracking-tight">Kisaan Mitra AI Tutor</h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Personalized Learning Assistant</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-green-100">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> NEURAL LINK ACTIVE
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 bg-slate-50/20 custom-scrollbar">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-60">
              <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-sm border border-slate-100">
                <Bot size={48} className="text-slate-300" />
              </div>
              <div className="space-y-2 max-w-sm">
                <p className="text-xl font-black outfit text-slate-800">Ready to help!</p>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">I've analyzed this module. Ask me about specific techniques, soil types, or implementation tips.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 pt-4">
                {['Explain key concepts', 'Give me a summary', 'Practical tips'].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => { setInput(suggestion); }}
                    className="px-4 py-2 bg-white border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-green-600 hover:border-green-200 transition-all shadow-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex items-start gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''} animate-in slide-in-from-bottom-2 duration-500`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${m.role === 'user' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-100 text-green-600'}`}>
                {m.role === 'user' ? <User size={24} /> : <Sparkles size={24} />}
              </div>
              <div className={`p-6 rounded-[2rem] max-w-[85%] text-base leading-relaxed shadow-sm ${m.role === 'user'
                ? 'bg-slate-900 text-white rounded-tr-none'
                : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none font-medium'
                }`}>
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 text-green-600 flex items-center justify-center shadow-sm">
                <Sparkles size={24} className="animate-spin" />
              </div>
              <div className="p-6 bg-white border border-slate-100 shadow-sm text-slate-400 rounded-[2rem] rounded-tl-none flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.2em]">Consulting Knowledge Base...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 border-t bg-white">
          <div className="relative group/input flex items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask your questions here..."
                className="w-full pl-8 pr-16 py-6 bg-slate-50 border-none rounded-[2rem] focus:ring-4 focus:ring-green-500/10 transition-all text-lg font-medium outfit shadow-inner placeholder:text-slate-300"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className={`absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-xl disabled:opacity-50 ${!input.trim() || loading ? 'bg-slate-200 text-slate-400' : 'bg-green-600 text-white hover:bg-green-700 hover:scale-110 active:scale-95'}`}
              >
                <Send size={24} />
              </button>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 opacity-30">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <ShieldCheck size={12} /> Privacy Guaranteed
            </div>
            <div className="h-1 w-1 bg-slate-300 rounded-full" />
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <Bot size={12} /> Agricultural Expert AI
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeDetail;
