import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Professional from '../../../models/Professional';

export async function GET() {
  try {
    await dbConnect();
    const professionals = await Professional.find({}).sort({ rating: -1 });
    
    // Return empty array instead of 404 if no data
    return NextResponse.json(professionals);
  } catch (error) {
    console.error('Failed to fetch professionals:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    const professional = await Professional.create(body);
    return NextResponse.json(professional, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create professional:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { _id, ...updateData } = body;
    
    if (!_id) {
      return NextResponse.json({ error: 'Professional ID is required' }, { status: 400 });
    }

    const professional = await Professional.findByIdAndUpdate(_id, updateData, { new: true });
    
    if (!professional) {
      return NextResponse.json({ error: 'Professional not found' }, { status: 404 });
    }

    return NextResponse.json(professional);
  } catch (error: any) {
    console.error('Failed to update professional:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Professional ID is required' }, { status: 400 });
    }

    const deleted = await Professional.findByIdAndDelete(id);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Professional not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete professional:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
