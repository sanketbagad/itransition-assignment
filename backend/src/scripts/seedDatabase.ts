import mongoose from 'mongoose';
import connectDB from '../config/database';
import { Drug } from '../models/Drug';

// Sample drug data (you can expand this with your actual data)
const drugData = [
  {
    code: 'DRUG001',
    genericName: 'Acetaminophen',
    brandName: 'Tylenol',
    company: 'Johnson & Johnson',
    launchDate: new Date('2000-01-15'),
  },
  {
    code: 'DRUG002',
    genericName: 'Ibuprofen',
    brandName: 'Advil',
    company: 'Pfizer',
    launchDate: new Date('1998-03-22'),
  },
  {
    code: 'DRUG003',
    genericName: 'Aspirin',
    brandName: 'Bayer Aspirin',
    company: 'Bayer',
    launchDate: new Date('1997-06-10'),
  },
  {
    code: 'DRUG004',
    genericName: 'Omeprazole',
    brandName: 'Prilosec',
    company: 'AstraZeneca',
    launchDate: new Date('2001-11-08'),
  },
  {
    code: 'DRUG005',
    genericName: 'Metformin',
    brandName: 'Glucophage',
    company: 'Bristol-Myers Squibb',
    launchDate: new Date('1999-09-14'),
  },
  {
    code: 'DRUG006',
    genericName: 'Atorvastatin',
    brandName: 'Lipitor',
    company: 'Pfizer',
    launchDate: new Date('2002-04-12'),
  },
  {
    code: 'DRUG007',
    genericName: 'Amlodipine',
    brandName: 'Norvasc',
    company: 'Pfizer',
    launchDate: new Date('2000-08-07'),
  },
  {
    code: 'DRUG008',
    genericName: 'Lisinopril',
    brandName: 'Prinivil',
    company: 'Merck',
    launchDate: new Date('1998-12-03'),
  },
  {
    code: 'DRUG009',
    genericName: 'Levothyroxine',
    brandName: 'Synthroid',
    company: 'AbbVie',
    launchDate: new Date('2001-02-18'),
  },
  {
    code: 'DRUG010',
    genericName: 'Albuterol',
    brandName: 'ProAir',
    company: 'Teva Pharmaceutical',
    launchDate: new Date('2003-05-25'),
  },
  {
    code: 'DRUG011',
    genericName: 'Gabapentin',
    brandName: 'Neurontin',
    company: 'Pfizer',
    launchDate: new Date('1999-07-16'),
  },
  {
    code: 'DRUG012',
    genericName: 'Sertraline',
    brandName: 'Zoloft',
    company: 'Pfizer',
    launchDate: new Date('2000-10-11'),
  },
  {
    code: 'DRUG013',
    genericName: 'Montelukast',
    brandName: 'Singulair',
    company: 'Merck',
    launchDate: new Date('2002-01-29'),
  },
  {
    code: 'DRUG014',
    genericName: 'Furosemide',
    brandName: 'Lasix',
    company: 'Sanofi',
    launchDate: new Date('1998-11-04'),
  },
  {
    code: 'DRUG015',
    genericName: 'Escitalopram',
    brandName: 'Lexapro',
    company: 'Forest Laboratories',
    launchDate: new Date('2003-08-14'),
  },
  {
    code: 'DRUG016',
    genericName: 'Hydrochlorothiazide',
    brandName: 'Microzide',
    company: 'Watson Pharmaceuticals',
    launchDate: new Date('1997-04-22'),
  },
  {
    code: 'DRUG017',
    genericName: 'Losartan',
    brandName: 'Cozaar',
    company: 'Merck',
    launchDate: new Date('2001-09-07'),
  },
  {
    code: 'DRUG018',
    genericName: 'Azithromycin',
    brandName: 'Zithromax',
    company: 'Pfizer',
    launchDate: new Date('1999-03-12'),
  },
  {
    code: 'DRUG019',
    genericName: 'Simvastatin',
    brandName: 'Zocor',
    company: 'Merck',
    launchDate: new Date('2000-06-28'),
  },
  {
    code: 'DRUG020',
    genericName: 'Pantoprazole',
    brandName: 'Protonix',
    company: 'Wyeth',
    launchDate: new Date('2002-12-15'),
  },
];

export async function seedDatabase(): Promise<void> {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await Drug.deleteMany({});
    console.log('🗑️  Cleared existing drug data');
    
    // Insert new data
    const insertedDrugs = await Drug.insertMany(drugData);
    console.log(`✅ Successfully seeded ${insertedDrugs.length} drugs`);
    
    // Display some statistics
    const totalDrugs = await Drug.countDocuments();
    const uniqueCompanies = await Drug.distinct('company');
    
    console.log(`📊 Database Statistics:`);
    console.log(`   - Total drugs: ${totalDrugs}`);
    console.log(`   - Unique companies: ${uniqueCompanies.length}`);
    console.log(`   - Companies: ${uniqueCompanies.join(', ')}`);
    
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
      console.log('✅ Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding process failed:', error);
      process.exit(1);
    });
}