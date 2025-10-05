import { User } from "../../src/entity/User";
import { Student } from "../../src/entity/Student";
import { Mentor } from "../../src/entity/Mentor";
import { UserRole } from "../../src/types";

describe("User Entity", () => {
  let user: User;

  beforeEach(() => {
    user = new User();
  });

  describe("Basic Properties", () => {
    it("should create a user with default values", () => {
      expect(user.active).toBe(true);
      expect(user.role).toBe(UserRole.STUDENT);
    });

    it("should set user properties correctly", () => {
      user.id = 1;
      user.email = "test@example.com";
      user.firstname = "John";
      user.lastname = "Doe";
      user.active = true;
      user.role = UserRole.ADMIN;

      expect(user.id).toBe(1);
      expect(user.email).toBe("test@example.com");
      expect(user.firstname).toBe("John");
      expect(user.lastname).toBe("Doe");
      expect(user.active).toBe(true);
      expect(user.role).toBe(UserRole.ADMIN);
    });

    it("should handle optional properties", () => {
      user.resetToken = "reset123";
      user.resetTokenExpires = Date.now();
      user.profilePicture = "profile.jpg";

      expect(user.resetToken).toBe("reset123");
      expect(user.resetTokenExpires).toBeDefined();
      expect(user.profilePicture).toBe("profile.jpg");
    });
  });

  describe("User Roles", () => {
    it("should support STUDENT role", () => {
      user.role = UserRole.STUDENT;
      expect(user.role).toBe("student");
    });

    it("should support MENTOR role", () => {
      user.role = UserRole.MENTOR;
      expect(user.role).toBe("mentor");
    });

    it("should support ADMIN role", () => {
      user.role = UserRole.ADMIN;
      expect(user.role).toBe("admin");
    });
  });

  describe("Relationships", () => {
    it("should allow student relationship", () => {
      const student = new Student();
      student.neptun = "ABC123";
      student.major = "Computer Science";
      student.university = "ELTE";

      user.student = student;

      expect(user.student).toBeDefined();
      expect(user.student.neptun).toBe("ABC123");
      expect(user.student.major).toBe("Computer Science");
      expect(user.student.university).toBe("ELTE");
    });

    it("should allow mentor relationship", () => {
      const mentor = new Mentor();
      mentor.position = "Senior Developer";

      user.mentor = mentor;

      expect(user.mentor).toBeDefined();
      expect(user.mentor.position).toBe("Senior Developer");
    });
  });

  describe("Email Validation", () => {
    it("should handle valid email formats", () => {
      const validEmails = [
        "user@example.com",
        "test.email@domain.org",
        "user+tag@example.com",
        "firstname.lastname@company.co.uk",
      ];

      validEmails.forEach((email) => {
        user.email = email;
        expect(user.email).toBe(email);
      });
    });
  });

  describe("Password Reset", () => {
    it("should handle password reset token properties", () => {
      const token = "randomToken123";
      const expiry = Date.now() + 3600000; // 1 hour

      user.resetToken = token;
      user.resetTokenExpires = expiry;

      expect(user.resetToken).toBe(token);
      expect(user.resetTokenExpires).toBe(expiry);
    });

    it("should allow clearing reset token", () => {
      user.resetToken = "token";
      user.resetTokenExpires = Date.now();

      user.resetToken = null;
      user.resetTokenExpires = null;

      expect(user.resetToken).toBeNull();
      expect(user.resetTokenExpires).toBeNull();
    });
  });

  describe("Active Status", () => {
    it("should default to active", () => {
      expect(user.active).toBe(true);
    });

    it("should allow deactivating user", () => {
      user.active = false;
      expect(user.active).toBe(false);
    });

    it("should allow reactivating user", () => {
      user.active = false;
      user.active = true;
      expect(user.active).toBe(true);
    });
  });
});