import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
  const aToken = req.headers.authorization?.split(" ")[1];
  if (!aToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token_deconde = jwt.verify(aToken, process.env.JWT_SECRET);
  if (!token_deconde) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

export default authAdmin;
