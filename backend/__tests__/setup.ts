import { AppDataSource } from "../src/data-source";

// Global test setup
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = "test";
  
  // Mock console methods to reduce noise in tests
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(async () => {
  // Restore console methods
  jest.restoreAllMocks();
  
  // Close database connection if it exists
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

// Global test configuration
jest.setTimeout(30000); // 30 seconds timeout for tests

// Mock external dependencies globally
jest.mock("nodemailer", () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn().mockResolvedValue({ messageId: "test-message-id" }),
  })),
}));

// Export common test utilities
export const createMockRequest = (overrides = {}) => ({
  params: {},
  body: {},
  query: {},
  headers: {},
  user: null,
  ...overrides,
});

export const createMockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.sendFile = jest.fn().mockReturnValue(res);
  return res;
};

export const createMockNext = () => jest.fn();

// Common test data
export const testUsers = {
  admin: {
    id: 1,
    email: "admin@test.com",
    firstname: "Admin",
    lastname: "User",
    role: "admin",
    active: true,
  },
  student: {
    id: 2,
    email: "student@test.com",
    firstname: "Student",
    lastname: "User",
    role: "student",
    active: true,
  },
  mentor: {
    id: 3,
    email: "mentor@test.com",
    firstname: "Mentor",
    lastname: "User",
    role: "mentor",
    active: true,
  },
};

export const testCompanies = {
  active: {
    id: 1,
    name: "Test Company",
    city: "Budapest",
    email: "test@company.com",
    phone: "+36123456789",
    address: "Test Address 123",
    active: true,
  },
  inactive: {
    id: 2,
    name: "Inactive Company",
    city: "Debrecen",
    email: "inactive@company.com",
    phone: null,
    address: "Inactive Address 456",
    active: false,
  },
};

// Database test helpers
export const cleanDatabase = async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.synchronize(true);
  }
};

export const seedDatabase = async () => {
  // This function can be used to seed test data
  // Implementation depends on specific test needs
};

// Error matchers
expect.extend({
  toBeValidationError(received) {
    const pass = received instanceof Error && 
                 received.message.includes("validation") ||
                 received.message.includes("required") ||
                 received.message.includes("invalid");
    
    if (pass) {
      return {
        message: () => `Expected ${received} not to be a validation error`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected ${received} to be a validation error`,
        pass: false,
      };
    }
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidationError(): R;
    }
  }
}