import { UserController } from "../../src/controller/user.controller";
import { AppDataSource } from "../../src/data-source";
import { User } from "../../src/entity/User";
import { Student } from "../../src/entity/Student";
import { UserRole } from "../../src/types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Mock dependencies
jest.mock("../../src/data-source");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("UserController", () => {
  let userController: UserController;
  let mockRepository: any;
  let mockStudentRepository: any;
  let req: any;
  let res: any;

  beforeEach(() => {
    userController = new UserController();
    
    // Mock repository methods
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    mockStudentRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };

    // Mock AppDataSource
    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity === User) return mockRepository;
      if (entity === Student) return mockStudentRepository;
      return mockRepository;
    });

    userController.repository = mockRepository;

    // Mock request and response objects
    req = {
      params: {},
      body: {},
      user: {},
    };

    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Clear mocks
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return all users with relations", async () => {
      const mockUsers = [
        { id: 1, email: "test1@test.com", firstname: "Test1", lastname: "User1" },
        { id: 2, email: "test2@test.com", firstname: "Test2", lastname: "User2" },
      ];

      mockRepository.find.mockResolvedValue(mockUsers);

      await userController.getAll(req, res);

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ["student", "mentor", "mentor.company"],
      });
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it("should handle errors properly", async () => {
      const error = new Error("Database error");
      mockRepository.find.mockRejectedValue(error);

      await userController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith("Database error");
    });
  });

  describe("getOne", () => {
    it("should return user by valid ID", async () => {
      const mockUser = { 
        id: 1, 
        email: "test@test.com", 
        firstname: "Test", 
        lastname: "User" 
      };

      req.params.id = "1";
      mockRepository.findOne.mockResolvedValue(mockUser);

      await userController.getOne(req, res);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ["student", "mentor", "mentor.company"]
      });
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("should return 400 for invalid ID", async () => {
      req.params.id = "invalid";

      await userController.getOne(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith("Invalid user ID");
    });

    it("should return 404 for non-existent user", async () => {
      req.params.id = "999";
      mockRepository.findOne.mockResolvedValue(null);

      await userController.getOne(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith("User not found");
    });
  });

  describe("register", () => {
    it("should register a new student user", async () => {
      const userData = {
        email: "test@test.com",
        password: "password123",
        firstname: "Test",
        lastname: "User",
        role: "student",
      };

      const hashedPassword = "hashedPassword123";
      const createdUser = { id: 1, ...userData, password: hashedPassword };
      const createdStudent = { id: 1, user: createdUser };

      req.body = userData;

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockRepository.create.mockReturnValue({ ...userData });
      mockRepository.save.mockResolvedValue(createdUser);
      mockStudentRepository.create.mockReturnValue(createdStudent);
      mockStudentRepository.save.mockResolvedValue(createdStudent);

      await userController.register(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(mockStudentRepository.create).toHaveBeenCalledWith({
        user: createdUser,
      });
      expect(mockStudentRepository.save).toHaveBeenCalledWith(createdStudent);
      expect(res.json).toHaveBeenCalledWith(createdUser);
    });

    it("should handle duplicate email error", async () => {
      const userData = {
        email: "existing@test.com",
        password: "password123",
        firstname: "Test",
        lastname: "User",
        role: "student",
      };

      req.body = userData;

      const duplicateError = new Error("Duplicate key") as any;
      duplicateError.code = "23505"; // PostgreSQL unique violation
      duplicateError.constructor.name = "QueryFailedError";

      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      mockRepository.create.mockReturnValue(userData);
      mockRepository.save.mockRejectedValue(duplicateError);

      await userController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "this Email address is already used" 
      });
    });
  });

  describe("login", () => {
    it("should login with valid credentials", async () => {
      const loginData = {
        email: "test@test.com",
        password: "password123",
      };

      const user = {
        id: 1,
        email: "test@test.com",
        password: "hashedPassword",
        firstname: "Test",
        lastname: "User",
        role: UserRole.STUDENT,
        active: true,
      };

      const token = "jwt-token";

      req.body = loginData;

      mockRepository.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue(token);

      await userController.login(req, res);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: "test@test.com" },
        select: ["id", "password", "role", "firstname", "lastname", "active"],
      });
      expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedPassword");
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: 1,
          firstname: "Test",
          lastname: "User",
          role: UserRole.STUDENT,
        },
        expect.any(String),
        { expiresIn: "1d" }
      );
      expect(res.json).toHaveBeenCalledWith({ accessToken: token });
    });

    it("should return 400 for missing email or password", async () => {
      req.body = { email: "test@test.com" }; // missing password

      await userController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith("Email and password are required");
    });

    it("should return 401 for non-existent user", async () => {
      req.body = { email: "nonexistent@test.com", password: "password123" };
      mockRepository.findOne.mockResolvedValue(null);

      await userController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith("Incorrect email or password");
    });

    it("should return 403 for inactive user", async () => {
      const user = {
        id: 1,
        email: "test@test.com",
        password: "hashedPassword",
        firstname: "Test",
        lastname: "User",
        role: UserRole.STUDENT,
        active: false,
      };

      req.body = { email: "test@test.com", password: "password123" };
      mockRepository.findOne.mockResolvedValue(user);

      await userController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith("Account is deactivated");
    });

    it("should return 401 for incorrect password", async () => {
      const user = {
        id: 1,
        email: "test@test.com",
        password: "hashedPassword",
        firstname: "Test",
        lastname: "User",
        role: UserRole.STUDENT,
        active: true,
      };

      req.body = { email: "test@test.com", password: "wrongpassword" };
      mockRepository.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await userController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith("Incorrect email or password");
    });
  });

  describe("update", () => {
    it("should update user successfully", async () => {
      const userId = 1;
      const updateData = {
        firstname: "Updated",
        lastname: "Name",
        email: "updated@test.com",
      };

      const existingUser = {
        id: userId,
        email: "old@test.com",
        firstname: "Old",
        lastname: "Name",
        active: true,
      };

      req.params.id = userId.toString();
      req.body = updateData;

      mockRepository.findOne.mockResolvedValue(existingUser);
      mockRepository.save.mockResolvedValue({ ...existingUser, ...updateData });

      await userController.update(req, res);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        relations: ["student", "mentor", "mentor.company"],
      });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ 
        message: "User updated successfully" 
      });
    });

    it("should return 404 for non-existent user", async () => {
      req.params.id = "999";
      req.body = { firstname: "Updated" };
      mockRepository.findOne.mockResolvedValue(null);

      await userController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith("User not found");
    });
  });

  describe("delete", () => {
    it("should delete user successfully", async () => {
      const userId = 1;
      const userToDelete = { id: userId, email: "test@test.com" };

      req.params.id = userId.toString();
      mockRepository.findOne.mockResolvedValue(userToDelete);
      mockRepository.remove.mockResolvedValue(userToDelete);

      await userController.delete(req, res);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(userToDelete);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "User deleted successfully" 
      });
    });

    it("should return 404 for non-existent user", async () => {
      req.params.id = "999";
      mockRepository.findOne.mockResolvedValue(null);

      await userController.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith("User not found");
    });
  });
});