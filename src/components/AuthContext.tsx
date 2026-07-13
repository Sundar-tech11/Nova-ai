import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut, linkWithCredential, fetchSignInMethodsForEmail } from '../lib/firebase';

export interface UserProfile {
  id: string;
  name: string;
  full_name: string;
  email: string;
  bio: string;
  avatar: string;
  avatar_url: string;
  github: string;
  github_url: string;
  linkedin: string;
  linkedin_url: string;
  portfolio: string;
  skills: string[];
  createdAt: string;
  created_at: string;
  onboardingCompleted?: boolean;
  onboarding_completed?: boolean;
  skillsProgress?: any[];
  learningGoals?: any[];
}

export interface DashboardSummary {
  stats: {
    resumesCount: number;
    roadmapsCount: number;
    interviewsCount: number;
    avgResumeScore: number;
    avgInterviewScore: number;
    skillsCount: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'resume' | 'roadmap' | 'interview';
    title: string;
    subtitle: string;
    timestamp: string;
  }>;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginWithGithub: () => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<boolean>;
  getDashboardSummary: () => Promise<DashboardSummary | null>;
  getSavedResumes: () => Promise<any[]>;
  deleteSavedResume: (id: string) => Promise<boolean>;
  getSavedRoadmaps: () => Promise<any[]>;
  deleteSavedRoadmap: (id: string) => Promise<boolean>;
  getSavedInterviews: () => Promise<any[]>;
  deleteSavedInterview: (id: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<{ success: boolean; resetCode?: string; error?: string }>;
  resetPasswordSubmit: (email: string, resetCodeEntered: string, actualCode: string, newPw: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingGithubCred, setPendingGithubCred] = useState<any>(null);

  // Restore authenticated states on launch
  useEffect(() => {
    async function restoreSession() {
      try {
        const storedToken = localStorage.getItem('ns_session_token') || sessionStorage.getItem('ns_session_token');
        if (storedToken) {
          const res = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${storedToken}`
            }
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
            setToken(storedToken);
          } else {
            // Token expired/invalid
            localStorage.removeItem('ns_session_token');
            sessionStorage.removeItem('ns_session_token');
          }
        }
      } catch (err) {
        console.error('Session restoration failed', err);
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  const login = async (email: string, password: string, rememberMe = false) => {
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        data = { error: 'Invalid response from server' };
      }
      if (!res.ok) {
        setError(data.error || 'Authentication failed.');
        return false;
      }
      setUser(data.user);
      setToken(data.token);
      if (rememberMe) {
        localStorage.setItem('ns_session_token', data.token);
      } else {
        sessionStorage.setItem('ns_session_token', data.token);
      }
      return true;
    } catch (err: any) {
      setError('Connection refused by SaaS server.');
      return false;
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;

      if (!googleUser || !googleUser.email) {
        throw new Error('Could not retrieve details from your Google profile.');
      }

      // After successful authentication, link the GitHub credential to the existing Firebase account using linkWithCredential()
      if (pendingGithubCred) {
        try {
          await linkWithCredential(googleUser, pendingGithubCred);
          console.log('Successfully linked GitHub credential to the existing Firebase Google account.');
        } catch (linkErr: any) {
          console.error('Failed to link GitHub credential to existing Google account:', linkErr);
        } finally {
          setPendingGithubCred(null);
        }
      }

      const res = await fetch('/api/auth/google-sso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: googleUser.uid,
          name: googleUser.displayName || 'Google User',
          email: googleUser.email,
          avatar: googleUser.photoURL || ''
        })
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        data = { error: 'Invalid response from server' };
      }

      if (!res.ok) {
        const errMsg = data.error || 'Identity registration failed via Google SSO.';
        setError(errMsg);
        return { success: false, error: errMsg };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('ns_session_token', data.token);
      return { success: true };
    } catch (err: any) {
      console.error('Google authorization error:', err);
      if (err?.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Google login popup was closed.' };
      }

      let errMsg = err.message || 'Google account pairing rejected.';
      const isUnauthorizedDomain = err?.code === 'auth/unauthorized-domain' || 
                                  (err?.message && err.message.includes('unauthorized-domain'));

      if (isUnauthorizedDomain) {
        errMsg = `Google Sign-In is not authorized for this domain (${window.location.hostname}). Please log in or sign up using the standard Email/Password form below to immediately access your dashboard!`;
      }

      setError(errMsg);
      return { success: false, error: errMsg };
    }
  };

  const loginWithGithub = async () => {
    setError(null);
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const githubUser = result.user;

      if (!githubUser) {
        throw new Error('Could not retrieve details from your GitHub profile.');
      }

      const res = await fetch('/api/auth/github-sso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: githubUser.uid,
          name: githubUser.displayName || 'GitHub User',
          email: githubUser.email,
          avatar: githubUser.photoURL || ''
        })
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        data = { error: 'Invalid response from server' };
      }

      if (!res.ok) {
        const errMsg = data.error || 'Identity registration failed via GitHub SSO.';
        setError(errMsg);
        return { success: false, error: errMsg };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('ns_session_token', data.token);
      return { success: true };
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'GitHub login popup was closed.' };
      }

      if (err?.code === 'auth/account-exists-with-different-credential') {
        const email = err.customData?.email || err.email;
        const pendingCred = GithubAuthProvider.credentialFromError(err);
        if (pendingCred) {
          setPendingGithubCred(pendingCred);
        }

        let providerName = 'Google';
        try {
          if (email) {
            const methods = await fetchSignInMethodsForEmail(auth, email);
            if (methods && methods.length > 0) {
              if (methods.includes('google.com')) {
                providerName = 'Google';
              } else if (methods.includes('password')) {
                providerName = 'Email/Password';
              } else {
                const firstMethod = methods[0].replace('.com', '');
                providerName = firstMethod.charAt(0).toUpperCase() + firstMethod.slice(1);
              }
            }
          }
        } catch (fetchErr) {
          console.warn('Non-fatal: Failed to fetch sign in methods:', fetchErr);
        }

        const errMsg = `An account with the email ${email} is already associated with ${providerName}. Please sign in using ${providerName} first to link your GitHub profile.`;
        setError(errMsg);
        return { success: false, error: errMsg };
      }

      console.error('GitHub authorization error:', err);

      let errMsg = err.message || 'GitHub account pairing rejected.';
      const isUnauthorizedDomain = err?.code === 'auth/unauthorized-domain' || 
                                  (err?.message && err.message.includes('unauthorized-domain'));

      if (isUnauthorizedDomain) {
        errMsg = `GitHub Sign-In is not authorized for this domain (${window.location.hostname}). Please log in or sign up using the standard Email/Password form below to immediately access your dashboard!`;
      }

      setError(errMsg);
      return { success: false, error: errMsg };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setError(null);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        data = { error: 'Invalid response from server' };
      }
      if (!res.ok) {
        setError(data.error || 'Sign up registration failed.');
        return false;
      }
      setUser(data.user);
      setToken(data.token);
      sessionStorage.setItem('ns_session_token', data.token);
      return true;
    } catch (err: any) {
      setError('Could not establish connection to sign up.');
      return false;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Error during backend session cleanup', err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('ns_session_token');
      sessionStorage.removeItem('ns_session_token');
      setIsLoading(false);
    }
  };

  const updateProfile = async (fields: Partial<UserProfile>) => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...user, ...fields })
      });
      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to save profile attributes', err);
      return false;
    }
  };

  const getDashboardSummary = async (): Promise<DashboardSummary | null> => {
    try {
      const res = await fetch('/api/user/dashboard-summary', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const getSavedResumes = async () => {
    try {
      const res = await fetch('/api/resumes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) return await res.json();
      return [];
    } catch (err) {
      return [];
    }
  };

  const deleteSavedResume = async (id: string) => {
    try {
      const res = await fetch(`/api/resumes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  const getSavedRoadmaps = async () => {
    try {
      const res = await fetch('/api/roadmaps', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) return await res.json();
      return [];
    } catch (err) {
      return [];
    }
  };

  const deleteSavedRoadmap = async (id: string) => {
    try {
      const res = await fetch(`/api/roadmaps/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  const getSavedInterviews = async () => {
    try {
      const res = await fetch('/api/interviews', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) return await res.json();
      return [];
    } catch (err) {
      return [];
    }
  };

  const deleteSavedInterview = async (id: string) => {
    try {
      const res = await fetch(`/api/interviews/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        data = { error: 'Invalid response from server' };
      }
      if (res.ok) {
        return { success: true, resetCode: data.resetCode };
      }
      return { success: false, error: data.error };
    } catch (err: any) {
      return { success: false, error: 'Connection failure.' };
    }
  };

  const resetPasswordSubmit = async (email: string, resetCodeEntered: string, actualCode: string, newPw: string) => {
    if (resetCodeEntered !== actualCode) {
      return { success: false, error: 'The code specified is incorrect or has expired.' };
    }
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword: newPw })
      });
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        data = { error: 'Invalid response from server' };
      }
      if (res.ok) {
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err: any) {
      return { success: false, error: 'Reset password submit failure.' };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user,
      isLoading,
      error,
      login,
      loginWithGoogle,
      loginWithGithub,
      signup,
      logout,
      updateProfile,
      getDashboardSummary,
      getSavedResumes,
      deleteSavedResume,
      getSavedRoadmaps,
      deleteSavedRoadmap,
      getSavedInterviews,
      deleteSavedInterview,
      forgotPassword,
      resetPasswordSubmit
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be nested within an AuthProvider element');
  }
  return context;
}
