import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import User from "../models/user.js";

const RegisterUser = async (req, res) => {
  const { username, email, password } = req.body ?? {};

  if (
    typeof username !== "string" || !username.trim() ||
    typeof email !== "string" || !email.trim() ||
    typeof password !== "string" || !password
  ) {
    return res.status(400).json({
      message: "Username, email, and password are required.",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User registered successfully!",
    });
  } catch (error) {
    console.error("Registration failed:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Username or email already exists.",
      });
    }

    return res.status(500).json({
      message: "Error registering user.",
    });
  }
};
export { RegisterUser };



const SignInUser = async (req, res) => {
  const { email, password} = req.body ?? {};

  if (
    typeof email !== "string" || !email.trim() ||
    typeof password !== "string" || !password
  ) {
    return res.status(400).json({
      message: "Email and password are required.",
    });
  }
  
  //find the user by email, if not found return 401, if found compare password with bcrypt.compare, if not match return 401, if match return 200 with user data
  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // JWT token generation
    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
    }

    const token = JWT.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return res.status(200).json({
      message: "Sign in successful!",
      // JWT token and user data should be returned in the response
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Sign in failed:", error);
    return res.status(500).json({
      message: "Error signing in.",
    });
  }
};
export { SignInUser };


// Get the currently authenticated user - sends the user's information to the frontend
const GetCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("_id username email");

    if (!user) {
      return res.status(401).json({
        message: "This account no longer exists.",
      });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Fetching current user failed:", error);

    return res.status(500).json({
      message: "Error fetching current user.",
    });
  }
};

export { GetCurrentUser };
