import { createUserProfile, createUserStats, awardAchievement } from './database';
import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

export async function setupNewUser(user: User) {
  try {
    // Create user profile
    const profile = await createUserProfile({
      user_id: user.id,
      display_name: user.user_metadata?.full_name || 'Case Solver',
      bio: 'Passionate about solving complex business challenges'
    });

    // Create user stats
    const stats = await createUserStats({
      user_id: user.id,
      total_score: 0,
      cases_solved: 0,
      current_streak: 0,
      longest_streak: 0,
      average_score: 0
    });

    // Award first achievement (if achievements exist)
    try {
      await awardAchievement(user.id, 'first-case-achievement-id');
    } catch (error) {
      // Achievement might not exist yet, that's okay
      console.log('First case achievement not available yet');
    }

    return { profile, stats };
  } catch (error) {
    console.error('Error setting up new user:', error);
    // Don't throw error, just return null to prevent infinite loops
    return { profile: null, stats: null };
  }
}

export async function checkAndSetupUser(user: User) {
  try {
    // Check if user profile exists
    const { data: existingProfile, error } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (error || !existingProfile) {
      // User doesn't have a profile, set them up
      await setupNewUser(user);
    }
  } catch (error) {
    // Profile doesn't exist or table doesn't exist, set up new user
    console.log('Setting up new user due to error:', error);
    await setupNewUser(user);
  }
} 