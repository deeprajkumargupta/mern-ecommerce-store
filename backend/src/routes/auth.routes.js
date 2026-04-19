import { Router } from 'express'
import rateLimit from "express-rate-limit";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from '../controllers/auth.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const router = Router();
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many login attempts. Please try again later."
});

router.route("/register").post(registerUser);
router.route("/login").post(loginLimiter, loginUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/logout").post(logoutUser);
router.route("/profile").get(verifyJWT, (req, res) => {
    res.status(200).json(
        new ApiResponse(200, { user: req.user }, "User profile fetched successfully")
    );
});

export default router;
