import jwt from "jsonwebtoken";

const requireAuth = (req, res, next) => {
  const authorization = req.get("Authorization");
  // only call .match() if the authentication isn't null or undefined
  const match = authorization?.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    return res.status(401).json({
      message: "A Bearer token is required.",
    });
  }

  // take only the code follows by Bearer
  const token = match[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    if (
      typeof payload !== "object" ||
      typeof payload.id !== "string" ||
      !/^[a-fA-F0-9]{24}$/.test(payload.id)
    ) {
      return res.status(401).json({
        message: "Invalid token.",
      });
    }

    // a protected route can use req.userId to find the user's profile in the database.
    req.userId = payload.id;
  } catch (error) {
    return res.status(401).json({
      message:
        error.name === "TokenExpiredError"
          ? "Your session has expired. Please sign in again."
          : "Invalid token.",
    });
  }

  next();
};

export default requireAuth;