import mongoose from 'mongoose';
import connectDB from '../config/database';
import { Drug } from '../models/Drug';
import { seedData } from '../data/seedData';

/* eslint-disable no-console */

export async function seedDatabase(): Promise<void> {
  try {
    console.log('🌱 Starting database seeding...');
    console.log('Environment:', process.env.NODE_ENV);
    console.log(
      'MongoDB URI:',
      process.env.MONGODB_URI || 'mongodb://localhost:27017/drug_inventory'
    );

    // Connect to database
    await connectDB();
    console.log('✅ Connected to database');

    // Clear existing data
    await Drug.deleteMany({});
    console.log('🗑️  Cleared existing drug data');

    console.log(`📥 Preparing to seed ${seedData.length} drugs...`);

    // Transform the JSON data to match our schema
    const transformedData = seedData.map(drug => ({
      code: drug.code,
      genericName: drug.genericName,
      brandName: drug.brandName,
      company: drug.company,
      launchDate: new Date(drug.launchDate),
    }));

    console.log('🔄 Inserting drugs...');
    // Insert drugs one by one to handle duplicates gracefully
    let insertedCount = 0;
    let updatedCount = 0;

    for (const drugData of transformedData) {
      try {
        // Check if drug already exists
        const existingDrug = await Drug.findOne({ code: drugData.code });

        if (existingDrug) {
          // Update existing drug
          await Drug.findOneAndUpdate({ code: drugData.code }, drugData, {
            new: true,
          });
          updatedCount++;
        } else {
          // Insert new drug
          await Drug.create(drugData);
          insertedCount++;
        }

        // Log progress every 100 records
        if ((insertedCount + updatedCount) % 100 === 0) {
          console.log(
            `   ✅ Processed ${insertedCount + updatedCount} records...`
          );
        }
      } catch (error) {
        console.log(
          `   ⚠️  Error with ${drugData.code}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    console.log(
      `✅ Successfully processed ${insertedCount + updatedCount} drugs`
    );
    console.log(`   📝 Inserted: ${insertedCount}`);
    console.log(`   🔄 Updated: ${updatedCount}`);

    // Display some statistics
    const totalDrugs = await Drug.countDocuments();
    const uniqueCompanies = await Drug.distinct('company');

    console.log(`📊 Database Statistics:`);
    console.log(`   - Total drugs: ${totalDrugs}`);
    console.log(`   - Unique companies: ${uniqueCompanies.length}`);
    console.log(
      `   - Companies: ${uniqueCompanies.slice(0, 5).join(', ')}${uniqueCompanies.length > 5 ? '...' : ''}`
    );

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding process completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Seeding process failed:', error);
      process.exit(1);
    });
}
