// lib/auth-helpers.ts
import { createClient } from './supabase-server';

/**
 * Get the current logged-in user, or null if not authenticated.
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Check if the current user is an admin.
 * Admins have `is_admin = TRUE` in the `user_profiles` table.
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (error || !data) return false;
  return data.is_admin === true;
}