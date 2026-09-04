
import React, { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, Share2, Sparkles, Send, Loader2, User, Clock, ExternalLink } from 'lucide-react';
import { ForumPost } from '../types';
import { generateGroundedForumPost } from '../services/geminiService';

const INITIAL_POSTS: ForumPost[] = [
  {
    id: '1',
    author: 'Amit Sharma',
    authorAvatar: 'https://picsum.photos/seed/amit/100',
    title: 'Success with Drip Irrigation in Maharashtra',
    content: 'I switched to drip irrigation for my sugarcane crop last season and saw a 30% reduction in water usage. The initial cost was subsidized by the state government, making it very affordable. Anyone else thinking of switching?',
    timestamp: '2 hours ago',
    upvotes: 42,
    comments: 15
  }
];

const Forum: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>(INITIAL_POSTS);
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sources, setSources] = useState<any[]>([]);

  const handleAiPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !keywords) return;
    setIsGenerating(true);
    try {
      const result = await generateGroundedForumPost(topic, keywords);
      const newPost: ForumPost = {
        id: Date.now().toString(),
        author: 'Kisaan AI Assistant',
        authorAvatar: 'https://picsum.photos/seed/ai/100',
        title: result.title,
        content: result.content,
        timestamp: 'Just now',
        upvotes: 0,
        comments: 0,
        isAiGenerated: true
      };
      setPosts([newPost, ...posts]);
      setSources(result.sources);
      setTopic('');
      setKeywords('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Main Feed */}
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl font-bold text-slate-800 outfit">Community Discussions</h2>
          {posts.map(post => (
            <div key={post.id} className={`bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 space-y-4 hover:shadow-md transition-shadow ${post.isAiGenerated ? 'ring-2 ring-blue-100 bg-blue-50/10' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={post.authorAvatar} className="w-10 h-10 rounded-full border" alt={post.author} />
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{post.author}</p>
                    <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase">
                      <Clock size={12} /> {post.timestamp}
                    </div>
                  </div>
                </div>
                {post.isAiGenerated && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    <Sparkles size={10} /> Grounded in Search
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-800 outfit">{post.title}</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{post.content}</p>
              
              {post.isAiGenerated && sources.length > 0 && (
                <div className="pt-4 border-t border-blue-50">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Verification Sources</p>
                  <div className="flex flex-wrap gap-2">
                    {sources.map((src, i) => (
                      <a 
                        key={i} 
                        href={src.web?.uri} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                      >
                        <ExternalLink size={12} /> {src.web?.title || 'Grounding Data'}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center gap-6 border-t border-slate-50">
                <button className="flex items-center gap-2 text-slate-500 hover:text-green-600 transition-colors text-sm font-bold">
                  <ThumbsUp size={18} /> {post.upvotes}
                </button>
                <button className="flex items-center gap-2 text-slate-500 hover:text-green-600 transition-colors text-sm font-bold">
                  <MessageSquare size={18} /> {post.comments}
                </button>
                <button className="flex items-center gap-2 text-slate-500 hover:text-green-600 transition-colors text-sm font-bold ml-auto">
                  <Share2 size={18} /> Share
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Tool */}
        <div className="w-full md:w-80 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={100} />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold outfit mb-2">AI Topic Generator</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">Now using <b>Google Search Grounding</b> for real-world factual accuracy.</p>
              <form onSubmit={handleAiPost} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 block">General Topic</label>
                  <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Subsidy Changes 2025"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 block">Keywords</label>
                  <input 
                    type="text" 
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g. tractor, kisan portal, news"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isGenerating || !topic || !keywords}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  Generate & Verify
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forum;
