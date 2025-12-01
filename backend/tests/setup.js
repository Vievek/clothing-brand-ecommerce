import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

// Set NODE_ENV to test
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "a0a7cb11b1c97b4604eea47d37ea90ab8490eedd3bb2b461e58e6731ae7f0605";

process.env.JWT_EXPIRES_IN = "7d";
process.env.PORT = "5001";

let mongoServer;

beforeAll(async () => {
  // Start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Connect to in-memory DB
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear all collections before each test
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});