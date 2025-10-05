import jwt from "jsonwebtoken";
import { secretKey } from "../config";
import { AppDataSource } from "../data-source";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Missing or invalid Authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secretKey) as { id: number };

    const userRepository = AppDataSource.getRepository("User");
    const user = await userRepository.findOne({
      where: { id: decoded.id },
      relations: ["student", "mentor"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
