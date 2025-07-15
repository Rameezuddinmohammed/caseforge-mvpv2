'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminPanelPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Case form state
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('');
  const [brief, setBrief] = useState('');
  const [criteria, setCriteria] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [message, setMessage] = useState('');

  // Check if user is authorized
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      const currentUser = data.user;
      if (currentUser?.email === 'rameezuddinmohammed61@gmail.com') {
        setUser(currentUser);
        setLoading(false);
      } else {
        router.push('/');
      }
    };

    checkUser();
  }, [router]);

  // Upload case to Supabase
  const handleSubmit = async () => {
    if (!title || !domain || !brief || !criteria || !difficulty) {
      setMessage('❌ Please fill in all fields, including difficulty.');
      return;
    }
    const { error } = await supabase.from('cases').insert([{
      title,
      domain,
      brief,
      evaluation_criteria: criteria,
      difficulty: Number(difficulty),
      is_active: true,
    }]);

    if (error) {
      setMessage(`❌ Error: ${error.message}`);
    } else {
      setMessage('✅ Case uploaded successfully!');
      setTitle('');
      setDomain('');
      setBrief('');
      setCriteria('');
      setDifficulty('');
    }
  };

  if (loading) {
    return <div className="text-white text-center mt-10">Loading admin panel...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Upload a Business Case</h1>
      <p className="mb-4">Logged in as <strong>{user.email}</strong></p>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Case Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-white text-black placeholder-gray-500"
        />

        <input
          type="text"
          placeholder="Domain (e.g., Strategy, Marketing)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="w-full p-2 rounded bg-white text-black placeholder-gray-500"
        />

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full p-2 rounded bg-white text-black placeholder-gray-500"
          required
        >
          <option value="">Select Difficulty</option>
          <option value="1">Beginner</option>
          <option value="2">Intermediate</option>
          <option value="3">Advanced</option>
        </select>

        <textarea
          placeholder="Case Brief / Description"
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          rows={6}
          className="w-full p-2 rounded bg-white text-black placeholder-gray-500"
        />

        <textarea
          placeholder="Evaluation Criteria (comma-separated)"
          value={criteria}
          onChange={(e) => setCriteria(e.target.value)}
          rows={3}
          className="w-full p-2 rounded bg-white text-black placeholder-gray-500"
        />

        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
        >
          Upload Case
        </button>

        {message && <p className="text-white mt-2">{message}</p>}
      </div>
    </div>
  );
}

