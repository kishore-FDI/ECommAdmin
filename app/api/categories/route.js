import dbConnect from "@/lib/dbConnect";
import { Category } from "../../../models/Category";
import { NextResponse } from "next/server";
await dbConnect();
import { check } from '../products/route';
export async function GET(){
    await check();
    return NextResponse.json(await Category.find().populate('parCat'))
}

export async function DELETE(req){
    await check();
    const url = new URL(req.url);
    const _id = url.searchParams.get('_id'); 
    // console.log(id)
    await Category.deleteOne({_id})
    return NextResponse.json("okayge")
    
}

export async function PUT(request){
    await check();
    const data = await request.json()
    const name=data.name;
    const parCat=data.parCat;
    const prop=data.prop
    const _id=data._id;
    await Category.updateOne({_id},{name,parCat : parCat || undefined,prop})
    return NextResponse.json({body:"ok"})
}

export async function POST(request){
    await check();
    const data = await request.json();
    console.log(data)
    const name = data.name;
    const parCat=data.parCat 
    const prop=data.prop
    // console.log(data)
    await Category.create({name,parCat : parCat || undefined,prop});
    return NextResponse.json({body:"ok"})
}