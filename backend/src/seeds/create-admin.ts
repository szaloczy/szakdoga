// src/seeds/create-admin.ts
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from "bcrypt";
import { UserRole } from "../types";

export async function createAdmin() {
  const userRepository = AppDataSource.getRepository(User);

  const existingAdmin = await userRepository.findOneBy({
    email: "admin@gmail.com",
  });
  if (existingAdmin) {
    console.log("Admin already exists.");
    return;
  }

  const password = await bcrypt.hash("admin", 10);

  const admin = userRepository.create({
    email: "admin@gmail.com",
    password,
    firstname: "System",
    lastname: "Admin",
    role: UserRole.ADMIN,
  });

  await userRepository.save(admin);

  console.log("Admin user created.");
}
