import { ZenQuotesService } from '@/lib/services/zenQuotesService';
import type { APIResponse, MotivationalQuote } from '@/types/api';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: {
    service: string;
  }
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { service } = params;
    const { searchParams } = new URL(request.url);

    switch (service.toLowerCase()) {
      case 'zenquotes':
      case 'quotes':
        const type = searchParams.get('type') || 'random';
        const count = parseInt(searchParams.get('count') || '1');
        const habitName = searchParams.get('habit_name') || undefined;

        let quotes: MotivationalQuote | MotivationalQuote[];

        switch (type) {
          case 'daily':
            const dailyQuote = await ZenQuotesService.getTodayQuote();
            quotes = {
              quote: dailyQuote.quote,
              author: dailyQuote.author,
              category: dailyQuote.category as any,
              timestamp: new Date().toISOString(),
              source: 'zenquotes'
            };
            break;

          case 'multiple':
            const multipleQuotes = await ZenQuotesService.getMultipleQuotes(count);
            quotes = multipleQuotes.map((q: any) => ({
              quote: q.quote,
              author: q.author,
              category: q.category as any,
              timestamp: new Date().toISOString(),
              source: 'zenquotes' as const
            }));
            break;

          case 'habit-motivation':
            const habitQuote = await ZenQuotesService.getHabitMotivation(habitName);
            quotes = {
              quote: habitQuote.quote,
              author: habitQuote.author,
              category: habitQuote.category as any,
              timestamp: new Date().toISOString(),
              source: 'zenquotes'
            };
            break;

          case 'random':
          default:
            const randomQuote = await ZenQuotesService.getRandomQuote();
            quotes = {
              quote: randomQuote.quote,
              author: randomQuote.author,
              category: randomQuote.category as any,
              timestamp: new Date().toISOString(),
              source: 'zenquotes'
            };
            break;
        }

        const response: APIResponse<MotivationalQuote | MotivationalQuote[]> = {
          success: true,
          data: quotes,
          message: `${type === 'multiple' ? 'Quotes' : 'Quote'} fetched successfully from ZenQuotes`
        };

        return NextResponse.json(response, { 
          status: 200,
          headers: {
            'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
          }
        });

      default:
        const errorResponse: APIResponse<null> = {
          success: false,
          error: 'Service not supported',
          message: `Integration service '${service}' is not available. Supported services: zenquotes, quotes`
        };

        return NextResponse.json(errorResponse, { status: 404 });
    }

  } catch (error) {
    console.error(`Integration service error for ${params.service}:`, error);

    const errorResponse: APIResponse<null> = {
      success: false,
      error: 'Integration service error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { service } = params;

    switch (service.toLowerCase()) {
      case 'zenquotes':
      case 'quotes':
        const body = await request.json();
        const { action, habit_name } = body;

        if (action === 'get_personalized_quote') {
          const quote = await ZenQuotesService.getHabitMotivation(habit_name);
          
          const response: APIResponse<MotivationalQuote> = {
            success: true,
            data: {
              quote: quote.quote,
              author: quote.author,
              category: quote.category as any,
              timestamp: new Date().toISOString(),
              source: 'zenquotes'
            },
            message: 'Personalized quote fetched successfully'
          };

          return NextResponse.json(response, { status: 200 });
        }

        if (action === 'get_streak_celebration') {
          const quote = await ZenQuotesService.getRandomQuote();
          
          const response: APIResponse<MotivationalQuote> = {
            success: true,
            data: {
              quote: quote.quote,
              author: quote.author,
              category: 'motivation',
              timestamp: new Date().toISOString(),
              source: 'zenquotes'
            },
            message: 'Celebration quote fetched successfully'
          };

          return NextResponse.json(response, { status: 200 });
        }

        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid action',
            message: 'Supported actions: get_personalized_quote, get_streak_celebration'
          },
          { status: 400 }
        );

      default:
        const errorResponse: APIResponse<null> = {
          success: false,
          error: 'Service not supported',
          message: `Integration service '${service}' does not support POST requests`
        };

        return NextResponse.json(errorResponse, { status: 404 });
    }

  } catch (error) {
    console.error(`Integration service POST error for ${params.service}:`, error);

    const errorResponse: APIResponse<null> = {
      success: false,
      error: 'Integration service error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}