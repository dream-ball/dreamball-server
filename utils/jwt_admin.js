require('dotenv').config();
const jwt = require('jsonwebtoken');

function generateAdminJWT(userID) {
  const secret_token = process.env.JWT_TOKEN_ADMIN;
  if (!secret_token) {
    throw new Error("JWT secret key is missing!");
  }
  return jwt.sign({ userId: userID }, secret_token, { expiresIn: '30m' });
}

function validateAdminJWT(token) {
  const secret_token = process.env.JWT_TOKEN_ADMIN;
  if (!secret_token) {
    console.error("JWT secret key is missing!");
    return null;
  }


  try {
    return jwt.verify(token, secret_token);
  } catch (error) {
    return res.json({
      status:"Failed",
      error:"Invalid or expired token"
    });
  }
}

module.exports = {generateAdminJWT,validateAdminJWT}