'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getDailyChallenge, getUserStreak } from '@/lib/database';
import type { DailyChallenge, UserStreak } from '@/types/database';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  Target, 
  Play,
  CheckCircle,
  Timer
} from 'lucide-react';

export default function EnhancedDailyChallengeWidget() {
  const { user } = useAuth();
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(null);
  const [userStreak, setUserStreak] = useState<UserStreak | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const fetchDailyChallenge = async () => {
      if (!user?.id) return;

      try {
        const [challenge, streak] = await Promise.all([
          getDailyChallenge(),
          getUserStreak(user.id)
        ]);

        setDailyChallenge(challenge);
        setUserStreak(streak);
      } catch (error) {
        console.error('Error fetching daily challenge:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyChallenge();
  }, [user?.id]);

  // Countdown timer
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

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
      <div className="kaggle-card p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-6 bg-muted rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
          <div className="h-10 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!dailyChallenge) {
    return (
      <div className="kaggle-card p-6">
        <div className="text-center">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Daily Challenge</h3>
          <p className="text-muted-foreground mb-4">Check back tomorrow for a new challenge!</p>
        </div>
      </div>
    );
  }

  const isCompleted = (userStreak?.cases_completed || 0) > 0;

  return (
    <div className="kaggle-card p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-semibold">Daily Challenge</h3>
        </div>
        <div className="flex items-center space-x-4">
          {isCompleted && (
            <div className="flex items-center space-x-2 text-success">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Completed!</span>
            </div>
          )}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Timer className="w-4 h-4" />
            <span className="font-mono">{timeLeft}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-2xl font-semibold mb-4 line-clamp-2">
          {dailyChallenge.case?.title}
        </h4>
        <p className="text-muted-foreground mb-6 line-clamp-2 leading-relaxed">
          {dailyChallenge.case?.brief}
        </p>
        
        <div className="flex items-center space-x-6 mb-6">
          <div className="flex items-center space-x-2 text-sm">
            <Target className="w-4 h-4" />
            <span>{dailyChallenge.case?.domain}</span>
          </div>
          <div className={`${getDifficultyColor(dailyChallenge.case?.difficulty || 1)}`}>
            {getDifficultyText(dailyChallenge.case?.difficulty || 1)}
          </div>
          {dailyChallenge.case?.estimated_time && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{dailyChallenge.case.estimated_time} min</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Complete daily challenges to earn bonus XP and maintain your streak!
        </div>
        
        <Link
          href={`/cases/start/${dailyChallenge.case_id}`}
          className={`inline-flex items-center space-x-2 px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
            isCompleted 
              ? 'bg-muted text-muted-foreground cursor-not-allowed' 
              : 'bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-lg transform hover:scale-105'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>{isCompleted ? 'Completed' : 'Start'}</span>
        </Link>
      </div>
    </div>
  );
}