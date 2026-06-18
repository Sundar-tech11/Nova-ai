import { useState, FormEvent } from 'react';
import { useAuth } from './AuthContext';
import { 
  Mail, Lock, User, Sparkles, ArrowRight, ShieldCheck, 
  Github, Chrome, CheckCircle2, RotateCcw, AlertTriangle 
} from 'lucide-react';
import { motion } from 'motion/react';

interface AuthPagesProps {
  onSuccess?: () => void;
  defaultMode?: 'login' | 'signup';
}

export default function AuthPages({ onSuccess, defaultMode = 'login' }: AuthPagesProps) {
  const { login, signup, loginWithGoogle, forgotPassword, resetPasswordSubmit, error: authError } = useAuth();
  
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'reset'>(defaultMode);
  
  // General Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Forgot / Reset passcode States
  const [simulatedCode, setSimulatedCode] = useState('');
  const [codeEntered, setCodeEntered] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // Feedback states
  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const clearMessages = () => {
    setLocalError(null);
    setLocalSuccess(null);
  };

  // Google Integrated Real Authentication & Disable Mock Channels
  const handleSocialLogin = async (provider: 'Google' | 'GitHub') => {
    setLoading(true);
    clearMessages();
    
    if (provider === 'GitHub') {
      setLocalError('GitHub Authentication is deprecated. Please sign in with Google.');
      setLoading(false);
      return;
    }

    try {
      const success = await loginWithGoogle();
      if (success) {
        setLocalSuccess(`Successfully authenticated via Google! Initializing workspace...`);
        if (onSuccess) onSuccess();
      } else {
        setLocalError(authError || 'Google authentication was not completed.');
      }
    } catch (e: any) {
      setLocalError(e.message || 'Social authentication channel failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setLocalError('Please complete all credential fields.');
      return;
    }
    setLoading(true);
    clearMessages();

    const success = await login(email, password, rememberMe);
    if (success) {
      setLocalSuccess('Access granted. Synchronizing secure container profiles...');
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 800);
    } else {
      setLocalError('Incorrect email address or passcode. Please try again.');
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!name || !email || !password || !confirmPassword) {
      setLocalError('Please fulfill all subscription settings.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Confirmed passphrase does not match original passcode.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Passcode strength score too low. Use 6+ characters.');
      return;
    }
    if (!termsAccepted) {
      setLocalError('Agreement to terms and policy parameters is mandatory.');
      return;
    }

    setLoading(true);
    const success = await signup(name, email, password);
    if (success) {
      setLocalSuccess('Security account generated. Preparing cloud sandbox workspace...');
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1000);
    } else {
      setLocalError('This email is already linked to a registered professional account.');
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      setLocalError('Email is required to dispatch reset authorizations.');
      return;
    }
    setLoading(true);
    clearMessages();

    const result = await forgotPassword(email);
    if (result.success) {
      setSimulatedCode(result.resetCode || '123456');
      setLocalSuccess(`A secure reset passcode has been generated! Check console/debug logs.`);
      setMode('reset');
    } else {
      setLocalError(result.error || 'This record is not mapped to an active active user.');
    }
    setLoading(false);
  };

  const handleResetSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!codeEntered || !newPassword) {
      setLocalError('Please fill out verification code and your new password.');
      return;
    }
    if (newPassword.length < 6) {
      setLocalError('New passcode must be at least 6 characters.');
      return;
    }
    setLoading(true);
    clearMessages();

    const res = await resetPasswordSubmit(email, codeEntered, simulatedCode, newPassword);
    if (res.success) {
      setLocalSuccess('Passcode altered successfully. Directing back to login portal...');
      setTimeout(() => {
        setMode('login');
        setPassword('');
        clearMessages();
      }, 1800);
    } else {
      setLocalError(res.error || 'Validation passcode is invalid or mismatching.');
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto relative rounded-2xl border border-slate-800 bg-slate-900/40 p-1 backdrop-blur-xl shadow-2xl select-none">
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 opacity-50 blur-sm pointer-events-none" />
      
      <div className="bg-slate-950/90 rounded-xl px-6 py-8 sm:px-8 border border-slate-800/80">
        
        {/* Header Branding Panel */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/10 bg-indigo-500/5 text-4xs font-mono tracking-widest text-indigo-400 uppercase mb-4">
            <Sparkles className="w-3 h-3 animate-pulse" />
            SaaS Authentication Node
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white mt-1">
            {mode === 'login' && 'Sign in to NextStep'}
            {mode === 'signup' && 'Create Growth Account'}
            {mode === 'forgot' && 'Reset Secure Passcode'}
            {mode === 'reset' && 'Alter Account Password'}
          </h2>
          <p className="text-xs text-slate-400 mt-2 font-light">
            {mode === 'login' && 'Acquire entry to your AI-powered career dashboard.'}
            {mode === 'signup' && 'Register in seconds to construct personal roadmaps.'}
            {mode === 'forgot' && 'Enter your verified email for a simulated reset key.'}
            {mode === 'reset' && 'Fulfill secure passwords to finalize override.'}
          </p>
        </div>

        {/* Dynamic Alerts and Notices */}
        {localError && (
          <motion.div 
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3 rounded-xl border border-red-500/15 bg-red-500/5 text-xs text-red-400 flex items-start gap-2.5"
          >
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{localError}</span>
          </motion.div>
        )}

        {localSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3 rounded-xl border border-emerald-500/15 bg-emerald-500/5 text-xs text-emerald-400 flex items-start gap-2.5"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{localSuccess}</span>
          </motion.div>
        )}

        {/* Authentication Flow forms */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/30 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-light"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase block">Password</label>
                <button 
                  type="button"
                  onClick={() => { setMode('forgot'); clearMessages(); }}
                  className="text-2xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/30 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-light"
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
                  className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500" 
                />
                Remember Me
              </label>
              <span className="text-3xs text-slate-500">Secure AES Session</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Authenticate Entry
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/30 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-light"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.rivera@stanford.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/30 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-light"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase block">Passcode</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/30 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-light"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase block">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/30 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-light"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2.5 text-2xs text-slate-400 cursor-pointer select-none leading-relaxed">
                <input 
                  type="checkbox" 
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="rounded mt-0.5 border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500" 
                />
                <span>I explicitly accept the <strong>Terms & Service Guidelines</strong> and authorize processing via Gemini.</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Register Growth Account
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase block">Registered Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="registered_user@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/30 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-light"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Generate Override Key
                  <RotateCcw className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setMode('login'); clearMessages(); }}
              className="w-full py-2 border border-slate-800/80 rounded-xl text-slate-400 hover:text-slate-300 text-xs hover:bg-slate-900/20 transition-all cursor-pointer"
            >
              Cancel and Return
            </button>
          </form>
        )}

        {mode === 'reset' && (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            
            {/* Display passcode generated on screen so developer/user can override and run straight away */}
            <div className="p-3.5 rounded-xl border border-yellow-500/10 bg-yellow-500/5 text-slate-300 space-y-1 mb-2">
              <div className="text-[10px] uppercase font-mono tracking-wider text-yellow-400 flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" />
                Passcode Intercept: Sandbox Environment
              </div>
              <p className="text-2xs text-slate-400 leading-relaxed font-light">
                We have intercepted your simulated password reset dispatch! Type this override key to altered password: 
              </p>
              <div className="text-center font-mono font-bold text-base tracking-widest text-white mt-1 bg-slate-900 py-1.5 rounded border border-slate-800">
                {simulatedCode}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase block">Verification Code</label>
              <input 
                type="text" 
                value={codeEntered}
                onChange={(e) => setCodeEntered(e.target.value)}
                placeholder="6-Digit Code"
                className="w-full px-4 py-2.5 rounded-xl text-center font-mono text-sm border border-slate-800 bg-slate-900/30 text-white placeholder:text-slate-700 outline-none focus:border-indigo-500 transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase block">New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/30 text-xs text-white placeholder:text-slate-600 outline-none focus:border-indigo-500 transition-all font-light"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 text-center cursor-pointer"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'Commit Password Change' }
            </button>
          </form>
        )}

        {/* Or Break line spacer except for resetting status */}
        {mode !== 'forgot' && mode !== 'reset' && (
          <div className="my-6 relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-900" />
            <span className="flex-shrink mx-4 text-4xs font-mono text-slate-500 tracking-widest uppercase">Or Continue With</span>
            <div className="flex-grow border-t border-slate-900" />
          </div>
        )}

        {/* Google / GitHub Login buttons */}
        {mode !== 'forgot' && mode !== 'reset' && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-800 rounded-xl text-2xs font-semibold text-slate-300 bg-slate-950 hover:bg-slate-900/50 transition-all cursor-pointer"
            >
              <Chrome className="w-3.5 h-3.5 text-red-400 shrink-0" />
              Google Login
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('GitHub')}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-800 rounded-xl text-2xs font-semibold text-slate-300 bg-slate-950 hover:bg-slate-900/50 transition-all cursor-pointer"
            >
              <Github className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              GitHub Signin
            </button>
          </div>
        )}

        {/* Back and forth toggles */}
        <div className="text-center text-xs pt-1 border-t border-slate-900/40">
          {mode === 'login' && (
            <p className="text-slate-400 font-light">
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={() => { setMode('signup'); clearMessages(); }}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors"
              >
                Sign up instead
              </button>
            </p>
          )}

          {mode === 'signup' && (
            <p className="text-slate-400 font-light">
              Already have an account?{' '}
              <button 
                type="button"
                onClick={() => { setMode('login'); clearMessages(); }}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors"
              >
                Sign in instead
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
