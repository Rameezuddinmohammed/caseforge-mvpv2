'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

type Case = {
  id: string;
  title: string;
  domain: string;
  difficulty?: number;
};

export default function CaseListPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      const { data, error } = await supabase.from('cases').select('id, title, domain, difficulty');
      if (error) {
        console.error('Error fetching cases:', error.message);
      } else {
        setCases(data || []);
      }
      setLoading(false);
    };

    fetchCases();
  }, []);

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-900 text-white">
        <Navigation />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-6">📚 Start Solving Business Cases</h1>

          {loading ? (
            <p>Loading cases...</p>
          ) : cases.length === 0 ? (
            <p>No cases available yet.</p>
          ) : (
            <div className="space-y-4">
              {cases.map((c) => (
                <Link
                  key={c.id}
                  href={`/cases/start/${c.id}`}
                  className="block border border-gray-700 rounded p-4 hover:bg-gray-800 transition"
                >
                  <h2 className="text-xl font-semibold">{c.title}</h2>
                  <p className="text-sm text-gray-400">{c.domain}</p>
                  {c.difficulty !== undefined && (
                    <p className="text-sm mt-1">Difficulty: {c.difficulty}/5</p>
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
