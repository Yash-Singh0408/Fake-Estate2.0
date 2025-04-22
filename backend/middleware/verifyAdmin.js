import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not Authenticated" });

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });

    if (!payload.isAdmin) {
      return res.status(403).json({ message: "You are not Admin" });
    }

    req.userId = payload.id;
    next();
  });
};
