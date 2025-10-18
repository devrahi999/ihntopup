import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  const origin = requestUrl.origin;

  // Handle errors
  if (error) {
    console.error('Auth callback error:', error, errorDescription);
    return NextResponse.redirect(`${origin}/login?error=auth_failed&message=${encodeURIComponent(errorDescription || 'Authentication failed')}`);
  }

  if (code) {
    const supabase = createClient();
    const { error: authError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (authError) {
      console.error('Auth session exchange error:', authError);
      return NextResponse.redirect(`${origin}/login?error=auth_failed&message=${encodeURIComponent(authError.message)}`);
    }

    // Check if this is a password reset flow
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      // Check if the user is in recovery mode (password reset)
      const { data: userData } = await supabase.auth.getUser();
      
      if (userData.user?.app_metadata?.provider === 'email') {
        // Redirect to reset password page for password reset flow
        return NextResponse.redirect(`${origin}/reset-password`);
      }
    }
  }

  // Default redirect to home page
  return NextResponse.redirect(`${origin}/`);
}
