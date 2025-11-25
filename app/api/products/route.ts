import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Product from '@/lib/models/Product';

// GET all products with filtering and pagination
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const anime = searchParams.get('anime');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const sort = searchParams.get('sort') || '-createdAt';

    const query: any = {};

    if (category) query.category = category;
    if (anime) query.anime = anime;
    if (featured) query.featured = true;
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get products error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

// POST create new product (admin only)
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const productData = await req.json();

    const product = await Product.create(productData);

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
