
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Leaf,
  Microscope,
  BookOpen,
  TrendingUp,
  Award,
  Bell,
  Search,
  ChevronRight,
  Menu,
  X,
  Sprout,
  Compass,
  GraduationCap,
  ShoppingCart,
  Box,
  Landmark,
  ShieldCheck,
  Gamepad2,
  Info,
  MessageSquare,
  Trophy,
  Zap,

  LogOut,
  Scan,
  Activity,
  UserCircle
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Forum from './components/Forum';
import Groups from './components/Groups';
import Leaderboard from './components/Leaderboard';
import Games from './components/Games';
import About from './components/About';
import Planner from './components/Planner';
import Diagnosis from './components/Diagnosis';
import Learn from './components/Learn';
import Market from './components/Market';
import Profile from './components/Profile';
import VirtualFarm from './components/VirtualFarm';
import NewJourney from './components/NewJourney';
import Practices from './components/Practices';
import PracticeDetail from './components/PracticeDetail';
import Marketplace from './components/Marketplace';
import Converter from './components/Converter';
import ConverterVerify from './components/ConverterVerify';
import Subsidies from './components/Subsidies';
import Insurance from './components/Insurance';
import PreventiveAI from './components/PreventiveAI';


import Auth from './components/Auth';
import Onboarding from './components/Onboarding';
import { UserProfile } from './types';
import {
  isAuthenticated as checkAuth,
  logout as authLogout,
  getAccessToken,
  refreshAccessToken,
  clearTokens
} from './services/authService';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check JWT token validity instead of simple boolean
    return checkAuth();
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('km_user_profile');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem('km_user_profile', JSON.stringify(user));
      localStorage.setItem('km_auth', 'true');
    }
  }, [user, isAuthenticated]);

  const handleLogin = (profile: UserProfile) => {
    setUser(profile);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await authLogout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const SidebarLink = ({ to, icon: Icon, children }: React.PropsWithChildren<{ to: string, icon: any }>) => {
    const location = useLocation();
    const isActive = location.pathname === to ||
      (to === '/practices' && location.pathname.startsWith('/practices/')) ||
      (to === '/converter' && location.pathname.startsWith('/converter')) ||
      (to === '/learn' && location.pathname.startsWith('/learn'));
    return (
      <Link
        to={to}
        onClick={() => setIsSidebarOpen(false)}
        className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all relative group overflow-hidden ${isActive
          ? 'bg-slate-900 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)] border border-green-500/50'
          : 'text-slate-300 hover:bg-slate-800 hover:text-green-400 border border-transparent'
          }`}
      >
        {isActive && <div className="absolute inset-0 bg-green-500/5 scanning-line" />}
        <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'neon-flicker' : ''} />
        <span className="font-black text-[10px] uppercase tracking-widest relative z-10">{children}</span>
        {isActive && <div className="ml-auto w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]" />}
      </Link>
    );
  };

  if (!isAuthenticated || !user) {
    return <Auth onLogin={handleLogin} />;
  }

  // Mandatory Onboarding Check
  if (user && !user.onboardingComplete) {
    return <Onboarding user={user} onComplete={(updated) => setUser(updated)} />;
  }

  const currentLevel = Math.floor((user?.points ?? 0) / 500) + 1;
  const progressPercent = Math.min(100, Math.max(0, (((user?.points ?? 0) % 500) / 500) * 100));

  return (
    <HashRouter>
      <div className="flex h-screen bg-slate-950 overflow-hidden font-inter text-slate-100">
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static flex-shrink-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6 h-full flex flex-col overflow-y-auto custom-scrollbar bg-slate-950 border-r border-green-500/20 shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3 mb-10 p-2">
              <div className="w-12 h-12 bg-slate-900 border-2 border-green-500/50 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)] relative overflow-hidden group">
                <Leaf className="text-green-500 group-hover:scale-110 transition-transform" size={24} />
                <div className="absolute inset-0 bg-green-500/10 animate-pulse" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black text-2xl text-white outfit tracking-tighter uppercase italic">AgroPlay</span>
                <span className="text-[7px] font-black text-green-500 uppercase tracking-[0.4em] mt-1 flex items-center gap-1">
                  <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]" /> COMMAND SYSTEM v5
                </span>
              </div>
            </div>

            <nav className="space-y-8 flex-1">
              <div className="space-y-2">
                <div className="px-5 py-2 text-[8px] font-black text-green-400/80 uppercase tracking-[0.5em] border-l-2 border-green-500/20 mb-2">Tactical Command</div>
                <SidebarLink to="/" icon={LayoutDashboard}>Mission Control</SidebarLink>
                <SidebarLink to="/farm" icon={Sprout}>Virtual Acreage</SidebarLink>
                <SidebarLink to="/new-journey" icon={Compass}>New Deployment</SidebarLink>
              </div>

              <div className="space-y-2">
                <div className="px-5 py-2 text-[8px] font-black text-green-400/80 uppercase tracking-[0.5em] border-l-2 border-green-500/20 mb-2">Intelligence Lab</div>
                <SidebarLink to="/diagnosis" icon={Scan}>Neural Diagnosis</SidebarLink>
                <SidebarLink to="/preventive-ai" icon={ShieldCheck}>Pro-Shield AI</SidebarLink>
                <SidebarLink to="/planner" icon={Activity}>Strategic Planner</SidebarLink>

              </div>

              <div className="space-y-2">
                <div className="px-5 py-2 text-[8px] font-black text-green-400/80 uppercase tracking-[0.5em] border-l-2 border-green-500/20 mb-2">Resource Node</div>
                <SidebarLink to="/marketplace" icon={ShoppingCart}>Agri-Market</SidebarLink>
                <SidebarLink to="/converter" icon={Box}>Value Extraction</SidebarLink>
                <SidebarLink to="/market" icon={TrendingUp}>Mandi Telemetry</SidebarLink>
              </div>

              <div className="space-y-2">
                <div className="px-5 py-2 text-[8px] font-black text-green-400/80 uppercase tracking-[0.5em] border-l-2 border-green-500/20 mb-2">Training Academy</div>
                <SidebarLink to="/practices" icon={GraduationCap}>Bio-Library</SidebarLink>
                <SidebarLink to="/learn" icon={BookOpen}>Active Training</SidebarLink>
              </div>

              <div className="space-y-2">
                <div className="px-5 py-2 text-[8px] font-black text-green-400/80 uppercase tracking-[0.5em] border-l-2 border-green-500/20 mb-2">Social Nexus</div>
                <SidebarLink to="/forum" icon={MessageSquare}>Intel Exchange</SidebarLink>
                <SidebarLink to="/groups" icon={Users}>Interest Alliances</SidebarLink>
                <SidebarLink to="/leaderboard" icon={Trophy}>Global Rankings</SidebarLink>
                <SidebarLink to="/games" icon={Gamepad2}>Agri-Arcade</SidebarLink>
              </div>

              <div className="space-y-2">
                <div className="px-5 py-2 text-[8px] font-black text-green-400/80 uppercase tracking-[0.5em] border-l-2 border-green-500/20 mb-2">Protection Protocols</div>
                <SidebarLink to="/subsidies" icon={Landmark}>Grants & Subsidies</SidebarLink>
                <SidebarLink to="/insurance" icon={ShieldCheck}>Insurance Portfolio</SidebarLink>
              </div>
            </nav>

            <div className="mt-8 pt-8 border-t border-green-500/10 space-y-6">
              {user && (
                <div className="bg-slate-900 rounded-[2rem] p-5 border border-green-500/20 shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-green-500/5 scanning-line opacity-20" />
                  <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                      <Award size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] text-green-400/70 font-black uppercase tracking-widest">Mastery Status</p>
                      <p className="text-xl font-black text-white outfit leading-none">{user.points} <span className="text-[10px] text-green-400">XP</span></p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-white/5 p-0.5">
                    <div className="bg-gradient-to-r from-green-500 to-amber-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_#22c55e]" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <div className="flex justify-between mt-3">
                    <p className="text-[9px] font-black text-green-400/80 uppercase tracking-widest">Rank {currentLevel}</p>
                    <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest">{user.role}</p>
                  </div>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 text-slate-300 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all font-black text-[10px] tracking-[0.3em] uppercase border border-transparent hover:border-rose-500/20"
              >
                <LogOut size={16} /> TERMINATE UPLINK
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0 relative">
          <header className="md:hidden bg-slate-950 border-b border-green-500/20 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 border border-green-500/50 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                <Leaf className="text-green-500" size={18} />
              </div>
              <span className="font-black text-lg text-white outfit italic uppercase">AgroPlay</span>
            </div>
            <button onClick={toggleSidebar} className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg">
              <Menu size={24} />
            </button>
          </header>

          <header className="hidden md:flex bg-slate-950 border-b border-green-500/10 px-10 py-5 items-center justify-between z-10 relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-white outfit tracking-tighter uppercase italic">Control Node: {user?.name?.split(' ')[0] ?? 'User'}</h1>
                <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-[8px] font-black uppercase tracking-widest border border-green-500/20">Authorized ACCESS</span>
              </div>
              <div className="flex items-center gap-3 mt-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                  <p className="text-[9px] font-bold text-green-400 uppercase tracking-widest">Uplink Active</p>
                </div>
                <div className="w-px h-2 bg-slate-800" />
                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Loc: {user?.location?.toUpperCase()} • Latency: 24ms</p>
              </div>
            </div>
            <div className="flex items-center gap-8 relative z-10">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400 group-focus-within:text-green-300 transition-colors" size={14} />
                <input
                  type="text"
                  placeholder="Global Search..."
                  className="pl-11 pr-4 py-3 bg-slate-900 border border-green-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-green-400 focus:ring-2 focus:ring-green-500/30 w-72 shadow-2xl placeholder:opacity-70"
                />
              </div>
              <button className="p-3 text-slate-400 hover:bg-green-500/10 hover:text-green-500 rounded-2xl relative transition-all border border-transparent hover:border-green-500/20">
                <Bell size={20} />
                <span className="absolute top-3 right-3 w-2 h-2 bg-green-500 rounded-full border-2 border-slate-950 shadow-[0_0_8px_#22c55e]" />
              </button>
              <Link to="/profile" className="p-1 bg-slate-900 border-2 border-green-500/30 rounded-2xl shadow-2xl hover:border-green-500 transition-all flex items-center gap-3 pr-4 group">
                <div className="w-10 h-10 rounded-xl bg-slate-800 overflow-hidden flex items-center justify-center">
                  {user?.avatar ? <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" /> : <UserCircle className="text-green-500/50" size={28} />}
                </div>
                <ChevronRight className="text-slate-600 group-hover:text-green-500 transition-colors" size={16} />
              </Link>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-12 relative bg-slate-900">
            <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

            {/* HUD Corner Elements */}
            <div className="hud-corner hud-corner-tl" />
            <div className="hud-corner hud-corner-tr" />
            <div className="hud-corner hud-corner-bl" />
            <div className="hud-corner hud-corner-br" />

            <div className="max-w-7xl mx-auto relative z-10">
              <Routes>
                <Route path="/" element={<Dashboard user={user!} setUser={setUser as any} />} />
                <Route path="/farm" element={<VirtualFarm />} />

                <Route path="/marketplace" element={<Marketplace user={user!} setUser={setUser as any} />} />
                <Route path="/converter" element={<Converter user={user!} setUser={setUser as any} />} />
                <Route path="/converter/verify" element={<ConverterVerify />} />
                <Route path="/subsidies" element={<Subsidies user={user!} setUser={setUser as any} />} />
                <Route path="/insurance" element={<Insurance />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/leaderboard" element={<Leaderboard user={user!} />} />
                <Route path="/games" element={<Games user={user!} setUser={setUser as any} />} />
                <Route path="/about" element={<About />} />
                <Route path="/new-journey" element={<NewJourney user={user!} setUser={setUser as any} />} />
                <Route path="/practices" element={<Practices />} />
                <Route path="/practices/:slug" element={<PracticeDetail />} />
                <Route path="/planner" element={<Planner user={user!} />} />
                <Route path="/diagnosis" element={<Diagnosis user={user!} setUser={setUser as any} />} />
                <Route path="/preventive-ai" element={<PreventiveAI user={user!} />} />
                <Route path="/learn" element={<Learn user={user!} setUser={setUser as any} />} />

                <Route path="/learn/:journeyId" element={<Learn user={user!} setUser={setUser as any} />} />
                <Route path="/market" element={<Market />} />
                <Route path="/profile" element={<Profile user={user!} setUser={setUser as any} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
        </div>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 md:hidden animate-in fade-in duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </HashRouter>
  );
};

export default App;
