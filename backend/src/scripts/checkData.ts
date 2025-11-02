/* eslint-disable no-console */
import mongoose from 'mongoose';
import { Drug } from '../models/Drug';
import connectDB from '../config/database';

async function checkData() {
  try {
    await connectDB();

    const count = await Drug.countDocuments();
    console.log(`📊 Total drugs in database: ${count}`);

    // Show some sample records
    const samples = await Drug.find().limit(5);
    console.log('\n📋 Sample records:');
    samples.forEach((drug, i) => {
      console.log(
        `${i + 1}. ${drug.genericName} - ${drug.brandName} (${drug.company})`
      );
    });

    // Show company distribution
    const companies = await Drug.distinct('company');
    console.log(`\n🏢 Unique companies: ${companies.length}`);
    console.log(
      `Companies: ${companies.slice(0, 10).join(', ')}${companies.length > 10 ? '...' : ''}`
    );
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

checkData();
