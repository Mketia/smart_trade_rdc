import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import TaxSettings from '../../../models/TaxSettings';

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await TaxSettings.findOne({});
    if (!settings) {
      // Create default if none exists
      settings = await TaxSettings.create({});
    }
    return NextResponse.json({ settings }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error fetching tax settings', error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    await connectToDatabase();
    
    let settings = await TaxSettings.findOne({});
    if (settings) {
      // Update existing
      settings = await TaxSettings.findByIdAndUpdate(settings._id, data, { new: true });
    } else {
      // Create new
      settings = await TaxSettings.create(data);
    }
    
    if ((global as any).io) {
      (global as any).io.emit('tax_updated', { message: `Tax rates have been updated`, settings });
    }

    return NextResponse.json({ message: 'Tax settings updated', settings }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error updating tax settings', error: error.message }, { status: 500 });
  }
}
