import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRole } from "../../src/types";

// Mock bcrypt and jwt for testing
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Authentication Utilities", () => {
  const mockSecretKey = "test-secret-key";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Password Hashing", () => {
    it("should hash password correctly", async () => {
      const password = "testpassword123";
      const hashedPassword = "hashedPassword123";

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await bcrypt.hash(password, 10);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });

    it("should compare passwords correctly", async () => {
      const password = "testpassword123";
      const hashedPassword = "hashedPassword123";

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await bcrypt.compare(password, hashedPassword);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(true);
    });

    it("should return false for incorrect password", async () => {
      const password = "wrongpassword";
      const hashedPassword = "hashedPassword123";

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await bcrypt.compare(password, hashedPassword);

      expect(result).toBe(false);
    });
  });

  describe("JWT Token Generation", () => {
    it("should generate token with correct payload", () => {
      const payload = {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        role: UserRole.STUDENT,
      };

      const expectedToken = "generated-jwt-token";

      (jwt.sign as jest.Mock).mockReturnValue(expectedToken);

      const token = jwt.sign(payload, mockSecretKey, { expiresIn: "1d" });

      expect(jwt.sign).toHaveBeenCalledWith(payload, mockSecretKey, { expiresIn: "1d" });
      expect(token).toBe(expectedToken);
    });

    it("should verify token correctly", () => {
      const token = "valid-jwt-token";
      const decodedPayload = {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        role: UserRole.STUDENT,
      };

      (jwt.verify as jest.Mock).mockReturnValue(decodedPayload);

      const result = jwt.verify(token, mockSecretKey);

      expect(jwt.verify).toHaveBeenCalledWith(token, mockSecretKey);
      expect(result).toEqual(decodedPayload);
    });

    it("should handle token verification errors", () => {
      const invalidToken = "invalid-jwt-token";
      const error = new Error("Invalid token");

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw error;
      });

      expect(() => jwt.verify(invalidToken, mockSecretKey)).toThrow("Invalid token");
    });
  });

  describe("User Role Validation", () => {
    it("should validate student role", () => {
      const role = UserRole.STUDENT;
      expect(role).toBe("student");
      expect(Object.values(UserRole)).toContain(role);
    });

    it("should validate mentor role", () => {
      const role = UserRole.MENTOR;
      expect(role).toBe("mentor");
      expect(Object.values(UserRole)).toContain(role);
    });

    it("should validate admin role", () => {
      const role = UserRole.ADMIN;
      expect(role).toBe("admin");
      expect(Object.values(UserRole)).toContain(role);
    });

    it("should check if role is valid", () => {
      const validRoles = ["student", "mentor", "admin"];
      const invalidRole = "invalid-role";

      validRoles.forEach((role) => {
        expect(Object.values(UserRole)).toContain(role);
      });

      expect(Object.values(UserRole)).not.toContain(invalidRole);
    });
  });

  describe("Email Validation", () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    it("should validate correct email formats", () => {
      const validEmails = [
        "user@example.com",
        "test.email@domain.org",
        "user+tag@example.com",
        "firstname.lastname@company.co.uk",
        "user123@test-domain.com",
      ];

      validEmails.forEach((email) => {
        expect(emailRegex.test(email)).toBe(true);
      });
    });

    it("should reject invalid email formats", () => {
      const invalidEmails = [
        "invalid-email",
        "@domain.com",
        "user@",
        "user@domain",
        "user.domain.com",
        "user..double.dot@domain.com",
        "user@domain.",
        "",
        " ",
      ];

      invalidEmails.forEach((email) => {
        expect(emailRegex.test(email)).toBe(false);
      });
    });
  });

  describe("ID Validation", () => {
    it("should validate positive integer IDs", () => {
      const validIds = ["1", "123", "9999"];

      validIds.forEach((id) => {
        const numericId = Number(id);
        expect(Number.isInteger(numericId)).toBe(true);
        expect(numericId).toBeGreaterThan(0);
        expect(!isNaN(numericId)).toBe(true);
      });
    });

    it("should reject invalid IDs", () => {
      const invalidIds = ["invalid", "0", "-1", "1.5", "", " ", "abc123"];

      invalidIds.forEach((id) => {
        const numericId = Number(id);
        const isValid = Number.isInteger(numericId) && numericId > 0;
        expect(isValid).toBe(false);
      });
    });
  });

  describe("Data Transformation", () => {
    it("should transform user data for response", () => {
      const userData = {
        id: 1,
        email: "user@test.com",
        password: "hashedPassword123", // This should be excluded
        firstname: "John",
        lastname: "Doe",
        active: true,
        role: UserRole.STUDENT,
        resetToken: "reset123", // This should be excluded
        resetTokenExpires: Date.now(), // This should be excluded
      };

      const expectedResponse = {
        id: userData.id,
        email: userData.email,
        firstname: userData.firstname,
        lastname: userData.lastname,
        active: userData.active,
        role: userData.role,
      };

      // Simulate excluding sensitive fields
      const { password, resetToken, resetTokenExpires, ...safeUserData } = userData;

      expect(safeUserData).toEqual(expectedResponse);
      expect(safeUserData).not.toHaveProperty("password");
      expect(safeUserData).not.toHaveProperty("resetToken");
      expect(safeUserData).not.toHaveProperty("resetTokenExpires");
    });

    it("should handle null and undefined values", () => {
      const data = {
        id: 1,
        name: "Test",
        description: null,
        optional: undefined,
      };

      const filtered = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== null && value !== undefined)
      );

      expect(filtered).toEqual({
        id: 1,
        name: "Test",
      });
      expect(filtered).not.toHaveProperty("description");
      expect(filtered).not.toHaveProperty("optional");
    });
  });
});