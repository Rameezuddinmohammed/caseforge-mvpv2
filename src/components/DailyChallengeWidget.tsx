'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getDailyChallenge, createUserStreak, getUserStreak } from '@/lib/database';
import type { DailyChallenge, UserStreak } from '@/types/database';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  Flame,
  Trophy,
  Play,
  BookOpen,
  CheckCircle
} from 'lucide-react';

export default function DailyChallengeWidget() {
  const { user } = useAuth();
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(null);
  const [userStreak, setUserStreak] = useState<UserStreak | null>(null);
  const [loading, setLoading] = useState(true);

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

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'text-success';
      case 2: return 'text-warning';
      case 3: return 'text-error';
      default: return 'text-muted-foreground';
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

  const getDifficultyBadge = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'kaggle-badge-green';
      case 2: return 'kaggle-badge-yellow';
      case 3: return 'kaggle-badge-red';
      default: return 'kaggle-badge-green';
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
          <Link
            href="/cases"
            className="inline-flex items-center space-x-2 kaggle-button-primary"
          >
            <BookOpen className="w-4 h-4" />
            <span>Browse All Cases</span>
          </Link>
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
          <h3 className="text-xl font-semibold">Today's Challenge</h3>
        </div>
        {isCompleted && (
          <div className="flex items-center space-x-2 text-success">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Completed!</span>
          </div>
        )}
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
          <div className={`${getDifficultyBadge(dailyChallenge.case?.difficulty || 1)}`}>
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
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Flame className="w-4 h-4 text-warning" />
          <span>Complete daily to maintain your streak</span>
        </div>
        
        <Link
          href={`/cases/start/${dailyChallenge.case_id}`}
          className={`inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            isCompleted 
              ? 'bg-muted text-muted-foreground cursor-not-allowed' 
              : 'kaggle-button-primary hover:shadow-md'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>{isCompleted ? 'Completed' : 'Start Challenge'}</span>
        </Link>
      </div>
    </div>
  );
} 