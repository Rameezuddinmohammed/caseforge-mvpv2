'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getUserCaseProgress } from '@/lib/database';
import type { CaseProgress } from '@/types/database';
import Link from 'next/link';
import { Play, Clock } from 'lucide-react';

export default function ResumeCaseButton() {
  const { user } = useAuth();
  const [caseProgress, setCaseProgress] = useState<CaseProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaseProgress = async () => {
      if (!user?.id) return;
      
      try {
        const progress = await getUserCaseProgress(user.id);
        setCaseProgress(progress);
      } catch (error) {
        console.error('Error fetching case progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseProgress();
  }, [user?.id]);

  if (loading || caseProgress.length === 0) {
    return null;
  }

  const mostRecentCase = caseProgress[0];

  return (
    <div className="mt-4">
      <Link
        href={`/cases/start/${mostRecentCase.case_id}`}
        className="inline-flex items-center space-x-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <Play className="w-5 h-5" />
        <div className="flex flex-col items-start">
          <span className="text-lg">Resume Case</span>
          <span className="text-sm opacity-90 line-clamp-1">
            {mostRecentCase.case?.title}
          </span>
        </div>
        <div className="flex items-center space-x-1 text-sm opacity-90">
          <Clock className="w-4 h-4" />
          <span>
            {new Date(mostRecentCase.last_accessed).toLocaleDateString()}
          </span>
        </div>
      </Link>
    </div>
  );
}