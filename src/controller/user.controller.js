import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//access and refresh token

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(400, "user not found");
    }
    const accessToken = user.generateAccessToken();
    console.log(accessToken);

    if (!accessToken) {
      throw new ApiError(
        500,
        "something went wrong while generating access token"
      );
    }
    const refreshToken = user.generateRefreshToken();
    console.log(refreshToken);
    console.log("2");
    if (!refreshToken) {
      throw new ApiError(
        500,
        "something went wrong while generating refresh token"
      );
    }
    user.refreshToken = refreshToken;
    console.log("3");

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating access and refresh token"
    );
  }
};

//register

export const registerUser = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new ApiError(400, "all fields are required");
  }
  let user = await User.findOne({ email });
  if (user) {
    throw new ApiError(400, "user already exist");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  res
    .status(201)
    .json(new ApiResponse({ user: { id: user._id, name, email } }));
});

//login

export const loginUser = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "all fields are required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "user not found");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(400, "invalid credentials");
  }
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.ReFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
  user.refreshToken = refreshToken;

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "successfully login"
      )
    );
});

//logout

export const logoutUser = AsyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(400, "unable to logout");
  }

  await User.findByIdAndUpdate(
    userId,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );

  const option = {
    httpOnly: true,
    secure: true,
  };
  return res.status(200).json(new ApiError(200, {}, "logout successfully"));
});
