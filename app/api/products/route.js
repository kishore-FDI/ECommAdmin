import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Product } from '@/models/Product';
import { getServerSession } from 'next-auth';
import { adminEmails, authOptions } from '../auth/[...nextauth]/route';

await dbConnect();

export async function check() {
    const session = await getServerSession(authOptions);
    if (!session || !adminEmails.includes(session?.user?.email)) {
        throw new Error('This is for Admins only, Please contact reachouttokishorekumar@gmail.com for permission to access this page');
    }
}

export async function GET(req) {
    try {
        await check();
        const url = new URL(req.url); // Parse the URL
        const id = url.searchParams.get('id'); // Get the 'id' query parameter

        if (id) {
            try {
                // Fetch the product by ID
                const product = await Product.findOne({ _id: id });
                return NextResponse.json(product);
            } catch (error) {
                console.error(error);
                return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
            }
        } else {
            try {
                // Fetch all products if no 'id' is provided
                const products = await Product.find({});
                return NextResponse.json(products);
            } catch (error) {
                console.error('Error fetching products:', error);
                return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
            }
        }
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 403 });
    }
}

export async function POST(request) {
    try {
        await check();
        const data = await request.json(); // Ensure to await the JSON parsing
        const { title, desc, price, imgs, category, prodProps } = data;
        const productDoc = await Product.create({ title, desc, price, imgs, category, prodProps });
        return NextResponse.json({ productDoc });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        await check();
        const data = await request.json(); // Ensure to await the JSON parsing
        const { title, desc, price, _id, imgs, category, prodProps } = data;
        await Product.updateOne({ _id }, { title, desc, price, imgs, category, prodProps });
        return NextResponse.json(true);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await check();
        const url = new URL(req.url); // Parse the URL
        const id = url.searchParams.get('id'); // Get the 'id' query parameter

        if (id) {
            await Product.deleteOne({ _id: id });
            return NextResponse.json(true);
        } else {
            return NextResponse.json({ error: 'ID not provided' }, { status: 400 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
