import { supabase } from '@/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: {
    id: string;
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    
    // Get user from auth header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', message: 'No valid authorization token' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: user } = await supabase.auth.getUser(token);

    if (!user.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Delete habit log with ownership verification
    const { data: deletedLog, error } = await supabase
      .from('habit_logs')
      .delete()
      .eq('id', id)
      .eq('user_id', user.user.id)
      .select()
      .single();

    if (error || !deletedLog) {
      return NextResponse.json(
        { success: false, error: 'Not found', message: 'Habit log not found or unauthorized' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      {
        success: true,
        message: 'Habit log deleted successfully',
        data: deletedLog
      },
      { status: 200 }
    );
    
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Something went wrong deleting habit log',
      },
      { status: 500 }
    );
  }
}