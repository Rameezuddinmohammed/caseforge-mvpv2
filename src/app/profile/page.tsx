'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getUserStats, getUserProfile, getUserSubmissions, getUserAchievements } from '@/lib/database';
import type { UserStats, UserProfile, Submission, UserAchievement } from '@/types/database';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  User, 
  Trophy, 
  Calendar, 
  TrendingUp,
  BookOpen,
  Flame,
  Star,
  Clock,
  Target,
  Award,
  CheckCircle,
  Edit
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        const [stats, profile, userSubmissions, userAchievements] = await Promise.all([
          getUserStats(user.id),
          getUserProfile(user.id),
          getUserSubmissions(user.id),
          getUserAchievements(user.id)
        ]);

        setUserStats(stats);
        setUserProfile(profile);
        setSubmissions(userSubmissions);
        setAchievements(userAchievements);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.id]);

  const displayName = userProfile?.display_name || user?.user_metadata?.full_name || 'Case Solver';
  const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently';

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map((name: string) => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'kaggle-badge-green';
      case 2: return 'kaggle-badge-yellow';
      case 3: return 'kaggle-badge-red';
      default: return 'kaggle-badge-green';
    }
  };

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'Beginner';
      case 2: return 'Intermediate';
      case 3: return 'Advanced';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-background">
          <Navigation />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-32 bg-muted rounded-lg"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-48 bg-muted rounded-lg"></div>
                <div className="h-48 bg-muted rounded-lg"></div>
                <div className="h-48 bg-muted rounded-lg"></div>
              </div>
            </div>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background">
        <Navigation />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <div className="kaggle-card p-6 mb-8">
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 kaggle-gradient rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {getUserInitials()}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">{displayName}</h1>
                  <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-muted-foreground mb-4">{user?.email}</p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Member since {memberSince}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Trophy className="w-4 h-4" />
                    <span>{achievements.length} achievements</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="kaggle-card p-6">
              <div className="flex items-center space-x-3 mb-2">
                <BookOpen className="w-6 h-6 text-success" />
                <h3 className="font-semibold">Cases Solved</h3>
              </div>
              <p className="text-3xl font-bold text-foreground">{userStats?.cases_solved || 0}</p>
              <p className="text-sm text-muted-foreground">Total completed</p>
            </div>

            <div className="kaggle-card p-6">
              <div className="flex items-center space-x-3 mb-2">
                <Flame className="w-6 h-6 text-warning" />
                <h3 className="font-semibold">Current Streak</h3>
              </div>
              <p className="text-3xl font-bold text-foreground">{userStats?.current_streak || 0}</p>
              <p className="text-sm text-muted-foreground">Days consecutive</p>
            </div>

            <div className="kaggle-card p-6">
              <div className="flex items-center space-x-3 mb-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h3 className="font-semibold">Average Score</h3>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {userStats?.average_score ? `${userStats.average_score.toFixed(1)}%` : '0%'}
              </p>
              <p className="text-sm text-muted-foreground">Performance</p>
            </div>

            <div className="kaggle-card p-6">
              <div className="flex items-center space-x-3 mb-2">
                <Star className="w-6 h-6 text-warning" />
                <h3 className="font-semibold">Total Points</h3>
              </div>
              <p className="text-3xl font-bold text-foreground">{userStats?.total_score || 0}</p>
              <p className="text-sm text-muted-foreground">Points earned</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Submissions */}
            <div className="kaggle-card p-6">
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Recent Submissions</h2>
              </div>
              
              {submissions.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No submissions yet</p>
                  <p className="text-sm text-muted-foreground">Start solving cases to see your progress!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.slice(0, 5).map((submission) => (
                    <div key={submission.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Target className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-1">
                          {submission.case?.title || 'Unknown Case'}
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                          <span>{submission.case?.domain}</span>
                          <span>•</span>
                          <span className={getDifficultyColor(submission.case?.difficulty || 1)}>
                            {getDifficultyText(submission.case?.difficulty || 1)}
                          </span>
                          <span>•</span>
                          <span>{new Date(submission.submitted_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {submission.time_spent && (
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{Math.round(submission.time_spent / 60)}m</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Achievements */}
            <div className="kaggle-card p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Trophy className="w-5 h-5 text-warning" />
                <h2 className="text-xl font-semibold">Achievements</h2>
              </div>
              
              {achievements.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No achievements yet</p>
                  <p className="text-sm text-muted-foreground">Complete cases to unlock achievements!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {achievements.slice(0, 6).map((userAchievement) => (
                    <div key={userAchievement.id} className="flex items-center space-x-3 p-3 rounded-lg bg-success/10 border border-success/20">
                      <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{userAchievement.achievement?.name}</h4>
                        <p className="text-xs text-muted-foreground">{userAchievement.achievement?.description}</p>
                      </div>
                      <div className="flex items-center space-x-1 text-warning">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs font-medium">{userAchievement.achievement?.points}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}