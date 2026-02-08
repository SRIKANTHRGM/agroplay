
import React from 'react';
import { Crown, Medal, Trophy, Star, ChevronUp, Activity, User as UserIcon } from 'lucide-react';
import { LeaderboardEntry, UserProfile } from '../types';

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Gurnam Singh', avatar: 'https://picsum.photos/seed/gurnam/100', role: 'Master Farmer', points: 15400 },
  { rank: 2, name: 'Lakshmi Devi', avatar: 'https://picsum.photos/seed/lakshmi/100', role: 'Organic Specialist', points: 14200 },
  { rank: 3, name: 'Sunil Verma', avatar: 'https://picsum.photos/seed/sunil/100', role: 'Irrigation Expert', points: 12850 },
  { rank: 4, name: 'Meera Bai', avatar: 'https://picsum.photos/seed/meera/100', role: 'Horticulturist', points: 11200 },
  { rank: 5, name: 'Rahul Das', avatar: 'https://picsum.photos/seed/rahul/100', role: 'Crop Planner', points: 9800 }
];

interface Props {
  user: UserProfile;
}

const Leaderboard: React.FC<Props> = ({ user }) => {
  const mergedData: LeaderboardEntry[] = [
    ...MOCK_LEADERBOARD,
    { rank: 0, name: user.name, avatar: 'https://picsum.photos/seed/farmer/100', role: 'Current User', points: user.points, isCurrentUser: true }
  ]
    .sort((a, b) => b.points - a.points)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));

  const top3 = mergedData.slice(0, 3);
  const others = mergedData.slice(3);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="text-amber-400" size={48} />;
      case 2: return <Medal className="text-slate-400" size={40} />;
      case 3: return <Trophy className="text-orange-400" size={40} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-white outfit uppercase italic tracking-tighter">Regional Rankings</h2>
        <p className="text-slate-300 max-w-xl mx-auto text-lg font-medium uppercase tracking-wide">Celebrate the top contributors to sustainable farming in your region.</p>
      </div>

      {/* Podium */}
      <div className="flex flex-col md:flex-row items-end justify-center gap-6 pt-20">
        {/* 2nd Place */}
        {top3[1] && (
          <div className="order-2 md:order-1 w-full md:w-64 bg-slate-900 rounded-t-[3rem] p-8 border-x border-t border-white/5 shadow-2xl flex flex-col items-center text-center space-y-4 pb-12 relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
            <div className="relative z-10">
              <img src={top3[1].avatar} className="w-24 h-24 rounded-[2rem] border-4 border-slate-800 shadow-2xl" alt="" />
              <div className="absolute -top-10 left-1/2 -translate-x-1/2">{getRankIcon(2)}</div>
            </div>
            <div className="relative z-10">
              <h4 className="font-black text-white outfit text-xl uppercase italic">{top3[1].name}</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{top3[1].role}</p>
            </div>
            <p className="text-2xl font-black outfit text-slate-300 relative z-10 uppercase italic">{top3[1].points.toLocaleString()} XP</p>
          </div>
        )}

        {/* 1st Place */}
        {top3[0] && (
          <div className="order-1 md:order-2 w-full md:w-72 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-t-[3.5rem] p-10 shadow-2xl flex flex-col items-center text-center space-y-6 pb-20 relative -mt-10 border border-amber-400/20">
            <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
            <div className="relative z-10">
              <div className="relative mb-6">
                <img src={top3[0].avatar} className="w-32 h-32 rounded-[2.5rem] border-4 border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.2)]" alt="" />
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 animate-bounce">{getRankIcon(1)}</div>
              </div>
              <div>
                <h4 className="font-black text-white outfit text-2xl uppercase italic leading-tight">{top3[0].name}</h4>
                <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.3em] italic">{top3[0].role}</p>
              </div>
              <p className="text-3xl font-black outfit text-amber-400 mt-4 italic shadow-amber-900/40">{top3[0].points.toLocaleString()} XP</p>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {top3[2] && (
          <div className="order-3 w-full md:w-64 bg-slate-900 rounded-t-[3rem] p-8 border-x border-t border-white/5 shadow-2xl flex flex-col items-center text-center space-y-4 pb-12 relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
            <div className="relative z-10">
              <img src={top3[2].avatar} className="w-24 h-24 rounded-[2rem] border-4 border-slate-800 shadow-2xl" alt="" />
              <div className="absolute -top-10 left-1/2 -translate-x-1/2">{getRankIcon(3)}</div>
            </div>
            <div className="relative z-10">
              <h4 className="font-black text-white outfit text-xl uppercase italic">{top3[2].name}</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{top3[2].role}</p>
            </div>
            <p className="text-2xl font-black outfit text-orange-400/80 relative z-10 uppercase italic">{top3[2].points.toLocaleString()} XP</p>
          </div>
        )}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-slate-900 rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
        <div className="p-8 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <Activity size={24} className="text-green-400 neon-flicker" />
            <h3 className="text-xl font-black outfit text-white uppercase italic">Global Competition</h3>
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Updated 5m ago</span>
        </div>
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/50 text-green-500/40 text-[10px] font-black uppercase tracking-[0.3em] border-b border-white/5">
                <th className="px-10 py-5">Rank</th>
                <th className="px-10 py-5">Farmer</th>
                <th className="px-10 py-5">Specialization</th>
                <th className="px-10 py-5 text-right">Progress Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mergedData.map((entry) => (
                <tr key={`${entry.name}-${entry.rank}`} className={`hover:bg-green-500/5 transition-all group ${entry.isCurrentUser ? 'bg-green-500/10 ring-2 ring-inset ring-green-500/20' : ''}`}>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3 font-black outfit text-xl text-slate-500 group-hover:text-green-400 transition-colors uppercase italic">
                      {entry.rank} <ChevronUp size={14} className="text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <img src={entry.avatar} className="w-12 h-12 rounded-2xl border-2 border-slate-700 shadow-2xl group-hover:border-green-500/50 transition-colors" alt="" />
                      <div>
                        <p className="font-black text-white outfit uppercase italic leading-tight">{entry.name} {entry.isCurrentUser && <span className="ml-2 px-2 py-0.5 bg-green-600 text-white rounded-[4px] text-[8px] font-black uppercase tracking-widest">You</span>}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] italic mt-1">Active since 2023</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">{entry.role}</p>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-xl group-hover:bg-green-600 group-hover:text-slate-950 transition-all shadow-inner border border-white/5">
                      <Star size={14} fill="currentColor" className="text-amber-400 group-hover:text-slate-950" />
                      <span className="font-black outfit text-lg uppercase italic">{entry.points.toLocaleString()}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
