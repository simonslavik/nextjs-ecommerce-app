import { NextResponse } from "next/server";
import connectToDB from "@/database";
import Joi from "joi";
import Product from "@/models/product";


const AddNewProductSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    category: Joi.string().required(),
    sizes: Joi.array().required(),
    deliveryInfo: Joi.string().required(),
    onSale: Joi.string().required(),
    priceDrop: Joi.number().required(),
});
        




export const dynamic = "force-dynamic";

export async function POST(req){
    try {
        await connectToDB();

        const user = "admin";

        if(user === "admin"){
            const extractData = await req.json();

            const {
                name, description, price,  category, sizes, deliveryInfo, onSale, priceDrop
            } = extractData;

            const { error } = AddNewProductSchema.validate({
                name, description, price,  category, sizes, deliveryInfo, onSale, priceDrop
            });

            if(error){
                return NextResponse.json({
                    success: false,
                    message: error.details[0].message,
                })
            }
            const newlyCreatedProduct = await Product.create(extractData);

            if(newlyCreatedProduct){
                return NextResponse.json({
                    success: true,
                    message: "New product added successfully.",
                    product: newlyCreatedProduct
                })
            } else {
                return NextResponse.json({
                    success: false,
                    message: "Failed to add the new product. Please try again.",
                })
            }
        }
        else {
            return NextResponse.json({
                success: false,
                message: "You are not authorized to add a new product.",
            })
        }
    } catch(error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong ! Please try again later.",
        })
    }
}