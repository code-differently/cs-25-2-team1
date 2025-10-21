import { supabase } from '@/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: {
    id: string;
  }
}

export async function GET(
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

    // Verify habit ownership
    const { data: habit, error: habitError } = await supabase
      .from('habits')
      .select('id, name, created_at, frequency')
      .eq('id', id)
      .eq('user_id', user.user.id)
      .single();

    if (habitError || !habit) {
      return NextResponse.json(
        { success: false, error: 'Not found', message: 'Habit not found' },
        { status: 404 }
      );
    }

    // Get all habit logs for this habit
    const { data: logs } = await supabase
      .from('habit_logs')
      .select('completed_at')
      .eq('habit_id', id)
      .eq('user_id', user.user.id)
      .order('completed_at', { ascending: false });

    const totalCompletions = logs?.length || 0;

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (logs && logs.length > 0) {
      for (let i = 0; i < logs.length; i++) {
        const logDate = new Date(logs[i].completed_at);
        logDate.setHours(0, 0, 0, 0);
        
        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - i);

        if (logDate.getTime() === expectedDate.getTime()) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;

    if (logs && logs.length > 0) {
      const sortedLogs = [...logs].sort((a, b) => 
        new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime()
      );

      for (let i = 0; i < sortedLogs.length; i++) {
        if (i === 0) {
          tempStreak = 1;
        } else {
          const prevDate = new Date(sortedLogs[i - 1].completed_at);
          const currDate = new Date(sortedLogs[i].completed_at);
          
          prevDate.setHours(0, 0, 0, 0);
          currDate.setHours(0, 0, 0, 0);
          
          const dayDiff = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
          
          if (dayDiff === 1) {
            tempStreak++;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    // Calculate completion rate (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentLogs = logs?.filter((log: any) => 
      new Date(log.completed_at) >= thirtyDaysAgo
    ) || [];
    
    const completionRate = Math.round((recentLogs.length / 30) * 100);

    // Get completion history (last 30 days)
    const completionHistory = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const completed = logs?.some((log: any) => {
        const logDate = new Date(log.completed_at);
        logDate.setHours(0, 0, 0, 0);
        return logDate.getTime() === date.getTime();
      }) || false;

      completionHistory.push({
        date: date.toISOString().split('T')[0],
        completed
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Habit statistics retrieved successfully',
        data: {
          habitId: id,
          habitName: habit.name,
          currentStreak,
          longestStreak,
          completionRate,
          totalCompletions,
          averagePerPeriod: Math.round(recentLogs.length / 4.3), // Weekly average
          completionHistory
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Something went wrong fetching habit statistics',
      },
      { status: 500 }
    );
  }
}