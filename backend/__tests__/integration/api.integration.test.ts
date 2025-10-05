import request from "supertest";
import { AppDataSource } from "../../src/data-source";
import { app } from "../../src/app";
import { User } from "../../src/entity/User";
import { Company } from "../../src/entity/Company";
import { UserRole } from "../../src/types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { secretKey } from "../../src/config";

describe("API Integration Tests", () => {
  let connection: any;
  let userRepository: any;
  let companyRepository: any;
  let adminToken: string;
  let studentToken: string;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
    await connection.synchronize(true); // Reset database

    userRepository = AppDataSource.getRepository(User);
    companyRepository = AppDataSource.getRepository(Company);

    // Create test admin user
    const adminPassword = await bcrypt.hash("admin123", 10);
    const adminUser = userRepository.create({
      email: "admin@test.com",
      password: adminPassword,
      firstname: "Admin",
      lastname: "User",
      role: UserRole.ADMIN,
      active: true,
    });
    const savedAdmin = await userRepository.save(adminUser);

    // Create test student user
    const studentPassword = await bcrypt.hash("student123", 10);
    const studentUser = userRepository.create({
      email: "student@test.com",
      password: studentPassword,
      firstname: "Student",
      lastname: "User",
      role: UserRole.STUDENT,
      active: true,
    });
    const savedStudent = await userRepository.save(studentUser);

    // Generate tokens
    adminToken = jwt.sign(
      {
        id: savedAdmin.id,
        firstname: savedAdmin.firstname,
        lastname: savedAdmin.lastname,
        role: savedAdmin.role,
      },
      secretKey,
      { expiresIn: "1d" }
    );

    studentToken = jwt.sign(
      {
        id: savedStudent.id,
        firstname: savedStudent.firstname,
        lastname: savedStudent.lastname,
        role: savedStudent.role,
      },
      secretKey,
      { expiresIn: "1d" }
    );
  });

  afterAll(async () => {
    if (connection) {
      await connection.destroy();
    }
  });

  describe("User Endpoints", () => {
    describe("POST /api/user/register", () => {
      it("should register a new user", async () => {
        const newUser = {
          email: "newuser@test.com",
          password: "password123",
          firstname: "New",
          lastname: "User",
          role: "student",
        };

        const response = await request(app)
          .post("/api/user/register")
          .send(newUser);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          id: expect.any(Number),
          email: newUser.email,
          firstname: newUser.firstname,
          lastname: newUser.lastname,
          role: newUser.role,
        });
        expect(response.body.password).toBeDefined();
      });

      it("should return 409 for duplicate email", async () => {
        const duplicateUser = {
          email: "admin@test.com", // Already exists
          password: "password123",
          firstname: "Duplicate",
          lastname: "User",
          role: "student",
        };

        const response = await request(app)
          .post("/api/user/register")
          .send(duplicateUser);

        expect(response.status).toBe(409);
        expect(response.body.message).toBe("this Email address is already used");
      });

      it("should handle missing required fields", async () => {
        const incompleteUser = {
          email: "incomplete@test.com",
          // missing password, firstname, lastname
        };

        const response = await request(app)
          .post("/api/user/register")
          .send(incompleteUser);

        expect(response.status).toBe(500); // Should be handled by validation
      });
    });

    describe("POST /api/user/login", () => {
      it("should login with valid credentials", async () => {
        const loginData = {
          email: "admin@test.com",
          password: "admin123",
        };

        const response = await request(app)
          .post("/api/user/login")
          .send(loginData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("accessToken");
        expect(typeof response.body.accessToken).toBe("string");
      });

      it("should return 401 for invalid credentials", async () => {
        const loginData = {
          email: "admin@test.com",
          password: "wrongpassword",
        };

        const response = await request(app)
          .post("/api/user/login")
          .send(loginData);

        expect(response.status).toBe(401);
        expect(response.body).toBe("Incorrect email or password");
      });

      it("should return 400 for missing credentials", async () => {
        const response = await request(app)
          .post("/api/user/login")
          .send({ email: "admin@test.com" }); // missing password

        expect(response.status).toBe(400);
        expect(response.body).toBe("Email and password are required");
      });
    });

    describe("GET /api/user", () => {
      it("should return all users", async () => {
        const response = await request(app).get("/api/user");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty("id");
        expect(response.body[0]).toHaveProperty("email");
        expect(response.body[0]).toHaveProperty("firstname");
      });
    });

    describe("GET /api/user/:id", () => {
      it("should return user by ID", async () => {
        const users = await userRepository.find();
        const userId = users[0].id;

        const response = await request(app).get(`/api/user/${userId}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          id: userId,
          email: expect.any(String),
          firstname: expect.any(String),
          lastname: expect.any(String),
        });
      });

      it("should return 404 for non-existent user", async () => {
        const response = await request(app).get("/api/user/99999");

        expect(response.status).toBe(404);
        expect(response.body).toBe("User not found");
      });

      it("should return 400 for invalid user ID", async () => {
        const response = await request(app).get("/api/user/invalid");

        expect(response.status).toBe(400);
        expect(response.body).toBe("Invalid user ID");
      });
    });
  });

  describe("Company Endpoints", () => {
    describe("POST /api/company", () => {
      it("should create company as admin", async () => {
        const newCompany = {
          name: "Test Company API",
          city: "Budapest",
          email: "testapi@company.com",
          phone: "+36123456789",
          address: "Test Address 123",
          active: true,
        };

        const response = await request(app)
          .post("/api/company")
          .set("Authorization", `Bearer ${adminToken}`)
          .send(newCompany);

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
          id: expect.any(Number),
          name: newCompany.name,
          city: newCompany.city,
          email: newCompany.email,
          active: true,
        });
      });

      it("should return 403 for non-admin user", async () => {
        const newCompany = {
          name: "Unauthorized Company",
          city: "Budapest",
          email: "unauthorized@company.com",
          address: "Unauthorized Address",
        };

        const response = await request(app)
          .post("/api/company")
          .set("Authorization", `Bearer ${studentToken}`)
          .send(newCompany);

        expect(response.status).toBe(403);
        expect(response.body).toBe("Only admins can create companies");
      });

      it("should return 401 for unauthenticated request", async () => {
        const newCompany = {
          name: "Unauthenticated Company",
          city: "Budapest",
          email: "unauth@company.com",
          address: "Unauth Address",
        };

        const response = await request(app)
          .post("/api/company")
          .send(newCompany);

        expect(response.status).toBe(401);
      });
    });

    describe("GET /api/company", () => {
      it("should return all companies", async () => {
        const response = await request(app).get("/api/company");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
      });

      it("should filter companies by active status", async () => {
        const response = await request(app).get("/api/company?active=true");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        if (response.body.length > 0) {
          expect(response.body.every((company: any) => company.active === true)).toBe(true);
        }
      });
    });

    describe("GET /api/company/active", () => {
      it("should return only active companies", async () => {
        const response = await request(app).get("/api/company/active");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        if (response.body.length > 0) {
          expect(response.body.every((company: any) => company.active === true)).toBe(true);
        }
      });
    });

    describe("GET /api/company/search", () => {
      it("should search companies by query", async () => {
        // First create a company to search for
        await request(app)
          .post("/api/company")
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            name: "Searchable Company",
            city: "Budapest",
            email: "searchable@company.com",
            address: "Searchable Address",
          });

        const response = await request(app).get("/api/company/search?query=Searchable");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
      });

      it("should return 400 for missing search query", async () => {
        const response = await request(app).get("/api/company/search");

        expect(response.status).toBe(400);
        expect(response.body).toBe("Search query is required");
      });
    });
  });

  describe("Protected Routes", () => {
    it("should return 401 for missing token", async () => {
      const response = await request(app)
        .put("/api/user/1")
        .send({ firstname: "Updated" });

      expect(response.status).toBe(401);
    });

    it("should return 401 for invalid token", async () => {
      const response = await request(app)
        .put("/api/user/1")
        .set("Authorization", "Bearer invalid-token")
        .send({ firstname: "Updated" });

      expect(response.status).toBe(401);
    });
  });

  describe("Error Handling", () => {
    it("should handle non-existent endpoints", async () => {
      const response = await request(app).get("/api/nonexistent");

      expect(response.status).toBe(404);
    });

    it("should handle malformed JSON", async () => {
      const response = await request(app)
        .post("/api/user/register")
        .set("Content-Type", "application/json")
        .send("{ invalid json");

      expect(response.status).toBe(400);
    });
  });
});