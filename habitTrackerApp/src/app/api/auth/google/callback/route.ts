import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { exchangeCodeForTokens } from '@/lib/google-auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/calendar?error=access_denied`
      );
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/calendar?error=no_code`
      );
    }

    const supabase = createServerComponentClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/login?error=not_authenticated`
      );
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);

    // Store tokens in user profile or separate table
    const { error: dbError } = await supabase
      .from('user_google_tokens')
      .upsert({
        user_id: session.user.id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        token_type: tokens.token_type,
        scope: tokens.scope,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (dbError) {
      console.error('Database error storing tokens:', dbError);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/calendar?error=storage_failed`
      );
    }

    // Redirect back to calendar page with success
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/calendar?connected=true`
    );

  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/calendar?error=auth_failed`
    );
  }
}