import { CompanyController } from "../../src/controller/company.controller";
import { AppDataSource } from "../../src/data-source";
import { Company } from "../../src/entity/Company";
import { Mentor } from "../../src/entity/Mentor";

// Mock dependencies
jest.mock("../../src/data-source");

describe("CompanyController", () => {
  let companyController: CompanyController;
  let mockRepository: any;
  let mockMentorRepository: any;
  let mockQueryBuilder: any;
  let req: any;
  let res: any;

  beforeEach(() => {
    companyController = new CompanyController();

    // Mock query builder
    mockQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      getOne: jest.fn(),
    };

    // Mock repository methods
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    mockMentorRepository = {
      count: jest.fn(),
      find: jest.fn(),
    };

    // Mock AppDataSource
    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity === Company) return mockRepository;
      if (entity === Mentor) return mockMentorRepository;
      return mockRepository;
    });

    companyController.repository = mockRepository;
    companyController.mentorRepository = mockMentorRepository;

    // Mock request and response objects
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
    };

    // Clear mocks
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return all companies without filters", async () => {
      const mockCompanies = [
        {
          id: 1,
          name: "Test Company 1",
          city: "Budapest",
          email: "test1@company.com",
          phone: "+36123456789",
          address: "Test Address 1",
          active: true,
        },
        {
          id: 2,
          name: "Test Company 2",
          city: "Debrecen",
          email: "test2@company.com",
          phone: "+36987654321",
          address: "Test Address 2",
          active: true,
        },
      ];

      mockQueryBuilder.getMany.mockResolvedValue(mockCompanies);

      await companyController.getAll(req, res);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith("company");
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith("company.mentors", "mentors");
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith("mentors.user", "mentorUser");
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith("company.name", "ASC");
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            name: "Test Company 1",
            city: "Budapest",
          }),
        ])
      );
    });

    it("should filter companies by active status", async () => {
      const mockCompanies = [
        {
          id: 1,
          name: "Active Company",
          city: "Budapest",
          email: "active@company.com",
          phone: null,
          address: "Active Address",
          active: true,
        },
      ];

      req.query = { active: "true" };
      mockQueryBuilder.getMany.mockResolvedValue(mockCompanies);

      await companyController.getAll(req, res);

      expect(mockQueryBuilder.where).toHaveBeenCalledWith("company.active = :active", {
        active: true,
      });
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            active: true,
          }),
        ])
      );
    });

    it("should filter companies by city", async () => {
      req.query = { city: "Buda" };
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await companyController.getAll(req, res);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith("company.city ILIKE :city", {
        city: "%Buda%",
      });
    });

    it("should filter companies by name", async () => {
      req.query = { name: "Test" };
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await companyController.getAll(req, res);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith("company.name ILIKE :name", {
        name: "%Test%",
      });
    });
  });

  describe("getOne", () => {
    it("should return company by valid ID", async () => {
      const mockCompany = {
        id: 1,
        name: "Test Company",
        city: "Budapest",
        email: "test@company.com",
        phone: "+36123456789",
        address: "Test Address",
        active: true,
      };

      req.params.id = "1";
      mockRepository.findOne.mockResolvedValue(mockCompany);

      await companyController.getOne(req, res);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ["mentors", "mentors.user"],
      });
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          name: "Test Company",
        })
      );
    });

    it("should return 400 for invalid ID", async () => {
      req.params.id = "invalid";

      await companyController.getOne(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith("Invalid company ID");
    });

    it("should return 404 for non-existent company", async () => {
      req.params.id = "999";
      mockRepository.findOne.mockResolvedValue(null);

      await companyController.getOne(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith("Company not found");
    });
  });

  describe("create", () => {
    it("should create a new company successfully", async () => {
      const companyData = {
        name: "New Company",
        city: "Budapest",
        email: "new@company.com",
        phone: "+36123456789",
        address: "New Address",
        active: true,
      };

      const createdCompany = { id: 1, ...companyData };

      req.body = companyData;
      req.user = { id: 1, role: "admin" };

      mockRepository.findOne.mockResolvedValue(null); // No existing company
      mockRepository.create.mockReturnValue(companyData);
      mockRepository.save.mockResolvedValue(createdCompany);

      await companyController.create(req, res);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { name: "New Company" },
      });
      expect(mockRepository.create).toHaveBeenCalledWith(companyData);
      expect(mockRepository.save).toHaveBeenCalledWith(companyData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          name: "New Company",
        })
      );
    });

    it("should return 401 for unauthenticated user", async () => {
      req.user = null;

      await companyController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith("User not authenticated");
    });

    it("should return 403 for non-admin user", async () => {
      req.user = { id: 1, role: "student" };

      await companyController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith("Only admins can create companies");
    });

    it("should return 400 for missing required fields", async () => {
      req.body = { name: "Company", city: "Budapest" }; // missing email and address
      req.user = { id: 1, role: "admin" };

      await companyController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith("Name, city, email and address are required");
    });

    it("should return 400 for invalid email format", async () => {
      req.body = {
        name: "Company",
        city: "Budapest",
        email: "invalid-email",
        address: "Address",
      };
      req.user = { id: 1, role: "admin" };

      await companyController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith("Invalid email format");
    });

    it("should return 409 for duplicate company name", async () => {
      const existingCompany = { id: 1, name: "Existing Company" };

      req.body = {
        name: "Existing Company",
        city: "Budapest",
        email: "test@company.com",
        address: "Address",
      };
      req.user = { id: 1, role: "admin" };

      mockRepository.findOne.mockResolvedValue(existingCompany);

      await companyController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith("Company with this name already exists");
    });
  });

  describe("update", () => {
    it("should update company successfully", async () => {
      const existingCompany = {
        id: 1,
        name: "Old Company",
        city: "Budapest",
        email: "old@company.com",
        phone: "+36123456789",
        address: "Old Address",
        active: true,
      };

      const updateData = {
        name: "Updated Company",
        email: "updated@company.com",
      };

      const updatedCompany = { ...existingCompany, ...updateData };

      req.params.id = "1";
      req.body = updateData;
      req.user = { id: 1, role: "admin" };

      mockRepository.findOne
        .mockResolvedValueOnce(existingCompany) // First call for finding the company
        .mockResolvedValueOnce(null); // Second call for checking name uniqueness
      mockRepository.save.mockResolvedValue(updatedCompany);

      await companyController.update(req, res);

      expect(mockRepository.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Updated Company",
          email: "updated@company.com",
        })
      );
    });

    it("should return 404 for non-existent company", async () => {
      req.params.id = "999";
      req.body = { name: "Updated" };
      req.user = { id: 1, role: "admin" };

      mockRepository.findOne.mockResolvedValue(null);

      await companyController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith("Company not found");
    });

    it("should return 403 for non-admin user", async () => {
      req.user = { id: 1, role: "student" };

      await companyController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith("Only admins can update companies");
    });
  });

  describe("delete", () => {
    it("should delete company successfully", async () => {
      const companyToDelete = {
        id: 1,
        name: "Company to Delete",
        city: "Budapest",
        email: "delete@company.com",
        phone: null,
        address: "Delete Address",
        active: true,
      };

      req.params.id = "1";
      req.user = { id: 1, role: "admin" };

      mockRepository.findOne.mockResolvedValue(companyToDelete);
      mockMentorRepository.count.mockResolvedValue(0); // No active mentors
      mockRepository.remove.mockResolvedValue(companyToDelete);

      await companyController.delete(req, res);

      expect(mockMentorRepository.count).toHaveBeenCalledWith({
        where: {
          company: { id: 1 },
          user: { active: true },
        },
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(companyToDelete);
      expect(res.json).toHaveBeenCalledWith({
        message: "Company deleted successfully",
      });
    });

    it("should return 400 when company has active mentors", async () => {
      const companyWithMentors = { id: 1, name: "Company with Mentors" };

      req.params.id = "1";
      req.user = { id: 1, role: "admin" };

      mockRepository.findOne.mockResolvedValue(companyWithMentors);
      mockMentorRepository.count.mockResolvedValue(2); // Has active mentors

      await companyController.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith("Cannot delete company with active mentors");
    });
  });

  describe("getActive", () => {
    it("should return only active companies", async () => {
      const activeCompanies = [
        {
          id: 1,
          name: "Active Company 1",
          city: "Budapest",
          email: "active1@company.com",
          phone: null,
          address: "Active Address 1",
          active: true,
        },
        {
          id: 2,
          name: "Active Company 2",
          city: "Debrecen",
          email: "active2@company.com",
          phone: "+36123456789",
          address: "Active Address 2",
          active: true,
        },
      ];

      mockRepository.find.mockResolvedValue(activeCompanies);

      await companyController.getActive(req, res);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { active: true },
        order: { name: "ASC" },
      });
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ active: true }),
          expect.objectContaining({ active: true }),
        ])
      );
    });
  });

  describe("search", () => {
    it("should search companies by query", async () => {
      const searchResults = [
        {
          id: 1,
          name: "Tech Company",
          city: "Budapest",
          email: "tech@company.com",
          phone: null,
          address: "Tech Address",
          active: true,
        },
      ];

      req.query = { query: "Tech" };
      mockQueryBuilder.getMany.mockResolvedValue(searchResults);

      await companyController.search(req, res);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith("company");
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        "company.name ILIKE :query OR company.city ILIKE :query",
        { query: "%Tech%" }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith("company.active = :active", {
        active: true,
      });
    });

    it("should return 400 for missing search query", async () => {
      req.query = {};

      await companyController.search(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith("Search query is required");
    });
  });

  describe("getMentors", () => {
    it("should return active mentors for a company", async () => {
      const companyWithMentors = {
        id: 1,
        name: "Company",
        mentors: [
          { id: 1, user: { active: true, firstname: "Active", lastname: "Mentor" } },
          { id: 2, user: { active: false, firstname: "Inactive", lastname: "Mentor" } },
        ],
      };

      req.params.id = "1";
      mockRepository.findOne.mockResolvedValue(companyWithMentors);

      await companyController.getMentors(req, res);

      expect(res.json).toHaveBeenCalledWith([
        { id: 1, user: { active: true, firstname: "Active", lastname: "Mentor" } },
      ]);
    });

    it("should return 404 for non-existent company", async () => {
      req.params.id = "999";
      mockRepository.findOne.mockResolvedValue(null);

      await companyController.getMentors(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith("Company not found");
    });
  });
});