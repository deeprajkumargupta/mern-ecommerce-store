import { Router } from "express"
import { createProduct, deleteProduct, getAllProducts, getProductsById, updateProduct } from "../controllers/product.controller.js"


const router = Router()

router.route("/").post(createProduct);
router.route("/").get(getAllProducts);
router.route("/:id").get(getProductsById);
router.route("/:id").patch(updateProduct);
router.route("/:id").delete(deleteProduct)

export default router;