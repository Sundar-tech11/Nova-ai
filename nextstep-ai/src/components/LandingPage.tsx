import { useState, useEffect, useRef, FormEvent } from 'react';
import { 
  Briefcase, Compass, BrainCircuit, Target, Globe, TrendingUp, Sparkles, 
  ArrowRight, ShieldCheck, Award, Star, Mail, Lock, User, CheckCircle2, 
  RotateCcw, AlertTriangle, Github, Chrome, Play, BookOpen, Layers, 
  Cpu, Database, Settings, ShieldAlert, BadgeInfo, Download, Check, X,
  ArrowUpRight, Laptop, Sparkle, LayoutDashboard
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { motion, AnimatePresence } from 'motion/react';

// --- CUSTOM INTERACTIVE CANVAS PARTICLES COMPONENT ---
function CanvasParticlesBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let width = canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
    let height = canvas.height = canvas.parentElement?.offsetHeight || 800;
    
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.offsetHeight || 800;
    };
    
    window.addEventListener('resize', handleResize);
    
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      glow: number;
    }

    const particles: Particle[] = [];
    const count = 50;
    
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        color: i % 3 === 0 ? '#3B82F6' : i % 3 === 1 ? '#06B6D4' : '#8B5CF6',
        glow: Math.random() * 8 + 4
      });
    }
    
    const render = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);
      
      // Draw smooth grid matrix lines
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw faint connections between nearby points
      for (let i = 0; i < count; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < count; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${(1 - dist / 130) * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      
      // Draw nodes
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.glow;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0"
    />
  );
}

// --- CORE COMPONENT DATA ---
interface CourseItem {
  id: string;
  name: string;
  category: 'Programming' | 'Web Development' | 'AI & ML' | 'Data Science' | 'Tools';
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  desc: string;
  skillsAcquired: string[];
}

export default function LandingPage({ onLaunchWorkspace }: { onLaunchWorkspace?: (tab: string) => void }) {
  const { login, signup, loginWithGoogle, forgotPassword, resetPasswordSubmit, isAuthenticated, error: authError } = useAuth();

  // Modal Control States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot' | 'reset'>('login');
  
  // Login Form Configuration
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Simulated Code Overrides
  const [simulatedCode, setSimulatedCode] = useState('');
  const [codeEntered, setCodeEntered] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // Verification Notification Details
  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Active Modular Course trackers
  const [selectedCourseTab, setSelectedCourseTab] = useState<'Programming' | 'Web Development' | 'AI & ML' | 'Data Science' | 'Tools'>('AI & ML');
  const [enrolledCourseId, setEnrolledCourseId] = useState<string | null>(null);
  const [courseProgress, setCourseProgress] = useState<{ [key: string]: number }>({});
  const [selectedCertificateCourse, setSelectedCertificateCourse] = useState<CourseItem | null>(null);

  // Active Interactive Roadmap Checkpoint Level (Index)
  const [activeRoadmapStep, setActiveRoadmapStep] = useState<number>(0);

  const clearMessages = () => {
    setLocalError(null);
    setLocalSuccess(null);
  };

  const openAuthWithMode = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    clearMessages();
    setIsAuthModalOpen(true);
  };

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setLocalError('Please complete all credential fields.');
      return;
    }
    setFormLoading(true);
    clearMessages();

    const success = await login(email, password, rememberMe);
    if (success) {
      setLocalSuccess('Access granted! Authenticating secure Cloud Container...');
      setTimeout(() => {
        setIsAuthModalOpen(false);
        window.history.pushState({}, '', '/dashboard');
        window.dispatchEvent(new Event('popstate'));
      }, 700);
    } else {
      setLocalError('Incorrect email or passphrase credentials. Try again.');
      setFormLoading(false);
    }
  };

  const handleSignupSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!name || !email || !password || !confirmPassword) {
      setLocalError('Please complete all required subscription fields.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Confirm password does not match.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Passcode must contain 6+ characters for security.');
      return;
    }
    if (!termsAccepted) {
      setLocalError('You must agree to the NextStep AI terms & guidelines.');
      return;
    }

    setFormLoading(true);
    const success = await signup(name, email, password);
    if (success) {
      setLocalSuccess('Registration successful! Initializing sandbox dashboard environment...');
      setTimeout(() => {
        setIsAuthModalOpen(false);
        window.history.pushState({}, '', '/dashboard');
        window.dispatchEvent(new Event('popstate'));
      }, 750);
    } else {
      setLocalError('This email is already registered to another professional account.');
      setFormLoading(false);
    }
  };

  const handleForgotSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      setLocalError('Please fill out the email input field.');
      return;
    }
    setFormLoading(true);
    clearMessages();

    const result = await forgotPassword(email);
    if (result.success) {
      setSimulatedCode(result.resetCode || '992147');
      setLocalSuccess('A simulated sandbox passcode has been generated.');
      setAuthMode('reset');
    } else {
      setLocalError(result.error || 'Failed to dispatch password recovery parameter.');
    }
    setFormLoading(false);
  };

  const handleResetSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!codeEntered || !newPassword) {
      setLocalError('Please fill out code details and a new password.');
      return;
    }
    if (newPassword.length < 6) {
      setLocalError('New password must have at least 6 characters.');
      return;
    }
    setFormLoading(true);
    clearMessages();

    const result = await resetPasswordSubmit(email, codeEntered, simulatedCode, newPassword);
    if (result.success) {
      setLocalSuccess('Password overwritten successfully! Returning to portal sign in...');
      setTimeout(() => {
        setAuthMode('login');
        setPassword('');
        clearMessages();
      }, 1500);
    } else {
      setLocalError(result.error || 'The entered override key is expired or invalid.');
    }
    setFormLoading(false);
  };

  const handleSocialLogin = async (provider: 'Google' | 'GitHub') => {
    setFormLoading(true);
    clearMessages();
    
    if (provider === 'GitHub') {
      setLocalError('GitHub Authentication is deprecated. Please sign in with Google.');
      setFormLoading(false);
      return;
    }

    try {
      const success = await loginWithGoogle();
      if (success) {
        setLocalSuccess(`Successfully authenticated via Google! Initializing workstation...`);
        setTimeout(() => {
          setIsAuthModalOpen(false);
          window.history.pushState({}, '', '/dashboard');
          window.dispatchEvent(new Event('popstate'));
        }, 600);
      } else {
        setLocalError(authError || 'Google authentication was not completed.');
      }
    } catch (err: any) {
      setLocalError(err.message || 'Google SSO pipeline failure.');
    } finally {
      setFormLoading(false);
    }
  };

  // --- COMPREHENSIVE COURSE DATASET ---
  const coursesData: CourseItem[] = [
    // Programming category
    { id: 'course-python', name: 'Python Essentials', category: 'Programming', duration: '6 hours', difficulty: 'Beginner', desc: 'Syntax primitives, class models, nested listing data, and basic logic mapping.', skillsAcquired: ['Python 3', 'OOP Basics', 'Data Types'] },
    { id: 'course-adv-python', name: 'Advanced Python', category: 'Programming', duration: '8 hours', difficulty: 'Advanced', desc: 'Decorators, generator workflows, async concurrency, and memory optimization metrics.', skillsAcquired: ['Asyncio', 'Generators', 'Decorators'] },
    { id: 'course-java', name: 'Java Programming', category: 'Programming', duration: '10 hours', difficulty: 'Intermediate', desc: 'Object-oriented patterns, garbage collector structures, and secure multi-threading execution.', skillsAcquired: ['OOP JVM', 'Multi-thread', 'Java Collections'] },
    { id: 'course-cpp', name: 'C++ Systems', category: 'Programming', duration: '12 hours', difficulty: 'Advanced', desc: 'Pointer arithmetic, structural performance compiler logic, and standard template design pools.', skillsAcquired: ['Pointers', 'C++ STL', 'Memory Management'] },
    { id: 'course-js', name: 'JavaScript Deep Dive', category: 'Programming', duration: '5 hours', difficulty: 'Intermediate', desc: 'Asynchronous event grids, promise chains, lexical scoping, and functional mutation filters.', skillsAcquired: ['ES6 Modules', 'Promises', 'Scope Closures'] },

    // Web Development category
    { id: 'course-html', name: 'Semantic HTML', category: 'Web Development', duration: '3 hours', difficulty: 'Beginner', desc: 'Modern accessible metadata tags, layout flow grids, structure mapping, and index guidelines.', skillsAcquired: ['SEO Basics', 'Accessibility', 'DOM Trees'] },
    { id: 'course-css', name: 'SaaS Layouts & CSS', category: 'Web Development', duration: '4 hours', difficulty: 'Beginner', desc: 'Flexbox, responsive custom grid frameworks, animations, and premium keyframe parameters.', skillsAcquired: ['CSS Grid', 'Tailwind Config', 'Transitions'] },
    { id: 'course-js-web', name: 'Vanilla JS DOM Engine', category: 'Web Development', duration: '6 hours', difficulty: 'Intermediate', desc: 'Event bubble listeners, dynamic component node creation, and requestAnimationFrame systems.', skillsAcquired: ['DOM Event Hooks', 'JSON Parsing', 'API Requests'] },
    { id: 'course-react', name: 'React Development Framework', category: 'Web Development', duration: '9 hours', difficulty: 'Advanced', desc: 'Modular states, virtual memoizations, custom hook creations, and async effect triggers.', skillsAcquired: ['React Hooks', 'Virtual DOM', 'Re-rendering safety'] },

    // AI & Machine Learning category
    { id: 'course-ml', name: 'Machine Learning', category: 'AI & ML', duration: '10 hours', difficulty: 'Intermediate', desc: 'Loss optimization pipelines, linear classification boundaries, clustering formulas, and predictive accuracy.', skillsAcquired: ['Scikit-Learn', 'Feature Engineering', 'Loss Minimization'] },
    { id: 'course-dl', name: 'Deep Learning', category: 'AI & ML', duration: '12 hours', difficulty: 'Advanced', desc: 'Convolutional filter models, recurrent activations, and epochs feedback matrix weights calculations.', skillsAcquired: ['Neural Networks', 'Backprop', 'PyTorch / TF'] },
    { id: 'course-nlp', name: 'Natural Language Processing', category: 'AI & ML', duration: '10 hours', difficulty: 'Advanced', desc: 'Tokenizer arrays, semantic embeddings, sequence weighting, and transform mechanics.', skillsAcquired: ['Transformers', 'BERT', 'Token Vectors'] },
    { id: 'course-cv', name: 'Computer Vision', category: 'AI & ML', duration: '8 hours', difficulty: 'Advanced', desc: 'Spatial feature extractions, object detection frames (YOLO), and OpenCV coordinate grids.', skillsAcquired: ['YOLO Framework', 'Image Classification', 'OpenCV'] },
    { id: 'course-genai', name: 'Generative AI Foundations', category: 'AI & ML', duration: '6 hours', difficulty: 'Intermediate', desc: 'Diffusion equations, Generative Adversarial layouts, and temperature parameters.', skillsAcquired: ['Diffusion Models', 'GANs', 'Inference Config'] },
    { id: 'course-pe', name: 'Prompt Engineering', category: 'AI & ML', duration: '4 hours', difficulty: 'Beginner', desc: 'Few-shot template structuring, chain-of-thought instructions, and prompt ground limits.', skillsAcquired: ['CoT Prompts', 'System Instructions', 'Grounding'] },
    { id: 'course-llm', name: 'LLM Architectures', category: 'AI & ML', duration: '8 hours', difficulty: 'Advanced', desc: 'Pre-training configs, reinforcement scaling from human feedback, and fine-tuning adapters.', skillsAcquired: ['RLHF', 'Fine-Tuning', 'LoRA Config'] },

    // Data Science category
    { id: 'course-numpy', name: 'NumPy Mechanics', category: 'Data Science', duration: '3 hours', difficulty: 'Beginner', desc: 'Multi-dimensional float vectors, dot product matrix operations, and vectorized algebra calculations.', skillsAcquired: ['NDArrays', 'Matrix Multiplication', 'Vectorization'] },
    { id: 'course-pandas', name: 'Pandas Dataframes', category: 'Data Science', duration: '4 hours', difficulty: 'Beginner', desc: 'Dataframe operations, structured row aggregation, missing value cleaning, and CSV parsing.', skillsAcquired: ['Series & DFs', 'Data Cleaning', 'Groupby Aggs'] },
    { id: 'course-datavis', name: 'Data Visualization Pro', category: 'Data Science', duration: '5 hours', difficulty: 'Intermediate', desc: 'Pragmatic visual representations using modern React Recharts, Seaborn, and D3 coordinate logs.', skillsAcquired: ['D3 Diagrams', 'Recharts Plot', 'Layout Aesthetics'] },
    { id: 'course-stats', name: 'Statistics for Data Science', category: 'Data Science', duration: '8 hours', difficulty: 'Intermediate', desc: 'Z-score validations, hypothesis metrics, confidence intervals, and probability charts.', skillsAcquired: ['Hypothesis Testing', 'Probability Density', 'Z-Scores'] },

    // Tools category
    { id: 'course-git', name: 'Git versioning model', category: 'Tools', duration: '3 hours', difficulty: 'Beginner', desc: 'Distributed version branches, cherry-pick operations, and complex rebase workflows.', skillsAcquired: ['Git Rebase', 'Commit Trees', 'SSH Authentication'] },
    { id: 'course-github', name: 'GitHub Collaboration', category: 'Tools', duration: '3 hours', difficulty: 'Beginner', desc: 'Pull request reviews, GitHub Action triggers, security disclosures, and team dashboards.', skillsAcquired: ['Actions CI/CD', 'PR Guidelines', 'Issues Tracking'] },
    { id: 'course-docker', name: 'Docker Isolation', category: 'Tools', duration: '5 hours', difficulty: 'Intermediate', desc: 'Isolation layers, multi-stage file caching, and secure compose networks.', skillsAcquired: ['Dockerfiles', 'Compose Networks', 'Container Security'] },
    { id: 'course-jupyter', name: 'Interactive Notebooks', category: 'Tools', duration: '2 hours', difficulty: 'Beginner', desc: 'Cellular code compilation, analytical charting, and dynamic variable inspects.', skillsAcquired: ['Cell Compiles', 'Interactive Plots', 'Markdown Notes'] },
  ];

  // Learning Progress simulation
  const handleStartCourse = (courseId: string) => {
    setEnrolledCourseId(courseId);
    if (courseProgress[courseId] === undefined) {
      setCourseProgress(prev => ({ ...prev, [courseId]: 0 }));
    }
  };

  const incrementCourse = (courseId: string, current: number) => {
    const nextVal = Math.min(current + 25, 100);
    setCourseProgress(prev => ({ ...prev, [courseId]: nextVal }));
    
    if (nextVal === 100) {
      const course = coursesData.find(c => c.id === courseId);
      if (course) {
        setSelectedCertificateCourse(course);
      }
    }
  };

  // Filtered Course view based on Tab Selection
  const activeCourseList = coursesData.filter(c => c.category === selectedCourseTab);

  // --- INTERACTIVE CAREER PATH ROADMAP BLUEPRINT ---
  const careerRoadmapSteps = [
    { name: 'Python Basics', type: 'Core coding mechanics, variable lists, looping structures', status: 'COMPLETED', skill: 'Python Syntaxes' },
    { name: 'NumPy & Pandas', type: 'High density float vectors parsing, dataframe query matrices', status: 'COMPLETED', skill: 'Data structures' },
    { name: 'Machine Learning', type: 'Loss parameters optimization, linear classifiers, validation checks', status: 'ACTIVE', skill: 'Scikit-Predict' },
    { name: 'Deep Learning', type: 'Multi layer neural weights tuning, epoch outputs calculating', status: 'LOCKED', skill: 'PyTorch / NN' },
    { name: 'NLP & Computer Vision', type: 'Embedding token grids, convolutional YOLO spatial metrics', status: 'LOCKED', skill: 'YOLO Visuals' },
    { name: 'Generative AI', type: 'Diffusion architectures modeling, prompt inference settings', status: 'LOCKED', skill: 'Large Models' },
    { name: 'MLOps Pipeline', type: 'Model endpoints isolation, Docker container caching protocols', status: 'LOCKED', skill: 'Production' }
  ];

  return (
    <div id="saas-homepage-top" className="min-h-screen bg-[#0B1020] text-[#F8FAFC] font-sans antialiased relative overflow-x-hidden selection:bg-[#3B82F6]/35">
      
      {/* 5-layer Cosmic Neon Blur backgrounds */}
      <div className="absolute top-[3%] left-[-15%] h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] rounded-full bg-[#3B82F6]/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[-15%] h-[400px] w-[400px] sm:h-[600px] sm:w-[500px] rounded-full bg-[#8B5CF6]/5 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[30%] left-[8%] h-[500px] w-[500px] rounded-full bg-[#06B6D4]/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-indigo-600/[0.02] blur-[150px] pointer-events-none z-0" />

      {/* Hero Header with Canvas Particle Field */}
      <section id="hero-portal-pane" className="relative pt-20 pb-20 sm:pt-32 sm:pb-36 px-4 select-none border-b border-slate-900/40">
        <CanvasParticlesBg />
        
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          
          {/* Top Tag Announcement */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-blue-500/15 bg-blue-500/[0.04] backdrop-blur-md shadow-xl text-xs text-[#06B6D4] font-medium tracking-wide animate-fade-in animate-pulse">
            <Sparkle className="w-4 h-4 text-[#8B5CF6] shrink-0" />
            <span>NextStep AI Redesigned: The Ultimate Tech Career SaaS platform</span>
          </div>

          {/* Large Headline */}
          <h1 className="text-4xl sm:text-7xl font-black tracking-tight leading-tight text-white max-w-4xl mx-auto drop-shadow-xl">
            Accelerate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] via-[#06B6D4] to-[#8B5CF6]">Career with AI</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-[#94A3B8] font-light leading-relaxed max-w-3xl mx-auto">
            Analyze resumes, discover career roadmaps, prepare for interviews, learn in-demand skills, and build a professional portfolio.
          </p>

          {/* Dynamic Floating AI Tech Badges */}
          <div className="flex flex-wrap justify-center items-center gap-3.5 max-w-2xl mx-auto pt-2.5">
            {['ATS Scan Feedback', 'Checkpoints Timeline', 'Instant STAR Mocks', 'Achievement Badges', 'Professional Portfolios'].map((b) => (
              <span key={b} className="px-3 py-1 bg-slate-950/40 border border-slate-900 text-slate-500 text-[10px] sm:text-xs rounded-xl font-mono flex items-center gap-1.5 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />
                {b}
              </span>
            ))}
          </div>

          {/* Hero Buttons Block */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4.5 pt-6">
            <button
              id="cta-get-started-hero"
              onClick={() => openAuthWithMode('signup')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#3B82F6] via-[#06B6D4] to-[#8B5CF6] hover:opacity-90 transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-blue-500/15 group cursor-pointer border border-white/10"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              id="cta-explore-features"
              onClick={() => {
                const featureTarget = document.getElementById('features-section-anchor');
                if (featureTarget) featureTarget.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-[#F8FAFC] bg-[#0B1020] hover:bg-slate-900 border border-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow shadow-black/40"
            >
              Explore Features
              <ArrowUpRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          <p className="text-[10px] sm:text-xs text-slate-600 font-mono tracking-widest uppercase">
            No credit card required &nbsp;&bull;&nbsp; Instant Sandbox Account Access &nbsp;&bull;&nbsp; Unlocked Pro Metrics
          </p>

        </div>
      </section>

      {/* --- SECTION 2: FEATURES SECTION --- */}
      <section id="features-section-anchor" className="px-5 py-24 mx-auto max-w-7xl border-b border-slate-900/40 scrolling-offset text-left">
        <div className="text-center max-w-3xl mx-auto mb-16 select-none">
          <span className="text-xs font-bold text-[#3B82F6] uppercase tracking-widest block mb-2 font-mono">
            CORE CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Designed for Next-Gen Tech Professionals
          </h2>
          <p className="text-slate-400 mt-4 font-light text-base sm:text-lg">
            Everything you need in a single dashboard layout to construct your career roadmap, study, mock-interview, and landing a top technology job.
          </p>
        </div>

        {/* Feature Cards Grid (6 Cards detailed) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card 1: AI Resume Analyzer */}
          <div id="feat-resume" className="relative group rounded-2xl border border-slate-900 bg-slate-950/50 p-7 hover:border-slate-800 transition-all duration-300 shadow overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 w-full h-[50%] bg-[#3B82F6]/5 blur-[35px] pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center text-2xl shadow">
                📄
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-[#3B82F6] transition-colors flex items-center gap-2">
                AI Resume Analyzer
                <span className="text-[9px] bg-[#3B82F6]/10 text-[#3B82F6] font-mono px-2 py-0.5 rounded font-normal">ATS-Aligned</span>
              </h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Improve resume quality score line-by-line using contextual ATS matching. Auto-detect competency gaps and key missing verbs instantly.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-900/80 mt-6 flex justify-between items-center text-slate-500 group-hover:text-slate-400 text-[11px] font-mono select-none">
              <span>Optimized algorithms</span>
              <span className="text-[#3B82F6] font-bold">Launch Tools ➔</span>
            </div>
          </div>

          {/* Card 2: AI Career Roadmaps */}
          <div id="feat-roadmaps" className="relative group rounded-2xl border border-slate-900 bg-slate-950/50 p-7 hover:border-slate-800 transition-all duration-300 shadow overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 w-full h-[50%] bg-[#8B5CF6]/5 blur-[35px] pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-2xl shadow">
                🗺️
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-[#8B5CF6] transition-colors flex items-center gap-2">
                AI Career Roadmaps
                <span className="text-[9px] bg-[#8B5CF6]/10 text-[#8B5CF6] font-mono px-2 py-0.5 rounded font-normal">Interactive</span>
              </h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Discover personalized step-by-step tracks based on your career targets. Model your visual checkpoint paths step-by-step from zero to MLOps.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-900/80 mt-6 flex justify-between items-center text-slate-500 group-hover:text-slate-400 text-[11px] font-mono select-none">
              <span>Sequential blueprints</span>
              <span className="text-[#8B5CF6] font-bold">Launch Tools ➔</span>
            </div>
          </div>

          {/* Card 3: AI Interview Coach */}
          <div id="feat-interview" className="relative group rounded-2xl border border-slate-900 bg-slate-950/50 p-7 hover:border-slate-800 transition-all duration-300 shadow overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 w-full h-[50%] bg-[#06B6D4]/5 blur-[35px] pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-[#06B6D4]/10 border border-[#06B6D4]/20 flex items-center justify-center text-2xl shadow">
                🎙️
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-[#06B6D4] transition-colors flex items-center gap-2">
                AI Interview Coach
                <span className="text-[9px] bg-[#06B6D4]/10 text-[#06B6D4] font-mono px-2 py-0.5 rounded font-normal">STAR Grader</span>
              </h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Simulate mock live panel interviews under multiple modes. Receive instant granular feedback scored against structured STAR response principles.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-900/80 mt-6 flex justify-between items-center text-slate-500 group-hover:text-[#06B6D4] text-[11px] font-mono select-none">
              <span>Gemini Interactive sandbox</span>
              <span className="text-[#06B6D4] font-bold">Launch Tools ➔</span>
            </div>
          </div>

          {/* Card 4: Skills Tracker */}
          <div id="feat-skills" className="relative group rounded-2xl border border-slate-900 bg-slate-950/50 p-7 hover:border-slate-800 transition-all duration-300 shadow overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 w-full h-[50%] bg-[#3B82F6]/5 blur-[35px] pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center text-2xl shadow">
                🎯
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-[#3B82F6] transition-colors flex items-center gap-2">
                Skills Tracker
                <span className="text-[9px] bg-[#3B82F6]/10 text-[#3B82F6] font-mono px-2 py-0.5 rounded font-normal">Certifications</span>
              </h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Log study hours and module completions directly. Unlock authenticated completion badge certificates on standard files to export for LinkedIn.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-900/80 mt-6 flex justify-between items-center text-slate-500 group-hover:text-[#3B82F6] text-[11px] font-mono select-none">
              <span>Hourly velocity indices</span>
              <span className="text-[#3B82F6] font-bold">Launch Tools ➔</span>
            </div>
          </div>

          {/* Card 5: Portfolio Builder */}
          <div id="feat-portfolio" className="relative group rounded-2xl border border-slate-900 bg-slate-950/50 p-7 hover:border-slate-800 transition-all duration-300 shadow overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 w-full h-[50%] bg-[#8B5CF6]/5 blur-[35px] pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-2xl shadow">
                💼
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-[#8B5CF6] transition-colors flex items-center gap-2">
                Portfolio Builder
                <span className="text-[9px] bg-[#8B5CF6]/10 text-[#8B5CF6] font-mono px-2 py-0.5 rounded font-normal">One-Click</span>
              </h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Build a modern, interactive public tech bio. Display earned verification skill indicators and project cards with custom themes.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-900/80 mt-6 flex justify-between items-center text-slate-500 group-hover:text-slate-400 text-[11px] font-mono select-none">
              <span>Personal web presence pro</span>
              <span className="text-[#8B5CF6] font-bold">Launch Tools ➔</span>
            </div>
          </div>

          {/* Card 6: Career Analytics Dashboard */}
          <div id="feat-analytics" className="relative group rounded-2xl border border-slate-900 bg-slate-950/50 p-7 hover:border-slate-800 transition-all duration-300 shadow overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 w-full h-[50%] bg-[#06B6D4]/5 blur-[35px] pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-[#06B6D4]/10 border border-[#06B6D4]/20 flex items-center justify-center text-2xl shadow">
                📈
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-[#06B6D4] transition-colors flex items-center gap-2">
                Career Analytics Dashboard
                <span className="text-[9px] bg-[#06B6D4]/10 text-[#06B6D4] font-mono px-2 py-0.5 rounded font-normal">Insights</span>
              </h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Monitor prep curves, tracking scores, mock progress trends, and learning duration hours through interactive vector graphs.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-900/80 mt-6 flex justify-between items-center text-slate-500 group-hover:text-slate-400 text-[11px] font-mono select-none">
              <span>Live metric data insights</span>
              <span className="text-[#06B6D4] font-bold">Launch Tools ➔</span>
            </div>
          </div>

        </div>
      </section>

      {/* --- SECTION 3: COURSES SECTION --- */}
      <section id="courses-section-anchor" className="px-5 py-24 mx-auto max-w-7xl border-b border-slate-900/40 text-left bg-slate-950/20">
        
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-16 select-none">
          <div className="max-w-2xl space-y-3.5">
            <span className="text-xs font-bold text-[#8B5CF6] uppercase tracking-widest block font-mono">
              CURATED SYLLABI
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Master Career-Building Courses
            </h2>
            <p className="text-[#94A3B8] font-light text-sm sm:text-base leading-relaxed">
              Explore custom specialized modules complete with interactive progress tracking, completion badges, and printable certification records.
            </p>
          </div>

          {/* Tab Filter Row */}
          <div className="flex flex-wrap gap-2 animate-fade-in">
            {(['Programming', 'Web Development', 'AI & ML', 'Data Science', 'Tools'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedCourseTab(tab)}
                className={`px-4 py-2 rounded-xl text-2xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
                  selectedCourseTab === tab
                    ? 'bg-[#3B82F6] text-white shadow-lg shadow-blue-500/10 border border-blue-400/25'
                    : 'bg-slate-900/40 border border-slate-900 hover:border-slate-800 text-[#94A3B8] hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCourseList.map((course) => {
            const progress = courseProgress[course.id] || 0;
            const isEnrolled = courseProgress[course.id] !== undefined;
            const isCompleted = progress === 100;

            return (
              <div 
                key={course.id} 
                className="relative rounded-2xl border border-slate-900/80 bg-slate-950/40 p-6 flex flex-col justify-between hover:border-slate-800 transition-all duration-300 shadow group min-h-[300px]"
              >
                {/* Completion glow line */}
                {isEnrolled && (
                  <div className="absolute top-0 left-0 h-[3px] bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] transition-all" style={{ width: `${progress}%` }} />
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-slate-500 flex items-center gap-1">⏱ {course.duration}</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold uppercase ${
                      course.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400' :
                      course.difficulty === 'Intermediate' ? 'bg-[#3B82F6]/10 text-blue-400' :
                      'bg-[#8B5CF6]/15 text-purple-400'
                    }`}>
                      {course.difficulty}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-[#3B82F6] transition-colors leading-tight">
                    {course.name}
                  </h3>

                  <p className="text-xs text-[#94A3B8] font-light leading-relaxed line-clamp-3">
                    {course.desc}
                  </p>

                  {/* Skills tags list */}
                  <div className="flex flex-wrap gap-1.5 pt-1 select-none">
                    {course.skillsAcquired.map((skill) => (
                      <span key={skill} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-900 text-slate-500 text-[9px] font-mono whitespace-nowrap">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Progress actions pane wrapper */}
                <div id={`course-pane-${course.id}`} className="space-y-4 pt-5 border-t border-slate-900/60 mt-6 md:mt-8 select-none">
                  {isEnrolled ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-500">Modular Completion</span>
                        <span className="text-[#06B6D4] font-bold">{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-950 border border-slate-900 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#3B82F6] via-[#06B6D4] to-[#8B5CF6] transition-all duration-300" style={{ width: `${progress}%` }} />
                      </div>
                      
                      {progress < 100 ? (
                        <button
                          onClick={() => incrementCourse(course.id, progress)}
                          className="w-full py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-[#8B5CF6] text-[10px] sm:text-xs font-mono font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Play className="w-3 h-3 text-[#8B5CF6]" />
                          Study Module Course Checkpoint (+25%)
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedCertificateCourse(course)}
                          className="w-full py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] sm:text-xs font-mono font-bold flex items-center justify-center gap-1 border border-emerald-500/20 animate-pulse cursor-pointer"
                        >
                          <Award className="w-3.5 h-3.5" />
                          View completion Certificate
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartCourse(course.id)}
                      className="w-full py-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs text-[#F8FAFC] font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 group-hover:border-slate-700"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                      Enroll & Start Learning
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </section>

      {/* --- SECTION 4: CAREER PATHS SECTION --- */}
      <section id="career-paths-anchor" className="px-5 py-24 mx-auto max-w-7xl border-b border-slate-900/40 text-left">
        
        <div className="text-center max-w-3xl mx-auto mb-16 select-none">
          <span className="text-xs font-bold text-[#06B6D4] uppercase tracking-widest block mb-2 font-mono">
            INTERACTIVE MAPS
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            AIML Engineer Career Path
          </h2>
          <p className="text-slate-400 mt-4 font-light text-base sm:text-lg">
            Follow this visually structured chronological timeline mapping sequentially required technologies from core syntax paradigms up to distributed production MLOps servers.
          </p>
        </div>

        {/* Real Dynamic Interactive Tree Block */}
        <div className="max-w-4xl mx-auto bg-slate-950/40 border border-slate-900/80 rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute top-[10%] right-[-10%] h-[300px] w-[300px] bg-[#8B5CF6]/5 blur-[80px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10 select-none">
            
            {/* Timeline Steps Sidebar (5 Columns) */}
            <div className="lg:col-span-5 space-y-3.5 border-r border-slate-900/80 pr-0 lg:pr-8 py-2">
              <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase block font-bold mb-4">
                Sequential Checkpoints
              </span>

              {careerRoadmapSteps.map((step, idx) => {
                const isActive = idx === activeRoadmapStep;
                const isPassed = idx < activeRoadmapStep;

                return (
                  <button
                    key={step.name}
                    id={`roadmap-step-trigger-${idx}`}
                    onClick={() => setActiveRoadmapStep(idx)}
                    className={`w-full flex items-center justify-between text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-950/15 to-indigo-950/10 border-[#3B82F6]/40 text-white shadow-md'
                        : isPassed
                          ? 'border-slate-900 bg-slate-900/10 text-slate-400 hover:text-slate-300'
                          : 'border-transparent text-slate-600 hover:text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                        isPassed 
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                          : isActive
                            ? 'bg-[#3B82F6]/10 text-blue-400 border border-blue-400/20 glow-sm'
                            : 'bg-slate-900 text-slate-600'
                      }`}>
                        {isPassed ? '✔' : idx + 1}
                      </span>
                      <span className="text-xs font-bold leading-tight truncate">{step.name}</span>
                    </div>

                    <span className={`text-[8px] font-mono tracking-wider px-2 py-0.5 rounded font-extrabold ${
                      step.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400' :
                      step.status === 'ACTIVE' ? 'bg-[#3B82F6]/10 text-blue-400' :
                      'bg-slate-900 text-slate-500'
                    }`}>
                      {step.status}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* active checkpoint details box (7 Columns) */}
            <div className="lg:col-span-7 h-full flex flex-col justify-between py-2 pl-0 lg:pl-4 space-y-6">
              
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[10px] font-mono tracking-wider font-extrabold text-[#8B5CF6] uppercase">
                  Active Focus Parameter
                </div>
                
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Step {activeRoadmapStep + 1}: {careerRoadmapSteps[activeRoadmapStep].name}
                </h3>

                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  {careerRoadmapSteps[activeRoadmapStep].type}
                </p>

                <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-900 font-mono text-2xs space-y-2 text-slate-500">
                  <span className="text-[10px] text-slate-400 block font-bold">SYLLABUS COVERED:</span>
                  <p>&bull; Comprehensive theoretical sandbox foundations</p>
                  <p>&bull; High performance actionable parameters validation</p>
                  <p>&bull; Dynamic competency scorecard testing models</p>
                </div>
              </div>

              {/* Action layout bar */}
              <div className="pt-4 border-t border-slate-900/60 flex items-center justify-between gap-4">
                <div className="space-y-0.5 text-left">
                  <span className="text-[9px] text-slate-600 font-mono block">Focus Skill Target:</span>
                  <span className="text-xs text-[#06B6D4] font-bold font-mono">{careerRoadmapSteps[activeRoadmapStep].skill}</span>
                </div>

                <div className="flex gap-2">
                  {activeRoadmapStep > 0 && (
                    <button
                      onClick={() => setActiveRoadmapStep(activeRoadmapStep - 1)}
                      className="px-3 py-1.5 border border-slate-800 hover:bg-slate-900 rounded-lg text-2xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer font-bold"
                    >
                      ❰ Prev
                    </button>
                  )}
                  {activeRoadmapStep < careerRoadmapSteps.length - 1 ? (
                    <button
                      onClick={() => setActiveRoadmapStep(activeRoadmapStep + 1)}
                      className="px-4 py-1.5 bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 border border-[#3B82F6]/25 rounded-lg text-2xs text-[#3B82F6] hover:text-blue-400 transition-all font-bold cursor-pointer"
                    >
                      Next step ❯
                    </button>
                  ) : (
                    <button
                      onClick={() => openAuthWithMode('signup')}
                      className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:opacity-90 rounded-lg text-2xs text-white transition-all font-bold cursor-pointer flex items-center gap-1"
                    >
                      Lock Career Path <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* --- SECTION 5: TESTIMONIALS --- */}
      <section id="testimonials-section-anchor" className="px-5 py-24 mx-auto max-w-7xl border-b border-slate-900/40 text-left bg-slate-950/20">
        
        <div className="text-center max-w-3xl mx-auto mb-16 select-none">
          <span className="text-xs font-bold text-[#8B5CF6] uppercase tracking-widest block mb-2 font-mono">
            SUCCESS METRICS
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Candidate Testimonials
          </h2>
          <p className="text-slate-400 font-light text-base sm:text-lg">
            See how technology students and engineering candidates transformed their application processes using NextStep AI.
          </p>
        </div>

        {/* Animated staggered success cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <div className="rounded-2xl border border-slate-900 bg-slate-950/50 p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between">
            <span className="absolute top-4 right-4 text-xs font-mono text-slate-700">June 2026</span>
            <div className="flex gap-1 text-yellow-500 text-xs mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current text-amber-400" />)}
            </div>
            <p className="text-[#94A3B8] text-xs sm:text-sm font-light leading-relaxed mb-6 italic">
              "The resume analyzer was directly spot on. Adding specific action keywords and AWS-focused milestones elevated my profile ATS match. Landed a Data Science interview at a leading SaaS provider in two weeks!"
            </p>
            <div className="flex gap-3.5 items-center select-none pt-4 border-t border-slate-900/60">
              <div className="w-9 h-9 rounded-full bg-[#3B82F6]/15 hover:bg-[#3B82F6]/25 border border-[#3B82F6]/20 flex items-center justify-center text-xs font-bold text-blue-400 shadow">
                AS
              </div>
              <div className="text-left">
                <h5 className="text-xs font-bold text-[#F8FAFC]">Aris Sharma</h5>
                <span className="text-[10px] text-slate-500">Graduated AIML Student</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-900 bg-slate-950/50 p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between">
            <span className="absolute top-4 right-4 text-xs font-mono text-slate-700">May 2026</span>
            <div className="flex gap-1 text-yellow-500 text-xs mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current text-amber-400" />)}
            </div>
            <p className="text-[#94A3B8] text-xs sm:text-sm font-light leading-relaxed mb-6 italic">
              "The AI mock feedback loop was insanely useful. The graded tips and standard structural sample answers gave me the confidence to handle tough system architecture and backend behavioral questions effortlessly."
            </p>
            <div className="flex gap-3.5 items-center select-none pt-4 border-t border-slate-900/60">
              <div className="w-9 h-9 rounded-full bg-[#06B6D4]/15 hover:bg-[#06B6D4]/25 border border-[#06B6D4]/20 flex items-center justify-center text-xs font-bold text-cyan-400 shadow">
                ML
              </div>
              <div className="text-left">
                <h5 className="text-xs font-bold text-[#F8FAFC]">Maya Lin</h5>
                <span className="text-[10px] text-slate-500">Full Stack Job Seeker</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-900 bg-slate-950/50 p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between">
            <span className="absolute top-4 right-4 text-xs font-mono text-slate-700">April 2026</span>
            <div className="flex gap-1 text-yellow-500 text-xs mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current text-amber-400" />)}
            </div>
            <p className="text-[#94A3B8] text-xs sm:text-sm font-light leading-relaxed mb-6 italic">
              "I used the Portfolio Builder to design my personal page. It rendered all my achievements and progress tracking logs seamlessly with high-contrast layouts. Got multiple recruiters sliding directly in my LinkedIn inbox!"
            </p>
            <div className="flex gap-3.5 items-center select-none pt-4 border-t border-slate-900/60">
              <div className="w-9 h-9 rounded-full bg-[#8B5CF6]/15 hover:bg-[#8B5CF6]/25 border border-[#8B5CF6]/20 flex items-center justify-center text-xs font-bold text-purple-400 shadow">
                KH
              </div>
              <div className="text-left">
                <h5 className="text-xs font-bold text-[#F8FAFC]">Kaelen Hayes</h5>
                <span className="text-[10px] text-slate-500">Junior software engineer</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- SECTION 6: PRICING (Free Plan Only) --- */}
      <section id="pricing-portal" className="px-5 py-24 mx-auto max-w-7xl border-b border-slate-900/40 text-left relative">
        <div className="absolute top-0 right-0 h-[250px] w-[#30%] bg-[#3B82F6]/5 blur-[70px] pointer-events-none" />
        
        <div className="text-center max-w-3xl mx-auto mb-16 select-none">
          <span className="text-xs font-bold text-[#3B82F6] uppercase tracking-widest block mb-2 font-mono">
            INVESTMENT BLUEPRINT
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Transparent Pricing Plan
          </h2>
          <p className="text-slate-400 font-light text-base">
            Simple, honest pricing. We believe premium career coaching tools should be open to all aspiring software architects.
          </p>
        </div>

        {/* Free Plan Only structure detailed beautifully */}
        <div className="max-w-md mx-auto relative group">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#3B82F6] via-[#06B6D4] to-[#8B5CF6] opacity-30 group-hover:opacity-45 blur-md transition-all duration-300 pointer-events-none" />
          
          <div className="relative bg-slate-950 rounded-3xl border border-slate-800 p-8 sm:p-10 text-center space-y-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between min-h-[460px]">
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/20 text-[#06B6D4] text-[9px] font-mono tracking-widest uppercase font-extrabold mx-auto">
                ALWAYS FREE STARTER PLAN
              </div>

              <div>
                <span className="text-5xl font-black text-white">$0</span>
                <span className="text-xs text-slate-500 font-mono ml-1">LIFETIME FREE</span>
              </div>

              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Access full-stack resume analysis, checkpoints tracker, basic STAR metrics interview preparation questions under one dashboard.
              </p>
            </div>

            <div className="border-t border-b border-slate-900 py-6 text-left space-y-3.5 select-none">
              <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase block font-bold">FEATURING UNLOCKED BENEFIT PACK:</span>
              <div className="space-y-2.5 text-xs text-slate-300 font-light">
                <p className="flex items-center gap-2"><span className="text-emerald-400 font-bold font-mono">✔</span> Comprehensive Resume scanning analysis</p>
                <p className="flex items-center gap-2"><span className="text-emerald-400 font-bold font-mono">✔</span> Interactive chronologic AIML pathway tracking</p>
                <p className="flex items-center gap-2"><span className="text-emerald-400 font-bold font-mono">✔</span> 5 STAR scored behavioral review prompts per week</p>
                <p className="flex items-center gap-2"><span className="text-emerald-400 font-bold font-mono">✔</span> Downloadable completed certificates</p>
                <p className="flex items-center gap-2"><span className="text-emerald-400 font-bold font-mono">✔</span> One single customizable tech bio host page</p>
              </div>
            </div>

            <button
              id="cta-join-free-plan"
              onClick={() => openAuthWithMode('signup')}
              className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] hover:opacity-90 shadow shadow-blue-500/10 cursor-pointer border border-white/5 transition-all"
            >
              Join Always Free Plan Now
            </button>

          </div>
        </div>

      </section>

      {/* --- SECTION 7: GET STARTED FOOTER CTA BANNER --- */}
      <section className="px-5 py-24 mx-auto max-w-5xl text-center">
        <div className="relative rounded-3xl border border-slate-900 bg-slate-950/40 p-8 sm:p-14 overflow-hidden shadow-2xl space-y-8 select-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[#8B5CF6]/5 blur-[120px] pointer-events-none" />
          
          <span className="text-xs font-bold text-[#8B5CF6] uppercase tracking-widest block font-mono">
            GET STARTED TODAY
          </span>
          
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-none">
            Ready to Accelerate Your Career?
          </h2>

          <p className="text-[#94A3B8] font-light max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Create your sandbox growth account today and unlock instant access to your AI career coach, resume score analytics, and certification trackers.
          </p>

          <button
            id="cta-footer-get-started"
            onClick={() => openAuthWithMode('signup')}
            className="px-10 py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#3B82F6] via-[#06B6D4] to-[#8B5CF6] hover:opacity-95 shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer border border-white/10 inline-flex items-center gap-2.5 group"
          >
            Get Started (Free Account)
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

        </div>
      </section>

      {/* Styled Footer Watermark */}
      <footer className="border-t border-slate-900 py-12 mt-16 text-center text-xs text-slate-600 select-none select-none">
        <div className="max-w-7xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="p-1 px-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-[11px] tracking-wider text-center">
              NS
            </div>
            <span className="font-extrabold tracking-tight text-slate-400 font-mono text-xs">
              NEXTSTEP AI
            </span>
          </div>
          
          <p className="font-light text-slate-500">
            &copy; {new Date().getFullYear()} NextStep AI SaaS Platform. Fully built in modern high-contrast aesthetics.
          </p>

          <div className="flex items-center gap-4 text-[10px] sm:text-xs">
            <button onClick={() => openAuthWithMode('login')} className="hover:text-slate-400 font-medium cursor-pointer">Login Gate</button>
            <button onClick={() => openAuthWithMode('signup')} className="hover:text-slate-400 font-medium cursor-pointer">Join Pro</button>
            <span className="text-slate-800">|</span>
            <span className="text-slate-500 font-mono text-3xs">SANDBOX MODE ACTIVE</span>
          </div>
        </div>
      </footer>

      {/* --- INTEGRATED GLASSMORPHISM AUTHENTICATION MODAL --- */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            
            {/* Modal Backdrop overlay with heavy blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute inset-0 bg-[#0B1020]/90 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Content container: modern glassmorphism */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-8 max-w-md w-full shadow-2xl z-10 text-left overflow-hidden select-none"
            >
              {/* Decorative top ambient color indicator */}
              <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-[#3B82F6] via-[#06B6D4] to-[#8B5CF6]" />
              
              <button 
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg border border-slate-900 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-800 transition-colors cursor-pointer"
                aria-label="Close modal dialog"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Tabs layout line */}
              {authMode !== 'forgot' && authMode !== 'reset' && (
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/50 rounded-xl mb-6">
                  <button
                    onClick={() => { setAuthMode('login'); clearMessages(); }}
                    className={`py-2 rounded-lg font-mono text-2xs font-bold tracking-wide transition-all ${
                      authMode === 'login' 
                        ? 'bg-slate-950 text-white border border-slate-800/80 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    LOGIN
                  </button>
                  <button
                    onClick={() => { setAuthMode('signup'); clearMessages(); }}
                    className={`py-2 rounded-lg font-mono text-2xs font-bold tracking-wide transition-all ${
                      authMode === 'signup' 
                        ? 'bg-slate-950 text-white border border-slate-800/80 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    SIGN UP
                  </button>
                </div>
              )}

              {/* Title Section */}
              <div className="mb-5 space-y-1">
                <h3 className="text-lg font-extrabold text-white tracking-tight">
                  {authMode === 'login' && 'Sign in to NextStep'}
                  {authMode === 'signup' && 'Create Your Sandbox Profile'}
                  {authMode === 'forgot' && 'Reset Secure Passcode'}
                  {authMode === 'reset' && 'Alter Account Password'}
                </h3>
                <p className="text-2xs text-slate-400 leading-relaxed font-light">
                  {authMode === 'login' && 'Enter email & password parameters to launch your workspace.'}
                  {authMode === 'signup' && 'Claim instant free access to analyzer tools with one profile.'}
                  {authMode === 'forgot' && 'Provide your registered email address to acquire verified override key.'}
                  {authMode === 'reset' && 'Submit the verification override code to update password settings.'}
                </p>
              </div>

              {/* Alert Feedback Messages */}
              {localError && (
                <div className="mb-4 p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-2xs text-[#ea7878] flex items-start gap-2 text-left animate-in fade-in">
                  <span className="text-sm select-none">⚠</span>
                  <span>{localError}</span>
                </div>
              )}

              {localSuccess && (
                <div className="mb-4 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-2xs text-[#72f5bc] flex items-start gap-2 text-left animate-in fade-in">
                  <span className="text-sm select-none">✔</span>
                  <span>{localSuccess}</span>
                </div>
              )}

              {/* AUTHENTICATION SHIELD SHIELDS */}
              {authMode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase block font-semibold">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="candidate@nextstep.ai"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-900 bg-slate-900/35 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#3B82F6] font-light"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase block font-semibold">Password</label>
                      <button 
                        type="button"
                        onClick={() => { setAuthMode('forgot'); clearMessages(); }}
                        className="text-[10px] font-semibold text-[#8B5CF6] hover:text-purple-400 cursor-pointer"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-900 bg-slate-900/35 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#3B82F6] font-light"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <label className="flex items-center gap-2 text-2xs text-slate-400 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-900 bg-slate-950 text-[#3B82F6] focus:ring-[#3B82F6] w-3.5 h-3.5" 
                      />
                      Remember Me
                    </label>
                    <span className="text-[9px] font-mono text-slate-600">Secure AES active</span>
                  </div>

                  <button
                    type="submit"
                    disabled={formLoading}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-[#3B82F6] hover:bg-blue-600 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {formLoading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Sign In Platform
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {authMode === 'signup' && (
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase block font-semibold">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Full Name"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-900 bg-slate-900/35 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#3B82F6] font-light"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase block font-semibold">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="candidate@nextstep.ai"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-900 bg-slate-900/35 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#3B82F6] font-light"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase block font-semibold">Password</label>
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-900 bg-slate-900/35 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#3B82F6]"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase block font-semibold">Confirm</label>
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-900 bg-slate-900/35 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#3B82F6]"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-0.5">
                    <label className="flex items-start gap-2.5 text-2xs text-slate-400 cursor-pointer select-none leading-relaxed">
                      <input 
                        type="checkbox" 
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="rounded mt-0.5 border-slate-900 bg-slate-950 text-[#3B82F6] focus:ring-[#3B82F6] w-3.5 h-3.5 shrink-0" 
                      />
                      <span>I accept the student data processing guidelines and consent to profile sandbox indexing.</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={formLoading}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] hover:opacity-95 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {formLoading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Register Candidate Profile
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {authMode === 'forgot' && (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase block font-semibold">Registered Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="registered.user@gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-900 bg-slate-900/35 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#3B82F6]"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={formLoading}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-[#3B82F6] hover:bg-blue-600 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Generate Sandbox Reset Code
                  </button>

                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); clearMessages(); }}
                    className="w-full py-2 border border-slate-900 rounded-xl text-slate-400 hover:text-slate-300 text-[11px] hover:bg-slate-900/10 transition-all"
                  >
                    Cancel and Return
                  </button>
                </form>
              )}

              {authMode === 'reset' && (
                <form onSubmit={handleResetSubmit} className="space-y-4">
                  <div className="p-3 rounded-xl border border-yellow-500/10 bg-yellow-500/5 text-slate-300 space-y-1 text-2xs leading-relaxed">
                    <div className="text-[9px] uppercase font-mono tracking-wider text-yellow-400 flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Sandbox Passcode Intercepted
                    </div>
                    <p className="text-[10px] text-slate-450">
                      We intercepted the standard reset key delivery. Copy this code to verify:
                    </p>
                    <div className="text-center font-mono font-bold text-base tracking-widest text-[#06B6D4] mt-1 bg-slate-900 py-1.5 rounded border border-slate-800">
                      {simulatedCode}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase block font-semibold">Verification Code</label>
                    <input 
                      type="text" 
                      value={codeEntered}
                      onChange={(e) => setCodeEntered(e.target.value)}
                      placeholder="Enter Intercepted Code"
                      className="w-full px-4 py-2 text-center font-mono text-xs rounded-xl border border-slate-900 bg-slate-900/35 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase block font-semibold">New Password</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-900/35 text-xs text-white"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formLoading}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-center cursor-pointer"
                  >
                    Change and Update Password
                  </button>
                </form>
              )}

              {/* OAuth Federated Area */}
              {authMode !== 'forgot' && authMode !== 'reset' && (
                <>
                  <div className="my-5 relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-900" />
                    <span className="flex-shrink mx-3 text-4xs font-mono text-slate-500 tracking-widest uppercase">Or OAuth Federated Gate</span>
                    <div className="flex-grow border-t border-slate-900" />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <button
                      type="button"
                      onClick={() => handleSocialLogin('Google')}
                      className="flex items-center justify-center gap-2 px-3 py-2 border border-slate-900 rounded-xl text-[10px] font-bold text-[#F8FAFC] bg-slate-950 hover:bg-slate-900/50 transition-all cursor-pointer"
                    >
                      <Chrome className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      Google Connect
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSocialLogin('GitHub')}
                      className="flex items-center justify-center gap-2 px-3 py-2 border border-slate-900 rounded-xl text-[10px] font-bold text-[#F8FAFC] bg-slate-950 hover:bg-slate-900/50 transition-all cursor-pointer"
                    >
                      <Github className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      GitHub Signin
                    </button>
                  </div>
                </>
              )}

              {/* Modal dialog footer option toggle */}
              <div className="mt-5 text-center text-xs pt-4 border-t border-slate-900 select-none">
                {authMode === 'login' && (
                  <p className="text-slate-400 font-light text-2xs md:text-xs">
                    Don't have a professional account? &nbsp;
                    <button 
                      type="button"
                      onClick={() => { setAuthMode('signup'); clearMessages(); }}
                      className="font-bold text-[#3B82F6] hover:text-[#06B6D4] cursor-pointer transition-colors"
                    >
                      Create account instead
                    </button>
                  </p>
                )}
                {authMode === 'signup' && (
                  <p className="text-slate-400 font-light text-2xs md:text-xs">
                    Already registered with NextStep? &nbsp;
                    <button 
                      type="button"
                      onClick={() => { setAuthMode('login'); clearMessages(); }}
                      className="font-bold text-[#3B82F6] hover:text-[#06B6D4] cursor-pointer transition-colors"
                    >
                      Sign in instead
                    </button>
                  </p>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- SUCCESSFUL COMPLETED CERTIFICATE OVERLAY --- */}
      <AnimatePresence>
        {selectedCertificateCourse && (
          <div className="fixed inset-0 bg-[#0B1020]/95 z-50 flex items-center justify-center px-4 overflow-y-auto pt-6 pb-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 max-w-2xl w-full relative space-y-6 text-left"
            >
              
              {/* Premium Certificate Frame with Double Border */}
              <div className="border border-double border-slate-800/80 p-6 sm:p-8 rounded-2xl relative bg-slate-950 shadow-inner space-y-6 text-center overflow-hidden select-none">
                <div className="absolute top-0 right-0 w-[45px] h-[45px] bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[55px] h-[55px] bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />

                <div className="flex flex-col items-center space-y-4">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-full border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-2xl animate-spin" style={{ animationDuration: '6s' }}>
                    🏅
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-[#06B6D4] uppercase block font-semibold">
                      VERIFIED ACADEMIC CREDENTIAL
                    </span>
                    <h2 className="text-2xl font-black text-white italic font-serif">
                      Certificate of Course Completion
                    </h2>
                  </div>
                </div>

                <div className="space-y-2 py-4 border-y border-slate-900">
                  <p className="text-xs text-slate-500 font-light">This is proudly presented in verified parameters to</p>
                  <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] via-[#06B6D4] to-[#8B5CF6] tracking-wide">
                    Future Technology Professional
                  </h3>
                  <p className="text-2xs text-slate-400 font-light leading-relaxed max-w-sm mx-auto">
                    for demonstrating high-velocity progress mastery and finishing all required structured learning modules for course:
                  </p>
                  <h4 className="text-sm font-extrabold text-[#06B6D4] mt-2 tracking-wide uppercase font-mono">
                    {selectedCertificateCourse.name}
                  </h4>
                </div>

                {/* Footer validation keys */}
                <div className="flex justify-between items-center text-left pt-2">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-[#8B5CF6] font-mono font-bold block">VERIFICATION SHA256:</span>
                    <span className="text-[9px] text-slate-600 block font-mono">NS_ACADEMY_B9F2A900A_VERIFIED</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-500 block">AUTHORIZED VERBAL MATRIX:</span>
                    <span className="text-[9px] text-slate-300 font-bold block">NEXTSTEP GRADUATE</span>
                  </div>
                </div>

              </div>

              {/* Action layout bar */}
              <div className="flex gap-4 items-center justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const canvasUrl = 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Verification Code: NS-CERTIFICATE-${selectedCertificateCourse.id}`);
                    const triggerLink = document.createElement('a');
                    triggerLink.setAttribute('href', canvasUrl);
                    triggerLink.setAttribute('download', `NextStep_${selectedCertificateCourse.name}_Certificate.txt`);
                    document.body.appendChild(triggerLink);
                    triggerLink.click();
                    document.body.removeChild(triggerLink);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] hover:opacity-95 font-bold text-xs text-white rounded-xl flex items-center gap-1.5 shadow cursor-pointer border border-white/5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Credentials
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCertificateCourse(null)}
                  className="px-4 py-2 border border-slate-850 hover:bg-slate-900 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
