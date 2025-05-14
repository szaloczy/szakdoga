import dotenv from "dotenv";

dotenv.config();

export const port = process.env.PORT || 3000;
export const secretKey = process.env.JWT_SECRET_KEY || "mySecretKey";
