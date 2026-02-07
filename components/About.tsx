
import React from 'react';
import { Leaf, Target, Cpu, ShieldCheck, Github, Globe, IndianRupee } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-green-600 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-green-100 mb-6">
          <Leaf size={40} />
        </div>
        <h1 className="text-5xl font-bold text-slate-800 outfit tracking-tight">AgroPlay</h1>
        <p className="text-slate-500 text-xl font-medium">Smart Farming, Made Easy.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-6">
           <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
             <Target size={24} />
           </div>
           <h3 className="text-2xl font-bold text-slate-800 outfit">Our Mission</h3>
           <p className="text-slate-600 leading-relaxed">To empower modern farmers by providing real-time, AI-driven insights that promote precision agriculture, reduce environmental footprint, and simplify complex cultivation processes.</p>
        </div>

        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-6">
           <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner">
             <Cpu size={24} />
           </div>
           <h3 className="text-2xl font-bold text-slate-800 outfit">Technology</h3>
           <p className="text-slate-600 leading-relaxed">Leveraging Gemini 3.0 and the latest in agricultural vision models, AgroPlay transforms complex sensor data into actionable farm intelligence, making advanced techniques accessible to everyone.</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white space-y-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
           <ShieldCheck size={200} />
        </div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
           <div className="space-y-4">
              <h4 className="text-4xl font-black outfit text-green-400">10k+</h4>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Farmers Onboarded</p>
           </div>
           <div className="space-y-4">
              <h4 className="text-4xl font-black outfit text-green-400">85%</h4>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Water Reduction</p>
           </div>
           <div className="space-y-4">
              <h4 className="text-4xl font-black outfit text-green-400">25+</h4>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Crop Variations</p>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-8">
        <h3 className="text-2xl font-bold text-slate-800 outfit text-center">Development Stack</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {['React 19', 'Gemini AI', 'Tailwind CSS', 'Lucide React', 'TypeScript', 'LocalStorage API'].map(tech => (
            <span key={tech} className="px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl font-bold text-sm border border-slate-100">{tech}</span>
          ))}
        </div>
      </div>

      <div className="text-center space-y-6 pt-12 border-t">
        <div className="flex justify-center gap-8 text-slate-400 font-bold text-sm uppercase tracking-widest">
           <a href="#" className="hover:text-green-600 transition-colors flex items-center gap-2"><Github size={18} /> Github</a>
           <a href="#" className="hover:text-green-600 transition-colors flex items-center gap-2"><Globe size={18} /> Website</a>
        </div>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">© {new Date().getFullYear()} AgroPlay Ecosystem • All Rights Reserved</p>
      </div>
    </div>
  );
};

export default About;
