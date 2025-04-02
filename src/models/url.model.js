import { Schema } from "mongoose";
import mongoose from "mongoose";

const urlSchema = new Schema({
    originalUrl:{type:String,require:true},
    shortUrl:{type:String,require:true,unique:true},
    vistCount:{type:Number,default:0},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true}
},{timestamps:true} )

export const Url = mongoose.model("Url", urlSchema);