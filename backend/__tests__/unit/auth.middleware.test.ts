import { authMiddleware } from "../../src/middleware/auth.middleware";
import { AppDataSource } from "../../src/data-source";
import jwt from "jsonwebtoken";

// Mock dependencies
jest.mock("../../src/data-source");
jest.mock("jsonwebtoken");
jest.mock("../../src/config", () => ({
  secretKey: "test-secret-key",
}));

describe("Auth Middleware", () => {
  let req: any;
  let res: any;
  let next: jest.Mock;
  let mockUserRepository: any;

  beforeEach(() => {
    req = {
      headers: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    mockUserRepository = {
      findOne: jest.fn(),
    };

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockUserRepository);

    jest.clearAllMocks();
  });

  describe("Authorization Header Validation", () => {
    it("should return 401 when authorization header is missing", async () => {
      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Missing or invalid Authorization header",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 when authorization header doesn't start with Bearer", async () => {
      req.headers.authorization = "Basic token123";

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Missing or invalid Authorization header",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 when authorization header is just 'Bearer'", async () => {
      req.headers.authorization = "Bearer";

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Missing or invalid Authorization header",
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("Token Verification", () => {
    it("should return 401 for invalid token", async () => {
      req.headers.authorization = "Bearer invalid-token";

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await authMiddleware(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith("invalid-token", "test-secret-key");
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 for expired token", async () => {
      req.headers.authorization = "Bearer expired-token";

      const expiredError = new Error("Token expired");
      expiredError.name = "TokenExpiredError";
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw expiredError;
      });

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("User Lookup", () => {
    it("should return 404 when user is not found", async () => {
      req.headers.authorization = "Bearer valid-token";

      const decodedToken = { id: 999 };
      (jwt.verify as jest.Mock).mockReturnValue(decodedToken);
      mockUserRepository.findOne.mockResolvedValue(null);

      await authMiddleware(req, res, next);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ["student", "mentor"],
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle database errors", async () => {
      req.headers.authorization = "Bearer valid-token";

      const decodedToken = { id: 1 };
      (jwt.verify as jest.Mock).mockReturnValue(decodedToken);
      mockUserRepository.findOne.mockRejectedValue(new Error("Database error"));

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("Successful Authentication", () => {
    it("should attach user to request and call next for valid token and user", async () => {
      req.headers.authorization = "Bearer valid-token";

      const decodedToken = { id: 1 };
      const mockUser = {
        id: 1,
        email: "user@test.com",
        firstname: "John",
        lastname: "Doe",
        role: "student",
        active: true,
      };

      (jwt.verify as jest.Mock).mockReturnValue(decodedToken);
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await authMiddleware(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith("valid-token", "test-secret-key");
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ["student", "mentor"],
      });
      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should attach user with relations to request", async () => {
      req.headers.authorization = "Bearer valid-token";

      const decodedToken = { id: 1 };
      const mockUser = {
        id: 1,
        email: "student@test.com",
        firstname: "Student",
        lastname: "User",
        role: "student",
        active: true,
        student: {
          id: 1,
          neptun: "ABC123",
          major: "Computer Science",
          university: "ELTE",
        },
      };

      (jwt.verify as jest.Mock).mockReturnValue(decodedToken);
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await authMiddleware(req, res, next);

      expect(req.user).toEqual(mockUser);
      expect(req.user.student).toBeDefined();
      expect(req.user.student.neptun).toBe("ABC123");
      expect(next).toHaveBeenCalled();
    });

    it("should handle mentor user with company relation", async () => {
      req.headers.authorization = "Bearer mentor-token";

      const decodedToken = { id: 2 };
      const mockMentorUser = {
        id: 2,
        email: "mentor@test.com",
        firstname: "Mentor",
        lastname: "User",
        role: "mentor",
        active: true,
        mentor: {
          id: 1,
          position: "Senior Developer",
          company: {
            id: 1,
            name: "Test Company",
            city: "Budapest",
          },
        },
      };

      (jwt.verify as jest.Mock).mockReturnValue(decodedToken);
      mockUserRepository.findOne.mockResolvedValue(mockMentorUser);

      await authMiddleware(req, res, next);

      expect(req.user).toEqual(mockMentorUser);
      expect(req.user.mentor).toBeDefined();
      expect(req.user.mentor.position).toBe("Senior Developer");
      expect(next).toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("should handle malformed token payload", async () => {
      req.headers.authorization = "Bearer malformed-token";

      const malformedToken = { userId: 1 }; // Wrong field name
      (jwt.verify as jest.Mock).mockReturnValue(malformedToken);

      await authMiddleware(req, res, next);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: undefined },
        relations: ["student", "mentor"],
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should handle token with extra whitespace", async () => {
      req.headers.authorization = "Bearer  valid-token  ";

      const decodedToken = { id: 1 };
      const mockUser = { id: 1, email: "user@test.com" };

      (jwt.verify as jest.Mock).mockReturnValue(decodedToken);
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await authMiddleware(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith("valid-token", "test-secret-key");
      expect(next).toHaveBeenCalled();
    });

    it("should handle case-insensitive Bearer keyword", async () => {
      req.headers.authorization = "bearer valid-token";

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Missing or invalid Authorization header",
      });
    });
  });
});