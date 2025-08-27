import connectToDB from "@/database";
import Joi from "joi";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "@/models/user";
import { NextResponse } from "next/server";



const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

export const dynamic = "force-dynamic";

export async function POST(req){
    await connectToDB();

    const {email, password} = await req.json();

    const {error} = schema.validate({email, password});

    if(error){
        console.log(error);
        return NextResponse.json({
            success: false,
            message: error.details[0].message
        });
    }
    
    // Continue with login logic
    try {
        const checkUser = await User.findOne({email});
        if(!checkUser) {
            return NextResponse.json({
                success: false,
                message: "User not found with this email"
            });
        }

        const checkPassword = await bcrypt.compare(password, checkUser.password);
        if(!checkPassword) {
            return NextResponse.json({
                success: false,
                message: "Incorrect password"
            });
        }

        const token = jwt.sign(
            { id: checkUser._id, email: checkUser.email, role: checkUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const finalData = {
            token,
            user : {
                email: checkUser.email,
                name: checkUser.name,
                _id: checkUser._id,
                role: checkUser.role
            }
        }

        return NextResponse.json({
            success: true,
            message: "Login successful",
            finalData
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "Login failed"
        });
    }

}