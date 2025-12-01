import request from "supertest";
import app from "../../src/server.js";
import Product from "../../src/models/Product.js";

describe("Product Controller", () => {
  beforeEach(async () => {
    await Product.create([
      {
        name: "Men T-Shirt",
        description: "Comfortable cotton t-shirt for men",
        price: 29.99,
        imageUrl: "https://example.com/tshirt1.jpg",
        category: "Men",
        sizes: ["S", "M", "L"],
        stock: 50,
      },
      {
        name: "Women Dress",
        description: "Elegant summer dress",
        price: 59.99,
        imageUrl: "https://example.com/dress1.jpg",
        category: "Women",
        sizes: ["S", "M"],
        stock: 30,
      },
    ]);
  });

  afterEach(async () => {
    await Product.deleteMany({});
  });

  describe("GET /api/products", () => {
    test("should get all products with pagination", async () => {
      const response = await request(app).get("/api/products").expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data.products).toHaveLength(2);
      expect(response.body.data.pagination).toBeDefined();
    });

    test("should filter products by category", async () => {
      const response = await request(app)
        .get("/api/products?category=Men")
        .expect(200);

      expect(response.body.data.products).toHaveLength(1);
      expect(response.body.data.products[0].category).toBe("Men");
    });

    test("should search products by name", async () => {
      const response = await request(app)
        .get("/api/products?search=dress")
        .expect(200);

      expect(response.body.data.products).toHaveLength(1);
      expect(response.body.data.products[0].name).toContain("Dress");
    });
  });
});
