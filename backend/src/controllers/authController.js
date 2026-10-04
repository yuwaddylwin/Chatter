import bcrypt from "bcryptjs";
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

    return res.status(200).json({
      message: "Sign in successful!",
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