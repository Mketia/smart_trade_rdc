import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectToDatabase from '../../../../lib/mongodb';
import User from '../../../../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_change_me_in_production';

export async function POST(req: Request) {
  try {
    const { name, email, password, role, companyName, contactNumber, description } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Name, email, and password are required' }, { status: 400 });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role === 'admin' ? 'small_trader' : (role || 'small_trader'),
      companyName,
      contactNumber,
      description,
    });

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return NextResponse.json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error registering user', error: error.message }, { status: 500 });
  }
}
