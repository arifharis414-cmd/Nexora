import jwt from "jsonwebtoken";

// Creates a signed token containing the user's ID
// The frontend stores this and sends it back on every request to prove who's logged in
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

export default generateToken;
