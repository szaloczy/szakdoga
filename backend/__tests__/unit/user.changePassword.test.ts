import { UserController } from "../../src/controller/user.controller";
import { AppDataSource } from "../../src/data-source";
import { User } from "../../src/entity/User";
import bcrypt from "bcrypt";

jest.mock("../../src/data-source");
jest.mock("bcrypt");

describe("UserController - Change Password", () => {
  let controller: UserController;
  let mockRepository: any;
  let req: any;
  let res: any;

  beforeEach(() => {
    controller = new UserController();
    mockRepository = {
      findOne: jest.fn(),
      save: jest.fn()
    };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);

    req = {
      params: { id: "1" },
      body: {},
      user: { id: 1, role: "student" }
    };

    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    };
  });

  it("should change password successfully for own account", async () => {
    const mockUser = {
      id: 1,
      password: "hashedOldPassword"
    };

    req.body = {
      currentPassword: "oldPassword123",
      newPassword: "newPassword123"
    };

    mockRepository.findOne.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock)
      .mockResolvedValueOnce(true)  // current password check
      .mockResolvedValueOnce(false); // new password different check
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedNewPassword");

    await controller.changePassword(req, res);

    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(bcrypt.compare).toHaveBeenCalledWith("oldPassword123", "hashedOldPassword");
    expect(bcrypt.hash).toHaveBeenCalledWith("newPassword123", 10);
    expect(mockRepository.save).toHaveBeenCalledWith({
      ...mockUser,
      password: "hashedNewPassword"
    });
    expect(res.json).toHaveBeenCalledWith({ message: "Password changed successfully" });
  });

  it("should return 400 for invalid user ID", async () => {
    req.params.id = "invalid";

    await controller.changePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 403 when trying to change another user's password", async () => {
    req.params.id = "2"; // Different user ID
    req.user = { id: 1, role: "student" };

    await controller.changePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("should return 400 for missing passwords", async () => {
    req.body = { currentPassword: "test" }; // Missing newPassword

    await controller.changePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 for short new password", async () => {
    req.body = {
      currentPassword: "oldPassword123",
      newPassword: "123" // Too short
    };

    await controller.changePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 404 for non-existent user", async () => {
    req.body = {
      currentPassword: "oldPassword123",
      newPassword: "newPassword123"
    };

    mockRepository.findOne.mockResolvedValue(null);

    await controller.changePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should return 400 for incorrect current password", async () => {
    const mockUser = {
      id: 1,
      password: "hashedOldPassword"
    };

    req.body = {
      currentPassword: "wrongPassword",
      newPassword: "newPassword123"
    };

    mockRepository.findOne.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Incorrect current password

    await controller.changePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 when new password is same as current", async () => {
    const mockUser = {
      id: 1,
      password: "hashedPassword"
    };

    req.body = {
      currentPassword: "samePassword",
      newPassword: "samePassword"
    };

    mockRepository.findOne.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock)
      .mockResolvedValueOnce(true)  // current password check passes
      .mockResolvedValueOnce(true); // new password is same as current

    await controller.changePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should allow admin to change any user's password without current password", async () => {
    const mockUser = {
      id: 2,
      password: "hashedOldPassword"
    };

    req.params.id = "2";
    req.user = { id: 1, role: "admin" };
    req.body = {
      currentPassword: "anyPassword", // Admin doesn't need correct current password
      newPassword: "newPassword123"
    };

    mockRepository.findOne.mockResolvedValue(mockUser);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedNewPassword");

    await controller.changePassword(req, res);

    expect(bcrypt.compare).not.toHaveBeenCalled(); // Admin bypass
    expect(bcrypt.hash).toHaveBeenCalledWith("newPassword123", 10);
    expect(mockRepository.save).toHaveBeenCalledWith({
      ...mockUser,
      password: "hashedNewPassword"
    });
    expect(res.json).toHaveBeenCalledWith({ message: "Password changed successfully" });
  });
});