import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Get user credentials from server environment variables
    const userUsername = process.env.EB_USER_USERNAME;
    const userPassword = process.env.EB_USER_PASSWORD;
    const userId = process.env.USER_ID || 'user/user001';

    // Check if user credentials are configured
    if (!userUsername || !userPassword) {
      return NextResponse.json(
        { valid: false, error: 'User credentials not configured' },
        { status: 500 }
      );
    }

    // Validate credentials
    if (username === userUsername && password === userPassword) {
      return NextResponse.json({
        valid: true,
        userId,
        message: 'User login successful'
      });
    } else {
      return NextResponse.json(
        { valid: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('User validation error:', error);
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
