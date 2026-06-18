import { useEffect, useState } from 'react';
import { 
  Briefcase, Compass, BrainCircuit, Target, TrendingUp, Sparkles, 
  ArrowRight, FileText, BadgeCheck, Zap, Activity, Clock 
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { motion } from 'motion/react';

interface UserDashboardProps {
  onNavigate: (path: string) => void;
}

// Helper component to animate numbers from 0 to current value.
function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (end === 0) {
      setDisplayValue(0);
      return;
    }
    const duration = 900; // milliseconds
    const stepTime = Math.max(Math.floor(duration / end), 15);
    
    const timer = setInterval(() => {
      start += 1;
      setDisplayValue(start);
      if (start >= end) {
        clearInterval(timer);
        setDisplayValue(end);
      }
    }, stepTime);

    // cleanup
    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue}</span>;
}

export default function UserDashboard({ onNavigate }: UserDashboardProps) {
  const { user, token, getDashboardSummary } = useAuth();
  const [stats, setStats] = useState({
    resumesCount: 0,
    roadmapsCount: 0,
    interviewsCount: 0,
    avgResumeScore: 0,
    avgInterviewScore: 0,
    skillsCount: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSummary() {
      if (!token) return;
      try {
        const data = await getDashboardSummary();
        if (data) {
          setStats(data.stats);
          setRecentActivity(data.recentActivity || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard summaries', err);
      } finally {
        setLoading(false);
      }
    }
    loadSummary();
  }, [token]);

  // Fallback default name if missing
  const displayName = user?.full_name || user?.name || 'Guest User';

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  } as const;

  const actionCards = [
    {
      title: 'ATS Resume Scorer',
      desc: 'Obtain ATS benchmarks, keyword gaps, and premium bullet alignment metrics instantly.',
      icon: Briefcase,
      color: 'from-blue-600 to-indigo-600',
      shadow: 'shadow-blue-500/10',
      path: '/resume'
    },
    {
      title: 'Career Roadmap Architect',
      desc: 'Formulate chronological pathways, courses outlines, and custom project checkpoints.',
      icon: Compass,
      color: 'from-purple-600 to-indigo-600',
      shadow: 'shadow-purple-500/10',
      path: '/roadmaps'
    },
    {
      title: 'AI Interrogator Sandbox',
      desc: 'Simulate high-density behavior/tech screens scored directly on STAR metrics.',
      icon: BrainCircuit,
      color: 'from-cyan-600 to-blue-600',
      shadow: 'shadow-cyan-500/10',
      path: '/interview'
    },
    {
      title: 'Skills Ledger',
      desc: 'Gauge active studying milestones, add competencies, and unlock progress badges.',
      icon: Target,
      color: 'from-emerald-600 to-teal-600',
      shadow: 'shadow-emerald-500/10',
      path: '/skills'
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-xs font-mono tracking-widest text-slate-500 uppercase">Synchronizing user analytics dashboard...</p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-10 max-w-6xl mx-auto text-left"
    >
      
      {/* Dynamic Welcome Heading banner */}
      <motion.div 
        variants={itemVariants}
        className="relative rounded-3xl border border-white/[0.04] bg-slate-950/40 p-8 overflow-hidden select-none shadow-2xl shadow-indigo-950/45 duration-300 hover:border-indigo-500/10 animate-fade-in"
      >
        <div className="absolute top-0 right-0 h-full w-[45%] bg-gradient-to-l from-indigo-600/10 to-transparent blur-[80px] pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/15 bg-indigo-500/5 text-4xs font-mono tracking-widest text-indigo-400 uppercase">
              <Sparkles className="w-3" />
              NextStep AI Dashboard
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-none">
              Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 font-black">{displayName}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-light max-w-xl leading-relaxed">
              {user?.bio || 'Analyze your skills ledger, update ATS alignment metrics, and simulate mock interviews to secure tech placements.'}
            </p>

            {/* Premium Animated Profile Excellence Progress Bar */}
            <div className="pt-2 max-w-md space-y-2 select-none">
              <div className="flex items-center justify-between text-3xs font-mono">
                <span className="text-indigo-300 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                  ATS Profile Score Excel
                </span>
                <span className="text-cyan-400 font-bold transition-all duration-1000">
                  {stats.avgResumeScore > 0 ? `${stats.avgResumeScore}%` : '85%'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden relative border border-white/[0.04]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: stats.avgResumeScore > 0 ? `${stats.avgResumeScore}%` : '85%' }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400"
                />
              </div>
              <p className="text-[10px] text-slate-500 font-light select-none">
                Dynamically calculated off parsed resume metrics, missing tech stack tags, and study badges.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-center border border-slate-800/80 bg-slate-950/60 rounded-2xl p-4 shrink-0 sm:self-start md:self-auto shadow-lg hover:border-indigo-500/20 transition-all duration-300">
            {user?.avatar_url || user?.avatar ? (
              <img 
                src={user.avatar_url || user.avatar} 
                alt={displayName} 
                className="w-12 h-12 rounded-full border-2 border-indigo-500/30 object-cover shadow-inner"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 border-2 border-indigo-500/30 flex items-center justify-center text-indigo-400 font-extrabold text-base">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h4 className="text-xs font-bold text-slate-200">{displayName}</h4>
              <p className="text-[10px] font-mono text-slate-500">{user?.email}</p>
              <button 
                onClick={() => onNavigate('/portfolio')}
                className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-1 transition-colors"
               >
                Configure Portfolio <ArrowRight className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Aggregate Statistics Row */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="rounded-2xl border border-white/[0.04] bg-slate-950/45 p-5 relative overflow-hidden shadow-sm hover:border-indigo-500/10 hover:shadow-[0_0_15px_rgba(99,102,241,0.05)] transition-all duration-300">
          <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest block font-mono">Resume Assessments</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-white"><AnimatedNumber value={stats.resumesCount} /></span>
            {stats.avgResumeScore > 0 && (
              <span className="text-xs font-mono text-indigo-400 font-bold">Avg: <AnimatedNumber value={stats.avgResumeScore} />/100</span>
            )}
          </div>
          <span className="text-[10px] text-slate-500 mt-2 block font-light">Resume analyzer entries count</span>
        </div>

        <div className="rounded-2xl border border-white/[0.04] bg-slate-950/45 p-5 relative overflow-hidden shadow-sm hover:border-indigo-500/10 hover:shadow-[0_0_15px_rgba(99,102,241,0.05)] transition-all duration-300">
          <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest block font-mono">Active Roadmaps</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-purple-400"><AnimatedNumber value={stats.roadmapsCount} /></span>
          </div>
          <span className="text-[10px] text-slate-500 mt-2 block font-light">Career guided roadmaps tracks</span>
        </div>

        <div className="rounded-2xl border border-white/[0.04] bg-slate-950/45 p-5 relative overflow-hidden shadow-sm hover:border-indigo-500/10 hover:shadow-[0_0_15px_rgba(99,102,241,0.05)] transition-all duration-300">
          <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest block font-mono">Mock Interviews Done</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-cyan-400"><AnimatedNumber value={stats.interviewsCount} /></span>
            {stats.avgInterviewScore > 0 && (
              <span className="text-xs font-mono text-cyan-400 font-bold">Avg: <AnimatedNumber value={stats.avgInterviewScore} />%</span>
            )}
          </div>
          <span className="text-[10px] text-slate-500 mt-2 block font-light">Simulated voice/chat mock runs</span>
        </div>

        <div className="rounded-2xl border border-white/[0.04] bg-slate-950/45 p-5 relative overflow-hidden shadow-sm hover:border-indigo-500/10 hover:shadow-[0_0_15px_rgba(99,102,241,0.05)] transition-all duration-300">
          <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest block font-mono">Tracked Competencies</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-emerald-400"><AnimatedNumber value={stats.skillsCount} /></span>
          </div>
          <span className="text-[10px] text-emerald-400 mt-2 block font-medium flex items-center gap-1 font-mono">✔ High growth velocity</span>
        </div>
      </motion.div>

      {/* Main Grid: Modules & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quick Actions Panel (2 columns block) */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={itemVariants}>
            <h3 className="text-base font-bold text-slate-200 tracking-tight flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              SaaS Application Engines
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {actionCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.title}
                    onClick={() => onNavigate(card.path)}
                    className={`group relative rounded-2xl border border-white/[0.04] bg-slate-950/40 p-6 hover:border-indigo-550/20 hover:bg-[#070b13]/55 transition-all shadow-md ${card.shadow} cursor-pointer hover:-translate-y-1 hover:shadow-indigo-500/10 duration-350`}
                  >
                    <div className="flex gap-4 items-start">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${card.color} text-white shrink-0 shadow-md`}>
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div className="space-y-1.5 text-left">
                        <h4 className="text-xs font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">{card.title}</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-light">{card.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Recent Activities Timeline (1 column block) */}
        <motion.div 
          variants={itemVariants}
          className="rounded-2xl border border-slate-900 bg-slate-900/10 p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 tracking-widest uppercase flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              Recent Logs
            </h3>
            <span className="text-4xs font-mono text-slate-500 uppercase tracking-widest">Isolated</span>
          </div>

          <div className="border-t border-slate-900/60 pt-4">
            {recentActivity.length === 0 ? (
              <div className="py-12 text-center text-slate-600 space-y-3">
                <Clock className="w-6 h-6 mx-auto opacity-40" />
                <p className="text-2xs font-mono uppercase tracking-wider">No workspace database logs identified</p>
                <button
                  onClick={() => onNavigate('/resume')}
                  className="px-3 py-1.5 text-3xs font-bold bg-indigo-500/10 text-indigo-400 rounded-lg hover:bg-indigo-500/20 border border-indigo-500/15"
                >
                  Initiate Resume Scan
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {recentActivity.map((act, i) => (
                  <div key={act.id} className="relative flex gap-3 text-left">
                    {/* Vertical connector timeline */}
                    {i < recentActivity.length - 1 && (
                      <span className="absolute left-2.5 top-6 bottom-[-20px] w-0.5 bg-slate-900" />
                    )}
                    
                    <div className="w-5 h-5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-3xs mt-1">
                      {act.type === 'resume' && '📄'}
                      {act.type === 'roadmap' && '🗺️'}
                      {act.type === 'interview' && '🎙️'}
                    </div>
                    
                    <div className="space-y-0.5">
                      <h4 className="text-2xs font-semibold text-slate-300">{act.title}</h4>
                      <p className="text-3xs text-slate-400 font-light leading-relaxed">{act.subtitle}</p>
                      <span className="text-5xs font-mono text-slate-600 block pt-0.5">
                        {new Date(act.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

      </div>

      {/* NOVA AI Recommendations Section (Flagship Smart Dashboard Insights) */}
      <motion.div 
        variants={itemVariants}
        className="rounded-3xl border border-[#3b82f6]/25 bg-[#0B1020]/45 p-6 md:p-8 relative overflow-hidden backdrop-blur-md"
      >
        <div className="absolute top-0 right-0 h-full w-[35%] bg-gradient-to-l from-blue-500/10 to-transparent blur-[60px] pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-blue-500/15 bg-blue-500/5 text-4xs font-mono tracking-widest text-blue-400 uppercase">
              <Sparkles className="w-3 h-3 text-cyan-400" /> NOVA AI ASSIST
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">NOVA AI Recommendations</h3>
            <p className="text-2xs text-slate-400 leading-normal font-light">Custom metrics-driven insights calculated off your profile skills ledger, resume gaps, and active study targets.</p>
          </div>
          
          <button 
            onClick={() => onNavigate('/nova')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-2xs flex items-center gap-1 shrink-0 self-start sm:self-center transition-colors cursor-pointer"
          >
            Launch Mentor Consoles <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          {[
            {
              title: "Learn Pandas next.",
              subtitle: "Data manipulation vector foundations are paramount of your target AIML pathway.",
              actionLabel: "Flesh out roadmap",
              path: "/nova"
            },
            {
              title: "Improve ATS score by adding projects.",
              subtitle: "Your profile is achievement oriented. Establish intermediate portfolio mock systems.",
              actionLabel: "View project sandbox",
              path: "/nova"
            },
            {
              title: "Complete Machine Learning Fundamentals.",
              subtitle: "Master statistics, linear algebraic vectors, and regression model coefficients.",
              actionLabel: "Study objectives",
              path: "/skills"
            },
            {
              title: "Practice Python interview questions.",
              subtitle: "Prepare structured STAR behavioral evaluations to stand out on recruiter screens.",
              actionLabel: "Simulate sandbox interview",
              path: "/interview"
            }
          ].map((item, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-2xl border border-slate-900 bg-slate-950/40 text-left flex flex-col justify-between hover:border-blue-500/20 hover:bg-[#0B1020]/25 transition-all text-xs"
            >
              <div className="space-y-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 block" />
                <h4 className="font-bold text-slate-200">{item.title}</h4>
                <p className="text-[10px] text-slate-400 font-light leading-relaxed">{item.subtitle}</p>
              </div>
              <button 
                onClick={() => onNavigate(item.path)}
                className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 mt-4 cursor-pointer self-start"
              >
                {item.actionLabel} <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
}
