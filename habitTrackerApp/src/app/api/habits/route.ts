import { supabase } from '@/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Request validation schemas
const createHabitSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  description: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  target_count: z.number().min(1, 'Target count must be at least 1'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional(),
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
    const includeStats = searchParams.get('include_stats') === 'true';
    const isActive = searchParams.get('is_active');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Set the auth token for this request
    const token = authHeader.replace('Bearer ', '');
    const { data: user } = await supabase.auth.getUser(token);

    if (!user.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Build query
    let query = supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.user.id)
      .range(offset, offset + limit - 1);

    // Apply filters
    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true');
    }

    const { data: habits, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Database error', message: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      {
        success: true,
        message: 'Habits retrieved successfully',
        data: {
          habits: habits || [],
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
        message: 'Something went wrong fetching habits',
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

    // Validate request body
    const body = await request.json();
    const { title, description, frequency, target_count, color } = createHabitSchema.parse(body);

    // Set the auth token for this request
    const token = authHeader.replace('Bearer ', '');
    const { data: user } = await supabase.auth.getUser(token);

    if (!user.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Create habit in database
    const { data: habit, error } = await supabase
      .from('habits')
      .insert({
        user_id: user.user.id,
        title,
        description: description || null,
        frequency,
        target_count,
        color: color || '#3B82F6',
        is_active: true
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Database error', message: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      {
        success: true,
        message: 'Habit created successfully',
        data: habit
      },
      { status: 201 }
    );
    
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Something went wrong creating habit',
      },
      { status: 500 }
    );
  }
}