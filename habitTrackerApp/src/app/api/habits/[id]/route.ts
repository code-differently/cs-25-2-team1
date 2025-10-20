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
    
    // TODO: Fullstack engineer (you) - implement get single habit logic here
    // Example: Fetch specific habit by ID from database
    
    return NextResponse.json(
      {
        success: true,
        message: `Get habit ${id} endpoint - awaiting your implementation`,
        data: null
      },
      { status: 200 }
    );
    
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Something went wrong fetching habit',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    
    // TODO: Fullstack engineer (you) - implement update habit logic here
    // Example: Validate input and update habit in database
    
    return NextResponse.json(
      {
        success: true,
        message: `Update habit ${id} endpoint - awaiting your implementation`,
        data: null
      },
      { status: 200 }
    );
    
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Something went wrong updating habit',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    
    // TODO: Fullstack engineer (you) - implement delete habit logic here
    // Example: Soft delete or remove habit from database
    
    return NextResponse.json(
      {
        success: true,
        message: `Delete habit ${id} endpoint - awaiting your implementation`
      },
      { status: 200 }
    );
    
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Something went wrong deleting habit',
      },
      { status: 500 }
    );
  }
}