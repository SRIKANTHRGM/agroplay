
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
    switch(rank) {
      case 1: return <Crown className="text-amber-400" size={48} />;
      case 2: return <Medal className="text-slate-400" size={40} />;
      case 3: return <Trophy className="text-orange-400" size={40} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-slate-800 outfit">Regional Rankings</h2>
        <p className="text-slate-500 max-w-xl mx-auto text-lg">Celebrate the top contributors to sustainable farming in your region.</p>
      </div>

      {/* Podium */}
      <div className="flex flex-col md:flex-row items-end justify-center gap-6 pt-20">
        {/* 2nd Place */}
        {top3[1] && (
          <div className="order-2 md:order-1 w-full md:w-64 bg-white rounded-t-[3rem] p-8 border-x border-t border-slate-100 shadow-sm flex flex-col items-center text-center space-y-4 pb-12">
            <div className="relative">
              <img src={top3[1].avatar} className="w-24 h-24 rounded-[2rem] border-4 border-slate-100 shadow-xl" alt="" />
              <div className="absolute -top-10 left-1/2 -translate-x-1/2">{getRankIcon(2)}</div>
            </div>
            <div>
               <h4 className="font-bold text-slate-800 outfit text-xl">{top3[1].name}</h4>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{top3[1].role}</p>
            </div>
            <p className="text-2xl font-black outfit text-slate-700">{top3[1].points.toLocaleString()} XP</p>
          </div>
        )}

        {/* 1st Place */}
        {top3[0] && (
          <div className="order-1 md:order-2 w-full md:w-72 bg-gradient-to-br from-slate-900 to-slate-800 rounded-t-[3.5rem] p-10 shadow-2xl flex flex-col items-center text-center space-y-6 pb-20 relative -mt-10">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <div className="relative z-10">
              <div className="relative mb-6">
                <img src={top3[0].avatar} className="w-32 h-32 rounded-[2.5rem] border-4 border-amber-400 shadow-2xl" alt="" />
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 animate-bounce">{getRankIcon(1)}</div>
              </div>
              <div>
                 <h4 className="font-bold text-white outfit text-2xl">{top3[0].name}</h4>
                 <p className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.3em]">{top3[0].role}</p>
              </div>
              <p className="text-3xl font-black outfit text-amber-400 mt-4">{top3[0].points.toLocaleString()} XP</p>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {top3[2] && (
          <div className="order-3 w-full md:w-64 bg-white rounded-t-[3rem] p-8 border-x border-t border-slate-100 shadow-sm flex flex-col items-center text-center space-y-4 pb-12">
            <div className="relative">
              <img src={top3[2].avatar} className="w-24 h-24 rounded-[2rem] border-4 border-orange-50 shadow-xl" alt="" />
              <div className="absolute -top-10 left-1/2 -translate-x-1/2">{getRankIcon(3)}</div>
            </div>
            <div>
               <h4 className="font-bold text-slate-800 outfit text-xl">{top3[2].name}</h4>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{top3[2].role}</p>
            </div>
            <p className="text-2xl font-black outfit text-orange-600">{top3[2].points.toLocaleString()} XP</p>
          </div>
        )}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b bg-slate-50/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <Activity size={24} className="text-green-600" />
             <h3 className="text-xl font-bold outfit text-slate-800">Global Competition</h3>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Updated 5m ago</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/80 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] border-b">
                <th className="px-10 py-5">Rank</th>
                <th className="px-10 py-5">Farmer</th>
                <th className="px-10 py-5">Specialization</th>
                <th className="px-10 py-5 text-right">Progress Score</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mergedData.map((entry) => (
                <tr key={`${entry.name}-${entry.rank}`} className={`hover:bg-slate-50 transition-colors group ${entry.isCurrentUser ? 'bg-green-50/50 ring-2 ring-inset ring-green-100' : ''}`}>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3 font-black outfit text-xl text-slate-400 group-hover:text-green-600 transition-colors">
                      {entry.rank} <ChevronUp size={14} className="text-green-500 opacity-0 group-hover:opacity-100" />
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <img src={entry.avatar} className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm" alt="" />
                      <div>
                        <p className="font-bold text-slate-800 outfit">{entry.name} {entry.isCurrentUser && <span className="ml-2 px-2 py-0.5 bg-green-600 text-white rounded text-[8px] uppercase tracking-widest">You</span>}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Active since 2023</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{entry.role}</p>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-all">
                      <Star size={14} fill="currentColor" className="text-amber-500 group-hover:text-white" />
                      <span className="font-black outfit text-lg">{entry.points.toLocaleString()}</span>
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
