const { validateAdminJWT } = require("../utils/jwt_admin");

const adminAuth = (req, res, next) => {
    const token = req.header('Authorization')?.replace("Bearer ", "");

  // if (!token) {
  //   return res.status(401).json({ error: "No token provided" });
  // }

  try {
    // const decoded = validateAdminJWT(token);
    req.admin = decoded; 

    next(); // Proceed to next middleware or route handler
  } catch (error) {
    // return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = adminAuth;
