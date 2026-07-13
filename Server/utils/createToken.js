import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const createToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
    // Add any other user properties you need in the payload
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2d' });
};
export default createToken;
