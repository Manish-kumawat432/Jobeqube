import jwt from 'jsonwebtoken';

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;

  console.log("🔐 Token from cookie:", token);

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("✅ Decoded Token:", decoded);

    req.user = { _id: decoded.userId };
    req.id = decoded.userId;

    next();
  } catch (err) {
    console.log("❌ JWT Verify Error:", err);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

export default isAuthenticated;
