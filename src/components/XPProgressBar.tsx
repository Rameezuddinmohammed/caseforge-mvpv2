'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getUserStats } from '@/lib/database';
import { calculateLevelFromXP, getXPProgressForLevel } from '@/lib/database';
import type { UserStats } from '@/types/database';

export default function XPProgressBar() {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user?.id) return;
      
      try {
        const stats = await getUserStats(user.id);
        setUserStats(stats);
      } catch (error) {
        console.error('Error fetching user stats for XP:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [user?.id]);

  if (loading || !userStats) {
    return (
      <div className="w-full bg-muted rounded-full h-2 animate-pulse">
        <div className="h-2 bg-success rounded-full w-1/3"></div>
      </div>
    );
  }

  const currentLevel = userStats.level || calculateLevelFromXP(userStats.xp || 0);
  const xpProgress = getXPProgressForLevel(userStats.xp || 0, currentLevel);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-foreground">
            {xpProgress.current.toLocaleString()}/{xpProgress.required.toLocaleString()} XP
          </span>
          <span className="text-sm text-muted-foreground">→</span>
          <span className="text-sm font-medium text-foreground">
            Level {currentLevel + 1}
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          Level {currentLevel}
        </div>
      </div>
      
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="h-2 bg-success rounded-full transition-all duration-300"
          style={{ 
            width: `${Math.min((xpProgress.current / xpProgress.required) * 100, 100)}%` 
          }}
        ></div>
      </div>
    </div>
  );
}