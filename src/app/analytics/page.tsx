'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Target,
  PieChart,
  Activity,
  Clock,
  Award,
  BookOpen
} from 'lucide-react';

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  // Mock analytics data - in real app, this would come from database
  const analyticsData = {
    totalCases: 45,
    averageScore: 87.5,
    improvementRate: 12.3,
    timeSpent: 28.5, // hours
    domainBreakdown: [
      { domain: 'Strategy', cases: 15, percentage: 33.3 },
      { domain: 'Operations', cases: 12, percentage: 26.7 },
      { domain: 'Finance', cases: 8, percentage: 17.8 },
      { domain: 'Marketing', cases: 6, percentage: 13.3 },
      { domain: 'Technology', cases: 4, percentage: 8.9 }
    ],
    weeklyProgress: [
      { week: 'Week 1', cases: 3, score: 75 },
      { week: 'Week 2', cases: 5, score: 82 },
      { week: 'Week 3', cases: 4, score: 78 },
      { week: 'Week 4', cases: 6, score: 85 },
      { week: 'Week 5', cases: 7, score: 88 },
      { week: 'Week 6', cases: 5, score: 90 }
    ],
    strengths: ['Strategic Thinking', 'Financial Analysis', 'Problem Framing'],
    areasForImprovement: ['Quantitative Analysis', 'Market Research', 'Implementation Planning']
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-900 text-white">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Analytics</h1>
            <p className="text-gray-400">Track your performance and identify areas for improvement</p>
          </div>

          {/* Period Selector */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">Time Period:</span>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'year')}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Activity className="w-4 h-4" />
                <span>Last updated: 2 hours ago</span>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Cases</p>
                  <p className="text-2xl font-bold text-white">{analyticsData.totalCases}</p>
                </div>
                <BookOpen className="w-8 h-8 text-green-400" />
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Average Score</p>
                  <p className="text-2xl font-bold text-white">{analyticsData.averageScore}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Improvement</p>
                  <p className="text-2xl font-bold text-green-400">+{analyticsData.improvementRate}%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-yellow-400" />
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Time Spent</p>
                  <p className="text-2xl font-bold text-white">{analyticsData.timeSpent}h</p>
                </div>
                <Clock className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Domain Breakdown */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Domain Breakdown</h3>
              <div className="space-y-4">
                {analyticsData.domainBreakdown.map((domain, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <span className="text-gray-300">{domain.domain}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{domain.cases}</span>
                      <span className="text-gray-400 text-sm">({domain.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Progress */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
              <div className="space-y-4">
                {analyticsData.weeklyProgress.map((week, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-300">{week.week}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-white">{week.cases} cases</span>
                      <span className="text-blue-400">{week.score}% avg</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Strengths and Areas for Improvement */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Award className="w-5 h-5 text-green-400 mr-2" />
                Your Strengths
              </h3>
              <div className="space-y-3">
                {analyticsData.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 text-yellow-400 mr-2" />
                Areas for Improvement
              </h3>
              <div className="space-y-3">
                {analyticsData.areasForImprovement.map((area, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-gray-300">{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-green-400 mb-2">Focus on Finance</h4>
                <p className="text-sm text-gray-400">You've solved fewer finance cases. Try more to improve your quantitative skills.</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-blue-400 mb-2">Practice Market Research</h4>
                <p className="text-sm text-gray-400">Your market research skills need work. Focus on cases that require external analysis.</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-purple-400 mb-2">Build Implementation Skills</h4>
                <p className="text-sm text-gray-400">Work on cases that focus on execution and implementation planning.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
} 