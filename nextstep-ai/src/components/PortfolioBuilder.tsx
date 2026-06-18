import { useState, useEffect } from 'react';
import { 
  User, Mail, Link, Plus, Trash2, Award, Briefcase, ExternalLink, 
  Globe, Sparkles, Upload, Save, CheckCircle, Badge, Check 
} from 'lucide-react';
import { useAuth } from './AuthContext';

interface PortfolioProject {
  title: string;
  desc: string;
  tech: string;
  link: string;
}

interface PortfolioCertificate {
  title: string;
  issuer: string;
  year: string;
}

export default function PortfolioBuilder() {
  const { user, updateProfile } = useAuth();
  
  // Preset default data, sync with SaaS user profile context securely
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.bio ? 'Software Professional' : '');
  const [location, setLocation] = useState('');
  const [about, setAbout] = useState(user?.bio || '');
  const [skillsCsv, setSkillsCsv] = useState(user?.skills ? user.skills.join(', ') : '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [isAimlBadgeActive, setIsAimlBadgeActive] = useState(false);

  const [projects, setProjects] = useState<PortfolioProject[]>([]);

  const [certificates, setCertificates] = useState<PortfolioCertificate[]>([]);

  const [gitLink, setGitLink] = useState(user?.github || '');
  const [linkedLink, setLinkedLink] = useState(user?.linkedin || '');
  const [emailText, setEmailText] = useState(user?.email || '');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state variables from authenticated user object
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAbout(user.bio || '');
      setEmailText(user.email || '');
      setGitLink(user.github || '');
      setLinkedLink(user.linkedin || '');
      setAvatar(user.avatar || '');
      if (user.skills && user.skills.length > 0) {
        setSkillsCsv(user.skills.join(', '));
      }
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    const skillsArray = skillsCsv.split(',').map(s => s.trim()).filter(Boolean);
    const success = await updateProfile({
      name,
      bio: about,
      github: gitLink,
      linkedin: linkedLink,
      portfolio: emailText,
      skills: skillsArray,
      avatar: avatar
    });

    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
    setIsSaving(false);
  };

  const handleAvatarUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setAvatar(base64String);
    };
    reader.readAsDataURL(file);
  };

  // New item form inputs
  const [pTitle, setPTitle] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pTech, setPTech] = useState('');
  const [pLink, setPLink] = useState('');

  const [cTitle, setCTitle] = useState('');
  const [cIssuer, setCIssuer] = useState('');
  const [cYear, setCYear] = useState('');

  // Active Skin Selection for custom styling live previews
  const [selectedSkin, setSelectedSkin] = useState<'Cosmic Minimalist' | 'Ocean Glass' | 'Terminal Mono'>('Cosmic Minimalist');

  const handleAddProject = () => {
    if (!pTitle.trim()) return;
    setProjects([...projects, { title: pTitle.trim(), desc: pDesc.trim(), tech: pTech.trim(), link: pLink.trim() }]);
    setPTitle('');
    setPDesc('');
    setPTech('');
    setPLink('');
  };

  const handleRemoveProject = (index: number) => {
    setProjects(projects.filter((_, idx) => idx !== index));
  };

  const handleAddCertificate = () => {
    if (!cTitle.trim()) return;
    setCertificates([...certificates, { title: cTitle.trim(), issuer: cIssuer.trim(), year: cYear.trim() }]);
    setCTitle('');
    setCIssuer('');
    setCYear('');
  };

  const handleRemoveCertificate = (index: number) => {
    setCertificates(certificates.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header sections */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
        <div>
          <div className="flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-wider">
            <Globe className="w-4 h-4 text-pink-400" />
            Candidate Showcase Suite
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Live Portfolio Builder</h2>
          <p className="text-slate-400 text-sm font-light mt-1">Populate profile details, list showcase projects, and render dynamic live cards formatted for professional portfolios.</p>
        </div>

        {/* Skin selects */}
        <div className="flex gap-2 bg-slate-900/60 p-1 border border-slate-800 rounded-xl max-w-xs self-start md:self-auto select-none">
          {(['Cosmic Minimalist', 'Ocean Glass', 'Terminal Mono'] as const).map((skin) => (
            <button
              key={skin}
              onClick={() => setSelectedSkin(skin)}
              className={`px-3 py-1.5 text-3xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedSkin === skin 
                  ? 'bg-pink-500/10 border border-pink-500/20 text-pink-400' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {skin.split(' ')[1]} Skin
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
        
        {/* Left column Settings Configurator Forms */}
        <div className="space-y-6 max-h-[800px] overflow-y-auto pr-0 lg:pr-2 scrollbar-thin">
          
          {/* About Me Details Form */}
          <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
                <User className="w-4 h-4 text-pink-400" /> Profile Headers
              </h4>
              {user && (
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="px-3.5 py-1.5 rounded-lg text-3xs font-bold text-white bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 flex items-center gap-1.5 transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isSaving ? (
                    <span className="w-3 h-3 border border-white/20 border-t-white rounded-full animate-spin" />
                  ) : saveSuccess ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Save className="w-3 h-3" />
                  )}
                  {saveSuccess ? 'Saved to SaaS' : 'Save Changes'}
                </button>
              )}
            </div>
            
            {/* Avatar & Badge row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/40 p-4 rounded-xl border border-slate-900">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-wider text-slate-500 uppercase block">Profile Photo</label>
                <div className="flex items-center gap-3">
                  {avatar ? (
                    <img src={avatar} className="w-12 h-12 rounded-full object-cover border border-slate-800" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-indigo-950 border border-indigo-900/50 flex items-center justify-center text-indigo-400 font-black text-sm">
                      {name ? name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <label className="px-3 py-1.5 rounded border border-slate-800 hover:border-slate-700 bg-slate-900/40 text-3xs text-slate-300 font-bold tracking-tight cursor-pointer flex items-center gap-1.5 transition-all">
                    <Upload className="w-3 h-3" />
                    Upload Image
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="space-y-1.5 flex flex-col justify-center">
                <label className="text-[10px] font-mono tracking-wider text-slate-500 uppercase block">Badge Validation</label>
                <label className="flex items-center gap-2 text-2xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isAimlBadgeActive}
                    onChange={(e) => setIsAimlBadgeActive(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-950 text-pink-600 focus:ring-pink-500"
                  />
                  <span>AIML Student Badge Enabled</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-3xs font-bold text-slate-500 uppercase">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-3xs font-bold text-slate-500 uppercase">Projected Headline</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-3xs font-bold text-slate-500 uppercase">Target Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-3xs font-bold text-slate-500 uppercase">Skills (Comma Seperated)</label>
                <input
                  type="text"
                  value={skillsCsv}
                  onChange={(e) => setSkillsCsv(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-3xs font-bold text-slate-500 uppercase">About Me summary</label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Social connections Form */}
          <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
              <Mail className="w-4 h-4 text-pink-400" /> Professional Connections
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-3xs font-bold text-slate-500 uppercase">Email Address</label>
                <input
                  type="text"
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-3xs font-bold text-slate-500 uppercase">GitHub Profile URL</label>
                <input
                  type="text"
                  value={gitLink}
                  onChange={(e) => setGitLink(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-3xs font-bold text-slate-500 uppercase">LinkedIn Profile URL</label>
                <input
                  type="text"
                  value={linkedLink}
                  onChange={(e) => setLinkedLink(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Projects Creator Form */}
          <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-pink-400" /> Dynamic Portfolio Projects
            </h4>

            {/* List Active projects with delete option */}
            <div className="space-y-2">
              {projects.map((proj, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-950/40 p-2.5 px-3.5 rounded-lg border border-slate-900">
                  <div>
                    <h5 className="text-xs font-bold text-slate-200 leading-none">{proj.title}</h5>
                    <span className="text-[10px] text-slate-500 leading-none block mt-1">{proj.tech}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveProject(idx)}
                    className="p-1.5 rounded-md hover:bg-slate-900 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Create Project inputs */}
            <div className="border-t border-slate-800/80 pt-4 space-y-3 font-light text-xs">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Project Name"
                  value={pTitle}
                  onChange={(e) => setPTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded p-2 text-2xs text-slate-300 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Tech Stack Used (e.g. PyTorch, React)"
                  value={pTech}
                  onChange={(e) => setPTech(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded p-2 text-2xs text-slate-300 focus:outline-none"
                />
              </div>
              <textarea
                placeholder="Brief project documentation of accomplishments..."
                value={pDesc}
                onChange={(e) => setPDesc(e.target.value)}
                rows={2}
                className="w-full bg-slate-950 border border-slate-900 rounded p-2 text-2xs text-slate-300 focus:outline-none"
              />
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Repository URL Link"
                  value={pLink}
                  onChange={(e) => setPLink(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded p-2 text-2xs text-slate-300 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddProject}
                  disabled={!pTitle.trim()}
                  className="px-4 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/15 font-bold rounded text-2xs flex items-center gap-1 shrink-0 cursor-pointer disabled:opacity-30"
                >
                  <Plus className="w-3 h-3" /> Insert Project
                </button>
              </div>
            </div>
          </div>

          {/* Certificates Creator Form */}
          <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
              <Award className="w-4 h-4 text-pink-400" /> Verified Credentials
            </h4>

            {/* List Active certificates */}
            <div className="space-y-2">
              {certificates.map((cert, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-950/40 p-2.5 px-3.5 rounded-lg border border-slate-900">
                  <div>
                    <h5 className="text-xs font-bold text-slate-200 leading-none">{cert.title}</h5>
                    <span className="text-[10px] text-slate-500 block mt-1 leading-none">{cert.issuer} • {cert.year}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveCertificate(idx)}
                    className="p-1.5 rounded-md hover:bg-slate-900 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Certificate input form */}
            <div className="border-t border-slate-800/80 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 font-light text-xs">
              <input
                type="text"
                placeholder="Credential Title"
                value={cTitle}
                onChange={(e) => setCTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-900 rounded p-2 text-2xs text-slate-300 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Issuer Company"
                value={cIssuer}
                onChange={(e) => setCIssuer(e.target.value)}
                className="w-full bg-slate-950 border border-slate-900 rounded p-2 text-2xs text-slate-300 focus:outline-none"
              />
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Year"
                  value={cYear}
                  onChange={(e) => setCYear(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded p-2 text-2xs text-slate-300 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCertificate}
                  disabled={!cTitle.trim()}
                  className="px-4 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/15 font-bold rounded text-2xs flex items-center gap-1 shrink-0 cursor-pointer disabled:opacity-30"
                >
                  <Plus className="w-3 h-3" /> Add Certificate
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right column LIVE PREVIEW skin rendering */}
        <div className="relative sticky top-6">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2 block select-none">Live Candidate Portfolio Card</span>
          
          <div className={`rounded-3xl border p-8 shadow-2xl relative overflow-hidden transition-all duration-300 ${
            selectedSkin === 'Cosmic Minimalist'
              ? 'bg-slate-950 border-pink-500/10 text-slate-100 shadow-[0_4px_40px_rgba(244,63,94,0.05)]'
              : selectedSkin === 'Ocean Glass'
                ? 'bg-gradient-to-br from-slate-900/90 to-blue-950/70 border-cyan-500/20 text-cyan-50 shadow-[0_4px_40px_rgba(6,182,212,0.1)] backdrop-blur-md'
                : 'bg-black border-slate-800 text-emerald-400 shadow-[0_4px_30px_rgba(16,185,129,0.03)] font-mono'
          }`} style={{ minHeight: '620px' }}>
            
            {/* Ambient Background Glow for Cosmic/Ocean styles */}
            {selectedSkin === 'Cosmic Minimalist' && (
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-pink-500/5 blur-[50px] pointer-events-none" />
            )}
            {selectedSkin === 'Ocean Glass' && (
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-cyan-500/5 blur-[50px] pointer-events-none" />
            )}

            {/* Main Header Card Block */}
            <div className="space-y-4">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div className="flex gap-4 items-center">
                  {avatar ? (
                    <img src={avatar} className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500/20 shadow-md" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 font-extrabold text-sm select-none shrink-0">
                      {name ? name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`text-xl sm:text-2xl font-black ${
                        selectedSkin === 'Terminal Mono' ? 'text-emerald-400 font-bold' : 'text-slate-100 font-black'
                      }`}>{name || 'Candidate Name'}</h3>
                      
                      {isAimlBadgeActive && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-widest bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30">
                          ★ AIML Student
                        </span>
                      )}
                    </div>
                    <span className={`text-2xs sm:text-xs block font-semibold ${
                      selectedSkin === 'Cosmic Minimalist' ? 'text-pink-400' : selectedSkin === 'Ocean Glass' ? 'text-cyan-400' : 'text-slate-400'
                    }`}>{role || 'Showcase Subtitle'}</span>
                  </div>
                </div>
                
                <span className={`text-[10px] border px-2.5 py-1 rounded font-mono ${
                  selectedSkin === 'Terminal Mono' ? 'border-emerald-500/30 text-emerald-400' : 'border-slate-800 text-slate-500'
                }`}>{location || 'Location'}</span>
              </div>

              {/* CSV Skills parser */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {skillsCsv.split(',').filter(x => x.trim()).map((sk) => (
                  <span 
                    key={sk} 
                    className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                      selectedSkin === 'Cosmic Minimalist' 
                        ? 'bg-pink-500/10 border-pink-500/20 text-pink-300' 
                        : selectedSkin === 'Ocean Glass' 
                          ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300' 
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {sk.trim()}
                  </span>
                ))}
              </div>

              {/* Bio summary */}
              <p className={`text-xs leading-relaxed font-light mt-3 ${
                selectedSkin === 'Terminal Mono' ? 'text-emerald-500/80 font-mono' : 'text-slate-400 font-light'
              }`}>{about || 'Add custom professional introductory descriptions...'}</p>
            </div>

            {/* Divider lines */}
            <div className="w-full h-px bg-slate-900 my-6" />

            {/* Projects list preview */}
            <div className="space-y-4">
              <span className={`text-3xs uppercase font-bold block ${
                selectedSkin === 'Terminal Mono' ? 'text-emerald-400 tracking-wider' : 'text-slate-500'
              }`}>SHOWCASE WORK</span>
              
              <div className="grid grid-cols-1 gap-4">
                {projects.map((proj, i) => (
                  <div key={i} className={`p-4 rounded-xl border flex flex-col justify-between ${
                    selectedSkin === 'Terminal Mono' 
                      ? 'border-emerald-500/10 bg-black' 
                      : 'border-slate-900 bg-slate-950/40'
                  }`}>
                    <div>
                      <div className="flex justify-between items-center">
                        <h5 className="text-xs font-bold text-slate-200">{proj.title}</h5>
                        {proj.link && (
                          <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-300">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 font-light leading-relaxed">{proj.desc}</p>
                    </div>
                    <span className="text-[9px] font-mono text-purple-400 mt-2 block">{proj.tech}</span>
                  </div>
                ))}
                {projects.length === 0 && (
                  <span className="text-xs text-slate-600 block italic leading-none font-light">No highlight projects added yet.</span>
                )}
              </div>
            </div>

            {/* Divider lines */}
            <div className="w-full h-px bg-slate-900 my-6" />

            {/* Verified Certifications check panel */}
            <div className="space-y-4">
              <span className={`text-3xs uppercase font-bold block ${
                selectedSkin === 'Terminal Mono' ? 'text-emerald-400 tracking-wider' : 'text-slate-500'
              }`}>VERIFIED CERTIFICATES</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certificates.map((cert, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start">
                    <span className={`p-1.5 rounded-lg border text-xs shrink-0 mt-0.5 ${
                      selectedSkin === 'Cosmic Minimalist' 
                        ? 'border-pink-500/15 text-pink-400 bg-pink-500/10' 
                        : selectedSkin === 'Ocean Glass' 
                          ? 'border-cyan-500/15 text-cyan-400 bg-cyan-500/10'
                          : 'border-slate-800 text-slate-500 bg-slate-900'
                    }`}>★</span>
                    <div>
                      <h5 className="text-2xs font-bold text-slate-200 leading-tight">{cert.title}</h5>
                      <span className="text-[9px] text-slate-500 mt-0.5 block">{cert.issuer} • '{cert.year}</span>
                    </div>
                  </div>
                ))}
                {certificates.length === 0 && (
                  <span className="text-xs text-slate-600 italic block leading-none font-light">No verified credentials listed.</span>
                )}
              </div>
            </div>

            {/* Social linkages footer lines */}
            <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between border-t border-slate-900 pt-4">
              <span className="text-3xs font-mono text-slate-600">Generated on NextStep AI</span>
              
              <div className="flex gap-3 text-slate-500 text-xs">
                {emailText && <a href={`mailto:${emailText}`} className="hover:text-slate-300" title="Email Candidate"><Mail className="w-3.5 h-3.5" /></a>}
                {gitLink && <a href={gitLink} target="_blank" rel="noopener noreferrer" className="hover:text-slate-300" title="GitHub"><Link className="w-3.5 h-3.5" /></a>}
                {linkedLink && <a href={linkedLink} target="_blank" rel="noopener noreferrer" className="hover:text-slate-300" title="LinkedIn"><Link className="w-3.5 h-3.5" /></a>}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Simulated Portfolio Builder Complete Callback footer */}
      <div className="rounded-2xl border border-slate-900 bg-slate-900/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <div className="flex gap-3 items-start text-left">
          <Sparkles className="w-6 h-6 text-pink-400 shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-slate-200">Portfolio Card Locked</h5>
            <p className="text-2xs text-slate-400 leading-relaxed font-light mt-0.5">Your dynamic builders are kept synchronized in offline safety. Showcase this complete setup on your professional profiles!</p>
          </div>
        </div>

        <button
          onClick={() => {
            alert(`Direct export is locked during Sandbox. Copy standard URLs on footer links to append: \nGitHub: ${gitLink} \nLinkedIn: ${linkedLink}`);
          }}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 font-bold text-white text-xs whitespace-nowrap cursor-pointer transition-all"
        >
          Export & Get Showcase Link
        </button>
      </div>

    </div>
  );
}
