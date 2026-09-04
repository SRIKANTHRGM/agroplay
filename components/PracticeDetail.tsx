
import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Send, Loader2, Sparkles, User, Bot, BookOpen } from 'lucide-react';
import { PRACTICES } from './Practices';
import { askAITutor } from '../services/geminiService';

const PracticeDetail: React.FC = () => {
  const { slug } = useParams();
  const practice = PRACTICES.find(p => p.slug === slug);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([]);
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
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col h-[600px]">
        <div className="p-8 border-b bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-100">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 outfit">Module AI Tutor</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Ask anything about this module</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl text-xs font-bold">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> ONLINE
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30">
          {messages.length === 0 && (
            <div className="text-center space-y-4 py-20 text-slate-400">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={32} />
              </div>
              <p className="font-bold outfit">No questions yet!</p>
              <p className="text-sm px-10">I've read this module carefully. Ask me to clarify any concepts or provide more details based on the text above.</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex items-start gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-slate-800 text-white' : 'bg-green-600 text-white'}`}>
                {m.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`p-4 rounded-3xl max-w-[80%] text-sm leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-slate-800 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-100 shadow-sm text-slate-700 rounded-tl-none'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div className="p-4 bg-white border border-slate-100 shadow-sm text-slate-700 rounded-3xl rounded-tl-none flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-green-600" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tutor is thinking...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 border-t bg-white">
          <div className="relative group">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your question about this practice..."
              className="w-full pl-6 pr-16 py-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all text-sm font-medium outfit"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-green-600 text-white rounded-xl flex items-center justify-center hover:bg-green-700 transition-all shadow-lg shadow-green-100 disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="mt-4 text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
            Tutor knowledge is strictly limited to this module's content
          </p>
        </div>
      </div>
    </div>
  );
};

export default PracticeDetail;
