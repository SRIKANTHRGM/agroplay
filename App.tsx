
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
import LanguageSelector from './components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { UserProfile } from './types';
import {
  isAuthenticated as checkAuth,
  logout as authLogout,
  getAccessToken,
  refreshAccessToken,
  clearTokens
} from './services/authService';

const App: React.FC = () => {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check JWT token validity instead of simple boolean
    return checkAuth();
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('km_user_profile');
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      console.error("Failed to parse user profile", err);
      return null;
    }
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

  const NavItem = ({ to, icon: Icon, children, isNested = false, isSidebarOpen = true }: React.PropsWithChildren<{ to: string, icon: any, isNested?: boolean, isSidebarOpen?: boolean }>) => {
    const location = useLocation();
    const isActive = location.pathname === to ||
      (to === '/practices' && location.pathname.startsWith('/practices/')) ||
      (to === '/converter' && location.pathname.startsWith('/converter')) ||
      (to === '/learn' && location.pathname.startsWith('/learn'));

    return (
      <Link
        to={to}
        onClick={() => setIsSidebarOpen(false)}
        className={`flex items-center gap-3 px-5 py-4 rounded-xl transition-all relative group overflow-hidden ${isNested && isSidebarOpen ? 'ml-6' : ''} ${isActive
          ? 'bg-[#E8F5E9] text-black shadow-sm border border-[#C8E6C9]'
          : 'text-black hover:bg-[#F1F8F1] border border-transparent'
          } ${!isSidebarOpen ? 'justify-center p-4' : ''}`}
        title={!isSidebarOpen ? String(children) : ''}
      >
        {isActive && <div className="absolute inset-0 bg-[#2d6a4f]/5 opacity-10" />}
        <Icon size={24} strokeWidth={2.5} className="text-black flex-shrink-0 relative z-10" />
        {isSidebarOpen && <span className="font-bold text-sm uppercase tracking-wider relative z-10 whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">{children}</span>}
        {isActive && isSidebarOpen && <div className="ml-auto w-1.5 h-1.5 bg-[#1b4332] rounded-full shadow-[0_0_10px_#1b4332]" />}
      </Link>
    );
  };

  const NavGroup = ({ title, children, defaultOpen = true, isSidebarOpen = true }: React.PropsWithChildren<{ title: string, defaultOpen?: boolean, isSidebarOpen?: boolean }>) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
      <div className="space-y-2">
        {isSidebarOpen && title && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-5 py-2 text-xs font-black text-black uppercase tracking-[0.2em] border-l-2 border-[#C8E6C9] hover:text-[#1b4332] transition-colors group"
          >
            <span className="truncate">{title}</span>
            <ChevronRight size={16} className={`text-black transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
          </button>
        )}
        {(isOpen || !isSidebarOpen) && <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">{children}</div>}
      </div>
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
      <div className="flex h-screen bg-[#F9FBFA] overflow-hidden font-inter text-slate-800 relative">
        <aside className={`
          static inset-y-0 left-0 z-40 transform transition-all duration-300 ease-in-out flex-shrink-0
          ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-20 translate-x-0'}
          hidden md:flex
        `}>
          <div className="p-4 h-full flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar bg-white border-r border-[#E0E5E2] shadow-[20px_0_50px_rgba(0,0,0,0.02)]">
            <div className={`flex items-center gap-3 mb-10 p-2 transition-all ${!isSidebarOpen ? 'justify-center' : ''}`}>
              <div className="w-12 h-12 bg-[#E8F5E9] border-2 border-[#C8E6C9] rounded-2xl flex items-center justify-center shadow-sm relative overflow-hidden group flex-shrink-0">
                <Leaf className="text-[#2d6a4f] group-hover:scale-110 transition-transform" size={24} />
                <div className="absolute inset-0 bg-[#C8E6C9]/20 animate-pulse" />
              </div>
              {isSidebarOpen && (
                <div className="flex flex-col leading-none animate-in fade-in slide-in-from-left-2 duration-300">
                  <span className="font-black text-2xl text-[#2d6a4f] outfit tracking-tighter uppercase italic">AgroPlay</span>
                  <span className="text-[7px] font-black text-[#1b4332] uppercase tracking-[0.4em] mt-1 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-[#1b4332] rounded-full animate-pulse shadow-[0_0_5px_#1b4332]" /> COMMAND SYSTEM
                  </span>
                </div>
              )}
            </div>

            <nav className="space-y-6 flex-1">
              <NavGroup title={isSidebarOpen ? t('sidebar.mission_control') : ''} isSidebarOpen={isSidebarOpen}>
                <NavItem to="/" icon={LayoutDashboard} isSidebarOpen={isSidebarOpen}>{t('sidebar.dashboard')}</NavItem>
                <div className="space-y-1">
                  {isSidebarOpen && <div className="px-5 py-1 text-[7px] font-black text-slate-400 uppercase tracking-widest ml-6">{t('sidebar.deployments')}</div>}
                  <NavItem to="/new-journey" icon={Compass} isNested isSidebarOpen={isSidebarOpen}>{t('sidebar.new_deployment')}</NavItem>
                  <NavItem to="/learn" icon={BookOpen} isNested isSidebarOpen={isSidebarOpen}>{t('sidebar.manage_plots')}</NavItem>
                </div>
                <NavItem to="/farm" icon={Sprout} isSidebarOpen={isSidebarOpen}>{t('sidebar.acreage')}</NavItem>
              </NavGroup>

              <NavGroup title={isSidebarOpen ? t('sidebar.intelligence_lab') : ''} isSidebarOpen={isSidebarOpen}>
                <NavItem to="/diagnosis" icon={Scan} isSidebarOpen={isSidebarOpen}>{t('sidebar.neural_diagnosis')}</NavItem>
                <NavItem to="/preventive-ai" icon={ShieldCheck} isSidebarOpen={isSidebarOpen}>{t('sidebar.pro_shield', 'Pro-Shield AI')}</NavItem>
                <NavItem to="/planner" icon={Activity} isSidebarOpen={isSidebarOpen}>{t('sidebar.strategic_planner')}</NavItem>
              </NavGroup>

              <NavGroup title={isSidebarOpen ? t('sidebar.resource_node') : ''} isSidebarOpen={isSidebarOpen}>
                <NavItem to="/marketplace" icon={ShoppingCart} isSidebarOpen={isSidebarOpen}>{t('sidebar.marketplace')}</NavItem>
                <NavItem to="/converter" icon={Box} isSidebarOpen={isSidebarOpen}>{t('sidebar.value_extraction', 'Value Extraction')}</NavItem>
                <NavItem to="/market" icon={TrendingUp} isSidebarOpen={isSidebarOpen}>{t('sidebar.mandi_telemetry')}</NavItem>
              </NavGroup>

              <NavGroup title={isSidebarOpen ? t('sidebar.training_academy') : ''} isSidebarOpen={isSidebarOpen}>
                <NavItem to="/practices" icon={GraduationCap} isSidebarOpen={isSidebarOpen}>{t('sidebar.bio_library')}</NavItem>
                <NavItem to="/learn" icon={BookOpen} isSidebarOpen={isSidebarOpen}>{t('sidebar.active_training')}</NavItem>
              </NavGroup>
            </nav>

            <div className="mt-8 pt-8 border-t border-slate-100 space-y-6">
              {user && isSidebarOpen && (
                <div className="bg-[#F1F8F1] rounded-[2.5rem] p-5 border border-[#C8E6C9] shadow-sm relative overflow-hidden group animate-in zoom-in-95 duration-300">
                  <div className="absolute inset-0 bg-[#2d6a4f]/5 opacity-10" />
                  <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className="w-12 h-12 bg-[#F3E5F5] text-[#7B1FA2] rounded-2xl flex items-center justify-center border border-[#D1C4E9] shadow-sm">
                      <Award size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#2d6a4f] font-black uppercase tracking-widest">Mastery Status</p>
                      <p className="text-xl font-black text-slate-900 outfit leading-none">{user.points} <span className="text-[10px] text-[#2d6a4f]">XP</span></p>
                    </div>
                  </div>
                  <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#C8E6C9] p-0.5">
                    <div className="bg-gradient-to-r from-[#C8E6C9] to-[#D1C4E9] h-full rounded-full transition-all duration-1000 shadow-sm" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              )}

              <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-3 px-6 py-4 text-slate-400 hover:text-[#D32F2F] hover:bg-rose-50 rounded-xl transition-all font-black text-[10px] tracking-[0.3em] uppercase border border-transparent hover:border-rose-100 ${!isSidebarOpen ? 'justify-center p-4' : ''}`}
              >
                <LogOut size={16} /> {isSidebarOpen && t('header.sign_out')}
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Drawer Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-[60] w-72 transform transition-transform duration-300 ease-in-out md:hidden flex-shrink-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6 h-full flex flex-col overflow-y-auto custom-scrollbar bg-white border-r border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 border border-green-500/20 rounded-xl flex items-center justify-center">
                  <Leaf className="text-green-600" size={20} />
                </div>
                <span className="font-black text-xl text-slate-900 outfit tracking-tighter uppercase italic">AgroPlay</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <nav className="space-y-6 flex-1">
              <NavItem to="/" icon={LayoutDashboard}>{t('sidebar.dashboard')}</NavItem>
              <NavItem to="/diagnosis" icon={Scan}>{t('sidebar.neural_diagnosis')}</NavItem>
              <NavItem to="/learn" icon={BookOpen}>{t('sidebar.active_training')}</NavItem>
              <NavItem to="/marketplace" icon={ShoppingCart}>{t('sidebar.marketplace')}</NavItem>
            </nav>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0 relative">
          <header className="flex bg-white/70 backdrop-blur-xl border-b border-[#E0E5E2] px-4 md:px-10 py-5 items-center justify-between z-50 sticky top-0">
            <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
            <div className="relative z-10 flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="p-2 bg-[#F1F8F1] text-[#2d6a4f] hover:bg-[#C8E6C9] hover:text-[#1b4332] rounded-xl transition-all border border-[#C8E6C9]"
              >
                <Menu size={20} />
              </button>
              <div className="hidden sm:block">
                <h1 className="text-base md:text-2xl font-black text-[#2d6a4f] outfit tracking-tighter uppercase italic">Node: {user?.name?.split(' ')[0] ?? 'User'}</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-[#2d6a4f] rounded-full animate-pulse shadow-[0_0_8px_#2d6a4f]" />
                  <p className="text-[8px] font-bold text-[#1b4332] uppercase tracking-widest leading-none">Uplink Active</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-8 relative z-10">
              <div className="relative group hidden lg:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2d6a4f] transition-colors" size={14} />
                <input
                  type="text"
                  placeholder={t('header.search_placeholder')}
                  className="pl-11 pr-4 py-3 bg-[#F1F8F1] border border-[#C8E6C9] rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/10 w-48 xl:w-72 shadow-sm placeholder:opacity-50"
                />
              </div>
              <LanguageSelector />
              <button className="p-2 sm:p-3 text-slate-400 hover:bg-[#F3E5F5] hover:text-[#7B1FA2] rounded-2xl relative transition-all border border-transparent hover:border-[#D1C4E9]">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[#2d6a4f] rounded-full border-2 border-white shadow-sm" />
              </button>
              <Link to="/profile" className="p-1 bg-white border-2 border-[#E0E5E2] rounded-2xl shadow-sm hover:border-[#C8E6C9] transition-all flex items-center px-1 group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#F9FBFA] overflow-hidden flex items-center justify-center">
                  {user?.avatar ? <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" /> : <UserCircle className="text-slate-300" size={24} />}
                </div>
              </Link>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-10 lg:p-16 relative bg-white">
            <div className="absolute inset-0 grid-bg opacity-[0.03] pointer-events-none" />

            <div className="max-w-[1400px] mx-auto relative z-10">
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
