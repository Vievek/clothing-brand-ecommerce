import request from "supertest";
import app from "../../src/server.js";
import User from "../../src/models/User.js";
import generateToken from "../../src/utils/generateToken.js";

describe("Auth Controller", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /api/auth/register", () => {
    test("should register user successfully", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "Password123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body.status).toBe("success");
      expect(response.body.data.user.name).toBe(userData.name);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.password).toBeUndefined();
      expect(response.body.data.token).toBeDefined();

      const userInDb = await User.findOne({ email: userData.email });
      expect(userInDb).toBeDefined();
      expect(userInDb.name).toBe(userData.name);
    });

    test("should fail with duplicate email", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "Password123",
      };

      await User.create(userData);

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.status).toBe("fail");
      expect(response.body.message).toContain("User already exists");
    });

    test("should fail with invalid data", async () => {
      const invalidUserData = {
        name: "T",
        email: "invalid-email",
        password: "123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(invalidUserData)
        .expect(400);

      expect(response.body.status).toBe("fail");
    });
  });

  describe("POST /api/auth/login", () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "Password123",
    };

    beforeEach(async () => {
      await User.create(userData);
    });

    test("should login user successfully", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.token).toBeDefined();
    });

    test("should fail with invalid email", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: userData.password,
        })
        .expect(401);

      expect(response.body.status).toBe("fail");
      expect(response.body.message).toContain("Incorrect email or password");
    });

    test("should fail with invalid password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: userData.email,
          password: "wrongpassword",
        })
        .expect(401);

      expect(response.body.status).toBe("fail");
      expect(response.body.message).toContain("Incorrect email or password");
    });

    test("should fail with missing credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: userData.email,
        })
        .expect(400);

      expect(response.body.status).toBe("fail");
    });
  });

  describe("GET /api/auth/me", () => {
    test("should get current user with valid token", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "Password123",
      };

      const user = await User.create(userData);
      const token = generateToken(user._id);

      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data.user.email).toBe(userData.email);
    });

    test("should fail without token", async () => {
      const response = await request(app).get("/api/auth/me").expect(401);

      expect(response.body.status).toBe("fail");
    });
  });
});
