'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getRecommendedCases, getUserSubmissions } from '@/lib/database';
import type { Case } from '@/types/database';
import Link from 'next/link';
import { 
  ArrowRight, 
  Clock, 
  Target, 
  Play,
  Star,
  TrendingUp
} from 'lucide-react';

export default function RecommendedCasesWidget() {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [sectionTitle, setSectionTitle] = useState('Recommended for You');

  useEffect(() => {
    const fetchRecommendedCases = async () => {
      if (!user?.id) return;
      
      try {
        const [recommendedCases, userSubmissions] = await Promise.all([
          getRecommendedCases(user.id, 4),
          getUserSubmissions(user.id)
        ]);

        setCases(recommendedCases);
        
        // Set section title based on user history
        if (userSubmissions.length === 0) {
          setSectionTitle('Top Picks');
        } else if (recommendedCases.length === 0) {
          setSectionTitle('Popular Cases');
        } else {
          setSectionTitle('Recommended for You');
        }
      } catch (error) {
        console.error('Error fetching recommended cases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedCases();
  }, [user?.id]);

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

  const getSectionIcon = () => {
    switch (sectionTitle) {
      case 'Top Picks':
        return <Star className="w-5 h-5 text-warning" />;
      case 'Popular Cases':
        return <TrendingUp className="w-5 h-5 text-success" />;
      default:
        return <Target className="w-5 h-5 text-primary" />;
    }
  };

  if (loading) {
    return (
      <div className="kaggle-card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="flex space-x-4 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-80 h-48 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (cases.length === 0) {
    return (
      <div className="kaggle-card p-6">
        <div className="text-center">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Recommendations</h3>
          <p className="text-muted-foreground mb-4">Start solving cases to get personalized recommendations!</p>
          <Link href="/cases" className="kaggle-button-primary">
            Browse All Cases
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="kaggle-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {getSectionIcon()}
          <h3 className="text-xl font-semibold">{sectionTitle}</h3>
        </div>
        <Link
          href="/cases"
          className="flex items-center space-x-2 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-4">
          {cases.map((caseItem) => (
            <Link
              key={caseItem.id}
              href={`/cases/start/${caseItem.id}`}
              className="flex-shrink-0 w-80 kaggle-card p-6 kaggle-hover-lift block group border-2 border-transparent hover:border-primary/20 transition-all duration-200"
            >
              <div className="mb-4">
                <h4 className="text-lg font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {caseItem.title}
                </h4>
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {caseItem.brief}
                </p>
              </div>

              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Target className="w-4 h-4" />
                  <span>{caseItem.domain}</span>
                </div>
                <div className={`${getDifficultyColor(caseItem.difficulty)}`}>
                  {getDifficultyText(caseItem.difficulty)}
                </div>
              </div>

              <div className="flex items-center justify-between">
                {caseItem.estimated_time && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{caseItem.estimated_time} min</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-4 h-4" />
                  <span>Start</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}