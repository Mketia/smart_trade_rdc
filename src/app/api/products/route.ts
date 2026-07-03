import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Product from '../../../models/Product';

export async function GET() {
  try {
    await connectToDatabase();
    let products = await Product.find({});
    
    return NextResponse.json({ products }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error fetching products', error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await connectToDatabase();
    
    // Ensure ID is unique or generate if missing
    if (!data.id) {
      data.id = data.nameKey.replace('prod_', '') || Date.now().toString();
    }
    
    const newProduct = await Product.create(data);
    
    if ((global as any).io) {
      (global as any).io.emit('product_updated', { action: 'add', product: newProduct });
    }

    return NextResponse.json({ message: 'Product created', product: newProduct }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error creating product', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ message: 'Product ID required' }, { status: 400 });
    }
    
    await connectToDatabase();
    await Product.findOneAndDelete({ id });
    
    if ((global as any).io) {
      (global as any).io.emit('product_updated', { action: 'delete', id });
    }
    
    return NextResponse.json({ message: 'Product deleted' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error deleting product', error: error.message }, { status: 500 });
  }
}
