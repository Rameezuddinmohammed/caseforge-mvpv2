// Database types for Caseforge Phase 2
export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  id: string;
  user_id: string;
  total_score: number;
  cases_solved: number;
  current_streak: number;
  longest_streak: number;
  average_score: number;
  xp: number;
  level: number;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  criteria: string;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  achievement?: Achievement;
}

export interface DailyChallenge {
  id: string;
  case_id: string;
  challenge_date: string;
  is_active: boolean;
  created_at: string;
  case?: Case;
}

export interface UserStreak {
  id: string;
  user_id: string;
  streak_date: string;
  cases_completed: number;
  created_at: string;
}

export interface Case {
  id: string;
  title: string;
  domain: string;
  brief: string;
  evaluation_criteria: string;
  difficulty: number;
  estimated_time?: number;
  tags?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  case_id: string;
  user_id: string;
  response: string;
  score?: number;
  feedback?: string;
  time_spent?: number;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  case?: Case;
} 