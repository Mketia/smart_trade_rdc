import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '../../../../lib/mongodb';
import User from '../../../../models/User';

export async function PUT(req: Request) {
  try {
    const { userId, newPassword } = await req.json();

    if (!userId || !newPassword) {
      return NextResponse.json({ message: 'User ID and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    await connectToDatabase();

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const user = await User.findByIdAndUpdate(userId, { password: hashedPassword });
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Password updated successfully' }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: 'Error updating password', error: error.message }, { status: 500 });
  }
}
