import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  // In a real app, verify credentials from database
  // For demo purposes, check against demo account
  if (email === 'demo@ihntopup.com' && password === 'demo123') {
    const user = {
      id: 'demo_user',
      name: 'Demo User',
      email: 'demo@ihntopup.com',
      phone: '+8801712345678',
      walletBalance: 500,
    };

    return NextResponse.json({ 
      user,
      token: 'demo_token_12345',
      message: 'Login successful'
    });
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}

