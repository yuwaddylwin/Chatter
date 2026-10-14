import jwt from "jsonwebtoken";

const requireAuth = (req, res, next) => {
  const authorization = req.get("Authorization");
  const match = authorization?.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    return res.status(401).json({
      message: "A Bearer token is required.",
    });
  }

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