import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  where 
} from 'firebase/firestore';

// Synchronously load the Firebase configuration
const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestoreDb = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatar: string;
  bio: string;
  github: string;
  linkedin: string;
  portfolio: string;
  skills: string[];
  createdAt: string;
}

export interface ResumeAnalysis {
  id: string;
  userId: string;
  resumeName: string;
  score: number;
  atsScore: number;
  resultData: any;
  createdAt: string;
}

export interface Roadmap {
  id: string;
  userId: string;
  careerName: string;
  roadmapData: any;
  createdAt: string;
}

export interface InterviewHistory {
  id: string;
  userId: string;
  interviewType: string;
  score: number;
  resultData: any;
  createdAt: string;
}

export interface Session {
  token: string;
  userId: string;
  expiresAt: number;
}

// Hashing Helpers
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  if (!stored || !stored.includes(':')) return false;
  const [salt, hash] = stored.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// User Operations
export async function getUserByEmail(email: string): Promise<User | undefined> {
  try {
    const q = query(
      collection(firestoreDb, 'users'), 
      where('email', '==', email.toLowerCase())
    );
    const snap = await getDocs(q);
    if (snap.empty) return undefined;
    return snap.docs[0].data() as User;
  } catch (err) {
    console.error('Error fetching user by email', err);
    return undefined;
  }
}

export async function getUserById(id: string): Promise<User | undefined> {
  try {
    const userDoc = doc(firestoreDb, 'users', id);
    const snap = await getDoc(userDoc);
    if (!snap.exists()) return undefined;
    return snap.data() as User;
  } catch (err) {
    console.error('Error fetching user by ID', err);
    return undefined;
  }
}

export async function createUser(name: string, email: string, passwordHash: string): Promise<User> {
  const id = crypto.randomUUID();
  const newUser: User = {
    id,
    name,
    email: email.toLowerCase(),
    passwordHash,
    avatar: '',
    bio: 'Excited software practitioner transitioning into new engineering roles.',
    github: '',
    linkedin: '',
    portfolio: '',
    skills: ['Git', 'TypeScript', 'Tailwind CSS'],
    createdAt: new Date().toISOString()
  };

  const userDoc = doc(firestoreDb, 'users', id);
  await setDoc(userDoc, newUser);
  return newUser;
}

export async function getOrCreateGoogleUser(uid: string, name: string, email: string, avatarUrl: string): Promise<User> {
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    if (!existingUser.avatar || existingUser.avatar === '') {
      existingUser.avatar = avatarUrl || '';
      const userDoc = doc(firestoreDb, 'users', existingUser.id);
      await setDoc(userDoc, existingUser);
    }
    return existingUser;
  }

  const id = crypto.randomUUID();
  const newUser: User = {
    id,
    name,
    email: email.toLowerCase(),
    passwordHash: 'GOOGLE_SSO_OAUTH',
    avatar: avatarUrl || '',
    bio: 'Excited software practitioner transitioning into new engineering roles.',
    github: '',
    linkedin: '',
    portfolio: '',
    skills: ['Git', 'TypeScript', 'Tailwind CSS'],
    createdAt: new Date().toISOString()
  };

  const userDoc = doc(firestoreDb, 'users', id);
  await setDoc(userDoc, newUser);
  return newUser;
}

export async function updateUser(id: string, updates: Partial<Omit<User, 'id' | 'email' | 'createdAt'>>): Promise<User | undefined> {
  const userDoc = doc(firestoreDb, 'users', id);
  const snap = await getDoc(userDoc);
  if (!snap.exists()) return undefined;

  const currentData = snap.data() as User;
  const updatedData = {
    ...currentData,
    ...updates
  };

  await setDoc(userDoc, updatedData);
  return updatedData;
}

// Session Operations
export async function createSession(userId: string): Promise<Session> {
  const token = generateToken();
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
  const newSession: Session = {
    token,
    userId,
    expiresAt
  };

  const sessionDoc = doc(firestoreDb, 'sessions', token);
  await setDoc(sessionDoc, newSession);
  return newSession;
}

export async function getUserIdFromSession(token: string): Promise<string | undefined> {
  try {
    const sessionDoc = doc(firestoreDb, 'sessions', token);
    const snap = await getDoc(sessionDoc);
    if (!snap.exists()) return undefined;

    const session = snap.data() as Session;
    if (session.expiresAt < Date.now()) {
      await deleteDoc(sessionDoc);
      return undefined;
    }
    return session.userId;
  } catch (err) {
    console.error('Error getting user from session', err);
    return undefined;
  }
}

export async function deleteSession(token: string): Promise<void> {
  try {
    const sessionDoc = doc(firestoreDb, 'sessions', token);
    await deleteDoc(sessionDoc);
  } catch (err) {
    console.error('Error deleting session', err);
  }
}

// Resume Analysis Operations
export async function addResumeAnalysis(userId: string, resumeName: string, score: number, atsScore: number, resultData: any): Promise<ResumeAnalysis> {
  const id = crypto.randomUUID();
  const newAnalysis: ResumeAnalysis = {
    id,
    userId,
    resumeName,
    score,
    atsScore,
    resultData,
    createdAt: new Date().toISOString()
  };

  const docRef = doc(firestoreDb, 'resumeAnalyses', id);
  await setDoc(docRef, newAnalysis);
  return newAnalysis;
}

export async function getResumeAnalyses(userId: string): Promise<ResumeAnalysis[]> {
  try {
    const q = query(
      collection(firestoreDb, 'resumeAnalyses'), 
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    const list = snap.docs.map(d => d.data() as ResumeAnalysis);
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  } catch (err) {
    console.error('Error getting resume analyses', err);
    return [];
  }
}

export async function deleteResumeAnalysis(id: string, userId: string): Promise<boolean> {
  try {
    const docRef = doc(firestoreDb, 'resumeAnalyses', id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return false;

    const data = snap.data() as ResumeAnalysis;
    if (data.userId !== userId) return false;

    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('Error deleting resume analysis', err);
    return false;
  }
}

// Roadmap Operations
export async function addRoadmap(userId: string, careerName: string, roadmapData: any): Promise<Roadmap> {
  const id = crypto.randomUUID();
  const newRoadmap: Roadmap = {
    id,
    userId,
    careerName,
    roadmapData,
    createdAt: new Date().toISOString()
  };

  const docRef = doc(firestoreDb, 'roadmaps', id);
  await setDoc(docRef, newRoadmap);
  return newRoadmap;
}

export async function getRoadmaps(userId: string): Promise<Roadmap[]> {
  try {
    const q = query(
      collection(firestoreDb, 'roadmaps'), 
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    const list = snap.docs.map(d => d.data() as Roadmap);
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  } catch (err) {
    console.error('Error getting roadmaps', err);
    return [];
  }
}

export async function deleteRoadmap(id: string, userId: string): Promise<boolean> {
  try {
    const docRef = doc(firestoreDb, 'roadmaps', id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return false;

    const data = snap.data() as Roadmap;
    if (data.userId !== userId) return false;

    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('Error deleting roadmap', err);
    return false;
  }
}

// Interview Operations
export async function addInterviewHistory(userId: string, interviewType: string, score: number, resultData: any): Promise<InterviewHistory> {
  const id = crypto.randomUUID();
  const newHistory: InterviewHistory = {
    id,
    userId,
    interviewType,
    score,
    resultData,
    createdAt: new Date().toISOString()
  };

  const docRef = doc(firestoreDb, 'interviewHistories', id);
  await setDoc(docRef, newHistory);
  return newHistory;
}

export async function getInterviewHistory(userId: string): Promise<InterviewHistory[]> {
  try {
    const q = query(
      collection(firestoreDb, 'interviewHistories'), 
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    const list = snap.docs.map(d => d.data() as InterviewHistory);
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  } catch (err) {
    console.error('Error getting interview history', err);
    return [];
  }
}

export async function deleteInterviewHistory(id: string, userId: string): Promise<boolean> {
  try {
    const docRef = doc(firestoreDb, 'interviewHistories', id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return false;

    const data = snap.data() as InterviewHistory;
    if (data.userId !== userId) return false;

    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('Error deleting interview history', err);
    return false;
  }
}

// Dashboard aggregates with strictly isolated stats
export async function getDashboardSummary(userId: string) {
  try {
    const user = await getUserById(userId);
    const resumes = await getResumeAnalyses(userId);
    const roadmaps = await getRoadmaps(userId);
    const interviews = await getInterviewHistory(userId);

    // Resume average score
    const avgResumeScore = resumes.length > 0 
      ? Math.round(resumes.reduce((sum, r) => sum + r.score, 0) / resumes.length)
      : 0;

    // Interview average score
    const avgInterviewScore = interviews.length > 0
      ? Math.round(interviews.reduce((sum, i) => sum + i.score, 0) / interviews.length)
      : 0;

    // Activity stream merging
    const recentActivity: any[] = [];
    resumes.slice(0, 3).forEach(r => {
      recentActivity.push({
        id: r.id,
        type: 'resume',
        title: 'Resume Assessment Completed',
        subtitle: `${r.resumeName} scored ${r.score}/100`,
        timestamp: r.createdAt
      });
    });

    roadmaps.slice(0, 3).forEach(rm => {
      recentActivity.push({
        id: rm.id,
        type: 'roadmap',
        title: 'Career Roadmap Generated',
        subtitle: `Created track for ${rm.careerName}`,
        timestamp: rm.createdAt
      });
    });

    interviews.slice(0, 3).forEach(i => {
      recentActivity.push({
        id: i.id,
        type: 'interview',
        title: 'Mock Interview Scored',
        subtitle: `${i.interviewType} session graded: ${i.score}%`,
        timestamp: i.createdAt
      });
    });

    recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return {
      user: user ? {
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        github: user.github,
        linkedin: user.linkedin,
        portfolio: user.portfolio,
        skills: user.skills
      } : null,
      stats: {
        resumesCount: resumes.length,
        roadmapsCount: roadmaps.length,
        interviewsCount: interviews.length,
        avgResumeScore,
        avgInterviewScore,
        skillsCount: user?.skills?.length || 0
      },
      recentActivity: recentActivity.slice(0, 5)
    };
  } catch (err) {
    console.error('Error generating dashboard summary', err);
    return {
      user: null,
      stats: {
        resumesCount: 0,
        roadmapsCount: 0,
        interviewsCount: 0,
        avgResumeScore: 0,
        avgInterviewScore: 0,
        skillsCount: 0
      },
      recentActivity: []
    };
  }
}
