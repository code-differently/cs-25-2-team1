import { supabase } from '@/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Bad Request',
          message: 'Refresh token is required',
        },
        { status: 400 }
      );
    }

    // Refresh session with Supabase
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken
    });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Token refresh failed',
          message: error.message,
        },
        { status: 401 }
      );
    }

    if (!data.session) {
      return NextResponse.json(
        {
          success: false,
          error: 'Token refresh failed',
          message: 'No session returned from refresh',
        },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      {
        success: true,
        message: 'Token refreshed successfully',
        data: {
          token: data.session.access_token,
          refreshToken: data.session.refresh_token,
          expiresAt: data.session.expires_at 
            ? new Date(data.session.expires_at * 1000).toISOString()
            : null,
          user: {
            id: data.session.user.id,
            email: data.session.user.email
          }
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Something went wrong during token refresh',
      },
      { status: 500 }
    );
  }
}