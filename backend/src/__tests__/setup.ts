import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

/**
 * Connect to the in-memory database.
 */
export const connectTestDB = async (): Promise<void> => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);
};

/**
 * Drop database, close the connection and stop mongod.
 */
export const closeTestDB = async (): Promise<void> => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

/**
 * Remove all the data for all db collections.
 */
export const clearTestDB = async (): Promise<void> => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

/**
 * Setup function to run before each test suite
 */
export const setupTest = async (): Promise<void> => {
  await connectTestDB();
};

/**
 * Teardown function to run after each test suite
 */
export const teardownTest = async (): Promise<void> => {
  await closeTestDB();
};
