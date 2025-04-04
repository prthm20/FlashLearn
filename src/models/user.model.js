import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
const UserSchema = new Schema({
    name:{    type: String,  required:true,},
    email:{type:String, unique:true, required:true},
    password: {type:String, required:true},
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
    createdAt: { type: Date, default: Date.now },
    refreshToken:{
        type:String
    }
})

UserSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password, 10)
    next();
})

UserSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password,this.password)
}

UserSchema.methods.generateAccessToken= function(){
 return jwt.sign(
    {
    _id: this._id
   },
   process.env.ACCESS_TOKEN_SECRET,
   {
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY
   }
)
}

UserSchema.methods.generateAccessToken= function(){
    return jwt.sign(
        {
        _id: this._id
       },
       process.env.REFRESH_TOKEN_SECRET,
       {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
       }
    )
}

export const User = mongoose.model("User",UserSchema)