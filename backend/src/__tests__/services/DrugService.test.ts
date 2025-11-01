import { DrugService } from '../../services/DrugService';
import { Drug } from '../../models/Drug';
import { connectTestDB, closeTestDB, clearTestDB } from '../setup';
import { mockDrugs } from '../fixtures/drugData';

describe('DrugService', () => {
  let drugService: DrugService;

  beforeAll(async () => {
    await connectTestDB();
    drugService = new DrugService();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
    // Insert test data
    await Drug.insertMany(mockDrugs);
  });

  describe('getDrugs', () => {
    it('should return paginated drugs with default parameters', async () => {
      const result = await drugService.getDrugs({
        page: 1,
        limit: 50,
        sortBy: 'launchDate',
        sortOrder: 'desc',
      });

      expect(result.data).toHaveLength(mockDrugs.length);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.itemsPerPage).toBe(50);
      expect(result.pagination.totalItems).toBe(mockDrugs.length);
      expect(result.pagination.totalPages).toBe(1);
      expect(result.pagination.hasNextPage).toBe(false);
      expect(result.pagination.hasPreviousPage).toBe(false);

      // Check data structure
      result.data.forEach((drug, index) => {
        expect(drug.id).toBe(index + 1);
        expect(drug).toHaveProperty('code');
        expect(drug).toHaveProperty('name');
        expect(drug).toHaveProperty('company');
        expect(drug).toHaveProperty('launchDate');
      });
    });

    it('should handle pagination correctly', async () => {
      const result = await drugService.getDrugs({
        page: 1,
        limit: 2,
        sortBy: 'launchDate',
        sortOrder: 'desc',
      });

      expect(result.data).toHaveLength(2);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.itemsPerPage).toBe(2);
      expect(result.pagination.totalItems).toBe(mockDrugs.length);
      expect(result.pagination.totalPages).toBe(
        Math.ceil(mockDrugs.length / 2)
      );
      expect(result.pagination.hasNextPage).toBe(true);
      expect(result.pagination.hasPreviousPage).toBe(false);
    });

    it('should handle second page pagination', async () => {
      const result = await drugService.getDrugs({
        page: 2,
        limit: 2,
        sortBy: 'launchDate',
        sortOrder: 'desc',
      });

      expect(result.data).toHaveLength(2);
      expect(result.pagination.currentPage).toBe(2);
      expect(result.pagination.hasPreviousPage).toBe(true);
      // Check sequential IDs
      expect(result.data[0].id).toBe(3);
      expect(result.data[1].id).toBe(4);
    });

    it('should filter by search term', async () => {
      const result = await drugService.getDrugs({
        search: 'Alpha',
        page: 1,
        limit: 50,
        sortBy: 'launchDate',
        sortOrder: 'desc',
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toContain('Alpha');
    });

    it('should filter by company', async () => {
      const result = await drugService.getDrugs({
        company: 'Test Pharma Inc',
        page: 1,
        limit: 50,
        sortBy: 'launchDate',
        sortOrder: 'desc',
      });

      expect(result.data).toHaveLength(2);
      result.data.forEach(drug => {
        expect(drug.company).toBe('Test Pharma Inc');
      });
    });

    it('should sort by name ascending', async () => {
      const result = await drugService.getDrugs({
        page: 1,
        limit: 50,
        sortBy: 'name',
        sortOrder: 'asc',
      });

      const names = result.data.map(drug => drug.name);
      const sortedNames = [...names].sort();
      expect(names).toEqual(sortedNames);
    });

    it('should sort by name descending', async () => {
      const result = await drugService.getDrugs({
        page: 1,
        limit: 50,
        sortBy: 'name',
        sortOrder: 'desc',
      });

      const names = result.data.map(drug => drug.name);
      const sortedNames = [...names].sort().reverse();
      expect(names).toEqual(sortedNames);
    });

    it('should sort by launchDate', async () => {
      const result = await drugService.getDrugs({
        page: 1,
        limit: 50,
        sortBy: 'launchDate',
        sortOrder: 'desc',
      });

      const dates = result.data.map(drug => new Date(drug.launchDate));
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i - 1].getTime()).toBeGreaterThanOrEqual(
          dates[i].getTime()
        );
      }
    });

    it('should sort by company', async () => {
      const result = await drugService.getDrugs({
        page: 1,
        limit: 50,
        sortBy: 'company',
        sortOrder: 'asc',
      });

      const companies = result.data.map(drug => drug.company);
      const sortedCompanies = [...companies].sort();
      expect(companies).toEqual(sortedCompanies);
    });

    it('should combine search and pagination', async () => {
      const result = await drugService.getDrugs({
        search: 'Test',
        page: 1,
        limit: 2,
        sortBy: 'launchDate',
        sortOrder: 'desc',
      });

      expect(result.data.length).toBeLessThanOrEqual(2);
      result.data.forEach(drug => {
        const searchableText =
          `${drug.name} ${drug.company} ${drug.code}`.toLowerCase();
        expect(searchableText).toContain('test');
      });
    });

    it('should handle case-insensitive search', async () => {
      const result = await drugService.getDrugs({
        search: 'ALPHA',
        page: 1,
        limit: 50,
        sortBy: 'launchDate',
        sortOrder: 'desc',
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toContain('Alpha');
    });

    it('should return empty results for non-existent search', async () => {
      const result = await drugService.getDrugs({
        search: 'NonExistentDrug',
        page: 1,
        limit: 50,
        sortBy: 'launchDate',
        sortOrder: 'desc',
      });

      expect(result.data).toHaveLength(0);
      expect(result.pagination.totalItems).toBe(0);
    });

    it('should handle limit parameter capping internally', async () => {
      // This tests the internal service logic, not the validation
      const result = await drugService.getDrugs({
        page: 1,
        limit: 150, // Service should cap this internally
        sortBy: 'launchDate',
        sortOrder: 'desc',
      });

      expect(result.pagination.itemsPerPage).toBe(100);
    });
  });

  describe('getCompanies', () => {
    it('should return unique companies', async () => {
      const companies = await drugService.getCompanies();

      expect(companies).toEqual(
        expect.arrayContaining([
          'Test Pharma Inc',
          'Mock Labs Ltd',
          'Sample Corp',
        ])
      );
      expect(companies).toHaveLength(3);

      // Check uniqueness
      const uniqueCompanies = [...new Set(companies)];
      expect(companies).toEqual(uniqueCompanies);
    });

    it('should return sorted companies', async () => {
      const companies = await drugService.getCompanies();
      const sortedCompanies = [...companies].sort();
      expect(companies).toEqual(sortedCompanies);
    });

    it('should return empty array when no drugs exist', async () => {
      await clearTestDB();
      const companies = await drugService.getCompanies();
      expect(companies).toEqual([]);
    });
  });

  describe('getStatistics', () => {
    it('should return correct statistics', async () => {
      const stats = await drugService.getStatistics();

      expect(stats.totalDrugs).toBe(mockDrugs.length);
      expect(stats.totalCompanies).toBe(3);
      expect(stats.averageDrugsPerCompany).toBeCloseTo(mockDrugs.length / 3, 2);
      expect(stats).toHaveProperty('oldestDrug');
      expect(stats).toHaveProperty('newestDrug');
    });

    it('should return zero statistics when no drugs exist', async () => {
      await clearTestDB();
      const stats = await drugService.getStatistics();

      expect(stats.totalDrugs).toBe(0);
      expect(stats.totalCompanies).toBe(0);
      expect(stats.averageDrugsPerCompany).toBe(0);
      expect(stats.oldestDrug).toBeNull();
      expect(stats.newestDrug).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large page numbers', async () => {
      const result = await drugService.getDrugs({
        page: 999,
        limit: 10,
        sortBy: 'launchDate',
        sortOrder: 'desc',
      });

      expect(result.data).toHaveLength(0);
      expect(result.pagination.currentPage).toBe(999);
      expect(result.pagination.hasNextPage).toBe(false);
      expect(result.pagination.hasPreviousPage).toBe(true);
    });

    it('should handle zero page number', async () => {
      const result = await drugService.getDrugs({
        page: 0,
        limit: 10,
        sortBy: 'launchDate',
        sortOrder: 'desc',
      });

      // Should default to page 1
      expect(result.pagination.currentPage).toBe(1);
    });

    it('should handle negative page number', async () => {
      const result = await drugService.getDrugs({
        page: -1,
        limit: 10,
        sortBy: 'launchDate',
        sortOrder: 'desc',
      });

      // Should default to page 1
      expect(result.pagination.currentPage).toBe(1);
    });
  });
});
