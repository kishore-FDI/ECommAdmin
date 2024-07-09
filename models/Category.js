import mongoose, { Schema, Document } from "mongoose";

const CategorySchema = new Schema({
    name:{type:String,required:true},
    parCat:{type:mongoose.Types.ObjectId || null,ref:'Category'},
    prop:[{type:Object}]
})

export const Category =mongoose.models.Category || mongoose.model('Category',CategorySchema)