import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token missing or invalid' });
  }

  jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Access token invalid' });
    }

    req.user = user;
    next();
  });
};

export default authMiddleware;
