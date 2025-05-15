import request from "supertest";
import { AppDataSource } from "../../src/data-source";
import { app } from "../../src/app";
import { port } from "../../src/config";

let connection, server;

const testUser = {
  firstname: "Jhon",
  lastname: "Doe",
  email: "doe@gmail.com",
  password: "test123",
};

beforeEach(async () => {
  connection = await AppDataSource.initialize();
  await connection.synchronize(true);
  server = app.listen(port);
});

afterEach(async () => {
  connection.close();
  server.close();
});

it("Should be no user initially", async () => {
  const response = await request(app).get("/api/user");
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual([]);
});

it("should create a user", async () => {
  const response = await request(app).post("/api/user/register").send(testUser);

  expect(response.statusCode).toBe(200);

  expect(response.body).toEqual({
    id: expect.any(Number),
    firstname: expect.any(String),
    lastname: expect.any(String),
    email: expect.any(String),
    password: expect.any(String),
    role: expect.stringMatching(/user|admin/),
  });

  expect(response.body.firstname).toBe(testUser.firstname);
  expect(response.body.lastname).toBe(testUser.lastname);
  expect(response.body.email).toBe(testUser.email);
});
