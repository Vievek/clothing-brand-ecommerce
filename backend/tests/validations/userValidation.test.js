import {
  userRegistrationSchema,
  userLoginSchema,
} from "../../src/validations/userValidation.js";

describe("User Validation", () => {
  describe("Registration Validation", () => {
    test("should validate correct registration data", () => {
      const validData = {
        name: "John Doe",
        email: "john@example.com",
        password: "Password123",
      };

      expect(() => userRegistrationSchema.parse(validData)).not.toThrow();
    });

    test("should reject invalid email", () => {
      const invalidData = {
        name: "John Doe",
        email: "invalid-email",
        password: "password123",
      };

      expect(() => userRegistrationSchema.parse(invalidData)).toThrow();
    });

    test("should reject short password", () => {
      const invalidData = {
        name: "John Doe",
        email: "john@example.com",
        password: "123",
      };

      expect(() => userRegistrationSchema.parse(invalidData)).toThrow();
    });
  });

  describe("Login Validation", () => {
    test("should validate correct login data", () => {
      const validData = {
        email: "john@example.com",
        password: "password123",
      };

      expect(() => userLoginSchema.parse(validData)).not.toThrow();
    });
  });
});
