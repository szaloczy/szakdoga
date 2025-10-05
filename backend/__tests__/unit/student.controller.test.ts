import { StudentController } from "../../src/controller/student.controller";
import { AppDataSource } from "../../src/data-source";
import { Student } from "../../src/entity/Student";
import { User } from "../../src/entity/User";

// Mock dependencies
jest.mock("../../src/data-source");

describe("StudentController", () => {
  let studentController: StudentController;
  let mockRepository: any;
  let mockUserRepository: any;
  let req: any;
  let res: any;

  beforeEach(() => {
    studentController = new StudentController();

    // Mock repository methods
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
        getOne: jest.fn(),
      })),
    };

    mockUserRepository = {
      findOne: jest.fn(),
    };

    // Mock AppDataSource
    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity === Student) return mockRepository;
      if (entity === User) return mockUserRepository;
      return mockRepository;
    });

    studentController.repository = mockRepository;

    // Mock request and response
    req = {
      params: {},
      body: {},
      query: {},
      user: { id: 1, role: "admin" },
    };

    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      setHeader: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return all students", async () => {
      const mockStudents = [
        {
          id: 1,
          neptun: "ABC123",
          major: "Computer Science",
          university: "ELTE",
          user: {
            id: 1,
            firstname: "John",
            lastname: "Doe",
            email: "john.doe@student.elte.hu",
          },
        },
      ];

      mockRepository.find.mockResolvedValue(mockStudents);

      await studentController.getAll(req, res);

      expect(mockRepository.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockStudents);
    });

    it("should handle database errors", async () => {
      const error = new Error("Database connection failed");
      mockRepository.find.mockRejectedValue(error);

      await studentController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getById", () => {
    it("should return student by ID", async () => {
      const mockStudent = {
        id: 1,
        neptun: "ABC123",
        major: "Computer Science",
        university: "ELTE",
        user: {
          firstname: "John",
          lastname: "Doe",
          email: "john.doe@student.elte.hu",
        },
      };

      req.params.id = "1";
      mockRepository.findOne.mockResolvedValue(mockStudent);

      await studentController.getById(req, res);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ["user"],
      });
      expect(res.json).toHaveBeenCalledWith(mockStudent);
    });

    it("should return 404 for non-existent student", async () => {
      req.params.id = "999";
      mockRepository.findOne.mockResolvedValue(null);

      await studentController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 400 for invalid ID format", async () => {
      req.params.id = "invalid";

      await studentController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("getByUserId", () => {
    it("should return student by user ID", async () => {
      const mockStudent = {
        id: 1,
        neptun: "ABC123",
        major: "Computer Science",
        university: "ELTE",
        user: { id: 1 },
      };

      req.params.userId = "1";
      mockRepository.findOne.mockResolvedValue(mockStudent);

      await studentController.getByUserId(req, res);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: 1 } },
        relations: ["user"],
      });
      expect(res.json).toHaveBeenCalledWith(mockStudent);
    });
  });

  // TODO: Add more tests for other methods like exportCsv, exportMyCsv, etc.
  // This is an example of how to structure tests for the StudentController
});

// This file serves as a template for creating tests for other controllers
// To complete the test suite, similar files should be created for:
// - internship.controller.test.ts
// - mentor.controller.test.ts  
// - document.controller.test.ts
// - statistics.controller.test.ts