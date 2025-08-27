import connectToDB from "@/database";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import Joi from "joi";  
     


const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().required(),
})

export const dynamic = 'force-dynamic';

export async function POST(req){
    await connectToDB();

    const {name, email, password, role} = await req.json();

    const {error} = schema.validate({name, email, password, role});
    if(error){
        return new Response(JSON.stringify({success: false, message: error.details[0].message}), {status: 400});
    }

    try{
        const isUserAlreadyExists = await User.findOne({email})

        if(isUserAlreadyExists){
            return new Response(JSON.stringify({success: false, message: "User already exists"}), {status: 400});
        } else {
            const hashPassword = await hash(password, 12);

            const newlyCreatedUser = await User.create({
                name, email, password : hashPassword, role
            })

            if(newlyCreatedUser){
                return NextResponse.json({
                    success: true,
                    message: "Account created successfully."
                })
            }
        }
    } 
    catch(error){
        console.log("Error in new user registration", error);
        return new Response(JSON.stringify({success: false, message: "Error in new user registration"}), {status: 500});
    }
}
