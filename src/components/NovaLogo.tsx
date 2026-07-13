import { useState } from 'react';
import { Sparkles, Download, Copy, Check, Eye, Palette, Layers, Cpu, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface LogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

/**
 * Premium Futuristic 'N' App Icon Component
 */
export function NovaLogoIcon({ className = '', size = 48, glow = true }: LogoProps) {
  const filterId = `nova-glow-${size}`;
  const leftGradId = `left-gradient-${size}`;
  const diagGradId = `diag-gradient-${size}`;
  const rightGradId = `right-gradient-${size}`;

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-all duration-300`}
    >
      <defs>
        {glow && (
          <filter id={filterId} x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
        
        <linearGradient id={leftGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" /> {/* Blue */}
          <stop offset="100%" stopColor="#8b5cf6" /> {/* Purple */}
        </linearGradient>
        
        <linearGradient id={diagGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" /> {/* Blue */}
          <stop offset="50%" stopColor="#a855f7" /> {/* Intersecting Purple */}
          <stop offset="100%" stopColor="#06b6d4" /> {/* Cyan */}
        </linearGradient>
        
        <linearGradient id={rightGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" /> {/* Purple */}
          <stop offset="100%" stopColor="#06b6d4" /> {/* Cyan */}
        </linearGradient>
      </defs>

      {/* Decorative Outer Tech Orbit Ring */}
      <circle 
        cx="60" 
        cy="60" 
        r="52" 
        stroke="url(#diag-gradient-show)" 
        strokeWidth="1.2" 
        strokeDasharray="16 10 4 10" 
        opacity="0.25" 
        className="animate-spin" 
        style={{ animationDuration: '30s' }}
      />
      <circle 
        cx="60" 
        cy="60" 
        r="52" 
        stroke="#06b6d4" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeDasharray="2 118" 
        opacity="0.6" 
        filter={glow ? `url(#${filterId})` : undefined}
      />

      {/* Left Column ribbon - angular, modern style */}
      <path 
        d="M28,26 C28,23 30,21 33,21 L43,21 C45,21 46,22 46,24 M46,24 L46,95 C46,98 44,100 41,100 L31,100 C29,100 28,99 28,97 L28,26" 
        fill="url(#left-gradient-show)" 
        opacity="0.85" 
        style={{ filter: glow ? `drop-shadow(0 0 4px rgba(59, 130, 246, 0.45))` : undefined }}
      />
      
      {/* Right Column ribbon */}
      <path 
        d="M74,21 L84,21 C87,21 89,23 89,26 L89,97 C89,99 88,100 86,100 L76,100 C73,100 71,98 71,95 L71,24 C71,22 72,21 74,21" 
        fill="url(#right-gradient-show)" 
        opacity="0.9" 
        style={{ filter: glow ? `drop-shadow(0 0 4px rgba(6, 182, 212, 0.45))` : undefined }}
      />

      {/* Diagonal Bridge ribbon: floating blend layer */}
      <path 
        d="M36,25 L49,21 L82,90 L69,94 Z" 
        fill="url(#diag-gradient-show)" 
        filter={glow ? `url(#${filterId})` : undefined}
        opacity="0.95"
      />

      {/* Embedded High-tech AI nodes */}
      <g filter={glow ? `url(#${filterId})` : undefined}>
        <circle cx="36" cy="25" r="4.5" fill="#60a5fa" />
        <circle cx="82" cy="90" r="4.5" fill="#22d3ee" />
        <circle cx="59.5" cy="57" r="3.5" fill="#c084fc" />
      </g>
      
      {/* Fallback definitions specifically for local renders */}
      <defs>
        <linearGradient id="left-gradient-show" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="diag-gradient-show" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="right-gradient-show" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * Full Premium Logo with Typography Wordmark & Slogan
 */
export function NovaLogoFull({ className = '', size = 44, light = false, glow = true }: LogoProps & { light?: boolean }) {
  return (
    <div className={`flex items-center gap-3.5 ${className} select-none`}>
      <NovaLogoIcon size={size} glow={glow} />
      
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5">
          <span className={`text-xl font-extrabold tracking-[0.2em] font-sans transition-colors duration-300 ${
            light ? 'text-slate-900' : 'text-white'
          }`}>
            NOVA
          </span>
          <span className="text-[10px] bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 font-bold px-2 py-0.5 rounded-md text-white font-mono shadow-[0_0_12px_rgba(139,92,246,0.25)]">
            AI SaaS
          </span>
        </div>
        
        <span className="text-[9px] font-mono tracking-[0.35em] text-slate-400 font-medium uppercase mt-0.5 whitespace-nowrap">
          CAREER MENTOR
        </span>
      </div>
    </div>
  );
}

/**
 * Interactive Premium Logo Showcase Dashboard Interface
 */
export default function NovaLogoShowcase() {
  const [copied, setCopied] = useState<string | null>(null);
  const [glowEnabled, setGlowEnabled] = useState(true);

  const iconSvgCode = `<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="nova-glow" x="-25%" y="-25%" width="150%" height="150%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <linearGradient id="l-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3B82F6"/>
      <stop offset="100%" stop-color="#8B5CF6"/>
    </linearGradient>
    <linearGradient id="d-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3B82F6"/>
      <stop offset="50%" stop-color="#A855F7"/>
      <stop offset="100%" stop-color="#06B6D4"/>
    </linearGradient>
    <linearGradient id="r-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8B5CF6"/>
      <stop offset="100%" stop-color="#06B6D4"/>
    </linearGradient>
  </defs>
  <circle cx="60" cy="60" r="52" stroke="url(#d-grad)" stroke-width="1.2" stroke-dasharray="16 10 4 10" opacity="0.25"/>
  <circle cx="60" cy="60" r="52" stroke="#06B6D4" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="2 118" opacity="0.6" filter="url(#nova-glow)"/>
  <path d="M28,26 C28,23 30,21 33,21 L43,21 C45,21 46,22 46,24 L46,95 C46,98 44,100 41,100 L31,100 C29,100 28,99 28,97 L28,26" fill="url(#l-grad)" opacity="0.85"/>
  <path d="M74,21 L84,21 C87,21 89,23 89,26 L89,97 C89,99 88,100 86,100 L76,100 C73,100 71,98 71,95 L71,24 C71,22 72,21 74,21" fill="url(#r-grad)" opacity="0.9"/>
  <path d="M36,25 L49,21 L82,90 L69,94 Z" fill="url(#d-grad)" filter="url(#nova-glow)" opacity="0.95"/>
  <g filter="url(#nova-glow)">
    <circle cx="36" cy="25" r="4.5" fill="#60A5FA"/>
    <circle cx="82" cy="90" r="4.5" fill="#22D3EE"/>
    <circle cx="59.5" cy="57" r="3.5" fill="#C084FC"/>
  </g>
</svg>`;

  const handleCopyCode = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownloadSVG = () => {
    const element = document.createElement("a");
    const file = new Blob([iconSvgCode], {type: 'image/svg+xml'});
    element.href = URL.createObjectURL(file);
    element.download = "nova_logo_app_icon.svg";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 select-none text-left animate-slide-up space-y-10">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl border border-white/[0.04] bg-slate-950/40 p-8 overflow-hidden select-none shadow-2xl shadow-indigo-950/40">
        <div className="absolute top-0 right-0 h-full w-[45%] bg-gradient-to-l from-indigo-600/10 to-transparent blur-[80px] pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/15 bg-indigo-500/5 text-4xs font-mono tracking-widest text-indigo-400 uppercase">
              <Sparkles className="w-3" />
              Brand Asset Management
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-none">
              NOVA Premium Brand Identity
            </h1>
            <p className="text-sm text-slate-400 font-light max-w-xl leading-relaxed">
              Explore the design guidelines, vector source components, and multiple responsive variations of the NOVA logo optimized for dark mode SaaS applications.
            </p>
          </div>
          
          <div className="flex gap-3 shrink-0">
            <button 
              onClick={() => setGlowEnabled(!glowEnabled)}
              className={`px-4 py-2.5 rounded-xl border font-mono text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                glowEnabled 
                  ? 'bg-cyan-550/15 border-cyan-500/30 text-cyan-400' 
                  : 'bg-[#090d16] border-white/5 text-slate-500'
              }`}
            >
              <Cpu className="w-4 h-4" /> SVG Glow: {glowEnabled ? 'ON' : 'OFF'}
            </button>
            <button 
              onClick={handleDownloadSVG}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-95 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md"
            >
              <Download className="w-4 h-4" /> Download SVG
            </button>
          </div>
        </div>
      </div>

      {/* Grid Layout of Showcase Variations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* App Icon Presentation */}
        <div className="md:col-span-1 rounded-3xl border border-white/[0.04] bg-slate-950/20 p-6 flex flex-col justify-between shadow-lg relative min-h-[350px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest font-mono">App Icon Version</span>
              <span className="text-4xs font-mono font-bold bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/15">Vector Base</span>
            </div>
            <p className="text-xs text-slate-400 font-light leading-relaxed mb-6">
              A futuristic geometric ribbon arrangement outlining the letter <strong>N</strong>. Intersected with high-tech AI nodes and bounded by a complex stellar orbit ring.
            </p>
          </div>
          
          {/* Active Canvas Mockup Center */}
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-950/70 border border-white/[0.03] rounded-2xl relative overflow-hidden group shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-cyan-400/5 opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" />
            <NovaLogoIcon size={110} glow={glowEnabled} className="relative z-10 transform scale-100 group-hover:scale-105 duration-500" />
          </div>
          
          <div className="flex items-center justify-between mt-4 text-[10px] text-slate-500 font-mono">
            <span>Dimensions: Responsive</span>
            <span>Optimized: 120x120 SVG</span>
          </div>
        </div>

        {/* Full Wordmark Presentation */}
        <div className="md:col-span-2 rounded-3xl border border-white/[0.04] bg-slate-950/20 p-6 flex flex-col justify-between shadow-lg relative min-h-[350px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest font-mono">Full Logo Version</span>
              <span className="text-4xs font-mono font-bold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/15">Subtle Glow</span>
            </div>
            <p className="text-xs text-slate-400 font-light leading-relaxed mb-6">
              The full version pairs the geometric icon with a wide-tracked modern typographic wordmark and a secondary identifier designating its professional specialty.
            </p>
          </div>

          {/* Large scale grid banner */}
          <div className="flex-1 flex flex-col gap-6 items-center justify-center p-8 bg-[#040811] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] border border-white/[0.03] rounded-2xl relative shadow-inner">
            <div className="absolute top-4 right-4 text-3xs font-mono text-cyan-400 select-none">GRID MESH: active</div>
            <NovaLogoFull size={48} glow={glowEnabled} />
          </div>

          <div className="flex items-center justify-between mt-4 text-[10px] text-slate-500 font-mono">
            <span>Primary Typography: Plus Jakarta Sans / Inter</span>
            <span>Secondary Typography: JetBrains Mono</span>
          </div>
        </div>

      </div>

      {/* Theme Compatibility & Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Colors Palette & Geometry */}
        <div className="rounded-3xl border border-white/[0.04] bg-slate-950/20 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-400" /> Color Spec & Hex Weights
            </h3>
            <span className="text-4xs font-mono text-slate-500">HEX SPECTRUM</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-slate-950/50 p-3 rounded-xl border border-white/[0.03]">
              <div className="w-10 h-10 rounded-lg bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
              <div className="flex-1 select-all">
                <p className="text-xs font-bold text-white font-mono">#3B82F6</p>
                <p className="text-[10px] text-slate-400">Deep Cosmic Blue - Signifies stability, deep analytical machine learning wisdom.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-950/50 p-3 rounded-xl border border-white/[0.03]">
              <div className="w-10 h-10 rounded-lg bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
              <div className="flex-1 select-all">
                <p className="text-xs font-bold text-white font-mono">#A855F7</p>
                <p className="text-[10px] text-slate-400">Hyper Purple Accent - Marks artificial intelligence transitions and data convergence.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-950/50 p-3 rounded-xl border border-white/[0.03]">
              <div className="w-10 h-10 rounded-lg bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
              <div className="flex-1 select-all">
                <p className="text-xs font-bold text-white font-mono">#06B6D4</p>
                <p className="text-[10px] text-slate-400">Cyber Neon Cyan - Marks active guidance lines, fast growth, and high technology.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dark Mode and Contrast Testing */}
        <div className="rounded-3xl border border-white/[0.04] bg-slate-950/20 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" /> Contrast & Canvas Mockups
            </h3>
            <span className="text-4xs font-mono text-slate-500">MOCK TESTING</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            
            {/* Deep Slate Dark */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 flex flex-col items-center justify-center min-h-[120px] relative overflow-hidden group">
              <span className="absolute top-2 left-2 text-[8px] font-mono text-slate-500">BG: #020617</span>
              <NovaLogoIcon size={44} glow={glowEnabled} />
              <span className="text-4xs font-mono text-slate-400 mt-2 font-bold uppercase tracking-wider">Deep Space</span>
            </div>

            {/* Rich Navy */}
            <div className="p-4 bg-[#0B1528] rounded-2xl border border-blue-500/10 flex flex-col items-center justify-center min-h-[120px] relative overflow-hidden group">
              <span className="absolute top-2 left-2 text-[8px] font-mono text-slate-505">BG: #0B1528</span>
              <NovaLogoIcon size={44} glow={glowEnabled} />
              <span className="text-4xs font-mono text-slate-300 mt-2 font-bold uppercase tracking-wider">Cyber Blue</span>
            </div>

            {/* Pure Stark White / Light Mode */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center min-h-[120px] relative overflow-hidden group">
              <span className="absolute top-2 left-2 text-[8px] font-mono text-slate-400">BG: #FFFFFF</span>
              <NovaLogoIcon size={44} glow={false} />
              <span className="text-4xs font-mono text-slate-800 mt-2 font-bold uppercase tracking-wider">Absolute Light</span>
            </div>

            {/* Glassmorphic Translucent */}
            <div className="p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 flex flex-col items-center justify-center min-h-[120px] relative overflow-hidden group">
              <span className="absolute top-2 left-2 text-[8px] font-mono text-slate-400">BG: Glass 10%</span>
              <NovaLogoIcon size={44} glow={glowEnabled} />
              <span className="text-4xs font-mono text-indigo-300 mt-2 font-bold uppercase tracking-wider">Glassmorphic</span>
            </div>

          </div>
        </div>

      </div>

      {/* SVG Source Embeds Workspace */}
      <div className="rounded-3xl border border-white/[0.04] bg-slate-950/20 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" /> Embedded Code Explorer
          </h3>
          <span className="text-4xs font-mono text-slate-500">RAW VECTOR CODE</span>
        </div>

        <p className="text-xs text-slate-400 font-light leading-relaxed">
          Copy and use this pure SVG code directly in your HTML templates, stylesheets, and third-party dashboards like GitHub, Vercel, or Figma components.
        </p>

        <div className="relative rounded-2xl bg-slate-950/80 border border-white/[0.04] p-4 font-mono text-[11px] leading-relaxed text-slate-300 overflow-x-auto max-h-[220px]">
          <button 
            onClick={() => handleCopyCode(iconSvgCode, 'svg')}
            className={`absolute top-3 right-3 p-2 rounded-xl border text-3xs font-bold tracking-wider font-sans transition-all duration-300 flex items-center gap-1 cursor-pointer ${
              copied === 'svg' 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {copied === 'svg' ? (
              <>
                <Check className="w-3.5 h-3.5" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Code
              </>
            )}
          </button>
          
          <pre>{iconSvgCode}</pre>
        </div>
      </div>

    </div>
  );
}
