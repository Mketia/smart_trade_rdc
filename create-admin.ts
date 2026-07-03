import connectToDatabase from './src/lib/mongodb';
import User from './src/models/User';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

async function createAdmin() {
  try {
    await connectToDatabase();
    
    const email = 'admin@smarttrade.cd';
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = await User.create({
      name: 'System Admin',
      email: email,
      password: hashedPassword,
      role: 'admin',
      companyName: 'SmartTrade RDC',
    });

    console.log('Admin user created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: admin123`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
