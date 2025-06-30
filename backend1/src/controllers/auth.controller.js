import { generateToken, extractCloudinaryPublicId } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import { validationResult } from "express-validator";

// Helper function for consistent error responses
const sendErrorResponse = (res, statusCode, message, errors = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

export const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendErrorResponse(res, 400, "Validation failed", errors.array());
  }

  const { fullName, email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user) return sendErrorResponse(res, 400, "Email already exists");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // generate jwt token here
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        success: true,
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      sendErrorResponse(res, 400, "Invalid user data");
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    sendErrorResponse(res, 500, "Internal Server Error");
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendErrorResponse(res, 400, "Validation failed", errors.array());
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return sendErrorResponse(res, 400, "Invalid credentials");
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const timeLeft = Math.ceil((user.lockUntil - Date.now()) / (1000 * 60));
      return sendErrorResponse(res, 423, `Account locked. Try again in ${timeLeft} minutes.`);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      // Increment failed login attempts
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = Date.now() + LOCK_TIME;
      }
      await user.save();
      return sendErrorResponse(res, 400, "Invalid credentials");
    }

    // Reset failed login attempts on successful login
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    generateToken(user._id, res);

    res.status(200).json({
      success: true,
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      posts: user.posts,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    sendErrorResponse(res, 500, "Internal Server Error");
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    sendErrorResponse(res, 500, "Internal Server Error");
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return sendErrorResponse(res, 400, "Profile pic is required");
    }

    const user = await User.findById(userId);

    // If user already has a profile picture, delete it from Cloudinary
    if (user?.profilePic) {
      const publicId = extractCloudinaryPublicId(user.profilePic);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // Upload new profile picture
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json({ success: true, updatedUser });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    sendErrorResponse(res, 500, "Internal server error");
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    sendErrorResponse(res, 500, "Internal Server Error");
  }
};