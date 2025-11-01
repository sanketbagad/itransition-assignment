import mongoose from 'mongoose';
import connectDB from '../config/database';

/* eslint-disable no-console */

async function testConnection(): Promise<void> {
  try {
    console.log('🔗 Testing database connection...');
    console.log('Environment:', process.env.NODE_ENV);
    console.log(
      'MongoDB URI:',
      process.env.MONGODB_URI || 'mongodb://localhost:27017/drug_inventory'
    );

    await connectDB();
    console.log('✅ Successfully connected to database!');

    const dbName = mongoose.connection.db?.databaseName;
    console.log('📊 Connected to database:', dbName);
  } catch (error) {
    console.error('❌ Connection failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

testConnection();
