import JWT from "jsonwebtoken";

const isLoggedIn = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Please log in to access this resource.",
      });
    }

    const userDeatils = await JWT.verify(token, process.env.JWT_SECRET);

    req.user = userDeatils;

    next();
  } catch (error) {
    console.error("Error verifying token:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token.",
    });
  }
};

export default isLoggedIn;
