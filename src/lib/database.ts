import { supabase } from './supabase';
import type { 
  UserProfile, 
  UserStats, 
  Achievement, 
  UserAchievement, 
  DailyChallenge, 
  UserStreak,
  Case,
  Submission,
  CaseProgress
} from '@/types/database';

// User Profile Functions
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      // If table doesn't exist or other error, return null instead of throwing
      console.warn('Error fetching user profile:', error.message);
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn('Exception fetching user profile:', error);
    return null;
  }
}

export async function createUserProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([profile])
      .select()
      .single();
    
    if (error) {
      console.warn('Error creating user profile:', error.message);
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn('Exception creating user profile:', error);
    return null;
  }
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      console.warn('Error updating user profile:', error.message);
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn('Exception updating user profile:', error);
    return null;
  }
}

// User Stats Functions
export async function getUserStats(userId: string): Promise<UserStats | null> {
  try {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.warn('Error fetching user stats:', error.message);
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn('Exception fetching user stats:', error);
    return null;
  }
}

export async function createUserStats(stats: Partial<UserStats>): Promise<UserStats | null> {
  try {
    const { data, error } = await supabase
      .from('user_stats')
      .insert([stats])
      .select()
      .single();
    
    if (error) {
      console.warn('Error creating user stats:', error.message);
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn('Exception creating user stats:', error);
    return null;
  }
}

export async function updateUserStats(userId: string, updates: Partial<UserStats>): Promise<UserStats | null> {
  try {
    const { data, error } = await supabase
      .from('user_stats')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      console.warn('Error updating user stats:', error.message);
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn('Exception updating user stats:', error);
    return null;
  }
}

// Achievement Functions
export async function getAchievements(): Promise<Achievement[]> {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('points', { ascending: true });
    
    if (error) {
      console.warn('Error fetching achievements:', error.message);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.warn('Exception fetching achievements:', error);
    return [];
  }
}

export async function getUserAchievements(userId: string): Promise<UserAchievement[]> {
  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievement:achievements(*)
      `)
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });
    
    if (error) {
      console.warn('Error fetching user achievements:', error.message);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.warn('Exception fetching user achievements:', error);
    return [];
  }
}

export async function awardAchievement(userId: string, achievementId: string): Promise<UserAchievement | null> {
  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .insert([{
        user_id: userId,
        achievement_id: achievementId
      }])
      .select()
      .single();
    
    if (error) {
      console.warn('Error awarding achievement:', error.message);
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn('Exception awarding achievement:', error);
    return null;
  }
}

// Daily Challenge Functions
export async function getDailyChallenge(date?: string): Promise<DailyChallenge | null> {
  try {
    const challengeDate = date || new Date().toISOString().split('T')[0];
    
    // First, try to get existing daily challenge
    let { data, error } = await supabase
      .from('daily_challenges')
      .select(`
        *,
        case:cases(*)
      `)
      .eq('challenge_date', challengeDate)
      .eq('is_active', true)
      .single();
    
    if (error && error.code === 'PGRST116') {
      // No challenge exists for today, create one with a random case
      const { data: randomCase, error: caseError } = await supabase
        .from('cases')
        .select('id')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (caseError || !randomCase) {
        console.warn('No cases available for daily challenge');
        return null;
      }
      
      // Create new daily challenge
      const { data: newChallenge, error: createError } = await supabase
        .from('daily_challenges')
        .insert([{
          case_id: randomCase.id,
          challenge_date: challengeDate,
          is_active: true
        }])
        .select(`
          *,
          case:cases(*)
        `)
        .single();
      
      if (createError) {
        console.warn('Error creating daily challenge:', createError.message);
        return null;
      }
      
      return newChallenge;
    }
    
    if (error) {
      console.warn('Error fetching daily challenge:', error.message);
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn('Exception fetching daily challenge:', error);
    return null;
  }
}

// Generate random daily challenge
export async function generateDailyChallenge(): Promise<DailyChallenge | null> {
  try {
    const challengeDate = new Date().toISOString().split('T')[0];
    
    // Get a random case
    const { data: cases, error: casesError } = await supabase
      .from('cases')
      .select('id')
      .eq('is_active', true);
    
    if (casesError || !cases || cases.length === 0) {
      console.warn('No cases available for daily challenge');
      return null;
    }
    
    const randomCase = cases[Math.floor(Math.random() * cases.length)];
    
    // Create new daily challenge
    const { data: newChallenge, error: createError } = await supabase
      .from('daily_challenges')
      .insert([{
        case_id: randomCase.id,
        challenge_date: challengeDate,
        is_active: true
      }])
      .select(`
        *,
        case:cases(*)
      `)
      .single();
    
    if (createError) {
      console.warn('Error creating daily challenge:', createError.message);
      return null;
    }
    
    return newChallenge;
  } catch (error) {
    console.warn('Exception generating daily challenge:', error);
    return null;
  }
}

// User Streak Functions
export async function getUserStreak(userId: string, date?: string): Promise<UserStreak | null> {
  try {
    const streakDate = date || new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', userId)
      .eq('streak_date', streakDate)
      .single();
    
    if (error) {
      console.warn('Error fetching user streak:', error.message);
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn('Exception fetching user streak:', error);
    return null;
  }
}

export async function createUserStreak(streak: Partial<UserStreak>): Promise<UserStreak | null> {
  try {
    const { data, error } = await supabase
      .from('user_streaks')
      .insert([streak])
      .select()
      .single();
    
    if (error) {
      console.warn('Error creating user streak:', error.message);
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn('Exception creating user streak:', error);
    return null;
  }
}

// Leaderboard Functions
export async function getLeaderboard(limit: number = 50): Promise<UserStats[]> {
  try {
    const { data, error } = await supabase
      .from('user_stats')
      .select(`
        *,
        user_profile:user_profiles(display_name, avatar_url)
      `)
      .order('total_score', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.warn('Error fetching leaderboard:', error.message);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.warn('Exception fetching leaderboard:', error);
    return [];
  }
}

// Case Functions with new fields
export async function getCases(filters?: {
  domain?: string;
  difficulty?: number;
  tags?: string[];
}): Promise<Case[]> {
  try {
    let query = supabase
      .from('cases')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (filters?.domain) {
      query = query.eq('domain', filters.domain);
    }
    
    if (filters?.difficulty) {
      query = query.eq('difficulty', filters.difficulty);
    }
    
    if (filters?.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.warn('Error fetching cases:', error.message);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.warn('Exception fetching cases:', error);
    return [];
  }
}

// Submission Functions with scoring
export async function createSubmission(submission: Partial<Submission>): Promise<Submission | null> {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .insert([submission])
      .select()
      .single();
    
    if (error) {
      console.warn('Error creating submission:', error.message);
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn('Exception creating submission:', error);
    return null;
  }
}

export async function getUserSubmissions(userId: string): Promise<Submission[]> {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select(`
        *,
        case:cases(*)
      `)
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false });
    
    if (error) {
      console.warn('Error fetching user submissions:', error.message);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.warn('Exception fetching user submissions:', error);
    return [];
  }
}

// Case Progress Functions
export async function getUserCaseProgress(userId: string): Promise<CaseProgress[]> {
  try {
    const { data, error } = await supabase
      .from('case_progress')
      .select(`
        *,
        case:cases(*)
      `)
      .eq('user_id', userId)
      .order('last_accessed', { ascending: false });
    
    if (error) {
      console.warn('Error fetching case progress:', error.message);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.warn('Exception fetching case progress:', error);
    return [];
  }
}

export async function createCaseProgress(progress: Partial<CaseProgress>): Promise<CaseProgress | null> {
  try {
    const { data, error } = await supabase
      .from('case_progress')
      .insert([progress])
      .select(`
        *,
        case:cases(*)
      `)
      .single();
    
    if (error) {
      console.warn('Error creating case progress:', error.message);
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn('Exception creating case progress:', error);
    return null;
  }
}

export async function updateCaseProgress(userId: string, caseId: string, updates: Partial<CaseProgress>): Promise<CaseProgress | null> {
  try {
    const { data, error } = await supabase
      .from('case_progress')
      .update({
        ...updates,
        last_accessed: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('case_id', caseId)
      .select(`
        *,
        case:cases(*)
      `)
      .single();
    
    if (error) {
      console.warn('Error updating case progress:', error.message);
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn('Exception updating case progress:', error);
    return null;
  }
}

export async function deleteCaseProgress(userId: string, caseId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('case_progress')
      .delete()
      .eq('user_id', userId)
      .eq('case_id', caseId);
    
    if (error) {
      console.warn('Error deleting case progress:', error.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.warn('Exception deleting case progress:', error);
    return false;
  }
}

// Enhanced case functions
export async function getRecommendedCases(userId: string, limit: number = 4): Promise<Case[]> {
  try {
    // Get user's submission history to understand their preferences
    const { data: submissions, error: submissionError } = await supabase
      .from('submissions')
      .select('case_id, score, case:cases(domain, difficulty)')
      .eq('user_id', userId)
      .eq('status', 'completed');
    
    if (submissionError) {
      console.warn('Error fetching user submissions for recommendations:', submissionError.message);
      // Fall back to popular cases
      return getPopularCases(limit);
    }
    
    if (!submissions || submissions.length === 0) {
      // User has no history, show top picks
      return getTopPicksCases(limit);
    }
    
    // Get domains user has tried
    const triedDomains = Array.from(new Set(submissions.map(s => s.case?.domain).filter(Boolean)));
    
    // Get average difficulty user performs well on
    const averageScore = submissions.reduce((sum, s) => sum + (s.score || 0), 0) / submissions.length;
    const recommendedDifficulty = averageScore >= 80 ? 3 : averageScore >= 60 ? 2 : 1;
    
    // Get cases from new domains or similar difficulty
    const { data: recommendedCases, error: recError } = await supabase
      .from('cases')
      .select('*')
      .eq('is_active', true)
      .not('domain', 'in', `(${triedDomains.join(',')})`)
      .eq('difficulty', recommendedDifficulty)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (recError || !recommendedCases || recommendedCases.length === 0) {
      // Fall back to popular cases
      return getPopularCases(limit);
    }
    
    return recommendedCases;
  } catch (error) {
    console.warn('Exception getting recommended cases:', error);
    return getPopularCases(limit);
  }
}

export async function getTopPicksCases(limit: number = 4): Promise<Case[]> {
  try {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.warn('Error fetching top picks cases:', error.message);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.warn('Exception fetching top picks cases:', error);
    return [];
  }
}

export async function getPopularCases(limit: number = 4): Promise<Case[]> {
  try {
    // Get most attempted cases
    const { data, error } = await supabase
      .from('cases')
      .select(`
        *,
        submissions!inner(case_id)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.warn('Error fetching popular cases:', error.message);
      // Fall back to recent cases
      return getTopPicksCases(limit);
    }
    
    return data || [];
  } catch (error) {
    console.warn('Exception fetching popular cases:', error);
    return getTopPicksCases(limit);
  }
}

// XP and Level calculation functions
export function calculateXPForNextLevel(currentLevel: number): number {
  // Level 1: 0-1000 XP, Level 2: 1000-2500 XP, Level 3: 2500-5000 XP, etc.
  const baseXP = 1000;
  const multiplier = 1.5;
  return Math.floor(baseXP * Math.pow(multiplier, currentLevel - 1));
}

export function calculateLevelFromXP(xp: number): number {
  let level = 1;
  let totalXPRequired = 0;
  
  while (totalXPRequired + calculateXPForNextLevel(level) <= xp) {
    totalXPRequired += calculateXPForNextLevel(level);
    level++;
  }
  
  return level;
}

export function getXPProgressForLevel(xp: number, level: number): { current: number, required: number } {
  let totalXPForPreviousLevels = 0;
  for (let i = 1; i < level; i++) {
    totalXPForPreviousLevels += calculateXPForNextLevel(i);
  }
  
  const currentXPInLevel = xp - totalXPForPreviousLevels;
  const requiredXPForLevel = calculateXPForNextLevel(level);
  
  return {
    current: currentXPInLevel,
    required: requiredXPForLevel
  };
} 