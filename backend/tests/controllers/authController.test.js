import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/server.js";
import User from "../../src/models/User.js";

describe("Auth Controller", () => {
  beforeAll(async () => {
    // Ensure connection is ready
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(
        process.env.MONGODB_URI_TEST || "mongodb://localhost:27017/test"
      );
    }
  });

  beforeEach(async () => {
    // Clear all collections before each test
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
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

      // Verify user was actually created in database
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

      // Create user first
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
        name: "T", // Too short
        email: "invalid-email", // Invalid email
        password: "123", // Too short
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
      // Create a user for login tests
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
      expect(response.body.data.user.name).toBe(userData.name);
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
          // password missing
        })
        .expect(400);

      expect(response.body.status).toBe("fail");
    });
  });

  describe("GET /api/auth/me", () => {
    test("should get current user with valid token", async () => {
      // First register a user
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "Password123",
      };

      // Create user directly to avoid registration endpoint issues
      const user = await User.create(userData);

      // Generate token manually
      const generateToken = (await import("../../src/utils/generateToken.js"))
        .default;
      const token = generateToken(user._id);

      // Then get current user
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.name).toBe(userData.name);
    });

    test("should fail without token", async () => {
      const response = await request(app).get("/api/auth/me").expect(401);

      expect(response.body.status).toBe("fail");
    });
  });
});
