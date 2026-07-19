import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Agency from '../../../models/Agency';

const SEED_AGENCIES = [
  { name: 'Agence en Douane Continental', location: 'Goma, DRC', description: 'Customs clearing agency serving traders at the Goma-Gisenyi border corridor.', verified: true },
  { name: 'CCI', location: 'Goma, DRC', description: 'Customs clearing agency serving traders at the Goma-Gisenyi border corridor.', verified: true },
  { name: 'Uhuru Clearing', location: 'Goma, DRC', description: 'Customs clearing agency serving traders at the Goma-Gisenyi border corridor.', verified: true },
  { name: 'Volcano Clearing', location: 'Goma, DRC', description: 'Customs clearing agency serving traders at the Goma-Gisenyi border corridor.', verified: true },
  { name: 'BRAD', location: 'Goma, DRC', description: 'Customs clearing agency serving traders at the Goma-Gisenyi border corridor.', verified: true },
  { name: 'Kivu Clearing', location: 'Goma, DRC', description: 'Customs clearing agency serving traders at the Goma-Gisenyi border corridor.', verified: true },
  { name: 'Kivu Swift Clearing', location: 'Goma, DRC', description: 'Customs clearing agency serving traders at the Goma-Gisenyi border corridor.', verified: true }
];

export async function GET() {
  try {
    await connectToDatabase();

    let agencies = await Agency.find({}).sort({ name: 1 });

    if (agencies.length === 0) {
      agencies = await Agency.insertMany(SEED_AGENCIES);
    }

    return NextResponse.json({ agencies }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error fetching agencies', error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await connectToDatabase();

    const newAgency = await Agency.create(data);

    if ((global as any).io) {
      (global as any).io.emit('agency_updated', { action: 'add', agency: newAgency });
    }

    return NextResponse.json({ message: 'Agency created', agency: newAgency }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error creating agency', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Agency ID required' }, { status: 400 });
    }

    await connectToDatabase();
    await Agency.findByIdAndDelete(id);

    if ((global as any).io) {
      (global as any).io.emit('agency_updated', { action: 'delete', id });
    }

    return NextResponse.json({ message: 'Agency deleted' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error deleting agency', error: error.message }, { status: 500 });
  }
}
