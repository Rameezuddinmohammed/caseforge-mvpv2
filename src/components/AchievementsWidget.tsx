'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getAchievements, getUserAchievements } from '@/lib/database';
import type { Achievement, UserAchievement } from '@/types/database';
import { 
  Trophy, 
  Star, 
  Award, 
  Target,
  Lock,
  CheckCircle
} from 'lucide-react';

export default function AchievementsWidget() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!user?.id) return;

      try {
        const [allAchievements, earnedAchievements] = await Promise.all([
          getAchievements(),
          getUserAchievements(user.id)
        ]);

        setAchievements(allAchievements);
        setUserAchievements(earnedAchievements);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [user?.id]);

  const earnedAchievementIds = userAchievements.map(ua => ua.achievement_id);
  const earnedCount = userAchievements.length;
  const totalCount = achievements.length;

  if (loading) {
    return (
      <div className="kaggle-card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="kaggle-card p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Trophy className="w-6 h-6 text-warning" />
          <h3 className="text-xl font-semibold">Achievements</h3>
        </div>
        <div className="text-sm text-muted-foreground">
          {earnedCount}/{totalCount}
        </div>
      </div>

      <div className="space-y-4">
        {achievements.slice(0, 4).map((achievement) => {
          const isEarned = earnedAchievementIds.includes(achievement.id);
          const userAchievement = userAchievements.find(ua => ua.achievement_id === achievement.id);
          
          return (
            <div
              key={achievement.id}
              className={`flex items-center space-x-4 p-4 rounded-xl border transition-all duration-200 ${
                isEarned 
                  ? 'bg-success/10 border-success/20' 
                  : 'bg-muted/50 border-border'
              }`}
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                isEarned ? 'bg-success' : 'bg-muted'
              }`}>
                {isEarned ? (
                  <CheckCircle className="w-5 h-5 text-white" />
                ) : (
                  <Lock className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className={`font-medium ${
                    isEarned ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {achievement.name}
                  </h4>
                  {isEarned && (
                    <div className="flex items-center space-x-1 text-warning">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{achievement.points}</span>
                    </div>
                  )}
                </div>
                <p className={`text-sm ${
                  isEarned ? 'text-muted-foreground' : 'text-muted-foreground/70'
                }`}>
                  {achievement.description}
                </p>
                {isEarned && userAchievement && (
                  <p className="text-xs text-success mt-2">
                    Earned {new Date(userAchievement.earned_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {achievements.length > 4 && (
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            +{achievements.length - 4} more achievements to unlock
          </p>
        </div>
      )}
    </div>
  );
} 