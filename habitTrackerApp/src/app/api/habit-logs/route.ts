import { supabase } from '@/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for creating habit logs
const createHabitLogSchema = z.object({
  habit_id: z.string().uuid('Invalid habit ID'),
  completed_at: z.string().datetime().optional(),
  count: z.number().min(1).optional(),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    // Get user from auth header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', message: 'No valid authorization token' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const habitId = searchParams.get('habit_id');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const token = authHeader.replace('Bearer ', '');
    const { data: user } = await supabase.auth.getUser(token);

    if (!user.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Build query with join to get habit info
    let query = supabase
      .from('habit_logs')
      .select(`
        *,
        habits:habit_id (
          title,
          color
        )
      `)
      .eq('user_id', user.user.id)
      .order('completed_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (habitId) {
      query = query.eq('habit_id', habitId);
    }
    if (startDate) {
      query = query.gte('completed_at', startDate);
    }
    if (endDate) {
      query = query.lte('completed_at', endDate);
    }

    const { data: logs, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Database error', message: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      {
        success: true,
        message: 'Habit logs retrieved successfully',
        data: {
          logs: logs || [],
          total: count || 0,
          hasMore: (count || 0) > offset + limit
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Something went wrong fetching habit logs',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user from auth header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', message: 'No valid authorization token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { habit_id, completed_at, count = 1, notes } = createHabitLogSchema.parse(body);

    const token = authHeader.replace('Bearer ', '');
    const { data: user } = await supabase.auth.getUser(token);

    if (!user.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Verify habit belongs to user
    const { data: habit, error: habitError } = await supabase
      .from('habits')
      .select('id')
      .eq('id', habit_id)
      .eq('user_id', user.user.id)
      .eq('is_active', true)
      .single();

    if (habitError || !habit) {
      return NextResponse.json(
        { success: false, error: 'Not found', message: 'Habit not found or inactive' },
        { status: 404 }
      );
    }

    // Create habit log
    const { data: log, error } = await supabase
      .from('habit_logs')
      .insert({
        habit_id,
        user_id: user.user.id,
        completed_at: completed_at || new Date().toISOString(),
        notes: notes || null
      })
      .select()
      .single();

    if (error) {
      // Handle duplicate entry (same habit, same day)
      if (error.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'Already logged', message: 'Habit already logged for this day' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { success: false, error: 'Database error', message: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      {
        success: true,
        message: 'Habit completion logged successfully',
        data: log
      },
      { status: 201 }
    );
    
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Something went wrong logging habit completion',
      },
      { status: 500 }
    );
  }
}