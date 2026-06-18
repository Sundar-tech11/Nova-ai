import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Compass, BrainCircuit, Target, Globe, TrendingUp, Sun, Moon, 
  Sparkles, Home, Menu, X, ArrowUpRight, LogOut, ChevronDown, 
  User as UserIcon, LayoutDashboard 
} from 'lucide-react';
import { useAuth } from './components/AuthContext';
import LandingPage from './components/LandingPage';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import RoadmapGenerator from './components/RoadmapGenerator';
import InterviewPrep from './components/InterviewPrep';
import SkillsTracker from './components/SkillsTracker';
import PortfolioBuilder from './components/PortfolioBuilder';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import AuthPages from './components/AuthPages';
import UserDashboard from './components/UserDashboard';
import NovaAI from './components/NovaAI';
import { NovaLogoFull, default as NovaLogoShowcase } from './components/NovaLogo';

export default function App() {
  const { isAuthenticated, user, token, logout, isLoading } = useAuth();
  
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isFloatingOpen, setIsFloatingOpen] = useState<boolean>(false);
  const [floatingMessages, setFloatingMessages] = useState<any[]>([
    { sender: 'nova', text: "👋 Hi, I'm NOVA, your AI Career Mentor. Ask me about resumes, projects, internships, careers, or skill development." }
  ]);
  const [floatingInput, setFloatingInput] = useState('');
  const [floatingTyping, setFloatingTyping] = useState(false);

  const handleSendFloating = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!floatingInput.trim()) return;
    const userText = floatingInput;
    
    // Structure the message history prior to adding the new user message
    const historyPayload = floatingMessages.slice(-10).map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    setFloatingMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setFloatingInput('');
    setFloatingTyping(true);

    try {
      const response = await fetch('/api/nova-mentor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          message: userText,
          history: historyPayload
        })
      });
      if (!response.ok) {
        throw new Error('Server returned non-ok status');
      }
      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        throw new Error('Invalid JSON response returned from sever');
      }
      setFloatingMessages(prev => [...prev, { sender: 'nova', text: data.reply || "Let's explore your target engineering roles together!" }]);
    } catch (err) {
      console.error(err);
      setFloatingMessages(prev => [...prev, { sender: 'nova', text: "Trouble connecting to active mentor servers. Visit the main NOVA AI dashboard for full structural support!" }]);
    } finally {
      setFloatingTyping(false);
    }
  };

  // Monitor browser back/forward location alterations
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (newPath: string) => {
    window.history.pushState({}, '', newPath);
    setCurrentPath(newPath);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route protection and automatic redirect guidelines
  useEffect(() => {
    if (isLoading) return;

    const protectedPaths = ['/dashboard', '/nova', '/resume', '/roadmaps', '/interview', '/skills', '/portfolio', '/analytics'];
    const authPaths = ['/login', '/signup', '/forgot-password'];

    if (!isAuthenticated) {
      if (currentPath !== '/' && !authPaths.includes(currentPath)) {
        navigateTo('/');
      }
    } else {
      if (currentPath === '/' || authPaths.includes(currentPath)) {
        navigateTo('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, currentPath]);

  // Synchronize CSS class modifiers for premium light/dark styling
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Dynamic Navigation Items list based on authentication state
  const publicNavItems = [
    { id: '/', label: 'Home Landing', icon: Home, path: '/' }
  ];

  const authenticatedNavItems = [
    { id: '/dashboard', label: 'My Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: '/nova', label: 'NOVA AI ✦', icon: Sparkles, path: '/nova' },
    { id: '/resume', label: 'Resume Analyzer', icon: Briefcase, path: '/resume' },
    { id: '/roadmaps', label: 'Roadmap Architect', icon: Compass, path: '/roadmaps' },
    { id: '/interview', label: 'AI Mock Interview', icon: BrainCircuit, path: '/interview' },
    { id: '/skills', label: 'Skills Tracker', icon: Target, path: '/skills' },
    { id: '/portfolio', label: 'Portfolio Builder', icon: Globe, path: '/portfolio' },
    { id: '/analytics', label: 'Analytics Console', icon: TrendingUp, path: '/analytics' }
  ];

  const navItems = isAuthenticated ? authenticatedNavItems : publicNavItems;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-10 h-10 border-4 border-indigo-500/35 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-xs font-mono tracking-widest text-slate-500 uppercase">Synchronizing security keys...</p>
        </div>
      );
    }

    switch (currentPath) {
      case '/':
        return (
          <LandingPage 
            onLaunchWorkspace={(path) => {
              const mappedPath = `/${path}`;
              navigateTo(mappedPath);
            }} 
          />
        );
      case '/login':
        return <AuthPages defaultMode="login" onSuccess={() => navigateTo('/dashboard')} />;
      case '/signup':
        return <AuthPages defaultMode="signup" onSuccess={() => navigateTo('/dashboard')} />;
      case '/forgot-password':
        return <AuthPages defaultMode="signup" onSuccess={() => navigateTo('/login')} />;
      case '/dashboard':
        return <UserDashboard onNavigate={navigateTo} />;
      case '/nova':
        return <NovaAI />;
      case '/resume':
        return <ResumeAnalyzer />;
      case '/roadmaps':
        return <RoadmapGenerator />;
      case '/interview':
        return <InterviewPrep />;
      case '/skills':
        return <SkillsTracker />;
      case '/portfolio':
        return <PortfolioBuilder />;
      case '/analytics':
        return <AnalyticsDashboard />;
      case '/brand':
        return <NovaLogoShowcase />;
      default:
        return (
          <LandingPage 
            onLaunchWorkspace={(path) => {
              const mappedPath = `/${path}`;
              navigateTo(mappedPath);
            }} 
          />
        );
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Top Navigation Bar Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.04] bg-[#030712]/70 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div 
            onClick={() => { navigateTo(isAuthenticated ? '/dashboard' : '/'); }}
            className="cursor-pointer group flex items-center"
          >
            <NovaLogoFull size={38} glow={true} />
          </div>

          {/* Desktop Navigation Link buttons */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.path)}
                  className={`px-3 py-2 rounded-lg font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                    isActive 
                      ? isDarkMode 
                        ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400' 
                        : 'bg-indigo-600 text-white shadow-sm'
                      : isDarkMode 
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50' 
                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Controls toggle section */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDarkMode 
                  ? 'border-slate-900 bg-slate-900 hover:bg-slate-800 text-yellow-500' 
                  : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
              }`}
              aria-label="Toggle visual theme mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Profile Dropdown or Authentic Enter CTA */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all hover:bg-slate-900/40 cursor-pointer select-none ${
                    isDarkMode ? 'border-slate-800 text-slate-200' : 'border-slate-200 text-slate-700'
                  }`}
                >
                  {user.avatar_url || user.avatar ? (
                    <img
                      src={user.avatar_url || user.avatar}
                      alt={user.full_name || user.name}
                      className="w-6 h-6 rounded-full border border-indigo-500/20 object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">
                      {(user.full_name || user.name || 'P').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden md:inline-block text-xs font-bold max-w-[100px] truncate">
                    {user.full_name || user.name || 'Candidate'}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsDropdownOpen(false)} />
                    <div className={`absolute right-0 mt-2 w-56 rounded-2xl border shadow-xl p-2.5 z-40 animate-in fade-in slide-in-from-top-2 duration-200 ${
                      isDarkMode 
                        ? 'border-slate-800 bg-slate-950 text-slate-100 shadow-black/85 shadow-2xl' 
                        : 'border-slate-200 bg-white text-slate-900 shadow-slate-200/45 shadow-2xl'
                    }`}>
                      <div className="px-3.5 py-2.5 border-b border-slate-900/10 dark:border-slate-900/40 space-y-0.5">
                        <span className="text-[9px] font-mono font-semibold tracking-wider text-slate-500 uppercase block select-none">
                          STUDENT PROFILE
                        </span>
                        <h4 className="text-xs font-extrabold truncate">
                          {user.full_name || user.name || 'Candidate Pro'}
                        </h4>
                        <p className="text-[10px] font-mono text-slate-400 truncate">
                          {user.email}
                        </p>
                      </div>

                      <div className="py-1.5 space-y-0.5">
                        <button
                          onClick={() => {
                            navigateTo('/dashboard');
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2 rounded-xl text-xs font-semibold text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                            isDarkMode ? 'hover:bg-slate-900' : 'hover:bg-slate-100'
                          }`}
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
                          My Dashboard
                        </button>
                        <button
                          onClick={() => {
                            navigateTo('/portfolio');
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2 rounded-xl text-xs font-semibold text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                            isDarkMode ? 'hover:bg-slate-900' : 'hover:bg-slate-100'
                          }`}
                        >
                          <UserIcon className="w-3.5 h-3.5 text-blue-400" />
                          My Portfolio Pro
                        </button>
                        <button
                          onClick={() => {
                            navigateTo('/brand');
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2 rounded-xl text-xs font-semibold text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                            isDarkMode ? 'hover:bg-slate-900' : 'hover:bg-slate-100'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                          Brand Assets
                        </button>
                      </div>

                      <div className="border-t border-slate-900/10 dark:border-slate-800/60 pt-1.5">
                        <button
                          onClick={async () => {
                            setIsDropdownOpen(false);
                            await logout();
                            navigateTo('/');
                          }}
                          className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-left flex items-center gap-2.5 text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Logout Platform
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateTo('/login')}
                  className={`hidden sm:inline-flex px-3.5 py-2 font-bold text-xs border rounded-xl hover:bg-slate-950 transition-colors cursor-pointer ${
                    isDarkMode ? 'border-slate-800 hover:bg-slate-900/50 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigateTo('/signup')}
                  className="px-3.5 py-2 font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-xl transition-all cursor-pointer"
                >
                  Join Pro
                </button>
              </div>
            )}

            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-200"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu Overlays */}
      {isMobileMenuOpen && (
        <div className={`lg:hidden fixed inset-0 z-40 top-[73px] transition-all border-b ${
          isDarkMode ? 'bg-slate-950/95 border-slate-900' : 'bg-slate-50/95 border-slate-200'
        }`}>
          <div className="p-4 space-y-2 select-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigateTo(item.path);
                  }}
                  className={`w-full px-4 py-3 rounded-xl font-bold text-xs text-left transition-all flex items-center gap-3.5 cursor-pointer ${
                    isActive
                      ? isDarkMode 
                        ? 'bg-indigo-500/15 text-indigo-400' 
                        : 'bg-indigo-600 text-white shadow-md'
                      : isDarkMode
                        ? 'text-slate-400 hover:bg-slate-900/40'
                        : 'text-slate-600 hover:bg-slate-200/40'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
            
            {!isAuthenticated && (
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-900/40 mt-4">
                <button
                  onClick={() => navigateTo('/login')}
                  className={`px-4 py-3 font-bold text-xs border rounded-xl text-center transition-colors cursor-pointer ${
                    isDarkMode ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-700'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigateTo('/signup')}
                  className="px-4 py-3 font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-center transition-colors cursor-pointer"
                >
                  Join Pro
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Core Body wrapper */}
      <main className="max-w-7xl mx-auto px-6 py-8 md:py-12 relative">
        <div className="absolute top-[5%] left-[25%] h-[20%] w-[35%] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />
        
        {/* Dynamic content rendering with key persistence */}
        <div className="relative z-10">
          {renderContent()}
        </div>
      </main>

      {/* Floating Career Mentor Assistant Button */}
      {isAuthenticated && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
          {/* animated chat drawer */}
          {isFloatingOpen && (
            <div className="w-[360px] h-[500px] rounded-2xl border border-white/10 bg-[#070b14]/90 shadow-[0_0_50px_-5px_rgba(99,102,241,0.25)] backdrop-blur-2xl flex flex-col overflow-hidden mb-3 animate-slide-up">
              {/* Header */}
              <div className="p-4 bg-slate-950/90 border-b border-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-7 h-7 rounded-lg bg-[#0c162e] border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-[11px] shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300 drop-shadow-[0_0_3px_rgba(6,182,212,0.6)]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-tight">NOVA AI Personal Mentor</h4>
                    <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1.5 font-medium select-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      LIVE INTELLIGENCE
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsFloatingOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Message Log */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin text-xs leading-relaxed bg-[#050810]/50">
                {floatingMessages.map((msg, i) => (
                  <div key={i} className={`flex gap-2 max-w-[88%] ${msg.sender === 'nova' ? 'mr-auto text-left' : 'ml-auto flex-row-reverse text-left'}`}>
                    <div className={`p-3.5 rounded-2xl border transition-all duration-300 shadow-sm ${
                      msg.sender === 'nova' 
                        ? 'bg-slate-900/50 border-[#1f2937]/80 text-[#e2e8f0]' 
                        : 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 border-none text-white'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {floatingTyping && (
                  <div className="flex gap-2 max-w-[70%] mr-auto text-left">
                    <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-400 text-2xs italic flex items-center gap-2 select-none">
                      <span className="flex space-x-1 items-center shrink-0">
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                      {/* Cycling animated thinking text */}
                      <span className="font-mono text-cyan-400">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Action Cards inside Assistant */}
              <div className="px-3.5 py-2.5 border-t border-slate-900/60 bg-slate-950/80 flex gap-2 overflow-x-auto scrollbar-none whitespace-nowrap">
                <button 
                  onClick={() => {
                    navigateTo('/nova');
                    setIsFloatingOpen(false);
                  }}
                  className="px-2.5 py-1.5 bg-[#090d16] border border-blue-500/10 hover:border-blue-500/30 text-[10px] font-bold text-slate-300 hover:text-white rounded-lg cursor-pointer transition-all flex items-center gap-1 hover:bg-slate-900"
                >
                  🚀 Recommend Projects
                </button>
                <button 
                  onClick={() => {
                    navigateTo('/resume');
                    setIsFloatingOpen(false);
                  }}
                  className="px-2.5 py-1.5 bg-[#090d16] border border-purple-500/10 hover:border-purple-500/30 text-[10px] font-bold text-slate-300 hover:text-white rounded-lg cursor-pointer transition-all flex items-center gap-1 hover:bg-slate-900"
                >
                  📄 Resume Review
                </button>
                <button 
                  onClick={() => {
                    navigateTo('/resume');
                    setIsFloatingOpen(false);
                  }}
                  className="px-2.5 py-1.5 bg-[#090d16] border border-cyan-500/10 hover:border-cyan-500/30 text-[10px] font-bold text-slate-300 hover:text-white rounded-lg cursor-pointer transition-all flex items-center gap-1 hover:bg-slate-900"
                >
                  🎯 ATS Optimization
                </button>
                <button 
                  onClick={() => {
                    navigateTo('/roadmaps');
                    setIsFloatingOpen(false);
                  }}
                  className="px-2.5 py-1.5 bg-[#090d16] border border-indigo-500/10 hover:border-indigo-500/30 text-[10px] font-bold text-slate-300 hover:text-white rounded-lg cursor-pointer transition-all flex items-center gap-1 hover:bg-slate-900"
                >
                  🛣 Career Roadmap
                </button>
                <button 
                  onClick={() => {
                    setFloatingInput('Explain key tips to prepare and land top software internships and roles.');
                  }}
                  className="px-2.5 py-1.5 bg-[#090d16] border border-emerald-500/10 hover:border-emerald-500/30 text-[10px] font-bold text-slate-300 hover:text-white rounded-lg cursor-pointer transition-all flex items-center gap-1 hover:bg-slate-900"
                >
                  💼 Internship Guidance
                </button>
              </div>

              {/* Form Input footer */}
              <form onSubmit={handleSendFloating} className="p-3 bg-slate-950/90 border-t border-slate-900 flex gap-2">
                <input
                  type="text"
                  value={floatingInput}
                  onChange={(e) => setFloatingInput(e.target.value)}
                  placeholder="Ask NOVA Career Mentor..."
                  className="flex-1 bg-[#090d16] border border-[#1f2937]/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/50 placeholder:text-slate-500 transition-colors"
                />
                <button 
                  type="submit"
                  className="px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold rounded-xl text-xs tracking-wider cursor-pointer shadow-md transition-all active:scale-[0.97]"
                >
                  SEND
                </button>
              </form>
            </div>
          )}

          {/* Trigger button with pulsing effects and glow */}
          <button
            onClick={() => setIsFloatingOpen(!isFloatingOpen)}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 hover:opacity-95 text-white cursor-pointer relative group flex items-center justify-center border border-white/10 shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all duration-300"
          >
            <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping pointer-events-none" />
            <Sparkles className="w-6 h-6 text-cyan-200 drop-shadow-[0_0_4px_rgba(157,23,77,0.4)] hover:scale-110 duration-200" />
          </button>
        </div>
      )}

    </div>
  );
}
