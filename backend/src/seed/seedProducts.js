import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../db/connectDB.js";
import { Product } from "../models/product.model.js";

dotenv.config();

const products = [
  {
    title: "iPhone 13",
    price: 70000,
    description: "Apple smartphone",
    image: "https://via.placeholder.com/150",
    category: "electronics"
  },
  {
    title: "Nike Shoes",
    price: 3000,
    description: "Comfortable running shoes",
    image: "https://via.placeholder.com/150",
    category: "fashion"
  },
  {
    title: "Laptop",
    price: 55000,
    description: "High performance laptop",
    image: "https://via.placeholder.com/150",
    category: "electronics"
  }
];

const seedData = async () => {
  try {
    await connectDB();

    await Product.deleteMany(); // clean old data

    await Product.insertMany(products);

    console.log("Products seeded successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();