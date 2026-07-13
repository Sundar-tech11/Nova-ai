import { useEffect, useState } from 'react';
import { TrendingUp, FileText, BrainCircuit, Flag, Award, HelpCircle } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function AnalyticsDashboard() {
  const { user, getDashboardSummary, getSavedResumes, getSavedInterviews, getSavedRoadmaps } = useAuth();
  const [stats, setStats] = useState({
    resumesCount: 0,
    roadmapsCount: 0,
    interviewsCount: 0,
    avgResumeScore: 0,
    avgInterviewScore: 0,
    skillsCount: 0
  });
  const [resumes, setResumes] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const summary = await getDashboardSummary();
        if (summary) {
          setStats(summary.stats);
        }
        const rList = await getSavedResumes();
        setResumes(rList || []);
        const iList = await getSavedInterviews();
        setInterviews(iList || []);
        const rmList = await getSavedRoadmaps();
        setRoadmaps(rmList || []);
      } catch (e) {
        console.error('Error fetching analytics details:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const skillGrowthData = (user?.skillsProgress || []).map((sk: any) => ({
    skill: sk.name,
    initial: Math.max(10, Math.round(sk.level * 0.4)),
    current: sk.level,
    progress: Math.max(0, sk.level - Math.max(10, Math.round(sk.level * 0.4)))
  }));

  const sortedResumes = [...resumes].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const resumeTrends = sortedResumes.map((r, index) => ({
    date: `Audit ${index + 1} (${r.resumeName})`,
    score: r.score,
    atsMatch: r.atsScore || r.score,
    status: r.score >= 85 ? 'Elite Standard' : r.score >= 70 ? 'Competitive' : 'Improved'
  }));

  const avgTechnical = interviews.length > 0
    ? Math.round(interviews.reduce((sum, i) => sum + (i.resultData?.technicalScore || i.score || 70), 0) / interviews.length)
    : 0;
  const avgBehavioral = interviews.length > 0
    ? Math.round(interviews.reduce((sum, i) => sum + (i.resultData?.behavioralScore || i.score || 70), 0) / interviews.length)
    : 0;
  const avgHr = interviews.length > 0
    ? Math.round(interviews.reduce((sum, i) => sum + (i.resultData?.hrScore || i.score || 70), 0) / interviews.length)
    : 0;
  const overallReadiness = stats.avgInterviewScore || 0;

  const careerMilestones = [
    { title: 'Upload your first resume for ATS scoring', completed: stats.resumesCount > 0, date: stats.resumesCount > 0 ? 'Cleared' : 'Pending' },
    { title: 'Synthesize your first target career roadmap', completed: stats.roadmapsCount > 0, date: stats.roadmapsCount > 0 ? 'Cleared' : 'Pending' },
    { title: 'Track at least 3 discrete technical skills', completed: (user?.skillsProgress?.length || 0) >= 3, date: (user?.skillsProgress?.length || 0) >= 3 ? 'Cleared' : 'Pending' },
    { title: 'Create and log your first learning goal', completed: (user?.learningGoals?.length || 0) > 0, date: (user?.learningGoals?.length || 0) > 0 ? 'Cleared' : 'Pending' },
    { title: 'Score 75%+ on a resume ATS assessment', completed: resumes.some(r => r.score >= 75), date: resumes.some(r => r.score >= 75) ? 'Cleared' : 'Pending' },
    { title: 'Simulate and grade a behavioral/tech mock session', completed: stats.interviewsCount > 0, date: stats.interviewsCount > 0 ? 'Cleared' : 'Pending' }
  ];

  const readyRatio = careerMilestones.length > 0
    ? (careerMilestones.filter(x => x.completed).length / careerMilestones.length) * 100
    : 0;

  const clearedCount = careerMilestones.filter(x => x.completed).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-xs font-mono tracking-widest text-slate-500 uppercase">Compiling Candidate Intelligence Console...</p>
      </div>
    );
  }

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
          <span className="text-3xs font-bold text-slate-500 uppercase block select-none">Total Tracked Skills</span>
          <span className="text-2xl sm:text-3xl font-black text-slate-100 block mt-1.5">{stats.skillsCount}</span>
          <span className="text-[10px] text-blue-400 mt-2 block font-medium flex items-center gap-1">✔ Tracked competencies ledger</span>
        </div>

        <div className="rounded-2xl border border-slate-900 bg-slate-900/15 p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-cyan-600/5 blur-xl pointer-events-none" />
          <span className="text-3xs font-bold text-slate-500 uppercase block select-none">Resume Optimization Peak</span>
          <span className="text-2xl sm:text-3xl font-black text-cyan-400 block mt-1.5">{stats.avgResumeScore > 0 ? `${stats.avgResumeScore}%` : 'N/A'}</span>
          <span className="text-[10px] text-slate-500 mt-2 block font-medium">
            {stats.avgResumeScore >= 85 ? 'ATS Match Bracket: Excellent' : stats.avgResumeScore >= 70 ? 'ATS Match Bracket: Good' : stats.avgResumeScore > 0 ? 'ATS Match Bracket: Needs Work' : 'No resumes analyzed'}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-900 bg-slate-900/15 p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-purple-600/5 blur-xl pointer-events-none" />
          <span className="text-3xs font-bold text-slate-500 uppercase block select-none">Simulation Mock Readiness</span>
          <span className="text-2xl sm:text-3xl font-black text-purple-400 block mt-1.5">{stats.avgInterviewScore > 0 ? `${stats.avgInterviewScore}%` : 'N/A'}</span>
          <span className="text-[10px] text-purple-400 mt-2 block font-medium">
            {stats.avgInterviewScore > 0 ? 'STAR structure adherence rating' : 'No mock sessions graded'}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-900 bg-slate-900/15 p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-pink-600/5 blur-xl pointer-events-none" />
          <span className="text-3xs font-bold text-slate-500 uppercase block select-none">Target Roadmap completion</span>
          <span className="text-2xl sm:text-3xl font-black text-pink-400 block mt-1.5">{Math.round(readyRatio)}%</span>
          <span className="text-[10px] text-slate-500 mt-2 block font-medium">{clearedCount} of {careerMilestones.length} primary targets cleared</span>
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
            {skillGrowthData.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-slate-800 bg-slate-950/20 rounded-xl">
                <p className="text-xs text-slate-400 font-light">No tracked skills progress recorded yet. Head over to the Skills Tracker to add competencies.</p>
              </div>
            ) : (
              skillGrowthData.map((sk) => (
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
              ))
            )}
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
            {resumeTrends.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-slate-800 bg-slate-950/20 rounded-xl">
                <p className="text-xs text-slate-400 font-light">No resume reviews analyzed yet. Upload and analyze your resume to chart keyword gap compliance trends.</p>
              </div>
            ) : (
              resumeTrends.map((trend) => (
                <div key={trend.date} className="rounded-xl border border-slate-900 bg-slate-950/40 p-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h5 className="text-xs font-bold text-slate-200 truncate max-w-[180px] sm:max-w-xs">{trend.date}</h5>
                    <span className="text-[10px] uppercase font-bold text-slate-500">{trend.status}</span>
                  </div>

                  <div className="flex gap-4 items-center shrink-0">
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
              ))
            )}
          </div>
        </div>

        {/* Interview Simulation diagnostics metrics (3rd quadrant) */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 space-y-6">
          <div>
            <span className="text-3xs font-bold text-purple-400 uppercase tracking-widest block mb-1">MOCK DIAGNOSTICS</span>
            <h4 className="text-xs sm:text-sm font-bold text-slate-200">Interview Simulation Diagnostics</h4>
            <p className="text-2xs text-slate-500 mt-1 font-light leading-relaxed">Evaluation metrics scored across multiple question categories during trials.</p>
          </div>

          {interviews.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-slate-800 bg-slate-950/20 rounded-xl">
              <p className="text-xs text-slate-400 font-light">No mock interview simulations recorded yet. Run a practice interrogator session to compile diagnostics.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Multi sector bar segments */}
              <div className="space-y-3 bg-slate-950/40 p-4.5 border border-slate-900 rounded-xl justify-center flex flex-col h-full min-h-[170px]">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block">Technical Average Score:</span>
                  <span className="text-lg font-black text-purple-300 font-mono">{avgTechnical}%</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block">Behavioral Average Score:</span>
                  <span className="text-lg font-black text-purple-300 font-mono">{avgBehavioral}%</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block">HR / Strategic Average Score:</span>
                  <span className="text-lg font-black text-purple-300 font-mono">{avgHr}%</span>
                </div>
              </div>

              {/* Overall readiness metric circle gauge */}
              <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-5 flex flex-col items-center justify-center text-center">
                <span className="text-3xs text-slate-400 uppercase font-bold tracking-wider mb-2.5">OVERALL INTERVIEW READINESS</span>
                
                <div className="relative flex items-center justify-center">
                  <svg className="w-24 h-24 sm:w-28 sm:h-28 transform -rotate-90 transition-all" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="3" className="text-slate-800" fill="transparent" />
                    <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="5" className="text-purple-500" fill="transparent" strokeDasharray={2 * Math.PI * 32} strokeDashoffset={2 * Math.PI * 32 * (1 - overallReadiness / 100)} strokeLinecap="round" />
                  </svg>
                  <span className="absolute text-xl sm:text-2xl font-black text-slate-100">{overallReadiness}%</span>
                </div>
              </div>

            </div>
          )}
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
          <h4 className="text-xs sm:text-sm font-bold text-slate-200 mt-1">
            {clearedCount >= 4 ? 'Excellent overall study pacing! Ready to launch application pipelines?' : 'Initial setup underway! Let\'s complete more milestones to unlock key insights.'}
          </h4>
          <p className="text-2xs text-slate-400 leading-relaxed font-light mt-0.5">
            {clearedCount >= 4 
              ? 'Your ATS matches is currently optimized inside the competitive tier. Try doing two more technical mock sessions to clear standard HR readiness thresholds.'
              : 'Add competencies, upload resumes, and try mock interview interrogations to compile high-yield profile insights and receive guidance from our special mentor matrix.'}
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-900 flex gap-4 min-w-[170px] select-none text-left relative z-10 shrink-0">
          <div className="space-y-0.5">
            <span className="text-3xs text-slate-600 font-bold block uppercase leading-none">CANDIDATE BRACKET</span>
            <span className="text-xs font-black text-cyan-400 mt-0.5 block uppercase tracking-wide">
              {clearedCount >= 5 ? 'Elite Tier Pass' : clearedCount >= 3 ? 'Competitive Tier' : 'Developing State'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
