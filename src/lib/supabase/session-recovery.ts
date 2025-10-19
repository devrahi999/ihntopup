/**
 * Session Recovery Utility for handling redirect scenarios
 * This helps maintain Supabase sessions after external redirects (payment gateways, etc.)
 */

import { createClient } from './client';

/**
 * Attempts to recover session after redirect
 * This should be called on pages that users are redirected to after external navigation
 */
export async function attemptSessionRecovery(): Promise<boolean> {
  const supabase = createClient();
  
  try {
    console.log('🔄 Attempting session recovery...');
    
    // Get current session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Session recovery error:', error);
      return false;
    }
    
    if (session) {
      console.log('✅ Session recovered successfully:', session.user?.email);
      return true;
    } else {
      console.log('❌ No session found after recovery attempt');
      return false;
    }
  } catch (error) {
    console.error('❌ Session recovery failed:', error);
    return false;
  }
}

/**
 * Checks if user is authenticated and redirects if not
 * Useful for protected pages
 */
export async function ensureAuthenticated(redirectTo: string = '/login'): Promise<boolean> {
  const supabase = createClient();
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('🔒 User not authenticated, redirecting to:', redirectTo);
      if (typeof window !== 'undefined') {
        window.location.href = redirectTo;
      }
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ Authentication check failed:', error);
    if (typeof window !== 'undefined') {
      window.location.href = redirectTo;
    }
    return false;
  }
}

/**
 * Debug function to check session state
 */
export function debugSessionState(): void {
  if (typeof window === 'undefined') return;
  
  const supabase = createClient();
  
  console.log('🔍 Session Debug Info:');
  console.log('- localStorage supabase.auth.token:', localStorage.getItem('supabase.auth.token'));
  console.log('- localStorage supabase.auth.refresh-token:', localStorage.getItem('supabase.auth.refresh-token'));
  
  supabase.auth.getSession().then(({ data: { session }, error }) => {
    console.log('- Supabase session:', session ? '✅ Found' : '❌ Not found');
    console.log('- Session error:', error);
    console.log('- User email:', session?.user?.email);
  });
}
