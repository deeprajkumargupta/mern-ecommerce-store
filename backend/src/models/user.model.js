import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const userSchema= new mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
            trim: true
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: [/.+\@.+\..+/, "Please enter a valid email"]
        },
        password:{
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        refreshToken: {
            type: String
        }
    },
    {timestamps: true}
);

userSchema.pre("save", async function () {
    if(!this.isModified("password")) return;
    this.password= await bcrypt.hash(this.password, 10);
})

userSchema.methods.comparePassword= async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign({
        _id: this._id.toString(),
        email: this.email,
    },
    process.env.JWT_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
);
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    });
};


export const User = mongoose.model("User",userSchema)