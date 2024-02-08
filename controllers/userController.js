import emailValidator from "email-validator";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";

//CookieOption
const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, //7 Days
  httpOnly: true,
  secure: true,
};

const register = async (req, res) => {
  const { userName, email, password } = req.body;

  // Validator
  if (!userName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  // Email Validator
  const validEmail = emailValidator.validate(email);
  if (!validEmail) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address",
    });
  }

  // Password
  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters",
    });
  }

  // User Validator
  try {
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Create User
    const user = await User.create({
      userName,
      email,
      password,
    });

    // Save the user
    await user.save();
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "Registration successful. Please visit the Login Page.",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Registration Failed",
      error,
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //User Validation
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        success: false,
        message: "Email and password dose not match",
      });
    }

    const token = await User.generateJWTToken();
    user.password = undefined;

    res.cookie("token", token, cookieOptions);

    //Success Message
    return res.status(200).json({
      success: "Ture",
      message: "User loggedin successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Login Failed",
      error,
    });
  }
};

// PROFILE
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User details retrieved successfully",
      user: user,
    });
  } catch (error) {
    console.error("Failed to fetch profile details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile details",
      error: error.message,
    });
  }
};

export { register, login, getProfile };
