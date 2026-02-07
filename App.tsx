
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
  FlaskConical,
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
import AILab from './components/AILab';
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
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${isActive
          ? 'bg-green-600 text-white shadow-lg shadow-green-100'
          : 'text-slate-600 hover:bg-green-50 hover:text-green-700'
          }`}
      >
        <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
        <span className="font-semibold text-xs tracking-tight">{children}</span>
      </Link>
    );
  };

  if (!isAuthenticated) {
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
      <div className="flex h-screen bg-slate-50 overflow-hidden font-inter text-slate-900">
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static flex-shrink-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6 h-full flex flex-col overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-100">
                <Leaf className="text-white" size={24} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black text-xl text-slate-800 outfit tracking-tighter">AgroPlay</span>
                <span className="text-[7px] font-black text-green-600 uppercase tracking-[0.2em] mt-1">Smart Farming Node</span>
              </div>
            </div>

            <nav className="space-y-6 flex-1">
              <div className="space-y-1">
                <div className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Core Command</div>
                <SidebarLink to="/" icon={LayoutDashboard}>Dashboard</SidebarLink>
                <SidebarLink to="/farm" icon={Sprout}>Virtual Acreage</SidebarLink>
                <SidebarLink to="/new-journey" icon={Compass}>New Cultivation</SidebarLink>
              </div>

              <div className="space-y-1">
                <div className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Intelligence & Tools</div>
                <SidebarLink to="/ai-lab" icon={FlaskConical}>AI Research Lab</SidebarLink>
                <SidebarLink to="/diagnosis" icon={Scan}>Plant Health Scanner</SidebarLink>
                <SidebarLink to="/planner" icon={Activity}>Strategic Planner</SidebarLink>
              </div>

              <div className="space-y-1">
                <div className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Commerce Hub</div>
                <SidebarLink to="/marketplace" icon={ShoppingCart}>Global Market</SidebarLink>
                <SidebarLink to="/converter" icon={Box}>Value Addition Hub</SidebarLink>
                <SidebarLink to="/market" icon={TrendingUp}>Mandi Trends</SidebarLink>
              </div>

              <div className="space-y-1">
                <div className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Academy</div>
                <SidebarLink to="/practices" icon={GraduationCap}>Practice Library</SidebarLink>
                <SidebarLink to="/learn" icon={BookOpen}>Active Journeys</SidebarLink>
              </div>

              <div className="space-y-1">
                <div className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Social Nexus</div>
                <SidebarLink to="/forum" icon={MessageSquare}>Discussion Forum</SidebarLink>
                <SidebarLink to="/groups" icon={Users}>Interest Alliances</SidebarLink>
                <SidebarLink to="/leaderboard" icon={Trophy}>Global Rank</SidebarLink>
                <SidebarLink to="/games" icon={Gamepad2}>Farmer's Arcade</SidebarLink>
              </div>

              <div className="space-y-1">
                <div className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Protection</div>
                <SidebarLink to="/subsidies" icon={Landmark}>Grants & Subsidies</SidebarLink>
                <SidebarLink to="/insurance" icon={ShieldCheck}>Insurance Portfolio</SidebarLink>
              </div>
            </nav>

            <div className="mt-8 pt-6 border-t space-y-4">
              {user && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 shadow-inner">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-amber-100">
                      <Award size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Total Mastery</p>
                      <p className="text-lg font-black text-slate-800 outfit leading-none">{user.points} XP</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 mt-2 text-center uppercase tracking-widest">Level {currentLevel} {user.role}</p>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-black text-xs tracking-widest"
              >
                <LogOut size={16} /> TERMINATE SESSION
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0 relative">
          <header className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Leaf className="text-white" size={18} />
              </div>
              <span className="font-bold text-lg text-slate-800 outfit">AgroPlay</span>
            </div>
            <button onClick={toggleSidebar} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
              <Menu size={24} />
            </button>
          </header>

          <header className="hidden md:flex bg-white border-b px-8 py-4 items-center justify-between z-10">
            <div>
              <h1 className="text-xl font-black text-slate-800 outfit tracking-tight">Welcome, {user?.name?.split(' ')[0] ?? 'Farmer'}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">SECURE LINK • {user?.location?.toUpperCase()} NODE</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-500 transition-colors" size={16} />
                <input
                  type="text"
                  placeholder="Search network..."
                  className="pl-11 pr-4 py-2.5 bg-slate-100 border-none rounded-2xl text-xs font-medium focus:ring-2 focus:ring-green-500 w-64 shadow-inner"
                />
              </div>
              <button className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-2xl relative transition-all">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
              </button>
              <Link to="/profile" className="w-11 h-11 rounded-2xl bg-slate-200 border-2 border-white shadow-xl overflow-hidden hover:scale-105 transition-transform flex items-center justify-center">
                {user?.avatar ? <img src={user.avatar} alt="Profile" /> : <UserCircle className="text-slate-400" size={32} />}
              </Link>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard user={user!} />} />
                <Route path="/farm" element={<VirtualFarm />} />
                <Route path="/ai-lab" element={<AILab />} />
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
