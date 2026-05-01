import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

const createProduct = asyncHandler(async (req, res) => {
    const { title, price, description, image, category } = req.body;

    if (!title || !price || !image || !category) {
        throw new ApiError(400, "All required fields must be provided")
    }

    const product = await Product.create({
        title, price, description, image, category
    })

    return res.status(201).json(new ApiResponse(201, product, "Product created successfully"))
})

const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find();

    return res.status(200).json(new ApiResponse(200, products, "Product fetched successfully"));
});

const getProductsById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid product ID")
    }

    const product = await Product.findById(id);

    if (!product) {
        throw new ApiError(404, "Product not found")
    }

    return res.status(200).json(
        new ApiResponse(200, product, "Product fetched successfully")
    );
});

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid product ID")
    }

    const { title, price, description, image, category } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
            $set: {
                title,
                price,
                description,
                image,
                category
            }
        },
        {
            returnDocument: "after",
            runValidators: true
        }
    );

    if (!updatedProduct) {
        throw new ApiError(404, "Product not found")
    }

    return res.status(200).json(
        new ApiResponse(200, updatedProduct, "Product updated successfully")
    );
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid product ID")
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
        throw new ApiError(404, "Product not found")
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Product deleted successfully")
    );
});

export { createProduct, getAllProducts, getProductsById, updateProduct, deleteProduct }
