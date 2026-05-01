import { Router } from "express"
import { addToCart } from "../controllers/cart.controller.js";


const router = Router()

router.route("/add").post(addToCart);

export default router;