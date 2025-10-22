import { supabase } from '@/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

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

    const token = authHeader.replace('Bearer ', '');
    const { data: user } = await supabase.auth.getUser(token);

    if (!user.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get total and active habits
    const { data: habitsStats } = await supabase
      .from('habits')
      .select('id, is_active, created_at')
      .eq('user_id', user.user.id);

    const totalHabits = habitsStats?.length || 0;
    const activeHabits = habitsStats?.filter((h: any) => h.is_active).length || 0;

    // Get total completions count
    const { count: totalCompletions } = await supabase
      .from('habit_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.user.id);

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: recentLogs } = await supabase
      .from('habit_logs')
      .select(`
        id,
        completed_at,
        habits:habit_id (
          name,
          color
        )
      `)
      .eq('user_id', user.user.id)
      .gte('completed_at', sevenDaysAgo.toISOString())
      .order('completed_at', { ascending: false })
      .limit(10);

    // Calculate current streaks for active habits
    const activeHabitIds = habitsStats?.filter((h: any) => h.is_active).map((h: any) => h.id) || [];
    const streaks = await Promise.all(
      activeHabitIds.map(async (habitId: any) => {
        // Get habit logs for streak calculation
        const { data: logs } = await supabase
          .from('habit_logs')
          .select('completed_at')
          .eq('habit_id', habitId)
          .eq('user_id', user.user.id)
          .order('completed_at', { ascending: false });

        // Calculate streak
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (logs && logs.length > 0) {
          for (let i = 0; i < logs.length; i++) {
            const logDate = new Date(logs[i].completed_at);
            logDate.setHours(0, 0, 0, 0);
            
            const expectedDate = new Date(today);
            expectedDate.setDate(expectedDate.getDate() - i);

            if (logDate.getTime() === expectedDate.getTime()) {
              streak++;
            } else {
              break;
            }
          }
        }

        const habit = habitsStats?.find((h: any) => h.id === habitId);
        return {
          habitId,
          habitName: habit ? 'Habit' : 'Unknown',
          streak
        };
      })
    );

    // Calculate average completion rate
    const avgCompletionRate = activeHabits > 0 && totalCompletions 
      ? Math.round((totalCompletions / (activeHabits * 30)) * 100) // Rough 30-day average
      : 0;
    
    return NextResponse.json(
      {
        success: true,
        message: 'Dashboard analytics retrieved successfully',
        data: {
          totalHabits,
          activeHabits,
          totalCompletions: totalCompletions || 0,
          avgCompletionRate,
          currentStreaks: streaks,
          recentActivity: recentLogs || []
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Something went wrong fetching dashboard analytics',
      },
      { status: 500 }
    );
  }
}