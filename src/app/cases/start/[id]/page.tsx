'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { createSubmission, getUserStats, updateUserStats, createUserStreak, getUserStreak } from '@/lib/database';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  Clock, 
  Target, 
  TrendingUp, 
  BookOpen,
  Timer,
  Send,
  CheckCircle,
  ArrowLeft,
  FileText,
  AlertCircle
} from 'lucide-react';
import type { Case } from '@/types/database';

export default function CaseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [response, setResponse] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const { data, error } = await supabase
          .from('cases')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error('Error fetching case:', error.message);
          setMessage('Error loading case. Please try again.');
        } else {
          setCaseData(data);
          setStartTime(new Date());
        }
      } catch (error) {
        console.error('Error fetching case:', error);
        setMessage('Error loading case. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [id]);

  // Timer effect
  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  const handleSubmit = async () => {
    if (!user?.id || !response.trim()) {
      setMessage('Please write a response.');
      return;
    }

    setSubmitting(true);
    try {
      // Create submission
      const submission = await createSubmission({
        case_id: id as string,
        user_id: user.id,
        response: response.trim(),
        time_spent: elapsedTime
      });

      if (!submission) {
        throw new Error('Failed to create submission');
      }

      // Update user stats
      const currentStats = await getUserStats(user.id);
      if (currentStats) {
        const newCasesSolved = currentStats.cases_solved + 1;
        const newTotalScore = currentStats.total_score + (caseData?.difficulty || 1) * 10; // Basic scoring
        const newAverageScore = ((currentStats.average_score * currentStats.cases_solved) + 85) / newCasesSolved; // Mock score of 85

        await updateUserStats(user.id, {
          cases_solved: newCasesSolved,
          total_score: newTotalScore,
          average_score: newAverageScore
        });
      }

      // Create or update daily streak
      const today = new Date().toISOString().split('T')[0];
      const existingStreak = await getUserStreak(user.id, today);
      
      if (!existingStreak) {
        await createUserStreak({
          user_id: user.id,
          streak_date: today,
          cases_completed: 1
        });
      }

      setMessage('Submission successful! Your response has been recorded.');
      setResponse('');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Error submitting:', error);
      setMessage('Error submitting your response. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-background">
          <Navigation />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  if (!caseData) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-background">
          <Navigation />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Case Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The case you're looking for doesn't exist or has been removed.
              </p>
              <button
                onClick={() => router.push('/cases')}
                className="kaggle-button-primary"
              >
                Browse Cases
              </button>
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
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => router.push('/cases')}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cases</span>
          </button>

          {/* Case Header */}
          <div className="kaggle-card p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-4">{caseData.title}</h1>
                <div className="flex items-center space-x-4 text-sm mb-4">
                  <div className="flex items-center space-x-1">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{caseData.domain}</span>
                  </div>
                  <div className={getDifficultyColor(caseData.difficulty)}>
                    {getDifficultyText(caseData.difficulty)}
                  </div>
                  {caseData.estimated_time && (
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{caseData.estimated_time} min estimated</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Timer */}
              <div className="flex items-center space-x-2 bg-muted px-4 py-2 rounded-lg">
                <Timer className="w-4 h-4 text-primary" />
                <span className="font-mono text-sm font-medium">{formatTime(elapsedTime)}</span>
              </div>
            </div>

            <div className="prose prose-sm max-w-none">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span>Case Brief</span>
                </h3>
                <p className="text-muted-foreground leading-relaxed">{caseData.brief}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span>Evaluation Criteria</span>
                </h3>
                <p className="text-muted-foreground leading-relaxed">{caseData.evaluation_criteria}</p>
              </div>
            </div>
          </div>

          {/* Response Section */}
          <div className="kaggle-card p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-primary" />
              <span>Your Response</span>
            </h2>
            
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Write your solution here... Be thorough and structured in your approach."
              rows={12}
              className="w-full p-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            />

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                {response.length} characters
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={submitting || !response.trim()}
                className="kaggle-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    <span>Submit Response</span>
                  </>
                )}
              </button>
            </div>

            {message && (
              <div className={`mt-4 p-3 rounded-lg flex items-center space-x-2 ${
                message.includes('successful') 
                  ? 'bg-success/10 border border-success/20 text-success' 
                  : 'bg-error/10 border border-error/20 text-error'
              }`}>
                {message.includes('successful') ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span>{message}</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}