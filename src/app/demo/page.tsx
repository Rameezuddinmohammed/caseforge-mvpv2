'use client';

import { useState } from 'react';
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
  Users
} from 'lucide-react';

// Mock data for demonstration
const mockUserStats = {
  id: '1',
  user_id: '1',
  total_score: 1250,
  cases_solved: 8,
  current_streak: 5,
  longest_streak: 12,
  average_score: 87.5,
  xp: 3600,
  level: 3,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const mockUser = {
  id: '1',
  email: 'demo@example.com',
  user_metadata: {
    full_name: 'Demo User'
  }
};

export default function DemoPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayName = mockUser.user_metadata.full_name || 'Case Solver';

  return (
    <main className="min-h-screen bg-background">
      {/* Mock Navigation */}
      <nav className="bg-background border-b border-border kaggle-nav-shadow">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold" style={{ color: '#2F5233' }}>Caseforge</span>
            </div>
            <div className="flex items-center space-x-8">
              <span className="text-sm text-muted-foreground">Dashboard</span>
              <span className="text-sm text-muted-foreground">Cases</span>
              <span className="text-sm text-muted-foreground">Leaderboard</span>
              <span className="text-sm text-muted-foreground">Profile</span>
            </div>
          </div>
        </div>
      </nav>
      
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
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-foreground">
                    3,600/5,000 XP
                  </span>
                  <span className="text-sm text-muted-foreground">→</span>
                  <span className="text-sm font-medium text-foreground">
                    Level 4
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Level 3
                </div>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="h-2 bg-success rounded-full transition-all duration-300"
                  style={{ width: '72%' }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Mock Resume Case Button */}
          <div className="mt-4">
            <div className="inline-flex items-center space-x-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <div className="flex flex-col items-start">
                <span className="text-lg">Resume Case</span>
                <span className="text-sm opacity-90">
                  HealthTech Market Entry
                </span>
              </div>
              <div className="flex items-center space-x-1 text-sm opacity-90">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>Today</span>
              </div>
            </div>
          </div>
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
                  {mockUserStats.cases_solved}
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
                  {mockUserStats.current_streak}
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
                  {mockUserStats.average_score}%
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
                  {mockUserStats.total_score}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Cumulative points earned</p>
          </div>
        </div>

        {/* Enhanced Daily Challenge */}
        <div className="mb-12">
          <div className="kaggle-card p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">Daily Challenge</h3>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 6c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5S11.17 8 12 8zm0 8c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                </svg>
                <span className="font-mono">23:45:12</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-2xl font-semibold mb-4">
                HealthTech Market Entry
              </h4>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                HealthTech, a startup developing AI-powered diagnostic tools, is preparing to launch their first product. They have FDA approval and $5M in funding. The marketing team needs to develop a go-to-market strategy targeting healthcare providers and patients.
              </p>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2 text-sm">
                  <Target className="w-4 h-4" />
                  <span>Marketing</span>
                </div>
                <div className="kaggle-badge-green">
                  Beginner
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 6c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5S11.17 8 12 8zm0 8c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                  </svg>
                  <span>40 min</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Complete daily challenges to earn bonus XP and maintain your streak!
              </div>
              
              <div className="inline-flex items-center space-x-2 px-8 py-3 rounded-lg font-medium bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <span>Start</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Cases */}
        <div className="mb-12">
          <div className="kaggle-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold">Recommended for You</h3>
              </div>
              <div className="flex items-center space-x-2 text-sm text-primary hover:text-primary/80 transition-colors">
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="flex space-x-4 pb-4">
                {/* Case 1 */}
                <div className="flex-shrink-0 w-80 kaggle-card p-6 border-2 border-transparent hover:border-primary/20 transition-all duration-200">
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold mb-3">
                      TechStart Expansion Strategy
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      TechStart, a successful SaaS company with $10M ARR, is considering expanding into the European market...
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Target className="w-4 h-4" />
                      <span>Strategy</span>
                    </div>
                    <div className="kaggle-badge-yellow">
                      Intermediate
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 6c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5S11.17 8 12 8zm0 8c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                      </svg>
                      <span>45 min</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-primary">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      <span>Start</span>
                    </div>
                  </div>
                </div>

                {/* Case 2 */}
                <div className="flex-shrink-0 w-80 kaggle-card p-6 border-2 border-transparent hover:border-primary/20 transition-all duration-200">
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold mb-3">
                      GreenEnergy Cost Optimization
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      GreenEnergy, a renewable energy provider, is facing increasing operational costs while maintaining competitive pricing...
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Target className="w-4 h-4" />
                      <span>Operations</span>
                    </div>
                    <div className="kaggle-badge-red">
                      Advanced
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 6c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5S11.17 8 12 8zm0 8c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                      </svg>
                      <span>60 min</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-primary">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      <span>Start</span>
                    </div>
                  </div>
                </div>

                {/* Case 3 */}
                <div className="flex-shrink-0 w-80 kaggle-card p-6 border-2 border-transparent hover:border-primary/20 transition-all duration-200">
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold mb-3">
                      RetailChain Digital Transformation
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      RetailChain, a traditional brick-and-mortar retailer with 200 stores, is struggling to compete with e-commerce giants...
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Target className="w-4 h-4" />
                      <span>Technology</span>
                    </div>
                    <div className="kaggle-badge-yellow">
                      Intermediate
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 6c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5S11.17 8 12 8zm0 8c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                      </svg>
                      <span>50 min</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-primary">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      <span>Start</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}