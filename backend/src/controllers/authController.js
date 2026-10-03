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