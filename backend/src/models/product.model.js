import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            index: true
        },
        price: {
            type: Number,
            required: true
        },
        description: {
            type: String
        },
        image: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true,
            index: true
        }
    },
    {
        timestamps: true
    }
);

export const Product = mongoose.model('Product', productSchema);