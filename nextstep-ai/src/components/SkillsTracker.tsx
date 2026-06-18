import { useState, useId, FormEvent, useEffect } from 'react';
import { Award, Target, Plus, Search, Calendar, ChevronRight } from 'lucide-react';
import { useAuth } from './AuthContext';

interface TechSkill {
  id: string;
  name: string;
  category: string;
  level: number; // 0 to 100 representing percentage progress
  hoursStudied: number;
}

interface LearningGoal {
  id: string;
  title: string;
  targetSkill: string;
  deadline: string;
  isCompleted: boolean;
}

interface ProgressWeek {
  name: string;
  hours: number;
}

export default function SkillsTracker() {
  const { user, updateProfile } = useAuth();

  const [skills, setSkills] = useState<TechSkill[]>([
    { id: '1', name: 'Python Systems & Scripting', category: 'AIML / Data', level: 80, hoursStudied: 45 },
    { id: '2', name: 'React SPA Client Architecture', category: 'Frontend', level: 75, hoursStudied: 38 },
    { id: '3', name: 'PyTorch Model Training', category: 'AIML / Data', level: 50, hoursStudied: 24 },
    { id: '4', name: 'Docker Isolated Containers', category: 'DevOps / Cloud', level: 35, hoursStudied: 12 },
    { id: '5', name: 'SQL Query & Performance Tuning', category: 'Backend', level: 65, hoursStudied: 28 },
    { id: '6', name: 'Web Security Auditing (OWASP)', category: 'Security', level: 20, hoursStudied: 6 }
  ]);

  const [goals, setGoals] = useState<LearningGoal[]>([
    { id: 'g1', title: 'Achieve Expert status on React architecture', targetSkill: 'React SPA Client Architecture', deadline: 'June 25', isCompleted: false },
    { id: 'g2', title: 'Complete first CNN PyTorch training pipeline', targetSkill: 'PyTorch Model Training', deadline: 'June 30', isCompleted: false },
    { id: 'g3', title: 'Deploy a containerized microservice behind Nginx', targetSkill: 'Docker Isolated Containers', deadline: 'July 10', isCompleted: false }
  ]);

  // Read from authenticated user on mount / user change
  useEffect(() => {
    if (user) {
      if (user.skillsProgress && user.skillsProgress.length > 0) {
        setSkills(user.skillsProgress);
      }
      if (user.learningGoals && user.learningGoals.length > 0) {
        setGoals(user.learningGoals);
      }
    }
  }, [user]);

  const syncSkills = async (updatedSkills: TechSkill[]) => {
    setSkills(updatedSkills);
    if (user) {
      await updateProfile({ skillsProgress: updatedSkills });
    }
  };

  const syncGoals = async (updatedGoals: LearningGoal[]) => {
    setGoals(updatedGoals);
    if (user) {
      await updateProfile({ learningGoals: updatedGoals });
    }
  };

  const [weeklyProgress] = useState<ProgressWeek[]>([
    { name: 'Mon', hours: 4 },
    { name: 'Tue', hours: 6 },
    { name: 'Wed', hours: 3 },
    { name: 'Thu', hours: 5 },
    { name: 'Fri', hours: 8 },
    { name: 'Sat', hours: 2 },
    { name: 'Sun', hours: 1 }
  ]);

  // Form input states
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Frontend');
  const [newSkillLevel, setNewSkillLevel] = useState(20);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalSkill, setNewGoalSkill] = useState('');
  const [newGoalDate, setNewGoalDate] = useState('');
  const [showGoalForm, setShowGoalForm] = useState(false);

  const searchId = useId();

  // Dynamic Badges based on active session stats
  const totalHours = skills.reduce((accum, cur) => accum + cur.hoursStudied, 0);
  const expertCount = skills.filter((sk) => sk.level >= 75).length;

  const badges = [
    { name: 'Code Cadet', desc: 'Log at least 15 technical study hours', condition: totalHours >= 15, current: `${Math.min(totalHours, 15)}/15 hrs`, icon: '🌱' },
    { name: 'SaaS Master', desc: 'Achieve 75%+ level on 2 tech skills', condition: expertCount >= 2, current: `${Math.min(expertCount, 2)}/2 skills`, icon: '🔬' },
    { name: 'Terminal Pioneer', desc: 'Log over 100 total hours studied', condition: totalHours >= 100, current: `${totalHours}/100 hrs`, icon: '⚡' },
    { name: 'Operational Polymath', desc: 'Track 6 or more discrete skills', condition: skills.length >= 6, current: `${skills.length}/6 competencies`, icon: '🎓' }
  ];

  const handleAddSkill = async (e: FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const added: TechSkill = {
      id: Math.random().toString(),
      name: newSkillName.trim(),
      category: newSkillCategory,
      level: Number(newSkillLevel),
      hoursStudied: Math.round(Number(newSkillLevel) * 0.5)
    };

    const nextSkills = [...skills, added];
    await syncSkills(nextSkills);
    setNewSkillName('');
    setShowAddForm(false);
  };

  const handleAddGoal = async (e: FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim() || !newGoalSkill) return;

    const added: LearningGoal = {
      id: Math.random().toString(),
      title: newGoalTitle.trim(),
      targetSkill: newGoalSkill,
      deadline: newGoalDate || 'Asap',
      isCompleted: false
    };

    const nextGoals = [...goals, added];
    await syncGoals(nextGoals);
    setNewGoalTitle('');
    setNewGoalSkill('');
    setNewGoalDate('');
    setShowGoalForm(false);
  };

  const handleStudySkill = async (id: string) => {
    const nextSkills = skills.map(sk => {
      if (sk.id === id) {
        const nextLevel = Math.min(sk.level + 5, 100);
        return {
          ...sk,
          level: nextLevel,
          hoursStudied: sk.hoursStudied + 2
        };
      }
      return sk;
    });
    await syncSkills(nextSkills);
  };

  const handleCompleteGoal = async (id: string) => {
    const nextGoals = goals.map(g => g.id === id ? { ...g, isCompleted: !g.isCompleted } : g);
    await syncGoals(nextGoals);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header sections */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Target className="w-4 h-4 text-indigo-400" />
            Candidate Competency Ledger
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Skills Tracker & Ledger</h2>
          <p className="text-slate-400 text-sm font-light mt-1">Review active competencies, check goals checklist, and watch certification status badges unlock in real-time.</p>
        </div>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 columns containing Skill list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center bg-slate-900/10 border border-slate-900 rounded-xl p-4">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Active Core Stack</span>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-2xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Tracked Skill
            </button>
          </div>

          {/* Form Overlay toggle */}
          {showAddForm && (
            <form onSubmit={handleAddSkill} className="bg-slate-900/30 border border-slate-800 p-5 rounded-xl space-y-4 animate-fade-in text-left">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Track a New Technical Core Cap</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label htmlFor={searchId} className="text-3xs font-bold text-slate-500 uppercase tracking-wider">Skill Name</label>
                  <input
                    id={searchId}
                    type="text"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="e.g. AWS Lambdas Serverless"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-3xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                  <select
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="Frontend">Frontend Code</option>
                    <option value="Backend">Backend / DB</option>
                    <option value="AIML / Data">AIML / Data Systems</option>
                    <option value="DevOps / Cloud">DevOps / Cloud Infrastructure</option>
                    <option value="Security">Security / Compliance</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-3xs font-bold text-slate-500 uppercase tracking-wider">Starting Progress ({newSkillLevel}%)</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(Number(e.target.value))}
                    className="w-full h-8 cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2 border-t border-slate-800/60">
                <button type="button" onClick={() => setShowAddForm(false)} className="px-3.5 py-1.5 border border-slate-800 text-slate-400 rounded-lg text-2xs cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-2xs cursor-pointer">Save Skill</button>
              </div>
            </form>
          )}

          {/* List of active skills with micro progress bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skills.map((sk) => (
              <div key={sk.id} className="rounded-xl border border-slate-900 bg-slate-900/15 p-5 space-y-4 hover:border-slate-850 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-3xs font-bold text-indigo-400 uppercase tracking-wider block">{sk.category}</span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-200 mt-0.5">{sk.name}</h4>
                  </div>
                  <span className="text-3xs font-bold font-mono bg-slate-950 text-slate-500 border border-slate-900 px-2 py-0.5 rounded">
                    {sk.hoursStudied} hrs
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-3xs font-bold">
                    <span className="text-slate-500">PRO LEVEL</span>
                    <span className="text-indigo-400">{sk.level}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-900">
                    <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full rounded-full" style={{ width: `${sk.level}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-900/65">
                  <span className="text-3xs text-slate-500 font-light">
                    {sk.level >= 80 ? '👑 Expert Stack' : sk.level >= 50 ? '⚙ Intermediate' : '🌱 Initiate'}
                  </span>
                  
                  <button
                    onClick={() => handleStudySkill(sk.id)}
                    className="text-3xs font-bold text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    Study +2 hrs <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Weekly study progression representation chart */}
          <div className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 space-y-6">
            <div>
              <span className="text-3xs font-bold text-blue-400 uppercase tracking-widest block mb-1">DASHBOARD METRICS</span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-200">Study progression metrics (Weekly Total: {totalHours}h)</h4>
            </div>

            {/* Micro column chart in SVG for full React-19 safety */}
            <div className="flex justify-between items-end gap-3.5 h-32 pt-4 px-2 select-none border-b border-l border-slate-900 pb-2">
              {weeklyProgress.map((w, index) => {
                const maxVal = Math.max(...weeklyProgress.map(x => x.hours));
                const barHeightPct = maxVal > 0 ? (w.hours / maxVal) * 100 : 10;
                return (
                  <div key={index} className="flex-grow flex flex-col items-center group relative cursor-pointer pt-6">
                    {/* Tooltip on Hover */}
                    <div className="absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-800 text-[9px] font-mono font-bold text-indigo-400 px-2 py-0.5 rounded -translate-y-4 pointer-events-none">
                      {w.hours} hrs
                    </div>
                    
                    {/* Glowing Column bar */}
                    <div 
                      style={{ height: `${barHeightPct}%` }}
                      className="w-full max-w-[24px] bg-gradient-to-t from-blue-500 via-indigo-500 to-purple-500 rounded-t-sm group-hover:from-cyan-400 group-hover:to-pink-500 transition-all shadow-[0_0_15px_rgba(168,85,247,0.15)] focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500 mt-2 font-mono">{w.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right column containing Goals & Badges list */}
        <div className="space-y-6">
          
          {/* Goals Tracker */}
          <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-2xl space-y-4 relative overflow-hidden">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2 select-none">
                <Target className="w-4 h-4 text-pink-400" /> Active Learning Goals
              </h4>
              <button
                onClick={() => setShowGoalForm(!showGoalForm)}
                className="text-3xs font-bold text-pink-400 hover:underline cursor-pointer"
              >
                {showGoalForm ? 'Cancel' : 'New Goal'}
              </button>
            </div>

            {showGoalForm && (
              <form onSubmit={handleAddGoal} className="bg-slate-950 border border-slate-900 p-4 rounded-xl space-y-3 font-light text-xs animate-fade-in text-left">
                <div className="space-y-1">
                  <label className="text-3xs font-bold text-slate-500 uppercase tracking-wider block">Goal Milestone Description</label>
                  <input
                    type="text"
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    placeholder="e.g. Finish docker pipeline audit"
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-3xs font-bold text-slate-500 uppercase tracking-wider block">Target Skill</label>
                  <select
                    value={newGoalSkill}
                    onChange={(e) => setNewGoalSkill(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    required
                  >
                    <option value="">Choose matching skill</option>
                    {skills.map(sk => (
                      <option key={sk.id} value={sk.name}>{sk.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-3xs font-bold text-slate-500 uppercase tracking-wider block">Target Deadline</label>
                  <input
                    type="text"
                    value={newGoalDate}
                    onChange={(e) => setNewGoalDate(e.target.value)}
                    placeholder="e.g. June 25"
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none"
                  />
                </div>
                <button type="submit" className="w-full py-1.5 bg-pink-600 hover:bg-pink-500 font-bold text-white rounded text-2xs cursor-pointer transition-colors">
                  Create Goal
                </button>
              </form>
            )}

            <div className="space-y-3 pt-2">
              {goals.map((g) => (
                <div 
                  key={g.id} 
                  onClick={() => handleCompleteGoal(g.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer select-none transition-all flex items-start gap-3 text-left ${
                    g.isCompleted 
                      ? 'border-emerald-500/20 bg-emerald-500/5 opacity-55' 
                      : 'border-slate-850 border-slate-800 bg-slate-950/40 hover:border-slate-750'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={g.isCompleted}
                    onChange={() => {}} // Controlled by outer div click handle
                    className="mt-1 cursor-pointer accent-emerald-500 shrink-0"
                  />
                  <div className="space-y-1">
                    <span className={`text-xs block font-semibold ${g.isCompleted ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                      {g.title}
                    </span>
                    <div className="flex gap-2 text-3xs text-slate-500">
                      <span className="font-mono">{g.targetSkill}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Calendar className="w-2.5 h-2.5" /> {g.deadline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gamified Achievement Badges section */}
          <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2 select-none">
              <Award className="w-4 h-4 text-purple-400" /> Career Milestones achievements
            </h4>
            
            <div className="space-y-3 pt-2">
              {badges.map((b) => (
                <div 
                  key={b.name} 
                  className={`p-3.5 rounded-xl border transition-all flex gap-3 text-left items-center ${
                    b.condition 
                      ? 'border-purple-500/20 bg-purple-500/5' 
                      : 'border-slate-900 bg-slate-950/20 opacity-35'
                  }`}
                >
                  <span className="text-3xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">{b.icon}</span>
                  <div className="space-y-0.5">
                    <div className="flex items-baseline justify-between select-none">
                      <h5 className="text-xs font-bold text-slate-200 leading-none">{b.name}</h5>
                      {b.condition ? (
                        <span className="text-[9px] font-bold text-emerald-400 tracking-wider">UNLOCKED</span>
                      ) : (
                        <span className="text-[9px] font-mono text-slate-500 leading-none">{b.current}</span>
                      )}
                    </div>
                    <p className="text-3xs text-slate-400 font-light leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
