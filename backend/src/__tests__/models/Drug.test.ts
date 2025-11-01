import { Drug } from '../../models/Drug';
import { connectTestDB, closeTestDB, clearTestDB } from '../setup';
import { mockDrugs, createMockDrug } from '../fixtures/drugData';

describe('Drug Model', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  describe('Schema Validation', () => {
    it('should create a valid drug with all required fields', async () => {
      const drugData = createMockDrug();
      const drug = new Drug(drugData);
      const savedDrug = await drug.save();

      expect(savedDrug._id).toBeDefined();
      expect(savedDrug.code).toBe(drugData.code);
      expect(savedDrug.genericName).toBe(drugData.genericName);
      expect(savedDrug.brandName).toBe(drugData.brandName);
      expect(savedDrug.company).toBe(drugData.company);
      expect(savedDrug.launchDate).toEqual(drugData.launchDate);
    });

    it('should fail when required fields are missing', async () => {
      const invalidDrug = new Drug({});

      await expect(invalidDrug.save()).rejects.toThrow();
    });

    it('should fail when code is missing', async () => {
      const drugData = createMockDrug();
      delete drugData.code;
      const drug = new Drug(drugData);

      await expect(drug.save()).rejects.toThrow();
    });

    it('should fail when genericName is missing', async () => {
      const drugData = createMockDrug();
      delete drugData.genericName;
      const drug = new Drug(drugData);

      await expect(drug.save()).rejects.toThrow();
    });

    it('should fail when company is missing', async () => {
      const drugData = createMockDrug();
      delete drugData.company;
      const drug = new Drug(drugData);

      await expect(drug.save()).rejects.toThrow();
    });

    it('should fail when launchDate is missing', async () => {
      const drugData = createMockDrug();
      delete drugData.launchDate;
      const drug = new Drug(drugData);

      await expect(drug.save()).rejects.toThrow();
    });

    it('should enforce unique code constraint', async () => {
      const drugData1 = createMockDrug({ code: 'UNIQUE001' });
      const drugData2 = createMockDrug({ code: 'UNIQUE001' });

      await new Drug(drugData1).save();

      // Ensure indexes are created before testing constraint
      await Drug.ensureIndexes();

      await expect(new Drug(drugData2).save()).rejects.toThrow();
    });
  });

  describe('Indexes', () => {
    it('should have proper indexes for performance', async () => {
      // Ensure indexes are created by creating a document first
      const drugData = createMockDrug();
      await new Drug(drugData).save();
      await Drug.ensureIndexes(); // Force index creation

      const indexes = await Drug.collection.getIndexes();

      // Check if at least some indexes exist (MongoDB creates different index names)
      const indexNames = Object.keys(indexes);
      expect(indexNames.length).toBeGreaterThan(1); // At least _id and one other

      // Check for code uniqueness (most important for functionality)
      const hasCodeIndex = indexNames.some(name => name.includes('code'));
      expect(hasCodeIndex).toBe(true);
    });
  });

  describe('CRUD Operations', () => {
    it('should create multiple drugs', async () => {
      await Drug.insertMany(mockDrugs);
      const count = await Drug.countDocuments();
      expect(count).toBe(mockDrugs.length);
    });

    it('should find drugs by company', async () => {
      await Drug.insertMany(mockDrugs);
      const testPharmaDrugs = await Drug.find({ company: 'Test Pharma Inc' });
      expect(testPharmaDrugs).toHaveLength(2);
    });

    it('should find drugs by date range', async () => {
      await Drug.insertMany(mockDrugs);
      const recentDrugs = await Drug.find({
        launchDate: { $gte: new Date('2021-01-01') },
      });
      expect(recentDrugs.length).toBeGreaterThan(0);
    });

    it('should update a drug', async () => {
      const drugData = createMockDrug();
      const drug = await new Drug(drugData).save();

      const updatedBrandName = 'Updated Brand Name';
      await Drug.findByIdAndUpdate(drug._id, { brandName: updatedBrandName });

      const updatedDrug = await Drug.findById(drug._id);
      expect(updatedDrug?.brandName).toBe(updatedBrandName);
    });

    it('should delete a drug', async () => {
      const drugData = createMockDrug();
      const drug = await new Drug(drugData).save();

      await Drug.findByIdAndDelete(drug._id);

      const deletedDrug = await Drug.findById(drug._id);
      expect(deletedDrug).toBeNull();
    });
  });

  describe('Search Functionality', () => {
    beforeEach(async () => {
      await Drug.insertMany(mockDrugs);
    });

    it('should search by generic name (case insensitive)', async () => {
      const results = await Drug.find({
        genericName: { $regex: 'alpha', $options: 'i' },
      });
      expect(results).toHaveLength(1);
      expect(results[0].genericName).toBe('Test Drug Alpha');
    });

    it('should search by brand name (case insensitive)', async () => {
      const results = await Drug.find({
        brandName: { $regex: 'beta', $options: 'i' },
      });
      expect(results).toHaveLength(1);
      expect(results[0].brandName).toBe('Beta Brand');
    });

    it('should search by company (case insensitive)', async () => {
      const results = await Drug.find({
        company: { $regex: 'mock labs', $options: 'i' },
      });
      expect(results).toHaveLength(2);
    });

    it('should search by code', async () => {
      const results = await Drug.find({
        code: { $regex: 'TEST003', $options: 'i' },
      });
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe('TEST003');
    });
  });
});
