import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Get admin credentials from environment variables
    const adminUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    const adminId = process.env.ADMIN_ID || 'admin/admin001';

    // Check if admin credentials are configured
    if (!adminUsername || !adminPassword) {
      return NextResponse.json(
        { valid: false, error: 'Admin credentials not configured' },
        { status: 500 }
      );
    }

    // Validate credentials
    if (username === adminUsername && password === adminPassword) {
      return NextResponse.json({
        valid: true,
        adminId,
        message: 'Admin login successful'
      });
    } else {
      return NextResponse.json(
        { valid: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Admin validation error:', error);
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
