import { Cart } from "../models/cart.model.js"
import { Product } from "../models/product.model.js"
import mongoose from "mongoose"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity = 1 } = req.body;
    const userId = "YOUR_USER_ID_HERE";

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, "Invalid product ID");
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = await Cart.create({
            user: userId,
            items: []
        });
    }

    const existingItem = cart.items.find((item) => item.product.toString() === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({
            product: productId,
            quantity
        });
    }
    await cart.save();

    return res.status(200).json(
        new ApiResponse(200, cart, "Product added to cart")
    );
});

const removeFromCart = asyncHandler(async (req, res) => {
    /*
        1. Get userId (from req / temporary hardcoded)
        2. Get productId from request
        3. Validate productId
        4. Find user's cart
            → If NOT exists → throw "Cart not found"
        5. Check if product exists in cart
            → If NOT → throw "Item not in cart"
        6. If quantity > 1
            → decrease quantity by 1
        Else
            → remove item from cart
        7. Save updated cart
        8. Return updated cart
    */
    const userId = "PUT_REAL_USER_ID_HERE";

    const { productId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, "Invalid product ID");
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    const itemIndex = await cart.items.findIndex((item) => item.product.toString() === productId);
    if (itemIndex === -1) {
        throw new ApiError(404, "Item not in cart");
    }

    if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
    } else {
        cart.items.splice(itemIndex, 1)
    }

    await cart.save();

    return res.status(200).json(
        new ApiResponse(200, cart, "Product removed from cart")
    );
});

const getCart = asyncHandler(async (req, res) => {
    const userId = "PUT_REAL_USER_ID_HERE";

    // 1. Find cart + populate product details
    /*
        const cart = await Cart.findOne({ user: userId })
            .populate("items.product");
    */
    //or
    const cart = await Cart.aggregate([
        {
            $match: { user: mongoose.Types.ObjectId(userId) }
        },
        {
            $unwind: "$items"
        },
        {
            $lookup: {
                from: "products",
                localField: "items.product",
                foreignField: "_id",
                as: "productDetails",
            }
        },
        {
            $unwind: "$productDetails"
        },
        {
            $group: {
                _id: "$_id",
                user: { $first: "$user" },
                items: {
                    $push: {
                        product: "$productDetails",
                        quantity: "$items.quantity"
                    }
                }

            }
        }
    ])

    if (!cart.length) {
        throw new ApiError(404, "Cart not found")
    }

    return res.status(200).json(
        new ApiResponse(200, cart[0], "Cart fetched successfully")
    );

})

export { addToCart, removeFromCart }