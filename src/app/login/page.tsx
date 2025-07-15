'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { BookOpen } from 'lucide-react';

export default function LoginPage() {
  const { user, loading, error, clearError } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();

  // Clear any auth errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Check for error in URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    if (errorParam) {
      setLoginError(decodeURIComponent(errorParam));
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
      }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
        router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleLogin = async () => {
    setIsSigningIn(true);
    setLoginError(null);
    
    try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
    });
      
    if (error) {
        setLoginError(error.message);
      }
    } catch (err) {
      setLoginError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </main>
    );
  }

  // Show redirect state if user is authenticated
  if (user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="kaggle-card p-8 space-y-6">
          {/* Logo and Title */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 kaggle-gradient rounded-xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Welcome to Caseforge</h1>
              <p className="text-muted-foreground">
                Master business case solving with AI-powered challenges
              </p>
            </div>
          </div>
          
          {/* Error Message */}
          {loginError && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-4 text-error">
              <p className="text-sm">{loginError}</p>
            </div>
          )}
          
          {/* Sign In Button */}
          <button
            onClick={handleLogin}
            disabled={isSigningIn}
            className="w-full kaggle-button-primary py-3 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigningIn ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>
          
          {/* Footer */}
          <div className="text-center space-y-4">
            <p className="text-xs text-muted-foreground">
              By signing in, you agree to our{' '}
              <a href="#" className="text-primary hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </p>
            
            <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
              <span>🚀 AI-Powered Cases</span>
              <span>•</span>
              <span>📊 Progress Tracking</span>
              <span>•</span>
              <span>🏆 Achievements</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
