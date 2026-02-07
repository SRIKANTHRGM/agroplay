
import React, { useState } from 'react';
import { UserProfile, CommunityGroup, Challenge } from '../types';
// Added Leaf to the imports to fix "Cannot find name 'Leaf'" error
import { Users, Trophy, MessageSquare, Plus, Search, Filter, ShieldCheck, Zap, Globe, Leaf } from 'lucide-react';

interface Props {
  user: UserProfile;
}

const Community: React.FC<Props> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'groups' | 'challenges' | 'leaderboard'>('groups');
  
  const groups: CommunityGroup[] = [
    { id: '1', name: 'Punjab Wheat Warriors', description: 'Sharing best practices for winter wheat harvesting.', members: 1250, category: 'crop', points: 45000 },
    { id: '2', name: 'Organic Farming Network', description: 'Methods for pesticide-free sustainable agriculture.', members: 890, category: 'technique', points: 32000 },
    { id: '3', name: 'Water-Wise Farmers', description: 'Focus on drip irrigation and water conservation.', members: 2100, category: 'technique', points: 58000 },
    { id: '4', name: 'Ludhiana Local Hub', description: 'Connecting farmers in the Ludhiana district.', members: 450, category: 'local', points: 12000 }
  ];

  const challenges: Challenge[] = [
    // Added 'status' property to satisfy Challenge interface in types.ts
    { id: 'c1', title: 'Compost Revolution', description: 'Create and apply organic compost to 1 acre of land.', rewardPoints: 500, type: 'compost', deadline: 'Oct 31', status: 'active' },
    { id: 'c2', title: 'Water Saver Week', description: 'Reduce water usage by 20% using improved techniques.', rewardPoints: 1000, type: 'water', deadline: 'Oct 25', status: 'active' },
    { id: 'c3', title: 'Pest Patrol', description: 'Install 5 pheromone traps per acre.', rewardPoints: 300, type: 'pest', deadline: 'Nov 15', status: 'active' }
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 outfit">Community Hub</h2>
          <p className="text-slate-500">Connect, share, and compete with fellow farmers.</p>
        </div>
        <button className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100">
          <Plus size={20} /> Create New Group
        </button>
      </div>

      <div className="flex p-1 bg-slate-200/50 rounded-2xl w-fit">
        {[
          { id: 'groups', icon: Users, label: 'Groups' },
          { id: 'challenges', icon: Zap, label: 'Challenges' },
          { id: 'leaderboard', icon: Trophy, label: 'Leaderboard' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'groups' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(group => (
            <div key={group.id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  group.category === 'crop' ? 'bg-amber-50 text-amber-600' : 
                  group.category === 'technique' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                }`}>
                  {/* Fixed: Leaf icon is now imported correctly */}
                  {group.category === 'crop' ? <Leaf size={24} /> : group.category === 'technique' ? <Zap size={24} /> : <Globe size={24} />}
                </div>
                <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-full text-[10px] font-bold text-slate-500">
                  <Users size={12} /> {group.members} MEMBERS
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 outfit group-hover:text-green-600 transition-colors">{group.name}</h3>
              <p className="text-sm text-slate-500 mt-2 line-clamp-2">{group.description}</p>
              
              <div className="mt-6 pt-6 border-t flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Group Points</p>
                  <p className="font-bold text-slate-800">{group.points.toLocaleString()}</p>
                </div>
                <button className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-600 hover:text-white transition-all">Join Group</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'challenges' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {challenges.map(challenge => (
            <div key={challenge.id} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    challenge.type === 'water' ? 'bg-blue-100 text-blue-700' : 
                    challenge.type === 'compost' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {challenge.type} challenge
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs font-bold text-slate-500">ENDS {challenge.deadline}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 outfit">{challenge.title}</h3>
                <p className="text-slate-500 leading-relaxed">{challenge.description}</p>
                <div className="flex items-center gap-4 pt-2">
                  <div className="bg-amber-50 px-4 py-2 rounded-2xl flex items-center gap-2">
                    <Trophy size={18} className="text-amber-500" />
                    <span className="font-bold text-amber-700">{challenge.rewardPoints} Points</span>
                  </div>
                  <button className="bg-green-600 text-white px-6 py-2 rounded-2xl font-bold hover:bg-green-700 shadow-lg shadow-green-100 transition-all">
                    Accept Challenge
                  </button>
                </div>
              </div>
              <div className="w-full md:w-32 flex flex-col justify-center items-center bg-slate-50 rounded-2xl p-4 border border-dashed border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Completion</p>
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-200" />
                    <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={213} strokeDashoffset={213 * 0.75} className="text-green-500" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-slate-700">75%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-800 outfit">Rankings</h3>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white rounded-xl text-xs font-bold shadow-sm border border-slate-100">Regional</button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-bold shadow-md">National</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b">
                  <th className="px-8 py-4">Rank</th>
                  <th className="px-8 py-4">Group Name</th>
                  <th className="px-8 py-4">Challenges Completed</th>
                  <th className="px-8 py-4 text-right">Points</th>
                </tr>
              </thead>
              <tbody>
                {groups.sort((a,b) => b.points - a.points).map((group, i) => (
                  <tr key={group.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        i === 0 ? 'bg-amber-100 text-amber-600' : i === 1 ? 'bg-slate-100 text-slate-600' : i === 2 ? 'bg-orange-100 text-orange-600' : 'text-slate-400'
                      }`}>
                        {i + 1}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="font-bold text-slate-800">{group.name}</div>
                      <div className="text-xs text-slate-400">{group.members} farmers</div>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-slate-600">
                      {Math.floor(Math.random() * 50) + 10} Tasks
                    </td>
                    <td className="px-8 py-5 text-right font-bold text-green-600">
                      {group.points.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
