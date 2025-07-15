'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getUserStats, getUserProfile } from '@/lib/database';
import type { UserStats, UserProfile } from '@/types/database';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navigation from '@/components/Navigation';
import MinisStrip from '@/components/MinisStrip';
import XPProgressBar from '@/components/XPProgressBar';
import ResumeCaseButton from '@/components/ResumeCaseButton';
import EnhancedDailyChallengeWidget from '@/components/EnhancedDailyChallengeWidget';
import RecommendedCasesWidget from '@/components/RecommendedCasesWidget';
import AchievementsWidget from '@/components/AchievementsWidget';
import { 
  BookOpen, 
  TrendingUp, 
  Flame, 
  Target,
  Calendar,
  Trophy,
  ArrowRight,
  Star,
  Clock,
  Users
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const [stats, profile] = await Promise.all([
        getUserStats(user.id),
        getUserProfile(user.id)
      ]);

      setUserStats(stats);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const displayName = userProfile?.display_name || user?.user_metadata?.full_name || 'Case Solver';

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background">
        <Navigation />
        <MinisStrip />
        
        <div className="kaggle-container py-10">
          {/* Hero Section with XP Progress */}
          <div className="text-center kaggle-page-header">
            <h1 className="kaggle-page-title">
              Welcome back, {displayName}! 👋
            </h1>
            <p className="kaggle-page-description mb-6">
              Ready to tackle today's business challenges?
            </p>
            
            {/* XP Progress Bar */}
            <div className="max-w-md mx-auto mb-6">
              <XPProgressBar />
            </div>
            
            {/* Resume Case Button */}
            <ResumeCaseButton />
          </div>
          
          {/* Stats Cards Grid */}
          <div className="kaggle-stats-grid mb-12">
            <div className="kaggle-card p-8 kaggle-hover-lift">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Cases Solved</h3>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {loading ? '--' : (userStats?.cases_solved || 0)}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Total cases completed</p>
            </div>
            
            <div className="kaggle-card p-8 kaggle-hover-lift">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                  <Flame className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Current Streak</h3>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {loading ? '--' : (userStats?.current_streak || 0)}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Days of consecutive practice</p>
            </div>
            
            <div className="kaggle-card p-8 kaggle-hover-lift">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Average Score</h3>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {loading ? '--' : (userStats?.average_score ? `${userStats.average_score.toFixed(1)}%` : '--')}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Performance across all cases</p>
            </div>

            <div className="kaggle-card p-8 kaggle-hover-lift">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Total Points</h3>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {loading ? '--' : (userStats?.total_score || 0)}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Cumulative points earned</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="kaggle-card p-6 mb-8 bg-error/10 border-error/20">
              <p className="text-error text-sm">{error}</p>
              <button
                onClick={fetchUserData}
                className="mt-3 text-sm text-error/80 hover:text-error underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="kaggle-content-grid mb-12">
            {/* Enhanced Daily Challenge - Takes up 2 columns on large screens */}
            <div className="lg:col-span-2">
              <EnhancedDailyChallengeWidget />
            </div>

            {/* Achievements - Takes up 1 column */}
            <div>
              <AchievementsWidget />
            </div>
          </div>

          {/* Recommended Cases */}
          <div className="mb-12">
            <RecommendedCasesWidget />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="kaggle-card p-8 kaggle-hover-lift">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Browse Cases</h3>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Explore our collection of business cases across different domains and difficulty levels.
              </p>
              <a 
                href="/cases" 
                className="kaggle-button-primary"
              >
                <BookOpen className="w-4 h-4" />
                <span>View Cases</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="kaggle-card p-8 kaggle-hover-lift">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-warning" />
                </div>
                <h3 className="text-xl font-semibold">Leaderboard</h3>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                See how you rank against other case solvers and track your progress.
              </p>
              <a 
                href="/leaderboard" 
                className="kaggle-button-secondary"
              >
                <Users className="w-4 h-4" />
                <span>View Rankings</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="kaggle-card p-8 kaggle-hover-lift">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-xl font-semibold">Your Profile</h3>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Update your profile, view detailed stats, and manage your achievements.
              </p>
              <a 
                href="/profile" 
                className="kaggle-button-secondary"
              >
                <Calendar className="w-4 h-4" />
                <span>View Profile</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}