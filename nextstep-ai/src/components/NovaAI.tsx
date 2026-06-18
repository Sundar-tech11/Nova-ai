import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Send, Bot, User as UserIcon, BookOpen, 
  Terminal, Award, Layers, Target, CheckSquare, Compass, 
  Briefcase, Linkedin, Github, FileText, Play, RotateCcw, 
  Check, ArrowRight, Zap, Info, ShieldAlert, BadgeHelp, HelpCircle
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

interface Message {
  id: string;
  sender: 'user' | 'nova';
  text: string;
  timestamp: Date;
}

const preprocessMarkdown = (text: string) => {
  if (!text) return '';
  return text.replace(/^[ \t]*•[ \t]*/gm, '- ');
};

const customComponents = {
  h1: ({ children }: any) => (
    <h1 className="text-sm font-bold text-white mt-4 mb-2 tracking-tight border-b border-slate-900/80 pb-1.5">{children}</h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="text-xs font-bold text-slate-100 mt-4 mb-2 tracking-tight border-b border-slate-900/55 pb-1">{children}</h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-xs font-bold text-blue-400 mt-2.5 mb-1">{children}</h3>
  ),
  p: ({ children }: any) => (
    <p className="text-slate-300 text-xs leading-relaxed mb-3 last:mb-0 font-normal">{children}</p>
  ),
  ul: ({ children }: any) => (
    <ul className="space-y-3.5 my-3.5 pl-0 flex flex-col">{children}</ul>
  ),
  ol: ({ children }: any) => (
    <ol className="space-y-3.5 my-3.5 pl-0 flex flex-col [counter-reset:ol-counter]">{children}</ol>
  ),
  li: ({ children, ordered, ...props }: any) => {
    return (
      <li className="list-none relative p-4 rounded-xl bg-slate-900/40 border border-slate-900/60 hover:border-slate-800 transition-all text-slate-300 text-xs flex flex-col gap-1 shadow-sm hover:shadow-md transition-all duration-300 [counter-increment:ol-counter]">
        <div className="flex gap-3 items-start select-text">
          {ordered ? (
            <span className="flex items-center justify-center shrink-0 w-5 h-5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[9px] font-bold select-none before:content-[counter(ol-counter)]" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-2 shadow-sm shadow-cyan-400" />
          )}
          <div className="flex-1 leading-relaxed text-slate-250 select-text">
            {children}
          </div>
        </div>
      </li>
    );
  },
  strong: ({ children }: any) => (
    <strong className="font-semibold text-cyan-400">{children}</strong>
  ),
  code: ({ className, children }: any) => {
    const isInline = !className;
    return isInline ? (
      <code className="bg-slate-950 text-emerald-400 px-1.5 py-0.5 rounded font-mono text-[10px] border border-slate-900">{children}</code>
    ) : (
      <code className="text-emerald-400 font-mono text-[10px] block overflow-x-auto scrollbar-thin py-1">{children}</code>
    );
  },
  pre: ({ children }: any) => (
    <pre className="bg-slate-950 border border-slate-900/80 rounded-xl p-3.5 my-3 overflow-x-auto text-left scrollbar-thin">{children}</pre>
  ),
  a: ({ children, href }: any) => (
    <a href={href} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 underline font-semibold transition-colors">{children}</a>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-blue-500 bg-blue-500/5 p-3 rounded-r-xl italic my-2.5 text-slate-300">{children}</blockquote>
  ),
};

export default function NovaAI() {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'nova',
      text: "👋 Hi, I'm NOVA, your AI Career Mentor. Ask me about resumes, projects, internships, careers, or skill development.",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingStep, setTypingStep] = useState(0);

  useEffect(() => {
    if (!isTyping) {
      setTypingStep(0);
      return;
    }
    const interval = setInterval(() => {
      setTypingStep(prev => (prev + 1) % 3);
    }, 1500);
    return () => clearInterval(interval);
  }, [isTyping]);

  const typingTexts = ["Analyzing...", "Thinking...", "Generating response..."];

  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isApiConnected, setIsApiConnected] = useState<boolean | null>(null);
  
  // Tabs: 'chat', 'roadmap', 'projects', 'coach', 'booster'
  const [activeTab, setActiveTab] = useState<'chat' | 'roadmap' | 'projects' | 'coach' | 'booster'>('chat');

  // Daily Study Coach State
  const [dailyTasks, setDailyTasks] = useState<{ id: string; text: string; completed: boolean }[]>([
    { id: 't1', text: 'Learn Python Functions & parameters', completed: false },
    { id: 't2', text: 'Complete 5 interactive coding exercises', completed: false },
    { id: 't3', text: 'Refactor one function to use modern formatting standards', completed: false }
  ]);
  const [weeklyGoal, setWeeklyGoal] = useState('Finish NumPy Fundamentals & study array manipulations');
  const [monthlyMilestone, setMonthlyMilestone] = useState('Complete portfolio grade machine learning model prediction app');
  const [customTaskInput, setCustomTaskInput] = useState('');

  // Roadmap Generator state
  const [careerGoalInput, setCareerGoalInput] = useState('AIML Engineer');
  const [currentSkillsInput, setCurrentSkillsInput] = useState(user?.skills?.join(', ') || 'Python, Git, HTML/CSS');
  const [completedCoursesInput, setCompletedCoursesInput] = useState('Introduction to Python programming');
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [roadmapOutput, setRoadmapOutput] = useState<any | null>(null);

  // Suggested Prompts
  const suggestedPrompts = [
    { label: 'Create an AIML roadmap', prompt: 'Create an AIML roadmap starting from Beginner level' },
    { label: 'What should I study next?', prompt: 'I know some Python. What should I study next to become a high-paying engineer?' },
    { label: 'Recommend projects', prompt: 'Recommend a list of software projects I can build to optimize my GitHub portfolio.' },
    { label: 'Improve my resume', prompt: 'What are the main principles of improving my resume ATS score for SaaS technology companies?' },
    { label: 'Prepare me for interviews', prompt: 'I have an interview coming up for a Software development position. Prepare me with typical questions.' }
  ];

  // Specific Internship Preparation checklists
  const bootstrapBooster = {
    resume: [
      { id: 'r1', text: 'Apply the Google XYZ Formula: Accomplished [X] as measured by [Y] by doing [Z]', checked: false },
      { id: 'r2', text: 'Ensure skills section holds keywords matching ATS job requirements', checked: false },
      { id: 'r3', text: 'Keep resume layout strict to single page with pure black text and white backgrounds', checked: false }
    ],
    linkedin: [
      { id: 'l1', text: 'Write a headline indicating target role and direct engineering value (e.g. "SaaS Developer | React & Node.js Developer")', checked: false },
      { id: 'l2', text: 'Add a professional headshot and set status to "Open to Work" for recruiter visibility', checked: false },
      { id: 'l3', text: 'Flesh out experience descriptions with active tool stacks and measurable outcomes', checked: false }
    ],
    github: [
      { id: 'g1', text: 'Create dynamic, content-rich README files for top 3 pinned repositories', checked: false },
      { id: 'g2', text: 'Maintain a green contribution grid to show daily passion and reliability', checked: false },
      { id: 'g3', text: 'Include animated GIF previews or host live deployment URLs for immediate inspection', checked: false }
    ],
    interviews: [
      { id: 'i1', text: 'Structure behavioral answers perfectly inside STAR (Situation, Task, Action, Result) model', checked: false },
      { id: 'i2', text: 'Practice explaining Time & Space complexity (Big-O) aloud for every code block', checked: false },
      { id: 'i3', text: 'Prepare 3 thoughtful questions to ask the interviewer regarding system scaling', checked: false }
    ]
  };

  const [boosterState, setBoosterState] = useState(bootstrapBooster);

  useEffect(() => {
    // Load daily coach tasks from storage if available
    const storedTasks = localStorage.getItem('nova_coach_tasks');
    if (storedTasks) {
      try {
        setDailyTasks(JSON.parse(storedTasks));
      } catch (e) {
        console.error(e);
      }
    }
    const storedWeekly = localStorage.getItem('nova_coach_weekly');
    if (storedWeekly) setWeeklyGoal(storedWeekly);
    
    const storedMonthly = localStorage.getItem('nova_coach_monthly');
    if (storedMonthly) setMonthlyMilestone(storedMonthly);

    const storedBooster = localStorage.getItem('nova_career_booster');
    if (storedBooster) {
      try {
        setBoosterState(JSON.parse(storedBooster));
      } catch (e) {}
    }

    // Probe Gemini API connection status safely
    fetch('/api/nova-mentor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'ping_silent_status', history: [] })
    })
    .then(res => {
      if (!res.ok) throw new Error('Query ping failed');
      return res.json();
    })
    .then(data => {
      if (data && data.isApiConnected !== undefined) {
        setIsApiConnected(data.isApiConnected);
      }
    })
    .catch(() => {
      setIsApiConnected(false);
    });
  }, []);

  const saveCoachState = (tasks: any) => {
    setDailyTasks(tasks);
    localStorage.setItem('nova_coach_tasks', JSON.stringify(tasks));
  };

  const saveBoosterState = (state: any) => {
    setBoosterState(state);
    localStorage.setItem('nova_career_booster', JSON.stringify(state));
  };

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/nova-mentor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-10).map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Server returned non-ok response status');
      }
      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error('Invalid JSON response format');
      }
      if (data && data.isApiConnected !== undefined) {
        setIsApiConnected(data.isApiConnected);
      }
      
      const novaMsg: Message = {
        id: Math.random().toString(),
        sender: 'nova',
        text: data.reply || "I encountered a minor syncing delay. Let's adjust our objectives and continue building your future!",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, novaMsg]);
    } catch (err) {
      console.error('Failed to communicate with NOVA AI:', err);
      const errMsg: Message = {
        id: Math.random().toString(),
        sender: 'nova',
        text: "I'm having a bit of trouble connecting to the neural matrix right now. Let's make sure our local systems are aligned. Here are dynamic goals we can pursue in the meantime!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    if (!careerGoalInput.trim()) return;
    setIsGeneratingRoadmap(true);
    setRoadmapOutput(null);

    try {
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          careerGoal: careerGoalInput,
          currentSkillLevel: 'Intermediate',
          additionalContext: `Detected skills: ${currentSkillsInput}. Completed courses: ${completedCoursesInput}. Analyzed via NOVA Flagship.`
        })
      });

      if (!response.ok) {
        throw new Error('Server returned non-ok response status');
      }
      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error('Invalid JSON response format');
      }
      setRoadmapOutput(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  const handleBrainstormProject = (projectName: string) => {
    setActiveTab('chat');
    handleSendMessage(`Suggest tech stack and build strategy for project: "${projectName}" which is at my level.`);
  };

  const optimizeStudyCoach = async () => {
    setIsTyping(true);
    setActiveTab('chat');
    setMessages(prev => [...prev, {
      id: Math.random().toString(),
      sender: 'user',
      text: 'Analyze my active daily tasks and optimize my study plan today.',
      timestamp: new Date()
    }]);

    try {
      const response = await fetch('/api/nova-mentor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          message: `Generate structured Daily Study tasks based on career goal: ${careerGoalInput}. Output exactly 3 fresh high-yield tasks to complete.`,
          history: []
        })
      });
      if (!response.ok) {
        throw new Error('Server returned non-ok response status');
      }
      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error('Invalid JSON response format');
      }
      if (data && data.isApiConnected !== undefined) {
        setIsApiConnected(data.isApiConnected);
      }
      
      const newTasks = [
        { id: 't-new1', text: 'Read through system documentation on APIs and caching metrics', completed: false },
        { id: 't-new2', text: 'Implement an end-to-end integration tests using mock parameters', completed: false },
        { id: 't-new3', text: 'Engage with AI mentor on algorithm designs', completed: false }
      ];
      setDailyTasks(newTasks);
      localStorage.setItem('nova_coach_tasks', JSON.stringify(newTasks));

      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender: 'nova',
        text: `⚡ Study list compiled successfully for target career goal of **${careerGoalInput}**! I have updated your Daily Tasks scorecard in the Study Coach panel. Here's a quick overview of why these were chosen: \n\n${data.reply || 'Engaging with modular interfaces and core database integrations provides optimal learning yield.'}`,
        timestamp: new Date()
      }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 select-none text-left p-1" style={{ contentVisibility: 'auto' }}>
      
      {/* Header Panel */}
      <div className="relative rounded-3xl border border-slate-900 bg-[#0B1020]/80 p-8 overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 h-full w-[40%] bg-gradient-to-l from-blue-500/10 to-transparent blur-[70px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-10 w-full bg-gradient-to-t from-cyan-500/5 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-[10px] font-mono tracking-widest text-blue-400 uppercase rounded-full">
                🧠 Flagship Career Engine
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-4xs font-mono text-slate-500 tracking-wider">Active state</span>
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
              NOVA AI <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
            </h1>
            <p className="text-sm font-light text-slate-400 italic max-w-xl">
              "Your Personal AI Career Mentor" — Custom engineered to optimize tech portfolios, ATS score cards, and learning timelines.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            {[
              { id: 'chat', label: 'Mentor Chat', icon: Bot },
              { id: 'roadmap', label: 'Roadmap Generator', icon: Compass },
              { id: 'projects', label: 'Project Recommender', icon: Award },
              { id: 'coach', label: 'Daily Coach', icon: Target },
              { id: 'booster', label: 'Career Ready checklist', icon: Play }
            ].map(tab => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all outline-none cursor-pointer ${
                    isSelected 
                      ? 'bg-blue-600 border border-blue-500 text-white font-bold shadow-lg shadow-blue-500/20' 
                      : 'bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Feature Screens */}
      <div className="grid grid-cols-1 gap-8">
        
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Suggested Prompts panel (1 Col) */}
            <div className="lg:col-span-1 space-y-6">
              <div className="rounded-2xl border border-slate-900 bg-slate-950/40 p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-bold text-slate-200">Suggested Prompts</h3>
                </div>
                <p className="text-2xs text-slate-500 font-light leading-relaxed">
                  Select common mentor triggers below to instruct NOVA AI to construct professional roadmaps or suggest core optimizations.
                </p>

                <div className="space-y-2.5">
                  {suggestedPrompts.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(p.prompt)}
                      className="w-full text-left p-3.5 rounded-xl bg-slate-900/30 hover:bg-[#0B1020]/95 border border-slate-900/80 hover:border-blue-500/30 text-slate-300 hover:text-white transition-all text-2xs font-medium cursor-pointer group flex items-start gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5 group-hover:text-cyan-400 transition-colors" />
                      <div>
                        <span className="block font-bold text-slate-200">{p.label}</span>
                        <span className="text-[10px] text-slate-500 block pt-0.5 font-light leading-normal line-clamp-1">{p.prompt}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Persona info callout */}
              <div className="rounded-2xl border border-slate-900/80 bg-gradient-to-tr from-indigo-500/5 to-cyan-500/5 p-5 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-cyan-400" />
                  Mentoring Persona
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                  NOVA AI leverages professional recruiter logic, analyzing student goals and resume gaps. Responses are highly encouraging, professional, structured, and motivational.
                </p>
              </div>
            </div>

            {/* Chat Box (2 Cols) */}
            <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-[#070b14]/55 backdrop-blur-2xl flex flex-col h-[620px] overflow-hidden shadow-2xl shadow-indigo-950/40 relative">
              
              {/* Box Top Panel */}
              <div className="p-4.5 border-b border-white/[0.06] flex items-center justify-between bg-[#04080f]/75 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="relative p-2 rounded-xl bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 shadow-md">
                    <Bot className="w-5 h-5 animate-pulse" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-450 border border-[#04080f] rounded-full animate-ping" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                      NOVA AI Career Assistant
                      <span className="text-[8px] bg-indigo-500/10 text-indigo-300 font-mono font-bold px-1.5 py-0.5 rounded border border-indigo-500/15">SaaS Pro</span>
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono tracking-wider">Online &bull; Powered by Gemini 2.5 Flash</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setMessages([
                    {
                      id: 'welcome-reset',
                      sender: 'nova',
                      text: "👋 Hi, I'm NOVA, your AI Career Mentor. Ask me about resumes, projects, internships, careers, or skill development.",
                      timestamp: new Date()
                    }
                  ])}
                  className="px-3 py-1.5 text-slate-400 hover:text-white transition-all rounded-lg hover:bg-white/5 border border-transparent hover:border-white/15 cursor-pointer text-2vs font-mono font-bold tracking-wide flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>

              {isApiConnected === false && (
                <div className="bg-rose-950/20 border-b border-rose-500/20 p-4 shrink-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-900/60">
                    <div className="flex items-center gap-2 text-rose-400 text-xs font-bold font-mono tracking-wider">
                      <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
                      <span>⚠️ GEMINI AI IS NOT CONNECTED</span>
                    </div>
                    <span className="text-[10px] text-slate-400 bg-slate-900/90 border border-slate-800/80 px-2 py-0.5 rounded font-medium select-none font-mono">
                      Current Mode: Offline Assistant
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-emerald-400/90 uppercase tracking-wider block">I can answer:</span>
                      <ul className="text-2xs text-slate-300 space-y-1">
                        <li className="flex items-center gap-1.5 leading-none"><span className="text-emerald-500 text-xs">✅</span> Resume Tips</li>
                        <li className="flex items-center gap-1.5 leading-none"><span className="text-emerald-500 text-xs">✅</span> Career Roadmaps</li>
                        <li className="flex items-center gap-1.5 leading-none"><span className="text-emerald-500 text-xs">✅</span> Interview Preparation</li>
                        <li className="flex items-center gap-1.5 leading-none"><span className="text-emerald-500 text-xs">✅</span> Basic Questions</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-sky-400/95 uppercase tracking-wider block">Connect Gemini API to unlock:</span>
                      <ul className="text-2xs text-slate-400 space-y-1">
                        <li className="flex items-center gap-1.5 leading-none"><span className="text-sky-500/70">🧠</span> Advanced AI Conversations</li>
                        <li className="flex items-center gap-1.5 leading-none"><span className="text-sky-500/70">🧠</span> Personalized Career Guidance</li>
                        <li className="flex items-center gap-1.5 leading-none"><span className="text-sky-500/70">🧠</span> Resume Analysis</li>
                        <li className="flex items-center gap-1.5 leading-none"><span className="text-sky-500/70">🧠</span> Project Recommendations</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages viewport */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4.5 scrollbar-thin scroll-smooth bg-slate-950/30">
                {messages.map((m) => {
                  const isNova = m.sender === 'nova';
                  return (
                    <div 
                      key={m.id}
                      className={`flex gap-3 max-w-[88%] text-left animate-slide-up ${isNova ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                    >
                      <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs border transition-all ${
                        isNova 
                          ? 'bg-indigo-600/15 border-indigo-500/20 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.15)]' 
                          : 'bg-slate-900 border-slate-800 text-purple-400 shadow-sm'
                      }`}>
                        {isNova ? <Bot className="w-4.5 h-4.5" /> : <UserIcon className="w-4.5 h-4.5" />}
                      </div>

                      <div className={`p-4 rounded-3xl leading-relaxed text-xs border transition-all ${
                        isNova 
                          ? 'bg-slate-900/50 border-[#1f2937]/80 text-[#e2e8f0] font-light shadow-sm' 
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 border-none text-white font-medium shadow-[0_4px_15px_-4px_rgba(99,102,241,0.4)]'
                      }`}>
                        <div className="select-text selection:bg-[#3b82f6]/35">
                          {isNova ? (
                            <div className="markdown-body">
                              <Markdown components={customComponents}>
                                {preprocessMarkdown(m.text)}
                              </Markdown>
                            </div>
                          ) : (
                            <div className="whitespace-pre-line font-medium leading-relaxed">
                              {m.text}
                            </div>
                          )}
                        </div>
                        <span className={`text-[8px] font-mono block text-right mt-2 uppercase ${isNova ? 'text-slate-500' : 'text-indigo-200'}`}>
                          {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex gap-3 max-w-[50%] mr-auto text-left animate-slide-up">
                    <div className="w-8 h-8 rounded-xl shrink-0 bg-indigo-600/15 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <Bot className="w-4.5 h-4.5" />
                    </div>
                    <div className="p-4 rounded-3xl bg-slate-900/50 border border-slate-800 text-cyan-400 text-xs font-mono font-bold flex items-center gap-2.5 shadow-sm">
                      <div className="flex space-x-1.5">
                        <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-cyan-400 select-none">{typingTexts[typingStep]}</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Interactive Quick Action Cards Panel */}
              <div className="px-5 py-3 border-t border-white/[0.04] bg-[#040810]/80 flex gap-2 overflow-x-auto scrollbar-none whitespace-nowrap scroll-smooth select-none">
                <button 
                  onClick={() => handleSendMessage('Recommend a list of custom portfolio-grade projects I can build to accelerate my profile.')}
                  className="px-3.5 py-2 bg-slate-950/60 border border-blue-500/10 hover:border-blue-500/35 text-[11px] font-bold text-slate-300 hover:text-white rounded-xl cursor-pointer transition-all flex items-center gap-1.5 hover:bg-slate-900"
                >
                  <span>🚀</span> Recommend Projects
                </button>
                <button 
                  onClick={() => handleSendMessage('What are the top elements of a stellar resume review for high-impact software positions?')}
                  className="px-3.5 py-2 bg-slate-950/60 border border-purple-500/10 hover:border-purple-500/35 text-[11px] font-bold text-slate-300 hover:text-white rounded-xl cursor-pointer transition-all flex items-center gap-1.5 hover:bg-slate-900"
                >
                  <span>📄</span> Resume Review
                </button>
                <button 
                  onClick={() => handleSendMessage('Explain how to optimize our tech stack matching to construct flawless ATS scores.')}
                  className="px-3.5 py-2 bg-slate-950/60 border border-cyan-500/10 hover:border-cyan-500/35 text-[11px] font-bold text-slate-300 hover:text-white rounded-xl cursor-pointer transition-all flex items-center gap-1.5 hover:bg-slate-900"
                >
                  <span>🎯</span> ATS Optimization
                </button>
                <button 
                  onClick={() => handleSendMessage('Generate an interactive master career roadmap to transition from zero to MLE/MLOps engineer.')}
                  className="px-3.5 py-2 bg-slate-950/60 border border-indigo-500/10 hover:border-indigo-500/35 text-[11px] font-bold text-slate-300 hover:text-white rounded-xl cursor-pointer transition-all flex items-center gap-1.5 hover:bg-slate-900"
                >
                  <span>🛣</span> Career Roadmap
                </button>
                <button 
                  onClick={() => handleSendMessage('Explain key principles of preparing, sourcing, applying, and landing top-tier tech internships.')}
                  className="px-3.5 py-2 bg-[#050810]/60 border border-emerald-500/10 hover:border-emerald-500/35 text-[11px] font-bold text-slate-300 hover:text-white rounded-xl cursor-pointer transition-all flex items-center gap-1.5 hover:bg-slate-900"
                >
                  <span>💼</span> Internship Guidance
                </button>
              </div>

              {/* Box Input footer bar */}
              <div className="p-4 border-t border-white/[0.04] bg-[#040810]/90">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Message NOVA Career Mentor..."
                    className="flex-1 bg-slate-950/80 border border-white/[0.06] rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-indigo-505/50 placeholder:text-slate-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold rounded-xl text-xs tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-[0.98]"
                  >
                    Send <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Control Form (1 Col) */}
            <div className="lg:col-span-1 rounded-2xl border border-slate-900 bg-slate-950/40 p-6 space-y-5">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-slate-200">Architect Learning Pathway</h3>
              </div>
              <p className="text-2xs text-slate-500 font-light leading-relaxed">
                Provide target profile roles, skill indicators, and logs to instruct NOVA AI on mapping chronological progress tracks.
              </p>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-3xs font-bold text-slate-400 uppercase tracking-wider block">Target Career Goal</label>
                  <input
                    type="text"
                    value={careerGoalInput}
                    onChange={(e) => setCareerGoalInput(e.target.value)}
                    placeholder="e.g. AIML Engineer, Full-Stack Developer"
                    className="w-full bg-[#0B1020] border border-slate-900 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-3xs font-bold text-slate-400 uppercase tracking-wider block">Active Core Skills</label>
                  <input
                    type="text"
                    value={currentSkillsInput}
                    onChange={(e) => setCurrentSkillsInput(e.target.value)}
                    placeholder="e.g. Python, Git, HTML/CSS"
                    className="w-full bg-[#0B1020] border border-slate-900 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-3xs font-bold text-slate-400 uppercase tracking-wider block">Completed Courses (Context)</label>
                  <input
                    type="text"
                    value={completedCoursesInput}
                    onChange={(e) => setCompletedCoursesInput(e.target.value)}
                    placeholder="e.g. Python Fundamentals"
                    className="w-full bg-[#0B1020] border border-slate-900 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/40"
                  />
                </div>

                <button
                  onClick={handleGenerateRoadmap}
                  disabled={isGeneratingRoadmap}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingRoadmap ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Mapping Pathways...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                      Synthesize Career Roadmap
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Output View (2 Cols) */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-900 bg-[#0B1020]/20 p-6 flex flex-col justify-between">
              {roadmapOutput ? (
                <div className="space-y-6">
                  <div className="border-b border-slate-900 pb-4">
                    <h2 className="text-base font-bold text-slate-100 uppercase tracking-tight flex items-center gap-2">
                      ⭐ Synthesized Roadmap for: {roadmapOutput.careerGoal}
                    </h2>
                    <p className="text-2xs text-slate-400 mt-1 leading-relaxed font-light">{roadmapOutput.overview}</p>
                  </div>

                  {/* Core skills list */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Primary Skill Vectors</span>
                    <div className="flex flex-wrap gap-2">
                      {roadmapOutput.requiredSkills?.map((sk: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 bg-slate-900/60 border border-slate-800 text-[10px] text-slate-300 rounded-md font-medium">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Chronological Phases</span>
                    <div className="relative space-y-4 pl-4 border-l border-slate-900">
                      {roadmapOutput.timeline?.map((phase: any, index: number) => (
                        <div key={index} className="relative space-y-1 text-left">
                          <span className="absolute left-[-21px] top-1.5 w-2 h-2 rounded-full bg-blue-500 border-2 border-slate-950" />
                          <div className="flex items-center gap-2">
                            <span className="text-2xs font-bold text-blue-400">{phase.phase}</span>
                            <span className="text-[10px] text-slate-500 font-mono">({phase.duration})</span>
                          </div>
                          <h4 className="text-2xs font-semibold text-slate-200">{phase.title}</h4>
                          <ul className="list-disc list-inside text-[11px] text-slate-400 font-light space-y-1 pl-1">
                            {phase.topics?.map((topic: string, i: number) => (
                              <li key={i}>{topic}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* recommended projects */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Suggested Career Projects</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {roadmapOutput.projects?.map((proj: any, i: number) => (
                        <div key={i} className="p-4 rounded-xl border border-slate-900 bg-slate-950/40 text-left space-y-1.5">
                          <div className="flex items-center justify-between">
                            <h4 className="text-2xs font-bold text-slate-200">{proj.title}</h4>
                            <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 text-[9px] rounded font-semibold border border-blue-500/15">{proj.difficulty}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-normal font-light">{proj.description}</p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {proj.techStack?.map((tag: string, idx: number) => (
                              <span key={idx} className="text-[8px] font-mono text-slate-500">{tag}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-24 text-center text-slate-600 space-y-4">
                  <Compass className="w-12 h-12 mx-auto/ inline text-slate-800 animate-spin-slow" />
                  <div className="max-w-md mx-auto space-y-1.5">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">No Active Roadmap Loaded</h3>
                    <p className="text-2xs text-slate-500 leading-relaxed font-light">
                      Flesh out the target career profile details in the sidebar and trigger the carrier roadmap generator to formulate a modern progression track.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-900 bg-slate-950/40 p-6 text-left space-y-2">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                <Award className="w-5 h-5 text-cyan-400" /> Project Sandbox Blueprint Recommender
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Secure top tier placements by establishing high-impact proof profile files. Pick from graded level specs, then brainstorm structure with NOVA directly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Beginner */}
              <div className="rounded-2xl border border-slate-900 bg-slate-950/20 p-5 space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <h4 className="text-xs font-bold text-emerald-400 block tracking-wider uppercase font-mono">🔘 Beginner tier</h4>
                  <span className="text-[10px] font-mono text-slate-500">Fast Build</span>
                </div>

                <div className="space-y-3.5">
                  {[
                    { title: 'Portfolio Website', desc: 'Sleek, responsive personal portfolio displaying active GitHub metrics and resume summaries.', tech: ['React', 'Tailwind', 'Framing'] },
                    { title: 'Student Grade Predictor', desc: 'Train simple linear regression equations to output estimations of terminal exam results.', tech: ['Python', 'SciKit-Learn', 'Pandas'] },
                    { title: 'To-Do App with Persistence', desc: 'Classic functional checklist leveraging local storage models and active filters.', tech: ['TypeScript', 'HTML/CSS'] }
                  ].map((p, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-900/30 border border-slate-900/80 hover:border-emerald-500/25 transition-all text-left space-y-2">
                      <h5 className="text-[11px] font-bold text-slate-200">{p.title}</h5>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-light">{p.desc}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {p.tech.map((t, i) => (
                          <span key={i} className="text-[8px] font-mono text-slate-500">{t}</span>
                        ))}
                      </div>
                      <button 
                        onClick={() => handleBrainstormProject(p.title)}
                        className="text-[9px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 mt-2 transition-colors cursor-pointer"
                      >
                        Brainstorm blueprint with NOVA <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Intermediate */}
              <div className="rounded-2xl border border-slate-900 bg-slate-950/20 p-5 space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <h4 className="text-xs font-bold text-blue-400 block tracking-wider uppercase font-mono">🔵 Intermediate tier</h4>
                  <span className="text-[10px] font-mono text-slate-500">1-2 Weeks</span>
                </div>

                <div className="space-y-3.5">
                  {[
                    { title: 'Movie Recommendation System', desc: 'Collaborative filtering model suggesting media targets using user rating vectors.', tech: ['Python', 'Pandas', 'Flask API'] },
                    { title: 'Resume Analyzer Parser', desc: 'Scan PDFs to parse structure, evaluating matching keywords against job specs.', tech: ['Node.js', 'Express', 'Gemini SDK'] },
                    { title: 'Real-time Chat with Room Locks', desc: 'Secure collaborative chat room interface utilizing instant data streaming socket layers.', tech: ['React', 'WebSockets', 'Tailwind'] }
                  ].map((p, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-900/30 border border-slate-900/80 hover:border-blue-500/25 transition-all text-left space-y-2">
                      <h5 className="text-[11px] font-bold text-slate-200">{p.title}</h5>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-light">{p.desc}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {p.tech.map((t, i) => (
                          <span key={i} className="text-[8px] font-mono text-slate-500">{t}</span>
                        ))}
                      </div>
                      <button 
                        onClick={() => handleBrainstormProject(p.title)}
                        className="text-[9px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-2 transition-colors cursor-pointer"
                      >
                        Brainstorm blueprint with NOVA <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advanced */}
              <div className="rounded-2xl border border-slate-900 bg-slate-950/20 p-5 space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <h4 className="text-xs font-bold text-purple-400 block tracking-wider uppercase font-mono">🟣 Advanced tier</h4>
                  <span className="text-[10px] font-mono text-slate-500">Full Scale</span>
                </div>

                <div className="space-y-3.5">
                  {[
                    { title: 'AI Interview Coach with Feedback', desc: 'High density audio-visual behavioral mentor scoring STAR performance criteria.', tech: ['React', 'Express', 'Gemini Live API'] },
                    { title: 'Career Mentor Platform Engine', desc: 'Fully featured multi-tenant dashboard rendering roadmaps and analytics dashboards.', tech: ['TypeScript', 'Firestore', 'Vite'] },
                    { title: 'LLM Document Agent with RAG', desc: 'Retrieval Augmented Generation agent loading vectors to answer structured questions.', tech: ['FastAPI', 'ChromaDB', 'Gemini model'] }
                  ].map((p, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-900/30 border border-slate-900/80 hover:border-purple-500/25 transition-all text-left space-y-2">
                      <h5 className="text-[11px] font-bold text-slate-200">{p.title}</h5>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-light">{p.desc}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {p.tech.map((t, i) => (
                          <span key={i} className="text-[8px] font-mono text-slate-500">{t}</span>
                        ))}
                      </div>
                      <button 
                        onClick={() => handleBrainstormProject(p.title)}
                        className="text-[9px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 mt-2 transition-colors cursor-pointer"
                      >
                        Brainstorm blueprint with NOVA <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'coach' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Daily state Checklist (2 Cols) */}
            <div className="lg:col-span-2 rounded-2xl border border-[#3b82f6]/20 bg-[#0B1020]/40 p-6 space-y-5 text-left">
              <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500 animate-pulse" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-200">Daily Study Objectives scorecard</h3>
                    <p className="text-[10px] text-slate-500 font-mono tracking-wide">Select completed milestones below to record active progress.</p>
                  </div>
                </div>
                
                <button
                  onClick={optimizeStudyCoach}
                  className="px-3 py-1.5 bg-blue-600/10 border border-blue-500/25 hover:bg-blue-600/20 text-blue-400 font-bold rounded-lg text-2xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Recalculate High-Yield Plan
                </button>
              </div>

              {/* Items */}
              <div className="space-y-2.5">
                {dailyTasks.map((task) => (
                  <div 
                    key={task.id}
                    onClick={() => {
                      const updated = dailyTasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t);
                      saveCoachState(updated);
                    }}
                    className={`flex items-center gap-3.5 p-4 rounded-xl border transition-all cursor-pointer ${
                      task.completed 
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-400line-through hover:bg-emerald-500/10' 
                        : 'bg-slate-900/30 border-slate-900/70 hover:bg-[#0B1020]/95 hover:border-slate-800'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                      task.completed 
                        ? 'border-emerald-500 bg-emerald-500 text-white' 
                        : 'border-slate-800 bg-slate-950/80 group-hover:border-slate-700'
                    }`}>
                      {task.completed && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                    </div>
                    <span className={`text-xs ${task.completed ? 'line-through text-slate-500 font-light' : 'text-slate-300'}`}>{task.text}</span>
                  </div>
                ))}
              </div>

              {/* Add task bar */}
              <div className="flex gap-2 pt-2 border-t border-slate-900/80">
                <input
                  type="text"
                  value={customTaskInput}
                  onChange={(e) => setCustomTaskInput(e.target.value)}
                  placeholder="Insert custom today study goal objective..."
                  className="flex-1 bg-slate-950/80 border border-slate-900 rounded-xl px-3 py-2 text-2xs text-white focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (!customTaskInput.trim()) return;
                    const next = [...dailyTasks, { id: Math.random().toString(), text: customTaskInput, completed: false }];
                    saveCoachState(next);
                    setCustomTaskInput('');
                  }}
                  className="px-3.5 py-2 bg-slate-900 border border-slate-850 hover:bg-slate-850 text-slate-200 hover:text-white rounded-xl text-3xs font-bold transition-all cursor-pointer"
                >
                  Append Objective
                </button>
              </div>
            </div>

            {/* Weekly benchmarks & monthly milestones (1 Col) */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Weekly */}
              <div className="rounded-2xl border border-slate-900 bg-slate-950/40 p-5 space-y-3.5 text-left">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400">
                    <Target className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-2xs font-bold uppercase tracking-wider text-slate-400">Weekly Target Focus</h4>
                    <span className="text-[9px] text-slate-500">Finish line goal</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
                  <p className="text-xs text-slate-200 leading-relaxed font-light">{weeklyGoal}</p>
                </div>

                <input
                  type="text"
                  placeholder="Modify Active Weekly Target..."
                  onChange={(e) => {
                    setWeeklyGoal(e.target.value);
                    localStorage.setItem('nova_coach_weekly', e.target.value);
                  }}
                  className="w-full bg-[#0B1020] border border-slate-900 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-300 focus:outline-none"
                />
              </div>

              {/* Monthly */}
              <div className="rounded-2xl border border-slate-900 bg-slate-950/40 p-5 space-y-3.5 text-left">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <Award className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-2xs font-bold uppercase tracking-wider text-slate-400">Monthly Milestones target</h4>
                    <span className="text-[9px] text-slate-500">Major career benchmark</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
                  <p className="text-xs text-slate-200 leading-relaxed font-light">{monthlyMilestone}</p>
                </div>

                <input
                  type="text"
                  placeholder="Modify Monthly Milestone..."
                  onChange={(e) => {
                    setMonthlyMilestone(e.target.value);
                    localStorage.setItem('nova_coach_monthly', e.target.value);
                  }}
                  className="w-full bg-[#0B1020] border border-slate-900 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-300 focus:outline-none"
                />
              </div>

            </div>

          </div>
        )}

        {activeTab === 'booster' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-900 bg-slate-950/40 p-6 text-left space-y-2">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                <CheckSquare className="w-5 h-5 text-indigo-400" /> Internship & Career Assistant Dashboard
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Follow these critical professional milestones configured by top-tier tech recruiters to prepare your credentials, portfolio and networks for high-paying SaaS roles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Box 1: Resume Building */}
              <div className="rounded-2xl border border-slate-900 bg-slate-950/20 p-5 text-left space-y-4">
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 border-b border-slate-900 pb-2">
                  <FileText className="w-4 h-4 text-blue-400" /> Resume ATS Construction Standard
                </h4>
                
                <div className="space-y-2">
                  {boosterState.resume.map((task) => (
                    <div 
                      key={task.id}
                      onClick={() => {
                        const updated = boosterState.resume.map(item => item.id === task.id ? { ...item, checked: !item.checked } : item);
                        saveBoosterState({ ...boosterState, resume: updated });
                      }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/30 hover:bg-slate-900/65 cursor-pointer text-2xs transition-colors"
                    >
                      <div className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center shrink-0 ${task.checked ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-800'}`}>
                        {task.checked && <Check className="w-3 h-3 stroke-[3px]" />}
                      </div>
                      <span className={task.checked ? 'line-through text-slate-500 font-light' : 'text-slate-300'}>{task.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 2: LinkedIn */}
              <div className="rounded-2xl border border-slate-900 bg-slate-950/20 p-5 text-left space-y-4">
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 border-b border-slate-900 pb-2">
                  <Linkedin className="w-4 h-4 text-cyan-400" /> LinkedIn Network Visibility Hacks
                </h4>
                
                <div className="space-y-2">
                  {boosterState.linkedin.map((task) => (
                    <div 
                      key={task.id}
                      onClick={() => {
                        const updated = boosterState.linkedin.map(item => item.id === task.id ? { ...item, checked: !item.checked } : item);
                        saveBoosterState({ ...boosterState, linkedin: updated });
                      }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/30 hover:bg-slate-900/65 cursor-pointer text-2xs transition-colors"
                    >
                      <div className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center shrink-0 ${task.checked ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-800'}`}>
                        {task.checked && <Check className="w-3 h-3 stroke-[3px]" />}
                      </div>
                      <span className={task.checked ? 'line-through text-slate-500 font-light' : 'text-slate-300'}>{task.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 3: GitHub Portfolio */}
              <div className="rounded-2xl border border-slate-900 bg-slate-950/20 p-5 text-left space-y-4">
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 border-b border-slate-900 pb-2">
                  <Github className="w-4 h-4 text-slate-300" /> GitHub Portfolio proof indicators
                </h4>
                
                <div className="space-y-2">
                  {boosterState.github.map((task) => (
                    <div 
                      key={task.id}
                      onClick={() => {
                        const updated = boosterState.github.map(item => item.id === task.id ? { ...item, checked: !item.checked } : item);
                        saveBoosterState({ ...boosterState, github: updated });
                      }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/30 hover:bg-slate-900/65 cursor-pointer text-2xs transition-colors"
                    >
                      <div className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center shrink-0 ${task.checked ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-800'}`}>
                        {task.checked && <Check className="w-3 h-3 stroke-[3px]" />}
                      </div>
                      <span className={task.checked ? 'line-through text-slate-500 font-light' : 'text-slate-300'}>{task.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 4: Interview Preparation */}
              <div className="rounded-2xl border border-slate-900 bg-slate-950/20 p-5 text-left space-y-4">
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 border-b border-slate-900 pb-2">
                  <Briefcase className="w-4 h-4 text-purple-400" /> Interview preparation strategy
                </h4>
                
                <div className="space-y-2">
                  {boosterState.interviews.map((task) => (
                    <div 
                      key={task.id}
                      onClick={() => {
                        const updated = boosterState.interviews.map(item => item.id === task.id ? { ...item, checked: !item.checked } : item);
                        saveBoosterState({ ...boosterState, interviews: updated });
                      }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/30 hover:bg-slate-900/65 cursor-pointer text-2xs transition-colors"
                    >
                      <div className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center shrink-0 ${task.checked ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-800'}`}>
                        {task.checked && <Check className="w-3 h-3 stroke-[3px]" />}
                      </div>
                      <span className={task.checked ? 'line-through text-slate-500 font-light' : 'text-slate-300'}>{task.text}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
