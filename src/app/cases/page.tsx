'use client';

import { useEffect, useState } from 'react';
import { getCases } from '@/lib/database';
import type { Case } from '@/types/database';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Target,
  Filter,
  Search,
  ArrowRight,
  ChevronDown
} from 'lucide-react';

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<string>(''); // Start as empty
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Move allDomains and domains outside of render so it always includes all possible domains
  const [allDomains, setAllDomains] = useState<string[]>([]);

  useEffect(() => {
    // Fetch all cases once to get all unique domains for the dropdown
    const fetchAllDomains = async () => {
      const allCases = await getCases();
      const uniqueDomains = Array.from(new Set(allCases.map((c: Case) => c.domain))).filter(Boolean);
      setAllDomains(uniqueDomains);
      // Set default selectedDomain to 'All Domains' after domains are loaded
      setSelectedDomain('All Domains');
    };
    fetchAllDomains();
  }, []);

  const domains = ['All Domains', ...allDomains];
  const difficulties = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

  // Fetch cases when selectedDomain or selectedDifficulty changes, but only after selectedDomain is initialized
  useEffect(() => {
    if (!selectedDomain) return;
    const fetchCases = async () => {
      try {
        const filters: any = {};
        // Only add domain filter if not 'All Domains'
        if (selectedDomain && selectedDomain !== 'All Domains') {
          filters.domain = selectedDomain;
        }
        // Only add difficulty filter if not 'All Levels'
        if (selectedDifficulty && selectedDifficulty !== 'All Levels') {
          const difficultyMap: { [key: string]: number } = {
            'Beginner': 1,
            'Intermediate': 2,
            'Advanced': 3
          };
          filters.difficulty = difficultyMap[selectedDifficulty];
        }
        const casesData = await getCases(filters);
        setCases(casesData);
      } catch (error) {
        console.error('Error fetching cases:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, [selectedDomain, selectedDifficulty]);

  // Only apply search filter, not domain/difficulty, to the already filtered backend results
  const filteredCases = cases.filter(caseItem => {
    const matchesSearch =
      caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (caseItem.tags && caseItem.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesSearch;
  });
  console.log('Filtered cases for rendering:', filteredCases);

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

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background">
        <Navigation />
        
        <div className="kaggle-container py-10">
          {/* Page Header */}
          <div className="kaggle-page-header">
            <h1 className="kaggle-page-title">Business Cases</h1>
            <p className="kaggle-page-description">
              Practice with real-world business scenarios and sharpen your problem-solving skills
            </p>
          </div>

          {/* Search and Filters */}
          <div className="kaggle-card p-8 mb-10">
            <div className="flex items-center space-x-3 mb-6">
              <Filter className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Filter Cases</h2>
            </div>
            
            <div className="kaggle-form-row">
              {/* Search */}
              <div className="relative md:col-span-2">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search cases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="kaggle-input pl-12 w-full"
                />
              </div>

              {/* Domain Filter */}
              <div className="relative">
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className="kaggle-input w-full appearance-none pr-12"
                >
                  {domains.map((domain) => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
              </div>

              {/* Difficulty Filter */}
              <div className="relative">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="kaggle-input w-full appearance-none pr-12"
                >
                  {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center mt-6 pt-6 border-t border-border">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{filteredCases.length}</span> case{filteredCases.length !== 1 ? 's' : ''} found
              </div>
            </div>
          </div>

          {/* Cases Grid */}
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading cases...</p>
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-3">No cases found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="kaggle-cases-grid">
              {filteredCases.map((caseItem) => (
                <Link
                  key={caseItem.id}
                  href={`/cases/start/${caseItem.id}`}
                  className="kaggle-card p-8 kaggle-hover-lift block group"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                        {caseItem.title}
                      </h3>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Target className="w-4 h-4" />
                          <span>{caseItem.domain}</span>
                        </div>
                        <div className={`${getDifficultyColor(caseItem.difficulty)}`}>
                          {getDifficultyText(caseItem.difficulty)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                    {caseItem.brief}
                  </p>

                  <div className="flex items-center justify-between mb-6">
                    {caseItem.estimated_time && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{caseItem.estimated_time} min</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Start Case</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Tags */}
                  {caseItem.tags && caseItem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {caseItem.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {caseItem.tags.length > 3 && (
                        <span className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full">
                          +{caseItem.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}