import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Incentive from '../../../models/Incentive';

const SEED_INCENTIVES = [
  {
    title: 'EAC Simplified Trade Regime (STR)',
    authority: 'EAC Regional',
    description: 'A regional trade facilitation policy designed to help small-scale cross-border traders by removing import duties on goods grown or produced inside East African Community member states.',
    benefits: '0% Import Duty on eligible agricultural and manufactured goods.',
    requirements: [
      'Consignment value must be under $2,000 USD.',
      'Goods must be produced locally within the EAC (certified by a simplified certificate of origin).',
      'Traders must clear goods through official EAC border channels.'
    ]
  },
  {
    title: 'DRC Agricultural Seed and Input Exemption',
    authority: 'DRC (DGDA)',
    description: 'Under the DRC agricultural act, imports of certified seeds, fertilizers, chemical inputs, and specialized agricultural machinery are exempt from import customs tariffs and import VAT.',
    benefits: '0% Duty and 0% VAT on farm inputs.',
    requirements: [
      'Importer must be registered with the DRC Ministry of Agriculture.',
      'Goods must be strictly classified as agricultural inputs (fertilizers, seeds, tractors).'
    ]
  },
  {
    title: 'Rwanda Investment Code Benefits',
    authority: 'Rwanda (RRA/RDB)',
    description: 'A comprehensive investor incentive framework managed by the Rwanda Development Board (RDB) to attract foreign and local capital in strategic sectors.',
    benefits: 'Corporate income tax holidays (up to 7 years), 15% preferential tax rate, and 0% import duty on capital equipment.',
    requirements: [
      'Minimum investment of $250,000 USD for foreign investors (or $100,000 USD for EAC local nationals).',
      'Registration with the Rwanda Development Board and receipt of an Investment Certificate.',
      'Investment must be in target sectors (agriculture, manufacturing, tourism, ICT).'
    ]
  },
  {
    title: 'DRC ANAPI Investment Incentives',
    authority: 'DRC (DGDA)',
    description: 'Approved investment projects under the National Investment Promotion Agency (ANAPI) benefit from tax holidays, customs duty exemptions, and real estate tax breaks.',
    benefits: 'Full exemption from customs duties on capital equipment and raw materials for 3 to 5 years.',
    requirements: [
      'Must submit a comprehensive investment plan and project dossier to ANAPI.',
      'Minimum project capital of $10,000 USD for SMEs or $200,000 USD for large corporations.'
    ]
  }
];

export async function GET() {
  try {
    await connectToDatabase();

    let incentives = await Incentive.find({}).sort({ createdAt: 1 });

    if (incentives.length === 0) {
      incentives = await Incentive.insertMany(SEED_INCENTIVES);
    }

    return NextResponse.json({ incentives }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error fetching incentives', error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await connectToDatabase();

    const newIncentive = await Incentive.create(data);

    if ((global as any).io) {
      (global as any).io.emit('incentive_updated', { action: 'add', incentive: newIncentive });
    }

    return NextResponse.json({ message: 'Incentive created', incentive: newIncentive }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error creating incentive', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Incentive ID required' }, { status: 400 });
    }

    await connectToDatabase();
    await Incentive.findByIdAndDelete(id);

    if ((global as any).io) {
      (global as any).io.emit('incentive_updated', { action: 'delete', id });
    }

    return NextResponse.json({ message: 'Incentive deleted' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error deleting incentive', error: error.message }, { status: 500 });
  }
}
