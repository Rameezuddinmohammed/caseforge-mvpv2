'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (user?.email === 'rameezuddinmohammed61@gmail.com') {
        router.push('/admin/panel');
      } else if (user) {
        alert("You're not authorized to access the admin panel.");
        router.push('/dashboard');
      }
    };

    checkUser();
  }, [router]);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/admin/login`
      }
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Admin Login</h1>
        <button
          onClick={handleLogin}
          className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded"
        >
          Sign in with Google
        </button>
      </div>
    </main>
  );
}
