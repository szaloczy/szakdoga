import crypto from "crypto";
import { sendPasswordResetEmail } from "../utils/mailer";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from "bcrypt";

export class UserService {

    private repository = AppDataSource.getRepository(User);

     forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: "Email is required" });
      const user = await this.repository.findOne({ where: { email } });
      if (!user) return res.status(200).json({ message: "If the email exists, a reset link will be sent." });

      // Token generálás
      const token = crypto.randomBytes(32).toString("hex");
      user.resetToken = token;
      user.resetTokenExpires = Date.now() + 1000 * 60 * 60; // 1 óra
      await this.repository.save(user);

      const resetLink = `${process.env.FRONTEND_URL || "http://localhost:4200"}/reset-password?token=${token}`;
      await sendPasswordResetEmail(user.email, resetLink);
      res.status(200).json({ message: "If the email exists, a reset link will be sent." });
    } catch (error) {
        throw error;
    }
  };

  resetPassword = async (req, res) => {
    try {
      const { token, password } = req.body;
      if (!token || !password) return res.status(400).json({ message: "Token and new password are required" });
      const user = await this.repository.findOne({ where: { resetToken: token } });
      if (!user || !user.resetTokenExpires || user.resetTokenExpires < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
      user.password = await bcrypt.hash(password, 10);
      user.resetToken = null;
      user.resetTokenExpires = null;
      await this.repository.save(user);
      res.json({ message: "Password reset successful" });
    } catch (error) {
      throw error;
    }
  };


}