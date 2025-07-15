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
    
    const { data, error } = await supabase
      .from('daily_challenges')
      .select(`
        *,
        case:cases(*)
      `)
      .eq('challenge_date', challengeDate)
      .eq('is_active', true)
      .single();
    
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