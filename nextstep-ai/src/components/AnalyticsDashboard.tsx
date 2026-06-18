import { TrendingUp, FileText, BrainCircuit, Flag, Award, HelpCircle } from 'lucide-react';

export default function AnalyticsDashboard() {
  const skillGrowthData = [
    { skill: 'Python / ML Systems', initial: 40, current: 80, progress: 40 },
    { skill: 'React Architecture', initial: 50, current: 75, progress: 25 },
    { skill: 'Docker Containerization', initial: 10, current: 50, progress: 40 },
    { skill: 'Structured Query Optimization', initial: 30, current: 65, progress: 35 },
    { skill: 'OWASP Security Auditing', initial: 5, current: 30, progress: 25 }
  ];

  const resumeTrends = [
    { date: 'Initial (Week 1)', score: 62, atsMatch: 55, status: 'Outdated' },
    { date: 'Audit 1 (Week 4)', score: 74, atsMatch: 68, status: 'Improved' },
    { date: 'Audit 2 (Week 8)', score: 82, atsMatch: 79, status: 'Competitive' },
    { date: 'Latest (Week 12)', score: 88, atsMatch: 85, status: 'Elite Standard' }
  ];

  const interviewMetrics = {
    technicalAvg: 85,
    behavioralAvg: 82,
    hrAvg: 78,
    starAdherence: 90,
    overallReadiness: 81
  };

  const careerMilestones = [
    { title: 'Core Computer Science Foundations set', completed: true, date: 'Week 2' },
    { title: 'Completed Resume ATS audit optimization pass', completed: true, date: 'Week 4' },
    { title: 'Achieve 75%+ expertise rank in 2 technical cores', completed: true, date: 'Week 8' },
    { title: 'Publish 3 showcase-ready GitHub repositories', completed: true, date: 'Week 10' },
    { title: 'Maintain 80%+ Average on Mock Interview simulations', completed: false, date: 'Pending' },
    { title: 'Commit open source patches or land initial junior gap', completed: false, date: 'In Progress' }
  ];

  const readyRatio = (careerMilestones.filter(x => x.completed).length / careerMilestones.length) * 100;

  return (
    <div className="space-y-8 max-w-6xl mx-auto text-left">
      {/* Header sections */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Candidate Intelligence Console
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Analytics Dashboard</h2>
          <p className="text-slate-400 text-sm font-light mt-1">View comprehensive visualizations tracking technical growth, resume improvements, and interview simulation diagnostics.</p>
        </div>
      </div>

      {/* Main Stats Top line */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-slate-900 bg-slate-900/15 p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-blue-600/5 blur-xl pointer-events-none" />
          <span className="text-3xs font-bold text-slate-500 uppercase block select-none">Skill growth velocity</span>
          <span className="text-2xl sm:text-3xl font-black text-slate-100 block mt-1.5">+33%</span>
          <span className="text-[10px] text-blue-400 mt-2 block font-medium flex items-center gap-1">✔ Target course velocities satisfied</span>
        </div>

        <div className="rounded-2xl border border-slate-900 bg-slate-900/15 p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-cyan-600/5 blur-xl pointer-events-none" />
          <span className="text-3xs font-bold text-slate-500 uppercase block select-none">Resume Optimization Peak</span>
          <span className="text-2xl sm:text-3xl font-black text-cyan-400 block mt-1.5">88%</span>
          <span className="text-[10px] text-slate-500 mt-2 block font-medium">ATS Match Bracket: Excellent</span>
        </div>

        <div className="rounded-2xl border border-slate-900 bg-slate-900/15 p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-purple-600/5 blur-xl pointer-events-none" />
          <span className="text-3xs font-bold text-slate-500 uppercase block select-none">Simulation Mock Readiness</span>
          <span className="text-2xl sm:text-3xl font-black text-purple-400 block mt-1.5">81%</span>
          <span className="text-[10px] text-purple-400 mt-2 block font-medium">90% STAR structure adherence rating</span>
        </div>

        <div className="rounded-2xl border border-slate-900 bg-slate-900/15 p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-pink-600/5 blur-xl pointer-events-none" />
          <span className="text-3xs font-bold text-slate-500 uppercase block select-none">Target Roadmap completion</span>
          <span className="text-2xl sm:text-3xl font-black text-pink-400 block mt-1.5">{Math.round(readyRatio)}%</span>
          <span className="text-[10px] text-slate-500 mt-2 block font-medium">4 of 6 primary targets cleared</span>
        </div>
      </div>

      {/* Main Grid Content panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Skill progression visual chart (1st quadrant) */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 space-y-6">
          <div>
            <span className="text-3xs font-bold text-blue-400 uppercase tracking-widest block mb-1">STRENGTH ANALYTICS</span>
            <h4 className="text-xs sm:text-sm font-bold text-slate-200">Core Tech Skills Growth Over Time</h4>
            <p className="text-2xs text-slate-500 mt-1 font-light leading-relaxed">Visual compare logs of starting state capabilities versus current levels studied.</p>
          </div>

          <div className="space-y-4">
            {skillGrowthData.map((sk) => (
              <div key={sk.skill} className="space-y-1.5">
                <div className="flex justify-between items-baseline text-2xs">
                  <span className="font-semibold text-slate-300">{sk.skill}</span>
                  <span className="text-blue-400 font-bold">Initial: {sk.initial}% → Current: {sk.current}%</span>
                </div>
                {/* Horizontal dual-line representation */}
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-900 relative">
                  {/* Initial background progress bar */}
                  <div className="bg-slate-800 h-full absolute top-0 left-0 rounded-full" style={{ width: `${sk.initial}%` }} />
                  {/* Current overlay progress bar with gorgeous glow gradient */}
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full absolute top-0 left-0 rounded-full" style={{ width: `${sk.current}%`, opacity: 0.85 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resume improvement audit trend lines (2nd quadrant) */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 space-y-6">
          <div>
            <span className="text-3xs font-bold text-cyan-400 uppercase tracking-widest block mb-1">COMPLIANCE TRENDS</span>
            <h4 className="text-xs sm:text-sm font-bold text-slate-200">ATS Resume Rating Milestone Progressions</h4>
            <p className="text-2xs text-slate-500 mt-1 font-light leading-relaxed">Line-by-line metrics progress track through chronological audit rewrites.</p>
          </div>

          <div className="space-y-3">
            {resumeTrends.map((trend) => (
              <div key={trend.date} className="rounded-xl border border-slate-900 bg-slate-950/40 p-3 flex items-center justify-between">
                <div className="space-y-0.5">
                  <h5 className="text-xs font-bold text-slate-200">{trend.date}</h5>
                  <span className="text-[10px] uppercase font-bold text-slate-500">{trend.status}</span>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="text-right select-none">
                    <span className="text-[9px] text-slate-500 block uppercase font-mono font-bold leading-none">ATS Index</span>
                    <span className="text-xs font-black text-cyan-400 font-mono mt-1 block">{trend.atsMatch}%</span>
                  </div>
                  <div className="p-2 py-1 bg-slate-900 border border-slate-800 rounded text-center select-none min-w-[50px]">
                    <span className="text-[8px] text-slate-600 block uppercase leading-none font-bold">SCORE</span>
                    <span className="text-xs font-black text-slate-200 font-mono mt-0.5 block">{trend.score}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interview Simulation diagnostics metrics (3rd quadrant) */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 space-y-6">
          <div>
            <span className="text-3xs font-bold text-purple-400 uppercase tracking-widest block mb-1">MOCK DIAGNOSTICS</span>
            <h4 className="text-xs sm:text-sm font-bold text-slate-200">Interview Simulation Diagnostics</h4>
            <p className="text-2xs text-slate-500 mt-1 font-light leading-relaxed">Evaluation metrics scored across multiple question categories during trials.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Multi sector bar segments */}
            <div className="space-y-3 bg-slate-950/40 p-4.5 border border-slate-900 rounded-xl justify-center flex flex-col h-full min-h-[170px]">
              <div>
                <span className="text-[10px] font-bold text-slate-500 block">Technical Average Score:</span>
                <span className="text-lg font-black text-purple-300 font-mono">85%</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 block">Behavioral Average Score:</span>
                <span className="text-lg font-black text-purple-300 font-mono">82%</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 block">HR / Strategic Average Score:</span>
                <span className="text-lg font-black text-purple-300 font-mono">78%</span>
              </div>
            </div>

            {/* Overall readiness metric circle gauge */}
            <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-5 flex flex-col items-center justify-center text-center">
              <span className="text-3xs text-slate-500 uppercase font-bold tracking-wider mb-2.5">OVERALL INTERVIEW READINESS</span>
              
              <div className="relative flex items-center justify-center">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="3" className="text-slate-800" fill="transparent" />
                  <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="5" className="text-purple-500 animate-pulse" fill="transparent" strokeDasharray={2 * Math.PI * 32} strokeDashoffset={2 * Math.PI * 32 * (1 - interviewMetrics.overallReadiness / 100)} strokeLinecap="round" />
                </svg>
                <span className="absolute text-xl font-black text-slate-100">{interviewMetrics.overallReadiness}%</span>
              </div>
            </div>

          </div>
        </div>

        {/* Milestone checkpoints checklist metrics (4th quadrant) */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 space-y-6">
          <div>
            <span className="text-3xs font-bold text-pink-400 uppercase tracking-widest block mb-1">MILESTONE TRACKS</span>
            <h4 className="text-xs sm:text-sm font-bold text-slate-200">Roadmap Milestone Checkpoint Diagnostics</h4>
            <p className="text-2xs text-slate-500 mt-1 font-light leading-relaxed">Chronological achievements progress tracks set on your learning journey.</p>
          </div>

          <div className="space-y-2 max-h-[178px] overflow-y-auto scrollbar-thin">
            {careerMilestones.map((mil, idx) => (
              <div key={idx} className="flex gap-3.5 items-center p-2 rounded-lg border border-slate-900 bg-slate-950/30 text-2xs">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${mil.completed ? 'bg-emerald-400' : 'bg-slate-700 animate-pulse'}`} />
                <div className="flex-grow flex justify-between gap-2">
                  <span className={`font-semibold ${mil.completed ? 'text-slate-400 line-through' : 'text-slate-200'}`}>{mil.title}</span>
                  <span className="text-slate-500 font-mono shrink-0">{mil.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Dynamic Summary analysis checklist footer */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
        <div className="absolute top-0 right-0 h-full w-[35%] bg-blue-600/5 blur-[50px] pointer-events-none" />
        <div className="space-y-1 text-left relative z-10">
          <span className="text-3xs uppercase font-extrabold text-blue-400 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-blue-400" /> GEMINI SPECIAL CAREER RECOMMENDED AUDIT
          </span>
          <h4 className="text-xs sm:text-sm font-bold text-slate-200 mt-1">Excellent overall study pacing! Ready to launch application pipelines?</h4>
          <p className="text-2xs text-slate-400 leading-relaxed font-light mt-0.5">Your ATS matches is currently optimized inside the top 15% tier. Try doing two more technical mock sessions to clear standard HR readiness thresholds.</p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-900 flex gap-4 min-w-[170px] select-none text-left relative z-10 shrink-0">
          <div className="space-y-0.5">
            <span className="text-3xs text-slate-600 font-bold block uppercase leading-none">CANDIDATE BRACKET</span>
            <span className="text-xs font-black text-cyan-400 mt-0.5 block uppercase tracking-wide">Elite Tier Pass</span>
          </div>
        </div>
      </div>

    </div>
  );
}
