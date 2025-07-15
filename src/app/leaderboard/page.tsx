'use client';

import { useEffect, useState } from 'react';
import { getLeaderboard } from '@/lib/database';
import type { UserStats } from '@/types/database';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/auth-context';
import { 
  Trophy, 
  Medal, 
  Award,
  TrendingUp,
  Users,
  Crown
} from 'lucide-react';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard(50);
        setLeaderboard(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-warning" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-400" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-medium text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-warning/10 border-warning/20';
      case 2:
        return 'bg-gray-100 border-gray-300';
      case 3:
        return 'bg-orange-100 border-orange-300';
      default:
        return 'bg-background border-border';
    }
  };

  const isCurrentUser = (userId: string) => {
    return user?.id === userId;
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background">
        <Navigation />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Trophy className="w-8 h-8 text-warning" />
              <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
            </div>
            <p className="text-muted-foreground">
              Top performers in the Caseforge community
            </p>
          </div>

          {loading ? (
            <div className="kaggle-card p-6">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-16 bg-muted rounded-lg"></div>
                ))}
              </div>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="kaggle-card p-8 text-center">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No leaderboard data</h3>
              <p className="text-muted-foreground">
                Complete some cases to see the leaderboard!
              </p>
            </div>
          ) : (
            <div className="kaggle-card overflow-hidden">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Top Case Solvers</h2>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span>Ranked by total score</span>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-border">
                {leaderboard.map((entry, index) => {
                  const rank = index + 1;
                  const displayName = (entry as any).user_profile?.display_name || `User ${rank}`;
                  const isMe = isCurrentUser(entry.user_id);
                  
                  return (
                    <div
                      key={entry.user_id}
                      className={`p-6 transition-colors ${
                        isMe ? 'bg-primary/5 border-l-4 border-primary' : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        {/* Rank */}
                        <div className="flex items-center justify-center w-12 h-12">
                          {getRankIcon(rank)}
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-foreground">
                              {displayName}
                              {isMe && (
                                <span className="ml-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                                  You
                                </span>
                              )}
                            </h3>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                            <span>{entry.cases_solved} cases solved</span>
                            <span>•</span>
                            <span>{entry.current_streak} day streak</span>
                            <span>•</span>
                            <span>{entry.average_score?.toFixed(1) || 0}% avg score</span>
                          </div>
                        </div>

                        {/* Score */}
                        <div className="text-right">
                          <div className="text-2xl font-bold text-foreground">
                            {entry.total_score.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            points
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {leaderboard.length >= 50 && (
                <div className="p-6 bg-muted/30 text-center">
                  <p className="text-sm text-muted-foreground">
                    Showing top 50 users. Keep solving cases to climb the leaderboard!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}