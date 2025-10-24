// Utility to sync Clerk users with Supabase
import { supabase } from './supabaseClient';

export interface ClerkUser {
  id: string;
  emailAddresses: Array<{ emailAddress: string }>;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  username?: string | null;
  imageUrl?: string | null;
}

export async function syncUserToSupabase(clerkUser: ClerkUser) {
  try {
    console.log('Syncing user to Supabase:', clerkUser.id);
    
    // First check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, id_text')
      .eq('id_text', clerkUser.id)
      .single();

    const userData = {
      id_text: clerkUser.id,
      name: clerkUser.fullName || clerkUser.firstName || clerkUser.username || '',
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      avatar_url: clerkUser.imageUrl || null,
    };

    let result;
    
    if (existingUser) {
      // User exists - update without changing the id
      console.log('Updating existing user');
      result = await supabase
        .from('users')
        .update(userData)
        .eq('id_text', clerkUser.id);
    } else {
      // User doesn't exist - insert with new UUID
      console.log('Creating new user');
      result = await supabase
        .from('users')
        .insert({
          id: crypto.randomUUID(), // Only set UUID on first insert
          ...userData
        });
    }

    if (result.error) {
      console.error('Error syncing user to Supabase:', {
        message: result.error.message,
        details: result.error.details,
        hint: result.error.hint,
        code: result.error.code
      });
      throw result.error;
    }
    
    console.log('User synced successfully to Supabase');
    return true;
  } catch (error) {
    console.error('Failed to sync user to Supabase:', error);
    return false;
  }
}

export async function ensureUserExists(clerkUser: ClerkUser) {
  try {
    // Check if user exists first
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id_text')
      .eq('id_text', clerkUser.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error checking for existing user:', checkError);
      // If it's just "not found", continue to create the user
      if (checkError.code !== 'PGRST116') {
        return false;
      }
    }

    // If user doesn't exist, create them
    if (!existingUser) {
      console.log('User does not exist, syncing now...');
      return await syncUserToSupabase(clerkUser);
    }
    
    console.log('User already exists in Supabase');
    return true;
  } catch (error) {
    console.error('Error ensuring user exists:', error);
    return false;
  }
}