import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
/*
Step 1: User logs in
    Sends email + password
Step 2: Server verifies
    If correct → generates a JWT token
Step 3: Token sent to frontend
    Stored (localStorage / cookies)
Step 4: Every request after that:
    Frontend sends token
Step 5: Backend verifies token
    Extracts user info → gives access
*/

const getCookieOptions = (type = "access") => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: type === "access" ? 15 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
  };
};

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error?.message ||
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Input validation
  if ([username, email, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // Limit registrations
  const MAX_USERS = Number(process.env.MAX_USERS) || 20;
  const userCount = await User.countDocuments();
  if (userCount >= MAX_USERS) {
    throw new ApiError(403, "User limit reached. Registration closed.");
  }

  //check if user already exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  //create new user
  const user = await User.create({
    username,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select("-password");

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // 1. Validation
  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  // 2. Find user
  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // 3. Check password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // 4. Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const accessOptions = getCookieOptions("access");
  const refreshOptions = getCookieOptions("refresh");

  // 5. Send response
  return res
    .status(200)
    .cookie("accessToken", accessToken, accessOptions)
    .cookie("refreshToken", refreshToken, refreshOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: {
            id: user._id,
            email: user.email,
            username: user.username,
          },
        },
        "Login successful"
      )
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decodedToken?._id);

  if (
    !user ||
    !user.refreshToken ||
    user.refreshToken !== incomingRefreshToken
  ) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  const accessOptions = getCookieOptions("access");
  const refreshOptions = getCookieOptions("refresh");

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessOptions)
    .cookie("refreshToken", refreshToken, refreshOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: {
            id: user._id,
            email: user.email,
            username: user.username,
          },
        },
        "Access token refreshed successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const accessOptions = getCookieOptions("access");
  const refreshOptions = getCookieOptions("refresh");
  const incomingRefreshToken = req.cookies?.refreshToken;

  if (incomingRefreshToken) {
    await User.findOneAndUpdate(
      { refreshToken: incomingRefreshToken },
      { $unset: { refreshToken: 1 } },
      { returnDocument: "after" }
    );
  }

  return res
    .status(200)
    .clearCookie("accessToken", accessOptions)
    .clearCookie("refreshToken", refreshOptions)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

const googleLogin = asyncHandler(async (req, res) => {
  const { email, username, avatar } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      email,
      username,
      avatar,
      provider: "google",
    });
  }

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user._id);

  const accessOptions = getCookieOptions("access");
  const refreshOptions = getCookieOptions("refresh");

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessOptions)
    .cookie("refreshToken", refreshToken, refreshOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: {
            id: user._id,
            email: user.email,
            username: user.username,
          },
        },
        "Google login successful"
      )
    );
});

export { registerUser, loginUser, refreshAccessToken, logoutUser, googleLogin };
