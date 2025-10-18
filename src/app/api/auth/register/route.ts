import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, phone, password } = body;

  if (!name || !email || !phone || !password) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
  }

  // In a real app, save to database
  const newUser = {
    id: `user${Date.now()}`,
    name,
    email,
    phone,
    walletBalance: 500, // Welcome bonus
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json({ 
    user: newUser,
    token: `token_${newUser.id}`,
    message: 'Registration successful! ৳500 welcome bonus added to your wallet'
  }, { status: 201 });
}

